import { useEffect } from 'react';

/**
 * useNeonFlux Hook
 * Dynamically updates CSS variables based on Game Heat to create a "Breathing" UI.
 * 
 * Mappings:
 * 0 - 249 (SAFE): Cyan/Green, Slow Pulse (4s)
 * 250 - 299 (CAUTION): Amber/Yellow, Medium Pulse (2s)
 * 300 - 424 (DANGER): Orange, Fast Pulse (1s)
 * 425+ (CRITICAL): Red, Erratic Strobe (0.2s)
 */
const useNeonFlux = (heat) => {
    useEffect(() => {
        const root = document.documentElement;
        let color = '#00ff41'; // Terminal Green (Default)
        let speed = '4s';
        let intensity = '0.3';

        // Determine State
        if (heat >= 425) {
            // CRITICAL
            color = '#ff0040'; // Terminal Red
            speed = '0.1s'; // Strobe
            intensity = '0.8';
        } else if (heat >= 300) {
            // DANGER
            color = '#ff4400'; // Orange
            speed = '0.8s';
            intensity = '0.6';
        } else if (heat >= 250) {
            // CAUTION
            color = '#ffb000'; // Amber
            speed = '2s';
            intensity = '0.4';
        } else {
            // SAFE
            color = '#00d9ff'; // Terminal Cyan
            speed = '4s';
            intensity = '0.3';
        }

        // Apply to CSS Variables
        root.style.setProperty('--flux-color', color);
        root.style.setProperty('--flux-speed', speed);
        root.style.setProperty('--flux-intensity', intensity);

    }, [heat]);
};

export default useNeonFlux;
