
import { CONFIG } from '../../config/gameConfig';
import { getPerkValue } from '../../utils/gameMath';

export const processEconomy = (state, dt = 1) => {
    // Reset Tick Tracker (Start of Tick)
    state.lastTick = { clean: 0, dirty: 0 };

    // 1. PAYROLL & SALARY (Time-based, safe)
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
                state.logs = [{ msg: `Betalte løn til ${totalStaff} ansatte(${salaryCost} kr.)`, type: 'info', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
            }
            // Priority 2: Dirty Cash (Emergency Pay +50% Markup)
            else if (state.dirtyCash >= (salaryCost * 1.5)) {
                const emergencyCost = Math.floor(salaryCost * 1.5);
                state.dirtyCash -= emergencyCost;
                state.payroll.lastPaid = Date.now();
                state.payroll.isStriking = false;
                state.logs = [{ msg: `Betalte løn med Sorte Penge(+50 % straf)`, type: 'warning', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
            }
            // Fail: Strike
            else {
                state.payroll.isStriking = true;
                const now = Date.now();

                // Only alert once every 30 seconds
                if (!state.pendingEvent && (now - (state.payroll.lastStrikeAlert || 0) > 600000)) {
                    state.pendingEvent = {
                        type: 'story',
                        data: {
                            title: 'LØNNINGS DAG FEJLEDE',
                            msg: `Dine ansatte strejker! De mangler ${salaryCost} kr.i løn.Produktionen er sat på pause indtil de får penge via 'Finans' fanen eller ved at tjene nok.`,
                            type: 'rival'
                        }
                    };
                    state.payroll.lastStrikeAlert = now;
                }
            }
        } else {
            state.payroll.lastPaid = Date.now();
        }
    }

    // 1b. BANK INTEREST
    const bankInt = CONFIG.crypto.bank; // Access bank config under crypto for now or move it
    if (Date.now() - (state.bank?.lastInterest || 0) > bankInt.interestInterval) {
        if (state.bank.savings > 0) {
            const interest = Math.floor(state.bank.savings * bankInt.interestRate);
            if (interest > 0) {
                state.bank.savings += interest;
                state.logs = [{ msg: `Din opsparing har optjent ${interest.toLocaleString()} kr. i renter!`, type: 'success', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
            }
        }
        state.bank.lastInterest = Date.now();
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
        state.market.duration -= dt; // Tick down by delta time
    }

    // B. Crypto (Chance scaled by dt)
    // 0.1 chance per second = 0.1 * dt per tick
    if (Math.random() < 0.1 * dt) {
        const newPrices = { ...state.crypto.prices };
        Object.keys(newPrices).forEach(coin => {
            const conf = CONFIG.crypto.coins[coin];
            if (conf) {
                if (Math.random() < 0.05) {
                    const crashFactor = 0.5 + (Math.random() * 0.2);
                    newPrices[coin] = newPrices[coin] * crashFactor;
                    if (coin === 'bitcoin') {
                        // MAJOR EVENT: Blockchain Crash
                        // Trigger the specific news item from CONFIG if possible, or replicate it
                        state.logs = [{ msg: `📉 BLOCKCHAIN CRASH: ${conf.name} er i frit fald!`, type: 'rival', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);

                        // Activate Crypto Crash Buff (Cheap Laundering)
                        if (!state.activeBuffs) state.activeBuffs = {};
                        state.activeBuffs.cryptoCrash = Date.now() + 60000; // 1 Minute

                        // Domino Effect: Crash others too?
                        // Simple logic: if bitcoin crashes hard, ETH follows
                        if (newPrices['ethereum']) {
                            newPrices['ethereum'] = newPrices['ethereum'] * 0.6; // Heavy hit
                        }
                    } else {
                        state.logs = [{ msg: `KRYPTO DUMP: ${conf.name} taber værdi!`, type: 'error', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
                    }
                } else {
                    const change = (Math.random() - 0.5) * conf.volatility * (conf.basePrice * 0.2);
                    newPrices[coin] = Math.max(conf.basePrice * 0.1, Math.min(conf.basePrice * 5, newPrices[coin] + change));
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

    // C. Net Worth History (Track every ~10s for Graphs)
    // Using random check is fine: 0.1 probability * dt = 1/sec * dt? No.
    // Let's use a counter or just random check: 1/100 ticks = 1s?
    // Crypto logic is `Math.random() < 0.1 * dt`. Avg once per 10s.
    // I'll use separate check.
    if (Math.random() < 0.1 * dt) {
        if (!state.stats.history) state.stats.history = { netWorth: [] };
        if (!state.stats.history.netWorth) state.stats.history.netWorth = [];

        const netWorth = state.cleanCash + state.dirtyCash;

        state.stats.history.netWorth.push(netWorth);
        if (state.stats.history.netWorth.length > 30) state.stats.history.netWorth.shift();
    }

    // D. OMEGA REALISM: Commodity Volatility (Market Saturation)
    // Runs every tick to adjust prices based on supply
    Object.keys(state.prices).forEach(item => {
        const base = CONFIG.production[item]?.baseRevenue || 0;
        const stock = state.inv[item] || 0;

        // Saturation Threshold: 500 units for high tier
        if (stock > 500 && base > 1000) {
            // Flood penalty: -20% price
            state.prices[item] = Math.floor(base * 0.8);
        } else {
            // Normal Price (Restore if cleared)
            // Only restore if it was lowered, to avoid overriding other buffs? 
            // Currently prices are only modified here and by global multiplier. 
            // We set it to base, and production.js applies global multipliers.
            state.prices[item] = base;
        }
    });

    // 3. LAUNDERING (Accountant & Deep-Wash)
    if (!state.payroll.isStriking && (state.staff.accountant > 0 || state.upgrades.deep_wash) && state.dirtyCash > 0) {
        const capacityMult = (state.upgrades.studio ? 1.5 : 1);
        // OMEGA REALISM: Snitch Penalty (50% efficiency if mole is active)
        const snitchMalus = state.informantActive ? 0.5 : 1.0;

        const efficiencyMult = ((state.upgrades.studio ? 1.2 : 1) + getPerkValue(state, 'laundering_mastery') + (state.upgrades.deep_wash ? 0.2 : 0)) * snitchMalus;

        const cleanPerAccountant = 250;
        // Perk Multiplier: launder_speed (Regular)
        const launderMult = 1 + getPerkValue(state, 'launder_speed');

        const deepWashCap = (state.upgrades.deep_wash ? 5000 : 0) * dt;
        const maxClean = (state.staff.accountant * cleanPerAccountant * dt * launderMult * capacityMult) + deepWashCap;
        let amountToClean = Math.min(state.dirtyCash, maxClean);

        // Allow fractional cleaning (or accumulate)? For now, ceil/floor might lose precision if dt is small.
        // But amountToClean is usually large.
        // Let's use Math.floor but ensure at least 1 if >0 could happen? No, strict proportion is better.
        amountToClean = Math.max(0, amountToClean);

        if (amountToClean > 0) {
            const cleanAmount = Math.floor(amountToClean * CONFIG.launderingRate * efficiencyMult); // 0.70
            state.dirtyCash -= amountToClean;
            state.cleanCash += cleanAmount;
            state.stats.laundered += amountToClean;
            if (state.lifetime) {
                state.lifetime.laundered = (state.lifetime.laundered || 0) + amountToClean;
                state.lifetime.earnings = (state.lifetime.earnings || 0) + cleanAmount;
            }

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

            const inc = t.income * levelMult * (state.prestige?.multiplier || 1) * dt; // Scale Income

            if (t.type === 'clean') {
                state.cleanCash += inc;
                state.lastTick.clean += inc;
                if (state.lifetime) state.lifetime.earnings += inc;
            } else {
                state.dirtyCash += inc;
                state.lastTick.dirty += inc;
                if (state.lifetime) state.lifetime.dirtyEarnings = (state.lifetime.dirtyEarnings || 0) + inc;
                // Heat increase also scaled
                if (state.heat < 100) {
                    const heatMult = getHeatMultiplier(state);
                    state.heat += 0.05 * dt * heatMult;
                }
            }
        }
    });

    return state;
};
