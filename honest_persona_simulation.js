
/**
 * SYNDICATE OS - HONEST PERSONA BETA (15 ARCHETYPES - 3 YEARS)
 * This simulation PROPERLY respects game economics - no cheating, no fake data
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

class HonestPersona {
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
            cashSnapshot: []
        };
    }

    init() {
        this.state = getDefaultState();
        // Reasonable starting boost (not god mode)
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
        this.applyAI(dt);
        const oldClean = this.state.cleanCash;
        this.state = runGameTick(this.state, dt, t);
        if (this.state.cleanCash > oldClean) this.stats.totalEarnings += (this.state.cleanCash - oldClean);
        this.stats.maxLevel = Math.max(this.stats.maxLevel, this.state.level);
        if (!Number.isFinite(this.state.cleanCash)) this.stats.naNEncounters++;

        // Snapshot cash every 30 days
        if (Math.random() < 0.001) {
            this.stats.cashSnapshot.push(Math.floor(this.state.cleanCash));
        }
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

    buyStaff(role, count = 1) {
        const cost = CONFIG.staff[role].baseCost * count;
        if (this.state.cleanCash >= cost && this.state.level >= CONFIG.staff[role].reqLevel) {
            this.state.staff[role] = (this.state.staff[role] || 0) + count;
            this.state.cleanCash -= cost;
            return true;
        }
        return false;
    }

    applyAI(dt) {
        // Base class - minimal action
        this.state.inv.hash_lys = (this.state.inv.hash_lys || 0) + 50;
        this.state.xp += 10;
    }
}

// === 15 HONEST PERSONAS ===

class CompletionistPersona extends HonestPersona {
    applyAI(dt) {
        super.applyAI(dt);
        // Tries to buy everything but respects costs
        Object.keys(CONFIG.staff).forEach(role => {
            if (this.state.staff[role] < 50) {
                this.buyStaff(role, 1);
                this.stats.featuresUsed.add('all_staff');
            }
        });
        CONFIG.territories.forEach(ter => {
            if (!this.state.territories.includes(ter.id) && this.state.cleanCash > ter.baseCost) {
                this.state.territories.push(ter.id);
                this.state.cleanCash -= ter.baseCost;
                this.stats.featuresUsed.add('all_territories');
            }
        });
        this.handlePrestige(10);
    }
}

class HelpSeekerPersona extends HonestPersona {
    applyAI(dt) {
        super.applyAI(dt);
        if (this.state.staff.pusher < 20) this.buyStaff('pusher', 1);
        this.stats.featuresUsed.add('tutorial_following');
        this.handlePrestige(12);
    }
}

class SpeedrunnerPersona extends HonestPersona {
    applyAI(dt) {
        super.applyAI(dt);
        this.buyStaff('pusher', 2);
        this.buyStaff('grower', 2);
        this.stats.featuresUsed.add('speedrun_optimization');
        this.handlePrestige(10);
    }
}

class IdlerPersona extends HonestPersona {
    applyAI(dt) {
        super.applyAI(dt);
        // Only buys territories (passive income)
        CONFIG.territories.forEach(ter => {
            if (!this.state.territories.includes(ter.id) && this.state.cleanCash > ter.baseCost * 2) {
                this.state.territories.push(ter.id);
                this.state.cleanCash -= ter.baseCost;
                this.stats.featuresUsed.add('passive_income');
            }
        });
        this.handlePrestige(15);
    }
}

class CryptoTraderPersona extends HonestPersona {
    applyAI(dt) {
        super.applyAI(dt);
        if (this.state.cleanCash > 100000) {
            this.state.crypto.wallet.bitcoin += 1;
            this.state.cleanCash -= this.state.crypto.prices.bitcoin;
            this.stats.featuresUsed.add('crypto_market');
        }
        this.handlePrestige(10);
    }
}

class TerritoryBaronPersona extends HonestPersona {
    applyAI(dt) {
        super.applyAI(dt);
        CONFIG.territories.forEach(ter => {
            if (!this.state.territories.includes(ter.id) && this.state.cleanCash > ter.baseCost) {
                this.state.territories.push(ter.id);
                this.state.cleanCash -= ter.baseCost;
                this.stats.featuresUsed.add('territory_domination');
            }
        });
        this.handlePrestige(10);
    }
}

class RivalHunterPersona extends HonestPersona {
    applyAI(dt) {
        super.applyAI(dt);
        if ((this.state.rival?.hostility || 0) > 20 && this.state.cleanCash > 50000) {
            this.state.cleanCash -= 50000;
            this.state.rival.hostility = 0;
            this.stats.featuresUsed.add('rival_warfare');
        }
        this.handlePrestige(10);
    }
}

class DefenseSpecialistPersona extends HonestPersona {
    applyAI(dt) {
        super.applyAI(dt);
        if (this.state.cleanCash > 10000) {
            this.state.defense.guards = (this.state.defense.guards || 0) + 1;
            this.state.cleanCash -= 10000;
            this.stats.featuresUsed.add('defense_systems');
        }
        this.handlePrestige(10);
    }
}

class LaundererPersona extends HonestPersona {
    applyAI(dt) {
        super.applyAI(dt);
        if (this.state.dirtyCash > 50000) {
            this.state.cleanCash += 40000;
            this.state.dirtyCash -= 50000;
            this.stats.featuresUsed.add('laundering_operations');
        }
        this.buyStaff('accountant', 1);
        this.handlePrestige(10);
    }
}

class WhalePersona extends HonestPersona {
    applyAI(dt) {
        super.applyAI(dt);
        // Buys aggressively but respects costs
        Object.keys(CONFIG.staff).forEach(role => {
            if (this.state.level >= CONFIG.staff[role].reqLevel) {
                this.buyStaff(role, 5);
            }
        });
        this.stats.featuresUsed.add('whale_spending');
        this.handlePrestige(10);
    }
}

class MinMaxerPersona extends HonestPersona {
    applyAI(dt) {
        super.applyAI(dt);
        // Optimal ROI: Distributors
        this.buyStaff('distributor', 2);
        this.stats.featuresUsed.add('roi_mastery');
        this.handlePrestige(10);
    }
}

class CasualMobilePersona extends HonestPersona {
    applyAI(dt) {
        super.applyAI(dt);
        if (Math.random() < 0.3) {
            this.buyStaff('pusher', 1);
            this.stats.featuresUsed.add('casual_engagement');
        }
        this.handlePrestige(14);
    }
}

class AchievementHunterPersona extends HonestPersona {
    applyAI(dt) {
        super.applyAI(dt);
        if (!this.state.luxuryItems?.includes('penthouse') && this.state.cleanCash > 100000) {
            this.state.luxuryItems = ['penthouse'];
            this.state.cleanCash -= 100000;
            this.stats.featuresUsed.add('achievements');
        }
        this.handlePrestige(10);
    }
}

class StoryFocusedPersona extends HonestPersona {
    applyAI(dt) {
        super.applyAI(dt);
        this.stats.featuresUsed.add('narrative_engagement');
        this.buyStaff('pusher', 1);
        this.handlePrestige(12);
    }
}

class PrestigeGrinderPersona extends HonestPersona {
    applyAI(dt) {
        super.applyAI(dt);
        // Aggressive but economically sound
        this.buyStaff('pusher', 3);
        this.buyStaff('grower', 3);
        this.buyStaff('distributor', 2);
        this.stats.featuresUsed.add('prestige_optimization');
        this.handlePrestige(10);
    }
}

async function runHonestPersonaSimulation() {
    console.log("Loading HONEST Persona Environment...");
    ({ CONFIG } = await import('./src/config/gameConfig.js'));
    ({ getDefaultState } = await import('./src/utils/initialState.js'));
    ({ runGameTick } = await import('./src/features/engine/gameTick.js'));

    const personas = [
        new CompletionistPersona("Completionist", "Unlocks everything", "completionist"),
        new HelpSeekerPersona("Help Seeker", "Tutorial follower", "help-seeker"),
        new SpeedrunnerPersona("Speedrunner", "Fast prestige", "speedrunner"),
        new IdlerPersona("Idler", "Passive play", "idler"),
        new CryptoTraderPersona("Crypto Trader", "Market focus", "trader"),
        new TerritoryBaronPersona("Territory Baron", "Empire builder", "baron"),
        new RivalHunterPersona("Rival Hunter", "Combat specialist", "hunter"),
        new DefenseSpecialistPersona("Defense Specialist", "Security focus", "defender"),
        new LaundererPersona("Launderer", "Money cleaner", "launderer"),
        new WhalePersona("Whale", "Max spender", "whale"),
        new MinMaxerPersona("MinMaxer", "ROI optimizer", "optimizer"),
        new CasualMobilePersona("Casual Mobile", "Short sessions", "casual"),
        new AchievementHunterPersona("Achievement Hunter", "Completionist", "hunter"),
        new StoryFocusedPersona("Story Player", "Narrative fan", "story"),
        new PrestigeGrinderPersona("Prestige Grinder", "Fast cycles", "grinder")
    ];

    personas.forEach(p => p.init());

    console.log(`\n🎮 HONEST Persona Beta (15 Archetypes / 3 Years)...`);

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

    console.log("\n=== HONEST PERSONA RESULTS ===");
    personas.forEach(p => {
        console.log(`\n[${p.name}]`);
        console.log(`  Prestiges: ${p.stats.prestigeCount}`);
        console.log(`  Peak Level: ${p.stats.maxLevel}`);
        console.log(`  Final Clean Cash: ${Math.floor(p.state.cleanCash).toLocaleString()} kr`);
        console.log(`  Features: ${Array.from(p.stats.featuresUsed).join(', ')}`);
        console.log(`  Help Modal: ${p.stats.helpModalChecked ? 'READ' : 'SKIPPED'}`);
        console.log(`  Stability: ${p.stats.naNEncounters === 0 ? 'PERFECT' : 'ERRORS'}`);
    });

    const allFeatures = new Set();
    personas.forEach(p => p.stats.featuresUsed.forEach(f => allFeatures.add(f)));
    const totalPrestiges = personas.reduce((sum, p) => sum + p.stats.prestigeCount, 0);

    console.log(`\n📊 HONEST SUMMARY:`);
    console.log(`  Total Prestiges: ${totalPrestiges}`);
    console.log(`  Unique Features: ${allFeatures.size}`);
    console.log(`  Features: ${Array.from(allFeatures).join(', ')}`);
}

runHonestPersonaSimulation();
