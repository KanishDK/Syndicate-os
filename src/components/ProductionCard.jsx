import React, { useState, useEffect, useRef } from 'react';
import { CONFIG } from '../config/gameConfig';

const ProductionCard = ({ item, state, produce, onSell, price, toggleAutoSell }) => {
    const locked = state.level < item.unlockLevel;
    const count = state.inv[item.id] || 0;
    const producedCount = state.stats.produced[item.id] || 0;
    const processing = state.isProcessing[item.id];
    const [animate, setAnimate] = useState(false);
    const prevCountRef = useRef(producedCount);

    // Rate Logic
    const rates = state.productionRates?.[item.id] || { produced: 0, sold: 0 };
    const prodRate = rates.produced * 10; // Approx /sec if tick is 100ms
    const sellRate = rates.sold * 10;

    // Staff Logic
    const getStaffInfo = () => {
        if (item.id === 'hash_lys') return { prod: 'Junkie/Grower', sell: 'Pusher', pCount: (state.staff.junkie || 0) + (state.staff.grower || 0), sCount: state.staff.pusher || 0 };
        if (item.id === 'piller_mild') return { prod: 'Junkie', sell: 'Pusher', pCount: state.staff.junkie || 0, sCount: state.staff.pusher || 0 };
        if (item.id === 'hash_moerk') return { prod: 'Grower', sell: 'Distributor', pCount: state.staff.grower || 0, sCount: state.staff.distributor || 0 };
        if (item.id === 'speed') return { prod: 'Chemist', sell: 'Distributor', pCount: state.staff.chemist || 0, sCount: state.staff.distributor || 0 };
        if (item.id === 'coke') return { prod: 'Importer', sell: 'Trafficker', pCount: state.staff.importer || 0, sCount: state.staff.trafficker || 0 };
        if (item.id === 'fentanyl') return { prod: 'Labtech', sell: 'Trafficker', pCount: state.staff.labtech || 0, sCount: state.staff.trafficker || 0 };
        return { prod: '?', sell: '?', pCount: 0, sCount: 0 };
    };
    const staff = getStaffInfo();

    // Upgrades Logic
    const hasHydro = state.upgrades.hydro && ['hash_lys', 'hash_moerk'].includes(item.id);
    const hasLab = state.upgrades.lab && item.id === 'speed';

    useEffect(() => {
        if (producedCount > prevCountRef.current) {
            setAnimate(true);
            const timer = setTimeout(() => setAnimate(false), 200);
            prevCountRef.current = producedCount;
            return () => clearTimeout(timer);
        }
    }, [producedCount]);

    const isAutomated = state.autoSell?.[item.id] !== false;

    if (locked) return (
        <div className="bg-zinc-950/40 border border-white/5 p-4 rounded-xl flex items-center gap-4 opacity-50 grayscale select-none">
            <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center text-zinc-700 text-xl font-bold"><i className={`fa-solid ${item.icon}`}></i></div>
            <div>
                <h3 className="font-bold text-zinc-500">{item.name}</h3>
                <div className="text-[10px] bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded inline-block mt-1">LVL {item.unlockLevel}</div>
            </div>
        </div>
    );

    return (
        <div
            className={`
                relative flex flex-col justify-between overflow-hidden rounded-xl border transition-all duration-300 group select-none
                ${locked ? '' : `bg-[#0f1012] border-white/5 hover:border-${item.color}-500/30 hover:shadow-[0_0_30px_-10px_rgba(var(--color-${item.color}-500),0.1)]`}
            `}
        >
            {/* PULSE EFFECT */}
            {animate && <div className={`absolute inset-0 bg-${item.color}-500/10 z-0 animate-pulse duration-75`}></div>}

            {/* HEADER */}
            <div className="p-4 relative z-10 pb-2">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-3 items-center">
                        <div
                            onClick={(e) => { if (!processing) produce(item.id, e); }}
                            className={`
                            w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-lg cursor-pointer active:scale-95 transition-transform
                            bg-zinc-900 text-${item.color}-400 border border-${item.color}-500/20 shadow-[0_0_15px_-5px_rgba(var(--color-${item.color}-500),0.2)]
                            ${animate ? 'scale-105 ring-2 ring-white/20' : ''}
                        `}>
                            <i className={`fa-solid ${item.icon}`}></i>
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-sm tracking-wide flex items-center gap-2">
                                {item.name}
                                {hasHydro && <i className="fa-solid fa-water text-[10px] text-blue-400" title="Hydroponics Boost"></i>}
                                {hasLab && <i className="fa-solid fa-flask text-[10px] text-purple-400" title="Lab Boost"></i>}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className={`text-[9px] font-mono px-1.5 rounded bg-${item.color}-900/30 text-${item.color}-300 border border-${item.color}-500/20`}>
                                    ACTIVE
                                </span>
                                {/* DURATION */}
                                <span className="text-[9px] text-zinc-500 flex items-center gap-1">
                                    <i className="fa-solid fa-clock opacity-50"></i> {(item.duration / 1000).toFixed(1)}s
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* BIG NUMBER */}
                    <div className="text-right">
                        <div className="text-2xl font-black mono leading-none tracking-tighter text-white">{count}</div>
                        <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Lager</div>
                    </div>
                </div>

                {/* FLOW RATES & STAFF */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                    {/* PRODUCTION SIDE */}
                    <div className="bg-black/40 rounded p-2 border border-white/5 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[9px] text-zinc-500 uppercase font-bold">Prod</span>
                            {staff.pCount > 0 && <span className="text-[9px] text-emerald-400 font-bold bg-emerald-900/20 px-1 rounded">{staff.pCount}x</span>}
                        </div>
                        <div className="font-mono text-zinc-300 font-bold text-xs">
                            {prodRate > 0 ? <span className="text-emerald-400">+{prodRate}/s</span> : <span className="text-zinc-600">0/s</span>}
                        </div>
                        <div className="text-[8px] text-zinc-600 mt-0.5 truncate">{staff.prod}</div>
                    </div>

                    {/* SALES SIDE */}
                    <div className="bg-black/40 rounded p-2 border border-white/5 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[9px] text-zinc-500 uppercase font-bold">Salg</span>
                            {staff.sCount > 0 && <span className="text-[9px] text-amber-400 font-bold bg-amber-900/20 px-1 rounded">{staff.sCount}x</span>}
                        </div>
                        <div className="font-mono text-zinc-300 font-bold text-xs">
                            {sellRate > 0 ? <span className="text-amber-400">-{sellRate}/s</span> : <span className="text-zinc-600">0/s</span>}
                        </div>
                        <div className="text-[8px] text-zinc-600 mt-0.5 truncate">{staff.sell}</div>
                    </div>
                </div>
            </div>

            {/* MANUAL PRODUCE BUTTON */}
            <div className="px-4 mb-3 relative z-10">
                <button
                    onClick={(e) => { if (!processing) produce(item.id, e); }}
                    disabled={processing}
                    className={`w-full py-2.5 rounded-lg font-black uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2
                        ${processing
                            ? 'bg-zinc-800 text-zinc-600 cursor-wait border border-white/5'
                            : `bg-zinc-900 border border-${item.color}-500/30 text-${item.color}-400 hover:bg-${item.color}-500 hover:text-white hover:shadow-[0_0_15px_rgba(var(--color-${item.color}-500),0.4)] active:scale-95`}
                    `}
                >
                    {processing ? (
                        <><i className="fa-solid fa-circle-notch fa-spin"></i> PRODUCERER...</>
                    ) : (
                        <><i className="fa-solid fa-hammer"></i> PRODUCER NU</>
                    )}
                </button>
            </div>

            {/* CONTROLS */}
            <div className="mt-auto bg-black/20 p-3 pt-0 border-t border-white/5 relative z-10">
                {processing && <div className="absolute top-0 left-0 h-[1px] bg-green-500 z-50 animate-pulse w-full"></div>}

                <div className="flex justify-between items-center h-10 mb-2">
                    {/* AUTO TOGGLE */}
                    <div
                        className="flex items-center gap-2 cursor-pointer group/toggle p-1 rounded hover:bg-white/5 transition-colors"
                        onClick={(e) => { e.stopPropagation(); toggleAutoSell(item.id); }}
                    >
                        <div className={`w-6 h-3 rounded-full relative transition-colors ${isAutomated ? `bg-${item.color}-500/50` : 'bg-zinc-700'}`}>
                            <div className={`absolute top-0.5 w-2 h-2 rounded-full bg-white shadow-sm transition-all duration-200 ${isAutomated ? 'left-3.5' : 'left-0.5'}`}></div>
                        </div>
                        <span className={`text-[9px] font-bold uppercase ${isAutomated ? 'text-zinc-300' : 'text-zinc-600'}`}>Auto</span>
                    </div>

                    {/* MANUAL SELL */}
                    <button
                        onClick={() => onSell(item.id, count)}
                        disabled={count < 1}
                        className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 rounded text-[10px] font-bold text-zinc-400 hover:text-white border border-white/5 transition-colors"
                    >
                        SÆLG ALT
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductionCard;
