/**
 * Design Tokens - Centralized design system values
 * Use these tokens for consistent styling across the application
 */

export const tokens = {
    colors: {
        // Brand colors
        primary: '#00ff41',
        secondary: '#b026ff',
        danger: '#ff0040',
        warning: '#ffb000',
        success: '#10b981',
        accent: '#00d9ff',

        // Semantic colors
        money: {
            clean: '#10b981',  // emerald-500
            dirty: '#f59e0b',  // amber-500
        },

        heat: {
            normal: '#3b82f6',   // blue-500
            warning: '#f97316',  // orange-500
            danger: '#ef4444',   // red-500
        },

        // Surface colors
        surface: {
            base: '#0a0a0a',
            elevated: '#18181b',
            glass: 'rgba(10, 10, 10, 0.95)',
            overlay: 'rgba(0, 0, 0, 0.8)',
        },

        // Text colors (WCAG AA compliant)
        text: {
            primary: '#ffffff',
            secondary: '#e5e7eb',    // zinc-200
            muted: '#9ca3af',        // zinc-400 (brightened)
            disabled: '#6b7280',     // zinc-500
            inverse: '#0a0a0a',
        },

        // Border colors
        border: {
            subtle: 'rgba(255, 255, 255, 0.05)',
            default: 'rgba(255, 255, 255, 0.1)',
            emphasis: 'rgba(255, 255, 255, 0.2)',
        }
    },

    spacing: {
        '0': '0px',
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
    },

    borderRadius: {
        none: '0',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        full: '9999px',
    },

    typography: {
        fontFamily: {
            terminal: "'VT323', 'Courier New', monospace",
            code: "'Fira Code', 'Consolas', monospace",
            sans: "'Inter', sans-serif",
        },

        fontSize: {
            xs: 'clamp(10px, 2vw, 12px)',
            sm: 'clamp(12px, 2.5vw, 14px)',
            base: 'clamp(14px, 3vw, 16px)',
            lg: 'clamp(16px, 3.5vw, 18px)',
            xl: 'clamp(18px, 4vw, 22px)',
            '2xl': 'clamp(22px, 5vw, 28px)',
            '3xl': 'clamp(28px, 6vw, 36px)',
        },

        lineHeight: {
            tight: '1.2',
            normal: '1.4',
            relaxed: '1.6',
        },

        fontWeight: {
            normal: '400',
            medium: '600',
            bold: '800',
        }
    },

    animations: {
        duration: {
            instant: '0ms',
            fast: '150ms',
            normal: '300ms',
            slow: '500ms',
            slower: '1000ms',
        },

        easing: {
            default: 'cubic-bezier(0.4, 0, 0.2, 1)',
            in: 'cubic-bezier(0.4, 0, 1, 1)',
            out: 'cubic-bezier(0, 0, 0.2, 1)',
            inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
            spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        }
    },

    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',

        glow: {
            green: '0 0 10px rgba(0, 255, 65, 0.6)',
            amber: '0 0 10px rgba(255, 176, 0, 0.6)',
            red: '0 0 10px rgba(255, 0, 64, 0.8)',
            blue: '0 0 10px rgba(59, 130, 246, 0.6)',
        }
    },

    zIndex: {
        base: 0,
        dropdown: 10,
        sticky: 20,
        fixed: 30,
        overlay: 40,
        modal: 50,
        popover: 60,
        tooltip: 70,
        notification: 80,
        debug: 9999,
    },

    breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',

        // Custom breakpoints
        tablet: '768px',
        tabletLandscape: '1024px',
        desktop: '1280px',
    }
};

/**
 * Helper function to get nested token values
 * @param {string} path - Dot-notation path (e.g., 'colors.text.primary')
 * @returns {any} Token value
 */
export const getToken = (path) => {
    return path.split('.').reduce((obj, key) => obj?.[key], tokens);
};

/**
 * Flatten nested object to CSS variable format
 * @param {Object} obj - Object to flatten
 * @param {string} parentKey - Parent key for recursion
 * @returns {Object} Flattened object with CSS variable names as keys
 */
const flattenObject = (obj, parentKey = '') => {
    return Object.keys(obj).reduce((acc, key) => {
        const newKey = parentKey ? `${parentKey}-${key}` : key;
        const value = obj[key];

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            // Recursively flatten nested objects
            Object.assign(acc, flattenObject(value, newKey));
        } else {
            // Convert camelCase to kebab-case and add to accumulator
            const cssKey = newKey.replace(/([A-Z])/g, '-$1').toLowerCase();
            acc[`--${cssKey}`] = value;
        }

        return acc;
    }, {});
};

/**
 * Generate CSS variables from tokens
 * @param {Object} tokensObj - Tokens object (defaults to main tokens)
 * @returns {Object} Object with CSS variable names and values
 */
export const generateCSSVariables = (tokensObj = tokens) => {
    return flattenObject(tokensObj);
};

/**
 * Convert CSS variables object to CSS string
 * @param {Object} variables - CSS variables object
 * @returns {string} CSS string ready for injection
 */
export const toCSSString = (variables) => {
    return Object.entries(variables)
        .map(([key, value]) => `  ${key}: ${value};`)
        .join('\n');
};

export default tokens;
