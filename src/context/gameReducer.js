import { runGameTick } from '../features/engine/gameTick';

export const gameReducer = (state, action) => {
    switch (action.type) {
        case 'TICK':
            // Core Engine Tick
            return runGameTick(state);

        case 'SET_STATE':
            // Legacy Bridge: Supports setState(prev => ...) and setState(obj)
            const update = action.payload;
            const newState = typeof update === 'function' ? update(state) : update;

            // Basic safety for shallow merges if the component sent a partial object (Risk!)
            // Currently App.jsx and hooks tend to send complete state or spread prev.
            // If they send a partial, this replaces state.
            // But setState in functional components replaces state anyway (unlike class this.setState).
            // So this behavior matches useState.
            return newState;

        default:
            return state;
    }
};
