
import { CONFIG } from '../../config/gameConfig.js';
import { getPerkValue, fixFloat } from '../../utils/gameMath.js';

const getHeatMultiplier = (state) => {
    // 1% extra income per 10 heat (High Risk, High Reward)
    return 1 + (state.heat * CONFIG.economy.heatMultiplier);
};

export const processEconomy = (state, dt = 1, t = (k) => k) => {
    // MATH STABILITY: Sanitize inputs
    dt = Number.isFinite(dt) ? Math.max(0, dt) : 1;
    state.cleanCash = Number.isFinite(state.cleanCash) ? fixFloat(state.cleanCash) : 0;
    state.dirtyCash = Number.isFinite(state.dirtyCash) ? fixFloat(state.dirtyCash) : 0;
    state.heat = Number.isFinite(state.heat) ? fixFloat(Math.max(0, state.heat)) : 0;

    // 0. SULTAN'S MERCY (Bankruptcy Protection)
    if (state.cleanCash < 0 && state.level < 3 && !state.hasReceivedMercy) {
        state.cleanCash = 1000;
        state.hasReceivedMercy = true;
        state.logs = [{
            msg: t('logs.story.mercy'),
            type: 'success',
            time: new Date().toLocaleTimeString()
        }, ...state.logs].slice(0, 50);
    }

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

        // Safety Check
        if (!Number.isFinite(salaryCost)) salaryCost = 0;

        if (salaryCost > 0) {
            // Priority 1: Clean Cash
            if (state.cleanCash >= salaryCost) {
                state.cleanCash -= salaryCost;
                state.payroll.lastPaid = Date.now();
                state.payroll.isStriking = false;
                state.logs = [{ msg: t('logs.payroll.paid', { count: totalStaff, cost: salaryCost }), type: 'info', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
            }
            // Priority 2: Dirty Cash (Emergency Pay +50% Markup)
            else if (state.dirtyCash >= (salaryCost * CONFIG.payroll.emergencyMarkup)) {
                const emergencyCost = Math.floor(salaryCost * CONFIG.payroll.emergencyMarkup);
                state.dirtyCash -= emergencyCost;
                state.payroll.lastPaid = Date.now();
                state.payroll.isStriking = false;
                state.logs = [{ msg: t('logs.payroll.paid_dirty'), type: 'warning', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
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
                            title: t('logs.payroll.strike_title'),
                            msg: t('logs.payroll.strike_msg', { cost: salaryCost }),
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
    const bankInt = CONFIG.crypto.bank;
    if (Date.now() - (state.bank?.lastInterest || 0) > bankInt.interestInterval) {
        if (state.bank.savings > 0) {
            let interest = Math.floor(state.bank.savings * bankInt.interestRate);
            if (!Number.isFinite(interest)) interest = 0;

            if (interest > 0) {
                state.bank.savings += interest;
                state.logs = [{ msg: t('logs.bank.interest', { amount: interest.toLocaleString() }), type: 'success', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
            }
        }
        state.bank.lastInterest = Date.now();
    }

    // 1c. DEBT INTEREST (Loan Shark)
    // Charge 5% interest per "Game Day" (reset interval is same as Payroll for simplicity? Or separate?)
    // Let's use 600,000ms (10 mins) as "Interest Tick" for Loans to be annoying but fair.
    if (state.debt > 0 && Date.now() - (state.lastDebtInterest || 0) > 600000) {
        const interestRate = CONFIG.finance.debtInterest;
        const interestAmount = Math.ceil(state.debt * interestRate);

        // Auto-deduct from Clean Cash if available, else add to Debt
        if (state.cleanCash >= interestAmount) {
            state.cleanCash -= interestAmount;
            state.logs = [{ msg: t('logs.finance.debt_interest_paid', { amount: interestAmount }), type: 'warning', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
        } else {
            // Compound the debt
            state.debt += interestAmount;
            state.logs = [{ msg: t('logs.finance.debt_compounded', { amount: interestAmount }), type: 'error', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
        }
        state.lastDebtInterest = Date.now();
    }

    // 1c. TERRITORY PASSIVE INCOME
    CONFIG.territories.forEach(ter => {
        if (state.territories.includes(ter.id)) {
            const incomePerSecond = ter.income / 3600;
            const income = Math.floor(incomePerSecond * dt);

            if (income > 0) {
                if (ter.type === 'clean') {
                    state.cleanCash += income;
                    state.lastTick.clean += income;
                } else {
                    state.dirtyCash += income;
                    state.lastTick.dirty += income;
                }
                if (state.lifetime) {
                    const key = ter.type === 'clean' ? 'earnings' : 'dirtyEarnings';
                    state.lifetime[key] = (state.lifetime[key] || 0) + income;
                }
            }
        }
    });

    // 2. CRYPTO & MARKET TRENDS

    // A. Market Trends
    if (!state.market) state.market = { trend: 'neutral', duration: 0, multiplier: 1.0 };

    if (state.market.duration <= 0) {
        const roll = Math.random();
        let newTrend = 'neutral';
        let duration = CONFIG.market.duration.min + Math.floor(Math.random() * CONFIG.market.duration.range);

        if (roll < 0.2) newTrend = 'bear';
        else if (roll > 0.8) newTrend = 'bull';

        state.market.trend = newTrend;
        state.market.duration = duration;

        if (newTrend === 'bull') {
            state.market.multiplier = CONFIG.market.multipliers.bull;
            state.logs = [{ msg: t('logs.market.bull'), type: 'success', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
        } else if (newTrend === 'bear') {
            state.market.multiplier = CONFIG.market.multipliers.bear;
            state.logs = [{ msg: t('logs.market.bear'), type: 'error', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
        } else {
            state.market.multiplier = 1.0;
        }
    } else {
        state.market.duration -= dt;
    }

    // B. Crypto
    if (Math.random() < CONFIG.crypto.eventChance * dt) {
        const newPrices = { ...state.crypto.prices };
        Object.keys(newPrices).forEach(coin => {
            const conf = CONFIG.crypto.coins[coin];
            if (conf) {
                if (Math.random() < 0.05) {
                    const crashFactor = 0.5 + (Math.random() * 0.2);
                    newPrices[coin] = newPrices[coin] * crashFactor;
                    if (coin === 'bitcoin') {
                        state.logs = [{ msg: t('logs.crypto.crash_btc', { name: conf.name }), type: 'rival', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);

                        if (!state.activeBuffs) state.activeBuffs = {};
                        state.activeBuffs.cryptoCrash = Date.now() + 300000;

                        if (newPrices['ethereum']) {
                            newPrices['ethereum'] = newPrices['ethereum'] * 0.6;
                        }
                    } else {
                        state.logs = [{ msg: t('logs.crypto.dump', { name: conf.name }), type: 'error', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
                    }
                } else {
                    const change = (Math.random() - 0.5) * conf.volatility * (conf.basePrice * 0.2);
                    newPrices[coin] = Math.max(conf.basePrice * 0.1, Math.min(conf.basePrice * 5, newPrices[coin] + change));
                }
            }
        });
        state.crypto.prices = newPrices;

        if (!state.crypto.history) state.crypto.history = { bitcoin: [], ethereum: [], monero: [] };
        Object.keys(newPrices).forEach(coin => {
            const hist = state.crypto.history[coin] || [];
            hist.push(newPrices[coin]);
            if (hist.length > 20) hist.shift();
            state.crypto.history[coin] = hist;
        });
    }

    // C. Net Worth History
    if (Math.random() < 0.1 * dt) {
        if (!state.stats.history) state.stats.history = { netWorth: [] };
        if (!state.stats.history.netWorth) state.stats.history.netWorth = [];

        const netWorth = state.cleanCash + state.dirtyCash;

        state.stats.history.netWorth.push(netWorth);
        if (state.stats.history.netWorth.length > 30) state.stats.history.netWorth.shift();
    }

    // D. OMEGA REALISM
    Object.keys(state.prices).forEach(item => {
        const base = CONFIG.production[item]?.baseRevenue || 0;
        const stock = state.inv[item] || 0;

        if (stock > 500 && base > 1000) {
            state.prices[item] = Math.floor(base * 0.8);
        } else {
            state.prices[item] = base;
        }
    });

    // 3. LAUNDERING
    if (!state.payroll.isStriking && (state.staff.accountant > 0 || state.upgrades.deep_wash) && state.dirtyCash > 0) {
        const capacityMult = (state.upgrades.studio ? 1.5 : 1);
        const snitchMalus = state.informantActive ? 0.5 : 1.0;

        const efficiencyMult = ((state.upgrades.studio ? 1.2 : 1) + getPerkValue(state, 'laundering_mastery') + (state.upgrades.deep_wash ? 0.2 : 0)) * snitchMalus;

        const cleanPerAccountant = 250;
        const launderMult = 1 + getPerkValue(state, 'launder_speed');

        const deepWashCap = (state.upgrades.deep_wash ? 5000 : 0) * dt;
        const maxClean = (state.staff.accountant * cleanPerAccountant * dt * launderMult * capacityMult) + deepWashCap;
        let amountToClean = Math.min(state.dirtyCash, maxClean);

        amountToClean = Math.max(0, amountToClean);

        if (amountToClean > 0) {
            const cleanAmount = Math.floor(amountToClean * CONFIG.launderingRate * efficiencyMult);
            state.dirtyCash -= amountToClean;
            state.cleanCash += cleanAmount;
            state.stats.laundered += amountToClean;
            if (state.lifetime) {
                state.lifetime.laundered = (state.lifetime.laundered || 0) + amountToClean;
                state.lifetime.earnings = (state.lifetime.earnings || 0) + cleanAmount;
            }

            state.lastTick.dirty -= amountToClean;
            state.lastTick.clean += cleanAmount;
        }
    }

    return state;
};
