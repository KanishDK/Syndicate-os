
import { CONFIG } from './src/config/gameConfig.js';
import { runGameTick } from './src/features/engine/gameTick.js';
import { getDefaultState } from './src/utils/initialState.js';
import { getBulkCost } from './src/utils/gameMath.js';
import fs from 'fs';

// --- SIMULATION CONFIG ---
const SIM_DAYS = 365;
const TICK_RATE_MS = 60 * 1000; // 1 minute ticks for speed
const TICKS_PER_DAY = (24 * 60 * 60 * 1000) / TICK_RATE_MS;
const TOTAL_TICKS = SIM_DAYS * TICKS_PER_DAY;

// --- PERSONAS ---
const PERSONAS = {
    SPEEDRUNNER: {
        name: 'Speedrunner (Aggressive)',
        desc: 'Clicks constantly, buys upgrades ASAP, prestiges immediately upon hitting requirements.',
        actions: (state) => {
            // Logic: Buy whatever we can afford, prioritizing upgrades then speed
            // Check Upgrades
            Object.keys(CONFIG.upgrades).forEach(key => {
                const upg = CONFIG.upgrades[key];
                const cost = getBulkCost(upg.baseCost, upg.costFactor, state.upgrades[key] || 0, 1);
                if (state.cleanCash >= cost) {
                    state.cleanCash -= cost;
                    state.upgrades[key] = (state.upgrades[key] || 0) + 1;
                }
            });
            // Prestige Check
            if (state.dirtyCash >= CONFIG.prestige.threshold) {
                return 'PRESTIGE';
            }
            return null;
        }
    },
    CASUAL: {
        name: 'The Casual (Passive)',
        desc: 'Logs in once a day, buys safe upgrades, avoids high heat.',
        actions: (state, tickCount) => {
            // Only acts every 1440 ticks (once a day)
            if (tickCount % 1440 !== 0) return null;

            // Casual Action: Buy Staff if affordable
            // Priorities: Junkie (Prod) -> Pusher (Sell)
            if (state.cleanCash >= CONFIG.staff.junkie.baseCost && (state.staff.junkie || 0) < 5) {
                const cost = getBulkCost(CONFIG.staff.junkie.baseCost, CONFIG.staff.junkie.costFactor, state.staff.junkie || 0, 1);
                if (state.cleanCash >= cost) {
                    state.cleanCash -= cost;
                    state.staff.junkie = (state.staff.junkie || 0) + 1;
                }
            }
            if (state.cleanCash >= CONFIG.staff.pusher.baseCost && (state.staff.pusher || 0) < 2) {
                const cost = getBulkCost(CONFIG.staff.pusher.baseCost, CONFIG.staff.pusher.costFactor, state.staff.pusher || 0, 1);
                if (state.cleanCash >= cost) {
                    state.cleanCash -= cost;
                    state.staff.pusher = (state.staff.pusher || 0) + 1;
                }
            }

            // Buys 1 Upgrade if rich
            Object.keys(CONFIG.upgrades).forEach(key => {
                const upg = CONFIG.upgrades[key];
                const cost = getBulkCost(upg.baseCost, upg.costFactor, state.upgrades[key] || 0, 1);
                if (state.cleanCash >= cost * 2) { // Safe buffer
                    state.cleanCash -= cost;
                    state.upgrades[key] = (state.upgrades[key] || 0) + 1;
                }
            });
            return null;
        }
    },
    TYCOON: {
        name: 'The Tycoon (Optimizer)',
        desc: 'Perfectly balances production and sales. Maximizes income.',
        actions: (state) => {
            // Optimizes staff ratios.
            // Simplified: Keeps Sellers > Producers
            // Auto-assigns staff logic here if possible, or just buys them directly
            return null;
        }
    }
};

// --- RUNNER ---
const runSimulation = (personaKey) => {
    const persona = PERSONAS[personaKey];
    console.log(`\n🚀 STARTING SIMULATION: ${persona.name}`);

    let state = getDefaultState();
    let prestigeCount = 0;

    const startTime = Date.now();
    let ticks = 0;

    // Helper: Manual Produce (Mocking Click)
    const manualProduce = (state) => {
        // Base: Produce Hash Lys
        const item = 'hash_lys';
        state.inv[item] = (state.inv[item] || 0) + 1;
        state.stats.produced[item] = (state.stats.produced[item] || 0) + 1;
        state.inventoryTotal = (state.inventoryTotal || 0) + 1; // Simplified tracking
        state.heat += CONFIG.production[item]?.heatGain || 0.1;
    };

    // Helper: Manual Sell (Mocking Click or Auto-Sell tick)
    // Speedrunner sells manually if they have stock and need cash
    const manualSell = (state) => {
        const item = 'hash_lys';
        if ((state.inv[item] || 0) > 0) {
            state.inv[item]--;
            state.dirtyCash += (state.prices[item] || 15); // Base price approx
        }
    };

    // Performance Metric: Days to Level 5?
    // We break if days > 365

    // Mock Translation Function
    const mockT = (key) => key;

    while (ticks < TOTAL_TICKS) {
        // Run Engine
        state = runGameTick(state, TICK_RATE_MS, mockT);

        // Persona Actions
        // SPEEDRUNNER: Clicks aggressively if low cash OR no production
        if (personaKey === 'SPEEDRUNNER') {
            // If we have no passive production yet, we MUST click
            const annualProd = Object.values(state.productionRates || {}).reduce((a, b) => a + (b.produced || 0), 0);

            if (annualProd < 0.1 || state.cleanCash < 2000) {
                // Simulate 20 clicks per minute (1 click every 3s avg)
                for (let i = 0; i < 20; i++) manualProduce(state);
                for (let i = 0; i < 20; i++) manualSell(state);
            }
        }

        const action = persona.actions(state, ticks);

        if (action === 'PRESTIGE') {
            prestigeCount++;
            // Reset but keep prestige
            const mult = Math.max(1, Math.log10(state.dirtyCash)); // Simplified prestige match just for sim
            state = { ...getDefaultState(), prestige: { level: prestigeCount, multiplier: mult } };
            console.log(`[Day ${(ticks / TICKS_PER_DAY).toFixed(1)}] ${persona.name} PRESTIGED! (Lvl ${prestigeCount})`);

            if (prestigeCount >= 5) break; // Goal reached
        }

        ticks++;
    }

    const daysElapsed = (ticks / TICKS_PER_DAY).toFixed(1);
    console.log(`🏁 FINISHED: ${daysElapsed} Days. Prestige Level: ${prestigeCount}. Final Cash: ${state.cleanCash.toFixed(0)}`);
    return { days: daysElapsed, prestige: prestigeCount, cash: state.cleanCash };
};

// --- EXECUTE ---
console.log("--- BALANCE SIMULATION v1.0 ---\n");
const r1 = runSimulation('SPEEDRUNNER');
const r2 = runSimulation('CASUAL');
// const r3 = runSimulation('TYCOON'); // TODO: Implement optimizer logic

// --- REPORT ---
console.log("\n\n--- TUNING REPORT ---");
if (r1.days < 1) console.log("⚠️ WARNING: Speedrunner is TOO FAST (< 1 Day to Prestige 5). Increase Base Costs.");
else if (r1.days > 100) console.log("⚠️ WARNING: Speedrunner is TOO SLOW (> 100 Days). Reduce Difficulty.");
else console.log("✅ Speedrunner Pace: Good.");

if (r2.cash < 10000 && r2.days > 50) console.log("⚠️ WARNING: Casual player is BROKE. Boost Passive Income.");
else console.log("✅ Casual Economy: Stable.");
