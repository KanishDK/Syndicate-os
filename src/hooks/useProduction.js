import { useEffect, useState, useCallback } from 'react';
import { CONFIG } from '../config/gameConfig';

export const useProduction = (state, setState, addLog, addFloat) => {

    const produce = useCallback((type, event) => {
        const prod = CONFIG.production[type];
        if (state.isProcessing[type]) return;

        // Money Check
        const cost = prod.baseCost;
        if (state.cleanCash < cost) {
            addLog(`Ikke nok penge! Koster ${cost} kr.`);
            return;
        }

        // Capture rect immediately for floating text
        let floatData = null;
        if (event && addFloat) {
            const rect = event.currentTarget.getBoundingClientRect();
            floatData = {
                text: `+1 ${prod.name}`,
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2 - 20,
                color: `text-${prod.color}-400`
            };
        }

        // Optimistic UI update
        setState(prev => ({
            ...prev,
            cleanCash: prev.cleanCash - cost,
            isProcessing: { ...prev.isProcessing, [type]: true }
        }));

        const speedMult = Math.max(0.2, 1 - ((state.prestige?.perks?.prod_speed || 0) * 0.1));
        const processTime = prod.duration * speedMult * (
            (type === 'weed' && state.upgrades.hydro) ? 0.8 :
                (type === 'amf' && state.upgrades.lab) ? 0.8 :
                    1
        );

        setTimeout(() => {
            if (floatData && addFloat) {
                addFloat(floatData.text, floatData.x, floatData.y, floatData.color);
            }

            setState(prev => {
                const newCount = (prev.inv[type] || 0) + 1;
                const newProduced = (prev.stats.produced[type] || 0) + 1;

                return {
                    ...prev,
                    inv: { ...prev.inv, [type]: newCount },
                    stats: { ...prev.stats, produced: { ...prev.stats.produced, [type]: newProduced } },
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
            addLog(`Produktion færdig: 1 enhed ${prod.name}.`, 'success');
        }, processTime);
    }, [state.cleanCash, state.isProcessing, state.upgrades, state.prestige, addLog, addFloat, setState]);

    const handleSell = useCallback((type, amount, event) => {
        if ((state.inv[type] || 0) < amount) return;

        const salesMult = 1 + ((state.prestige?.perks?.sales_boost || 0) * 0.1);
        const revenue = state.prices[type] * amount * salesMult;

        const xpGain = Math.floor(revenue * 0.1);
        const heatMult = Math.max(0.5, 1 - ((state.prestige?.perks?.heat_reduce || 0) * 0.05));

        if (event && addFloat) {
            // Juice: +$$$ Float
            const rect = event.currentTarget.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2 - 20; // Float UP
            addFloat(`+${Math.floor(revenue).toLocaleString()} kr`, x, y, 'text-emerald-400 font-black text-xl');
        }

        setState(prev => ({
            ...prev,
            inv: { ...prev.inv, [type]: prev.inv[type] - amount },
            dirtyCash: prev.dirtyCash + revenue,
            heat: prev.heat + ((amount * 0.5) * heatMult),
            xp: prev.xp + xpGain,
            stats: { ...prev.stats, sold: prev.stats.sold + amount },
            lifetime: {
                ...prev.lifetime,
                dirtyEarnings: (prev.lifetime?.dirtyEarnings || 0) + revenue
            }
        }));

        addLog(`Solgte ${amount}x ${CONFIG.production[type].name} for ${revenue.toLocaleString()} kr. (+${xpGain} XP)`, 'success');
    }, [state.inv, state.prices, setState, addLog, addFloat]);

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
