import { defaultState } from '../../utils/initialState';
import { processEconomy } from './economy';
import { processProduction } from './production';
import { processEvents } from './events';
import { processMissions } from './missions';

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
        logs: [...prevState.logs]
    };

    // 2. Run Systems
    s = processEconomy(s, dt);
    s = processProduction(s, dt);
    s = processMissions(s);
    s = processEvents(s, dt);

    return s;
};
