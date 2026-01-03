import { useCallback } from 'react';
import { CONFIG } from '../config/gameConfig';
import { playSound } from '../utils/audio';

export const usePremium = (gameState, setGameState, addLog) => {
    const buyPremiumItem = useCallback((itemId) => {
        const item = CONFIG.premiumItems.find(i => i.id === itemId);
        if (!item) return;

        // Check if player has enough diamonds
        if (gameState.diamonds < item.cost) {
            addLog(`Ikke nok Diamanter! Du mangler ${item.cost - gameState.diamonds}.`, 'error');
            return;
        }

        // Deduct diamonds
        setGameState(prev => {
            const newState = { ...prev, diamonds: prev.diamonds - item.cost };

            // Apply effect based on type
            switch (item.type) {
                case 'time':
                    // Time skip: Calculate offline earnings for X seconds
                    addLog(`Tidsmaskine aktiveret! Spol ${item.duration / 3600}t frem...`, 'success');
                    // Note: Would need to call calculateOfflineProgress here
                    break;

                case 'buff':
                    // Apply buff (e.g., Hype)
                    newState.activeBuffs = {
                        ...prev.activeBuffs,
                        [item.buff]: Date.now() + item.duration
                    };
                    addLog(`${item.name} aktiveret!`, 'success');
                    playSound('success');
                    break;

                case 'instant':
                    // Instant effect (e.g., clear heat)
                    if (item.effect === 'heat_0') {
                        newState.heat = 0;
                        addLog('Alt Heat fjernet! Du er ren igen.', 'success');
                        playSound('success');
                    }
                    break;

                case 'currency':
                    // Grant currency
                    newState.cleanCash = prev.cleanCash + item.value;
                    addLog(`Du modtog ${item.value.toLocaleString()} kr!`, 'success');
                    playSound('cash');
                    break;

                default:
                    break;
            }

            return newState;
        });

    }, [gameState, setGameState, addLog]);

    return { buyPremiumItem };
};
