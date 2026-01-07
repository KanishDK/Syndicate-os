import React, { useState } from 'react';
import { CONFIG } from '../config/gameConfig';
import { formatNumber, getBulkCost, getMaxAffordable } from '../utils/gameMath';
import Button from './Button';
import BulkControl from './BulkControl';
import { useLanguage } from '../context/LanguageContext';

const RivalsTab = ({ state, setState, addLog, ...props }) => {
    const { t } = useLanguage();
    // Defense Bulk Buy Logic
    const [buyAmount, setBuyAmount] = useState(1);

    // --- ACTIONS ---
    const buyDefense = (id, amount) => {
        const item = CONFIG.defense[id];
        const currentCount = state.defense[id] || 0;

        let actualAmount = amount === 'max' ? getMaxAffordable(item.baseCost, item.costFactor, currentCount, state.cleanCash) : amount;
        if (actualAmount <= 0) return;

        const cost = getBulkCost(item.baseCost, item.costFactor, currentCount, actualAmount);

        if (state.cleanCash >= cost) {
            setState(prev => ({
                ...prev,
                cleanCash: prev.cleanCash - cost,
                defense: { ...prev.defense, [id]: (prev.defense[id] || 0) + actualAmount }
            }));
            addLog(`${t('rivals.buy')} ${actualAmount}x ${t(`rivals_interactive.defense.${id}.name`)}`, 'success');
        }
    };

    const { sabotageRival, raidRival, bribePolice, strikeRival } = props;

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8 relative">
                <div className="absolute -bottom-px left-0 w-32 h-[2px] bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]"></div>
                <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter text-white flex items-center gap-4">
                        <i className="fa-solid fa-skull-crossbones text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]"></i>
                        {t('rivals.title')}
                    </h2>
                    <p className="text-zinc-500 text-sm mt-2 font-medium tracking-wide">{t('rivals.subtitle')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT SIDE: SCANNER & RIVALS */}
                <div className="lg:col-span-12 xl:col-span-7 space-y-8">

                    {/* POLICE SCANNER (High-Tech Redesign) */}
                    <div className="group relative bg-[#0a0b0d] border border-blue-500/20 rounded-3xl p-8 overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.05)] transition-all hover:border-blue-500/40">
                        {/* High-tech background elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                        <div className="absolute -right-4 top-4 opacity-5 text-blue-500 text-[12rem] pointer-events-none select-none">
                            <i className="fa-solid fa-tower-broadcast animate-pulse"></i>
                        </div>

                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div>
                                <h3 className="text-blue-400 font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-3 mb-1">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                                    {t('rivals.scanner.title')}
                                </h3>
                                <div className="text-2xl font-black text-white uppercase tracking-tight">{t('rivals.scanner.police')}</div>
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-500
                                ${state.heat > 80 ? 'bg-red-600/20 text-red-500 border-red-500/40 animate-pulse' : 'bg-blue-600/10 text-blue-400 border-blue-500/30'}`}>
                                {state.heat > 80 ? t('rivals.scanner.status_raid') : t('rivals.scanner.status_active')}
                            </div>
                        </div>

                        {/* PREMIUM HEAT METER */}
                        <div className="mb-10 relative z-10">
                            <div className="flex justify-between items-end mb-3">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">{t('rivals.scanner.threat_level')}</span>
                                    <div className={`text-4xl font-mono font-black ${state.heat > 80 ? 'text-red-500' : state.heat > 50 ? 'text-amber-500' : 'text-blue-500'}`}>
                                        {state.heat.toFixed(1)}%
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-bold text-zinc-600 uppercase block mb-1">{t('rivals.scanner.status_label')}</span>
                                    <div className="text-xs font-bold text-white uppercase">
                                        {state.heat > 80 ? t('rivals.scanner.level.critical') : state.heat > 50 ? t('rivals.scanner.level.high') : t('rivals.scanner.level.safe')}
                                    </div>
                                </div>
                            </div>

                            <div className="relative h-6 w-full bg-black/40 rounded-full border border-white/5 p-1 overflow-hidden shadow-inner">
                                {/* Vertical Grid Bars for a "tech" feel */}
                                <div className="absolute inset-0 flex justify-between px-4 pointer-events-none">
                                    {[...Array(10)].map((_, i) => (
                                        <div key={i} className="w-px h-full bg-white/5"></div>
                                    ))}
                                </div>

                                <div className={`h-full rounded-full transition-all duration-700 relative shadow-[0_0_15px_rgba(59,130,246,0.3)]
                                    ${state.heat > 80 ? 'bg-gradient-to-r from-red-600 to-red-400 shadow-red-600/40' :
                                        state.heat > 50 ? 'bg-gradient-to-r from-amber-600 to-amber-400 shadow-amber-600/40' :
                                            'bg-gradient-to-r from-blue-600 to-blue-400 shadow-blue-600/40'}`}
                                    style={{ width: `${Math.min(100, state.heat)}%` }}>
                                    {/* Glass reflection on the bar */}
                                    <div className="absolute inset-x-0 top-0 h-1/2 bg-white/10 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* BRIBE BUTTON */}
                        <div className="relative z-10">
                            <Button
                                onClick={bribePolice}
                                disabled={state.dirtyCash < 50000 || state.heat <= 0}
                                className="w-full p-0 overflow-hidden bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-blue-500/30 group transition-all"
                                variant="ghost"
                            >
                                <div className="flex items-center justify-between w-full p-4 md:p-6">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-blue-600/10 text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                                            <i className="fa-solid fa-money-bill-transfer text-2xl"></i>
                                        </div>
                                        <div className="text-left">
                                            <div className="text-lg font-black text-white uppercase tracking-tight">{t('rivals.actions.bribe')}</div>
                                            <div className="text-xs text-zinc-500 font-medium font-mono">{t('rivals.actions.bribe_desc')}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-bold text-zinc-500 uppercase mb-1">{t('rivals.cost')}</div>
                                        <div className="text-xl font-mono font-black text-amber-500">50.000 <span className="text-xs">kr</span></div>
                                    </div>
                                </div>
                            </Button>
                        </div>
                    </div>

                    {/* RIVAL OPS (Clean & Aggressive) */}
                    <div className="group relative bg-[#0d0a0a] border border-red-900/20 rounded-3xl p-8 overflow-hidden shadow-[0_0_40px_rgba(220,38,38,0.05)] transition-all hover:border-red-900/40">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>

                        <div className="flex justify-between items-end mb-8 relative z-10">
                            <div className="space-y-1">
                                <h3 className="text-red-500 font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-3">
                                    <i className="fa-solid fa-user-secret"></i> {t('rivals.rival_syndicate')}
                                </h3>
                                <div className="text-3xl font-black text-white uppercase tracking-tighter italic">{state.rival.name}</div>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">{t('rivals.hostility')}</span>
                                <div className="text-4xl font-mono font-black text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.3)]">
                                    {state.rival.hostility.toFixed(1)}%
                                </div>
                            </div>
                        </div>

                        {/* RIVAL STRENGTH METER (NEW) */}
                        <div className="mb-6 relative z-10">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{t('rivals.strength')}</span>
                                <span className="text-sm font-mono font-black text-amber-500">{state.rival.strength.toFixed(1)}%</span>
                            </div>
                            <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                                <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-700 shadow-[0_0_10px_rgba(251,191,36,0.4)]"
                                    style={{ width: `${state.rival.strength}%` }}>
                                </div>
                            </div>
                        </div>

                        {/* HOSTILITY BAR */}
                        <div className="relative mb-10 z-10">
                            <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/5 shadow-inner p-px">
                                <div className="h-full bg-gradient-to-r from-red-900 via-red-600 to-red-400 shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all duration-1000 relative"
                                    style={{ width: `${state.rival.hostility}%` }}>
                                    <div className="absolute top-0 right-0 h-full w-4 bg-white/20 blur-sm"></div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
                            <Button
                                onClick={sabotageRival}
                                disabled={state.cleanCash < 25000}
                                className="group relative overflow-hidden bg-white/[0.02] border-white/5 hover:border-amber-500/30 transition-all p-6"
                                variant="ghost"
                            >
                                <div className="relative z-10 text-left">
                                    <div className="text-[10px] text-amber-500/80 uppercase font-black tracking-widest mb-2">{t('rivals.actions.sabotage')}</div>
                                    <div className="text-lg font-black text-white mb-2 uppercase leading-none">{t('rivals.actions.sabotage_desc')}</div>
                                    <div className="flex justify-between items-center mt-4 text-[10px] font-bold">
                                        <span className="text-zinc-500 uppercase">{t('rivals.cost')}</span>
                                        <span className="text-emerald-400">25k</span>
                                    </div>
                                </div>
                                <div className="absolute -right-4 -bottom-4 opacity-5 text-amber-500 text-6xl group-hover:scale-110 transition-transform">
                                    <i className="fa-solid fa-clock-rotate-left"></i>
                                </div>
                            </Button>

                            <Button
                                onClick={raidRival}
                                disabled={state.heat > 80}
                                className="group relative overflow-hidden bg-red-950/5 border-red-500/10 hover:border-red-500/40 hover:bg-red-950/20 transition-all p-6"
                                variant="ghost"
                            >
                                <div className="relative z-10 text-left">
                                    <div className="text-[10px] text-red-500 uppercase font-black tracking-widest mb-2">{t('rivals.actions.raid')}</div>
                                    <div className="text-lg font-black text-white mb-2 uppercase leading-none">{t('rivals.actions.raid_desc')}</div>
                                    <div className="flex justify-between items-center mt-4 text-[10px] font-bold uppercase">
                                        <span className="text-zinc-500">{t('rivals.risk')}</span>
                                        <span className="text-red-500 animate-pulse">Heat +++</span>
                                    </div>
                                </div>
                                <div className="absolute -right-4 -bottom-4 opacity-5 text-red-500 text-6xl group-hover:scale-110 transition-transform">
                                    <i className="fa-solid fa-burst"></i>
                                </div>
                            </Button>

                            <Button
                                onClick={strikeRival}
                                disabled={state.cleanCash < 50000}
                                className="group relative overflow-hidden bg-red-600/10 border-red-600/20 hover:border-red-600/60 transition-all p-6"
                                variant="ghost"
                            >
                                <div className="relative z-10 text-left">
                                    <div className="text-[10px] text-red-500 uppercase font-black tracking-widest mb-2">{t('rivals.actions.war')}</div>
                                    <div className="text-lg font-black text-white mb-2 uppercase leading-none">{t('rivals.actions.war_desc')}</div>
                                    <div className="flex justify-between items-center mt-4 text-[10px] font-bold">
                                        <span className="text-zinc-500 uppercase">{t('rivals.cost')}.</span>
                                        <span className="text-emerald-400">50k</span>
                                    </div>
                                </div>
                                <div className="absolute -right-4 -bottom-4 opacity-10 text-red-600 text-6xl group-hover:scale-110 transition-transform">
                                    <i className="fa-solid fa-gun"></i>
                                </div>
                            </Button>
                        </div>
                    </div>

                    {/* MULTIPLAYER / GANG WARS (NEW) */}
                    <div className="group relative bg-[#0a0a0c] border border-purple-500/20 rounded-3xl p-8 overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.05)] transition-all hover:border-purple-500/40 mb-8">
                        {/* GANG WARS (Multiplayer Lite) */}
                        <div className="bg-zinc-900/40 rounded-3xl p-8 border border-white/5 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-black text-white uppercase flex items-center gap-3">
                                        <i className="fa-solid fa-users-crosshairs text-indigo-400"></i>
                                        {t('rivals.wars.title')}
                                        <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full tracking-widest">{t('rivals.wars.beta')}</span>
                                    </h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* CHALLENGE FRIEND */}
                                <div className="bg-black/30 p-6 rounded-2xl border border-white/5">
                                    <h4 className="text-indigo-300 font-bold uppercase text-sm mb-2">{t('rivals.wars.challenge')}</h4>
                                    <p className="text-zinc-500 text-xs mb-4">{t('rivals.wars.challenge_desc')}</p>
                                    <div className="flex gap-2">
                                        <div className="bg-black/50 p-2 rounded border border-white/10 font-mono text-zinc-300 text-xs flex-1 text-center select-all">
                                            {state.syndicateId || "SYN-8291-XJ"}
                                        </div>
                                        <Button
                                            size="xs"
                                            variant="primary"
                                            className="!py-2"
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
                                        </Button>
                                    </div>
                                </div>

                                {/* FIND RIVAL */}
                                <div className="bg-black/30 p-6 rounded-2xl border border-white/5">
                                    <h4 className="text-indigo-300 font-bold uppercase text-sm mb-2">{t('rivals.wars.find')}</h4>
                                    <p className="text-zinc-500 text-xs mb-4">{t('rivals.wars.find_desc')}</p>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            id="rivalCodeInput"
                                            placeholder="SYN-XXXX-XX"
                                            className="bg-black/50 p-2 rounded border border-white/10 font-mono text-white text-xs flex-1 outline-none focus:border-indigo-500 transition-colors"
                                        />
                                        <Button
                                            size="xs"
                                            variant="neutral"
                                            className="!py-2"
                                            onClick={() => {
                                                try {
                                                    const inputElement = document.getElementById('rivalCodeInput');
                                                    if (!inputElement) {
                                                        addLog(t('rivals_interactive.wars.error_input_not_found'), "error");
                                                        return;
                                                    }

                                                    const input = inputElement.value;
                                                    if (!input || input.trim() === '') {
                                                        addLog(t('rivals_interactive.wars.error_empty'), "error");
                                                        return;
                                                    }

                                                    const data = JSON.parse(atob(input));

                                                    // Validation: Check required fields
                                                    if (!data.n || !data.s || !data.l) {
                                                        throw new Error("Manglende data felter");
                                                    }

                                                    // Sanity checks
                                                    if (typeof data.l !== 'number' || data.l < 1 || data.l > 100) {
                                                        throw new Error("Ugyldigt level");
                                                    }
                                                    if (typeof data.s !== 'number' || data.s < 0 || data.s > 200) {
                                                        throw new Error("Ugyldig styrke");
                                                    }
                                                    if (typeof data.n !== 'string' || data.n.length > 50) {
                                                        throw new Error("Ugyldigt navn");
                                                    }

                                                    // Apply rival
                                                    setState(prev => ({
                                                        ...prev,
                                                        rival: {
                                                            ...prev.rival,
                                                            name: data.n,
                                                            strength: Math.min(100, Math.max(0, data.s)),
                                                            level: data.l
                                                        }
                                                    }));
                                                    addLog(`${t('rivals_interactive.wars.search_success', { name: data.n, level: data.l })}`, 'success');
                                                    inputElement.value = '';
                                                } catch (e) {
                                                    addLog(t('rivals_interactive.wars.error_invalid'), "error");
                                                }
                                            }}
                                        >
                                            {t('rivals.wars.search')}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* TERRITORIES / CONTROL GRID */}
                        <div className="mt-8">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <h3 className="text-xl font-black text-white uppercase flex items-center gap-3">
                                        <i className="fa-solid fa-map-location-dot text-purple-400"></i>
                                        {t('rivals.grid.title')}
                                    </h3>
                                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                        {t('rivals.grid.dominance')}: {((state.territories?.length || 0) / CONFIG.territories.length * 100).toFixed(0)}%
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {CONFIG.territories.map((tData) => {
                                    const isOwned = state.territories?.includes(tData.id);
                                    const isRival = state.rival.occupiedTerritories?.includes(tData.id);
                                    const isLocked = state.level < tData.reqLevel;

                                    return (
                                        <div key={tData.id} className={`relative p-4 rounded-xl border transition-all duration-500 text-center flex flex-col items-center justify-between min-h-[120px]
                                        ${isOwned ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]' :
                                                isRival ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.1)]' :
                                                    isLocked ? 'bg-white/5 border-white/5 opacity-50 grayscale' : 'bg-white/5 border-white/10'}`}>

                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 shadow-inner
                                            ${isOwned ? 'bg-indigo-500 text-white' :
                                                    isRival ? 'bg-red-600 text-white animate-pulse' :
                                                        'bg-black/40 text-zinc-600'}`}>
                                                <i className={`fa-solid ${isLocked ? 'fa-lock' : isRival ? 'fa-skull' : 'fa-city'} text-sm`}></i>
                                            </div>

                                            <div className="text-[9px] font-black text-white uppercase truncate w-full mb-1">{tData.name}</div>

                                            <div className="mt-auto text-[8px] font-bold uppercase tracking-wider">
                                                {isLocked ? `Lvl ${tData.reqLevel}` :
                                                    isOwned ? <span className="text-indigo-400">{t('network.controlled')}</span> :
                                                        isRival ? <span className="text-red-500">{t('network.rival_occupation')}</span> :
                                                            <span className="text-zinc-600">-</span>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* DEFENSE SYSTEMS (New Layout) */}
                        <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-black rounded-3xl border border-white/5 p-8 relative overflow-hidden mt-8">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 relative z-10">
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                                        <i className="fa-solid fa-shield-dog text-emerald-500"></i>
                                        {t('rivals.defense.title')}
                                    </h3>
                                    <p className="text-zinc-500 text-sm mt-1">{t('rivals.defense.hq')}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-bold text-zinc-600 uppercase block mb-1">{t('rivals.defense.total_value')}</span>
                                    <div className="text-3xl font-mono font-black text-emerald-500">
                                        {Object.entries(state.defense).reduce((acc, [key, count]) => acc + (count * CONFIG.defense[key].defenseVal), 0)}
                                        <span className="text-sm text-zinc-600 ml-2">{t('rivals.defense.points')}</span>
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
                                        <div key={id} className="bg-black/40 rounded-xl p-5 border border-white/5 hover:border-emerald-500/30 transition-all group relative overflow-hidden">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-lg bg-emerald-900/20 text-emerald-500 flex items-center justify-center border border-emerald-500/20 text-xl group-hover:scale-110 transition-transform">
                                                        <i className={`fa-solid ${item.icon}`}></i>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white uppercase text-sm">{t(`rivals_interactive.defense.${id}.name`)}</h4>
                                                        <div className="text-[10px] text-emerald-400 font-mono">+{item.defenseVal} {t('rivals.defense.points')}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-black text-white">{count}</div>
                                                    <div className="text-[9px] text-zinc-600 uppercase tracking-wider">{t('rivals.defense.active')}</div>
                                                </div>
                                            </div>

                                            <p className="text-[10px] text-zinc-500 mb-4 h-8 leading-tight">{t(`rivals_interactive.defense.${id}.desc`)}</p>

                                            <Button
                                                onClick={() => buyDefense(id, buyAmount)}
                                                disabled={!canAfford}
                                                className={`w-full py-3 text-[10px] flex justify-between px-4 items-center ${canAfford ? 'hover:bg-emerald-500/20 hover:border-emerald-500/50' : 'opacity-50'}`}
                                                variant="neutral"
                                            >
                                                <span className="font-bold uppercase tracking-wider group-hover:text-emerald-400 transition-colors">
                                                    {t('rivals.defense.buy')} ({actualAmount}x)
                                                </span>
                                                <span className="font-mono text-emerald-500/80 bg-black/50 px-2 py-0.5 rounded border border-emerald-500/20">
                                                    {formatNumber(finalCost)} kr
                                                </span>
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default RivalsTab;
