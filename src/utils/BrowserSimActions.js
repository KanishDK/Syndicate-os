/**
 * Browser-Compatible SimActions for AutoPilot
 * Pure functions that return new state (no mutations)
 */

export const createSimActions = (CONFIG, getBulkCost) => ({
    // Manual Production (for tutorial)
    produceManual: (state, { tierId, amount = 1 }) => {
        const product = CONFIG.production[tierId];
        if (!product) return state;

        const newInv = { ...state.inv };
        newInv[tierId] = (newInv[tierId] || 0) + amount;

        // Recalculate total from scratch to prevent drift
        newInv.total = Object.entries(newInv).reduce((sum, [key, val]) => key === 'total' ? sum : sum + (typeof val === 'number' ? val : 0), 0);

        // Track stats
        const newStats = { ...state.stats };
        if (!newStats.produced) newStats.produced = {};
        newStats.produced[tierId] = (newStats.produced[tierId] || 0) + amount;

        return {
            ...state,
            inv: newInv,
            stats: newStats
        };
    },

    // Manual Sell (for tutorial)
    sellManual: (state, { tierId, amount }) => {
        const product = CONFIG.production[tierId];
        if (!product) return state;

        const available = state.inv[tierId] || 0;
        const safeAmount = Number.isFinite(amount) ? amount : 0;
        const sellAmount = Math.min(safeAmount, available);
        if (sellAmount <= 0) return state;

        const revenue = sellAmount * product.basePrice;
        const heatGain = sellAmount * (product.heatPerUnit || 1) * 0.4;

        const newInv = { ...state.inv };
        newInv[tierId] = Math.max(0, available - sellAmount);

        // Recalculate total from scratch to prevent drift
        newInv.total = Object.entries(newInv).reduce((sum, [key, val]) => key === 'total' ? sum : sum + (typeof val === 'number' ? val : 0), 0);

        const newStats = { ...state.stats };
        newStats.sold = (newStats.sold || 0) + sellAmount;

        // MATH STABILITY: Output Sanitization
        return {
            ...state,
            inv: newInv,
            dirtyCash: Number.isFinite(state.dirtyCash + revenue) ? (state.dirtyCash + revenue) : 0,
            heat: Math.min(500, (state.heat || 0) + heatGain),
            stats: newStats
        };
    },

    // Laundering
    launder: (state, { amount }) => {
        const safeWashAmount = Number.isFinite(amount) ? amount : 0;
        const toWash = Math.min(safeWashAmount, state.dirtyCash || 0);
        if (toWash <= 0) return state;

        const cleanAmount = toWash * 0.7; // 30% fee

        const newStats = { ...state.stats };
        newStats.laundered = (newStats.laundered || 0) + cleanAmount;

        // MATH STABILITY: Output Sanitization
        return {
            ...state,
            dirtyCash: Number.isFinite(state.dirtyCash - toWash) ? (state.dirtyCash - toWash) : 0,
            cleanCash: Number.isFinite(state.cleanCash + cleanAmount) ? (state.cleanCash + cleanAmount) : 0,
            stats: newStats
        };
    },

    // Staff Hiring
    buyStaff: (state, { role, amount = 1 }) => {
        const item = CONFIG.staff[role];
        if (!item) return state;
        if (state.level < (item.reqLevel || 1)) return state;

        const currentCount = state.staff[role] || 0;
        const totalCost = getBulkCost(item.baseCost, item.costFactor || 1.15, currentCount, amount);

        if (state.cleanCash >= totalCost) {
            const newStaffHiredDates = { ...state.staffHiredDates };
            if (!newStaffHiredDates[role]) {
                newStaffHiredDates[role] = Date.now();
            }

            return {
                ...state,
                cleanCash: state.cleanCash - totalCost,
                staff: { ...state.staff, [role]: currentCount + amount },
                staffHiredDates: newStaffHiredDates
            };
        }
        return state;
    },

    // Upgrades
    buyUpgrade: (state, { id }) => {
        const item = CONFIG.upgrades[id];
        if (!item) return state;
        if (state.upgrades[id]) return state; // Already owned

        const cost = item.baseCost;

        if (state.cleanCash >= cost) {
            return {
                ...state,
                cleanCash: state.cleanCash - cost,
                upgrades: { ...state.upgrades, [id]: true }
            };
        }
        return state;
    },

    // Territory Acquisition
    buyTerritory: (state, { id }) => {
        const territory = CONFIG.territories.find(t => t.id === id);
        if (!territory) return state;
        if (state.territories?.[id]) return state; // Already owned
        if (state.level < (territory.reqLevel || 1)) return state;

        const cost = territory.baseCost;

        if (state.cleanCash >= cost) {
            return {
                ...state,
                cleanCash: state.cleanCash - cost,
                territories: { ...state.territories, [id]: { level: 1, owned: true } }
            };
        }
        return state;
    },

    // Defense Purchasing
    buyDefense: (state, { id, amount = 1 }) => {
        const item = CONFIG.defense[id];
        if (!item) return state;

        const currentCount = state.defense?.[id] || 0;
        const cost = item.baseCost * Math.pow(item.costFactor || 1.4, currentCount);

        if (state.cleanCash >= cost) {
            return {
                ...state,
                cleanCash: state.cleanCash - cost,
                defense: { ...state.defense, [id]: currentCount + amount }
            };
        }
        return state;
    }
});
