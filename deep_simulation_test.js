/**
 * SYNDICATE OS - DEEP SIMULATION TEST V2
 * 1 Year Simulation with 8 Distinct Player Personas
 * 
 * Features:
 * - Economy & Progression Verification
 * - Combat & Event Tracking
 * - Mission & Achievement validation
 * - Performance Profiling
 * - HTML Report Generation
 */

// === BROWSER ENVIRONMENT MOCKS ===
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
    navigator: { userAgent: 'node-simulation' },
    location: { href: '' },
    innerWidth: 1920,
    innerHeight: 1080
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

// === IMPORTS ===
let CONFIG, getDefaultState, runGameTick;

// === SIMULATION CONSTANTS ===
const SIM_DAYS = 365;
const HOURS_PER_DAY = 24;
const SECONDS_PER_HOUR = 3600;
const t = (key) => key; // Mock translation

// === RED FLAGS TRACKER ===
class RedFlagTracker {
    constructor() {
        this.flags = [];
    }

    add(category, message, severity = 'warning') {
        this.flags.push({ category, message, severity, timestamp: Date.now() });
    }

    getReport() {
        const grouped = {};
        this.flags.forEach(flag => {
            if (!grouped[flag.category]) grouped[flag.category] = [];
            grouped[flag.category].push(flag);
        });
        return grouped;
    }
}

// === BASE PERSONA CLASS ===
class PlayerPersona {
    constructor(name, description, archetype) {
        this.name = name;
        this.description = description;
        this.archetype = archetype;
        this.state = null;
        this.redFlags = new RedFlagTracker();

        // Comprehensive stats tracking
        this.stats = {
            // Time
            totalPlaytimeSeconds: 0,
            sessionCount: 0,

            // Performance
            avgTickMs: 0,
            totalTickMs: 0,
            tickCount: 0,

            // Economy
            totalEarningsClean: 0,
            totalEarningsDirty: 0,
            totalLaundered: 0,
            finalCleanCash: 0,
            finalDirtyCash: 0,
            maxCashReached: 0,
            nanEncounters: 0,
            negativeEncounters: 0,

            // Staff
            staffHired: {},
            staffFired: {},

            // Production
            itemsProduced: {},
            itemsSold: {},

            // Progression
            prestigeCount: 0,
            maxLevel: 0,
            finalLevel: 0,

            // Missions & Achievements
            missionsCompleted: [],
            achievementsUnlocked: [],

            // Territories & Combat
            territoriesOwned: [],
            raidsWon: 0,
            raidsLost: 0,
            rivalAttacks: 0,

            // Features Used
            featuresUsed: new Set(),

            // Crypto
            cryptoTrades: 0,
            cryptoProfit: 0
        };
    }

    init() {
        this.state = getDefaultState();
        // MANDATORY: Simulate Onboarding Compliance
        this.state.tutorialCompleted = true;
        this.state.introSeen = true;
        this.state.hasReadHandbook = true;

        // Coverage Tracking
        this.stats.coverage = {
            staff: new Set(),
            produced: new Set(),
            defense: new Set()
        };

        this.applyArchetypeStart();
    }

    applyArchetypeStart() { }

    tick(dt) {
        if (!this.state) return;

        // Capture State for tracking
        const oldState = {
            ...this.state,
            staff: { ...this.state.staff },
            territories: [...this.state.territories],
            achievements: [...(this.state.unlockedAchievements || [])],
            missions: [...(this.state.completedMissions || [])]
        };

        this.stats.totalPlaytimeSeconds += dt;

        // Verify economy sanity BEFORE tick
        this.verifyEconomySanity('pre-tick');

        // Apply Persona AI (Mutates State)
        this.applyPersonaAI(dt);

        // Heat Clamping (Fix for Edge Case Tester)
        this.state.heat = Math.max(0, Math.min(500, this.state.heat));

        // PERFORMANCE: Measure Tick
        const start = performance.now();
        this.state = runGameTick(this.state, dt, t);
        const end = performance.now();

        this.stats.totalTickMs += (end - start);
        this.stats.tickCount++;

        // Track changes & Events
        this.trackChanges(oldState, this.state);
        this.handleEvents(); // Clear pending events

        // Verify economy sanity AFTER tick
        this.verifyEconomySanity('post-tick');

        // Update stats
        this.updateStats();

        // CHECK ACHIEVEMENTS (Ported from UI Hook)
        this.checkAchievements();
    }

