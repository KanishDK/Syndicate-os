import { useCallback, useEffect } from 'react';
import { getDefaultState } from '../utils/initialState';
import { CONFIG, STORAGE_KEY } from '../config/gameConfig';
import { getPerkValue, setNumberFormat, formatNumber } from '../utils/gameMath';
import { playSound } from '../utils/audio';

export const useGameActions = (gameState, setGameState, dispatch, addLog, setRaidModalData, setActiveTab) => {

    const hardReset = useCallback((force = false) => {
        const confirmMsg = "ER DU SIKKER? DETTE SLETTER ALT FREMSKRIDT PERMANENT!";
        if (!force && !confirm(confirmMsg)) return;

        // Clear Storage
        localStorage.removeItem(STORAGE_KEY);

        // Fix Persistence Race Condition: Prevent beforeunload save
        window.__syndicate_os_resetting = true;

        // Force Reload
        window.location.reload();
    }, []);

    const exportSave = useCallback(() => {
        const data = btoa(unescape(encodeURIComponent(JSON.stringify(gameState))));
        navigator.clipboard.writeText(data).then(() => addLog("Gemt data kopieret til udklipsholder!", "success"));
    }, [gameState, addLog]);

    const importSave = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target.result;
                const parsed = JSON.parse(decodeURIComponent(escape(atob(data))));
                const stringified = JSON.stringify(parsed);
                const encoded = btoa(unescape(encodeURIComponent(stringified)));

                localStorage.setItem(STORAGE_KEY, encoded);

                // Fix Persistence Race Condition: Prevent beforeunload save
                window.__syndicate_os_resetting = true;
                window.location.reload();
            } catch (e) {
                console.error("Import failed", e);
                addLog('Import fejlede: Ugyldigt format.', 'error');
            }
        };
        reader.readAsText(file);
    };

    const doPrestige = useCallback(() => {
        if (gameState.level < 10) return; // Gudfader rank required
        if (!confirm("ER DU SIKKER? DETTE NULSTILLER ALT MEN GIVER DIG EN PERMANENT FORDEL!")) return;

        const lifetimeEarnings = (gameState.lifetime?.earnings || 0);
        // Formula: Multiplier = 1 + log10(earnings / 10000)
        // This gives a more steady progression than sqrt for idle games
        const calculatedMult = Math.max(2, Math.floor(Math.log10(Math.max(1, lifetimeEarnings / 5000)) * 10) / 10);

        const newPrestige = {
            level: (gameState.prestige?.level || 0) + 1,
            multiplier: calculatedMult,
            currency: (gameState.prestige?.currency || 0) + Math.floor(calculatedMult / 2) + 1,
            perks: gameState.prestige?.perks || {}
        };

        // PERK: Offshore Accounts (Retain % of Clean Cash)
        const retentionLevel = gameState.prestige?.perks?.offshore_accounts || 0;
        const retainedCash = retentionLevel > 0 ? Math.floor(gameState.cleanCash * (retentionLevel * 0.05)) : 0;

        // Factory Call to get pristine state
        const freshState = getDefaultState();

        const newState = {
            ...freshState,
            prestige: newPrestige,
            cleanCash: retainedCash, // Apply retained cash
            lifetime: gameState.lifetime || freshState.lifetime,
            logs: [{ msg: `VELKOMMEN TIL DIT NYE LIV. Prestige Level ${newPrestige.level}. Multiplier: x${newPrestige.multiplier}`, type: 'success', time: new Date().toLocaleTimeString() }]
        };

        if (retainedCash > 0) {
            newState.logs.push({ msg: `OFFSHORE: ${formatNumber(retainedCash)} kr overført til ny identitet.`, type: 'info', time: new Date().toLocaleTimeString() });
        }

        setGameState(newState);
        setRaidModalData({
            type: 'story',
            result: 'win',
            title: 'EXIT SCAM SUCCESSFUL',
            msg: `Du slap væk med pengene! Nyt liv startet med x${newPrestige.multiplier} indtjening.`,
        });
        setActiveTab('production');
        playSound('success');
    }, [gameState, setGameState, setRaidModalData, setActiveTab]);

    const attackBoss = useCallback((onDamage) => {
        setGameState(prev => {
            if (!prev.boss.active) return prev;

            // 1. Calculate Damage
            const baseDmg = prev.boss.damagePerClick || 10;
            const perkDmg = getPerkValue(prev, 'boss_dmg'); // e.g., +10

            // Defense Synergy: Your army helps you!
            // 10% of total defense value is added to click damage
            const defenseBonus = Math.floor(
                ((prev.defense.guards * CONFIG.defense.guards.defenseVal) +
                    (prev.defense.cameras * CONFIG.defense.cameras.defenseVal) +
                    (prev.defense.bunker * CONFIG.defense.bunker.defenseVal)) * 0.1
            );

            // Critical Hit RNG (10% Chance)
            const isCrit = Math.random() < 0.10;
            const critMult = isCrit ? 2.0 : 1.0;

            // CORRECT FORMULA: (Base + Perk) * Crit + Defense
            const totalDmg = Math.floor(((baseDmg + perkDmg) * critMult) + defenseBonus);

            // Callback for UI Feedback (Floating Numbers)
            if (onDamage) onDamage(totalDmg, isCrit);

            const newHp = prev.boss.hp - totalDmg;

            if (isCrit) playSound('punch');

            if (newHp <= 0) {
                playSound('success');
                // Loot & Rewards
                const rewardMoney = CONFIG.boss.reward.money * (1 + (prev.level * 0.5));
                const rewardXP = CONFIG.boss.reward.xp * (1 + (prev.level * 0.2));

                // Check for First Kill (Boss Key)
                const isFirstKill = (prev.boss.lastDefeatedLevel || 0) < prev.level;
                let logMsg = `BOSS BESEJRET! Drop: ${formatNumber(rewardMoney)} kr & ${formatNumber(rewardXP)} XP`;

                let newUnlocks = [...(prev.unlockedAchievements || [])];

                // Grant Boss Key if first kill for this level tier
                if (isFirstKill) {
                    logMsg += " & [RELIC] BOSS KEY (Tier 2 Unlocked)";
                    newUnlocks.push('boss_key_tier2');
                }

                return {
                    ...prev,
                    boss: { ...prev.boss, active: false, hp: 0, lastDefeatedLevel: prev.level },
                    completedMissions: [...prev.completedMissions, 'boss_defeated'],
                    unlockedAchievements: newUnlocks,
                    xp: prev.xp + rewardXP,
                    dirtyCash: prev.dirtyCash + rewardMoney,
                    logs: [{ msg: logMsg, type: 'success', time: new Date().toLocaleTimeString() }, ...prev.logs],
                    pendingEvent: {
                        type: 'story',
                        data: {
                            title: 'BYENS NYE KONGE',
                            msg: `Du har knust Bossen! Dit ry vokser eksplosivt.\n\n"Ingen kan stoppe mig nu!"`,
                            type: 'success'
                        }
                    }
                };
            }

            playSound('click');
            return {
                ...prev,
                boss: { ...prev.boss, hp: newHp }
            };
        });
    }, [setGameState]);

    // Effect: Handle Custom Events (Deep component communication)
    useEffect(() => {
        const handleBuyPerk = (e) => {
            const { id, cost } = e.detail;
            setGameState(prev => {
                const currency = prev.prestige?.currency || 0;
                if (currency < cost) {
                    playSound('error');
                    return prev;
                }
                const currentLvl = prev.prestige?.perks?.[id] || 0;
                playSound('success');
                return {
                    ...prev,
                    prestige: {
                        ...prev.prestige,
                        currency: currency - cost,
                        perks: { ...prev.prestige.perks, [id]: currentLvl + 1 }
                    },
                    logs: [{ msg: `Købte Perk: ${id} (Lvl ${currentLvl + 1})`, type: 'success', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
                };
            });
        };
        window.addEventListener('BUY_PERK', handleBuyPerk);
        return () => window.removeEventListener('BUY_PERK', handleBuyPerk);
    }, [setGameState]);

    // Effect: Sync Settings
    useEffect(() => {
        if (gameState?.settings?.numberFormat) {
            setNumberFormat(gameState.settings.numberFormat);
        }
    }, [gameState?.settings?.numberFormat]);

    const handleNewsAction = useCallback((action) => {
        setGameState(prev => {
            if (action.processed) return prev; // Prevent double clicks

            // Logic based on action type
            let newState = { ...prev };
            let successMsg = '';

            switch (action.type) {
                case 'buy_cheap_equip':
                    if (prev.cleanCash >= 5000) {
                        newState.cleanCash -= 5000;
                        newState.upgrades.warehouse += 1;
                        successMsg = 'Købte billigt lagerudstyr (Police Auction)';
                        playSound('cash');
                    } else {
                        playSound('error');
                        return prev;
                    }
                    break;
                case 'bribe_police':
                    if (prev.dirtyCash >= 10000) {
                        newState.dirtyCash -= 10000;
                        newState.heat = Math.max(0, newState.heat - 20);
                        successMsg = 'Bestak lokalbetjenten (-20 Heat)';
                        playSound('coin');
                    } else {
                        playSound('error');
                        return prev;
                    }
                    break;
                default:
                    return prev;
            }

            // Remove the action functionality from the log to prevent exploit
            const newLogs = prev.logs.map(l => l.action === action ? { ...l, action: null, msg: `${l.msg} (UDNYTTET)` } : l);

            return {
                ...newState,
                logs: [{ msg: successMsg, type: 'success', time: new Date().toLocaleTimeString() }, ...newLogs]
            };
        });
    }, [setGameState]);

    const sabotageRival = useCallback(() => {
        setGameState(prev => {
            const cost = 25000;
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
            if (prev.heat > 80) {
                addLog("For varmt til at angribe! Vent til Heat falder.", 'error');
                return prev;
            }

            const successChance = 0.6;
            if (Math.random() < successChance) {
                const loot = 15000 + Math.floor(Math.random() * 35000);
                playSound('cash');
                return {
                    ...prev,
                    dirtyCash: prev.dirtyCash + loot, // Steal Dirty Cash
                    heat: prev.heat + 15, // Heat spike
                    rival: { ...prev.rival, hostility: (prev.rival?.hostility || 0) + 10 },
                    logs: [{ msg: `SUCCESS! Stjal ${formatNumber(loot)} kr fra Rivalen!`, type: 'success', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
                };
            } else {
                playSound('error');
                return {
                    ...prev,
                    heat: prev.heat + 25,
                    rival: { ...prev.rival, hostility: (prev.rival?.hostility || 0) + 20 },
                    logs: [{ msg: "RAZZIA FEJLEDE! Rivalen forsvarede sig. Heat steg!", type: 'error', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
                };
            }
        });
    }, [setGameState, addLog]);

    const bribePolice = useCallback(() => {
        setGameState(prev => {
            const cost = 50000;
            if (prev.dirtyCash < cost) {
                playSound('error');
                return prev;
            }
            if (prev.heat <= 0) return prev;

            playSound('coin');
            return {
                ...prev,
                dirtyCash: prev.dirtyCash - cost,
                heat: Math.max(0, prev.heat - 25),
                logs: [{ msg: "Betjenten tog imod bestikkelsen. Heat falder.", type: 'success', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
            };
        });
    }, [setGameState]);

    return { hardReset, exportSave, importSave, doPrestige, attackBoss, handleNewsAction, sabotageRival, raidRival, bribePolice };
};
