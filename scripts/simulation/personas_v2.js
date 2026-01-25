import { CONFIG } from '../../src/config/gameConfig.js';

// Helper: Target specific mission requirements
const resolveMission = (state, mission) => {
    if (!mission) return null;
    const req = mission.req;

    // 1. Production Missions
    if (req.type === 'produce') {
        // Ensure we have the staff
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
                // Need Clean Cash -> Launder!
                if (state.dirtyCash > cost) return { type: 'launder', amount: cost * 1.5 }; // Launder enough to buy
                return null; // Wait for dirty cash to accumulate
            }
            return { type: 'buyStaff', role, amount: 1 };
        }
        // If we have staff, we just wait (Sim produces automatically)
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
            // Find cheapest available
            const allTerr = ['christiania', 'nordvest', 'vesterbro', 'nørrebro', 'frederiksberg', 'city', 'vestegnen', 'glostrup', 'ishøj', 'hellerup'];
            const nextT = allTerr.find(t => !state.territories.includes(t));
            if (nextT) {
                // It costs Dirty Cash. If we don't have it, we just WAIT (Sim sells automatically)
                // Do NOT launder if we need to conquer.
                return { type: 'conquerTerritory', id: nextT };
            }
        }
    }

    // 5. Launder Missions
    if (req.type === 'launder') {
        if (state.dirtyCash > 100) return { type: 'launder', amount: state.dirtyCash };
        // If mission needs laundering but we have no dirty cash, we must wait for sales.
        // We implicitly wait.
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
            // 1. CRITICAL SURVIVAL (Bribes Only)
            if (state.heat > 30 && state.dirtyCash > 16000) return { type: 'bribePolice' };

            // 2. MISSION TARGETING (The Goal)
            // Check active story mission
            const storyAction = resolveMission(state, state.activeStory);
            if (storyAction) return storyAction; // This will return 'conquer' even if poor, blocking laundering

            // Check Daily
            const dailyAction = resolveMission(state, state.contracts?.active);
            if (dailyAction) return dailyAction;

            // 3. MAINTENANCE (Launder if NOT saving for a dirty cash mission)
            // If we are here, no active mission requires us to HOLD dirty cash (except Conquer, which is handled above).
            // But wait, if Mission is 'Produce', we might need to buy staff with Clean Cash.
            // So we SHOULD launder to get Clean Cash.
            if (state.dirtyCash > 5000) return { type: 'launder', amount: state.dirtyCash };

            // 4. GROWTH (If blocked on cash for mission)
            if (state.cleanCash > 5000 && (state.staff.junkie || 0) < 10) return { type: 'buyStaff', role: 'junkie', amount: 1 };
            if (state.cleanCash > 5000 && (state.staff.pusher || 0) < 5) return { type: 'buyStaff', role: 'pusher', amount: 1 };
            if (state.cleanCash > 20000 && !state.staff.grower) return { type: 'buyStaff', role: 'grower', amount: 1 };
            if (state.cleanCash > 50000 && !state.staff.chemist) return { type: 'buyStaff', role: 'chemist', amount: 1 };

            // Focus on Territories (If no mission active, but we want to expand)
            // Priority: Expansion
            const unownedTerritory = ['christiania', 'nørrebro', 'nordvest'].find(t => !state.territories.includes(t));
            if (unownedTerritory) return { type: 'conquerTerritory', id: unownedTerritory };

            // Completionist avoids prestige until lvl 20 (Deep Run)
            if (state.level >= 20) return { type: 'doPrestige' };

            return null;
        }
    },

    // 2. BALANCE DEV (Baseline Check)
    dev_balance: {
        name: "Sarah",
        role: "Balance Dev",
        decide: (state, history) => {
            // Priority: Missions
            const missionAction = resolveMission(state, state.activeStory);
            if (missionAction && Math.random() < 0.8) return missionAction; // 80% focus

            // Survival
            if (state.heat > 30 && state.dirtyCash > 16000) return { type: 'bribePolice' };
            if (state.dirtyCash > 2000) return { type: 'launder', amount: state.dirtyCash };

            // Standard Growth
            if (state.cleanCash > 2000 && (state.staff.junkie || 0) < 5) return { type: 'buyStaff', role: 'junkie', amount: 1 };

            return null;
        }
    },

    // 3. EFFICIENCY (Prestige Rush - might ignore some missions)
    pro_efficiency: {
        name: "GrindLord",
        role: "Pro Tycoon (Efficiency)",
        decide: (state, history) => {
            // Ignore missions if they slow down prestige? No, missions give XP.
            const missionAction = resolveMission(state, state.activeStory);
            if (missionAction) return missionAction;

            if (state.heat > 40 && state.dirtyCash > 16000) return { type: 'bribePolice' };
            if (state.dirtyCash > 50000) return { type: 'launder', amount: state.dirtyCash };

            // Prestige Trigger
            if (state.level >= 12 && state.cleanCash >= 5000000) return { type: 'doPrestige' };

            return null;
        }
    },

    // 4. TECH DEV (Random)
    dev_tech: {
        name: "Alex",
        role: "Technical Dev",
        decide: (state) => {
            if (Math.random() < 0.1) return resolveMission(state, state.activeStory);
            return null;
        }
    }
};