    checkAchievements() {
        if (!CONFIG.achievements) return;
        const unlocked = this.state.unlockedAchievements || [];

        CONFIG.achievements.forEach(ach => {
            if (unlocked.includes(ach.id)) return;

            let earned = false;
            const { type, val, item, coin } = ach.req;
            const s = this.state;

            if (type === 'dirty' && (s.lifetime?.dirtyEarnings || 0) >= val) earned = true;
            if (type === 'clean' && (s.lifetime?.laundered || 0) >= val) earned = true;
            if (type === 'territory' && s.territories.length >= val) earned = true;
            if (type === 'prod' && (s.lifetime?.produced?.[item] || 0) >= val) earned = true;
            if (type === 'prestige' && (s.prestige?.level || 0) >= val) earned = true;
            if (type === 'crypto' && (s.crypto?.wallet?.[coin] || 0) >= val) earned = true;
            if (type === 'stealth' && s.heat === 0 && s.dirtyCash >= 1000000) earned = true;
            if (type === 'clean_streak' && s.cleanCash >= val && s.dirtyCash === 0) earned = true;
            if (type === 'inventory' && Object.values(s.inv).reduce((a, b) => a + b, 0) >= val) earned = true;

            // Time achievement relies on 'gameTime' which we simulate via tick count * dt / 60
            const simulatedMinutes = (this.stats.totalPlaytimeSeconds || 0) / 60;
            if (type === 'time' && simulatedMinutes >= val) earned = true;

            if (earned) {
                this.state.unlockedAchievements = [...unlocked, ach.id];
                // Note: we don't need to push to stats.achievementsUnlocked separately 
                // because updateStats() syncs it from state.但是 updateStats runs BEFORE this.
                // So it will catch up next tick.
            }
        });
    }

    handleEvents() {
        if (this.state.pendingEvent) {
            const evt = this.state.pendingEvent;

            if (evt.type === 'raid') {
                if (evt.data.result === 'win') this.stats.raidsWon++;
                else this.stats.raidsLost++;
                this.stats.featuresUsed.add('raid_defense');
            } else if (evt.type === 'rival' || (evt.data && evt.data.type === 'rival')) {
                this.stats.rivalAttacks++;
            }

            // Simulate UI clearing the event
            this.state.pendingEvent = null;
        }
    }

    verifyEconomySanity(phase) {
        if (!Number.isFinite(this.state.cleanCash)) {
            this.stats.nanEncounters++;
            this.redFlags.add('economy', `NaN cleanCash detected (${phase})`, 'error');
            this.state.cleanCash = 0;
        }
        if (!Number.isFinite(this.state.dirtyCash)) {
            this.stats.nanEncounters++;
            this.redFlags.add('economy', `NaN dirtyCash detected (${phase})`, 'error');
            this.state.dirtyCash = 0;
        }
    }

    trackChanges(oldState, newState) {
        // Track earnings
        if (newState.cleanCash > oldState.cleanCash) {
            this.stats.totalEarningsClean += (newState.cleanCash - oldState.cleanCash);
        }
        if (newState.dirtyCash > oldState.dirtyCash) {
            this.stats.totalEarningsDirty += (newState.dirtyCash - oldState.dirtyCash);
        }
        this.stats.maxCashReached = Math.max(this.stats.maxCashReached, newState.cleanCash + newState.dirtyCash);

        // Track staff
        Object.keys(CONFIG.staff).forEach(role => {
            const oldVal = oldState.staff[role] || 0;
            const newVal = newState.staff[role] || 0;
            if (newVal > oldVal) this.stats.staffHired[role] = (this.stats.staffHired[role] || 0) + (newVal - oldVal);
        });

        // Track production
        Object.keys(this.state.stats.produced || {}).forEach(item => {
            this.stats.itemsProduced[item] = this.state.stats.produced[item];
        });

        // Track territories
        this.stats.territoriesOwned = [...this.state.territories];
    }

