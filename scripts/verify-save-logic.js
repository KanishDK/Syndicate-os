
import { CONFIG } from '../src/config/gameConfig.js';
import { getDefaultState } from '../src/utils/initialState.js';

console.log("🔍 STARTING SAVE LOGIC VERIFICATION...");

let errors = 0;
const state = getDefaultState();

// 1. Verify Inventory Keys
console.log("\n📦 Checking Inventory (state.inv) vs CONFIG.production...");
const configItems = Object.keys(CONFIG.production);
const stateItems = Object.keys(state.inv);

configItems.forEach(item => {
    if (!state.inv.hasOwnProperty(item)) {
        console.error(`❌ MISSING IN STATE: Item '${item}' is in CONFIG but not in state.inv`);
        errors++;
    }
});
stateItems.forEach(item => {
    if (item !== 'total' && !CONFIG.production[item]) {
        console.warn(`⚠️  ORPHAN IN STATE: Item '${item}' is in state.inv but not in CONFIG`);
        // Not necessarily an error, but good to know
    }
});

// 2. Verify Staff Keys
console.log("\n👥 Checking Staff (state.staff) vs CONFIG.staff...");
const configStaff = Object.keys(CONFIG.staff);
configStaff.forEach(role => {
    if (!state.staff.hasOwnProperty(role)) {
        console.error(`❌ MISSING IN STATE: Staff role '${role}' is in CONFIG but not in state.staff`);
        errors++;
    }
});

// 3. Verify Critical Save Keys (used in Start Menu)
console.log("\n💾 Checking Critical Save Keys (Start Menu compatibility)...");
const criticalKeys = ['cleanCash', 'level', 'lastSaveTime', 'dirtyCash', 'xp'];
criticalKeys.forEach(key => {
    if (!state.hasOwnProperty(key)) {
        console.error(`❌ MISSING CRITICAL KEY: '${key}' is missing from default state! Start Menu will fail.`);
        errors++;
    }
});

// 4. Verify Serialization
console.log("\n🔄 Verifying Serialization...");
try {
    const json = JSON.stringify(state);
    const parsed = JSON.parse(json);

    // Check deep equality for a sample
    if (parsed.cleanCash !== state.cleanCash) throw new Error("cleanCash mismatch after serialization");
    if (Object.keys(parsed.inv).length !== Object.keys(state.inv).length) throw new Error("Inventory size mismatch");

    console.log("✅ Serialization Test Passed");
} catch (e) {
    console.error("❌ SERIALIZATION FAILED:", e.message);
    errors++;
}

console.log("\n-----------------------------------");
if (errors === 0) {
    console.log("✅ VERIFICATION SUCCESSFUL: Save structure matches Configuration.");
    process.exit(0);
} else {
    console.error(`❌ VERIFICATION FAILED with ${errors} errors.`);
    process.exit(1);
}
