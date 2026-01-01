import React from 'react';
import { CONFIG } from '../config/gameConfig';
import { formatNumber } from '../utils/gameMath';

const EmpireTab = ({ state, doPrestige, buyPerk }) => { // buyPerk passed from HOC or we dispatch here

    // We need a dispatch mechanism if buyPerk isn't passed props.
    // For now, let's assume we can dispatch via a wrapper or just use the bridge in App (which we need to add).
    // Actually, App.jsx uses context now, but EmpireTab is passed `state` and `doPrestige`.
    // We should probably consume context here directly or pass `dispatch`.
    // Let's rely on the props for now and I'll update App.jsx to pass `buyPerk` or `dispatch`.

    // NOTE: Refactoring to use Context directly is better, but to stay consistent with the "Bridge" pattern in App.jsx
    // I will expect `dispatch` to be passed or accessible.
    // Wait, App.jsx passes `state` and `doPrestige`. I'll update App.jsx to pass `dispatch` to tabs?
    // Or just use the hook here. Using the hook is cleaner.

    // BUT App.jsx is currently rendering: <EmpireTab state={gameState} doPrestige={doPrestige} />
    // I will write this assuming I can grab dispatch from context since I am inside the provider.

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* HERO HEADER */}
            <div className="relative mb-12 p-8 rounded-3xl overflow-hidden bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.1)]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

                <div className="relative z-10 text-center">
                    <div className="inline-block p-4 rounded-full bg-purple-500/10 mb-4 animate-pulse-slow">
                        <i className="fa-solid fa-crown text-5xl text-purple-400"></i>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter">
                        DIT <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">IMPERIUM</span>
                    </h1>
                    <p className="text-purple-200/60 text-lg max-w-xl mx-auto">
                        "En dag vil alt dette være støv. Men legenden? Legenden lever evigt."
                    </p>
                </div>
            </div>

            {/* PRESTIGE STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                <div className="bg-[#0a0a0c] p-6 rounded-2xl border border-white/5 flex flex-col items-center">
                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Prestige Level</span>
                    <span className="text-4xl font-black text-white">{state.prestige?.level || 0}</span>
                </div>
                <div className="bg-[#0a0a0c] p-6 rounded-2xl border border-white/5 flex flex-col items-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors"></div>
                    <span className="text-purple-400 text-xs font-bold uppercase tracking-widest mb-1">Indkomst Bonus</span>
                    <span className="text-4xl font-black text-white">x{state.prestige?.multiplier || 1}</span>
                </div>
                <div className="bg-[#0a0a0c] p-6 rounded-2xl border border-white/5 flex flex-col items-center">
                    <span className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-1">Prestige Tokens</span>
                    <div className="flex items-center gap-2">
                        <i className="fa-solid fa-coins text-amber-500"></i>
                        <span className="text-4xl font-black text-white">{state.prestige?.currency || 0}</span>
                    </div>
                </div>
            </div>

            {/* LIFETIME STATS (NEW PHASE 4) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Livstids Indtjening</div>
                    <div className="text-xl font-mono text-emerald-400">{formatNumber(state.lifetime?.earnings || 0)} kr</div>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Produceret (Total)</div>
                    <div className="text-xl font-mono text-blue-400">
                        {formatNumber(Object.values(state.lifetime?.produced || {}).reduce((a, b) => a + b, 0))} <span className="text-sm text-zinc-600">enheder</span>
                    </div>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Prestige Resets</div>
                    <div className="text-xl font-mono text-purple-400">{state.prestige?.level || 0}</div>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Imperie Værdi</div>
                    <div className="text-xl font-mono text-amber-400">{formatNumber((state.cleanCash + state.dirtyCash) * (state.prestige?.multiplier || 1))} kr</div>
                </div>
            </div>

            {/* BLACK MARKET (PHASE 2) */}
            {state.prestige?.level > 0 && (
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <i className="fa-solid fa-shop text-amber-500 text-xl"></i>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">DET SORTE MARKED</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(CONFIG.perks || {}).map(([id, perk]) => {
                            const currentLvl = state.prestige?.perks?.[id] || 0;
                            const cost = Math.floor(perk.baseCost * Math.pow(perk.costScale, currentLvl));
                            const maxed = currentLvl >= perk.maxLevel;
                            const canAfford = (state.prestige?.currency || 0) >= cost;

                            return (
                                <div key={id} className="bg-zinc-900/80 p-5 rounded-xl border border-amber-500/20 hover:border-amber-500/40 transition-all group relative overflow-hidden">
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-amber-100">{perk.name}</h3>
                                            <span className="text-xs font-mono text-zinc-500">Lvl {currentLvl}/{perk.maxLevel}</span>
                                        </div>
                                        <p className="text-xs text-zinc-400 mb-4 h-8">{perk.desc}</p>

                                        {!maxed ? (
                                            <button
                                                onClick={() => window.dispatchEvent(new CustomEvent('BUY_PERK', { detail: { id, cost } }))}
                                                disabled={!canAfford}
                                                className={`w-full py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 ${canAfford ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/20' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}`}
                                            >
                                                <span>Køb</span>
                                                <div className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded">
                                                    <i className="fa-solid fa-coins text-[10px]"></i>
                                                    <span>{cost}</span>
                                                </div>
                                            </button>
                                        ) : (
                                            <div className="w-full py-2 bg-emerald-900/30 text-emerald-500 rounded-lg text-center font-bold text-xs uppercase border border-emerald-500/30">
                                                <i className="fa-solid fa-check mr-1"></i> MAXED
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* RESET BUTTON */}
            <div className="p-8 rounded-2xl bg-gradient-to-r from-red-900/20 to-black border border-red-500/20">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">EXIT SCAM (Prestige Reset)</h3>
                        <p className="text-zinc-400 text-sm max-w-md">
                            Nulstil alt fremskridt (Cash, Lager, Bygninger). Behold dine Trophies.
                            Få en permanent indkomst bonus og Prestige Tokens.
                        </p>
                    </div>

                    {state.level >= 10 ? (
                        <button
                            onClick={doPrestige}
                            className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl uppercase tracking-widest shadow-lg shadow-red-900/40 hover:scale-105 transition-all text-sm md:text-base animate-pulse-slow"
                        >
                            <span className="block text-[10px] opacity-70 mb-0.5">Nuværende: x{state.prestige?.multiplier || 1}</span>
                            RESET NU (x{((state.prestige?.multiplier || 1) + 0.5)})
                        </button>
                    ) : (
                        <div className="px-6 py-3 bg-zinc-800 text-zinc-500 font-bold rounded-xl border border-white/5 uppercase text-sm cursor-not-allowed">
                            Kræver Level 10
                        </div>
                    )}
                </div>
            </div>

            {/* ACHIEVEMENTS (PHASE 5) */}
            <div className="mt-12">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-3">
                    <i className="fa-solid fa-trophy text-amber-500"></i>
                    Hall of Fame
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {CONFIG.achievements.map(ach => {
                        const unlocked = (state.unlockedAchievements || []).includes(ach.id);
                        return (
                            <div key={ach.id} className={`p-4 rounded-xl border flex items-center gap-4 ${unlocked ? 'bg-zinc-900/80 border-amber-500/30' : 'bg-black/40 border-white/5 opacity-50'}`}>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 ${unlocked ? 'bg-amber-900/20 text-amber-400 border border-amber-500/20' : 'bg-zinc-800 text-zinc-600'}`}>
                                    <i className={`fa-solid ${ach.icon}`}></i>
                                </div>
                                <div className="flex-1">
                                    <h4 className={`font-bold uppercase text-sm ${unlocked ? 'text-white' : 'text-zinc-500'}`}>{ach.name}</h4>
                                    <p className="text-xs text-zinc-400">{ach.desc}</p>
                                </div>
                                {unlocked && <i className="fa-solid fa-check text-emerald-500"></i>}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default EmpireTab;
