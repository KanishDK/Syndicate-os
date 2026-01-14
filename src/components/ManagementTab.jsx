import React, { useState, useMemo, useCallback } from 'react';
import { CONFIG } from '../config/gameConfig';
import { formatNumber, getBulkCost, getMaxAffordable } from '../utils/gameMath';
import { useManagement } from '../hooks/useManagement';
import Button from './Button';
import BulkControl from './BulkControl';
import { useLanguage } from '../context/LanguageContext';

// Modular Components
import StaffCard from './management/StaffCard';
import UpgradeCard from './management/UpgradeCard';

import { useUI } from '../context/UIContext';

const ManagementTab = ({ state, setState, addLog }) => {
    const { t } = useLanguage();
    const { buyAmount } = useUI();

    // Hooks
    const { buyStaff, fireStaff, buyUpgrade } = useManagement(state, setState, addLog);
    const [expandedRole, setExpandedRole] = useState(null);

    // Toggle Handler (Memoized)
    const handleToggle = useCallback((role) => {
        setExpandedRole(prev => (prev === role ? null : role));
    }, []);

    // Helper: Calculate Total Salary
    const totalSalary = useMemo(() => Object.keys(state.staff || {}).reduce((acc, role) => {
        const count = state.staff[role] || 0;
        const salary = CONFIG.staff[role]?.salary || 0;
        return acc + (count * salary);
    }, 0), [state.staff]);

    return (
        <div className="max-w-7xl mx-auto h-full flex flex-col pb-24">

            {/* HEADER & TOGGLE */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-theme-border-default pb-6">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-theme-text-primary flex items-center gap-3">
                        <i className="fa-solid fa-users text-purple-500"></i> {t('management.title')}
                    </h2>
                    <p className="text-theme-text-secondary text-sm mt-1">{t('management.subtitle')}</p>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <Button
                        onClick={() => {
                            if (state.cleanCash >= totalSalary) {
                                setState(prev => ({
                                    ...prev,
                                    cleanCash: prev.cleanCash - totalSalary,
                                    payroll: { ...prev.payroll, lastPaid: Date.now(), isStriking: false }
                                }));
                                addLog(`Løn udbetalt manuelt: ${formatNumber(totalSalary)} kr.`, 'success');
                            }
                        }}
                        disabled={state.cleanCash < totalSalary || totalSalary === 0}
                        className="px-6 py-2 h-10 text-xs font-bold whitespace-nowrap"
                        variant={state.payroll?.isStriking ? 'danger' : 'neutral'}
                        title="Nulstil løn-timeren ved at betale nu"
                    >
                        {state.payroll?.isStriking ? t('management.stop_strike') : t('management.pay_salary')} ({formatNumber(totalSalary)})
                    </Button>
                    <BulkControl />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT COL: STAFF */}
                <div className="lg:col-span-2 space-y-6">
                    {/* STAFF LIST */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(CONFIG.staff).map(([role, item]) => {
                            const count = state.staff[role] || 0;
                            const locked = state.level < item.reqLevel;

                            // Calculation logic moved to StaffCard (or kept here if needed for sorting? No, pass props)
                            // We pass raw data + helpers, let Card handle display logic refactor?
                            // Actually, StaffCard expects 'costToDisplay' etc. based on my extraction.
                            // I should calculate these here to keep the Card "dumb" regarding global math, 
                            // OR move math to Card. The extraction kept props.
                            // Let's optimize: Pass 'buyAmount' and 'state' (for cash) and do math in Card?
                            // My extracted StaffCard didn't have the math logic inside it, it expected props.
                            // WAIT. My extraction code for StaffCard.jsx REMOVED the math logic from the component body?
                            // Let me check what I wrote in Step 389.
                            // I checked Step 389. The StaffCard definition TAKES 'costToDisplay', 'actualAmount'.
                            // It DOES NOT calculate them.
                            // So I MUST calculate them here.

                            // Cost Calc
                            // Imports are at top.

                            let actualAmount = buyAmount;
                            if (buyAmount === 'max') {
                                actualAmount = getMaxAffordable(item.baseCost, item.costFactor || 1.15, count, state.cleanCash);
                            }
                            if (actualAmount <= 0) actualAmount = 1;


                            // Using the imported function

                            // Re-importing inside mapping is bad. Use the top level ones.
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
                                    // Removed full state pass for perf, passing specific data instead
                                    hiredDate={state.staffHiredDates?.[role]}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT COL: STATS & UPGRADES */}
                <div className="space-y-6">
                    {/* STATS CHECK */}
                    <div className="bg-theme-surface-elevated border border-theme-border-subtle rounded-2xl p-4 shadow-xl">
                        <h3 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <i className="fa-solid fa-chart-line"></i> {t('management.economy')}
                        </h3>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs border-b border-theme-border-subtle pb-2">
                                <span className="text-theme-text-muted font-bold uppercase text-[9px]">{t('management.salary_interval')}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-theme-danger font-mono">-{formatNumber(totalSalary)} kr / 5 min</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-xs border-b border-theme-border-subtle pb-2">
                                <span className="text-theme-text-muted font-bold uppercase text-[9px]">{t('management.total_revenue')}</span>
                                <span className="text-theme-success font-mono">{formatNumber(state.lifetime?.earnings || 0)} kr.</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-theme-text-muted font-bold uppercase text-[9px]">{t('management.laundered')}</span>
                                <span className="text-theme-info font-mono">{formatNumber(state.lifetime?.laundered || 0)} kr.</span>
                            </div>
                        </div>
                    </div>

                    {/* UPGRADES */}
                    <div className="bg-theme-surface-elevated border border-theme-border-subtle rounded-2xl p-4 shadow-xl">
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
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ManagementTab;
