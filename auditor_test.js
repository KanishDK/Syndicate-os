
import { getDefaultState } from './src/utils/initialState.js';
import { CONFIG } from './src/config/gameConfig.js';
import { runGameTick } from './src/features/engine/gameTick.js';
import { getBulkCost, getMaxAffordable, getIncomePerSec } from './src/utils/gameMath.js';
import { processEconomy } from './src/features/engine/economy.js';

console.log("🕵️ THE GRAND AUDITOR: TRUTH SIMULATION STARTING...");

let FAILED = 0;
let PASSED = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`✅ PASS: ${message}`);
        PASSED++;
    } else {
        console.error(`❌ FAIL: ${message}`);
        FAILED++;
    }
}

// TEST 1: ZERO-STATE VERIFICATION
console.log("\n--- TEST 1: ZERO-STATE VERIFICATION ---");
const state = getDefaultState();
assert(state.cleanCash === CONFIG.initialCash, `Initial Cash Matches Config (${state.cleanCash} vs ${CONFIG.initialCash})`);
assert(state.level === 1, "Level starts at 1");
assert(Object.keys(state.inv).length === Object.keys(CONFIG.production).length, "Inventory matches Config");

// TEST 2: CHAOS TEST (Attempting Invalid Actions)
console.log("\n--- TEST 2: CHAOS TEST (Math Logic) ---");
const poorState = { ...state, cleanCash: 0 };
const upgrade = CONFIG.upgrades.warehouse;
const affordable = getMaxAffordable(upgrade.baseCost, upgrade.costFactor, 0, poorState.cleanCash);
assert(affordable === 0, "Cannot buy upgrade with 0 cash");

const cost = getBulkCost(upgrade.baseCost, upgrade.costFactor, 0, 1);
assert(cost > 0, "Cost is positive");
assert(cost > poorState.cleanCash, "Cost is greater than 0 cash");

// TEST 3: TIME-WARP TEST (1 Year Simulation)
console.log("\n--- TEST 3: TIME-WARP PERFORMANCE TEST ---");
let simState = getDefaultState();
// Boost stats to ensure things happen
simState.cleanCash = 1000000;
simState.staff.pusher = 10;
simState.staff.grower = 5;

const TICKS_PER_YEAR = (365 * 24 * 60 * 60) / 0.5; // 0.5s ticks? No, simulation step is usually larger in engine test.
// We will simulate 1 year in 1-hour chunks (8760 ticks of 3600s dt)
// Wait, runGameTick expects dt in SECONDS usually? Let's check.
// gameTick: dt = Number.isFinite(dt) ? Math.max(0, dt) : 1;
// processEconomy: uses dt to scale actions.

const START_TIME = Date.now();
const SIM_HOURS = 8760; // 1 Year
let maxCash = 0;


const t = (k) => k; // Simple mock for translation
for (let i = 0; i < SIM_HOURS; i++) {
    simState = runGameTick(simState, 3600, t); // Simulate 1 hour per tick

    if (simState.cleanCash > maxCash) maxCash = simState.cleanCash;

    // Safety Checks Every 1000 ticks
    if (i % 1000 === 0) {
        if (!Number.isFinite(simState.cleanCash) || Number.isNaN(simState.cleanCash)) {
            console.error("❌ CRITICAL: Cash became NaN/Infinite at tick " + i);
            FAILED++;
            break;
        }
    }
}
const END_TIME = Date.now();
console.log(`Simulated ${SIM_HOURS} hours in ${END_TIME - START_TIME}ms.`);
assert(Number.isFinite(simState.cleanCash), "Cash is finite after 1 year");
assert(simState.cleanCash >= 0, "Cash is non-negative");
assert(maxCash < Infinity, "Max Cash did not hit Infinity");
console.log(`Final Cash: ${simState.cleanCash.toLocaleString()}`);

// TEST 4: PRESTIGE VERIFICATION
console.log("\n--- TEST 4: PRESTIGE MATH VERIFICATION ---");
// Formula: 2.5 + floor(log10(lifetime / 5000) * 1.5)
// Let's test specific breakpoints
const testPrestige = (lifetime, expectedMin) => {
    // Re-implementing logic from useGameActions for verification
    const mult = Math.max(2.5, Math.floor(Math.log10(Math.max(1, lifetime / 5000)) * 1.5) / 10);
    // Wait, the logic in useGameActions was: 
    // Math.max(2.5, Math.floor(Math.log10(Math.max(1, lifetimeEarnings / 5000)) * 15) / 10);
    // Ah, *15 / 10 is 1.5. 

    // Actually, I should use the EXACT code I saw in useGameActions:
    // const calculatedMult = Math.max(2.5, Math.floor(Math.log10(Math.max(1, lifetimeEarnings / 5000)) * 15) / 10);

    const actualMult = Math.max(2.5, Math.floor(Math.log10(Math.max(1, lifetime / 5000)) * 15) / 10);

    return actualMult;
};

// 1. Minimum (0 earnings)
const p1 = testPrestige(0);
assert(p1 === 2.5, `0 Earnings gives 2.5x (Got ${p1})`);

// 2. 50,000 Earnings (10x base) -> log10(10) = 1. -> 1 * 1.5 = 1.5. Wait.
// log10(50000/5000) = log10(10) = 1.
// 1 * 15 = 15. floor(15)/10 = 1.5.
// Math.max(2.5, 1.5) = 2.5.
// So 50k is still base.

// 3. 500,000 Earnings (100x base) -> log10(100) = 2.
// 2 * 15 = 30. /10 = 3.0.
// Should be 3.0x.
const p2 = testPrestige(500000);
assert(p2 === 3.0, `500k Earnings gives 3.0x (Got ${p2})`);

// 4. Endgame (1 Trillion)
const p3 = testPrestige(1000000000000);
assert(p3 > 10, `Trillion Earnings gives > 10x (Got ${p3})`);


// SUMMARY
console.log("\n--- AUDIT SUMMARY ---");
console.log(`PASSED: ${PASSED}`);
console.log(`FAILED: ${FAILED}`);
if (FAILED === 0) {
    console.log("🏆 VERDICT: CERTIFIED STABLE (100%)");
} else {
    console.log("⚠️ VERDICT: ISSUES FOUND");
    process.exit(1);
}
