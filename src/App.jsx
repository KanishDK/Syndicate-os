import React, { useState, useEffect } from 'react';
import { CONFIG } from './config/gameConfig';
import { formatNumber } from './utils/gameMath';
import { useGame } from './context/GameContext';

import ConsoleView from './components/ConsoleView';
import Header from './components/Header';
import HelpModal from './components/HelpModal';
import NavButton from './components/NavButton';
import SultanTab from './components/SultanTab';
import NetworkTab from './components/NetworkTab';
import EmpireTab from './components/EmpireTab';
import BossModal from './components/BossModal';
import FloatManager from './components/FloatManager';
import ProductionTab from './components/ProductionTab';
import FinanceTab from './components/FinanceTab';
import ManagementTab from './components/ManagementTab';
import NewsTicker from './components/NewsTicker';

import { defaultState } from './utils/initialState';

function App() {
    // 1. Context Connection
    const { state: gameState, dispatch } = useGame();

    // Legacy Bridge for Components that expect setState
    const setGameState = (update) => dispatch({ type: 'SET_STATE', payload: update });

    // 2. UI State
    const [welcomeModal, setWelcomeModal] = useState(null);
    const [settingsModal, setSettingsModal] = useState(false);
    const [helpModal, setHelpModal] = useState(false);
    const [raidModal, setRaidModal] = useState(null);
    const [activeTab, setActiveTab] = useState('production');

    // 3. Effect: Check Offline Report
    useEffect(() => {
        if (gameState && gameState.offlineReport) {
            setWelcomeModal(gameState.offlineReport);
            // Clear report to prevent loop
            setGameState(prev => {
                const ns = { ...prev };
                delete ns.offlineReport;
                return ns;
            });
        }
    }, [gameState?.offlineReport]);

    // 4. Tutorial Engine (Auto-Advance)
    useEffect(() => {
        if (!gameState) return;
        // Step 0: Welcome
        // Step 1: Produce 5 Items
        if (gameState.tutorialStep === 1) {
            const totalProduced = Object.values(gameState.stats.produced).reduce((a, b) => a + b, 0);
            if (totalProduced >= 5) advanceTutorial();
        }
        // Step 2: Sell 5 Items
        if (gameState.tutorialStep === 2) {
            if (gameState.stats.sold >= 5) advanceTutorial();
        }
        // Step 3: Hire/Upgrade
        if (gameState.tutorialStep === 3) {
            const hasStaff = Object.values(gameState.staff).some(v => v > 0 && v !== gameState.staff.junkie);
            const hasUpgrade = Object.values(gameState.upgrades).some((v, i) => v > (i === 0 ? 1 : 0));
            if (hasStaff || hasUpgrade) advanceTutorial();
        }
    }, [gameState?.stats, gameState?.staff, gameState?.upgrades, gameState?.tutorialStep]);

    // 5. Achievement Watcher (Phase 5)
    useEffect(() => {
        if (!gameState) return;

        const newUnlocks = [];
        const unlockedIds = gameState.unlockedAchievements || [];

        CONFIG.achievements.forEach(ach => {
            if (unlockedIds.includes(ach.id)) return; // Already unlocked

            let unlocked = false;
            const r = ach.req;

            if (r.type === 'dirty') unlocked = (gameState.lifetime?.earnings || 0) >= r.val;
            if (r.type === 'clean') unlocked = (gameState.lifetime?.laundered || 0) >= r.val; // Need to ensure lifetime.laundered exists, fallback to stats.laundered if linear
            if (r.type === 'territory') unlocked = gameState.territories.length >= r.val;
            if (r.type === 'prod') unlocked = (gameState.lifetime?.produced?.[r.item] || 0) >= r.val;
            if (r.type === 'stealth') unlocked = gameState.heat === 0 && gameState.dirtyCash >= 1000000;
            if (r.type === 'prestige') unlocked = (gameState.prestige?.level || 0) >= r.val;
            if (r.type === 'crypto') unlocked = (gameState.crypto?.wallet?.[r.coin] || 0) >= r.val;

            if (unlocked) {
                newUnlocks.push(ach);
            }
        });

        if (newUnlocks.length > 0) {
            setGameState(prev => ({
                ...prev,
                unlockedAchievements: [...(prev.unlockedAchievements || []), ...newUnlocks.map(a => a.id)],
                logs: [{ msg: `ACHIEVEMENT UNLOCKED: ${newUnlocks[0].name}`, type: 'success', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
            }));
            // Show Modal for the first one found
            setRaidModal({
                type: 'story',
                result: 'win',
                title: 'ACHIEVEMENT UNLOCKED',
                msg: `${newUnlocks[0].name}: ${newUnlocks[0].desc}`,
                lost: {}
            });
        }
    }, [gameState?.lifetime, gameState?.territories, gameState?.crypto, gameState?.prestige, gameState?.heat]);

    // Initial Welcome Trigger
    useEffect(() => {
        if (gameState && gameState.tutorialStep === 0 && gameState.level === 1 && !gameState.welcomeShown) {
            setRaidModal({
                title: 'VELKOMMEN TIL GADEN',
                msg: `Du er ny her, ikke? ${CONFIG.pols.name} vil gerne tale med dig. Tjek din 'Network' fane for at komme i gang.`,
                type: 'story',
                onClose: () => advanceTutorial()
            });
        }
    }, [gameState?.tutorialStep]);

    // Event Sync
    useEffect(() => {
        if (gameState?.pendingEvent) {
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
            // Clear event
            setTimeout(() => {
                setGameState(prev => ({ ...prev, pendingEvent: null }));
            }, 100);
        }
    }, [gameState?.pendingEvent]);

    const advanceTutorial = () => {
        setGameState(prev => ({ ...prev, tutorialStep: prev.tutorialStep + 1 }));
    };

    // --- ACTIONS ---
    const addLog = (msg, type = 'system') => {
        setGameState(prev => ({
            ...prev,
            logs: [{ msg, type, time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
        }));
    };

    const addFloat = (text, x, y, color = 'text-white') => {
        const id = Date.now() + Math.random();
        setGameState(prev => ({
            ...prev,
            floats: [...(prev.floats || []).slice(-4), { id, text, x, y, color }]
        }));
        setTimeout(() => {
            setGameState(prev => ({
                ...prev,
                floats: (prev.floats || []).filter(f => f.id !== id)
            }));
        }, 800);
    };

    const hardReset = () => {
        if (confirm("ER DU SIKKER? DETTE SLETTER ALT FREMSKRIDT PERMANENT!")) {
            localStorage.removeItem('syndicate_os_danish_tycoon_v1'); // Hardcoded key fallback or import
            location.reload();
        }
    };

    const exportSave = () => {
        const data = btoa(JSON.stringify(gameState));
        navigator.clipboard.writeText(data).then(() => alert("Gemt data kopieret!"));
    };

    const importSave = () => {
        const data = prompt("Indsæt save data:");
        if (data) {
            try {
                const parsed = JSON.parse(atob(data));
                dispatch({ type: 'SET_STATE', payload: parsed });
                // We should probably save immediately or reload, but setting state works
            } catch (e) {
                alert("Ugyldig data");
            }
        }
    };

    const handleNavClick = (tab) => setActiveTab(tab);

    const doPrestige = () => {
        if (gameState.level < 10) return;
        if (!confirm("ER DU SIKKER? DETTE NULSTILLER ALT MEN GIVER DIG EN PERMANENT FORDEL!")) return;

        const lifetimeEarnings = (gameState.lifetime?.earnings || 0);
        // Geometric Scaling: Sqrt(Lifetime / 1M). Example: 100M -> x10. 1B -> x31.
        const calculatedMult = Math.max(1.5, Math.floor(Math.sqrt(lifetimeEarnings / 1000000)));

        const newPrestige = {
            level: currentPrestige.level + 1,
            multiplier: calculatedMult,
            currency: currentPrestige.currency + Math.floor(calculatedMult / 2) + 1,
            perks: currentPrestige.perks || {}
        };

        const newState = {
            ...defaultState,
            prestige: newPrestige,
            lifetime: gameState.lifetime || defaultState.lifetime, // Persist lifetime stats!
            logs: [{ msg: `VELKOMMEN TIL DIT NYE LIV. Prestige Level ${newPrestige.level}. Multiplier: x${newPrestige.multiplier}`, type: 'success', time: new Date().toLocaleTimeString() }]
        };

        setGameState(newState);
        // Note: Context auto-saves, but we can force it if needed.

        setRaidModal({
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
                    logs: [{ msg: `BOSS BESEJRET!`, type: 'success', time: new Date().toLocaleTimeString() }, ...prev.logs],
                    pendingEvent: {
                        type: 'story',
                        data: {
                            title: 'BYENS NYE KONGE',
                            msg: `Du har besejret Bossen!`,
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

    // Keyboard Shortcuts
    useEffect(() => {
        const handleGlobalKeys = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.key === '1') setActiveTab('sultan');
            if (e.key === '2') setActiveTab('production');
            if (e.key === '3') setActiveTab('network');
            if (e.key === '4') setActiveTab('finance');
            if (e.key === '5') setActiveTab('management');
            if (e.key === '6') setActiveTab('empire');
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
    }, [settingsModal, welcomeModal, raidModal]);

    // Handle Custom Events (from deep components like EmpireTab)
    useEffect(() => {
        const handleBuyPerk = (e) => {
            const { id, cost } = e.detail;
            setGameState(prev => {
                const currency = prev.prestige?.currency || 0;
                if (currency < cost) return prev; // Safety Check

                const currentLvl = prev.prestige?.perks?.[id] || 0;

                return {
                    ...prev,
                    prestige: {
                        ...prev.prestige,
                        currency: currency - cost,
                        perks: {
                            ...prev.prestige.perks,
                            [id]: currentLvl + 1
                        }
                    },
                    logs: [{ msg: `Købte Perk: ${id} (Lvl ${currentLvl + 1})`, type: 'success', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
                };
            });
        };

        window.addEventListener('BUY_PERK', handleBuyPerk);
        return () => window.removeEventListener('BUY_PERK', handleBuyPerk);
    }, []);

    // Safety check if context hasn't loaded yet
    if (!gameState) return <div className="text-white p-10">Loading Syndicate OS...</div>;

    const xpNeeded = Math.floor(1000 * Math.pow(1.5, gameState.level));

    // Shake Effect Logic
    const isRaid = gameState.pendingEvent?.type === 'raid' || (raidModal && raidModal.type !== 'story');
    // Note: We only apply shake to the GAME CONTAINER, not the Modals
    const shakeClass = isRaid ? 'animate-shake-hard' : '';

    return (
        <>
            {/* --- GAME VISUALS CONTAINER --- */}
            {/* Only this part shakes */}
            <div className={`p-2 md:p-4 h-full flex flex-col relative w-full ${shakeClass}`}>
                <div className="scanline"></div>

                <FloatManager gameState={gameState} addFloat={addFloat} />

                {/* FLOATING TEXT */}
                {gameState.floats && gameState.floats.map(f => (
                    <div
                        key={f.id}
                        className={`fixed pointer-events-none z-[60] font-black text-xl ${f.color} float-anim`}
                        style={{ left: f.x, top: f.y }}
                    >
                        {f.text}
                    </div>
                ))}

                {/* HEADER */}
                <div className="fixed top-0 left-0 w-full h-[88px] bg-black/90 backdrop-blur-md z-40 border-b border-white/10 shadow-2xl">
                    <Header
                        state={gameState}
                        xpNeeded={xpNeeded}
                        setHelpModal={setHelpModal}
                        setSettingsModal={setSettingsModal}
                    />
                </div>

                {/* NEWS */}
                <NewsTicker logs={gameState.logs} />

                {/* MAIN AREA */}
                <div className="fixed inset-0 top-[100px] flex flex-col overflow-hidden bg-gradient-to-br from-[#050505] to-[#0a0a0c]">
                    <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>

                    <ConsoleView logs={gameState.logs} />

                    <div className="flex items-center gap-1 p-2 border-b border-white/5 bg-[#050505]/50 backdrop-blur shrink-0 overflow-x-auto custom-scrollbar">
                        <NavButton active={activeTab === 'sultan'} onClick={() => handleNavClick('sultan')} icon="fa-comment-dots" label="Sultanen" color="text-amber-500" />
                        <NavButton active={activeTab === 'production'} onClick={() => handleNavClick('production')} icon="fa-flask" label="Produktion" color="text-emerald-400" />
                        <NavButton active={activeTab === 'network'} onClick={() => handleNavClick('network')} icon="fa-globe" label="Gaden" color="text-indigo-400" />
                        <NavButton
                            active={activeTab === 'finance'}
                            onClick={() => handleNavClick('finance')}
                            icon="fa-sack-dollar"
                            label="Finans"
                            color="text-amber-400"
                            alert={gameState.dirtyCash > 5000 && activeTab !== 'finance'}
                        />
                        <NavButton active={activeTab === 'management'} onClick={() => handleNavClick('management')} icon="fa-briefcase" label="Operationer" color="text-blue-400" />
                        <NavButton active={activeTab === 'empire'} onClick={() => handleNavClick('empire')} icon="fa-crown" label="Imperiet" color="text-purple-400" />
                    </div>

                    <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar relative z-10 p-4 md:p-8 lg:p-10 pb-32 overscroll-contain">
                        {activeTab === 'sultan' && <SultanTab state={gameState} setState={setGameState} addLog={addLog} />}
                        {activeTab === 'production' && <ProductionTab state={gameState} setState={setGameState} addLog={addLog} addFloat={addFloat} />}
                        {activeTab === 'network' && <NetworkTab state={gameState} setState={setGameState} addLog={addLog} />}
                        {activeTab === 'finance' && <FinanceTab state={gameState} setState={setGameState} addLog={addLog} />}
                        {activeTab === 'management' && <ManagementTab state={gameState} setState={setGameState} addLog={addLog} />}
                        {activeTab === 'empire' && <EmpireTab state={gameState} doPrestige={doPrestige} />}
                    </main>
                </div>
            </div>

            {/* --- OVERLAYS & MODALS (STABLE - DO NOT SHAKE) --- */}
            {/* These exist outside the shake container */}

            {/* TUTORIAL POPUP */}
            {gameState.level === 1 && gameState.tutorialStep < 4 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-[600px] z-[80] pointer-events-none">
                    <div className="bg-indigo-600 text-white p-4 rounded-xl shadow-2xl border border-indigo-400 flex items-start gap-4 animate-bounce-slight pointer-events-auto">
                        <div className="w-10 h-10 shrink-0 bg-white/20 rounded-full flex items-center justify-center text-xl">
                            <i className="fa-solid fa-graduation-cap"></i>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold uppercase text-sm mb-1 tracking-wider text-indigo-200">
                                TUTORIAL: {
                                    gameState.tutorialStep === 0 ? 'TRIN 1: PRODUKTION' :
                                        gameState.tutorialStep === 1 ? 'TRIN 2: DISTRIBUTION' :
                                            gameState.tutorialStep === 2 ? 'TRIN 3: HVIDVASK' :
                                                'TRIN 4: AUTOMATISERING'
                                }
                            </h4>
                            <p className="text-sm leading-relaxed">
                                {
                                    gameState.tutorialStep === 0 ? 'Gå til "PRODUKTION" (Kolbe Ikonet). Tryk på Lys Skive for at producere dine første varer.' :
                                        gameState.tutorialStep === 1 ? 'Klik "SÆLG 10" på produktionskortet. Dette giver Sorte Penge, men øger dit Heat (Politi risiko).' :
                                            gameState.tutorialStep === 2 ? 'Sorte penge kan ikke bruges til alt. Gå til "FINANS" fanen og Hvidvask dem til Ren Kapital.' :
                                                'Gå til "OPERATIONER" og ansæt en Pusher. Han sælger automatisk for dig, så du kan fokusere på strategien.'
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
                                Luk
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {welcomeModal && (
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
            )}

            {raidModal && (
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
            )}

            {gameState.boss.active && (
                <BossModal boss={gameState.boss} onAttack={attackBoss} />
            )}

            {settingsModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl max-w-sm w-full">
                        <h3 className="text-xl font-bold text-white mb-6">Indstillinger</h3>
                        <div className="space-y-3">
                            <button onClick={exportSave} className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-lg border border-white/5">Eksporter Save</button>
                            <button onClick={importSave} className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-lg border border-white/5">Importer Save</button>
                            <button onClick={hardReset} className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-lg border border-red-500/20 mt-4">Nulstil Alt</button>
                            <button onClick={() => setSettingsModal(false)} className="w-full py-3 mt-4 text-zinc-500 hover:text-white">Luk</button>
                            <div className="mt-4 text-center text-[10px] text-zinc-600 font-mono">
                                Syndicate OS v{CONFIG.includeVersion || gameState.version || 'UNKNOWN'}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {helpModal && <HelpModal onClose={() => setHelpModal(false)} />}
        </>
    );
}

export default App;
