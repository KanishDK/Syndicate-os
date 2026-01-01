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
    const [welcomeModalData, setWelcomeModalData] = useState(null);
    const [settingsModal, setSettingsModal] = useState(false);
    const [helpModal, setHelpModal] = useState(false);
    const [raidModalData, setRaidModalData] = useState(null);
    const [activeTab, setActiveTab] = useState('production');

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

    const { hardReset, exportSave, importSave, doPrestige, attackBoss } = useGameActions(
        gameState,
        setGameState,
        dispatch,
        addLog,
        setRaidModalData,
        setActiveTab
    );

    // Safety check
    if (!gameState) return <div className="text-white p-10">Loading Syndicate OS...</div>;

    return (
        <>
            <GameLayout
                gameState={gameState}
                addFloat={addFloat}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setHelpModal={setHelpModal}
                setSettingsModal={setSettingsModal}
                isRaid={isRaid}
            >
                {activeTab === 'sultan' && <SultanTab state={gameState} setState={setGameState} addLog={addLog} />}
                {activeTab === 'production' && <ProductionTab state={gameState} setState={setGameState} addLog={addLog} addFloat={addFloat} />}
                {activeTab === 'network' && <NetworkTab state={gameState} setState={setGameState} addLog={addLog} addFloat={addFloat} />}
                {activeTab === 'rivals' && <RivalsTab state={gameState} setState={setGameState} addLog={addLog} addFloat={addFloat} />}
                {activeTab === 'finance' && <FinanceTab state={gameState} setState={setGameState} addLog={addLog} addFloat={addFloat} />}
                {activeTab === 'management' && <ManagementTab state={gameState} setState={setGameState} addLog={addLog} addFloat={addFloat} />}
                {activeTab === 'empire' && <EmpireTab state={gameState} doPrestige={doPrestige} />}
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
