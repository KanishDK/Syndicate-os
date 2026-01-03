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
            // Legacy Bridge: Supports setState(prev => ...) and setState(obj)
            const update = action.payload;
            const newState = typeof update === 'function' ? update(state) : update;

            // Basic safety for shallow merges if the component sent a partial object (Risk!)
            // Currently App.jsx and hooks tend to send complete state or spread prev.
            // If they send a partial, this replaces state.
            // But setState in functional components replaces state anyway (unlike class this.setState).
            // So this behavior matches useState.
            return newState;
        }

        case 'ADD_FLOAT':
            return {
                ...state,
                floats: [...(state.floats || []).slice(-9), action.payload] // Keep max 10
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
