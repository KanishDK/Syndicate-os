// Quick test to verify territory income is working

import { CONFIG } from './src/config/gameConfig.js';
import { getDefaultState } from './src/utils/initialState.js';
import { processEconomy } from './src/features/engine/economy.js';

const state = getDefaultState();
state.territories = ['christiania']; // Add Christiania (25K/hr income)

console.log('Before:', state.cleanCash, 'kr');
console.log('Territory:', 'christiania', '- Expected income: 25,000 kr/hr');

// Run for 1 hour (dt = 3600 seconds)
const newState = processEconomy(state, 3600);

console.log('After 1 hour:', newState.cleanCash, 'kr');
console.log('Income gained:', newState.cleanCash - state.cleanCash, 'kr');
console.log('Expected: 25,000 kr');
console.log('Match:', (newState.cleanCash - state.cleanCash) === 25000 ? 'YES ✅' : 'NO ❌');
