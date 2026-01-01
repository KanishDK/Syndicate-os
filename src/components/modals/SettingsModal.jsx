import React from 'react';
import { CONFIG } from '../../config/gameConfig';

const SettingsModal = ({ onClose, onExport, onImport, onReset, version, settings, setGameState }) => {
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

    const isSci = settings?.numberFormat === 'scientific';
    const particles = settings?.particles !== false; // Default true if undefined

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl max-w-sm w-full shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <i className="fa-solid fa-gear text-zinc-500"></i> Indstillinger
                </h3>

                <div className="space-y-4 mb-6">
                    {/* FORMAT TOGGLE */}
                    <div className="flex justify-between items-center p-3 bg-black/40 rounded-lg border border-white/5">
                        <div>
                            <div className="text-sm font-bold text-white">Talformat</div>
                            <div className="text-[10px] text-zinc-500">{isSci ? 'Videnskabelig (1.2e6)' : 'Standard (1.2M)'}</div>
                        </div>
                        <button
                            onClick={toggleFormat}
                            className={`px-3 py-1 rounded text-xs font-bold transition-all ${isSci ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-zinc-700 text-zinc-300'}`}
                        >
                            {isSci ? 'SCIENTIFIC' : 'STANDARD'}
                        </button>
                    </div>

                    {/* PARTICLES TOGGLE */}
                    <div className="flex justify-between items-center p-3 bg-black/40 rounded-lg border border-white/5">
                        <div>
                            <div className="text-sm font-bold text-white">Effekter</div>
                            <div className="text-[10px] text-zinc-500">{particles ? 'Til (Bedre oplevelse)' : 'Fra (Bedre ydelse)'}</div>
                        </div>
                        <button
                            onClick={toggleParticles}
                            className={`px-3 py-1 rounded text-xs font-bold transition-all ${particles ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-700 text-zinc-300'}`}
                        >
                            {particles ? 'TIL' : 'FRA'}
                        </button>
                    </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-white/10">
                    <button onClick={onExport} className="w-full py-3 bg-zinc-800 active:bg-zinc-700 text-zinc-300 font-bold rounded-lg border border-white/5 transition-colors flex items-center justify-center gap-2 active:scale-95">
                        <i className="fa-solid fa-download"></i> Eksporter Save
                    </button>
                    <button onClick={onImport} className="w-full py-3 bg-zinc-800 active:bg-zinc-700 text-zinc-300 font-bold rounded-lg border border-white/5 transition-colors flex items-center justify-center gap-2 active:scale-95">
                        <i className="fa-solid fa-upload"></i> Importer Save
                    </button>
                    <button onClick={onReset} className="w-full py-3 bg-red-900/20 active:bg-red-900/40 text-red-500 font-bold rounded-lg border border-red-500/20 mt-4 transition-colors active:scale-95">
                        Nulstil Alt
                    </button>
                    <button onClick={onClose} className="w-full py-3 mt-4 text-zinc-500 active:text-white transition-colors">Luk</button>
                    <div className="mt-4 text-center text-[10px] text-zinc-600 font-mono">
                        Syndicate OS v{version || 'UNKNOWN'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
