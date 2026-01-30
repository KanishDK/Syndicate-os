import { CONFIG } from '../../config/gameConfig.js';

export const processAchievements = (state) => {
    if (!state.unlockedAchievements) state.unlockedAchievements = [];

    CONFIG.achievements.forEach(ach => {
        if (state.unlockedAchievements.includes(ach.id)) return;

        let unlocked = false;
        const req = ach.req;

        switch (req.type) {
            case 'dirty':
                if (state.dirtyCash >= req.val) unlocked = true;
                break;
            case 'clean':
                if (state.stats.laundered >= req.val) unlocked = true;
                break;
            case 'territory':
                if (state.territories.length >= req.val) unlocked = true;
                break;
            case 'prod':
                if ((state.stats.produced[req.item] || 0) >= req.val) unlocked = true;
                break;
            case 'prestige':
                if ((state.prestige?.level || 0) >= req.val) unlocked = true;
                break;
            case 'crypto':
                if ((state.crypto?.wallet[req.coin] || 0) >= req.val) unlocked = true;
                break;
            case 'stealth':
                if (state.heat <= 0 && state.cleanCash >= 1000000) unlocked = true;
                break;
            case 'clean_streak':
                if (state.cleanCash >= req.val && state.dirtyCash <= 0) unlocked = true;
                break;
            case 'inventory':
                const totalItems = Object.values(state.inv).reduce((a, b) => {
                    return typeof b === 'number' ? a + b : a;
                }, 0);
                if (totalItems >= req.val) unlocked = true;
                break;
            case 'time':
                if ((state.stats.playTime || 0) >= req.val) unlocked = true;
                break;
            case 'liquid_clean':
                if (state.cleanCash >= req.val) unlocked = true;
                break;
            case 'net_worth':
                const netWorth = state.cleanCash + state.dirtyCash;
                if (netWorth >= req.val) unlocked = true;
                break;
        }

        if (unlocked) {
            state.unlockedAchievements.push(ach.id);
            state.diamonds = (state.diamonds || 0) + (ach.reward || 0);

            // Add a log entry for the achievement
            state.logs = [{
                msg: `🏆 BEDRIFT LÅST OP: ${ach.id}`,
                type: 'success',
                time: new Date().toLocaleTimeString()
            }, ...state.logs].slice(0, 50);
        }
    });

    return state;
};
