import { CONFIG } from '../../config/gameConfig';
import { formatNumber, getPerkValue } from '../../utils/gameMath';

export const processEvents = (state, dt = 1) => {
    // 1. HEAT DECAY & REGEN
    if (state.heat > 0) {
        const baseDecay = (CONFIG.heat.decay || 0.1) * dt;
        const lawyerBonus = (state.staff.lawyer || 0) * 0.15 * dt;
        state.heat = Math.max(0, state.heat - (baseDecay + lawyerBonus));
    }

    if (state.boss.active && state.boss.hp < state.boss.maxHp) {
        state.boss.hp = Math.min(state.boss.maxHp, state.boss.hp + ((CONFIG.boss.regenRate || 0) * dt));
    }

    if (state.level >= 3 && state.rival.hostility < 100) state.rival.hostility += 0.05 * dt;

    // 2. RAIDS & RIVALS
    if (!state.pendingEvent) {
        const randRaid = Math.random();

        // Scale probability by dt (Assuming base chance was meant for ~1s interval)
        const raidChance = (state.heat / 10000) * dt;

        if (state.heat > 40 && randRaid < raidChance) {
            // PERK: Raid Defense (Auto-win chance)
            const autoWinChance = getPerkValue(state, 'raid_defense') || 0; // e.g. 0.1
            const autoWin = Math.random() < autoWinChance;

            const totalDefense = (state.defense.guards * CONFIG.defense.guards.defenseVal) + (state.defense.cameras * CONFIG.defense.cameras.defenseVal) + (state.defense.bunker * CONFIG.defense.bunker.defenseVal);
            const randAttack = Math.random() * 100;
            let tier = state.heat > 90 ? 'high' : (state.heat > 70 ? 'med' : 'low');
            const attackVal = randAttack + (tier === 'high' ? 50 : (tier === 'med' ? 20 : 0));

            if (autoWin || totalDefense > attackVal) {
                state.heat = Math.max(0, state.heat - (tier === 'high' ? 30 : 10));
                state.pendingEvent = { type: 'raid', data: { type: 'police', result: 'win', title: tier === 'high' ? 'SWAT RAID AFVIST' : 'POLITI KONTROL AFVIST', msg: autoWin ? 'Din Sikkerhedschef fik stoppet razziaen før den startede.' : 'Dine sikkerhedsforanstaltninger holdt dem ude!', lost: {} } };
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

                if (state.hardcore) {
                    state.pendingEvent = {
                        type: 'raid',
                        data: {
                            type: 'police',
                            result: 'loss',
                            title: 'HARDCORE GAME OVER',
                            msg: `Du blev fanget under en Razzia! Dit imperium falder her.\nBeslaglagt: ${lostDirty.toLocaleString()} kr og ${lostProd}x ${targetItem}.`,
                            lost: { cash: lostDirty, product: lostProd },
                            hardcoreWipe: true
                        }
                    };
                } else {
                    state.pendingEvent = { type: 'raid', data: { type: 'police', result: 'loss', title: tier === 'high' ? 'SWAT RAID!' : 'RAZZIA', msg: `Beslaglagt: ${lostDirty.toLocaleString()} kr og ${lostProd}x ${targetItem}.`, lost: { cash: lostDirty, product: lostProd } } };
                }
            }
        }
        // Rival Drive-by
        const attackChance = ((state.rival.hostility - 50) / 2000) * dt;
        if (state.level >= 3 && state.rival.hostility > 50 && Math.random() < attackChance) {
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

    // Level Up
    const reqXP = Math.floor(1000 * Math.pow(1.5, state.level));
    if (state.xp >= reqXP && state.level < CONFIG.levelTitles.length) {
        state.level++;
        state.xp -= reqXP;
        state.pendingEvent = { type: 'story', data: { title: `LEVEL UP: ${CONFIG.levelTitles[state.level - 1]}`, msg: `Du er steget i graderne!`, type: 'success' } };
    }

    // 4. NEWS
    if (Math.random() < 0.02 * dt) {
        const n = CONFIG.news[Math.floor(Math.random() * CONFIG.news.length)];
        state.logs = [{ msg: `[NEWS] ${n.msg}`, type: n.type, time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
    }

    return state;
};
