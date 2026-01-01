import React from 'react';
import { CONFIG } from '../config/gameConfig';
import { formatNumber } from '../utils/gameMath';

const SultanTab = ({ state, setState, addLog }) => {
    // Phase 1: Services (The Back Room)
    // Phase 2: Mission Dossier

    const activeStory = state.activeStory;
    const dailyMission = state.dailyMission;

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

    // Helper for Progress
    const getProgress = (m) => {
        if (!m) return { current: 0, target: 1, percent: 0 };
        let current = 0;
        const { type, item, amount, role, id } = m.req;

        if (m.isDaily) {
            const start = m.startStats || {};
            if (type === 'produce') current = (state.stats.produced[item] || 0) - (start.produced?.[item] || 0);
            if (type === 'sell') current = (state.stats.sold || 0) - (start.sold || 0);
            if (type === 'launder') current = (state.stats.laundered || 0) - (start.laundered || 0);
        } else {
            // Logic for absolute (Story) tasks
            if (type === 'produce') current = state.stats.produced[item] || 0;
            if (type === 'sell') current = state.stats.sold || 0;
            if (type === 'launder') current = state.stats.laundered || 0;
            if (type === 'hire') current = state.staff[role] || 0;
            if (type === 'conquer') current = state.territories.length;
            if (type === 'upgrade') current = state.upgrades[id] || 0;
        }
        const percent = Math.min(100, Math.floor((current / amount) * 100));
        return { current: Math.max(0, current), target: amount, percent };
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
                                    className="w-full py-2 bg-zinc-800 active:bg-blue-600 active:text-white text-zinc-400 text-[10px] font-bold uppercase rounded transition-all flex justify-between px-3 active:scale-95"
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
                                            : state.cleanCash >= 25000 ? 'bg-zinc-800 active:bg-amber-600 active:text-white text-zinc-400 active:scale-95' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}
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
                <div className="lg:col-span-2 space-y-6">
                    {activeStory && (
                        <MissionCard
                            mission={activeStory}
                            progress={getProgress(activeStory)}
                            title="Hovedopgave"
                            handleChoice={handleChoice}
                        />
                    )}

                    {dailyMission && (
                        <MissionCard
                            mission={dailyMission}
                            progress={getProgress(dailyMission)}
                            title="Daglig Kontrakt"
                            handleChoice={handleChoice}
                        />
                    )}

                    {!activeStory && !dailyMission && (
                        <div className="h-full flex flex-col items-center justify-center bg-[#111] rounded-xl border border-white/5 p-8 text-center opacity-50 min-h-[300px]">
                            <i className="fa-solid fa-ban text-4xl text-zinc-600 mb-4"></i>
                            <h3 className="text-xl font-bold text-zinc-400 uppercase">Ingen Aktive Kontrakter</h3>
                            <p className="text-zinc-600 text-sm max-w-xs mx-auto mt-2">Sultanen har intet til dig lige nu. Tjek tilbage om lidt.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const MissionCard = ({ mission, progress, title, handleChoice }) => (
    <div className="bg-[#111] rounded-xl border border-white/10 relative overflow-hidden flex flex-col min-h-[200px]">
        {/* Paper Effect */}
        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600"></div>

        <div className="p-5 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="text-[9px] font-mono text-amber-500/70 uppercase mb-1">
                        {title} • {mission.isDaily ? 'FLASH_OPS' : `STORY_CONTRACT`}
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">{mission.title}</h3>
                </div>
                <div className="w-10 h-10 rounded-full border border-amber-500/30 bg-amber-500/5 flex items-center justify-center text-amber-500">
                    <i className={`fa-solid ${mission.isDaily ? 'fa-bolt' : 'fa-file-signature'}`}></i>
                </div>
            </div>

            <p className="text-zinc-400 text-xs italic mb-4 leading-relaxed line-clamp-2">
                "{mission.text}"
            </p>

            {/* PROGRESS */}
            <div className="bg-black/40 p-3 rounded-lg border border-white/5 mb-4">
                <div className="flex justify-between text-[10px] font-mono mb-1">
                    <span className="text-zinc-500">Status:</span>
                    <span className={progress.percent >= 100 ? 'text-emerald-500' : 'text-amber-500'}>
                        {formatNumber(progress.current)} / {formatNumber(progress.target)}
                    </span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-amber-500 bg-gradient-to-r from-amber-600 to-yellow-500 transition-all duration-1000"
                        style={{ width: `${progress.percent}%` }}
                    ></div>
                </div>
            </div>

            {/* REWARDS & CHOICES */}
            <div className="flex justify-between items-center gap-4">
                <div className="flex gap-2 text-[9px]">
                    <span className="text-emerald-400 font-bold">+{formatNumber(mission.reward.money)} kr</span>
                    <span className="text-blue-400 font-bold">+{mission.reward.xp} XP</span>
                </div>

                {mission.choices && (
                    <div className="flex gap-2">
                        {mission.choices.map((c, i) => (
                            <button
                                key={i}
                                onClick={() => handleChoice(c)}
                                className="px-2 py-1 bg-zinc-800 active:bg-amber-600 active:text-white text-[8px] font-bold uppercase rounded border border-white/5 transition-all active:scale-95"
                            >
                                Valg {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    </div>
);

export default SultanTab;
