/**
 * AutoPilot v6.0 - Fully Autonomous AI Player
 * 
 * Capabilities:
 * - Complete tutorial automatically
 * - Handle ALL modals and popups
 * - Participate in boss fights
 * - Complete missions, dailies, achievements
 * - Manage crypto, loans, defense, rivals
 * - Acquire all territories and districts
 * - Reach prestige and continue
 * - Play autonomously for 8+ hours
 * 
 * Usage: autoPilot.toggle()
 */

export class AutoPilot {
    constructor() {
        this.isRunning = false;
        this.tickInterval = null;
        this.speed = 10000; // 10 seconds between decisions

        // Bug Detection
        this.bugs = [];
        this.warnings = [];
        this.actionLog = [];
        this.startTime = null;
        this.actionsPerformed = 0;

        // Game Stall Detection
        this.lastTickTime = Date.now();
        this.tickWatchdog = null;

        // State tracking
        this.lastState = null;
        this.currentTab = 'production';

        // Startup sequence tracking
        this.manualSummarized = false;
        this.startupComplete = false;

        // Progress tracking
        this.missionsCompleted = 0;
        this.territoriesOwned = 0;
        this.upgradesPurchased = 0;
        this.bossesDefeated = 0;
        this.prestigeCount = 0;

        // Stall detection for handbook consultation
        this.lastProgressCheck = {
            level: 0,
            cash: 0,
            missions: 0,
            timestamp: Date.now()
        };
        this.stallCount = 0;
        this.handbookConsulted = false;

        console.log('🤖 AutoPilot v6.0 initialized (Fully Autonomous AI)');
    }

    /**
     * Get game context
     */
    getGameContext() {
        const state = window.__GAME_STATE__;
        const setState = window.__GAME_SET_STATE__;
        const setActiveTab = window.__SET_ACTIVE_TAB__;
        const SimActions = window.__SIM_ACTIONS__;
        const CONFIG = window.__GAME_CONFIG__;
        const dispatch = window.__GAME_DISPATCH__;
        const actions = window.__GAME_ACTIONS__;

        if (!state || !setState || !SimActions || !CONFIG) {
            this.logBug('CRITICAL', 'Cannot access game context');
            return null;
        }

        return { state, setState, setActiveTab, SimActions, CONFIG, dispatch, actions };
    }

    /**
     * PHASE 1: Modal Handling - Auto-dismiss all modals except boss fights
     */
    handleModals(state, dispatch) {
        if (!state.pendingEvent) return false;

        const event = state.pendingEvent;

        // Don't dismiss boss spawn events - we want to fight them
        if (event.type === 'boss') {
            return false; // Let boss fight logic handle it
        }

        // Auto-dismiss all other modals
        if (dispatch) {
            dispatch({ type: 'CLEAR_PENDING_EVENT' });
            this.log(`📋 Auto-dismissed ${event.type} modal: ${event.data?.title || 'Unknown'}`);
            return true;
        }

        return false;
    }

    /**
     * Validate state for bugs
     */
    validateState(state) {
        if (!state) {
            this.logBug('CRITICAL', 'State is null');
            return false;
        }

        if (isNaN(state.cleanCash)) this.logBug('CRITICAL', 'cleanCash is NaN');
        if (isNaN(state.dirtyCash)) this.logBug('CRITICAL', 'dirtyCash is NaN');
        if (isNaN(state.heat)) this.logBug('CRITICAL', 'heat is NaN');

        if (state.cleanCash < 0 && !state.sultanMercy) {
            this.logBug('CRITICAL', `Negative cleanCash: ${state.cleanCash}`);
        }

        return true;
    }

    /**
     * Get current active mission
     */
    getCurrentMission(state, CONFIG) {
        const missions = CONFIG.missions;
        const completed = state.completedMissions || [];

        for (let mission of missions) {
            if (completed.includes(mission.id)) continue;
            if (mission.reqLevel && state.level < mission.reqLevel) continue;
            return mission;
        }

        return null;
    }

    /**
     * Check mission progress
     */
    checkMissionProgress(state, mission) {
        if (!mission) return { complete: false, progress: 0, total: 0 };

        const req = mission.req;

        switch (req.type) {
            case 'produce':
                const produced = state.stats?.produced?.[req.item] || 0;
                return { complete: produced >= req.amount, progress: produced, total: req.amount };

            case 'sell':
                const sold = state.stats?.sold || 0;
                return { complete: sold >= req.amount, progress: sold, total: req.amount };

            case 'launder':
                const laundered = state.stats?.laundered || 0;
                return { complete: laundered >= req.amount, progress: laundered, total: req.amount };

            case 'hire':
                const hired = state.staff?.[req.role] || 0;
                return { complete: hired >= req.amount, progress: hired, total: req.amount };

            case 'conquer':
                const territories = Object.keys(state.territories || {}).filter(k => state.territories[k]?.owned).length;
                return { complete: territories >= req.amount, progress: territories, total: req.amount };

            case 'upgrade':
                const hasUpgrade = state.upgrades?.[req.id] || false;
                return { complete: hasUpgrade, progress: hasUpgrade ? 1 : 0, total: 1 };

            case 'defense':
                const defenseCount = state.defense?.[req.id] || 0;
                return { complete: defenseCount >= req.amount, progress: defenseCount, total: req.amount };

            default:
                return { complete: false, progress: 0, total: 0 };
        }
    }

