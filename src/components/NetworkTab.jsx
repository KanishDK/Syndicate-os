import React from 'react';
import { CONFIG } from '../config/gameConfig';
import { formatNumber } from '../utils/gameMath';

const NetworkTab = ({ state, setState, addLog }) => {
    // Phase 1: Territory Investments
    // Phase 2: Active Rival Ops

    const conquer = (territory) => {
        if (state.dirtyCash < territory.baseCost) return;
        if (state.territories.includes(territory.id)) return;

        setState(prev => ({
            ...prev,
            dirtyCash: prev.dirtyCash - territory.baseCost,
            territories: [...prev.territories, territory.id],
            territoryLevels: { ...prev.territoryLevels, [territory.id]: 1 },
            xp: prev.xp + 250
        }));
        addLog(`Erobrede ${territory.name}!`, 'success');
    };

    const upgradeTerritory = (territory) => {
        const currentLevel = state.territoryLevels?.[territory.id] || 1;
        const upgradeCost = Math.floor(territory.baseCost * Math.pow(1.8, currentLevel));

        if (state.dirtyCash < upgradeCost) return;

        setState(prev => ({
            ...prev,
            dirtyCash: prev.dirtyCash - upgradeCost,
            territoryLevels: { ...prev.territoryLevels, [territory.id]: currentLevel + 1 }
        }));
        addLog(`Opgraderede ${territory.name} til Level ${currentLevel + 1}!`, 'success');
    };

    const sabotageRival = () => {
        const cost = 25000;
        if (state.cleanCash < cost) return;

        setState(prev => ({
            ...prev,
            cleanCash: prev.cleanCash - cost,
            rival: { ...prev.rival, hostility: Math.max(0, prev.rival.hostility - 25) }
        }));
        addLog("Sabotage udført! Rivalens operationer er forsinket.", 'success');
    };

    const raidRival = () => {
        if (state.heat > 80) {
            addLog("For varmt til at angribe! Vent til Heat falder.", 'error');
            return;
        }

        const successChance = 0.6;
        if (Math.random() < successChance) {
            const loot = 15000 + Math.floor(Math.random() * 35000);
            setState(prev => ({
                ...prev,
                dirtyCash: prev.dirtyCash + loot,
                heat: prev.heat + 15, // Heat spike
                rival: { ...prev.rival, hostility: prev.rival.hostility + 10 }
            }));
            addLog(`SUCCESS! Stjal ${formatNumber(loot)} kr fra Rivalen!`, 'success');
        } else {
            setState(prev => ({
                ...prev,
                heat: prev.heat + 25,
                rival: { ...prev.rival, hostility: prev.rival.hostility + 20 }
            }));
            addLog("RAZZIA FEJLEDE! Rivalen forsvarede sig. Heat steg!", 'error');
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex justify-between items-end">
                <h2 className="text-xl font-black uppercase tracking-tighter text-indigo-400 flex items-center gap-2">
                    <i className="fa-solid fa-map-location-dot"></i> Gaden & Territorier
                </h2>
                <div className="flex gap-4 text-[10px] font-mono text-zinc-500 bg-zinc-900/50 px-3 py-1 rounded-lg border border-white/5">
                    <span>EJET: <span className="text-white font-bold">{state.territories.length}</span></span>
                    <span>LEVELS: <span className="text-indigo-400 font-bold">{Object.values(state.territoryLevels || {}).reduce((a, b) => a + b, 0)}</span></span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">



                {/* 2. TERRITORIER (Investments) */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {CONFIG.territories.map(t => {
                        const owned = state.territories.includes(t.id);
                        const locked = state.level < t.reqLevel;
                        const level = state.territoryLevels?.[t.id] || 1;

                        // Cost Calc
                        const upgradeCost = Math.floor(t.baseCost * Math.pow(1.8, level));
                        const canAffordBuy = state.dirtyCash >= t.baseCost;
                        const canAffordUpgrade = state.dirtyCash >= upgradeCost;

                        // Income Calc
                        const income = Math.floor(t.income * Math.pow(1.5, level - 1));

                        const isCleaner = t.type === 'clean';
                        const accent = isCleaner ? 'emerald' : 'amber'; // Clean = Green, Dirty = Amber

                        return (
                            <div
                                key={t.id}
                                className={`
                                            relative p-4 rounded-xl border transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[160px]
                                            ${owned
                                        ? `bg-${accent}-950/10 border-${accent}-500/30`
                                        : locked
                                            ? 'bg-zinc-950/40 border-white/5 opacity-40 grayscale'
                                            : 'bg-zinc-900/50 border-white/5'
                                    }
                                        `}
                            >
                                {/* HEADER */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${owned ? `bg-${accent}-500/10 text-${accent}-400` : 'bg-black/30 text-zinc-600'}`}>
                                            <i className={`fa-solid ${isCleaner ? 'fa-building-columns' : 'fa-house-chimney-crack'}`}></i>
                                        </div>
                                        <div>
                                            <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
                                                {owned ? `Level ${level}` : `Requires Lvl ${t.reqLevel}`}
                                            </div>
                                            <h4 className={`font-black uppercase text-sm ${owned ? 'text-white' : 'text-zinc-400'}`}>{t.name}</h4>
                                        </div>
                                    </div>
                                </div>

                                {/* STATS */}
                                <div className="bg-black/20 p-2 rounded border border-white/5 flex items-center justify-between mb-4">
                                    <span className="text-[9px] text-zinc-500 uppercase">Indtægt</span>
                                    <div className="text-right">
                                        <div className={`font-mono text-sm font-bold ${isCleaner ? 'text-emerald-400' : 'text-amber-400'}`}>
                                            +{formatNumber(income)}/s
                                        </div>
                                        {owned && (
                                            <div className="text-[8px] text-zinc-500">
                                                Next: {formatNumber(Math.floor(t.income * Math.pow(1.5, level)))}/s
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* ACTION */}
                                {!owned ? (
                                    <button
                                        onClick={() => conquer(t)}
                                        disabled={locked || !canAffordBuy}
                                        className={`w-full py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${canAffordBuy && !locked ? 'bg-white text-black hover:bg-zinc-200' : 'bg-zinc-800 text-zinc-600'}`}
                                    >
                                        Køb ({formatNumber(t.baseCost)})
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => upgradeTerritory(t)}
                                        disabled={!canAffordUpgrade}
                                        className={`w-full py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex justify-between px-4 ${canAffordUpgrade ? `bg-${accent}-900/40 text-${accent}-400 border border-${accent}-500/30 hover:bg-${accent}-900/60` : 'bg-zinc-800 text-zinc-600 border border-white/5'}`}
                                    >
                                        <span>Opgrader</span>
                                        <span>{formatNumber(upgradeCost)} kr</span>
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default NetworkTab;
