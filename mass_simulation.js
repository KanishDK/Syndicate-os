
import { CONFIG } from './src/config/gameConfig.js';
import { runGameTick } from './src/features/engine/gameTick.js';
import { getDefaultState } from './src/utils/initialState.js';
import { getBulkCost } from './src/utils/gameMath.js';
import fs from 'fs';

// --- CONFIGURATION ---
const SIM_COUNT = 25;
const SIM_DAYS = 180;
const TICK_RATE_MS = 5 * 60 * 1000; // 5 minute ticks for speed (Balance Sim was 1 min, but 100x slower)
const TICKS_PER_DAY = (24 * 60 * 60 * 1000) / TICK_RATE_MS;
const TOTAL_TICKS = SIM_DAYS * TICKS_PER_DAY;

// --- STEP 1: PERSONA FACTORY ---
const ARCHETYPES = {
    ENGINEER: { name: "The Engineer", int: 0.9, patience: 0.8, risk: 0.1, active: 0.5 },
    GAMBLER: { name: "The Gambler", int: 0.4, patience: 0.1, risk: 0.9, active: 0.7 },
    KID: { name: "The Kid", int: 0.3, patience: 0.1, risk: 0.5, active: 0.9 }, // Clicks a lot, bad decisions
    CASUAL: { name: "The Casual", int: 0.5, patience: 0.5, risk: 0.3, active: 0.2 },
    WHALE: { name: "The Whale", int: 0.6, patience: 0.9, risk: 0.2, active: 0.4 }, // Efficient and patient
    CHAOS: { name: "Chaos Bot", int: 0.1, patience: 0.1, risk: 1.0, active: 1.0 }
};

const generatePersonas = (count) => {
    const personas = [];
    const keys = Object.keys(ARCHETYPES);

    for (let i = 0; i < count; i++) {
        const archetypeKey = keys[Math.floor(Math.random() * keys.length)];
        const arc = ARCHETYPES[archetypeKey];

        // Fuzz attributes by +/- 0.1
        const fuzz = () => (Math.random() * 0.2) - 0.1;

        personas.push({
            id: `P${i.toString().padStart(3, '0')}`,
            archetype: archetypeKey,
            stats: {
                int: Math.min(1, Math.max(0, arc.int + fuzz())), // 1.0 = ROI Calc, 0.0 = Random
                patience: Math.min(1, Math.max(0, arc.patience + fuzz())), // 1.0 = Waits for x2 cash, 0.0 = Buys immediately
                risk: Math.min(1, Math.max(0, arc.risk + fuzz())),
                active: Math.min(1, Math.max(0, arc.active + fuzz())) // 1.0 = High Click Rate
            }
        });
    }
    return personas;
};

// --- LOGIC HELPER: ROI CALCULATOR ---
const getBestUpgrade = (state, intelligence) => {
    // If low int, return random affordable
    const affordable = Object.keys(CONFIG.upgrades).filter(k => {
        const upg = CONFIG.upgrades[k];
        const cost = getBulkCost(upg.baseCost, upg.costFactor, state.upgrades[k] || 0, 1);
        return state.cleanCash >= cost;
    });

    if (affordable.length === 0) return null;

    if (intelligence < 0.4) {
        // Random
        return affordable[Math.floor(Math.random() * affordable.length)];
    } else {
        // ROI Calculation (Simplified)
        // Sort by Cost (Cheaper is better for ROI usually early game)
        // High INT prioritizes production boosting upgrades
        return affordable.sort((a, b) => {
            const costA = getBulkCost(CONFIG.upgrades[a].baseCost, CONFIG.upgrades[a].costFactor, state.upgrades[a] || 0, 1);
            const costB = getBulkCost(CONFIG.upgrades[b].baseCost, CONFIG.upgrades[b].costFactor, state.upgrades[b] || 0, 1);
            return costA - costB;
        })[0];
    }
};

