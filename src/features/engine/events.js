import { CONFIG } from '../../config/gameConfig';
import { formatNumber } from '../../utils/gameMath';

export const processEvents = (state) => {
    // 1. DECAY
    if (state.heat > 0) {
        // Lawyer Bonus
        const reduction = CONFIG.heat.coolRate + ((state.staff.lawyer || 0) * 0.15);
        state.heat = Math.max(0, state.heat - reduction);
    }

    if (state.boss.active && state.boss.hp < state.boss.maxHp) {
        state.boss.hp = Math.min(state.boss.maxHp, state.boss.hp + (CONFIG.boss.regenRate || 0));
    }

    if (state.level >= 3 && state.rival.hostility < 100) state.rival.hostility += 0.05;

    // 2. RAIDS & RIVALS
    if (!state.pendingEvent) {
        const randRaid = Math.random();
        const randAttack = Math.random() * 100;

        if (state.heat > 40 && randRaid < (state.heat / 10000)) {
            const totalDefense = (state.defense.guards * CONFIG.defense.guards.defenseVal) + (state.defense.cameras * CONFIG.defense.cameras.defenseVal) + (state.defense.bunker * CONFIG.defense.bunker.defenseVal);
            let tier = state.heat > 90 ? 'high' : (state.heat > 70 ? 'med' : 'low');
            const attackVal = randAttack + (tier === 'high' ? 50 : (tier === 'med' ? 20 : 0));

            if (totalDefense > attackVal) {
                state.heat = Math.max(0, state.heat - (tier === 'high' ? 30 : 10));
                state.pendingEvent = { type: 'raid', data: { type: 'police', result: 'win', title: tier === 'high' ? 'SWAT RAID AFVIST' : 'POLITI KONTROL AFVIST', msg: 'Dine sikkerhedsforanstaltninger holdt dem ude!', lost: {} } };
            } else {
                const lostDirty = Math.floor(state.dirtyCash * (tier === 'high' ? 0.6 : (tier === 'med' ? 0.25 : 0.1)));
                let targetItem = 'hash_moerk'; let maxP = 0;
                Object.keys(state.inv).forEach(i => {
                    if ((state.inv[i] > 0) && (state.prices[i] > maxP)) { maxP = state.prices[i]; targetItem = i; }
                });

                const lostProd = Math.floor((state.inv[targetItem] || 0) * (tier === 'high' ? 0.8 : (tier === 'med' ? 0.3 : 0)));
                state.dirtyCash -= lostDirty;
                state.inv[targetItem] = Math.max(0, (state.inv[targetItem] || 0) - lostProd);
                state.heat = tier === 'high' ? 20 : Math.max(0, state.heat - 10);

                state.pendingEvent = { type: 'raid', data: { type: 'police', result: 'loss', title: tier === 'high' ? 'SWAT RAID!' : 'RAZZIA', msg: `Beslaglagt: ${lostDirty.toLocaleString()} kr og ${lostProd}x ${targetItem}.`, lost: { cash: lostDirty, product: lostProd } } };
            }
        }
        // Rival Drive-by
        else if (state.level >= 3 && state.rival.hostility > 50 && Math.random() < ((state.rival.hostility - 50) / 2000)) {
            const def = (state.defense.guards || 0) * CONFIG.defense.guards.defenseVal;
            if (def > (20 + (state.level * 5))) {
                state.rival.hostility = Math.max(0, state.rival.hostility - 20);
                state.logs = [{ msg: "Rivaler skræmt væk af dine vagter.", type: 'success', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
            } else {
                const lCash = Math.floor(state.dirtyCash * 0.1);
                state.dirtyCash -= lCash;
                state.pendingEvent = { type: 'story', data: { title: 'DRIVE-BY!', msg: `Rivaler skød løs. Du mistede ${lCash.toLocaleString()} kr.`, type: 'rival' } };
                state.rival.hostility = Math.max(0, state.rival.hostility - 10);
            }
        }
    }

    // 3. MISSIONS & LEVEL
    const nextMission = CONFIG.missions.find(m => !state.completedMissions.includes(m.id));
    if (nextMission) {
        const m = nextMission;
        let ok = false; const r = m.req;

        if (r.type === 'produce') ok = state.stats.produced[r.item] >= r.amount;
        else if (r.type === 'sell') ok = state.stats.sold >= r.amount;
        else if (r.type === 'hire') ok = state.staff[r.role] >= r.amount;
        else if (r.type === 'upgrade') ok = state.upgrades[r.id] >= 1;
        else if (r.type === 'conquer') ok = state.territories.length >= r.amount;

        if (ok) {
            state.completedMissions = [...state.completedMissions, m.id];
            state.xp += m.reward.xp;
            state.cleanCash += m.reward.money;
            state.logs = [{ msg: `MISSION: ${m.title} (+${m.reward.money} kr.)`, type: 'success', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
        }
    }

    // Daily Mission
    if (state.completedMissions.length >= CONFIG.missions.length) {
        if (!state.dailyMission) {
            const items = Object.keys(CONFIG.production);
            const randomItem = items[Math.floor(Math.random() * items.length)];
            const targetAmount = Math.floor(100 * Math.pow(1.2, state.level));
            const rewardMoney = Math.floor(CONFIG.production[randomItem].baseRevenue * targetAmount * 1.5);

            state.dailyMission = {
                id: `daily_${Date.now()}`,
                title: `Skaf ${formatNumber(targetAmount)}x ${CONFIG.production[randomItem].name}`,
                req: { type: 'produce', item: randomItem, amount: targetAmount },
                reward: { xp: 1000, money: rewardMoney },
                progress: 0,
                target: targetAmount
            };
        }

        if (state.dailyMission) {
            const currentStock = state.inv[state.dailyMission.req.item];
            if (currentStock >= state.dailyMission.target) {
                state.cleanCash += state.dailyMission.reward.money;
                state.xp += state.dailyMission.reward.xp;
                state.logs = [{ msg: `DAGLIGT FIX: ${state.dailyMission.title} klaret!`, type: 'success', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
                state.dailyMission = null;
            }
        }
    }

    // Level Up
    const reqXP = Math.floor(1000 * Math.pow(1.5, state.level));
    if (state.xp >= reqXP && state.level < CONFIG.levelTitles.length) {
        state.level++;
        state.xp -= reqXP;
        state.pendingEvent = { type: 'story', data: { title: `LEVEL UP: ${CONFIG.levelTitles[state.level - 1]}`, msg: `Du er steget i graderne!`, type: 'success' } };
    }

    // 4. NEWS
    if (Math.random() < 0.02) {
        const n = CONFIG.news[Math.floor(Math.random() * CONFIG.news.length)];
        state.logs = [{ msg: `[NEWS] ${n.msg}`, type: n.type, time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
    }

    return state;
};
