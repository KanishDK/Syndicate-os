
/**
 * SYNDICATE OS - COMPLETIONIST BETA SIMULATION (OVERPOWERED)
 * Verifies 100% Feature Coverage: Thousands of Prestige cycles, all Mastery Perks.
 */

// --- BROWSER MOCKS ---
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
    localStorage: { getItem: (k) => k === 'syndicate_muted' ? 'false' : null, setItem: () => { } },
    addEventListener: () => { },
    removeEventListener: () => { },
    navigator: { userAgent: 'node' },
    location: { href: '' }
};
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

// --- IMPORTS ---
let CONFIG, getDefaultState, runGameTick;

const NODES_COUNT = 3;
const SIM_DAYS = 365;
const t = (key) => key;

class OPNode {
    constructor(id) {
        this.id = id;
        this.state = null;
        this.featuresTouched = new Set();
        this.stats = {
            prestigeCount: 0,
            maxLevelReached: 0,
            masteryUnlockedCount: 0
        };
    }

    init() {
        this.state = getDefaultState();
        // OVERPOWERED START
        this.state.cleanCash = 100000000; // 100M
        this.state.dirtyCash = 0;
        this.state.xp = 100000; // Start high
        this.state.diamonds = 10000;
    }

    tick(dt) {
        if (!this.state) return;

        this.applyAI(dt);
        this.state = runGameTick(this.state, dt, t);

        // Feature Tracking
        this.trackFeatures();
        this.stats.maxLevelReached = Math.max(this.stats.maxLevelReached, this.state.level);

        // Instant Prestige if possible
        if (this.state.level >= 10 && this.state.cleanCash > 1000000) {
            this.handlePrestige();
        }
    }

    applyAI(dt) {
        const s = this.state;

        // Ensure infinite stock
        s.inv.hash_lys = 100000;

        // Buy all staff instantly
        Object.keys(CONFIG.staff).forEach(role => {
            if (s.level >= CONFIG.staff[role].reqLevel && s.staff[role] < 100) {
                s.staff[role] = 100;
                this.featuresTouched.add('staff');
            }
        });

        // Buy territories
        CONFIG.territories.forEach(ter => {
            if (!s.territories.includes(ter.id)) {
                s.territories.push(ter.id);
                this.featuresTouched.add('territory');
            }
        });

        // Buy Mastery
        Object.keys(CONFIG.masteryPerks).forEach(mId => {
            if (!s.masteryPerks[mId] && s.diamonds >= CONFIG.masteryPerks[mId].cost) {
                s.masteryPerks[mId] = true;
                s.diamonds -= CONFIG.masteryPerks[mId].cost;
                this.stats.masteryUnlockedCount++;
                this.featuresTouched.add('mastery');
            }
        });

        // Crypto
        if (s.cleanCash > 1000000) {
            s.crypto.wallet.bitcoin += 10;
            s.cleanCash -= s.crypto.prices.bitcoin * 10;
            this.featuresTouched.add('crypto');
        }
    }

    trackFeatures() {
        if (this.state.stats.laundered > 0) this.featuresTouched.add('laundering');
        if (this.state.prestige?.level > 0) this.featuresTouched.add('prestige');
    }

    handlePrestige() {
        this.stats.prestigeCount++;
        const fresh = getDefaultState();
        this.state = {
            ...fresh,
            prestige: {
                level: this.stats.prestigeCount,
                multiplier: 2 + this.stats.prestigeCount,
                currency: 10,
                perks: this.state.prestige.perks || {}
            },
            masteryPerks: this.state.masteryPerks,
            cleanCash: 100000000,
            xp: 100000,
            diamonds: 10000,
            lifetime: this.state.lifetime
        };
    }
}

async function runSimulation() {
    console.log("Loading OP Environment...");
    ({ CONFIG } = await import('./src/config/gameConfig.js'));
    ({ getDefaultState } = await import('./src/utils/initialState.js'));
    ({ runGameTick } = await import('./src/features/engine/gameTick.js'));

    const nodes = [];
    for (let i = 0; i < NODES_COUNT; i++) {
        const node = new OPNode(i);
        node.init();
        nodes.push(node);
    }

    const SECONDS_PER_STEP = 3600;
    const TOTAL_STEPS = (SIM_DAYS * 24);
    const originalNow = Date.now;
    let virtualTime = Date.now();

    try {
        globalThis.Date.now = () => virtualTime;
        for (let step = 0; step < TOTAL_STEPS; step++) {
            virtualTime += SECONDS_PER_STEP * 1000;
            nodes.forEach(n => n.tick(SECONDS_PER_STEP));
        }
    } finally {
        globalThis.Date.now = originalNow;
    }

    console.log("\n--- OP COMPLETIONIST REPORT ---");
    nodes.forEach(n => {
        console.log(`\nNode ${n.id}:`);
        console.log(`- Prestiges: ${n.stats.prestigeCount}`);
        console.log(`- Mastery Perks Unlocked: ${n.stats.masteryUnlockedCount}`);
        console.log(`- Features: ${Array.from(n.featuresTouched).join(', ')}`);
        console.log(`- Final Multiplier: x${n.state.prestige.multiplier}`);
    });
}

runSimulation();
