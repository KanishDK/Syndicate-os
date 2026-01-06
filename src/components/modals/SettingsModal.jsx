import React from 'react';
import { CONFIG } from '../../config/gameConfig';
import Button from '../Button';
import { setMuted, getMuted } from '../../utils/audio';

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
                    <i className="fa-solid fa-gear text-zinc-500"></i> Indstillinger
                </h3>

                <div className="space-y-4 mb-6">
                    {/* FORMAT TOGGLE */}
                    <div className="flex justify-between items-center p-3 bg-black/40 rounded-lg border border-white/5">
                        <div>
                            <div className="text-sm font-bold text-white">Talformat</div>
                            <div className="text-[10px] text-zinc-500">{isSci ? 'Videnskabelig (1.2e6)' : 'Standard (1.2M)'}</div>
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
                            <div className="text-sm font-bold text-white">Effekter</div>
                            <div className="text-[10px] text-zinc-500">{particles ? 'Til (Bedre oplevelse)' : 'Fra (Bedre ydelse)'}</div>
                        </div>
                        <Button
                            onClick={toggleParticles}
                            className="px-3 py-1 text-xs"
                            variant={particles ? 'primary' : 'neutral'}
                        >
                            {particles ? 'TIL' : 'FRA'}
                        </Button>
                    </div>

                    {/* SOUND TOGGLE */}
                    <div className="flex justify-between items-center p-3 bg-black/40 rounded-lg border border-white/5">
                        <div>
                            <div className="text-sm font-bold text-white">Lyd</div>
                            <div className="text-[10px] text-zinc-500">{muted ? 'Lydløs' : 'Aktiv'}</div>
                        </div>
                        <Button
                            onClick={toggleMute}
                            className="px-3 py-1 text-xs"
                            variant={!muted ? 'primary' : 'neutral'}
                        >
                            {muted ? 'UNMUTE' : 'MUTE'}
                        </Button>
                    </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-white/10">
                    <Button onClick={onExport} className="w-full py-3 flex items-center justify-center gap-2" variant="neutral">
                        <i className="fa-solid fa-download"></i> Eksporter Save
                    </Button>
                    <Button onClick={onImport} className="w-full py-3 flex items-center justify-center gap-2" variant="neutral">
                        <i className="fa-solid fa-upload"></i> Importer Save
                    </Button>
                    <Button onClick={onReset} className="w-full py-3 mt-4" variant="danger">
                        Nulstil Alt
                    </Button>
                    <Button onClick={onClose} className="w-full py-3 mt-4" variant="ghost">Luk</Button>
                    <div className="mt-4 text-center text-[10px] text-zinc-600 font-mono">
                        Syndicate OS v{version || 'UNKNOWN'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
