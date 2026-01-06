import { CONFIG } from '../config/gameConfig';

export const getPerkValue = (state, perkId) => {
    if (!state.prestige?.perks || !CONFIG.perks?.[perkId]) return 0;
    return (state.prestige.perks[perkId] || 0) * CONFIG.perks[perkId].val;
};

export const getMasteryEffect = (state, effectId) => {
    if (!state.masteryPerks) return 0;
    let total = 0;
    Object.keys(CONFIG.masteryPerks).forEach(id => {
        const perk = CONFIG.masteryPerks[id];
        if (perk.effect === effectId && state.masteryPerks[id]) {
            total += perk.val || 0;
        }
    });
    return total;
};

export const getHeatMultiplier = (state) => {
    // Perks: heat_reduce (-5% per level) & shadow_network (-10% per level)
    const reduction = getPerkValue(state, 'heat_reduce') + getPerkValue(state, 'shadow_network');
    return Math.max(0.1, 1 - reduction);
};

export const getMaxCapacity = (state) => {
    const warehouseLvl = state.upgrades?.warehouse || 1;
    const baseCap = 50;
    const mult = CONFIG.upgrades?.warehouse?.value || 2.0;
    // Formula: 50 * (2^level)
    // Lvl 1: 50 * 2 = 100
    // Lvl 2: 50 * 4 = 200
    // Lvl 3: 50 * 8 = 400
    return Math.floor(baseCap * Math.pow(mult, warehouseLvl));
};

// Module-level config for formatNumber (Singleton Pattern)
// This avoids prop-drilling 'settings' to every formatNumber call site
let CURRENT_FORMAT = 'standard';

export const setNumberFormat = (fmt) => {
    CURRENT_FORMAT = fmt;
};

export const formatNumber = (num) => {
    if (num === null || num === undefined || isNaN(num)) return "0";
    if (num < 1000) return Math.floor(num);

    if (CURRENT_FORMAT === 'scientific') {
        return Number(num).toExponential(2).replace('+', '');
    }

    // Use Log10 for robust suffix calculation (fixes 1e21+ scientific string bug)
    const suffixNum = Math.floor(Math.log10(num) / 3);
    const suffixes = ["", "k", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"];

    // Return scientific if beyond Decillion
    if (suffixNum >= suffixes.length) return Number(num).toExponential(2).replace('+', '');

    const shortValue = num / Math.pow(10, suffixNum * 3);
    let displayValue = parseFloat(shortValue.toPrecision(3));

    if (displayValue % 1 !== 0) {
        displayValue = displayValue.toFixed(1);
    }
    return displayValue + suffixes[suffixNum];
};

export const getIncomePerSec = (state) => {
    let clean = 0;
    let dirty = 0;

    const prestigeMult = state.prestige?.multiplier || 1;
    const marketMult = state.market?.multiplier || 1.0;
    const salesPerk = 1 + getPerkValue(state, 'sales_boost');
    const prodPerk = 1 + getPerkValue(state, 'prod_speed');

    // 1. Territory Income (Direct)
    CONFIG.territories.forEach(t => {
        if (state.territories.includes(t.id)) {
            const level = state.territoryLevels?.[t.id] || 1;
            const levelMult = Math.pow(1.5, level - 1);
            const inc = t.income * levelMult * prestigeMult;
            if (t.type === 'clean') clean += inc;
            else dirty += inc;
        }
    });

    // 2. Production & Sales Throughput
    // This is an ESTIMATE of Flow. We calculate Prod/sec and Sales/sec for each item.
    Object.keys(CONFIG.production).forEach(itemId => {
        const item = CONFIG.production[itemId];

        // Potential Production/sec
        let prodPerSec = 0;
        Object.entries(CONFIG.staff).forEach(([role, staffConf]) => {
            const count = state.staff[role] || 0;
            if (count > 0 && staffConf.role === 'producer' && staffConf.rates?.[itemId]) {
                prodPerSec += count * staffConf.rates[itemId] * prodPerk;
            }
        });

        // Apply specific building buffs (Approximate)
        if (itemId.includes('hash') || itemId.includes('skunk')) if (state.upgrades.hydro) prodPerSec *= 1.5;
        if (item.tier >= 2 && state.upgrades.lab) prodPerSec *= 1.5;

        // Potential Sales/sec
        let salesPerSec = 0;
        Object.entries(CONFIG.staff).forEach(([role, staffConf]) => {
            const count = state.staff[role] || 0;
            if (count > 0 && staffConf.role === 'seller' && staffConf.rates?.[itemId]) {
                salesPerSec += count * staffConf.rates[itemId] * salesPerk;
            }
        });

        // Heat Malus (Approximate)
        let heatMalus = state.heat >= 95 ? 0.2 : (state.heat >= 80 ? 0.5 : (state.heat >= 50 ? 0.8 : 1.0));
        salesPerSec *= heatMalus;

        // Hype Buff
        if (state.activeBuffs?.hype > Date.now()) salesPerSec *= 2;

        // Net Throughput
        const throughput = Math.min(prodPerSec, salesPerSec);
        dirty += throughput * item.baseRevenue * marketMult * prestigeMult;
    });

    // 3. Subtract Salaries (Approximate per sec)
    let salaryPerSec = 0;
    Object.keys(CONFIG.staff).forEach(role => {
        const count = state.staff[role] || 0;
        const salary = CONFIG.staff[role].salary || 0;
        salaryPerSec += (count * salary) / (CONFIG.payroll.salaryInterval / 1000);
    });

    // Salaries subtract from Clean if possible, otherwise Dirty
    if (clean >= salaryPerSec) clean -= salaryPerSec;
    else {
        const remainder = salaryPerSec - clean;
        clean = 0;
        dirty -= remainder;
    }

    return { total: clean + dirty, clean, dirty };
};

export const getBulkCost = (baseCost, costFactor, currentCount, amount) => {
    if (amount <= 0) return 0;
    if (costFactor === 1) return baseCost * amount;

    // Geometric Sum: a * (r^n - 1) / (r - 1)
    // First term 'a' is cost of next unit: Base * Factor^Count
    const firstTerm = baseCost * Math.pow(costFactor, currentCount);
    const total = firstTerm * (Math.pow(costFactor, amount) - 1) / (costFactor - 1);
    return Math.floor(total);
};

export const getMaxAffordable = (baseCost, costFactor, currentCount, budget) => {
    if (budget <= 0) return 0;
    // Cost of next unit
    const firstTerm = baseCost * Math.pow(costFactor, currentCount);

    if (firstTerm > budget) return 0;
    if (costFactor === 1) return Math.floor(budget / baseCost);

    // Solve for n: Budget >= a * (r^n - 1) / (r-1)
    // Budget * (r-1) / a + 1 >= r^n
    // n <= log(Budget * (r-1) / a + 1) / log(r)

    const n = Math.log(budget * (costFactor - 1) / firstTerm + 1) / Math.log(costFactor);
    return Math.max(0, Math.floor(n));
};
