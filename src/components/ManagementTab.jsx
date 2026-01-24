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
import StaffCategoryModal from './management/StaffCategoryModal';
import UpgradeCard from './management/UpgradeCard';
import SecurityModal from './management/SecurityModal';

import { useUI } from '../context/UIContext';
import { useRivals } from '../hooks/useRivals';

const ManagementTab = ({ state, setState, addLog }) => {
    const { t } = useLanguage();
    const { buyAmount } = useUI();
    const { buyStaff, fireStaff, buyUpgrade, handleToggle, expandedRole } = useManagement(state, setState, addLog);
    const { buyDefense } = useRivals(state, setState, addLog);

    // State for Modal
    const [activeCategory, setActiveCategory] = useState(null);

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
        <div className="max-w-7xl mx-auto h-full flex flex-col pb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">

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

            {/* SCROLLABLE DASHBOARD CONTENT */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-1 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full content-start">

                    {/* COLUMN 1: FINANCIAL OVERVIEW */}
                    <GlassCard className={`p-6 flex flex-col justify-between transition-colors duration-500`} variant={financialData.netFlow < 0 ? 'danger' : 'glass'}>
                        <div>
                            <h3 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <i className="fa-solid fa-chart-line"></i> {t('management.economy')}
                            </h3>

                            <div className="space-y-4">
                                {/* NET FLOW */}
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{t('management.stats.estimated_cashflow')} (5 min)</span>
                                    <div className={`text-4xl font-mono font-black ${financialData.netFlow >= 0 ? 'text-emerald-400' : 'text-red-500'} flex items-center gap-2`}>
                                        {financialData.netFlow >= 0 ? '+' : ''}{formatNumber(financialData.netFlow)} kr
                                        {financialData.netFlow < 0 && <i className="fa-solid fa-trend-down animate-bounce text-xl"></i>}
                                    </div>
                                </div>

                                {financialData.netFlow < 0 && state.cleanCash < financialData.salary5Min && (
                                    <div className="bg-red-500 text-white px-3 py-2 rounded text-[10px] font-black uppercase tracking-widest animate-pulse flex items-center gap-2 shadow-lg">
                                        <i className="fa-solid fa-triangle-exclamation"></i>
                                        {t('management.stats.bankrupt_warning') || 'KONKURS FARE!'}
                                    </div>
                                )}

                                <div className="h-px bg-white/10 my-4"></div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-zinc-500 font-bold uppercase text-[10px]">{t('management.stats.income_5m')}</span>
                                        <span className="text-emerald-400 font-mono text-sm">+{formatNumber(financialData.income5Min)} kr</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-zinc-500 font-bold uppercase text-[10px]">{t('management.stats.salary_5m')}</span>
                                        <span className="text-red-400 font-mono text-sm">-{formatNumber(financialData.salary5Min)} kr</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    {/* COLUMN 2: STAFF OVERVIEW (Simplified) */}
                    <GlassCard className="lg:col-span-2 p-6 flex flex-col" variant="interactive">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xs font-black text-purple-500 uppercase tracking-widest flex items-center gap-2">
                                <i className="fa-solid fa-users"></i> {t('management.staff_overview')}
                            </h3>
                            <div className="text-right">
                                <div className="text-[10px] text-zinc-500 font-bold uppercase">{t('staff.total_staff')}</div>
                                <div className="text-2xl font-black text-white font-mono">
                                    {Object.values(state.staff).reduce((a, b) => a + b, 0)}
                                </div>
                            </div>
                        </div>

                        {/* Compact Categories List */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1 content-start">
                            {Object.values(CONFIG.staffCategories).map((cat) => (
                                <div
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/30 rounded-xl p-4 cursor-pointer transition-all group flex flex-col justify-between gap-4"
                                >
                                    <div className="flex justify-between items-start">
                                        <i className={`fa-solid ${cat.icon} text-zinc-600 group-hover:text-purple-400 text-xl transition-colors`}></i>
                                        <span className="font-mono font-bold text-white">
                                            {Object.entries(state.staff)
                                                .filter(([k, v]) => CONFIG.staff[k]?.category === cat.id)
                                                .reduce((acc, [k, v]) => acc + v, 0)
                                            }
                                        </span>
                                    </div>
                                    <div>
                                        <div className="text-xs font-black uppercase text-zinc-400 group-hover:text-white transition-colors">{t(cat.name)}</div>
                                        <div className="text-[9px] text-zinc-600 mt-0.5">{t('staff.click_to_manage')}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* HINT */}
                        <div className="mt-6 text-center text-[10px] text-zinc-500 font-mono">
                            {t('staff.select_department')}
                        </div>
                    </GlassCard>
                </div>
            </div>

            {/* MODALS */}
            {activeCategory && activeCategory !== 'security' && (
                <StaffCategoryModal
                    categoryId={activeCategory}
                    state={state}
                    onBuy={buyStaff}
                    onSell={fireStaff}
                    onClose={() => setActiveCategory(null)}
                />
            )}

            {activeCategory === 'security' && (
                <SecurityModal
                    state={state}
                    buyDefense={buyDefense}
                    onClose={() => setActiveCategory(null)}
                />
            )}
        </div>
    );
};

export default ManagementTab;
