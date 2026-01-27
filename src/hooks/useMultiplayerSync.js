import { useEffect } from 'react';
import { getNetWorth } from '../utils/gameMath';

/**
 * useMultiplayerSync Hook
 * 
 * Responsibilities:
 * 1. Broadcasts local stats to the connected peer every 2 seconds.
 * 2. Parses incoming data (SYNC, ATTACK) and could trigger local state changes (future).
 */
const useMultiplayerSync = (gameState, peerInterface) => {
    const { sendData, isConnected } = peerInterface;

    // BROADCAST LOOP
    useEffect(() => {
        if (!isConnected) return;

        const interval = setInterval(() => {
            const payload = {
                type: 'SYNC',
                timestamp: Date.now(),
                stats: {
                    name: "Unknown Boss", // Placeholder for actual player name if added later
                    title: gameState.levelTitle || "Street Rat",
                    level: gameState.level,
                    heat: gameState.heat,
                    cash: gameState.cleanCash, // Only showing Clean Cash to rival? Or Total? Let's show Net Worth + Dirty
                    netWorth: getNetWorth(gameState),
                    dirtyCash: gameState.dirtyCash
                }
            };

            // console.log('[Sync] Broadcasting:', payload);
            sendData(payload);

        }, 2000); // 2 Seconds Heartbeat

        return () => clearInterval(interval);
    }, [gameState, isConnected, sendData]);

    return; // Logic only, no return values needed as it uses peerInterface's lastPeerData directly in UI
};

export default useMultiplayerSync;
