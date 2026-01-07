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

            // CORRECT FORMULA: (Base + Perk) * Crit + Defense - Boss Defense
            const bossDef = Math.floor(prev.level * 0.5);
            const totalDmg = Math.max(1, Math.floor(((baseDmg + perkDmg) * critMult) + defenseBonus) - bossDef);

            // Callback for UI Feedback (Floating Numbers)
            if (onDamage) onDamage(totalDmg, isCrit);

            const newBossHp = prev.boss.hp - totalDmg;

            if (isCrit) playSound('punch');

            // 2. Boss Attacks Player (every 2 seconds)
            const now = Date.now();
            const timeSinceLastAttack = now - (prev.boss.lastAttackTime || now);
            const BOSS_ATTACK_INTERVAL = prev.boss.enraged ? 1000 : 2000;

            let newPlayerHp = prev.boss.playerHp;
            let bossAttacked = false;

            if (timeSinceLastAttack >= BOSS_ATTACK_INTERVAL) {
                const bossAttackDmg = prev.boss.enraged
                    ? Math.floor(prev.boss.attackDamage * 1.5)
                    : prev.boss.attackDamage;

                newPlayerHp = Math.max(0, prev.boss.playerHp - bossAttackDmg);
                bossAttacked = true;
                playSound('error');
            }

            // 3. Check Enrage (25% HP)
            const hpPercent = newBossHp / prev.boss.maxHp;
            const shouldEnrage = hpPercent < 0.25 && !prev.boss.enraged;

            // 4. Player Defeated
            if (newPlayerHp <= 0) {
                playSound('error');
                const cashLoss = Math.floor(prev.dirtyCash * 0.1);

                return {
                    ...prev,
                    boss: {
                        ...prev.boss,
                        active: false,
                        playerHp: prev.boss.playerMaxHp
                    },
                    heat: prev.heat + 15,
                    dirtyCash: prev.dirtyCash - cashLoss,
                    logs: [
                        { msg: `💀 BOSS BESEJREDE DIG! Mistede ${formatNumber(cashLoss)} kr og fik +15 Heat.`, type: 'error', time: new Date().toLocaleTimeString() },
                        ...prev.logs
                    ].slice(0, 50),
                    pendingEvent: {
                        type: 'story',
                        data: {
                            title: 'NEDERLAG',
                            msg: `Bossen var for stærk. Du flygtede med skader og mistede ${formatNumber(cashLoss)} kr.`,
                            type: 'error'
                        }
                    }
                };
            }

            // 5. Boss Defeated
            if (newBossHp <= 0) {
                playSound('success');

                // Speed Bonus (defeat in < 30 seconds)
                const timeElapsed = now - prev.boss.startTime;
                const speedBonus = timeElapsed < 30000 ? 1.5 : 1.0;

                // Check for First Kill (Boss Key)
                const isFirstKill = (prev.boss.lastDefeatedLevel || 0) < prev.level;

                const masteryXP = 1 + getMasteryEffect(prev, 'xp_boost');
                const rewardMoney = Math.floor(CONFIG.boss.reward.money * (1 + (prev.level * 0.5)) * speedBonus);
                const rewardXP = Math.floor(CONFIG.boss.reward.xp * (1 + (prev.level * 0.2)) * speedBonus * masteryXP);
                let logMsg = `⚔️ BOSS BESEJRET! Drop: ${formatNumber(rewardMoney)} kr & ${formatNumber(rewardXP)} XP`;

                if (speedBonus > 1) {
                    logMsg += ` (⚡ Speed Bonus: +50%)`;
                }

                let newUnlocks = [...(prev.unlockedAchievements || [])];

                // Grant Boss Key if first kill for this level tier
                if (isFirstKill) {
                    logMsg += " & [RELIC] BOSS KEY (Tier 2 Unlocked)";
                    newUnlocks.push('boss_key_tier2');
                }

                return {
                    ...prev,
                    boss: {
                        ...prev.boss,
                        active: false,
                        hp: 0,
                        lastDefeatedLevel: prev.level,
                        playerHp: prev.boss.playerMaxHp
                    },
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

            // 6. Continue Battle
            playSound('click');

            const newState = {
                ...prev,
                boss: {
                    ...prev.boss,
                    hp: newBossHp,
                    playerHp: newPlayerHp,
                    enraged: shouldEnrage || prev.boss.enraged,
                    lastAttackTime: bossAttacked ? now : prev.boss.lastAttackTime
                }
            };

            // Enrage notification
            if (shouldEnrage) {
                newState.logs = [
                    { msg: '🔥 BOSS ER RASENDE! Angreb øget!', type: 'warning', time: new Date().toLocaleTimeString() },
                    ...prev.logs
                ].slice(0, 50);
            }

            return newState;
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

            const successChance = 0.6;
            if (Math.random() < successChance) {
                const loot = 15000 + Math.floor(Math.random() * 35000);
                playSound('cash');
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
    }, [setGameState, addLog]);

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
                return {
                    ...prev,
                    heat: prev.heat + 20,
                    logs: [{ msg: `FEJL: Rivalen slog dit angreb tilbage!`, type: 'error', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
                };
            }
        });
    }, [setGameState]);

    const bribePolice = useCallback(() => {
        setGameState(prev => {
            const cost = 50000;
            if (prev.dirtyCash < cost) {
                playSound('error');
                return prev;
            }
            // Middleman Fee (10% Clean)
            const fee = cost * 0.1;
            if (prev.cleanCash < fee) {
                addLog(`Fejl: Du mangler ${formatNumber(fee)} kr (Hvid) til mellemmanden!`, 'error');
                playSound('error');
                return prev;
            }

            if (prev.heat <= 0) return prev;

            playSound('coin');
            return {
                ...prev,
                dirtyCash: prev.dirtyCash - cost,
                cleanCash: prev.cleanCash - fee,
                heat: Math.max(0, prev.heat - 25),
                logs: [{ msg: `Bestak betjenten (-25 Heat). Mellemmand fik ${formatNumber(fee)} kr.`, type: 'success', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
            };
        });
    }, [setGameState]);

    const handleMissionChoice = useCallback((missionId, choice) => {
        setGameState(prev => {
            if (prev.missionChoices?.[missionId]) return prev;

            const ef = choice.effect;
            const cost = ef.money < 0 ? Math.abs(ef.money) : 0;

            if (cost > 0 && prev.cleanCash < cost) {
                playSound('error');
                return prev;
            }

            let s = { ...prev };
            s.missionChoices = { ...s.missionChoices, [missionId]: true };

            if (ef.chance) {
                if (Math.random() < ef.chance) {
                    if (ef.success?.money) s.cleanCash += ef.success.money;
                    playSound('success');
                } else {
                    if (ef.fail?.heat) s.heat += ef.fail.heat;
                    playSound('error');
                }
            } else {
                if (ef.money) s.cleanCash += ef.money;
                if (ef.rival) {
                    s.rival = { ...s.rival, hostility: (s.rival?.hostility || 0) + ef.rival };
                }
                if (ef.heat) s.heat += ef.heat;
                playSound('click');
            }

            return s;
        });
    }, [setGameState]);

    const buyHype = useCallback(() => {
        setGameState(prev => {
            const cost = 25000;
            if (prev.cleanCash < cost) {
                playSound('error');
                return prev;
            }
            playSound('success');
            return {
                ...prev,
                cleanCash: prev.cleanCash - cost,
                activeBuffs: { ...prev.activeBuffs, hype: Date.now() + 120000 }
            };
        });
    }, [setGameState]);

    const buyBribeSultan = useCallback(() => {
        setGameState(prev => {
            const cost = Math.floor(prev.heat * 500);
            if (prev.heat < 5 || prev.cleanCash < cost) {
                playSound('error');
                return prev;
            }
            playSound('coin');
            return {
                ...prev,
                cleanCash: prev.cleanCash - cost,
                heat: Math.max(0, prev.heat - 10)
            };
        });
    }, [setGameState]);

    const purchaseLuxuryItem = useCallback((itemId) => {
        setGameState(prev => {
            const item = CONFIG.luxuryItems.find(i => i.id === itemId);
            if (!item || prev.cleanCash < item.cost || prev.luxuryItems?.includes(itemId)) {
                playSound('error');
                return prev;
            }
            playSound('success');
            return {
                ...prev,
                cleanCash: prev.cleanCash - item.cost,
                luxuryItems: [...(prev.luxuryItems || []), itemId],
                logs: [{ msg: `KØBT: Du ejer nu ${item.name}! Din respekt på gaden stiger.`, type: 'success', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
            };
        });
    }, [setGameState]);

    const purchaseMasteryPerk = useCallback((perkId) => {
        setGameState(prev => {
            const perk = CONFIG.masteryPerks[perkId];
            if (!perk || prev.diamonds < perk.cost || prev.masteryPerks?.[perkId]) {
                playSound('error');
                return prev;
            }
            playSound('levelup');
            return {
                ...prev,
                diamonds: prev.diamonds - perk.cost,
                masteryPerks: { ...prev.masteryPerks, [perkId]: true },
                logs: [{ msg: `MASTERY LÅST OP: ${perk.name} aktiveret!`, type: 'success', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
            };
        });
    }, [setGameState]);

    const strikeRival = useCallback(() => {
        setGameState(prev => {
            const cost = 50000;
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
    }, [setGameState]);

    const activateGhostMode = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            heat: 0,
            dirtyCash: 0,
            cleanCash: Math.floor(prev.cleanCash * 0.9),
            logs: [{ msg: `GHOST PROTOCOL AKTIVERET: Spor slettet. Aktiver er renset.`, type: 'info', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
        }));
    }, [setGameState]);

    return { hardReset, exportSave, importSave, doPrestige, attackBoss, handleNewsAction, sabotageRival, raidRival, liberateTerritory, bribePolice, handleMissionChoice, buyHype, buyBribeSultan, purchaseLuxuryItem, purchaseMasteryPerk, strikeRival, activateGhostMode };
};
