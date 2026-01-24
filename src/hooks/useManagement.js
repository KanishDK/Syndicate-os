import { useCallback, useState } from 'react';
import { CONFIG } from '../config/gameConfig';
import { getBulkCost, getMaxAffordable } from '../utils/gameMath';
import { useLanguage } from '../context/LanguageContext';

export const useManagement = (state, setState, addLog) => {
    const { t } = useLanguage();
    const [expandedRole, setExpandedRole] = useState(null);

    const handleToggle = useCallback((role) => {
        setExpandedRole(prev => prev === role ? null : role);
    }, []);

    const buyStaff = useCallback((role, amount = 1) => {
        const item = CONFIG.staff[role];
        if (state.level < (item.reqLevel || 1)) {
            addLog(t('logs.staff.hire_level', { level: item.reqLevel, name: t(item.name) }), 'error');
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
                        logs: [{ msg: t('logs.staff.mole'), type: 'danger', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
                    }));
                }
            }

            addLog(t('logs.staff.hired', { amount: buyAmount, name: t(item.name), cost: totalCost.toLocaleString() }), 'success');
        } else {
            addLog(t('logs.staff.funds_error', { amount: buyAmount, name: t(item.name) }), 'error');
        }
    }, [state.level, state.staff, state.cleanCash, state.heat, state.informantActive, setState, addLog, t]);

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
            addLog(t('logs.staff.fired', { amount: finalRemove, name: t(CONFIG.staff[role].name) }), 'warning');
        }
    }, [state.staff, setState, addLog, t]);

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
            addLog(t('logs.upgrades.bought', { amount: buyAmount, name: t(item.name), cost: cost.toLocaleString() }), 'success');
        } else {
            addLog(t('logs.upgrades.funds_error', { amount: buyAmount, name: t(item.name) }), 'error');
        }
    }, [state.upgrades, state.cleanCash, setState, addLog, t]);

    const buyMastery = useCallback((id) => {
        const item = CONFIG.masteryPerks[id];
        if (!item) return;

        // Prevent double buy
        if (state.masteryPerks && state.masteryPerks[id]) {
            addLog(t('logs.mastery.already_owned'), 'warning');
            return;
        }

        const cost = item.cost;
        if ((state.diamonds || 0) >= cost) {
            setState(prev => ({
                ...prev,
                diamonds: (prev.diamonds || 0) - cost,
                masteryPerks: { ...prev.masteryPerks, [id]: true }
            }));
            addLog(t('logs.mastery.bought', { name: t(item.name) }), 'success');
        } else {
            addLog(t('logs.mastery.funds_error'), 'error');
        }
    }, [state.masteryPerks, state.diamonds, setState, addLog, t]);

    const buyPerk = useCallback((id) => {
        const item = CONFIG.perks[id];
        if (!item) return;

        const currentLevel = state.prestige?.perks?.[id] || 0;
        if (currentLevel >= (item.maxLevel || 10)) {
            addLog(t('logs.perks.max_level'), 'warning');
            return;
        }

        // Cost Calculation (Geometric)
        // reuse getBulkCost with amount 1
        const cost = getBulkCost(item.baseCost, item.costScale || 1.5, currentLevel, 1);
        const currency = state.prestige?.currency || 0;

        if (currency >= cost) {
            setState(prev => ({
                ...prev,
                prestige: {
                    ...prev.prestige,
                    currency: (prev.prestige.currency || 0) - cost,
                    perks: {
                        ...prev.prestige.perks,
                        [id]: currentLevel + 1
                    }
                }
            }));
            addLog(t('logs.perks.bought', { name: t(item.name) }), 'success');
        } else {
            addLog(t('logs.perks.funds_error'), 'error');
        }
    }, [state.prestige, setState, addLog, t]);



    return { buyStaff, fireStaff, buyUpgrade, buyMastery, buyPerk, expandedRole, handleToggle };
};
