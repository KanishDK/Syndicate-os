import { useUI } from '../context/UIContext';
import { V2_THEMES } from '../config/v2Themes';

/**
 * Hook to get the current V2 theme configuration
 * @returns {Object} Current theme object with colors and styles
 */
export const useV2Theme = () => {
    const { v2Theme } = useUI();
    return V2_THEMES[v2Theme] || V2_THEMES.quantum_cyan;
};