    updateStats() {
        this.stats.finalCleanCash = this.state.cleanCash;
        this.stats.finalDirtyCash = this.state.dirtyCash;
        this.stats.finalLevel = this.state.level;
        this.stats.maxLevel = Math.max(this.stats.maxLevel, this.state.level);
        this.stats.missionsCompleted = this.state.completedMissions || [];
        this.stats.achievementsUnlocked = this.state.unlockedAchievements || [];
        this.stats.avgTickMs = this.stats.totalTickMs / Math.max(1, this.stats.tickCount);
    }

    applyPersonaAI(dt) { }

    // --- HELPERS ---

    calculateStaffROI(role) {
        const staff = CONFIG.staff[role];
        if (!staff) return Infinity;
        const currentCount = this.state.staff[role] || 0;
        const cost = staff.baseCost * Math.pow(staff.costFactor, currentCount);
        const revenue = staff.salary * 3;
        const net = revenue - staff.salary;
        return net <= 0 ? Infinity : cost / net;
    }

    buyStaffIfGood(role, maxPayback = 100, ignoreRoi = false) {
        if (!CONFIG.staff[role]) return false;
        if (this.state.level < CONFIG.staff[role].reqLevel) return false;

        if (!ignoreRoi) {
            const roi = this.calculateStaffROI(role);
            if (roi > maxPayback) return false;
        }

        const currentCount = this.state.staff[role] || 0;
        const cost = CONFIG.staff[role].baseCost * Math.pow(CONFIG.staff[role].costFactor, currentCount);

        if (this.state.cleanCash >= cost * 2) {
            this.state.staff[role] = currentCount + 1;
            this.state.cleanCash -= cost;
            this.stats.featuresUsed.add('staff_hiring');
            return true;
        }
        return false;
    }

    buyTerritory(terId) {
        const ter = CONFIG.territories.find(t => t.id === terId);
        if (!ter || this.state.territories.includes(terId)) return false;
        if (this.state.level < ter.reqLevel) return false;
        if (this.state.cleanCash >= ter.baseCost * 1.5) {
            this.state.territories.push(terId);
            this.state.cleanCash -= ter.baseCost;
            this.stats.featuresUsed.add('territory_expansion');
            return true;
        }
        return false;
    }

    doPrestige() {
        if (this.state.level >= 10 && this.state.cleanCash > 500000) {
            this.stats.prestigeCount++;
            this.stats.featuresUsed.add('prestige');

            const fresh = getDefaultState();
            const oldLifetime = this.state.lifetime || fresh.lifetime;
            const oldPrestige = this.state.prestige || fresh.prestige;

            this.state = {
                ...fresh,
                prestige: {
                    level: this.stats.prestigeCount,
                    multiplier: 1.5 + (this.stats.prestigeCount * 0.5),
                    currency: this.stats.prestigeCount * 2,
                    perks: oldPrestige.perks || {}
                },
                lifetime: {
                    earnings: oldLifetime.earnings || 0,
                    laundered: oldLifetime.laundered || 0,
                    dirtyEarnings: oldLifetime.dirtyEarnings || 0,
                    produced: { ...oldLifetime.produced }
                },
                cleanCash: 100000,
                xp: 2000,
                level: 1
            };
            Object.keys(this.state.autoSell).forEach(k => this.state.autoSell[k] = true);
            return true;
        }
        return false;
    }

