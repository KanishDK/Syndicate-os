import React, { useState } from 'react';
import { CONFIG } from '../config/gameConfig';
import { formatNumber, getBulkCost, getMaxAffordable } from '../utils/gameMath';
import Button from './Button';
import BulkControl from './BulkControl';

const RivalsTab = ({ state, setState, addLog, ...props }) => {
    // Defense Bulk Buy Logic
    const [buyAmount, setBuyAmount] = useState(1);

    // --- ACTIONS ---

    // 1. Defense (Moved from useManagement)
    const buyDefense = (id, amount) => {
        const item = CONFIG.defense[id];
        const currentCount = state.defense[id] || 0;

        let actualAmount = amount === 'max' ? getMaxAffordable(item.baseCost, item.costFactor, currentCount, state.cleanCash) : amount;
        if (actualAmount <= 0) return;

        const cost = getBulkCost(item.baseCost, item.costFactor, currentCount, actualAmount);

        if (state.cleanCash >= cost) {
            setState(prev => ({
                ...prev,
                cleanCash: prev.cleanCash - cost,
                defense: { ...prev.defense, [id]: (prev.defense[id] || 0) + actualAmount }
            }));
            addLog(`Købte ${actualAmount}x ${item.name}`, 'success');
        }
    };

    // 2. Rivals (Actions moved to useGameActions for global access)
    // sabotageRival, raidRival, bribePolice passed via props or context?
    // User requested "Use new actions". Assuming they are passed in or we can hook them.
    // For now, I will assume the parent passes them or I can't use the hook directly inside here without significant refactor of parent.
    // WAIT: RivalsTab receives { state, setState, addLog }. It does NOT receive the actions.
    // REQUIRED: I need to update the props of RivalsTab in ManagementTab.jsx (or wherever it's used) to pass the actions.
    // OR: I can import useGameActions here? No, hooks need context usage or be at top level.
    // Strategy: I will temporarily stub them here to call the PROPS I will inject in next step.
    const { sabotageRival, raidRival, bribePolice } = props;

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-24">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
                        <i className="fa-solid fa-skull-crossbones text-red-600"></i> Underverdenen
                    </h2>
                    <p className="text-zinc-400 text-sm mt-1">Konflikt, Politi og Sikkerhed. Hold dine fjender tæt.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* COLUMN 1: POLICE & RIVALS */}
                <div className="space-y-8">

                    {/* POLICE SCANNER */}
                    <div className="bg-[#0f1012] border border-blue-900/30 p-6 rounded-2xl relative overflow-hidden shadow-2xl shadow-blue-900/10">
                        <div className="absolute top-0 right-0 p-4 opacity-10 text-blue-500 text-9xl"><i className="fa-solid fa-radar"></i></div>

                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <h3 className="text-blue-400 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                                <i className="fa-solid fa-building-shield"></i> Politirapport
                            </h3>
                            <div className={`px-3 py-1 rounded text-xs font-black uppercase ${state.heat > 80 ? 'bg-red-600 text-white animate-pulse' : 'bg-blue-900/30 text-blue-400'}`}>
                                {state.heat > 80 ? 'RAZZIA FARE' : 'OVERVÅGNING AKTIV'}
                            </div>
                        </div>

                        {/* HEAT METER */}
                        <div className="mb-6 relative z-10">
                            <div className="flex justify-between text-xs font-bold uppercase text-zinc-500 mb-1">
                                <span>Heat Level</span>
                                <span className={state.heat > 50 ? 'text-red-500' : 'text-zinc-300'}>{state.heat.toFixed(1)}%</span>
                            </div>
                            <div className="w-full h-4 bg-zinc-900 rounded-full overflow-hidden border border-white/10 relative">
                                {/* Grid lines */}
                                <div className="absolute inset-0 flex justify-between px-[20%] opacity-20"><div className="w-px h-full bg-white"></div><div className="w-px h-full bg-white"></div><div className="w-px h-full bg-white"></div><div className="w-px h-full bg-white"></div></div>
                                <div className={`h-full transition-all duration-300 ${state.heat > 80 ? 'bg-red-600' : state.heat > 50 ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(100, state.heat)}%` }}></div>
                            </div>
                            <p className="text-[10px] text-zinc-500 mt-2">
                                Høj Heat øger risikoen for razziaer og konfiskering af varer.
                            </p>
                        </div>

                        {/* ACTIONS */}
                        <div className="relative z-10">
                            <Button
                                onClick={bribePolice}
                                disabled={state.dirtyCash < 50000 || state.heat <= 0}
                                className="w-full py-4 text-left"
                                variant="neutral"
                            >
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-900/20 text-blue-400 flex items-center justify-center border border-blue-500/20">
                                            <i className="fa-solid fa-donut"></i>
                                        </div>
                                        <div className="text-left">
                                            <div className="text-xs font-black text-white uppercase">Bestik Betjent</div>
                                            <div className="text-[10px] text-zinc-400">-25 Heat (Øjeblikkeligt)</div>
                                        </div>
                                    </div>
                                    <div className="text-amber-500 font-mono font-bold text-sm">50.000 kr (Sort)</div>
                                </div>
                            </Button>
                        </div>
                    </div>

                    {/* RIVAL OPS */}
                    <div className="bg-[#0f1012] border border-red-900/30 p-6 rounded-2xl relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-red-500 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                                <i className="fa-solid fa-crosshairs"></i> Rival: {state.rival.name}
                            </h3>
                            <div className="text-2xl font-mono font-black text-white">{state.rival.hostility}%</div>
                        </div>

                        {/* Hostility Bar */}
                        <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden mb-6">
                            <div className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)] transition-all duration-1000" style={{ width: `${state.rival.hostility}%` }}></div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                onClick={sabotageRival}
                                disabled={state.cleanCash < 25000}
                                className="h-full !p-0"
                                variant="neutral"
                            >
                                <div className="p-4 text-left w-full h-full">
                                    <div className="text-[10px] text-zinc-400 uppercase font-bold mb-1">Sabotage</div>
                                    <div className="text-sm font-black text-white mb-2">Forsink Operation</div>
                                    <div className="text-xs text-amber-500 font-mono">25.000 kr (Ren)</div>
                                </div>
                            </Button>

                            <Button
                                onClick={raidRival}
                                disabled={state.heat > 80}
                                className="h-full !p-0 border-red-500/20 bg-red-900/10 hover:bg-red-900/30"
                                variant="ghost"
                            >
                                <div className="p-4 text-left w-full h-full">
                                    <div className="text-[10px] text-red-400 uppercase font-bold mb-1">Plyndring</div>
                                    <div className="text-sm font-black text-white mb-2">Stjæl Cash</div>
                                    <div className="text-xs text-red-500 font-mono">Risiko: Heat++</div>
                                </div>
                            </Button>
                        </div>
                    </div>

                </div>

                {/* COLUMN 2: DEFENSE GRID */}
                <div className="bg-[#0f1012] border border-white/5 p-6 rounded-2xl h-full">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-white font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                            <i className="fa-solid fa-shield-halved text-emerald-500"></i> Headquarters Defense
                        </h3>
                        {/* Bulks */}
                        <BulkControl buyAmount={buyAmount} setBuyAmount={setBuyAmount} />
                    </div>

                    <div className="space-y-4">
                        {Object.entries(CONFIG.defense).map(([id, item]) => {
                            const count = state.defense[id] || 0;
                            let actualAmount = buyAmount === 'max' ? getMaxAffordable(item.baseCost, item.costFactor, count, state.cleanCash) : buyAmount;
                            if (actualAmount <= 0) actualAmount = 1;

                            const cost = getBulkCost(item.baseCost, item.costFactor, count, actualAmount);
                            const canAfford = state.cleanCash >= cost && (buyAmount !== 'max' || actualAmount > 0);

                            return (
                                <div key={id} className="p-4 bg-zinc-900/30 rounded-xl border border-white/5 active:border-emerald-500/30 transition-all flex flex-col gap-3">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-emerald-900/20 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0 text-xl">
                                            <i className={`fa-solid ${id === 'guards' ? 'fa-person-rifle' : id === 'cameras' ? 'fa-video' : 'fa-dungeon'}`}></i>
                                        </div>
                                        <div>
                                            <div className="text-sm font-black text-white uppercase">{item.name}</div>
                                            <div className="text-xs text-zinc-500">{item.desc}</div>
                                            <div className="mt-1 inline-block px-2 py-0.5 bg-black/50 rounded text-[10px] font-mono text-emerald-400 border border-white/5">
                                                +{item.defenseVal} DEFENSE per unit
                                            </div>
                                        </div>
                                        <div className="ml-auto text-right">
                                            <div className="text-xs font-bold text-zinc-500 uppercase">Owned</div>
                                            <div className="text-xl font-mono text-white font-bold">{count}</div>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => buyDefense(id, buyAmount)}
                                        disabled={!canAfford}
                                        className="w-full py-2 flex justify-between px-4 text-xs"
                                        variant={canAfford ? 'primary' : 'neutral'}
                                    >
                                        <span>Køb {buyAmount !== 1 && buyAmount !== 'max' ? `x${buyAmount}` : ''}</span>
                                        <span>{formatNumber(cost)} kr</span>
                                    </Button>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default RivalsTab;
