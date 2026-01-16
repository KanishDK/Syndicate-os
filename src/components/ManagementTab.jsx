import React, { useState, useMemo } from 'react';
import { CONFIG } from '../config/gameConfig';
import { formatNumber, getBulkCost, getMaxAffordable } from '../utils/gameMath';
import { useManagement } from '../hooks/useManagement';
import ActionButton from './ui/ActionButton';
import GlassCard from './ui/GlassCard';
import BulkControl from './BulkControl';
import { useLanguage } from '../context/LanguageContext';
import TabHeader from './TabHeader';

// Modular Components
import StaffCard from './management/StaffCard';
import UpgradeCard from './management/UpgradeCard';

import { useUI } from '../context/UIContext';

const ManagementTab = ({ state, setState, addLog }) => {
    const { t } = useLanguage();
    const { buyAmount } = useUI();
    const { buyStaff, fireStaff, buyUpgrade, handleToggle, expandedRole } = useManagement(state, setState, addLog);

    // State for Timer
    const [now, setNow] = useState(Date.now());

    React.useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    // Calculate Financials (The CFO View)
    const financialData = useMemo(() => {
        let incomePerSec = 0;
        CONFIG.territories.forEach(t => {
            if (state.territories.includes(t.id)) {
                const lvl = state.territoryLevels?.[t.id] || 1;
                const inc = t.income * Math.pow(1.5, lvl - 1); // Hourly
                incomePerSec += inc / 3600;
            }
        });

        const income5Min = incomePerSec * 300;
        const salary5Min = Object.keys(state.staff || {}).reduce((acc, role) => {
            const count = state.staff[role] || 0;
            const salary = CONFIG.staff[role]?.salary || 0;
            return acc + (count * salary);
        }, 0);

        const netFlow = income5Min - salary5Min;
        const nextPayTime = (state.payroll?.lastPaid || 0) + CONFIG.payroll.salaryInterval;
        const timeToPay = Math.max(0, nextPayTime - now);

        return { income5Min, salary5Min, netFlow, timeToPay };
    }, [state.territories, state.territoryLevels, state.staff, state.payroll, now]);


    return (
        <div className="max-w-7xl mx-auto h-full flex flex-col pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* HEADER & TOGGLE */}
            <TabHeader
                title={t('management.title')}
                subtitle={t('management.subtitle')}
                icon="fa-solid fa-briefcase"
                accentColor="purple"
                variant="contained"
            >
                {/* ACTIONS */}
                <div className="flex flex-col md:flex-row gap-4 items-end ml-auto">
                    <div className="flex flex-col items-end mr-4">
                        <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">{t('management.next_payroll')}</div>
                        <div className={`font-mono font-black text-xl ${financialData.timeToPay < 30000 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                            {new Date(financialData.timeToPay).toISOString().substr(14, 5)}
                        </div>
                    </div>

                    <ActionButton
                        onClick={() => {
                            if (state.cleanCash >= financialData.salary5Min) {
                                setState(prev => ({
                                    ...prev,
                                    cleanCash: prev.cleanCash - financialData.salary5Min,
                                    payroll: { ...prev.payroll, lastPaid: Date.now(), isStriking: false }
                                }));
                                addLog(`Løn udbetalt manuelt: ${formatNumber(financialData.salary5Min)} kr.`, 'success');
                            }
                        }}
                        disabled={state.cleanCash < financialData.salary5Min || financialData.salary5Min === 0}
                        className="min-w-[140px]"
                        variant={state.payroll?.isStriking ? 'danger' : 'neutral'}
                        title="Nulstil løn-timeren ved at betale nu"
                    >
                        {state.payroll?.isStriking ? t('management.stop_strike') : t('management.pay_salary')} ({formatNumber(financialData.salary5Min)})
                    </ActionButton>
                    <BulkControl />
                </div>
            </TabHeader>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                {/* LEFT COL: STAFF */}
                <div className="lg:col-span-2 space-y-6">
                    {/* STAFF LIST */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(CONFIG.staff).map(([role, item]) => {
                            const count = state.staff[role] || 0;
                            const locked = state.level < item.reqLevel;

                            let actualAmount = buyAmount;
                            if (buyAmount === 'max') {
                                actualAmount = getMaxAffordable(item.baseCost, item.costFactor || 1.15, count, state.cleanCash);
                            }
                            if (actualAmount <= 0) actualAmount = 1;

                            const cost = getBulkCost(item.baseCost, item.costFactor || 1.15, count, actualAmount);
                            const canAfford = state.cleanCash >= cost;
                            const isWorking = role === 'accountant' && count > 0 && state.dirtyCash > 0;

                            return (
                                <StaffCard
                                    key={role}
                                    role={role}
                                    item={item}
                                    count={count}
                                    onBuy={buyStaff}
                                    onSell={fireStaff}
                                    locked={locked}
                                    canAfford={canAfford}
                                    costToDisplay={cost}
                                    actualAmount={actualAmount}
                                    isWorking={isWorking}
                                    isExpanded={expandedRole === role}
                                    onToggle={() => handleToggle(role)}
                                    hiredDate={state.staffHiredDates?.[role]}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT COL: STATS & UPGRADES */}
                <div className="space-y-6">
                    {/* STATS CHECK (CFO DASHBOARD) */}
                    <GlassCard className={`p-6 transition-colors duration-500`} variant={financialData.netFlow < 0 ? 'danger' : 'glass'}>
                        <h3 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <i className="fa-solid fa-chart-line"></i> {t('management.economy')}
                        </h3>

                        <div className="space-y-4">
                            {/* NET FLOW INDICATOR */}
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{t('management.stats.estimated_cashflow')} (5 min)</span>
                                <div className={`text-2xl font-mono font-black ${financialData.netFlow >= 0 ? 'text-emerald-400' : 'text-red-500'} flex items-center gap-2`}>
                                    {financialData.netFlow >= 0 ? '+' : ''}{formatNumber(financialData.netFlow)} kr
                                    {financialData.netFlow < 0 && <i className="fa-solid fa-trend-down animate-bounce"></i>}
                                </div>
                            </div>

                            {financialData.netFlow < 0 && state.cleanCash < financialData.salary5Min && (
                                <div className="bg-red-500 text-white px-3 py-2 rounded text-[10px] font-black uppercase tracking-widest animate-pulse flex items-center gap-2 shadow-lg">
                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                    {t('management.stats.bankrupt_warning') || 'KONKURS FARE!'}
                                </div>
                            )}

                            <div className="h-px bg-white/10 my-2"></div>

                            <div className="flex justify-between items-center text-xs">
                                <span className="text-zinc-500 font-bold uppercase text-[9px]">{t('management.stats.income_5m')}</span>
                                <span className="text-emerald-400 font-mono">+{formatNumber(financialData.income5Min)} kr</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-zinc-500 font-bold uppercase text-[9px]">{t('management.stats.salary_5m')}</span>
                                <span className="text-red-400 font-mono">-{formatNumber(financialData.salary5Min)} kr</span>
                            </div>
                        </div>
                    </GlassCard>

                    {/* UPGRADES */}
                    <GlassCard className="p-4" variant="glass">
                        <h3 className="text-xs font-black text-purple-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <i className="fa-solid fa-arrow-up-right-dots"></i> {t('management.upgrades')}
                        </h3>
                        <div className="space-y-3">
                            {Object.entries(CONFIG.upgrades).map(([key, item]) => (
                                <UpgradeCard
                                    key={key}
                                    itemKey={key}
                                    item={item}
                                    currentLevel={state.upgrades[key] || 0}
                                    onBuy={buyUpgrade}
                                    state={state}
                                />
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default ManagementTab;
