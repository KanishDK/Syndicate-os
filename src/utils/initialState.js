import { CONFIG, GAME_VERSION } from '../config/gameConfig';

export const defaultState = {
    cleanCash: CONFIG.initialCash,
    dirtyCash: CONFIG.initialDirtyCash,
    debt: 0,
    xp: 0,
    level: 1,
    heat: 0,
    inv: Object.keys(CONFIG.production).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
    prices: Object.keys(CONFIG.production).reduce((acc, key) => ({ ...acc, [key]: CONFIG.production[key].baseRevenue || 0 }), {}),
    staff: { grower: 0, chemist: 0, importer: 0, labtech: 0, junkie: 0, pusher: 0, distributor: 0, trafficker: 0, lawyer: 0, accountant: 0 },
    upgrades: { warehouse: 1, hydro: 0, lab: 0, studio: 0, network: 0 },
    defense: { guards: 0, cameras: 0, bunker: 0 },
    territories: [],
    payroll: { lastPaid: Date.now(), isStriking: false },
    crypto: { wallet: { bitcoin: 0, ethereum: 0, monero: 0 }, prices: { bitcoin: 45000, ethereum: 3000, monero: 150 } },
    ownedItems: [],
    autoSell: {}, // Fixed: Missing key caused crash
    // Systems
    boss: { active: false, hp: 100, maxHp: 100, enraged: false },
    stats: {
        produced: Object.keys(CONFIG.production).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
        sold: 0,
        laundered: 0,
        runnerIncome: 0,
    },
    rival: {
        hostility: 0,
        strength: 75,
        territories: [],
        eliminated: false
    },
    missionIndex: 0,
    isProcessing: Object.keys(CONFIG.production).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
    logs: [],
    lastSaveTime: Date.now(), // For offline calc
    tutorialStep: 0, // 0: Welcome, 1: Produce, 2: Sell, 3: Finance, 4: Complete
    completedMissions: [], // IDs of completed missions
    pendingEvent: null, // { type: 'raid'|'story', data: ... } - For syncing UI
    hasSeenEndgameMsg: false, // Endgame trigger
    lifetime: {
        earnings: 0,
        produced: Object.keys(CONFIG.production).reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
    },
    prestige: { level: 0, multiplier: 1, currency: 0 },
    dailyMission: null, // Endgame content
    version: GAME_VERSION
};
