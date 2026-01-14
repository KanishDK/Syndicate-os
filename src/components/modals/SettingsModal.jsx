import React from 'react';
import { CONFIG } from '../../config/gameConfig';
import Button from '../Button';
import { setMuted, getMuted } from '../../utils/audio';
import { useLanguage } from '../../context/LanguageContext';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useTheme } from '../../context/ThemeContext';

const SettingsModal = ({ onClose, onExport, onImport, onReset, version, settings, setGameState }) => {
    const { t, language, setLanguage } = useLanguage();
    const { theme, setTheme, availableThemes } = useTheme();

    const toggleFormat = () => {
        setGameState(prev => ({
            ...prev,
            settings: {
                ...prev.settings,
                numberFormat: prev.settings?.numberFormat === 'scientific' ? 'standard' : 'scientific'
            }
        }));
    };

    const toggleParticles = () => {
        setGameState(prev => ({
            ...prev,
            settings: {
                ...prev.settings,
                particles: !prev.settings?.particles
            }
        }));
    };

    const [muted, setMutedState] = React.useState(getMuted());

    const toggleMute = () => {
        const newState = !muted;
        setMuted(newState);
        setMutedState(newState);
    };

    const isSci = settings?.numberFormat === 'scientific';
    const particles = settings?.particles !== false; // Default true if undefined

    // Apply focus trap for accessibility
    const modalRef = useFocusTrap(true);

    // Close on Escape key
    React.useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-theme-surface-overlay backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                ref={modalRef}
                onClick={(e) => e.stopPropagation()}
                className="bg-theme-surface-elevated border border-theme-border-default p-6 rounded-2xl max-w-md w-full shadow-2xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="settings-title"
            >
                <h3 id="settings-title" className="text-xl font-bold text-theme-text-primary mb-6 flex items-center gap-2">
                    <i className="fa-solid fa-gear text-theme-text-muted"></i> {t('settings.title')}
                </h3>

                <div className="space-y-4 mb-6">
                    {/* LANGUAGE TOGGLE */}
                    <div className="flex justify-between items-center p-3 bg-theme-surface-base/50 rounded-lg border border-theme-border-subtle">
                        <div>
                            <div className="text-sm font-bold text-theme-text-primary">{t('settings.language')}</div>
                            <div className="text-[10px] text-theme-text-muted">{language === 'da' ? 'Dansk' : 'English'}</div>
                        </div>
                        <div className="flex gap-1">
                            <Button
                                onClick={() => setLanguage('da')}
                                className="px-2 py-1 text-xs"
                                variant={language === 'da' ? 'primary' : 'neutral'}
                            >
                                🇩🇰
                            </Button>
                            <Button
                                onClick={() => setLanguage('en')}
                                className="px-2 py-1 text-xs"
                                variant={language === 'en' ? 'primary' : 'neutral'}
                            >
                                🇺🇸
                            </Button>
                        </div>
                    </div>

                    {/* FORMAT TOGGLE */}
                    <div className="flex justify-between items-center p-3 bg-theme-surface-base/50 rounded-lg border border-theme-border-subtle">
                        <div>
                            <div className="text-sm font-bold text-theme-text-primary">{t('settings.format')}</div>
                            <div className="text-[10px] text-theme-text-muted">{isSci ? t('settings.format_desc_sci') : t('settings.format_desc_std')}</div>
                        </div>
                        <Button
                            onClick={toggleFormat}
                            className="px-3 py-1 text-xs"
                            variant={isSci ? 'primary' : 'neutral'}
                        >
                            {isSci ? 'SCIENTIFIC' : 'STANDARD'}
                        </Button>
                    </div>

                    {/* PARTICLES TOGGLE */}
                    <div className="flex justify-between items-center p-3 bg-theme-surface-base/50 rounded-lg border border-theme-border-subtle">
                        <div>
                            <div className="text-sm font-bold text-theme-text-primary">{t('settings.particles')}</div>
                            <div className="text-[10px] text-theme-text-muted">{particles ? t('settings.particles_desc_on') : t('settings.particles_desc_off')}</div>
                        </div>
                        <Button
                            onClick={toggleParticles}
                            className="px-3 py-1 text-xs"
                            variant={particles ? 'primary' : 'neutral'}
                        >
                            {particles ? t('settings.on') : t('settings.off')}
                        </Button>
                    </div>

                    {/* SOUND TOGGLE */}
                    <div className="flex justify-between items-center p-3 bg-theme-surface-base/50 rounded-lg border border-theme-border-subtle">
                        <div>
                            <div className="text-sm font-bold text-theme-text-primary">{t('settings.sound')}</div>
                            <div className="text-[10px] text-theme-text-muted">{muted ? t('settings.sound_desc_muted') : t('settings.sound_desc_active')}</div>
                        </div>
                        <Button
                            onClick={toggleMute}
                            className="px-3 py-1 text-xs"
                            variant={!muted ? 'primary' : 'neutral'}
                        >
                            {muted ? t('settings.unmute') : t('settings.mute')}
                        </Button>
                    </div>
                </div>

                {/* THEME SWITCHER */}
                <div className="mb-6 pt-6 border-t border-theme-border-default">
                    <div className="text-sm font-bold text-theme-text-primary mb-3 flex items-center gap-2">
                        <i className="fa-solid fa-palette text-theme-text-muted"></i>
                        Theme
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {availableThemes.map(themeOption => (
                            <button
                                key={themeOption.id}
                                onClick={() => setTheme(themeOption.id)}
                                className={`p-3 rounded-lg border-2 transition-all text-left ${theme === themeOption.id
                                    ? 'border-theme-primary bg-theme-primary/10'
                                    : 'border-theme-border-default bg-theme-surface-base/50 hover:border-theme-border-emphasis'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-bold text-theme-text-primary">{themeOption.name}</span>
                                    {theme === themeOption.id && (
                                        <i className="fa-solid fa-check text-theme-primary text-sm"></i>
                                    )}
                                </div>
                                <div className="text-[9px] text-theme-text-muted">{themeOption.description}</div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-theme-border-default">
                    <Button onClick={onExport} className="w-full py-3 flex items-center justify-center gap-2" variant="neutral">
                        <i className="fa-solid fa-download"></i> {t('settings.export_save')}
                    </Button>
                    <Button onClick={onImport} className="w-full py-3 flex items-center justify-center gap-2" variant="neutral">
                        <i className="fa-solid fa-upload"></i> {t('settings.import_save')}
                    </Button>
                    <Button onClick={onReset} className="w-full py-3 mt-4" variant="danger">
                        {t('settings.hard_reset')}
                    </Button>
                    <Button onClick={onClose} className="w-full py-3 mt-4" variant="ghost">{t('ui.close')}</Button>
                    <div className="mt-4 text-center text-[10px] text-theme-text-disabled font-mono">
                        Syndicate OS v{version || 'UNKNOWN'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
