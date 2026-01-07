import React, { useState } from 'react';
import { formatNumber } from '../utils/gameMath';
import NavButton from './NavButton';
import MusicPlayer from './MusicPlayer';
import { CONFIG } from '../config/gameConfig';
import Button from './Button';

const Header = ({ state, incomeClean, incomeDirty, setSettingsModal, setHelpModal, bribePolice }) => {
    const [activeTip, setActiveTip] = useState(null); // 'xp' | 'clean' | 'dirty' | null

    const toggleTip = (tip) => {
        setActiveTip(activeTip === tip ? null : tip);
    };

    return (
        <div className="flex flex-col w-full h-full pointer-events-auto text-white">

            {/* --- MOBILE HEAT WARNING LINE (Visible only on mobile) --- */}
            <div className={`md:hidden w-full h-1.5 bg-zinc-900 border-b border-white/5 relative overflow-hidden`}>
                <div
                    className={`h-full transition-all duration-500 ease-out ${state.heat > 100 ? 'bg-gradient-to-r from-red-600 via-red-400 to-red-600 animate-pulse' : (state.heat > 80 ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-blue-600 to-indigo-500')}`}
                    style={{ width: `${Math.min(100, state.heat)}%` }}
                ></div>
            </div>

            {/* --- ROW 1: META BAR (Rank, Title, Tools) --- */}
            <div className="h-[44px] bg-black/40 border-b border-white/5 backdrop-blur-md">
                <div className="w-full max-w-6xl mx-auto h-full flex justify-between items-center px-4">

                    {/* LEFT: RANK & XP */}
                    <div className="flex items-center gap-3 w-1/3">
                        {/* Rank Badge */}
                        <div
                            onClick={() => toggleTip('xp')}
                            className={`w-9 h-9 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-900 border flex items-center justify-center font-black text-white text-xs shadow-inner relative cursor-pointer transition-all shrink-0 ${activeTip === 'xp' ? 'border-blue-500 scale-105 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-white/10'}`}
                        >
                            {state.level}
                            {/* XP Breakdown Tooltip */}
                            {activeTip === 'xp' && (
                                <div className="absolute top-full left-0 mt-3 w-56 bg-[#0a0a0c] rounded-xl border border-blue-500/30 p-4 z-[100] shadow-2xl animate-in fade-in slide-in-from-top-2">
                                    <h4 className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-2 border-b border-blue-500/10 pb-1">Experience Points</h4>
                                    <div className="flex justify-between text-xs font-mono text-zinc-300 mb-2">
                                        <span>Current:</span>
                                        <span className="text-white font-bold">{formatNumber(state.xp)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-mono text-zinc-300 mb-3">
                                        <span>Next Lvl:</span>
                                        <span className="text-zinc-500">{formatNumber(state.nextLevelXp)}</span>
                                    </div>
                                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden border border-white/5">
                                        <div className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${Math.min(100, (state.xp / state.nextLevelXp) * 100)}%` }}></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Title Text & XP Bar */}
                        <div className="flex flex-col justify-center gap-0.5 w-full max-w-[140px]">
                            <div className="text-[10px] font-black text-white uppercase tracking-tighter truncate leading-none">
                                {CONFIG.levelTitles[state.level - 1]}
                            </div>
                            {/* Always Visible XP Bar */}
                            <div className="w-full h-1.5 bg-zinc-800/50 rounded-full overflow-hidden border border-white/5">
                                <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-500" style={{ width: `${Math.min(100, (state.xp / state.nextLevelXp) * 100)}%` }}></div>
                            </div>
                        </div>
                    </div>

                    {/* CENTER: LOGO (Hidden on very small screens, optional) */}
                    <div className="hidden md:block absolute left-1/2 -translate-x-1/2 opacity-30 pointer-events-none">
                        <h1 className="text-lg font-black tracking-widest italic text-white">SYNDICATE<span className="text-emerald-500">OS</span></h1>
                    </div>

                    {/* RIGHT: TOOLS */}
                    <div className="flex items-center gap-2 justify-end w-1/3">
                        <MusicPlayer />
                        <Button
                            onClick={() => setHelpModal(true)}
                            className="w-8 h-8 !p-0 flex items-center justify-center bg-white/5 border-transparent"
                            variant="ghost"
                        >
                            <i className="fa-solid fa-book"></i>
                        </Button>
                        <Button
                            onClick={() => setSettingsModal(true)}
                            className="w-8 h-8 !p-0 flex items-center justify-center bg-white/5 border-transparent"
                            variant="ghost"
                        >
                            <i className="fa-solid fa-gear"></i>
                        </Button>
                    </div>
                </div>
            </div>

            {/* --- ROW 2: STATUS BAR (Money & Heat) --- */}
            <div className="h-[44px] bg-zinc-900/60 border-b border-white/5 backdrop-blur-md">
                <div className="w-full max-w-6xl mx-auto h-full flex justify-between items-center px-4">

                    {/* LEFT: CLEAN CASH */}
                    <div
                        onClick={() => toggleTip('clean')}
                        className={`flex items-center gap-3 w-1/3 relative cursor-pointer group transition-all ${activeTip === 'clean' ? 'scale-105' : ''}`}
                    >
                        {/* TOOLTIP */}
                        {activeTip === 'clean' && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-black rounded-lg border border-emerald-500/50 p-3 z-[100] shadow-2xl animate-in fade-in slide-in-from-top-2">
                                <div className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider mb-2 border-b border-emerald-500/20 pb-1">Finans Indsigt</div>
                                <div className="space-y-1 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Hvidvask:</span>
                                        <span className="font-mono text-white">+{formatNumber(incomeClean)}/s</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Lovlig:</span>
                                        <span className="font-mono text-white">0/s</span>
                                    </div>
                                </div>
                                <div className="mt-3 text-[9px] text-emerald-500/50 italic border-t border-white/5 pt-2 text-center">Tjek Finans fanen for detaljer</div>
                            </div>
                        )}

                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${activeTip === 'clean' ? 'bg-emerald-500 text-black' : 'bg-emerald-900/20 text-emerald-500'} ${state.activeBuffs?.showCleanWarning ? 'animate-bounce-short bg-red-500/20 text-red-500 border border-red-500/50' : ''}`}>
                            <i className="fa-solid fa-sack-dollar text-sm"></i>
                        </div>
                        <div className="flex flex-col">
                            <span className={`text-[9px] font-bold uppercase tracking-wider leading-none transition-colors ${state.activeBuffs?.showCleanWarning ? 'text-red-500' : 'text-emerald-500'}`}>
                                {state.activeBuffs?.showCleanWarning ? 'RENE PENGE KRÆVET' : 'Ren Kapital'}
                            </span>
                            <div className="flex items-baseline gap-1">
                                <span className={`text-sm font-black font-mono leading-none transition-all ${state.activeBuffs?.showCleanWarning ? 'text-red-400 scale-110' : (activeTip === 'clean' ? 'text-emerald-400' : 'text-white')}`}>{formatNumber(state.cleanCash)}</span>
                                {incomeClean > 0 && <span className="text-[9px] text-emerald-400 font-mono animate-pulse">+{formatNumber(incomeClean)}</span>}
                            </div>
                        </div>
                    </div>

                    {/* CENTER: HEAT BAR */}
                    <div
                        onClick={() => toggleTip('heat')}
                        className={`flex flex-col items-center justify-center w-1/3 px-2 relative cursor-help group transition-transform ${state.heat > 80 ? 'animate-shake' : ''}`}
                    >
                        {/* HEAT TOOLTIP */}
                        {activeTip === 'heat' && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-black rounded-lg border border-red-500/50 p-3 z-[100] shadow-2xl animate-in fade-in slide-in-from-top-2">
                                <div className="text-[9px] text-red-500 font-bold uppercase tracking-wider mb-2 border-b border-red-500/20 pb-1">Heat Status</div>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Niveau:</span>
                                        <span className={`font-mono font-bold ${state.heat > 80 ? 'text-red-500' : 'text-white'}`}>{state.heat.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full h-px bg-white/10"></div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px] text-zinc-500">
                                            <span>Risiko for Razzia:</span>
                                            <span className="text-red-400">{Math.min(100, Math.max(0, state.heat - 50) * 2).toFixed(0)}%</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] text-zinc-500">
                                            <span>Advokater:</span>
                                            <span className="text-emerald-400">-{((state.staff.lawyer || 0) * 0.5).toFixed(1)}/s</span>
                                        </div>
                                        {state.prestige?.perks?.shadow_network > 0 && (
                                            <div className="flex justify-between text-[10px] text-zinc-500">
                                                <span>Skygge Netværk:</span>
                                                <span className="text-purple-400">-{((state.prestige.perks.shadow_network * 0.05) * 10).toFixed(2)}/s</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-3 pt-2 border-t border-white/5">
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent closing tooltip immediately if needed, or allow it
                                            bribePolice();
                                        }}
                                        disabled={state.dirtyCash < 50000 || state.heat <= 0}
                                        className="w-full py-1.5 text-[10px] uppercase font-bold flex justify-between px-2"
                                        size="xs"
                                        variant="neutral"
                                    >
                                        <span>Bestik (-25%)</span>
                                        <span className={state.dirtyCash >= 50000 ? 'text-amber-500' : 'text-red-500'}>50k</span>
                                    </Button>
                                    <div className="text-[9px] text-zinc-500 mt-1 text-center italic">Koster Sorte Penge</div>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-2 mb-1">
                            <i className={`fa-solid fa-taxi text-[10px] ${state.heat > 100 ? 'text-red-500 animate-pulse' : (state.heat > 80 ? 'text-orange-500' : 'text-zinc-500')}`}></i>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${state.heat > 100 ? 'text-red-600 animate-pulse' : (state.heat > 80 ? 'text-orange-500' : 'text-zinc-500')}`}>
                                {state.heat > 100 ? 'OVERHEAT!!' : 'Heat'}
                            </span>
                            <span className={`text-[10px] font-mono ${state.heat > 100 ? 'text-red-500 font-black' : (state.heat > 80 ? 'text-orange-500 font-bold' : 'text-zinc-400')}`}>
                                {state.heat.toFixed(0)}%
                            </span>
                        </div>
                        <div className={`w-full max-w-[200px] h-1.5 bg-zinc-800 rounded-full overflow-hidden border ${state.heat > 100 ? 'border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'border-white/5'}`}>
                            <div
                                className={`h-full transition-all duration-500 ease-out ${state.heat > 100 ? 'bg-gradient-to-r from-red-600 via-red-400 to-red-600 animate-pulse' : (state.heat > 80 ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-blue-600 to-indigo-500')}`}
                                style={{ width: `${Math.min(100, state.heat)}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* RIGHT: DIRTY CASH */}
                    <div
                        onClick={() => toggleTip('dirty')}
                        className={`flex items-center gap-3 w-1/3 justify-end relative cursor-pointer group transition-all ${activeTip === 'dirty' ? 'scale-105' : ''}`}
                    >
                        {/* TOOLTIP */}
                        {activeTip === 'dirty' && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-black rounded-lg border border-amber-500/50 p-3 z-[100] shadow-2xl animate-in fade-in slide-in-from-top-2">
                                <div className="text-[9px] text-amber-500 font-bold uppercase tracking-wider mb-2 border-b border-amber-500/20 pb-1">Gade Indsigt</div>
                                <div className="space-y-1 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Varelager Salg:</span>
                                        <span className="font-mono text-white">+{formatNumber(incomeDirty)}/s</span>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 mt-2 italic">Dette er dit forventede flow baseret på nuværende produktion og salg.</p>
                                </div>
                                <div className="mt-3 text-[9px] text-amber-500/50 italic border-t border-white/5 pt-2 text-center">Tjek Produktion for detaljer</div>
                            </div>
                        )}

                        <div className="flex flex-col items-end">
                            <span className="text-[9px] text-amber-500 font-bold uppercase tracking-wider leading-none">Sort Kapital</span>
                            <div className="flex items-baseline gap-1">
                                {incomeDirty > 0 && <span className="text-[9px] text-amber-500 font-mono animate-pulse">+{formatNumber(incomeDirty)}</span>}
                                <span className={`text-sm font-black font-mono leading-none transition-all ${activeTip === 'dirty' ? 'text-amber-400' : 'text-zinc-300'}`} style={{ textShadow: activeTip === 'dirty' ? '0 0 10px rgba(245, 158, 11, 0.8)' : '0 0 10px rgba(245, 158, 11, 0.4)' }}>{formatNumber(state.dirtyCash)}</span>
                            </div>
                        </div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${activeTip === 'dirty' ? 'bg-amber-500 text-black' : 'bg-amber-900/20 text-amber-500'}`}>
                            <i className="fa-solid fa-briefcase text-sm"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- TERRITORY SIEGE ALERT (NEW) --- */}
            {state.territoryAttacks && Object.keys(state.territoryAttacks).length > 0 && (
                <div className="w-full bg-red-600/90 border-b border-red-500 backdrop-blur-md animate-pulse">
                    <div className="w-full max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <i className="fa-solid fa-triangle-exclamation text-white text-lg animate-bounce"></i>
                            <div>
                                <div className="text-white font-black text-xs uppercase tracking-wider">
                                    ⚠️ {Object.keys(state.territoryAttacks).length} Territorier Under Angreb!
                                </div>
                                <div className="text-red-200 text-[9px] font-medium">
                                    Gå til Underverdenen for at forsvare dine områder
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {Object.keys(state.territoryAttacks).map(tId => {
                                const attack = state.territoryAttacks[tId];
                                const timeLeft = Math.max(0, attack.expiresAt - Date.now());
                                return (
                                    <div key={tId} className="bg-black/30 px-2 py-1 rounded text-[9px] font-mono text-white">
                                        {tId}: {Math.ceil(timeLeft / 1000)}s
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Header;
```