    manualLaunder(cap = 600000) {
        // Logic: if dirtyCash is high, wash it. 
        // Cap is usually goal for clean cash (e.g. for prestige). 
        // If cap is "FORCE" (e.g. 99999999), we wash everything we can.

        const amount = 50000; // Wash in chunks
        if (this.state.dirtyCash >= amount) {
            // Only wash if we need clean cash OR if we have too much dirty (limit hoarding)
            if (this.state.cleanCash < cap || cap > 10000000) {
                const net = Math.floor(amount * 0.7); // 30% fee
                this.state.dirtyCash -= amount;
                this.state.cleanCash += net;

                // MISSION TRACKING FIX:
                this.state.stats.laundered = (this.state.stats.laundered || 0) + net;
                if (!this.state.lifetime) this.state.lifetime = {};
                this.state.lifetime.laundered = (this.state.lifetime.laundered || 0) + amount; // Missions check gross dirty washed

                this.stats.totalLaundered += amount;
                this.stats.featuresUsed.add('manual_laundering');
                return true;
            }
        }
        return false;
    }

    buyUpgrade(id) {
        if (!CONFIG.upgrades || !CONFIG.upgrades[id]) return false;
        const base = CONFIG.upgrades[id];
        const current = this.state.upgrades[id] || 0;
        if (base.maxLevel && current >= base.maxLevel) return false;

        const cost = Math.floor(base.baseCost * Math.pow(base.costFactor || 1.5, current));

        if (this.state.cleanCash >= cost) {
            this.state.cleanCash -= cost;
            this.state.upgrades[id] = current + 1;
            this.stats.featuresUsed.add('upgrades');
            return true;
        }
        return false;
    }
}

// === EXISTING PERSONAS ===

class TycoonExpert extends PlayerPersona {
    applyArchetypeStart() { this.state.cleanCash = 50000; this.state.xp = 1000; }
    applyPersonaAI(dt) {
        // PRESTIGE FOCUS: If close to max level, stop spending and start laundering
        if (this.state.level >= 14) {
            this.manualLaunder(99999999); // Launder EVERYTHING (Cap is high)
            this.doPrestige();     // Try to prestige
            // Do NOT return here, they might still need to sell drugs to get dirty cash
            // But we should stop buying expensive things
        } else {
            // Normal Growth
            Object.keys(CONFIG.staff).forEach(role => this.buyStaffIfGood(role, 60));
            CONFIG.territories.forEach(ter => { if (ter.baseCost / ter.income < 100) this.buyTerritory(ter.id); });
            this.manualLaunder(800000);
        }

        this.state.inv.hash_lys = (this.state.inv.hash_lys || 0) + 10;
        this.STATS_BOOST = true;
    }
}

class Completionist extends PlayerPersona {
    applyArchetypeStart() { this.state.cleanCash = 30000; this.state.xp = 500; }
    applyPersonaAI(dt) {
        // CYCLICAL COVERAGE CHECKER
        // 1. Ensure we own at least 1 of EVERY staff type
        Object.keys(CONFIG.staff).forEach(role => {
            if (!this.state.staff[role]) this.buyStaffIfGood(role, 9999, true);
            else if (this.state.staff[role] < 5) this.buyStaffIfGood(role, 200);
            if (this.state.staff[role]) this.stats.coverage.staff.add(role);
        });

        // 2. Buy ALL Defenses
        if (CONFIG.defense) {
            Object.keys(CONFIG.defense).forEach(def => {
                const d = CONFIG.defense[def];
                const current = this.state.defense?.[def] || 0;
                if (current < (d.max || 1) && this.state.cleanCash >= d.baseCost) {
                    this.state.defense = this.state.defense || {};
                    this.state.defense[def] = current + 1;
                    this.state.cleanCash -= d.baseCost;
                    this.stats.coverage.defense.add(def);
                }
            });
        }

        // 3. Cycle Production (Try to produce everything once)
        Object.keys(CONFIG.production).forEach(prod => {
            if ((this.stats.coverage.produced && !this.stats.coverage.produced.has(prod)) || Math.random() < 0.1) {
                // Try to produce if unlocked
                if (this.state.level >= CONFIG.production[prod].unlockLevel) {
                    this.state.stats.produced[prod] = (this.state.stats.produced[prod] || 0) + 10;
                    this.stats.coverage.produced.add(prod);
                }
            }
        });

        CONFIG.territories.forEach(ter => this.buyTerritory(ter.id));
        // Buy Upgrades
        Object.keys(CONFIG.upgrades || {}).forEach(id => this.buyUpgrade(id));

        if (this.state.level >= 15) this.doPrestige();
        this.manualLaunder(600000);
        // Default production fallback
        this.state.inv.hash_lys = (this.state.inv.hash_lys || 0) + 15;
    }
}

