/**
 * AI TRAINER DEBUG - Single run with detailed logging
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

async function runDebugAI() {
    console.log('🤖 AI TRAINER DEBUG - Single Run with Logging\n');

    // Load game modules
    ({ CONFIG } = await import('./src/config/gameConfig.js'));
    ({ getDefaultState } = await import('./src/utils/initialState.js'));
    ({ runGameTick } = await import('./src/features/engine/gameTick.js'));

    let state = getDefaultState();
    state.cleanCash += 50000;
    state.xp += 1000;
    state.inv.hash_lys = 200;
    Object.keys(state.autoSell).forEach(k => state.autoSell[k] = true);

    const SECONDS_PER_STEP = 3600; // 1 hour
    const TOTAL_STEPS = 24 * 7; // 1 week
    const originalNow = Date.now;
    let virtualTime = Date.now();

    try {
        globalThis.Date.now = () => virtualTime;

        console.log('=== STARTING STATE ===');
        console.log(`Cash: ${state.cleanCash.toLocaleString()} kr`);
        console.log(`Territories: ${state.territories.length}`);
        console.log(`Staff: ${Object.values(state.staff).reduce((a, b) => a + b, 0)}`);

        for (let step = 0; step < TOTAL_STEPS; step++) {
            virtualTime += SECONDS_PER_STEP * 1000;

            const beforeCash = state.cleanCash + state.dirtyCash;

            // Generate inventory
            state.inv.hash_lys = (state.inv.hash_lys || 0) + 300;
            state.xp += 20;

            // Simple AI: Buy christiania if can afford
            if (step === 0 && state.cleanCash >= 20000) {
                state.territories.push('christiania');
                state.cleanCash -= 20000;
                console.log(`\nStep ${step}: Bought Christiania for 20K`);
            }

            // Buy some staff
            if (step === 1 && state.cleanCash >= 5000) {
                state.staff.pusher = (state.staff.pusher || 0) + 1;
                state.cleanCash -= 5000;
                console.log(`Step ${step}: Bought 1 Pusher for 5K`);
            }

            // Run game tick
            state = runGameTick(state, SECONDS_PER_STEP, t);

            const afterCash = state.cleanCash + state.dirtyCash;
            const cashChange = afterCash - beforeCash;

            if (step % 24 === 0) {
                console.log(`\nDay ${step / 24}:`);
                console.log(`  Cash: ${afterCash.toLocaleString()} kr (${cashChange >= 0 ? '+' : ''}${cashChange.toLocaleString()})`);
                console.log(`  Clean: ${state.cleanCash.toLocaleString()} kr`);
                console.log(`  Dirty: ${state.dirtyCash.toLocaleString()} kr`);
                console.log(`  Territories: ${state.territories.length}`);
                console.log(`  Staff: ${Object.values(state.staff).reduce((a, b) => a + b, 0)}`);
                console.log(`  Level: ${state.level}`);
            }
        }

        console.log('\n=== FINAL STATE ===');
        console.log(`Total Cash: ${(state.cleanCash + state.dirtyCash).toLocaleString()} kr`);
        console.log(`Clean: ${state.cleanCash.toLocaleString()} kr`);
        console.log(`Dirty: ${state.dirtyCash.toLocaleString()} kr`);
        console.log(`Territories: ${state.territories.join(', ')}`);
        console.log(`Staff: ${JSON.stringify(state.staff)}`);
        console.log(`Level: ${state.level}`);

        // Calculate expected
        const expectedTerritoryIncome = 25000 * TOTAL_STEPS; // 25K/hr
        console.log(`\nExpected territory income: ${expectedTerritoryIncome.toLocaleString()} kr`);
        console.log(`Actual gain: ${(state.cleanCash + state.dirtyCash - 50000).toLocaleString()} kr`);

    } finally {
        globalThis.Date.now = originalNow;
    }
}

runDebugAI();
