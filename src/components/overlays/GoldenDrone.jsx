
import React, { useState, useEffect } from 'react';
import { playSound } from '../../utils/audio';
import { spawnParticles } from '../../utils/particleEmitter';

const GoldenDrone = ({ onCapture }) => {
    const [isCaptured, setIsCaptured] = useState(false);
    const [position, setPosition] = useState(() => ({
        x: -100,
        y: Math.random() * (window.innerHeight - 200) + 100
    }));

    useEffect(() => {
        // Animation

        const duration = 15000; // 15s to cross screen (Slower, smoother)
        const start = Date.now();

        const animate = () => {
            const now = Date.now();
            const progress = (now - start) / duration;

            if (progress >= 1) {
                onCapture(false); // Escaped
                return;
            }

            // Update X position, keep Y for now (or add sine wave back if desired)
            setPosition(prev => ({
                ...prev,
                x: -100 + (window.innerWidth + 100) * progress,
                y: prev.y + Math.sin(progress * Math.PI * 4) * 50 // Sine wave
            }));

            if (!isCaptured) {
                requestAnimationFrame(animate);
            }
        };

        const timer = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(timer);
    }, [isCaptured, onCapture]);

    const handleClick = (e) => {
        e.stopPropagation();
        if (isCaptured) return;

        setIsCaptured(true);
        // playSound('drone'); // Removed - annoying notification sound
        spawnParticles(e.clientX, e.clientY, 'gold', 20);

        // Short delay before unmount
        setTimeout(() => {
            onCapture(true); // Caught
        }, 500);
    };



    return (
        <div
            onClick={handleClick}
            style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${isCaptured ? 1.5 : 1})`,
                opacity: isCaptured ? 0 : 1,
                transition: isCaptured ? 'all 0.5s ease-out' : 'none'
            }}
            className="fixed z-[60] cursor-pointer pointer-events-auto filter drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]"
        >
            {/* Drone Graphic (CSS Art or Icon) */}
            <div className="relative group">
                <i className="fa-solid fa-plane-up text-4xl text-yellow-400 animate-pulse"></i>
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl scale-150 animate-pulse"></div>
            </div>
        </div>
    );
};

export default GoldenDrone;
