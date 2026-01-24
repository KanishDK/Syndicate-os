import { CONFIG } from '../../config/gameConfig.js';
import { getPerkValue, getMaxCapacity, getMasteryEffect, getLoyaltyBonus } from '../../utils/gameMath.js';
import { playSound } from '../../utils/audio.js';

export const processProduction = (state, dt = 1) => {
    // MATH STABILITY: Sanitize inputs
    dt = Number.isFinite(dt) ? Math.max(0, dt) : 1;
    state.cleanCash = Number.isFinite(state.cleanCash) ? state.cleanCash : 0;
    state.dirtyCash = Number.isFinite(state.dirtyCash) ? state.dirtyCash : 0;

    if (state.payroll?.isStriking) return state;

    // Reset Rates for this Tick
    state.productionRates = {};

    // A. Pre-calculate inventory stats for efficiency (Expert Audit Fix)
    let currentTotal = Object.values(state.inv).reduce((a, b) => a + b, 0);
    const maxCap = getMaxCapacity(state);

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
    const produce = (count, item, chance, staffRole) => {
        if (count <= 0) return;
        const speedMult = 1 + getPerkValue(state, 'prod_speed') + getMasteryEffect(state, 'prod_speed');
        const loyaltyBonus = getLoyaltyBonus(state.staffHiredDates?.[staffRole]) / 100; // Convert % to decimal
        const effective = count * chance * dt * speedMult * (1 + loyaltyBonus);
        const guaranteed = Math.floor(effective);
        const remainder = effective - guaranteed;
        const amount = guaranteed + (Math.random() < remainder ? 1 : 0);
        if (amount > 0) increment(item, amount);
    };

    // --- DYNAMIC STAFF PRODUCTION LOGIC ---
    // Iterate over all active staff in state
    Object.keys(state.staff).forEach(roleId => {
        const count = state.staff[roleId];
        if (count <= 0) return;

        const staffConfig = CONFIG.staff[roleId];
        if (!staffConfig) return; // Skip if config missing (legacy safety)

        // 1. PRODUCERS
        if (staffConfig.role === 'producer') {
            if (staffConfig.rates) {
                Object.entries(staffConfig.rates).forEach(([itemId, baseRate]) => {
                    let rateMultiplier = 1.0;

                    // Apply Upgrades based on Tags
                    if (staffConfig.tags) {
                        if (staffConfig.tags.includes('weed') && state.upgrades.hydro) rateMultiplier *= 1.5;
                        if (staffConfig.tags.includes('chem') && state.upgrades.lab) rateMultiplier *= 1.5;
                    }

                    // Level gating checks (mapped from original logic)
                    if (itemId === 'skunk' && state.level < 2) return;
                    if (itemId === 'amfetamin' && state.level < 4) return;
                    if ((itemId === 'mdma' || itemId === 'ketamin') && state.level < 5) return;
                    if (itemId === 'kokain' && state.level < 7) return;
                    if ((itemId === 'benzos' || itemId === 'svampe') && state.level < 8) return;
                    if (itemId === 'oxy' && state.level < 10) return;
                    if (itemId === 'heroin' && state.level < 11) return;
                    if (itemId === 'fentanyl' && state.level < 12) return;

                    produce(count, itemId, baseRate * rateMultiplier, roleId);
                });
            }

            // Junkie Specific: Overdose Logic (Kept bespoke for flavor)
            if (roleId === 'junkie') {
                const pDeath = 1 - Math.pow(staffConfig.survivalRate || 0.999, count);
                if (Math.random() < pDeath * dt) {
                    state.staff.junkie = Math.max(0, state.staff.junkie - 1);
                    state.logs = [{ msg: "En junkie døde af en overdosis.", type: 'warning', time: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 50);
                }
            }
        }
    });

    // D. Auto-Sell Logic
    let heatMalus = 1.0;
    // Apply Heat Penalties
    if (state.heat >= CONFIG.productionHeatPenalties.critical.threshold) heatMalus = CONFIG.productionHeatPenalties.critical.val;
    else if (state.heat >= CONFIG.productionHeatPenalties.high.threshold) heatMalus = CONFIG.productionHeatPenalties.high.val;
    else if (state.heat >= CONFIG.productionHeatPenalties.med.threshold) heatMalus = CONFIG.productionHeatPenalties.med.val;

    const heatMult = state.upgrades.network ? 0.75 : 1.0;

    const sellItem = (roleCount, item, chancePerUnit, heatPerUnit, staffRole) => {
        const count = state.inv[item] || 0;
        if (count <= 0) return;

        // Apply loyalty bonus to seller rate
        const loyaltyBonus = getLoyaltyBonus(state.staffHiredDates?.[staffRole]) / 100;

        // Scale by dt
        const effectiveRate = roleCount * chancePerUnit * heatMalus * dt * (1 + loyaltyBonus);
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
            // PERKs: Sales Boost & Prestige Multiplier & Mastery Monopoly
            const salesPerk = 1 + getPerkValue(state, 'sales_boost') + getMasteryEffect(state, 'sales_boost');
            const globalMult = state.prestige?.multiplier || 1.0;
            const revenue = Math.floor(amountToSell * basePrice * marketMult * salesPerk * globalMult);

            if (revenue > 0) playSound('cash');

            state.dirtyCash += revenue;
            if (state.lifetime) state.lifetime.dirtyEarnings = (state.lifetime.dirtyEarnings || 0) + revenue;
            state.lastTick.dirty += revenue; // Track for float
            // PERK: XP Boost & Mastery Network
            const xpMult = 1 + getPerkValue(state, 'xp_boost') + getMasteryEffect(state, 'xp_boost');
            const penthouseBonus = state.luxuryItems?.includes('penthouse') ? 1.5 : 1.0;
            // ECO FIX: Buffed from 0.1 to 5.0 to compensate for 100x Revenue Drop
            state.xp += Math.floor(revenue * 5.0 * xpMult * penthouseBonus);

            // Heat Modifier Check
            const heatMod = state.modifiers?.heatMult || 1.0;
            // PERK: Heat Reduction (Active)
            const perkHeatReduc = Math.max(0.1, 1.0 - getPerkValue(state, 'heat_reduce'));

            // PERK: Shadow Network (Forbidden) - Fix for ignoring Heat Gen reduction
            const shadowReduc = Math.max(0.1, 1.0 - getPerkValue(state, 'shadow_network'));

            // LUXURY: Private Jet (Heat Floor/Reduction)
            const jetReduc = state.luxuryItems?.includes('jet') ? 0.5 : 1.0;

            // Heat increase logic: Capped at 500 to prevent overflow while keeping risk maxed (100 Expert Fix)
            const heatGain = (amountToSell * heatPerUnit * heatMult * heatMod * perkHeatReduc * shadowReduc * jetReduc) * 0.4;
            // VISUAL CAP: 100, INTERNAL CAP: 500
            // We allow heat to go above 100 internally so decay takes longer if they mass-sell
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

            // Iterate all staff to find sellers for this item
            Object.keys(state.staff).forEach(roleId => {
                const count = state.staff[roleId];
                if (count <= 0) return;

                const staffConfig = CONFIG.staff[roleId];
                if (!staffConfig || staffConfig.role !== 'seller') return;

                // Check if this seller handles this item
                let chance = 0;
                if (staffConfig.rates && staffConfig.rates[itemId]) {
                    chance = staffConfig.rates[itemId];
                } else if (staffConfig.rates && staffConfig.rates.default) {
                    // Tier 3+ generic handling
                    chance = staffConfig.rates.default;
                }

                if (chance > 0) {
                    const heat = itemConfig.heatGain || 0.1;
                    sellItem(count, itemId, chance, heat, roleId);
                }
            });
        });
    }

    return state;
};