    /**
     * Get action to complete current mission
     */
    getMissionAction(state, mission, SimActions, setState) {
        if (!mission) return null;

        const progress = this.checkMissionProgress(state, mission);
        if (progress.complete) return null;

        const req = mission.req;

        switch (req.type) {
            case 'produce':
                const hasProducers = this.hasProducersForItem(state, req.item);
                if (!hasProducers) {
                    const producer = this.getProducerForItem(req.item);
                    if (producer) {
                        const cost = this.calculateStaffCost(producer, state);
                        if (cost && state.cleanCash >= cost) {
                            return {
                                type: 'HIRE_STAFF',
                                tab: 'management',
                                action: () => setState(s => SimActions.buyStaff(s, { role: producer, amount: 1 })),
                                reason: `Mission: Hire ${producer} for ${req.item} production`
                            };
                        }
                    }
                }
                return null;

            case 'hire':
                const cost = this.calculateStaffCost(req.role, state);
                if (cost && state.cleanCash >= cost) {
                    return {
                        type: 'HIRE_STAFF',
                        tab: 'management',
                        action: () => setState(s => SimActions.buyStaff(s, { role: req.role, amount: 1 })),
                        reason: `Mission: Hire ${req.role} (${progress.progress}/${progress.total})`
                    };
                }
                break;

            case 'upgrade':
                const upgrade = window.__GAME_CONFIG__.upgrades[req.id];
                if (upgrade && state.cleanCash >= upgrade.baseCost) {
                    return {
                        type: 'BUY_UPGRADE',
                        tab: 'management',
                        action: () => setState(s => SimActions.buyUpgrade(s, { id: req.id })),
                        reason: `Mission: Buy ${req.id} upgrade`
                    };
                }
                break;

            case 'conquer':
                const territory = this.getBestTerritory(state);
                if (territory && state.cleanCash >= territory.cost) {
                    return {
                        type: 'BUY_TERRITORY',
                        tab: 'network',
                        action: () => setState(s => SimActions.buyTerritory(s, { id: territory.id })),
                        reason: `Mission: Buy territory ${territory.id} (${progress.progress}/${progress.total})`
                    };
                }
                break;

            case 'defense':
                const defense = window.__GAME_CONFIG__.defense[req.id];
                const currentDefense = state.defense?.[req.id] || 0;
                const defenseCost = defense.baseCost * Math.pow(defense.costFactor || 1.4, currentDefense);
                if (state.cleanCash >= defenseCost) {
                    return {
                        type: 'BUY_DEFENSE',
                        tab: 'rivals',
                        action: () => setState(s => SimActions.buyDefense(s, { id: req.id, amount: 1 })),
                        reason: `Mission: Buy ${req.id} (${progress.progress}/${progress.total})`
                    };
                }
                break;
        }

        return null;
    }

    /**
     * Get best territory to purchase (prioritize district completion)
     */
    getBestTerritory(state) {
        const CONFIG = window.__GAME_CONFIG__;
        const territories = CONFIG.territories;
        const owned = state.territories || {};

        // Find cheapest unowned territory
        let best = null;
        let lowestCost = Infinity;

        for (let territory of territories) {
            if (owned[territory.id]?.owned) continue;
            if (state.level < (territory.reqLevel || 1)) continue;

            if (territory.baseCost < lowestCost) {
                best = { id: territory.id, cost: territory.baseCost };
                lowestCost = territory.baseCost;
            }
        }

        return best;
    }

    /**
     * Get best upgrade to purchase
     */
    getBestUpgrade(state) {
        const CONFIG = window.__GAME_CONFIG__;
        const upgrades = CONFIG.upgrades;
        const owned = state.upgrades || {};

        // Priority order
        const priority = ['warehouse', 'network', 'studio', 'hydro', 'lab', 'deep_wash'];

        for (let id of priority) {
            if (owned[id]) continue;
            const upgrade = upgrades[id];
            if (upgrade && state.cleanCash >= upgrade.baseCost) {
                return { id, cost: upgrade.baseCost };
            }
        }

        return null;
    }

    /**
     * Check if we should prestige
     */
    shouldPrestige(state, CONFIG) {
        if (state.level < 10) return false;
        if (state.cleanCash < CONFIG.prestige.threshold) return false;

        // Prestige when we have good progress
        const missionProgress = (state.completedMissions?.length || 0) / CONFIG.missions.length;
        if (missionProgress < 0.5) return false;

        return true;
    }

