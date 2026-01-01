import { CONFIG } from '../../config/gameConfig';
import { formatNumber } from '../../utils/gameMath';

export const processProduction = (state) => {
    if (state.payroll?.isStriking) return state;

    // Reset Rates for this Tick
    state.productionRates = {};

    // Helper: Increment Inventory with Cap Check
    const increment = (item, amount = 1) => {
        const currentTotal = Object.values(state.inv).reduce((a, b) => a + b, 0);
        const maxCap = 50 * (state.upgrades.warehouse || 1);
        if (currentTotal + amount > maxCap) return;

        state.inv[item] = (state.inv[item] || 0) + amount;
        state.stats.produced[item] = (state.stats.produced[item] || 0) + amount;
        if (state.lifetime) state.lifetime.produced[item] = (state.lifetime.produced[item] || 0) + amount;

        // Track Rate
        if (!state.productionRates[item]) state.productionRates[item] = { produced: 0, sold: 0 };
        state.productionRates[item].produced += amount;
    };

    // Helper: Bulk Produce Logic
    const produce = (count, item, chance) => {
        if (count <= 0) return;

        const effective = count * chance;
        const guaranteed = Math.floor(effective);
        const remainder = effective - guaranteed;

        // Add randomness to remainder
        const amount = guaranteed + (Math.random() < remainder ? 1 : 0);

        if (amount > 0) increment(item, amount);
    };

    // A. Junkies (Low risk, low output)
    const junkieCount = state.staff.junkie || 0;
    if (junkieCount > 0) {
        produce(junkieCount, 'hash_lys', 0.3);
        produce(junkieCount, 'piller_mild', 0.15);

        // Overdose Risk (Dynamic based on count)
        // 0.1% chance per junkie per tick is too high for bulk. 
        // Let's cap it to max 1 death per tick to avoid mass extinctions, but scale probability.
        // P(at least one death) = 1 - (0.999)^N. 
        if (Math.random() < (1 - Math.pow(0.999, junkieCount))) {
            state.staff.junkie = Math.max(0, state.staff.junkie - 1);
            state.logs = [{ msg: "En junkie døde af en overdosis.", type: 'warning', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
        }
    }

    // B. Growers (Weed & Hash)
    const growerCount = (state.staff.grower || state.staff.gardener || 0);
    if (growerCount > 0) {
        const weedMult = state.upgrades.hydro ? 1.5 : 1.0; // Buffed from 1.25 -> 1.5
        produce(growerCount, 'hash_lys', 0.5 * weedMult); // Buffed rate 0.3 -> 0.5
        if (state.level >= 5) produce(growerCount, 'hash_moerk', 0.3 * weedMult); // Buffed 0.2 -> 0.3
    }

    // C. Chemists & Importers
    const chemistCount = state.staff.chemist || 0;
    const importerCount = state.staff.importer || 0;
    const labtechCount = state.staff.labtech || 0;

    if (chemistCount > 0 && state.level >= 10) {
        const labMult = state.upgrades.lab ? 1.5 : 1.0; // Buffed 1.25 -> 1.5
        produce(chemistCount, 'speed', 0.2 * labMult); // Buffed 0.1 -> 0.2
    }

    if (importerCount > 0 && state.level >= 15) {
        produce(importerCount, 'coke', 0.05);
    }

    if (labtechCount > 0 && state.level >= 25) {
        produce(labtechCount, 'fentanyl', 0.02);
    }

    // D. Auto-Sell Logic
    let heatMalus = state.heat >= 95 ? 0.2 : (state.heat >= 80 ? 0.5 : (state.heat >= 50 ? 0.8 : 1.0));
    const heatMult = state.upgrades.network ? 0.75 : 1.0;

    const sellItem = (roleCount, item, chancePerUnit, heatPerUnit) => {
        const count = state.inv[item] || 0;
        if (count <= 0) return;

        const effectiveRate = roleCount * chancePerUnit * heatMalus;
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
            // Handle Perk Logic safely
            const prestigeMult = 1.0 + ((state.prestige?.perks?.sales_boost || 0) * (CONFIG.perks?.sales_boost?.val || 0.1));

            const revenue = Math.floor(amountToSell * basePrice * marketMult * prestigeMult);

            state.dirtyCash += revenue;
            state.lastTick.dirty += revenue; // Track for float
            state.xp += Math.floor(revenue * 0.1);

            // Heat Modifier Check
            const heatMod = state.modifiers?.heatMult || 1.0;
            const perkHeatReduc = 1.0 - ((state.prestige?.perks?.heat_reduce || 0) * (CONFIG.perks?.heat_reduce?.val || 0.05));

            state.heat += (amountToSell * heatPerUnit * heatMult * heatMod * perkHeatReduc) * 0.4;
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
                chance = 0.5;
                heat = itemId === 'hash_lys' ? 0.02 : 0.04;
            } else if (itemId === 'hash_moerk' || itemId === 'speed' || itemId === 'mdma') {
                sellerCount = state.staff.distributor || 0;
                chance = itemId === 'hash_moerk' ? 0.5 : (itemId === 'speed' ? 0.4 : 0.3);
                heat = itemId === 'hash_moerk' ? 0.1 : (itemId === 'speed' ? 0.12 : 0.15);
            } else if (['coke', 'benzos', 'svampe', 'oxy', 'heroin', 'fentanyl'].includes(itemId)) {
                sellerCount = state.staff.trafficker || 0;
                chance = 0.3;
                if (itemId === 'coke') chance = 0.4;
                if (itemId === 'heroin') chance = 0.25;
                if (itemId === 'fentanyl') chance = 0.2;
                heat = 0.5;
            }

            if (sellerCount > 0) sellItem(sellerCount, itemId, chance, heat);
        });
    }

    return state;
};
