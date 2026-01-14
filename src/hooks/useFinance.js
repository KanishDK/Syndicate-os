import { useMemo, useCallback } from 'react';
import { CONFIG } from '../config/gameConfig';
import { formatNumber } from '../utils/gameMath';
import { useLanguage } from '../context/LanguageContext';

export const useFinance = (state, setState, addLog, addFloat) => {
    const { t } = useLanguage();

    // --- CALCULATIONS ---

    const territoryAnnualIncome = useMemo(() => {
        let dirty = 0;
        let clean = 0;
        CONFIG.territories.forEach(t => {
            if (state.territories.includes(t.id)) {
                const level = state.territoryLevels?.[t.id] || 1;
                const dailyIncome = t.income * Math.pow(1.5, level - 1) * 86400;
                if (t.type === 'clean') clean += dailyIncome;
                else dirty += dailyIncome;
            }
        });
        return { dirty, clean };
    }, [state.territories, state.territoryLevels]);

    const cryptoValue = useMemo(() => {
        return Object.entries(state.crypto?.wallet || {}).reduce((acc, [coin, amount]) => {
            const price = state.crypto?.prices?.[coin] || CONFIG.crypto.coins[coin].basePrice;
            return acc + (amount * price);
        }, 0);
    }, [state.crypto]);

    const netWorth = useMemo(() => {
        let total = state.dirtyCash + state.cleanCash + cryptoValue;
        total += (state.bank?.savings || 0); // Include Bank Savings! (Missed this in previous step?)
        total -= (state.debt || 0);
        total += Object.entries(state.inventory || {}).reduce((acc, [id, count]) => acc + (count * CONFIG.production[id].baseRevenue), 0);
        total += Object.keys(state.luxury || {}).reduce((acc, id) => {
            const item = CONFIG.luxury[id];
            return acc + item.cost; // Simplified: item is guaranteed to exist here
        }, 0);
        total += Object.entries(state.defense || {}).reduce((acc, [id, count]) => acc + (count * CONFIG.defense[id].baseCost), 0);
        return total;
    }, [state.dirtyCash, state.cleanCash, cryptoValue, state.bank, state.debt, state.inventory, state.luxury, state.defense]);


    // --- ACTIONS ---

    const handleLaunder = useCallback((amount, inputRef) => {
        // If amount is passed as a factor (0.25, 0.5, 1.0) handled in component? 
        // No, the component usually passes factor, calculates raw amount, then calls logic.
        // Wait, in previous FinanceTab logic (lines 55-67 in view):
        // handleLaunder takes (e, factor). Calculates amount. Calls `launder(factor)`??
        // Line 61: `launder(factor)`.
        // So the OLD hook took `factor`.
        // My NEW hook in Step 707 implemented `handleLaunder` taking `(amount, inputRef)`.
        //
        // Let's standardise on passing explicit AMOUNT for purity, or keep factor if convenient.
        // I'll stick to AMOUNT to be explicit, but I need to check how I call it in FinanceTab.
        // In Step 707 I wrote: `handleLaunder(amount, inputRef)`.
        //
        // I will implement `launder` (renamed to keep consistency or stick to new name).
        // Let's use `handleLaunder` but expecting `amount` (calculated by UI).

        if (!amount || amount <= 0) return addLog(t('finance.actions.launder_error_amount'), "error");
        if (amount > state.dirtyCash) return addLog(t('finance.actions.launder_error_funds'), "error");

        const rate = CONFIG.launderingRate * (state.prestige?.multiplier || 1);
        const cleanAmount = amount * rate;

        setState(prev => ({
            ...prev,
            dirtyCash: prev.dirtyCash - amount,
            cleanCash: prev.cleanCash + cleanAmount,
            stats: { ...prev.stats, launderedTotal: (prev.stats?.launderedTotal || 0) + amount }
        }));

        addLog(`Hvidvasket ${formatNumber(amount)} kr (Sort) -> ${formatNumber(cleanAmount)} kr (Ren)`, "success");
        if (addFloat) addFloat(cleanAmount, "clean");
        if (inputRef && inputRef.current) inputRef.current.value = '';

    }, [state.dirtyCash, state.prestige, setState, addLog, addFloat, t]);

    const handleManualWash = useCallback(() => { // Removed 'e' arg, handled in UI
        const washPower = CONFIG.crypto.manualWashPower * (state.activeBuffs?.launder_click ? 5 : 1);
        if (state.dirtyCash < washPower) return;

        setState(prev => ({
            ...prev,
            dirtyCash: prev.dirtyCash - washPower,
            cleanCash: prev.cleanCash + (washPower * CONFIG.launderingRate)
        }));
    }, [state.dirtyCash, state.activeBuffs, setState]);

    const buyCrypto = useCallback((coinId, amount) => {
        const coin = CONFIG.crypto.coins[coinId];
        const price = state.crypto?.prices?.[coinId] || coin.basePrice;
        const totalCost = price * amount;

        if (state.cleanCash < totalCost) return addLog(t('finance.crypto.error_funds'), "error");

        setState(prev => ({
            ...prev,
            cleanCash: prev.cleanCash - totalCost,
            crypto: {
                ...prev.crypto,
                wallet: { ...prev.crypto.wallet, [coinId]: (prev.crypto.wallet?.[coinId] || 0) + amount }
            }
        }));
        addLog(`Købt ${amount} ${coin.symbol}`, "success");
    }, [state.cleanCash, state.crypto, setState, addLog, t]);

    const sellCrypto = useCallback((coinId, amount) => {
        if (!state.crypto?.wallet?.[coinId] || state.crypto.wallet[coinId] < amount) return addLog(t('finance.crypto.error_assets'), "error");

        const coin = CONFIG.crypto.coins[coinId];
        const price = state.crypto?.prices?.[coinId] || coin.basePrice;
        const totalValue = price * amount;

        setState(prev => ({
            ...prev,
            cleanCash: prev.cleanCash + totalValue,
            crypto: {
                ...prev.crypto,
                wallet: { ...prev.crypto.wallet, [coinId]: prev.crypto.wallet[coinId] - amount }
            }
        }));
        addLog(`Solgt ${amount} ${coin.symbol} for ${formatNumber(totalValue)} kr`, "success");
    }, [state.crypto, setState, addLog, t]);

    // --- BANKING & DEBT (Restored) ---

    const borrow = useCallback((amount) => {
        setState(prev => ({
            ...prev,
            cleanCash: prev.cleanCash + amount,
            debt: (prev.debt || 0) + amount
        }));
        addLog(`Lånte ${formatNumber(amount)} kr`, "success");
    }, [setState, addLog]);

    const repay = useCallback((amount) => {
        if (state.cleanCash < amount) return addLog("Ikke nok penge!", "error");

        setState(prev => ({
            ...prev,
            cleanCash: prev.cleanCash - amount,
            debt: Math.max(0, (prev.debt || 0) - amount)
        }));
        addLog(`Afbetalte ${formatNumber(amount)} kr på gæld`, "success");
    }, [state.cleanCash, setState, addLog]);

    const deposit = useCallback((amount) => {
        if (amount <= 0) return;
        if (state.cleanCash < amount) return addLog("Ikke nok penge!", "error");

        const maxSavings = (state.level || 1) * CONFIG.crypto.bank.maxSavingsFactor;
        const currentSavings = state.bank?.savings || 0;

        if (currentSavings + amount > maxSavings) return addLog(`Bank loft nået (Max: ${formatNumber(maxSavings)})`, "error");

        setState(prev => ({
            ...prev,
            cleanCash: prev.cleanCash - amount,
            bank: { ...prev.bank, savings: (prev.bank?.savings || 0) + amount }
        }));
        addLog(`Indsat ${formatNumber(amount)} kr i banken`, "success");
    }, [state.cleanCash, state.level, state.bank, setState, addLog]);

    const withdraw = useCallback((amount) => {
        const currentSavings = state.bank?.savings || 0;
        let actual = amount === 'max' ? currentSavings : amount;
        if (actual <= 0) return;
        if (actual > currentSavings) actual = currentSavings;

        setState(prev => ({
            ...prev,
            cleanCash: prev.cleanCash + actual,
            bank: { ...prev.bank, savings: (prev.bank?.savings || 0) - actual }
        }));
        addLog(`Hævet ${formatNumber(actual)} kr fra banken`, "success");
    }, [state.bank, setState, addLog]);

    return {
        netWorth,
        cryptoValue,
        territoryIncomeValue: territoryAnnualIncome,
        handleLaunder,
        handleManualWash,
        buyCrypto,
        sellCrypto,
        borrow,
        repay,
        deposit,
        withdraw
    };
};
