import React, { createContext, useContext, useReducer, useEffect, useMemo, useRef, useCallback } from 'react';
import { STORAGE_KEY, GAME_VERSION, CONFIG } from '../config/gameConfig';
import { defaultState } from '../utils/initialState';
import { gameReducer } from './gameReducer';
import { calculateOfflineProgress } from '../features/engine/offline';

const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
    // 1. Initializer with Offline Calculation
    const initializer = () => {
        let state = defaultState;
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

                state = {
                    ...defaultState,
                    ...parsed,
                    inv: { ...defaultState.inv, ...parsed.inv },
                    staff: { ...defaultState.staff, ...parsed.staff },
                    stats: { ...defaultState.stats, ...parsed.stats },
                    lifetime: {
                        ...defaultState.lifetime,
                        ...(parsed.lifetime || {}),
                        produced: { ...defaultState.lifetime.produced, ...(parsed.lifetime?.produced || {}) }
                    },
                    crypto: { ...defaultState.crypto, ...parsed.crypto, history: parsed.crypto?.history || {} }, // Safe history merge
                    unlockedAchievements: parsed.unlockedAchievements || defaultState.unlockedAchievements,
                    autoSell: parsed.autoSell || {},
                    prestige: { ...defaultState.prestige, ...parsed.prestige },
                    territoryLevels: parsed.territoryLevels || {},
                    upgrades: { ...defaultState.upgrades, ...parsed.upgrades },
                    hardcore: parsed.hardcore || false
                };
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

    // 2. Game Loop (Heartbeat) - 10Hz (100ms) for smooth updates
    useEffect(() => {
        const tickRate = 100; // 100ms
        let lastTime = Date.now();

        const interval = setInterval(() => {
            const now = Date.now();
            const dt = (now - lastTime) / 1000; // Delta in seconds (e.g., 0.1)

            // Sustain minimum 100ms dt to prevent spiral if lag occurs
            // But reset lastTime to now to keep sync
            if (dt > 0) {
                dispatch({ type: 'TICK', payload: { dt } });
            }
            lastTime = now;
        }, tickRate);

        return () => clearInterval(interval);
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
