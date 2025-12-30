import React from 'react';
import { CONFIG } from '../config/gameConfig';

// v27: New SultanTab Component
const SultanTab = ({ state, setState, addLog }) => {
    // Find active mission
    const activeMission = CONFIG.missions.find(m => !state.completedMissions.includes(m.id)) || state.dailyMission;

    const handleChoice = (choice) => {
        // Apply effects
        setState(prev => {
            let s = { ...prev };
            const ef = choice.effect;

            // Random Chance Handling
            if (ef.chance) {
                if (Math.random() < ef.chance) {
                    // Success
                    if (ef.success?.money) s.cleanCash += ef.success.money;
                    addLog(`Sultanen: Godt gamblet!`, 'success');
                } else {
                    // Fail
                    if (ef.fail?.heat) s.heat += ef.fail.heat;
                    addLog(`Sultanen: Det gik galt...`, 'error');
                }
            } else {
                // Deterministic
                if (ef.money) s.cleanCash += ef.money;
                if (ef.heat) s.heat += ef.heat;
                if (ef.rival) s.rival.hostility += ef.rival;
            }

            // Mark mission complete? No, choices are usually steps. 
            // For now, let's assume choosing completes the interaction or grants a bonus.
            // Simplified: Choice just applies effect. Mission still needs normal completion?
            // "Interactive Mission Choices" implies choosing HOW to complete or modifying state.
            // Let's assume these are just instant effects, and the mission remains active until criteria met.

            return s;
        });
    };

    return (
        <div className="max-w-3xl mx-auto h-full flex flex-col">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 text-amber-500 flex items-center gap-3">
                <i className="fa-solid fa-comment-dots"></i> Sultanen
            </h2>

            {/* CHAT INTERFACE */}
            <div className="flex-1 bg-black/40 rounded-2xl border border-white/5 p-4 flex flex-col gap-4 overflow-y-auto mb-6 relative">
                {/* Placeholder History */}
                <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30 shrink-0">
                        <i className="fa-solid fa-user text-amber-500"></i>
                    </div>
                    <div className="bg-zinc-900/80 p-3 rounded-2xl rounded-tl-none border border-white/5 max-w-[80%]">
                        <div className="text-[10px] text-amber-500 font-bold mb-1 uppercase">Sultanen</div>
                        <p className="text-sm text-zinc-300">Hvad så, chef? Har du styr på forretningen?</p>
                    </div>
                </div>

                {/* Active Mission Message */}
                {activeMission && (
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30 shrink-0 animate-pulse">
                            <i className="fa-solid fa-user text-amber-500"></i>
                        </div>
                        <div className="bg-amber-900/20 p-4 rounded-2xl rounded-tl-none border border-amber-500/30 max-w-[80%]">
                            <div className="text-[10px] text-amber-500 font-bold mb-1 uppercase">Sultanen • <span className="text-white">MISSION: {activeMission.title}</span></div>
                            <p className="text-sm text-white font-medium leading-relaxed">"{activeMission.text}"</p>

                            {/* Choices */}
                            {activeMission.choices && (
                                <div className="mt-4 flex flex-col gap-2">
                                    {activeMission.choices.map((c, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleChoice(c)}
                                            className="text-left px-4 py-3 bg-black/60 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/50 rounded-lg transition-all group"
                                        >
                                            <div className="text-xs font-bold text-white group-hover:text-amber-400">Option {i + 1}</div>
                                            <div className="text-sm text-zinc-400 group-hover:text-amber-100">{c.text}</div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Requirements Status */}
                            <div className="mt-4 pt-3 border-t border-white/5">
                                <div className="text-[10px] text-zinc-400 uppercase font-bold mb-2">Krav:</div>
                                <div className="flex items-center gap-3 bg-black/40 p-2 rounded border border-white/5">
                                    {activeMission.req.type === 'produce' && <i className="fa-solid fa-flask text-zinc-500"></i>}
                                    {activeMission.req.type === 'conquer' && <i className="fa-solid fa-map text-zinc-500"></i>}
                                    <span className="text-xs font-mono text-zinc-300">
                                        {activeMission.req.type === 'produce' && `Producer ${activeMission.req.amount}x ${CONFIG.production[activeMission.req.item]?.name || activeMission.req.item}`}
                                        {activeMission.req.type === 'conquer' && `Erobr ${activeMission.req.amount} territorier`}
                                        {activeMission.req.type === 'sell' && `Sælg ${activeMission.req.amount} enheder`}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!activeMission && (
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30 shrink-0">
                            <i className="fa-solid fa-user text-amber-500"></i>
                        </div>
                        <div className="bg-zinc-900/80 p-3 rounded-2xl rounded-tl-none border border-white/5 max-w-[80%]">
                            <div className="text-[10px] text-amber-500 font-bold mb-1 uppercase">Sultanen</div>
                            <p className="text-sm text-zinc-300">Ingen opgaver lige nu. Hold lav profil.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SultanTab;