    /**
     * Manage rivals and defense
     */
    manageRivals(state, actions) {
        const hostility = state.rival?.hostility || 0;

        // Build defense if hostility is high
        if (hostility > 70 && state.cleanCash > 20000) {
            const currentGuards = state.defense?.guards || 0;
            if (currentGuards < 5) {
                return {
                    type: 'BUY_DEFENSE',
                    tab: 'rivals',
                    action: () => {
                        const SimActions = window.__SIM_ACTIONS__;
                        const setState = window.__GAME_SET_STATE__;
                        setState(s => SimActions.buyDefense(s, { id: 'guards', amount: 1 }));
                    },
                    reason: `Building defense (hostility: ${Math.floor(hostility)})`
                };
            }
        }

        // Attack rival if safe
        if (hostility < 30 && state.cleanCash > 50000 && actions?.raidRival) {
            return {
                type: 'RAID_RIVAL',
                tab: 'rivals',
                action: () => actions.raidRival(),
                reason: 'Raiding rival (low risk)'
            };
        }

        return null;
    }

    /**
     * Get daily mission action
     */
    getDailyMissionAction(state, dailyMission, SimActions, setState) {
        if (!dailyMission || !dailyMission.req) return null;

        const req = dailyMission.req;
        const progress = this.checkMissionProgress(state, dailyMission);

        // If daily is complete, don't do anything (player needs to claim it)
        if (progress.complete) return null;

        // Work towards daily mission goal
        switch (req.type) {
            case 'produce':
                // Let idle production handle this
                return null;

            case 'sell':
                // Let idle selling handle this
                return null;

            case 'launder':
                if (state.dirtyCash >= 1000) {
                    return {
                        type: 'LAUNDER',
                        tab: 'finance',
                        action: () => setState(s => {
                            const safeAmount = Math.min(5000, s.dirtyCash || 0);
                            if (!Number.isFinite(safeAmount) || safeAmount <= 0) return s;
                            return SimActions.launder(s, { amount: safeAmount });
                        }),
                        reason: `Daily: Laundering (${progress.current}/${progress.total})`
                    };
                }
                break;
        }

        return null;
    }

    /**
     * Get achievement action (low priority)
     */
    getAchievementAction(state, CONFIG) {
        const achievements = CONFIG.achievements;
        const unlocked = state.unlockedAchievements || [];

        // Find achievements that are close to completion
        let closest = null;
        let maxProgress = 0;

        for (let achievement of achievements) {
            if (unlocked.includes(achievement.id)) continue;

            const progress = this.checkAchievementProgress(state, achievement);
            if (progress > maxProgress && progress < 1) {
                closest = { achievement, progress };
                maxProgress = progress;
            }
        }

        // Only actively work towards achievements if very close (>80%)
        if (closest && closest.progress > 0.8) {
            // Most achievements are passive, just log progress
            this.log(`🏆 Achievement progress: ${closest.achievement.id} (${Math.floor(closest.progress * 100)}%)`);
        }

        return null; // Achievements are mostly passive
    }

    /**
     * Check achievement progress
     */
    checkAchievementProgress(state, achievement) {
        // Safety check: ensure achievement has a condition
        if (!achievement || !achievement.condition) {
            return 0;
        }

        const cond = achievement.condition;

        switch (cond.type) {
            case 'level':
                return Math.min(1, state.level / cond.value);

            case 'money':
                return Math.min(1, state.cleanCash / cond.value);

            case 'staff':
                const staffCount = Object.values(state.staff || {}).reduce((sum, count) => sum + count, 0);
                return Math.min(1, staffCount / cond.value);

            case 'territories':
                const territoriesOwned = Object.keys(state.territories || {}).filter(k => state.territories[k]?.owned).length;
                return Math.min(1, territoriesOwned / cond.value);

            case 'missions':
                return Math.min(1, (state.completedMissions?.length || 0) / cond.value);

            default:
                return 0;
        }
    }

    /**
     * Check if we have producers for an item
     */
    hasProducersForItem(state, item) {
        const producers = this.getProducerForItem(item);
        if (!producers) return false;
        return (state.staff?.[producers] || 0) > 0;
    }

    /**
     * Get producer role for an item
     */
    getProducerForItem(item) {
        const mapping = {
            'hash_lys': 'junkie',
            'piller_mild': 'junkie',
            'hash_moerk': 'grower',
            'speed': 'chemist',
            'mdma': 'chemist',
            'keta': 'chemist',
            'coke': 'importer',
            'benzos': 'importer',
            'svampe': 'importer',
            'oxy': 'labtech',
            'heroin': 'labtech',
            'fentanyl': 'labtech'
        };
        return mapping[item] || null;
    }

