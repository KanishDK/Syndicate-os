import React, { useCallback } from 'react';
import { CONFIG, STORAGE_KEY } from './config/gameConfig';
import { useGame } from './context/GameContext';
import { getDefaultState } from './utils/initialState';

// Components
import BootSequence from './components/BootSequence';
import V2Prototype from './components/v2/V2Prototype';

// Core Contexts
import { useLanguage } from './context/LanguageContext';
import LanguageSelector from './components/LanguageSelector';
import { ToastProvider } from './context/ToastContext';
import CustomToastContainer from './components/ui/ToastContainer';
import { UIProvider, useUI } from './context/UIContext';

/**
 * GameContent orchestrates the boot flow and main layout selection.
 * Post-consolidation: V2Prototype is the sole interface for the game.
 */
function GameContent() {
    // 1. Context Connection
    const { state: gameState, dispatch } = useGame();
    const { language } = useLanguage();
    const { showBoot, setShowBoot } = useUI();

    const setGameState = React.useCallback(
        (update) => dispatch({ type: 'SET_STATE', payload: update }),
        [dispatch]
    );

    // 2. Boot Flow Logic
    const handleBootComplete = (mode = 'story') => {
        setShowBoot(false);

        // If 'load', we just respect the existing state (which is autoloaded by useGame)
        if (mode === 'load') return;

        // NEW GAME: RESET STATE
        localStorage.removeItem(STORAGE_KEY);
        const freshState = getDefaultState();

        setGameState(prev => {
            let newState = {
                ...freshState,
                bootShown: true,
                mode: mode
            };

            // Apply Debt Mode starting settings if chosen
            if (mode === 'debt') {
                const debtConfig = CONFIG.modes.debt;
                newState = {
                    ...newState,
                    cleanCash: debtConfig.startingCash,
                    dirtyCash: 0,
                    level: debtConfig.startingLevel,
                    debt: debtConfig.initialDebt,
                    debtStartTime: Date.now(),
                    logs: [{
                        msg: `⚠️ URGENT: Du skylder ${debtConfig.initialDebt.toLocaleString()} kr. Betal tilbage eller dø.`,
                        type: 'error',
                        time: new Date().toLocaleTimeString()
                    }, ...prev.logs]
                };
            }
            return newState;
        });
    };

    // 3. Selection Rendering
    if (!language) return <LanguageSelector />;
    if (!gameState) return <div className="text-white p-10 font-mono">INITIALIZING_SYNDICATE_OS...</div>;

    if (showBoot) {
        return (
            <BootSequence
                onComplete={handleBootComplete}
                level={gameState.level}
                gameState={gameState}
                setGameState={setGameState}
            />
        );
    }

    // MAIN ENTRY POINT (V2 Command Hub)
    return <V2Prototype />;
}

function App() {
    return (
        <UIProvider>
            <ToastProvider>
                <div className="h-full w-full bg-black overflow-hidden relative">
                    <GameContent />
                    <CustomToastContainer />
                </div>
            </ToastProvider>
        </UIProvider>
    );
}

export default App;
