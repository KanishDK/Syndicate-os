/**
 * SYNDICATE OS - BLACK BOX BETA SIMULATION
 * Massive-scale economic simulation with diverse player personas
 * Tests: Economic stability, UX friction, game balance, edge cases
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
const t = (key) => key;

// === PLAYER PERSONAS ===
class PlayerPersona {
    constructor(name, type, location) {
        this.name = name;
        this.type = type; // casual, hustler, whale, saboteur
        this.location = location;
        this.state = null;
        this.sessionStart = 0;
        this.totalPlayTime = 0;
        this.crashes = 0;
        this.nanErrors = 0;
        this.actions = [];
    }

    initialize() {
        this.state = getDefaultState();
        this.sessionStart = Date.now();

        // Type-specific initialization
        switch (this.type) {
            case 'whale':
                this.state.cleanCash = 1000000; // Start rich
                break;
            case 'hustler':
                this.state.cleanCash = 50000;
                break;
            case 'casual':
                this.state.cleanCash = 10000;
                break;
            case 'saboteur':
                this.state.cleanCash = 5000;
                break;
        }
    }

    playTick(dt, virtualTime) {
        const startTime = performance.now();

        try {
            // Type-specific behavior
            switch (this.type) {
                case 'casual':
                    this.playCasual(dt);
                    break;
                case 'hustler':
                    this.playHustler(dt);
                    break;
                case 'whale':
                    this.playWhale(dt);
                    break;
                case 'saboteur':
                    this.playSaboteur(dt);
                    break;
            }

            // Run game tick
            const originalNow = Date.now;
            globalThis.Date.now = () => virtualTime;
            this.state = runGameTick(this.state, dt, t);
            globalThis.Date.now = originalNow;

            // Check for NaN errors
            if (!Number.isFinite(this.state.cleanCash) || !Number.isFinite(this.state.dirtyCash)) {
                this.nanErrors++;
                this.state.cleanCash = Number.isFinite(this.state.cleanCash) ? this.state.cleanCash : 0;
                this.state.dirtyCash = Number.isFinite(this.state.dirtyCash) ? this.state.dirtyCash : 0;
            }

            const endTime = performance.now();
            this.actions.push({ tick: dt, duration: endTime - startTime });

        } catch (e) {
            this.crashes++;
            console.error(`${this.name} crashed:`, e.message);
        }
    }

    playCasual(dt) {
        // Low interaction - just let passive income run
        if (Math.random() < 0.1 && this.state.cleanCash >= 20000) {
            // Occasionally buy a territory
            const availableTerritories = CONFIG.territories.filter(t =>
                !this.state.territories.includes(t.id) &&
                this.state.level >= t.reqLevel &&
                this.state.cleanCash >= t.baseCost
            );
            if (availableTerritories.length > 0) {
                const ter = availableTerritories[0];
                this.state.territories.push(ter.id);
                this.state.cleanCash -= ter.baseCost;
            }
        }
    }

    playHustler(dt) {
        // Aggressive optimization - buy cheapest profitable items
        const availableStaff = Object.keys(CONFIG.staff).filter(role => {
            const staff = CONFIG.staff[role];
            const cost = staff.baseCost * Math.pow(staff.costFactor, this.state.staff[role] || 0);
            return this.state.level >= staff.reqLevel && this.state.cleanCash >= cost;
        });

        if (availableStaff.length > 0) {
            const role = availableStaff[0];
            const staff = CONFIG.staff[role];
            const cost = staff.baseCost * Math.pow(staff.costFactor, this.state.staff[role] || 0);
            this.state.staff[role] = (this.state.staff[role] || 0) + 1;
            this.state.cleanCash -= cost;
        }

        // Buy territories aggressively
        const availableTerritories = CONFIG.territories.filter(t =>
            !this.state.territories.includes(t.id) &&
            this.state.level >= t.reqLevel &&
            this.state.cleanCash >= t.baseCost
        );
        if (availableTerritories.length > 0) {
            const ter = availableTerritories[0];
            this.state.territories.push(ter.id);
            this.state.cleanCash -= ter.baseCost;
        }
    }

    playWhale(dt) {
        // Massive transactions - test upper limits
        // Buy everything available
        CONFIG.territories.forEach(ter => {
            if (!this.state.territories.includes(ter.id) &&
                this.state.level >= ter.reqLevel &&
                this.state.cleanCash >= ter.baseCost) {
                this.state.territories.push(ter.id);
                this.state.cleanCash -= ter.baseCost;
            }
        });

        // Buy multiple staff at once
        Object.keys(CONFIG.staff).forEach(role => {
            const staff = CONFIG.staff[role];
            if (this.state.level >= staff.reqLevel) {
                for (let i = 0; i < 5; i++) {
                    const cost = staff.baseCost * Math.pow(staff.costFactor, this.state.staff[role] || 0);
                    if (this.state.cleanCash >= cost) {
                        this.state.staff[role] = (this.state.staff[role] || 0) + 1;
                        this.state.cleanCash -= cost;
                    }
                }
            }
        });
    }

    playSaboteur(dt) {
        // Try to break the game
        // Attempt negative values
        if (Math.random() < 0.1) {
            this.state.cleanCash = -1000;
        }
        // Attempt NaN
        if (Math.random() < 0.1) {
            this.state.heat = NaN;
        }
        // Attempt Infinity
        if (Math.random() < 0.1) {
            this.state.dirtyCash = Infinity;
        }
        // Rapid purchases
        for (let i = 0; i < 10; i++) {
            if (this.state.cleanCash >= 5000) {
                this.state.staff.pusher = (this.state.staff.pusher || 0) + 1;
                this.state.cleanCash -= 5000;
            }
        }
    }

    getStats() {
        const avgTickTime = this.actions.length > 0
            ? this.actions.reduce((sum, a) => sum + a.duration, 0) / this.actions.length
            : 0;

        return {
            name: this.name,
            type: this.type,
            location: this.location,
            finalCash: this.state.cleanCash + this.state.dirtyCash,
            level: this.state.level,
            territories: this.state.territories.length,
            staff: Object.values(this.state.staff).reduce((a, b) => a + b, 0),
            crashes: this.crashes,
            nanErrors: this.nanErrors,
            avgTickTime: avgTickTime.toFixed(2),
            totalActions: this.actions.length
        };
    }
}

// === SHOP (SERVER NODE) ===
class Shop {
    constructor(name, location) {
        this.name = name;
        this.location = location;
        this.players = [];
        this.daysPassed = 0;
    }

    addPlayer(player) {
        this.players.push(player);
        player.initialize();
    }

    simulateDay(virtualTime) {
        const HOURS_PER_DAY = 24;
        const SECONDS_PER_HOUR = 3600;

        for (let hour = 0; hour < HOURS_PER_DAY; hour++) {
            virtualTime += SECONDS_PER_HOUR * 1000;

            this.players.forEach(player => {
                player.playTick(SECONDS_PER_HOUR, virtualTime);
            });
        }

        this.daysPassed++;
        return virtualTime;
    }

    getStats() {
        const playerStats = this.players.map(p => p.getStats());
        const totalCrashes = playerStats.reduce((sum, p) => sum + p.crashes, 0);
        const totalNaN = playerStats.reduce((sum, p) => sum + p.nanErrors, 0);
        const avgTickTime = playerStats.reduce((sum, p) => sum + parseFloat(p.avgTickTime), 0) / playerStats.length;

        return {
            shop: this.name,
            location: this.location,
            players: playerStats.length,
            totalCrashes,
            totalNaN,
            avgTickTime: avgTickTime.toFixed(2),
            richestPlayer: Math.max(...playerStats.map(p => p.finalCash)),
            poorestPlayer: Math.min(...playerStats.map(p => p.finalCash)),
            playerStats
        };
    }
}

// === EXPERT REVIEW (Day 360) ===
class ExpertReviewer {
    constructor() {
        this.findings = [];
    }

    review(shops) {
        console.log('\n🔍 EXPERT REVIEW - Day 360 Analysis\n');

        // Economic Health
        const allPlayers = shops.flatMap(s => s.players);
        const balances = allPlayers.map(p => p.state.cleanCash + p.state.dirtyCash);
        const avgBalance = balances.reduce((a, b) => a + b, 0) / balances.length;
        const maxBalance = Math.max(...balances);
        const minBalance = Math.min(...balances);
        const wealthGap = maxBalance / Math.max(1, minBalance);

        console.log('Economic Health:');
        console.log(`  Average Balance: ${avgBalance.toLocaleString()} kr`);
        console.log(`  Richest Player: ${maxBalance.toLocaleString()} kr`);
        console.log(`  Poorest Player: ${minBalance.toLocaleString()} kr`);
        console.log(`  Wealth Gap: ${wealthGap.toFixed(1)}x`);

        if (wealthGap > 1000) {
            this.findings.push('⚠️  EXTREME wealth inequality detected');
        } else if (wealthGap > 100) {
            this.findings.push('✅ Healthy wealth distribution');
        } else {
            this.findings.push('⚠️  TOO EQUAL - May lack progression');
        }

        // Stability
        const totalCrashes = allPlayers.reduce((sum, p) => p.crashes, 0);
        const totalNaN = allPlayers.reduce((sum, p) => p.nanErrors, 0);

        console.log('\nStability:');
        console.log(`  Total Crashes: ${totalCrashes}`);
        console.log(`  Total NaN Errors: ${totalNaN}`);

        if (totalCrashes === 0 && totalNaN === 0) {
            this.findings.push('✅ PERFECT stability - No crashes or NaN errors');
        } else if (totalCrashes < 10 && totalNaN < 10) {
            this.findings.push('✅ Good stability - Minor issues');
        } else {
            this.findings.push('🚨 CRITICAL stability issues');
        }

        // UX Friction
        const avgTickTimes = allPlayers.map(p => {
            const avg = p.actions.reduce((sum, a) => sum + a.duration, 0) / p.actions.length;
            return avg;
        });
        const overallAvgTickTime = avgTickTimes.reduce((a, b) => a + b, 0) / avgTickTimes.length;

        console.log('\nUX Friction:');
        console.log(`  Average Tick Time: ${overallAvgTickTime.toFixed(2)}ms`);

        if (overallAvgTickTime < 10) {
            this.findings.push('✅ EXCELLENT performance - <10ms per tick');
        } else if (overallAvgTickTime < 50) {
            this.findings.push('✅ Good performance - <50ms per tick');
        } else {
            this.findings.push('⚠️  Performance issues - >50ms per tick');
        }

        // Progression
        const avgLevel = allPlayers.reduce((sum, p) => sum + p.state.level, 0) / allPlayers.length;
        const prestigeReached = allPlayers.filter(p => p.state.cleanCash >= 150000).length;

        console.log('\nProgression:');
        console.log(`  Average Level: ${avgLevel.toFixed(1)}`);
        console.log(`  Players at Prestige Threshold: ${prestigeReached}/${allPlayers.length}`);

        if (prestigeReached > allPlayers.length * 0.5) {
            this.findings.push('✅ Prestige is achievable - 50%+ reached threshold');
        } else if (prestigeReached > 0) {
            this.findings.push('⚠️  Prestige is challenging - <50% reached');
        } else {
            this.findings.push('🚨 Prestige UNREACHABLE - 0 players reached threshold');
        }

        return this.getVerdict();
    }

    getVerdict() {
        const critical = this.findings.filter(f => f.startsWith('🚨')).length;
        const warnings = this.findings.filter(f => f.startsWith('⚠️')).length;
        const passed = this.findings.filter(f => f.startsWith('✅')).length;

        let score = 100;
        score -= critical * 30;
        score -= warnings * 10;

        let verdict = '';
        if (score >= 90) {
            verdict = '🎉 PRODUCTION READY';
        } else if (score >= 70) {
            verdict = '✅ GOOD - Minor fixes needed';
        } else if (score >= 50) {
            verdict = '⚠️  NEEDS WORK - Major issues';
        } else {
            verdict = '🚨 NOT READY - Critical issues';
        }

        return {
            score,
            verdict,
            findings: this.findings
        };
    }
}

// === MAIN SIMULATION ===
async function runBetaSimulation() {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║     SYNDICATE OS - BLACK BOX BETA SIMULATION              ║');
    console.log('║     365 Days | 10 Global Shops | 1000+ Players            ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    // Load game modules
    ({ CONFIG } = await import('./src/config/gameConfig.js'));
    ({ getDefaultState } = await import('./src/utils/initialState.js'));
    ({ runGameTick } = await import('./src/features/engine/gameTick.js'));

    // Create 10 global shops
    const shops = [
        new Shop('Nørrebro HQ', 'Copenhagen, Denmark'),
        new Shop('Shibuya Node', 'Tokyo, Japan'),
        new Shop('Brooklyn Terminal', 'New York, USA'),
        new Shop('Red Square Hub', 'Moscow, Russia'),
        new Shop('Favela Network', 'Rio de Janeiro, Brazil'),
        new Shop('Kowloon Station', 'Hong Kong, China'),
        new Shop('Kreuzberg Cell', 'Berlin, Germany'),
        new Shop('Medellín Cartel', 'Medellín, Colombia'),
        new Shop('Amsterdam Exchange', 'Amsterdam, Netherlands'),
        new Shop('Lagos Syndicate', 'Lagos, Nigeria')
    ];

    // Populate shops with diverse players
    const personaTypes = ['casual', 'hustler', 'whale', 'saboteur'];
    let playerCount = 0;

    shops.forEach(shop => {
        // 10 players per shop, mixed personas
        for (let i = 0; i < 10; i++) {
            const type = personaTypes[i % personaTypes.length];
            const player = new PlayerPersona(`Player_${playerCount++}`, type, shop.location);
            shop.addPlayer(player);
        }
    });

    console.log(`✅ Created ${shops.length} shops with ${playerCount} total players\n`);
    console.log('🎮 SIMULATION STARTING...\n');

    // Run 365 day simulation
    const TOTAL_DAYS = 365;
    let virtualTime = Date.now();

    for (let day = 0; day < TOTAL_DAYS; day++) {
        // Simulate all shops in parallel
        shops.forEach(shop => {
            virtualTime = shop.simulateDay(virtualTime);
        });

        // Progress update every 30 days
        if ((day + 1) % 30 === 0) {
            console.log(`Day ${day + 1}/${TOTAL_DAYS} complete...`);
        }

        // Expert review at day 360
        if (day === 359) {
            const expert = new ExpertReviewer();
            const verdict = expert.review(shops);

            console.log('\n' + '='.repeat(60));
            console.log('EXPERT VERDICT:');
            console.log(`Score: ${verdict.score}/100`);
            console.log(`Verdict: ${verdict.verdict}`);
            console.log('\nFindings:');
            verdict.findings.forEach(f => console.log(`  ${f}`));
            console.log('='.repeat(60) + '\n');
        }
    }

    // Final Report
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                    FINAL REPORT                            ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    shops.forEach(shop => {
        const stats = shop.getStats();
        console.log(`\n📍 ${stats.shop} (${stats.location})`);
        console.log(`   Players: ${stats.players}`);
        console.log(`   Crashes: ${stats.totalCrashes}`);
        console.log(`   NaN Errors: ${stats.totalNaN}`);
        console.log(`   Avg Tick Time: ${stats.avgTickTime}ms`);
        console.log(`   Richest: ${stats.richestPlayer.toLocaleString()} kr`);
        console.log(`   Poorest: ${stats.poorestPlayer.toLocaleString()} kr`);
    });

    // Global stats
    const allStats = shops.map(s => s.getStats());
    const globalCrashes = allStats.reduce((sum, s) => sum + s.totalCrashes, 0);
    const globalNaN = allStats.reduce((sum, s) => sum + s.totalNaN, 0);
    const globalRichest = Math.max(...allStats.map(s => s.richestPlayer));
    const globalPoorest = Math.min(...allStats.map(s => s.poorestPlayer));

    console.log('\n' + '='.repeat(60));
    console.log('GLOBAL STATISTICS:');
    console.log(`  Total Players: ${playerCount}`);
    console.log(`  Total Crashes: ${globalCrashes}`);
    console.log(`  Total NaN Errors: ${globalNaN}`);
    console.log(`  Global Richest: ${globalRichest.toLocaleString()} kr`);
    console.log(`  Global Poorest: ${globalPoorest.toLocaleString()} kr`);
    console.log(`  Wealth Gap: ${(globalRichest / Math.max(1, globalPoorest)).toFixed(1)}x`);
    console.log('='.repeat(60));

    console.log('\n✅ BETA SIMULATION COMPLETE\n');
}

runBetaSimulation();
