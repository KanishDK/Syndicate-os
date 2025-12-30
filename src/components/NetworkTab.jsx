import React from 'react';
import { CONFIG } from '../config/gameConfig';

const NetworkTab = ({ state, setState, addLog }) => {
    // REFACTORED v27: Premium Command Center UI
    // Rivals = "Threat Intel" | Territories = "Asset Deeds"

    const conquer = (territory) => {
        if (state.dirtyCash < territory.baseCost) return;
        if (state.territories.includes(territory.id)) return;

        setState(prev => ({
            ...prev,
            dirtyCash: prev.dirtyCash - territory.baseCost,
            territories: [...prev.territories, territory.id],
            xp: prev.xp + 250
        }));
        addLog(`Erobrede ${territory.name} !`, 'success');
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex justify-between items-end">
                <h2 className="text-xl font-black uppercase tracking-tighter text-white">Gaden & Territorier</h2>
                <div className="flex gap-4 text-[10px] font-mono text-zinc-500 bg-zinc-900/50 px-3 py-1 rounded-lg border border-white/5">
                    <span>EJET: <span className="text-white font-bold">{state.territories.length}</span></span>
                    <span>INDTÆGT: <span className="text-emerald-400 font-bold">Variabel</span></span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. THREAT INTEL (Rival) */}
                <div className="lg:col-span-1">
                    <div className="h-full bg-zinc-900/40 rounded-2xl border border-red-500/20 p-5 relative overflow-hidden group">
                        {/* SCANLINE OVERLAY */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(255,0,0,0.02),rgba(255,0,0,0.06))] z-0 bg-[length:100%_4px,3px_100%] pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="text-[9px] font-bold text-red-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                        Live Intel Feed
                                    </div>
                                    <h3 className="text-xl font-black text-white uppercase italic">{state.rival.name}</h3>
                                </div>
                                <i className="fa-solid fa-radar text-red-500/20 text-3xl animate-spin-slow"></i>
                            </div>

                            <div className="flex-1 flex flex-col justify-center items-center py-4">
                                <div className="relative w-32 h-32 flex items-center justify-center">
                                    <div className="absolute inset-0 border-2 border-dashed border-red-500/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                                    <div className="absolute inset-4 border border-red-500/50 rounded-full"></div>
                                    <i className="fa-solid fa-skull text-5xl text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]"></i>
                                </div>
                                <div className="mt-4 text-center">
                                    <div className="text-xs text-red-400 font-bold uppercase tracking-widest mb-1">Trusselsniveau</div>
                                    <div className="text-3xl font-mono text-white font-black">{state.rival.hostility}%</div>
                                </div>
                            </div>

                            <div className="mt-auto pt-4 border-t border-red-500/10">
                                <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)] transition-all duration-1000"
                                        style={{ width: `${state.rival.hostility}%` }}
                                    ></div>
                                </div>
                                <p className="text-[9px] text-red-400/70 mt-2 font-mono text-center">
                                    ADVARSEL: Øget aktivitet observeret i sektor 7.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. ASSET CARDS (Territories) */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                        <i className="fa-solid fa-map text-emerald-500"></i> Ejendomsportefølje
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {CONFIG.territories.map(t => {
                            const owned = state.territories.includes(t.id);
                            const locked = state.level < t.reqLevel;
                            const canAfford = state.dirtyCash >= t.baseCost;
                            const isCleaner = t.type === 'clean';
                            const accent = isCleaner ? 'emerald' : 'amber';

                            return (
                                <div
                                    key={t.id}
                                    className={`
                                            relative p-4 rounded-xl border transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[140px]
                                            ${owned
                                            ? `bg-${accent}-950/20 border-${accent}-500/30 shadow-[0_0_30px_-15px_rgba(var(--color-${accent}-500),0.1)]`
                                            : locked
                                                ? 'bg-zinc-950/40 border-white/5 opacity-40 grayscale'
                                                : 'bg-zinc-900/50 border-white/5 hover:border-white/20'
                                        }
                                        `}
                                >
                                    {/* Status Badge */}
                                    <div className={`absolute top-0 right-0 px-2 py-1 rounded-bl-xl text-[9px] font-bold uppercase tracking-wider ${owned ? `bg-${accent}-500 text-black` : 'bg-zinc-800 text-zinc-500'}`}>
                                        {owned ? 'EJET' : locked ? 'LÅST' : 'TIL SALG'}
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${owned ? `bg-${accent}-500/10 text-${accent}-400` : 'bg-black/30 text-zinc-600'}`}>
                                                <i className={`fa-solid ${isCleaner ? 'fa-building-columns' : 'fa-house-chimney-crack'}`}></i>
                                            </div>
                                            <div>
                                                <h4 className={`font-bold uppercase text-xs ${owned ? 'text-white' : 'text-zinc-400'}`}>{t.name}</h4>
                                                <div className={`text-[9px] ${isCleaner ? 'text-emerald-400' : 'text-amber-400'}`}>
                                                    {isCleaner ? 'Hvidvask Front' : 'Distributionscentral'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-black/20 p-2 rounded border border-white/5 flex items-center justify-between mb-4">
                                            <span className="text-[9px] text-zinc-500 uppercase">Indtægt</span>
                                            <div className="text-right">
                                                <div className={`font-mono text-sm font-bold ${isCleaner ? 'text-emerald-400' : 'text-amber-400'}`}>
                                                    +{t.income}/s
                                                </div>
                                                <div className="text-[8px] text-zinc-600 uppercase">
                                                    {isCleaner ? 'Ren Kapital' : 'Sorte Penge'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ACTION BUTTON */}
                                    {!owned && (
                                        <button
                                            onClick={() => conquer(t)}
                                            disabled={locked || !canAfford}
                                            className={`
                                                    w-full py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all relative z-10
                                                    ${locked
                                                    ? 'bg-transparent text-zinc-600 border border-zinc-800'
                                                    : canAfford
                                                        ? 'bg-white text-black hover:bg-zinc-200 shadow-lg'
                                                        : 'bg-zinc-800 text-zinc-500'
                                                }
                                                `}
                                        >
                                            {locked ? `Level ${t.reqLevel}` : `Køb for ${t.baseCost.toLocaleString()}`}
                                        </button>
                                    )}
                                    {owned && (
                                        <div className="mt-auto">
                                            <div className={`w-full h-1 bg-${accent}-500/20 rounded-full overflow-hidden`}>
                                                <div className={`h-full bg-${accent}-500 w-full animate-[pulse_3s_infinite]`}></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NetworkTab;
