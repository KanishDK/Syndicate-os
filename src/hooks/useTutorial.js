import { useEffect } from 'react';

export const useTutorial = (gameState, setGameState, setRaidModal, isModalOpen) => {
    // Auto-Advance Logic
    useEffect(() => {
        if (!gameState) return;

        const advanceTutorial = () => {
            setGameState(prev => ({ ...prev, tutorialStep: prev.tutorialStep + 1 }));
        };

        // Step 0: Produktion (Lav 5 hash)
        if (gameState.tutorialStep === 0) {
            const hashProduced = gameState.stats.produced?.hash_lys || 0;
            if (hashProduced >= 5 && !isModalOpen) {
                setRaidModal({
                    title: 'GODT ARBEJDE',
                    msg: 'Du har varen nu. Men de betaler ikke sig selv. Gå til Salg (højre side i Laboratoriet) og få dem ud på gaden!',
                    type: 'story',
                    onClose: advanceTutorial
                });
            }
        }

        // Step 1: Salg (Sælg 5 enheder)
        if (gameState.tutorialStep === 1) {
            if ((gameState.stats.sold || 0) >= 5) {
                setRaidModal({
                    title: 'PENGE I HÅNDEN',
                    msg: 'Du har tjent dine første Sorte Penge. Men hør her: Du kan ikke købe opgraderinger for dem endnu. Du skal bruge Finans fanen til at hvidvaske dem!',
                    type: 'story',
                    onClose: advanceTutorial
                });
            }
        }

        // Step 2: Hvidvask (Vask penge)
        if (gameState.tutorialStep === 2) {
            if ((gameState.stats.laundered || 0) >= 100) {
                setRaidModal({
                    title: 'RENE HÆNDER',
                    msg: 'Nu kører det. Brug dine Rene Penge i Organisation fanen til at ansætte en Pusher. Han sælger automatisk for dig, så du kan slappe af.',
                    type: 'story',
                    onClose: advanceTutorial
                });
            }
        }

        // Step 3: Organisation (Ansæt pusher)
        if (gameState.tutorialStep === 3) {
            if ((gameState.staff?.pusher || 0) >= 1) {
                setRaidModal({
                    title: 'SYNDIKATET ER FØDT',
                    msg: 'Velkommen til familien. Sultanen har flere opgaver til dig under Sultan fanen. Gør ham stolt, og du bliver byens konge.',
                    type: 'story',
                    onClose: advanceTutorial
                });
            }
        }
    }, [
        gameState?.stats?.produced?.hash_lys,
        gameState?.stats?.sold,
        gameState?.stats?.laundered,
        gameState?.staff?.pusher,
        gameState?.tutorialStep,
        gameState,
        isModalOpen,
        setGameState,
        setRaidModal
    ]);

    // Initial Welcome Trigger
    useEffect(() => {
        if (gameState && gameState.tutorialStep === 0 && gameState.level === 1 && !gameState.welcomeShown) {
            setRaidModal({
                title: 'VELKOMMEN TIL GADEN',
                msg: `Hør her, knægt. Du starter på bunden, men jeg ser potentiale. Start med at producere 5 enheder Hash i dit laboratorie. Vi skal have hjulene til at rulle.`,
                type: 'story',
                onClose: () => {
                    setGameState(prev => ({ ...prev, welcomeShown: true })); // REMOVED tutorialStep increment
                }
            });
        }
    }, [gameState?.tutorialStep, gameState?.level, gameState?.welcomeShown, gameState, setGameState, setRaidModal]);
};
