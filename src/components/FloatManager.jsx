
import React, { useEffect } from 'react';
import { formatNumber } from '../utils/gameMath';

const FloatManager = ({ gameState, addFloat }) => {

    useEffect(() => {
        if (!gameState.lastTick) return;
        if (gameState.settings?.particles === false) return;

        // Clean Cash Float
        if (gameState.lastTick.clean > 0) {
            // Random position near center-right or top-right
            const x = window.innerWidth * 0.7 + (Math.random() * 100 - 50);
            const y = window.innerHeight * 0.2 + (Math.random() * 50);
            addFloat(`+ ${formatNumber(gameState.lastTick.clean)} kr`, x, y, 'text-theme-success text-lg md:text-2xl');

            // Play Sound (Optional Phase 4)
        }

        // Dirty Cash Float (Only show if significant to avoid spam from trickle)
        // OR batch them. For now, showing all ticks > 0 is fine as tick is 1s.
        if (gameState.lastTick.dirty > 0) {
            const x = window.innerWidth * 0.8 + (Math.random() * 100 - 50);
            const y = window.innerHeight * 0.3 + (Math.random() * 50);
            addFloat(`+ ${formatNumber(gameState.lastTick.dirty)} sort`, x, y, 'text-theme-danger text-sm md:text-xl');
        }

    }, [addFloat, gameState.settings?.particles, gameState.lastTick]); // Triggers every tick update

    return null; // Logic only component
};

export default FloatManager;
