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



    const launder = useCallback((percent = 1.0) => {
        if (state.dirtyCash <= 0) return;

        // Verify amount
        const amountToRisk = Math.floor(state.dirtyCash * percent);
        if (amountToRisk <= 0) return;

        // RISK ANALYST: Add 5% chance of a "Bust" during laundering
        // If Crypto Crash is active: Risk is 15% (Risky!)
        const isCrash = state.activeBuffs?.cryptoCrash > Date.now();
        const bustChance = isCrash ? 0.15 : 0.05;

        if (Math.random() < bustChance) {
            addLog("POLITIET OVERVÅGEDE TRANSAKTIONEN! Du måtte dumpe pengene for at undslippe.", "error");
            setState(prev => ({
                ...prev,
                dirtyCash: prev.dirtyCash - amountToRisk, // Only lose what you put in
                heat: prev.heat + 25,
                logs: [{ msg: `RAZZIA FEJLET! Du mistede ${amountToRisk.toLocaleString()} sorte penge.`, type: 'error', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
            }));
            return;
        }

        let rate = CONFIG.launderingRate * (state.upgrades.studio ? 1.2 : 1);

        // PERK: Laundering Mastery
        const launderLevel = state.prestige?.perks?.laundering_mastery || 0;
        if (launderLevel > 0) {
            rate += (launderLevel * 0.05); // +5% per level
        }

        // During Crash: Laundering is "Cheaper" (Better Rate)
        // e.g. 0.70 becomes 0.85
        if (isCrash) rate += 0.15;

        // Cap at 1.0 to prevent infinite money glitch
        rate = Math.min(1.0, rate);

        const cleanAmount = Math.floor(amountToRisk * rate);

        setState(prev => ({
            ...prev,
            dirtyCash: prev.dirtyCash - amountToRisk,
            cleanCash: prev.cleanCash + cleanAmount,
            stats: { ...prev.stats, laundered: (prev.stats.laundered || 0) + amountToRisk },
            lifetime: prev.lifetime ? {
                ...prev.lifetime,
                laundered: (prev.lifetime.laundered || 0) + amountToRisk,
                earnings: (prev.lifetime.earnings || 0) + cleanAmount
            } : prev.lifetime,
            logs: [{ msg: `Hvidvaskede ${amountToRisk.toLocaleString()} kr. til ${cleanAmount.toLocaleString()} kr.`, type: 'success', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
        }));
    }, [state.dirtyCash, state.upgrades, state.activeBuffs, state.prestige, setState, addLog]);

    const borrow = useCallback((amount = 10000) => {
        // DEBT CAP: 5x Clean Cash + Base 50k
        const debtCap = 50000 + (state.cleanCash * 5);
        if (state.debt >= debtCap) {
            addLog(`Låne-hajen afviser dig! Betal din gæld først.`, 'error');
            return;
        }

        // Loan Shark Logic: 20% Base + (Hostility)% penalty
        const hostility = state.rival?.hostility || 0;
        const ratePercent = 20 + Math.floor(hostility / 4);
        const fee = Math.floor(amount * (ratePercent / 100)); // Dynamic Fee

        setState(prev => ({
            ...prev,
            cleanCash: prev.cleanCash + amount,
            debt: prev.debt + amount + fee,
            logs: [{ msg: `Lånte ${amount.toLocaleString()} kr. Gæld steg med ${(amount + fee).toLocaleString()} kr.`, type: 'warning', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
        }));
    }, [state.rival, setState]);

    const repay = useCallback((amount, useDirty = false) => {
        if (amount <= 0 || state.debt <= 0) return;
        const actualAmount = Math.min(state.debt, amount);

        // Check Affordability
        if (useDirty) {
            const cost = Math.floor(actualAmount * 1.5); // 50% Penalty
            if (state.dirtyCash < cost) {
                addLog(`Ikke nok Sorte Penge! Kræver ${cost.toLocaleString()} kr.`, 'error');
                return;
            }
            setState(prev => ({
                ...prev,
                dirtyCash: prev.dirtyCash - cost,
                debt: prev.debt - actualAmount,
                logs: [{ msg: `Afbetalte ${actualAmount.toLocaleString()} kr. med sorte midler (Kostede ${cost.toLocaleString()}).`, type: 'success', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
            }));
        } else {
            if (state.cleanCash < actualAmount) {
                addLog(`Ikke nok Rene Penge! Kræver ${actualAmount.toLocaleString()} kr.`, 'error');
                return;
            }
            setState(prev => ({
                ...prev,
                cleanCash: prev.cleanCash - actualAmount,
                debt: prev.debt - actualAmount,
                logs: [{ msg: `Afbetalte ${actualAmount.toLocaleString()} kr. på gælden.`, type: 'success', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
            }));
        }
    }, [state.debt, state.cleanCash, state.dirtyCash, setState, addLog]);

    return { paySalaries, launder, borrow, repay };
};
