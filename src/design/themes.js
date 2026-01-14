import { tokens } from './tokens';

/**
 * Theme Definitions
 * Each theme is a variation of the base tokens
 */

// Dark Theme (Default - Current Design)
export const darkTheme = {
    ...tokens,
    id: 'dark',
    name: 'Dark Mode',
    description: 'Original dark cyberpunk theme',
};

// Light Theme
export const lightTheme = {
    ...tokens,
    id: 'light',
    name: 'Light Mode',
    description: 'Clean light theme for daytime use',

    colors: {
        ...tokens.colors,

        // Surface colors inverted
        surface: {
            base: '#fafafa',           // Very light gray
            elevated: '#ffffff',       // White
            glass: 'rgba(255, 255, 255, 0.95)',
            overlay: 'rgba(0, 0, 0, 0.3)',
        },

        // Text colors inverted
        text: {
            primary: '#0a0a0a',        // Almost black
            secondary: '#3f3f46',      // zinc-700
            muted: '#71717a',          // zinc-500
            disabled: '#a1a1aa',       // zinc-400
            inverse: '#ffffff',        // White (for badges, etc.)
        },

        // Border colors adjusted
        border: {
            subtle: 'rgba(0, 0, 0, 0.05)',
            default: 'rgba(0, 0, 0, 0.1)',
            emphasis: 'rgba(0, 0, 0, 0.2)',
        },
    },
};

// Cyberpunk Neon Theme (Alternative Dark)
export const cyberpunkTheme = {
    ...tokens,
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    description: 'Extra vibrant neon cyberpunk',

    colors: {
        ...tokens.colors,
        primary: '#ff00ff',        // Magenta
        secondary: '#00ffff',      // Cyan
        accent: '#ffff00',         // Yellow
        danger: '#ff0066',         // Hot pink
        warning: '#ff9900',        // Orange
        success: '#00ff00',        // Lime green

        // Everything else stays dark
        surface: tokens.colors.surface,
        text: tokens.colors.text,
        border: tokens.colors.border,
    },
};

// Matrix Theme (Green on Black)
export const matrixTheme = {
    ...tokens,
    id: 'matrix',
    name: 'Matrix',
    description: 'Green terminal aesthetic',

    colors: {
        ...tokens.colors,
        primary: '#00ff41',        // Keep terminal green
        secondary: '#00cc33',      // Darker green
        accent: '#00ff88',         // Lighter green
        danger: '#ff4444',         // Keep red for contrast
        warning: '#ffaa00',        // Amber
        success: '#00ff41',        // Terminal green

        surface: {
            base: '#000000',         // Pure black
            elevated: '#0a0a0a',     // Slightly lighter
            glass: 'rgba(0, 20, 0, 0.95)',
            overlay: 'rgba(0, 0, 0, 0.9)',
        },

        text: {
            primary: '#00ff41',      // Green
            secondary: '#00cc33',    // Darker green
            muted: '#008822',        // Even darker
            disabled: '#004411',     // Very dark green
            inverse: '#000000',
        },
    },
};

// Export all themes
export const themes = {
    dark: darkTheme,
    light: lightTheme,
    cyberpunk: cyberpunkTheme,
    matrix: matrixTheme,
};

export const defaultTheme = 'dark';

// Get theme by ID
export const getTheme = (themeId) => {
    return themes[themeId] || themes[defaultTheme];
};
