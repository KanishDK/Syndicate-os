import { defaultState } from '../../utils/initialState';
import { processEconomy } from './economy';
import { processProduction } from './production';
import { processEvents } from './events';

export const runGameTick = (prevState) => {
    // 1. Create Draft (Shallow Copy + Nested Objects)
    let s = {
        ...prevState,
        payroll: { ...prevState.payroll },
        staff: { ...prevState.staff },
        inv: { ...prevState.inv },
        stats: { ...prevState.stats, produced: { ...prevState.stats.produced } },
        crypto: { ...prevState.crypto, prices: { ...prevState.crypto.prices } },
        boss: { ...prevState.boss },
        rival: { ...prevState.rival },
        prestige: prevState.prestige || defaultState.prestige,
        lifetime: prevState.lifetime || defaultState.lifetime
    };

    // 2. Run Systems
    s = processEconomy(s);
    s = processProduction(s);
    s = processEvents(s);

    return s;
};
