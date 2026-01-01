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

    // A. Junkies
    const junkieCount = state.staff.junkie || 0;
    if (junkieCount > 0) {
        if (Math.random() < (junkieCount * 0.3)) increment('hash_lys');
        if (Math.random() < (junkieCount * 0.15)) increment('piller_mild');
        if (Math.random() < 0.001) {
            state.staff.junkie = Math.max(0, state.staff.junkie - 1);
            state.logs = [{ msg: "En junkie døde af en overdosis.", type: 'warning', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
        }
    }

    // B. Growers
    const growerCount = (state.staff.grower || state.staff.gardener || 0);
    if (growerCount > 0) {
        const weedMult = state.upgrades.hydro ? 1.25 : 1;
        if (Math.random() < (growerCount * 0.3 * weedMult)) increment('hash_lys');
        if (state.level >= 5 && Math.random() < (growerCount * 0.2 * weedMult)) increment('hash_moerk');
    }

    // C. Chemists & Importers
    if (state.staff.chemist > 0 && state.level >= 10 && Math.random() < (state.staff.chemist * 0.1 * (state.upgrades.lab ? 1.25 : 1))) increment('speed');
    if (state.staff.importer > 0 && state.level >= 15 && Math.random() < (state.staff.importer * 0.05)) increment('coke');
    if (state.staff.labtech > 0 && state.level >= 25 && Math.random() < (state.staff.labtech * 0.02)) increment('fentanyl');

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

            if (itemConfig.id === 'hash_lys' || itemConfig.id === 'piller_mild') {
                sellerCount = state.staff.pusher || 0;
                chance = 0.5;
                heat = itemConfig.id === 'hash_lys' ? 0.02 : 0.04;
            } else if (itemConfig.id === 'hash_moerk' || itemConfig.id === 'speed' || itemConfig.id === 'mdma') {
                sellerCount = state.staff.distributor || 0;
                chance = itemConfig.id === 'hash_moerk' ? 0.5 : (itemConfig.id === 'speed' ? 0.4 : 0.3);
                heat = itemConfig.id === 'hash_moerk' ? 0.1 : (itemConfig.id === 'speed' ? 0.12 : 0.15);
            } else if (['coke', 'benzos', 'svampe', 'oxy', 'heroin', 'fentanyl'].includes(itemConfig.id)) {
                sellerCount = state.staff.trafficker || 0;
                chance = 0.3;
                if (itemConfig.id === 'coke') chance = 0.4;
                if (itemConfig.id === 'heroin') chance = 0.25;
                if (itemConfig.id === 'fentanyl') chance = 0.2;
                heat = 0.5;
            }

            if (sellerCount > 0) sellItem(sellerCount, itemId, chance, heat);
        });
    }

    return state;
};
