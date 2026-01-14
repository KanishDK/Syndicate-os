
/**
 * SYNDICATE OS - CHAOS BETA SIMULATION
 * Advanced Stress Test for Long-term Stability, Scalability, and Extreme Edge Cases
 */

// --- BROWSER MOCKS FOR NODE ---
const mockWindow = {
    AudioContext: class {
        suspend() { }
        resume() { }
        createOscillator() { return { connect: () => { }, frequency: { setValueAtTime: () => { }, exponentialRampToValueAtTime: () => { }, linearRampToValueAtTime: () => { }, value: 0 }, start: () => { }, stop: () => { }, type: '' }; }
        createGain() { return { connect: () => { }, gain: { setValueAtTime: () => { }, exponentialRampToValueAtTime: () => { }, linearRampToValueAtTime: () => { } } }; }
        get destination() { return {}; }
        get currentTime() { return Date.now() / 1000; }
        get state() { return 'running'; }
    },
    webkitAudioContext: class { },
    localStorage: {
        getItem: () => null,
        setItem: () => { },
    },
    addEventListener: () => { },
    removeEventListener: () => { },
    navigator: { userAgent: 'node' },
    location: { href: '' }
};
mockWindow.webkitAudioContext = mockWindow.AudioContext;

globalThis.window = mockWindow;
globalThis.localStorage = mockWindow.localStorage;
globalThis.AudioContext = mockWindow.AudioContext;
globalThis.webkitAudioContext = mockWindow.webkitAudioContext;
globalThis.document = {
    getElementById: () => null,
    createElement: () => ({}),
    head: { appendChild: () => { } },
    body: { className: '' },
    documentElement: { setAttribute: () => { } }
};
try { globalThis.navigator = mockWindow.navigator; } catch (e) { }

// --- DYNAMIC IMPORTS ---
let CONFIG, getDefaultState, processEconomy, processProduction, processMissions, processEvents;

// --- SIMULATION CONFIG ---
const NODES_COUNT = 25;
const SIM_DAYS = 730; // 2 Years
const SECONDS_IN_DAY = 24 * 60 * 60;
const TOTAL_TICKS = SIM_DAYS * SECONDS_IN_DAY;
const t = (key) => key;

// --- PERSONA DEFINITIONS (CHAOS TUNED) ---
const PERSONAS = {
    CASUAL: { name: 'Casual Survivor', clickRate: 0.005, investmentWill: 0.05 },
    HUSTLER: { name: 'Aggressive Hustler', clickRate: 0.1, investmentWill: 0.4 },
    WHALE: { name: 'Market Titan', clickRate: 0.5, investmentWill: 0.95 },
    SABOTEUR: { name: 'Agent of Chaos', clickRate: 5.0, negativeInputs: true },
    STRESS_BOT: { name: 'Logic Stresser', clickRate: 10.0, investmentWill: 1.0 }
};

// --- SIMULATION NODE ---
class ChaosNode {
    constructor(id, name, persona) {
        this.id = id;
        this.name = name;
        this.persona = persona;
        this.state = null;
        this.isCrashed = false;
        this.stats = {
            totalClicks: 0,
            naNEncounters: 0,
            mercyTriggers: 0,
            logicDuration: 0,
            peakClean: 0,
            totalBlackSwans: 0
        };
    }

    init() {
        this.state = getDefaultState();
    }

    tick(dt, currentTime) {
        if (this.isCrashed || !this.state) return;

        const startTime = Date.now();
        const prevMercy = this.state.hasReceivedMercy;

        try {
            this.applyPersonaActions(dt);
            this.state = processEconomy(this.state, dt);
            this.state = processProduction(this.state, dt);
            this.state = processMissions(this.state);
            this.state = processEvents(this.state, dt, t);

            // Manual Caps Verification
            if (this.state.cleanCash > 1e15) this.stats.peakClean = Math.max(this.stats.peakClean, this.state.cleanCash);

            if (!prevMercy && this.state.hasReceivedMercy) {
                this.stats.mercyTriggers++;
            }

            this.checkIntegrity();
        } catch (error) {
            this.isCrashed = true;
            console.error(`Chaos Node ${this.name} (${this.id}) CRASHED: ${error.message}`);
        }

        const endTime = Date.now();
        this.stats.logicDuration += (endTime - startTime);
    }

