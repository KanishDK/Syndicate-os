import React from 'react';
import { CONFIG } from '../config/gameConfig';
import { useFinance } from '../hooks/useFinance';
import { formatNumber } from '../utils/gameMath';

const FinanceTab = ({ state, setState, addLog }) => {
    // REFACTORED v27: Finans Hub - Tycoon Dashboard
    // Merges Laundering, Banking, Crypto, and Statistics

    const { paySalaries, launder, borrow, repay } = useFinance(state, setState, addLog);

    // Calculate estimated daily expenses (salaries)
    const dailyExpenses = Object.keys(CONFIG.staff).reduce((acc, role) => {
        return acc + ((state.staff[role] || 0) * (CONFIG.staff[role].salary || 0));
    }, 0);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white mb-6 flex items-center gap-3">
                <i className="fa-solid fa-chart-line text-emerald-500"></i> Finansiel Oversigt
            </h2>

            {/* DASHBOARD GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* 1. HVIDVASK (Laundering) */}
                <div className="bg-zinc-900/50 p-5 rounded-2xl border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <i className="fa-solid fa-washing-machine text-6xl text-emerald-500 rotate-12"></i>
                    </div>
                    <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Hvidvaskning</h3>

                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <div className="text-[10px] text-zinc-500 uppercase">Sorte Penge</div>
                            <div className="text-2xl font-mono text-white font-bold">{formatNumber(state.dirtyCash)} kr.</div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] text-zinc-500 uppercase">Rate</div>
                            <div className="text-xs font-mono text-emerald-400">{(CONFIG.launderingRate * 100).toFixed(0)}% <span className="text-zinc-600">({state.upgrades.studio ? '+20%' : 'Base'})</span></div>
                        </div>
                    </div>

                    <button
                        onClick={launder}
                        disabled={state.dirtyCash <= 0}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold rounded-xl uppercase tracking-widest shadow-lg shadow-emerald-900/20 transition-all active:scale-[0.98]"
                    >
                        Vask Alt <i className="fa-solid fa-arrow-right ml-2 text-xs"></i>
                    </button>
                    <div className="mt-2 text-center text-[9px] text-zinc-500">
                        <i className="fa-solid fa-triangle-exclamation text-amber-500/50 mr-1"></i>
                        5% Risiko for Razzia ved overførsel
                    </div>
                </div>

                {/* 2. BANK & LÅN (Banking) */}
                <div className="bg-zinc-900/50 p-5 rounded-2xl border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <i className="fa-solid fa-building-columns text-6xl text-amber-500 -rotate-12"></i>
                    </div>
                    <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Bank & Lån</h3>

                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <div className="text-[10px] text-zinc-500 uppercase">Nuværende Gæld</div>
                            <div className="text-2xl font-mono text-red-400 font-bold">{formatNumber(state.debt)} kr.</div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] text-zinc-500 uppercase">Rente</div>
                            <div className="text-xs font-mono text-red-400">1% / dag</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={borrow}
                            className="py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg text-xs border border-white/5"
                        >
                            LÅN 10k
                        </button>
                        <button
                            onClick={repay}
                            disabled={state.debt <= 0}
                            className="py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white font-bold rounded-lg text-xs border border-white/5"
                        >
                            AFBETAL
                        </button>
                    </div>
                    <div className="mt-3 text-[9px] text-zinc-600 text-center">
                        Lån koster 20% i opstartsgebyr immediately.
                    </div>
                </div>

                {/* 3. UDGIFTER & LØN (Payroll) */}
                <div className="md:col-span-2 bg-zinc-900/50 p-5 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Driftsudgifter</h3>
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20">Daglig</span>
                    </div>

                    <div className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-white/5 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center text-blue-400"><i className="fa-solid fa-users"></i></div>
                            <div>
                                <div className="text-xs font-bold text-white">Lønninger</div>
                                <div className="text-[10px] text-zinc-500">Til {Object.values(state.staff).reduce((a, b) => a + b, 0)} ansatte</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-mono text-red-400 font-bold">-{formatNumber(dailyExpenses)} kr.</div>
                            <div className="text-[9px] text-zinc-600">Næste betaling: 24:00</div>
                        </div>
                    </div>

                    <button
                        onClick={paySalaries}
                        className="w-full py-2 bg-zinc-800 hover:bg-blue-600/20 hover:text-blue-400 hover:border-blue-500/50 text-zinc-400 font-bold rounded-lg text-xs border border-white/10 transition-all"
                    >
                        Betal Løn Nu (Manuelt)
                    </button>
                </div>

                {/* 4. CRYPTO BANK (New v26.1) */}
                <div className="md:col-span-2 bg-zinc-900/50 p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                    <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-4 border-b border-white/5 pb-2 flex items-center gap-2">
                        <i className="fa-brands fa-bitcoin"></i> Crypto Wallet
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {Object.entries(CONFIG.crypto).map(([coin, conf]) => {
                            const price = state.crypto?.prices?.[coin] || 1000; // Fallback
                            const held = state.crypto?.wallet?.[coin] || 0;
                            const canBuy = state.cleanCash >= price;

                            return (
                                <div key={coin} className="bg-black/40 p-3 rounded-xl border border-white/5 flex flex-col gap-2">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs">{conf.symbol}</div>
                                            <div>
                                                <div className="text-xs font-bold text-white">{conf.name}</div>
                                                <div className="text-[10px] text-zinc-500 font-mono">{Math.floor(price).toLocaleString()} kr.</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="text-right mr-2">
                                                <div className="text-[9px] text-zinc-500 uppercase">Beholdning</div>
                                                <div className="text-xs font-mono text-white">{held.toFixed(2)}</div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <button
                                                    onClick={() => setState(prev => ({ ...prev, cleanCash: prev.cleanCash - price, crypto: { ...prev.crypto, wallet: { ...prev.crypto.wallet, [coin]: (prev.crypto.wallet[coin] || 0) + 1 } } }))}
                                                    disabled={!canBuy}
                                                    className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[9px] font-bold rounded hover:bg-green-500/30 disabled:opacity-30"
                                                >
                                                    KØB
                                                </button>
                                                <button
                                                    onClick={() => setState(prev => ({ ...prev, cleanCash: prev.cleanCash + price, crypto: { ...prev.crypto, wallet: { ...prev.crypto.wallet, [coin]: (prev.crypto.wallet[coin] || 0) - 1 } } }))}
                                                    disabled={held < 1}
                                                    className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[9px] font-bold rounded hover:bg-red-500/30 disabled:opacity-30"
                                                >
                                                    SÆLG
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FinanceTab;
