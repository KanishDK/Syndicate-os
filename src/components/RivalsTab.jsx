import React, { useState } from 'react';
import { CONFIG } from '../config/gameConfig';
import { formatNumber, getBulkCost, getMaxAffordable } from '../utils/gameMath';
import Button from './Button';
import BulkControl from './BulkControl';

const RivalsTab = ({ state, setState, addLog, ...props }) => {
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
            addLog(`Købte ${actualAmount}x ${item.name}`, 'success');
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
                        Underverdenen
                    </h2>
                    <p className="text-zinc-500 text-sm mt-2 font-medium tracking-wide">Konflikt, Politi og Sikkerhed. Hold dine fjender tæt og din ryg fri.</p>
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
                                    Politirapport & Overvågning
                                </h3>
                                <div className="text-2xl font-black text-white uppercase tracking-tight">Københavns Politi</div>
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-500
                                ${state.heat > 80 ? 'bg-red-600/20 text-red-500 border-red-500/40 animate-pulse' : 'bg-blue-600/10 text-blue-400 border-blue-500/30'}`}>
                                {state.heat > 80 ? '⚠️ RAZZIA OVERHÆNGENDE' : '📡 OVERVÅGNING AKTIV'}
                            </div>
                        </div>

                        {/* PREMIUM HEAT METER */}
                        <div className="mb-10 relative z-10">
                            <div className="flex justify-between items-end mb-3">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Nuværende Trusselsniveau</span>
                                    <div className={`text-4xl font-mono font-black ${state.heat > 80 ? 'text-red-500' : state.heat > 50 ? 'text-amber-500' : 'text-blue-500'}`}>
                                        {state.heat.toFixed(1)}%
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-bold text-zinc-600 uppercase block mb-1">Status</span>
                                    <div className="text-xs font-bold text-white uppercase">
                                        {state.heat > 80 ? 'Kritisk' : state.heat > 50 ? 'Forhøjet' : 'Sikkert'}
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
                                            <div className="text-lg font-black text-white uppercase tracking-tight">Bestik Betjent</div>
                                            <div className="text-xs text-zinc-500 font-medium font-mono">-25% HEAT ØJEBLIKKELIGT</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Omkostning</div>
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
                                    <i className="fa-solid fa-user-secret"></i> Rivaliserende Syndikat
                                </h3>
                                <div className="text-3xl font-black text-white uppercase tracking-tighter italic">{state.rival.name}</div>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Fjendtlighed</span>
                                <div className="text-4xl font-mono font-black text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.3)]">
                                    {state.rival.hostility.toFixed(1)}%
                                </div>
                            </div>
                        </div>

                        {/* RIVAL STRENGTH METER (NEW) */}
                        <div className="mb-6 relative z-10">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Rival Styrke</span>
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
                                    <div className="text-[10px] text-amber-500/80 uppercase font-black tracking-widest mb-2">Sabotage</div>
                                    <div className="text-lg font-black text-white mb-2 uppercase leading-none">Forsink Rival</div>
                                    <div className="flex justify-between items-center mt-4 text-[10px] font-bold">
                                        <span className="text-zinc-500 uppercase">Omk.</span>
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
                                    <div className="text-[10px] text-red-500 uppercase font-black tracking-widest mb-2">Plyndring</div>
                                    <div className="text-lg font-black text-white mb-2 uppercase leading-none">Angreb</div>
                                    <div className="flex justify-between items-center mt-4 text-[10px] font-bold uppercase">
                                        <span className="text-zinc-500">Risiko</span>
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
                                    <div className="text-[10px] text-red-500 uppercase font-black tracking-widest mb-2">Offensiv</div>
                                    <div className="text-lg font-black text-white mb-2 uppercase leading-none">Gade-Krig</div>
                                    <div className="flex justify-between items-center mt-4 text-[10px] font-bold">
                                        <span className="text-zinc-500 uppercase">Omk.</span>
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
                        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600/5 rounded-full blur-[80px] -ml-32 -mt-32"></div>

                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <h3 className="text-purple-500 font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-3">
                                <i className="fa-solid fa-users"></i> Gang Wars (Multiplayer Lite)
                            </h3>
                            <div className="px-3 py-1 rounded bg-purple-500/10 border border-purple-500/30 text-[10px] font-black uppercase text-purple-400">
                                BETA
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                            {/* EXPORT */}
                            <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                                <h4 className="text-white font-bold text-sm uppercase mb-2">Udfordr en Ven</h4>
                                <p className="text-zinc-500 text-[10px] mb-4">Send din kode til en ven. Hvis de indtaster den, bliver DU deres rival.</p>
                                <Button
                                    onClick={() => {
                                        const code = btoa(JSON.stringify({
                                            n: CONFIG.levelTitles[state.level - 1] || 'Gangster',
                                            s: Math.min(100, 50 + (state.level * 5)),
                                            l: state.level
                                        }));
                                        navigator.clipboard.writeText(code);
                                        addLog("Krigserklæring kopieret til udklipsholder!", "success");
                                    }}
                                    className="w-full py-2 text-xs font-black uppercase"
                                    variant="primary"
                                >
                                    <i className="fa-solid fa-copy mr-2"></i> Kopier Min Kode
                                </Button>
                            </div>

                            {/* IMPORT */}
                            <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                                <h4 className="text-white font-bold text-sm uppercase mb-2">Find Rival</h4>
                                <p className="text-zinc-500 text-[10px] mb-4">Indtast en vens kode for at kæmpe mod dem.</p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        id="rivalCodeInput" // Direct DOM access for speed in this lite version
                                        placeholder="Indsæt kode..."
                                        className="bg-black border border-zinc-700 text-white text-xs px-3 py-2 rounded-lg w-full focus:outline-none focus:border-purple-500"
                                    />
                                    <Button
                                        onClick={() => {
                                            try {
                                                const inputElement = document.getElementById('rivalCodeInput');
                                                if (!inputElement) {
                                                    addLog("Fejl: Input felt ikke fundet!", "error");
                                                    return;
                                                }

                                                const input = inputElement.value;
                                                if (!input || input.trim() === '') {
                                                    addLog("Indtast venligst en kode!", "error");
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
                                                addLog(`Ny Rival: ${data.n} (Lvl ${data.l})`, 'success');
                                                inputElement.value = '';
                                            } catch (e) {
                                                addLog("Ugyldig Kode!", "error");
                                            }
                                        }}
                                        className="py-2 px-4 text-xs font-black uppercase"
                                        variant="neutral"
                                    >
                                        Søg
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-black/50 border border-white/5 rounded-3xl p-8 backdrop-blur-md">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-white font-black uppercase tracking-[0.2em] text-xs flex items-center gap-3">
                                <i className="fa-solid fa-map-location-dot text-indigo-500"></i> Syndicate Control Grid
                            </h3>
                            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                Global Dominans: {((state.territories?.length || 0) / CONFIG.territories.length * 100).toFixed(0)}%
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {CONFIG.territories.map((t, idx) => {
                                const isOwned = state.territories?.includes(t.id);
                                const isRival = state.rival.occupiedTerritories?.includes(t.id);
                                const isLocked = state.level < t.reqLevel;
                                return (
                                    <div key={t.id} className={`relative p-4 rounded-2xl border transition-all duration-500 text-center flex flex-col items-center
                                        ${isOwned ? 'bg-indigo-500/20 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]' :
                                            isRival ? 'bg-red-500/10 border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.2)] animate-pulse' :
                                                isLocked ? 'bg-zinc-900 border-white/5 opacity-50 grayscale' : 'bg-white/5 border-white/10'}`}>

                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 shadow-inner
                                            ${isOwned ? 'bg-indigo-500 text-black' :
                                                isRival ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]' :
                                                    'bg-black/40 text-zinc-600'}`}>
                                            <i className={`fa-solid ${isLocked ? 'fa-lock' : isRival ? 'fa-skull' : 'fa-city'} text-sm`}></i>
                                        </div>

                                        <div className="text-[10px] font-black text-white uppercase truncate w-full mb-1">{t.name}</div>

                                        <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden mt-2">
                                            <div className={`h-full transition-all duration-1000 ${isOwned ? 'bg-indigo-400 w-full' : isRival ? 'bg-red-500 w-full' : 'bg-transparent w-0'}`}></div>
                                        </div>

                                        <div className="mt-3 text-[9px] font-bold uppercase tracking-tighter">
                                            {isLocked ? `Level ${t.reqLevel}` :
                                                isOwned ? <span className="text-indigo-400">OPERATIV</span> :
                                                    isRival ? <span className="text-red-500 font-black animate-pulse">OVERTAGET!</span> :
                                                        <span className="text-zinc-600">NEUTRAL</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: DEFENSE GRID */}
                <div className="lg:col-span-12 xl:col-span-5">
                    <div className="bg-[#0a0a0b]/80 backdrop-blur-xl border border-white/5 p-8 rounded-3xl h-full shadow-[0_40px_80px_rgba(0,0,0,0.5)] flex flex-col">
                        <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
                            <div>
                                <h3 className="text-white font-black uppercase tracking-tight text-xl flex items-center gap-3">
                                    <i className="fa-solid fa-shield-halved text-emerald-500"></i> Forsvar
                                </h3>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Sikring af Headquarters</p>
                            </div>
                            <BulkControl buyAmount={buyAmount} setBuyAmount={setBuyAmount} />
                        </div>

                        <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            {Object.entries(CONFIG.defense).map(([id, item]) => {
                                const count = state.defense[id] || 0;
                                let actualAmount = buyAmount === 'max' ? getMaxAffordable(item.baseCost, item.costFactor, count, state.cleanCash) : buyAmount;
                                if (actualAmount <= 0) actualAmount = 1;

                                const cost = getBulkCost(item.baseCost, item.costFactor, count, actualAmount);
                                const canAfford = state.cleanCash >= cost && (buyAmount !== 'max' || actualAmount > 0);

                                return (
                                    <div key={id} className="p-5 bg-white/[0.02] rounded-2xl border border-white/5 active:scale-[0.98] transition-all flex flex-col gap-4 group hover:bg-white/[0.04] hover:border-emerald-500/20">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-emerald-950/20 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0 text-2xl group-hover:bg-emerald-500 group-hover:text-black transition-all">
                                                <i className={`fa-solid ${id === 'guards' ? 'fa-person-rifle' : id === 'cameras' ? 'fa-video' : 'fa-vault'}`}></i>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <div className="text-md font-black text-white uppercase truncate">{item.name}</div>
                                                    <div className="text-xl font-mono text-emerald-400 font-black leading-none drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                                                        {count}
                                                    </div>
                                                </div>
                                                <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-wide flex items-center gap-2">
                                                    <span>+{item.defenseVal} DEFENSE</span>
                                                    <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                                                    <span>PR. ENHED</span>
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={() => buyDefense(id, buyAmount)}
                                            disabled={!canAfford}
                                            className={`w-full py-3.5 flex justify-between px-5 text-xs font-black uppercase rounded-xl transition-all
                                                ${canAfford ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500 hover:text-black hover:border-emerald-400' : 'opacity-40 grayscale pointer-events-none'}`}
                                            variant="ghost"
                                        >
                                            <span>
                                                Køb {buyAmount !== 1 && buyAmount !== 'max' ? `x${buyAmount}` : buyAmount === 'max' ? `Max (${actualAmount})` : ''}
                                            </span>
                                            <span className="font-mono">{formatNumber(cost)} kr</span>
                                        </Button>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Summary Footer */}
                        <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                            <span>Samlet Forsvarsværdi</span>
                            <span className="text-white text-sm font-mono">
                                {Object.keys(CONFIG.defense).reduce((acc, id) => acc + (state.defense[id] || 0) * CONFIG.defense[id].defenseVal, 0)} PUNKTER
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div >
    );
};

export default RivalsTab;
