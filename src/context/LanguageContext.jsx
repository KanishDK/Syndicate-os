import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '../locales/en';
import { da } from '../locales/da';
import { GAME_VERSION } from '../config/gameConfig';

const LanguageContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => useContext(LanguageContext);

// Available translations
const translations = { en, da };

export const LanguageProvider = ({ children }) => {
    // Check for saved language with version validation
    // Force refresh 1
    const [language, setLanguage] = useState(() => {
        const savedLang = localStorage.getItem('syndicate_language');
        const savedVersion = localStorage.getItem('syndicate_language_version');

        // If version changed, reset to Danish
        if (savedVersion !== GAME_VERSION) {
            console.log('Version changed, resetting language to Danish');
            localStorage.setItem('syndicate_language_version', GAME_VERSION);
            localStorage.setItem('syndicate_language', 'da');
            return 'da';
        }

        // Force Danish if English was saved (since en.js is incomplete/deprecated by user request)
        if (savedLang === 'en') {
            localStorage.setItem('syndicate_language', 'da');
            return 'da';
        }

        return savedLang && ['da'].includes(savedLang) ? savedLang : 'da';
    });

    // Save language preference and version when changed
    useEffect(() => {
        if (language) {
            localStorage.setItem('syndicate_language', language);
            localStorage.setItem('syndicate_language_version', GAME_VERSION);
        }
    }, [language]);

    // Switch language function
    const switchLanguage = (newLang) => {
        if (newLang === 'en' || newLang === 'da') {
            setLanguage(newLang);
            console.log(`Language switched to: ${newLang}`);
        } else {
            console.warn(`Invalid language: ${newLang}`);
        }
    };

    // Translation function with variable interpolation
    // Usage: t('ui.cash') -> "Kontanter" (da) or "Cash" (en)
    // Usage: t('events.raid_lost_msg', { cash: '1000', product: '50', type: 'Hash' })
    const t = (key, params = {}) => {
        const keys = key.split('.');
        let value = translations[language];

        // - [x] Resolve Syntax Error (Clean Rewrite of `da.js`)
        // - [x] Fix Offline Report (Forced 'da' language to bypass broken English report)
        for (const k of keys) {
            value = value?.[k];
            if (value === undefined) break;
        }

        // Fallback to key itself if missing
        if (value === undefined) {
            console.warn(`Missing translation for key: ${key} in language: ${language}`);
            return key;
        }

        // Variable interpolation
        if (typeof value === 'string' && params && Object.keys(params).length > 0) {
            Object.entries(params).forEach(([k, v]) => {
                value = value.replace(new RegExp(`{${k}}`, 'g'), String(v));
            });
        }

        return value;
    };

    const value = {
        language,
        setLanguage: switchLanguage,
        switchLanguage,
        t,
        translations: translations[language]
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};
