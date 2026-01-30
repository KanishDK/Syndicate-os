import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../context/LanguageContext';
import ActionButton from '../ui/ActionButton';
import { CONFIG, STORAGE_KEY } from '../../config/gameConfig';

const StartMenu = ({ onNewGame, onLoadGame, onSettings, onCredits }) => {
    const { t } = useLanguage();
    const [hasSave, setHasSave] = useState(false);
    const [saveInfo, setSaveInfo] = useState(null);

    useEffect(() => {
        // Check for save file
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                setHasSave(true);
                setSaveInfo({
                    level: parsed.level || 1,
                    cash: parsed.cleanCash || 0,
                    timestamp: new Date().toLocaleDateString()
                });
            } catch (e) {
                console.error("Corrupt save found", e);
                setHasSave(false);
            }
        }
    }, []);

    const content = (
        <div className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-sm overflow-hidden animate-in fade-in duration-1000 flex flex-col items-center justify-center font-mono">

            {/* AMBIENT BACKGROUND */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,100,0.05)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,255,0,0.02)_0px,transparent_1px,transparent_2px)] opacity-50 pointer-events-none" />

            {/* MAIN CONTAINER */}
            <div className="relative z-10 max-w-md w-full p-8 flex flex-col gap-6">

                {/* HEADER */}
                <div className="text-center mb-8">
                    <h1 className="text-6xl font-black text-theme-text-primary tracking-[0.2em] italic uppercase whitespace-nowrap mb-2">
                        SYNDICATE<span className="text-theme-success drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]">OS</span>
                    </h1>
                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-theme-success/50 to-transparent" />
                    <p className="text-[10px] text-theme-success/70 tracking-[0.5em] uppercase mt-2">{t('start_menu.subtitle')}</p>
                </div>

                {/* MENU OPTIONS */}
                <div className="space-y-4">

                    {/* CONTINUE BUTTON */}
                    <div className="relative group">
                        <button
                            onClick={onLoadGame}
                            disabled={!hasSave}
                            className={`
                                w-full py-4 text-xl font-black uppercase tracking-[0.2em] transition-all duration-300 relative overflow-hidden border-2
                                ${hasSave
                                    ? 'bg-theme-success/10 border-theme-success text-theme-success hover:bg-theme-success hover:text-black hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]'
                                    : 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed opacity-50'
                                }
                            `}
                        >
                            {t('start_menu.continue')}
                            {/* SCANLINE EFFECT */}
                            {hasSave && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-[-200%] transition-transform duration-700 pointer-events-none" />}
                        </button>

                        {/* SAVE INFO TOOLTIP */}
                        {hasSave && saveInfo && (
                            <div className="absolute -right-4 translate-x-full top-1/2 -translate-y-1/2 w-48 bg-black/90 border border-theme-success/30 p-2 text-[10px] text-theme-text-muted hidden md:block opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <div className="text-theme-success font-bold">LVL {saveInfo.level} BOSS</div>
                                <div>{saveInfo.cash.toLocaleString()} kr</div>
                                <div className="opacity-50">{saveInfo.timestamp}</div>
                            </div>
                        )}
                    </div>

                    {/* NEW GAME */}
                    <button
                        onClick={onNewGame}
                        className="w-full py-4 text-xl font-black uppercase tracking-[0.2em] bg-transparent border-2 border-theme-text-muted/30 text-theme-text-muted hover:border-theme-text-primary hover:text-white transition-all duration-300 hover:bg-white/5"
                    >
                        {t('start_menu.new_game')}
                    </button>

                    {/* SETTINGS (Disabled for now or wire up if simple) */}
                    <button
                        onClick={onSettings}
                        className="w-full py-3 text-sm font-bold uppercase tracking-[0.2em] text-theme-text-muted/50 hover:text-theme-text-muted transition-colors hover:bg-white/5"
                    >
                        {t('start_menu.settings')}
                    </button>

                    {/* CREDITS */}
                    <button
                        onClick={onCredits}
                        className="w-full py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-theme-text-muted/30 hover:text-theme-text-muted/50 transition-colors"
                    >
                        v{CONFIG.version} // {t('start_menu.credits')}
                    </button>

                </div>
            </div>

            {/* DECORATIVE CORNERS */}
            <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-theme-success/20 rounded-tl-xl pointer-events-none" />
            <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-theme-success/20 rounded-tr-xl pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-theme-success/20 rounded-bl-xl pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-theme-success/20 rounded-br-xl pointer-events-none" />

        </div>
    );

    return createPortal(content, document.body);
};

export default StartMenu;
