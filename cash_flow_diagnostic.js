/**
 * CASH FLOW DIAGNOSTIC - Find where the money is going
 * Traces every kr earned and spent over 24 hours
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

async function runCashFlowDiagnostic() {
    console.log('💰 CASH FLOW DIAGNOSTIC - Tracing Money Flow\n');

    // Load game modules
    ({ CONFIG } = await import('./src/config/gameConfig.js'));
    ({ getDefaultState } = await import('./src/utils/initialState.js'));
    ({ runGameTick } = await import('./src/features/engine/gameTick.js'));

    // Setup realistic game state
    let state = getDefaultState();
    state.cleanCash = 50000; // Starting boost
    state.xp = 1000;
    state.inv.hash_lys = 200;
    Object.keys(state.autoSell).forEach(k => state.autoSell[k] = true);

    // Buy 1 territory and some staff
    state.territories = ['christiania'];
    state.staff.junkie = 5;
    state.staff.pusher = 5;

    console.log('=== INITIAL STATE ===');
    console.log(`Clean Cash: ${state.cleanCash.toLocaleString()} kr`);
    console.log(`Dirty Cash: ${state.dirtyCash.toLocaleString()} kr`);
    console.log(`Territories: ${state.territories.join(', ')}`);
    console.log(`Staff: ${state.staff.junkie} Junkies, ${state.staff.pusher} Pushers`);
    console.log(`Inventory: ${state.inv.hash_lys} hash_lys\n`);

    // Track cash flow over 24 hours (1 tick per hour)
    const cashFlow = {
        territoryIncome: 0,
        productionRevenue: 0,
        salaryPaid: 0,
        staffPurchases: 0,
        territoryPurchases: 0,
        other: 0
    };

    const HOURS = 24;
    const SECONDS_PER_HOUR = 3600;

    console.log('=== RUNNING 24 HOUR SIMULATION ===\n');

    for (let hour = 0; hour < HOURS; hour++) {
        const beforeCash = state.cleanCash + state.dirtyCash;
        const beforeClean = state.cleanCash;
        const beforeDirty = state.dirtyCash;

        // Run one hour
        state = runGameTick(state, SECONDS_PER_HOUR, t);

        const afterCash = state.cleanCash + state.dirtyCash;
        const afterClean = state.cleanCash;
        const afterDirty = state.dirtyCash;

        const totalChange = afterCash - beforeCash;
        const cleanChange = afterClean - beforeClean;
        const dirtyChange = afterDirty - beforeDirty;

        // Track changes
        if (hour % 6 === 0) {
            console.log(`Hour ${hour}:`);
            console.log(`  Total Cash: ${afterCash.toLocaleString()} kr (${totalChange >= 0 ? '+' : ''}${totalChange.toLocaleString()})`);
            console.log(`  Clean: ${afterClean.toLocaleString()} kr (${cleanChange >= 0 ? '+' : ''}${cleanChange.toLocaleString()})`);
            console.log(`  Dirty: ${afterDirty.toLocaleString()} kr (${dirtyChange >= 0 ? '+' : ''}${dirtyChange.toLocaleString()})`);
            console.log(`  Inventory: ${state.inv.hash_lys || 0} hash_lys`);
        }

        // Estimate breakdown (rough)
        if (dirtyChange > 0) {
            cashFlow.productionRevenue += dirtyChange;
        }
        if (cleanChange < 0) {
            cashFlow.salaryPaid += Math.abs(cleanChange);
        }
    }

    console.log('\n=== FINAL STATE ===');
    console.log(`Clean Cash: ${state.cleanCash.toLocaleString()} kr`);
    console.log(`Dirty Cash: ${state.dirtyCash.toLocaleString()} kr`);
    console.log(`Total Cash: ${(state.cleanCash + state.dirtyCash).toLocaleString()} kr`);
    console.log(`Inventory: ${state.inv.hash_lys || 0} hash_lys`);
    console.log(`Level: ${state.level}`);

    console.log('\n=== CASH FLOW ANALYSIS ===');
    console.log(`Production Revenue: +${cashFlow.productionRevenue.toLocaleString()} kr`);
    console.log(`Salary Paid: -${cashFlow.salaryPaid.toLocaleString()} kr`);
    console.log(`Net: ${(cashFlow.productionRevenue - cashFlow.salaryPaid).toLocaleString()} kr`);

    // Calculate expected values
    const expectedTerritoryIncome = 25000 * HOURS; // 25K/hr * 24hr
    const expectedSalary = (5 * 25 + 5 * 150) * HOURS; // (5 junkies * 25 + 5 pushers * 150) * 24hr

    console.log('\n=== EXPECTED vs ACTUAL ===');
    console.log(`Expected Territory Income: ${expectedTerritoryIncome.toLocaleString()} kr (25K/hr * 24hr)`);
    console.log(`Expected Salary Cost: ${expectedSalary.toLocaleString()} kr`);
    console.log(`Expected Net: ${(expectedTerritoryIncome - expectedSalary).toLocaleString()} kr`);

    const actualNet = (state.cleanCash + state.dirtyCash) - 50000;
    console.log(`Actual Net: ${actualNet.toLocaleString()} kr`);
    console.log(`Discrepancy: ${(actualNet - (expectedTerritoryIncome - expectedSalary)).toLocaleString()} kr`);

    // Detailed breakdown
    console.log('\n=== DETAILED ANALYSIS ===');
    console.log('Territory Income Check:');
    console.log(`  Christiania should generate: 25,000 kr/hr`);
    console.log(`  Over 24 hours: 600,000 kr`);
    console.log(`  Actual dirty cash gained: ${cashFlow.productionRevenue.toLocaleString()} kr`);

    console.log('\nSalary Check:');
    console.log(`  5 Junkies @ 25 kr/hr = 125 kr/hr`);
    console.log(`  5 Pushers @ 150 kr/hr = 750 kr/hr`);
    console.log(`  Total: 875 kr/hr * 24 = 21,000 kr`);
    console.log(`  Actual salary paid: ${cashFlow.salaryPaid.toLocaleString()} kr`);

    console.log('\n=== DIAGNOSIS ===');
    if (actualNet < 100000) {
        console.log('🚨 PROBLEM: Cash accumulation is too low!');
        console.log('Possible causes:');
        console.log('  1. Territory income not being applied');
        console.log('  2. Payroll running too frequently');
        console.log('  3. Production/selling not generating revenue');
        console.log('  4. Missing multipliers');
    } else {
        console.log('✅ Cash flow is working correctly!');
    }
}

runCashFlowDiagnostic();
