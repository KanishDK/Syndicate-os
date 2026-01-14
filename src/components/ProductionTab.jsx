import React from 'react';
import { CONFIG } from '../config/gameConfig';
import { useProduction } from '../hooks/useProduction';
import ProductionCard from './ProductionCard';
import Button from './Button';
import { formatNumber, getMaxCapacity } from '../utils/gameMath';
import { useLanguage } from '../context/LanguageContext';

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
    const totalItems = Object.values(state.inv).reduce((a, b) => a + b, 0);
    const maxCap = getMaxCapacity(state);
    const fillPercent = Math.min(100, (totalItems / maxCap) * 100);

    return (
        <div className="max-w-7xl mx-auto">
            {/* HEADER METRICS */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4 border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-terminal-green flex items-center gap-3 font-terminal">
                        <i className="fa-solid fa-industry"></i> {t('production.title')}
                    </h2>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-terminal">
                        <strong className="text-terminal-green">{t('production.title')}</strong> {t('production.subtitle').replace(t('production.title'), '')}
                        <br />
                        {t('production.shortcuts_hint')} (<span className="text-terminal-cyan">1-6</span>)
                    </p>
                </div>

                {/* WAREHOUSE METRIC */}
                <div className="w-full md:w-64 mx-auto md:mx-0">
                    <div className="flex justify-between items-center text-[10px] uppercase font-bold text-theme-text-muted mb-1 font-terminal">
                        <span>
                            {t('production.storage_cap')}
                            <span className={fillPercent > 90 ? 'text-theme-danger' : 'text-theme-text-secondary'}> {totalItems} / {maxCap}</span>
                        </span>
                        {fillPercent >= 100 && <span className="text-theme-danger ml-2 animate-pulse"><i className="fa-solid fa-triangle-exclamation"></i> {t('production.storage_full')}</span>}
                    </div>
                    <div className="w-full h-2 bg-theme-surface-dark rounded-full overflow-hidden border border-theme-border-subtle">
                        <div
                            className={`h-full transition-all duration-300 ${fillPercent > 90 ? 'bg-theme-danger' : 'bg-theme-success'}`}
                            style={{ width: `${fillPercent}%` }}
                        ></div>
                    </div>
                </div>

                {/* STATS DASHBOARD */}
                <div className="bg-theme-surface-elevated border border-theme-border-default rounded-2xl p-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <i className="fa-solid fa-chart-line text-6xl text-white"></i>
                    </div>
                    <h3 className="text-xs font-black text-theme-text-muted uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-theme-border-subtle pb-2 font-terminal">
                        <i className="fa-solid fa-chart-bar"></i> {t('production.stats_title')}
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center group hover:bg-theme-surface-dark rounded-lg p-2 transition-colors">
                            <div className="text-2xl font-mono font-bold text-theme-success group-hover:scale-110 transition-transform">
                                {formatNumber(Object.values(state.stats.produced || {}).reduce((a, b) => a + b, 0))}
                            </div>
                            <div className="text-[10px] text-theme-text-muted uppercase font-terminal">
                                {t('production.total_produced')}
                            </div>
                        </div>
                        <div className="text-center group hover:bg-theme-surface-dark rounded-lg p-2 transition-colors">
                            <div className="text-2xl font-mono font-bold text-theme-warning group-hover:scale-110 transition-transform">
                                {formatNumber(state.stats.sold || 0)}
                            </div>
                            <div className="text-[10px] text-theme-text-muted uppercase font-terminal">
                                {t('production.total_sold')}
                            </div>
                        </div>
                        <div className="text-center group hover:bg-white/5 rounded-lg p-2 transition-colors">
                            <div className="text-2xl font-mono font-bold text-terminal-cyan group-hover:scale-110 transition-transform">
                                {totalItems}
                            </div>
                            <div className="text-[10px] text-zinc-500 uppercase font-terminal">
                                {t('production.in_stock')}
                            </div>
                        </div>
                        <div className="text-center group hover:bg-white/5 rounded-lg p-2 transition-colors">
                            <div className="text-2xl font-mono font-bold text-white group-hover:scale-110 transition-transform">
                                {Object.keys(CONFIG.production).filter(key => state.level >= CONFIG.production[key].unlockLevel).length}/{Object.keys(CONFIG.production).length}
                            </div>
                            <div className="text-[10px] text-zinc-500 uppercase font-terminal">
                                {t('production.unlocked')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* KEYBOARD SHORTCUTS HINT */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-3 mb-6 hidden md:block">
                <div className="flex items-center gap-2 text-xs text-zinc-400 font-terminal">
                    <i className="fa-solid fa-keyboard text-terminal-cyan"></i>
                    <span>
                        <strong className="text-white">{t('production.shortcuts')}</strong> {t('production.shortcuts_hint')}
                    </span>
                </div>
            </div>

            {/* CONTROLS BAR */}
            <div className="flex justify-end mb-6">
                <Button
                    onClick={() => setState(prev => ({ ...prev, isSalesPaused: !prev.isSalesPaused }))}
                    className="w-64 h-12"
                    variant={state.isSalesPaused ? 'danger' : 'primary'}
                >
                    <i className={`fa-solid ${state.isSalesPaused ? 'fa-hand' : 'fa-truck-fast'}`}></i>
                    <span>{state.isSalesPaused ? t('production.panic_stop') : t('production.distribution')}</span>
                </Button>
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
                            />
                        )
                    })}
            </div>
        </div>
    );
};

export default ProductionTab;
