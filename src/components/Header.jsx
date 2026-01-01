import React from 'react';
import { CONFIG, GAME_VERSION } from '../config/gameConfig';
import { formatNumber } from '../utils/gameMath';

const Header = ({ state, xpNeeded, setHelpModal, setSettingsModal }) => {

    // Calculate Rates (Visual only, based on last tick state if available)
    const incomeClean = state.lastTick?.clean || 0;
    const incomeDirty = state.lastTick?.dirty || 0;

    return (
        <div className="flex justify-between items-center w-full h-full gap-4">
            {/* LEFT: IDENTITY & LEVEL */}
            <div className="flex items-center gap-4 min-w-[150px]">
                {/* LOGO */}
                <div className="flex flex-col leading-tight hidden md:block group cursor-pointer" onClick={() => setSettingsModal(true)}>
                    <h1 className="text-lg font-black text-white tracking-tighter italic group-hover:text-emerald-400 transition-colors">
                        SYNDICATE <span className="text-emerald-500 text-xs not-italic font-mono">OS</span>
                    </h1>
                    <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">v{GAME_VERSION}</div>
                </div>

                {/* RANK BADGE */}
                <div className="flex items-center gap-3 bg-zinc-900/50 pl-1 pr-3 py-1 rounded-full border border-white/5">
                    <div className="relative w-8 h-8 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <path className="text-zinc-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                            <path
                                className="text-emerald-500 transition-all duration-1000 ease-out"
                                strokeDasharray={`${(state.xp / xpNeeded) * 100}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                            />
                        </svg>
                        <span className="absolute text-[10px] font-bold text-white">{state.level}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] text-zinc-500 uppercase font-bold tracking-wider">Rank</span>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase leading-none">
                            {CONFIG.levelTitles[Math.min(state.level - 1, CONFIG.levelTitles.length - 1)]}
                        </span>
                    </div>
                </div>
            </div>

            {/* CENTER: RESOURCES HUD */}
            <div className="flex-1 flex justify-center items-center gap-2 md:gap-8">

                {/* CLEAN CASH */}
                <div className="flex flex-col items-end min-w-[80px]">
                    <span className="text-[9px] text-emerald-500/70 uppercase font-bold tracking-wider">Ren Kapital</span>
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-lg font-black text-white text-shadow-sm tracking-tight">{formatNumber(state.cleanCash)}</span>
                        {incomeClean > 0 && <span className="text-[9px] font-mono text-emerald-400 animate-pulse">+{formatNumber(incomeClean)}/t</span>}
                    </div>
                </div>

                {/* HEAT BAR */}
                <div className="w-24 md:w-32 flex flex-col items-center group relative cursor-help" title="Politi Opmærksomhed (Heat)">
                    <div className="w-full flex justify-between text-[8px] uppercase font-bold text-zinc-500 mb-0.5">
                        <span>Risk</span>
                        <span className={state.heat > 80 ? 'text-red-500 animate-pulse' : 'text-zinc-400'}>{state.heat.toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden border border-white/5">
                        <div
                            className={`h-full transition-all duration-500 ease-out ${state.heat > 80 ? 'bg-gradient-to-r from-orange-500 to-red-600' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`}
                            style={{ width: `${Math.min(100, state.heat)}%` }}
                        ></div>
                    </div>
                </div>

                {/* DIRTY CASH */}
                <div className="flex flex-col items-start min-w-[80px]">
                    <span className="text-[9px] text-amber-500/70 uppercase font-bold tracking-wider">Sorte Penge</span>
                    <div className="flex items-center gap-2">
                        {incomeDirty > 0 && <span className="text-[9px] font-mono text-amber-500 animate-pulse">+{formatNumber(incomeDirty)}/t</span>}
                        <span className="font-mono text-lg font-black text-zinc-300 tracking-tight">{formatNumber(state.dirtyCash)}</span>
                    </div>
                </div>

            </div>

            {/* RIGHT: TOOLS */}
            <div className="flex items-center gap-2 md:gap-4 min-w-[150px] justify-end">
                {/* MARKET TICKER */}
                <div className={`hidden lg:flex items-center gap-2 px-3 py-1 bg-black/40 rounded-lg border border-white/5`}>
                    <i className={`fa-solid fa-chart-line ${state.market?.trend === 'bull' ? 'text-green-400' : 'text-red-500'}`}></i>
                    <div className="flex flex-col leading-none">
                        <span className="text-[8px] text-zinc-500 uppercase font-bold">Market</span>
                        <span className={`text-[10px] font-mono font-bold ${state.market?.trend === 'bull' ? 'text-green-400' : 'text-zinc-300'}`}>
                            {state.market?.trend === 'bull' ? 'BULL' : 'BEAR'} x{state.market?.multiplier}
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => setHelpModal(true)}
                    className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors border border-white/5"
                >
                    <i className="fa-solid fa-question"></i>
                </button>
                <button
                    onClick={() => setSettingsModal(true)}
                    className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors border border-white/5"
                >
                    <i className="fa-solid fa-gear"></i>
                </button>
            </div>
        </div>
    );
};

export default Header;
