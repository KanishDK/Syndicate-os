import { useEffect } from 'react';

export const useOfflineSystem = (gameState, dispatch, setWelcomeModalData) => {
    useEffect(() => {
        if (gameState && gameState.offlineReport) {
            setWelcomeModalData(gameState.offlineReport);

            // Clear report to prevent loop
            dispatch({
                type: 'SET_STATE',
                payload: (prev) => {
                    const ns = { ...prev };
                    delete ns.offlineReport;
                    return ns;
                }
            });
        }
    }, [gameState?.offlineReport, dispatch, setWelcomeModalData]);
};
