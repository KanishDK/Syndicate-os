import { useCallback, useEffect } from 'react';
import { defaultState } from '../utils/initialState';
import { CONFIG } from '../config/gameConfig';
import { getPerkValue, setNumberFormat } from '../utils/gameMath';
import { playSound } from '../utils/audio';

export const useGameActions = (gameState, setGameState, dispatch, addLog, setRaidModalData, setActiveTab) => {

    const hardReset = useCallback((force = false) => {
        if (!force && !confirm("ER DU SIKKER? DETTE SLETTER ALT FREMSKRIDT PERMANENT!")) return;
        localStorage.removeItem('syndicate_os_danish_tycoon_v1');
        location.reload();
    }, []);

    const exportSave = useCallback(() => {
        const data = btoa(unescape(encodeURIComponent(JSON.stringify(gameState))));
        navigator.clipboard.writeText(data).then(() => addLog("Gemt data kopieret til udklipsholder!", "success"));
    }, [gameState, addLog]);

    const importSave = useCallback(() => {
        const data = prompt("Indsæt save data:");
        if (data) {
            try {
                const parsed = JSON.parse(decodeURIComponent(escape(atob(data))));
                dispatch({ type: 'SET_STATE', payload: parsed });
            } catch (e) {
                alert("Ugyldig data");
            }
        }
    }, [dispatch]);

    const doPrestige = useCallback(() => {
        if (gameState.level < 10) return; // Gudfader rank required
        if (!confirm("ER DU SIKKER? DETTE NULSTILLER ALT MEN GIVER DIG EN PERMANENT FORDEL!")) return;

        const lifetimeEarnings = (gameState.lifetime?.earnings || 0);
        // Formula: Multiplier = 1 + log10(earnings / 10000)
        // This gives a more steady progression than sqrt for idle games
        const calculatedMult = Math.max(2, Math.floor(Math.log10(Math.max(1, lifetimeEarnings / 10000)) * 10) / 10);

        const newPrestige = {
            level: (gameState.prestige?.level || 0) + 1,
            multiplier: calculatedMult,
            currency: (gameState.prestige?.currency || 0) + Math.floor(calculatedMult / 2) + 1,
            perks: gameState.prestige?.perks || {}
        };

        const newState = {
            ...defaultState,
            prestige: newPrestige,
            lifetime: gameState.lifetime || defaultState.lifetime,
            logs: [{ msg: `VELKOMMEN TIL DIT NYE LIV. Prestige Level ${newPrestige.level}. Multiplier: x${newPrestige.multiplier}`, type: 'success', time: new Date().toLocaleTimeString() }]
        };

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

    const attackBoss = useCallback(() => {
        setGameState(prev => {
            if (!prev.boss.active) return prev;
            const perkDmg = getPerkValue(prev, 'boss_dmg');
            const dmg = (prev.boss.damagePerClick || 10) + perkDmg;
            const newHp = prev.boss.hp - dmg;

            if (newHp <= 0) {
                playSound('success');
                return {
                    ...prev,
                    boss: { ...prev.boss, active: false, hp: 0 },
                    completedMissions: [...prev.completedMissions, 'boss_defeated'],
                    xp: prev.xp + CONFIG.boss.reward.xp,
                    dirtyCash: prev.dirtyCash + CONFIG.boss.reward.money,
                    logs: [{ msg: `BOSS BESEJRET!`, type: 'success', time: new Date().toLocaleTimeString() }, ...prev.logs],
                    pendingEvent: {
                        type: 'story',
                        data: {
                            title: 'BYENS NYE KONGE',
                            msg: `Du har besejret Bossen!`,
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

    return { hardReset, exportSave, importSave, doPrestige, attackBoss };
};
