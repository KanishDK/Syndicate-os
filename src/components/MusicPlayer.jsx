import React, { useState, useEffect, useRef } from 'react';
import { Howl, Howler } from 'howler';
import Button from './Button';
import { getMuted } from '../utils/audio';

const PLAYLIST = [
    '/Syndicate-os/music/Syndicate music.mp3',
    '/Syndicate-os/music/Syndicate music (1).mp3',
    '/Syndicate-os/music/Syndicate music (2).mp3',
    '/Syndicate-os/music/Syndicate music (3).mp3',
    '/Syndicate-os/music/Syndicate music (4).mp3'
];

const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5); // Default volume 50%
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [trackName, setTrackName] = useState('Syndicate Radio');
    const playerRef = useRef(null);
    const [showPlaylist, setShowPlaylist] = useState(false);

    // Initialize Global Mute State on Mount
    useEffect(() => {
        const isMuted = getMuted();
        Howler.mute(isMuted);
    }, []);

    const playTrack = (index) => {
        if (playerRef.current) {
            playerRef.current.unload();
        }

        const trackPath = PLAYLIST[index];
        const fileName = trackPath.split('/').pop().replace('.mp3', '');
        setTrackName(fileName);
        setCurrentTrackIndex(index);

        const sound = new Howl({
            src: [trackPath],
            html5: true, // Use HTML5 Audio to stream large files (better performance)
            volume: volume,
            onend: () => {
                playNext();
            }
        });

        playerRef.current = sound;
        sound.play();
        setIsPlaying(true);
    };

    const playNext = () => {
        let nextIndex = currentTrackIndex + 1;
        if (nextIndex >= PLAYLIST.length) nextIndex = 0;
        playTrack(nextIndex);
    };

    const togglePlay = () => {
        if (!playerRef.current) {
            playTrack(currentTrackIndex);
        } else {
            if (isPlaying) {
                playerRef.current.pause();
                setIsPlaying(false);
            } else {
                playerRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const handleVolumeChange = (e) => {
        const newVol = parseFloat(e.target.value);
        setVolume(newVol);
        if (playerRef.current) {
            playerRef.current.volume(newVol);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (playerRef.current) {
                playerRef.current.unload();
            }
        };
    }, []);

    return (
        <div className="relative group">
            {/* 1. PLAYLIST POP-UP */}
            {showPlaylist && (
                <div className="absolute bottom-full mb-4 right-0 w-72 bg-black/90 backdrop-blur-3xl border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden animate-in slide-in-from-bottom-4 duration-500 z-[10001]">
                    <div className="p-5 border-b border-white/10 bg-white/[0.03]">
                        <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-1">Neural Audio</div>
                        <h4 className="text-sm font-black italic text-white uppercase tracking-tighter">Network Playlist</h4>
                    </div>

                    <div className="p-2 max-h-64 overflow-y-auto custom-scrollbar">
                        {PLAYLIST.map((track, idx) => {
                            const name = track.split('/').pop().replace('.mp3', '');
                            const isActive = currentTrackIndex === idx;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => playTrack(idx)}
                                    className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${isActive ? 'bg-cyan-500/10 border border-cyan-500/20' : 'hover:bg-white/5 border border-transparent'}`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${isActive ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'bg-white/5 text-zinc-600'}`}>
                                        {isActive && isPlaying ? (
                                            <i className="fa-solid fa-volume-high animate-pulse"></i>
                                        ) : (
                                            <span>0{idx + 1}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-start flex-1 overflow-hidden">
                                        <span className={`text-[11px] font-bold truncate w-full ${isActive ? 'text-white' : 'text-zinc-500'}`}>{name}</span>
                                        <span className="text-[8px] text-zinc-600 font-mono tracking-widest uppercase">STREAM.0{idx + 1}</span>
                                    </div>
                                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)]" />}
                                </button>
                            );
                        })}
                    </div>

                    <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-zinc-600 uppercase tracking-widest">
                        <span>BPM: 128 (STABLE)</span>
                        <span>BITRATE: 320 KBPS</span>
                    </div>
                </div>
            )}

            {/* 2. MAIN PLAYER BAR */}
            <div className={`flex items-center gap-5 bg-black/80 backdrop-blur-2xl px-6 py-2.5 rounded-2xl border ${showPlaylist ? 'border-cyan-500/40 shadow-[0_0_30px_rgba(34,211,238,0.2)]' : 'border-white/10 hover:border-white/20'} transition-all duration-500`}>
                {/* PLAY/PAUSE */}
                <button
                    onClick={togglePlay}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all active:scale-90 ${isPlaying ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'bg-white/5 text-white hover:bg-white/10'}`}
                >
                    <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                </button>

                {/* TRACK INFO */}
                <div className="flex flex-col min-w-[120px] max-w-[120px] overflow-hidden cursor-pointer" onClick={() => setShowPlaylist(!showPlaylist)}>
                    <div className="text-[11px] font-black italic text-white uppercase tracking-tight truncate">
                        {trackName}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className={`text-[8px] font-black tracking-widest uppercase ${isPlaying ? 'text-cyan-400' : 'text-zinc-600'}`}>
                            {isPlaying ? 'ACTIVE_FEED' : 'STANDBY'}
                        </span>
                        {isPlaying && (
                            <div className="flex gap-0.5 items-end h-2 w-4">
                                <div className="w-0.5 bg-cyan-400 animate-[bounce_1s_infinite]" style={{ height: '40%' }}></div>
                                <div className="w-0.5 bg-cyan-400 animate-[bounce_0.8s_infinite]" style={{ height: '70%', animationDelay: '0.1s' }}></div>
                                <div className="w-0.5 bg-cyan-400 animate-[bounce_1.2s_infinite]" style={{ height: '50%', animationDelay: '0.2s' }}></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* CONTROLS */}
                <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                    <div className="flex items-center gap-3 group/vol">
                        <i className={`fa-solid ${volume === 0 ? 'fa-volume-mute' : 'fa-volume-low'} text-xs text-zinc-600 group-hover/vol:text-cyan-400 transition-colors`}></i>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-16 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300"
                        />
                    </div>

                    <button
                        onClick={playNext}
                        className="text-zinc-500 hover:text-white transition-colors"
                    >
                        <i className="fa-solid fa-forward-step text-sm"></i>
                    </button>

                    <button
                        onClick={() => setShowPlaylist(!showPlaylist)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${showPlaylist ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30' : 'text-zinc-600 hover:text-white hover:bg-white/5 border border-transparent'}`}
                    >
                        <i className="fa-solid fa-list-ul text-xs"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MusicPlayer;
