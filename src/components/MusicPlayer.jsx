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
        setCurrentTrackIndex(nextIndex);
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
        <div className="flex items-center gap-2 md:gap-4 bg-theme-surface-base/40 rounded-full px-3 md:px-4 py-1.5 border border-theme-border-subtle backdrop-blur-sm">
            {/* PLAY/PAUSE */}
            <Button
                onClick={togglePlay}
                size="icon_sm"
                variant="ghost"
                className={`!w-6 !h-6 rounded-full ${isPlaying ? 'text-theme-primary' : 'text-theme-text-muted hover:text-white'}`}
            >
                <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
            </Button>

            {/* TRACK INFO (Desktop Only) */}
            <div className="hidden md:flex flex-col w-24 overflow-hidden">
                <div className="text-[10px] font-bold text-theme-text-primary whitespace-nowrap truncate leading-tight">
                    {isPlaying ? (
                        <span className="animate-pulse">{trackName}</span>
                    ) : (
                        <span className="text-theme-text-muted">PAUSED</span>
                    )}
                </div>
                <div className="text-[8px] text-theme-text-muted leading-tight">LO-FI RADIO</div>
            </div>

            {/* VOLUME CONTROL (Desktop Only) */}
            <div className="hidden md:flex items-center gap-2 group">
                <i className={`fa-solid ${volume === 0 ? 'fa-volume-xmark' : 'fa-volume-low'} text-[10px] text-theme-text-muted group-hover:text-theme-primary transition-colors`}></i>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-theme-surface-elevated rounded-lg appearance-none cursor-pointer accent-theme-primary hover:accent-theme-primary/80"
                />
            </div>

            {/* NEXT BUTTON */}
            <Button
                onClick={playNext}
                size="icon_sm"
                variant="ghost"
                className="!w-5 !h-5 text-theme-text-muted hover:text-white"
            >
                <i className="fa-solid fa-forward-step text-[10px]"></i>
            </Button>
        </div>
    );
};

export default MusicPlayer;
