import React, { useMemo, useState } from 'react';
import { CONFIG } from '../../config/gameConfig';
import { useLanguage } from '../../context/LanguageContext';
import { formatNumber } from '../../utils/gameMath';
import { useNetwork } from '../../hooks/useNetwork';
import ActionButton from '../ui/ActionButton';
import mapBg from '../../assets/images/tactical_map_bg.png';

// Spatial coordinates mapped to our high-fidelity tactical satellite image
const COORDINATES = {
    'christiania': { x: 58, y: 52, lat: 55.673, long: 12.599 },
    'nørrebro': { x: 45, y: 38, lat: 55.691, long: 12.548 },
    'nordvest': { x: 38, y: 28, lat: 55.705, long: 12.531 },
    'vesterbro': { x: 45, y: 55, lat: 55.666, long: 12.544 },
    'city': { x: 50, y: 48, lat: 55.676, long: 12.568 },
    'frederiksberg': { x: 41, y: 48, lat: 55.679, long: 12.533 },
    'vestegnen': { x: 25, y: 65, lat: 55.655, long: 12.433 },
    'glostrup': { x: 18, y: 60, lat: 55.663, long: 12.396 },
    'ishøj': { x: 22, y: 80, lat: 55.615, long: 12.355 },
    'hellerup': { x: 62, y: 18, lat: 55.731, long: 12.578 }
};

