
import fs from 'fs';
import path from 'path';
import { Personas } from './personas.js';
import { SimActions } from './simActions.js';
import { CONFIG } from '../../src/config/gameConfig.js';
import { runGameTick } from '../../src/features/engine/gameTick.js';
import { getDefaultState } from '../../src/utils/initialState.js';

// Configuration
// 1 Step = 300 Seconds (5 Minutes)
const DT_PER_STEP = 300;
const SIM_STEPS = 105120; // 1 Year (Standard Test)
const DEBUG_MODE = false;
const REPORT_PATH = path.resolve('beta_report.md');

// Mock Translation Function
const t = (k, params) => {
    if (params) return `${k} ${JSON.stringify(params)}`;
    return k;
};

// GLOBAL DATE MOCK
// We need to override Date.now() because the engine uses it for cooldowns/intervals.
let SIM_CURRENT_TIME = Date.now();
const _originalDateNow = Date.now;
Date.now = () => SIM_CURRENT_TIME;

// Initial State Wrapper
const getInitialState = () => {
    const s = getDefaultState();
    // Ensure timestamps align with sim time
    s.payroll.lastPaid = SIM_CURRENT_TIME;
    s.bank.lastInterest = SIM_CURRENT_TIME;
    return s;
};

const runSimulation = () => {
    console.log(`🚀 STARTING REAL-ENGINE BETA SIMULATION (${SIM_STEPS} Steps of 1min)...`);

    const results = [];

    const personaList = Object.entries(Personas);

    // User Request: 4 Essential Personas Only
    // DNA Injection for Genetic Algorithm
    const injectedDNA = process.env.SIM_DNA ? JSON.parse(process.env.SIM_DNA) : null;
    const isSilent = process.env.SIM_SILENT === 'true';

    // Mock Config if not present
    const SIM_PERSONAS = ['kingpin']; // Default
    const SIM_YEARS = 1;
    const STEPS_PER_DAY = 1440;
    // const SIM_STEPS = STEPS_PER_DAY * 365 * SIM_YEARS; // This line is commented out because SIM_STEPS is already defined above
    // const DT_PER_STEP = 60000; // 1 min per step // This line is commented out because DT_PER_STEP is already defined above

    // Override console.log if silent
    const originalLog = console.log;
    if (isSilent) {
        console.log = () => { };
    }

    const ESSENTIALS = ['kingpin', 'speedrunner', 'saver', 'investor'];

    for (let id in Personas) {
        if (!ESSENTIALS.includes(id)) continue;
        const persona = Personas[id];

        console.log(`\n👤 Initializing Persona: ${persona.name}`);

        // Reset Sim Time
        SIM_CURRENT_TIME = _originalDateNow();

        let state = getDefaultState();
        let history = [];
        let bankruptcyTick = -1;
        let step = 0; // Move output scope

        try {
            for (step = 0; step < SIM_STEPS; step++) {
                // 1. ADVANCE TIME
                SIM_CURRENT_TIME += DT_PER_STEP * 1000; // ms

                // 1.5 CRYPTO MOCK VOLATILITY
                if (!state.crypto) state.crypto = { prices: {}, wallet: {} };
                if (!state.crypto.prices) state.crypto.prices = {};

                // Random Walk every 60 steps (1 hour)
                if (step % 60 === 0) {
                    ['bitcoin', 'ethereum', 'monero'].forEach(coin => {
                        const base = CONFIG.crypto.coins[coin].basePrice;
                        const current = state.crypto.prices[coin] || base;
                        const vol = CONFIG.crypto.coins[coin].volatility;
                        const change = 1 + (Math.random() * vol * 2 - vol); // +/- volatility
                        state.crypto.prices[coin] = current * change;
                    });
                }

                // 2. ENGINE TICK
                // Pass 't' as translator
                state = runGameTick(state, DT_PER_STEP, t);

                // 3. PERSONA DECISION 
                // Inject DNA if present
                const action = persona.decide(state, history, injectedDNA || {});
                if (action) {
                    // TELEMETRY: Add to Journal
                    const entry = { step, type: action.type, reason: action.reason || 'Logic', details: action };
                    // Filter spam (don't log every staff buy, just summary? No, user wants ALL details).
                    // We will summarize later.
                    history.push(entry);

                    if (step < 10) console.log(`Step ${step} ${persona.name} Action:`, action);

                    // Execute
                    if (action.type === 'buyStaff') state = SimActions.buyStaff(state, action);
                    if (action.type === 'buyUpgrade') state = SimActions.buyUpgrade(state, action);
                    if (action.type === 'bribePolice') state = SimActions.bribePolice(state);
                    if (action.type === 'launder') state = SimActions.launder(state, action);

                    // NEW HANDLERS from v2.0
                    if (action.type === 'doPrestige') {
                        state = SimActions.doPrestige(state);
                        // Log Prestige Specific
                        history.push({ step, type: 'PRESTIGE_EVENT', reason: action.reason, level: state.level });
                    }
                    if (action.type === 'buyPerk') state = SimActions.buyPerk(state, action);
                    if (action.type === 'buyMasteryPerk') state = SimActions.buyMasteryPerk(state, action);
                    if (action.type === 'buyCrypto') state = SimActions.buyCrypto(state, action);
                    if (action.type === 'sellCrypto') state = SimActions.sellCrypto(state, action);
                    if (action.type === 'borrow') state = SimActions.borrow(state, action);
                    if (action.type === 'repay') state = SimActions.repay(state, action);
                    if (action.type === 'buyDiamondPack') state = SimActions.buyDiamondPack(state, action);

                    // Tutorial/Daily
                    if (action.type === 'completeTutorial') state = SimActions.completeTutorial(state, action);
                    if (action.type === 'readManual') state = SimActions.readManual(state, action);
                    if (action.type === 'claimDaily') state = SimActions.claimDaily(state, action);

                    // Action Mapping
                    if (action.type === 'conquerTerritory') state = SimActions.conquerTerritory(state, action);
                    if (action.type === 'upgradeTerritory') state = SimActions.upgradeTerritory(state, action);
                    if (action.type === 'buyDefense') state = SimActions.buyDefense(state, action);
                    if (action.type === 'purchaseLuxury') state = SimActions.purchaseLuxury(state, action);
                    if (action.type === 'handleMissionChoice') state = SimActions.handleMissionChoice(state, action);
                } else {
                    if (id === 'speedrunner' && step < 5) console.log(`Step ${step} Speedrunner: No Action`);
                }

                // Check Bankruptcy
                if (state.dirtyCash < -500000 && bankruptcyTick === -1) {
                    bankruptcyTick = step;
                }

                // Snapshot every ~1 month (8640 steps)
                if (step % 8640 === 0) {
                    // Minimal snapshot for history graph
                }
            } // End Loop
        } catch (err) {
            console.error(`❌ CRASH at Step ${step} for ${persona.name}:`, err);
        }

        // --- POST-SIM ANALYSIS ---
        // summarize journal
        const staffSummary = Object.entries(state.staff).map(([k, v]) => `${k}: ${v}`).join(', ');
        const upgradesSummary = Object.keys(state.upgrades).join(', ');
        const prestigeEvents = history.filter(h => h.type === 'PRESTIGE_EVENT').map(h => `Step ${h.step} (Reason: ${h.reason})`);
        const cryptoProfits = (state.cleanCash + state.dirtyCash) - 5000; // Rough calc
        const missionsDone = state.completedMissions?.length || 0;

        results.push({
            name: persona.name,
            finalCash: state.cleanCash,
            finalDirty: state.dirtyCash,
            finalNet: state.cleanCash + state.dirtyCash,
            level: state.level,
            staffSummary,
            upgradesSummary,
            prestigeEvents,
            prestigeCount: state.prestige?.count || 0,
            diamonds: state.prestige?.diamonds || 0,
            perks: Object.keys(state.prestige?.perks || {}).length,
            cryptoWallet: JSON.stringify(state.crypto?.wallet),
            missionsDone,
            flags: state.flags,
            history, // Store full journal for deep diving
            // Evolution Data (for fitness calculation)
            districts: state.districts || {},
            upgrades: state.upgrades || {},
            defenses: state.defense || {} // Note: state uses 'defense' (singular)
        });
        console.log(`✅ Finished ${persona.name}. Level: ${state.level}, Prestige: ${state.prestige?.count || 0}, Net: ${Math.floor(state.cleanCash + state.dirtyCash).toLocaleString()}`);
    }

    // Send Result to Parent Process (Genetic Algo)
    if (process.send && injectedDNA) {
        // Find the single persona result (We assume 1 persona per fork for now)
        const res = results[0];
        if (res) {
            process.send({
                type: 'RESULT',
                data: {
                    netWorth: res.finalNet,
                    prestige: res.prestigeCount,
                    level: res.level,
                    districts: res.districts, // Passing full objects or counts
                    upgrades: res.upgrades,
                    defenses: res.defenses
                }
            });
        }
        process.exit(0);
    }

    generateDeepReport(results);

    // Restore Date
    Date.now = _originalDateNow;
};

