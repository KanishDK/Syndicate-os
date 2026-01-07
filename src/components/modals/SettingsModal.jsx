import React from 'react';
import { CONFIG } from '../../config/gameConfig';
import Button from '../Button';
import { setMuted, getMuted } from '../../utils/audio';
import { useLanguage } from '../../context/LanguageContext';

const SettingsModal = ({ onClose, onExport, onImport, onReset, version, settings, setGameState }) => {
    const { t, language, setLanguage } = useLanguage();

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

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl max-w-sm w-full shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <i className="fa-solid fa-gear text-zinc-500"></i> {t('settings.title')}
                </h3>

                <div className="space-y-4 mb-6">
                    {/* LANGUAGE TOGGLE */}
                    <div className="flex justify-between items-center p-3 bg-black/40 rounded-lg border border-white/5">
                        <div>
                            <div className="text-sm font-bold text-white">{t('settings.language')}</div>
                            <div className="text-[10px] text-zinc-500">{language === 'da' ? 'Dansk' : 'English'}</div>
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
                    <div className="flex justify-between items-center p-3 bg-black/40 rounded-lg border border-white/5">
                        <div>
                            <div className="text-sm font-bold text-white">{t('settings.format')}</div>
                            <div className="text-[10px] text-zinc-500">{isSci ? t('settings.format_desc_sci') : t('settings.format_desc_std')}</div>
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
                    <div className="flex justify-between items-center p-3 bg-black/40 rounded-lg border border-white/5">
                        <div>
                            <div className="text-sm font-bold text-white">{t('settings.particles')}</div>
                            <div className="text-[10px] text-zinc-500">{particles ? t('settings.particles_desc_on') : t('settings.particles_desc_off')}</div>
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
                    <div className="flex justify-between items-center p-3 bg-black/40 rounded-lg border border-white/5">
                        <div>
                            <div className="text-sm font-bold text-white">{t('settings.sound')}</div>
                            <div className="text-[10px] text-zinc-500">{muted ? t('settings.sound_desc_muted') : t('settings.sound_desc_active')}</div>
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

                <div className="space-y-3 pt-6 border-t border-white/10">
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
                    <div className="mt-4 text-center text-[10px] text-zinc-600 font-mono">
                        Syndicate OS v{version || 'UNKNOWN'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
