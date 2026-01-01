export const formatNumber = (num) => {
    if (num < 1000) return Math.floor(num);
    // Udvidet liste til at håndtere endgame (10^33+)
    const suffixes = ["", "k", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"];
    const suffixNum = Math.floor(("" + Math.floor(num)).length / 3);

    // Sikkerhedsnet hvis tallet er større end Decillioner
    if (suffixNum >= suffixes.length) return "MAX";

    let shortValue = parseFloat((suffixNum !== 0 ? (num / Math.pow(1000, suffixNum)) : num).toPrecision(3));
    if (shortValue % 1 !== 0) {
        shortValue = shortValue.toFixed(1);
    }
    return shortValue + suffixes[suffixNum];
};

export const getIncomePerSec = (state, config) => {
    let clean = 0;
    let dirty = 0;

    // Territory Income
    state.territories.forEach(tid => {
        const t = config.territories.find(ter => ter.id === tid);
        if (t) {
            const inc = t.income * (state.prestige?.multiplier || 1);
            if (t.type === 'clean') clean += inc;
            else dirty += inc;
        }
    });

    // Staff Flow (Min of Production vs Sales Limit)
    if (state.staff) {
        const s = state.staff;

        // Define Rates (Production vs Sales Chance per tick)
        // Hash Lys
        const p_hash = (s.junkie || 0) * 0.3 + (s.grower || s.gardener || 0) * 0.3;
        const s_hash = (s.pusher || 0) * 0.5;
        dirty += Math.min(p_hash, s_hash) * (config.production.hash_lys.baseRevenue || 35);

        // Pills
        const p_pills = (s.junkie || 0) * 0.15;
        const s_pills = (s.pusher || 0) * 0.5;
        dirty += Math.min(p_pills, s_pills) * (config.production.piller_mild.baseRevenue || 20);

        // Hash Moerk
        const p_moerk = (state.level >= 5 ? (s.grower || s.gardener || 0) * 0.2 : 0);
        const s_moerk = (s.distributor || 0) * 0.5;
        dirty += Math.min(p_moerk, s_moerk) * (config.production.hash_moerk.baseRevenue || 50);

        // Speed
        const p_speed = (state.level >= 10 ? (s.chemist || 0) * 0.1 : 0);
        const s_speed = (s.distributor || 0) * 0.4;
        dirty += Math.min(p_speed, s_speed) * (config.production.speed.baseRevenue || 1500);

        // Coke
        const p_coke = (state.level >= 15 ? (s.importer || 0) * 0.05 : 0);
        const s_coke = (s.trafficker || 0) * 0.4;
        dirty += Math.min(p_coke, s_coke) * (config.production.coke.baseRevenue || 32500);
    }

    return Math.floor(clean + dirty);
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
    return Math.floor(n);
};