    /**
     * Decision Engine - v6.0 with Full Autonomy
     */
    decide(state, setState, SimActions, setActiveTab, CONFIG, dispatch, actions) {
        // PRIORITY -1: Modal Handling (CRITICAL - before everything)
        this.handleModals(state, dispatch);

        // PRIORITY 0: Tutorial Flow
        if (!state.flags?.readManual) {
            this.log('📖 Step 1/3: Reading manual...');
            return {
                type: 'READ_MANUAL',
                tab: this.currentTab,
                action: () => dispatch({ type: 'READ_MANUAL' }),
                reason: 'Reading manual'
            };
        }

        if (state.flags?.readManual && !this.manualSummarized) {
            this.log('📝 Tutorial Summary: Produce → Sell → Launder → Hire → Grow');
            this.manualSummarized = true;
        }

        if (!state.flags?.tutorialComplete) {
            this.log('🎓 Completing tutorial...');
            return {
                type: 'COMPLETE_TUTORIAL',
                tab: this.currentTab,
                action: () => dispatch({ type: 'COMPLETE_TUTORIAL' }),
                reason: 'Completing tutorial'
            };
        }

        // Tutorial steps
        const hashProduced = state.stats?.produced?.hash_lys || 0;
        if (hashProduced < 25) {
            return {
                type: 'PRODUCE_MANUAL',
                tab: 'production',
                action: () => setState(s => SimActions.produceManual(s, { tierId: 'hash_lys', amount: 1 })),
                reason: `Tutorial: Producing hash (${hashProduced + 1}/25)`
            };
        }

        const sold = state.stats?.sold || 0;
        if (sold < 25) {
            const hashInv = state.inv?.hash_lys || 0;
            if (hashInv > 0) {
                return {
                    type: 'SELL_MANUAL',
                    tab: 'production',
                    action: () => setState(s => SimActions.sellManual(s, { tierId: 'hash_lys', amount: Math.min(5, hashInv) })),
                    reason: `Tutorial: Selling hash (${sold + 1}/25)`
                };
            }
        }

        const laundered = state.stats?.laundered || 0;
        if (laundered < 500) {
            if (state.dirtyCash >= 100) {
                return {
                    type: 'LAUNDER',
                    tab: 'finance',
                    action: () => setState(s => SimActions.launder(s, { amount: Math.min(100, s.dirtyCash || 0) })),
                    reason: `Tutorial: Laundering (${Math.floor(laundered)}/500kr)`
                };
            }
        }

        const pushers = state.staff?.pusher || 0;
        if (pushers === 0 && state.cleanCash >= 100) {
            this.log('🎓 Tutorial complete! Starting full autonomous AI...');
            return {
                type: 'HIRE_STAFF',
                tab: 'management',
                action: () => setState(s => SimActions.buyStaff(s, { role: 'pusher', amount: 1 })),
                reason: 'Tutorial: Hiring first Pusher'
            };
        }

        if (!this.startupComplete) {
            this.log('🚀 Full Autonomous AI Active! v6.0');
            this.startupComplete = true;
        }

        // FULL GAME AUTONOMOUS STRATEGY

        // PRIORITY 0.5: Boss Fight (if active)
        if (state.boss?.active && actions?.attackBoss) {
            return {
                type: 'ATTACK_BOSS',
                tab: this.currentTab,
                action: () => actions.attackBoss(() => { }),
                reason: `Attacking boss (${Math.floor(state.boss.hp)}/${state.boss.maxHp} HP)`
            };
        }

        // PRIORITY 1: Emergency Heat Management
        if (state.heat >= 400) {
            const lawyerCost = this.calculateStaffCost('lawyer', state);
            if (lawyerCost && state.cleanCash >= lawyerCost) {
                return {
                    type: 'HIRE_STAFF',
                    tab: 'management',
                    action: () => setState(s => SimActions.buyStaff(s, { role: 'lawyer', amount: 1 })),
                    reason: 'Emergency: Buy Lawyer (heat critical)'
                };
            }
        }

        // PRIORITY 1.5: Emergency Storage Management (Prevent Stalls)
        // PRIORITY 1.5: Smart Storage Management (Upgrade > Hire > Sell)
        const bottlenecks = this.analyzeBottlenecks(state, CONFIG);
        const storageIssue = bottlenecks.find(b => b.type === 'STORAGE');

        if (storageIssue) {
            // A. Can we upgrade Warehouse?
            // "warehouse" is a unique upgrade that stacks, or we check level.
            // Actually, in this game CONFIG, warehouse is a single entry. 
            // If it's a stackable upgrade (like in game logic), we need to check if we can buy it again.
            // But usually upgrades are boolean (owned/not). 
            // WAIT: "warehouse" in CONFIG has `value: 2.0`. Maybe it's binary?
            // Let's check if we already own it.
            const hasWarehouse = state.upgrades?.warehouse;

            // If we don't own it, we can buy it.
            // If we own it, maybe there's "warehouse_2"? No, CONFIG only has 'warehouse'.
            // So if we own it, we can't upgrade it further this way.
            // BUT: If the user says "stalls on upgrading storage", maybe it's trying to buy it even if owned?
            // IF owned, we should skip this step.

            if (!hasWarehouse) {
                const wConfig = CONFIG.upgrades.warehouse;
                const wCost = wConfig ? wConfig.baseCost : 20000;

                if (state.cleanCash >= wCost) {
                    return {
                        type: 'BUY_UPGRADE',
                        tab: 'black_market',
                        action: () => setState(s => SimActions.buyUpgrade(s, { id: 'warehouse' })),
                        reason: `Smart: Buckle Up! Buying Warehouse Upgrade`
                    };
                }
            }

            // B. Hire Sellers (Pusher) if we have dirty cash
            // Only if we aren't heat capped
            if (state.heat < 80 && state.dirtyCash > 500) {
                const bestSeller = this.findBestSeller(state);
                if (bestSeller && bestSeller.cost <= state.cleanCash) { // Hiring costs Clean Cash usually
                    // Wait, staff costs Clean Cash? usually yes.
                    return {
                        type: 'HIRE_STAFF',
                        tab: 'management',
                        action: () => setState(s => SimActions.buyStaff(s, { role: bestSeller.role, amount: 1 })),
                        reason: `Smart: Hire ${bestSeller.role} to clear storage`
                    };
                }
            }

            // C. Emergency Sell (Fallback)
            // Find item with most stock
            let bestItem = null;
            let maxAmt = 0;
            const safeInv = state.inv || {};
            for (let [id, amt] of Object.entries(safeInv)) {
                if (id === 'total') continue;
                if (amt > maxAmt) {
                    maxAmt = amt;
                    bestItem = id;
                }
            }

            if (bestItem) {
                return {
                    type: 'SELL_MANUAL',
                    tab: 'production',
                    action: () => setState(s => SimActions.sellManual(s, { tierId: bestItem, amount: Math.floor(maxAmt / 2) })), // Sell half
                    reason: `Emergency: Storage Full! Dumping ${Math.floor(maxAmt / 2)}x ${bestItem}`
                };
            }
        }

        // PRIORITY 2: Mission Progress
        const mission = this.getCurrentMission(state, CONFIG);
        if (mission) {
            const missionAction = this.getMissionAction(state, mission, SimActions, setState);
            if (missionAction) {
                return missionAction;
            }
        }

        // PRIORITY 2.5: Daily Mission Progress
        const dailyMission = state.dailyMission;
        if (dailyMission && !dailyMission.completed) {
            const dailyAction = this.getDailyMissionAction(state, dailyMission, SimActions, setState);
            if (dailyAction) {
                return dailyAction;
            }
        }

        // PRIORITY 3: Laundering
        if (state.dirtyCash > 50000 && state.cleanCash < 10000) {
            return {
                type: 'LAUNDER',
                tab: 'finance',
                action: () => setState(s => {
                    const safeAmount = Math.floor((s.dirtyCash || 0) * 0.5);
                    if (!Number.isFinite(safeAmount) || safeAmount <= 0) return s;
                    return SimActions.launder(s, { amount: safeAmount });
                }),
                reason: 'Laundering for clean cash'
            };
        }

        // PRIORITY 3.5: Passive Laundering (Accountants)
        // Only if we have dirty money to wash and can afford the heavy salary
        if (state.level >= 8 && state.dirtyCash > 100000) {
            const accCost = this.calculateStaffCost('accountant', state);
            const currentAcc = state.staff.accountant || 0;

            // Hire if affordable and we have < 5 accountants (soft cap for safety)
            // or if dirty cash is EXTREME (> 500k) and we need more throughput
            if (accCost && state.cleanCash >= accCost) {
                if (currentAcc < 5 || state.dirtyCash > 500000) {
                    return {
                        type: 'HIRE_STAFF',
                        tab: 'management',
                        action: () => setState(s => SimActions.buyStaff(s, { role: 'accountant', amount: 1 })),
                        reason: `Hiring Accountant #${currentAcc + 1} (Passive Laundering)`
                    };
                }
            }
        }

        // PRIORITY 4: Strategic Upgrades
        const upgrade = this.getBestUpgrade(state);
        if (upgrade && state.cleanCash >= upgrade.cost * 2) {
            return {
                type: 'BUY_UPGRADE',
                tab: 'management',
                action: () => setState(s => SimActions.buyUpgrade(s, { id: upgrade.id })),
                reason: `Buying upgrade: ${upgrade.id}`
            };
        }

        // PRIORITY 5: Territory Expansion
        const territory = this.getBestTerritory(state);
        if (territory && state.cleanCash >= territory.cost * 2) {
            return {
                type: 'BUY_TERRITORY',
                tab: 'network',
                action: () => setState(s => SimActions.buyTerritory(s, { id: territory.id })),
                reason: `Buying territory: ${territory.id}`
            };
        }

        // PRIORITY 6: Rival & Defense Management
        const rivalAction = this.manageRivals(state, actions);
        if (rivalAction) return rivalAction;

        // PRIORITY 7: Robust Staffing Strategy (Always Grow)
        const producers = ['junkie', 'grower', 'chemist', 'importer', 'labtech'].reduce((sum, r) => sum + (state.staff[r] || 0), 0);
        const sellers = ['pusher', 'distributor', 'trafficker'].reduce((sum, r) => sum + (state.staff[r] || 0), 0);

        // 7a. Ensure at least one of every unlocked role (Diversity)
        // This ensures we have the capability to produce/sell everything
        const missingProducer = this.findBestProducer(state, true); // true = diversity only
        if (missingProducer && state.cleanCash >= missingProducer.cost) {
            return {
                type: 'HIRE_STAFF',
                tab: 'management',
                action: () => setState(s => SimActions.buyStaff(s, { role: missingProducer.role, amount: 1 })),
                reason: `Diversity: Hiring first ${missingProducer.role}`
            };
        }

        const missingSeller = this.findBestSeller(state, true); // true = diversity only
        if (missingSeller && state.cleanCash >= missingSeller.cost) {
            return {
                type: 'HIRE_STAFF',
                tab: 'management',
                action: () => setState(s => SimActions.buyStaff(s, { role: missingSeller.role, amount: 1 })),
                reason: `Diversity: Hiring first ${missingSeller.role}`
            };
        }

        // 7b. Dynamic Balancing (No Dead Zones)
        // If we have excess cash (> 5x cost of next hire), always hire to expand.
        // Ratio Target: 2.5 producers per seller (Higher volume needs more sellers)
        const ratio = sellers > 0 ? producers / sellers : 100;

        let hireTarget = null;
        // If Inventory is clogging (> 40%), prioritize Sellers
        const totalInv = Object.values(state.inv || {}).reduce((a, b) => (typeof b === 'number' ? a + b : a), 0);
        const maxStorage = CONFIG.gameMechanics?.maxStorage || 100;
        const storagePressure = totalInv / maxStorage;

        if (storagePressure > 0.4 || ratio > 2.5) {
            // Need more sellers
            hireTarget = this.findBestSeller(state);
        } else {
            // Need more producers
            hireTarget = this.findBestProducer(state);
        }

        if (hireTarget && state.cleanCash >= hireTarget.cost) {
            // Only hire if we can afford it COMFORTABLY (keep 20% buffer for emergency)
            // Or if we are barely starting (producers < 5), hire aggressively
            const buffer = producers < 5 ? 0 : hireTarget.cost * 0.2;

            if (state.cleanCash >= hireTarget.cost + buffer) {
                return {
                    type: 'HIRE_STAFF',
                    tab: 'management',
                    action: () => setState(s => SimActions.buyStaff(s, { role: hireTarget.role, amount: 1 })),
                    reason: `Expansion: Hiring ${hireTarget.role} (${storagePressure > 0.4 ? 'High Inventory' : 'Growth'})`
                };
            }
        }

        // PRIORITY 7.5: Achievement Hunting (low priority)
        const achievementAction = this.getAchievementAction(state, CONFIG);
        if (achievementAction) {
            return achievementAction;
        }

        // PRIORITY 8: Prestige Check
        if (this.shouldPrestige(state, CONFIG) && actions?.doPrestige) {
            this.log('🔄 PRESTIGE: Resetting for permanent bonuses...');
            this.prestigeCount++;
            return {
                type: 'PRESTIGE',
                tab: 'empire',
                action: () => actions.doPrestige(),
                reason: 'Prestiging for permanent multiplier'
            };
        }

        // PRIORITY 9: Check for stall and consult handbook if needed
        if (this.detectStall(state)) {
            this.log('⚠️ Progress stalled! Consulting handbook for guidance...');
            this.consultHandbook();
            this.stallCount = 0; // Reset after consultation
        }

        // PRIORITY 10: IDLE
        const missionInfo = mission ? ` | Mission: ${mission.id}` : '';
        const bossInfo = state.boss?.active ? ` | BOSS FIGHT!` : '';
        this.log(`💤 Idle (Lvl ${state.level}, ${producers}P/${sellers}S, ${Math.floor(state.cleanCash)}kr${missionInfo}${bossInfo})`);
        return {
            type: 'IDLE',
            tab: this.currentTab,
            action: null,
            reason: 'Letting idle game work'
        };
    }

