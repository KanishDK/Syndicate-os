import React, { useState } from 'react';
import { CONFIG } from '../config/gameConfig';
import { useFinance } from '../hooks/useFinance';
import { formatNumber } from '../utils/gameMath';

// Sparkline Component
const Sparkline = ({ data, color }) => {
    if (!data || data.length < 2) return <div className="h-10 w-full bg-white/5 rounded"></div>;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const height = 40;
    const width = 100; // percent

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = height - ((d - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg className="w-full h-10 overflow-visible" viewBox={`0 0 100 40`} preserveAspectRatio="none">
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="2"
                points={points}
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
};

const FinanceTab = ({ state, setState, addLog, addFloat }) => {
    const { paySalaries, launder, borrow, repay } = useFinance(state, setState, addLog);

    // Helpers
    const getCryptoValue = () => {
        let val = 0;
        Object.keys(CONFIG.crypto.coins).forEach(key => {
            val += (state.crypto?.wallet?.[key] || 0) * (state.crypto?.prices?.[key] || 0);
        });
        return val;
    };

    const handleLaunder = (e, factor) => {
        if (state.dirtyCash <= 0) return;

        // Calculate estimated clean amount for visual (Hook handles actual logic)
        // Rate is typically CONFIG.launderingRate (e.g. 0.6)
        // Check economy.js or hook for exact math if needed, but approximation is fine for Juice
        const amount = state.dirtyCash * factor;
        const projectedClean = amount * (CONFIG.launderingRate || 0.6); // Fallback

        launder(factor);

        if (addFloat) {
            addFloat(`+${formatNumber(projectedClean)} Ren`, e.clientX, e.clientY - 20, 'text-emerald-400 font-bold text-xl');
            addFloat(`-${formatNumber(amount)} Sort`, e.clientX, e.clientY + 20, 'text-red-500 font-mono text-xs');
        }
    };

    const netWorth = state.cleanCash + state.dirtyCash + getCryptoValue() - state.debt;
    const dailyExpenses = Object.keys(CONFIG.staff).reduce((acc, role) => acc + ((state.staff[role] || 0) * (CONFIG.staff[role].salary || 0)), 0);

    const buyCrypto = (coin, percentage) => {
        const price = state.crypto?.prices?.[coin];
        if (!price) return;

        const afford = Math.floor(state.cleanCash / price);
        let amount = afford; // Default max

        if (percentage < 1) amount = Math.floor(afford * percentage);
        if (amount < 1) return; // Can't buy 0

        const cost = amount * price;

        setState(prev => ({
            ...prev,
            cleanCash: prev.cleanCash - cost,
            crypto: {
                ...prev.crypto,
                wallet: { ...prev.crypto.wallet, [coin]: (prev.crypto.wallet[coin] || 0) + amount }
            }
        }));
        addLog(`Købte ${amount}x ${CONFIG.crypto.coins[coin].name}`, 'success');
    };

    const sellCrypto = (coin, percentage) => {
        const held = state.crypto?.wallet?.[coin] || 0;
        let amount = held;
        if (percentage < 1) amount = Math.floor(held * percentage);
        if (amount < 1) return;

        const price = state.crypto?.prices?.[coin] || 0;
        const value = amount * price;

        setState(prev => ({
            ...prev,
            cleanCash: prev.cleanCash + value,
            crypto: {
                ...prev.crypto,
                wallet: { ...prev.crypto.wallet, [coin]: prev.crypto.wallet[coin] - amount }
            }
        }));
        addLog(`Solgte ${amount}x ${CONFIG.crypto.coins[coin].name}`, 'success');
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* HERITAGE HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
                        <i className="fa-solid fa-vault text-amber-500"></i> Finansministeriet
                    </h2>
                    <p className="text-zinc-400 text-sm mt-1">Styr din økonomi, vask dine penge, og invester i fremtiden.</p>
                </div>
                <div className="text-right">
                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Estimeret Net Worth</div>
                    <div className={`text-4xl font-mono font-black ${netWorth > 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                        {formatNumber(netWorth)} kr
                    </div>
                </div>
            </div>

            {/* OPERATIONAL GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* 1. LAUNDERING & BANKING */}
                <div className="space-y-6">
                    {/* HVIDVASK */}
                    <div className="bg-[#0f1012] border border-white/5 p-6 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5"><i className="fa-solid fa-soap text-8xl"></i></div>

                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-emerald-500 font-bold uppercase tracking-wider text-sm"><i className="fa-solid fa-hands-wash mr-2"></i>Hvidvask</h3>
                            <div className="px-2 py-1 bg-emerald-900/20 rounded border border-emerald-500/20 text-[10px] text-emerald-400 font-mono">
                                Rate: {((CONFIG.launderingRate * (state.upgrades.studio ? 1.2 : 1)) * 100).toFixed(0)}%
                            </div>
                        </div>

                        <div className="flex items-end justify-between mb-6">
                            <div>
                                <div className="text-xs text-zinc-500 uppercase font-bold mb-1">Sorte Penge</div>
                                <div className="text-2xl font-mono text-zinc-300">{formatNumber(state.dirtyCash)} kr</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <button
                                onClick={(e) => handleLaunder(e, 0.25)}
                                disabled={state.dirtyCash <= 0}
                                className="py-3 bg-zinc-800 active:bg-zinc-700 disabled:opacity-50 text-white font-bold rounded-lg uppercase text-xs border border-white/5 active:border-emerald-500/50 transition-colors active:scale-95"
                            >
                                Vask 25%
                            </button>
                            <button
                                onClick={(e) => handleLaunder(e, 0.50)}
                                disabled={state.dirtyCash <= 0}
                                className="py-3 bg-zinc-800 active:bg-zinc-700 disabled:opacity-50 text-white font-bold rounded-lg uppercase text-xs border border-white/5 active:border-emerald-500/50 transition-colors active:scale-95"
                            >
                                Vask 50%
                            </button>
                            <button
                                onClick={(e) => handleLaunder(e, 1.0)}
                                disabled={state.dirtyCash <= 0}
                                className="py-3 bg-emerald-600 active:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-lg uppercase text-xs shadow-lg shadow-emerald-900/20 active:scale-95"
                            >
                                Vask Alt
                            </button>
                        </div>
                        <p className="text-[10px] text-zinc-500 text-center mt-3 uppercase tracking-wider">Risiko: 5% chance for Razzia</p>
                    </div>

                    {/* BANK */}
                    <div className="bg-[#0f1012] border border-white/5 p-6 rounded-2xl relative">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-amber-500 font-bold uppercase tracking-wider text-sm"><i className="fa-solid fa-piggy-bank mr-2"></i>Bankforbindelse</h3>
                            <div className="text-right">
                                <div className="text-[10px] text-zinc-500 uppercase font-bold">Nuværende Gæld</div>
                                <div className="text-xl text-red-400 font-mono font-bold">{formatNumber(state.debt)} kr</div>
                            </div>
                        </div>

                        {/* PAYROLL TIMER */}
                        <div className="mb-6 p-3 bg-zinc-900 rounded-lg border border-white/5">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] text-zinc-500 uppercase font-bold">Næste Løn udbetaling</span>
                                <span className="text-[10px] text-zinc-400 font-mono">
                                    {Math.max(0, Math.ceil((CONFIG.payroll.salaryInterval - (Date.now() - (state.payroll?.lastPaid || 0))) / 1000))}s
                                </span>
                            </div>
                            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
                                    style={{ width: `${Math.max(0, 100 - ((Date.now() - (state.payroll?.lastPaid || 0)) / CONFIG.payroll.salaryInterval * 100))}%` }}
                                ></div>
                            </div>
                            <div className="mt-2 text-[10px] text-zinc-600 flex justify-between">
                                <span>Est. Udgift: {formatNumber(dailyExpenses)} kr</span>
                                <span>{state.cleanCash >= dailyExpenses ? 'Betales med Ren Kapital' : (state.dirtyCash >= dailyExpenses * 1.5 ? 'Betales med Sorte Penge (+50%)' : 'STREJKE OM LIDT')}</span>
                            </div>
                        </div>

                        {/* LOAN ACTIONS */}
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-xs text-zinc-500 uppercase font-bold mb-2">Optag Lån (Rente: 20%)</h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {[10000, 50000, 100000].map(amt => (
                                        <button
                                            key={amt}
                                            onClick={() => borrow(amt)}
                                            className="px-2 py-2 bg-zinc-800 active:bg-zinc-700 border border-white/5 rounded text-[10px] font-bold text-zinc-300 active:text-white transition-colors active:scale-95"
                                        >
                                            +{formatNumber(amt)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs text-zinc-500 uppercase font-bold mb-2">Afbetaling</h4>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <button
                                        onClick={() => repay(state.debt, false)}
                                        disabled={state.debt <= 0 || state.cleanCash < state.debt}
                                        className="py-2 bg-emerald-900/30 active:bg-emerald-800/50 border border-emerald-500/30 rounded text-[10px] text-emerald-400 font-bold disabled:opacity-30 disabled:pointer-events-none active:scale-95"
                                    >
                                        Betal Alt (Ren)
                                    </button>
                                    <button
                                        onClick={() => repay(state.debt, true)}
                                        disabled={state.debt <= 0 || state.dirtyCash < state.debt * 1.5}
                                        className="py-2 bg-amber-900/30 active:bg-amber-800/50 border border-amber-500/30 rounded text-[10px] text-amber-500 font-bold disabled:opacity-30 disabled:pointer-events-none active:scale-95"
                                    >
                                        Smugler (Sort +50%)
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => repay(10000, false)}
                                        disabled={state.debt <= 0 || state.cleanCash < 10000}
                                        className="py-2 bg-zinc-800 active:bg-zinc-700 rounded text-[10px] text-zinc-300 font-bold disabled:opacity-30 active:scale-95"
                                    >
                                        Afbetal 10k (Ren)
                                    </button>
                                    <button
                                        onClick={() => repay(10000, true)}
                                        disabled={state.debt <= 0 || state.dirtyCash < 15000}
                                        className="py-2 bg-zinc-800 active:bg-zinc-700 rounded text-[10px] text-zinc-300 font-bold disabled:opacity-30 active:scale-95"
                                    >
                                        Afbetal 10k (Sort +50%)
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* 2. CRYPTO EXCHANGE (The New Overhaul) */}
                <div className="bg-[#0a0a0c] border border-indigo-500/20 rounded-2xl p-1 overflow-hidden flex flex-col h-full shadow-2xl shadow-indigo-900/10">
                    <div className="p-5 border-b border-white/5 bg-zinc-900/50 flex justify-between items-center">
                        <h3 className="text-indigo-400 font-black uppercase tracking-wider flex items-center gap-2">
                            <i className="fa-brands fa-bitcoin text-xl"></i> Crypto Exchange
                        </h3>
                        <div className="text-[10px] text-zinc-500 uppercase font-mono">Live Market Data</div>
                    </div>

                    {/* TRADING GUIDE */}
                    <div className="px-5 py-3 border-b border-white/5 bg-indigo-900/10">
                        <details className="group">
                            <summary className="text-[10px] font-bold text-indigo-300 uppercase cursor-pointer flex items-center gap-2 select-none hover:text-white transition-colors">
                                <i className="fa-solid fa-circle-info text-indigo-500"></i>
                                Sådan tjener du penge på Krypto
                                <i className="fa-solid fa-chevron-down ml-auto group-open:rotate-180 transition-transform"></i>
                            </summary>
                            <div className="mt-3 text-xs text-zinc-400 space-y-2 leading-relaxed pb-2">
                                <p><strong className="text-white">1. Køb Lavt, Sælg Højt:</strong> Priserne svinger konstant. Brug graferne (Sparklines) til at se tendenser. Køb når grafen er nede (Rød), og sælg når den er oppe (Grøn).</p>
                                <p><strong className="text-white">2. Hold Øje Med Nyhederne:</strong> Globale events (som "Krypto Krak" eller "Tech Boom") kan få priserne til at eksplodere eller kollapse på få sekunder.</p>
                                <p><strong className="text-white">3. Diversificer:</strong> Sats ikke alt på Bitcoin. Monero er mere stabilt, mens Ethereum svinger voldsomt.</p>
                            </div>
                        </details>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                        {Object.entries(CONFIG.crypto.coins).map(([key, conf]) => {
                            const price = state.crypto?.prices?.[key] || conf.basePrice;
                            const hist = state.crypto?.history?.[key] || [];
                            const held = state.crypto?.wallet?.[key] || 0;

                            // Calculate change (mock or real if history exists)
                            const open = hist[0] || price;
                            const change = ((price - open) / open) * 100;
                            const isUp = change >= 0;

                            return (
                                <div key={key} className="bg-[#111] p-4 rounded-xl border border-white/5 active:border-white/10 transition-colors group">
                                    {/* HEADER ROW */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-lg text-white font-bold border border-white/10 shrink-0">
                                                {conf.symbol[0]}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white flex items-center gap-2">
                                                    {conf.name} <span className="text-zinc-600 text-[10px]">{conf.symbol}</span>
                                                </div>
                                                <p className="text-[10px] text-zinc-500 max-w-[200px] leading-tight mt-0.5">{key === 'monero' ? 'Usporlig valuta. Bruges til sorte handler.' : (key === 'bitcoin' ? 'Digitalt Guld. Sikker men langsom.' : 'Smart Contracts. Høj volatilitet.')}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-mono font-bold text-white mb-0.5">{formatNumber(price)} kr</div>
                                            <div className={`text-xs font-bold ${isUp ? 'text-emerald-400' : 'text-red-500'}`}>
                                                {isUp ? '+' : ''}{change.toFixed(2)}%
                                            </div>
                                        </div>
                                    </div>

                                    {/* CHART */}
                                    <div className="h-12 w-full mb-4 opacity-70 group-hover:opacity-100 transition-opacity">
                                        <Sparkline data={hist} color={isUp ? '#34d399' : '#ef4444'} />
                                    </div>

                                    {/* ACTIONS */}
                                    <div className="flex items-center justify-between gap-4 bg-black/40 p-2 rounded-lg">
                                        <div className="text-xs text-zinc-400 font-mono">
                                            OWNED: <span className="text-white font-bold">{held.toFixed(4)}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => buyCrypto(key, 1)}
                                                disabled={state.cleanCash < price}
                                                className="px-3 py-1.5 bg-zinc-800 active:bg-emerald-600 active:text-white text-zinc-400 text-[10px] font-bold uppercase rounded transition-colors active:scale-95"
                                            >
                                                Buy Max
                                            </button>
                                            <button
                                                onClick={() => sellCrypto(key, 1)}
                                                disabled={held <= 0}
                                                className="px-3 py-1.5 bg-zinc-800 active:bg-red-600 active:text-white text-zinc-400 text-[10px] font-bold uppercase rounded transition-colors active:scale-95"
                                            >
                                                Sell Max
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinanceTab;