// --- STEP 2: HEADLESS ENGINE ---
const runSimulation = (persona) => {
    let state = getDefaultState();
    let ticks = 0;
    const clickPower = 1; // Base manual calc

    // Mock T
    const mockT = k => k;

    // Manual Loop
    const manualProduce = () => {
        state.inv['hash_lys'] = (state.inv['hash_lys'] || 0) + 1;
        state.heat += 0.02;
    };
    const manualSell = () => {
        if ((state.inv['hash_lys'] || 0) > 0) {
            state.inv['hash_lys']--;
            state.dirtyCash += 15;
        }
    };

    while (ticks < TOTAL_TICKS) {
        state = runGameTick(state, TICK_RATE_MS, mockT);

        // 1. MANUAL LABOR (Based on Activity)
        // Base: 10 clicks per min if active = 1.0
        // Scale by tick rate (5 mins = 50 clicks max)
        if (state.cleanCash < 5000) { // Only click in early game
            const clicksPerTick = Math.floor(persona.stats.active * 50);
            for (let i = 0; i < clicksPerTick; i++) {
                manualProduce();
                manualSell();
            }
        }

        // 2. HIRING (Casual/Auto) logic
        // Only Smart players hire PUSHERS first if they have Producers
        // Low INT players might hire Junkies endlessly
        if (state.cleanCash > 1500) {
            // Basic Automation Priority
            if ((state.staff.junkie || 0) < 5 && state.cleanCash >= 1500) {
                state.cleanCash -= 1000;
                state.staff.junkie = (state.staff.junkie || 0) + 1;
            }
            if ((state.staff.pusher || 0) < 2 && state.cleanCash >= 1500) {
                state.cleanCash -= 1500;
                state.staff.pusher = (state.staff.pusher || 0) + 1;
            }
        }

        // 3. UPGRADES
        // Patience Check: Don't buy if cash < cost * (1 + patience)
        const bestUpg = getBestUpgrade(state, persona.stats.int);
        if (bestUpg) {
            const upg = CONFIG.upgrades[bestUpg];
            const cost = getBulkCost(upg.baseCost, upg.costFactor, state.upgrades[bestUpg] || 0, 1);

            const buffer = 1 + persona.stats.patience; // 1.0 to 2.0 buffer
            if (state.cleanCash >= cost * buffer) {
                state.cleanCash -= cost;
                state.upgrades[bestUpg] = (state.upgrades[bestUpg] || 0) + 1;
            }
        }

        // 4. PRESTIGE
        // High Risk = Prestige Early (at threshold)
        // Low Risk = Prestige Late (waits for 1.5x threshold)
        const riskFactor = 1.5 - (persona.stats.risk * 0.5); // 1.0 (High Risk) to 1.5 (Low Risk) thresh
        if (state.dirtyCash >= CONFIG.prestige.threshold * riskFactor) {
            // DO PRESTIGE
            const gained = Math.floor(state.dirtyCash / 100000); // Mock Formula
            state.prestige.level++;
            state.prestige.currency += gained;
            state.prestige.multiplier += (gained * 0.1);

            // Hard Reset
            state.dirtyCash = 0;
            state.cleanCash = CONFIG.initialCash;
            // Clear Inv/Staff/Upgrades but keep Prestige
            state.staff = getDefaultState().staff;
            state.inv = getDefaultState().inv;
            state.upgrades = Object.keys(CONFIG.upgrades).reduce((a, k) => ({ ...a, [k]: 0 }), { warehouse: 1 });
        }

        ticks++;
    }

    return {
        id: persona.id,
        arch: persona.archetype,
        finalCash: state.cleanCash,
        prestigeLvl: state.prestige.level,
        stats: persona.stats
    };
};

// --- MAIN EXECUTION ---
console.log(`🤖 INITIALIZING MASS SIMULATION (${SIM_COUNT} Personas, ${SIM_DAYS} Days)...`);
const personas = generatePersonas(SIM_COUNT);
const results = [];

const start = Date.now();
personas.forEach((p, idx) => {
    // Basic progress bar
    if (idx % 10 === 0) process.stdout.write('.');
    results.push(runSimulation(p));
});
const end = Date.now();
console.log(`\n✅ COMPLETED in ${((end - start) / 1000).toFixed(2)}s`);

// --- AGREGRATION & REPORT ---
const totalCash = results.reduce((a, b) => a + b.finalCash, 0);
const totalPres = results.reduce((a, b) => a + b.prestigeLvl, 0);
const avgCash = totalCash / SIM_COUNT;
const avgPres = totalPres / SIM_COUNT;

const sortedByCash = [...results].sort((a, b) => b.finalCash - a.finalCash);
const top1 = sortedByCash[0];
const bottom1 = sortedByCash[results.length - 1];

const failed = results.filter(r => r.prestigeLvl === 0 && r.finalCash < 5000).length;

console.log("\n📊 --- MASS SIMULATION REPORT ---");
console.log(`Population: ${SIM_COUNT}`);
console.log(`Avg Prestige: ${avgPres.toFixed(1)}`);
console.log(`Avg Cash: ${avgCash.toFixed(0)}`);
console.log(`Fail Rate (Stuck): ${failed}%`);
console.log("\n🏆 TOP PERFORMER:");
console.log(`[${top1.arch}] P-Lvl: ${top1.prestigeLvl}, Cash: ${top1.finalCash.toFixed(0)}, INT: ${top1.stats.int.toFixed(2)}, ACT: ${top1.stats.active.toFixed(2)}`);
console.log("\n💀 WORST PERFORMER:");
console.log(`[${bottom1.arch}] P-Lvl: ${bottom1.prestigeLvl}, Cash: ${bottom1.finalCash.toFixed(0)}, INT: ${bottom1.stats.int.toFixed(2)}, ACT: ${bottom1.stats.active.toFixed(2)}`);

// Correlation Analysis
console.log("\n📈 CORRELATIONS:");
const engineers = results.filter(r => r.arch === 'ENGINEER');
const avgEngPres = engineers.reduce((a, b) => a + b.prestigeLvl, 0) / engineers.length;
console.log(`Engineers (High INT) Avg Prestige: ${avgEngPres.toFixed(1)}`);

const kids = results.filter(r => r.arch === 'KID');
const avgKidPres = kids.reduce((a, b) => a + b.prestigeLvl, 0) / kids.length;
console.log(`Kids (High ACT, Low INT) Avg Prestige: ${avgKidPres.toFixed(1)}`);
