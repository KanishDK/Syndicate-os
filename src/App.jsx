import React, { useState, useCallback, useEffect } from 'react';
import { CONFIG, STORAGE_KEY } from './config/gameConfig';
import { useGame } from './context/GameContext';
import { playSound } from './utils/audio';
import { getDefaultState } from './utils/initialState';

// Hooks
import { useAchievements } from './hooks/useAchievements';
import { useTutorial } from './hooks/useTutorial';
import { useKeyboard } from './hooks/useKeyboard';
import { useOfflineSystem } from './hooks/useOfflineSystem';
import { useGameLogic } from './hooks/useGameLogic';
import { useGameActions } from './hooks/useGameActions';

// Components
import BootSequence from './components/BootSequence';
import DebtIntroModal from './components/modals/DebtIntroModal';
import GoldenDrone from './components/overlays/GoldenDrone';
import ParticleSystem from './components/effects/ParticleSystem';
import TutorialOverlay from './components/TutorialOverlay';
import SultanTab from './components/SultanTab';
import NetworkTab from './components/NetworkTab';
import EmpireTab from './components/EmpireTab';
import ProductionTab from './components/ProductionTab';
import FinanceTab from './components/FinanceTab';
import ManagementTab from './components/ManagementTab';
import RivalsTab from './components/RivalsTab';
import GhostMode from './components/GhostMode';
import ModuleContainer from './components/layout/ModuleContainer'; // New Architecture
import V2Prototype from './components/v2/V2Prototype';

// Layout & Modals
import GameLayout from './components/layout/GameLayout';
import ModalController from './components/modals/ModalController';

import { useLanguage } from './context/LanguageContext';
import LanguageSelector from './components/LanguageSelector';
import { ToastProvider } from './context/ToastContext';
import CustomToastContainer from './components/ui/ToastContainer';
import PoliceScanner from './components/ui/PoliceScanner';
import UpdateNotification from './components/ui/UpdateNotification';
import { UIProvider, useUI } from './context/UIContext';

