import React from 'react';
import { CONFIG } from '../config/gameConfig';
import { formatNumber, getBulkCost, getMaxAffordable } from '../utils/gameMath';
import Button from './Button';
import BulkControl from './BulkControl';

const NetworkTab = ({ state, setState, addLog }) => {
    // Phase 1: Territory Investments
    // Phase 2: Active Rival Ops
    const [buyAmount, setBuyAmount] = React.useState(1);
    const [now, setNow] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

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

    const defendTerritory = (territoryId) => {
        const attack = state.territoryAttacks?.[territoryId];
        if (!attack) return;

        const defenseVal = (state.defense.guards || 0) * CONFIG.defense.guards.defenseVal;
        const canDefendWithGuards = defenseVal >= attack.strength;
        const mercCost = 10000;

        if (canDefendWithGuards) {
            // Success
            setState(prev => {
                const newAttacks = { ...prev.territoryAttacks };
                delete newAttacks[territoryId];
                return {
                    ...prev,
                    territoryAttacks: newAttacks,
                    xp: prev.xp + 100 // Reward
                };
            });
            addLog(`Angreb afvist! Dine vagter holdt stand.`, 'success');
        } else {
            // Mercenaries
            if (state.dirtyCash >= mercCost) {
                setState(prev => {
                    const newAttacks = { ...prev.territoryAttacks };
                    delete newAttacks[territoryId];
                    return {
                        ...prev,
                        dirtyCash: prev.dirtyCash - mercCost,
                        territoryAttacks: newAttacks
                    };
                });
                addLog(`Lejesoldater nedkæmpede angriberne.`, 'success');
            } else {
                addLog("Du har ikke råd til lejesoldater, og dine vagter er for svage!", 'error');
            }
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
                <BulkControl buyAmount={buyAmount} setBuyAmount={setBuyAmount} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">



                {/* 2. TERRITORIER (Investments) */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {CONFIG.territories.map(t => {
                        const owned = state.territories.includes(t.id);
                        const locked = state.level < t.reqLevel;
                        const level = state.territoryLevels?.[t.id] || 1;

                        // SIEGE LOGIC
                        const attack = state.territoryAttacks?.[t.id];
                        const defenseVal = (state.defense.guards || 0) * CONFIG.defense.guards.defenseVal;
                        const canDefendWithGuards = attack && defenseVal >= attack.strength;

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

                        // OVERRIDE FOR ATTACK
                        const containerClass = attack
                            ? 'bg-red-950/30 border-red-500 animate-pulse'
                            : accentClass;

                        return (
                            <div
                                key={t.id}
                                className={`relative p-4 rounded-xl border transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[160px] hover:border-emerald-500/60 ${containerClass} ${locked ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                            >
                                {/* ATTACK OVERLAY */}
                                {attack && (
                                    <div className="absolute inset-0 z-20 bg-red-950/80 flex flex-col items-center justify-center p-4 text-center backdrop-blur-md animate-pulse border-2 border-red-500 rounded-xl">
                                        <div className="text-white font-black text-2xl mb-1 drop-shadow-md">⚠️ BELÆRING ⚠️</div>
                                        <div className="text-xs text-white/90 mb-4 font-mono">
                                            Fjendtlig Styrke: <span className="text-red-300 font-bold">{attack.strength}</span>
                                            <br />
                                            Dit Forsvar: <span className={canDefendWithGuards ? "text-emerald-300 font-bold" : "text-amber-300 font-bold"}>{defenseVal}</span>
                                        </div>
                                        <Button
                                            onClick={() => defendTerritory(t.id)}
                                            variant={canDefendWithGuards ? "primary" : "danger"}
                                            className="w-full shadow-[0_0_20px_rgba(239,68,68,0.6)] font-bold text-xs py-3"
                                        >
                                            {canDefendWithGuards ? `SEND VAGTER (WIN ${Math.floor((defenseVal / attack.strength) * 100)}%)` : "HYR LEJESOLDATER (10k)"}
                                        </Button>
                                        <div className="text-[10px] text-white/70 mt-2 font-mono bg-black/30 px-2 py-0.5 rounded">
                                            {/* PERK: Rival Insider (See Exact Timer) */}
                                            {(state.prestige?.perks?.rival_insider || 0) > 0 ? (
                                                <span className="text-purple-400 font-bold">INSIDER: {Math.max(0, Math.floor((attack.expiresAt - now) / 1000))}s</span>
                                            ) : (
                                                <span>⏱️ {Math.max(0, Math.floor((attack.expiresAt - now) / 1000))}s</span>
                                            )}
                                        </div>
                                    </div>
                                )}

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
                                    <Button
                                        onClick={() => conquer(t)}
                                        disabled={locked || !canAffordBuy}
                                        className="w-full py-2 text-[10px]"
                                        variant="neutral"
                                    >
                                        Køb ({formatNumber(t.baseCost)})
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => upgradeTerritory(t, actualAmount)}
                                        disabled={!canAffordUpgrade}
                                        className={`w-full py-2 text-[10px] flex justify-between px-4 ${isCleaner ? (canAffordUpgrade ? '!bg-emerald-900/40 !text-emerald-400 !border-emerald-500/30' : '') : (canAffordUpgrade ? '!bg-amber-900/40 !text-amber-400 !border-amber-500/30' : '')}`}
                                        variant="neutral"
                                    >
                                        <span className="flex items-center gap-1">
                                            Opgrader
                                            {buyAmount !== 1 && <span className="text-[9px] opacity-70">({actualAmount}x)</span>}
                                        </span>
                                        <span>{formatNumber(upgradeCost)} kr</span>
                                    </Button>
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
