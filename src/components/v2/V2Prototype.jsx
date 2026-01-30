import React, { useCallback, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { CONFIG } from '../../config/gameConfig';
import { useUI } from '../../context/UIContext';
import { useLanguage } from '../../context/LanguageContext';
import { useGameLogic } from '../../hooks/useGameLogic';
import { useGameActions } from '../../hooks/useGameActions';
import { formatNumber } from '../../utils/gameMath';
import { playSound } from '../../utils/audio';
import { useV2Theme } from '../../hooks/useV2Theme';
import { useAchievements } from '../../hooks/useAchievements';
import { useTutorial } from '../../hooks/useTutorial';
import { useKeyboard } from '../../hooks/useKeyboard';
import { useOfflineSystem } from '../../hooks/useOfflineSystem';

// Tabs
import SultanTab from '../SultanTab';
import ProductionTab from '../ProductionTab';
import TacticalMap from './TacticalMap';
import FinanceTab from '../FinanceTab';
import ManagementTab from '../ManagementTab';
import RivalsTab from '../RivalsTab';
import EmpireTab from '../EmpireTab';
import MusicPlayer from '../MusicPlayer';
import NewsTicker from '../NewsTicker';
import GhostMode from '../GhostMode';
import GoldenDrone from '../overlays/GoldenDrone';
import TutorialOverlay from '../TutorialOverlay';
import ModalController from '../modals/ModalController';
import UpdateNotification from '../ui/UpdateNotification';
import ParticleSystem from '../effects/ParticleSystem';
import PoliceScanner from '../ui/PoliceScanner';
import DebtIntroModal from '../modals/DebtIntroModal';

/**
 * V2Prototype (Fully Playable Sandbox)
 * 
 * This component mirrors the main game logic from App.jsx but 
 * projects it into a new "Command Hub" design.
 */
const V2Prototype = () => {
    // 1. Context & Logic
    const { state: gameState, dispatch, addFloat, triggerShake } = useGame();
    const { setV2Preview, setActiveTab, activeTab, setShowMultiplayer, ignoreHeatWarning, setIgnoreHeatWarning } = useUI();
    const { t } = useLanguage();

    // 2. Local Utility States
    // Removed duplicate modal states
    const [showDrone, setShowDrone] = React.useState(false);
    const [showMusic, setShowMusic] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const { setSettingsModal, setHelpModal } = useUI();

    // 2.5 Theme System
    const theme = useV2Theme();

    // Apply theme CSS variables
    React.useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--v2-primary', theme.primary);
        root.style.setProperty('--v2-secondary', theme.secondary);
        root.style.setProperty('--v2-accent', theme.accent);
        root.style.setProperty('--v2-danger', theme.danger);
        root.style.setProperty('--v2-success', theme.success);
        root.style.setProperty('--v2-bg', theme.bg);
        root.style.setProperty('--v2-bg-glass', theme.bgGlass);
        root.style.setProperty('--v2-border-primary', theme.borderPrimary);
        root.style.setProperty('--v2-border-secondary', theme.borderSecondary);
        root.style.setProperty('--v2-glow-primary', theme.glowPrimary);
        root.style.setProperty('--v2-glow-secondary', theme.glowSecondary);
        root.style.setProperty('--v2-text-primary', theme.textPrimary);
        root.style.setProperty('--v2-text-secondary', theme.textSecondary);
    }, [theme]);

    const { setGameState, isRaid } = useGameLogic(gameState, dispatch);

    const lastLogTime = useRef(0);
    const addLog = useCallback((msg, type = 'system') => {
        const now = Date.now();
        if (type === 'system' && now - lastLogTime.current < 150) return;
        lastLogTime.current = now;

        if (type === 'success' || type === 'story') playSound('success');
        if (type === 'error') playSound('error');

        setGameState(prev => ({
            ...prev,
            logs: [{ msg, type, time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
        }));
    }, [setGameState]);

    const {
        doPrestige, attackBoss, sabotageRival, raidRival, liberateTerritory,
        bribePolice, handleMissionChoice, buyHype, buyBribeSultan, buyIntel,
        purchaseLuxuryItem, purchaseMasteryPerk, strikeRival, triggerMarketTrend,
        activateGhostMode, exportSave, importSave, hardReset
    } = useGameActions(
        gameState,
        setGameState,
        dispatch,
        addLog,
        triggerShake
    );

    // 4. Background Game Logic
    useAchievements(gameState, dispatch, addLog);
    useTutorial(gameState, setGameState);
    useKeyboard();
    useOfflineSystem(gameState, dispatch);

    // 3. Drone Logic (Mirrored from App.jsx)
    const lastDroneSpawn = useRef(Date.now());

    const handleDroneCapture = useCallback((caught) => {
        setShowDrone(false);
        if (caught) {
            const rewardType = Math.random() > 0.5 ? 'cash' : 'hype';
            if (rewardType === 'cash') {
                const amount = Math.floor((gameState.dirtyCash || 1000) * 0.1) + 5000;
                setGameState(prev => ({
                    ...prev,
                    dirtyCash: prev.dirtyCash + amount
                }));
                addLog(`DRONE NEDSKUDT: Du stjal ${formatNumber(amount)} kr!`, 'success');
                playSound('success');
            } else {
                setGameState(prev => ({
                    ...prev,
                    activeBuffs: { ...prev.activeBuffs, hype: Date.now() + 180000 } // Elevated bonus for V2: 3min
                }));
                addLog(`DRONE HACKET: SYSTEM HYPE AKTIVERET (180s)`, 'success');
                playSound('levelup');
            }
        }
    }, [gameState.dirtyCash, setGameState, addLog]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const timeSinceLast = now - lastDroneSpawn.current;
            const FIFTEEN_MINUTES = 15 * 60 * 1000;

            if (!showDrone && timeSinceLast > FIFTEEN_MINUTES && Math.random() > 0.7) {
                setShowDrone(true);
                lastDroneSpawn.current = now;
                addLog('⚠️ RADAR: Uidentificeret drone observeret!', 'warning');
            }
        }, 60000); // Check every 60s

        return () => clearInterval(interval);
    }, [showDrone, addLog]);

    // Navigation Icons (Localized)
    const navItems = [
        { id: 'sultan', icon: 'fa-user-secret', label: t('tabs.sultan') },
        { id: 'production', icon: 'fa-flask', label: t('tabs.production') },
        { id: 'rivals', icon: 'fa-skull-crossbones', label: t('tabs.rivals') },
        { id: 'finance', icon: 'fa-chart-line', label: t('tabs.finance') },
        { id: 'management', icon: 'fa-users', label: t('tabs.management') },
        { id: 'empire', icon: 'fa-crown', label: t('tabs.empire') },
    ];

    return (
        <div className="fixed inset-0 bg-[#020617] text-white overflow-hidden flex flex-col font-sans select-none animate-in fade-in duration-700 z-[999]">
            {/* HEAT ENVIRONMENTAL EFFECTS */}
            {/* HEAT VIGNETTE (Visual Alarm) */}
            <div className={`heat-vignette ${(gameState.heat || 0) >= 400 ? 'critical' : ((gameState.heat || 0) >= 250 ? 'active' : '')}`} style={{ zIndex: 50 }} />
            {gameState.isSalesPaused && <div className="sales-paused-vignette" style={{ zIndex: 1000 }} />}

            {/* DESKTOP HEADER - Shows on desktop (md+) */}
            <div className="flex h-[88px] items-center justify-between px-12 border-b border-cyan-500/20 bg-black z-[1001] relative overflow-hidden shrink-0 shadow-[0_4px_30px_rgba(0,0,0,0.8)] max-md:hidden">
                {/* HUD DECORATIVE FRAME */}
                <div className="absolute inset-x-8 top-4 bottom-4 pointer-events-none border border-white/5 rounded-sm">
                    <div className="absolute top-0 left-0 w-8 h-[2px] bg-amber-500/50"></div>
                    <div className="absolute top-0 left-0 w-[2px] h-8 bg-amber-500/50"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-[2px] bg-cyan-500/50"></div>
                    <div className="absolute bottom-0 right-0 w-[2px] h-8 bg-cyan-500/50"></div>
                    {/* Interior HUD lines */}
                    <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                </div>

                <div className="flex items-center gap-12 relative z-10 w-full">
                    {/* LOGO BLOCK */}
                    <div className="flex flex-col min-w-[240px]">
                        <span className="text-[9px] font-mono tracking-[0.6em] uppercase mb-0.5" style={{ color: 'var(--v2-primary)', opacity: 0.6 }}>{t('header.v2.link_stable')}</span>
                        <h1 className="text-3xl font-black italic tracking-tighter uppercase flex items-baseline">
                            <span style={{ color: 'var(--v2-secondary)', filter: 'drop-shadow(0 0 12px var(--v2-glow-secondary))' }}>SYNDICATE</span>
                            <span className="ml-2" style={{ color: 'var(--v2-primary)', filter: 'drop-shadow(0 0 12px var(--v2-glow-primary))' }}>OS</span>
                        </h1>
                    </div>

                    {/* CENTRAL CLUSTER - DENSE DATA */}
                    {/* FINANCIAL CLUSTER */}
                    <div className="bg-black/60 rounded-lg px-8 py-2.5 backdrop-blur-xl flex items-center gap-12 relative group shadow-2xl" style={{ borderColor: 'var(--v2-border-primary)' }}>
                        {/* Clean Cash Section */}
                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-full flex items-center justify-center text-lg relative overflow-hidden border" style={{ borderColor: 'var(--v2-border-primary)', color: 'var(--v2-text-primary)' }}>
                                <div className="absolute inset-0 opacity-10" style={{ backgroundColor: 'var(--v2-primary)' }}></div>
                                <i className="fa-solid fa-money-bill-wave relative z-10"></i>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">{t('header.v2.clean_cash_label')}</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-mono font-black leading-none" style={{ color: 'var(--v2-text-primary)' }}>
                                        {formatNumber(gameState.cleanCash)}
                                    </span>
                                    <span className="text-[10px] font-black text-white/30 tracking-wider">{t('header.v2.kroner')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-10 w-[1px] bg-white/5"></div>

                        {/* Dirty Cash Section */}
                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-[inset_0_0_10px_rgba(245,158,11,0.1)]">
                                <i className="fa-solid fa-coins text-lg"></i>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">{t('header.v2.dirty_cash_label')}</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-mono font-black text-white/90 leading-none">
                                        {formatNumber(gameState.dirtyCash)}
                                    </span>
                                    <span className="text-[10px] font-black text-white/30 tracking-wider uppercase">KRONER</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* HEAT CLUSTER */}
                    <div className={`bg-black/60 border ${gameState.heat > 400 ? 'border-red-500 animate-pulse' : 'border-red-500/30'} rounded-lg px-6 py-2.5 backdrop-blur-xl relative min-w-[340px] h-[64px] flex flex-col justify-end group shadow-2xl overflow-hidden transition-colors duration-500`}>
                        {/* TACTICAL BAR CHART PATTERN */}
                        <div className="absolute top-2 left-6 right-6 h-6 opacity-30 pointer-events-none flex items-end gap-1 px-1">
                            {[15, 25, 60, 40, 80, 45, 70, 30, 90, 50, 60, 40, 75, 55].map((h, i) => (
                                <div key={i} className="flex-1 bg-red-800/60" style={{ height: `${h}%` }}></div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between relative z-10 mb-2">
                            <div className="flex items-center gap-2">
                                <i className="fa-solid fa-fire text-red-500 text-[10px] animate-pulse"></i>
                                <span className="text-[11px] font-black text-white underline underline-offset-4 decoration-red-500/50 tracking-widest uppercase">{t('header.v2.heat_meter')}</span>
                            </div>
                            <div className="flex gap-1.5 opacity-60">
                                <i className="fa-solid fa-car-side text-[9px] text-red-500"></i>
                                <i className="fa-solid fa-car-side text-[9px] text-red-500 animate-bounce"></i>
                            </div>
                        </div>

                        <div className="flex gap-1.5 h-3.5 relative z-10 px-0.5">
                            {[...Array(6)].map((_, i) => {
                                const threshold = (i + 1) * (500 / 6);
                                const isActive = gameState.heat >= threshold;
                                return (
                                    <div
                                        key={i}
                                        className={`flex-1 rounded-[1px] transition-all duration-700 ${isActive ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]' : 'bg-white/5 border border-white/5'}`}
                                    />
                                );
                            })}
                            {/* Marker */}
                            <div className="absolute h-7 w-1 bg-white/60 -top-2 rounded-full" style={{ left: `${Math.min(100, (gameState.heat / 500) * 100)}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* RIGHT CLUSTER - OPERATIONAL STATUS */}
                <div className="flex-1 flex items-center justify-end">
                    <div className="bg-black/60 rounded-lg px-8 py-2.5 backdrop-blur-xl flex items-center gap-8 relative group shadow-2xl min-w-[400px]" style={{ borderColor: 'var(--v2-border-primary)' }}>
                        {/* Rank & Identity */}
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em] mb-1">{t('header.v2.operator_id')}</span>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-mono text-base font-black border-2 relative overflow-hidden" style={{ borderColor: 'var(--v2-border-primary)', color: 'var(--v2-text-primary)' }}>
                                    <div className="absolute inset-0 opacity-15" style={{ backgroundColor: 'var(--v2-primary)' }}></div>
                                    <span className="relative z-10">{gameState.level}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-black italic uppercase tracking-tight" style={{ color: 'var(--v2-text-secondary)' }}>
                                        {t(`ranks.${gameState.level || 0}`)}
                                    </span>
                                    <div className="flex gap-1 mt-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className={`w-3 h-1 rounded-full ${i < Math.min(gameState.level, 5) ? 'opacity-100' : 'opacity-20'}`} style={{ backgroundColor: 'var(--v2-secondary)' }}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-10 w-[1px] bg-white/5"></div>

                        {/* Territory Control */}
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">{t('header.v2.sectors')}</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-mono font-black leading-none" style={{ color: 'var(--v2-text-primary)' }}>
                                    {gameState.territories?.filter(t => t.owned).length || 0}
                                </span>
                                <span className="text-[10px] font-black text-white/30 tracking-wider">/ {gameState.territories?.length || 0}</span>
                            </div>
                        </div>

                        <div className="h-10 w-[1px] bg-white/5"></div>

                        {/* Staff Count */}
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">{t('header.v2.crew')}</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-mono font-black leading-none" style={{ color: 'var(--v2-text-secondary)' }}>
                                    {(gameState.staff?.producers || 0) + (gameState.staff?.sellers || 0)}
                                </span>
                                <span className="text-[10px] font-black text-white/30 tracking-wider">{t('header.v2.active')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MOBILE HEADER - Only shows on mobile */}
            <div className="md:hidden h-[50px] flex items-center justify-between px-3 border-b border-cyan-500/20 bg-black z-[1001] relative shrink-0">
                {/* Burger + Logo */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                    >
                        <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-cyan-400 text-lg`}></i>
                    </button>
                    <h1 className="text-sm font-black italic tracking-tighter uppercase">
                        <span style={{ color: 'var(--v2-secondary)' }}>SYN</span>
                        <span className="ml-0.5" style={{ color: 'var(--v2-primary)' }}>OS</span>
                    </h1>
                </div>

                {/* Stat Pills */}
                <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1 bg-black/60 border border-cyan-500/20 rounded-md px-1.5 py-1">
                        <i className="fa-solid fa-gem text-cyan-400 text-[10px]"></i>
                        <span className="text-[10px] font-mono font-black text-white">{formatNumber(gameState.cleanCash, true)}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-black/60 border border-amber-500/20 rounded-md px-1.5 py-1">
                        <i className="fa-solid fa-coins text-amber-500 text-[10px]"></i>
                        <span className="text-[10px] font-mono font-black text-white">{formatNumber(gameState.dirtyCash, true)}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-black/60 border border-purple-500/20 rounded-md px-1.5 py-1">
                        <span className="text-[9px] font-black text-purple-400">LV</span>
                        <span className="text-[10px] font-mono font-black text-white">{gameState.level}</span>
                    </div>
                    <div className={`flex items-center gap-1 bg-black/60 border rounded-md px-1.5 py-1 ${gameState.heat > 70 ? 'border-red-500/50 animate-pulse' : 'border-red-500/20'}`}>
                        <i className="fa-solid fa-fire text-red-500 text-[10px]"></i>
                        <span className="text-[10px] font-mono font-black text-white">{Math.floor(gameState.heat)}%</span>
                    </div>
                </div>
            </div>

            {/* MOBILE BURGER MENU */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-[1002] flex">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
                    <div className="relative w-64 bg-black/95 backdrop-blur-xl border-r border-cyan-500/20 shadow-2xl flex flex-col">
                        <div className="p-4 border-b border-white/10">
                            <h2 className="text-xl font-black italic uppercase tracking-tight">
                                <span style={{ color: 'var(--v2-secondary)' }}>SYNDICATE</span>
                                <span className="ml-2" style={{ color: 'var(--v2-primary)' }}>OS</span>
                            </h2>
                            <p className="text-[9px] text-cyan-500/60 uppercase tracking-widest mt-1">COMMAND_MENU</p>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            <button onClick={() => { setActiveTab('network'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'network' ? 'bg-cyan-500 text-black' : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'}`}>
                                <i className="fa-solid fa-map-location-dot text-lg"></i>
                                <span className="font-bold uppercase text-sm">{t('tabs.network')}</span>
                            </button>
                            {navItems.map(item => (
                                <button key={item.id} onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === item.id ? 'bg-amber-500 text-black' : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'}`}>
                                    <i className={`fa-solid ${item.icon} text-lg`}></i>
                                    <span className="font-bold uppercase text-sm">{item.label}</span>
                                </button>
                            ))}
                            <button
                                onClick={() => { setShowMultiplayer(true); setIsMobileMenuOpen(false); }}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20"
                            >
                                <i className="fa-solid fa-users text-lg"></i>
                                <span className="font-bold uppercase text-sm">{t('tabs.multiplayer')} (BETA)</span>
                            </button>
                        </div>
                        <div className="p-4 border-t border-white/10 space-y-2">
                            <button onClick={() => { setShowSettings(true); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-all">
                                <i className="fa-solid fa-cog"></i>
                                <span className="font-bold text-sm">{t('ui.settings')}</span>
                            </button>
                            <button onClick={() => { setShowHelp(true); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-all">
                                <i className="fa-solid fa-question-circle"></i>
                                <span className="font-bold text-sm">{t('ui.help')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. MAIN WORKSPACE */}
            <div className="flex-1 flex relative">

                {/* VERTICAL LAUNCHER - Shows on desktop (md+) */}
                <div className="flex w-24 bg-black/80 backdrop-blur-3xl border-r border-white/5 flex-col items-center py-10 gap-6 z-40 relative max-md:hidden">
                    <div
                        onClick={() => setActiveTab('network')}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl cursor-pointer transition-all duration-500 relative group ${activeTab === 'network' ? 'bg-cyan-500 text-black' : 'text-zinc-600 hover:text-white'}`}
                    >
                        <i className="fa-solid fa-map-location-dot"></i>
                    </div>

                    {navItems.map(item => (
                        <div
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl cursor-pointer transition-all duration-500 group relative ${activeTab === item.id ? 'bg-amber-500 text-black' : 'text-zinc-600 hover:text-white'}`}
                        >
                            <i className={`fa-solid ${item.icon}`}></i>
                        </div>
                    ))}

                    <div className="w-full h-[1px] bg-white/5 px-4 mt-2 mb-2"></div>

                    <div
                        onClick={() => setShowMultiplayer(true)}
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl cursor-pointer transition-all duration-500 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)] group relative"
                        title="Syndicate Network (BETA)"
                    >
                        <i className="fa-solid fa-users"></i>
                        <div className="absolute left-full ml-3 px-2 py-1 bg-purple-600 text-white text-[8px] font-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">{t('tabs.multiplayer')} (BETA)</div>
                    </div>

                    {/* OPERATIONAL TELEMETRY */}
                    <div className="mt-auto flex flex-col gap-6 w-full px-4 items-center">
                        <div className="flex flex-col items-center gap-1.5 w-full">
                            <div className="text-[7px] text-zinc-500 font-black uppercase tracking-widest">CPU.LOD</div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-cyan-400 animate-pulse" style={{ width: '64%' }}></div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 w-full">
                            <div className="text-[7px] text-zinc-500 font-black uppercase tracking-widest">MEM.USE</div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500" style={{ width: '42%' }}></div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 w-full">
                            <div className="text-[7px] text-zinc-500 font-black uppercase tracking-widest">NET.SIG</div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-400" style={{ width: '91%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DYNAMIC CANVAS */}
                <div className={`flex-1 relative ${isRaid ? 'bg-red-950/20' : 'bg-[#020617]'} transition-colors duration-1000`}>
                    {isRaid && (
                        <div className="absolute top-0 inset-x-0 h-1 z-[60] bg-red-600 animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.8)]">
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[8px] font-black px-4 py-1 rounded-b uppercase tracking-[0.5em] shadow-xl">
                                !! POLICE_RAID_IN_PROGRESS !!
                            </div>
                        </div>
                    )}
                    <div className="absolute inset-0">
                        <TacticalMap
                            state={gameState}
                            setState={setGameState}
                            addLog={addLog}
                            addFloat={addFloat}
                            liberateTerritory={liberateTerritory}
                        />
                    </div>

                    {activeTab !== 'network' && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-black/80 backdrop-blur-sm">
                            <div className="w-full max-w-[95rem] h-full bg-[#020617]/90 backdrop-blur-[60px] border border-cyan-500/20 rounded-[2rem] flex flex-col overflow-hidden relative shadow-[0_0_100px_rgba(34,211,238,0.1)]">
                                {/* OPERATIONAL MODAL HEADER */}
                                <div className="h-20 flex items-center justify-between px-10 border-b border-cyan-500/10 bg-black/40 shrink-0">
                                    <div className="flex items-center gap-6">
                                        <div className="w-11 h-11 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-xl shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                                            <i className={`fa-solid ${navItems.find(n => n.id === activeTab)?.icon || 'fa-folder'}`}></i>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-mono text-cyan-500/40 tracking-[0.4em] uppercase">OPERATIONAL_PROTOCOL</span>
                                            <h2 className="text-2xl font-black italic uppercase tracking-tight text-white">{navItems.find(n => n.id === activeTab)?.label} SYSTEM</h2>
                                        </div>
                                    </div>
                                    <button onClick={() => setActiveTab('network')} className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 text-zinc-500 hover:text-red-400 border border-white/5">
                                        <i className="fa-solid fa-xmark text-2xl"></i>
                                    </button>
                                </div>

                                {/* MODAL WORKSPACE */}
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-12 relative">
                                    <div className="max-w-7xl mx-auto min-h-full">
                                        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-md">
                                            {activeTab === 'sultan' && <SultanTab state={gameState} setState={setGameState} addLog={addLog} handleChoice={handleMissionChoice} buyHype={buyHype} buyBribe={buyBribeSultan} buyIntel={buyIntel} triggerMarketTrend={triggerMarketTrend} />}
                                            {activeTab === 'production' && <ProductionTab state={gameState} setState={setGameState} addLog={addLog} addFloat={addFloat} />}
                                            {activeTab === 'rivals' && <RivalsTab state={gameState} setState={setGameState} addLog={addLog} addFloat={addFloat} sabotageRival={sabotageRival} raidRival={raidRival} bribePolice={bribePolice} strikeRival={strikeRival} />}
                                            {activeTab === 'finance' && <FinanceTab state={gameState} setState={setGameState} addLog={addLog} addFloat={addFloat} purchaseLuxury={purchaseLuxuryItem} />}
                                            {activeTab === 'management' && <ManagementTab state={gameState} setState={setGameState} addLog={addLog} addFloat={addFloat} />}
                                            {activeTab === 'empire' && <EmpireTab state={gameState} doPrestige={doPrestige} purchaseMastery={purchaseMasteryPerk} />}
                                        </div>
                                    </div>
                                </div>

                                {/* MODAL FOOTER */}
                                <div className="h-12 bg-black/60 px-12 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] relative z-10">
                                    <div className="flex items-center gap-8">
                                        <span>ENCRYPTION_STABLE</span>
                                        <span className="opacity-40">|</span>
                                        <span>ROOT@SYNDICATE_OS:/#</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span>AUTH_SIG: {gameState.level * 1024}x99</span>
                                        <div className="h-4 w-[1px] bg-white/10"></div>
                                        <span className="text-white/40">{new Date().toLocaleTimeString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div >

            {/* 3. TERMINAL FOOTER */}
            < div className="h-12 bg-black/80 backdrop-blur-3xl border-t border-white/5 flex items-center px-8 gap-8 z-[1001] relative overflow-hidden" >
                <div className="flex items-center gap-3 text-[10px] font-black tracking-[0.4em] text-cyan-400">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                    SECURE_LINK_084
                </div>
                <div className="flex-1 overflow-hidden relative h-full flex items-center group">
                    <NewsTicker logs={gameState.logs} />
                </div>

                {/* UTILITY CLUSTER (SYSTEM TRAY) */}
                <div className="flex items-center gap-4 border-l border-white/10 pl-8">
                    <button
                        onClick={() => setShowMultiplayer(true)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-purple-400 hover:text-white bg-purple-500/10 hover:bg-purple-500/30 transition-all border border-purple-500/20"
                        title="Multiplayer Network"
                    >
                        <i className="fa-solid fa-users"></i>
                    </button>
                    <button
                        onClick={() => setShowMusic(!showMusic)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${showMusic ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'text-zinc-500 hover:text-white bg-white/5'}`}
                        title="Neural Audio Feed"
                    >
                        <i className={`fa-solid ${showMusic ? 'fa-compact-disc fa-spin' : 'fa-music'}`}></i>
                    </button>
                    <button
                        onClick={() => setHelpModal(true)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-cyan-400 bg-white/5 transition-all"
                        title="Quantum Handbook"
                    >
                        <i className="fa-solid fa-circle-question"></i>
                    </button>
                    <button
                        onClick={() => setSettingsModal(true)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-amber-400 bg-white/5 transition-all"
                        title="System Configurations"
                    >
                        <i className="fa-solid fa-gears"></i>
                    </button>
                </div>

                <div className="hidden lg:flex items-center gap-6 text-[10px] font-mono text-zinc-700 font-black">
                    <div>55.6761°N / 12.5683°E</div>
                    <div className="border-l border-white/10 pl-6 h-6 flex items-center">{CONFIG.fps || 60} FPS</div>
                    <div
                        onClick={() => window.location.reload(true)}
                        className="border-l border-white/10 pl-6 h-6 flex items-center cursor-pointer hover:text-cyan-400 transition-colors"
                        title="Click to Force Update"
                    >
                        v{CONFIG.version}
                    </div>
                </div>
            </div >

            {/* GLOBAL MODALS INTEGRATION - Handled by ModalController below */}

            {/* DOCKED MUSIC PLAYER */}
            {
                showMusic && (
                    <div className="absolute bottom-20 right-8 z-[2000] animate-in slide-in-from-bottom-4 duration-300">
                        <MusicPlayer />
                    </div>
                )
            }

            {/* GHOST MODE EMERGENCY OVERLAY (Softlock Fix: Respect ignoreHeatWarning and pass onCancel) */}
            {
                !ignoreHeatWarning && (
                    <GhostMode
                        state={gameState}
                        activateGhostMode={activateGhostMode}
                        onCancel={() => setIgnoreHeatWarning(true)}
                    />
                )
            }

            {/* GAMEPLAY OVERLAYS */}
            {showDrone && <GoldenDrone onCapture={handleDroneCapture} />}
            <PoliceScanner heat={gameState.heat} />

            {/* DEBT MODE INTRO (Parity Fix) */}
            {gameState.mode === 'debt' && !gameState.debtIntroShown && (
                <DebtIntroModal
                    debtAmount={gameState.debt || 10000000}
                    onClose={() => setGameState(prev => ({ ...prev, debtIntroShown: true }))}
                />
            )}

            {/* TUTORIAL OVERLAY */}
            {
                gameState.tutorial?.active && (
                    <TutorialOverlay
                        currentStep={currentStep}
                        onComplete={completeTutorialStep}
                    />
                )
            }

            {/* MODAL CONTROLLER (Boss, Raid, Welcome) */}
            <ModalController
                gameState={gameState}
                setGameState={setGameState}
                hardReset={hardReset}
                exportSave={exportSave}
                importSave={importSave}
                attackBoss={attackBoss}
            />

            {/* UPDATE NOTIFICATION */}
            <UpdateNotification />

            {/* PARTICLE SYSTEM */}
            {gameState.settings?.particles !== false && <ParticleSystem />}
        </div >
    );
};

export default V2Prototype;