    applyPersonaActions(dt) {
        const p = this.persona;
        const s = this.state;

        if (Math.random() < p.clickRate * dt) {
            this.stats.totalClicks++;
            s.inv['hash_lys'] = (s.inv['hash_lys'] || 0) + 1;
        }

        if (Math.random() < p.investmentWill * 0.02 * dt) {
            if (s.cleanCash > 5000 && s.staff.pusher < 50) s.staff.pusher++;
            const t = CONFIG.territories.find(ter => !s.territories.includes(ter.id));
            if (t && s.cleanCash >= t.baseCost) {
                s.territories.push(t.id);
                s.cleanCash -= t.baseCost;
            }
        }

        if (p.negativeInputs && Math.random() < 0.1 * dt) {
            s.cleanCash -= 100000;
            s.dirtyCash -= 100000;
        }
    }

    checkIntegrity() {
        if (!Number.isFinite(this.state.cleanCash) || !Number.isFinite(this.state.dirtyCash)) {
            this.stats.naNEncounters++;
            this.state.cleanCash = 0;
            this.state.dirtyCash = 0;
        }
    }

    triggerBlackSwan(type) {
        this.stats.totalBlackSwans++;
        if (type === 'FED_RAID') {
            this.state.dirtyCash *= 0.1; // Seize 90%
            this.state.heat = 100;
        } else if (type === 'MARKET_CRASH') {
            this.state.cleanCash *= 0.5; // Wipe 50% clean cash
        }
    }
}

// --- MAIN RUNNER ---
async function runChaosSimulation() {
    console.log(`Initializing Chaos Environment for 25 nodes...`);

    try {
        ({ CONFIG } = await import('./src/config/gameConfig.js'));
        ({ getDefaultState } = await import('./src/utils/initialState.js'));
        ({ processEconomy } = await import('./src/features/engine/economy.js'));
        ({ processProduction } = await import('./src/features/engine/production.js'));
        ({ processMissions } = await import('./src/features/engine/missions.js'));
        ({ processEvents } = await import('./src/features/engine/events.js'));
    } catch (e) {
        console.error("Critical: Failed to load core engine:", e);
        process.exit(1);
    }

    const nodes = [];
    const personaKeys = Object.keys(PERSONAS);
    for (let i = 0; i < NODES_COUNT; i++) {
        const persona = PERSONAS[personaKeys[i % personaKeys.length]];
        const node = new ChaosNode(i, `Chaos-Node-${i}`, { ...persona });
        node.init();
        nodes.push(node);
    }

    console.log(`\n🚀 Starting Chaos Beta Stress Test...`);
    console.log(`Scale: 25 Clusters | Duration: 730 Days | Longevity Focus`);

    const CHUNK_SIZE = 3600 * 24; // 1 Day per chunk for speed
    const TOTAL_CHUNKS = SIM_DAYS;

    for (let d = 0; d < TOTAL_CHUNKS; d++) {
        if (d % 60 === 0) console.log(`Simulating Month ${Math.floor(d / 30)}...`);

        // Global Black Swan Logic
        let swan = null;
        if (Math.random() < 0.02) swan = 'FED_RAID';
        else if (Math.random() < 0.01) swan = 'MARKET_CRASH';

        nodes.forEach(node => {
            if (swan) node.triggerBlackSwan(swan);
            node.tick(SECONDS_IN_DAY, d * SECONDS_IN_DAY);
        });
    }

    // --- FINAL REPORT ---
    const finalReport = {
        meta: {
            daysSimulated: SIM_DAYS,
            nodesRunning: nodes.filter(n => !n.isCrashed).length,
            crashedNodes: nodes.filter(n => n.isCrashed).length
        },
        mechanicVerification: {
            sultansMercyTriggers: nodes.reduce((acc, n) => acc + n.stats.mercyTriggers, 0),
            naNEncounters: nodes.reduce((acc, n) => acc + n.stats.naNEncounters, 0),
            currencyCapHits: nodes.filter(n => n.stats.peakClean >= 1e15).length
        },
        chaosStats: {
            totalBlackSwans: nodes.reduce((acc, n) => acc + n.stats.totalBlackSwans, 0),
            avgWealth: nodes.reduce((acc, n) => acc + n.state.cleanCash, 0) / NODES_COUNT
        }
    };

    console.log("\n--- CHAOS SIMULATION COMPLETE ---");
    console.log(JSON.stringify(finalReport, null, 2));

    const score = (finalReport.meta.nodesRunning / NODES_COUNT) * 100;
    console.log(`\nFinal Reliability Score: ${score.toFixed(2)}%`);
    if (score === 100) console.log("💎 STATUS: MASTERPIECE CONFIRMED.");
}

runChaosSimulation();
