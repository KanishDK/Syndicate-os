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

        // 2. Calculate Timings
        // 2. Calculate Timings
        const speedMult = Math.max(0.1, (1 - ((state.prestige?.perks?.prod_speed || 0) * 0.1)) * (districtBonuses.speedMult || 1));
        const processTime = prod.duration * speedMult;
        const finishTime = Date.now() + processTime;

        // 3. Lock & Start (Store Finish Time)
        processingRef.current[type] = true;

        // Optimistically start UI with TIMESTAMP
        setState(prev => {
            // Recalc cost inside to be safe or use pre-calc? Pre-calc is fine as checking happened above.
            // But for consistency let's use the one from validation approx.
            const bonuses = getDistrictBonuses(prev);
            const cost = Math.floor(prod.baseCost * (bonuses.costMult[type] || 1));
            return {
                ...prev,
                cleanCash: prev.cleanCash - cost,
                isProcessing: { ...prev.isProcessing, [type]: finishTime }
            };
        });

        // 4. Schedule Completion
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
        const marketMult = state.market?.factor || 1.0;
        const prestigeMult = state.prestige?.multiplier || 1.0;
        const revenuePerUnit = state.prices[type] * salesMult * marketMult * prestigeMult;
        // BUG-15 fix: Full heat multiplier matching production.js engine (heat_reduce + shadow_network + jet)
        const perkHeatReduc = Math.max(0.1, 1.0 - ((state.prestige?.perks?.heat_reduce || 0) * 0.05));
        const shadowReduc = Math.max(0.1, 1.0 - ((state.prestige?.perks?.shadow_network || 0) * 0.1));
        const jetReduc = (state.luxuryItems || []).includes('jet') ? 0.5 : 1.0;
        const heatMult = perkHeatReduc * shadowReduc * jetReduc;

        setState(prev => {
            const currentAmount = prev.inv[type] || 0;
            if (currentAmount < amount) return prev; // Hard atomic check inside state update

            const totalRevenue = revenuePerUnit * amount;

            // TIERED XP REWARDS — unified with auto-sell engine rates (BUG-07 fix)
            const tierXpRates = { 1: 0.15, 2: 0.05, 3: 0.005, 4: 0.001 };
            const itemTier = CONFIG.production[type]?.tier || 1;
            const xpRate = tierXpRates[itemTier] || 0.1;
            const xpGain = Math.floor(totalRevenue * xpRate);

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
