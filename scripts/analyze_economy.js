
import { CONFIG } from '../src/config/gameConfig.js';

// Mock state for perk calculations (assuming 0 perks for baseline)
const state = {
    upgrades: {},
    staffHiredDates: {},
    getPerkValue: () => 0
};

// Helper methods from gameMath (simplified)
const getPerkValue = () => 0;
const getMasteryEffect = () => 0;
const getLoyaltyBonus = () => 0;

console.log("=== SYNDICATE OS ECONOMY ANALYSIS ===");
console.log(`Salary Interval: ${CONFIG.payroll.salaryInterval / 60000} minutes`);

console.log("\n--- PRODUCTION STAFF ROI ---");
Object.values(CONFIG.staff).forEach(staff => {
    if (staff.role !== 'producer') return;

    console.log(`\n[${staff.name}] (Cost: ${staff.baseCost}, Salary: ${staff.salary})`);

    if (staff.rates) {
        Object.entries(staff.rates).forEach(([item, rate]) => {
            if (item === 'default') return;
            const itemConfig = CONFIG.production[item];
            if (!itemConfig) return;

            const revenuePerUnit = itemConfig.baseRevenue;
            const unitsPerInterval = rate * (CONFIG.payroll.salaryInterval / 1000); // rate is per second? No, rate in config is chance per tick? 
            // In production.js: ratePerSec = count * chance * speedMult. 
            // So 'rate' in config IS 'chance per second' (effectively).

            // Wait, production.js says: produce(count, itemId, baseRate * rateMultiplier, roleId)
            // where baseRate is from staff.rates.

            const revenuePerInterval = unitsPerInterval * revenuePerUnit;
            const profit = revenuePerInterval - staff.salary;
            const roiIntervals = staff.baseCost / (profit > 0 ? profit : 1);
            const roiHours = (roiIntervals * CONFIG.payroll.salaryInterval) / 3600000;

            console.log(`  - ${item}: Yield ${unitsPerInterval.toFixed(2)}/${(CONFIG.payroll.salaryInterval / 60000).toFixed(0)}min. Rev: ${revenuePerInterval.toFixed(0)}. Profit: ${profit.toFixed(0)}. ROI: ${profit > 0 ? roiHours.toFixed(1) + 'h' : 'NEVER (Loss)'}`);
        });
    }
});

console.log("\n--- SALES STAFF ROI ---");
Object.values(CONFIG.staff).forEach(staff => {
    if (staff.role !== 'seller') return;

    console.log(`\n[${staff.name}] (Cost: ${staff.baseCost}, Salary: ${staff.salary})`);

    // Determine which items they sell and at what rate
    let items = staff.target;
    if (typeof items === 'string') items = [items];
    if (!items) items = [];

    items.forEach(item => {
        const itemConfig = CONFIG.production[item];
        if (!itemConfig) return;

        let rate = staff.rates[item] || staff.rates.default || 0;

        const revenuePerUnit = itemConfig.baseRevenue;
        const unitsPerInterval = rate * (CONFIG.payroll.salaryInterval / 1000);
        const revenuePerInterval = unitsPerInterval * revenuePerUnit;
        const profit = revenuePerInterval - staff.salary; // This assumes they have infinite stock to sell
        const roiIntervals = staff.baseCost / (profit > 0 ? profit : 1);
        const roiHours = (roiIntervals * CONFIG.payroll.salaryInterval) / 3600000;

        console.log(`  - ${item}: Sell ${unitsPerInterval.toFixed(2)}/${(CONFIG.payroll.salaryInterval / 60000).toFixed(0)}min. Rev: ${revenuePerInterval.toFixed(0)}. Profit: ${profit.toFixed(0)}. ROI: ${profit > 0 ? roiHours.toFixed(1) + 'h' : 'NEVER (Loss)'}`);
    });
});
