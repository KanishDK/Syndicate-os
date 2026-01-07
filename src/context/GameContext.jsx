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
                // Try parsing as raw JSON first (Legacy)
                let parsed;
                if (saved.startsWith('{')) {
                    parsed = JSON.parse(saved);
                } else {
                    // Assume Base64 Encoded (New System)
                    parsed = JSON.parse(decodeURIComponent(escape(atob(saved))));
                }

                // MIGRATE
                state = checkAndMigrateSave(parsed);

            } catch (e) {
                console.error("Save corrupted", e);
            }
        }

        // Offline Logic
        if (state.lastSaveTime) {
            const { state: updatedState, report } = calculateOfflineProgress(state, Date.now());
            state = updatedState;
            if (report) {
                state.offlineReport = report;
                // Add Log
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

    // 2. Game Loop (Heartbeat) - Optimized for Mobile (RAF + Throttling)
    useEffect(() => {
        const tickRate = 100; // 100ms target (10 FPS logic)
        let lastTime = Date.now();
        let animationFrameId;

        const runGameTick = () => {
            const now = Date.now();
            const elapsed = now - lastTime;

            // Throttle: Only dispatch if enough time has passed
            if (elapsed >= tickRate) {
                // Calculate accurate dt (in seconds)
                const dt = elapsed / 1000;

                // Safety Cap: If backgrounded for long, don't simulate hours in one micro-tick (prevent freeze)
                // Cap at 1 second. Offline logic handles long absences.
                const safeDt = Math.min(dt, 1.0);

                dispatch({ type: 'TICK', payload: { dt: safeDt, t } });
                lastTime = now;
            }

            animationFrameId = requestAnimationFrame(runGameTick);
        };

        // Start Loop
        animationFrameId = requestAnimationFrame(runGameTick);

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    // 3. Auto-Save (Encoded) - Independent of tick-rate
    const stateRef = useRef(state);
    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    useEffect(() => {
        const saveInterval = setInterval(() => {
            const currentSaveState = stateRef.current;
            if (!currentSaveState) return;

            const saveState = { ...currentSaveState, lastSaveTime: Date.now() };
            // Remove ephemeral state before saving
            delete saveState.offlineReport;

            try {
                const stringified = JSON.stringify(saveState);
                const encoded = btoa(unescape(encodeURIComponent(stringified))); // Better string handling
                localStorage.setItem(STORAGE_KEY, encoded);
            } catch (e) {
                console.error("Save failed", e);
            }
        }, CONFIG.autoSaveInterval || 30000);

        // 5. Force Save on Close
        const handleUnload = () => {
            // Check if we are in the middle of a reset or import
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

    // 4. Helpers (Particles) - Memoized
    const addFloat = useCallback((text, x, y, color = 'text-white') => {
        const id = Date.now() + Math.random();
        dispatch({ type: 'ADD_FLOAT', payload: { id, text, x, y, color } });
        setTimeout(() => {
            dispatch({ type: 'REMOVE_FLOAT', payload: id });
        }, 800);
    }, []);

    const contextValue = useMemo(() => ({ state, dispatch, addFloat }), [state, addFloat]);

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
