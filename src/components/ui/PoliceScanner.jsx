import React, { useState, useEffect } from 'react';
import { CONFIG } from '../../config/gameConfig';

const PoliceScanner = ({ heat }) => {
    const [message, setMessage] = useState('');
    const [opacity, setOpacity] = useState(0);

    useEffect(() => {
        // High heat increases frequency of chatter
        const delay = Math.max(5000, 20000 - (heat * 150));

        const interval = setInterval(() => {
            const chatter = CONFIG.policeChatter;
            const randomMsg = chatter[Math.floor(Math.random() * chatter.length)];

            setOpacity(0);
            setTimeout(() => {
                setMessage(randomMsg);
                setOpacity(1);
            }, 500);

            // Hide after a few seconds
            setTimeout(() => {
                setOpacity(0);
            }, 4000);

        }, delay);

        return () => clearInterval(interval);
    }, [heat]);

    if (!message) return null;

    return (
        <div
            className="fixed bottom-20 left-4 pointer-events-none z-40 transition-opacity duration-500"
            style={{ opacity: opacity * (0.3 + (heat / 200)) }}
        >
            <div className="bg-black/80 border border-red-500/30 px-3 py-1 rounded text-[10px] mono text-red-400 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="uppercase tracking-widest">[RADIO]:</span>
                <span className="italic">{message}</span>
            </div>
        </div>
    );
};

export default PoliceScanner;
