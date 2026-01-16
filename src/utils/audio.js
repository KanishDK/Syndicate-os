// Audio Engine (Hybrid: Howler + WebAudio Synth)
import { Howl, Howler } from 'howler';

// Simple synth for UI sounds (Fallback / Procedural)

// Audio Context Singleton (Node-Safe)
// Audio Context Singleton (Node-Safe)
const ctx = (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext))
    ? new (window.AudioContext || window.webkitAudioContext)()
    : {
        state: 'suspended',
        resume: () => { },
        suspend: () => { },
        createOscillator: () => ({ connect: () => { }, start: () => { }, stop: () => { }, frequency: { setValueAtTime: () => { }, exponentialRampToValueAtTime: () => { }, linearRampToValueAtTime: () => { }, setTargetAtTime: () => { } } }),
        createGain: () => ({ connect: () => { }, gain: { setValueAtTime: () => { }, exponentialRampToValueAtTime: () => { }, linearRampToValueAtTime: () => { } } }),
        destination: {}
    }; // Mock for Node



// Load Mute State

// Load Mute State
const storage = (typeof window !== 'undefined' && window.localStorage) ? window.localStorage : { getItem: () => null, setItem: () => { } };
let isMuted = storage.getItem('syndicate_muted') === 'true';


// Global Mute Handler
export const setMuted = (muted) => {
    isMuted = muted;
    localStorage.setItem('syndicate_muted', muted);
    Howler.mute(muted); // Mute Howler
    if (muted && ctx.state === 'running') ctx.suspend();
    if (!muted && ctx.state === 'suspended') ctx.resume();
};

export const getMuted = () => isMuted;

// Throttling state
// let lastCoinSoundTime = 0;
// let lastVaskSoundTime = 0;
const lastPlayed = {};

// Sound Assets (Placeholder for Phase 4)
const ASSETS = {
    // click: new Howl({ src: ['/assets/click.mp3'] }) 
};

export const playSound = (type = 'click') => {
    if (isMuted) return;

    // ONLY allow drone sounds, disable all other SFX
    if (type !== 'drone') return;

    // 1. Try Asset First (Pro)
    if (ASSETS[type]) {
        ASSETS[type].play();
        return;
    }


    // 2. Fallback to Synth (Procedural)
    if (!ctx) return; // Node-Safe Guard
    if (ctx.state === 'suspended') ctx.resume();


    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
    }
    else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.linearRampToValueAtTime(1200, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    }
    else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.2);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
    }
    else if (type === 'coin' || type === 'cash') {
        const timeSinceLast = now - (lastPlayed[type] || 0);
        if (timeSinceLast < 0.05) return; // 50ms throttle (allow some overlap for "rain" effect)
        lastPlayed[type] = now;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(2000, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
    }
    else if (type === 'vask') {
        const timeSinceLast = now - (lastPlayed[type] || 0);
        if (timeSinceLast < 0.1) return; // 100ms throttle for laundering
        lastPlayed[type] = now;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.linearRampToValueAtTime(800, now + 0.2);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    }
    else if (type === 'levelup') {
        // Arpeggio
        const notes = [440, 554, 659, 880]; // A Major
        notes.forEach((freq, i) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g);
            g.connect(ctx.destination);
            o.type = 'square';
            o.frequency.value = freq;
            g.gain.setValueAtTime(0.05, now + (i * 0.1));
            g.gain.exponentialRampToValueAtTime(0.001, now + (i * 0.1) + 0.3);
            o.start(now + (i * 0.1));
            o.stop(now + (i * 0.1) + 0.3);
        });
    }
    else if (type === 'boss') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(50, now);
        osc.frequency.linearRampToValueAtTime(100, now + 1.0); // Slow rise
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 1.5);
        osc.start(now);
        osc.stop(now + 1.5);
    }
    else if (type === 'alarm') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, now);
        if (osc.frequency.setTargetAtTime) {
            osc.frequency.setTargetAtTime(400, now + 0.2, 0.1); // Siren effect
        } else {
            osc.frequency.linearRampToValueAtTime(400, now + 0.5);
        }
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 1.0);
        osc.start(now);
        osc.stop(now + 1.0);
    }
    else if (type === 'punch') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
    }
    else if (type === 'drone') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.linearRampToValueAtTime(1200, now + 0.1); // High pitch zip
        osc.frequency.linearRampToValueAtTime(400, now + 0.4); // Power down
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
    }
};
