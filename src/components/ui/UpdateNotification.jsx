import React, { useState, useEffect } from 'react';
import GlassCard from './GlassCard';
import ActionButton from './ActionButton';
import { useLanguage } from '../../context/LanguageContext';

const UpdateNotification = () => {
    const { t } = useLanguage();
    const [needRefresh, setNeedRefresh] = useState(false);
    const [waitingWorker, setWaitingWorker] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            // Handle controller change (reload when new SW takes over)
            let refreshing = false;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (!refreshing) {
                    refreshing = true;
                    window.location.reload();
                }
            });

            navigator.serviceWorker.ready.then((registration) => {
                // Check if hidden update is already waiting
                if (registration.waiting) {
                    setWaitingWorker(registration.waiting);
                    setNeedRefresh(true);
                }

                // Listen for new updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                setWaitingWorker(newWorker);
                                setNeedRefresh(true);
                            }
                        });
                    }
                });
            });
        }
    }, []);

    const updateServiceWorker = () => {
        if (waitingWorker) {
            waitingWorker.postMessage({ type: 'SKIP_WAITING' });
        }
    };

    if (!needRefresh) return null;

    return (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <GlassCard className="p-4 flex flex-col gap-3 shadow-[0_0_50px_rgba(var(--colors-primary-rgb),0.3)] border-theme-primary/50" variant="glass">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-cyan-400 text-black flex items-center justify-center text-xl shrink-0 animate-[bounce_1s_infinite]">
                        <i className="fa-solid fa-download"></i>
                    </div>
                    <div>
                        <div className="text-[10px] font-mono text-cyan-400 animate-pulse">SYSTEM UPDATE DETECTED</div>
                        <h4 className="text-sm font-black uppercase text-white shadow-cyan-500/50 drop-shadow-md">{t('ui_ext.update.title')}</h4>
                        <p className="text-xs text-zinc-400 mt-1">{t('ui_ext.update.desc')}</p>
                    </div>
                </div>

                <div className="flex gap-2 mt-2">
                    <ActionButton
                        onClick={updateServiceWorker}
                        className="flex-1"
                        variant="primary"
                        size="sm"
                    >
                        {t('ui_ext.update.reload')}
                    </ActionButton>
                    <ActionButton
                        onClick={() => setNeedRefresh(false)}
                        className="w-1/3"
                        variant="ghost"
                        size="sm"
                    >
                        {t('ui_ext.update.later')}
                    </ActionButton>
                </div>
            </GlassCard>
        </div>
    );
};

export default UpdateNotification;
