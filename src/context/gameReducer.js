import { runGameTick } from '../features/engine/gameTick';

export const gameReducer = (state, action) => {
    switch (action.type) {
        case 'TICK': {
            // Core Engine Tick
            // dt = delta time in seconds (e.g. 0.1)
            const dt = action.payload?.dt || 1;
            return runGameTick(state, dt);
        }

        case 'SET_STATE': {
            // Silicon Valley Patch: Validate state injections
            const update = action.payload;
            const newState = typeof update === 'function' ? update(state) : update;

            // Integrity Check: Prevent negative values or Infinity in core currencies
            // Integrity Check: Sanitize negative values or Infinity (OMEGA GUARD)
            // Fix: If state is corrupted (NaN), reset to 0 to prevent game lock (e.g. stalling buttons)
            if (!Number.isFinite(newState.cleanCash) || newState.cleanCash < 0) {
                console.warn("OMEGA GUARD: Corrupted Clean Cash detected. Resetting to 0.", newState.cleanCash);
                newState.cleanCash = 0;
            }
            if (!Number.isFinite(newState.dirtyCash) || newState.dirtyCash < 0) {
                console.warn("OMEGA GUARD: Corrupted Dirty Cash detected. Resetting to 0.", newState.dirtyCash);
                newState.dirtyCash = 0;
            }

            return newState;
        }

        case 'ADD_FLOAT':
            // Optimization: Limit max floats to 10 and ensure we don't spam the DOM
            if ((state.floats || []).length > 20) return state;
            return {
                ...state,
                floats: [...(state.floats || []).slice(-19), action.payload]
            };

        case 'REMOVE_FLOAT':
            return {
                ...state,
                floats: (state.floats || []).filter(f => f.id !== action.payload)
            };

        case 'UNLOCK_ACHIEVEMENT':
            if (state.unlockedAchievements?.includes(action.payload)) return state;
            return {
                ...state,
                unlockedAchievements: [...(state.unlockedAchievements || []), action.payload]
            };

        default:
            return state;
    }
};
