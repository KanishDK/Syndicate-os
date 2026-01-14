
/**
 * SYNDICATE OS - PERSONA BETA SIMULATION (3 YEARS - FINAL)
 * Verifies Game Experience for 5 Distinct User Archetypes
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
try { globalThis.navigator = mockWindow.navigator; } catch (e) { }

// --- IMPORTS ---
let CONFIG, getDefaultState, runGameTick;

const SIM_DAYS = 1095;
const t = (key) => key;

class BasePersona {
    constructor(name, description) {
        this.name = name;
        this.description = description;
        this.state = null;
        this.stats = {
            prestigeCount: 0,
            maxLevel: 0,
            totalEarnings: 0,
            naNEncounters: 0,
            featuresUsed: new Set()
        };
    }

    init() {
        this.state = getDefaultState();
        // SUBSTANTIAL STARTER BOOST (The "Initial Deposit")
        this.state.cleanCash += 25000;
        this.state.dirtyCash += 10000;
        this.state.xp += 500; // Start at Level 2/3
        this.state.inv.hash_lys = 100;
        // Auto-Sell ON by default for sim
        Object.keys(this.state.autoSell).forEach(k => this.state.autoSell[k] = true);
    }

    tick(dt) {
        if (!this.state) return;
        this.applyAI(dt);
        const oldClean = this.state.cleanCash;
        this.state = runGameTick(this.state, dt, t);
        if (this.state.cleanCash > oldClean) this.stats.totalEarnings += (this.state.cleanCash - oldClean);
        this.stats.maxLevel = Math.max(this.stats.maxLevel, this.state.level);
        if (!Number.isFinite(this.state.cleanCash)) this.stats.naNEncounters++;
    }

    handlePrestige(targetLevel = 10) {
        if (this.state.level >= targetLevel && this.state.cleanCash > 500000) {
            this.stats.prestigeCount++;
            this.stats.featuresUsed.add('prestige');
            const fresh = getDefaultState();
            this.state = {
                ...fresh,
                prestige: {
                    level: this.stats.prestigeCount,
                    multiplier: 1.5 + (this.stats.prestigeCount * 0.5),
                    currency: this.stats.prestigeCount * 2,
                    perks: this.state.prestige?.perks || {}
                },
                lifetime: this.state.lifetime,
                cleanCash: 25000,
                xp: 500
            };
            Object.keys(this.state.autoSell).forEach(k => this.state.autoSell[k] = true);
        }
    }
}

class TeenagerPersona extends BasePersona {
    applyAI(dt) {
        const s = this.state;
        // Very active clicking / buying
        if (Math.random() < 0.4) {
            s.inv.hash_lys = (s.inv.hash_lys || 0) + 10;
            s.xp += 2;
        }
        Object.keys(CONFIG.staff).forEach(role => {
            if (s.cleanCash > CONFIG.staff[role].baseCost && s.level >= CONFIG.staff[role].reqLevel) {
                if (s.staff[role] < 50) {
                    s.staff[role]++;
                    s.cleanCash -= CONFIG.staff[role].baseCost;
                    this.stats.featuresUsed.add('staff_scaling');
                }
            }
        });
        this.handlePrestige(11);
    }
}

class ExpertPersona extends BasePersona {
    applyAI(dt) {
        const s = this.state;
        // ROI-Optimal staffing
        const roles = ['pusher', 'grower', 'distributor', 'chemist', 'trafficker'].filter(r => s.level >= CONFIG.staff[r].reqLevel);
        if (roles.length > 0) {
            const role = roles[Math.floor(Math.random() * roles.length)];
            if (s.cleanCash > CONFIG.staff[role].baseCost) {
                s.staff[role]++;
                s.cleanCash -= CONFIG.staff[role].baseCost;
                this.stats.featuresUsed.add('expert_hires');
            }
        }
        // Aggressive Expansion
        CONFIG.territories.forEach(ter => {
            if (!s.territories.includes(ter.id) && s.cleanCash > ter.baseCost) {
                s.territories.push(ter.id);
                this.stats.featuresUsed.add('territorial_dominance');
            }
        });
        this.handlePrestige(10);
    }
}

class StrategistPersona extends BasePersona {
    applyAI(dt) {
        const s = this.state;
        // Bribes & Upgrades
        if (s.heat > 15 && s.dirtyCash > 50000) {
            s.dirtyCash -= 50000;
            s.heat = Math.max(0, s.heat - 25);
            this.stats.featuresUsed.add('strategic_bribes');
        }
        Object.keys(CONFIG.upgrades).forEach(upId => {
            if (s.cleanCash > CONFIG.upgrades[upId].baseCost && (s.upgrades[upId] || 0) < 5) {
                s.upgrades[upId] = (s.upgrades[upId] || 0) + 1;
                s.cleanCash -= CONFIG.upgrades[upId].baseCost;
                this.stats.featuresUsed.add('long_term_upgrades');
            }
        });
        this.handlePrestige(14);
    }
}

class DeveloperPersona extends BasePersona {
    applyAI(dt) {
        const s = this.state;
        // Torture test: Max specific role & artificial spikes
        const role = 'labtech';
        if (s.cleanCash > CONFIG.staff[role].baseCost) {
            s.staff[role] = (s.staff[role] || 0) + 20;
            s.cleanCash -= 20 * CONFIG.staff[role].baseCost;
            this.stats.featuresUsed.add('system_torture');
        }
        if (Math.random() < 0.1) s.xp += 2000;
        this.handlePrestige(10);
    }
}

class KingpinPersona extends BasePersona {
    applyAI(dt) {
        const s = this.state;
        // Underworld focus
        const danishAreas = ['noerrebro', 'city', 'vestegnen'];
        CONFIG.territories.forEach(ter => {
            if (danishAreas.includes(ter.id) && !s.territories.includes(ter.id) && s.cleanCash > ter.baseCost) {
                s.territories.push(ter.id);
                this.stats.featuresUsed.add('kingpin_territory');
            }
        });
        // Aggressive Laundering
        if (s.dirtyCash > 10000) {
            const amount = Math.min(s.dirtyCash, 50000);
            s.cleanCash += (amount * 0.8);
            s.dirtyCash -= amount;
            this.stats.featuresUsed.add('underworld_money_laundering');
        }
        this.handlePrestige(10);
    }
}

async function runPersonaSimulation() {
    console.log("Loading Persona Simulation Environment (Final)...");
    ({ CONFIG } = await import('./src/config/gameConfig.js'));
    ({ getDefaultState } = await import('./src/utils/initialState.js'));
    ({ runGameTick } = await import('./src/features/engine/gameTick.js'));

    const personas = [
        new TeenagerPersona("The Teenager", "Casual Phone Gamer"),
        new ExpertPersona("The Expert", "Pro Tycoon Player"),
        new StrategistPersona("The Strategist", "Lady 40s (Math focus)"),
        new DeveloperPersona("The Developer", "AAA Dev (Stress focus)"),
        new KingpinPersona("The Kingpin", "Underworld Kingpin (Lore focus)")
    ];

    personas.forEach(p => p.init());

    console.log(`\n👥 Starting Final Persona Beta (3 Years / 1095 Days)...`);

    const SECONDS_PER_STEP = 3600;
    const TOTAL_STEPS = (SIM_DAYS * 24);
    const originalNow = Date.now;
    let virtualTime = Date.now();

    try {
        globalThis.Date.now = () => virtualTime;
        for (let step = 0; step < TOTAL_STEPS; step++) {
            virtualTime += SECONDS_PER_STEP * 1000;
            personas.forEach(p => p.tick(SECONDS_PER_STEP));

            if (step % (24 * 30 * 12) === 0 && step > 0) {
                console.log(`Year ${Math.floor(step / (24 * 365))} complete...`);
            }
        }
    } finally {
        globalThis.Date.now = originalNow;
    }

    console.log("\n--- FINAL PERSONA BEHAVIORAL REPORT ---");
    personas.forEach(p => {
        console.log(`\n[${p.name}]`);
        console.log(`- Prestiges: ${p.stats.prestigeCount}`);
        console.log(`- Peak Level: ${p.stats.maxLevel}`);
        console.log(`- Earnings: ${Math.floor(p.stats.totalEarnings).toLocaleString()} kr.`);
        console.log(`- Features Touched: ${Array.from(p.stats.featuresUsed).join(', ')}`);
        console.log(`- Stability: ${p.stats.naNEncounters === 0 ? 'ROCK SOLID' : 'ERRORS DETECTED'}`);
    });
}

runPersonaSimulation();
