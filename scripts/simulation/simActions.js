
import { CONFIG } from '../../src/config/gameConfig.js';
import { getBulkCost, getMaxAffordable, getDistrictBonuses } from '../../src/utils/gameMath.js';

// Helper to log in simulation
const log = (state, msg, type = 'info') => {
    const entry = { msg, type, time: new Date().toLocaleTimeString() };
    return { ...state, logs: [entry, ...state.logs].slice(0, 50) };
};

export const SimActions = {
    // --- STAFF MANAGEMENT (Clean Cash) ---
    buyStaff: (state, { role, amount = 1 }) => {
        const item = CONFIG.staff[role];
        if (!item) return state;
        if (state.level < (item.reqLevel || 1)) return state;

        const currentCount = state.staff[role] || 0;
        let buyAmount = amount === 'max' ? getMaxAffordable(item.baseCost, item.costFactor, currentCount, state.cleanCash) : amount;
        if (buyAmount <= 0) buyAmount = 1; // Try 1

        const totalCost = getBulkCost(item.baseCost, item.costFactor, currentCount, buyAmount);

        if (state.cleanCash >= totalCost) {
            let newState = {
                ...state,
                cleanCash: state.cleanCash - totalCost,
                staff: { ...state.staff, [role]: currentCount + buyAmount },
                staffHiredDates: { ...state.staffHiredDates }
            };

            if (!newState.staffHiredDates[role]) {
                newState.staffHiredDates[role] = Date.now(); // Simulation-safe Date mock assumed
            }

            return log(newState, `Bought ${buyAmount} ${role}`, 'success');
        }
        return state;
    },

    // --- UPGRADES & DEFENSE (Clean Cash) ---
    buyUpgrade: (state, { id, amount = 1 }) => {
        const item = CONFIG.upgrades[id];
        if (!item) return state;

        const currentCount = state.upgrades[id] || 0;
        let buyAmount = amount === 'max' ? getMaxAffordable(item.baseCost, item.costFactor || 1.5, currentCount, state.cleanCash) : amount;
        if (buyAmount <= 0) buyAmount = 1;

        const totalCost = getBulkCost(item.baseCost, item.costFactor || 1.5, currentCount, buyAmount);

        if (state.cleanCash >= totalCost) {
            return log({
                ...state,
                cleanCash: state.cleanCash - totalCost,
                upgrades: { ...state.upgrades, [id]: currentCount + buyAmount }
            }, `Bought Upgrade ${id}`, 'success');
        }
        return state;
    },

    buyDefense: (state, { id }) => {
        const item = CONFIG.defense[id];
        if (!item) return state;

        // Defense is usually single purchase or countable? 
        // Logic in useManagement handles staff/upgrades. useDefense hook? No, likely handled in main state or manual purchase?
        // Checking Config: baseCost, costFactor. It behaves like upgrades.
        const currentCount = state.defense[id] || 0;
        const cost = Math.floor(item.baseCost * Math.pow(item.costFactor, currentCount));

        if (state.cleanCash >= cost) {
            return log({
                ...state,
                cleanCash: state.cleanCash - cost,
                defense: { ...state.defense, [id]: currentCount + 1 }
            }, `Bought Defense ${id}`, 'success');
        }
        return state;
    },

    // --- TERRITORIES (Dirty Cash) ---
    conquerTerritory: (state, { id }) => {
        if (state.territories.includes(id)) return state;
        const terr = CONFIG.territories.find(t => t.id === id);
        if (!terr) return state;
        if (state.level < (terr.reqLevel || 1)) return state;

        if (state.dirtyCash >= terr.baseCost) {
            return log({
                ...state,
                dirtyCash: state.dirtyCash - terr.baseCost,
                territories: [...state.territories, id],
                territoryLevels: { ...state.territoryLevels, [id]: 1 },
                xp: state.xp + 250
            }, `Conquered ${terr.name}`, 'success');
        }
        return state;
    },

    upgradeTerritory: (state, { id }) => {
        if (!state.territories.includes(id)) return state;
        const terr = CONFIG.territories.find(t => t.id === id);
        const currentLvl = state.territoryLevels[id] || 1;
        // Logic from useNetwork: getBulkCost(base, 1.8, lvl, 1)
        // AND it costs DIRTY CASH (confirmed in useNetwork.js:63)

        const cost = getBulkCost(terr.baseCost, 1.8, currentLvl, 1);

        if (state.dirtyCash >= cost) {
            return log({
                ...state,
                dirtyCash: state.dirtyCash - cost,
                territoryLevels: { ...state.territoryLevels, [id]: currentLvl + 1 }
            }, `Upgraded Territory ${id}`, 'success');
        }
        return state;
    },

    // --- LUXURY (Clean Cash) ---
    purchaseLuxury: (state, { id }) => {
        const item = CONFIG.luxuryItems.find(i => i.id === id);
        if (!item) return state;
        if (state.luxuryItems?.includes(id)) return state;

        if (state.cleanCash >= item.cost) {
            return log({
                ...state,
                cleanCash: state.cleanCash - item.cost,
                luxuryItems: [...(state.luxuryItems || []), id],
                // Buffs handled in gameTick
            }, `Purchased Luxury ${item.name}`, 'success');
        }
        return state;
    },

    // --- MISSIONS & EVENTS ---
    handleMissionChoice: (state, { missionId, choiceIndex }) => {
        // Find active mission choice prompt? Or is it persistent options?
        // Mission config has 'choices'.
        // useGameActions: handleMissionChoice(id, choice)
        // Usually triggered by UI.
        const mission = CONFIG.missions.find(m => m.id === missionId);
        if (!mission || !mission.choices || !mission.choices[choiceIndex]) return state;

        if (state.missionChoices && state.missionChoices[missionId]) return state; // Already chosen

        const choice = mission.choices[choiceIndex];
        const ef = choice.effect;
        const cost = (ef.money && ef.money < 0) ? Math.abs(ef.money) : 0;

        if (cost > 0 && state.cleanCash < cost) return state;

        // Apply Effect
        let newState = {
            ...state,
            missionChoices: { ...state.missionChoices, [missionId]: true }
        };

        if (cost > 0) newState.cleanCash -= cost;

        if (ef.chance) {
            // Sim Determinism: Assume Success for simplicity? Or random?
            // Random is better for sim accuracy.
            if (Math.random() < ef.chance) {
                if (ef.success?.money) newState.cleanCash += ef.success.money;
            } else {
                if (ef.fail?.heat) newState.heat += ef.fail.heat;
            }
        } else {
            if (ef.money && ef.money > 0) newState.cleanCash += ef.money;
            if (ef.heat) newState.heat += ef.heat;
            if (ef.rival) newState.rival = { ...newState.rival, hostility: (newState.rival?.hostility || 0) + ef.rival };
        }

        return log(newState, `Mission Choice: ${mission.title}`, 'info');
    },

    // --- PRESTIGE & PERKS ---
    doPrestige: (state) => {
        if (state.level < 30) return state; // Hard floor for sim

        // Calculate Multiplier (Simplified Logic from useGameActions)
        const newMult = (state.prestige?.multiplier || 1) + 0.5; // +50% per reset
        const gems = 50; // Flat reward

        // Reset State but keep Perks/Diamonds/Premium
        return log({
            ...state,
            cleanCash: CONFIG.initialCash,
            dirtyCash: 0,
            level: 1,
            xp: 0,
            staff: {}, // Wiped
            upgrades: {},
            territories: [],
            territoryLevels: {},
            prestige: {
                ...state.prestige,
                count: (state.prestige?.count || 0) + 1,
                multiplier: newMult,
                diamonds: (state.prestige?.diamonds || 0) + gems
            },
            // Keep stats
        }, `PRESTIGE RESET! Mult: ${newMult}x`, 'success');
    },

    buyPerk: (state, { id }) => {
        const perk = CONFIG.perks[id];
        if (!perk) return state;
        const currentLvl = state.prestige?.perks?.[id] || 0;
        if (currentLvl >= perk.maxLevel) return state;

        // Cost logic (Diamonds)
        const cost = Math.floor(perk.baseCost * Math.pow(perk.costScale, currentLvl));
        if ((state.prestige?.diamonds || 0) >= cost) {
            return log({
                ...state,
                prestige: {
                    ...state.prestige,
                    diamonds: state.prestige.diamonds - cost,
                    perks: { ...state.prestige.perks, [id]: currentLvl + 1 }
                }
            }, `Bought Perk ${id} Lvl ${currentLvl + 1}`, 'success');
        }
        return state;
    },

    buyMasteryPerk: (state, { id }) => {
        const perk = CONFIG.masteryPerks[id];
        if (!perk || state.masteryPerks?.[id]) return state;

        if ((state.prestige?.diamonds || 0) >= perk.cost) {
            return log({
                ...state,
                prestige: {
                    ...state.prestige,
                    diamonds: state.prestige.diamonds - perk.cost
                },
                masteryPerks: { ...state.masteryPerks, [id]: true }
            }, `Bought Mastery ${id}`, 'success');
        }
        return state;
    },

    // --- CRYPTO & FINANCE ---
    buyCrypto: (state, { coinId, amount }) => {
        // Simplified: use basePrice or price found in state (if sim supports volatility)
        const price = state.crypto?.prices?.[coinId] || CONFIG.crypto.coins[coinId].basePrice;
        const total = price * amount;

        if (state.cleanCash >= total) {
            return log({
                ...state,
                cleanCash: state.cleanCash - total,
                crypto: {
                    ...state.crypto,
                    wallet: { ...state.crypto?.wallet, [coinId]: (state.crypto?.wallet?.[coinId] || 0) + amount }
                }
            }, `Bought ${amount} ${coinId}`, 'info');
        }
        return state;
    },

    sellCrypto: (state, { coinId, amount }) => { // amount = 'all' supported
        const walletAmt = state.crypto?.wallet?.[coinId] || 0;
        let sellAmt = amount === 'all' ? walletAmt : amount;
        if (sellAmt > walletAmt) sellAmt = walletAmt;
        if (sellAmt <= 0) return state;

        const price = state.crypto?.prices?.[coinId] || CONFIG.crypto.coins[coinId].basePrice;
        const total = price * sellAmt;

        return log({
            ...state,
            cleanCash: state.cleanCash + total,
            crypto: {
                ...state.crypto,
                wallet: { ...state.crypto.wallet, [coinId]: walletAmt - sellAmt }
            }
        }, `Sold ${sellAmt} ${coinId}`, 'success');
    },

    borrow: (state, { amount }) => {
        // Max Debt Check? For sim, just let them dig a hole.
        return log({
            ...state,
            cleanCash: state.cleanCash + amount,
            debt: (state.debt || 0) + amount
        }, `Borrowed ${amount}`, 'warning');
    },

    repay: (state, { amount }) => {
        if (state.debt <= 0) return state;
        let pay = Math.min(amount, state.debt);
        if (state.cleanCash >= pay) {
            return log({
                ...state,
                cleanCash: state.cleanCash - pay,
                debt: state.debt - pay
            }, `Repaid ${pay}`, 'success');
        }
        return state;
    },

    // --- DIAMONDS (PREMIUM) ---
    buyDiamondPack: (state) => {
        // Simulates buying diamonds with "Real Money" (or Clean Cash if we mock In-App Purchase logic as cash sink)
        // For Simulator, assume they spend Clean Cash to get it?? No, that's P2W. 
        // Let's assume this action awards diamonds from ACHIEVEMENTS effectively.
        // Actually, let's make it a cheat/debug action or "Event Reward".
        // Or "Convert Cash to Diamonds" (Custom Sim Logic).
        // implementation: Costs 1M Clean Cash -> 10 Diamonds (Sim Rule)
        return log({
            ...state,
            cleanCash: state.cleanCash - 1000000,
            prestige: { ...state.prestige, diamonds: (state.prestige?.diamonds || 0) + 10 }
        }, `Bought Diamond Pack (10)`, 'success');
    },

    // NEW ACTIONS for Comprehensive Report
    completeTutorial: (state) => {
        return log({ ...state, flags: { ...state.flags, tutorialComplete: true } }, "Completed Tutorial", 'info');
    },
    readManual: (state) => {
        return log({ ...state, flags: { ...state.flags, readManual: true } }, "Read Help Manual", 'info');
    },
    claimDaily: (state) => {
        return log({
            ...state,
            flags: { ...state.flags, dailyClaimed: true },
            prestige: { ...state.prestige, diamonds: (state.prestige?.diamonds || 0) + 5 }
        }, "Claimed Daily Reward", 'success');
    },

    // --- UTILS ---
    bribePolice: (state) => {
        const bonuses = getDistrictBonuses(state);
        const cost = CONFIG.police.bribeCost * (bonuses.bribeMult || 1);
        const fee = cost * 0.1;

        if (state.dirtyCash >= cost && state.cleanCash >= fee && state.heat > 0) {
            return log({
                ...state,
                dirtyCash: state.dirtyCash - cost,
                cleanCash: state.cleanCash - fee,
                heat: Math.max(0, state.heat - 25)
            }, 'Bribed Police', 'success');
        }
        return state;
    },

    launder: (state, { amount }) => {
        if (state.dirtyCash < amount) amount = state.dirtyCash;
        if (amount <= 0) return state;

        const rate = CONFIG.launderingRate || 0.7;
        const cleaned = amount * rate;

        return log({
            ...state,
            dirtyCash: state.dirtyCash - amount,
            cleanCash: state.cleanCash + cleaned,
            stats: {
                ...state.stats,
                laundered: (state.stats.laundered || 0) + amount
            }
        }, `Laundered ${amount}`, 'info');
    }
};
