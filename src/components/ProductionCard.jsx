import React, { useState, useEffect, useRef } from 'react';

const ProductionCard = ({ item, state, produce, onSell, price, toggleAutoSell }) => {
    const locked = state.level < item.unlockLevel;
    const count = state.inv[item.id] || 0;
    const producedCount = state.stats.produced[item.id] || 0;
    const processing = state.isProcessing[item.id];
    const [animate, setAnimate] = useState(false);
    const prevCountRef = useRef(producedCount);

    // XP Calculation (Estimated based on revenue)
    const estimatedXP = Math.floor((item.baseRevenue || price) * 0.1);

    useEffect(() => {
        if (producedCount > prevCountRef.current) {
            setAnimate(true);
            const timer = setTimeout(() => setAnimate(false), 200);
            prevCountRef.current = producedCount;
            return () => clearTimeout(timer);
        }
    }, [producedCount]);

    const isAutomated = state.autoSell?.[item.id] !== false; // Default true if undefined

    return (
        <div
            onClick={(e) => { if (!locked && !processing) produce(item.id, e); }}
            className={`
                relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-300 group select-none
                ${locked
                    ? 'bg-zinc-950/50 border-white/5 opacity-75 grayscale'
                    : `bg-zinc-900/80 border-white/5 hover:border-${item.color}-500/30 hover:shadow-[0_0_30px_-10px_rgba(var(--color-${item.color}-500),0.2)]`
                }
            `}
        >
            {/* BACKGROUND GLOW on PRODUCE */}
            {animate && <div className={`absolute inset-0 bg-${item.color}-500/20 z-0 animate-pulse duration-75`}></div>}

            {/* HEADER */}
            <div className="p-4 relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-3 items-center">
                        <div className={`
                            w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-lg
                            ${locked ? 'bg-zinc-800 text-zinc-600' : `bg-black/50 text-${item.color}-400 border border-${item.color}-500/20 shadow-[0_0_15px_-5px_rgba(var(--color-${item.color}-500),0.4)]`}
                            ${animate ? 'scale-110' : ''} transition-transform duration-200
                        `}>
                            <i className={`fa-solid ${item.icon}`}></i>
                        </div>
                        <div>
                            <h3 className={`font-bold text-sm tracking-wide ${locked ? 'text-zinc-500' : 'text-white'}`}>{item.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${locked ? 'bg-zinc-800 text-zinc-500' : `bg-${item.color}-900/30 text-${item.color}-300 border border-${item.color}-500/20`}`}>
                                    {locked ? `LÅS OP LVL ${item.unlockLevel}` : 'ACTIVE'}
                                </span>
                                {!locked && (
                                    <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                                        <i className="fa-solid fa-clock opacity-50"></i> {(item.duration / 1000).toFixed(1)}s
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* INVENTORY COUNT */}
                    <div className="text-right">
                        <div className={`text-2xl font-black mono leading-none tracking-tighter ${locked ? 'text-zinc-700' : 'text-zinc-100'}`}>
                            {count}
                        </div>
                        <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Lager</div>
                    </div>
                </div>

                {/* METRICS GRID */}
                {!locked && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-black/20 rounded p-2 border border-white/5 flex flex-col min-w-0">
                            <span className="text-[9px] text-zinc-500 uppercase font-bold truncate">Markedspris</span>
                            <span className="font-mono text-emerald-400 font-bold text-sm truncate">{price} kr.</span>
                        </div>
                        <div className="bg-black/20 rounded p-2 border border-white/5 flex flex-col min-w-0">
                            <span className="text-[9px] text-zinc-500 uppercase font-bold truncate">XP Potentiale</span>
                            <span className="font-mono text-purple-400 font-bold text-sm truncate">+{estimatedXP} XP</span>
                        </div>
                    </div>
                )}
            </div>

            {/* CONTROLS SECTION */}
            <div className="mt-auto bg-black/20 p-3 pt-0 border-t border-white/5 relative z-10">
                {/* PROGRESS BAR OVERLAY */}
                {processing && (
                    <div className="absolute top-0 left-0 h-[1px] bg-green-500 z-50 animate-pulse w-full"></div>
                )}

                {/* PRODUCE BUTTON */}
                <button
                    disabled={locked || processing}
                    onClick={(e) => { e.stopPropagation(); produce(item.id, e); }}
                    className={`
                        w-full h-10 mb-3 rounded-lg font-bold text-[11px] uppercase tracking-wider relative overflow-hidden transition-all
                        ${locked
                            ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                            : processing
                                ? 'bg-zinc-800 text-zinc-400 cursor-wait'
                                : 'bg-white text-black hover:bg-zinc-200 active:scale-[0.98] shadow-lg shadow-white/5'
                        }
                    `}
                >
                    <span className="relative z-20 flex items-center justify-center gap-2">
                        {processing ? <><i className="fa-solid fa-gear fa-spin"></i> PRODUCERER...</> : 'PRODUCER ENHED'}
                    </span>
                    {processing && (
                        <div
                            className="absolute inset-0 bg-green-500/20 z-10 origin-left"
                            style={{
                                animation: `progress ${item.duration}ms linear forwards`
                            }}
                        ></div>
                    )}
                </button>

                {/* FOOTER ACTIONS */}
                {!locked && (
                    <div className="flex justify-between items-center gap-2">
                        {/* Auto-Sell Toggle */}
                        <div
                            className="flex items-center gap-2 cursor-pointer group/toggle p-1 rounded hover:bg-white/5 transition-colors"
                            onClick={(e) => { e.stopPropagation(); toggleAutoSell(item.id); }}
                            title="Tænd/Sluk automatisk salg for denne vare"
                        >
                            <div className={`w-6 h-3 rounded-full relative transition-colors ${isAutomated ? `bg-${item.color}-500/50` : 'bg-zinc-700'}`}>
                                <div className={`absolute top-0.5 w-2 h-2 rounded-full bg-white shadow-sm transition-all duration-200 ${isAutomated ? 'left-3.5' : 'left-0.5'}`}></div>
                            </div>
                            <span className={`text-[9px] font-bold uppercase ${isAutomated ? 'text-zinc-300' : 'text-zinc-600'}`}>Auto-Salg</span>
                        </div>

                        {/* Sell Actions */}
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => onSell(item.id, 1)}
                                disabled={count < 1}
                                className="h-9 min-w-[36px] bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-zinc-800 rounded text-[10px] font-mono font-bold text-zinc-400 hover:text-white border border-white/5 transition-colors flex items-center justify-center"
                            >
                                1
                            </button>
                            <button
                                onClick={() => onSell(item.id, 10)}
                                disabled={count < 10}
                                className="h-9 min-w-[36px] bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-zinc-800 rounded text-[10px] font-mono font-bold text-zinc-400 hover:text-white border border-white/5 transition-colors flex items-center justify-center"
                            >
                                10
                            </button>
                            <button
                                onClick={() => onSell(item.id, count)}
                                disabled={count < 1}
                                className="h-9 px-3 bg-red-500/10 hover:bg-red-500/20 disabled:opacity-30 disabled:hover:bg-red-500/10 rounded text-[10px] font-bold text-red-500 border border-red-500/20 transition-colors flex items-center justify-center"
                            >
                                ALT
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductionCard;
