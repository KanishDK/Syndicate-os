import React from 'react';
import Button from './Button';

const GhostMode = ({ state, activateGhostMode }) => {
    if (state.heat < 100) return null;

    return (
        <div className="fixed inset-0 z-[1000] bg-red-950/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8 animate-in fade-in duration-500 overflow-hidden">
            {/* Visual Glitch Background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.1)_1px,transparent_1px)] bg-[size:100%_4px] animate-scanline"></div>
                <div className="absolute inset-0 bg-red-600/10 mix-blend-overlay"></div>
            </div>

            {/* Emergency UI */}
            <div className="relative max-w-2xl w-full bg-black border-2 border-red-600 rounded-3xl p-10 shadow-[0_0_100px_rgba(220,38,38,0.5)] flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center text-black text-5xl mb-8 animate-pulse">
                    <i className="fa-solid fa-skull-crossbones"></i>
                </div>

                <h1 className="text-6xl font-black text-white uppercase tracking-tighter italic mb-4">
                    GHOST <span className="text-red-600">MODE</span>
                </h1>

                <h2 className="text-red-500 font-bold uppercase tracking-[0.3em] text-xs mb-8">
                    EMERGENCY LOCKDOWN PROTOCOL ACTIVE
                </h2>

                <div className="bg-red-600/10 border border-red-600/30 rounded-2xl p-6 mb-10 w-full text-left font-mono">
                    <p className="text-red-400 text-sm mb-4 leading-relaxed">
                        Politiet står for døren. Dine servere er overophedet, og dine lokationer er overvåget.
                        Aktivering af <span className="text-white font-bold">GHOST MODE</span> vil slette alle spor, men prisen er total.
                    </p>
                    <ul className="text-[10px] text-red-500/80 space-y-2 uppercase font-black">
                        <li className="flex items-center gap-2">
                            <i className="fa-solid fa-check"></i> Reset Heat til 0%
                        </li>
                        <li className="flex items-center gap-2 text-white">
                            <i className="fa-solid fa-triangle-exclamation"></i> Slet alle beskidte penge (100% loss)
                        </li>
                        <li className="flex items-center gap-2 text-white">
                            <i className="fa-solid fa-triangle-exclamation"></i> -10% vaskede penge (Sletning af spor)
                        </li>
                    </ul>
                </div>

                <Button
                    onClick={activateGhostMode}
                    className="w-full py-6 text-xl bg-red-600 hover:bg-red-500 text-black border-red-400 shadow-[0_0_30px_rgba(220,38,38,0.4)]"
                    variant="neutral"
                >
                    AKTIVER GHOST PROTOCOL
                </Button>

                <p className="text-[10px] text-zinc-600 mt-6 uppercase tracking-widest animate-pulse font-terminal">
                    DO NOT DISCONNECT. SITTING DUCK STATUS: DETECTED.
                </p>
            </div>

            {/* Red alert text in background */}
            <div className="absolute top-10 left-10 text-red-900/40 text-8xl font-black italic select-none pointer-events-none -rotate-12">
                POLITI RAZZIA
            </div>
            <div className="absolute bottom-10 right-10 text-red-900/40 text-8xl font-black italic select-none pointer-events-none rotate-12">
                TOTAL LOCKDOWN
            </div>
        </div>
    );
};

export default GhostMode;
