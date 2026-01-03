import { CONFIG } from '../../config/gameConfig';
import { processEconomy } from './economy';
import { processProduction } from './production';
import { processEvents } from './events';
import { processMissions } from './missions';
import { getDefaultState } from '../../utils/initialState';
import { playSound } from '../../utils/audio';

export const runGameTick = (prevState, dt = 1) => {
    // 1. Create Draft (Shallow Copy + Nested Objects)
    let s = {
        ...prevState,
        payroll: { ...prevState.payroll },
        staff: { ...prevState.staff },
        inv: { ...prevState.inv },
        stats: { ...prevState.stats, produced: { ...prevState.stats.produced } },
        crypto: { ...prevState.crypto, prices: { ...prevState.crypto.prices }, history: { ...prevState.crypto.history } },
        boss: { ...prevState.boss },
        rival: { ...prevState.rival },
        prestige: { ...prevState.prestige },
        lifetime: { ...prevState.lifetime, produced: { ...prevState.lifetime.produced } },
        upgrades: { ...prevState.upgrades },
        defense: { ...prevState.defense },
        territoryLevels: { ...prevState.territoryLevels },
        completedMissions: [...prevState.completedMissions],
        unlockedAchievements: [...prevState.unlockedAchievements],
        logs: prevState.logs
    };

    // 2. Run Systems
    s = processEconomy(s, dt);
    s = processProduction(s, dt);
    s = processMissions(s);
    s = processEvents(s, dt);

    // CRITICAL: Hardcore Wipe Check
    if (s.pendingEvent?.data?.hardcoreWipe) {
        return {
            ...getDefaultState(),
            settings: s.settings,
            pendingEvent: s.pendingEvent, // Keep the game over modal visible
            hardcore: true // Keep mode active
        };
    }

    // 3. Post-System Processing (Computed & Levelling)
    // Safety Cap preventing Infinity
    if (s.cleanCash > Number.MAX_SAFE_INTEGER) s.cleanCash = Number.MAX_SAFE_INTEGER;
    if (s.dirtyCash > Number.MAX_SAFE_INTEGER) s.dirtyCash = Number.MAX_SAFE_INTEGER;

    // Heat Cap (0-100)
    if (s.heat > 100) s.heat = 100;
    if (s.heat < 0) s.heat = 0;

    s.nextLevelXp = Math.floor(1000 * Math.pow(1.6, s.level));

    // Auto Level Up Logic
    if (s.xp >= s.nextLevelXp) {
        s.level += 1;
        s.nextLevelXp = Math.floor(1000 * Math.pow(1.6, s.level));
        s.logs = [{
            msg: `LEVEL OP! Du er nu Rank ${s.level}: ${CONFIG.levelTitles[s.level - 1] || 'Kingpin'}`,
            type: 'success',
            time: new Date().toLocaleTimeString()
        }, ...s.logs].slice(0, 50);
    }

    return s;
};
