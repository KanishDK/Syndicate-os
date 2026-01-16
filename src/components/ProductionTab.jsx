import React from 'react';
import { CONFIG } from '../config/gameConfig';
import { useProduction } from '../hooks/useProduction';
import ProductionCard from './ProductionCard';
import { formatNumber, getMaxCapacity } from '../utils/gameMath';
import { useLanguage } from '../context/LanguageContext';
import GlassCard from './ui/GlassCard';
import ActionButton from './ui/ActionButton';
import ResourceBar from './ui/ResourceBar';

const ProductionTab = ({ state, setState, addLog, addFloat }) => {
    const { t } = useLanguage();
    const { produce, handleSell, toggleAutoSell } = useProduction(state, setState, addLog, addFloat);

    // Keyboard Shortcuts
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            const sortedKeys = Object.keys(CONFIG.production).sort((a, b) => CONFIG.production[a].unlockLevel - CONFIG.production[b].unlockLevel);
            const key = parseInt(e.key);
            if (!isNaN(key) && key > 0 && key <= sortedKeys.length) {
                produce(sortedKeys[key - 1]);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [state.level, state.isProcessing, state.inv, state.dirtyCash, produce]);

    // Inventory Stats
    const totalItems = Object.entries(state.inv || {}).reduce((acc, [key, val]) => key === 'total' ? acc : acc + (typeof val === 'number' ? val : 0), 0);
    const maxCap = getMaxCapacity(state);
    const fillPercent = Math.min(100, (totalItems / maxCap) * 100);

    return (
        <div className="max-w-7xl mx-auto p-1">
            {/* HEADER METRICS */}
            <div className="flex flex-col xl:flex-row justify-between items-end mb-6 gap-4 border-b border-theme-border-subtle pb-6">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-terminal-green flex items-center gap-3 font-terminal">
                        <i className="fa-solid fa-flask"></i> {t('production.title')}
                    </h2>
                    <p className="text-xs text-theme-text-secondary mt-2 leading-relaxed font-mono">
                        <strong className="text-terminal-green">{t('production.title')}</strong> {t('production.subtitle').replace(t('production.title'), '')}
                        <br />
                        {t('production.shortcuts_hint')} (<span className="text-terminal-cyan">1-6</span>)
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
                    {/* WAREHOUSE METRIC */}
                    <GlassCard className="p-4 w-full md:w-64 flex flex-col justify-center">
                        <ResourceBar
                            current={totalItems}
                            max={maxCap}
                            color={fillPercent > 90 ? 'bg-theme-danger' : 'bg-theme-success'}
                            label={t('production.storage_cap')}
                            subLabel={`${totalItems} / ${maxCap}`}
                            size="md"
                        />
                        {fillPercent >= 100 && <span className="text-[10px] text-theme-danger font-bold mt-2 animate-pulse"><i className="fa-solid fa-triangle-exclamation"></i> {t('production.storage_full')}</span>}
                    </GlassCard>

                    {/* STATS DASHBOARD */}
                    <GlassCard className="p-4 flex-1">
                        <div className="flex justify-between items-center mb-4 border-b border-theme-border-subtle pb-2">
                            <h3 className="text-xs font-black text-theme-text-muted uppercase tracking-widest flex items-center gap-2">
                                <i className="fa-solid fa-chart-bar"></i> {t('production.stats_title')}
                            </h3>
                        </div>


                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="text-center group hover:bg-white/5 rounded-lg p-2 transition-colors">
                                <div className="text-xl font-mono font-bold text-theme-success group-hover:scale-110 transition-transform">
                                    {formatNumber(Object.values(state.stats.produced || {}).reduce((a, b) => a + b, 0))}
                                </div>
                                <div className="text-[9px] text-theme-text-muted uppercase font-bold tracking-widest">
                                    {t('production.total_produced')}
                                </div>
                            </div>
                            <div className="text-center group hover:bg-white/5 rounded-lg p-2 transition-colors">
                                <div className="text-xl font-mono font-bold text-theme-warning group-hover:scale-110 transition-transform">
                                    {formatNumber(state.stats.sold || 0)}
                                </div>
                                <div className="text-[9px] text-theme-text-muted uppercase font-bold tracking-widest">
                                    {t('production.total_sold')}
                                </div>
                            </div>
                            <div className="text-center group hover:bg-white/5 rounded-lg p-2 transition-colors">
                                <div className="text-xl font-mono font-bold text-terminal-cyan group-hover:scale-110 transition-transform">
                                    {totalItems}
                                </div>
                                <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">
                                    {t('production.in_stock')}
                                </div>
                            </div>
                            <div className="text-center group hover:bg-white/5 rounded-lg p-2 transition-colors">
                                <div className="text-xl font-mono font-bold text-white group-hover:scale-110 transition-transform">
                                    {Object.keys(CONFIG.production).filter(key => state.level >= CONFIG.production[key].unlockLevel).length}/{Object.keys(CONFIG.production).length}
                                </div>
                                <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">
                                    {t('production.unlocked')}
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>

            {/* HEAT WARNING BANNER (UX FIX) */}
            {state.heat > 80 && (
                <GlassCard
                    variant="danger"
                    className={`mb-6 p-4 flex items-center gap-4 animate-pulse shadow-lg ${state.heat >= 95 ? 'border-red-500 bg-red-950/50' : ''}`}
                >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${state.heat >= 95 ? 'bg-red-500/20' : 'bg-orange-500/20'}`}>
                        <i className="fa-solid fa-temperature-arrow-up"></i>
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-widest text-sm flex items-center gap-2">
                            {state.heat >= 95 ? (
                                <>
                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                    {t('production.heat_critical_title') || 'CRITICAL LOCKDOWN'}
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-fire"></i>
                                    {t('production.heat_high_title') || 'HIGH HEAT ALERT'}
                                </>
                            )}
                        </h4>
                        <p className={`text-xs font-mono font-bold mt-1 ${state.heat >= 95 ? 'text-red-400' : 'text-orange-400'}`}>
                            {state.heat >= 95
                                ? (t('production.heat_critical_desc') || 'POLICE RAID IMMINENT. SALES EFFICIENCY REDUCED BY 80%!')
                                : (t('production.heat_high_desc') || 'POLICE ACTIVITY DETECTED. SALES EFFICIENCY REDUCED BY 50%.')
                            }
                        </p>
                    </div>
                    <div className="ml-auto text-right hidden sm:block">
                        <div className="text-xs uppercase opacity-70 mb-1">Current Heat</div>
                        <div className="text-3xl font-black font-mono">{Math.floor(state.heat)} / {CONFIG.gameMechanics.maxHeat}</div>
                    </div>
                </GlassCard>
            )}

            {/* CONTROLS BAR */}
            <div className="flex justify-between items-center mb-6">

                {/* KEYBOARD SHORTCUTS HINT */}
                <div className="hidden md:flex items-center gap-2 text-xs text-zinc-400 font-mono bg-black/30 px-3 py-2 rounded border border-white/5">
                    <i className="fa-solid fa-keyboard text-terminal-cyan"></i>
                    <span>
                        <strong className="text-white">{t('production.shortcuts')}</strong> {t('production.shortcuts_hint')}
                    </span>
                </div>

                <ActionButton
                    onClick={() => setState(prev => ({ ...prev, isSalesPaused: !prev.isSalesPaused }))}
                    className="w-full md:w-64"
                    variant={state.isSalesPaused ? 'danger' : 'primary'}
                    icon={state.isSalesPaused ? 'fa-solid fa-hand' : 'fa-solid fa-truck-fast'}
                >
                    <span>{state.isSalesPaused ? t('production.panic_stop') : t('production.distribution')}</span>
                </ActionButton>
            </div>

            {/* CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 pb-4">
                {Object.keys(CONFIG.production)
                    .sort((a, b) => {
                        const aLocked = state.level < CONFIG.production[a].unlockLevel;
                        const bLocked = state.level < CONFIG.production[b].unlockLevel;
                        if (aLocked === bLocked) return CONFIG.production[a].unlockLevel - CONFIG.production[b].unlockLevel;
                        return aLocked ? 1 : -1;
                    })
                    .map(key => {
                        const item = { ...CONFIG.production[key], id: key };
                        const stateWithToggle = { ...state, toggleAutoSell: toggleAutoSell };

                        return (
                            <ProductionCard
                                key={key}
                                item={item}
                                state={stateWithToggle}
                                produce={produce}
                                onSell={handleSell}
                                price={state.prices[key]}
                                toggleAutoSell={toggleAutoSell}
                                addFloat={addFloat}
                                isGlobalStorageFull={fillPercent >= 100}
                            />
                        )
                    })}
            </div>
        </div>
    );
};

export default ProductionTab;
