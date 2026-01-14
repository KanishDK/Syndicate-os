
/**
 * SYNDICATE OS - AUTONOMOUS AI TRAINER
 * Self-learning agent that discovers optimal strategies and balance issues
 * Runs at 100x speed to find exploits, bottlenecks, and the "meta"
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

// === STEP 1: THE OBSERVER (Data Collection) ===
class GameObserver {
    constructor(state) {
        this.state = state;
    }

    // Read exact game state variables
    getCleanCash() { return this.state.cleanCash || 0; }
    getDirtyCash() { return this.state.dirtyCash || 0; }
    getHeat() { return this.state.heat || 0; }
    getLevel() { return this.state.level || 1; }
    getTerritories() { return this.state.territories || []; }
    getStaff() { return this.state.staff || {}; }
    getCrypto() { return this.state.crypto || {}; }
    getInventory() { return this.state.inv || {}; }

    // Calculate derived metrics
    getTotalWealth() {
        return this.getCleanCash() + this.getDirtyCash();
    }

    getHourlySalary() {
        let total = 0;
        Object.keys(CONFIG.staff).forEach(role => {
            const count = this.state.staff[role] || 0;
            const salary = CONFIG.staff[role].salary || 0;
            total += count * salary;
        });
        return total;
    }

    getTerritoryIncome() {
        let total = 0;
        this.getTerritories().forEach(terId => {
            const ter = CONFIG.territories.find(t => t.id === terId);
            if (ter) total += ter.income;
        });
        return total;
    }

    getNetCashFlow() {
        return this.getTerritoryIncome() - this.getHourlySalary();
    }
}

// === STEP 2: THE BRAIN (Decision Engine with Learning) ===
class AIBrain {
    constructor() {
        this.strategy = {
            riskTolerance: 0.3, // 30% of cash can be spent
            salaryReserve: 10, // Keep 10 hours of salary
            territoryPriority: 0.7, // 70% priority on territories
            staffPriority: 0.3, // 30% priority on staff
        };
        this.memory = {
            bankruptcies: [],
            successfulMoves: [],
            failedMoves: []
        };
        this.purchaseHistory = {};
    }

    // Learn from bankruptcy
    recordBankruptcy(reason, state) {
        this.memory.bankruptcies.push({
            reason,
            level: state.level,
            territories: state.territories.length,
            staff: Object.values(state.staff).reduce((a, b) => a + b, 0)
        });

        // Adjust strategy
        if (reason === 'salary_drain') {
            this.strategy.salaryReserve += 5;
            this.strategy.staffPriority *= 0.8;
        } else if (reason === 'overexpansion') {
            this.strategy.territoryPriority *= 0.8;
            this.strategy.riskTolerance *= 0.8;
        }
    }

    // Calculate ROI for staff
    calculateStaffROI(role, state) {
        const staff = CONFIG.staff[role];
        if (!staff || state.level < staff.reqLevel) return -Infinity;

        const currentCount = state.staff[role] || 0;
        const cost = staff.baseCost * Math.pow(staff.costFactor, currentCount);
        const salary = staff.salary;

        // Estimate revenue based on role
        let estimatedHourlyRevenue = 0;
        if (staff.role === 'seller') {
            estimatedHourlyRevenue = salary * 3; // Sellers generate 3x their salary
        } else if (staff.role === 'producer') {
            estimatedHourlyRevenue = salary * 2; // Producers generate 2x
        } else if (staff.role === 'reducer') {
            estimatedHourlyRevenue = salary * 1.5; // Reducers save money
        }

        const netIncome = estimatedHourlyRevenue - salary;
        if (netIncome <= 0) return -Infinity;

        return cost / netIncome; // Payback period in hours
    }

    // Calculate ROI for territory
    calculateTerritoryROI(terId, state) {
        const ter = CONFIG.territories.find(t => t.id === terId);
        if (!ter || state.territories.includes(terId) || state.level < ter.reqLevel) {
            return -Infinity;
        }

        const paybackHours = ter.baseCost / ter.income;
        return paybackHours;
    }

    // Make decision
    decide(observer) {
        const state = observer.state;
        const cleanCash = observer.getCleanCash();
        const netCashFlow = observer.getNetCashFlow();
        const hourlySalary = observer.getHourlySalary();

        // Safety check: If negative cash flow, don't spend
        if (netCashFlow < 0 && cleanCash < hourlySalary * this.strategy.salaryReserve) {
            return { action: 'wait', reason: 'negative_cashflow' };
        }

        // Calculate safe spending amount
        const safeSpending = cleanCash * this.strategy.riskTolerance;
        const reserveNeeded = hourlySalary * this.strategy.salaryReserve;
        const availableCash = Math.max(0, cleanCash - reserveNeeded);

        if (availableCash < 1000) {
            return { action: 'wait', reason: 'insufficient_funds' };
        }

        // Evaluate all territories
        const territoryOptions = CONFIG.territories.map(ter => ({
            type: 'territory',
            id: ter.id,
            cost: ter.baseCost,
            roi: this.calculateTerritoryROI(ter.id, state)
        })).filter(opt => opt.roi > 0 && opt.roi < 500 && opt.cost <= availableCash);

        // Evaluate all staff
        const staffOptions = Object.keys(CONFIG.staff).map(role => ({
            type: 'staff',
            id: role,
            cost: CONFIG.staff[role].baseCost * Math.pow(CONFIG.staff[role].costFactor, state.staff[role] || 0),
            roi: this.calculateStaffROI(role, state)
        })).filter(opt => opt.roi > 0 && opt.roi < 200 && opt.cost <= availableCash);

        // Combine and sort by ROI
        const allOptions = [...territoryOptions, ...staffOptions].sort((a, b) => a.roi - b.roi);

        if (allOptions.length === 0) {
            return { action: 'wait', reason: 'no_good_options' };
        }

        // Pick best option with strategy weighting
        const bestOption = allOptions[0];

        // Apply strategy priority
        if (bestOption.type === 'territory' && Math.random() > this.strategy.territoryPriority) {
            const bestStaff = staffOptions[0];
            if (bestStaff) return { action: 'buy_staff', role: bestStaff.id, cost: bestStaff.cost };
        }

        if (bestOption.type === 'territory') {
            return { action: 'buy_territory', id: bestOption.id, cost: bestOption.cost };
        } else {
            return { action: 'buy_staff', role: bestOption.id, cost: bestOption.cost };
        }
    }

    // Execute decision
    execute(decision, state) {
        if (decision.action === 'wait') return state;

        if (decision.action === 'buy_territory') {
            const ter = CONFIG.territories.find(t => t.id === decision.id);
            if (state.cleanCash >= ter.baseCost && !state.territories.includes(decision.id)) {
                state.territories.push(decision.id);
                state.cleanCash -= ter.baseCost;
                this.purchaseHistory[decision.id] = (this.purchaseHistory[decision.id] || 0) + 1;
                this.memory.successfulMoves.push({ type: 'territory', id: decision.id });
            }
        } else if (decision.action === 'buy_staff') {
            const staff = CONFIG.staff[decision.role];
            const cost = staff.baseCost * Math.pow(staff.costFactor, state.staff[decision.role] || 0);
            if (state.cleanCash >= cost) {
                state.staff[decision.role] = (state.staff[decision.role] || 0) + 1;
                state.cleanCash -= cost;
                this.purchaseHistory[decision.role] = (this.purchaseHistory[decision.role] || 0) + 1;
                this.memory.successfulMoves.push({ type: 'staff', role: decision.role });
            }
        }

        return state;
    }
}

// === STEP 3: THE SPEED RUN (Simulation) ===
class SpeedRunner {
    constructor(brain) {
        this.brain = brain;
        this.metrics = {
            fastestMillion: Infinity,
            fastestPrestige: Infinity,
            totalTicks: 0,
            bankruptcies: 0,
            prestiges: 0
        };
    }

    async runPlaythrough(days = 365) {
        let state = getDefaultState();
        state.cleanCash += 50000; // Starting boost
        state.xp += 1000;
        state.inv.hash_lys = 200;
        Object.keys(state.autoSell).forEach(k => state.autoSell[k] = true);

        const SECONDS_PER_STEP = 3600; // 1 hour
        const TOTAL_STEPS = days * 24;
        const originalNow = Date.now;
        let virtualTime = Date.now();

        const startTime = Date.now();
        let millionReached = false;
        let prestigeReached = false;

        try {
            globalThis.Date.now = () => virtualTime;

            for (let step = 0; step < TOTAL_STEPS; step++) {
                virtualTime += SECONDS_PER_STEP * 1000;
                this.metrics.totalTicks++;

                // Generate base inventory (increased to match new production rates)
                state.inv.hash_lys = (state.inv.hash_lys || 0) + 300;
                state.xp += 20;

                // AI Decision
                const observer = new GameObserver(state);
                const decision = this.brain.decide(observer);
                state = this.brain.execute(decision, state);

                // Run game tick
                state = runGameTick(state, SECONDS_PER_STEP, t);

                // Check milestones
                if (!millionReached && state.cleanCash >= 1000000) {
                    millionReached = true;
                    const timeToMillion = (step / 24); // Days
                    this.metrics.fastestMillion = Math.min(this.metrics.fastestMillion, timeToMillion);
                }

                if (!prestigeReached && state.level >= 10 && state.cleanCash >= 150000) {
                    prestigeReached = true;
                    const timeToPrestige = (step / 24); // Days
                    this.metrics.fastestPrestige = Math.min(this.metrics.fastestPrestige, timeToPrestige);
                    this.metrics.prestiges++;
                }

                // Bankruptcy check
                if (state.cleanCash < 0 && state.dirtyCash < 0) {
                    this.metrics.bankruptcies++;
                    const observer = new GameObserver(state);
                    if (observer.getNetCashFlow() < 0) {
                        this.brain.recordBankruptcy('salary_drain', state);
                    } else {
                        this.brain.recordBankruptcy('overexpansion', state);
                    }
                    break;
                }
            }
        } finally {
            globalThis.Date.now = originalNow;
        }

        return {
            finalState: state,
            millionReached,
            prestigeReached,
            duration: Date.now() - startTime
        };
    }
}

// === STEP 4: THE REPORT (Output) ===
async function runAITrainer() {
    console.log("🤖 AUTONOMOUS AI TRAINER STARTING...\n");

    // Load game modules
    ({ CONFIG } = await import('./src/config/gameConfig.js'));
    ({ getDefaultState } = await import('./src/utils/initialState.js'));
    ({ runGameTick } = await import('./src/features/engine/gameTick.js'));

    const brain = new AIBrain();
    const runner = new SpeedRunner(brain);

    const PLAYTHROUGHS = 10;
    const DAYS_PER_RUN = 365;

    console.log(`Running ${PLAYTHROUGHS} playthroughs of ${DAYS_PER_RUN} days each...\n`);

    const results = [];
    for (let i = 0; i < PLAYTHROUGHS; i++) {
        console.log(`Playthrough ${i + 1}/${PLAYTHROUGHS}...`);
        const result = await runner.runPlaythrough(DAYS_PER_RUN);
        results.push(result);
    }

    // === GENERATE REPORT ===
    console.log("\n" + "=".repeat(60));
    console.log("🎯 AI TRAINER REPORT");
    console.log("=".repeat(60));

    console.log("\n📊 PERFORMANCE METRICS:");
    console.log(`  Fastest to 1M kr: ${runner.metrics.fastestMillion === Infinity ? 'NEVER' : runner.metrics.fastestMillion.toFixed(1) + ' days'}`);
    console.log(`  Fastest to Prestige: ${runner.metrics.fastestPrestige === Infinity ? 'NEVER' : runner.metrics.fastestPrestige.toFixed(1) + ' days'}`);
    console.log(`  Total Prestiges: ${runner.metrics.prestiges}`);
    console.log(`  Bankruptcies: ${runner.metrics.bankruptcies}`);
    console.log(`  Total Ticks Simulated: ${runner.metrics.totalTicks.toLocaleString()}`);

    console.log("\n🎮 THE META (Most Purchased):");
    const sorted = Object.entries(brain.purchaseHistory).sort((a, b) => b[1] - a[1]).slice(0, 10);
    sorted.forEach(([item, count]) => {
        console.log(`  ${item}: ${count} purchases`);
    });

    console.log("\n💡 AI LEARNING:");
    console.log(`  Bankruptcies Recorded: ${brain.memory.bankruptcies.length}`);
    console.log(`  Strategy Adjustments:`);
    console.log(`    Risk Tolerance: ${(brain.strategy.riskTolerance * 100).toFixed(0)}%`);
    console.log(`    Salary Reserve: ${brain.strategy.salaryReserve} hours`);
    console.log(`    Territory Priority: ${(brain.strategy.territoryPriority * 100).toFixed(0)}%`);

    console.log("\n🔍 BOTTLENECK ANALYSIS:");
    const finalStates = results.map(r => r.finalState);
    const avgCash = finalStates.reduce((sum, s) => sum + s.cleanCash, 0) / finalStates.length;
    const avgLevel = finalStates.reduce((sum, s) => sum + s.level, 0) / finalStates.length;
    const avgTerritories = finalStates.reduce((sum, s) => sum + s.territories.length, 0) / finalStates.length;

    console.log(`  Average Final Cash: ${Math.floor(avgCash).toLocaleString()} kr`);
    console.log(`  Average Final Level: ${avgLevel.toFixed(1)}`);
    console.log(`  Average Territories: ${avgTerritories.toFixed(1)}`);

    console.log("\n⚠️  BALANCE ISSUES:");
    if (runner.metrics.fastestPrestige === Infinity) {
        console.log(`  🚨 PRESTIGE UNREACHABLE: No AI reached prestige in ${DAYS_PER_RUN} days`);
        console.log(`     Recommendation: Lower threshold to 250K or increase income`);
    }
    if (runner.metrics.bankruptcies > PLAYTHROUGHS * 0.3) {
        console.log(`  🚨 HIGH BANKRUPTCY RATE: ${((runner.metrics.bankruptcies / PLAYTHROUGHS) * 100).toFixed(0)}%`);
        console.log(`     Recommendation: Reduce staff costs or increase territory income`);
    }
    if (avgCash < 100000) {
        console.log(`  🚨 LOW CASH ACCUMULATION: Average ${Math.floor(avgCash).toLocaleString()} kr`);
        console.log(`     Recommendation: Increase production revenue or reduce costs`);
    }

    console.log("\n" + "=".repeat(60));
}

runAITrainer();
