import { CONFIG } from '../../config/gameConfig';
import { getPerkValue, getMaxCapacity } from '../../utils/gameMath';

export const calculateOfflineProgress = (state, now) => {
    if (!state.lastSaveTime) return { state, report: null };

    const diff = now - state.lastSaveTime;
    const minutes = Math.floor(diff / 60000);

    // Minimum 1 minute to trigger offline report
    if (minutes < 1) return { state, report: null };

    const seconds = minutes * 60;
    const EFFICIENCY = 0.5; // 50% efficiency for offline

    let report = {
        time: minutes,
        earnings: 0, // Net Dirty
        cleanEarnings: 0, // Net Clean
        laundered: 0,
        salaryPaid: 0,
        produced: {},
        raids: { attempted: 0, defended: 0, lost: 0, moneyLost: 0 }
    };

    // Calculate Multipliers
    const prestigeMult = state.prestige?.multiplier || 1;
    const marketMult = 1.0; // Assume average market
    // Note: Can't easily simulate random market fluctuation offline.

    // 1. Expenses (Salaries)
    let salaryPerMinute = 0;
    Object.keys(CONFIG.staff).forEach(role => {
        salaryPerMinute += (state.staff[role] || 0) * (CONFIG.staff[role].salary || 0);
    });
    report.salaryPaid = salaryPerMinute * minutes;

    // 2. Production & Sales
    let productionPerSec = {};
    Object.keys(CONFIG.staff).forEach(role => {
        const count = state.staff[role] || 0;
        if (count > 0 && CONFIG.staff[role].role === 'producer') {
            const rates = CONFIG.staff[role].rates;
            if (rates) {
                Object.entries(rates).forEach(([item, rate]) => {
                    productionPerSec[item] = (productionPerSec[item] || 0) + (rate * count * prestigeMult);
                });
            }
        }
    });

    // Calculate Produced Items with Capacity Clamping
    const maxCap = getMaxCapacity(state);
    let currentInvTotal = Object.values(state.inv).reduce((a, b) => a + b, 0);

    Object.entries(productionPerSec).forEach(([item, rate]) => {
        const producedPotential = Math.floor(rate * seconds * EFFICIENCY);
        if (producedPotential > 0) {
            const spaceLeft = maxCap - currentInvTotal;
            const actualProduced = Math.max(0, Math.min(producedPotential, spaceLeft));

            if (actualProduced > 0) {
                report.produced[item] = actualProduced;
                state.inv[item] = (state.inv[item] || 0) + actualProduced;
                state.stats.produced[item] = (state.stats.produced[item] || 0) + actualProduced;
                currentInvTotal += actualProduced;
            }
        }
    });

    // Check Sales Capacity
    let salesCapacityPerSec = 0;
    const salesPerk = 1 + getPerkValue(state, 'sales_boost');

    Object.keys(CONFIG.staff).forEach(role => {
        const count = state.staff[role] || 0;
        if (count > 0 && CONFIG.staff[role].role === 'seller') {
            // Fix: Use the rates defined by item in staff config, similar to production
            const rates = CONFIG.staff[role].rates;
            if (rates) {
                Object.values(rates).forEach(rate => {
                    salesCapacityPerSec += (rate * count * prestigeMult * salesPerk);
                });
            }
        }
    });

    let totalProducedAmount = Object.values(report.produced).reduce((a, b) => a + b, 0);
    let totalSalesPotential = Math.floor(salesCapacityPerSec * seconds * EFFICIENCY);

    let grossDirtyIncome = 0;

    if (totalSalesPotential > 0 && totalProducedAmount > 0) {
        const sellRatio = Math.min(1, totalSalesPotential / totalProducedAmount);

        Object.entries(report.produced).forEach(([item, amount]) => {
            const numSold = Math.floor(amount * sellRatio);
            if (numSold > 0) {
                const revenue = numSold * (state.prices[item] || CONFIG.production[item].baseRevenue) * marketMult;
                grossDirtyIncome += revenue;

                state.inv[item] -= numSold;
                state.stats.sold = (state.stats.sold || 0) + numSold;
            }
        });
    }

    // 3. Territory Income
    let territoryClean = 0;
    let territoryDirty = 0;
    state.territories.forEach(tid => {
        const t = CONFIG.territories.find(ter => ter.id === tid);
        if (t) {
            const level = state.territoryLevels?.[tid] || 1;
            const inc = t.income * Math.pow(1.5, level - 1) * prestigeMult;
            const total = inc * seconds * EFFICIENCY;

            if (t.type === 'clean') territoryClean += total;
            else territoryDirty += total;
        }
    });

    report.cleanEarnings += territoryClean;
    grossDirtyIncome += territoryDirty;

    // 4. Laundering (Offline)
    // Convert Dirty -> Clean based on Accountant capacity
    if (state.staff.accountant > 0 && grossDirtyIncome > 0) {
        const cleanPerAccountant = 250;
        const launderMult = 1 + getPerkValue(state, 'launder_speed');
        const maxCleanPerSec = state.staff.accountant * cleanPerAccountant * launderMult;

        const totalCleanable = maxCleanPerSec * seconds * EFFICIENCY;
        const amountToLaunder = Math.min(grossDirtyIncome, totalCleanable);

        if (amountToLaunder > 0) {
            const launderedClean = Math.floor(amountToLaunder * CONFIG.launderingRate);

            grossDirtyIncome -= amountToLaunder;
            report.cleanEarnings += launderedClean;
            report.laundered = amountToLaunder;

            state.stats.laundered += amountToLaunder;
        }
    }

    report.earnings = grossDirtyIncome; // Remaining Dirty

    // 5. Raids Simulation
    const hours = minutes / 60;
    if (hours >= 1) {
        const raids = Math.floor(hours * 0.5);
        report.raids.attempted = raids;
        if (raids > 0) {
            const defenseScore =
                (state.defense?.guards || 0) * (CONFIG.defense.guards.defenseVal) +
                (state.defense?.cameras || 0) * (CONFIG.defense.cameras.defenseVal) +
                (state.defense?.bunker || 0) * (CONFIG.defense.bunker.defenseVal);

            const raidStrength = (state.level * 20) + Math.floor(state.dirtyCash / 50000);

            for (let i = 0; i < raids; i++) {
                const roll = Math.random() * 100;
                const attack = raidStrength * (0.8 + Math.random() * 0.4);

                if (defenseScore + roll > attack) {
                    report.raids.defended++;
                } else {
                    report.raids.lost++;
                    const penalty = Math.floor(state.dirtyCash * 0.1);
                    report.raids.moneyLost += penalty;
                    state.dirtyCash -= penalty;
                }
            }
        }
        if (state.hardcore && report.raids.lost > 0) {
            // SAFEGUARD: Disable Offline Wipe. It is unfair to die while sleeping.
            // report.hardcoreWipe = true; 
            report.raids.title = "HARDCORE: ANGREBET MENS DU SOV!";
            // Instead, maybe take EXTRA money?
            const penalty = Math.floor(state.dirtyCash * 0.25); // 25% extra penalty
            report.raids.moneyLost += penalty;
            state.dirtyCash -= penalty;
        }
    }

    // 6. Final Balance
    let pendingSalary = report.salaryPaid;

    state.cleanCash += report.cleanEarnings;
    state.dirtyCash += report.earnings;

    if (state.cleanCash >= pendingSalary) {
        state.cleanCash -= pendingSalary;
    } else {
        const remainder = pendingSalary - state.cleanCash;
        state.cleanCash = 0;
        state.dirtyCash -= remainder;
    }

    state.cleanCash = Math.max(0, state.cleanCash);
    state.dirtyCash = Math.max(0, state.dirtyCash);

    const interest = Math.floor((state.debt || 0) * 0.01 * minutes);
    state.debt += interest;
    report.interest = interest;

    return { state, report };
};
