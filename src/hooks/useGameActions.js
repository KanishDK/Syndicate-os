import { useCallback, useEffect } from 'react';
import { getDefaultState } from '../utils/initialState';
import { CONFIG, STORAGE_KEY } from '../config/gameConfig';
import { getPerkValue, getMasteryEffect, getHeatMultiplier, setNumberFormat, formatNumber, getDistrictBonuses } from '../utils/gameMath';
import { playSound } from '../utils/audio';
import { useUI } from '../context/UIContext';
import { calculateCombatResult } from '../features/engine/combat.js';

export const useGameActions = (gameState, setGameState, dispatch, addLog, triggerShake) => {
    const { setRaidModalData, setActiveTab } = useUI();

    const hardReset = useCallback((force = false) => {
        const confirmMsg = "ER DU SIKKER? DETTE SLETTER ALT FREMSKRIDT PERMANENT!";
        if (!force && !confirm(confirmMsg)) return;

        // Preserve language preference before reset
        const savedLang = localStorage.getItem('syndicate_language');
        const savedLangVersion = localStorage.getItem('syndicate_language_version');

        // Clear Storage
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('syndicate_lang'); // Legacy key cleanup

        // Restore language preference (survives prestige)
        if (savedLang) {
            localStorage.setItem('syndicate_language', savedLang);
            localStorage.setItem('syndicate_language_version', savedLangVersion);
        }

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
        if (gameState.level < 10) return; // Level 10+ required
        if (gameState.cleanCash < CONFIG.prestige.threshold) return; // Use global threshold (250M)
        if (!confirm("ER DU SIKKER? DETTE NULSTILLER ALT MEN GIVER DIG EN PERMANENT FORDEL!")) return;

        const lifetimeEarnings = (gameState.lifetime?.earnings || 0);
        // Formula: Multiplier = 1 + log10(earnings / 10000)
        // REBALANCED: Increased from *10 to *15 and base from 2.0 to 2.5
        const { base, scale, divisor, logBase } = CONFIG.prestige.formula;
        const calculatedMult = Math.max(base, Math.floor(Math.log10(Math.max(1, lifetimeEarnings / logBase)) * scale) / divisor);

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
            diamonds: gameState.diamonds || 0, // MOLECULAR FIX: Preserve premium currency
            cleanCash: Math.max(50000, retainedCash),
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

            // Use extracted Logic
            const result = calculateCombatResult(prev);

            // Side Effects
            if (triggerShake) triggerShake();
            if (result.sound) playSound(result.sound);
            if (onDamage && result.ui) onDamage(result.ui.damage, result.ui.isCrit);

            return result.newState;
        });
    }, [setGameState, triggerShake]);

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
                    const auctionCost = CONFIG.police.newsAuctionCost;
                    if (prev.cleanCash >= auctionCost) {
                        newState.cleanCash -= auctionCost;
                        newState.upgrades.warehouse += 1;
                        successMsg = 'Købte billigt lagerudstyr (Police Auction)';
                        playSound('cash');
                    } else {
                        playSound('error');
                        return prev;
                    }
                    break;
                case 'bribe_police':
                    const newsBribeBase = CONFIG.police.bribeCost;
                    const bribeCost = newsBribeBase * Math.max(1, prev.level || 1);
                    if (prev.dirtyCash >= bribeCost) {
                        newState.dirtyCash -= bribeCost;
                        newState.heat = Math.max(0, newState.heat - 20);
                        successMsg = `Bestak lokalbetjenten (-20 Heat). Pris: ${formatNumber(bribeCost)} kr`;
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
                if (triggerShake) triggerShake();
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
            const bonuses = getDistrictBonuses(prev);
            // DYNAMIC BRIBE: Base Cost * Level (To prevent late game triviality)
            const levelMult = Math.max(1, prev.level || 1);
            const baseCost = CONFIG.police.bribeCost * levelMult;
            const cost = baseCost * (bonuses.bribeMult || 1);

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
                logs: [{ msg: `Bestak betjenten (-25 Heat). Pris: ${formatNumber(cost)} kr (Sort) + ${formatNumber(fee)} kr (Hvid).`, type: 'success', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
            };
        });
    }, [setGameState, addLog]);

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
            const cost = CONFIG.marketing.hypeCost;
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
            const cost = Math.floor(prev.heat * CONFIG.police.sultanBribeFactor);
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

    const triggerMarketTrend = useCallback(() => {
        setGameState(prev => {
            const cost = CONFIG.crypto.marketInfluenceCost || 50000;
            if (prev.cleanCash < cost) {
                playSound('error');
                addLog(`Mangler ${formatNumber(cost)} kr (Ren) for at fikse markedet!`, 'error');
                return prev;
            }

            playSound('cash');
            return {
                ...prev,
                cleanCash: prev.cleanCash - cost,
                market: {
                    ...prev.market,
                    trend: 'bull',
                    duration: 120, // 2 minutes of bull market
                    multiplier: 1.5 // Stronger surge than random bull
                },
                logs: [{ msg: `MARKEDET ER FIKSET! Sultanen har talt. Alt stiger! (BULL MARKET)`, type: 'success', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
            };
        });
    }, [setGameState, addLog]);


    const activateGhostMode = useCallback(() => {
        setGameState(prev => {
            // Check if Ghost Protocol is owned
            if (!prev.luxuryItems?.includes('ghostmode')) {
                playSound('error');
                addLog('Du skal eje Ghost Protocol System først!', 'error');
                return prev;
            }

            // Check cooldown (1 hour = 3600000ms)
            const now = Date.now();
            const lastActivation = prev.ghostModeLastActivated || 0;
            const cooldownRemaining = Math.max(0, 3600000 - (now - lastActivation));

            if (cooldownRemaining > 0) {
                const minutesLeft = Math.ceil(cooldownRemaining / 60000);
                playSound('error');
                addLog(`Ghost Protocol er på cooldown! ${minutesLeft} min tilbage.`, 'error');
                return prev;
            }

            // Calculate Costs (100% Dirty, 10% Clean)
            const cleanCost = Math.floor(prev.cleanCash * 0.10);
            const dirtyLost = prev.dirtyCash;

            // Activate Ghost Mode for 10 minutes
            playSound('success');
            return {
                ...prev,
                cleanCash: Math.max(0, prev.cleanCash - cleanCost),
                dirtyCash: 0, // 100% Loss
                activeBuffs: {
                    ...prev.activeBuffs,
                    ghostMode: now + 600000 // 10 minutes
                },
                ghostModeLastActivated: now,
                heat: 0, // IMMEDIATE FEEDBACK: Clear heat instantly to close modal
                logs: [{ msg: `🕶️ GHOST PROTOCOL: Heat slettet. Pris: ${cleanCost.toLocaleString()} kr (Sorte Penge tabt: ${dirtyLost.toLocaleString()} kr)`, type: 'success', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
            };
        });
    }, [setGameState, addLog]);

    return { hardReset, exportSave, importSave, doPrestige, attackBoss, handleNewsAction, sabotageRival, raidRival, liberateTerritory, bribePolice, handleMissionChoice, buyHype, buyBribeSultan, purchaseLuxuryItem, purchaseMasteryPerk, strikeRival, activateGhostMode, triggerMarketTrend };
};