    /**
     * ANALYZE BOTTLENECKS
     */
    analyzeBottlenecks(state, CONFIG) {
        const bottlenecks = [];
        const totalInv = Object.entries(state.inv || {}).reduce((sum, [key, val]) => key === 'total' ? sum : sum + (typeof val === 'number' ? val : 0), 0);
        const maxStorage = CONFIG.gameMechanics?.maxStorage || 100;

        if (totalInv >= maxStorage * 0.9) bottlenecks.push({ type: 'STORAGE', severity: 'CRITICAL', value: totalInv / maxStorage });
        if (state.dirtyCash < 100 && totalInv > 50) bottlenecks.push({ type: 'SALES_RATE', severity: 'HIGH' });
        if (state.heat > 80) bottlenecks.push({ type: 'HEAT', severity: 'CRITICAL' });

        return bottlenecks;
    }

    /**
     * Detect best seller for clogged inventory
     */
    findBestSeller(state, CONFIG) {
        // 1. Find clogged item
        let bestItem = null;
        let maxAmt = 0;
        for (let [id, amt] of Object.entries(state.inv || {})) {
            if (id === 'total') continue;
            if (amt > maxAmt) {
                maxAmt = amt;
                bestItem = id;
            }
        }

        if (!bestItem) return null;

        // 2. Map item to role (Hardcoded fallback if CONFIG missing map)
        const itemRoles = {
            'hash_lys': 'pusher', 'piller_mild': 'pusher',
            'hash_moerk': 'distributor', 'speed': 'distributor', 'mdma': 'distributor', 'keta': 'distributor',
            'coke': 'trafficker', 'benzos': 'trafficker', 'svampe': 'trafficker', 'oxy': 'trafficker', 'heroin': 'trafficker', 'fentanyl': 'trafficker'
        };

        const role = itemRoles[bestItem] || 'pusher';
        // const cost = CONFIG.staff[role]?.baseCost || 100; // access only if needed
        return { role, cost: 100 }; // Simplified cost check handled in decide
    }

