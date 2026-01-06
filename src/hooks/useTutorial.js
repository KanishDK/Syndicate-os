import { useEffect } from 'react';
import { playSound } from '../utils/audio';

export const useTutorial = (gameState, setGameState, setRaidModal, isModalOpen) => {
    // Auto-Advance Logic (HUD Driver)
    useEffect(() => {
        if (!gameState) return;

        const advanceTutorial = () => {
            // Play a subtle sound or flash effect
            playSound('click'); // Or a 'success' sound if available
            setGameState(prev => ({ ...prev, tutorialStep: (prev.tutorialStep || 0) + 1 }));
        };

        // Step 0: Produktion (Buy 5 hash) -> Step 1
        if (gameState.tutorialStep === 0) {
            const hashProduced = gameState.stats?.produced?.hash_lys || 0;
            if (hashProduced >= 5) {
                advanceTutorial();
            }
        }

        // Step 1: Salg (Sell 5 units) -> Step 2
        if (gameState.tutorialStep === 1) {
            const sold = gameState.stats?.sold || 0;
            if (sold >= 5) {
                advanceTutorial();
            }
        }

        // Step 2: Hvidvask (Launder 100kr) -> Step 3
        if (gameState.tutorialStep === 2) {
            const laundered = gameState.stats?.laundered || 0;
            if (laundered >= 100) {
                advanceTutorial();
            }
        }

        // Step 3: Organisation (Hire Pusher) -> Done (Step 4)
        if (gameState.tutorialStep === 3) {
            const pushers = gameState.staff?.pusher || 0;
            if (pushers >= 1) {
                advanceTutorial();
                // Optional: Final celebration modal can act as the "Graduate" event
                setRaidModal({
                    title: 'SYNDIKATET ER FØDT',
                    msg: 'Velkommen til familien. Du har lært reglerne. Sultanen har flere opgaver til dig under Sultan fanen.',
                    type: 'story',
                    onClose: () => { }
                });
            }
        }
    }, [
        gameState?.stats?.produced?.hash_lys,
        gameState?.stats?.sold,
        gameState?.stats?.laundered,
        gameState?.staff?.pusher,
        gameState?.tutorialStep,
        setGameState,
        setRaidModal
    ]);

    // Initial Welcome Trigger (Still keep this one to start the narrative)
    useEffect(() => {
        if (gameState && gameState.tutorialStep === 0 && gameState.level === 1 && !gameState.welcomeShown) {
            setRaidModal({
                title: 'VELKOMMEN TIL GADEN',
                msg: `Hør her, knægt. Du starter på bunden, men jeg ser potentiale. Jeg har installeret en 'Live Assistant' i dit system (Nederst til højre). Følg den.`,
                type: 'story',
                onClose: () => {
                    setGameState(prev => ({ ...prev, welcomeShown: true }));
                }
            });
        }
    }, [gameState?.tutorialStep, gameState?.level, gameState?.welcomeShown, setGameState, setRaidModal]);
};
