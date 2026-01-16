import { useCallback, useRef } from 'react';
import { CONFIG } from '../config/gameConfig';
import { getMaxCapacity, getDistrictBonuses } from '../utils/gameMath';

export const useProduction = (state, setState, addLog, addFloat) => {

    // Use a ref to prevent rapid-fire double clicks between state updates
    const processingRef = useRef({});

    const produce = useCallback((type) => {
        const prod = CONFIG.production[type];

        // 1. Immediate Validation (Synchronous)
        if (state.isProcessing[type]) return; // React State Check
        if (processingRef.current[type]) return; // Ref Guard Check

        const districtBonuses = getDistrictBonuses(state);
        const actualCost = Math.floor(prod.baseCost * (districtBonuses.costMult[type] || 1));

        if (state.cleanCash < actualCost) {
            addLog(`Ikke nok penge! Mangler ${actualCost - state.cleanCash} kr.`, 'error');
            return;
        }

        // Inventory Cap Check
        const maxCap = getMaxCapacity(state);
        const currentTotal = Object.values(state.inv).reduce((a, b) => a + b, 0);

        if (currentTotal >= maxCap) {
            addLog('Lageret er fyldt! Sælg varer for at producere mere.', 'error');
            return;
        }

        // 2. Lock & Start
        processingRef.current[type] = true;

        // Optimistically start UI
        setState(prev => {
            const bonuses = getDistrictBonuses(prev);
            const cost = Math.floor(prod.baseCost * (bonuses.costMult[type] || 1));
            return {
                ...prev,
                cleanCash: prev.cleanCash - cost,
                isProcessing: { ...prev.isProcessing, [type]: true }
            };
        });

        const speedMult = Math.max(0.1, (1 - ((state.prestige?.perks?.prod_speed || 0) * 0.1)) * (districtBonuses.speedMult || 1));
        const processTime = prod.duration * speedMult;

        // 3. Schedule Completion
        setTimeout(() => {
            setState(prev => {
                // Unlock Ref
                processingRef.current[type] = false;

                const newCount = (prev.inv[type] || 0) + 1;
                return {
                    ...prev,
                    inv: { ...prev.inv, [type]: newCount },
                    stats: {
                        ...prev.stats,
                        produced: {
                            ...prev.stats.produced,
                            [type]: (prev.stats.produced?.[type] || 0) + 1
                        }
                    },
                    lifetime: {
                        ...prev.lifetime,
                        produced: {
                            ...prev.lifetime?.produced,
                            [type]: (prev.lifetime?.produced?.[type] || 0) + 1
                        }
                    },
                    isProcessing: { ...prev.isProcessing, [type]: false }
                };
            });
            // Removed log per user request to reduce spam
            // addLog(`Produktion færdig: 1 enhed ${prod.name}.`, 'success');
        }, processTime);

    }, [state, addLog, setState]);

    const handleSell = useCallback((type, amount, event) => {
        const salesMult = 1 + ((state.prestige?.perks?.sales_boost || 0) * 0.1);
        const marketMult = state.market?.multiplier || 1.0;
        const prestigeMult = state.prestige?.multiplier || 1.0;
        const revenuePerUnit = state.prices[type] * salesMult * marketMult * prestigeMult;
        const heatMult = Math.max(0.5, 1 - ((state.prestige?.perks?.heat_reduce || 0) * 0.05));

        setState(prev => {
            const currentAmount = prev.inv[type] || 0;
            if (currentAmount < amount) return prev; // Hard atomic check inside state update

            const totalRevenue = revenuePerUnit * amount;
            const xpGain = Math.floor(totalRevenue * 0.1);

            if (event && event.currentTarget && addFloat) {
                const rect = event.currentTarget.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2 - 20;
                addFloat(`+${Math.floor(totalRevenue).toLocaleString()} kr`, x, y, 'text-emerald-400 font-black text-xl');
            }

            addLog(`Solgte ${amount}x ${CONFIG.production[type].name} for ${totalRevenue.toLocaleString()} kr. (+${xpGain} XP)`, 'success');

            return {
                ...prev,
                inv: { ...prev.inv, [type]: currentAmount - amount },
                dirtyCash: prev.dirtyCash + totalRevenue,
                heat: prev.heat + ((amount * 0.5) * heatMult),
                xp: prev.xp + xpGain,
                stats: { ...prev.stats, sold: prev.stats.sold + amount },
                lifetime: {
                    ...prev.lifetime,
                    dirtyEarnings: (prev.lifetime?.dirtyEarnings || 0) + totalRevenue
                }
            };
        });
    }, [state.prestige, state.market, state.prices, addLog, addFloat, setState]);

    const toggleAutoSell = useCallback((id) => {
        setState(prev => {
            const current = prev.autoSell?.[id] !== false; // Default true
            return { ...prev, autoSell: { ...prev.autoSell, [id]: !current } };
        });
    }, [setState]);

    // Keyboard Shortcuts Logic - extracted but needs to be called in component? 
    // Actually, keyboard shortcuts should probably remain in the component or be in a separate useKeyboard hook.
    // But since it calls produce/sell, it fits here.
    // However, the original code had it in ProductionTab.
    // I will export a helper or just keep the effect in the component using the exported functions.

    return { produce, handleSell, toggleAutoSell };
};