    /**
     * Detect if AutoPilot is stalled (no progress for extended period)
     */
    detectStall(state) {
        const now = Date.now();
        const timeSinceLastCheck = now - this.lastProgressCheck.timestamp;

        // Check every 2 minutes
        if (timeSinceLastCheck < 120000) return false;

        // Check if any progress was made
        const levelProgress = state.level > this.lastProgressCheck.level;
        const cashProgress = state.cleanCash > this.lastProgressCheck.cash * 1.1; // 10% increase
        const missionProgress = (state.completedMissions?.length || 0) > this.lastProgressCheck.missions;

        const hasProgress = levelProgress || cashProgress || missionProgress;

        // Update progress check
        this.lastProgressCheck = {
            level: state.level,
            cash: state.cleanCash,
            missions: state.completedMissions?.length || 0,
            timestamp: now
        };

        if (!hasProgress) {
            this.stallCount++;
            // Stalled if no progress for 2 consecutive checks (4 minutes)
            return this.stallCount >= 2;
        } else {
            this.stallCount = 0;
            return false;
        }
    }

    /**
     * Consult handbook for guidance
     */
    consultHandbook() {
        this.log('📖 Handbook Consultation:');
        this.log('  → Core Loop: PRODUCE → SELL → LAUNDER → INVEST → REPEAT');
        this.log('  → Hire staff to automate production and sales');
        this.log('  → Buy upgrades to increase efficiency');
        this.log('  → Acquire territories for passive income');
        this.log('  → Manage heat with lawyers');
        this.log('  → Complete Sultan missions for rewards');
        this.log('  → Build defense before attacking rivals');
        this.handbookConsulted = true;
    }