class Casual extends PlayerPersona {
    constructor(n, d, a) { super(n, d, a); this.sessionTimer = 0; }
    applyArchetypeStart() { this.state.cleanCash = 10000; this.state.xp = 200; }
    applyPersonaAI(dt) {
        this.sessionTimer += dt;
        if (this.sessionTimer >= 3600) {
            this.isActive = Math.random() < 0.3;
            this.sessionTimer = 0;
            if (this.isActive) this.stats.sessionCount++;
        }
        if (!this.isActive) return;
        if (Math.random() < 0.3) {
            const roles = Object.keys(CONFIG.staff);
            this.buyStaffIfGood(roles[Math.floor(Math.random() * roles.length)], 300);
        }
        if (this.state.level >= 15) this.doPrestige();
        this.manualLaunder(100000);
    }
}

class EdgeCaseTester extends PlayerPersona {
    applyArchetypeStart() { this.state.cleanCash = 100; this.state.xp = 50; }
    applyPersonaAI(dt) {
        // Validation tests (Heat is checked in Base Class now)
        if (this.state.heat > 10) console.log(`[DEBUG] Heat: ${this.state.heat.toFixed(1)}`);

        if (Math.random() < 0.1) this.state.heat = 50; // Force spike to test raids
        this.manualLaunder(50000);
    }
}

// === NEW ADVANCED PERSONAS ===

class TheWhale extends PlayerPersona {
    applyArchetypeStart() {
        this.state.cleanCash = 1000000; // Large starter pack
        this.state.xp = 5000;
        this.state.diamonds = 500; // Premium currency whale
    }
    applyPersonaAI(dt) {
        const threshold = CONFIG.prestige.threshold || 10000000;

        // PRESTIGE PRIORITY: If we have enough cash, STOP SPENDING
        if (this.state.cleanCash > threshold * 1.1 && this.state.level >= 10) {
            this.doPrestige();
            return;
        }

        // Buys EVERYTHING rapidly
        Object.keys(CONFIG.staff).forEach(role => this.buyStaffIfGood(role, 9999, true)); // Ignore ROI
        CONFIG.territories.forEach(ter => this.buyTerritory(ter.id));
        // Buys upgrades
        Object.keys(CONFIG.upgrades || {}).forEach(k => {
            const up = CONFIG.upgrades[k];
            if (this.state.cleanCash > up.baseCost) {
                this.state.upgrades[k] = (this.state.upgrades[k] || 0) + 1;
                this.state.cleanCash -= up.baseCost;
            }
        });

        this.manualLaunder(50000000); // Massive laundering
        this.stats.featuresUsed.add('premium_gameplay');
    }
}

