import { CONFIG } from '../../config/gameConfig';
import { getPerkValue } from '../../utils/gameMath';

export const processProduction = (state, dt = 1) => {
    if (state.payroll?.isStriking) return state;

    // Reset Rates for this Tick
    state.productionRates = {};

    // A. Pre-calculate inventory stats for efficiency (Expert Audit Fix)
    let currentTotal = Object.values(state.inv).reduce((a, b) => a + b, 0);
    const maxCap = 50 * (state.upgrades.warehouse ? 2 : 1);

    // Helper: Increment Inventory with Cap Check
    const increment = (item, amount = 1) => {
        // Fill to cap instead of doing nothing
        const availableSpace = maxCap - currentTotal;
        const actualAmount = Math.min(amount, Math.max(0, availableSpace));

        if (actualAmount <= 0) return;

        state.inv[item] = (state.inv[item] || 0) + actualAmount;
        state.stats.produced[item] = (state.stats.produced[item] || 0) + actualAmount;
        if (state.lifetime) state.lifetime.produced[item] = (state.lifetime.produced[item] || 0) + actualAmount;

        if (!state.productionRates[item]) state.productionRates[item] = { produced: 0, sold: 0 };
        state.productionRates[item].produced += actualAmount;

        // Update local counter to avoid re-calculating whole object
        currentTotal += actualAmount;
    };

    // Helper: Bulk Produce Logic
    const produce = (count, item, chance) => {
        if (count <= 0) return;
        const speedMult = 1 + getPerkValue(state, 'prod_speed');
        const effective = count * chance * dt * speedMult;
        const guaranteed = Math.floor(effective);
        const remainder = effective - guaranteed;
        const amount = guaranteed + (Math.random() < remainder ? 1 : 0);
        if (amount > 0) increment(item, amount);
    };

    // A. Junkies (Low risk, low output)
    const junkieCount = state.staff.junkie || 0;
    if (junkieCount > 0) {
        produce(junkieCount, 'hash_lys', CONFIG.staff.junkie.rates.hash_lys);
        produce(junkieCount, 'piller_mild', CONFIG.staff.junkie.rates.piller_mild);

        const pDeath = 1 - Math.pow(0.999, junkieCount);
        if (Math.random() < pDeath * dt) {
            state.staff.junkie = Math.max(0, state.staff.junkie - 1);
            state.logs = [{ msg: "En junkie døde af en overdosis.", type: 'warning', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
        }
    }

    // B. Growers (Weed & Hash)
    const growerCount = state.staff.grower || 0;
    if (growerCount > 0) {
        const weedMult = state.upgrades.hydro ? 1.5 : 1.0;
        produce(growerCount, 'hash_lys', CONFIG.staff.grower.rates.hash_lys * weedMult);
        if (state.level >= 2) produce(growerCount, 'hash_moerk', CONFIG.staff.grower.rates.hash_moerk * weedMult);
    }

    // C. Chemists (Speed, MDMA, Keta)
    const chemistCount = state.staff.chemist || 0;
    if (chemistCount > 0 && state.level >= 4) {
        const labMult = state.upgrades.lab ? 1.5 : 1.0;
        produce(chemistCount, 'speed', CONFIG.staff.chemist.rates.speed * labMult);
        if (state.level >= 5) {
            produce(chemistCount, 'mdma', (CONFIG.staff.chemist.rates.mdma || 0.15) * labMult);
            produce(chemistCount, 'keta', (CONFIG.staff.chemist.rates.keta || 0.1) * labMult);
        }
    }

    // D. Importers (Coke, Benzos, Svampe)
    const importerCount = state.staff.importer || 0;
    if (importerCount > 0 && state.level >= 7) {
        produce(importerCount, 'coke', CONFIG.staff.importer.rates.coke);
        if (state.level >= 8) {
            produce(importerCount, 'benzos', CONFIG.staff.importer.rates.benzos || 0.04);
            produce(importerCount, 'svampe', CONFIG.staff.importer.rates.svampe || 0.03);
        }
    }

    // E. Lab Techs (Oxy, Heroin, Fentanyl)
    const labtechCount = state.staff.labtech || 0;
    if (labtechCount > 0 && state.level >= 10) {
        if (state.level >= 10) produce(labtechCount, 'oxy', CONFIG.staff.labtech.rates.oxy || 0.03);
        if (state.level >= 11) produce(labtechCount, 'heroin', CONFIG.staff.labtech.rates.heroin || 0.02);
        if (state.level >= 12) produce(labtechCount, 'fentanyl', CONFIG.staff.labtech.rates.fentanyl);
    }

    // D. Auto-Sell Logic
    let heatMalus = state.heat >= 95 ? 0.2 : (state.heat >= 80 ? 0.5 : (state.heat >= 50 ? 0.8 : 1.0));
    const heatMult = state.upgrades.network ? 0.75 : 1.0;

    const sellItem = (roleCount, item, chancePerUnit, heatPerUnit) => {
        const count = state.inv[item] || 0;
        if (count <= 0) return;

        // Scale by dt
        const effectiveRate = roleCount * chancePerUnit * heatMalus * dt;
        const guaranteed = Math.floor(effectiveRate);
        const remainder = effectiveRate - guaranteed;

        let amountToSell = guaranteed + (Math.random() < remainder ? 1 : 0);

        // Hype Buff (x2 Sales Speed)
        if (state.activeBuffs?.hype > Date.now()) {
            amountToSell *= 2;
        }

        amountToSell = Math.min(count, amountToSell);

        if (amountToSell > 0) {
            state.inv[item] -= amountToSell;

            // Phase 2: Apply Market Multiplier + Prestige Perk
            const basePrice = state.prices[item];
            const marketMult = state.market?.multiplier || 1.0;
            // PERKs: Sales Boost & Prestige Multiplier
            const salesPerk = 1 + getPerkValue(state, 'sales_boost');
            const globalMult = state.prestige?.multiplier || 1.0;
            const revenue = Math.floor(amountToSell * basePrice * marketMult * salesPerk * globalMult);

            if (revenue > 0) playSound('cash');

            state.dirtyCash += revenue;
            if (state.lifetime) state.lifetime.dirtyEarnings = (state.lifetime.dirtyEarnings || 0) + revenue;
            state.lastTick.dirty += revenue; // Track for float
            // PERK: XP Boost
            const xpMult = 1 + getPerkValue(state, 'xp_boost');
            state.xp += Math.floor(revenue * 0.1 * xpMult);

            // Heat Modifier Check
            const heatMod = state.modifiers?.heatMult || 1.0;
            // PERK: Heat Reduction (Active)
            const perkHeatReduc = Math.max(0.1, 1.0 - getPerkValue(state, 'heat_reduce'));

            // PERK: Shadow Network (Forbidden) - Fix for ignoring Heat Gen reduction
            const shadowReduc = Math.max(0.1, 1.0 - getPerkValue(state, 'shadow_network'));

            // Heat increase logic: Capped at 500 to prevent overflow while keeping risk maxed (100 Expert Fix)
            const heatGain = (amountToSell * heatPerUnit * heatMult * heatMod * perkHeatReduc * shadowReduc) * 0.4;
            state.heat = Math.min(500, state.heat + heatGain);
            state.stats.sold += amountToSell;

            // Track Rate
            if (!state.productionRates[item]) state.productionRates[item] = { produced: 0, sold: 0 };
            state.productionRates[item].sold += amountToSell;
        }
    };

    if (!state.isSalesPaused) {
        Object.keys(CONFIG.production).forEach(itemId => {
            if (state.autoSell[itemId] === false) return;

            const itemConfig = CONFIG.production[itemId];
            let sellerCount = 0;
            let chance = 0;
            let heat = 0;

            if (itemId === 'hash_lys' || itemId === 'piller_mild') {
                sellerCount = state.staff.pusher || 0;
                chance = CONFIG.staff.pusher.rates[itemId] || 0.5;
                heat = itemConfig.heatGain || 0.02;
            } else if (itemId === 'hash_moerk' || itemId === 'speed' || itemId === 'mdma' || itemId === 'keta') {
                sellerCount = state.staff.distributor || 0;
                chance = CONFIG.staff.distributor.rates[itemId] || 0.3;
                heat = itemConfig.heatGain || 0.1;
            } else if (['coke', 'benzos', 'svampe', 'oxy', 'heroin', 'fentanyl'].includes(itemId)) {
                sellerCount = state.staff.trafficker || 0;
                chance = CONFIG.staff.trafficker.rates[itemId] || CONFIG.staff.trafficker.rates.default || 0.3;
                heat = itemConfig.heatGain || 0.5;
            }

            if (sellerCount > 0) sellItem(sellerCount, itemId, chance, heat);
        });
    }

    return state;
};
