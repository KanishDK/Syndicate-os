import { useCallback, useEffect } from 'react';
import { CONFIG } from '../config/gameConfig';
import { playSound } from '../utils/audio';
import { formatNumber, getDistrictBonuses } from '../utils/gameMath';

export const useEconomyActions = (gameState, setGameState, addLog) => {
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

    const buyIntel = useCallback(() => {
        setGameState(prev => {
            const cost = 15000; // Fixed cost for Intel
            if (prev.cleanCash < cost) {
                playSound('error');
                addLog(`Mangler ${formatNumber(cost)} kr til bestikkelse!`, 'error');
                return prev;
            }
            playSound('coin');
            return {
                ...prev,
                cleanCash: prev.cleanCash - cost,
                activeBuffs: { ...prev.activeBuffs, sultan_bribe: Date.now() + 300000 }, // 5 Minutes
                logs: [{ msg: `BETALTE FOR INFO: Sultanen giver dig varsler i 5 minutter.`, type: 'success', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
            };
        });
    }, [setGameState, addLog]);

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

    return { bribePolice, buyHype, buyBribeSultan, buyIntel, purchaseLuxuryItem, purchaseMasteryPerk, triggerMarketTrend };
};
