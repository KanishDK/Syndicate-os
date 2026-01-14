import { useEffect } from 'react';
import { useUI } from '../context/UIContext';

export const useOfflineSystem = (gameState, dispatch) => {
    const { setWelcomeModalData } = useUI();

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
    }, [dispatch, setWelcomeModalData, gameState]);
};