    /**
     * Calculate staff cost
     */
    calculateStaffCost(role, state) {
        const CONFIG = window.__GAME_CONFIG__;
        const staffConfig = CONFIG.staff[role];
        if (!staffConfig) return null;
        if (state.level < staffConfig.reqLevel) return null;

        const count = state.staff[role] || 0;
        const baseCost = staffConfig.baseCost;
        const factor = staffConfig.costFactor || 1.15;

        return Math.floor(baseCost * Math.pow(factor, count));
    }

    /**
     * Find best producer to hire
     */
    findBestProducer(state, diversityOnly = false) {
        const producers = ['junkie', 'grower', 'chemist', 'importer', 'labtech'];
        let best = null;
        let lowestCost = Infinity;

        // PRIORITY A: Diversity (Hire 1 of each unlocked role first)
        for (let role of producers) {
            const cost = this.calculateStaffCost(role, state);
            const currentCount = state.staff[role] || 0;

            if (cost && currentCount === 0) {
                // Found a role we haven't hired yet!
                return { role, cost };
            }
        }

        if (diversityOnly) return null;

        // PRIORITY B: Cost Efficiency (if we have at least 1 of all available)
        for (let role of producers) {
            const cost = this.calculateStaffCost(role, state);
            if (cost && cost < lowestCost) {
                best = { role, cost };
                lowestCost = cost;
            }
        }

        return best;
    }

    /**
     * Find best seller to hire
     */
    findBestSeller(state, diversityOnly = false) {
        const sellers = ['pusher', 'distributor', 'trafficker'];
        let best = null;
        let lowestCost = Infinity;

        // PRIORITY A: Diversity (Hire 1 of each unlocked seller first)
        for (let role of sellers) {
            const cost = this.calculateStaffCost(role, state);
            const currentCount = state.staff[role] || 0;

            if (cost && currentCount === 0) {
                return { role, cost };
            }
        }

        if (diversityOnly) return null;

        // PRIORITY B: Cost Efficiency
        for (let role of sellers) {
            const cost = this.calculateStaffCost(role, state);
            if (cost && cost < lowestCost) {
                best = { role, cost };
                lowestCost = cost;
            }
        }

        return best;
    }

    /**
     * Execute decision
     */
    async executeDecision(decision, setActiveTab) {
        if (!decision || decision.type === 'IDLE') {
            return;
        }

        this.log(`🎯 ${decision.reason}`);

        // Switch tab
        if (setActiveTab && decision.tab !== this.currentTab) {
            setActiveTab(decision.tab);
            this.currentTab = decision.tab;
            await this.sleep(300);
        }

        // Execute
        if (decision.action) {
            try {
                decision.action();
                this.actionsPerformed++;
                this.log(`✅ ${decision.type} executed`);
            } catch (error) {
                this.logBug('ERROR', `Failed: ${decision.type}`, error);
            }
        }
    }

    /**
     * Watchdog
     */
    startTickWatchdog() {
        this.tickWatchdog = setInterval(() => {
            const timeSince = Date.now() - this.lastTickTime;
            if (timeSince > 15000) { // Increased to 15s to avoid false positives in Idle (10s)
                this.logBug('WARNING', `Game stalled! No tick in ${(timeSince / 1000).toFixed(1)}s`);
            }
        }, 5000);
    }

    stopTickWatchdog() {
        if (this.tickWatchdog) {
            clearInterval(this.tickWatchdog);
        }
    }

    notifyTick() {
        this.lastTickTime = Date.now();
    }

