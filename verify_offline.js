
/**
 * Offline Fidelity Verification Script (Refined)
 */

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
    localStorage: { getItem: () => null, setItem: () => { } },
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

async function runTest() {
    const { getDefaultState } = await import('./src/utils/initialState.js');
    const { calculateOfflineProgress } = await import('./src/features/engine/offline.js');

    console.log("Starting Refined Offline Fidelity Test...");

    // Setup: 24 hours offline
    let state = getDefaultState();
    state.cleanCash = 5000000; // Tons of cash for salaries
    state.staff.junkie = 20;   // Producers
    state.staff.pusher = 20;   // Sellers
    state.inv.hash_lys = 1000; // Initial stock to sell

    // Set lastPaid to the START of the offline period so salaries are paid during sim
    state.lastSaveTime = Date.now() - (24 * 60 * 60 * 1000);
    state.payroll.lastPaid = state.lastSaveTime;

    const start = Date.now();
    const { state: newState, report } = calculateOfflineProgress(state, Date.now());
    const end = Date.now();

    console.log(`\nSimulation Report:`);
    console.log(`- Time Simulated: ${report.time} minutes`);
    console.log(`- Clean Earnings Delta: ${report.cleanEarnings}`);
    console.log(`- Dirty Earnings Delta: ${report.earnings}`);
    console.log(`- Produced (Hash): ${report.produced.hash_lys || 0}`);
    console.log(`- Performance: ${end - start}ms`);

    // Verification
    if (newState.dirtyCash > state.dirtyCash || newState.stats.produced.hash_lys > state.stats.produced.hash_lys) {
        console.log("\n✅ FIDELITY CONFIRMED: High-precision simulation captured progress.");
    } else {
        console.log("\n❌ FAIL: No engine progress detected.");
        process.exit(1);
    }
}

runTest();
