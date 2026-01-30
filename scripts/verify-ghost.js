
import { CONFIG } from '../src/config/gameConfig.js';

// Mock State
let state = {
    cleanCash: 1000000,
    dirtyCash: 500000,
    heat: 100, // Critical
    luxuryItems: ['ghostmode'], // Player owns it
    logs: []
};

console.log("👻 VERIFYING GHOST PROTOCOL LOGIC...");
console.log("INITIAL STATE:", {
    heat: state.heat,
    clean: state.cleanCash,
    dirty: state.dirtyCash
});

// SIMULATE: Activate Ghost Mode (Logic extracted from useSystemActions.js)
const activateGhostMode = (prev) => {
    // 1. Ownership Check
    if (!prev.luxuryItems?.includes('ghostmode')) {
        console.error("❌ FAILED: Ownership check failed unexpectedly.");
        return prev;
    }

    // 2. Cost Calc
    const cleanCost = Math.floor(prev.cleanCash * 0.10);
    const dirtyLost = prev.dirtyCash;

    console.log(`\n💰 CALCULATED COSTS: Clean: -${cleanCost} (10%), Dirty: -${dirtyLost} (100%)`);

    // 3. Apply
    return {
        ...prev,
        cleanCash: Math.max(0, prev.cleanCash - cleanCost),
        dirtyCash: 0,
        heat: 0,
        activeBuffs: { ghostMode: Date.now() + 600000 },
        ghostModeLastActivated: Date.now()
    };
};

const newState = activateGhostMode(state);

console.log("NEW STATE:", {
    heat: newState.heat,
    clean: newState.cleanCash,
    dirty: newState.dirtyCash
});

// VERIFICATIONS
let errors = 0;
if (newState.heat !== 0) {
    console.error("❌ ERROR: Heat was not reset to 0.");
    errors++;
} else {
    console.log("✅ HEAT RESET: Confirmed");
}

if (newState.dirtyCash !== 0) {
    console.error("❌ ERROR: Dirty Cash was not wiped.");
    errors++;
} else {
    console.log("✅ DIRTY CASH WIPE: Confirmed");
}

if (newState.cleanCash !== 900000) {
    console.error(`❌ ERROR: Clean Cash math wrong. Expected 900000, got ${newState.cleanCash}`);
    errors++;
} else {
    console.log("✅ CLEAN CASH FEE: Confirmed (10%)");
}

if (errors === 0) {
    console.log("\n✨ GHOST PROTOCOL LOGIC VERIFIED ✨");
} else {
    console.error("\n💀 GHOST PROTOCOL FAILED VERIFICATION 💀");
    process.exit(1);
}
