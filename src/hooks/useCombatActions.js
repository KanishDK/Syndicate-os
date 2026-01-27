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
                return {
                    ...prev,
                    dirtyCash: prev.dirtyCash + loot, // Steal Dirty Cash
                    heat: prev.heat + 15, // Heat spike
                    rival: { ...prev.rival, hostility: (prev.rival?.hostility || 0) + 10, lastRaidTime: now },
                    logs: [{ msg: `SUCCESS! Stjal ${formatNumber(loot)} kr fra Rivalen!`, type: 'success', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
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

    return { attackBoss, sabotageRival, raidRival, liberateTerritory, strikeRival };
};
