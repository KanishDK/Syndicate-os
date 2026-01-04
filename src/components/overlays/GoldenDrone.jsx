import React, { useState, useEffect, useRef } from 'react';
import { playSound } from '../../utils/audio';
import { spawnParticles } from '../../utils/particleEmitter';

const GoldenDrone = ({ onCapture }) => {
    const [position, setPosition] = useState({ x: -100, y: 100 });
    const [isVisible, setIsVisible] = useState(false);
    const [isCaptured, setIsCaptured] = useState(false);

    // Config
    const duration = 15000; // 15 seconds to cross screen

    useEffect(() => {
        // Trigger Animation on Mount
        const startY = Math.random() * (window.innerHeight - 200) + 100;
        setPosition({ x: -100, y: startY });
        setIsVisible(true);

        // Animate
        const startTime = Date.now();
        const endX = window.innerWidth + 100;

        const interval = setInterval(() => {
            if (isCaptured) return;

            const now = Date.now();
            const progress = (now - startTime) / duration;

            if (progress >= 1) {
                setIsVisible(false);
                clearInterval(interval);
                onCapture(false); // Missed
            } else {
                setPosition(prev => ({
                    x: -100 + (endX + 100) * progress,
                    y: startY + Math.sin(progress * Math.PI * 4) * 50 // Sine wave
                }));
            }
        }, 16);

        return () => clearInterval(interval);
    }, []);

    const handleClick = (e) => {
        e.stopPropagation();
        if (isCaptured) return;

        setIsCaptured(true);
        playSound('drone');
        spawnParticles(e.clientX, e.clientY, 'gold', 20);

        // Short delay before unmount
        setTimeout(() => {
            onCapture(true); // Caught
        }, 500);
    };

    if (!isVisible) return null;

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
