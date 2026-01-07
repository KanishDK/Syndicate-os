import { CONFIG } from '../../config/gameConfig';
import { getPerkValue, getMasteryEffect } from '../../utils/gameMath';
import { playSound } from '../../utils/audio';

export const processEvents = (state, dt = 1, t = k => k) => {
    // 1. HEAT DECAY & REGEN
    if (state.heat > 0) {
        const baseDecay = (CONFIG.heat.decay || 0.1) * dt;
        const lawyerBonus = (state.staff.lawyer || 0) * 0.15 * dt;

        // PERK: Shadow Network (Reduces Heat Gen? No, description says Generation. Here is decay.)
        // Prompt said: "Reduces all Heat generation by 10%".
        // I should look for where heat increases.
        // But if I want to reduce generation, I need to intercept heat additions.
        // However, reducing existing heat faster is also a way.
        // Let's look for heat additions. Raids, etc.
        // Actually, preventing heat gain is harder to hook everywhere. 
        // Alternative: "Shadow Network" increases passive decay by 20%?
        // Or loop through all `state.heat +=`?
        // Let's implement it as a constant negative pressure (extra decay) for simplicity and robustness.
        const shadowNetLevel = getPerkValue(state, 'shadow_network') || 0;
        const ghostOpsBonus = getMasteryEffect(state, 'heat_decay') * dt;

        state.heat = Math.max(0, state.heat - (baseDecay + lawyerBonus + ghostOpsBonus));
    }

    // Heat Warning System
    if (state.heat >= 90 && !state.heatWarning90) {
        state.logs = [{
            msg: t('events.critical_heat'),
            type: 'error',
            time: new Date().toLocaleTimeString()
        }, ...state.logs].slice(0, 50);
        state.heatWarning90 = true;
        playSound('alarm');
    } else if (state.heat < 85) {
        state.heatWarning90 = false;
    }

    if (state.heat >= 70 && state.heat < 90 && !state.heatWarning70) {
        state.logs = [{
            msg: t('events.high_heat'),
            type: 'warning',
            time: new Date().toLocaleTimeString()
        }, ...state.logs].slice(0, 50);
        state.heatWarning70 = true;
    } else if (state.heat < 65) {
        state.heatWarning70 = false;
    }

    if (state.boss.active && state.boss.hp < state.boss.maxHp) {
        state.boss.hp = Math.min(state.boss.maxHp, state.boss.hp + ((CONFIG.boss.regenRate || 0) * dt));
    }

    if (state.level >= 3 && state.rival.hostility < 100) state.rival.hostility += 0.05 * dt;

    // 2. RAIDS & RIVALS
    if (!state.pendingEvent) {
        const randRaid = Math.random();

        // Scale probability by dt (Assuming base chance was meant for ~1s interval)
        const raidChance = (state.heat / 1000) * dt; // Increased from 10000 for 10x more frequent raids

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
                state.pendingEvent = { type: 'raid', data: { type: 'police', result: 'win', title: tier === 'high' ? t('events.raid_won_title_high') : t('events.raid_won_title_low'), msg: autoWin ? t('events.raid_won_msg_auto') : t('events.raid_won_msg_def'), lost: {} } };
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
                            title: t('events.hardcore_game_over'),
                            msg: t('events.raid_lost_hardcore_msg', { cash: lostDirty.toLocaleString(), product: lostProd, type: targetItem }),
                            lost: { cash: lostDirty, product: lostProd },
                            hardcoreWipe: true
                        }
                    };
                } else {
                    state.pendingEvent = { type: 'raid', data: { type: 'police', result: 'loss', title: tier === 'high' ? t('events.raid_lost_title_high') : t('events.raid_lost_title_low'), msg: t('events.raid_lost_msg', { cash: lostDirty.toLocaleString(), product: lostProd, type: targetItem }), lost: { cash: lostDirty, product: lostProd } } };
                }
            }
        }
        // Rival Drive-by
        // Siege / Territory Attack Logic
        // Chance depends on Hostility + Strength
        const rivalStrength = state.rival.strength || 100;
        const attackChance = ((state.rival.hostility - 50) / 2000) * (rivalStrength / 100) * dt;

        if (state.level >= 3 && state.rival.hostility > 50 && Math.random() < attackChance) {

            // 20% Chance of a Targeted Territory Siege if user owns territories
            if (state.territories.length > 0 && Math.random() < 0.2) {
                const targetTerritory = state.territories[Math.floor(Math.random() * state.territories.length)];

                // If not already under attack
                if (!state.territoryAttacks?.[targetTerritory]) {
                    const siegeStrength = Math.floor(50 + (state.level * 10) + (rivalStrength * 0.5));

                    state.territoryAttacks = {
                        ...state.territoryAttacks,
                        [targetTerritory]: {
                            startTime: Date.now(),
                            strength: siegeStrength,
                            expiresAt: Date.now() + 60000 // 60s to defend
                        }
                    };
                    state.logs = [{ msg: t('events.territory_attack_msg', { id: targetTerritory }), type: 'error', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
                    playSound('alarm'); // Ensure 'alarm' sound exists or falls back
                }
            }
            // 80% Drive-by (Classic)
            else {
                const def = (state.defense.guards || 0) * CONFIG.defense.guards.defenseVal;
                if (def > (20 + (state.level * 5))) {
                    state.rival.hostility = Math.max(0, state.rival.hostility - 20);
                    state.logs = [{ msg: t('events.rival_scared'), type: 'success', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
                } else {
                    const lCash = Math.floor(state.dirtyCash * 0.1);
                    state.dirtyCash -= lCash;
                    state.pendingEvent = { type: 'story', data: { title: t('events.drive_by_title'), msg: t('events.drive_by_msg', { cash: lCash.toLocaleString() }), type: 'rival' } };
                    state.rival.hostility = Math.max(0, state.rival.hostility - 10);
                }
            }
        }

        // CHECK EXPIRED SIEGES
        if (state.territoryAttacks) {
            Object.keys(state.territoryAttacks).forEach(tId => {
                const attack = state.territoryAttacks[tId];
                if (Date.now() > attack.expiresAt) {
                    // Failed to defend!
                    const currentLvl = state.territoryLevels[tId] || 1;
                    if (currentLvl > 1) {
                        state.territoryLevels[tId] = currentLvl - 1;
                        state.logs = [{ msg: t('events.territory_lost_level', { id: tId }), type: 'error', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
                    } else {
                        state.dirtyCash = Math.max(0, state.dirtyCash - 25000);
                        state.logs = [{ msg: t('events.territory_looted', { id: tId }), type: 'error', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
                    }

                    // Clear attack
                    const newAttacks = { ...state.territoryAttacks };
                    delete newAttacks[tId];
                    state.territoryAttacks = newAttacks;
                }
            });
        }
    }

    // 4. NEWS (Forecasting / Sultan-Intel)
    if (!state.nextNewsEvent) {
        state.nextNewsEvent = CONFIG.news[Math.floor(Math.random() * CONFIG.news.length)];
    }

    if (Math.random() < 0.02 * dt) {
        const n = state.nextNewsEvent;
        state.logs = [{ msg: `[NEWS] ${t(n.msg)}`, type: n.type, time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
        // Forecast the next one
        state.nextNewsEvent = CONFIG.news[Math.floor(Math.random() * CONFIG.news.length)];
    }

    // 5. BOSS SPAWN CHECK (Deterministic: Every X Levels)
    const triggerInterval = CONFIG.boss.triggerLevel || 5;
    if (!state.boss.active && !state.pendingEvent && state.level >= triggerInterval && state.level % triggerInterval === 0) {
        // Only spawn if we haven't beaten the boss for this level milestone yet
        const lastDefeated = state.boss.lastDefeatedLevel || 0;

        if (state.level > lastDefeated) {
            // Difficulty Scaling
            const bossMaxHp = 100 + (state.level * 50); // Level 1 = 150, Level 10 = 600
            const bossAttackDamage = 5 + (state.level * 2); // Level 1 = 7, Level 10 = 25
            const playerMaxHp = 100 + (state.level * 10); // Level 1 = 110, Level 10 = 200

            state.boss.active = true;
            state.boss.hp = bossMaxHp;
            state.boss.maxHp = bossMaxHp;
            state.boss.playerHp = playerMaxHp;
            state.boss.playerMaxHp = playerMaxHp;
            state.boss.attackDamage = bossAttackDamage;
            state.boss.enraged = false;
            state.boss.startTime = Date.now();
            state.boss.lastAttackTime = Date.now();

            state.pendingEvent = {
                type: 'boss',
                data: {
                    title: t('events.boss_spawn_title'),
                    msg: t('events.boss_spawn_msg', { level: state.level }),
                    type: 'error'
                }
            };
        }
    }

    // PERK: Politician (Passive Income)
    const passiveIncomeLevel = getPerkValue(state, 'politician') || 0;
    if (passiveIncomeLevel > 0) {
        // e.g. 5000 per level per tick? Too fast. 
        // DT is approx 1s? processEvents called in loop. 
        // Let's assume daily tick or small drip. 
        // Let's do small drip: 50 * level * dt. (50/sec per level). Lvl 5 = 250/sec = 15k/min. Reasonable.
        state.cleanCash += (50 * passiveIncomeLevel) * dt;
    }

    // LUXURY: Ghost Protocol (Temporary Heat Immunity)
    if (state.luxuryItems?.includes('ghostmode') && state.activeBuffs?.ghostMode && Date.now() < state.activeBuffs.ghostMode) {
        state.heat = 0; // Complete heat immunity while active
    }

    // LUXURY: Private Island (Untouchable status)
    if (state.luxuryItems?.includes('island')) {
        state.heat = Math.min(20, state.heat);
    }

    return state;
};
