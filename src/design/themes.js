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
    colors: {
        ...tokens.colors,
        info: '#3b82f6',           // Blue for Info/Normal Heat
        cyan: '#00d9ff',           // Cyan/Accent
        shadow: 'rgba(255, 255, 255, 0.05)', // White glow for dark mode
    }
};

// Light Theme
export const lightTheme = {
    ...tokens,
    id: 'light',
    name: 'Light Mode',
    description: 'Clean light theme for daytime use',

    colors: {
        ...tokens.colors,

        // Primary color darkened for white background
        primary: '#059669',        // Emerald-600 (Better contrast than Neon Green)
        primary_rgb: '5, 150, 105',
        info: '#3b82f6',           // Keep Blue
        cyan: '#0891b2',           // Darker Cyan (Cyan-600) for contrast on white

        // Surface colors inverted
        surface: {
            base: '#fafafa',           // Very light gray
            elevated: '#ffffff',       // White
            glass: 'rgba(255, 255, 255, 0.95)',
            overlay: 'rgba(0, 0, 0, 0.3)',
        },

        // Text colors inverted & properly darkened
        text: {
            primary: '#09090b',        // Zinc-950 (Sharper black)
            secondary: '#52525b',      // Zinc-600 (Darkened from Zinc-700 for better read)
            muted: '#71717a',          // Zinc-500 (Darkened from Zinc-400)
            disabled: '#a1a1aa',       // Zinc-400
            inverse: '#ffffff',        // White
        },

        // Border colors increased contrast
        border: {
            subtle: 'rgba(0, 0, 0, 0.2)',   // Increased from 0.1
            default: 'rgba(0, 0, 0, 0.3)', // Increased from 0.15
            emphasis: 'rgba(0, 0, 0, 0.5)', // Increased from 0.25
        },

        // Shadow color for light mode (dark shadows)
        shadow: 'rgba(0, 0, 0, 0.15)',
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
        info: '#00ffff',           // Cyan-Blue for Info
        cyan: '#00ffff',           // Neon Cyan

        // Everything else stays dark
        surface: tokens.colors.surface,
        text: tokens.colors.text,
        border: tokens.colors.border,
        shadow: 'rgba(255, 0, 255, 0.2)', // Neon glow
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
        info: '#003311',           // Dark Green for Info (Matrix keeps it green)
        cyan: '#00ff88',           // Bright Green-Cyan

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
        shadow: 'rgba(0, 255, 65, 0.1)', // Green glow
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
