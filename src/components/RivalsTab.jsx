import React, { useState } from 'react';
import { CONFIG } from '../config/gameConfig';
import { formatNumber, getBulkCost, getMaxAffordable } from '../utils/gameMath';
import BulkControl from './BulkControl';
import { useLanguage } from '../context/LanguageContext';
import TabHeader from './TabHeader';
import { useRivals } from '../hooks/useRivals';
import GlassCard from './ui/GlassCard';
import ActionButton from './ui/ActionButton';
import ResourceBar from './ui/ResourceBar';

const RivalsTab = ({ state, setState, addLog, ...props }) => {
    const { t } = useLanguage();
    // Defense Bulk Buy Logic
    const [buyAmount, setBuyAmount] = useState(1);

    const { buyDefense, findRival } = useRivals(state, setState, addLog);

    const { sabotageRival, raidRival, bribePolice, strikeRival } = props;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* HEADER */}
            <TabHeader
                title={t('rivals.title')}
                subtitle={t('rivals.subtitle')}
                icon="fa-solid fa-skull-crossbones"
                accentColor="danger"
                variant="contained"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT SIDE: SCANNER & RIVALS */}
                <div className="lg:col-span-12 space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* POLICE SCANNER (High-Tech Redesign) */}
                        <GlassCard className="relative overflow-hidden min-h-[400px] flex flex-col justify-between h-full p-6" variant="glass">
                            {/* High-tech background elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
                            <div className="absolute -right-4 top-4 opacity-5 text-blue-500 text-[12rem] pointer-events-none select-none">
                                <i className="fa-solid fa-tower-broadcast animate-pulse"></i>
                            </div>

                            <div className="relative z-10">
                                <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
                                    <div>
                                        <h3 className="text-blue-400 font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-3 mb-1">
                                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                                            {t('rivals.scanner.title')}
                                        </h3>
                                        <div className="text-2xl font-black text-theme-text-primary uppercase tracking-tight">{t('rivals.scanner.police')}</div>
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-500 w-full md:w-auto text-center
                                        ${state.heat > 80 ? 'bg-red-600/20 text-red-500 border-red-500/40 animate-pulse' : 'bg-blue-600/10 text-blue-400 border-blue-500/30'}`}>
                                        {state.heat > 80 ? t('rivals.scanner.status_raid') : t('rivals.scanner.status_active')}
                                    </div>
                                </div>

                                {/* PREMIUM HEAT METER */}
                                <div className="mb-10">
                                    <div className="flex justify-between items-end mb-3">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">{t('rivals.scanner.threat_level')}</span>
                                            <div className={`text-4xl font-mono font-black ${state.heat > 80 ? 'text-red-500' : state.heat > 50 ? 'text-amber-500' : 'text-blue-500'}`}>
                                                {Math.floor(state.heat)} <span className="text-lg text-zinc-600">/ {CONFIG.gameMechanics.maxHeat}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-bold text-theme-text-muted uppercase block mb-1">{t('rivals.scanner.status_label')}</span>
                                            <div className="text-xs font-bold text-theme-text-primary uppercase">
                                                {state.heat > 80 ? t('rivals.scanner.level.critical') : state.heat > 50 ? t('rivals.scanner.level.high') : t('rivals.scanner.level.safe')}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative h-6 w-full bg-theme-surface-elevated/50 rounded-full border border-theme-border-subtle p-1 overflow-hidden shadow-inner">
                                        <div className={`h-full rounded-full transition-all duration-700 relative shadow-[0_0_15px_rgba(59,130,246,0.3)]
                                            ${state.heat > 80 ? 'bg-gradient-to-r from-red-600 to-red-400 shadow-red-600/40' :
                                                state.heat > 50 ? 'bg-gradient-to-r from-amber-600 to-amber-400 shadow-amber-600/40' :
                                                    'bg-gradient-to-r from-blue-600 to-blue-400 shadow-blue-600/40'}`}
                                            style={{ width: `${Math.min(100, (state.heat / CONFIG.gameMechanics.maxHeat) * 100)}%` }}>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* BRIBE BUTTON */}
                            <div className="relative z-10 mt-auto">
                                <ActionButton
                                    onClick={bribePolice}
                                    disabled={state.dirtyCash < 50000 || state.heat <= 0}
                                    className="w-full !p-0 overflow-hidden group h-auto"
                                    variant="ghost"
                                >
                                    <div className="flex items-center justify-between w-full p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                                                <i className="fa-solid fa-money-bill-transfer text-xl"></i>
                                            </div>
                                            <div className="text-left">
                                                <div className="text-base font-black text-theme-text-primary uppercase tracking-tight">{t('rivals.actions.bribe')}</div>
                                                <div className="text-[10px] text-theme-text-muted font-medium font-mono">{t('rivals.actions.bribe_desc')}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[9px] font-bold text-zinc-500 uppercase mb-0.5">{t('rivals.cost')}</div>
                                            <div className="text-lg font-mono font-black text-amber-500">50k <span className="text-[10px]">kr</span></div>
                                        </div>
                                    </div>
                                </ActionButton>
                            </div>
                        </GlassCard>

                        {/* RIVAL OPS (Clean & Aggressive) */}
                        <GlassCard className="relative overflow-hidden min-h-[400px] flex flex-col justify-between h-full p-6" variant="danger">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>

                            <div className="relative z-10">
                                <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
                                    <div className="space-y-1 w-full md:w-auto">
                                        <h3 className="text-red-500 font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-3">
                                            <i className="fa-solid fa-user-secret"></i> {t('rivals.rival_syndicate')}
                                        </h3>
                                        {(() => {
                                            const activeRival = state.level < 4 ? { name: 'Lille A', desc: t('rival_profiles.lille_a') } :
                                                state.level < 8 ? { name: 'Baronen', desc: t('rival_profiles.baronen') } :
                                                    { name: 'Onkel J', desc: t('rival_profiles.onkel_j') };
                                            return (
                                                <>
                                                    <div className="text-3xl font-black text-theme-text-primary uppercase tracking-tighter italic">{activeRival.name}</div>
                                                    <p className="text-[10px] text-theme-text-muted mt-2 font-terminal leading-relaxed max-w-sm">{activeRival.desc}</p>
                                                </>
                                            );
                                        })()}
                                    </div>
                                    <div className="text-right w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-end p-3 md:p-0 bg-red-950/10 md:bg-transparent rounded border border-red-500/10 md:border-0">
                                        <div>
                                            <span className="text-[10px] font-black text-theme-text-muted uppercase tracking-widest block mb-1">{t('rivals.hostility')}</span>
                                            <div className="text-3xl md:text-4xl font-mono font-black text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.3)]">
                                                {state.rival.hostility.toFixed(1)}%
                                            </div>
                                        </div>
                                        <div className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-950/30 px-2 py-0.5 rounded mt-1 inline-block border border-emerald-500/20">
                                            <i className="fa-solid fa-heart-pulse mr-1"></i>
                                            +{CONFIG.boss.regenRate}/s
                                        </div>
                                    </div>
                                </div>

                                {/* RIVAL STRENGTH METER (NEW) */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{t('rivals.strength')}</span>
                                        <span className="text-sm font-mono font-black text-amber-500">{state.rival.strength.toFixed(1)}%</span>
                                    </div>
                                    <div className="h-2 bg-theme-surface-elevated/50 rounded-full overflow-hidden border border-theme-border-subtle">
                                        <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-700 shadow-[0_0_10px_rgba(251,191,36,0.4)]"
                                            style={{ width: `${state.rival.strength}%` }}>
                                        </div>
                                    </div>
                                </div>

                                {/* HOSTILITY BAR (NOW LABELED) */}
                                <div className="relative mb-8">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{t('rivals.hostility')}</span>
                                        <span className="text-sm font-mono font-black text-red-500">{state.rival.hostility.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-theme-surface-elevated/80 rounded-full overflow-hidden border border-theme-border-subtle shadow-inner p-px">
                                        <div className="h-full bg-gradient-to-r from-red-900 via-red-600 to-red-400 shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all duration-1000 relative"
                                            style={{ width: `${state.rival.hostility}%` }}>
                                            <div className="absolute top-0 right-0 h-full w-4 bg-white/20 blur-sm"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 relative z-10 mt-auto h-[72px]">
                                <ActionButton
                                    onClick={sabotageRival}
                                    disabled={state.cleanCash < 25000}
                                    className="group flex flex-col items-start justify-between h-full py-2 px-3"
                                    variant="ghost"
                                >
                                    <div className="text-[9px] text-amber-500/80 uppercase font-black tracking-widest">{t('rivals.actions.sabotage')}</div>
                                    <div className="text-sm font-black text-theme-text-primary uppercase leading-none">{t('rivals.actions.sabotage_desc')}</div>
                                    <div className="w-full flex justify-between items-center mt-auto text-[9px] font-bold">
                                        <span className="text-emerald-400">25k</span>
                                    </div>
                                </ActionButton>

                                <ActionButton
                                    onClick={raidRival}
                                    disabled={state.heat > 80}
                                    className="group flex flex-col items-start justify-between h-full py-2 px-3 !bg-red-950/20 !border-red-500/20 hover:!border-red-500/50"
                                    variant="danger"
                                >
                                    <div className="text-[9px] text-red-500 uppercase font-black tracking-widest">{t('rivals.actions.raid')}</div>
                                    <div className="text-sm font-black text-theme-text-primary uppercase leading-none">{t('rivals.actions.raid_desc')}</div>
                                    <div className="w-full flex justify-between items-center mt-auto text-[9px] font-bold">
                                        <span className="text-red-500 animate-pulse">Heat +++</span>
                                    </div>
                                </ActionButton>

                                <ActionButton
                                    onClick={strikeRival}
                                    disabled={state.cleanCash < 50000}
                                    className="group flex flex-col items-start justify-between h-full py-2 px-3 !bg-red-600/10 !border-red-600/30 hover:!border-red-600/60"
                                    variant="danger"
                                >
                                    <div className="text-[9px] text-red-500 uppercase font-black tracking-widest">{t('rivals.actions.war')}</div>
                                    <div className="text-sm font-black text-theme-text-primary uppercase leading-none">{t('rivals.actions.war_desc')}</div>
                                    <div className="w-full flex justify-between items-center mt-auto text-[9px] font-bold">
                                        <span className="text-emerald-400">50k</span>
                                    </div>
                                </ActionButton>
                            </div>
                        </GlassCard>
                    </div>

                    {/* MULTIPLAYER / GANG WARS (NEW) */}
                    <GlassCard className="relative overflow-hidden p-6 hover:border-purple-500/40 group">
                        {/* DEFENSE SYSTEMS (New Layout) */}
                        <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-black rounded-xl border border-white/5 p-6 relative overflow-hidden">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 relative z-10">
                                <div>
                                    <h3 className="text-2xl font-black text-theme-text-primary uppercase tracking-tighter flex items-center gap-3">
                                        <i className="fa-solid fa-shield-dog text-emerald-500"></i>
                                        {t('rivals.defense.title')}
                                    </h3>
                                    <p className="text-theme-text-muted text-sm mt-1">{t('rivals.defense.hq')}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-bold text-theme-text-muted uppercase block mb-1">{t('rivals.defense.total_value')}</span>
                                    <div className="text-3xl font-mono font-black text-emerald-500">
                                        {Object.entries(state.defense).reduce((acc, [key, count]) => acc + (count * CONFIG.defense[key].defenseVal), 0)}
                                        <span className="text-sm text-theme-text-secondary ml-2">{t('rivals.defense.points')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bulk Controls for Defense */}
                            <div className="flex justify-end mb-6">
                                <BulkControl buyAmount={buyAmount} setBuyAmount={setBuyAmount} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                                {Object.entries(CONFIG.defense).map(([id, item]) => {
                                    const count = state.defense[id] || 0;
                                    let actualAmount = buyAmount;

                                    if (buyAmount === 'max') {
                                        actualAmount = getMaxAffordable(item.baseCost, item.costFactor, count, state.cleanCash);
                                    }
                                    if (actualAmount <= 0) actualAmount = 1;

                                    const finalCost = getBulkCost(item.baseCost, item.costFactor, count, actualAmount);
                                    const canAfford = state.cleanCash >= finalCost;

                                    return (
                                        <GlassCard key={id} className="relative overflow-hidden p-4 group" variant="interactive">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-lg bg-emerald-900/20 text-emerald-500 flex items-center justify-center border border-emerald-500/20 text-xl group-hover:scale-110 transition-transform">
                                                        <i className={`fa-solid ${item.icon}`}></i>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white uppercase text-sm">{t(item.name)}</h4>
                                                        <div className="text-[10px] text-emerald-400 font-mono">+{item.defenseVal} {t('rivals.defense.points')}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-black text-white">{count}</div>
                                                    <div className="text-[9px] text-zinc-600 uppercase tracking-wider">{t('rivals.defense.active')}</div>
                                                </div>
                                            </div>

                                            <p className="text-[10px] text-zinc-500 mb-4 h-8 leading-tight">{t(item.desc)}</p>

                                            <ActionButton
                                                onClick={() => buyDefense(id, buyAmount)}
                                                disabled={!canAfford}
                                                className="w-full flex justify-between px-3 items-center"
                                                variant="neutral"
                                                size="sm"
                                            >
                                                <span className="font-bold uppercase tracking-wider group-hover:text-emerald-400 transition-colors">
                                                    {t('rivals.defense.buy')} ({actualAmount}x)
                                                </span>
                                                <span className="font-mono text-emerald-500/80 bg-black/50 px-2 py-0.5 rounded border border-emerald-500/20 text-[10px]">
                                                    {formatNumber(finalCost)} kr
                                                </span>
                                            </ActionButton>
                                        </GlassCard>
                                    );
                                })}
                            </div>
                        </div>

                        {/* TERRITORIES / CONTROL GRID */}
                        <div className="mt-8">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <h3 className="text-xl font-black text-theme-text-primary uppercase flex items-center gap-3">
                                        <i className="fa-solid fa-map-location-dot text-purple-400"></i>
                                        {t('rivals.grid.title')}
                                    </h3>
                                    <div className="text-[10px] font-bold text-theme-text-muted uppercase tracking-widest">
                                        {t('rivals.grid.dominance')}: {((state.territories?.length || 0) / CONFIG.territories.length * 100).toFixed(0)}%
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {CONFIG.territories.map((tData) => {
                                    const isOwned = state.territories?.includes(tData.id);
                                    const isRival = state.rival.occupiedTerritories?.includes(tData.id);
                                    const isLocked = state.level < tData.reqLevel;

                                    return (
                                        <div key={tData.id} className={`relative p-3 rounded-lg border transition-all duration-500 text-center flex flex-col items-center justify-between min-h-[100px]
                                        ${isOwned ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]' :
                                                isRival ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.1)]' :
                                                    isLocked ? 'bg-theme-surface-elevated border-theme-border-subtle opacity-50 grayscale' : 'bg-theme-surface-elevated border-theme-border-default'}`}>

                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 shadow-inner
                                            ${isOwned ? 'bg-indigo-500 text-white' :
                                                    isRival ? 'bg-red-600 text-white animate-pulse' :
                                                        'bg-theme-surface-base text-theme-text-secondary'}`}>
                                                <i className={`fa-solid ${isLocked ? 'fa-lock' : isRival ? 'fa-skull' : 'fa-city'} text-xs`}></i>
                                            </div>

                                            <div className="text-[9px] font-black text-theme-text-primary uppercase truncate w-full mb-1">{t(tData.name)}</div>

                                            <div className="mt-auto text-[8px] font-bold uppercase tracking-wider">
                                                {isLocked ? `Lvl ${tData.reqLevel}` :
                                                    isOwned ? <span className="text-indigo-400">{t('network.controlled')}</span> :
                                                        isRival ? <span className="text-red-500">{t('network.rival_occupation')}</span> :
                                                            <span className="text-theme-text-muted">-</span>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* GANG WARS (Multiplayer Lite) */}
                        <div className="bg-zinc-900/40 rounded-xl p-6 border border-white/5 relative overflow-hidden mt-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-black text-theme-text-primary uppercase flex items-center gap-3">
                                        <i className="fa-solid fa-users-crosshairs text-indigo-400"></i>
                                        {t('rivals.wars.title')}
                                        <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full tracking-widest">{t('rivals.wars.beta')}</span>
                                    </h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* CHALLENGE FRIEND */}
                                <div className="bg-black/30 p-5 rounded-xl border border-white/5">
                                    <h4 className="text-indigo-300 font-bold uppercase text-xs mb-2">{t('rivals.wars.challenge')}</h4>
                                    <p className="text-theme-text-muted text-[10px] mb-4 leading-relaxed">{t('rivals.wars.challenge_desc')}</p>
                                    <div className="flex gap-2">
                                        <div className="bg-theme-surface-elevated p-2 rounded border border-theme-border-default font-mono text-theme-text-primary text-xs flex-1 text-center select-all flex items-center justify-center">
                                            {state.syndicateId || "SYN-8291-XJ"}
                                        </div>
                                        <ActionButton
                                            size="sm"
                                            variant="primary"
                                            onClick={() => {
                                                const code = btoa(JSON.stringify({
                                                    n: t(`ranks.${(state.level || 1) - 1}`) || 'Gangster',
                                                    s: Math.min(100, 50 + ((state.level || 1) * 5)),
                                                    l: state.level || 1
                                                }));
                                                navigator.clipboard.writeText(code);
                                                addLog(`${t('rivals_interactive.wars.copy_success')}`, "success");
                                            }}
                                        >
                                            {t('rivals.wars.copy')}
                                        </ActionButton>
                                    </div>
                                </div>

                                {/* FIND RIVAL */}
                                <div className="bg-black/30 p-5 rounded-xl border border-white/5">
                                    <h4 className="text-indigo-300 font-bold uppercase text-xs mb-2">{t('rivals.wars.find')}</h4>
                                    <p className="text-theme-text-muted text-[10px] mb-4 leading-relaxed">{t('rivals.wars.find_desc')}</p>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            id="rivalCodeInput"
                                            placeholder="SYN-XXXX-XX"
                                            className="bg-theme-surface-elevated p-2 rounded border border-theme-border-default font-mono text-theme-text-primary text-xs flex-1 outline-none focus:border-indigo-500 transition-colors"
                                        />
                                        <ActionButton
                                            size="sm"
                                            variant="neutral"
                                            onClick={() => {
                                                const inputElement = document.getElementById('rivalCodeInput');
                                                if (inputElement) {
                                                    const success = findRival(inputElement.value);
                                                    if (success) inputElement.value = '';
                                                } else {
                                                    addLog(t('rivals_interactive.wars.error_input_not_found'), "error");
                                                }
                                            }}
                                        >
                                            {t('rivals.wars.search')}
                                        </ActionButton>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default RivalsTab;
