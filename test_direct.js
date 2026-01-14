// Direct test of territory income

import { CONFIG } from './src/config/gameConfig.js';
import { getDefaultState } from './src/utils/initialState.js';
import { processEconomy } from './src/features/engine/economy.js';

const state = getDefaultState();
state.territories = ['christiania'];

console.log('Territory: Christiania');
console.log('Expected income per hour:', CONFIG.territories.find(t => t.id === 'christiania').income, 'kr');
console.log('\nBefore processEconomy:');
console.log('  cleanCash:', state.cleanCash);
console.log('  dirtyCash:', state.dirtyCash);

const newState = processEconomy(state, 3600); // 1 hour = 3600 seconds

console.log('\nAfter processEconomy (dt=3600):');
console.log('  cleanCash:', newState.cleanCash);
console.log('  dirtyCash:', newState.dirtyCash);
console.log('  Income gained:', (newState.cleanCash + newState.dirtyCash) - (state.cleanCash + state.dirtyCash), 'kr');
console.log('\nExpected: 25,000 kr');
console.log('Match:', (newState.dirtyCash - state.dirtyCash) === 25000 ? 'YES ✅' : 'NO ❌');
