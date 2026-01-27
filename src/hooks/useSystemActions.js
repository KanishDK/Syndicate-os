import { useCallback, useEffect } from 'react';
import { CONFIG, STORAGE_KEY } from '../config/gameConfig';
import { playSound } from '../utils/audio';
import { formatNumber, setNumberFormat } from '../utils/gameMath';
import { getDefaultState } from '../utils/initialState';
import { useUI } from '../context/UIContext';

export const useSystemActions = (gameState, setGameState, addLog) => {
    const { setRaidModalData, setActiveTab } = useUI();

    // Effect: Sync Settings
    useEffect(() => {
        if (gameState?.settings?.numberFormat) {
            setNumberFormat(gameState.settings.numberFormat);
        }
    }, [gameState?.settings?.numberFormat]);

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

            // FIX: Deduct Guaranteed Costs (Negative Money) IMMEDIATELY
            if (ef.money && ef.money < 0) {
                s.cleanCash += ef.money; // Deduct the cost
            }

            if (ef.chance) {
                if (Math.random() < ef.chance) {
                    if (ef.success?.money) s.cleanCash += ef.success.money;
                    playSound('success');
                } else {
                    if (ef.fail?.heat) s.heat += ef.fail.heat;
                    playSound('error');
                }
            } else {
                if (ef.money && ef.money > 0) s.cleanCash += ef.money; // Only add Reward if positive (Cost already handled)
                if (ef.rival) {
                    s.rival = { ...s.rival, hostility: (s.rival?.hostility || 0) + ef.rival };
                }
                if (ef.heat) s.heat += ef.heat;
                playSound('click');
            }

            return s;
        });
    }, [setGameState]);

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

    return { hardReset, exportSave, importSave, doPrestige, handleNewsAction, handleMissionChoice, activateGhostMode };
};
