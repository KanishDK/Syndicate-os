import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { checkForUpdates } from '../utils/checkVersion';
import ModeSelector from './modals/ModeSelector';
import StartMenu from './modals/StartMenu';
import introVideo from '../assets/videos/Syndicate OS Loading screen.mp4';
import { useRegisterSW } from 'virtual:pwa-register/react';

// Boot logs
const bootLogs = [
    "INITIALIZING SYNDICATE OS KERNEL...",
    "LOADING NEURAL INTERFACES...",
    "CONNECTING TO DARKNET NODES...",
    "BYPASSING GOVERNMENT FIREWALLS...",
    "ESTABLISHING SECURE CONNECTION...",
    "VERIFYING BIOMETRIC SIGNATURES...",
    "ACCESS GRANTED."
];

const BootSequence = ({ onComplete, level = 1 }) => {
    const { t } = useLanguage();

    // PWA Update Hook
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            console.log('SW Registered:', r);
        },
        onRegisterError(error) {
            console.error('SW Registration Error:', error);
        },
    });

    // Valid States: 'video', 'login', 'connecting', 'start_menu', 'mode_select', 'complete'
    const [phase, setPhase] = useState(() => {
        const seen = localStorage.getItem('syndicate_intro_seen');
        return (level > 1) ? 'start_menu' : (seen ? 'login' : 'video');
    });

    const [logs, setLogs] = useState([]);
    const [progress, setProgress] = useState(0);
    const [updateInfo, setUpdateInfo] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const logContainerRef = useRef(null);
    const videoRef = useRef(null);
    const bootingRef = useRef(false);
    const intervalRef = useRef(null);

    // Auto-scroll logs
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    // Check for updates on mount
    useEffect(() => {
        const check = async () => {
            const info = await checkForUpdates();
            setUpdateInfo(info);
        };
        check();
    }, []);

    const handleVideoEnd = () => {
        localStorage.setItem('syndicate_intro_seen', 'true');
        setPhase('login');
    };

    const skipVideo = (e) => {
        if (e) e.stopPropagation();
        if (videoRef.current) videoRef.current.pause();
        localStorage.setItem('syndicate_intro_seen', 'true');
        setPhase('login');
    };

    const handleUpdate = async () => {
        setIsUpdating(true);
        setTimeout(async () => {
            try {
                if (needRefresh) {
                    await updateServiceWorker(true);
                } else {
                    if ('serviceWorker' in navigator) {
                        const registrations = await navigator.serviceWorker.getRegistrations();
                        for (let registration of registrations) {
                            await registration.unregister();
                        }
                    }
                    if ('caches' in window) {
                        const keys = await caches.keys();
                        for (const key of keys) {
                            await caches.delete(key);
                        }
                    }
                    window.location.reload(true);
                }
            } catch (error) {
                console.error("Update failed:", error);
                window.location.reload(true);
            }
        }, 1000);
    };

    const handleLogin = async (e) => {
        if (e) e.stopPropagation();
        if (bootingRef.current) return;
        bootingRef.current = true;

        setPhase('connecting');
        let i = 0;

        const versionCheck = updateInfo || await checkForUpdates();
        if (!updateInfo) setUpdateInfo(versionCheck);

        intervalRef.current = setInterval(() => {
            if (i < bootLogs.length) {
                let logMessage = bootLogs[i];

                if (i === 5) {
                    if (versionCheck.error) {
                        logMessage += ' [OFFLINE]';
                    } else if (versionCheck.updateAvailable || needRefresh) {
                        logMessage += ` [UPDATE DETECTED]`;
                    } else {
                        logMessage += ` [UP TO DATE: v${versionCheck.localVersion}]`;
                    }
                }

                setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${logMessage}`]);
                setProgress(((i + 1) / bootLogs.length) * 100);
                i++;
            } else {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setTimeout(() => {
                    setPhase('start_menu');
                }, 800);
            }
        }, 120);
    };

    // Derived state for showing update button
    const showUpdateButton = (updateInfo?.updateAvailable || needRefresh);

    return (
        <div className="fixed inset-0 bg-[#020402] z-[9999] flex items-center justify-center font-mono overflow-hidden select-none">

            {/* START MENU */}
            {phase === 'start_menu' && (
                <StartMenu
                    onNewGame={() => setPhase('mode_select')}
                    onLoadGame={() => {
                        setPhase('complete');
                        onComplete('load');
                    }}
                    onSettings={() => {/* Placeholder for now */ }}
                />
            )}

            {phase === 'mode_select' && (
                <ModeSelector onSelectMode={(mode) => {
                    setPhase('complete');
                    onComplete(mode);
                }} />
            )}

            {phase === 'video' ? (
                <div className="absolute inset-0 z-50 bg-black">
                    <video
                        ref={videoRef}
                        src={introVideo}
                        autoPlay
                        muted
                        playsInline
                        onEnded={handleVideoEnd}
                        className="w-full h-full object-cover md:object-contain"
                    />
                    <button
                        onClick={skipVideo}
                        className="absolute bottom-10 right-10 z-50 text-[10px] text-white/50 hover:text-white uppercase tracking-widest bg-black/50 px-4 py-2 rounded border border-white/10 hover:border-white/30 transition-all font-mono"
                    >
                        SKIP VIDEO <i className="fa-solid fa-forward ml-2"></i>
                    </button>
                </div>
            ) : (
                <>
                    {/* AMBIENT EFFECTS */}
                    {phase !== 'start_menu' && phase !== 'mode_select' && (
                        <>
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,100,0.05)_0%,transparent_70%)] pointer-events-none" />
                            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,255,0,0.02)_0px,transparent_1px,transparent_2px)] opacity-50 pointer-events-none" />
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-theme-success/10 shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-[scan_4s_linear_infinite] pointer-events-none" />
                        </>
                    )}

                    {/* LOGIN / CONNECTING SCREEN */}
                    {(phase === 'login' || phase === 'connecting') && (
                        <div className="max-w-4xl w-full px-6 flex flex-col items-center">
                            {phase === 'login' ? (
                                <div className="text-center space-y-8 md:space-y-12 animate-in fade-in zoom-in duration-700 w-full max-w-[90vw]">
                                    {/* LOGO SECTION */}
                                    <div className="relative inline-block">
                                        <h1 className="text-5xl md:text-8xl font-black text-theme-text-primary tracking-[0.1em] md:tracking-[0.2em] italic uppercase whitespace-nowrap">
                                            SYNDICATE<span className="text-theme-success drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]">OS</span>
                                        </h1>
                                        <div className="absolute -bottom-4 right-0 text-[8px] md:text-[10px] text-theme-text-muted font-bold tracking-[0.3em] md:tracking-[0.5em] flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-theme-success animate-pulse"></span>
                                            {t('boot.logo_subtitle')}
                                        </div>
                                    </div>

                                    {/* MAIN ACTION BUTTON */}
                                    {!showUpdateButton ? (
                                        <div className="relative group cursor-pointer w-full max-w-sm mx-auto" onClick={handleLogin}>
                                            <div className="absolute inset-0 bg-theme-success/20 blur-2xl group-hover:bg-theme-success/40 transition-all" />
                                            <button className="relative w-full py-4 md:py-5 bg-theme-bg-primary border-2 border-theme-success/50 text-theme-success rounded-lg font-black text-xl md:text-2xl tracking-[0.2em] md:tracking-[0.3em] uppercase hover:bg-theme-success hover:text-theme-bg-primary hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all duration-300">
                                                {t('boot.initialize_btn')}
                                            </button>
                                            <p className="mt-4 text-[10px] md:text-xs text-theme-text-muted font-bold tracking-widest uppercase opacity-60 group-hover:opacity-100 italic transition-opacity">
                                                {t('boot.bio_check')}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="animate-bounce mt-8 w-full max-w-sm mx-auto">
                                            <div className="bg-amber-500/10 border border-amber-500/50 p-4 rounded-lg mb-4 text-center">
                                                <p className="text-amber-500 font-bold uppercase tracking-widest text-xs mb-2">System Update Required</p>
                                                <p className="text-zinc-400 text-[10px]">A mandatory security patch is available.</p>
                                            </div>
                                            <button
                                                onClick={handleUpdate}
                                                disabled={isUpdating}
                                                className={`
                                                    w-full px-6 py-4 font-black uppercase tracking-widest rounded border-b-4 transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center justify-center gap-3
                                                    ${isUpdating
                                                        ? 'bg-amber-600 text-black/50 border-amber-800 cursor-wait'
                                                        : 'bg-amber-500 text-black border-amber-700 hover:bg-amber-400 active:border-b-0 active:translate-y-1 cursor-pointer'}
                                                `}
                                            >
                                                {isUpdating ? (
                                                    <>
                                                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                                                        INSTALLING...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fa-solid fa-download"></i>
                                                        INSTALL UPDATE (v{updateInfo?.remoteVersion || 'LATEST'})
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="w-full max-w-2xl space-y-6">
                                    {/* TERMINAL HEADER */}
                                    <div className="flex justify-between items-center px-4 py-2 border-b border-theme-border-subtle bg-theme-surface-base/5 rounded-t-lg">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-theme-danger/30" />
                                            <div className="w-3 h-3 rounded-full bg-theme-warning/30" />
                                            <div className="w-3 h-3 rounded-full bg-theme-success/30" />
                                        </div>
                                        <div className="text-[10px] text-theme-text-muted font-black tracking-widest">{t('boot.connection_stable')}</div>
                                    </div>

                                    {/* LOG OUTPUT */}
                                    <div
                                        ref={logContainerRef}
                                        className="h-80 bg-theme-bg-primary/80 border-x border-b border-theme-border-subtle p-6 overflow-y-auto custom-scrollbar font-mono text-sm leading-relaxed"
                                    >
                                        {logs.map((log, i) => {
                                            const isSuccess = log.includes('SUCCESS') || log.includes('GRANTED') || log.includes('UP TO DATE');
                                            const isWarning = log.includes('UPDATE') || log.includes('DETECTED');
                                            const isError = log.includes('OFFLINE');

                                            let colorClass = 'text-theme-text-secondary';
                                            if (isSuccess) colorClass = 'text-theme-success font-bold';
                                            if (isWarning) colorClass = 'text-amber-400 font-bold animate-pulse';
                                            if (isError) colorClass = 'text-theme-text-muted';

                                            return (
                                                <div key={i} className={`mb-1 ${colorClass}`}>
                                                    <span className="text-theme-text-muted mr-3 opacity-50">{log.split('] ')[0]}]</span>
                                                    {log.split('] ')[1]}
                                                </div>
                                            );
                                        })}
                                        <div className="inline-block w-2 h-4 bg-theme-success animate-pulse" />
                                    </div>

                                    {/* PROGRESS BAR */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black text-theme-text-muted tracking-[0.2em] uppercase">
                                            <span>{t('boot.decrypting_nodes')}</span>
                                            <span>{Math.floor(progress)}%</span>
                                        </div>
                                        <div className="h-1 w-full bg-theme-border-subtle rounded-full overflow-hidden border border-theme-border-subtle">
                                            <div
                                                className="h-full bg-theme-success shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-150"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <style>{`
                        @keyframes scan {
                            from { transform: translateY(0); }
                            to { transform: translateY(100vh); }
                        }
                        .custom-scrollbar::-webkit-scrollbar {
                            width: 4px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-track {
                            background: transparent;
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb {
                            background: rgba(16, 185, 129, 0.2);
                            border-radius: 10px;
                        }
                    `}</style>
                    {/* SKIP BUTTON */}
                    {phase !== 'login' && phase !== 'complete' && phase !== 'video' && phase !== 'mode_select' && phase !== 'start_menu' && (
                        <button
                            onClick={() => {
                                setPhase('start_menu');
                            }}
                            className="absolute top-4 right-4 z-50 text-[10px] text-theme-text-muted hover:text-white uppercase tracking-widest bg-black/50 px-3 py-1 rounded border border-white/10 hover:border-white/30 transition-all font-mono"
                        >
                            {t('boot.skip') || 'SKIP INTRO'} <i className="fa-solid fa-forward ml-1"></i>
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default BootSequence;
