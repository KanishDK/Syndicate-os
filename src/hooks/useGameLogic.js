import { useEffect, useCallback } from 'react';

export const useGameLogic = (gameState, dispatch, setRaidModalData, raidModalData) => {

    // Legacy Bridge for SetState
    const setGameState = useCallback((update) => dispatch({ type: 'SET_STATE', payload: update }), [dispatch]);

    // Event Sync (Global Event Listener for Raids/Story)
    useEffect(() => {
        if (gameState?.pendingEvent) {
            const evt = gameState.pendingEvent;
            setRaidModalData(evt.data ? { ...evt.data, type: evt.type } : { type: evt.type, ...evt });

            // Clear event
            setTimeout(() => {
                dispatch({
                    type: 'SET_STATE',
                    payload: prev => ({ ...prev, pendingEvent: null })
                });
            }, 100);
        }
    }, [gameState?.pendingEvent, dispatch, setRaidModalData]);

    const isRaid = gameState.pendingEvent?.type === 'raid' || (raidModalData && (raidModalData.type === 'raid' || !raidModalData.result));

    return { setGameState, isRaid };
};
