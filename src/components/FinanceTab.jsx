import React, { useState } from 'react';
import { CONFIG } from '../config/gameConfig';
import { useFinance } from '../hooks/useFinance';
import { spawnParticles } from '../utils/particleEmitter';
import { formatNumber } from '../utils/gameMath';
import SimpleLineChart from './SimpleLineChart';
import TabHeader from './TabHeader';
import { useLanguage } from '../context/LanguageContext';
import GlassCard from './ui/GlassCard';
import ActionButton from './ui/ActionButton';

const FinanceTab = ({ state, setState, addLog, addFloat, purchaseLuxury }) => {
    const {
        netWorth,
        // cryptoValue,
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

    const [now, setNow] = useState(0);

    // Clean separation to avoid ghost text issues
    const [cryptoAmount, setCryptoAmount] = useState(1);

    const { t } = useLanguage();

    React.useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    // Derived State
    const totalIncome = territoryIncomeValue.clean + territoryIncomeValue.dirty;
    const staffSalary = Object.keys(CONFIG.staff).reduce((acc, role) => acc + ((state.staff[role] || 0) * (CONFIG.staff[role].salary || 0)), 0);
    const totalExpenses = staffSalary;
    const netCashflow = totalIncome - totalExpenses;
    const savings = state.bank?.savings || 0;


    // UI Helpers (Wrappers to inject events for Float)
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
            {/* HEADER METRICS */}
            <div className="flex-none">
                <TabHeader
                    title={t('finance.title')}
                    subtitle={t('finance.subtitle')}
                    icon="fa-solid fa-sack-dollar"
                    accentColor="warning"
                    variant="contained"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full xl:w-auto">
                        {/* NET WORTH CARD */}
                        <GlassCard className="p-3 !bg-black/40 border-theme-border-subtle flex flex-col justify-center min-w-[140px]">
                            <div className="text-[10px] text-theme-text-muted uppercase font-bold tracking-widest">{t('finance.net_worth')}</div>
                            <div className={`text-xl font-mono font-bold ${netWorth >= 0 ? 'text-theme-success' : 'text-theme-danger'}`}>
                                {formatNumber(netWorth)} <span className="text-xs text-theme-text-muted">kr</span>
                            </div>
                        </GlassCard>
                        {/* CASHFLOW CARD */}
                        <GlassCard className="p-3 !bg-black/40 border-theme-border-subtle flex flex-col justify-center min-w-[140px]">
                            <div className="text-[10px] text-theme-text-muted uppercase font-bold tracking-widest">{t('finance.cashflow_5m')}</div>
                            <div className={`text-xl font-mono font-bold ${netCashflow >= 0 ? 'text-blue-400' : 'text-theme-warning'}`}>
                                {netCashflow >= 0 ? '+' : ''}{formatNumber(netCashflow)} <span className="text-xs text-theme-text-muted">kr</span>
                            </div>
                        </GlassCard>
                    </div>
                </TabHeader>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-1 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* LEFT COLUMN: LIQUIDITY & BANKING */}
                    <div className="lg:col-span-7 space-y-6">

                        {/* LIQUIDITY OVERVIEW (Clean vs Dirty) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* CLEAN CAPITAL */}
                            <GlassCard className="group relative overflow-hidden p-6" variant="glass">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
                                <div className="relative z-10">
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block mb-2">{t('finance.liquid_clean')}</span>
                                    <div className="text-3xl font-mono font-black text-white">{formatNumber(state.cleanCash)} <span className="text-xs">kr</span></div>
                                    <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (state.cleanCash / (netWorth || 1)) * 100)}%` }}></div>
                                    </div>
                                </div>
                            </GlassCard>
                            {/* DIRTY CAPITAL */}
                            <GlassCard className="group relative overflow-hidden p-6" variant="glass">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>
                                <div className="relative z-10">
                                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest block mb-2">{t('finance.dirty_cash')}</span>
                                    <div className="text-3xl font-mono font-black text-white">{formatNumber(state.dirtyCash)} <span className="text-xs">kr</span></div>
                                    <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-red-500" style={{ width: `${Math.min(100, (state.dirtyCash / (netWorth || 1)) * 100)}%` }}></div>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>

                        {/* DIRTY CASH ALERT (Phase 5 Fix) */}
                        {state.dirtyCash > 5000 && (
                            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-center gap-4 animate-pulse">
                                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 text-xl">
                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-red-500 font-black uppercase text-sm">{t('finance.dirty_alert.title') || 'HØJ RISIKO FOR RAZZIA!'}</h4>
                                    <p className="text-xs text-red-400/80">{t('finance.dirty_alert.desc') || 'Du har for mange sorte penge. Politiet efterforsker dig. Vask dem NU!'}</p>
                                </div>
                            </div>
                        )}

                        {/* HVIDVASK CENTER (Advanced) */}
                        <GlassCard className="relative overflow-hidden p-8 shadow-2xl" variant="glass">
                            <div className="absolute -right-4 -top-4 opacity-5 text-emerald-500 text-9xl pointer-events-none transform rotate-12">
                                <i className="fa-solid fa-soap"></i>
                            </div>

                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div>
                                    <h3 className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-3 mb-1">
                                        <i className="fa-solid fa-hands-wash"></i> {t('finance.laundering.title')}
                                    </h3>
                                    <div className="text-2xl font-black text-white uppercase italic">{t('finance.laundering.op_name')}</div>
                                </div>
                                <div className="px-4 py-1.5 bg-red-500/10 rounded-full border border-red-500/30 text-[10px] text-red-500 font-black tracking-widest">
                                    {t('finance.laundering.fee') || 'GEBYR'}: {((1 - (CONFIG.launderingRate * (state.upgrades.studio ? 1.2 : 1) + (state.activeBuffs?.cryptoCrash > now ? 0.15 : 0))) * 100).toFixed(0)}%
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
                                <div className="md:col-span-7 space-y-6">
                                    <p className="text-xs text-zinc-400 leading-relaxed font-terminal">
                                        {t('finance.laundering.desc')}
                                        {state.activeBuffs?.cryptoCrash > now && <span className="block mt-2 text-red-500 animate-pulse font-black uppercase">⚠️ {t('finance.laundering.warn_crash')}</span>}
                                    </p>

                                    <div className="grid grid-cols-3 gap-3">
                                        <ActionButton onClick={(e) => onLaunderClick(0.25, e)} disabled={state.dirtyCash <= 0} className="py-4 text-[10px] font-black uppercase" variant="neutral">25%</ActionButton>
                                        <ActionButton onClick={(e) => onLaunderClick(0.50, e)} disabled={state.dirtyCash <= 0} className="py-4 text-[10px] font-black uppercase" variant="neutral">50%</ActionButton>
                                        <ActionButton onClick={(e) => onLaunderClick(1.0, e)} disabled={state.dirtyCash <= 0} className="py-4 text-[10px] font-black uppercase shadow-[0_0_15px_rgba(16,185,129,0.3)]" variant="primary">{t('finance.laundering.wash_all')}</ActionButton>
                                    </div>
                                </div>

                                {/* MANUAL WASH (TACTILE) */}
                                <div className="md:col-span-5">
                                    <button
                                        onClick={onManualWashClick}
                                        disabled={state.dirtyCash <= 0}
                                        className="w-full aspect-square rounded-full border-4 border-dashed border-white/5 hover:border-emerald-500/40 flex flex-col items-center justify-center gap-3 transition-all active:scale-95 group disabled:opacity-20 disabled:grayscale"
                                    >
                                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-3xl text-zinc-500 group-hover:bg-emerald-500 group-hover:text-black transition-colors group-hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                                            <i className="fa-solid fa-fingerprint"></i>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-[10px] font-black text-white uppercase tracking-widest">{t('finance.laundering.manual_wash')}</div>
                                            <div className="text-[8px] text-zinc-500 uppercase mt-1">{t('finance.laundering.manual_desc')}</div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </GlassCard>

                        {/* SPARKASSE (Savings Account) */}
                        <GlassCard className="relative overflow-hidden p-8 group" variant="glass">
                            <div className="absolute top-0 right-0 p-10 opacity-5 text-blue-500 text-8xl pointer-events-none"><i className="fa-solid fa-piggy-bank"></i></div>

                            <div className="flex justify-between items-center mb-8 relative z-10">
                                <div>
                                    <h3 className="text-blue-400 font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-3 mb-1">
                                        <i className="fa-solid fa-vault"></i> {t('finance.bank.title')}
                                    </h3>
                                    <div className="text-2xl font-black text-white tracking-tight">{t('finance.bank.bank_name')}</div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black text-zinc-500 uppercase block mb-1">{t('finance.bank.balance')}</span>
                                    <div className="text-3xl font-mono font-black text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">
                                        {formatNumber(savings)} <span className="text-xs">kr</span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative z-10 mb-6 p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
                                <p className="text-[10px] text-blue-200/70 leading-relaxed font-mono">
                                    <i className="fa-solid fa-circle-info mr-2"></i>
                                    {t('finance.bank.info_text')}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                <div className="space-y-4">
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                        <div className="flex justify-between text-[10px] font-black uppercase text-zinc-500 mb-2">
                                            <span>{t('finance.bank.interest')}</span>
                                            <span className="text-emerald-400">2.0%</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-black uppercase text-zinc-500">
                                            <span>{t('finance.bank.next_payout')}</span>
                                            <span className="text-white font-mono">{Math.max(0, Math.ceil((CONFIG.crypto.bank.interestInterval - (now - (state.bank?.lastInterest || 0))) / 1000))}s</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        <ActionButton onClick={() => deposit(10000)} disabled={state.cleanCash < 10000} className="flex-1 py-3 text-[10px] font-black uppercase" variant="neutral">{t('finance.bank.deposit_10k')}</ActionButton>
                                        <ActionButton onClick={() => deposit(Math.floor(state.cleanCash))} disabled={state.cleanCash < 1} className="flex-1 py-3 text-[10px] font-black uppercase" variant="neutral">{t('finance.bank.deposit_all')}</ActionButton>
                                    </div>
                                    <ActionButton onClick={() => withdraw('max')} disabled={savings <= 0} className="w-full py-3 text-[10px] font-black uppercase !border-blue-500/20 !text-blue-400 hover:!text-white hover:!bg-blue-500/20" variant="ghost">{t('finance.bank.withdraw_all')}</ActionButton>
                                </div>
                            </div>
                        </GlassCard>

                        {/* LUXURY ASSETS (Final Sink) */}
                        <GlassCard className="p-8" variant="gold">
                            <h3 className="text-amber-500 font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-3 mb-6">
                                <i className="fa-solid fa-gem"></i> {t('finance.luxury.title')}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {CONFIG.luxuryItems.map(item => {
                                    const isOwned = state.luxuryItems?.includes(item.id);
                                    return (
                                        <div key={item.id} className={`p-5 rounded-xl border transition-all ${isOwned ? 'bg-amber-500/10 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 'bg-white/[0.02] border-white/5 opacity-60 hover:opacity-100'}`}>
                                            <div className="flex justify-between items-start mb-3">
                                                <div className={`p-3 rounded-xl ${isOwned ? 'bg-amber-500 text-black' : 'bg-white/5 text-amber-500'}`}>
                                                    <i className={`fa-solid ${item.icon} text-lg`}></i>
                                                </div>
                                                {isOwned ? (
                                                    <span className="text-[10px] font-black text-amber-500 uppercase flex items-center gap-1">
                                                        <i className="fa-solid fa-check-circle"></i> {t('finance.luxury.owned')}
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] font-mono font-bold text-amber-500/80">{formatNumber(item.cost)} kr</span>
                                                )}
                                            </div>
                                            <div className="font-black text-white uppercase text-sm mb-1">{t(item.name)}</div>
                                            <p className="text-[10px] text-zinc-500 leading-tight mb-4">{t(item.desc)}</p>
                                            {!isOwned && (
                                                <ActionButton
                                                    onClick={() => purchaseLuxury(item.id)}
                                                    disabled={state.cleanCash < item.cost}
                                                    className="w-full py-2 text-[10px] font-black uppercase"
                                                    variant="primary" // Changed to primary which usually maps to gold in my system or I should ensure generic primary looks good.
                                                >
                                                    {t('finance.luxury.invest')}
                                                </ActionButton>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </GlassCard>
                    </div>

                    {/* RIGHT COLUMN: CASHFLOW & CRYPTO */}
                    <div className="lg:col-span-5 space-y-6">

                        {/* CASHFLOW REPORT */}
                        <GlassCard className="p-8 shadow-xl" variant="glass">
                            <h3 className="text-white font-black uppercase tracking-tight text-xl mb-6 flex items-center gap-3">
                                <i className="fa-solid fa-chart-pie text-indigo-500"></i> {t('finance.cashflow.title')}
                            </h3>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                                    <span className="text-xs font-bold text-zinc-400 uppercase">{t('finance.cashflow.income')}</span>
                                    <span className="text-sm font-mono font-black text-emerald-400">+{formatNumber(totalIncome)} kr</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-red-500/5 rounded-xl border border-red-500/10">
                                    <span className="text-xs font-bold text-zinc-400 uppercase">{t('finance.cashflow.expenses')}</span>
                                    <span className="text-sm font-mono font-black text-red-500">-{formatNumber(totalExpenses)} kr</span>
                                </div>
                                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                    <span className="text-sm font-black text-white uppercase tracking-tighter">{t('finance.cashflow.net_profit')}</span>
                                    <span className={`text-xl font-mono font-black ${netCashflow >= 0 ? 'text-blue-400' : 'text-amber-500'}`}>
                                        {formatNumber(netCashflow)} kr
                                    </span>
                                </div>
                            </div>

                            {/* CHART PREVIEW */}
                            <div className="mt-8 h-24 w-full opacity-40">
                                {state.stats?.history?.netWorth && <SimpleLineChart data={state.stats.history.netWorth} color="#6366f1" height={96} />}
                            </div>
                        </GlassCard>

                        {/* CRYPTO PORTFOLIO (Vertical Layout) */}
                        <GlassCard className="p-8 shadow-xl flex flex-col" variant="glass">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-indigo-400 font-black uppercase tracking-tight text-xl flex items-center gap-3">
                                    <i className="fa-brands fa-bitcoin"></i> {t('finance.portfolio.title')}
                                </h3>
                                <div className="flex gap-1">
                                    {[1, 10, 'max'].map(amt => (
                                        <button
                                            key={amt}
                                            onClick={() => setCryptoAmount(amt)}
                                            className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all ${cryptoAmount === amt ? 'bg-indigo-600 text-white' : 'bg-white/5 text-zinc-500 hover:text-white'}`}
                                        >
                                            {amt === 'max' ? 'MAX' : `×${amt}`}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                {Object.entries(CONFIG.crypto.coins).map(([key, conf]) => {
                                    const price = state.crypto?.prices?.[key] || conf.basePrice;
                                    const hist = state.crypto?.history?.[key] || [];
                                    const held = state.crypto?.wallet?.[key] || 0;
                                    const change = hist.length > 1 ? ((price - hist[0]) / hist[0]) * 100 : 0;
                                    const isUp = change >= 0;

                                    // RISK BADGE Logic
                                    const vol = conf.volatility;
                                    const riskLabel = vol < 0.06 ? 'STABIL' : (vol < 0.1 ? 'MODERAT' : 'HØJ RISIKO');
                                    const riskColor = vol < 0.06 ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : (vol < 0.1 ? 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20' : 'text-red-500 bg-red-500/10 border-red-500/20');


                                    return (
                                        <div key={key} className="p-4 bg-white/[0.02] rounded-xl border border-white/5 hover:border-white/10 transition-all">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg shadow-inner">
                                                        <i className={`fa-brands fa-${key === 'monero' ? 'mask' : key}`}></i>
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-sm font-black text-white uppercase leading-none">{conf.name}</span>
                                                            <span className={`text-[8px] px-1.5 py-0.5 rounded border ${riskColor} font-bold`}>{riskLabel}</span>
                                                        </div>
                                                        <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">{t('finance.portfolio.held')}: {held.toFixed(4)}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-mono font-black text-white leading-none mb-1">{formatNumber(price)} kr</div>
                                                    <div className={`text-[10px] font-bold ${isUp ? 'text-emerald-400' : 'text-red-500'}`}>
                                                        {isUp ? '↑' : '↓'} {Math.abs(change).toFixed(2)}%
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <ActionButton onClick={() => buyCrypto(key, cryptoAmount === 'max' ? Math.floor(state.cleanCash / price) : Math.min(cryptoAmount, Math.floor(state.cleanCash / price)))} disabled={state.cleanCash < price} className="flex-1 py-2 text-[10px] font-black uppercase" variant="neutral">{t('finance.portfolio.buy')}</ActionButton>
                                                <ActionButton onClick={() => sellCrypto(key, cryptoAmount === 'max' ? held : Math.min(held, cryptoAmount))} disabled={held <= 0} className="flex-1 py-2 text-[10px] font-black uppercase" variant="ghost">{t('finance.portfolio.sell')}</ActionButton>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </GlassCard>

                        {/* DEBT CONTROL */}
                        <GlassCard className="p-8 border-theme-danger/30 relative overflow-hidden" variant="danger">
                            <div className="absolute -right-4 -bottom-4 opacity-5 text-red-500 text-7xl"><i className="fa-solid fa-ghost"></i></div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-red-500 font-bold uppercase tracking-widest text-xs">{t('finance.debt.title')}</h3>
                                <div className="text-xl font-mono font-black text-red-600">{formatNumber(state.debt)} kr</div>
                            </div>
                            <p className="text-[10px] text-red-400/60 mb-4 relative z-10 font-mono">
                                {t('finance.debt.info_text')}
                            </p>
                            <div className="grid grid-cols-2 gap-3 relative z-10">
                                <ActionButton onClick={() => borrow(50000)} className="col-span-2 py-3 text-[10px] font-black uppercase !border-red-500/20 !text-red-400 hover:!bg-red-500/10" variant="ghost">{t('finance.debt.borrow_50k')}</ActionButton>

                                {/* REPAY 50K */}
                                <ActionButton onClick={() => repay(50000, 'clean')} disabled={state.debt <= 0 || state.cleanCash < 50000} className="py-2 text-[9px] font-black uppercase" variant="neutral">{t('finance.debt.pay_clean')}</ActionButton>
                                <ActionButton onClick={() => repay(50000, 'dirty')} disabled={state.debt <= 0 || state.dirtyCash < 50000} className="py-2 text-[9px] font-black uppercase !border-red-500/30 !text-red-400" variant="neutral">{t('finance.debt.pay_dirty')}</ActionButton>

                                {/* REPAY ALL */}
                                <ActionButton
                                    onClick={() => repay(Math.min(state.debt, state.cleanCash), 'clean')}
                                    disabled={state.debt <= 0 || state.cleanCash <= 0}
                                    className="py-2 text-[9px] font-black uppercase"
                                    variant="neutral"
                                >
                                    {t('finance.debt.pay_all_clean')}
                                </ActionButton>
                                <ActionButton
                                    onClick={() => repay(Math.min(state.debt, state.dirtyCash), 'dirty')}
                                    disabled={state.debt <= 0 || state.dirtyCash <= 0}
                                    className="py-2 text-[9px] font-black uppercase !border-red-500/30 !text-red-400"
                                    variant="neutral"
                                >
                                    {t('finance.debt.pay_all_dirty')}
                                </ActionButton>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinanceTab;
