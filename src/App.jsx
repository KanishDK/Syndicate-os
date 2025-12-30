import React, { useState, useEffect } from 'react';
import { CONFIG, GAME_VERSION, STORAGE_KEY } from './config/gameConfig';
import { formatNumber, getIncomePerSec } from './utils/gameMath';
import { useGameLoop } from './hooks/useGameLoop';
import { useAutoSave } from './hooks/useAutoSave';
import { useProduction } from './hooks/useProduction';
import { useFinance } from './hooks/useFinance';
import { useManagement } from './hooks/useManagement';

import { defaultState } from './utils/initialState';

import ConsoleView from './components/ConsoleView';
import Header from './components/Header';
import HelpModal from './components/HelpModal';
import NavButton from './components/NavButton';
import SultanTab from './components/SultanTab';
import NetworkTab from './components/NetworkTab';
import EmpireTab from './components/EmpireTab';
import BossModal from './components/BossModal';
import NewsTicker from './components/NewsTicker';
import ProductionCard from './components/ProductionCard';
import ProductionTab from './components/ProductionTab';
import FinanceTab from './components/FinanceTab';
import ManagementTab from './components/ManagementTab';






function App() {
    const [welcomeModal, setWelcomeModal] = useState(null);
    const [settingsModal, setSettingsModal] = useState(false);
    const [helpModal, setHelpModal] = useState(false); // New Help Modal
    const [raidModal, setRaidModal] = useState(null);
    const [activeTab, setActiveTab] = useState('production');

    // Initialize state from localStorage or default
    const [gameState, setGameState] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);

                // Version Check (Optional, since key changed it's fresh anyway, but good for v25.1 updates)
                if (parsed.version !== GAME_VERSION) {
                    // console.log("Version mismatch. Migrating or Resetting logic could go here.");
                    // For now, since we just wiped via Key change, we just load.
                    // If we update to 25.1, we can add migration here.
                }

                // Deep merge safety
                return {
                    ...defaultState, ...parsed,
                    inv: { ...defaultState.inv, ...parsed.inv },
                    items: { ...defaultState.items, ...parsed.items },
                    staff: { ...defaultState.staff, ...parsed.staff },
                    autoSell: parsed.autoSell || {} // Fix: Hydrate or default
                };
            } catch (e) {
                console.error("Save data corrupted", e);
                return defaultState;
            }
        }
        return defaultState;
    });

    // --- OFFLINE CALCULATION & TUTORIAL ---
    useEffect(() => {
        // 1. Offline Earnings
        if (gameState.lastSaveTime) {
            const now = Date.now();
            const diff = now - gameState.lastSaveTime;
            const minutes = Math.floor(diff / 60000);

            if (minutes >= 1) { // Trigger after 1 minute offline
                let offlineDirty = 0;
                let offlineClean = 0;

                // Territory Income
                gameState.territories.forEach(tid => {
                    const t = CONFIG.territories.find(ter => ter.id === tid);
                    if (t) {
                        if (t.type === 'clean') offlineClean += (t.income * 60 * minutes);
                        else offlineDirty += (t.income * 60 * minutes);
                    }
                });

                // Calculate Estimated Staff Income (v26.2 addition)
                let staffIncomePerSec = 0;
                if (gameState.staff) {
                    const hashPrice = CONFIG.production.hash_lys.baseRevenue || 5;
                    const moerkPrice = CONFIG.production.hash_moerk.baseRevenue || 45;
                    const speedPrice = CONFIG.production.speed.baseRevenue || 140;

                    staffIncomePerSec += (gameState.staff.junkie || 0) * 0.3 * hashPrice;
                    staffIncomePerSec += (gameState.staff.grower || gameState.staff.gardener || 0) * 0.2 * moerkPrice;
                    staffIncomePerSec += (gameState.staff.chemist || 0) * 0.1 * speedPrice;
                }

                // Interest on Debt (v26.2 Fix)
                const interest = Math.floor((gameState.debt || 0) * 0.01 * minutes);

                // Total Offline
                const totalRate = (offlineDirty + offlineClean) / (minutes * 60) + staffIncomePerSec;
                const totalOfflineEarnings = Math.floor(totalRate * minutes * 60 * 0.5); // 50% Efficiency

                if (totalOfflineEarnings > 0 || interest > 0) {
                    setWelcomeModal({
                        time: minutes,
                        earnings: totalOfflineEarnings,
                        interest: interest
                    });

                    setGameState(prev => ({
                        ...prev,
                        dirtyCash: prev.dirtyCash + totalOfflineEarnings,
                        cleanCash: prev.cleanCash + offlineClean, // Clean is from territories
                        debt: prev.debt + interest,
                        lastSaveTime: Date.now(),
                        logs: [{ msg: `Velkommen tilbage! Du tjente ${totalOfflineEarnings.toLocaleString()} kr mens du var væk.`, type: 'success', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
                    }));
                }
            }
        }
    }, []);

    // --- TUTORIAL ENGINE (AUTO-ADVANCE) ---
    useEffect(() => {
        // Step 0: Welcome (Handled by Modal Close -> advanceTutorial)

        // Step 1: Produce 5 Items (Any)
        if (gameState.tutorialStep === 1) {
            const totalProduced = Object.values(gameState.stats.produced).reduce((a, b) => a + b, 0);
            if (totalProduced >= 5) advanceTutorial();
        }

        // Step 2: Sell 5 Items (Any)
        if (gameState.tutorialStep === 2) {
            if (gameState.stats.sold >= 5) advanceTutorial();
        }

        // Step 3: Hire Staff or Buy Upgrade
        if (gameState.tutorialStep === 3) {
            const hasStaff = Object.values(gameState.staff).some(v => v > 0 && v !== gameState.staff.junkie); // Junkie doesn't count as "real" hire maybe?
            const hasUpgrade = Object.values(gameState.upgrades).some((v, i) => v > (i === 0 ? 1 : 0)); // Check if any upgrade increased (Warehouse starts at 1)
            if (hasStaff || hasUpgrade) advanceTutorial();
        }

    }, [gameState.stats, gameState.staff, gameState.upgrades, gameState.tutorialStep]);

    // Initial Welcome Trigger
    useEffect(() => {
        if (gameState.tutorialStep === 0 && gameState.level === 1 && !gameState.welcomeShown) {
            setRaidModal({
                title: 'VELKOMMEN TIL GADEN',
                msg: `Du er ny her, ikke? ${CONFIG.pols.name} vil gerne tale med dig. Tjek din 'Network' fane for at komme i gang.`,
                type: 'story',
                onClose: () => advanceTutorial() // Hook into close
            });
            // Mark as shown to prevent loop? 
            // Better: rely on tutorialStep advancement.
        }
    }, []);

    // --- EVENT SYNC (Data -> UI) ---
    useEffect(() => {
        if (gameState.pendingEvent) {
            const evt = gameState.pendingEvent;

            if (evt.type === 'raid') {
                setRaidModal(evt.data);
            } else if (evt.type === 'story') {
                setRaidModal({
                    type: evt.data.type || 'story',
                    result: 'info',
                    title: evt.data.title,
                    msg: evt.data.msg,
                    lost: {}
                });
            }

            // Clear the pending event so it doesn't trigger again
            // Using setTimeout to ensure the modal state update isn't batched away or overwritten if that's the issue
            setTimeout(() => {
                setGameState(prev => ({ ...prev, pendingEvent: null }));
            }, 100);
        }
    }, [gameState.pendingEvent]);


    // --- HELPER: Logs ---
    const addLog = (msg, type = 'system') => {
        setGameState(prev => {
            const newLogs = [{ msg, type, time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50);
            return { ...prev, logs: newLogs };
        });
    };

    // --- HELPER: Floating Text ---
    const addFloat = (text, x, y, color = 'text-white') => {
        const id = Date.now() + Math.random();
        setGameState(prev => ({
            ...prev,
            // Vi holder kun de nyeste 5 floats i arrayet for at undgå memory leaks ved spam click
            floats: [...(prev.floats || []).slice(-4), { id, text, x, y, color }]
        }));

        // Timeout cleanup matcher CSS animation
        setTimeout(() => {
            setGameState(prev => ({
                ...prev,
                floats: (prev.floats || []).filter(f => f.id !== id)
            }));
        }, 800);
    };



    // --- SETTINGS ACTIONS ---
    const hardReset = () => {
        if (confirm("ER DU SIKKER? DETTE SLETTER ALT FREMSKRIDT PERMANENT!")) {
            localStorage.removeItem(STORAGE_KEY);
            location.reload();
        }
    };

    const exportSave = () => {
        const data = btoa(JSON.stringify(gameState));
        navigator.clipboard.writeText(data).then(() => {
            alert("Gemt data kopieret til udklipsholder!");
        });
    };

    const importSave = () => {
        const data = prompt("Indsæt din gemte data her:");
        if (data) {
            try {
                const parsed = JSON.parse(atob(data));
                localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
                location.reload();
            } catch (e) {
                alert("Ugyldig data format!");
            }
        }
    };

    // --- KEYBOARD SHORTCUTS (v27.1) ---
    React.useEffect(() => {
        const handleGlobalKeys = (e) => {
            // Ignore if in input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            // Tab Navigation 1-5 (Adjusted for new SultanTab order)
            if (e.key === '1') setActiveTab('sultan');
            if (e.key === '2') setActiveTab('production');
            if (e.key === '3') setActiveTab('network');
            if (e.key === '4') setActiveTab('finance');
            if (e.key === '5') setActiveTab('management');
            if (e.key === '6') setActiveTab('empire');

            // Escape to close modals
            if (e.key === 'Escape') {
                if (settingsModal) setSettingsModal(false);
                if (welcomeModal) setWelcomeModal(null);
                if (raidModal) {
                    setRaidModal(null);
                    if (raidModal.onClose) raidModal.onClose();
                }
            }
        };

        window.addEventListener('keydown', handleGlobalKeys);
        return () => window.removeEventListener('keydown', handleGlobalKeys);
    }, [settingsModal, welcomeModal, raidModal]); // Re-bind if modals change to ensure closure freshness? Actually setState handles functional updates mostly, but nice to be safe.

    // --- AUTOSAVE ---
    const advanceTutorial = () => {
        setGameState(prev => ({ ...prev, tutorialStep: prev.tutorialStep + 1 }));
    };

    // Added dependencies for accurate logic

    // --- NAVIGATION ---
    const handleNavClick = (tab) => {
        setActiveTab(tab);
    };

    // --- PRESTIGE SYSTEM ---
    const doPrestige = () => {
        if (gameState.level < 10) return;
        if (!confirm("ER DU SIKKER? DETTE NULSTILLER ALT MEN GIVER DIG EN PERMANENT FORDEL!")) return;

        const currentPrestige = gameState.prestige || defaultState.prestige;
        const newPrestige = {
            level: currentPrestige.level + 1,
            multiplier: currentPrestige.multiplier + 0.5, // +50% per reset
            currency: currentPrestige.currency + 1
        };

        const newState = {
            ...defaultState,
            prestige: newPrestige,
            lifetime: gameState.lifetime || defaultState.lifetime, // Preserve lifetime stats
            logs: [{ msg: `VELKOMMEN TIL DIT NYE LIV. Prestige Level ${newPrestige.level}. Multiplier: x${newPrestige.multiplier}`, type: 'success', time: new Date().toLocaleTimeString() }]
        };

        setGameState(newState);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
        setRaidModal({ // Reusing modal for Celebration
            type: 'story',
            result: 'win',
            title: 'EXIT SCAM SUCCESSFUL',
            msg: `Du slap væk med pengene! Nyt liv startet med x${newPrestige.multiplier} indtjening.`,
            lost: {}
        });
        setActiveTab('production');
    };

    const attackBoss = () => {
        setGameState(prev => {
            if (!prev.boss.active) return prev;
            const dmg = prev.boss.damagePerClick || 10;
            const newHp = prev.boss.hp - dmg;

            if (newHp <= 0) {
                return {
                    ...prev,
                    boss: { ...prev.boss, active: false, hp: 0 },
                    completedMissions: [...prev.completedMissions, 'boss_defeated'],
                    xp: prev.xp + CONFIG.boss.reward.xp,
                    dirtyCash: prev.dirtyCash + CONFIG.boss.reward.money,
                    logs: [{ msg: `BOSS BESEJRET! Du overtog tronen.`, type: 'success', time: new Date().toLocaleTimeString() }, ...prev.logs],
                    pendingEvent: {
                        type: 'story',
                        data: {
                            title: 'BYENS NYE KONGE',
                            msg: `Du har besejret Bossen! Du modtog ${CONFIG.boss.reward.money} kr. og ${CONFIG.boss.reward.xp} XP.`,
                            type: 'success'
                        }
                    }
                };
            }

            return {
                ...prev,
                boss: { ...prev.boss, hp: newHp }
            };
        });
    };

    // --- GAME LOOP ---
    useGameLoop(gameState, setGameState);

    // --- PERSISTENCE (Auto-save) ---
    useAutoSave(setGameState);



    const xpNeeded = Math.floor(1000 * Math.pow(1.5, gameState.level));
    // Adjusting L745 to use this constant? No, L745 is hardcoded. Let's align them.

    return (
        <>
            <div className="p-2 md:p-4 h-full flex flex-col relative">
                <div className="scanline"></div>

                {/* FLOATING TEXT LAYER */}
                {gameState.floats && gameState.floats.map(f => (
                    <div
                        key={f.id}
                        className={`fixed pointer-events-none z-[60] font-black text-xl ${f.color} float-anim`}
                        style={{ left: f.x, top: f.y }}
                    >
                        {f.text}
                    </div>
                ))}

                {/* TOP BAR - COMMAND CENTER (v27.1 FIXED LAYOUT) */}
                <div className="fixed top-0 left-0 w-full h-16 bg-black/90 backdrop-blur-md z-40 flex justify-between items-center px-4 border-b border-white/10 shadow-2xl">

                    <Header
                        state={gameState}
                        xpNeeded={xpNeeded}
                        setHelpModal={setHelpModal}
                        setSettingsModal={setSettingsModal}
                    />
                </div>

                {/* HEAT WIDGET */}
                <div className="text-right block">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Heat</div>
                    <div className="flex items-center justify-end gap-2">
                        <span className={`font-mono font-bold ${gameState.heat > 80 ? 'text-red-500 animate-pulse' : 'text-zinc-400'}`}>{Math.floor(gameState.heat)}%</span>
                        <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-500 ${gameState.heat > 80 ? 'bg-red-500' : 'bg-red-700'}`} style={{ width: `${Math.min(100, gameState.heat)}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Ren Kapital</div>
                    <div className="text-lg md:text-2xl font-black text-emerald-400 mono text-glow tracking-tight">
                        {formatNumber(gameState.cleanCash)} <span className="text-xs md:text-sm text-emerald-600">kr.</span>
                    </div>
                </div>
                <div className="text-right block">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Sorte Penge</div>
                    <div className="text-sm md:text-xl font-bold text-red-500 mono tracking-tight">
                        {formatNumber(gameState.dirtyCash)} <span className="text-xs md:text-sm text-red-700">kr.</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button onClick={() => setHelpModal(true)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors" title="Hjælp">
                        <i className="fa-solid fa-question"></i>
                    </button>
                    <button onClick={() => setSettingsModal(true)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
                        <i className="fa-solid fa-gear"></i>
                    </button>
                </div>

                {/* NEWS TICKER (New v26.3) */}
                <NewsTicker logs={gameState.logs} />
                {/* MAIN CONTENT AREA */}

                <div className="fixed inset-0 top-[88px] flex flex-col overflow-hidden bg-gradient-to-br from-[#050505] to-[#0a0a0c]">
                    <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>

                    {/* CONSOLE VIEW (TOP) */}
                    <ConsoleView logs={gameState.logs} />

                    {/* HORIZONTAL TABS (BELOW CONSOLE) */}
                    <div className="flex items-center gap-1 p-2 border-b border-white/5 bg-[#050505]/50 backdrop-blur shrink-0 overflow-x-auto custom-scrollbar">
                        <NavButton active={activeTab === 'sultan'} onClick={() => handleNavClick('sultan')} icon="fa-comment-dots" label="Sultanen" color="text-amber-500" />
                        <NavButton active={activeTab === 'production'} onClick={() => handleNavClick('production')} icon="fa-flask" label="Produktion" color="text-emerald-400" />
                        <NavButton active={activeTab === 'network'} onClick={() => handleNavClick('network')} icon="fa-globe" label="Gaden" color="text-indigo-400" />
                        <NavButton active={activeTab === 'finance'} onClick={() => handleNavClick('finance')} icon="fa-sack-dollar" label="Finans" color="text-amber-400" />
                        <NavButton active={activeTab === 'management'} onClick={() => handleNavClick('management')} icon="fa-briefcase" label="Operationer" color="text-blue-400" />
                        <NavButton active={activeTab === 'empire'} onClick={() => handleNavClick('empire')} icon="fa-crown" label="Imperiet" color="text-purple-400" />
                    </div>

                    {/* TAB CONTENT (MAIN) */}
                    <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar relative z-10 p-4 md:p-8 lg:p-10 pb-32 overscroll-contain">
                        {activeTab === 'sultan' && <SultanTab state={gameState} setState={setGameState} addLog={addLog} />}
                        {activeTab === 'production' && <ProductionTab state={gameState} setState={setGameState} addLog={addLog} addFloat={addFloat} />}
                        {activeTab === 'network' && <NetworkTab state={gameState} setState={setGameState} addLog={addLog} />}
                        {activeTab === 'finance' && <FinanceTab state={gameState} setState={setGameState} addLog={addLog} />}
                        {activeTab === 'management' && <ManagementTab state={gameState} setState={setGameState} addLog={addLog} />}
                        {activeTab === 'empire' && <EmpireTab state={gameState} doPrestige={doPrestige} />}
                    </main>

                    {/* TUTORIAL OVERLAY */}
                    {gameState.level === 1 && gameState.tutorialStep < 4 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-[600px] z-50 pointer-events-none">
                            <div className="bg-indigo-600 text-white p-4 rounded-xl shadow-2xl border border-indigo-400 flex items-start gap-4 animate-bounce-slight pointer-events-auto">
                                <div className="w-10 h-10 shrink-0 bg-white/20 rounded-full flex items-center justify-center text-xl">
                                    <i className="fa-solid fa-graduation-cap"></i>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold uppercase text-sm mb-1 tracking-wider text-indigo-200">
                                        TUTORIAL: {
                                            gameState.tutorialStep === 0 ? 'START DIN FORRETNING' :
                                                gameState.tutorialStep === 1 ? 'SÆLG DINE VARER' :
                                                    gameState.tutorialStep === 2 ? 'VASK DINE PENGE' :
                                                        'UDVID MANDSKABET'
                                        }
                                    </h4>
                                    <p className="text-sm leading-relaxed">
                                        {
                                            gameState.tutorialStep === 0 ? 'Velkommen til København. Du skal bruge varer. Gå til PRODUKTION-fanen og lav noget Lys Skive.' :
                                                gameState.tutorialStep === 1 ? 'Godt. Du har varer. Men varer giver ikke magt. Penge gør. Sælg dine Skiver for at få Sorte Penge.' :
                                                    gameState.tutorialStep === 2 ? 'Sorte penge tiltrækker varmen. Gå til HVIDVASK-fanen og vask dem til Ren Kapital.' :
                                                        'Du kan ikke gøre alt selv. Gå til CREWET og ansæt en Pusher til at sælge for dig automatisk.'
                                        }
                                    </p>
                                    {((gameState.tutorialStep === 0 && gameState.inv.hash_lys > 0) ||
                                        (gameState.tutorialStep === 1 && gameState.dirtyCash > 100) ||
                                        (gameState.tutorialStep === 2 && gameState.cleanCash > 50) ||
                                        (gameState.tutorialStep === 3 && gameState.staff.pusher > 0)) && (
                                            <div className="flex gap-2 mt-3">
                                                <button
                                                    onClick={() => setGameState(p => ({ ...p, tutorialStep: p.tutorialStep + 1 }))}
                                                    className="px-4 py-1.5 bg-white text-indigo-900 font-bold text-xs rounded uppercase hover:bg-indigo-50"
                                                >
                                                    Næste Trin <i className="fa-solid fa-arrow-right ml-1"></i>
                                                </button>
                                            </div>
                                        )}

                                    <button
                                        onClick={() => setGameState(p => ({ ...p, tutorialStep: 99 }))}
                                        className="absolute top-2 right-2 text-indigo-300 hover:text-white text-[10px] font-bold uppercase tracking-wider"
                                    >
                                        Skip
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* MODALS */}
                {
                    welcomeModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                            <div className="bg-zinc-900 border border-emerald-500/30 p-8 rounded-2xl max-w-md w-full shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                                <h2 className="text-2xl font-black text-white mb-2">VELKOMMEN TILBAGE, BOSS</h2>
                                <p className="text-zinc-400 mb-6">Mens du var væk, arbejdede dit syndikat i skyggerne...</p>

                                <div className="space-y-3 mb-8">
                                    <div className="flex justify-between p-3 bg-zinc-800 rounded-lg">
                                        <span className="text-zinc-400">Tid Væk</span>
                                        <span className="font-mono text-white">{welcomeModal.time} min</span>
                                    </div>
                                    <div className="flex justify-between p-3 bg-emerald-900/20 border border-emerald-500/20 rounded-lg">
                                        <span className="text-emerald-400 font-bold">Sort Indkomst</span>
                                        <span className="font-mono text-emerald-300">+{welcomeModal.earnings.toLocaleString()} kr.</span>
                                    </div>
                                    {welcomeModal.interest > 0 && (
                                        <div className="flex justify-between p-3 bg-red-900/20 border border-red-500/20 rounded-lg">
                                            <span className="text-red-400 font-bold">Renter (Gæld)</span>
                                            <span className="font-mono text-red-300">+{welcomeModal.interest.toLocaleString()} kr.</span>
                                        </div>
                                    )}
                                </div>

                                <button onClick={() => setWelcomeModal(null)} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl uppercase tracking-widest transition-all hover:scale-[1.02]">
                                    Modtag Cash
                                </button>
                            </div>
                        </div>
                    )
                }

                {/* OTHER MODALS (Keep existing logic just moved here visually in code structure) */}
                {
                    raidModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-red-900/40 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-300">
                            <div className="bg-black border-2 border-red-500 p-8 rounded-2xl max-w-md w-full shadow-[0_0_100px_rgba(239,68,68,0.4)] relative overflow-hidden">
                                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(220,38,38,0.1)_10px,rgba(220,38,38,0.1)_20px)] opacity-50"></div>
                                <div className="relative z-10 text-center">
                                    <i className="fa-solid fa-siren-on text-6xl text-red-500 mb-6 animate-pulse"></i>
                                    <h2 className="text-3xl font-black text-white italic uppercase mb-2 tracking-tighter">{raidModal.title || 'RAZZIA!'}</h2>
                                    <p className="text-red-200 mb-8 font-medium">{raidModal.msg}</p>

                                    <button onClick={() => {
                                        setRaidModal(null);
                                        if (raidModal.onClose) raidModal.onClose();
                                    }} className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-black rounded-lg uppercase shadow-lg shadow-red-900/50 transition-transform active:scale-95">
                                        Forstået
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* BOSS MODAL */}
                {
                    gameState.boss.active && (
                        <BossModal boss={gameState.boss} onAttack={attackBoss} />
                    )
                }

                {
                    settingsModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                            <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl max-w-sm w-full">
                                <h3 className="text-xl font-bold text-white mb-6">Indstillinger</h3>
                                <div className="space-y-3">
                                    <button onClick={exportSave} className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-lg border border-white/5">Eksporter Save</button>
                                    <button onClick={importSave} className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-lg border border-white/5">Importer Save</button>
                                    <button onClick={hardReset} className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-lg border border-red-500/20 mt-4">Nulstil Alt</button>
                                    <button onClick={() => setSettingsModal(false)} className="w-full py-3 mt-4 text-zinc-500 hover:text-white">Luk</button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {helpModal && <HelpModal onClose={() => setHelpModal(false)} />}
            </div >
        </>
    );
}

export default App;
