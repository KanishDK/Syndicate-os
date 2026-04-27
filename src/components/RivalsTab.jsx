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
import politiImg from '../assets/characters/Politiet.png'; // Static Import
import rivalLittleA from '../assets/characters/rival_little_a.png';
import rivalBaron from '../assets/characters/rival_baron.png';
import rivalUncleJ from '../assets/characters/rival_uncle_j.png';

const RivalsTab = ({ state, setState, addLog, ...props }) => {
    const { t } = useLanguage();

    const { findRival } = useRivals(state, setState, addLog);

    const { sabotageRival, raidRival, bribePolice, strikeRival, launchCartelAssault } = props;

    return (
        <div className="max-w-7xl mx-auto pb-4 relative">
            {/* HEADER REPLACEMENT (SANDBOX STYLE) */}
            <div className="bg-black/40 backdrop-blur-xl pt-2 pb-6 border-b border-white/10 -mx-4 px-6 shadow-2xl rounded-t-3xl mb-8">
                <div className="flex flex-col">
                    <span className="text-[9px] font-mono text-red-500/40 tracking-[0.4em] uppercase mb-1">THREAT_ASSESSMENT_CORE</span>
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                        <i className="fa-solid fa-skull-crossbones text-red-500"></i> {t('rivals.title')}
                    </h2>
                </div>
            </div>

            <div className="p-1">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* LEFT SIDE: SCANNER & RIVALS */}
                    <div className="lg:col-span-12 space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* POLICE SCANNER (High-Tech Redesign) */}
                            <GlassCard className="relative overflow-hidden min-h-[400px] flex flex-col justify-between h-full p-6" variant="glass">
                                {/* High-tech background elements */}
                                <div className="absolute top-0 right-0 w-full h-full opacity-60 z-0 pointer-events-none">
                                    <img
                                        src={politiImg}
                                        className="w-full h-full object-cover object-top opacity-100 grayscale contrast-125"
                                        alt="Police Scanner"
                                    />
                                </div>
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
                                <div className="absolute -right-4 top-4 opacity-5 text-blue-500 text-[12rem] pointer-events-none select-none">
                                    <i className="fa-solid fa-tower-broadcast animate-pulse"></i>
                                </div>

                                <div className="relative z-10">
                                    <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
                                        <div>
                                            <h3 className="text-cyan-400 font-black uppercase tracking-[0.3em] text-[10px] flex items-center gap-3 mb-1.5 underline underline-offset-4 decoration-cyan-400/30">
                                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.5)]"></span>
                                                {t('rivals.scanner.title')}
                                            </h3>
                                            <div className="text-3xl font-black text-white italic uppercase tracking-tight drop-shadow-md">{t('rivals.scanner.police')}</div>
                                        </div>
                                        <div className={`px-5 py-2 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] border transition-all duration-500 w-full md:w-auto text-center
                                        ${state.heat > 80 ? 'bg-red-500/20 text-red-500 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.2)] animate-pulse' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'}`}>
                                            {state.heat > 80 ? 'CRITICAL_ALERT' : 'READY_OPERATIONAL'}
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

                                        <div className="relative h-6 w-full bg-black/40 rounded-sm border border-white/10 p-1 overflow-hidden">
                                            <div className={`h-full transition-all duration-1000 relative shadow-[0_0_20px_rgba(34,211,238,0.3)]
                                            ${state.heat > 80 ? 'bg-red-500 shadow-red-500/40' :
                                                    state.heat > 50 ? 'bg-amber-500 shadow-amber-500/40' :
                                                        'bg-cyan-400 shadow-cyan-400/40'}`}
                                                style={{ width: `${Math.min(100, (state.heat / CONFIG.gameMechanics.maxHeat) * 100)}%` }}>
                                                {/* SCANLINE OVERLAY */}
                                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* BRIBE BUTTON */}
                                <div className="relative z-10 mt-auto">
                                    {(() => {
                                        // Calculate Dynamic Cost for UI
                                        const levelMult = Math.max(1, state.level || 1);
                                        const baseBribe = CONFIG.police.bribeCost * levelMult;
                                        const bribeFee = baseBribe * 0.1; // 10% Clean Cash Fee

                                        return (
                                            <ActionButton
                                                onClick={bribePolice}
                                                disabled={state.dirtyCash < baseBribe || state.cleanCash < bribeFee || state.heat <= 0}
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
                                                            <div className="text-[10px] text-theme-text-muted font-medium font-mono">
                                                                {formatNumber(bribeFee)} kr (Hvid) Gebyr
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-[9px] font-bold text-zinc-500 uppercase mb-0.5">{t('rivals.cost')}</div>
                                                        <div className="text-lg font-mono font-black text-amber-500">{formatNumber(baseBribe)} <span className="text-[10px]">kr</span></div>
                                                    </div>
                                                </div>
                                            </ActionButton>
                                        );
                                    })()}
                                </div>
                            </GlassCard>

                            {/* RIVAL OPS (Clean & Aggressive) */}
                            <GlassCard className="relative overflow-hidden min-h-[400px] flex flex-col justify-between h-full p-6" variant="danger">
                                {/* Dynamic Rival Background */}
                                <div className="absolute inset-0 z-0 pointer-events-none">
                                    {(() => {
                                        let rivalImg = rivalLittleA;
                                        if (state.level >= 8) rivalImg = rivalUncleJ;
                                        else if (state.level >= 4) rivalImg = rivalBaron;

                                        return (
                                            <>
                                                <div className="absolute inset-0 bg-gradient-to-t from-red-950 via-red-900/80 to-transparent z-10 opacity-90"></div>
                                                <img
                                                    src={rivalImg}
                                                    className="w-full h-full object-cover object-top opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000 transform scale-105"
                                                    alt="Rival Boss"
                                                />
                                            </>
                                        );
                                    })()}
                                </div>

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
                                                        <div className="text-3xl font-black text-white uppercase tracking-tighter italic drop-shadow-md">{activeRival.name}</div>
                                                        <p className="text-[10px] text-zinc-300 mt-2 font-terminal leading-relaxed max-w-sm drop-shadow">{activeRival.desc}</p>
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

                                <div className="grid grid-cols-2 gap-2 relative z-10">
                                    <ActionButton
                                        onClick={sabotageRival}
                                        disabled={state.cleanCash < CONFIG.rivals.sabotageCost}
                                        className="group flex flex-col items-start justify-between h-auto py-2 px-3"
                                        variant="ghost"
                                    >
                                        <div className="text-[9px] text-amber-500/80 uppercase font-black tracking-widest">{t('rivals.actions.sabotage')}</div>
                                        <div className="text-[10px] md:text-xs font-black text-theme-text-primary uppercase leading-tight mb-2">{t('rivals.actions.sabotage_desc')}</div>
                                        <div className="w-full flex justify-between items-center mt-auto text-[9px] font-bold">
                                            <span className="text-emerald-400">{formatNumber(CONFIG.rivals.sabotageCost)} kr</span>
                                        </div>
                                    </ActionButton>

                                    <ActionButton
                                        onClick={raidRival}
                                        disabled={state.heat > 80}
                                        className="group flex flex-col items-start justify-between h-auto py-2 px-3 !bg-red-950/20 !border-red-500/20 hover:!border-red-500/50"
                                        variant="danger"
                                    >
                                        <div className="text-[9px] text-red-500 uppercase font-black tracking-widest">{t('rivals.actions.raid')}</div>
                                        <div className="text-[10px] md:text-xs font-black text-theme-text-primary uppercase leading-tight mb-2">{t('rivals.actions.raid_desc')}</div>
                                        <div className="w-full flex justify-between items-center mt-auto text-[9px] font-bold">
                                            <span className="text-red-500 animate-pulse">Heat +++</span>
                                        </div>
                                    </ActionButton>
                                </div>

                                {/* CARTEL ASSAULT (LATE GAME SINK) */}
                                {state.level >= 10 && (
                                    <div className="mt-4 border-t border-red-500/20 pt-4 relative z-10 flex flex-col gap-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 flex items-center gap-2">
                                                <i className="fa-solid fa-crosshairs animate-pulse"></i> CARTEL ASSAULT
                                            </div>
                                            <div className="text-[9px] text-zinc-500 font-mono">ALL-IN RISK SINK</div>
                                        </div>
                                        
                                        <div className="grid grid-cols-3 gap-2">
                                            <ActionButton
                                                onClick={() => launchCartelAssault && launchCartelAssault('skirmish')}
                                                disabled={state.cleanCash < 50000}
                                                className="group !py-2 !px-1 md:!px-2 !bg-orange-950/20 !border-orange-500/30 hover:!border-orange-500/80"
                                                variant="danger"
                                            >
                                                <div className="flex flex-col items-center text-center">
                                                    <span className="text-[9px] md:text-[10px] font-black text-white">SKIRMISH</span>
                                                    <span className="text-[8px] text-orange-400 mt-1">25% WAGER</span>
                                                </div>
                                            </ActionButton>
                                            <ActionButton
                                                onClick={() => launchCartelAssault && launchCartelAssault('offensive')}
                                                disabled={state.cleanCash < 50000}
                                                className="group !py-2 !px-1 md:!px-2 !bg-red-950/40 !border-red-500/40 hover:!border-red-500/80"
                                                variant="danger"
                                            >
                                                <div className="flex flex-col items-center text-center">
                                                    <span className="text-[9px] md:text-[10px] font-black text-white">OFFENSIVE</span>
                                                    <span className="text-[8px] text-red-400 mt-1">50% WAGER</span>
                                                </div>
                                            </ActionButton>
                                            <ActionButton
                                                onClick={() => launchCartelAssault && launchCartelAssault('all_in')}
                                                disabled={state.cleanCash < 50000}
                                                className="group !py-2 !px-1 md:!px-2 !bg-red-900/40 !border-red-500/80 hover:!border-red-400 !shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                                                variant="danger"
                                            >
                                                <div className="flex flex-col items-center text-center">
                                                    <span className="text-[9px] md:text-[10px] font-black text-white">ALL-IN</span>
                                                    <span className="text-[8px] text-red-300 font-bold mt-1 shadow-black drop-shadow-md">100% WAGER</span>
                                                </div>
                                            </ActionButton>
                                        </div>
                                    </div>
                                )}
                            </GlassCard>
                        </div>

                        {/* MULTIPLAYER / GANG WARS (NEW) */}
                        <GlassCard className="relative overflow-hidden p-6 hover:border-purple-500/40 group">
                            {/* TERRITORIES / CONTROL GRID */}
                            <div>
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



                        </GlassCard>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default RivalsTab;
