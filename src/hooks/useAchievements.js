import { useEffect } from 'react';
import { CONFIG } from '../config/gameConfig';

export const useAchievements = (state, dispatch, addLog) => {
    useEffect(() => {
        if (!state) return;

        const unlocked = state.unlockedAchievements || [];

        CONFIG.achievements.forEach(ach => {
            if (unlocked.includes(ach.id)) return;

            let earned = false;
            const { type, val, item, coin } = ach.req;

            if (type === 'dirty' && (state.lifetime?.dirtyEarnings || 0) >= val) earned = true;
            if (type === 'clean' && (state.lifetime?.laundered || 0) >= val) earned = true;
            if (type === 'territory' && state.territories.length >= val) earned = true;
            if (type === 'prod' && (state.lifetime?.produced?.[item] || 0) >= val) earned = true;
            if (type === 'prestige' && (state.prestige?.level || 0) >= val) earned = true;
            if (type === 'crypto' && (state.crypto?.wallet?.[coin] || 0) >= val) earned = true;

            // Special: Untouchable (Zero Heat + High Cash)
            if (type === 'stealth' && state.heat === 0 && state.dirtyCash >= 1000000) earned = true;

            // Secrets
            if (type === 'clean_streak' && state.cleanCash >= val && state.dirtyCash === 0) earned = true;
            if (type === 'inventory' && Object.values(state.inv).reduce((a, b) => a + b, 0) >= val) earned = true;
            if (type === 'time' && (state.gameTime || 0) / 60 >= val) earned = true;

            if (earned) {
                dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: ach.id });
                addLog(`ACHIEVEMENT UNLOCKED: ${ach.name}!`, 'success');
            }
        });

    }, [
        state.unlockedAchievements?.length,
        state.lifetime?.earnings,
        state.lifetime?.laundered,
        state.territories.length,
        state.heat,
        state.dirtyCash,
        state.cleanCash,
        (state.stats.sold || 0)
    ]);
};
