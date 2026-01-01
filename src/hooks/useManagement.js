import { useCallback } from 'react';
import { CONFIG } from '../config/gameConfig';
import { getBulkCost, getMaxAffordable } from '../utils/gameMath';

export const useManagement = (state, setState, addLog) => {

    const buyStaff = useCallback((role, amount = 1) => {
        const item = CONFIG.staff[role];
        if (state.level < (item.reqLevel || 1)) {
            addLog(`Du skal være Level ${item.reqLevel} for at ansætte en ${item.name}!`, 'error');
            return;
        }

        const currentCount = state.staff[role] || 0;
        let buyAmount = amount;
        let totalCost = 0;

        if (amount === 'max') {
            buyAmount = getMaxAffordable(item.baseCost, item.costFactor, currentCount, state.cleanCash);
            if (buyAmount <= 0) buyAmount = 1; // Always try to buy 1 if max fails (logic will fail cost check below)
        }

        totalCost = getBulkCost(item.baseCost, item.costFactor, currentCount, buyAmount);

        if (state.cleanCash >= totalCost && buyAmount > 0) {
            setState(prev => ({
                ...prev,
                cleanCash: prev.cleanCash - totalCost,
                staff: { ...prev.staff, [role]: (prev.staff[role] || 0) + buyAmount },
            }));
            addLog(`Ansatte ${buyAmount}x ${item.name} for ${totalCost.toLocaleString()} kr.`, 'success');
        } else {
            addLog(`Ikke nok penge til ${buyAmount}x ${item.name}!`, 'error');
        }
    }, [state.level, state.staff, state.cleanCash, setState, addLog]);

    const fireStaff = useCallback((role) => {
        if (state.staff[role] > 0) {
            setState(prev => ({
                ...prev,
                staff: { ...prev.staff, [role]: prev.staff[role] - 1 }
            }));
            addLog(`Fyrede ${CONFIG.staff[role].name}. (Ingen refusion)`, 'warning');
        }
    }, [state.staff, setState, addLog]);

    const buyUpgrade = useCallback((id, amount = 1) => {
        const item = CONFIG.upgrades[id];
        const currentCount = state.upgrades[id] || 0;

        let buyAmount = amount;
        if (amount === 'max') {
            buyAmount = getMaxAffordable(item.baseCost, item.costFactor || 1.5, currentCount, state.cleanCash);
            if (buyAmount <= 0) buyAmount = 1;
        }

        const cost = getBulkCost(item.baseCost, item.costFactor || 1.5, currentCount, buyAmount);

        if (state.cleanCash >= cost && buyAmount > 0) {
            setState(prev => ({
                ...prev,
                cleanCash: prev.cleanCash - cost,
                upgrades: { ...prev.upgrades, [id]: (prev.upgrades[id] || 0) + buyAmount }
            }));
            addLog(`Købte ${buyAmount}x ${item.name} for ${cost.toLocaleString()} kr.`, 'success');
        } else {
            addLog(`Ikke nok penge til ${buyAmount}x ${item.name}!`, 'error');
        }
    }, [state.upgrades, state.cleanCash, setState, addLog]);



    return { buyStaff, fireStaff, buyUpgrade };
};