const TacticalMap = ({ state, setState, addLog, addFloat, liberateTerritory }) => {
    const { t } = useLanguage();
    const [selectedId, setSelectedId] = useState(null);

    const {
        conquer,
        upgradeTerritory,
        defendTerritory,
        performStreetOp,
        emergencyBribe,
        handleShakedown,
        specializeTerritory
    } = useNetwork(state, setState, addLog, addFloat);

    const territories = useMemo(() => {
        return CONFIG.territories.map(tData => {
            const coords = COORDINATES[tData.id] || { x: 50, y: 50 };
            const owned = state.territories.includes(tData.id);
            const level = state.territoryLevels?.[tData.id] || 1;
            const attack = state.territoryAttacks?.[tData.id];
            const isRivalOccupied = state.rival?.occupiedTerritories?.includes(tData.id);
            const isElite = tData.district === 'elite';
            const income = (tData.income * Math.pow(CONFIG.territories.scale, level - 1)) / CONFIG.time.ONE_HOUR_S;

            return {
                ...tData,
                coords,
                owned,
                level,
                attack,
                isRivalOccupied,
                isElite,
                incomePerSec: income
            };
        });
    }, [state.territories, state.territoryLevels, state.territoryAttacks, state.rival?.occupiedTerritories]);

    const selectedTerritory = useMemo(() =>
        territories.find(t => t.id === selectedId),
        [territories, selectedId]);

    return (
        <div className="w-full h-full relative bg-[#020617] overflow-hidden select-none font-mono">
            {/* 1. REAL TACTICAL MAP BACKGROUND */}
            <div className="absolute inset-0 opacity-40 mix-blend-screen saturate-50 brightness-[0.7]">
                <img src={mapBg} className="w-full h-full object-cover scale-110 blur-[1px]" alt="Tactical Map" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]/20"></div>
            </div>

            {/* 2. MAP GRID LAYER (PRIMARY) */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)',
                    backgroundSize: '80px 80px'
                }}
            />

            {/* 2b. MICRO GRID LAYER (SECONDARY) */}
            <div className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: 'linear-gradient(#22d3ee 0.5px, transparent 0.5px), linear-gradient(90deg, #22d3ee 0.5px, transparent 0.5px)',
                    backgroundSize: '20px 20px'
                }}
            />

            {/* 3. TACTICAL HUD OVERLAYS */}
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                {/* Horizontal Scanline */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-400/20 shadow-[0_0_10px_rgba(34,211,238,0.5)] animate-scanline" />

                {/* CRT Flicker & Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

                <style>{`
                    @keyframes scanline {
                        0% { top: -10%; }
                        100% { top: 110%; }
                    }
                    .animate-scanline {
                        animation: scanline 12s linear infinite;
                    }
                    @keyframes flicker {
                        0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
                        20%, 24%, 55% { opacity: 0.8; }
                    }
                    .animate-flicker {
                        animation: flicker 4s infinite;
                    }
                `}</style>
            </div>

            {/* 4. TACTICAL INTELLIGENCE PANEL (Top Left) - Visible on all devices */}
            <div className="absolute top-3 md:top-6 left-3 md:left-6 z-40 w-56 md:w-64 lg:w-72 group animate-in fade-in slide-in-from-left-4 duration-700 pointer-events-auto">
                <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-lg md:rounded-2xl shadow-2xl overflow-hidden hover:border-cyan-500/30 transition-all duration-500">

                    {/* SECTION A: SYSTEM TELEMETRY */}
                    <div className="p-3 md:p-4 border-b border-white/5 bg-white/[0.02]">
                        <div className="text-[9px] md:text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] md:tracking-[0.3em] mb-2 md:mb-3 flex items-center gap-2">
                            <i className="fa-solid fa-satellite animate-pulse"></i> SYSTEM.STATUS
                        </div>
                        <div className="space-y-1.5 md:space-y-2">
                            <div className="flex justify-between gap-2 md:gap-4 text-[8px] md:text-[9px] font-mono">
                                <span className="text-white/40 uppercase">{t('tactical_map.controlled_sectors')}</span>
                                <span className="text-white font-black">{state.territories.length} / {CONFIG.territories.length}</span>
                            </div>
                            <div className="flex justify-between gap-2 md:gap-4 text-[8px] md:text-[9px] font-mono">
                                <span className="text-white/40 uppercase">{t('tactical_map.diamond_reserve')}</span>
                                <span className="text-amber-400 font-black">{state.diamonds || 0} DT.</span>
                            </div>
                            <div className="flex justify-between gap-2 md:gap-4 text-[8px] md:text-[9px] font-mono">
                                <span className="text-white/40 uppercase">{t('tactical_map.active_income')}</span>
                                <span className="text-cyan-400 font-black">+{formatNumber(Math.floor(state.incomePerSec || 0))} / SEC</span>
                            </div>
                        </div>
                    </div>

                    {/* SECTION B: SECTOR INTELLIGENCE */}
                    <div className="p-3 md:p-4 bg-black/20">
                        <div className="flex items-center gap-2 mb-2 md:mb-3">
                            <i className="fa-solid fa-radar text-cyan-400/60 text-[8px] animate-pulse"></i>
                            <span className="text-[8px] md:text-[9px] text-zinc-500 font-black uppercase tracking-[0.15em] md:tracking-[0.2em]">{t('tactical_map.sector_intelligence')}</span>
                        </div>
                        <div className="space-y-1">
                            {Object.keys(CONFIG.districts).map(dId => {
                                const dist = CONFIG.districts[dId];
                                const ownedCount = dist.req.filter(id => state.territories.includes(id)).length;
                                const isAll = ownedCount === dist.req.length;

                                return (
                                    <div key={dId} className="flex flex-col py-1.5 group/dist">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1 h-2 rounded-full transition-all ${isAll ? 'bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'bg-zinc-800'}`} />
                                                <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${isAll ? 'text-white/90' : 'text-zinc-600 group-hover/dist:text-zinc-400'}`}>{t(dist.name)}</span>
                                            </div>
                                            <span className={`text-[8px] font-mono ${isAll ? 'text-cyan-400' : 'text-zinc-800'}`}>{ownedCount}/{dist.req.length}</span>
                                        </div>
                                        {isAll && (
                                            <div className="pl-3 mt-0.5 text-[7px] text-cyan-400/60 font-black uppercase tracking-widest animate-in fade-in slide-in-from-left-1 duration-500">
                                                BONUS: {t(dist.bonus)}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* SECTION C: FOOTER STATUS */}
                    <div className="p-3 bg-white/[0.03] border-t border-white/5 flex flex-col gap-1.5 grayscale group-hover:grayscale-0 transition-all duration-700">
                        <div className="flex items-center gap-2 text-[7px] font-black uppercase text-zinc-600 tracking-widest">
                            <span className="w-1 h-1 rounded-full bg-amber-600 animate-pulse"></span>
                            Live Node Feed: Stable
                        </div>
                        <div className="text-[7px] font-mono text-white/10 tracking-widest group-hover:text-white/30 transition-colors">
                            LOCAL_GRID: 55.6761°N / 12.5683°E
                        </div>
                    </div>
                </div>

                {/* SECTION: STREET OPS (New Parity) */}
                <div className="mt-4 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-xl p-3 space-y-2 animate-in fade-in slide-in-from-left-4 duration-700">
                    <div className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">{t('network_interactive.panel_title') || 'STREET ACTIONS'}</div>
                    <div className="grid grid-cols-2 gap-2">
                        <ActionButton
                            onClick={() => performStreetOp('drive_by')}
                            variant="danger"
                            className="flex flex-col items-center py-2 h-auto"
                        >
                            <i className="fa-solid fa-car-side text-xs mb-1"></i>
                            <span className="text-[8px] font-black">{t('network_interactive.actions.drive_by')}</span>
                        </ActionButton>
                        <ActionButton
                            onClick={() => performStreetOp('bribe')}
                            variant="warning"
                            className="flex flex-col items-center py-2 h-auto"
                        >
                            <i className="fa-solid fa-handshake-simple text-xs mb-1"></i>
                            <span className="text-[8px] font-black">{t('network_interactive.actions.bribe')}</span>
                        </ActionButton>
                    </div>
                    {/* Emergency Bribe Action */}
                    <ActionButton
                        onClick={() => emergencyBribe()}
                        disabled={state.cleanCash < 100000}
                        variant="neutral"
                        className={`w-full py-2 flex items-center justify-between px-3 gap-2 transition-all ${state.heat > 300 ? '!border-red-500 !text-red-500 animate-pulse' : ''}`}
                    >
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-hand-holding-dollar text-xs"></i>
                            <span className="text-[9px] font-black uppercase tracking-tighter">{t('network.emergency_bribe')}</span>
                        </div>
                        <span className="text-[8px] font-mono opacity-60">-100K kr (Hvide)</span>
                    </ActionButton>
                </div>
            </div>

            {/* 5. TACTICAL NODES */}
            <div className="absolute inset-0 z-20">
                {territories.map(node => {
                    const isSelected = selectedId === node.id;
                    const statusColor = node.isRivalOccupied ? 'text-red-500' : (node.owned ? (node.isElite ? 'text-amber-400' : 'text-cyan-400') : 'text-zinc-600');
                    const glowColor = node.isRivalOccupied ? 'shadow-[0_0_20px_rgba(239,68,68,0.4)]' : (node.owned ? (node.isElite ? 'shadow-[0_0_20px_rgba(251,191,36,0.3)]' : 'shadow-[0_0_20px_rgba(34,211,238,0.3)]') : '');

                    return (
                        <div
                            key={node.id}
                            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500 group ${isSelected ? 'scale-125 z-40' : 'hover:scale-110 z-30'}`}
                            style={{ left: `${node.coords.x}%`, top: `${node.coords.y}%` }}
                            onClick={() => setSelectedId(node.id)}
                        >
                            {/* HUD Tag for Selected */}
                            {isSelected && (
                                <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex flex-col items-center animate-in fade-in zoom-in-50 duration-500">
                                    <div className="bg-black/80 backdrop-blur-xl border border-cyan-400/30 px-3 py-1 rounded-sm shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                                        <div className="text-[8px] text-cyan-400 font-mono font-black tracking-widest whitespace-nowrap uppercase">
                                            POS: {node.coords.lat}N / {node.coords.long}E
                                        </div>
                                    </div>
                                    <div className="w-[1px] h-6 bg-gradient-to-t from-cyan-400 to-transparent shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                                </div>
                            )}

                            {/* THE NODE PIN */}
                            <div className="relative group/pin">
                                {/* Outer Tactical Spinning Ring */}
                                {node.owned && !node.isRivalOccupied && (
                                    <div className="absolute -inset-5 rounded-full border border-dashed border-cyan-400/20 animate-[spin_12s_linear_infinite]" />
                                )}

                                {/* Selection Crosshair */}
                                {isSelected && (
                                    <div className="absolute -inset-6 pointer-events-none">
                                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.4)]"></div>
                                        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.4)]"></div>
                                        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.4)]"></div>
                                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.4)]"></div>
                                    </div>
                                )}

                                {/* Node Core */}
                                <div className={`w-4 h-4 rounded-full border-2 transition-all duration-500 flex items-center justify-center relative z-10
                                    ${node.owned ? 'border-cyan-400 bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.6)]' :
                                        node.isRivalOccupied ? 'border-red-500 bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.5)]' :
                                            'border-white/30 bg-black/80 group-hover:border-white/60'}`}
                                >
                                    {node.owned && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_5px_white]"></div>}
                                </div>

                                {/* Label */}
                                <div className={`absolute top-full mt-4 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 bg-black/90 backdrop-blur-xl border border-white/10 rounded-sm text-[9px] font-black uppercase tracking-[0.2em] transition-all
                                    ${isSelected ? 'opacity-100 border-cyan-400/50 shadow-2xl scale-110' : 'opacity-0 group-hover:opacity-100 group-hover/pin:translate-y-1'}`}
                                >
                                    <span className={node.owned ? 'text-cyan-400' : node.isRivalOccupied ? 'text-red-500' : 'text-white/60'}>
                                        {t(node.name)}
                                    </span>
                                    {isSelected && <span className="ml-2 text-[7px] opacity-40">LVL.{node.level}</span>}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* SVG CONNECTION WEB */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
                    <g stroke="cyan" strokeWidth="0.5" strokeDasharray="3 3">
                        <line x1="55%" y1="50%" x2="45%" y2="35%" />
                        <line x1="55%" y1="50%" x2="45%" y2="60%" />
                        <line x1="45%" y1="35%" x2="35%" y2="30%" />
                        <line x1="55%" y1="50%" x2="70%" y2="55%" />
                        <line x1="45%" y1="60%" x2="20%" y2="55%" />
                    </g>
                </svg>
            </div>

            {/* 4. SELECTION HUD (Bottom Right) */}
            {selectedTerritory && (
                <div className="absolute bottom-6 right-6 w-72 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl z-50 animate-in slide-in-from-right-full duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">{selectedTerritory.owned ? `LVL ${selectedTerritory.level} NODE` : 'NEUTRAL NODE'}</span>
                            <h3 className="text-lg font-black uppercase tracking-tighter text-white">{t(selectedTerritory.name)}</h3>
                        </div>
                        <button onClick={() => setSelectedId(null)} className="text-zinc-500 hover:text-white">
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-[10px] text-zinc-400 uppercase font-bold">{t('tactical_map.income')}</span>
                            <span className="text-sm font-mono text-terminal-green font-bold">+{formatNumber(selectedTerritory.incomePerSec)}/s</span>
                        </div>

                        {selectedTerritory.isRivalOccupied ? (
                            <div className="flex flex-col gap-2 mt-4">
                                <div className="text-[10px] text-red-500 font-black uppercase text-center py-1 bg-red-500/10 rounded border border-red-500/20">{t('tactical_map.node_occupied')}</div>
                                <button
                                    onClick={() => liberateTerritory(selectedTerritory.id)}
                                    className="w-full py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase rounded transition-all shadow-lg"
                                >
                                    LIBERATE AREA
                                </button>
                            </div>
                        ) : !selectedTerritory.owned ? (
                            <button
                                onClick={() => conquer(selectedTerritory)}
                                disabled={state.dirtyCash < selectedTerritory.baseCost || state.level < selectedTerritory.reqLevel}
                                className="w-full mt-4 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-xs font-black uppercase rounded transition-all shadow-lg"
                            >
                                {state.level < selectedTerritory.reqLevel ? `REQS LVL ${selectedTerritory.reqLevel}` : `CONQUER [${formatNumber(selectedTerritory.baseCost)}]`}
                            </button>
                        ) : (
                            <button
                                onClick={() => upgradeTerritory(selectedTerritory, 1)}
                                disabled={state.dirtyCash < (selectedTerritory.baseCost * Math.pow(CONFIG.territories.costScale, selectedTerritory.level - 1))}
                                className="w-full mt-4 py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-xs font-black uppercase rounded transition-all shadow-lg"
                            >
                                UPGRADE NODE
                            </button>
                        )}

                        {/* Node Specialization (V2 Parity Fix) */}
                        {selectedTerritory.owned && selectedTerritory.level >= 5 && (
                            <div className="mt-4 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                                <div className="text-[8px] font-black text-cyan-400 uppercase tracking-widest mb-2">{t('network.spec_title')}</div>
                                <div className="flex flex-col gap-1.5">
                                    {[
                                        { id: 'safe', icon: 'fa-shield-halved', color: 'text-emerald-400' },
                                        { id: 'front', icon: 'fa-store', color: 'text-cyan-400' },
                                        { id: 'storage', icon: 'fa-warehouse', color: 'text-amber-400' }
                                    ].map(spec => {
                                        const currentSpec = state.territorySpecs?.[selectedTerritory.id];
                                        const isSelected = currentSpec === spec.id;
                                        return (
                                            <button
                                                key={spec.id}
                                                onClick={() => specializeTerritory(selectedTerritory.id, spec.id)}
                                                className={`flex items-center justify-between p-2 rounded border transition-all ${isSelected ? 'bg-cyan-500/10 border-cyan-500' : 'bg-black/40 border-white/5 hover:border-white/20'}`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <i className={`fa-solid ${spec.icon} text-[10px] ${spec.color}`}></i>
                                                    <span className={`text-[9px] font-black uppercase ${isSelected ? 'text-white' : 'text-zinc-500'}`}>{t(`network.specs.${spec.id}.name`)}</span>
                                                </div>
                                                {isSelected && <i className="fa-solid fa-check text-[8px] text-cyan-400"></i>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* MINIMAL LOG */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="text-[9px] font-mono text-zinc-500 leading-tight">
                            DATA FEED: {selectedTerritory.id.toUpperCase()} STATUS {selectedTerritory.owned ? 'ACTIVE' : 'OFFLINE'}
                        </div>
                    </div>
                </div>
            )}


            {/* 7. TAC-SCAN Overlay (Faint watermark) */}
            <div className="absolute bottom-6 left-6 pointer-events-none opacity-20">
                <div className="text-[40px] font-black text-white/5 tracking-tighter leading-none italic uppercase">
                    COPENHAGEN<br />TACTICAL
                </div>
                <div className="flex items-center gap-4 mt-2">
                    <div className="h-[1px] w-24 bg-white/10" />
                    <span className="text-[8px] font-mono text-white/10">STATION_ID: NODE_084</span>
                </div>
            </div>
        </div>
    );
};

export default TacticalMap;