    /**
     * Main loop
     */
    /**
     * Main loop (Dynamic Interval)
     */
    async tick() {
        if (!this.isRunning) return;

        let nextDelay = this.speed; // Default: 10s

        try {
            const context = this.getGameContext();
            if (context) {
                const { state, setState, setActiveTab, SimActions, CONFIG, dispatch, actions } = context;

                // COMBAT MODE: Attack Boss rapidly (200ms)
                if (state.boss && state.boss.active) {
                    nextDelay = 200;
                    // console.log('[AutoPilot] Combat Mode: 200ms tick');
                }
                // EMERGENCY: Storage Full (Rapid Sell Mode)
                else if (Object.entries(state.inv || {}).reduce((sum, [key, val]) => key === 'total' ? sum : sum + (typeof val === 'number' ? val : 0), 0) >= (CONFIG.gameMechanics?.maxStorage || 100) * 0.9) {
                    nextDelay = 1000; // 1s interval to clear storage fast
                } else {
                    // console.log('[AutoPilot] Idle Mode: 10s tick');
                }

                this.validateState(state);
                this.notifyTick();

                const decision = this.decide(state, setState, SimActions, setActiveTab, CONFIG, dispatch, actions);
                await this.executeDecision(decision, setActiveTab);

                this.lastState = state;
            }

        } catch (error) {
            this.logBug('CRITICAL', 'Tick crashed', error);
        }

        // Schedule next tick
        if (this.isRunning) {
            this.tickInterval = setTimeout(() => this.tick(), nextDelay);
        }
    }

    /**
     * Control
     */
    start() {
        if (this.isRunning) {
            console.log('⚠️ Already running');
            return;
        }

        this.isRunning = true;
        this.startTime = Date.now();
        console.log('🚀 AutoPilot v6.0 started (Fully Autonomous AI, Dynamic Intervals)');

        this.startTickWatchdog();
        // Start the loop immediately
        this.tick();
    }

    stop() {
        if (!this.isRunning) return;

        this.isRunning = false;
        clearTimeout(this.tickInterval);
        this.stopTickWatchdog();
        console.log('🛑 AutoPilot stopped');
        this.printReport();
    }

    toggle() {
        this.isRunning ? this.stop() : this.start();
    }

    /**
     * Logging
     */
    log(message) {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[AutoPilot ${timestamp}] ${message}`);
        this.actionLog.push({ time: timestamp, message, level: 'INFO' });
    }

    logWarning(message) {
        const timestamp = new Date().toLocaleTimeString();
        console.warn(`[AutoPilot ${timestamp}] ⚠️ ${message}`);
        this.warnings.push({ time: timestamp, message });
    }

    logBug(level, message, error = null) {
        const timestamp = new Date().toLocaleTimeString();
        this.bugs.push({
            time: timestamp,
            level,
            message,
            error: error ? error.toString() : null
        });

        if (level === 'CRITICAL') {
            console.error(`[AutoPilot ${timestamp}] 🚨 ${message}`, error);
        } else {
            console.warn(`[AutoPilot ${timestamp}] ⚠️ ${level}: ${message}`, error);
        }
    }

    /**
     * Reporting
     */
    printReport() {
        const runtime = this.startTime ? (Date.now() - this.startTime) / 1000 : 0;
        const state = window.__GAME_STATE__;

        console.log('\n📊 ===== AUTOPILOT v6.0 REPORT =====');
        console.log(`⏱️  Runtime: ${(runtime / 60).toFixed(1)} minutes`);
        console.log(`🎯 Actions: ${this.actionsPerformed}`);
        console.log(`📈 Level: ${state?.level || 'N/A'}`);
        console.log(`💰 Clean Cash: ${Math.floor(state?.cleanCash || 0).toLocaleString()} kr`);
        console.log(`🏆 Missions: ${(state?.completedMissions?.length || 0)} completed`);
        console.log(`🏢 Territories: ${Object.keys(state?.territories || {}).filter(k => state.territories[k]?.owned).length} owned`);
        console.log(`🔄 Prestiges: ${this.prestigeCount}`);
        console.log(`🐛 Bugs: ${this.bugs.length}`);
        console.log(`⚠️  Warnings: ${this.warnings.length}`);

        if (this.bugs.length > 0) {
            console.log('\n🚨 BUGS:');
            this.bugs.forEach((bug, i) => {
                console.log(`  ${i + 1}. [${bug.level}] ${bug.message}`);
            });
        }

        console.log('\n===============================\n');
    }

    getReport() {
        const state = window.__GAME_STATE__;
        return {
            runtime: this.startTime ? (Date.now() - this.startTime) / 1000 : 0,
            actionsPerformed: this.actionsPerformed,
            level: state?.level || 0,
            cleanCash: state?.cleanCash || 0,
            missionsCompleted: state?.completedMissions?.length || 0,
            territoriesOwned: Object.keys(state?.territories || {}).filter(k => state.territories[k]?.owned).length,
            prestigeCount: this.prestigeCount,
            bugs: this.bugs,
            warnings: this.warnings,
            actionLog: this.actionLog
        };
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

if (typeof window !== 'undefined') {
    window.AutoPilot = AutoPilot;
}
