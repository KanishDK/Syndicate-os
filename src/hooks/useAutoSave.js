import { useEffect } from 'react';
import { STORAGE_KEY, CONFIG } from '../config/gameConfig';

export const useAutoSave = (setGameState) => {
    useEffect(() => {
        const interval = setInterval(() => {
            setGameState(prev => {
                const newState = { ...prev, lastSaveTime: Date.now() };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
                return newState;
            });
        }, CONFIG.autoSaveInterval || 15000);
        return () => clearInterval(interval);
    }, []);
};
