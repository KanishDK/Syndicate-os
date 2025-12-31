import { useEffect } from 'react';
import { CONFIG } from '../config/gameConfig';
import { defaultState } from '../utils/initialState';
import { formatNumber } from '../utils/gameMath';

export const useGameLoop = (gameState, setGameState) => {
    useEffect(() => {
        const interval = setInterval(() => {
            const randInterest = Math.random();
            const randRaid = Math.random();
            const randAttack = Math.random() * 100;

            setGameState(prev => {
                let s = { ...prev };
                if (s.payroll) s.payroll = { ...s.payroll };
                if (!s.prestige) s.prestige = defaultState.prestige;
                if (!s.lifetime) s.lifetime = defaultState.lifetime; // Fix: Initialize lifetime for legacy saves

                // 1. STATS & DECAY
                if (s.heat > 0) s.heat = Math.max(0, s.heat - CONFIG.heat.coolRate);
                if (s.boss.active && s.boss.hp < s.boss.maxHp) {
                    s.boss.hp = Math.min(s.boss.maxHp, s.boss.hp + (CONFIG.boss.regenRate || 0));
                }

                // 2. PAYROLL & SALARY
                if (Date.now() - (s.payroll?.lastPaid || 0) > CONFIG.payroll.salaryInterval) {
                    let totalStaff = 0;
                    let salaryCost = 0;
                    Object.keys(CONFIG.staff).forEach(role => {
                        const count = s.staff[role] || 0;
                        const salary = CONFIG.staff[role].salary || 0;
                        if (count > 0 && salary > 0) {
                            totalStaff += count;
                            salaryCost += count * salary;
                        }
                    });

                    if (salaryCost > 0) {
                        if (s.cleanCash >= salaryCost) {
                            s.cleanCash -= salaryCost;
                            s.payroll.lastPaid = Date.now();
                            s.payroll.isStriking = false;
                            s.logs = [{ msg: `Betalte løn til ${totalStaff} ansatte (${salaryCost} kr.)`, type: 'info', time: new Date().toLocaleTimeString() }, ...s.logs].slice(0, 50);
                        } else {
                            s.payroll.isStriking = true;
                            if (!s.pendingEvent && Math.random() < 0.1) {
                                s.pendingEvent = {
                                    type: 'story',
                                    data: { title: 'LØNNINGS DAG FEJLEDE', msg: `Dine ansatte strejker! De mangler ${salaryCost} kr. i løn.`, type: 'rival' }
                                };
                            }
                        }
                    } else {
                        s.payroll.lastPaid = Date.now();
                    }
                }

                // 3. CRYPTO MARKET (Med Crash Chance)
                if (Math.random() < 0.1) {
                    const newPrices = { ...s.crypto.prices };
                    Object.keys(newPrices).forEach(coin => {
                        const conf = CONFIG.crypto.coins[coin];
                        if (conf) {
                            // 5% chance for et "Crash" (falder 30-50%)
                            if (Math.random() < 0.05) {
                                const crashFactor = 0.5 + (Math.random() * 0.2); // 0.5 til 0.7
                                newPrices[coin] = newPrices[coin] * crashFactor;
                                // Log kun crashet hvis det er en stor valuta (Bitcoin)
                                if (coin === 'bitcoin') {
                                    s.logs = [{ msg: `KRYPTO KRAK! ${conf.name} styrtdykker!`, type: 'error', time: new Date().toLocaleTimeString() }, ...s.logs].slice(0, 50);
                                }
                            } else {
                                // Normal volatilitet
                                const change = (Math.random() - 0.5) * conf.volatility * (conf.basePrice * 0.2);
                                newPrices[coin] = Math.max(conf.basePrice * 0.1, Math.min(conf.basePrice * 5, newPrices[coin] + change));
                            }
                        }
                    });
                    s.crypto.prices = newPrices;
                }

                // 4. AUTOMATED PRODUCTION & SALES (Immunity check)
                if (!s.payroll.isStriking) {
                    // Same logic, but CLEAN (no mutation of prev state)

                    // Helpers for production updates
                    const increment = (item, amount = 1) => {
                        const currentTotal = Object.values(s.inv).reduce((a, b) => a + b, 0);
                        const maxCap = 50 * (s.upgrades.warehouse || 1);
                        if (currentTotal + amount > maxCap) return;

                        s.inv[item] = (s.inv[item] || 0) + amount;
                        s.stats.produced[item] = (s.stats.produced[item] || 0) + amount;
                        if (s.lifetime) s.lifetime.produced[item] = (s.lifetime.produced[item] || 0) + amount;
                        // Correctly update derived or nested state if we were deep merging, but here we are mutating 's' which is a shallow copy of prev.
                        // Ideally we should shallow copy inv/stats first.
                    };

                    // Fix: Ensure Immunitability for nested objects we are about to touch
                    s.inv = { ...prev.inv };
                    s.stats = { ...prev.stats, produced: { ...prev.stats.produced } };

                    // A. Junkies (Vrag)
                    const junkieCount = s.staff.junkie || 0;
                    if (junkieCount > 0) {
                        if (Math.random() < (junkieCount * 0.3)) increment('hash_lys');
                        if (Math.random() < (junkieCount * 0.15)) increment('piller_mild');
                        if (Math.random() < 0.001) {
                            s.staff.junkie = Math.max(0, s.staff.junkie - 1);
                            s.logs = [{ msg: "En junkie døde af en overdosis.", type: 'warning', time: new Date().toLocaleTimeString() }, ...s.logs].slice(0, 50);
                        }
                    }

                    // B. Growers (Gartnere) - v26.1 Buff: Produces both Light and Dark (Level locked in v26.2)
                    const growerCount = (s.staff.grower || s.staff.gardener || 0);
                    if (growerCount > 0) {
                        const weedMult = s.upgrades.hydro ? 1.25 : 1;
                        if (Math.random() < (growerCount * 0.3 * weedMult)) increment('hash_lys');
                        if (s.level >= 5 && Math.random() < (growerCount * 0.2 * weedMult)) increment('hash_moerk');
                    }

                    // C. Chemists & Importers (v26.2: Enforce Level Lock)
                    if (s.staff.chemist > 0 && s.level >= 10 && Math.random() < (s.staff.chemist * 0.1 * (s.upgrades.lab ? 1.25 : 1))) increment('speed');
                    if (s.staff.importer > 0 && s.level >= 15 && Math.random() < (s.staff.importer * 0.05)) increment('coke');
                    if (s.staff.labtech > 0 && s.level >= 25 && Math.random() < (s.staff.labtech * 0.02)) increment('fentanyl');

                    // D. Sellers Logic (Auto-Sell) - REFACTORED to avoid decimals
                    // v1.1 Fix: Reduced Heat Malus Base
                    let heatMalus = s.heat >= 95 ? 0.2 : (s.heat >= 80 ? 0.5 : (s.heat >= 50 ? 0.8 : 1.0));
                    const heatMult = s.upgrades.network ? 0.75 : 1.0;

                    const sellItem = (roleCount, item, chancePerUnit, heatPerUnit) => {
                        const count = s.inv[item] || 0;
                        if (count <= 0) return;

                        const effectiveRate = roleCount * chancePerUnit * heatMalus;
                        const guaranteed = Math.floor(effectiveRate);
                        const remainder = effectiveRate - guaranteed;

                        let amountToSell = guaranteed + (Math.random() < remainder ? 1 : 0);
                        amountToSell = Math.min(count, amountToSell);

                        if (amountToSell > 0) {
                            s.inv[item] -= amountToSell;
                            const revenue = amountToSell * s.prices[item];
                            s.dirtyCash += revenue;
                            s.xp += Math.floor(revenue * 0.1);

                            // v1.1 Fix: Lowered Heat Gain (was too aggressive)
                            // Was: heatPerUnit * heatMult. Now 50% less.
                            s.heat += (amountToSell * heatPerUnit * heatMult) * 0.4;

                            s.stats.sold += amountToSell;
                        }
                    };

                    // Auto-sell based on toggle
                    // v1.1 Feature: Panic Button (isSalesPaused)
                    if (!s.isSalesPaused) {
                        Object.keys(CONFIG.production).forEach(itemId => {
                            // Check if enabled (Default to true if undefined)
                            if (s.autoSell[itemId] === false) return;

                            const itemConfig = CONFIG.production[itemId];

                            // Determine which staff role sells this item
                            let sellerCount = 0;
                            let chance = 0;
                            let heat = 0;

                            if (itemConfig.id === 'hash_lys' || itemConfig.id === 'piller_mild') {
                                sellerCount = s.staff.pusher || 0;
                                chance = 0.5;
                                heat = itemConfig.id === 'hash_lys' ? 0.02 : 0.04;
                            } else if (itemConfig.id === 'hash_moerk' || itemConfig.id === 'speed' || itemConfig.id === 'mdma') {
                                sellerCount = s.staff.distributor || 0;
                                chance = itemConfig.id === 'hash_moerk' ? 0.5 : (itemConfig.id === 'speed' ? 0.4 : 0.3);
                                heat = itemConfig.id === 'hash_moerk' ? 0.1 : (itemConfig.id === 'speed' ? 0.12 : 0.15);
                            } else if (['coke', 'benzos', 'svampe', 'oxy', 'heroin', 'fentanyl'].includes(itemConfig.id)) {
                                sellerCount = s.staff.trafficker || 0;
                                chance = 0.3; // Default average
                                if (itemConfig.id === 'coke') chance = 0.4;
                                if (itemConfig.id === 'heroin') chance = 0.25;
                                if (itemConfig.id === 'fentanyl') chance = 0.2;
                                heat = 0.5; // Avg
                            }

                            if (sellerCount > 0) {
                                sellItem(sellerCount, itemId, chance, heat);
                            }
                        });
                    }

                    // E. Support
                    if (s.staff.lawyer > 0) s.heat = Math.max(0, s.heat - (s.staff.lawyer * 0.15));

                    // NYT: Auto-Laundering (Revisor)
                    // v1.1 Fix: Flat Rate instead of Percentage (Nerf)
                    if (s.staff.accountant > 0 && s.dirtyCash > 0) {
                        const cleanPerAccountant = 250; // 250 kr per tick per accountant
                        const maxClean = s.staff.accountant * cleanPerAccountant;

                        let amountToClean = Math.min(s.dirtyCash, maxClean);

                        // Bonus from Studio (Front Business)
                        if (s.upgrades.studio) amountToClean = Math.floor(amountToClean * 1.5);

                        if (amountToClean > 0) {
                            const cleanAmount = Math.floor(amountToClean * CONFIG.launderingRate); // Still lose 30%
                            s.dirtyCash -= amountToClean;
                            s.cleanCash += cleanAmount;
                            s.stats.laundered += amountToClean;
                        }
                    }
                }

                // 5. TERRITORY INCOME (Consolidated)
                CONFIG.territories.forEach(t => {
                    if (s.territories.includes(t.id)) {
                        const inc = t.income * (s.prestige.multiplier || 1);
                        if (t.type === 'clean') s.cleanCash += inc;
                        else {
                            s.dirtyCash += inc;
                            if (s.heat < 100) s.heat += 0.05;
                        }
                        if (s.lifetime) s.lifetime.earnings += inc;
                    }
                });

                // 6. RAIDS & RIVALS
                if (!s.pendingEvent) {
                    // Police Raid
                    if (s.heat > 40 && randRaid < (s.heat / 10000)) {
                        const totalDefense = (s.defense.guards * CONFIG.defense.guards.defenseVal) + (s.defense.cameras * CONFIG.defense.cameras.defenseVal) + (s.defense.bunker * CONFIG.defense.bunker.defenseVal);
                        let tier = s.heat > 90 ? 'high' : (s.heat > 70 ? 'med' : 'low');
                        const attackVal = randAttack + (tier === 'high' ? 50 : (tier === 'med' ? 20 : 0));
                        if (totalDefense > attackVal) {
                            s.heat = Math.max(0, s.heat - (tier === 'high' ? 30 : 10));
                            s.pendingEvent = { type: 'raid', data: { type: 'police', result: 'win', title: tier === 'high' ? 'SWAT RAID AFVIST' : 'POLITI KONTROL AFVIST', msg: 'Dine sikkerhedsforanstaltninger holdt dem ude!', lost: {} } };
                        } else {
                            const lostDirty = Math.floor(s.dirtyCash * (tier === 'high' ? 0.6 : (tier === 'med' ? 0.25 : 0.1)));
                            let targetItem = 'hash_moerk'; let maxP = 0;
                            ['fentanyl', 'heroin', 'oxy', 'coke', 'benzos', 'speed', 'mdma', 'keta', 'hash_moerk', 'hash_lys', 'piller_mild'].forEach(i => {
                                if ((s.inv[i] || 0) > 0 && (s.prices[i] || 0) > maxP) { maxP = s.prices[i]; targetItem = i; }
                            });
                            const lostProd = Math.floor((s.inv[targetItem] || 0) * (tier === 'high' ? 0.8 : (tier === 'med' ? 0.3 : 0)));
                            s.dirtyCash -= lostDirty; s.inv[targetItem] -= lostProd;
                            s.heat = tier === 'high' ? 20 : Math.max(0, s.heat - 10);
                            s.pendingEvent = { type: 'raid', data: { type: 'police', result: 'loss', title: tier === 'high' ? 'SWAT RAID!' : 'RAZZIA', msg: `Beslaglagt: ${lostDirty.toLocaleString()} kr og ${lostProd}x ${targetItem}.`, lost: { cash: lostDirty, product: lostProd } } };
                        }
                    }
                    // Rival Drive-by
                    else if (s.level >= 3 && s.rival.hostility > 50 && Math.random() < ((s.rival.hostility - 50) / 2000)) {
                        const def = (s.defense.guards || 0) * CONFIG.defense.guards.defenseVal;
                        if (def > (20 + (s.level * 5))) {
                            s.rival.hostility = Math.max(0, s.rival.hostility - 20);
                            s.logs = [{ msg: "Rivaler skræmt væk af dine vagter.", type: 'success', time: new Date().toLocaleTimeString() }, ...s.logs].slice(0, 50);
                        } else {
                            const lCash = Math.floor(s.dirtyCash * 0.1); s.dirtyCash -= lCash;
                            s.pendingEvent = { type: 'story', data: { title: 'DRIVE-BY!', msg: `Rivaler skød løs. Du mistede ${lCash.toLocaleString()} kr.`, type: 'rival' } };
                            s.rival.hostility = Math.max(0, s.rival.hostility - 10);
                        }
                    }
                }
                if (s.level >= 3 && s.rival.hostility < 100) s.rival.hostility += 0.05;

                // 7. MISSIONS & LEVEL UP (Sequential Logic Fix v26.3)
                // Find ONLY the next available mission
                const nextMission = CONFIG.missions.find(m => !s.completedMissions.includes(m.id));

                if (nextMission) {
                    const m = nextMission;
                    let ok = false; const r = m.req;

                    if (r.type === 'produce') ok = s.stats.produced[r.item] >= r.amount;
                    else if (r.type === 'sell') ok = s.stats.sold >= r.amount;
                    else if (r.type === 'hire') ok = s.staff[r.role] >= r.amount;
                    else if (r.type === 'upgrade') ok = s.upgrades[r.id] >= 1;
                    else if (r.type === 'conquer') ok = s.territories.length >= r.amount;

                    if (ok) {
                        s.completedMissions = [...s.completedMissions, m.id];
                        s.xp += m.reward.xp;
                        s.cleanCash += m.reward.money;
                        s.logs = [{ msg: `MISSION: ${m.title} (+${m.reward.money} kr.)`, type: 'success', time: new Date().toLocaleTimeString() }, ...s.logs].slice(0, 50);
                    }
                }

                // ENDGAME: Daglige Missioner (Infinite Loop)
                const allMainMissionsDone = s.completedMissions.length >= CONFIG.missions.length;
                if (allMainMissionsDone) {
                    // 1. Generer ny mission hvis vi mangler en
                    if (!s.dailyMission) {
                        const items = Object.keys(CONFIG.production);
                        const randomItem = items[Math.floor(Math.random() * items.length)];
                        // Skaler sværhedsgrad med level
                        const targetAmount = Math.floor(100 * Math.pow(1.2, s.level));
                        const rewardMoney = Math.floor(CONFIG.production[randomItem].baseRevenue * targetAmount * 1.5); // Bonus

                        s.dailyMission = {
                            id: `daily_${Date.now()}`,
                            title: `Skaf ${formatNumber(targetAmount)}x ${CONFIG.production[randomItem].name}`,
                            req: { type: 'produce', item: randomItem, amount: targetAmount },
                            reward: { xp: 1000, money: rewardMoney },
                            progress: 0,
                            target: targetAmount
                        };
                    }

                    // 2. Tjek progress
                    if (s.dailyMission) {
                        const currentStock = s.inv[s.dailyMission.req.item];
                        if (currentStock >= s.dailyMission.target) {
                            s.cleanCash += s.dailyMission.reward.money;
                            s.xp += s.dailyMission.reward.xp;
                            s.logs = [{ msg: `DAGLIGT FIX: ${s.dailyMission.title} klaret!`, type: 'success', time: new Date().toLocaleTimeString() }, ...s.logs].slice(0, 50);
                            s.dailyMission = null; // Nulstil så vi får en ny næste tick
                        }
                    }
                }

                // NYT: Tjek for "All Missions Complete"
                const totalMissions = CONFIG.missions.length;
                if (s.completedMissions.length === totalMissions && !s.hasSeenEndgameMsg) {
                    s.hasSeenEndgameMsg = true;
                    s.pendingEvent = {
                        type: 'story',
                        data: {
                            title: 'KONGEN AF KØBENHAVN',
                            msg: `Sultanen nikker anerkendende. "Du har gjort det, bror. Byen er din." Du har klaret alle missioner! Tid til Prestige?`,
                            type: 'success'
                        }
                    };
                }

                const reqXP = Math.floor(1000 * Math.pow(1.5, s.level));
                if (s.xp >= reqXP && s.level < CONFIG.levelTitles.length) {
                    s.level++; s.xp -= reqXP;
                    s.pendingEvent = { type: 'story', data: { title: `LEVEL UP: ${CONFIG.levelTitles[s.level - 1]}`, msg: `Du er steget i graderne!`, type: 'success' } };
                }

                // 8. WORLD EVENTS (News)
                if (Math.random() < 0.02) {
                    const n = CONFIG.news[Math.floor(Math.random() * CONFIG.news.length)];
                    s.logs = [{ msg: `[NEWS] ${n.msg}`, type: n.type, time: new Date().toLocaleTimeString() }, ...s.logs].slice(0, 50);
                }

                return s;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);
};
