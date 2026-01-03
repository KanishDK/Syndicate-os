import React, { useState, useEffect } from 'react';

const BootSequence = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [showCursor, setShowCursor] = useState(true);

    const bootSteps = [
        "SYNDICATE OS v1.1.0",
        "Copenhagen Underground Network",
        "",
        "Initializing...",
        "[OK] Loading kernel modules",
        "[OK] Mounting encrypted filesystem",
        "[OK] Establishing dark web connection",
        "[OK] Bypassing firewall",
        "[WARN] Heat signature detected",
        "[OK] System ready",
        "",
        "SULTANEN@TERMINAL: Connection established",
        "Welcome to the Network, soldat...",
        "",
        "Type 'help' for commands or press any key to continue...",
    ];

    // Cursor blink effect
    useEffect(() => {
        const interval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 500);
        return () => clearInterval(interval);
    }, []);

    // Boot sequence progression
    useEffect(() => {
        if (step < bootSteps.length) {
            const timer = setTimeout(() => {
                setStep(step + 1);
            }, step === 0 ? 800 : step < 3 ? 400 : 200);
            return () => clearTimeout(timer);
        } else {
            // Auto-complete after 2 seconds, or wait for user input
            const autoComplete = setTimeout(onComplete, 2000);
            return () => clearTimeout(autoComplete);
        }
    }, [step, bootSteps.length, onComplete]);

    // Allow user to skip by pressing any key
    useEffect(() => {
        const handleKeyPress = () => {
            if (step >= bootSteps.length - 1) {
                onComplete();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [step, bootSteps.length, onComplete]);

    return (
        <div className="fixed inset-0 bg-terminal-black z-[999] flex items-center justify-center font-terminal text-terminal-green overflow-hidden">
            {/* Scanline effect */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,255,65,0.03)_0px,transparent_1px,transparent_2px,rgba(0,255,65,0.03)_3px)] pointer-events-none" />

            <div className="max-w-2xl w-full px-8 relative z-10">
                {bootSteps.slice(0, step).map((line, i) => (
                    <div
                        key={i}
                        className={`mb-2 animate-in fade-in duration-200 ${line.includes('[OK]') ? 'text-terminal-green' :
                                line.includes('[WARN]') ? 'text-terminal-amber' :
                                    line.includes('[ERROR]') ? 'text-terminal-red' :
                                        line.includes('SULTANEN') ? 'text-terminal-cyan' :
                                            ''
                            }`}
                    >
                        {line}
                    </div>
                ))}
                {step < bootSteps.length && showCursor && (
                    <span className="inline-block w-2 h-4 bg-terminal-green animate-pulse">_</span>
                )}
            </div>
        </div>
    );
};

export default BootSequence;
