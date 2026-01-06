import { CONFIG } from '../../config/gameConfig';
import { formatNumber } from '../../utils/gameMath';

const generateContract = (state) => {
    // Generate based on Level
    const level = state.level || 1;
    const types = ['produce', 'sell', 'launder'];
    const type = types[Math.floor(Math.random() * types.length)];

    let req = {};
    let title = '';
    let text = '';
    let reward = { money: 0, xp: 0 };

    if (type === 'produce') {
        // Pick random producer unlocked
        const producers = Object.keys(CONFIG.production).filter(k => CONFIG.production[k].unlockLevel <= level);
        const itemKey = producers[Math.floor(Math.random() * producers.length)];
        const item = CONFIG.production[itemKey];

        const amount = 10 + Math.floor(Math.random() * 10 * level);
        req = { type: 'produce', item: itemKey, amount };
        title = `Levering: ${item.name}`;
        text = `En kunde mangler ${amount}x ${item.name}. Få produktionen i gang.`;
        reward = { money: 0, xp: amount * 50 }; // XP only for produce? Or clean cash? Sultan usually pays cash.
    } else if (type === 'sell') {
        const amount = 50 + Math.floor(Math.random() * 50 * level);
        req = { type: 'sell', amount };
        title = 'Gade Salg';
        text = `Vi skal af med varerne. Sælg ${amount} enheder totalt.`;
        reward = { money: amount * 10, xp: amount * 10 };
    } else if (type === 'launder') {
        const amount = 1000 + Math.floor(Math.random() * 1000 * level);
        req = { type: 'launder', amount };
        title = 'Hvidvask';
        text = `Sorte penge lugter. Vask ${amount} kr.`;
        reward = { money: 0, xp: amount / 10 };
    }

    // Money Reward scales with level
    if (reward.money === 0) reward.money = 1000 * level;

    return {
        id: `contract_${Date.now()}`,
        title,
        text,
        req,
        reward,
        isDaily: true,
        expiry: Date.now() + 3600000 // 1 Hour limit? Or just no limit but replaces? Let's say nconst ACTIVE_HOURS = 24; 
    };
};
import { playSound } from '../../utils/audio';
import { spawnParticles } from '../../utils/particleEmitter';

export const processMissions = (state) => {
    // 1. Get Story Mission
    let activeStory = CONFIG.missions.find(m => !state.completedMissions.includes(m.id));

    // Check if mission is locked by rank requirement
    if (activeStory && activeStory.reqLevel && state.level < activeStory.reqLevel) {
        activeStory = null; // Mission locked - don't show it yet
    }

    state.activeStory = activeStory;

    // 2. Handle Daily Contracts (Always running in background)
    if (!state.contracts) state.contracts = { active: null, lastCompleted: 0 };

    if (!state.contracts.active && Date.now() - (state.contracts.lastCompleted || 0) > 60000) {
        state.contracts.active = generateContract(state);
        state.logs = [{ msg: "Ny Kontrakt Tilgængelig hos Sultanen!", type: 'info', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
    }
    state.dailyMission = state.contracts.active;

    // 3. Process Story Mission
    if (activeStory) {
        state = checkMission(state, activeStory);
    }

    // 4. Process Daily Contract
    if (state.contracts.active) {
        state = checkMission(state, state.contracts.active);
    }

    return state;
};

// Helper: Extracted requirement checking logic
const checkMission = (state, activeMission) => {
    let completed = false;
    const req = activeMission.req;
    const { type, item, role, id } = req;
    const amount = Math.max(1, req.amount || 0);

    if (activeMission.isDaily && !activeMission.startStats) {
        activeMission.startStats = {
            produced: { ...state.stats.produced },
            sold: state.stats.sold,
            laundered: state.stats.laundered
        };
    }

    // A. Produce Items
    if (type === 'produce') {
        const currentTotal = state.stats.produced[item] || 0;
        const startVal = activeMission.isDaily ? (activeMission.startStats?.produced?.[item] || 0) : 0;
        if ((currentTotal - startVal) >= amount) completed = true;
    }

    // B. Sell Items
    else if (type === 'sell') {
        const currentTotal = state.stats.sold;
        const startVal = activeMission.isDaily ? (activeMission.startStats?.sold || 0) : 0;
        if ((currentTotal - startVal) >= amount) completed = true;
    }

    // C. Launder Money
    else if (type === 'launder') {
        const currentTotal = state.stats.laundered;
        const startVal = activeMission.isDaily ? (activeMission.startStats?.laundered || 0) : 0;
        if ((currentTotal - startVal) >= amount) completed = true;
    }

    // D. Hire Staff
    else if (type === 'hire') {
        if ((state.staff[role] || 0) >= amount) completed = true;
    }

    // E. Upgrades
    else if (type === 'upgrade') {
        if ((state.upgrades[id] || 0) >= 1) completed = true;
    }

    // G. Defense
    else if (type === 'defense') {
        if ((state.defense?.[id] || 0) >= amount) completed = true;
    }

    // F. Conquer Territories
    else if (type === 'conquer') {
        if (state.territories.length >= amount) completed = true;
    }

    // ... (inside checkMission) ...
    // 3. Handle Completion
    if (completed) {
        playSound('success');
        if (typeof window !== 'undefined') {
            spawnParticles(window.innerWidth / 2, window.innerHeight / 2, 'gold', 30);
        }
        // Payout
        const { money, xp } = activeMission.reward || { money: 0, xp: 0 };
        if (money > 0) state.cleanCash += money;
        if (xp > 0) state.xp += xp;

        // Log Event
        state.logs = [{
            msg: `OPGAVE UDFØRT: ${activeMission.title} - Du modtog ${money > 0 ? formatNumber(money) + ' kr' : ''}${money > 0 && xp > 0 ? ' og ' : ''}${xp > 0 ? xp + ' XP' : ''}.`,
            type: 'success',
            time: new Date().toLocaleTimeString()
        }, ...state.logs].slice(0, 50);

        if (activeMission.isDaily) {
            // Clear Contract
            state.contracts.active = null;
            state.contracts.lastCompleted = Date.now();
            state.dailyMission = null; // Clear UI alias

            // Notification for Daily
            state.pendingEvent = {
                type: 'story',
                data: {
                    title: 'KONTRAKT UDFØRT',
                    msg: `Sultanen betaler: ${formatNumber(money)} kr.`,
                    type: 'success'
                }
            };
        } else {
            // Mark Main Story Completed
            state.completedMissions = [...state.completedMissions, activeMission.id];

            // Trigger Event (Notification)
            // SPECIAL ENDGAME TRIGGER (M20)
            if (activeMission.id === 'm20') {
                state.pendingEvent = {
                    type: 'story',
                    data: {
                        title: 'LEGENDEN',
                        msg: `Du er Kongen af København.\n\nDu har vundet spillet.\n\nDu kan fortsætte med at opbygge din formue, eller STARTE FORFRA (Prestige) for at få permanente bonusser under 'Imperiet'.`,
                        type: 'success',
                        isEndgame: true
                    }
                };
                state.hasSeenEndgameMsg = true;
            } else {
                // Standard Notification
                state.pendingEvent = {
                    type: 'story',
                    data: {
                        title: 'OPGAVE UDFØRT',
                        msg: `Sultanen er tilfreds.\n\nDu modtog: ${money > 0 ? formatNumber(money) + ' kr' : ''} ${xp > 0 ? xp + ' XP' : ''}`,
                        type: 'success'
                    }
                };
            }
        }
    }

    return state;
};
