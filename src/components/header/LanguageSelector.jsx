import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const LanguageSelector = () => {
    const { language, switchLanguage } = useLanguage();

    const toggleLanguage = () => {
        const newLang = language === 'en' ? 'da' : 'en';
        switchLanguage(newLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-theme-surface-elevated hover:bg-theme-surface-highlight border border-theme-border-subtle transition-all text-xs font-bold uppercase tracking-wider"
            title={language === 'en' ? 'Switch to Danish' : 'Skift til Engelsk'}
        >
            <span className="text-xl">{language === 'en' ? '🇩🇰' : '🇬🇧'}</span>
            <span className="text-theme-text-secondary">
                {language === 'en' ? 'Dansk' : 'English'}
            </span>
        </button>
    );
};

export default LanguageSelector;
