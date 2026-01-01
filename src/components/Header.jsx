import React from 'react';
import { formatNumber } from '../utils/gameMath';
import { CONFIG } from '../config/gameConfig';

const Header = ({ state, incomeClean, incomeDirty, setSettingsModal, setHelpModal }) => {
    return (
        <div className="flex flex-col w-full h-full pointer-events-auto text-white">

            {/* --- ROW 1: META BAR (Rank, Title, Tools) --- */}
            <div className="h-[44px] bg-black/40 border-b border-white/5 backdrop-blur-md">
                <div className="w-full max-w-6xl mx-auto h-full flex justify-between items-center px-4">

                    {/* LEFT: RANK & XP */}
                    <div className="flex items-center gap-3">
                        {/* Rank Badge */}
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10 flex items-center justify-center font-black text-white text-sm shadow-inner relative group" title="Dit Level">
                            {state.level}
                            {/* XP Breakdown Tooltip */}
                            <div className="absolute top-full left-0 mt-2 w-48 bg-zinc-900 rounded border border-white/10 p-2 hidden group-hover:block z-50 pointer-events-none">
                                <div className="text-[10px] text-zinc-400 uppercase font-bold mb-1">Experience</div>
                                <div className="text-xs text-white mb-1">{formatNumber(state.xp)} / {formatNumber(state.nextLevelXp)} XP</div>
                                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, (state.xp / state.nextLevelXp) * 100)}%` }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Title Text & XP Bar */}
                        <div className="flex flex-col justify-center">
                            <div className="flex items-baseline gap-2">
                                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider leading-none">Rank</span>
                                <span className="text-sm font-bold text-white leading-none">{CONFIG.levelTitles[state.level - 1] || 'Kingpin'}</span>
                            </div>
                            {/* Always Visible XP Bar */}
                            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mt-1" title={`${formatNumber(state.xp)} / ${formatNumber(state.nextLevelXp)} XP`}>
                                <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, (state.xp / state.nextLevelXp) * 100)}%` }}></div>
                            </div>
                        </div>
                    </div>

                    {/* CENTER: LOGO (Hidden on very small screens, optional) */}
                    <div className="hidden md:block absolute left-1/2 -translate-x-1/2 opacity-30 pointer-events-none">
                        <h1 className="text-lg font-black tracking-widest italic text-white">SYNDICATE<span className="text-emerald-500">OS</span></h1>
                    </div>

                    {/* RIGHT: TOOLS */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setHelpModal(true)}
                            className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors border border-transparent hover:border-white/10"
                            title="Hjælp & Guide"
                        >
                            <i className="fa-solid fa-book"></i>
                        </button>
                        <button
                            onClick={() => setSettingsModal(true)}
                            className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors border border-transparent hover:border-white/10"
                            title="Indstillinger"
                        >
                            <i className="fa-solid fa-gear"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* --- ROW 2: STATUS BAR (Money & Heat) --- */}
            <div className="h-[44px] bg-zinc-900/60 border-b border-white/5 backdrop-blur-md">
                <div className="w-full max-w-6xl mx-auto h-full flex justify-between items-center px-4">

                    {/* LEFT: CLEAN CASH */}
                    <div className="flex items-center gap-3 w-1/3">
                        <div className="w-8 h-8 rounded-full bg-emerald-900/20 flex items-center justify-center text-emerald-500 shrink-0">
                            <i className="fa-solid fa-sack-dollar text-sm"></i>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider leading-none">Rene Kr.</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm font-black text-white font-mono leading-none">{formatNumber(state.cleanCash)}</span>
                                {incomeClean > 0 && <span className="text-[9px] text-emerald-400 font-mono animate-pulse">+{formatNumber(incomeClean)}</span>}
                            </div>
                        </div>
                    </div>

                    {/* CENTER: HEAT BAR */}
                    <div className="flex flex-col items-center justify-center w-1/3 px-2 group cursor-help" title="Heat (Politi Opmærksomhed)">
                        <div className="flex items-center gap-2 mb-1">
                            <i className={`fa-solid fa-taxi text-[10px] ${state.heat > 80 ? 'text-red-500 animate-pulse' : 'text-zinc-500'}`}></i>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${state.heat > 80 ? 'text-red-500' : 'text-zinc-500'}`}>Heat</span>
                            <span className={`text-[10px] font-mono ${state.heat > 80 ? 'text-red-500 font-bold' : 'text-zinc-400'}`}>{state.heat.toFixed(0)}%</span>
                        </div>
                        <div className="w-full max-w-[200px] h-1.5 bg-zinc-800 rounded-full overflow-hidden border border-white/5">
                            <div
                                className={`h-full transition-all duration-500 ease-out ${state.heat > 80 ? 'bg-gradient-to-r from-orange-500 to-red-600 animate-pulse' : 'bg-gradient-to-r from-blue-600 to-indigo-500'}`}
                                style={{ width: `${Math.min(100, state.heat)}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* RIGHT: DIRTY CASH */}
                    <div className="flex items-center gap-3 w-1/3 justify-end">
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] text-amber-500 font-bold uppercase tracking-wider leading-none">Sorte Kr.</span>
                            <div className="flex items-baseline gap-1">
                                {incomeDirty > 0 && <span className="text-[9px] text-amber-500 font-mono animate-pulse">+{formatNumber(incomeDirty)}</span>}
                                <span className="text-sm font-black text-zinc-300 font-mono leading-none">{formatNumber(state.dirtyCash)}</span>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-amber-900/20 flex items-center justify-center text-amber-500 shrink-0">
                            <i className="fa-solid fa-briefcase text-sm"></i>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Header;