function GameContent() {
    // 1. Context Connection
    const { state: gameState, dispatch, addFloat, triggerShake } = useGame();
    const { language } = useLanguage();

    // 2. UI State (Now from UIContext)
    const {
        activeTab, setActiveTab,
        settingsModal, setSettingsModal,
        helpModal, setHelpModal,
        welcomeModalData, setWelcomeModalData,
        buyAmount, setBuyAmount,
        showBoot, setShowBoot,
        showDrone, setShowDrone,
        ignoreHeatWarning, setIgnoreHeatWarning,
        v2Preview, // Added for sandbox
        useV2Layout // Feature toggle for V2 layout
    } = useUI();

    // 3. Logic Helpers (Local for App.jsx orchestrating)
    const setGameState = React.useCallback((update) => dispatch({ type: 'SET_STATE', payload: update }), [dispatch]);

    // 4. Custom Hooks (Logic Extraction)
    const lastLogTime = React.useRef(0);
    const addLog = useCallback((msg, type = 'system') => {
        // NYC Patch: Throttle rapid log flooding (Combat/Cheating)
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
        hardReset, exportSave, importSave, doPrestige, attackBoss,
        handleNewsAction, sabotageRival, raidRival, liberateTerritory,
        bribePolice, handleMissionChoice, buyHype, buyBribeSultan, buyIntel,
        purchaseLuxuryItem, purchaseMasteryPerk, strikeRival, activateGhostMode, triggerMarketTrend
    } = useGameActions(
        gameState,
        setGameState,
        dispatch,
        addLog,
        triggerShake
    );

    // Drone Logic (Adjusted for 15m Min Interval)
    const lastDroneSpawn = React.useRef(Date.now()); // Start timer on load

    React.useEffect(() => {
        // Check every minute
        const interval = setInterval(() => {
            const now = Date.now();
            const timeSinceLast = now - lastDroneSpawn.current;
            const FIFTEEN_MINUTES = 15 * 60 * 1000;

            // Spawn Chance: Only if > 15m passed AND random chance (30% per check)
            if (!showDrone && timeSinceLast > FIFTEEN_MINUTES && Math.random() > 0.7) {
                setShowDrone(true);
                lastDroneSpawn.current = now; // Reset timer
                addLog('⚠️ RADAR: Ukendt drone observeret!', 'warning');
            }
        }, 60000); // Check every 60s

        return () => clearInterval(interval);
    }, [showDrone, addLog]);

    useAchievements(gameState, dispatch, addLog);
    useTutorial(gameState, setGameState);
    useKeyboard();



    const handleBootComplete = (mode = 'story') => {
        setShowBoot(false);

        // If 'load', we just respect the existing state (which is autoloaded by useGame)
        if (mode === 'load') {
            return;
        }

        // NEW GAME: RESET STATE
        // 1. Wipe Storage
        localStorage.removeItem(STORAGE_KEY);

        // 2. Get Fresh State
        const freshState = getDefaultState();

        // 3. Apply Mode & Boot Flags
        setGameState(prev => {
            let newState = {
                ...freshState, // start fresh
                bootShown: true,
                mode: mode
            };

            // APPLY DEBT MODE INITIALIZATION
            if (mode === 'debt') {
                const debtConfig = CONFIG.modes.debt;
                newState = {
                    ...newState,
                    cleanCash: debtConfig.startingCash, // 500k
                    dirtyCash: 0,
                    level: debtConfig.startingLevel, // Level 10
                    debt: debtConfig.initialDebt, // 10,000,000
                    debtStartTime: Date.now(),
                    notifications: [],
                    logs: [{ msg: "⚠️ URGENT: You owe 10,000,000 kr. Pay it back in 30 minutes or you're dead.", type: 'error', time: new Date().toLocaleTimeString() }, ...prev.logs]
                };
            }
            return newState;
        });
    };

    // Show Language Selector if not set
    if (!language) {
        return <LanguageSelector />;
    }

    // Safety check
    if (!gameState) return <div className="text-theme-text-primary p-10">Loading Syndicate OS...</div>;

    // Show boot sequence for first-time users
    if (showBoot) {
        return (
            <BootSequence
                onComplete={handleBootComplete}
                level={gameState.level}
                gameState={gameState}
                setGameState={setGameState}
                hardReset={hardReset}
                exportSave={exportSave}
                importSave={importSave}
            />
        );
    }

    // If V2 Layout is enabled, render V2Prototype instead of classic layout
    if (useV2Layout) {
        return <V2Prototype />;
    }

    // 3. Logic & Offline Systems (Refactored Phase 1)
    const { isRaid } = useGameLogic(gameState, dispatch);
    useOfflineSystem(gameState, dispatch);

    const handleDroneCapture = useCallback((caught) => {
        setShowDrone(false);
        if (caught) {
            // Reward: 5-10% of current Clean Cash or Dirty Cash
            const rewardType = Math.random() > 0.5 ? 'cash' : 'hype';

            if (rewardType === 'cash') {
                const amount = Math.floor((gameState.dirtyCash || 1000) * 0.1) + 5000;
                setGameState(prev => ({
                    ...prev,
                    dirtyCash: prev.dirtyCash + amount,
                    logs: [{ msg: `DRONE NEDSKUDT: Du stjal ${amount} kr!`, type: 'success', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
                }));
                playSound('success');
            } else {
                setGameState(prev => ({
                    ...prev,
                    activeBuffs: { ...prev.activeBuffs, hype: Date.now() + 60000 }, // 60s Hype
                    logs: [{ msg: `DRONE HACKET: Gratis HYPE i 60 sekunder!`, type: 'success', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
                }));
                playSound('levelup');
            }
        }
    }, [gameState.dirtyCash, setGameState]);


    // Expose game actions for AutoPilot (Development/QA only)
    React.useEffect(() => {
        if (import.meta.env.DEV || window.location.hostname === 'localhost') {
            window.__GAME_ACTIONS__ = {
                attackBoss,
                doPrestige,
                raidRival,
                sabotageRival,
                bribePolice,
                strikeRival,
                liberateTerritory,
                activateGhostMode,
                triggerMarketTrend
            };
        }
    }, [attackBoss, doPrestige, raidRival, sabotageRival, bribePolice, strikeRival, liberateTerritory, activateGhostMode, triggerMarketTrend]);



    return (
        <>
            <ParticleSystem />
            <div className={`heat-vignette ${gameState.heat >= 90 ? 'critical' : (gameState.heat >= 70 ? 'active' : '')}`} />
            <PoliceScanner heat={gameState.heat} />
            {showDrone && <GoldenDrone onCapture={handleDroneCapture} />}
            {gameState.isSalesPaused && <div className="sales-paused-vignette" />}
            <div className={`transition-transform duration-150 ${gameState.isShaking ? 'shake-it' : ''} h-full flex-1 relative flex flex-col`}>
                <GameLayout
                    gameState={gameState}
                    addFloat={addFloat}
                    isRaid={isRaid}
                    onNewsClick={handleNewsAction}
                    bribePolice={bribePolice}
                    activateGhostMode={activateGhostMode}
                >
                    {/* --- MASTER LAYER (COMMAND HUB) --- */}
                    {/* Always visible at z-0. This is the "Map" or "Dashboard" */}
                    <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
                        <NetworkTab
                            state={gameState}
                            setState={setGameState}
                            addLog={addLog}
                            addFloat={addFloat}
                            sabotageRival={sabotageRival}
                            raidRival={raidRival}
                            liberateTerritory={liberateTerritory}
                        />
                    </div>

                    {/* --- MODULE LAYER (FULL SCREEN APP) --- */}
                    {activeTab !== 'network' && (
                        <ModuleContainer
                            onClose={() => setActiveTab('network')}
                            title={activeTab.toUpperCase()} // Simple title for now, can refine later
                        >
                            {activeTab === 'sultan' && <SultanTab state={gameState} setState={setGameState} addLog={addLog} handleChoice={handleMissionChoice} buyHype={buyHype} buyBribe={buyBribeSultan} buyIntel={buyIntel} triggerMarketTrend={triggerMarketTrend} />}
                            {activeTab === 'production' && <ProductionTab state={gameState} setState={setGameState} addLog={addLog} addFloat={addFloat} />}
                            {activeTab === 'rivals' && <RivalsTab state={gameState} setState={setGameState} addLog={addLog} addFloat={addFloat} sabotageRival={sabotageRival} raidRival={raidRival} bribePolice={bribePolice} strikeRival={strikeRival} />}
                            {activeTab === 'finance' && <FinanceTab state={gameState} setState={setGameState} addLog={addLog} addFloat={addFloat} purchaseLuxury={purchaseLuxuryItem} />}
                            {activeTab === 'management' && <ManagementTab state={gameState} setState={setGameState} addLog={addLog} addFloat={addFloat} />}
                            {activeTab === 'empire' && <EmpireTab state={gameState} doPrestige={doPrestige} purchaseMastery={purchaseMasteryPerk} />}
                        </ModuleContainer>
                    )}
                </GameLayout>
            </div>

            {/* Ghost Mode Overlay (Softlock Fix: Pass cancel handler) */}
            {!ignoreHeatWarning && <GhostMode state={gameState} activateGhostMode={activateGhostMode} onCancel={() => setIgnoreHeatWarning(true)} />}

            <ModalController
                gameState={gameState}
                setGameState={setGameState}
                hardReset={hardReset}
                exportSave={exportSave}
                importSave={importSave}
                attackBoss={attackBoss}
            />

            {/* V2 SANDBOX PREVIEW */}
            {v2Preview && <V2Prototype />}

            {/* DEBT MODE INTRO */}
            {gameState.mode === 'debt' && !gameState.debtIntroShown && (
                <DebtIntroModal
                    debtAmount={gameState.debt || 10000000}
                    onClose={() => setGameState(prev => ({ ...prev, debtIntroShown: true }))}
                />
            )}
        </>
    );
}

function App() {
    return (
        <UIProvider>
            <ToastProvider>
                <GameContent />
                <CustomToastContainer />
                <UpdateNotification />
            </ToastProvider>
        </UIProvider>
    );
}

export default App;
