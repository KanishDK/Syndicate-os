import React from 'react';
import { CONFIG } from '../config/gameConfig';
import { useProduction } from '../hooks/useProduction';
import ProductionCard from './ProductionCard';
import Button from './Button';

const ProductionTab = ({ state, setState, addLog, addFloat }) => {

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
    const maxCap = 50 * (state.upgrades.warehouse ? 2 : 1);
    const fillPercent = Math.min(100, (totalItems / maxCap) * 100);

    return (
        <div className="max-w-7xl mx-auto">
            {/* HEADER METRICS */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
                        <i className="fa-solid fa-industry text-emerald-500"></i> Laboratoriet
                    </h2>
                    <p className="text-zinc-400 text-sm mt-1">Administrer din produktion og distributionsnetværk.</p>
                </div>

                {/* WAREHOUSE METRIC */}
                <div className="w-full md:w-64">
                    <div className="flex justify-between items-center text-[10px] uppercase font-bold text-zinc-500 mb-1">
                        <span>
                            Lagerkapacitet
                            {fillPercent >= 100 && <span className="text-red-500 ml-2 animate-pulse"><i className="fa-solid fa-triangle-exclamation"></i> LAGER FULDT!</span>}
                        </span>
                        <span className={fillPercent > 90 ? 'text-red-500' : 'text-zinc-300'}>{totalItems} / {maxCap}</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                        <div
                            className={`h-full transition-all duration-300 ${fillPercent > 90 ? 'bg-red-500' : 'bg-emerald-500'}`}
                            style={{ width: `${fillPercent}%` }}
                        ></div>
                    </div>
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
                    <span>{state.isSalesPaused ? 'PANIC STOP' : 'DISTRIBUTION'}</span>
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
                        const stateWithToggle = { ...state, toggleAutoSell: toggleAutoSell }; // Pass toggle function down

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
    )
}

export default ProductionTab;
