import { useCallback } from 'react';
import { CONFIG } from '../config/gameConfig';
import { playSound } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';

export const usePremium = (gameState, setGameState, addLog) => {
    const { t } = useLanguage();

    const buyPremiumItem = useCallback((itemId) => {
        const item = CONFIG.premiumItems.find(i => i.id === itemId);
        if (!item) return;

        // Check if player has enough diamonds
        if (gameState.diamonds < item.cost) {
            addLog(t('premium.logs.no_diamonds', { cost: item.cost - gameState.diamonds }), 'error');
            return;
        }

        // Deduct diamonds
        setGameState(prev => {
            const newState = { ...prev, diamonds: prev.diamonds - item.cost };

            // Apply effect based on type
            switch (item.type) {
                case 'time':
                    // Time skip: Calculate offline earnings for X seconds
                    addLog(t('premium.logs.time_warp', { hours: item.duration / 3600 }), 'success');
                    // Note: Would need to call calculateOfflineProgress here
                    break;

                case 'buff':
                    // Apply buff (e.g., Hype)
                    newState.activeBuffs = {
                        ...prev.activeBuffs,
                        [item.buff]: Date.now() + item.duration
                    };
                    addLog(t('premium.logs.activated', { name: t(item.name) }), 'success');
                    playSound('success');
                    break;

                case 'instant':
                    // Instant effect (e.g., clear heat)
                    if (item.effect === 'heat_0') {
                        newState.heat = 0;
                        addLog(t('premium.logs.heat_cleared'), 'success');
                        playSound('success');
                    }
                    break;

                case 'currency':
                    // Grant currency
                    newState.cleanCash = prev.cleanCash + item.value;
                    addLog(t('premium.logs.currency_received', { amount: item.value.toLocaleString() }), 'success');
                    playSound('cash');
                    break;

                default:
                    break;
            }

            return newState;
        });

    }, [gameState, setGameState, addLog, t]);

    return { buyPremiumItem };
};
