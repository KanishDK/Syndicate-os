import { runGameTick } from './gameTick.js';

/**
 * High-Precision Offline Simulation
 * Uses the actual game engine (runGameTick) to simulate time chunks.
 */
export const calculateOfflineProgress = (state, now) => {
    if (!state.lastSaveTime) return { state, report: null };

    const diffMs = now - state.lastSaveTime;
    const totalSeconds = Math.floor(diffMs / 1000);

    // Minimum 60 seconds to trigger offline report
    if (totalSeconds < 60) return { state, report: null };

    // Capping at 30 days to prevent infinite loops / performance hits
    const MAX_SECONDS = 30 * 24 * 60 * 60;
    const simSeconds = Math.min(totalSeconds, MAX_SECONDS);

    // Discrete Simulation Config
    // We use 60s chunks for extreme performance while maintaining system fidelity (salaries, crypto, etc.)
    const CHUNK_SIZE = 60;
    const iterations = Math.floor(simSeconds / CHUNK_SIZE);

    let report = {
        time: Math.floor(simSeconds / 60),
        earnings: 0,
        cleanEarnings: 0,
        laundered: 0,
        salaryPaid: 0,
        produced: {},
        raids: { attempted: 0, defended: 0, lost: 0, moneyLost: 0 },
        isSimulated: true // Flag for UI
    };

    // Tracking for report (Capture start state)
    const startClean = state.cleanCash;
    const startDirty = state.dirtyCash;
    const startLaundered = state.stats.laundered;
    const startProduced = { ...state.stats.produced };

    // Mocks for runGameTick requirements
    const mockT = (key) => key;

    // --- DISCRETE SIMULATION LOOP WITH VIRTUAL CLOCK ---
    let currentState = state;
    const originalNow = Date.now;
    let virtualClock = state.lastSaveTime;

    try {
        // Override Date.now for the duration of sim
        Date.now = () => virtualClock;

        for (let i = 0; i < iterations; i++) {
            virtualClock += CHUNK_SIZE * 1000;
            currentState = runGameTick(currentState, CHUNK_SIZE, mockT);
        }
    } catch (e) {
        console.error("Offline simulation error:", e);
    } finally {
        // CRITICAL: Restore clock
        Date.now = originalNow;
    }

    // --- CALCULATE DELTAS FOR REPORT ---
    report.cleanEarnings = currentState.cleanCash - startClean;
    report.earnings = currentState.dirtyCash - startDirty;
    report.laundered = currentState.stats.laundered - startLaundered;

    // Summary of production during sim
    Object.keys(currentState.stats.produced).forEach(item => {
        const diff = currentState.stats.produced[item] - (startProduced[item] || 0);
        if (diff > 0) report.produced[item] = diff;
    });

    // Final Post-processing
    currentState.lastSaveTime = now;

    return { state: currentState, report };
};
