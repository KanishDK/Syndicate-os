import React from 'react';
import { CONFIG } from '../config/gameConfig';
import { useProduction } from '../hooks/useProduction';
import ProductionCard from './ProductionCard';

const ProductionTab = ({ state, setState, addLog, addFloat }) => {

    const { produce, handleSell, toggleAutoSell } = useProduction(state, setState, addLog, addFloat);

    // Keyboard Shortcuts
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            // Mapping keys 1-7 (or more) to sorted items
            const sortedKeys = Object.keys(CONFIG.production).sort((a, b) => {
                // Same sort logic as render
                return CONFIG.production[a].unlockLevel - CONFIG.production[b].unlockLevel;
            });

            const key = parseInt(e.key);
            if (!isNaN(key) && key > 0 && key <= sortedKeys.length) {
                const targetId = sortedKeys[key - 1];
                const item = CONFIG.production[targetId];
                if (state.level >= item.unlockLevel) {
                    produce(targetId);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [state.level, state.isProcessing, state.inv, state.dirtyCash, produce]);

    return (
        <div>
            <div className="flex justify-between items-end mb-6">
                <h2 className="text-xl font-black uppercase tracking-tighter text-white">Laboratoriet</h2>
                <div className="text-right text-[10px] text-zinc-500 mono bg-zinc-900 px-3 py-1 rounded-full border border-white/5">
                    Lager: <span className="text-white font-bold">{Object.values(state.inv).reduce((a, b) => a + b, 0)}</span> <span className="text-zinc-600">/</span> {50 * (state.upgrades.warehouse || 1)}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                {Object.keys(CONFIG.production)
                    .sort((a, b) => {
                        const aLocked = state.level < CONFIG.production[a].unlockLevel;
                        const bLocked = state.level < CONFIG.production[b].unlockLevel;
                        if (aLocked === bLocked) return CONFIG.production[a].unlockLevel - CONFIG.production[b].unlockLevel;
                        return aLocked ? 1 : -1;
                    })
                    .map(key => {
                        const item = { ...CONFIG.production[key], id: key };
                        // Inject toggle capability into state prop (hacky but avoids drilling)
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
                            />
                        )
                    })}
            </div>
        </div>
    )
}

export default ProductionTab;
