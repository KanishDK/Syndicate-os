// Debug test to see what's happening

import { CONFIG } from './src/config/gameConfig.js';
import { getDefaultState } from './src/utils/initialState.js';
import { runGameTick } from './src/features/engine/gameTick.js';

const t = (key) => key;

const state = getDefaultState();
state.territories = ['christiania']; // Add Christiania (25K/hr income)

console.log('=== BEFORE ===');
console.log('Clean Cash:', state.cleanCash, 'kr');
console.log('Territories:', state.territories);
console.log('Payroll striking?:', state.payroll?.isStriking);

// Run for 1 hour (dt = 3600 seconds)
const newState = runGameTick(state, 3600, t);

console.log('\n=== AFTER ===');
console.log('Clean Cash:', newState.cleanCash, 'kr');
console.log('Income gained:', newState.cleanCash - state.cleanCash, 'kr');
console.log('Expected: 25,000 kr');
console.log('lastTick.clean:', newState.lastTick?.clean || 0, 'kr');
