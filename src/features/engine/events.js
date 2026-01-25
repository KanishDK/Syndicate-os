import { CONFIG } from '../../config/gameConfig.js';
import { getPerkValue, getMasteryEffect } from '../../utils/gameMath.js';
import { playSound } from '../../utils/audio.js';

export const processEvents = (state, dt, t) => {
    // Heat Warning System (Visual feedback on current heat)
    if (!state.isOffline) {
        // REBALANCED: Warnings start later (60% heat) to reduce spam
        if (state.heat >= CONFIG.events.heatWarnings.critical && !state.heatWarning90) {
            state.logs = [{
                msg: t('events.critical_heat'),
                type: 'error',
                time: new Date().toLocaleTimeString()
            }, ...state.logs].slice(0, 50);
            state.heatWarning90 = true;
            playSound('alarm');
        } else if (state.heat < CONFIG.events.heatWarnings.critical - 5) {
            state.heatWarning90 = false;
        }

        if (state.heat >= CONFIG.events.heatWarnings.high && state.heat < CONFIG.events.heatWarnings.critical && !state.heatWarning70) {
            state.logs = [{
                msg: t('events.high_heat'),
                type: 'warning',
                time: new Date().toLocaleTimeString()
            }, ...state.logs].slice(0, 50);
            state.heatWarning70 = true;
        } else if (state.heat < CONFIG.events.heatWarnings.low) {
            state.heatWarning70 = false;
        }
    }

    if (state.boss.active && state.boss.hp < state.boss.maxHp) {
        state.boss.hp = Math.min(state.boss.maxHp, state.boss.hp + ((CONFIG.boss.regenRate || 0) * dt));
    }

    if (state.level >= 3 && state.rival.hostility < 100) state.rival.hostility += 0.05 * dt;

    // 1. RAIDS & RIVALS (Check BEFORE Decay to ensure consequences)
    // -----------------------------------------------------------
    // Safeguard: No Raids during Tutorial
    // Standardized check: Look for tutorialComplete flag OR step >= 4 (Legacy)
    if (!state.pendingEvent && !state.isOffline && (state.flags?.tutorialComplete || state.tutorialStep === undefined || state.tutorialStep >= 4)) {
        const randRaid = Math.random();

        // Scale probability by dt (Target: ~16 mins at Max Heat)
        // Scale probability by dt (Target: ~16 mins at Max Heat) -> REBALANCED (Less frequent)
        const raidChance = ((state.heat / CONFIG.gameMechanics.maxHeat) * 0.0005) * dt; // 50% reduced base chance

        if (state.heat > 40 && randRaid < raidChance) {
            // PERK: Raid Defense (Auto-win chance)
            const autoWinChance = getPerkValue(state, 'raid_defense') || 0;
            const autoWin = Math.random() < autoWinChance;

            const totalDefense = (state.defense.guards * CONFIG.defense.guards.defenseVal) + (state.defense.cameras * CONFIG.defense.cameras.defenseVal) + (state.defense.bunker * CONFIG.defense.bunker.defenseVal);
            const randAttack = Math.random() * 100;
            // DYNAMIC RAID STRENGTH: Base + (Level * 10)
            const levelBonus = (state.level || 1) * 15;
            let tier = state.heat > CONFIG.events.heatWarnings.critical ? 'high' : (state.heat > CONFIG.events.heatWarnings.high ? 'med' : 'low');
            const attackVal = randAttack + levelBonus + (tier === 'high' ? 50 : (tier === 'med' ? 20 : 0));

            if (autoWin || totalDefense > attackVal) {
                state.heat = Math.max(0, state.heat - (tier === 'high' ? 30 : 10)); // Heat drops on win
                state.pendingEvent = { type: 'raid', data: { type: 'police', result: 'win', title: tier === 'high' ? t('events.raid_won_title_high') : t('events.raid_won_title_low'), msg: autoWin ? t('events.raid_won_msg_auto') : t('events.raid_won_msg_def'), lost: {} } };
            } else {
                const lostDirty = Math.floor(state.dirtyCash * (tier === 'high' ? CONFIG.raid.penalties.high : (tier === 'med' ? CONFIG.raid.penalties.med : CONFIG.raid.penalties.low)));
                let targetItem = 'hash_moerk'; let maxP = 0;
                Object.keys(state.inv).forEach(i => {
                    if ((state.inv[i] > 0) && (state.prices[i] > maxP)) { maxP = state.prices[i]; targetItem = i; }
                });

                const lostProd = Math.floor((state.inv[targetItem] || 0) * (tier === 'high' ? 0.8 : (tier === 'med' ? 0.3 : 0)));
                state.dirtyCash -= lostDirty;
                state.inv[targetItem] = Math.max(0, (state.inv[targetItem] || 0) - lostProd);
                state.heat = tier === 'high' ? 20 : Math.max(0, state.heat - 10); // Heat drops on loss

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
        const rivalStrength = state.rival.strength || 100;
        const attackChance = ((state.rival.hostility - 50) / 2000) * (rivalStrength / 100) * dt;

        if (state.level >= 3 && state.rival.hostility > 50 && Math.random() < attackChance) {

            // 20% Chance of a Targeted Territory Siege
            if (state.territories.length > 0 && Math.random() < 0.2) {
                const targetTerritory = state.territories[Math.floor(Math.random() * state.territories.length)];

                if (!state.territoryAttacks?.[targetTerritory]) {
                    const siegeStrength = Math.floor(50 + (state.level * 10) + (rivalStrength * 0.5));

                    state.territoryAttacks = {
                        ...state.territoryAttacks,
                        [targetTerritory]: {
                            startTime: Date.now(),
                            strength: siegeStrength,
                            expiresAt: Date.now() + 60000
                        }
                    };
                    state.logs = [{ msg: t('events.territory_attack_msg', { id: targetTerritory }), type: 'error', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
                    playSound('alarm');
                }
            }
            // 80% Drive-by
            else {
                const def = (state.defense.guards || 0) * CONFIG.defense.guards.defenseVal;
                const rivalNames = ['Lille A', 'Baronen', 'Onkel J', 'Slagteren fra Valby'];
                const rivalName = rivalNames[Math.floor(Math.random() * rivalNames.length)];

                if (def > (20 + (state.level * 5))) {
                    state.rival.hostility = Math.max(0, state.rival.hostility - 20);
                    state.logs = [{ msg: `[RIVAL] ${rivalName} prøvede at ramme dig, men dine vagter skræmte dem væk!`, type: 'success', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
                } else {
                    const lCash = Math.floor(state.dirtyCash * 0.1);
                    state.dirtyCash -= lCash;
                    state.pendingEvent = { type: 'story', data: { title: `${rivalName}: Drive-by!`, msg: t('events.drive_by_msg', { cash: lCash.toLocaleString() }), type: 'rival' } };
                    state.rival.hostility = Math.max(0, state.rival.hostility - 10);
                }
            }
        }

        // --- TERRITORY REGRESSION (JUICE/REACTIVE) ---
        if (state.heat > 80 && state.territories.length > 0 && Math.random() < 0.02 * dt) {
            const targetT = state.territories[Math.floor(Math.random() * state.territories.length)];
            const lvl = state.territoryLevels[targetT] || 1;
            if (lvl > 1) {
                state.territoryLevels[targetT] = lvl - 1;
                state.logs = [{ msg: `[OMRÅDE] På grund af det høje Heat er kontrollen over ${targetT} faldet!`, type: 'error', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
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

    // 2. HEAT DECAY (Run AFTER Checks)
    // --------------------------------
    if (state.heat > 0) {
        const baseDecay = (CONFIG.heat.decay || 0.1) * dt;
        const lawyerBonus = (state.staff.lawyer || 0) * 0.15 * dt;
        const ghostOpsBonus = getMasteryEffect(state, 'heat_decay') * dt;

        state.heat = Math.max(0, state.heat - (baseDecay + lawyerBonus + ghostOpsBonus));
    }

    // 4. NEWS (Forecasting / Sultan-Intel)
    if (!state.nextNewsEvent) {
        state.nextNewsEvent = CONFIG.news[Math.floor(Math.random() * CONFIG.news.length)];
    }

    if (!state.isOffline && Math.random() < 0.02 * dt) {
        const n = state.nextNewsEvent;
        state.logs = [{ msg: `[NEWS] ${t(n.msg)}`, type: n.type, time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
        state.nextNewsEvent = CONFIG.news[Math.floor(Math.random() * CONFIG.news.length)];
    }

    // 5. BOSS SPAWN CHECK
    const triggerInterval = CONFIG.boss.triggerLevel || 5;
    // COOLDOWN CHECK (Fix for Escape Loop)
    const now = Date.now();
    const lastSpawnTime = state.boss.lastSpawn || 0;
    const cooldownOver = (now - lastSpawnTime) > 600000; // 10 Minutes (600,000ms)

    if (!state.boss.active && !state.pendingEvent && state.level >= triggerInterval && state.level % triggerInterval === 0 && cooldownOver) {
        const lastDefeated = state.boss.lastDefeatedLevel || 0;

        if (state.level > lastDefeated) {
            // BOSS HP SCALING: Cubic (Audit Phase 3 Fix)
            // Linear damage synergy requires cubic HP to stay challenging but beatable.
            const bossLevelIndex = (state.level / (CONFIG.boss.triggerLevel || 10)) - 1;
            const bossMaxHp = Math.floor(500 * Math.pow(1 + bossLevelIndex, 3));

            const bossAttackDamage = 5 + (state.level * 2);
            const playerMaxHp = 100 + (state.level * 10);

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
        state.cleanCash += (50 * passiveIncomeLevel) * dt;
    }

    // LUXURY: Ghost Protocol (Temporary Heat Immunity)
    if (state.luxuryItems?.includes('ghostmode') && state.activeBuffs?.ghostMode && Date.now() < state.activeBuffs.ghostMode) {
        state.heat = 0;
    }

    // LUXURY: Private Island (Untouchable status)
    if (state.luxuryItems?.includes('island')) {
        state.heat = Math.min(20, state.heat);
    }

    return state;
};
