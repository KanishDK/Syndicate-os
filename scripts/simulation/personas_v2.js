import { CONFIG } from '../../src/config/gameConfig.js';

// Helper: Target specific mission requirements
const resolveMission = (state, mission) => {
    if (!mission) return null;
    const req = mission.req;

    // 1. Production Missions
    if (req.type === 'produce') {
        const staffMap = {
            'hash': 'junkie', 'studie_speed': 'junkie',
            'skunk': 'grower',
            'amfetamin': 'chemist', 'mdma': 'chemist', 'ketamin': 'chemist',
            'kokain': 'importer', 'benzos': 'trafficker',
            'fentanyl': 'labtech'
        };
        const role = staffMap[req.item];
        if (role && (state.staff[role] || 0) < 1) {
            const cost = CONFIG.staff[role].baseCost;
            if (state.cleanCash < cost) {
                if (state.dirtyCash > cost) return { type: 'launder', amount: cost * 1.5 };
                return null;
            }
            return { type: 'buyStaff', role, amount: 1 };
        }
    }

    // 2. Hire Missions
    if (req.type === 'hire') {
        if ((state.staff[req.role] || 0) < req.amount) {
            const cost = CONFIG.staff[req.role].baseCost;
            if (state.cleanCash < cost) {
                if (state.dirtyCash > cost) return { type: 'launder', amount: cost * 1.5 };
                return null;
            }
            return { type: 'buyStaff', role: req.role, amount: 1 };
        }
    }

    // 3. Upgrade Missions (Warehouse, Studio)
    if (req.type === 'upgrade') {
        if ((state.upgrades[req.id] || 0) < req.amount) {
            const cost = CONFIG.upgrades[req.id].baseCost;
            if (state.cleanCash < cost) {
                if (state.dirtyCash > cost) return { type: 'launder', amount: cost * 1.5 };
                return null;
            }
            return { type: 'buyUpgrade', id: req.id };
        }
    }

    // 4. Conquer Missions (Dirty Cash)
    if (req.type === 'conquer') {
        const currentCount = state.territories.length;
        if (currentCount < req.amount) {
            const allTerr = ['christiania', 'nordvest', 'vesterbro', 'nørrebro', 'frederiksberg', 'city', 'vestegnen', 'glostrup', 'ishøj', 'hellerup'];
            const nextT = allTerr.find(t => !state.territories.includes(t));
            if (nextT) {
                return { type: 'conquerTerritory', id: nextT };
            }
        }
    }

    // 5. Launder Missions
    if (req.type === 'launder') {
        if (state.dirtyCash > 100) return { type: 'launder', amount: state.dirtyCash };
    }

    // 6. Defense Missions
    if (req.type === 'defense') {
        if ((state.defense[req.id] || 0) < req.amount) {
            const cost = CONFIG.defense[req.id].baseCost;
            if (state.cleanCash < cost) {
                if (state.dirtyCash > cost) return { type: 'launder', amount: cost * 1.5 };
                return null;
            }
            return { type: 'buyDefense', id: req.id };
        }
    }

    // 7. Sell Missions (Handled by Pushers - Clean Cash)
    if (req.type === 'sell') {
        if ((state.staff.pusher || 0) < 5) {
            const cost = CONFIG.staff.pusher.baseCost;
            if (state.cleanCash < cost) {
                if (state.dirtyCash > cost) return { type: 'launder', amount: cost * 1.5 };
                return null;
            }
            return { type: 'buyStaff', role: 'pusher', amount: 1 };
        }
    }

    return null;
};

