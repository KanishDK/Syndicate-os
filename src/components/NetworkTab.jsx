import React from 'react';
import { CONFIG } from '../config/gameConfig';
import { formatNumber, getBulkCost, getMaxAffordable } from '../utils/gameMath';

const NetworkTab = ({ state, setState, addLog }) => {
    // Phase 1: Territory Investments
    // Phase 2: Active Rival Ops
    const [buyAmount, setBuyAmount] = React.useState(1);

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

    const upgradeTerritory = (territory, amount) => {
        const currentLevel = state.territoryLevels?.[territory.id] || 1;
        const totalCost = getBulkCost(territory.baseCost, 1.8, currentLevel, amount);

        if (state.dirtyCash < totalCost) return;

        setState(prev => ({
            ...prev,
            dirtyCash: prev.dirtyCash - totalCost,
            territoryLevels: { ...prev.territoryLevels, [territory.id]: currentLevel + amount }
        }));
        addLog(`Opgraderede ${territory.name} +${amount} Levels!`, 'success');
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
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h2 className="text-xl font-black uppercase tracking-tighter text-indigo-400 flex items-center gap-2">
                        <i className="fa-solid fa-map-location-dot"></i> Gaden & Territorier
                    </h2>
                    <div className="flex gap-4 text-[10px] font-mono text-zinc-500 bg-zinc-900/50 px-3 py-1 rounded-lg border border-white/5 mt-2 inline-flex">
                        <span>EJET: <span className="text-white font-bold">{state.territories.length}</span></span>
                        <span>LEVELS: <span className="text-indigo-400 font-bold">{Object.values(state.territoryLevels || {}).reduce((a, b) => a + b, 0)}</span></span>
                    </div>
                </div>

                {/* BULK TOGGLE */}
                <div className="flex bg-black/40 rounded-lg p-0.5 border border-white/10">
                    <button onClick={() => setBuyAmount(1)} className={`w-8 h-8 flex items-center justify-center rounded font-black text-xs transition-all ${buyAmount === 1 ? 'bg-zinc-700 text-white' : 'text-zinc-500 active:text-zinc-300'}`}>1x</button>
                    <button onClick={() => setBuyAmount(10)} className={`w-8 h-8 flex items-center justify-center rounded font-black text-xs transition-all ${buyAmount === 10 ? 'bg-zinc-700 text-white' : 'text-zinc-500 active:text-zinc-300'}`}>10x</button>
                    <button onClick={() => setBuyAmount('max')} className={`w-10 h-8 flex items-center justify-center rounded font-black text-[10px] uppercase transition-all ${buyAmount === 'max' ? 'bg-zinc-700 text-white' : 'text-zinc-500 active:text-zinc-300'}`}>Max</button>
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
                        let actualAmount = buyAmount;
                        if (buyAmount === 'max') {
                            actualAmount = getMaxAffordable(t.baseCost, 1.8, level, state.dirtyCash);
                        }
                        if (actualAmount <= 0) actualAmount = 1;

                        const upgradeCost = getBulkCost(t.baseCost, 1.8, level, actualAmount);
                        const canAffordBuy = state.dirtyCash >= t.baseCost;
                        const canAffordUpgrade = state.dirtyCash >= upgradeCost && (buyAmount !== 'max' || actualAmount > 0);

                        // Income Calc
                        const income = Math.floor(t.income * Math.pow(1.5, level - 1));

                        const isCleaner = t.type === 'clean';
                        const accentClass = isCleaner
                            ? (owned ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-zinc-900/50 border-white/5')
                            : (owned ? 'bg-amber-950/20 border-amber-500/30' : 'bg-zinc-900/50 border-white/5');

                        const iconBgClass = isCleaner
                            ? (owned ? 'bg-emerald-500/10 text-emerald-400' : 'bg-black/30 text-zinc-600')
                            : (owned ? 'bg-amber-500/10 text-amber-400' : 'bg-black/30 text-zinc-600');

                        const upgradeBtnClass = isCleaner
                            ? (canAffordUpgrade ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/30 active:bg-emerald-900/60' : 'bg-zinc-800 text-zinc-600 border border-white/5')
                            : (canAffordUpgrade ? 'bg-amber-900/40 text-amber-400 border border-amber-500/30 active:bg-amber-900/60' : 'bg-zinc-800 text-zinc-600 border border-white/5');

                        return (
                            <div
                                key={t.id}
                                className={`relative p-4 rounded-xl border transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[160px] ${accentClass} ${locked ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                            >
                                {/* HEADER */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${iconBgClass}`}>
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
                                                Next: {formatNumber(Math.floor(t.income * Math.pow(1.5, level + actualAmount - 1)))}/s
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* ACTION */}
                                {!owned ? (
                                    <button
                                        onClick={() => conquer(t)}
                                        disabled={locked || !canAffordBuy}
                                        className={`w-full py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 ${canAffordBuy && !locked ? 'bg-white text-black active:bg-zinc-200' : 'bg-zinc-800 text-zinc-600'}`}
                                    >
                                        Køb ({formatNumber(t.baseCost)})
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => upgradeTerritory(t, actualAmount)}
                                        disabled={!canAffordUpgrade}
                                        className={`w-full py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex justify-between px-4 active:scale-95 ${upgradeBtnClass}`}
                                    >
                                        <span className="flex items-center gap-1">
                                            Opgrader
                                            {buyAmount !== 1 && <span className="text-[9px] opacity-70">({actualAmount}x)</span>}
                                        </span>
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
