import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../locales';

const LanguageContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    // Check for saved language, otherwise null (triggers selector)
    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem('syndicate_lang');
        return saved || null;
    });

    // Save preference when changed
    useEffect(() => {
        localStorage.setItem('syndicate_lang', language);
    }, [language]);

    // Translation function
    // Usage: t('ui.cash') -> "Kontanter"
    const t = (key, params = {}) => {
        const keys = key.split('.');
        let value = translations[language];

        for (const k of keys) {
            value = value?.[k];
            if (value === undefined) break;
        }

        // Fallback to simpler key or return key itself if missing
        if (value === undefined) {
            console.warn(`Missing translation for key: ${key} in language: ${language}`);
            return key;
        }

        // Interpolation logic
        if (typeof value === 'string' && params) {
            Object.entries(params).forEach(([k, v]) => {
                value = value.replace(new RegExp(`{${k}}`, 'g'), v);
            });
        }

        return value;
    };

    const value = {
        language,
        setLanguage,
        t, // translate function
        translations: translations[language] // access to full object if needed
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};
