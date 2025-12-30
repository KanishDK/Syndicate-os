import { useCallback } from 'react';
import { CONFIG } from '../config/gameConfig';

export const useFinance = (state, setState, addLog) => {

    const paySalaries = useCallback(() => {
        let totalStaff = 0;
        let cost = 0;

        Object.keys(CONFIG.staff).forEach(role => {
            const count = state.staff[role] || 0;
            const salary = CONFIG.staff[role].salary || 0;
            if (count > 0 && salary > 0) {
                totalStaff += count;
                cost += count * salary;
            }
        });

        if (state.cleanCash < cost) return;

        setState(prev => ({
            ...prev,
            cleanCash: prev.cleanCash - cost,
            payroll: { ...prev.payroll, lastPaid: Date.now(), isStriking: false },
            logs: [{ msg: `Betalte løn til ${totalStaff} ansatte (${cost} kr.)`, type: 'success', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
        }));
    }, [state.cleanCash, state.staff, setState]);

    const launder = useCallback(() => {
        if (state.dirtyCash <= 0) return;

        // RISK ANALYST: Add 5% chance of a "Bust" during laundering
        if (Math.random() < 0.05) {
            addLog("POLITIET OVERVÅGEDE TRANSAKTIONEN! Du måtte dumpe pengene for at undslippe.", "error");
            setState(prev => ({
                ...prev,
                dirtyCash: 0,
                heat: prev.heat + 25,
                logs: [{ msg: `RAZZIA FEJLET! Du mistede ${prev.dirtyCash.toLocaleString()} sorte penge.`, type: 'error', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
            }));
            return;
        }

        const rate = CONFIG.launderingRate * (state.upgrades.studio ? 1.2 : 1);
        const cleanAmount = Math.floor(state.dirtyCash * rate);

        setState(prev => ({
            ...prev,
            dirtyCash: 0,
            cleanCash: prev.cleanCash + cleanAmount,
            stats: { ...prev.stats, laundered: (prev.stats.laundered || 0) + cleanAmount },
            logs: [{ msg: `Hvidvaskede ${prev.dirtyCash.toLocaleString()} kr. til ${cleanAmount.toLocaleString()} kr.`, type: 'success', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
        }));
    }, [state.dirtyCash, state.upgrades, setState, addLog]);

    const borrow = useCallback(() => {
        const amount = 10000;
        const fee = amount * 0.20; // 20% Fee

        setState(prev => ({
            ...prev,
            cleanCash: prev.cleanCash + amount,
            debt: prev.debt + amount + fee,
            logs: [{ msg: `Lånte ${amount.toLocaleString()} kr. Gæld steg med ${(amount + fee).toLocaleString()} kr.`, type: 'warning', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
        }));
    }, [setState]);

    const repay = useCallback(() => {
        const amount = Math.min(state.debt, 25000);
        if (state.cleanCash < amount) return;

        setState(prev => ({
            ...prev,
            cleanCash: prev.cleanCash - amount,
            debt: prev.debt - amount,
            logs: [{ msg: `Afbetalte ${amount.toLocaleString()} kr. på gælden.`, type: 'success', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
        }));
    }, [state.debt, state.cleanCash, setState]);

    return { paySalaries, launder, borrow, repay };
};
