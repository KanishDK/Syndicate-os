import React from 'react';
import { CONFIG } from '../config/gameConfig';
import { useProduction } from '../hooks/useProduction';
import ProductionCard from './ProductionCard';
import { formatNumber, getMaxCapacity } from '../utils/gameMath';
import { useLanguage } from '../context/LanguageContext';
import GlassCard from './ui/GlassCard';
import ActionButton from './ui/ActionButton';
import ResourceBar from './ui/ResourceBar';
import { useUI } from '../context/UIContext';

import MarketplaceModal from './modals/MarketplaceModal';
// useManagement hook removed - now handled in global ModalController

const ProductionTab = ({ state, setState, addLog, addFloat }) => {
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

    // Inventory Stats
    const totalItems = Object.entries(state.inv || {}).reduce((acc, [key, val]) => key === 'total' ? acc : acc + (typeof val === 'number' ? val : 0), 0);
    const maxCap = getMaxCapacity(state);
    const fillPercent = Math.min(100, (totalItems / maxCap) * 100);

    return (
        <div className="max-w-7xl mx-auto h-full flex flex-col p-2 md:p-1">
            {/* FIXED HEADER (No Scroll) */}
            <div className="flex-none pb-4 border-b border-theme-border-subtle mb-4">
                <div className="flex flex-col xl:flex-row justify-between items-center xl:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter text-terminal-green flex items-center gap-3 font-terminal">
                            <i className="fa-solid fa-flask"></i> {t('production.title')}
                        </h2>
                        <div className="flex items-center flex-wrap gap-2 md:gap-4 mt-2">
                            {/* SHORTCUTS HINT */}
                            <span className="text-[10px] md:text-xs text-theme-text-secondary font-mono bg-black/30 px-2 py-1 rounded">
                                {t('production.shortcuts_hint')} (<span className="text-terminal-cyan">1-6</span>)
                            </span>

                            {/* DYNAMIC MARKET INDICATOR */}
                            {state.market && (
                                <span className={`text-[10px] md:text-xs font-mono px-2 py-1 rounded border flex items-center gap-2 ${state.market.trend === 'bull'
                                    ? 'bg-green-900/30 border-green-500/50 text-green-400'
                                    : state.market.trend === 'bear'
                                        ? 'bg-red-900/30 border-red-500/50 text-red-400'
                                        : 'bg-zinc-800/30 border-zinc-500/30 text-zinc-400'
                                    }`}>
                                    <i className={`fa-solid ${state.market.trend === 'bull' ? 'fa-arrow-trend-up' :
                                        state.market.trend === 'bear' ? 'fa-arrow-trend-down' : 'fa-minus'
                                        }`}></i>
                                    {state.market.trend === 'bull' ? 'BULL MARKET' :
                                        state.market.trend === 'bear' ? 'BEAR MARKET' : 'STABLE'}
                                    <span className="opacity-50">|</span>
                                    {Math.round((state.market.factor || 1) * 100)}%
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 w-full xl:w-auto items-center">
                        <ActionButton
                            onClick={() => setShowMarketplace(true)}
                            className="bg-purple-900/20 border-purple-500/30 text-purple-400 hover:text-white flex-1 md:flex-none py-2 md:py-3"
                            variant="neutral"
                            icon="fa-solid fa-cart-shopping"
                        >
                            <span className="text-[10px] md:text-sm">BLACK MARKET</span>
                        </ActionButton>

                        <GlassCard className="p-2 px-3 md:px-4 flex items-center gap-3 md:gap-4 flex-1 md:flex-none justify-between">
                            <div className="text-right">
                                <div className="text-[8px] md:text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{t('production.storage_cap')}</div>
                                <div className={`text-xs md:text-base font-mono font-bold ${fillPercent > 90 ? 'text-red-500' : 'text-white'}`}>
                                    {formatNumber(totalItems)} / {formatNumber(maxCap)}
                                </div>
                            </div>
                            <div className="w-16 md:w-24 h-1.5 md:h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className={`h-full ${fillPercent > 90 ? 'bg-red-500' : 'bg-terminal-green'}`} style={{ width: `${fillPercent}%` }}></div>
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

            {/* SCROLLABLE CONTENT (Internal Scroll) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
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
                                            onClick={() => setState(prev => {
                                                // Optimistic UI update or dispatch?
                                                // We need to use dispatch actually, but setState is exposed here which triggers dispatch under hood in GameContext usually? 
                                                // Wait, ProductionTab receives setState which is typically the dispatch wrapper or raw dispatch?
                                                // Checking gameContext: value={state, dispatch}. 
                                                // Checking useGame usage in ProductionTab: receives state, setState.
                                                // Wait, App.js defines setState as dispatch wrapper? No, useGame provides dispatch.
                                                // In ProductionTab props: `({ state, setState })`
                                                // Let's assume setState(action) works if it's the wrapper, but usually we use dispatch directly.
                                                // ProductionTab calls `produce` from `useProduction`.
                                                // Let's call dispatch directly via context hook since props might be legacy.
                                                // Ah, ProductionTab is a component.
                                                // Let's use window.__GAME_DISPATCH__ if available or just check how produce does it.
                                                // useProduction uses dispatch.
                                                window.__GAME_DISPATCH__({ type: 'CRAFT_ITEM', payload: { recipeId: recipe.id } });
                                                return prev; // Force re-render if needed
                                            })}
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

            {/* MARKETPLACE MODAL - MOVED TO GLOBAL CONTROLLER */}
        </div>
    );
};

export default ProductionTab;
