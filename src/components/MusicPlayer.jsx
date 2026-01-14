import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';

// Simple Lo-Fi / Ambient Generator
// Uses Web Audio API to schedule random chords and drums
const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume] = useState(0.2);
    const audioCtxRef = useRef(null);
    const nextNoteTimeRef = useRef(0);
    const schedulerTimerRef = useRef(null);
    const beatCountRef = useRef(0);

    const checkAudioContext = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
    };

    const scheduleNote = (beatNumber, time) => {
        const ctx = audioCtxRef.current;

        // DRUMS (Kick on 1, Snare on 3, HiHat every beat)
        // 4/4 Time Signature
        // Beat 0: Kick
        // Beat 2: Snare

        const step = beatNumber % 4;

        // HI-HAT (White Noise burst) - Every step
        if (step % 1 === 0) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            // White noise buffer usually better, but sticking to simple oscillators for no-asset requirement
            // High frequency square wave roughly simulates metallic click
            osc.type = 'square';
            osc.frequency.setValueAtTime(8000, time);
            gain.gain.setValueAtTime(0.02 * volume, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(time);
            osc.stop(time + 0.05);
        }

        // KICK (Beat 1)
        if (step === 0) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.setValueAtTime(150, time);
            osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
            gain.gain.setValueAtTime(0.5 * volume, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(time);
            osc.stop(time + 0.5);
        }

        // SNARE (Beat 3)
        if (step === 2) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(250, time);
            gain.gain.setValueAtTime(0.2 * volume, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(time);
            osc.stop(time + 0.2);
        }

        // AMBIENT CHORD (Every 16 beats / 4 bars)
        if (beatNumber % 16 === 0) {
            // Or swap between two chords
            const isChordA = (beatNumber % 32 === 0);
            const chord = isChordA ? [261.63, 311.13, 392.00] : [220.00, 261.63, 329.63]; // Cm vs Am

            chord.forEach((freq) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq;

                // Attack
                gain.gain.setValueAtTime(0, time);
                gain.gain.linearRampToValueAtTime(0.05 * volume, time + 2);
                // Decay
                gain.gain.linearRampToValueAtTime(0, time + 8);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(time);
                osc.stop(time + 9);
            });
        }
    };

    const nextNote = () => {
        const secondsPerBeat = 60.0 / 80; // 80 BPM
        nextNoteTimeRef.current += secondsPerBeat;
        beatCountRef.current++;
    };

    const scheduler = () => {
        // While there are notes that will need to play before the next interval, 
        // schedule them and advance the pointer.
        while (nextNoteTimeRef.current < audioCtxRef.current.currentTime + 0.1) {
            scheduleNote(beatCountRef.current, nextNoteTimeRef.current);
            nextNote();
        }
        schedulerTimerRef.current = requestAnimationFrame(scheduler);
    };

    const togglePlay = () => {
        checkAudioContext();
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }

        if (!isPlaying) {
            setIsPlaying(true);
            nextNoteTimeRef.current = audioCtxRef.current.currentTime + 0.1;
            beatCountRef.current = 0;
            scheduler();
        } else {
            setIsPlaying(false);
            if (schedulerTimerRef.current) cancelAnimationFrame(schedulerTimerRef.current);
        }
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (schedulerTimerRef.current) cancelAnimationFrame(schedulerTimerRef.current);
            if (audioCtxRef.current && isPlaying) {
                audioCtxRef.current.close();
            }
        };
    }, [isPlaying]);

    return (
        <div className="flex items-center gap-2 bg-theme-surface-base/40 rounded-full px-3 py-1 border border-theme-border-subtle">
            <Button
                onClick={togglePlay}
                size="icon"
                variant="ghost"
                className={`!w-6 !h-6 ${isPlaying ? 'text-theme-primary animate-pulse' : 'text-theme-text-muted'}`}
            >
                <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-music'}`}></i>
            </Button>

            {isPlaying && (
                <div className="flex items-center gap-1">
                    <span className="text-[10px] text-theme-primary font-mono">LO-FI RADIO</span>
                    <div className="flex gap-0.5 items-end h-3">
                        <span className="w-0.5 bg-theme-primary animate-[musicBar_0.6s_ease-in-out_infinite] h-2"></span>
                        <span className="w-0.5 bg-theme-primary animate-[musicBar_0.8s_ease-in-out_infinite] h-3"></span>
                        <span className="w-0.5 bg-theme-primary animate-[musicBar_0.5s_ease-in-out_infinite] h-1.5"></span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MusicPlayer;
