import React from 'react';
import { CONFIG, GAME_VERSION } from '../config/gameConfig';
import { formatNumber, getIncomePerSec } from '../utils/gameMath';

const Header = ({ state, xpNeeded, setHelpModal, setSettingsModal }) => {
    return (
        <div className="flex justify-between items-center mb-8 bg-zinc-900/50 p-4 rounded-2xl border border-white/5 backdrop-blur-sm relative z-50">
            {/* LEFT: IDENTITY & UTILS */}
            <div className="flex items-center gap-4">
                <div className="flex flex-col leading-tight">
                    <h1 className="text-lg font-black text-white tracking-tighter italic">SYNDICATE <span className="text-emerald-500 text-xs not-italic font-mono">OS</span></h1>
                    <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">v{GAME_VERSION}</div>
                </div>
                <button
                    onClick={() => setHelpModal(true)}
                    className="w-8 h-8 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-all border border-white/5"
                    title="Hjælp & Keybinds"
                >
                    <i className="fa-solid fa-circle-question"></i>
                </button>
                <button
                    onClick={() => setSettingsModal(true)}
                    className="w-8 h-8 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-all border border-white/5"
                    title="Indstillinger"
                >
                    <i className="fa-solid fa-gear"></i>
                </button>
            </div>

            {/* CENTER: VITAL SIGNS (FLOW & CASH) */}
            <div className="flex items-center gap-2 md:gap-6">
                {/* FLOW (IPS) */}
                <div className="flex flex-col items-end">
                    <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Flow</div>
                    <div className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                        <i className="fa-solid fa-bolt text-[10px]"></i>
                        {formatNumber(getIncomePerSec(state, CONFIG))}/s
                    </div>
                </div>

                {/* CASH (LIQUID) */}
                <div className="flex flex-col items-end min-w-[80px] md:min-w-[100px]">
                    <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Likvid</div>
                    <div className="text-sm md:text-lg font-mono text-white font-black tracking-tight leading-none text-shadow-sm">
                        {formatNumber(state.cleanCash)} kr.
                    </div>
                    {state.dirtyCash > 0 && (
                        <div className="text-[10px] font-mono text-amber-500 font-bold leading-none mt-0.5">
                            +{formatNumber(state.dirtyCash)} sort
                        </div>
                    )}
                </div>

                {/* HEAT METER - NOW VISIBLE ON MOBILE */}
                <div className="flex flex-col w-16 md:w-24">
                    <div className="flex justify-between text-[9px] uppercase font-bold text-zinc-500 mb-0.5">
                        <span>Heat</span>
                        <span className={`${state.heat > 50 ? 'text-red-500 animate-pulse' : 'text-zinc-500'}`}>{Math.floor(state.heat)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden border border-white/5">
                        <div
                            className={`h-full transition-all duration-500 ${state.heat > 80 ? 'bg-red-500 animate-pulse' : state.heat > 50 ? 'bg-orange-500' : 'bg-blue-500'}`}
                            style={{ width: `${Math.min(100, state.heat)}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* RIGHT: PROGRESSION (RANK & XP) */}
            <div className="flex items-center gap-3 md:gap-4">
                <div className="text-right">
                    <div className="text-[9px] text-zinc-500 font-bold tracking-widest uppercase">Rank {state.level}</div>
                    <div className="text-xs md:text-sm font-black text-white uppercase tracking-tighter text-shadow-glow">
                        {CONFIG.levelTitles[Math.min(state.level - 1, CONFIG.levelTitles.length - 1)]}
                    </div>
                </div>

                {/* XP DONUT (Simplified) */}
                <div className="relative w-10 h-10 flex items-center justify-center">
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
                    <div className="absolute text-[9px] font-bold text-emerald-400">
                        {Math.floor((state.xp / xpNeeded) * 100)}%
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
