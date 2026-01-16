
import { Personas } from './personas.js';
import { SimActions } from './simActions.js';
import { runGameTick } from '../../src/features/engine/gameTick.js';
import { getDefaultState } from '../../src/utils/initialState.js';
import fs from 'fs';

// TRUTH VERIFICATION SCRIPT
// Runs a verbose trace of "The Investor" to prove he is broken by logic, not RNG.

const SIM_STEPS = 1000; // Short run to see the deadlock
const DT = 60;
const PERSONA_KEY = 'investor';

const runVerification = () => {
    console.log(`🕵️ STARTING TRUTH AUDIT FOR: ${Personas[PERSONA_KEY].name}`);

    // Mock Date
    let CURRENT_TIME = Date.now();
    Date.now = () => CURRENT_TIME;

    // Mock T
    const t = (k) => k;

    let state = getDefaultState();
    let trace = [];

    for (let step = 0; step < SIM_STEPS; step++) {
        CURRENT_TIME += DT * 1000;

        // Snapshot pre-tick
        const preCash = { clean: state.cleanCash, dirty: state.dirtyCash };

        // Engine Tick
        state = runGameTick(state, DT, t);

        // Persona Logic
        const decision = Personas[PERSONA_KEY].decide(state);
        let actionLog = "None";

        if (decision) {
            actionLog = decision.type;
            if (decision.type === 'buyStaff') state = SimActions.buyStaff(state, decision);
            if (decision.type === 'buyUpgrade') state = SimActions.buyUpgrade(state, decision);
            if (decision.type === 'launder') state = SimActions.launder(state, decision);
            // ... other actions
        }

        // Snapshot post-tick
        if (step < 50 || step % 100 === 0) {
            trace.push({
                step,
                clean: Math.floor(state.cleanCash),
                dirty: Math.floor(state.dirtyCash),
                deltaDirty: Math.floor(state.dirtyCash - preCash.dirty),
                action: actionLog,
                staff: { ...state.staff }
            });
        }
    }

    fs.writeFileSync('simulation_integrity_check.json', JSON.stringify(trace, null, 2));
    console.log("✅ Audit Log Saved: simulation_integrity_check.json");
};

runVerification();
