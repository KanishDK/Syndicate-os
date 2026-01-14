import React, { useState, useCallback } from 'react';
import { CONFIG } from './config/gameConfig';
import { useGame } from './context/GameContext';
import { playSound } from './utils/audio';

// Hooks
import { useAchievements } from './hooks/useAchievements';
import { useTutorial } from './hooks/useTutorial';
import { useKeyboard } from './hooks/useKeyboard';
import { useOfflineSystem } from './hooks/useOfflineSystem';
import { useGameLogic } from './hooks/useGameLogic';
import { useGameActions } from './hooks/useGameActions';

// Components
import BootSequence from './components/BootSequence';
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

// Layout & Modals
import GameLayout from './components/layout/GameLayout';
import ModalController from './components/modals/ModalController';

import { useLanguage } from './context/LanguageContext';
import LanguageSelector from './components/LanguageSelector';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/ui/ToastContainer';
import PoliceScanner from './components/ui/PoliceScanner';
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
        raidModalData, setRaidModalData,
        buyAmount, setBuyAmount,
        showBoot, setShowBoot,
        showDrone, setShowDrone
    } = useUI();

    // 3. Logic & Offline Systems (Refactored Phase 1)
    const { setGameState, isRaid } = useGameLogic(gameState, dispatch);
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

    // Drone Logic (Moved here to access addLog)
    React.useEffect(() => {
        // Spawn every 2 minutes check
        const interval = setInterval(() => {
            if (!showDrone && Math.random() > 0.3) {
                setShowDrone(true);
                // addLog might be stale if closure constraint, but here it's const from useMemo/Callback
                addLog('⚠️ RADAR: Ukendt drone observeret!', 'warning');
                // playSound('drone'); // Removed - annoying notification sound
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [showDrone, addLog]);

    useAchievements(gameState, dispatch, addLog);
    useTutorial(gameState, setGameState);
    useKeyboard();

    const {
        hardReset, exportSave, importSave, doPrestige, attackBoss,
        handleNewsAction, sabotageRival, raidRival, liberateTerritory,
        bribePolice, handleMissionChoice, buyHype, buyBribeSultan,
        purchaseLuxuryItem, purchaseMasteryPerk, strikeRival, activateGhostMode, triggerMarketTrend
    } = useGameActions(
        gameState,
        setGameState,
        dispatch,
        addLog,
        triggerShake
    );

    // Boot Sequence Logic (First-time users only)
    React.useEffect(() => {
        if (gameState && !gameState.bootShown && gameState.level === 1 && language) {
            setShowBoot(true);
        }
    }, [gameState, language]);

    const handleBootComplete = () => {
        setShowBoot(false);
        setGameState(prev => ({ ...prev, bootShown: true }));
    };

    // Show Language Selector if not set
    if (!language) {
        return <LanguageSelector />;
    }

    // Safety check
    if (!gameState) return <div className="text-theme-text-primary p-10">Loading Syndicate OS...</div>;

    // Show boot sequence for first-time users
    if (showBoot) {
        return <BootSequence onComplete={handleBootComplete} />;
    }

    return (
        <>
            <ParticleSystem />
            <TutorialOverlay />
            <div className={`heat-vignette ${gameState.heat >= 90 ? 'critical' : (gameState.heat >= 70 ? 'active' : '')}`} />
            <PoliceScanner heat={gameState.heat} />
            {showDrone && <GoldenDrone onCapture={handleDroneCapture} />}
            {gameState.isSalesPaused && <div className="sales-paused-vignette" />}
            <div className={`transition-transform duration-150 ${gameState.isShaking ? 'shake-it' : ''}`}>
                <GameLayout
                    gameState={gameState}
                    addFloat={addFloat}
                    isRaid={isRaid}
                    onNewsClick={handleNewsAction}
                    bribePolice={bribePolice}
                >
                    {activeTab === 'sultan' && <SultanTab state={gameState} setState={setGameState} addLog={addLog} handleChoice={handleMissionChoice} buyHype={buyHype} buyBribe={buyBribeSultan} triggerMarketTrend={triggerMarketTrend} />}
                    {activeTab === 'production' && <ProductionTab state={gameState} setState={setGameState} addLog={addLog} addFloat={addFloat} />}
                    {activeTab === 'network' && <NetworkTab state={gameState} setState={setGameState} addLog={addLog} addFloat={addFloat} sabotageRival={sabotageRival} raidRival={raidRival} liberateTerritory={liberateTerritory} />}
                    {activeTab === 'rivals' && <RivalsTab state={gameState} setState={setGameState} addLog={addLog} addFloat={addFloat} sabotageRival={sabotageRival} raidRival={raidRival} bribePolice={bribePolice} strikeRival={strikeRival} />}
                    {activeTab === 'finance' && <FinanceTab state={gameState} setState={setGameState} addLog={addLog} addFloat={addFloat} purchaseLuxury={purchaseLuxuryItem} />}
                    {activeTab === 'management' && <ManagementTab state={gameState} setState={setGameState} addLog={addLog} addFloat={addFloat} />}
                    {activeTab === 'empire' && <EmpireTab state={gameState} doPrestige={doPrestige} purchaseMastery={purchaseMasteryPerk} />}
                </GameLayout>
            </div>

            <GhostMode state={gameState} activateGhostMode={activateGhostMode} />

            <ModalController
                gameState={gameState}
                setGameState={setGameState}
                hardReset={hardReset}
                exportSave={exportSave}
                importSave={importSave}
                attackBoss={attackBoss}
            />
        </>
    );
}

function App() {
    return (
        <UIProvider>
            <ToastProvider>
                <GameContent />
                <ToastContainer />
            </ToastProvider>
        </UIProvider>
    );
}

export default App;
