import { CONFIG } from '../config/gameConfig.js';

export const getDistrictBonuses = (state) => {
    const bonuses = {
        costMult: {}, // itemId -> mult
        bribeMult: 1,
        speedMult: 1,
    };

    if (!state.territories || !CONFIG.districts) return bonuses;

    Object.entries(CONFIG.districts).forEach(([id, district]) => {
        const owned = district.req.every(reqId => state.territories.includes(reqId));
        if (owned) {
            const effect = district.effect;
            if (effect.type === 'cost') {
                bonuses.costMult[effect.target] = effect.value;
            } else if (effect.type === 'bribe_cost') {
                bonuses.bribeMult *= effect.value;
            } else if (effect.type === 'global_speed') {
                bonuses.speedMult *= effect.value;
            }
        }
    });

    return bonuses;
};

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
    const perkRed = getPerkValue(state, 'heat_reduce') + getPerkValue(state, 'shadow_network');

    // Territory Specialization Bonus (Front: -30% (0.3) heat gain effectively) applied to MULTIPLIER
    // NOTE: Spec says "-30% heat generation from THIS territory" but heat is global.
    // Implementing as global decay/generation reduction scaler based on count of Fronts.
    // Actually, simpler: Each 'Front' spec reduces GLOBAL generation by 5% (stacking).
    // Re-reading Plan: "Integrate Front bonus (-30% heat gen/decay boost)"
    // Let's go with: Each Front Territory gives a flat 10% reduction to global heat generation.

    let frontBonus = 0;
    if (state.territorySpecs) {
        frontBonus = Object.values(state.territorySpecs).filter(s => s === 'front').length * 0.10;
        // Cap front bonus at 50%
        frontBonus = Math.min(0.5, frontBonus);
    }

    const totalReduction = perkRed + frontBonus;
    return Math.max(0.1, 1 - totalReduction);
};

export const getMaxCapacity = (state) => {
    const warehouseLvl = state.upgrades?.warehouse || 1;
    const baseCap = 50;
    const mult = CONFIG.upgrades?.warehouse?.value || 2.0;

    // Territory Specialization Bonus (Storage)
    let specBonus = 0;
    if (state.territorySpecs) {
        Object.entries(state.territorySpecs).forEach(([id, spec]) => {
            if (spec === 'storage' && state.territories.includes(id)) {
                const lvl = state.territoryLevels[id] || 1;
                specBonus += 100 * lvl;
            }
        });
    }

    // Formula: (50 * (2^level)) + SpecBonus
    return Math.floor(baseCap * Math.pow(mult, warehouseLvl)) + specBonus;
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


export const fixFloat = (num, decimals = 2) => {
    return Number(Math.round(num + "e" + decimals) + "e-" + decimals);
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

    // 2. Production & Sales Throughput (Using Engine's Integer Logic)
    Object.keys(CONFIG.production).forEach(itemId => {
        const item = CONFIG.production[itemId];

        // Potential Production/sec
        let prodRates = 0;
        Object.entries(CONFIG.staff).forEach(([role, staffConf]) => {
            const count = state.staff[role] || 0;
            if (count > 0 && staffConf.role === 'producer' && staffConf.rates?.[itemId]) {
                prodRates += count * staffConf.rates[itemId] * prodPerk;
            }
        });

        // Apply specific building buffs
        if (itemId.includes('hash') || itemId.includes('skunk')) if (state.upgrades.hydro) prodRates *= 1.5;
        if (item.tier >= 2 && state.upgrades.lab) prodRates *= 1.5;

        // Potential Sales/sec
        let salesRates = 0;
        Object.entries(CONFIG.staff).forEach(([role, staffConf]) => {
            const count = state.staff[role] || 0;
            if (count > 0 && staffConf.role === 'seller' && staffConf.rates?.[itemId]) {
                salesRates += count * staffConf.rates[itemId] * salesPerk;
            }
        });

        // Heat Malus
        let heatMalus = state.heat >= 95 ? 0.2 : (state.heat >= 80 ? 0.5 : (state.heat >= 50 ? 0.8 : 1.0));
        salesRates *= heatMalus;

        // Hype Buff
        if (state.activeBuffs?.hype > Date.now()) salesRates *= 2;

        // ENGINE ALIGNMENT: Floor the throughput rates BEFORE multiplying by price
        // The engine produces/sells in integer chunks based on probability.
        // Over time, "3.5 items/sec" averages to 3.5, but for "Income Per Sec" prediction,
        // we should show the 'Effective Stable Flow' which is often floor-bound in low numbers,
        // but let's actually keep the rate as float (for average) but Floor the Revenue per unit if needed?
        // No, the engine does: amountToSell = floor(rate) + prob(remainder).
        // So average is exactly 'rate'.
        // The issue 'Fatamorgana' likely referred to "Max Theoretical" vs "Actual Inventory Limit".
        // Use min(prod, sales) is correct.

        const throughput = Math.min(prodRates, salesRates);

        // Revenue calculation
        dirty += throughput * item.baseRevenue * marketMult * prestigeMult;
    });

    // 3. Subtract Salaries
    let salaryPerSec = 0;
    Object.keys(CONFIG.staff).forEach(role => {
        const count = state.staff[role] || 0;
        const salary = CONFIG.staff[role].salary || 0;
        salaryPerSec += (count * salary) / (CONFIG.payroll.salaryInterval / 1000);
    });

    if (clean >= salaryPerSec) clean -= salaryPerSec;
    else {
        const remainder = salaryPerSec - clean;
        clean = 0;
        dirty -= remainder;
    }

    return { total: fixFloat(clean + dirty), clean: fixFloat(clean), dirty: fixFloat(dirty) };
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

// Staff Loyalty Bonus: +1% per day employed (max 20%)
export const getLoyaltyBonus = (hiredDate) => {
    if (!hiredDate) return 0;
    const daysEmployed = (Date.now() - hiredDate) / (1000 * 60 * 60 * 24);
    return Math.min(20, Math.floor(daysEmployed)); // Max 20%
};
