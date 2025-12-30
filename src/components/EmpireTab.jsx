import React from 'react';

const EmpireTab = ({ state, doPrestige }) => {
    // REFACTORED v27: The Syndicate Throne (Prestige Hub)
    // Gold/Obsidian Theme. "Exit Scam" mechanic.

    // Calculate Next Level requirement (Example logic - should match actual Game Loop but for display)
    const nextLevelCost = 1000000 * Math.pow(1.5, state.prestige.level || 0);
    const isReady = state.level >= 10; // Hard requirement matching existing button

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 flex items-center gap-3 text-yellow-500">
                <i className="fa-solid fa-crown"></i> Imperiet & Arv
            </h2>

            {/* PRESTIGE DASHBOARD */}
            <div className="relative overflow-hidden rounded-2xl border border-yellow-500/30 bg-black">
                {/* Background Ambience */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.15)_0%,rgba(0,0,0,0)_70%)] animate-pulse"></div>
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.8)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.8)_50%,rgba(0,0,0,0.8)_75%,transparent_75%,transparent)] bg-[length:4px_4px] opacity-20"></div>

                <div className="relative z-10 p-8 text-center">
                    <div className="inline-block relative mb-6">
                        <i className="fa-solid fa-crown text-7xl text-yellow-500 drop-shadow-[0_0_25px_rgba(234,179,8,0.6)]"></i>
                        <div className="absolute -bottom-2 -right-2 bg-yellow-600 text-black text-xs font-black px-2 py-0.5 rounded border border-yellow-400">
                            LVL {state.prestige?.level || 0}
                        </div>
                    </div>

                    <h3 className="text-3xl font-black text-white uppercase tracking-widest mb-1 italic">Syndikat Omdømme</h3>
                    <p className="text-yellow-500/60 text-sm font-mono tracking-widest uppercase mb-8">Global Indflydelse</p>

                    <div className="grid grid-cols-2 max-w-2xl mx-auto gap-4 mb-8">
                        <div className="p-4 bg-zinc-900/80 rounded-xl border border-yellow-500/10 backdrop-blur-sm">
                            <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Globale Indtægter</div>
                            <div className="text-3xl font-mono text-yellow-400 font-bold">x{state.prestige?.multiplier || 1}</div>
                            <div className="text-[9px] text-yellow-500/50 mt-1">Multiplier</div>
                        </div>
                        <div className="p-4 bg-zinc-900/80 rounded-xl border border-yellow-500/10 backdrop-blur-sm">
                            <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Næste Reset Bonus</div>
                            <div className="text-3xl font-mono text-white font-bold text-emerald-400">
                                +{(0.5).toFixed(1)}x
                            </div>
                            <div className="text-[9px] text-emerald-500/50 mt-1">Estimeret</div>
                        </div>
                    </div>

                    {/* EXIT SCAM ACTION */}
                    <div className="max-w-xl mx-auto bg-zinc-900/90 border border-yellow-600/30 p-6 rounded-xl relative group overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>

                        <h4 className="text-sm font-bold text-white uppercase mb-4 flex items-center justify-center gap-2">
                            <i className="fa-solid fa-person-running text-yellow-500"></i> Operation: Exit Scam
                        </h4>

                        <div className="text-xs text-zinc-400 mb-6 space-y-2 text-left bg-black/50 p-4 rounded border border-white/5">
                            <div className="flex items-start gap-2">
                                <i className="fa-solid fa-triangle-exclamation text-red-500 mt-0.5"></i>
                                <span><strong className="text-red-400">DU MISTER:</strong> Alle dine Penge, Sorte Penge, Territorier, Ansatte, Opgraderinger og nuværende Mission-status.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <i className="fa-solid fa-check text-green-500 mt-0.5"></i>
                                <span><strong className="text-green-400">DU BEHOLDER:</strong> Din Imperie-Rank og din permanente Multiplier.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <i className="fa-solid fa-arrow-up-right-dots text-yellow-500 mt-0.5"></i>
                                <span><strong className="text-yellow-400">DU OPNÅR:</strong> En ny start med højere indtjening og adgang til sværere markeder.</span>
                            </div>
                        </div>

                        <button
                            onClick={doPrestige}
                            disabled={!isReady}
                            className={`
                                w-full py-4 font-black rounded-lg uppercase tracking-[0.2em] transition-all shadow-lg relative overflow-hidden group
                                ${isReady
                                    ? 'bg-yellow-600 hover:bg-yellow-500 text-black shadow-yellow-900/40 hover:scale-[1.02]'
                                    : 'bg-zinc-800 text-zinc-600 opacity-80 cursor-not-allowed'
                                }
                            `}
                        >
                            {isReady ? (
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <i className="fa-solid fa-skull"></i> UDFØR EXIT SCAM
                                </span>
                            ) : (
                                <span className="flex flex-col items-center">
                                    <span>LÅST &mdash; KRÆVER LEVEL 10</span>
                                    <span className="text-[9px] mt-1 normal-case tracking-normal text-zinc-500">Du er ikke magtfuld nok til at forsvinde endnu.</span>
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* LEGACY ARCHIVES */}
            <div className="glass p-6 rounded-2xl border-white/5">
                <h3 className="text-xs font-bold text-zinc-500 uppercase mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-box-archive"></i> The Syndicate Archives
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-zinc-900/50 rounded-xl border border-white/5">
                        <div className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1">Total Indtjent</div>
                        <div className="text-sm font-bold text-green-400 mono">
                            {state.lifetime?.earnings ? state.lifetime.earnings.toLocaleString() : 0} kr.
                        </div>
                    </div>
                    <div className="p-4 bg-zinc-900/50 rounded-xl border border-white/5">
                        <div className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1">Sort Økonomi</div>
                        <div className="text-sm font-bold text-red-400 mono">
                            {state.stats?.laundered ? state.stats.laundered.toLocaleString() : 0} kr.
                        </div>
                        <div className="text-[8px] text-zinc-600">Vasket totalt</div>
                    </div>
                    <div className="p-4 bg-zinc-900/50 rounded-xl border border-white/5">
                        <div className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1">Weed Produceret</div>
                        <div className="text-sm font-bold text-white mono">
                            {(state.lifetime?.produced?.weed || 0).toLocaleString()} g
                        </div>
                    </div>
                    <div className="p-4 bg-zinc-900/50 rounded-xl border border-white/5">
                        <div className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1">Meth Produceret</div>
                        <div className="text-sm font-bold text-white mono">
                            {(state.lifetime?.produced?.meth || 0).toLocaleString()} g
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default EmpireTab;
