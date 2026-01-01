import React from 'react';
import { CONFIG } from '../config/gameConfig';
import { formatNumber } from '../utils/gameMath';

const SultanTab = ({ state, setState, addLog }) => {
    // Phase 1: Services (The Back Room)
    // Phase 2: Mission Dossier

    const activeMission = CONFIG.missions.find(m => !state.completedMissions.includes(m.id)) || state.dailyMission;

    // --- ACTIONS ---
    const buyBribe = () => {
        const cost = Math.floor(state.heat * 500); // Scale cost with Heat
        if (state.heat < 5) {
            addLog("Sultanen: Du er ikke varm nok til at spilde mine penge.", 'warning');
            return;
        }
        if (state.cleanCash >= cost) {
            setState(prev => ({
                ...prev,
                cleanCash: prev.cleanCash - cost,
                heat: Math.max(0, prev.heat - 10)
            }));
            addLog("Politiet ser den anden vej. (-10 Heat)", 'success');
        }
    };

    const buyHype = () => {
        const cost = 25000;
        if (state.cleanCash >= cost) {
            setState(prev => ({
                ...prev,
                cleanCash: prev.cleanCash - cost,
                activeBuffs: { ...prev.activeBuffs, hype: Date.now() + 120000 } // 2 mins
            }));
            addLog("HYPE STARTET! Salg er fordoblet i 2 minutter!", 'success');
        }
    };

    const isActive = (type) => state.activeBuffs?.[type] > Date.now();
    const timeLeft = (type) => Math.floor((state.activeBuffs?.[type] - Date.now()) / 1000);

    const handleChoice = (choice) => {
        setState(prev => {
            let s = { ...prev };
            const ef = choice.effect;
            if (ef.chance) {
                if (Math.random() < ef.chance) {
                    if (ef.success?.money) s.cleanCash += ef.success.money;
                    addLog(`Gambling lykkedes!`, 'success');
                } else {
                    if (ef.fail?.heat) s.heat += ef.fail.heat;
                    addLog(`Gambling fejlede... Heat steg.`, 'error');
                }
            } else {
                if (ef.money) s.cleanCash += ef.money;
                if (ef.rival) {
                    if (!s.rival) s.rival = { hostility: 0 };
                    s.rival.hostility += ef.rival;
                }
                if (ef.heat) s.heat += ef.heat;
            }
            return s;
        });
    };

    return (
        <div className="max-w-6xl mx-auto h-full flex flex-col gap-6">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-amber-500 flex items-center gap-3">
                <i className="fa-solid fa-crown"></i> Sultanens Baglokale
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* COL 1: SERVICES */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-4 shadow-xl">
                        <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                            <i className="fa-solid fa-handshake"></i> Tjenester
                        </h3>

                        <div className="space-y-3">
                            {/* BRIBE */}
                            <div className="p-3 bg-zinc-900/30 rounded-xl border border-white/5 flex flex-col gap-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-xs font-bold text-white uppercase">Smør Osten</div>
                                        <div className="text-[10px] text-zinc-500">Bestik politiet for at glemme dig.</div>
                                    </div>
                                    <div className="w-8 h-8 rounded bg-blue-900/20 text-blue-400 flex items-center justify-center">
                                        <i className="fa-solid fa-scale-unbalanced"></i>
                                    </div>
                                </div>
                                <button
                                    onClick={buyBribe}
                                    disabled={state.cleanCash < Math.floor(state.heat * 500) || state.heat < 1}
                                    className="w-full py-2 bg-zinc-800 hover:bg-blue-600 hover:text-white text-zinc-400 text-[10px] font-bold uppercase rounded transition-all flex justify-between px-3"
                                >
                                    <span>Reducer Heat (-10)</span>
                                    <span>{state.heat > 0 ? formatNumber(Math.floor(state.heat * 500)) : 0} kr</span>
                                </button>
                            </div>

                            {/* HYPE */}
                            <div className={`p-3 rounded-xl border flex flex-col gap-2 transition-all ${isActive('hype') ? 'bg-amber-900/10 border-amber-500/30' : 'bg-zinc-900/30 border-white/5'}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-xs font-bold text-white uppercase flex items-center gap-2">
                                            Skab Hype
                                            {isActive('hype') && <span className="text-[9px] bg-amber-500 text-black px-1.5 rounded animate-pulse">AKTIV: {timeLeft('hype')}s</span>}
                                        </div>
                                        <div className="text-[10px] text-zinc-500">2x Salgshastighed i 2 minutter.</div>
                                    </div>
                                    <div className={`w-8 h-8 rounded flex items-center justify-center ${isActive('hype') ? 'bg-amber-500 text-black animate-spin-slow' : 'bg-amber-900/20 text-amber-500'}`}>
                                        <i className="fa-solid fa-bullhorn"></i>
                                    </div>
                                </div>
                                <button
                                    onClick={buyHype}
                                    disabled={state.cleanCash < 25000 || isActive('hype')}
                                    className={`w-full py-2 text-[10px] font-bold uppercase rounded transition-all flex justify-between px-3
                                        ${isActive('hype')
                                            ? 'bg-amber-500/20 text-amber-400 cursor-not-allowed border border-amber-500/20'
                                            : state.cleanCash >= 25000 ? 'bg-zinc-800 hover:bg-amber-600 hover:text-white text-zinc-400' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}
                                    `}
                                >
                                    <span>Start Kampagne</span>
                                    <span>25k kr</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* COL 2 & 3: MISSION DOSSIER */}
                <div className="lg:col-span-2">
                    {activeMission ? (
                        <div className="h-full bg-[#111] rounded-xl border border-white/10 relative overflow-hidden flex flex-col">
                            {/* Paper Effect */}
                            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600"></div>

                            <div className="p-6 md:p-8 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <div className="text-[10px] font-mono text-zinc-500 uppercase mb-1">CONTRACT_ID: {activeMission.id.toUpperCase()}</div>
                                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{activeMission.title}</h3>
                                    </div>
                                    <div className="w-16 h-16 rounded-full border-2 border-amber-500/50 bg-amber-500/10 flex items-center justify-center">
                                        <i className="fa-solid fa-file-signature text-2xl text-amber-500"></i>
                                    </div>
                                </div>

                                <div className="prose prose-invert prose-sm mb-8">
                                    <p className="text-zinc-300 italic font-serif text-lg leading-relaxed border-l-4 border-amber-500/30 pl-4 py-2 bg-white/5">
                                        "{activeMission.text}"
                                    </p>
                                </div>

                                {/* REQUIREMENTS PROGRESS */}
                                <div className="bg-black/30 p-4 rounded-xl border border-white/5 mb-6">
                                    <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Mission Objectives</div>

                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
                                            {activeMission.req.type === 'produce' && <i className="fa-solid fa-cubes"></i>}
                                            {activeMission.req.type === 'conquer' && <i className="fa-solid fa-map-location-dot"></i>}
                                            {activeMission.req.type === 'sell' && <i className="fa-solid fa-money-bill-wave"></i>}
                                            {activeMission.req.type === 'hire' && <i className="fa-solid fa-user-tie"></i>}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between text-xs font-mono mb-1">
                                                <span className="text-white">
                                                    {activeMission.req.type === 'produce' && `Producer ${CONFIG.production[activeMission.req.item]?.name || activeMission.req.item}`}
                                                    {activeMission.req.type === 'conquer' && `Erobr ${activeMission.req.amount} Territorier`}
                                                    {activeMission.req.type === 'hire' && `Ansæt ${activeMission.req.amount}x ${CONFIG.staff[activeMission.req.role]?.name}`}
                                                    {activeMission.req.type === 'sell' && `Sælg ${activeMission.req.amount} enheder`}
                                                </span>
                                                {/* Calculated Progress would go here if we tracked cumulative stats for mission specifically. 
                                                    Currently missions check global stats or instant actions. 
                                                    For overhaul, we show the GOAL. 
                                                */}
                                                <span className="text-amber-500">{activeMission.req.amount} Units</span>
                                            </div>
                                            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-amber-500 w-1/2 animate-pulse"></div>
                                                {/* Placeholder width - Connecting real progress requires engine refactor to track 'missionProgress' specifically. 
                                                    For now, we leave it visual or implement simple check if possible.
                                                */}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* REWARDS */}
                                <div className="flex gap-4 mt-auto">
                                    <div className="px-4 py-2 bg-emerald-900/20 border border-emerald-500/20 rounded-lg flex items-center gap-2">
                                        <i className="fa-solid fa-money-bill text-emerald-400"></i>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-emerald-500 uppercase font-bold">Dusør</span>
                                            <span className="text-xs font-mono text-emerald-300">{formatNumber(activeMission.reward.money)} kr</span>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 bg-blue-900/20 border border-blue-500/20 rounded-lg flex items-center gap-2">
                                        <i className="fa-solid fa-star text-blue-400"></i>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-blue-500 uppercase font-bold">Respekt</span>
                                            <span className="text-xs font-mono text-blue-300">+{activeMission.reward.xp} XP</span>
                                        </div>
                                    </div>
                                </div>

                                {activeMission.choices && (
                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {activeMission.choices.map((c, i) => (
                                            <button key={i} onClick={() => handleChoice(c)} className="p-3 bg-zinc-800 hover:bg-zinc-700 border-l-4 border-amber-500 text-left rounded shadow-lg transition-all active:scale-95">
                                                <div className="text-xs font-bold text-white mb-1">Option {String.fromCharCode(65 + i)}</div>
                                                <div className="text-xs text-zinc-400">{c.text}</div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center bg-[#111] rounded-xl border border-white/5 p-8 text-center opacity-50">
                            <i className="fa-solid fa-ban text-4xl text-zinc-600 mb-4"></i>
                            <h3 className="text-xl font-bold text-zinc-400 uppercase">Ingen Aktive Kontrakter</h3>
                            <p className="text-zinc-600 text-sm max-w-xs mx-auto mt-2">Vent på at Sultanen kontakter dig, eller tjek Daily Missions (Kommer snart).</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SultanTab;