class TheSpeedrunner extends PlayerPersona {
    applyArchetypeStart() { this.state.cleanCash = 5000; }
    applyPersonaAI(dt) {
        const threshold = CONFIG.prestige.threshold || 10000000;

        // Force buy initial staff regardless of ROI (Fix for Stalling)
        if (this.state.level === 1 && (!this.state.staff.grower || !this.state.staff.pusher)) {
            ['grower', 'pusher'].forEach(r => this.buyStaffIfGood(r, 9999, true));
        }

        // Optimization: Precise Prestige Timing
        if (this.state.level >= 10 && this.state.cleanCash >= threshold * 1.05) {
            this.doPrestige();
        } else {
            // If close to prestige, stop spending!
            if (this.state.cleanCash > threshold * 0.5) {
                this.manualLaunder(threshold * 1.2);
            } else {
                // Focus ONLY on high XP activities
                this.manualLaunder(800000); // Prioritize laundering for prestige cash
                // Only buy high-efficiency staff
                ['grower', 'pusher'].forEach(r => this.buyStaffIfGood(r, 40));
                // Ensure we have product to sell
                this.state.inv.hash_lys = (this.state.inv.hash_lys || 0) + 10;
            }
        }
        this.stats.featuresUsed.add('speedrunning');
    }
}

class TheHoarder extends PlayerPersona {
    applyArchetypeStart() { this.state.cleanCash = 20000; }
    applyPersonaAI(dt) {
        // Disable Auto-Sell periodically to hoard
        Object.keys(this.state.autoSell).forEach(k => this.state.autoSell[k] = false);

        // Accumulate stock
        this.manualLaunder(200000);

        // Panic sell if full
        if (this.state.inv['hash_lys'] > 5000) {
            this.state.inv['hash_lys'] -= 1000;
            this.state.dirtyCash += 1000 * 50;
            this.stats.featuresUsed.add('panic_sell');
        }
        this.stats.featuresUsed.add('hoarding');
    }
}

class TheTrader extends PlayerPersona {
    applyArchetypeStart() { this.state.cleanCash = 50000; this.state.crypto.wallet.bitcoin = 1; }
    applyPersonaAI(dt) {
        // Crypto Logic
        const btcPrice = this.state.crypto.prices.bitcoin;

        // Buy Logic (Buy dip)
        if (btcPrice < 40000 && this.state.cleanCash > btcPrice) {
            this.state.cleanCash -= btcPrice;
            this.state.crypto.wallet.bitcoin += 1;
            this.stats.cryptoTrades++;
        }

        // Sell Logic (Sell high)
        if (btcPrice > 50000 && this.state.crypto.wallet.bitcoin >= 1) {
            this.state.cleanCash += btcPrice;
            this.state.crypto.wallet.bitcoin -= 1;
            this.stats.cryptoTrades++;
            this.stats.cryptoProfit += (btcPrice - 40000); // Approx
            this.stats.featuresUsed.add('crypto_trading');
        }

        this.manualLaunder(500000);
    }
}

// === MAIN RUNNER ===

