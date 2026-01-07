import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

const BootSequence = ({ onComplete }) => {
    const { t } = useLanguage();
    const [phase, setPhase] = useState('login'); // login | connecting | complete
    const [logs, setLogs] = useState([]);
    const [progress, setProgress] = useState(0);
    const logContainerRef = useRef(null);

    const bootLogs = [
        t('boot.init'),
        t('boot.mounting'),
        t('boot.proxy'),
        t('boot.bypassing'),
        t('boot.spoofing'),
        t('boot.connecting'),
        t('boot.handshake'),
        t('boot.decrypting'),
        t('boot.syncing'),
        t('boot.intel'),
        t('boot.access'),
    ];

    // Auto-scroll logs
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    const handleLogin = () => {
        setPhase('connecting');
        let i = 0;

        // Rapid log injection
        const logInterval = setInterval(() => {
            if (i < bootLogs.length) {
                setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${bootLogs[i]}`]);
                setProgress(((i + 1) / bootLogs.length) * 100);
                i++;
            } else {
                clearInterval(logInterval);
                setTimeout(() => {
                    setPhase('complete');
                    onComplete();
                }, 800);
            }
        }, 120);
    };

    return (
        <div className="fixed inset-0 bg-[#020402] z-[9999] flex items-center justify-center font-mono overflow-hidden select-none">
            {/* AMBIENT EFFECTS */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,100,0.05)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,255,0,0.02)_0px,transparent_1px,transparent_2px)] opacity-50 pointer-events-none" />

            {/* SCANLINE */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-[scan_4s_linear_infinite] pointer-events-none" />

            <div className="max-w-4xl w-full px-6 flex flex-col items-center">

                {phase === 'login' ? (
                    <div className="text-center space-y-12 animate-in fade-in zoom-in duration-700">
                        {/* LOGO SECTION */}
                        <div className="relative inline-block">
                            <h1 className="text-6xl md:text-8xl font-black text-white tracking-[0.2em] italic uppercase">
                                SYNDICATE<span className="text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]">OS</span>
                            </h1>
                            <div className="absolute -bottom-4 right-0 text-[10px] text-zinc-500 font-bold tracking-[0.5em] flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                {t('boot.logo_subtitle')}
                            </div>
                        </div>

                        {/* ACCESS BUTTON */}
                        <div className="relative group cursor-pointer" onClick={handleLogin}>
                            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl group-hover:bg-emerald-500/40 transition-all" />
                            <button className="relative px-12 py-5 bg-black border-2 border-emerald-500/50 text-emerald-500 rounded-lg font-black text-2xl tracking-[0.3em] uppercase hover:bg-emerald-500 hover:text-black hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all duration-300">
                                {t('boot.initialize_btn')}
                            </button>
                            <p className="mt-4 text-xs text-zinc-500 font-bold tracking-widest uppercase opacity-60 group-hover:opacity-100 italic transition-opacity">
                                {t('boot.bio_check')}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-2xl space-y-6">
                        {/* TERMINAL HEADER */}
                        <div className="flex justify-between items-center px-4 py-2 border-b border-white/10 bg-white/5 rounded-t-lg">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/30" />
                                <div className="w-3 h-3 rounded-full bg-amber-500/30" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500/30" />
                            </div>
                            <div className="text-[10px] text-zinc-500 font-black tracking-widest">{t('boot.connection_stable')}</div>
                        </div>

                        {/* LOG OUTPUT */}
                        <div
                            ref={logContainerRef}
                            className="h-80 bg-black/80 border-x border-b border-white/5 p-6 overflow-y-auto custom-scrollbar font-mono text-sm leading-relaxed"
                        >
                            {logs.map((log, i) => (
                                <div key={i} className={`mb-1 ${log.includes('SUCCESS') || log.includes('GRANTED') ? 'text-emerald-400 font-bold' : 'text-zinc-400'}`}>
                                    <span className="text-zinc-600 mr-3 opacity-50">{log.split('] ')[0]}]</span>
                                    {log.split('] ')[1]}
                                </div>
                            ))}
                            <div className="inline-block w-2 h-4 bg-emerald-500 animate-pulse" />
                        </div>

                        {/* PROGRESS BAR */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black text-zinc-500 tracking-[0.2em] uppercase">
                                <span>{t('boot.decrypting_nodes')}</span>
                                <span>{Math.floor(progress)}%</span>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div
                                    className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-150"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

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
        </div>
    );
};

export default BootSequence;
