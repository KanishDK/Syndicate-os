/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useReducer, useEffect, useMemo, useRef, useCallback } from 'react';
import { useLanguage } from './LanguageContext';
import { STORAGE_KEY, GAME_VERSION, CONFIG } from '../config/gameConfig';
import { getDefaultState, checkAndMigrateSave } from '../utils/initialState';
import { gameReducer } from './gameReducer';
import { calculateOfflineProgress } from '../features/engine/offline';

const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
    const { t } = useLanguage();

    // 1. Initializer with Offline Calculation
    const initializer = () => {
        let state = getDefaultState();
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved) {
            try {
                let parsed;
                if (saved.startsWith('{')) {
                    parsed = JSON.parse(saved);
                } else {
                    parsed = JSON.parse(decodeURIComponent(escape(atob(saved))));
                }
                state = checkAndMigrateSave(parsed);
            } catch (e) {
                console.error("Save corrupted", e);
            }
        }

        if (state.lastSaveTime) {
            const { state: updatedState, report } = calculateOfflineProgress(state, Date.now());
            state = updatedState;
            if (report) {
                state.offlineReport = report;
                state.logs = [{
                    msg: `Velkommen tilbage! Netto Indtjening: ${Math.floor(report.earnings + report.cleanEarnings).toLocaleString()} kr.`,
                    type: 'success',
                    time: new Date().toLocaleTimeString()
                }, ...state.logs].slice(0, 50);
            }
        }
        return state;
    };

    const [state, dispatch] = useReducer(gameReducer, null, initializer);

    // 2. Game Loop
    useEffect(() => {
        const tickRate = 100;
        let lastTime = Date.now();
        let animationFrameId;

        const runGameTick = () => {
            const now = Date.now();
            const elapsed = now - lastTime;
            if (elapsed >= tickRate) {
                const dt = elapsed / 1000;
                const safeDt = Math.min(dt, 1.0);
                dispatch({ type: 'TICK', payload: { dt: safeDt, t } });
                lastTime = now;
            }
            animationFrameId = requestAnimationFrame(runGameTick);
        };
        animationFrameId = requestAnimationFrame(runGameTick);
        return () => cancelAnimationFrame(animationFrameId);
    }, [t]);

    // 3. Auto-Save
    const stateRef = useRef(state);
    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    useEffect(() => {
        const saveInterval = setInterval(() => {
            const currentSaveState = stateRef.current;
            if (!currentSaveState) return;
            const saveState = { ...currentSaveState, lastSaveTime: Date.now() };
            delete saveState.offlineReport;
            try {
                const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(saveState))));
                localStorage.setItem(STORAGE_KEY, encoded);
            } catch (e) {
                console.error("Save failed", e);
            }
        }, CONFIG.autoSaveInterval || 30000);

        const handleUnload = () => {
            if (window.__syndicate_os_resetting) return;
            const currentSaveState = stateRef.current;
            if (!currentSaveState) return;
            const saveState = { ...currentSaveState, lastSaveTime: Date.now() };
            try {
                const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(saveState))));
                localStorage.setItem(STORAGE_KEY, encoded);
            } catch (e) {
                console.error("Critical Save Failed", e);
            }
        };
        window.addEventListener('beforeunload', handleUnload);
        return () => {
            clearInterval(saveInterval);
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, []);

    // 5. Expose state to AutoPilot (Development/QA only)
    // 5. Expose state to AutoPilot (Development/QA only)

    // A: Keep window.__GAME_STATE__ fresh
    useEffect(() => {
        if (import.meta.env.DEV || window.location.hostname === 'localhost') {
            window.__GAME_STATE__ = state;
        }
    }, [state]);

    // B: Define static helpers once
    useEffect(() => {
        if (import.meta.env.DEV || window.location.hostname === 'localhost') {
            window.__GAME_CONFIG__ = CONFIG;
            window.__GAME_DISPATCH__ = dispatch;

            // Expose setState for AutoPilot to use SimActions pattern
            window.__GAME_SET_STATE__ = (newStateOrFn) => {
                dispatch({
                    type: 'SET_STATE',
                    payload: newStateOrFn
                });
            };
        }
    }, [dispatch]); // Removed 'state' dependency causing infinite re-definition loop

    // 4. Helpers
    const addFloat = useCallback((text, x, y, color = 'text-white') => {
        const id = Date.now() + Math.random();
        dispatch({ type: 'ADD_FLOAT', payload: { id, text, x, y, color } });
        setTimeout(() => {
            dispatch({ type: 'REMOVE_FLOAT', payload: id });
        }, 800);
    }, [dispatch]);

    const triggerShake = useCallback(() => {
        dispatch({ type: 'TRIGGER_SHAKE' });
        setTimeout(() => {
            dispatch({ type: 'CLEAR_SHAKE' });
        }, 150);
    }, [dispatch]);

    const contextValue = useMemo(() => ({ state, dispatch, addFloat, triggerShake }), [state, dispatch, addFloat, triggerShake]);

    return (
        <GameContext.Provider value={contextValue}>
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
