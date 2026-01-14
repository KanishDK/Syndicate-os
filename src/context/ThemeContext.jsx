import React, { createContext, useContext, useState, useEffect } from 'react';
import { themes, defaultTheme, getTheme } from '../design/themes';
import { generateCSSVariables, toCSSString } from '../design/tokens';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState(() => {
        // Load from localStorage or use default
        const saved = localStorage.getItem('syndicateOS_theme');
        return saved || defaultTheme;
    });

    useEffect(() => {
        // Persist theme choice
        localStorage.setItem('syndicateOS_theme', currentTheme);

        // Get theme data
        const theme = getTheme(currentTheme);

        // Generate CSS variables from theme
        const cssVars = generateCSSVariables(theme);
        const cssString = toCSSString(cssVars);

        // Remove old theme style element if exists
        const oldStyle = document.getElementById('theme-variables');
        if (oldStyle) {
            oldStyle.remove();
        }

        // Create and inject new style element
        const styleElement = document.createElement('style');
        styleElement.id = 'theme-variables';
        styleElement.innerHTML = `:root {\n${cssString}\n}`;
        document.head.appendChild(styleElement);

        // Add theme class to body for theme-specific overrides
        document.body.className = document.body.className
            .split(' ')
            .filter(c => !c.startsWith('theme-'))
            .concat(`theme-${currentTheme}`)
            .join(' ');

        // Add data attribute for CSS selectors
        document.documentElement.setAttribute('data-theme', currentTheme);

    }, [currentTheme]);

    const switchTheme = (themeId) => {
        if (themes[themeId]) {
            setCurrentTheme(themeId);
        }
    };

    const value = {
        theme: currentTheme,
        themeData: getTheme(currentTheme),
        setTheme: switchTheme,
        availableThemes: Object.keys(themes).map(id => ({
            id,
            name: themes[id].name,
            description: themes[id].description,
        })),
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};
