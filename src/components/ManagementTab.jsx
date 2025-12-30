import React from 'react';
import { CONFIG } from '../config/gameConfig';
import { useManagement } from '../hooks/useManagement';

const ManagementTab = ({ state, setState, addLog }) => {
    // REFACTORED v27: Operations Center (Ex-Crewet)
    // Pillars: 1. Personale (HR) | 2. Drift (Facilities) | 3. Sikkerhed (Security)

    const { buyStaff, fireStaff, buyUpgrade, buyDefense } = useManagement(state, setState, addLog);

    const StaffCard = ({ item, count, role, onBuy, onSell, canAfford, locked }) => (
        <div className={`p-3 bg-zinc-900/40 rounded-xl border border-white/5 hover:border-white/10 transition-all flex justify-between items-center group relative ${locked ? 'opacity-50 grayscale' : ''}`}>
            {locked && (
                <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center rounded-xl backdrop-blur-[1px]">
                    <div className="text-red-500 font-black uppercase text-[10px] flex items-center gap-1 border border-red-500/30 px-2 py-1 rounded bg-black/80">
                        <i className="fa-solid fa-lock"></i>
                        Lvl {item.reqLevel || 1}
                    </div>
                </div>
            )}
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs border border-blue-500/20`}>
                    <i className={`fa-solid ${item.icon || 'fa-user'}`}></i>
                </div>
                <div>
                    <div className="text-[10px] font-bold text-white uppercase">{item.name}</div>
                    <div className="text-[9px] text-zinc-500">{item.desc}</div>
                </div>
            </div>
            <div className="text-right">
                <div className="text-[9px] text-zinc-500 font-mono mb-1">Ansatte: <span className="text-white">{count}</span></div>
                <div className="flex gap-1 justify-end">
                    {count > 0 && onSell && (
                        <button
                            onClick={() => onSell(role)}
                            className="w-6 h-6 flex items-center justify-center rounded bg-zinc-800 text-zinc-500 hover:text-red-400 hover:bg-zinc-700 transition-colors"
                            title="Fyr"
                            disabled={locked}
                        >
                            <i className="fa-solid fa-user-minus text-[10px]"></i>
                        </button>
                    )}
                    <button
                        onClick={() => onBuy(role)}
                        disabled={!canAfford || locked}
                        className={`px-3 py-1 rounded text-[9px] font-bold uppercase transition-all ${canAfford && !locked ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-zinc-800 text-zinc-600'}`}
                    >
                        Ansæt
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto h-full flex flex-col">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white mb-6 flex items-center gap-3">
                <i className="fa-solid fa-briefcase text-blue-500"></i> Operationer
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* COL 1: PERSONALE (HR) */}
                <div className="lg:col-span-1 space-y-4">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2 border-b border-white/5 pb-2">
                        <i className="fa-solid fa-users text-blue-400"></i> Personale (HR)
                    </h3>
                    <div className="flex flex-col gap-2">
                        {Object.keys(CONFIG.staff).map(role => {
                            const item = CONFIG.staff[role];
                            const count = state.staff[role] || 0;
                            const cost = Math.floor(item.baseCost * Math.pow(item.costFactor, count));
                            const canAfford = state.cleanCash >= cost;
                            const locked = state.level < (item.reqLevel || 1);

                            return (
                                <StaffCard
                                    key={role}
                                    item={item}
                                    count={count}
                                    role={role}
                                    onBuy={buyStaff}
                                    onSell={fireStaff}
                                    canAfford={canAfford}
                                    locked={locked}
                                />
                            )
                        })}
                    </div>
                </div>

                {/* COL 2: DRIFT (Facilities) */}
                <div className="lg:col-span-1 space-y-4">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2 border-b border-white/5 pb-2">
                        <i className="fa-solid fa-industry text-orange-400"></i> Drift & Anlæg
                    </h3>
                    <div className="grid grid-col-1 gap-2">
                        {Object.keys(CONFIG.upgrades).map(id => {
                            const item = CONFIG.upgrades[id];
                            const count = state.upgrades[id] || 0;
                            // Fix: Warehouse logic (starts at 1)
                            // Actually warehouse is in upgrades key.

                            const cost = Math.floor(item.baseCost * Math.pow(item.costFactor || 1.5, count));

                            return (
                                <div key={id} className="p-3 bg-zinc-900/40 rounded-xl border border-white/5 flex flex-col justify-between">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="text-[10px] font-bold text-white uppercase">{item.name}</div>
                                            <div className="text-[9px] text-zinc-500">{item.desc}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-mono text-orange-400 font-bold">Lvl {count}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => buyUpgrade(id)}
                                        disabled={state.cleanCash < cost}
                                        className={`w-full py-2 rounded text-[9px] font-bold uppercase transition-all ${state.cleanCash >= cost ? 'bg-orange-600/20 text-orange-400 hover:bg-orange-600 hover:text-white' : 'bg-zinc-800 text-zinc-600'}`}
                                    >
                                        Opgrader {cost.toLocaleString()}
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* COL 3: SIKKERHED (Defense) */}
                <div className="lg:col-span-1 space-y-4">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2 border-b border-white/5 pb-2">
                        <i className="fa-solid fa-shield-dog text-red-500"></i> Sikkerhed
                    </h3>
                    <div className="p-4 bg-red-950/20 rounded-xl border border-red-500/20 mb-4 flex items-center justify-between">
                        <div>
                            <div className="text-[10px] text-red-400 font-bold uppercase">Risiko Status</div>
                            <div className="text-xs text-red-200">
                                {state.heat < 30 ? 'Lav' : state.heat < 70 ? 'Middel' : 'Høj (RAZZIA OVERHÆNGENDE)'}
                            </div>
                        </div>
                        <i className="fa-solid fa-land-mine-on text-2xl text-red-500 animate-pulse"></i>
                    </div>

                    <div className="flex flex-col gap-2">
                        {Object.keys(CONFIG.defense).map(id => {
                            const item = CONFIG.defense[id];
                            const count = state.defense[id] || 0;
                            const cost = Math.floor(item.baseCost * Math.pow(item.costFactor, count));

                            return (
                                <div key={id} className="p-3 bg-zinc-900/40 rounded-xl border border-white/5 flex flex-col justify-between">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="text-[10px] font-bold text-white uppercase">{item.name}</div>
                                            <div className="text-[9px] text-zinc-500">{item.desc}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-mono text-white font-bold">{count}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => buyDefense(id)}
                                        disabled={state.cleanCash < cost}
                                        className={`w-full py-2 rounded text-[9px] font-bold uppercase transition-all ${state.cleanCash >= cost ? 'bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white' : 'bg-zinc-800 text-zinc-600'}`}
                                    >
                                        Køb {cost.toLocaleString()}
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagementTab;
