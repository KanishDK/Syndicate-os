import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { STORAGE_KEY, GAME_VERSION, CONFIG } from '../config/gameConfig';
import { defaultState } from '../utils/initialState';
import { gameReducer } from './gameReducer';

const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
    // 1. Initializer with Offline Calculation
    const initializer = () => {
        let state = defaultState;
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                state = {
                    ...defaultState,
                    ...parsed,
                    inv: { ...defaultState.inv, ...parsed.inv },
                    items: { ...defaultState.items, ...parsed.items },
                    staff: { ...defaultState.staff, ...parsed.staff },
                    autoSell: parsed.autoSell || {},
                    prestige: parsed.prestige || defaultState.prestige
                };
            } catch (e) {
                console.error("Save corrupted", e);
            }
        }

        // Offline Logic
        if (state.lastSaveTime) {
            const now = Date.now();
            const diff = now - state.lastSaveTime;
            const minutes = Math.floor(diff / 60000);

            if (minutes >= 1) {
                let offlineDirty = 0;
                let offlineClean = 0;

                // Territories
                state.territories.forEach(tid => {
                    const t = CONFIG.territories.find(ter => ter.id === tid);
                    if (t) {
                        if (t.type === 'clean') offlineClean += (t.income * 60 * minutes);
                        else offlineDirty += (t.income * 60 * minutes);
                    }
                });

                // Staff
                let staffIncomePerSec = 0;
                if (state.staff) {
                    const hashPrice = CONFIG.production.hash_lys.baseRevenue || 5;
                    const moerkPrice = CONFIG.production.hash_moerk.baseRevenue || 45;
                    const speedPrice = CONFIG.production.speed.baseRevenue || 140;

                    staffIncomePerSec += (state.staff.junkie || 0) * 0.3 * hashPrice;
                    staffIncomePerSec += (state.staff.grower || state.staff.gardener || 0) * 0.2 * moerkPrice;
                    staffIncomePerSec += (state.staff.chemist || 0) * 0.1 * speedPrice;
                }

                // Calculate Salary Cost
                let salaryPerMinute = 0;
                Object.keys(CONFIG.staff).forEach(role => {
                    salaryPerMinute += (state.staff[role] || 0) * (CONFIG.staff[role].salary || 0);
                });
                const totalSalaryCost = salaryPerMinute * minutes;

                const interest = Math.floor((state.debt || 0) * 0.01 * minutes);
                const totalRate = (offlineDirty + offlineClean) / (minutes * 60) + staffIncomePerSec;
                const totalOfflineEarnings = Math.floor(totalRate * minutes * 60 * 0.5); // 50% Efficiency before expenses

                // Net Calculation
                let netEarings = totalOfflineEarnings;
                let netClean = offlineClean - totalSalaryCost;

                // Handle Deficits (Fallback to Dirty for Salary)
                if (netClean < 0) {
                    const deficit = Math.abs(netClean);
                    netClean = 0;
                    netEarings -= Math.floor(deficit * 1.5); // 50% penalty for dirty salary
                }

                if (netEarings > 0 || netClean > 0 || interest > 0) {
                    state.dirtyCash += Math.max(0, netEarings); // Prevent debt from earnings
                    state.cleanCash += netClean;
                    state.debt += interest;
                    state.logs = [{ msg: `Velkommen tilbage! Netto Indtjening: ${Math.max(0, netEarings).toLocaleString()} kr. Lønninger betalt.`, type: 'success', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);

                    // Store report for UI
                    state.offlineReport = {
                        time: minutes,
                        earnings: Math.max(0, netEarings),
                        interest: interest,
                        salaryPaid: totalSalaryCost
                    };
                }
            }
        }

        return state;
    };

    const [state, dispatch] = useReducer(gameReducer, null, initializer);

    // 2. Game Loop (Heartbeat)
    useEffect(() => {
        const tickRate = 1000;
        const interval = setInterval(() => {
            dispatch({ type: 'TICK' });
        }, tickRate);
        return () => clearInterval(interval);
    }, []);

    // 3. Auto-Save
    useEffect(() => {
        const saveInterval = setInterval(() => {
            const saveState = { ...state, lastSaveTime: Date.now() };
            // Remove ephemeral state before saving
            delete saveState.offlineReport;

            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(saveState));
            } catch (e) {
                console.error("Save failed", e);
            }
        }, CONFIG.autoSaveInterval || 30000);

        return () => clearInterval(saveInterval);
    }, [state]);

    return (
        <GameContext.Provider value={{ state, dispatch }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGame must be used within a GameProvider");
    }
    return context;
};
