import { CONFIG } from '../../config/gameConfig';
import { defaultState } from '../../utils/initialState';

export const processEconomy = (state) => {
    // Reset Tick Tracker (Start of Tick)
    state.lastTick = { clean: 0, dirty: 0 };

    // 1. PAYROLL & SALARY
    if (Date.now() - (state.payroll?.lastPaid || 0) > CONFIG.payroll.salaryInterval) {
        let totalStaff = 0;
        let salaryCost = 0;
        Object.keys(CONFIG.staff).forEach(role => {
            const count = state.staff[role] || 0;
            const salary = CONFIG.staff[role].salary || 0;
            if (count > 0 && salary > 0) {
                totalStaff += count;
                salaryCost += count * salary;
            }
        });

        if (salaryCost > 0) {
            // Priority 1: Clean Cash
            if (state.cleanCash >= salaryCost) {
                state.cleanCash -= salaryCost;
                state.payroll.lastPaid = Date.now();
                state.payroll.isStriking = false;
                state.logs = [{ msg: `Betalte løn til ${totalStaff} ansatte (${salaryCost} kr.)`, type: 'info', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
            }
            // Priority 2: Dirty Cash (Emergency Pay +50% Markup)
            else if (state.dirtyCash >= (salaryCost * 1.5)) {
                const emergencyCost = Math.floor(salaryCost * 1.5);
                state.dirtyCash -= emergencyCost;
                state.payroll.lastPaid = Date.now();
                state.payroll.isStriking = false;
                state.logs = [{ msg: `Betalte løn med Sorte Penge (+50% straf)`, type: 'warning', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
            }
            // Fail: Strike
            else {
                state.payroll.isStriking = true;
                if (!state.pendingEvent && Math.random() < 0.1) {
                    state.pendingEvent = {
                        type: 'story',
                        data: { title: 'LØNNINGS DAG FEJLEDE', msg: `Dine ansatte strejker! De mangler ${salaryCost} kr. i løn.`, type: 'rival' }
                    };
                }
            }
        } else {
            state.payroll.lastPaid = Date.now();
        }
    }

    // 2. CRYPTO & MARKET TRENDS

    // A. Market Trends (Global Price Multiplier)
    // Initialize if missing (Migration safety)
    if (!state.market) state.market = { trend: 'neutral', duration: 0, multiplier: 1.0 };

    if (state.market.duration <= 0) {
        // Switch Trend
        const roll = Math.random();
        let newTrend = 'neutral';
        let duration = 30 + Math.floor(Math.random() * 60); // 30-90 sec

        if (roll < 0.2) newTrend = 'bear'; // 20%
        else if (roll > 0.8) newTrend = 'bull'; // 20%

        state.market.trend = newTrend;
        state.market.duration = duration;

        if (newTrend === 'bull') {
            state.market.multiplier = 1.3; // +30% Prices
            state.logs = [{ msg: "MAAAAARKEDET GÅR AMOK! Priserne stiger! (BULL MARKET)", type: 'success', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
        } else if (newTrend === 'bear') {
            state.market.multiplier = 0.7; // -30% Prices
            state.logs = [{ msg: "Markedet krakker! Priserne falder! (BEAR MARKET)", type: 'error', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
        } else {
            state.market.multiplier = 1.0;
        }
    } else {
        state.market.duration -= 1; // Tick down
    }

    // B. Crypto
    if (Math.random() < 0.1) {
        const newPrices = { ...state.crypto.prices };
        Object.keys(newPrices).forEach(coin => {
            const conf = CONFIG.crypto.coins[coin];
            if (conf) {
                if (Math.random() < 0.05) {
                    const crashFactor = 0.5 + (Math.random() * 0.2);
                    newPrices[coin] = newPrices[coin] * crashFactor;
                    if (coin === 'bitcoin') {
                        state.logs = [{ msg: `KRYPTO KRAK! ${conf.name} styrtdykker!`, type: 'error', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
                    }
                } else {
                    const change = (Math.random() - 0.5) * conf.volatility * (conf.basePrice * 0.2);
                    newPrices[coin] = Math.max(conf.basePrice * 0.1, Math.min(conf.basePrice * 5, newPrices[coin] + change));
                }
            }
        }
        });
    state.crypto.prices = newPrices;

    // Update History for Charts
    if (!state.crypto.history) state.crypto.history = { bitcoin: [], ethereum: [], monero: [] };
    Object.keys(newPrices).forEach(coin => {
        const hist = state.crypto.history[coin] || [];
        hist.push(newPrices[coin]);
        if (hist.length > 20) hist.shift(); // Keep last 20
        state.crypto.history[coin] = hist;
    });
}

// 3. LAUNDERING (Accountant)
if (!state.payroll.isStriking && state.staff.accountant > 0 && state.dirtyCash > 0) {
    const cleanPerAccountant = 250;
    const maxClean = state.staff.accountant * cleanPerAccountant;
    let amountToClean = Math.min(state.dirtyCash, maxClean);

    if (state.upgrades.studio) amountToClean = Math.floor(amountToClean * 1.5);

    if (amountToClean > 0) {
        const cleanAmount = Math.floor(amountToClean * CONFIG.launderingRate); // 0.70
        state.dirtyCash -= amountToClean;
        state.cleanCash += cleanAmount;
        state.stats.laundered += amountToClean;

        // Visual Track (Negative dirty, Positive clean)
        state.lastTick.dirty -= amountToClean;
        state.lastTick.clean += cleanAmount;
    }
}

// 4. TERRITORY INCOME
CONFIG.territories.forEach(t => {
    if (state.territories.includes(t.id)) {
        // Level Multiplier (1.5x per level)
        const level = state.territoryLevels?.[t.id] || 1;
        const levelMult = Math.pow(1.5, level - 1);

        const inc = Math.floor(t.income * levelMult * (state.prestige?.multiplier || 1));

        if (t.type === 'clean') {
            state.cleanCash += inc;
            state.lastTick.clean += inc;
        } else {
            state.dirtyCash += inc;
            state.lastTick.dirty += inc;
            if (state.heat < 100) state.heat += 0.05;
        }
        if (state.lifetime) state.lifetime.earnings += inc;
    }
});

return state;
};
