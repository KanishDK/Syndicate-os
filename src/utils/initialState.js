import { CONFIG, GAME_VERSION } from '../config/gameConfig.js';

export const getDefaultState = () => ({
    cleanCash: CONFIG.initialCash,
    dirtyCash: CONFIG.initialDirtyCash,
    diamonds: 0, // Premium Currency
    debt: 0,
    xp: 0,
    level: 1,
    heat: 0,
    heatWarning70: false, // Heat warning system flags
    heatWarning90: false,
    isShaking: false,
    inv: Object.keys(CONFIG.production).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
    prices: Object.keys(CONFIG.production).reduce((acc, key) => ({ ...acc, [key]: CONFIG.production[key].baseRevenue || 0 }), {}),
    staff: Object.keys(CONFIG.staff).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
    staffHiredDates: {}, // Track hire dates for loyalty bonus { role: timestamp }
    upgrades: { ...Object.keys(CONFIG.upgrades).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}), warehouse: 1 },
    defense: Object.keys(CONFIG.defense).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
    territories: [],
    luxuryItems: [], // IDs of owned luxury items (Clean Cash Sinks)
    masteryPerks: {}, // { perkId: true } (Diamond Sinks)
    territoryAttacks: {}, // { territoryId: { startTime: number, strength: number } }
    payroll: { lastPaid: Date.now(), isStriking: false },
    crypto: { wallet: { bitcoin: 0, ethereum: 0, monero: 0 }, prices: { bitcoin: 45000, ethereum: 3000, monero: 150 }, history: { bitcoin: [], ethereum: [], monero: [] } },
    bank: { savings: 0, lastInterest: Date.now() },
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
        eliminated: false,
        lastRaidTime: 0 // For raid cooldown
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
    tutorialActive: CONFIG.tutorialActive, // Fix: Initialize from Config
    completedMissions: [],
    missionChoices: {}, // Tracks if a choice has been made for a mission
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
    territorySpecs: {}, // { territoryId: 'safe' | 'front' | 'storage' }
    hardcoreMode: CONFIG.hardcoreMode, // Fix: Initialize from Config
    unlockedAchievements: [],
    informantActive: false, // OMEGA Realism: The Mole
    hasReceivedMercy: false, // Beta Feedback: Bankruptcy Protection
    version: GAME_VERSION,
    settings: {
        numberFormat: 'standard',
        particles: true,
        sound: true
    }
});

// Helper: Sanitize Number (NaN/Infinity Protection)
const sanitize = (val, min = 0, fallback = 0) => {
    if (!Number.isFinite(val) || Number.isNaN(val)) return fallback;
    return Math.max(min, val);
};

// Helper: Deep Merge for Save Migration
export const checkAndMigrateSave = (savedState) => {
    const fresh = getDefaultState();
    if (!savedState) return fresh;

    // Deep merge sensitive objects to ensure new keys in defaultState are present in savedState
    return {
        ...fresh,
        ...savedState,
        // CRITICAL: Sanitize Core Numbers
        cleanCash: sanitize(savedState.cleanCash, -1e15, 5000),
        dirtyCash: sanitize(savedState.dirtyCash, -1e15, 0),
        debt: sanitize(savedState.debt, 0, 0),
        xp: sanitize(savedState.xp, 0, 0),
        level: sanitize(savedState.level, 1, 1),
        heat: sanitize(savedState.heat, 0, 0),

        inv: { ...fresh.inv, ...(savedState.inv || {}) },
        staff: { ...fresh.staff, ...(savedState.staff || {}) },
        stats: { ...fresh.stats, ...(savedState.stats || {}) },
        upgrades: { ...fresh.upgrades, ...(savedState.upgrades || {}) },
        settings: { ...fresh.settings, ...(savedState.settings || {}) },
        defense: { ...fresh.defense, ...(savedState.defense || {}) },
        boss: { ...fresh.boss, ...(savedState.boss || {}) },
        rival: { ...fresh.rival, ...(savedState.rival || {}) },
        // Ensure new fields handled safely
        diamonds: sanitize(savedState.diamonds, 0, 0),
        autoSell: savedState.autoSell || fresh.autoSell,
        prestige: { ...fresh.prestige, ...(savedState.prestige || {}) },
        crypto: {
            ...fresh.crypto,
            ...savedState.crypto,
            wallet: { ...fresh.crypto.wallet, ...(savedState.crypto?.wallet || {}) }
        },
        bank: { ...fresh.bank, ...(savedState.bank || {}) },
        luxuryItems: savedState.luxuryItems || fresh.luxuryItems,
        masteryPerks: { ...fresh.masteryPerks, ...(savedState.masteryPerks || {}) },
        // Fix: Ensure new flags are migrated if missing
        territorySpecs: { ...fresh.territorySpecs, ...(savedState.territorySpecs || {}) },
        tutorialActive: savedState.tutorialActive ?? fresh.tutorialActive,
        hardcoreMode: savedState.hardcoreMode ?? fresh.hardcoreMode
    };
};
