import React, { useState, useEffect, useRef } from 'react';
import { CONFIG } from '../config/gameConfig';
import Button from './Button';

const ProductionCard = ({ item, state, produce, onSell, toggleAutoSell, addFloat }) => {
    const locked = state.level < item.unlockLevel;
    const count = state.inv[item.id] || 0;
    const producedCount = state.stats.produced[item.id] || 0;
    const processing = state.isProcessing[item.id];
    const [animate, setAnimate] = useState(false);
    const [activeTooltip, setActiveTooltip] = useState(null); // 'prod' | 'sell' | null
    const prevCountRef = useRef(producedCount);
    const [now, setNow] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    // Safety: Tailwind dynamic classes fix (100-Expert Audit)
    const colorMap = {
        emerald: { border: 'active:border-emerald-500/30', text: 'text-emerald-400', bg: 'bg-emerald-900/10', ring: 'ring-emerald-500/20', lightText: 'text-emerald-300', lightBg: 'bg-emerald-900/30', glow: 'shadow-emerald-500/40' },
        blue: { border: 'active:border-blue-500/30', text: 'text-blue-400', bg: 'bg-blue-900/10', ring: 'ring-blue-500/20', lightText: 'text-blue-300', lightBg: 'bg-blue-900/30', glow: 'shadow-blue-500/40' },
        indigo: { border: 'active:border-indigo-500/30', text: 'text-indigo-400', bg: 'bg-indigo-900/10', ring: 'ring-indigo-500/20', lightText: 'text-indigo-300', lightBg: 'bg-indigo-900/30', glow: 'shadow-indigo-500/40' },
        purple: { border: 'active:border-purple-500/30', text: 'text-purple-400', bg: 'bg-purple-900/10', ring: 'ring-purple-500/20', lightText: 'text-purple-300', lightBg: 'bg-purple-900/30', glow: 'shadow-purple-500/40' },
        teal: { border: 'active:border-teal-500/30', text: 'text-teal-400', bg: 'bg-teal-900/10', ring: 'ring-teal-500/20', lightText: 'text-teal-300', lightBg: 'bg-teal-900/30', glow: 'shadow-teal-500/40' },
        amber: { border: 'active:border-amber-500/30', text: 'text-amber-400', bg: 'bg-amber-900/10', ring: 'ring-amber-500/20', lightText: 'text-amber-300', lightBg: 'bg-amber-900/30', glow: 'shadow-amber-500/40' },
        red: { border: 'active:border-red-500/30', text: 'text-red-400', bg: 'bg-red-900/10', ring: 'ring-red-500/20', lightText: 'text-red-300', lightBg: 'bg-red-900/30', glow: 'shadow-red-500/40' },
    };
    const colors = colorMap[item.color] || colorMap.emerald;

    // Rate Logic (existing)
    const rates = state.productionRates?.[item.id] || { produced: 0, sold: 0 };
    const prodRate = rates.produced * 10;
    const sellRate = rates.sold * 10;
    // Dynamic Staff Logic
    const getStaffInfo = () => {
        let producers = [];
        let sellers = [];
        let pCount = 0;
        let sCount = 0;

        Object.entries(CONFIG.staff).forEach(([role, data]) => {
            if (data.rates && data.rates[item.id]) {
                if (data.role === 'producer') {
                    producers.push(data.name);
                    pCount += (state.staff[role] || 0);
                } else if (data.role === 'seller') {
                    sellers.push(data.name);
                    sCount += (state.staff[role] || 0);
                }
            }
        });

        const prodStr = producers.length > 0 ? producers.join('/') : '?';
        const sellStr = sellers.length > 0 ? sellers.join('/') : '?';

        return { prod: prodStr, sell: sellStr, pCount, sCount };
    };
    const staff = getStaffInfo();

    // Upgrades Logic
    const hasHydro = state.upgrades.hydro && ['hash_lys', 'hash_moerk'].includes(item.id);
    const hasLab = state.upgrades.lab && item.id === 'speed';

    useEffect(() => {
        if (producedCount > prevCountRef.current) {
            const diff = producedCount - prevCountRef.current;
            setTimeout(() => setAnimate(true), 0);
            const timer = setTimeout(() => setAnimate(false), 200);
            prevCountRef.current = producedCount;

            // Trigger Particle
            if (addFloat && cardRef.current) {
                // Get card position to spawn float near the icon/number
                const rect = cardRef.current.getBoundingClientRect();
                // Random drift
                const x = rect.left + rect.width / 2 + (Math.random() * 40 - 20);
                const y = rect.top + rect.height / 2 + (Math.random() * 20 - 10);

                // Only show +1 every few ticks if fast? 
                // Alternatively, just show "+Amount"
                addFloat(x, y, `+${diff} ${item.name}`, 'text-zinc-500 font-bold text-xs');
            }
            return () => clearTimeout(timer);
        }
    }, [producedCount]);

    const isAutomated = state.autoSell?.[item.id] !== false;

    const cardRef = useRef(null);

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
            ref={cardRef}
            className={`
                relative flex flex-col justify-between overflow-hidden rounded-xl border transition-all duration-300 group select-none
                ${locked ? '' : `bg-[#0f1012] border-white/5 ${colors.border}`}
            `}
        >
            {/* PULSE EFFECT */}
            {animate && <div className={`absolute inset-0 bg-${item.color}-500/10 z-0 animate-pulse duration-75`}></div>}

            {/* STORAGE FULL OVERLAY */}
            {Object.values(state.inv).reduce((a, b) => a + b, 0) >= (50 * (state.upgrades.warehouse || 1)) && (
                <div className="absolute top-0 left-0 right-0 h-[60%] z-30 bg-black/80 flex flex-col items-center justify-center text-center p-4 backdrop-blur-[2px] border-b border-red-500/30">
                    <i className="fa-solid fa-triangle-exclamation text-red-500 text-3xl mb-2 animate-bounce drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]"></i>
                    <div className="text-white font-black uppercase text-sm tracking-widest">LAGER FULDT!</div>
                    <div className="text-red-400 text-[9px] font-mono mt-1">SÆLG VARER NU</div>
                </div>
            )}

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
                            {/* NEW DESCRIPTION */}
                            <div className="text-[10px] text-zinc-500 mt-0.5 leading-tight font-terminal truncate max-w-[150px]">
                                {item.desc || 'Producér og sælg.'}
                            </div>
                            {/* DURATION */}
                            <div className="text-[9px] text-zinc-600 flex items-center gap-1 mt-1">
                                <i className="fa-solid fa-clock opacity-50"></i> {(item.duration / 1000).toFixed(1)}s
                            </div>
                        </div>
                    </div>

                    {/* BIG NUMBER */}
                    <div className="text-right">
                        <div className={`text-2xl font-black mono leading-none tracking-tighter transition-all duration-100 ${animate ? `scale-125 text-${item.color}-400` : 'text-white'}`}>
                            {count}
                        </div>
                        <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Lager</div>
                    </div>
                </div>
            </div>

            {/* FLOW RATES & STAFF */}
            < div className="grid grid-cols-2 gap-2 mb-3 relative" >
                {/* PRODUCTION SIDE */}
                < div
                    onClick={(e) => { e.stopPropagation(); setActiveTooltip(activeTooltip === 'prod' ? null : 'prod'); }}
                    className={`bg-black/40 rounded p-2 border relative overflow-visible cursor-pointer active:scale-95 transition-all
                            ${activeTooltip === 'prod' ? 'border-emerald-500/50 bg-emerald-900/10' : 'border-white/5 active:border-white/10'}
                        `}
                >
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] text-zinc-500 uppercase font-bold">Prod</span>
                        {staff.pCount > 0 && <span className="text-[9px] text-emerald-400 font-bold bg-emerald-900/20 px-1 rounded">{staff.pCount}x</span>}
                    </div>
                    <div className="font-mono text-zinc-300 font-bold text-xs">
                        {prodRate > 0 ? <span className="text-emerald-400">+{prodRate.toFixed(1)}/s</span> : <span className="text-zinc-600">0/s</span>}
                    </div>
                    <div className="text-[8px] text-zinc-600 mt-0.5 truncate">{staff.prod}</div>

                    {/* TOOLTIP */}
                    {
                        activeTooltip === 'prod' && (
                            <div className="absolute bottom-full left-0 mb-2 w-48 bg-black border border-emerald-500/30 rounded-lg p-3 shadow-xl z-50 animate-in fade-in slide-in-from-bottom-2">
                                <h4 className="text-xs font-bold text-white mb-2 pb-1 border-b border-white/10 font-terminal">Produktion Detaljer</h4>
                                <div className="space-y-1 text-[10px] font-mono font-terminal">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Staff ({staff.pCount})</span>
                                        <span className="text-zinc-300">Base</span>
                                    </div>
                                    {hasHydro && (
                                        <div className="flex justify-between text-emerald-400">
                                            <span>Hydroponics</span>
                                            <span>x1.5</span>
                                        </div>
                                    )}
                                    {hasLab && (
                                        <div className="flex justify-between text-purple-400">
                                            <span>Lab Udstyr</span>
                                            <span>x1.5</span>
                                        </div>
                                    )}
                                    <div className="border-t border-white/10 pt-1 mt-1 flex justify-between font-bold">
                                        <span className="text-white">Total</span>
                                        <span className="text-emerald-400">{prodRate.toFixed(1)} /s</span>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div >

                {/* SALES SIDE */}
                < div
                    onClick={(e) => { e.stopPropagation(); setActiveTooltip(activeTooltip === 'sell' ? null : 'sell'); }}
                    className={`bg-black/40 rounded p-2 border relative overflow-visible cursor-pointer active:scale-95 transition-all
                            ${activeTooltip === 'sell' ? 'border-amber-500/50 bg-amber-900/10' : 'border-white/5 active:border-white/10'}
                        `}
                >
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] text-zinc-500 uppercase font-bold">Salg</span>
                        {staff.sCount > 0 && <span className="text-[9px] text-amber-400 font-bold bg-amber-900/20 px-1 rounded">{staff.sCount}x</span>}
                    </div>
                    <div className="font-mono text-zinc-300 font-bold text-xs">
                        {sellRate > 0 ? <span className="text-amber-400">-{sellRate.toFixed(1)}/s</span> : <span className="text-zinc-600">0/s</span>}
                    </div>
                    <div className="text-[8px] text-zinc-600 mt-0.5 truncate">{staff.sell}</div>

                    {/* TOOLTIP */}
                    {
                        activeTooltip === 'sell' && (
                            <div className="absolute bottom-full right-0 mb-2 w-48 bg-black border border-amber-500/30 rounded-lg p-3 shadow-xl z-50 animate-in fade-in slide-in-from-bottom-2">
                                <h4 className="text-xs font-bold text-white mb-2 pb-1 border-b border-white/10 font-terminal">Salg Detaljer</h4>
                                <div className="space-y-1 text-[10px] font-mono font-terminal">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Sælgere ({staff.sCount})</span>
                                        <span className="text-zinc-300">Base</span>
                                    </div>
                                    {state.activeBuffs?.hype > now && (
                                        <div className="flex justify-between text-amber-400">
                                            <span>HYPE!</span>
                                            <span>x2.0</span>
                                        </div>
                                    )}
                                    <div className="border-t border-white/10 pt-1 mt-1 flex justify-between font-bold">
                                        <span className="text-white">Total</span>
                                        <span className="text-amber-400">{sellRate.toFixed(1)} /s</span>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div >
            </div >

            {/* MANUAL PRODUCE BUTTON */}
            < div className="px-4 mb-3 relative z-10" >
                <Button
                    onClick={(e) => {
                        if (!processing) {
                            produce(item.id, e);
                            addFloat && addFloat(e.clientX, e.clientY, `+${item.batchSize || 1} ${item.name}`, 'success');
                            spawnParticles(e.clientX, e.clientY, 'cash', 8);
                        }
                    }}
                    disabled={processing}
                    variant="ghost"
                    className={`w-full !py-2.5 rounded-lg font-black uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2 h-auto
                        ${processing
                            ? '!bg-zinc-800 !text-zinc-600 cursor-wait !border-white/5'
                            : `!bg-zinc-900 border !border-${item.color}-500/30 !text-${item.color}-400 active:!bg-${item.color}-500 active:!text-white active:shadow-[0_0_15px_rgba(var(--color-${item.color}-500),0.4)] active:scale-95`}
                    `}
                >
                    {processing ? (
                        <><i className="fa-solid fa-circle-notch fa-spin"></i> PRODUCERER...</>
                    ) : (
                        <><i className="fa-solid fa-hammer"></i> PRODUCER NU</>
                    )}
                </Button>
            </div >

            {/* CONTROLS */}
            < div className="mt-auto bg-black/20 p-3 pt-0 border-t border-white/5 relative z-10" >
                {processing && <div className="absolute top-0 left-0 h-[1px] bg-green-500 z-50 animate-pulse w-full"></div>}

                <div className="flex justify-between items-center h-10 mb-2">
                    {/* AUTO TOGGLE */}
                    <div
                        className={`flex items-center gap-3 cursor-pointer group/toggle p-2 rounded-lg border transition-all duration-300 relative overflow-hidden
                            ${isAutomated
                                ? `bg-${item.color}-900/50 border-${item.color}-400 shadow-[0_0_15px_-3px_rgba(var(--color-${item.color}-500),0.4)]`
                                : 'bg-black border-zinc-800 hover:border-zinc-600'}
                        `}
                        onClick={(e) => { e.stopPropagation(); toggleAutoSell(item.id); }}
                    >
                        {/* Status Light */}
                        <div className={`w-2 h-2 rounded-full shadow-[0_0_5px_currentColor] transition-colors duration-300 ${isAutomated ? `text-${item.color}-400 bg-${item.color}-400` : 'text-zinc-700 bg-zinc-700'}`}></div>

                        <div className="flex flex-col">
                            <span className={`text-[9px] font-black uppercase tracking-wider leading-none mb-0.5 transition-colors ${isAutomated ? 'text-white' : 'text-zinc-500'}`}>
                                {isAutomated ? 'Auto-Salg: ON' : 'Auto-Salg: OFF'}
                            </span>
                        </div>
                    </div>

                    {/* MANUAL SELL */}
                    <Button
                        onClick={(e) => onSell(item.id, count, e)}
                        disabled={count < 1}
                        className="px-3 py-1 !h-auto text-[10px]"
                        size="sm"
                        variant="neutral"
                    >
                        SÆLG ALT
                    </Button>
                </div>
            </div >
        </div >
    );
};

export default React.memo(ProductionCard, (prev, next) => {
    // Custom comparison for high performance
    // Only re-render if:
    // 1. Item count changed
    // 2. Processing state changed
    // 3. Locked state changed
    // 4. Rate changed significantly? No, rates are derived from state.
    // Let's stick to shallow compare of props or specific ids.

    // Actually, state.inv is a big object. Passing 'state' as prop kills memoization.
    // We should only pass relevant slices of state in parent, OR
    // Just compare specific props provided they are primitives.

    // BUT ProductionCard receives `state` object.
    // So React.memo is useless unless we change how props are passed or do deep custom compare.
    // Custom compare:
    if (prev.item.id !== next.item.id) return false;
    if (prev.state.inv[prev.item.id] !== next.state.inv[next.item.id]) return false;
    if (prev.state.isProcessing[prev.item.id] !== next.state.isProcessing[next.item.id]) return false;
    if (prev.state.level < prev.item.unlockLevel !== next.state.level < next.item.unlockLevel) return false;
    if (prev.state.autoSell?.[prev.item.id] !== next.state.autoSell?.[next.item.id]) return false;

    // Simple deep check for relevant stats to avoid re-render on unrelated state changes (like logs or other items)
    // Rates check:
    const prevRates = prev.state.productionRates?.[prev.item.id] || { produced: 0, sold: 0 };
    const nextRates = next.state.productionRates?.[next.item.id] || { produced: 0, sold: 0 };
    if (prevRates.produced !== nextRates.produced || prevRates.sold !== nextRates.sold) return false;

    return true; // Props are "equal" for rendering purposes
});
