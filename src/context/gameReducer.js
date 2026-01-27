import { runGameTick } from '../features/engine/gameTick';

export const gameReducer = (state, action) => {
    switch (action.type) {
        case 'TICK': {
            // Core Engine Tick
            // dt = delta time in seconds (e.g. 0.1)
            const dt = action.payload?.dt || 1;
            const t = action.payload?.t || ((k) => k);
            return runGameTick(state, dt, t);
        }

        case 'SET_STATE': {
            // Silicon Valley Patch: Validate state injections
            const update = action.payload;
            const newState = typeof update === 'function' ? update(state) : update;

            // Integrity Check: Prevent negative values or Infinity in core currencies
            // Integrity Check: Sanitize negative values or Infinity (OMEGA GUARD)
            // Fix: If state is corrupted (NaN), reset to 0 to prevent game lock (e.g. stalling buttons)
            if (!Number.isFinite(newState.cleanCash) || newState.cleanCash < 0) {
                console.warn(`OMEGA GUARD: Corrupted Clean Cash detected. Resetting to 0. Cause: ${action.type}`, newState.cleanCash);
                newState.cleanCash = 0;
            }
            if (!Number.isFinite(newState.dirtyCash) || newState.dirtyCash < 0) {
                console.warn(`OMEGA GUARD: Corrupted Dirty Cash detected. Resetting to 0. Cause: ${action.type}`, newState.dirtyCash);
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

        case 'TRIGGER_SHAKE':
            return { ...state, isShaking: true };

        case 'CLEAR_SHAKE':
            return { ...state, isShaking: false };

        case 'UNLOCK_ACHIEVEMENT':
            if (state.unlockedAchievements?.includes(action.payload)) return state;
            return {
                ...state,
                unlockedAchievements: [...(state.unlockedAchievements || []), action.payload]
            };

        case 'CRAFT_ITEM': {
            const { recipeId } = action.payload;
            const recipe = CONFIG.recipes[recipeId];
            if (!recipe) return state;

            // 1. Check Requirements (Items)
            const inputs = Object.entries(recipe.inputs);
            for (const [itemId, amount] of inputs) {
                if ((state.inv[itemId] || 0) < amount) return state; // Not enough mats
            }

            // 2. Check Capacity
            // Note: This matches produce logic. Assuming global cap check is handled in UI or here.
            // Let's do a strict check here.
            const totalItems = Object.entries(state.inv || {}).reduce((acc, [key, val]) => key === 'total' ? acc : acc + (typeof val === 'number' ? val : 0), 0);
            const maxCap = getMaxCapacity(state);
            if (totalItems + recipe.outputAmount > maxCap) {
                // Return Error or just ignore? Best to ignore for now, UI should disable button.
                return state;
            }

            // 3. Consume Inputs
            const newInv = { ...state.inv };
            inputs.forEach(([itemId, amount]) => {
                newInv[itemId] -= amount;
            });

            // 4. Add Output
            newInv[recipe.output] = (newInv[recipe.output] || 0) + recipe.outputAmount;

            // 5. Apply Heat
            const heatGain = recipe.heat || 0;
            const newHeat = state.heat + heatGain;

            // 6. Log it
            const newLogs = [{
                msg: `🧪 Crafted ${recipe.outputAmount}x ${t(recipe.name)}`,
                type: 'success',
                time: new Date().toLocaleTimeString()
            }, ...state.logs].slice(0, 50);

            return {
                ...state,
                inv: newInv,
                heat: newHeat,
                logs: newLogs
            };
        }

        case 'SPECIALIZE_TERRITORY': {
            const { territoryId, spec } = action.payload;
            const currentLevel = state.territoryLevels[territoryId] || 1;

            // Validation: Must own, be Lvl 5+, and not already spec'd
            if (!state.territories.find(t => t.id === territoryId)) return state;
            if (currentLevel < 5) return state;
            if (state.territorySpecs && state.territorySpecs[territoryId]) return state; // Already has spec

            return {
                ...state,
                territorySpecs: {
                    ...(state.territorySpecs || {}),
                    [territoryId]: spec
                }
            };
        }

        case 'READ_MANUAL':
            return {
                ...state,
                flags: {
                    ...(state.flags || {}),
                    readManual: true
                }
            };

        case 'COMPLETE_TUTORIAL':
            return {
                ...state,
                flags: {
                    ...(state.flags || {}),
                    tutorialComplete: true
                }
            };

        default:
            return state;
    }
};
