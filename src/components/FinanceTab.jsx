import React, { useState } from 'react';
import { CONFIG } from '../config/gameConfig';
import { useFinance } from '../hooks/useFinance';
import { spawnParticles } from '../utils/particleEmitter';
import { formatNumber, formatCurrency, formatCrypto, formatTime, formatPercent } from '../utils/gameMath';
import SimpleLineChart from './SimpleLineChart';
import TabHeader from './TabHeader';
import { useLanguage } from '../context/LanguageContext';
import GlassCard from './ui/GlassCard';
import ActionButton from './ui/ActionButton';

const FinanceTab = ({ state, setState, addLog, addFloat, purchaseLuxury }) => {
    const {
        netWorth,
        territoryIncomeValue,
        handleLaunder,
        handleManualWash,
        buyCrypto,
        sellCrypto,
        borrow,
        repay,
        deposit,
        withdraw
    } = useFinance(state, setState, addLog, addFloat);

    const [cryptoAmount, setCryptoAmount] = useState(1);
    const { t } = useLanguage();

    // Derived State
    const totalIncome = territoryIncomeValue.clean + territoryIncomeValue.dirty;
    const staffSalaryTotal = Object.keys(CONFIG.staff).reduce((acc, role) => acc + ((state.staff[role] || 0) * (CONFIG.staff[role].salary || 0)), 0);
    const totalExpenses = staffSalaryTotal / (CONFIG.payroll.salaryInterval / 5000); // Normalize to 5 min window matching income calc? 
    // Wait, revenue is usually /tick. Let's keep it simple for UI display: 5 min window is fine.

    const netCashflow = totalIncome - totalExpenses;
    const savings = state.bank?.savings || 0;

    // UI Helpers
    const onLaunderClick = (factor, e) => {
        if (state.dirtyCash <= 0) return;
        const amount = state.dirtyCash * factor;
        handleLaunder(amount);
        if (e) spawnParticles(e.clientX, e.clientY, 'cash', 15);
    };

    const onManualWashClick = (e) => {
        handleManualWash();
        if (addFloat && e && e.clientX !== undefined && e.clientY !== undefined) {
            addFloat(`+${CONFIG.crypto.manualWashPower || 100}`, e.clientX, e.clientY - 20, 'text-emerald-400 font-black text-lg');
            spawnParticles(e.clientX, e.clientY, 'cash', 6);
        }
    };

    return (
        <div className="max-w-7xl mx-auto h-full flex flex-col pb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* HEADER */}
            <div className="flex-none">
                <TabHeader
                    title={t('finance.title')}
                    subtitle={t('finance.subtitle')}
                    icon="fa-solid fa-sack-dollar"
                    accentColor="warning"
                    variant="contained"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full xl:w-auto">
                        {/* NET WORTH */}
                        <GlassCard className="p-4 !bg-gradient-to-br from-amber-950/30 to-black/40 border-amber-500/20 flex flex-col justify-center min-w-[160px]">
                            <div className="text-[10px] text-amber-400/70 uppercase font-bold tracking-widest mb-1">{t('finance.net_worth')}</div>
                            <div className={`text-2xl font-mono font-black ${netWorth >= 0 ? 'text-amber-400' : 'text-red-500'}`}>
                                {formatCurrency(netWorth)}
                            </div>
                        </GlassCard>
                        {/* CASHFLOW */}
                        <GlassCard className="p-4 !bg-gradient-to-br from-blue-950/30 to-black/40 border-blue-500/20 flex flex-col justify-center min-w-[160px]">
                            <div className="text-[10px] text-blue-400/70 uppercase font-bold tracking-widest mb-1">{t('finance.cashflow_5m')}</div>
                            <div className={`text-2xl font-mono font-black ${netCashflow >= 0 ? 'text-blue-400' : 'text-red-500'}`}>
                                {netCashflow >= 0 ? '+' : ''}{formatCurrency(netCashflow)}
                            </div>
                        </GlassCard>
                    </div>
                </TabHeader>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-1 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* LEFT COLUMN */}
                    <div className="space-y-6">

                        {/* LIQUIDITY OVERVIEW */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* CLEAN CAPITAL */}
                            <GlassCard className="group relative overflow-hidden p-6 hover:border-emerald-500/40 transition-all" variant="glass">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                                            <i className="fa-solid fa-circle-check text-lg"></i>
                                        </div>
                                        <div className="text-xs font-black text-emerald-400 uppercase tracking-wider">{t('finance.clean_capital')}</div>
                                    </div>
                                    <div className="text-3xl font-mono font-black text-white">
                                        {formatNumber(state.cleanCash)}
                                    </div>
                                    <div className="text-[10px] text-zinc-500 uppercase mt-1">{t('ui.kroner') || 'Kroner'}</div>
                                </div>
                            </GlassCard>

                            {/* DIRTY CAPITAL */}
                            <GlassCard className="group relative overflow-hidden p-6 hover:border-red-500/40 transition-all" variant="glass">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 border border-red-500/30">
                                            <i className="fa-solid fa-triangle-exclamation text-lg"></i>
                                        </div>
                                        <div className="text-xs font-black text-red-400 uppercase tracking-wider">{t('finance.dirty_capital')}</div>
                                    </div>
                                    <div className="text-3xl font-mono font-black text-white">
                                        {formatNumber(state.dirtyCash)}
                                    </div>
                                    <div className="text-[10px] text-zinc-500 uppercase mt-1">{t('ui.kroner') || 'Kroner'}</div>
                                </div>
                            </GlassCard>
                        </div>

                        {/* MONEY LAUNDERING */}
                        <GlassCard className="relative overflow-hidden p-6" variant="glass">
                            <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
                                <i className="fa-solid fa-droplet text-[200px] text-emerald-500"></i>
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl border-2 border-emerald-500/30">
                                        <i className="fa-solid fa-droplet"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-tight">{t('finance.laundering.title')}</h3>
                                        <p className="text-xs text-zinc-500">{t('finance.laundering.subtitle')}</p>
                                    </div>
                                </div>

                                <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                                    {t('finance.laundering.desc')}
                                    {state.activeBuffs?.cryptoCrash > Date.now() && <span className="block mt-2 text-red-500 animate-pulse font-black uppercase text-xs">⚠️ {t('finance.laundering.warn_crash')}</span>}
                                </p>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                                    <ActionButton onClick={(e) => onLaunderClick(0.25, e)} disabled={state.dirtyCash <= 0} className="py-4 text-xs md:text-sm font-black" variant="neutral">25%</ActionButton>
                                    <ActionButton onClick={(e) => onLaunderClick(0.50, e)} disabled={state.dirtyCash <= 0} className="py-4 text-xs md:text-sm font-black" variant="neutral">50%</ActionButton>
                                    <ActionButton onClick={(e) => onLaunderClick(1.0, e)} disabled={state.dirtyCash <= 0} className="col-span-2 sm:col-span-1 py-4 text-xs md:text-sm font-black shadow-[0_0_15px_rgba(16,185,129,0.3)]" variant="success">100%</ActionButton>
                                </div>

                                {/* MANUAL WASH */}
                                <button
                                    onClick={onManualWashClick}
                                    disabled={state.dirtyCash <= 0}
                                    className="w-full p-6 rounded-xl border-2 border-dashed border-emerald-500/20 hover:border-emerald-500/60 flex items-center justify-center gap-4 transition-all active:scale-95 group disabled:opacity-20 disabled:grayscale bg-emerald-500/5 hover:bg-emerald-500/10"
                                >
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-3xl text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-all group-hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                                        <i className="fa-solid fa-fingerprint"></i>
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-black text-white uppercase tracking-wider">{t('finance.laundering.manual_wash')}</div>
                                        <div className="text-xs text-zinc-500 mt-1">{t('finance.laundering.manual_desc')}</div>
                                    </div>
                                </button>
                            </div>
                        </GlassCard>

                        {/* CRYPTO TRADING - DYNAMIC */}
                        <GlassCard className="relative overflow-hidden p-6" variant="glass">
                            <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
                                <i className="fa-brands fa-bitcoin text-[200px] text-amber-500"></i>
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 text-xl border-2 border-amber-500/30">
                                        <i className="fa-brands fa-bitcoin"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-tight">{t('finance.crypto.title')}</h3>
                                        <p className="text-xs text-zinc-500">{t('finance.crypto.subtitle')}</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {Object.entries(CONFIG.crypto.coins).map(([id, coin]) => {
                                        const currentPrice = state.crypto?.prices?.[id] || coin.basePrice;
                                        const holdings = state.crypto?.wallet?.[id] || 0;
                                        const canBuy = state.cleanCash >= (currentPrice * cryptoAmount);
                                        const canSell = holdings >= cryptoAmount;

                                        return (
                                            <div key={id} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-amber-500/30 transition-colors">
                                                <div className="flex justify-between items-center mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded bg-amber-500/10 flex items-center justify-center text-amber-500">
                                                            <span className="font-bold text-xs">{coin.symbol}</span>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-black text-white">{coin.name}</div>
                                                            <div className="text-[10px] text-zinc-500">Vol: {(coin.volatility * 100).toFixed(0)}%</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm font-mono font-black text-amber-400">{formatCurrency(currentPrice)}</div>
                                                        <div className={`text-[10px] ${holdings > 0 ? 'text-emerald-400' : 'text-zinc-600'}`}>
                                                            Ejet: {formatCrypto(holdings)}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <ActionButton
                                                        onClick={() => buyCrypto(id, cryptoAmount)}
                                                        disabled={!canBuy}
                                                        className="flex-1 py-2 text-xs font-black"
                                                        variant="success"
                                                    >
                                                        Køb {cryptoAmount}
                                                    </ActionButton>
                                                    <ActionButton
                                                        onClick={() => sellCrypto(id, cryptoAmount)}
                                                        disabled={!canSell}
                                                        className="flex-1 py-2 text-xs font-black"
                                                        variant="danger"
                                                    >
                                                        Sælg {cryptoAmount}
                                                    </ActionButton>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-6">

                        {/* BANK ACCOUNT */}
                        <GlassCard className="relative overflow-hidden p-6" variant="glass">
                            <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
                                <i className="fa-solid fa-vault text-[200px] text-blue-500"></i>
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 text-xl border-2 border-blue-500/30">
                                        <i className="fa-solid fa-vault"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-tight">{t('finance.bank.bank_name')}</h3>
                                        <p className="text-xs text-zinc-500">{t('finance.bank.title')}</p>
                                    </div>
                                </div>

                                <div className="p-6 bg-gradient-to-br from-blue-500/10 to-transparent rounded-xl border border-blue-500/20 mb-6">
                                    <div className="text-xs text-blue-400/70 uppercase tracking-wider mb-2">{t('finance.bank.balance')}</div>
                                    <div className="text-4xl font-mono font-black text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                                        {formatCurrency(savings)}
                                    </div>
                                </div>

                                <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/10 mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-zinc-500 uppercase">{t('finance.bank.interest_rate')}</span>
                                        <span className="text-sm font-black text-emerald-400">{formatPercent(CONFIG.crypto.bank.interestRate * 10, false)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-zinc-500 uppercase">{t('finance.bank.next_payout')}</span>
                                        <span className="text-sm font-mono font-black text-white">{formatTime(CONFIG.crypto.bank.interestInterval - (Date.now() - (state.bank?.lastInterest || 0)))}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <ActionButton onClick={() => deposit(10000)} disabled={state.cleanCash < 10000} className="py-3 text-xs md:text-sm font-black" variant="neutral">+10K</ActionButton>
                                    <ActionButton onClick={() => deposit(Math.floor(state.cleanCash))} disabled={state.cleanCash < 1} className="py-3 text-xs md:text-sm font-black" variant="neutral">{t('ui.max') || 'ALL'}</ActionButton>
                                </div>
                                <ActionButton onClick={() => withdraw('max')} disabled={savings <= 0} className="w-full py-3 text-sm font-black !border-blue-500/30 !text-blue-400 hover:!bg-blue-500/20" variant="ghost">
                                    <i className="fa-solid fa-arrow-down mr-2"></i>{t('finance.bank.withdraw_max') || 'WITHDRAW ALL'}
                                </ActionButton>
                            </div>
                        </GlassCard>

                        {/* LOANS */}
                        <GlassCard className="relative overflow-hidden p-6" variant="glass">
                            <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
                                <i className="fa-solid fa-handshake text-[200px] text-purple-500"></i>
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 text-xl border-2 border-purple-500/30">
                                        <i className="fa-solid fa-handshake"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-tight">{t('finance.loans.title')}</h3>
                                        <p className="text-xs text-zinc-500">{t('finance.loans.subtitle')}</p>
                                    </div>
                                </div>

                                <div className="p-6 bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl border border-purple-500/20 mb-6">
                                    <div className="text-xs text-purple-400/70 uppercase tracking-wider mb-2">{t('finance.loans.current_debt')}</div>
                                    <div className={`text-4xl font-mono font-black ${state.debt > 0 ? 'text-red-500' : 'text-emerald-400'}`}>
                                        {formatNumber(state.debt || 0)} <span className="text-lg text-zinc-600">kr</span>
                                    </div>
                                </div>

                                <div className="p-4 bg-purple-500/5 rounded-lg border border-purple-500/10 mb-6">
                                    <p className="text-xs text-purple-200/70 leading-relaxed">
                                        <i className="fa-solid fa-circle-info mr-2"></i>
                                        {t('finance.loans.info_text')}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <ActionButton onClick={() => borrow(50000)} disabled={state.debt >= 1000000} className="py-3 text-sm font-black" variant="neutral">+50K</ActionButton>
                                    <ActionButton onClick={() => borrow(100000)} disabled={state.debt >= 1000000} className="py-3 text-sm font-black" variant="neutral">+100K</ActionButton>
                                </div>
                                <ActionButton onClick={() => repay('max')} disabled={state.debt <= 0 || state.cleanCash <= 0} className="w-full py-3 text-sm font-black !border-purple-500/30 !text-purple-400 hover:!bg-purple-500/20" variant="ghost">
                                    <i className="fa-solid fa-money-bill-transfer mr-2"></i>{t('finance.loans.repay_max') || 'REPAY DEBT'}
                                </ActionButton>
                            </div>
                        </GlassCard>

                        {/* LUXURY ASSETS */}
                        <GlassCard className="relative overflow-hidden p-6 !bg-gradient-to-br from-amber-950/20 to-black/40 !border-amber-500/30" variant="gold">
                            <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
                                <i className="fa-solid fa-gem text-[200px] text-amber-500"></i>
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 text-xl border-2 border-amber-500/30">
                                        <i className="fa-solid fa-gem"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-amber-400 uppercase tracking-tight">{t('finance.luxury.title')}</h3>
                                        <p className="text-xs text-amber-600">{t('finance.luxury.subtitle')}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {CONFIG.luxuryItems.map(item => {
                                        const isOwned = state.luxuryItems?.includes(item.id);
                                        return (
                                            <div key={item.id} className={`p-4 rounded-xl border-2 transition-all ${isOwned ? 'bg-amber-500/20 border-amber-500/60 shadow-lg shadow-amber-500/20' : 'bg-white/5 border-white/10 opacity-60 hover:opacity-100 hover:border-amber-500/30'}`}>
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${isOwned ? 'bg-amber-500 text-black' : 'bg-white/5 text-amber-500'}`}>
                                                            <i className={`fa-solid ${item.icon}`}></i>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-black text-white uppercase text-sm truncate">{t(item.name)}</div>
                                                            <div className="text-xs text-zinc-500 truncate">{t(item.desc)}</div>
                                                        </div>
                                                    </div>
                                                    {isOwned ? (
                                                        <div className="px-4 py-2 bg-amber-500/20 rounded-lg border border-amber-500/40">
                                                            <i className="fa-solid fa-check text-amber-400"></i>
                                                        </div>
                                                    ) : (
                                                        <ActionButton
                                                            onClick={() => purchaseLuxury(item.id)}
                                                            disabled={state.cleanCash < item.cost}
                                                            className="px-4 py-2 text-xs font-black whitespace-nowrap"
                                                            variant="gold"
                                                        >
                                                            {formatNumber(item.cost)} kr
                                                        </ActionButton>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinanceTab;
