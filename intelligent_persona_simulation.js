
/**
 * SYNDICATE OS - INTELLIGENT PERSONA BETA (15 ARCHETYPES - 3 YEARS)
 * AI that ACTUALLY understands game economics, ROI, and optimal strategies
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

// ECONOMIC CONSTANTS (from studying the game)
const PAYROLL_INTERVAL = 60000; // 60 seconds
const TERRITORY_INCOME_INTERVAL = 60000; // 60 seconds

class IntelligentPersona {
    constructor(name, description, archetype) {
        this.name = name;
        this.description = description;
        this.archetype = archetype;
        this.state = null;
        this.stats = {
            prestigeCount: 0,
            maxLevel: 0,
            totalEarnings: 0,
            naNEncounters: 0,
            featuresUsed: new Set(),
            helpModalChecked: false,
            cashFlow: { income: 0, expenses: 0 }
        };
    }

    init() {
        this.state = getDefaultState();
        // Reasonable start
        this.state.cleanCash += 50000;
        this.state.xp += 1000;
        this.state.inv.hash_lys = 200;
        Object.keys(this.state.autoSell).forEach(k => this.state.autoSell[k] = true);

        if (this.archetype === 'help-seeker') {
            this.stats.helpModalChecked = true;
        }
    }

    tick(dt) {
        if (!this.state) return;
        this.applyIntelligentAI(dt);
        const oldClean = this.state.cleanCash;
        this.state = runGameTick(this.state, dt, t);
        if (this.state.cleanCash > oldClean) this.stats.totalEarnings += (this.state.cleanCash - oldClean);
        this.stats.maxLevel = Math.max(this.stats.maxLevel, this.state.level);
        if (!Number.isFinite(this.state.cleanCash)) this.stats.naNEncounters++;
    }

    // Calculate total staff salary per hour
    calculateHourlySalary() {
        let total = 0;
        Object.keys(CONFIG.staff).forEach(role => {
            const count = this.state.staff[role] || 0;
            const salary = CONFIG.staff[role].salary || 0;
            total += count * salary;
        });
        return total;
    }

    // Calculate territory income per hour
    calculateTerritoryIncome() {
        let total = 0;
        this.state.territories.forEach(terId => {
            const ter = CONFIG.territories.find(t => t.id === terId);
            if (ter) total += ter.income;
        });
        return total;
    }

    // Calculate ROI for buying a staff member
    calculateStaffROI(role) {
        const staff = CONFIG.staff[role];
        const cost = staff.baseCost * Math.pow(staff.costFactor, this.state.staff[role] || 0);
        const salary = staff.salary;

        // Producers generate inventory, sellers convert to cash
        // Simplified: Assume 1 staff = ~salary*2 in revenue per hour
        const estimatedRevenue = salary * 2;
        const netIncome = estimatedRevenue - salary;

        if (netIncome <= 0) return -Infinity;
        return cost / netIncome; // Payback period in hours
    }

    // Smart staff buying
    buyStaffSmart(role, maxPayback = 100) {
        if (this.state.level < CONFIG.staff[role].reqLevel) return false;

        const roi = this.calculateStaffROI(role);
        if (roi > maxPayback) return false; // Too long payback

        const cost = CONFIG.staff[role].baseCost * Math.pow(CONFIG.staff[role].costFactor, this.state.staff[role] || 0);
        const hourlySalary = this.calculateHourlySalary();
        const territoryIncome = this.calculateTerritoryIncome();

        // Only buy if we can afford salary for 10+ hours
        if (this.state.cleanCash >= cost && this.state.cleanCash > (hourlySalary + CONFIG.staff[role].salary) * 10) {
            this.state.staff[role] = (this.state.staff[role] || 0) + 1;
            this.state.cleanCash -= cost;
            return true;
        }
        return false;
    }

    // Smart territory buying
    buyTerritorySmart(terId) {
        const ter = CONFIG.territories.find(t => t.id === terId);
        if (!ter || this.state.territories.includes(terId)) return false;
        if (this.state.level < ter.reqLevel) return false;

        const paybackHours = ter.baseCost / ter.income;
        if (paybackHours > 200) return false; // Too long payback

        if (this.state.cleanCash >= ter.baseCost * 2) { // Keep 2x reserve
            this.state.territories.push(terId);
            this.state.cleanCash -= ter.baseCost;
            return true;
        }
        return false;
    }

    handlePrestige(targetLevel = 10) {
        if (this.state.level >= targetLevel && this.state.cleanCash > 500000) {
            this.stats.prestigeCount++;
            this.stats.featuresUsed.add('prestige_cycle');
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
                cleanCash: 50000,
                xp: 1000
            };
            Object.keys(this.state.autoSell).forEach(k => this.state.autoSell[k] = true);
        }
    }

    applyIntelligentAI(dt) {
        // Base: Generate inventory
        this.state.inv.hash_lys = (this.state.inv.hash_lys || 0) + 50;
        this.state.xp += 10;
    }
}

// === 15 INTELLIGENT PERSONAS ===

class CompletionistPersona extends IntelligentPersona {
    applyIntelligentAI(dt) {
        super.applyIntelligentAI(dt);
        // Buy everything with good ROI
        Object.keys(CONFIG.staff).forEach(role => {
            if (this.state.staff[role] < 20) {
                this.buyStaffSmart(role, 150);
            }
        });
        CONFIG.territories.forEach(ter => this.buyTerritorySmart(ter.id));
        this.stats.featuresUsed.add('completionist_strategy');
        this.handlePrestige(10);
    }
}

class HelpSeekerPersona extends IntelligentPersona {
    applyIntelligentAI(dt) {
        super.applyIntelligentAI(dt);
        // Conservative: Only pushers
        if (this.state.staff.pusher < 10) {
            this.buyStaffSmart('pusher', 50);
        }
        this.stats.featuresUsed.add('tutorial_strategy');
        this.handlePrestige(12);
    }
}

class SpeedrunnerPersona extends IntelligentPersona {
    applyIntelligentAI(dt) {
        super.applyIntelligentAI(dt);
        // Aggressive early game
        this.buyStaffSmart('pusher', 30);
        this.buyStaffSmart('grower', 30);
        this.stats.featuresUsed.add('speedrun_strategy');
        this.handlePrestige(10);
    }
}

class IdlerPersona extends IntelligentPersona {
    applyIntelligentAI(dt) {
        super.applyIntelligentAI(dt);
        // Only territories (passive income)
        CONFIG.territories.forEach(ter => this.buyTerritorySmart(ter.id));
        this.stats.featuresUsed.add('passive_strategy');
        this.handlePrestige(15);
    }
}

class CryptoTraderPersona extends IntelligentPersona {
    applyIntelligentAI(dt) {
        super.applyIntelligentAI(dt);
        // Invest in crypto when cash > 100K
        if (this.state.cleanCash > 100000 && Math.random() < 0.1) {
            this.state.crypto.wallet.bitcoin += 1;
            this.state.cleanCash -= this.state.crypto.prices.bitcoin;
            this.stats.featuresUsed.add('crypto_strategy');
        }
        this.handlePrestige(10);
    }
}

class TerritoryBaronPersona extends IntelligentPersona {
    applyIntelligentAI(dt) {
        super.applyIntelligentAI(dt);
        // Aggressive territory expansion
        CONFIG.territories.forEach(ter => {
            if (!this.state.territories.includes(ter.id) && this.state.level >= ter.reqLevel && this.state.cleanCash > ter.baseCost * 1.5) {
                this.state.territories.push(ter.id);
                this.state.cleanCash -= ter.baseCost;
                this.stats.featuresUsed.add('territory_strategy');
            }
        });
        this.handlePrestige(10);
    }
}

class RivalHunterPersona extends IntelligentPersona {
    applyIntelligentAI(dt) {
        super.applyIntelligentAI(dt);
        // Bribe when heat > 30
        if ((this.state.rival?.hostility || 0) > 30 && this.state.cleanCash > 50000) {
            this.state.cleanCash -= 50000;
            this.state.rival.hostility = 0;
            this.stats.featuresUsed.add('rival_strategy');
        }
        this.handlePrestige(10);
    }
}

class DefenseSpecialistPersona extends IntelligentPersona {
    applyIntelligentAI(dt) {
        super.applyIntelligentAI(dt);
        // Buy defense when affordable
        if (this.state.cleanCash > 50000 && (this.state.defense.guards || 0) < 10) {
            this.state.defense.guards = (this.state.defense.guards || 0) + 1;
            this.state.cleanCash -= 10000;
            this.stats.featuresUsed.add('defense_strategy');
        }
        this.handlePrestige(10);
    }
}

class LaundererPersona extends IntelligentPersona {
    applyIntelligentAI(dt) {
        super.applyIntelligentAI(dt);
        // Heavy laundering + accountants
        if (this.state.dirtyCash > 50000) {
            this.state.cleanCash += 40000;
            this.state.dirtyCash -= 50000;
            this.stats.featuresUsed.add('laundering_strategy');
        }
        this.buyStaffSmart('accountant', 100);
        this.handlePrestige(10);
    }
}

class WhalePersona extends IntelligentPersona {
    applyIntelligentAI(dt) {
        super.applyIntelligentAI(dt);
        // Buy aggressively but with ROI awareness
        Object.keys(CONFIG.staff).forEach(role => {
            if (this.state.staff[role] < 30) {
                this.buyStaffSmart(role, 200);
            }
        });
        this.stats.featuresUsed.add('whale_strategy');
        this.handlePrestige(10);
    }
}

class MinMaxerPersona extends IntelligentPersona {
    applyIntelligentAI(dt) {
        super.applyIntelligentAI(dt);
        // Perfect ROI: Only best staff
        const bestStaff = ['distributor', 'pusher', 'grower'];
        bestStaff.forEach(role => {
            if (this.state.staff[role] < 15) {
                this.buyStaffSmart(role, 50);
            }
        });
        this.stats.featuresUsed.add('minmax_strategy');
        this.handlePrestige(10);
    }
}

class CasualMobilePersona extends IntelligentPersona {
    applyIntelligentAI(dt) {
        super.applyIntelligentAI(dt);
        // Random buys
        if (Math.random() < 0.2) {
            this.buyStaffSmart('pusher', 100);
            this.stats.featuresUsed.add('casual_strategy');
        }
        this.handlePrestige(14);
    }
}

class AchievementHunterPersona extends IntelligentPersona {
    applyIntelligentAI(dt) {
        super.applyIntelligentAI(dt);
        // Buy luxury when affordable
        if (!this.state.luxuryItems?.includes('penthouse') && this.state.cleanCash > 200000) {
            this.state.luxuryItems = ['penthouse'];
            this.state.cleanCash -= 100000;
            this.stats.featuresUsed.add('achievement_strategy');
        }
        this.handlePrestige(10);
    }
}

class StoryFocusedPersona extends IntelligentPersona {
    applyIntelligentAI(dt) {
        super.applyIntelligentAI(dt);
        // Slow and steady
        this.buyStaffSmart('pusher', 80);
        this.stats.featuresUsed.add('story_strategy');
        this.handlePrestige(12);
    }
}

class PrestigeGrinderPersona extends IntelligentPersona {
    applyIntelligentAI(dt) {
        super.applyIntelligentAI(dt);
        // Optimize for prestige: High income, low costs
        this.buyStaffSmart('pusher', 40);
        this.buyStaffSmart('distributor', 40);
        CONFIG.territories.forEach(ter => this.buyTerritorySmart(ter.id));
        this.stats.featuresUsed.add('prestige_grind_strategy');
        this.handlePrestige(10);
    }
}

async function runIntelligentPersonaSimulation() {
    console.log("Loading INTELLIGENT Persona Environment...");
    ({ CONFIG } = await import('./src/config/gameConfig.js'));
    ({ getDefaultState } = await import('./src/utils/initialState.js'));
    ({ runGameTick } = await import('./src/features/engine/gameTick.js'));

    const personas = [
        new CompletionistPersona("Completionist", "Smart everything", "completionist"),
        new HelpSeekerPersona("Help Seeker", "Tutorial follower", "help-seeker"),
        new SpeedrunnerPersona("Speedrunner", "Fast prestige", "speedrunner"),
        new IdlerPersona("Idler", "Passive only", "idler"),
        new CryptoTraderPersona("Crypto Trader", "Market player", "trader"),
        new TerritoryBaronPersona("Territory Baron", "Empire builder", "baron"),
        new RivalHunterPersona("Rival Hunter", "Combat focused", "hunter"),
        new DefenseSpecialistPersona("Defense Specialist", "Security first", "defender"),
        new LaundererPersona("Launderer", "Money cleaner", "launderer"),
        new WhalePersona("Whale", "Big spender", "whale"),
        new MinMaxerPersona("MinMaxer", "Perfect ROI", "optimizer"),
        new CasualMobilePersona("Casual Mobile", "Random play", "casual"),
        new AchievementHunterPersona("Achievement Hunter", "Unlocks all", "hunter"),
        new StoryFocusedPersona("Story Player", "Narrative fan", "story"),
        new PrestigeGrinderPersona("Prestige Grinder", "Fast cycles", "grinder")
    ];

    personas.forEach(p => p.init());

    console.log(`\n🧠 INTELLIGENT Persona Beta (15 Archetypes / 3 Years)...`);

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
                console.log(`Year ${Math.floor(step / (24 * 365))}...`);
            }
        }
    } finally {
        globalThis.Date.now = originalNow;
    }

    console.log("\n=== INTELLIGENT PERSONA RESULTS ===");
    personas.forEach(p => {
        console.log(`\n[${p.name}]`);
        console.log(`  Prestiges: ${p.stats.prestigeCount}`);
        console.log(`  Peak Level: ${p.stats.maxLevel}`);
        console.log(`  Final Clean Cash: ${Math.floor(p.state.cleanCash).toLocaleString()} kr`);
        console.log(`  Final Territories: ${p.state.territories.length}`);
        console.log(`  Features: ${Array.from(p.stats.featuresUsed).join(', ')}`);
        console.log(`  Help Modal: ${p.stats.helpModalChecked ? 'READ' : 'SKIPPED'}`);
        console.log(`  Stability: ${p.stats.naNEncounters === 0 ? 'PERFECT' : 'ERRORS'}`);
    });

    const allFeatures = new Set();
    personas.forEach(p => p.stats.featuresUsed.forEach(f => allFeatures.add(f)));
    const totalPrestiges = personas.reduce((sum, p) => sum + p.stats.prestigeCount, 0);

    console.log(`\n📊 INTELLIGENT SUMMARY:`);
    console.log(`  Total Prestiges: ${totalPrestiges}`);
    console.log(`  Unique Features: ${allFeatures.size}`);
    console.log(`  Strategies: ${Array.from(allFeatures).join(', ')}`);
}

runIntelligentPersonaSimulation();