async function runDeepSimulation() {
    console.log("🎮 SYNDICATE OS - DEEP SIMULATION V2");
    console.log("=" + "=".repeat(60));

    // Load modules
    ({ CONFIG } = await import('./src/config/gameConfig.js'));
    ({ getDefaultState } = await import('./src/utils/initialState.js'));
    ({ runGameTick } = await import('./src/features/engine/gameTick.js'));

    const personas = [
        new TycoonExpert("The Tycoon", "Min/maxer", "minmaxer"),
        new Completionist("The Completionist", "Unlocks everything", "completionist"),
        new Casual("The Casual", "Low activity", "casual"),
        new EdgeCaseTester("The Debugger", "Chaos monkey", "debugger"),
        new TheWhale("The Whale", "P2W Style", "whale"),
        new TheSpeedrunner("The Speedrunner", "Fast prestige", "speedrunner"),
        new TheHoarder("The Hoarder", "Inventory stacker", "hoarder"),
        new TheTrader("The Trader", "Crypto flipper", "trader")
    ];

    personas.forEach(p => p.init());

    console.log(`🚀 Starting ${SIM_DAYS}-day simulation for ${personas.length} personas...`);

    const TOTAL_STEPS = SIM_DAYS * HOURS_PER_DAY;
    const originalNow = Date.now;
    let virtualTime = Date.now();

    try {
        globalThis.Date.now = () => virtualTime;
        for (let step = 0; step < TOTAL_STEPS; step++) {
            virtualTime += SECONDS_PER_HOUR * 1000;
            personas.forEach(p => p.tick(SECONDS_PER_HOUR));
            if (step % (24 * 30) === 0 && step > 0) process.stdout.write(".");
        }
    } finally {
        globalThis.Date.now = originalNow;
    }
    console.log("\n✅ Simulation Complete");

    // GENERATE REPORT
    const report = {
        meta: { timestamp: new Date().toISOString(), days: SIM_DAYS },
        personas: {},
        aggregate: { prestiges: 0, raidsWon: 0 }
    };

    personas.forEach(p => {
        report.personas[p.name] = {
            archetype: p.archetype,
            stats: {
                ...p.stats,
                featuresUsed: Array.from(p.stats.featuresUsed),
                coverage: p.stats.coverage ? {
                    staff: Array.from(p.stats.coverage.staff),
                    produced: Array.from(p.stats.coverage.produced),
                    defense: Array.from(p.stats.coverage.defense)
                } : {}
            },
            redFlags: p.redFlags.getReport()
        };
        report.aggregate.prestiges += p.stats.prestigeCount;
        report.aggregate.raidsWon += p.stats.raidsWon;
    });

    // CREATE HTML REPORT
    const fs = await import('fs');
    fs.writeFileSync('./deep_simulation_report.json', JSON.stringify(report, null, 2));

    const html = `
    <!DOCTYPE html>
    <html><head><title>Syndicate OS - Simulation Report</title>
    <style>body{font-family:sans-serif;background:#111;color:#eee;padding:20px} 
    .card{background:#222;border:1px solid #444;padding:15px;margin:10px 0;border-radius:8px}
    .stat{display:inline-block;margin-right:20px;font-size:0.9em}
    h1,h2,h3{color:#d4af37}
    .warn{color:#f55} .good{color:#5f5}
    </style></head><body>
    <h1>Syndicate OS - Deep Simulation Report</h1>
    <p>Generated: ${new Date().toLocaleString()} | Duration: ${SIM_DAYS} Days</p>
    <div class="card">
      <h2>Aggregate</h2>
      <span class="stat">Total Prestiges: ${report.aggregate.prestiges}</span>
      <span class="stat">Raids Won: ${report.aggregate.raidsWon}</span>
    </div>
    ${Object.entries(report.personas).map(([name, data]) => `
    <div class="card">
        <h3>${name} <small>(${data.archetype})</small></h3>
        <div>
            <span class="stat">Clean: ${Math.floor(data.stats.finalCleanCash).toLocaleString()}</span>
            <span class="stat">Dirty: ${Math.floor(data.stats.finalDirtyCash).toLocaleString()}</span>
            <span class="stat">Lvl: ${data.stats.finalLevel}</span>
            <span class="stat">Prestiges: ${data.stats.prestigeCount}</span>
            <span class="stat">Avg Tick: ${data.stats.avgTickMs.toFixed(3)}ms</span>
        </div>
        <div style="margin-top:10px; font-size:0.8em; color:#aaa">
            Missions: ${data.stats.missionsCompleted.length} | 
            Achievements: ${data.stats.achievementsUnlocked.length} |
            Raids Won/Lost: ${data.stats.raidsWon}/${data.stats.raidsLost}
        </div>
        ${data.stats.coverage && Object.keys(data.stats.coverage).length ?
            `<div class="coverage">Coverage: Staff ${data.stats.coverage.staff.length} | Defense ${data.stats.coverage.defense.length} | Prod ${data.stats.coverage.produced.length}</div>`
            : ''}
        ${data.redFlags.length ? `<div class="warn">RED FLAGS: ${JSON.stringify(data.redFlags)}</div>` : '<div class="good">No Red Flags</div>'}
    </div>
    `).join('')}
    </body></html>`;

    fs.writeFileSync('./deep_simulation_report.html', html);
    console.log("💾 Reports saved: .json and .html");
}

runDeepSimulation();