export const PersonasV2 = {
    // 1. COMPLETIONIST (The Star of this test)
    pro_completionist: {
        name: "100Percent",
        role: "Pro Tycoon (Completionist)",
        decide: (state, history) => {
            // 0. Prestige Check (Deep Run)
            // DELAYED TO 25 to ensure Luxury/Crypto/Territory testing occurs first
            if (state.level >= 25) return { type: 'doPrestige' };

            // 1. CRITICAL SURVIVAL
            if (state.heat > 30 && state.dirtyCash > 16000) return { type: 'bribePolice' };

            // 2. MISSION TARGETING
            const storyAction = resolveMission(state, state.activeStory);
            if (storyAction) return storyAction;

            const dailyAction = resolveMission(state, state.contracts?.active);
            if (dailyAction) return dailyAction;

            // 3. MAINTENANCE (High Threshold to Start Saving)
            if (state.dirtyCash > 5000000) return { type: 'launder', amount: state.dirtyCash };

            // 4. WEALTH & COMPLETION (Feature Audit)
            // A) Luxury Items (High Priority)
            const allLux = CONFIG.luxuryItems || [];
            const missingLux = allLux.find(l => !state.luxuryItems?.includes(l.id));
            if (missingLux && state.cleanCash > missingLux.cost * 1.2) {
                return { type: 'purchaseLuxury', id: missingLux.id };
            }

            // B) Territory Expansion & Upgrades
            const allTerr = ['christiania', 'nordvest', 'vesterbro', 'nørrebro', 'frederiksberg', 'city', 'vestegnen', 'glostrup', 'ishøj', 'hellerup'];
            const nextT = allTerr.find(t => !state.territories.includes(t));
            if (nextT && state.dirtyCash > 50000) return { type: 'conquerTerritory', id: nextT };

            // Upgrade owned territories
            const upgradeable = state.territories.find(t => (state.territoryLevels[t] || 1) < 5);
            if (upgradeable && state.dirtyCash > 100000) {
                return { type: 'upgradeTerritory', id: upgradeable };
            }

            // C) CRYPTO DUMP (Moved BEFORE Growth)
            // Buy up to 10 BTC
            if (state.cleanCash > 1000000 && (!state.crypto?.wallet?.bitcoin || state.crypto.wallet.bitcoin < 10)) {
                return { type: 'buyCrypto', coinId: 'bitcoin', amount: 1 };
            }

            // 5. GROWTH
            if (state.cleanCash > 5000 && (state.staff.junkie || 0) < 10) return { type: 'buyStaff', role: 'junkie', amount: 1 };
            if (state.cleanCash > 5000 && (state.staff.pusher || 0) < 5) return { type: 'buyStaff', role: 'pusher', amount: 1 };
            if (state.cleanCash > 20000 && !state.staff.grower) return { type: 'buyStaff', role: 'grower', amount: 1 };
            if (state.cleanCash > 50000 && !state.staff.chemist) return { type: 'buyStaff', role: 'chemist', amount: 1 };

            return null;
        }
    },

    // 2. BALANCE DEV
    dev_balance: {
        name: "Sarah",
        role: "Balance Dev",
        decide: (state, history) => {
            const missionAction = resolveMission(state, state.activeStory);
            if (missionAction && Math.random() < 0.8) return missionAction;

            if (state.heat > 30 && state.dirtyCash > 16000) return { type: 'bribePolice' };
            if (state.dirtyCash > 2000) return { type: 'launder', amount: state.dirtyCash };

            // Feature: Borrowing
            if (state.cleanCash < 1000 && (state.debt || 0) < 5000) return { type: 'borrow', amount: 5000 };

            if (state.cleanCash > 2000 && (state.staff.junkie || 0) < 5) return { type: 'buyStaff', role: 'junkie', amount: 1 };
            return null;
        }
    },

    // 3. EFFICIENCY (Prestige Rush)
    pro_efficiency: {
        name: "GrindLord",
        role: "Pro Tycoon (Efficiency)",
        decide: (state, history) => {
            // Feature: Buy Diamonds BEFORE Prestige (Priority 0)
            // If we have excess cash, buy diamonds (Limit to > 6M so we still have 5M for Prestige)
            if (state.cleanCash > 6000000) return { type: 'buyDiamondPack' };

            // Prestige Trigger (PRIORITY 1)
            if (state.level >= 12 && state.cleanCash >= 5000000) return { type: 'doPrestige' };

            const missionAction = resolveMission(state, state.activeStory);
            if (missionAction) return missionAction;

            if (state.heat > 40 && state.dirtyCash > 16000) return { type: 'bribePolice' };
            if (state.dirtyCash > 50000) return { type: 'launder', amount: state.dirtyCash };

            return null;
        }
    },

    // 4. TECH DEV
    dev_tech: {
        name: "Alex",
        role: "Technical Dev",
        decide: (state) => {
            if (Math.random() < 0.1) return resolveMission(state, state.activeStory);
            return null;
        }
    }
};
