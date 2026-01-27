import { useCombatActions } from './useCombatActions';
import { useEconomyActions } from './useEconomyActions';
import { useSystemActions } from './useSystemActions';

/**
 * FACADE HOOK: useGameActions
 * This hook aggregates domain-specific actions into a single API surface.
 * It replaces the previous "God Hook" monolithic structure.
 * 
 * - useCombatActions: Attack, Raid, Sabotage
 * - useEconomyActions: Bribes, Market, Shops
 * - useSystemActions: Save/Load, Prestige, Missions
 */
export const useGameActions = (gameState, setGameState, dispatch, addLog, triggerShake) => {

    // 1. Initialize Sub-Hooks
    const combat = useCombatActions(gameState, setGameState, addLog, triggerShake);
    const economy = useEconomyActions(gameState, setGameState, addLog);
    const system = useSystemActions(gameState, setGameState, addLog);

    // 2. Return Merged Interface
    return {
        ...combat,
        ...economy,
        ...system
    };
};
