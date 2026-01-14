import React from 'react';
import { CONFIG } from '../config/gameConfig';
import { formatNumber, getBulkCost, getMaxAffordable } from '../utils/gameMath';
import Button from './Button';
import BulkControl from './BulkControl';
import { useLanguage } from '../context/LanguageContext';
import TabHeader from './TabHeader';
import { useNetwork } from '../hooks/useNetwork';

const NetworkTab = ({ state, setState, addLog, addFloat, liberateTerritory }) => {
    // Phase 1: Territory Investments
    // Phase 2: Active Rival Ops
    const [buyAmount, setBuyAmount] = React.useState(1);
    const [expandedTerritory, setExpandedTerritory] = React.useState(null); // Click to Expand ID
    const { t } = useLanguage();

    // Use Custom Hook for Logic
    const {
        activeShakedown,
        now,
        conquer,
        upgradeTerritory,
        defendTerritory,
        performStreetOp,
        handleShakedown,
        specializeTerritory
    } = useNetwork(state, setState, addLog, addFloat);

    // Helper: District Status
    const getDistrictStatus = (districtKey) => {
        if (!districtKey || !CONFIG.districts?.[districtKey]) return null;
        const district = CONFIG.districts[districtKey];
        const ownedCount = district.req.filter(id => state.territories.includes(id)).length;
        const total = district.req.length;
        const isComplete = ownedCount === total;
        return { ...district, ownedCount, total, isComplete };
    };

    // Helper: Group Territories
    const groupedTerritories = CONFIG.territories.reduce((acc, t) => {
        const d = t.district || 'other';
        if (!acc[d]) acc[d] = [];
        acc[d].push(t);
        return acc;
    }, {});

    // Sort Keys: Groups defined in districts first, then others
    const districtKeys = ['nørrebro', 'city', 'vestegnen', ...Object.keys(groupedTerritories).filter(k => !['nørrebro', 'city', 'vestegnen'].includes(k))];

    // Dynamic Atmosphere: High Heat Warning
    const isHighHeat = (state.heat || 0) > 80;

    // Derived stats for header
    const ownedCount = state.territories.length;
    const totalCount = CONFIG.territories.length;
    // Calculate total income from territories
    const income = React.useMemo(() => {
        let clean = 0;
        let dirty = 0;
        CONFIG.territories.forEach(t => {
            if (state.territories.includes(t.id)) {
                const level = state.territoryLevels?.[t.id] || 1;
                const levelMult = Math.pow(1.5, level - 1);
                const inc = t.income * levelMult * (state.prestige?.multiplier || 1);
                if (t.type === 'clean') clean += inc;
                else dirty += inc;
            }
        });
        return { clean, dirty };
    }, [state.territories, state.territoryLevels, state.prestige]);


    return (
        <div className={`max-w-6xl mx-auto space-y-8 pb-32 transition-colors duration-1000 ${isHighHeat ? 'shadow-[inset_0_0_100px_rgba(220,38,38,0.2)]' : ''}`}>

            {/* --- HEADER SECTION --- */}
            <TabHeader
                title={t('network.title')}
                subtitle={t('network.subtitle')}
                icon="fa-solid fa-network-wired"
                accentColor="primary"
                variant="contained"
            >
                <div className="flex items-center gap-4 bg-black/30 p-3 rounded-xl border border-theme-border-subtle backdrop-blur-sm">
                    <div className="text-right">
                        <div className="text-[10px] text-theme-text-muted uppercase tracking-widest font-bold">{t('network.total_income')}</div>
                        <div className="text-xl font-mono font-bold text-theme-success drop-shadow-sm number-ticker">
                            {formatNumber(income.dirty)} <span className="text-xs text-theme-text-muted">kr/s</span>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-theme-border-default"></div>
                    <div className="text-right">
                        <div className="text-[10px] text-theme-text-muted uppercase tracking-widest font-bold">{t('network.owned')}</div>
                        <div className="text-xl font-mono font-bold text-theme-primary drop-shadow-sm">
                            {ownedCount} <span className="text-theme-text-muted">/</span> {totalCount}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-black/40 p-2 pr-4 rounded-full border border-white/10">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/30 text-amber-400 relative shrink-0">
                        <i className="fa-solid fa-crown text-sm"></i>
                        {(state.kingpinTokens || 0) > 0 && (
                            <div className="absolute -top-1 -right-1 bg-white text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-lg animate-bounce">
                                {state.kingpinTokens}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col min-w-[140px]">
                        <div className="flex justify-between text-[9px] uppercase font-bold text-theme-text-muted mb-0.5">
                            <span>{t('network.respect')}</span>
                            <span className={state.kingpinTokens > 0 ? "text-theme-warning" : "text-theme-accent"}>{(state.respect || 0).toFixed(0)}%</span>
                        </div>
                        <div className="h-1.5 bg-theme-surface-base rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-theme-primary via-theme-secondary to-theme-accent"
                                style={{ width: `${(state.respect || 0)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                <BulkControl buyAmount={buyAmount} setBuyAmount={setBuyAmount} />
            </TabHeader>
            {/* FEATURE 3: STREET OPS DASHBOARD */}
            <div className="grid grid-cols-4 gap-2 p-3 bg-theme-surface-elevated/40 rounded-xl border border-theme-border-subtle">
                <Button onClick={() => performStreetOp('drive_by')} variant="danger" className="flex flex-col gap-1 py-4 !text-[10px]">
                    <i className="fa-solid fa-car-side text-lg"></i>
                    <span>{t('network_interactive.actions.drive_by') || t('network.ops.drive_by')}</span>
                </Button>
                <Button onClick={() => performStreetOp('bribe')} variant="neutral" className="flex flex-col gap-1 py-4 !text-[10px] !border-theme-warning/30 !text-theme-warning">
                    <i className="fa-solid fa-handshake-simple text-lg"></i>
                    <span>{t('network_interactive.actions.bribe') || t('network.ops.bribe')}</span>
                </Button>
                <Button onClick={() => performStreetOp('stash_raid')} variant="neutral" className="flex flex-col gap-1 py-4 !text-[10px] !border-theme-success/30 !text-theme-success">
                    <i className="fa-solid fa-sack-dollar text-lg"></i>
                    <span>{t('network_interactive.actions.raid') || t('network.ops.raid')}</span>
                </Button>
                <Button
                    onClick={() => performStreetOp('heat_wipe')}
                    disabled={(state.kingpinTokens || 0) < 1}
                    variant="neutral"
                    className={`flex flex-col gap-1 py-4 !text-[10px] relative overflow-hidden transition-all duration-300 ${(state.kingpinTokens || 0) >= 1 ? '!border-theme-accent !text-theme-accent shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'opacity-50 grayscale'}`}
                >
                    {(state.kingpinTokens || 0) >= 1 && <div className="absolute inset-0 bg-theme-accent/10 animate-pulse"></div>}
                    <i className="fa-solid fa-temperature-arrow-down text-lg"></i>
                    <span>{t('network_interactive.actions.heat_wipe') || t('network.ops.heat_wipe')}</span>
                </Button>
            </div >

            <div className="space-y-8">
                {districtKeys.map(dKey => {
                    const territories = groupedTerritories[dKey];
                    if (!territories) return null;
                    const status = getDistrictStatus(dKey);

                    return (
                        <div key={dKey} className="space-y-4">
                            {/* DISTRICT HEADER */}
                            <div className="flex items-center justify-between border-b border-theme-border-subtle pb-2">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-theme-text-muted">
                                        {status ? status.name : (dKey === 'elite' ? t('network.districts.elite') : t('network.districts.other'))}
                                    </h3>
                                    {status && (
                                        <div className={`text-[10px] font-mono px-2 py-0.5 rounded border ${status.isComplete ? 'bg-theme-success/20 border-theme-success text-theme-success animate-pulse' : 'bg-theme-surface-base/30 border-theme-border-subtle text-theme-text-secondary'}`}>
                                            {status.isComplete ? t('network.bonus_active') : `${status.ownedCount}/${status.total}`}
                                        </div>
                                    )}
                                </div>
                                {status && (
                                    <div className={`text-[10px] font-mono ${status.isComplete ? 'text-theme-success font-bold' : 'text-theme-text-secondary'}`}>
                                        {t('network.set_bonus')}: {status.bonus}
                                    </div>
                                )}
                            </div>

                            {/* TERRITORY GRID */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {territories.map(tData => {
                                    const owned = state.territories.includes(tData.id);
                                    const locked = state.level < tData.reqLevel;
                                    const level = state.territoryLevels?.[tData.id] || 1;

                                    // SPECIALIZATION LOGIC (Feature 2)
                                    const specialization = state.territorySpecs?.[tData.id];

                                    // SIEGE LOGIC
                                    const attack = state.territoryAttacks?.[tData.id];
                                    const defenseVal = (state.defense.guards || 0) * CONFIG.defense.guards.defenseVal;
                                    const canDefendWithGuards = attack && defenseVal >= attack.strength;

                                    // Cost Calc
                                    let actualAmount = buyAmount;
                                    if (buyAmount === 'max') {
                                        actualAmount = getMaxAffordable(tData.baseCost, 1.8, level, state.dirtyCash);
                                    }
                                    if (actualAmount <= 0) actualAmount = 1;

                                    const upgradeCost = getBulkCost(tData.baseCost, 1.8, level, actualAmount);
                                    const canAffordBuy = state.dirtyCash >= tData.baseCost;
                                    const canAffordUpgrade = state.dirtyCash >= upgradeCost && (buyAmount !== 'max' || actualAmount > 0);

                                    // Income Calc
                                    const income = Math.floor(tData.income * Math.pow(1.5, level - 1));

                                    const isCleaner = tData.type === 'clean';
                                    const accentClass = isCleaner
                                        ? (owned ? 'bg-theme-success/10 border-theme-success/30' : 'bg-theme-surface-elevated/50 border-theme-border-subtle')
                                        : (owned ? 'bg-theme-warning/10 border-theme-warning/30' : 'bg-theme-surface-elevated/50 border-theme-border-subtle');

                                    const iconBgClass = isCleaner
                                        ? (owned ? 'bg-theme-success/10 text-theme-success' : 'bg-black/30 text-theme-text-muted')
                                        : (owned ? 'bg-theme-warning/10 text-theme-warning' : 'bg-black/30 text-theme-text-muted');

                                    // OVERRIDE FOR ATTACK
                                    const containerClass = attack
                                        ? 'bg-theme-danger/30 border-theme-danger animate-pulse'
                                        : accentClass;

                                    const isRivalOccupied = state.rival?.occupiedTerritories?.includes(tData.id);

                                    // FEATURE 4: SHAKEDOWN ACTIVE?
                                    const isShakedownActive = activeShakedown && activeShakedown.id === tData.id;

                                    return (
                                        <div
                                            key={tData.id}
                                            onClick={() => owned && !isRivalOccupied && setExpandedTerritory(expandedTerritory === tData.id ? null : tData.id)}
                                            className={`relative p-4 rounded-xl border transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[160px] cursor-pointer group active:scale-[0.98] card-interactive ${containerClass} ${locked ? 'opacity-40 grayscale pointer-events-none' : ''} ${expandedTerritory === tData.id ? 'ring-1 ring-theme-accent shadow-[0_0_20px_rgba(99,102,241,0.15)] z-10' : ''} ${isRivalOccupied ? 'border-theme-danger/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : ''}`}
                                        >
                                            {/* Ambient Shine Effect on Hover */}
                                            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                                            {/* FEATURE 4: SHAKEDOWN OVERLAY */}
                                            {isShakedownActive && (
                                                <div
                                                    className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center animate-in fade-in zoom-in duration-200 cursor-pointer"
                                                    onClick={(e) => { e.stopPropagation(); handleShakedown(tData.id, income); }}
                                                >
                                                    <div className="flex flex-col items-center animate-bounce-short relative">
                                                        <div className="absolute -inset-4 bg-yellow-500/20 blur-xl rounded-full animate-pulse"></div>
                                                        <div className="text-4xl drop-shadow-[0_0_15px_rgba(250,204,21,0.8)] relative z-10">💰</div>
                                                        <div className="bg-yellow-500 text-black font-black text-[10px] px-3 py-1 rounded-full mt-2 uppercase tracking-wide border border-white/20 shadow-lg relative z-10">
                                                            {t('network_interactive.overlay.shakedown')}
                                                        </div>
                                                        <div className="text-[9px] text-yellow-100 font-mono mt-1 relative z-10 bg-black/50 px-2 rounded">
                                                            {(activeShakedown.expires - now) > 0 ? ((activeShakedown.expires - now) / 1000).toFixed(1) + 's' : '0s'}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* ATTACK OVERLAY */}
                                            {attack && !isRivalOccupied && (
                                                <div className="absolute inset-0 z-20 bg-theme-surface-overlay backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center animate-pulse border border-theme-danger/50 rounded-xl">
                                                    <div className="text-theme-text-primary font-black text-xl mb-1 drop-shadow-md tracking-tighter uppercase">{t('network_interactive.overlay.attack')}</div>
                                                    <div className="text-xs text-theme-text-primary/90 mb-3 font-mono leading-tight">
                                                        {t('network_interactive.overlay.strength')}: <span className="text-theme-danger font-bold">{attack.strength}</span> vs <span className={canDefendWithGuards ? "text-theme-success font-bold" : "text-theme-warning font-bold"}>{defenseVal}</span>
                                                    </div>
                                                    <Button
                                                        onClick={(e) => { e.stopPropagation(); defendTerritory(tData.id); }}
                                                        variant={canDefendWithGuards ? "primary" : "danger"}
                                                        className="w-full shadow-[0_0_20px_rgba(239,68,68,0.4)] font-bold !text-[10px] py-2"
                                                    >
                                                        {canDefendWithGuards ? t('network_interactive.overlay.defend_safe') : t('network_interactive.overlay.defend_merc')}
                                                    </Button>
                                                </div>
                                            )}

                                            {/* RIVAL OCCUPATION OVERLAY */}
                                            {isRivalOccupied && (
                                                <div className="absolute inset-0 bg-theme-danger/20 z-20 flex flex-col items-center justify-center p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-300 border border-theme-danger/50 rounded-xl">
                                                    <i className="fa-solid fa-skull text-theme-danger text-3xl mb-2 animate-pulse"></i>
                                                    <div className="text-white font-black uppercase tracking-widest text-[9px] text-center mb-3">
                                                        {t('network_interactive.overlay.rival_occ')}
                                                    </div>
                                                    <Button
                                                        onClick={(e) => { e.stopPropagation(); liberateTerritory(tData.id); }}
                                                        variant="danger"
                                                        className="w-full text-[10px] font-bold py-2 shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                                                    >
                                                        {t('network_interactive.overlay.liberate')}
                                                    </Button>
                                                </div>
                                            )}

                                            {/* HEADER */}
                                            <div className="flex justify-between items-start mb-4 relative z-0">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${iconBgClass} shadow-inner`}>
                                                        <i className={`fa-solid ${isCleaner ? 'fa-building-columns' : 'fa-house-chimney-crack'}`}></i>
                                                    </div>
                                                    <div>
                                                        <div className="text-[9px] text-theme-text-muted font-bold uppercase tracking-wider">
                                                            {owned ? `Level ${level}` : `Lvl ${tData.reqLevel}+`}
                                                        </div>
                                                        <h4 className={`font-black uppercase text-sm leading-tight ${owned ? 'text-theme-text-primary' : 'text-theme-text-muted'}`}>{tData.name}</h4>
                                                    </div>
                                                </div>
                                                {owned && (
                                                    <div className={`text-[10px] w-5 h-5 flex items-center justify-center rounded-full transition-colors ${expandedTerritory === tData.id ? 'bg-theme-accent text-theme-text-inverse' : 'bg-theme-surface-base/10 text-theme-text-muted'}`}>
                                                        <i className={`fa-solid fa-chevron-${expandedTerritory === tData.id ? 'up' : 'down'}`}></i>
                                                    </div>
                                                )}
                                            </div>

                                            {/* SPECIALIZATION UI (Feature 2) */}
                                            {owned && level >= 5 && (
                                                <div className="mb-4">
                                                    {!specialization ? (
                                                        expandedTerritory === tData.id && (
                                                            <div className="bg-theme-accent/10 border border-theme-accent/20 p-2 rounded relative overflow-hidden group/spec animate-in fade-in slide-in-from-top-2">
                                                                <div className="text-[9px] text-theme-accent uppercase font-bold mb-1.5 flex justify-between items-center">
                                                                    <span className="tracking-wider">{t('network_interactive.actions.select_special')}</span>
                                                                    <i className="fa-solid fa-star text-theme-accent animate-spin-slow text-[8px]"></i>
                                                                </div>
                                                                <div className="grid grid-cols-3 gap-1">
                                                                    <Button onClick={(e) => { e.stopPropagation(); specializeTerritory(tData.id, 'safe'); }} size="xs" variant="ghost" className="!text-[8px] flex flex-col gap-1 h-auto py-2 border border-theme-accent/10 hover:bg-theme-accent/20 hover:border-theme-accent/40">
                                                                        <i className="fa-solid fa-shield-halved"></i> Safe
                                                                    </Button>
                                                                    <Button onClick={(e) => { e.stopPropagation(); specializeTerritory(tData.id, 'front'); }} size="xs" variant="ghost" className="!text-[8px] flex flex-col gap-1 h-auto py-2 border border-theme-accent/10 hover:bg-theme-accent/20 hover:border-theme-accent/40">
                                                                        <i className="fa-solid fa-shop"></i> Front
                                                                    </Button>
                                                                    <Button onClick={(e) => { e.stopPropagation(); specializeTerritory(tData.id, 'storage'); }} size="xs" variant="ghost" className="!text-[8px] flex flex-col gap-1 h-auto py-2 border border-theme-accent/10 hover:bg-theme-accent/20 hover:border-theme-accent/40">
                                                                        <i className="fa-solid fa-box"></i> Lager
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )
                                                    ) : (
                                                        <div className="flex items-center gap-2 p-2 rounded bg-theme-surface-base/30 border border-theme-border-subtle">
                                                            <div className="w-6 h-6 rounded bg-theme-accent/20 flex items-center justify-center text-theme-accent text-xs">
                                                                <i className={`fa-solid ${specialization === 'safe' ? 'fa-shield-halved' : specialization === 'front' ? 'fa-shop' : 'fa-box'}`}></i>
                                                            </div>
                                                            <div>
                                                                <div className="text-[8px] text-theme-text-muted uppercase font-bold tracking-wider">{t('network.specialization')}</div>
                                                                <div className="text-[10px] text-theme-accent font-bold capitalize">{specialization}</div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* STATS (EXPANDABLE) */}
                                            <div className={`transition-all duration-300 overflow-hidden ${expandedTerritory === tData.id ? 'max-h-[300px] mb-4' : 'max-h-[36px] mb-4'}`}>
                                                <div className="p-2 rounded border border-theme-border-subtle bg-black/20 flex items-center justify-between">
                                                    <span className="text-[9px] text-theme-text-muted uppercase tracking-wide">{expandedTerritory === tData.id ? t('network_interactive.stats.income') : 'INDTÆGT'}</span>
                                                    <div className={`font-mono text-sm font-bold ${isCleaner ? 'text-theme-success' : 'text-theme-warning'}`}>
                                                        +{formatNumber(income)}
                                                    </div>
                                                </div>

                                                {expandedTerritory === tData.id && (
                                                    <div className="mt-2 space-y-1 p-2 bg-theme-surface-base/5 rounded border border-theme-border-subtle animate-in fade-in slide-in-from-top-1">
                                                        <div className="flex justify-between text-[10px]">
                                                            <span className="text-theme-text-muted">{t('network_interactive.stats.base')}</span>
                                                            <span className="text-theme-text-secondary font-mono">{formatNumber(tData.income)}</span>
                                                        </div>
                                                        <div className="flex justify-between text-[10px]">
                                                            <span className="text-theme-text-muted">{t('network_interactive.stats.mult')}</span>
                                                            <span className="text-theme-accent font-mono">x{Math.pow(1.5, level - 1).toFixed(1)}</span>
                                                        </div>
                                                        <div className="flex justify-between text-[10px] border-t border-theme-border-subtle pt-1 mt-1">
                                                            <span className="text-theme-text-muted">{t('network_interactive.stats.next')}</span>
                                                            <span className="text-theme-success font-mono">+{formatNumber(Math.floor(tData.income * Math.pow(1.5, level + actualAmount - 1)))}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* ACTION BUTTON */}
                                            <div onClick={(e) => e.stopPropagation()} className="relative z-10">
                                                {!owned ? (
                                                    <Button
                                                        onClick={() => conquer(tData)}
                                                        disabled={locked || !canAffordBuy}
                                                        className="w-full py-2.5 text-[10px] uppercase tracking-wider font-bold"
                                                        variant="neutral"
                                                    >
                                                        {t('network_interactive.actions.buy_area')} ({formatNumber(tData.baseCost)})
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        onClick={() => upgradeTerritory(tData, actualAmount)}
                                                        disabled={!canAffordUpgrade}
                                                        className={`w-full py-2 text-[10px] flex justify-between px-3 items-center group/btn transition-all duration-200 ${isCleaner ? (canAffordUpgrade ? '!bg-theme-success/10 !text-theme-success !border-theme-success/50 hover:!bg-theme-success/20' : '') : (canAffordUpgrade ? '!bg-theme-warning/10 !text-theme-warning !border-theme-warning/50 hover:!bg-theme-warning/20' : '')}`}
                                                        variant="neutral"
                                                    >
                                                        <div className="flex flex-col items-start leading-none">
                                                            <span className="font-bold">{t('network_interactive.actions.upgrade')}</span>
                                                            {buyAmount !== 1 && <span className="text-[8px] opacity-70 mt-0.5">{actualAmount}x Levels</span>}
                                                        </div>
                                                        <span className="font-mono bg-black/30 px-1.5 py-0.5 rounded text-[9px] group-hover/btn:bg-black/50 transition-colors">
                                                            {formatNumber(upgradeCost)}
                                                        </span>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}


            </div>
        </div >
    );
};

export default NetworkTab;
