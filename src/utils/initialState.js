import { CONFIG, GAME_VERSION } from '../config/gameConfig';

export const getDefaultState = () => ({
    cleanCash: CONFIG.initialCash,
    dirtyCash: CONFIG.initialDirtyCash,
    diamonds: 0, // Premium Currency
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
    territoryAttacks: {}, // { territoryId: { startTime: number, strength: number } }
    payroll: { lastPaid: Date.now(), isStriking: false },
    crypto: { wallet: { bitcoin: 0, ethereum: 0, monero: 0 }, prices: { bitcoin: 45000, ethereum: 3000, monero: 150 }, history: { bitcoin: [], ethereum: [], monero: [] } },
    autoSell: {}, // Fixed: Missing key caused crash
    isSalesPaused: false, // Panic Button
    // Systems
    boss: {
        active: false,
        hp: 100,
        maxHp: 100,
        playerHp: 100,
        playerMaxHp: 100,
        enraged: false,
        lastDefeatedLevel: 0,
        attackDamage: 5,
        startTime: 0,
        lastAttackTime: 0
    },
    stats: {
        produced: Object.keys(CONFIG.production).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
        sold: 0,
        laundered: 0,
        runnerIncome: 0,
    },
    rival: {
        name: 'Alpha Syndikatet',
        hostility: 0,
        strength: 75,
        territories: [],
        eliminated: false
    },
    isProcessing: Object.keys(CONFIG.production).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
    logs: [],
    // Trends
    market: { trend: 'neutral', duration: 0, multiplier: 1.0 },
    modifiers: { heatMult: 1 },
    productionRates: {}, // { itemId: { produced: 0, sold: 0 } }
    activeBuffs: { hype: 0, intel: 0 }, // Timestamp for expiration
    lastTick: { clean: 0, dirty: 0 },
    lastSaveTime: 0, // 0 means fresh session, no offline calc
    bootShown: false, // Boot sequence shown flag
    welcomeShown: false,
    tutorialStep: 0,
    completedMissions: [],
    pendingEvent: null,
    hasSeenEndgameMsg: false,
    lifetime: {
        earnings: 0,
        laundered: 0,
        dirtyEarnings: 0,
        produced: Object.keys(CONFIG.production).reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
    },
    prestige: { level: 0, multiplier: 1, currency: 0, perks: {} },
    contracts: { active: null, lastCompleted: 0 },
    territoryLevels: {}, // Required for getIncomePerSec and upgrades
    hardcore: false,
    unlockedAchievements: [],
    version: GAME_VERSION,
    settings: {
        numberFormat: 'standard',
        particles: true,
        sound: true
    }
});

// Helper: Deep Merge for Save Migration
export const checkAndMigrateSave = (savedState) => {
    const fresh = getDefaultState();
    if (!savedState) return fresh;

    // Deep merge sensitive objects to ensure new keys in defaultState are present in savedState
    return {
        ...fresh,
        ...savedState,
        inv: { ...fresh.inv, ...(savedState.inv || {}) },
        staff: { ...fresh.staff, ...(savedState.staff || {}) },
        stats: { ...fresh.stats, ...(savedState.stats || {}) },
        upgrades: { ...fresh.upgrades, ...(savedState.upgrades || {}) },
        settings: { ...fresh.settings, ...(savedState.settings || {}) },
        defense: { ...fresh.defense, ...(savedState.defense || {}) },
        boss: { ...fresh.boss, ...(savedState.boss || {}) },
        rival: { ...fresh.rival, ...(savedState.rival || {}) },
        // Ensure new fields handled safely
        diamonds: Number(savedState.diamonds ?? fresh.diamonds) || 0,
        autoSell: savedState.autoSell || fresh.autoSell,
        prestige: { ...fresh.prestige, ...(savedState.prestige || {}) },
        crypto: {
            ...fresh.crypto,
            ...savedState.crypto,
            wallet: { ...fresh.crypto.wallet, ...(savedState.crypto?.wallet || {}) }
        }
    };
};