const generateDeepReport = (results) => {
    let md = `# 📊 COMPREHENSIVE SIMULATION REPORT\n`;
    md += `**Date**: ${new Date(_originalDateNow()).toLocaleString()}\n`;
    md += `**Steps**: ${SIM_STEPS} (${Math.floor(SIM_STEPS / 1440)} Days)\n\n`;

    results.forEach(r => {
        md += `## 👤 ${r.name}\n`;
        md += `### 📈 Vital Stats\n`;
        md += `- **Net Worth**: ${Math.floor(r.finalNet).toLocaleString()} kr\n`;
        md += `- **Level**: ${r.level}\n`;
        md += `- **Prestige Count**: ${r.prestigeCount}\n`;
        md += `- **Diamonds**: ${r.diamonds}\n`;
        md += `- **Perks Unlocked**: ${r.perks}\n`;

        md += `### 🛠️ Logistics & Staff\n`;
        md += `- **Staff**: ${r.staffSummary}\n`;
        md += `- **Upgrades**: ${r.upgradesSummary || 'None'}\n`;
        md += `- **Missions Completed**: ${r.missionsDone}\n`;
        md += `- **Tutorial/Manual**: ${r.flags?.tutorialComplete ? '✅ Done' : '❌ Skipped'} / ${r.flags?.readManual ? '✅ Read' : '❌ Unread'}\n`;

        md += `### 🔄 Prestige Log\n`;
        if (r.prestigeEvents.length > 0) {
            r.prestigeEvents.forEach(e => md += `- ${e}\n`);
        } else {
            md += `- No Prestige Resets.\n`;
        }

        md += `### 💰 Financials\n`;
        md += `- **Crypto Wallet**: ${r.cryptoWallet}\n`;
        md += `- **Daily Claims**: ${r.flags?.dailyClaimed ? '✅ Yes' : '❌ No'}\n`;

        md += `### 🧠 Decision Journal (Sample)\n`;
        // Show 10 interesting decisions
        // Filter out boring staff buys unless they had a special reason
        const sample = r.history.filter(h => h.reason && h.reason !== 'Logic').slice(0, 15);
        if (sample.length === 0) md += `(No special decisions logged)\n`;
        sample.forEach(s => md += `- Step ${s.step}: ${s.type} **(${s.reason})**\n`);

        md += `\n---\n`;
    });

    fs.writeFileSync(REPORT_PATH, md);
    console.log(`\n📄 Report generated: ${REPORT_PATH}`);
};

runSimulation();
