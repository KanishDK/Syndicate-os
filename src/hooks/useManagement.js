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
            setState(prev => {
                const newStaffCount = (prev.staff[role] || 0) + buyAmount;
                const hiredDates = { ...prev.staffHiredDates };

                // Set hire date if this is the first staff of this role
                if (!prev.staff[role] || prev.staff[role] === 0) {
                    hiredDates[role] = Date.now();
                }

                return {
                    ...prev,
                    cleanCash: prev.cleanCash - totalCost,
                    staff: { ...prev.staff, [role]: newStaffCount },
                    staffHiredDates: hiredDates
                };
            });

            // Mulvarpe (The Mole) Risk Checker
            if (state.heat > 80 && !state.informantActive) {
                // 5% chance per hire action (not per unit, to keep it simple but risky)
                if (Math.random() < 0.05) {
                    setState(prev => ({
                        ...prev,
                        informantActive: true,
                        logs: [{ msg: `⚠️ MULVARPE: En nyansat stakker har infiltreret operationen! Hvidvaskning er kompromitteret!`, type: 'danger', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
                    }));
                }
            }

            addLog(`Ansatte ${buyAmount}x ${item.name} for ${totalCost.toLocaleString()} kr.`, 'success');
        } else {
            addLog(`Ikke nok penge til ${buyAmount}x ${item.name}!`, 'error');
        }
    }, [state.level, state.staff, state.cleanCash, setState, addLog]);

    const fireStaff = useCallback((role, amount = 1) => {
        const currentCount = state.staff[role] || 0;
        if (currentCount <= 0) return;

        let removeAmount = amount;
        if (amount === 'max') removeAmount = currentCount;

        // Ensure we don't fire more than we have
        const finalRemove = Math.min(currentCount, removeAmount);

        if (finalRemove > 0) {
            setState(prev => {
                const newStaffCount = (prev.staff[role] || 0) - finalRemove;
                const hiredDates = { ...prev.staffHiredDates };

                // Clear hire date if all staff of this role are fired
                if (newStaffCount <= 0) {
                    delete hiredDates[role];
                }

                return {
                    ...prev,
                    staff: { ...prev.staff, [role]: newStaffCount },
                    staffHiredDates: hiredDates
                };
            });
            addLog(`Fyrede ${finalRemove}x ${CONFIG.staff[role].name}. (Ingen refusion)`, 'warning');
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
