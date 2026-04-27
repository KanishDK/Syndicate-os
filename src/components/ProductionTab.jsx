import React from 'react';
import { CONFIG } from '../config/gameConfig';
import { useProduction } from '../hooks/useProduction';
import ProductionCard from './ProductionCard';
import { formatNumber, getMaxCapacity } from '../utils/gameMath';
import { useLanguage } from '../context/LanguageContext';
import GlassCard from './ui/GlassCard';
import ActionButton from './ui/ActionButton';
import { useUI } from '../context/UIContext';
import { useGame } from '../context/GameContext';

// useManagement hook removed - now handled in global ModalController

const LogisticsDashboard = ({ state, t }) => {
    const activeItems = Object.keys(CONFIG.production).filter(id => {
        if (CONFIG.production[id].craftOnly) return false;
        const prod = state.productionRates?.[id]?.produced || 0;
        const sell = state.productionRates?.[id]?.sold || 0;
        return prod > 0 || sell > 0 || (state.inv?.[id] || 0) > 0;
    }).sort((a,b) => CONFIG.production[a].unlockLevel - CONFIG.production[b].unlockLevel);

    if (activeItems.length === 0) return null;

    return (
        <GlassCard className="mb-6 p-4 border border-white/10 relative overflow-hidden">
            {/* Background scanner effect */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-[length:20px_100%] pointer-events-none"></div>
            
            <h3 className="text-sm font-black uppercase tracking-widest text-cyan-400 mb-4 flex items-center gap-2 relative z-10">
                <i className="fa-solid fa-network-wired"></i> {t('production.logistics_network') || 'LOGISTICS NETWORK TARGETS'}
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 relative z-10">
                {activeItems.map(id => {
                    const item = CONFIG.production[id];
                    const prod = (state.productionRates?.[id]?.produced || 0) * 10;
                    const sell = (state.productionRates?.[id]?.sold || 0) * 10;
                    const diff = prod - sell;
                    const statusColor = diff > 0.05 ? 'text-green-400' : diff < -0.05 ? 'text-amber-400' : 'text-zinc-400';
                    const iconColor = diff > 0.05 ? 'fa-arrow-up' : diff < -0.05 ? 'fa-arrow-down' : 'fa-check-double';

                    return (
                        <div key={id} className={`bg-black/30 border rounded p-2 flex items-center justify-between transition-colors ${diff < -0.05 ? 'border-amber-500/20' : diff > 0.05 ? 'border-green-500/20' : 'border-white/5'}`}>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded flex items-center justify-center text-[10px] bg-white/5 text-zinc-300">
                                    <i className={`fa-solid ${item.icon}`}></i>
                                </div>
                                <span className="text-[10px] md:text-xs font-bold text-white">{t(`items.${id}.name`)}</span>
                            </div>
                            <div className="flex flex-col items-end pl-2">
                                <div className="text-[9px] md:text-[10px] font-mono flex gap-1.5 md:gap-2">
                                    <span className="text-green-400">+{formatNumber(prod)}/s</span>
                                    <span className="text-zinc-600">|</span>
                                    <span className="text-amber-400">-{formatNumber(sell)}/s</span>
                                </div>
                                <div className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest mt-0.5 md:mt-1 ${statusColor}`}>
                                    <i className={`fa-solid ${iconColor} mr-1`}></i> 
                                    {diff > 0.05 ? 'SURPLUS' : diff < -0.05 ? 'DEFICIT' : 'BALANCED'}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </GlassCard>
    );
};

const ProductionTab = ({ state, setState, addLog, addFloat }) => {
    const { dispatch } = useGame(); // Correctly access dispatch from context
    const { t } = useLanguage();
    const { produce, handleSell, toggleAutoSell } = useProduction(state, setState, addLog, addFloat);
    const { setShowMarketplace } = useUI(); // Use global state instead of local state

    // Local Modal State Removed to fix z-index clipping

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

    // Inventory Stats (Memoized for Audit 4.1)
    const { totalItems, maxCap, fillPercent } = React.useMemo(() => {
        const total = Object.entries(state.inv || {}).reduce((acc, [key, val]) =>
            (key === 'total' || typeof val !== 'number') ? acc : acc + val, 0);
        const cap = getMaxCapacity(state);
        const percent = Math.min(100, (total / cap) * 100);
        return { totalItems: total, maxCap: cap, fillPercent: percent };
    }, [state.inv, state.upgrades, state.territories, state.territoryLevels, state.territorySpecs]);

    return (
        <div className="max-w-7xl mx-auto p-2 md:p-1 relative">
            {/* STICKY HEADER REPLACEMENT (SANDBOX STYLE) */}
            <div className="bg-black/40 backdrop-blur-xl pb-3 lg:pb-6 pt-2 border-b border-white/10 mb-4 lg:mb-8 -mx-4 px-4 lg:px-6 shadow-2xl rounded-t-3xl">
                <div className="flex flex-col xl:flex-row justify-between items-center xl:items-end gap-3 lg:gap-6">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-mono text-cyan-500/40 tracking-[0.4em] uppercase mb-1 hidden lg:block">UNIT_PRODUCTION_FACILITY</span>
                        <h2 className="text-2xl lg:text-4xl font-black italic uppercase tracking-tighter text-white flex items-center gap-2 lg:gap-4">
                            <i className="fa-solid fa-flask text-amber-500"></i> {t('production.title')}
                        </h2>
                        <div className="flex items-center flex-wrap gap-2 md:gap-4 mt-2">
                            {/* SHORTCUTS HINT */}
                            <span className="text-[10px] md:text-xs text-theme-text-secondary font-mono bg-black/30 px-2 py-1 rounded">
                                {t('production.shortcuts_hint')} (<span className="text-terminal-cyan">1-6</span>)
                            </span>

                            {/* DYNAMIC MARKET INDICATOR */}
                            {state.market && (
                                <span className={`text-[10px] md:text-xs font-black font-mono px-3 py-1 rounded-sm border flex items-center gap-2 ${state.market.trend === 'bull'
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                    : state.market.trend === 'bear'
                                        ? 'bg-red-500/10 border-red-500/30 text-red-400'
                                        : 'bg-zinc-800/10 border-zinc-500/20 text-zinc-400'
                                    }`}>
                                    <i className={`fa-solid ${state.market.trend === 'bull' ? 'fa-arrow-trend-up' :
                                        state.market.trend === 'bear' ? 'fa-arrow-trend-down' : 'fa-minus'
                                        }`}></i>
                                    {state.market.trend === 'bull' ? 'BULL_MARKET' :
                                        state.market.trend === 'bear' ? 'BEAR_MARKET' : 'STABLE_OSC'}
                                    <span className="opacity-30">|</span>
                                    {Math.round((state.market.factor || 1) * 100)}%
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 w-full xl:w-auto items-center justify-center xl:justify-end">
                        <ActionButton
                            onClick={() => setShowMarketplace(true)}
                            className="bg-purple-900/20 border-purple-500/30 text-purple-400 hover:text-white flex-1 md:flex-none py-2 md:py-3"
                            variant="neutral"
                            icon="fa-solid fa-cart-shopping"
                        >
                            <span className="text-[10px] md:text-sm">BLACK MARKET</span>
                        </ActionButton>

                        <GlassCard className="p-3 px-5 flex items-center gap-6 border-white/5 bg-white/[0.02]">
                            <div className="text-right">
                                <div className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.2em] mb-1">{t('production.storage_cap')}</div>
                                <div className={`text-base font-mono font-black ${fillPercent > 90 ? 'text-red-500' : 'text-cyan-400'}`}>
                                    {formatNumber(totalItems)} <span className="text-[10px] opacity-40">/</span> {formatNumber(maxCap)}
                                </div>
                            </div>
                            <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                                <div className={`h-full rounded-full transition-all duration-1000 ${fillPercent > 90 ? 'bg-red-500' : 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.4)]'}`} style={{ width: `${fillPercent}%` }}></div>
                            </div>
                        </GlassCard>

                        <ActionButton
                            onClick={() => setState(prev => ({ ...prev, isSalesPaused: !prev.isSalesPaused }))}
                            className="min-w-[100px] md:min-w-[140px] flex-1 md:flex-none py-2 md:py-3"
                            variant={state.isSalesPaused ? 'danger' : 'primary'}
                            icon={state.isSalesPaused ? 'fa-solid fa-hand' : 'fa-solid fa-truck-fast'}
                        >
                            <span className="text-[10px] md:text-sm">{state.isSalesPaused ? t('production.panic_stop') : t('production.distribution')}</span>
                        </ActionButton>
                    </div>
                </div>
            </div>

            {/* CONTENT (Flows Naturally) */}
            <div className="pb-12">
                <LogisticsDashboard state={state} t={t} />

                {/* HEAT WARNING */}
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
                                {state.heat >= 95 ? t('production.heat_critical_title') : t('production.heat_high_title')}
                            </h4>
                            <p className="text-xs font-mono font-bold mt-1 text-red-300">
                                {state.heat >= 95 ? t('production.heat_critical_desc') : t('production.heat_high_desc')}
                            </p>
                        </div>
                    </GlassCard>
                )}

                {/* SYNTH-LAB CRAFTING (Phase 2 Feature) */}
                {Object.keys(CONFIG.recipes).some(k => state.level >= CONFIG.recipes[k].unlockLevel) && (
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-px bg-theme-border-subtle flex-1"></div>
                            <h3 className="text-xl font-black uppercase tracking-widest text-red-500 font-terminal">
                                <i className="fa-solid fa-flask-vial mr-2"></i> Synth-Lab
                            </h3>
                            <div className="h-px bg-theme-border-subtle flex-1"></div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {Object.values(CONFIG.recipes).map(recipe => {
                                const canCraft = Object.entries(recipe.inputs).every(([id, needed]) => (state.inv[id] || 0) >= needed);
                                const outputItem = CONFIG.production[recipe.output];

                                return (
                                    <GlassCard key={recipe.id} className="p-4 flex items-center justify-between group hover:border-red-500/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded bg-black/40 flex items-center justify-center text-2xl text-${outputItem?.color || 'white'}`}>
                                                <i className={`fa-solid ${outputItem?.icon || 'fa-box'}`}></i>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg text-white group-hover:text-red-400 transition-colors">{t(recipe.name)}</h4>
                                                <div className="flex gap-2 text-xs text-zinc-400 mt-1">
                                                    {Object.entries(recipe.inputs).map(([id, amount]) => (
                                                        <span key={id} className={(state.inv[id] || 0) < amount ? 'text-red-500' : 'text-zinc-400'}>
                                                            {amount}x {t(CONFIG.production[id]?.name)}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <ActionButton
                                            onClick={() => {
                                                if (canCraft) {
                                                    dispatch({ type: 'CRAFT_ITEM', payload: { recipeId: recipe.id, t } });
                                                }
                                            }}
                                            disabled={!canCraft}
                                            variant={canCraft ? 'danger' : 'disabled'}
                                            className="px-6 py-3"
                                        >
                                            <div className="flex flex-col items-center">
                                                <span className="font-bold">MIX</span>
                                                <span className="text-[10px] opacity-75">+{recipe.heat} Heat</span>
                                            </div>
                                        </ActionButton>
                                    </GlassCard>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* CARDS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
                    {React.useMemo(() => Object.keys(CONFIG.production)
                        .filter(key => !CONFIG.production[key].craftOnly)
                        .sort((a, b) => {
                            const aLocked = state.level < CONFIG.production[a].unlockLevel;
                            const bLocked = state.level < CONFIG.production[b].unlockLevel;
                            if (aLocked === bLocked) return CONFIG.production[a].unlockLevel - CONFIG.production[b].unlockLevel;
                            return aLocked ? 1 : -1;
                        }), [state.level])
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


                {/* MARKETPLACE MODAL - MOVED TO GLOBAL CONTROLLER */}
            </div>
        </div>
    );
};

export default ProductionTab;
