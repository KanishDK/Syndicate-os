import React, { useState, useEffect } from 'react';
import { CONFIG } from '../config/gameConfig';
import Button from './Button';

const TutorialOverlay = ({ step, state, onNext, onSkip }) => {
    const [isMinimized, setIsMinimized] = useState(false);

    // Content Configuration
    const steps = [
        {
            title: "Velkommen til Gaden",
            msg: "Hvad så, min ven? Jeg er Sultanen. Jeg styrer det her område. Du starter fra bunden, men med min hjælp kan du når toppen. Første skridt: Vi skal have varer.",
            task: "Gå til PRODUKTION fanen og lav 5x Hash (Lys).",
            check: () => (state.stats.produced?.hash_lys || 0) >= 5,
            icon: "fa-handshake"
        },
        {
            title: "Få skidtet ud",
            msg: "Godt arbejde. Men hash i lommen betaler ikke huslejen. Du skal af med det igen. Pas på varmen, når du sælger selv.",
            task: "Tryk 'SÆLG ALT' eller 'SÆLG 10' på produktionskortet for at få Sorte Penge.",
            check: () => (state.stats.sold || 0) >= 5,
            icon: "fa-money-bill-wave"
        },
        {
            title: "Vask Pengene",
            msg: "Du har lommerne fulde af sorte kontanter. Du kan ikke bruge dem i Netto, og du kan ikke købe udstyr for dem. Du skal vaske dem først.",
            task: "Gå til FINANS fanen og hvidvask mindst 500 kr.",
            check: () => (state.stats.laundered || 0) >= 500,
            icon: "fa-soap"
        },
        {
            title: "Skalér Op",
            msg: "Du lærer hurtigt. Men du kan ikke gøre alt selv. Hvis du vil være en Boss, skal du have folk til at arbejde for dig.",
            task: "Gå til DRIFT & HR (Operationer) og ansæt 1x Pusher.",
            check: () => (state.staff.pusher > 0),
            icon: "fa-users"
        }
    ];

    const current = steps[step];
    if (!current) return null;

    const isComplete = current.check();

    // Keyboard shortcuts
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') setIsMinimized(true);
            if (e.key === 'Enter' && isComplete) onNext();
            if (e.key === 's' || e.key === 'S') onSkip();
        };

        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isComplete, onNext, onSkip]);

    // Minimized state
    if (isMinimized) {
        return (
            <div className="fixed bottom-6 right-6 z-[90] animate-in slide-in-from-bottom duration-300">
                <button
                    onClick={() => setIsMinimized(false)}
                    className="bg-terminal-black border border-terminal-green/30 px-4 py-2 font-terminal text-terminal-green hover:border-terminal-green transition-colors text-sm"
                >
                    TUTORIAL ({step + 1}/4) - Click to expand
                </button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-[600px] z-[90] pointer-events-none animate-in slide-in-from-bottom-6 duration-500">
            {/* SULTAN CARD */}
            <div className="relative bg-terminal-black text-terminal-green p-4 md:p-5 border border-terminal-green/30 flex items-start gap-4 md:gap-5 pointer-events-auto overflow-hidden">

                {/* Scanline Effect */}
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,255,65,0.03)_0px,transparent_1px,transparent_2px,rgba(0,255,65,0.03)_3px)] pointer-events-none" />

                {/* Background Decor */}
                <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl rotate-12 pointer-events-none">
                    <i className={`fa-solid ${current.icon}`}></i>
                </div>

                {/* Avatar */}
                <div className="relative shrink-0">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-terminal-black border border-terminal-green/50 flex items-center justify-center">
                        <i className="fa-solid fa-user-tie text-xl md:text-2xl text-terminal-green"></i>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-terminal-green text-terminal-black border-2 border-terminal-black flex items-center justify-center text-[10px] font-bold font-terminal">
                        {step + 1}
                    </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 relative z-10">
                    {/* Header with Progress */}
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h4 className="font-terminal font-bold uppercase text-terminal-green tracking-wider text-sm md:text-base">
                                {current.title}
                            </h4>
                            {/* Progress Indicator */}
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex gap-1">
                                    {[0, 1, 2, 3].map(i => (
                                        <div
                                            key={i}
                                            className={`w-2 h-2 ${i === step ? 'bg-terminal-green' :
                                                    i < step ? 'bg-terminal-green/50' :
                                                        'bg-terminal-green/20'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-[10px] text-terminal-green/50 font-terminal">
                                    {step + 1}/4
                                </span>
                            </div>
                        </div>

                        {/* Control Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsMinimized(true)}
                                className="text-terminal-green/50 hover:text-terminal-green transition-colors"
                                title="Minimize (ESC)"
                            >
                                <i className="fa-solid fa-minus text-xs"></i>
                            </button>
                            <button
                                onClick={onSkip}
                                className="text-terminal-green/50 hover:text-terminal-green transition-colors"
                                title="Skip Tutorial (S)"
                            >
                                <i className="fa-solid fa-xmark text-xs"></i>
                            </button>
                        </div>
                    </div>

                    <p className="text-xs md:text-sm text-terminal-green/70 leading-relaxed mb-3 font-terminal">
                        "{current.msg}"
                    </p>

                    <div className={`p-3 border flex items-center gap-3 transition-all duration-300 
                        ${isComplete ? 'bg-terminal-green/10 border-terminal-green/30' : 'bg-terminal-black border-terminal-green/20'}`}>

                        <div className={`w-6 h-6 flex items-center justify-center text-xs border transition-all
                            ${isComplete ? 'bg-terminal-green text-terminal-black border-terminal-green' : 'bg-transparent border-terminal-green/30 text-terminal-green/50'}`}>
                            <i className={`fa-solid ${isComplete ? 'fa-check' : 'fa-circle-dot'}`}></i>
                        </div>

                        <div className="flex-1">
                            <div className="text-[10px] uppercase font-bold text-terminal-green/50 mb-0.5 font-terminal">OPGAVE</div>
                            <div className={`text-xs font-terminal ${isComplete ? 'text-terminal-green' : 'text-terminal-green/70'}`}>
                                {current.task}
                            </div>
                        </div>

                        {isComplete && (
                            <Button
                                onClick={onNext}
                                className="px-3 py-1.5 animate-pulse text-xs"
                                variant="primary"
                                size="sm"
                            >
                                NÆSTE
                            </Button>
                        )}
                    </div>

                    {/* Keyboard Hints */}
                    <div className="mt-2 text-[9px] text-terminal-green/30 font-terminal">
                        ESC: Minimize | {isComplete ? 'ENTER: Next | ' : ''}S: Skip
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorialOverlay;
