import { useCallback } from 'react';
import { CONFIG } from '../config/gameConfig';
import { playSound } from '../utils/audio';
import { calculateCombatResult } from '../features/engine/combat.js';
import { getHeatMultiplier, formatNumber } from '../utils/gameMath';

export const useCombatActions = (gameState, setGameState, addLog, triggerShake) => {

    const attackBoss = useCallback((onDamage) => {
        setGameState(prev => {
            if (!prev.boss.active) return prev;

            // Use extracted Logic
            const result = calculateCombatResult(prev);

            // Side Effects
            if (triggerShake) triggerShake();
            if (result.sound) playSound(result.sound);
            if (onDamage && result.ui) onDamage(result.ui.damage, result.ui.isCrit);

            return result.newState;
        });
    }, [setGameState, triggerShake]);

    const sabotageRival = useCallback(() => {
        setGameState(prev => {
            const cost = CONFIG.rivals.sabotageCost;
            if (prev.cleanCash < cost) return prev;

            // Sabotage reduces Strength (Attack Severity) AND Hostility
            const newStrength = Math.max(0, (prev.rival?.strength || 100) - 10);
            const newHostility = Math.max(0, (prev.rival?.hostility || 0) - 25);

            return {
                ...prev,
                cleanCash: prev.cleanCash - cost,
                rival: { ...prev.rival, hostility: newHostility, strength: newStrength },
                logs: [{ msg: `SABOTAGE SUCCESS! Rivalens styrke reduceret til ${newStrength}%`, type: 'success', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
            };
        });
        playSound('click');
    }, [setGameState]);

    const raidRival = useCallback(() => {
        setGameState(prev => {
            // Cooldown Check (30 seconds)
            const now = Date.now();
            const lastRaid = prev.rival.lastRaidTime || 0;
            const cooldownRemaining = Math.max(0, 30000 - (now - lastRaid));

            if (cooldownRemaining > 0) {
                addLog(`Vent ${Math.ceil(cooldownRemaining / 1000)}s før næste raid!`, 'error');
                playSound('error');
                return prev;
            }

            if (prev.heat > 80) {
                addLog("For varmt til at angribe! Vent til Heat falder.", 'error');
                return prev;
            }

            const successChance = CONFIG.rivals.raidChance || 0.6;
            if (Math.random() < successChance) {
                const loot = 15000 + Math.floor(Math.random() * 35000);
                playSound('cash');
                if (triggerShake) triggerShake();

                // BUG-13 fix: Successful raid can expose and remove a mole who was feeding intel to the rival
                const moleCleared = prev.informantActive;
                const moleLogs = moleCleared
                    ? [{ msg: `MOLE NEUTRALISERET: Du fandt rivalens kontakt under razziaen!`, type: 'success', time: new Date().toLocaleTimeString() }]
                    : [];

                return {
                    ...prev,
                    dirtyCash: prev.dirtyCash + loot,
                    heat: prev.heat + 15,
                    informantActive: false, // Raid success can expose the mole
                    rival: { ...prev.rival, hostility: (prev.rival?.hostility || 0) + 10, lastRaidTime: now },
                    logs: [...moleLogs, { msg: `SUCCESS! Stjal ${formatNumber(loot)} kr fra Rivalen!`, type: 'success', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
                };
            } else {
                playSound('error');
                return {
                    ...prev,
                    heat: prev.heat + 25,
                    rival: { ...prev.rival, hostility: (prev.rival?.hostility || 0) + 20, lastRaidTime: now },
                    logs: [{ msg: "RAZZIA FEJLEDE! Rivalen forsvarede sig. Heat steg!", type: 'error', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
                };
            }
        });
    }, [setGameState, addLog, triggerShake]);

    const liberateTerritory = useCallback((territoryId) => {
        setGameState(prev => {
            const isRival = prev.rival.occupiedTerritories?.includes(territoryId);
            if (!isRival) return prev;

            // Combat logic: 70% success chance
            const success = Math.random() < 0.7;
            if (success) {
                playSound('success');
                return {
                    ...prev,
                    heat: prev.heat + 10,
                    rival: {
                        ...prev.rival,
                        occupiedTerritories: prev.rival.occupiedTerritories.filter(id => id !== territoryId),
                        hostility: Math.max(0, (prev.rival.hostility || 0) - 10)
                    },
                    logs: [{ msg: `OVERTAGET: Området er nu frit for Rivalens indflydelse!`, type: 'success', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
                };
            } else {
                playSound('error');
                if (triggerShake) triggerShake();
                return {
                    ...prev,
                    heat: prev.heat + 20,
                    logs: [{ msg: `FEJL: Rivalen slog dit angreb tilbage!`, type: 'error', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
                };
            }
        });
    }, [setGameState, triggerShake]);

    const strikeRival = useCallback(() => {
        setGameState(prev => {
            const cost = CONFIG.rivals.strikeCost;
            if (prev.cleanCash < cost) {
                playSound('error');
                return prev;
            }

            // Gade-Krig Offensiv: Reduce Hostility & Strength at the cost of Money & Heat
            const newHostility = Math.max(0, (prev.rival?.hostility || 0) - 30);
            const newStrength = Math.max(0, (prev.rival?.strength || 100) - 15);

            playSound('punch');
            return {
                ...prev,
                cleanCash: prev.cleanCash - cost,
                heat: prev.heat + (20 * getHeatMultiplier(prev)), // Violent offensive action raises heat (perk-sensitive)
                rival: {
                    ...prev.rival,
                    hostility: newHostility,
                    strength: newStrength
                },
                logs: [{ msg: `GADE-KRIG: Du angreb rivalens base! Hostility og styrke reduceret. (+20 Heat)`, type: 'danger', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
            };
        });
        if (triggerShake) triggerShake();
    }, [setGameState, triggerShake]);

    const launchCartelAssault = useCallback((tier) => {
        setGameState(prev => {
            let percentage = 0.25;
            let winChance = 0.35;
            if (tier === 'offensive') { percentage = 0.50; winChance = 0.55; }
            if (tier === 'all_in') { percentage = 1.0; winChance = 0.80; }

            const cost = Math.floor((prev.cleanCash || 0) * percentage);
            
            if (cost < 50000) {
                addLog('Ikke nok Hvide Penge til at finansiere et angreb! (Min 50k)', 'error');
                playSound('error');
                return prev;
            }

            // Modify by Rival Strength (if rival is 100% strong, chance is slightly lower)
            const rivalStrMod = ((prev.rival?.strength || 100) / 100) * 0.15; // 0 to 0.15
            winChance -= rivalStrMod; 
            winChance = Math.max(0.1, winChance);

            const isWin = Math.random() < winChance;

            if (isWin) {
                // MASSIVE WIN PAYLOAD: Steal ~150-250% of the Clean Cash wager in Dirty Cash
                const multiplier = 1.5 + Math.random();
                const dirtyPayload = Math.floor(cost * multiplier);
                playSound('success');
                if (triggerShake) triggerShake();
                
                // Add premium diamonds if All-in
                const diamondsGained = tier === 'all_in' ? 1 : 0;
                let diamondMsg = diamondsGained > 0 ? " Fandt +1 Diamant!" : "";

                return {
                    ...prev,
                    cleanCash: prev.cleanCash - cost,
                    dirtyCash: (prev.dirtyCash || 0) + dirtyPayload,
                    diamonds: (prev.diamonds || 0) + diamondsGained,
                    rival: {
                        ...prev.rival,
                        strength: Math.max(0, (prev.rival?.strength || 100) - 50),
                        hostility: 0
                    },
                    heat: Math.max(0, prev.heat - 20),
                    logs: [{ msg: `CARTEL ASSAULT SUCCESS! Rival knust. Stjal ${formatNumber(dirtyPayload)} Sorte Penge!${diamondMsg}`, type: 'success', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
                };
            } else {
                // LOSS: Devastation. Lose wager, max heat (triggers raid next tick), lose chunk of dirty cash.
                const dirtyLost = Math.floor((prev.dirtyCash || 0) * 0.3); // lose 30% of dirty cash
                playSound('error');
                if (triggerShake) triggerShake();

                return {
                    ...prev,
                    cleanCash: prev.cleanCash - cost,
                    dirtyCash: (prev.dirtyCash || 0) - dirtyLost,
                    heat: 100, // Instant max heat -> Triggers police raid
                    rival: {
                        ...prev.rival,
                        hostility: 100,
                        strength: Math.min(100, (prev.rival?.strength || 0) + 10)
                    },
                    logs: [{ msg: `CARTEL ASSAULT FEJLEDE! Bagholdsangreb! Tabte ${formatNumber(cost)} Hvid / ${formatNumber(dirtyLost)} Sort. HEAT CRITICAL!`, type: 'danger', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
                };
            }
        });
    }, [setGameState, triggerShake, addLog]);

    return { attackBoss, sabotageRival, raidRival, liberateTerritory, strikeRival, launchCartelAssault };
};
