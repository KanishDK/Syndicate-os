import { CONFIG } from '../../config/gameConfig.js';
import { formatNumber } from '../../utils/gameMath.js';

const generateContract = (state) => {
    // Generate based on Level
    const level = state.level || 1;
    const types = ['produce', 'sell', 'launder'];
    const type = types[Math.floor(Math.random() * types.length)];

    let req = {};
    let titleKey = '';
    let textKey = '';
    let titleData = {};
    let textData = {};
    let reward = { money: 0, xp: 0 };

    if (type === 'produce') {
        // Pick random producer unlocked
        const producers = Object.keys(CONFIG.production).filter(k => CONFIG.production[k].unlockLevel <= level);
        const itemKey = producers[Math.floor(Math.random() * producers.length)];
        const item = CONFIG.production[itemKey];

        const amount = 10 + Math.floor(Math.random() * 10 * level);
        req = { type: 'produce', item: itemKey, amount };
        titleKey = 'sultan.daily_contracts.produce.title';
        textKey = 'sultan.daily_contracts.produce.text';
        titleData = { item: item.name };
        textData = { amount, item: item.name };
        reward = { money: 0, xp: amount * 50 }; // XP only for produce? Or clean cash? Sultan usually pays cash.
    } else if (type === 'sell') {
        const amount = 50 + Math.floor(Math.random() * 50 * level);
        req = { type: 'sell', amount };
        titleKey = 'sultan.daily_contracts.sell.title';
        textKey = 'sultan.daily_contracts.sell.text';
        textData = { amount };
        reward = { money: amount * 10, xp: amount * 10 };
    } else if (type === 'launder') {
        const amount = 1000 + Math.floor(Math.random() * 1000 * level);
        req = { type: 'launder', amount };
        titleKey = 'sultan.daily_contracts.launder.title';
        textKey = 'sultan.daily_contracts.launder.text';
        textData = { amount };
        reward = { money: 0, xp: amount / 10 };
    }

    // Money Reward scales with level
    if (reward.money === 0) reward.money = 1000 * level;

    return {
        id: `contract_${Date.now()}`,
        titleKey,
        textKey,
        titleData,
        textData,
        req,
        reward,
        isDaily: true,
        expiry: Date.now() + 3600000 // 1 Hour limit
    };
};
import { playSound } from '../../utils/audio.js';
import { spawnParticles } from '../../utils/particleEmitter.js';

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
        // Store translation key instead of translated message
        state.logs = [{ msg: "sultan.daily_contracts.new_available", type: 'info', time: new Date().toLocaleTimeString(), isTranslationKey: true }, ...state.logs].slice(0, 50);
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

        // Log Event with translation key
        const rewardText = `${money > 0 ? formatNumber(money) + ' kr' : ''}${money > 0 && xp > 0 ? ' and ' : ''}${xp > 0 ? xp + ' XP' : ''}`;
        state.logs = [{
            msgKey: 'sultan.daily_contracts.completed',
            msgData: { title: activeMission.titleKey || activeMission.title, reward: rewardText },
            type: 'success',
            time: new Date().toLocaleTimeString(),
            isTranslationKey: true
        }, ...state.logs].slice(0, 50);

        if (activeMission.isDaily) {
            // Clear Contract
            state.contracts.active = null;
            state.contracts.lastCompleted = Date.now();
            state.dailyMission = null; // Clear UI alias

            // Notification for Daily with translation keys
            state.pendingEvent = {
                type: 'story',
                data: {
                    titleKey: 'sultan.daily_contracts.contract_completed',
                    msgKey: 'sultan.daily_contracts.sultan_pays',
                    msgData: { amount: formatNumber(money) },
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
                        titleKey: 'sultan.daily_contracts.endgame_title',
                        msgKey: 'sultan.daily_contracts.endgame_msg',
                        type: 'success',
                        isEndgame: true
                    }
                };
                state.hasSeenEndgameMsg = true;
            } else {
                // Standard Notification with translation keys
                const rewardStr = `${money > 0 ? formatNumber(money) + ' kr' : ''} ${xp > 0 ? xp + ' XP' : ''}`;
                state.pendingEvent = {
                    type: 'story',
                    data: {
                        titleKey: 'sultan.daily_contracts.completed',
                        msgKey: 'sultan.daily_contracts.sultan_pleased',
                        msgData: { reward: rewardStr },
                        type: 'success'
                    }
                };
            }
        }
    }

    return state;
};
