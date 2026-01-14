import { useCallback } from 'react';
import { CONFIG } from '../config/gameConfig';
import { getBulkCost, getMaxAffordable } from '../utils/gameMath';
import { useLanguage } from '../context/LanguageContext';

export const useRivals = (state, setState, addLog) => {
    const { t } = useLanguage();

    const buyDefense = useCallback((id, amount) => {
        const item = CONFIG.defense[id];
        const currentCount = state.defense[id] || 0;

        let actualAmount = amount === 'max' ? getMaxAffordable(item.baseCost, item.costFactor, currentCount, state.cleanCash) : amount;
        if (actualAmount <= 0) return;

        const cost = getBulkCost(item.baseCost, item.costFactor, currentCount, actualAmount);

        if (state.cleanCash >= cost) {
            setState(prev => ({
                ...prev,
                cleanCash: prev.cleanCash - cost,
                defense: { ...prev.defense, [id]: (prev.defense[id] || 0) + actualAmount }
            }));
            addLog(`${t('rivals.buy')} ${actualAmount}x ${t(`rivals_interactive.defense.${id}.name`)}`, 'success');
        }
    }, [state.cleanCash, state.defense, setState, addLog, t]);

    const findRival = useCallback((input) => {
        if (!input || input.trim() === '') {
            addLog(t('rivals_interactive.wars.error_empty'), "error");
            return false;
        }

        try {
            const data = JSON.parse(atob(input));

            // Validation: Check required fields
            if (!data.n || !data.s || !data.l) {
                throw new Error("Manglende data felter");
            }

            // Sanity checks
            if (typeof data.l !== 'number' || data.l < 1 || data.l > 100) {
                throw new Error("Ugyldigt level");
            }
            if (typeof data.s !== 'number' || data.s < 0 || data.s > 200) {
                throw new Error("Ugyldig styrke");
            }
            if (typeof data.n !== 'string' || data.n.length > 50) {
                throw new Error("Ugyldigt navn");
            }

            // Apply rival
            setState(prev => ({
                ...prev,
                rival: {
                    ...prev.rival,
                    name: data.n,
                    strength: Math.min(100, Math.max(0, data.s)),
                    level: data.l
                }
            }));
            addLog(`${t('rivals_interactive.wars.search_success', { name: data.n, level: data.l })}`, 'success');
            return true;
        } catch {
            addLog(t('rivals_interactive.wars.error_invalid'), "error");
            return false;
        }
    }, [setState, addLog, t]);

    return {
        buyDefense,
        findRival
    };
};
