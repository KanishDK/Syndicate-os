import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { playSound } from '../utils/audio';

const LanguageSelector = ({ onSelect }) => {
    const { setLanguage, t } = useLanguage();

    const handleSelect = (lang) => {
        playSound('success');
        setLanguage(lang);
        if (onSelect) onSelect();
    };

    return (
        <div className="fixed inset-0 bg-[#020402] z-[10000] flex items-center justify-center font-mono overflow-hidden select-none">
            {/* BACKGROUND EFFECTS */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0)_0px,rgba(0,255,100,0.03)_1px,transparent_2px)] opacity-30 pointer-events-none" />

            <div className="max-w-4xl w-full px-6 flex flex-col items-center animate-in fade-in zoom-in duration-700">
                {/* LOGO */}
                <div className="mb-16 text-center">
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-[0.2em] italic uppercase mb-2">
                        SYNDICATE<span className="text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]">OS</span>
                    </h1>
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                </div>

                <h2 className="text-xl text-zinc-400 mb-12 tracking-widest uppercase">
                    Select Language / Vælg Sprog
                </h2>

                <div className="flex flex-col md:flex-row gap-8 w-full max-w-2xl justify-center">
                    {/* DANISH OPTION */}
                    <button
                        onClick={() => handleSelect('da')}
                        className="group relative flex-1 p-8 bg-black border border-white/10 rounded-xl hover:border-emerald-500/50 transition-all duration-300 hover:bg-white/5 hover:scale-[1.02]"
                    >
                        <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-all rounded-xl" />
                        <div className="flex flex-col items-center gap-4">
                            <span className="text-6xl">🇩🇰</span>
                            <div className="text-2xl font-black text-white tracking-widest uppercase group-hover:text-emerald-400 transition-colors">
                                DANSK
                            </div>
                            <div className="text-xs text-zinc-500 font-bold tracking-widest uppercase">
                                Original Oplevelse
                            </div>
                        </div>
                    </button>

                    {/* ENGLISH OPTION */}
                    <button
                        onClick={() => handleSelect('en')}
                        className="group relative flex-1 p-8 bg-black border border-white/10 rounded-xl hover:border-emerald-500/50 transition-all duration-300 hover:bg-white/5 hover:scale-[1.02]"
                    >
                        <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-all rounded-xl" />
                        <div className="flex flex-col items-center gap-4">
                            <span className="text-6xl">🇺🇸</span>
                            <div className="text-2xl font-black text-white tracking-widest uppercase group-hover:text-emerald-400 transition-colors">
                                ENGLISH
                            </div>
                            <div className="text-xs text-zinc-500 font-bold tracking-widest uppercase">
                                International Version
                            </div>
                        </div>
                    </button>
                </div>

                <div className="mt-16 text-xs text-zinc-600 font-mono tracking-widest">
                    SYSTEM ID: NODE-084-CPH  //  STATUS: AWAITING INPUT
                </div>
            </div>
        </div>
    );
};

export default LanguageSelector;
