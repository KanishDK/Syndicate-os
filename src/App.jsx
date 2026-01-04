import React, { useState, useCallback } from 'react';
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
import SultanTab from './components/SultanTab';
import NetworkTab from './components/NetworkTab';
import EmpireTab from './components/EmpireTab';
import ProductionTab from './components/ProductionTab';
import FinanceTab from './components/FinanceTab';
import ManagementTab from './components/ManagementTab';
import RivalsTab from './components/RivalsTab';

// Layout & Modals
import GameLayout from './components/layout/GameLayout';
import ModalController from './components/modals/ModalController';

function App() {
    // 1. Context Connection
    const { state: gameState, dispatch, addFloat } = useGame();
    // 2. UI State
    const [showBoot, setShowBoot] = useState(false);
    const [welcomeModalData, setWelcomeModalData] = useState(null);
    const [settingsModal, setSettingsModal] = useState(false);
    const [helpModal, setHelpModal] = useState(false);
    const [raidModalData, setRaidModalData] = useState(null);
    const [activeTab, setActiveTab] = useState('production');
    const [buyAmount, setBuyAmount] = useState(1); // Global Buy Amount: 1, 10, 'max'
    const [showDrone, setShowDrone] = useState(false); // Drone State

    // Drone Logic
    React.useEffect(() => {
        // Spawn every 2 minutes check
        const interval = setInterval(() => {
            if (!showDrone && Math.random() > 0.3) {
                setShowDrone(true);
                addLog('⚠️ RADAR: Ukendt drone observeret!', 'warning');
                playSound('alarm');
            }
        }, 30000); // Check every 30s for testing (usually 120000)

        return () => clearInterval(interval);
    }, [showDrone]);

    const handleDroneCapture = (caught) => {
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
    };

    // 3. Logic & Offline Systems (Refactored Phase 1)
    const { setGameState, isRaid } = useGameLogic(gameState, dispatch, setRaidModalData, raidModalData);
    useOfflineSystem(gameState, dispatch, setWelcomeModalData);

    // 4. Custom Hooks (Logic Extraction)
    const addLog = useCallback((msg, type = 'system') => {
        if (type === 'success' || type === 'story') playSound('success');
        if (type === 'error') playSound('error');

        setGameState(prev => ({
            ...prev,
            logs: [{ msg, type, time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
        }));
    }, [setGameState]);

    useAchievements(gameState, dispatch, addLog);
    useTutorial(gameState, setGameState, setRaidModalData, !!raidModalData);
    const modals = React.useMemo(() => [
        { isOpen: settingsModal, onClose: () => setSettingsModal(false) },
        { isOpen: !!welcomeModalData, onClose: () => setWelcomeModalData(null) },
        { isOpen: !!raidModalData, onClose: () => setRaidModalData(null) }
    ], [settingsModal, welcomeModalData, raidModalData]);

    useKeyboard(setActiveTab, modals);

    const { hardReset, exportSave, importSave, doPrestige, attackBoss, handleNewsAction, sabotageRival, raidRival, bribePolice } = useGameActions(
        gameState,
        setGameState,
        dispatch,
        addLog,
        setRaidModalData,
        setActiveTab
    );

    // Boot Sequence Logic (First-time users only)
    React.useEffect(() => {
        if (gameState && !gameState.bootShown && gameState.level === 1) {
            setShowBoot(true);
        }
    }, [gameState]);

    const handleBootComplete = () => {
        setShowBoot(false);
        setGameState(prev => ({ ...prev, bootShown: true }));
    };

    // Safety check
    if (!gameState) return <div className="text-white p-10">Loading Syndicate OS...</div>;

    // Show boot sequence for first-time users
    if (showBoot) {
        return <BootSequence onComplete={handleBootComplete} />;
    }

    return (
        <>
            <ParticleSystem />
            {showDrone && <GoldenDrone onCapture={handleDroneCapture} />}
            <GameLayout
                gameState={gameState}
                addFloat={addFloat}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setHelpModal={setHelpModal}
                setSettingsModal={setSettingsModal}
                isRaid={isRaid}
                onNewsClick={handleNewsAction}
                buyAmount={buyAmount}
                setBuyAmount={setBuyAmount}
                bribePolice={bribePolice}
            >
                {activeTab === 'sultan' && <SultanTab state={gameState} setState={setGameState} addLog={addLog} />}
                {activeTab === 'production' && <ProductionTab state={gameState} setState={setGameState} addLog={addLog} addFloat={addFloat} />}
                {activeTab === 'network' && <NetworkTab state={gameState} setState={setGameState} addLog={addLog} addFloat={addFloat} sabotageRival={sabotageRival} raidRival={raidRival} />}
                {activeTab === 'rivals' && <RivalsTab state={gameState} setState={setGameState} addLog={addLog} addFloat={addFloat} sabotageRival={sabotageRival} raidRival={raidRival} bribePolice={bribePolice} />}
                {activeTab === 'finance' && <FinanceTab state={gameState} setState={setGameState} addLog={addLog} addFloat={addFloat} buyAmount={buyAmount} setBuyAmount={setBuyAmount} />}
                {activeTab === 'management' && <ManagementTab state={gameState} setState={setGameState} addLog={addLog} addFloat={addFloat} buyAmount={buyAmount} setBuyAmount={setBuyAmount} />}
                {activeTab === 'empire' && <EmpireTab state={gameState} doPrestige={doPrestige} buyAmount={buyAmount} setBuyAmount={setBuyAmount} />}
            </GameLayout>

            <ModalController
                gameState={gameState}
                setGameState={setGameState}
                welcomeModalData={welcomeModalData} setWelcomeModalData={setWelcomeModalData}
                raidModalData={raidModalData} setRaidModalData={setRaidModalData}
                settingsModal={settingsModal} setSettingsModal={setSettingsModal}
                helpModal={helpModal} setHelpModal={setHelpModal}
                hardReset={hardReset}
                exportSave={exportSave}
                importSave={importSave}
                attackBoss={attackBoss}
            />
        </>
    );
}

export default App;
