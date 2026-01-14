/**
 * SYNDICATE ARCHITECT - Automated AI Auditor
 * Runs thousands of simulations to mathematically prove game balance
 * Tests for: Progression curves, math stability, risk/reward accuracy, exploits
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
let CONFIG, getDefaultState, runGameTick, processEconomy;

const t = (key) => key;

// === 1. THE "SNOWBALL" SIMULATION (Progression Analysis) ===
class ProgressionAnalyzer {
    constructor() {
        this.results = {};
    }

    analyzeStaffScaling(staffRole) {
        const staff = CONFIG.staff[staffRole];
        if (!staff) return null;

        const costs = [];
        const ratios = [];

        // Calculate costs for first 100 purchases
        for (let i = 0; i < 100; i++) {
            const cost = staff.baseCost * Math.pow(staff.costFactor, i);
            costs.push(cost);

            if (i > 0) {
                const ratio = costs[i] / costs[i - 1];
                ratios.push(ratio);
            }
        }

        // Analyze growth pattern
        const avgRatio = ratios.reduce((a, b) => a + b, 0) / ratios.length;
        const ratioVariance = ratios.reduce((sum, r) => sum + Math.pow(r - avgRatio, 2), 0) / ratios.length;

        // Determine if linear or exponential
        const isExponential = ratioVariance < 0.01; // Consistent ratio = exponential
        const growthType = isExponential ? 'EXPONENTIAL' : 'LINEAR';

        return {
            role: staffRole,
            baseCost: staff.baseCost,
            costFactor: staff.costFactor,
            cost10th: costs[9],
            cost50th: costs[49],
            cost100th: costs[99],
            avgRatio: avgRatio.toFixed(3),
            growthType,
            verdict: isExponential ? 'BALANCED' : 'TOO EASY'
        };
    }

    analyzeAllStaff() {
        console.log('\n🔬 PROGRESSION ANALYSIS: Staff Cost Scaling\n');
        console.log('Role'.padEnd(15), 'Base Cost'.padEnd(12), 'Factor'.padEnd(8), '10th'.padEnd(12), '50th'.padEnd(15), '100th'.padEnd(15), 'Growth'.padEnd(12), 'Verdict');
        console.log('='.repeat(120));

        Object.keys(CONFIG.staff).forEach(role => {
            const analysis = this.analyzeStaffScaling(role);
            if (analysis) {
                console.log(
                    analysis.role.padEnd(15),
                    analysis.baseCost.toLocaleString().padEnd(12),
                    analysis.costFactor.toString().padEnd(8),
                    Math.floor(analysis.cost10th).toLocaleString().padEnd(12),
                    Math.floor(analysis.cost50th).toLocaleString().padEnd(15),
                    Math.floor(analysis.cost100th).toLocaleString().padEnd(15),
                    analysis.growthType.padEnd(12),
                    analysis.verdict
                );
                this.results[role] = analysis;
            }
        });
    }
}

// === 2. THE "CHAOS MATH" ENGINE (Safety Check) ===
class ChaosMathEngine {
    constructor() {
        this.flaws = [];
        this.testCases = [NaN, -100, 0.000000001, undefined, null, Infinity, -Infinity, '', {}, []];
    }

    testStateIntegrity(state) {
        const criticalVars = ['cleanCash', 'dirtyCash', 'heat', 'level', 'xp'];
        const issues = [];

        criticalVars.forEach(varName => {
            const value = state[varName];
            if (!Number.isFinite(value)) {
                issues.push(`${varName} = ${value} (NOT FINITE)`);
            }
            if (value < 0 && varName !== 'dirtyCash') { // dirtyCash can be negative
                issues.push(`${varName} = ${value} (NEGATIVE)`);
            }
        });

        return issues;
    }

    fuzzGameTick() {
        console.log('\n🧪 CHAOS MATH ENGINE: Fuzzing Game Logic\n');

        let totalTests = 0;
        let failures = 0;

        this.testCases.forEach(testValue => {
            const state = getDefaultState();

            // Test 1: Fuzz cleanCash
            state.cleanCash = testValue;
            totalTests++;
            try {
                const newState = runGameTick(state, 1, t);
                const issues = this.testStateIntegrity(newState);
                if (issues.length > 0) {
                    failures++;
                    this.flaws.push({ test: 'cleanCash fuzz', input: testValue, issues });
                }
            } catch (e) {
                failures++;
                this.flaws.push({ test: 'cleanCash fuzz', input: testValue, error: e.message });
            }

            // Test 2: Fuzz heat
            const state2 = getDefaultState();
            state2.heat = testValue;
            totalTests++;
            try {
                const newState = runGameTick(state2, 1, t);
                const issues = this.testStateIntegrity(newState);
                if (issues.length > 0) {
                    failures++;
                    this.flaws.push({ test: 'heat fuzz', input: testValue, issues });
                }
            } catch (e) {
                failures++;
                this.flaws.push({ test: 'heat fuzz', input: testValue, error: e.message });
            }
        });

        console.log(`Total Fuzz Tests: ${totalTests}`);
        console.log(`Failures: ${failures}`);
        console.log(`Success Rate: ${((1 - failures / totalTests) * 100).toFixed(1)}%`);

        if (this.flaws.length > 0) {
            console.log('\n🚨 CRITICAL MATH FLAWS DETECTED:');
            this.flaws.slice(0, 5).forEach(flaw => {
                console.log(`  - ${flaw.test} with input ${flaw.input}:`);
                if (flaw.error) console.log(`    ERROR: ${flaw.error}`);
                if (flaw.issues) console.log(`    ISSUES: ${flaw.issues.join(', ')}`);
            });
        } else {
            console.log('✅ All fuzz tests passed - Math is stable!');
        }

        return { totalTests, failures, flaws: this.flaws };
    }
}

// === 3. THE RISK/REWARD MONTE CARLO ===
class MonteCarloAnalyzer {
    constructor() {
        this.results = {};
    }

    testTerritoryIncome(iterations = 10000) {
        console.log('\n🎲 MONTE CARLO: Territory Income Verification\n');

        CONFIG.territories.forEach(ter => {
            let totalIncome = 0;
            const state = getDefaultState();
            state.territories = [ter.id];

            for (let i = 0; i < iterations; i++) {
                const beforeCash = state.cleanCash + state.dirtyCash;
                const newState = processEconomy({ ...state }, 3600); // 1 hour
                const afterCash = newState.cleanCash + newState.dirtyCash;
                totalIncome += (afterCash - beforeCash);
            }

            const avgIncome = totalIncome / iterations;
            const expectedIncome = ter.income;
            const discrepancy = Math.abs(avgIncome - expectedIncome) / expectedIncome;

            console.log(`${ter.name.padEnd(20)} Expected: ${expectedIncome.toLocaleString().padEnd(10)} Actual: ${Math.floor(avgIncome).toLocaleString().padEnd(10)} Discrepancy: ${(discrepancy * 100).toFixed(1)}%`);

            if (discrepancy > 0.05) {
                console.log(`  ⚠️  LOGIC DISCREPANCY: ${(discrepancy * 100).toFixed(1)}% off target`);
            }

            this.results[ter.id] = { expected: expectedIncome, actual: avgIncome, discrepancy };
        });
    }

    testCryptoVolatility(iterations = 10000) {
        console.log('\n🎲 MONTE CARLO: Crypto Volatility Analysis\n');

        Object.keys(CONFIG.crypto.coins).forEach(coin => {
            const conf = CONFIG.crypto.coins[coin];
            const prices = [];

            for (let i = 0; i < iterations; i++) {
                const change = (Math.random() - 0.5) * conf.volatility * (conf.basePrice * 0.2);
                const newPrice = Math.max(conf.basePrice * 0.1, Math.min(conf.basePrice * 5, conf.basePrice + change));
                prices.push(newPrice);
            }

            const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
            const variance = prices.reduce((sum, p) => sum + Math.pow(p - avg, 2), 0) / prices.length;
            const stdDev = Math.sqrt(variance);

            console.log(`${conf.name.padEnd(15)} Base: ${conf.basePrice.toLocaleString().padEnd(10)} Avg: ${Math.floor(avg).toLocaleString().padEnd(10)} StdDev: ${Math.floor(stdDev).toLocaleString()}`);
        });
    }
}

// === 4. THE AUTOMATED REPORT GENERATOR ===
async function runSyndicateArchitect() {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║   SYNDICATE ARCHITECT - Automated AI Auditor v1.0         ║');
    console.log('║   Running comprehensive economic security analysis...      ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    // Load game modules
    ({ CONFIG } = await import('./src/config/gameConfig.js'));
    ({ getDefaultState } = await import('./src/utils/initialState.js'));
    ({ runGameTick } = await import('./src/features/engine/gameTick.js'));
    ({ processEconomy } = await import('./src/features/engine/economy.js'));

    // Run all analyses
    const progressionAnalyzer = new ProgressionAnalyzer();
    progressionAnalyzer.analyzeAllStaff();

    const chaosEngine = new ChaosMathEngine();
    const chaosResults = chaosEngine.fuzzGameTick();

    const monteCarloAnalyzer = new MonteCarloAnalyzer();
    monteCarloAnalyzer.testTerritoryIncome(1000);
    monteCarloAnalyzer.testCryptoVolatility(10000);

    // Generate Final Report
    console.log('\n\n');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║          🛡️  SYNDICATE OS - ECONOMIC SECURITY REPORT       ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    // Determine overall status
    const hasFlaws = chaosResults.failures > 0;
    const hasBadProgression = Object.values(progressionAnalyzer.results).some(r => r.verdict === 'TOO EASY');
    const status = (!hasFlaws && !hasBadProgression) ? '✅ PASS' : '❌ FAIL';

    console.log(`**Status:** ${status}\n`);

    console.log('**Progression Curve:**');
    const progressionTypes = Object.values(progressionAnalyzer.results).map(r => r.growthType);
    const isExponential = progressionTypes.every(t => t === 'EXPONENTIAL');
    console.log(`  ${isExponential ? '✅ EXPONENTIAL (Balanced)' : '⚠️  MIXED/LINEAR (Too Easy)'}\n`);

    console.log('**Math Stability:**');
    console.log(`  ${chaosResults.failures === 0 ? '✅ SAFE' : '🚨 VULNERABLE'}`);
    console.log(`  Fuzz Tests: ${chaosResults.totalTests}, Failures: ${chaosResults.failures}\n`);

    console.log('**Territory Income:**');
    const territoryDiscrepancies = Object.values(monteCarloAnalyzer.results);
    const avgDiscrepancy = territoryDiscrepancies.reduce((sum, r) => sum + r.discrepancy, 0) / territoryDiscrepancies.length;
    console.log(`  Average Discrepancy: ${(avgDiscrepancy * 100).toFixed(1)}%`);
    console.log(`  ${avgDiscrepancy < 0.05 ? '✅ ACCURATE' : '⚠️  INACCURATE'}\n`);

    console.log('**Optimization Tips:**');

    // Generate AI suggestions
    const suggestions = [];

    if (hasBadProgression) {
        suggestions.push('  • Increase costFactor for staff with LINEAR growth to 1.15+');
    }

    if (chaosResults.failures > 0) {
        suggestions.push('  • Add NaN/Infinity guards to all math operations');
    }

    if (avgDiscrepancy > 0.05) {
        suggestions.push('  • Territory income calculation may have timing issues');
        suggestions.push('  • Verify dt (delta time) is being applied correctly');
    }

    // Check for specific balance issues
    const cheapestStaff = Object.values(progressionAnalyzer.results).sort((a, b) => a.baseCost - b.baseCost)[0];
    if (cheapestStaff.cost100th < 1000000) {
        suggestions.push(`  • ${cheapestStaff.role} is too cheap at 100 units (${Math.floor(cheapestStaff.cost100th).toLocaleString()} kr)`);
    }

    if (suggestions.length === 0) {
        console.log('  ✅ No critical optimizations needed!');
    } else {
        suggestions.forEach(s => console.log(s));
    }

    console.log('\n' + '='.repeat(60));
    console.log('Audit Complete. Review findings above.');
    console.log('='.repeat(60));
}

runSyndicateArchitect();
