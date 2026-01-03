import React from 'react';
import { CONFIG } from '../config/gameConfig';
import Button from './Button';

const TutorialOverlay = ({ step, state, onNext, onSkip }) => {
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
            task: "Gå til FINANS fanen og hvidvask mindst 100 kr.",
            check: () => (state.stats.laundered || 0) >= 100,
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

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-[600px] z-[90] pointer-events-none animate-in slide-in-from-bottom-6 duration-500">
            {/* SULTAN CARD */}
            <div className="relative bg-[#0f1012] text-white p-5 rounded-2xl shadow-2xl border border-emerald-500/30 flex items-start gap-5 pointer-events-auto overflow-hidden">

                {/* Background Decor */}
                <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl rotate-12 pointer-events-none">
                    <i className={`fa-solid ${current.icon}`}></i>
                </div>

                {/* Avatar */}
                <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-900 to-black border border-emerald-500/50 flex items-center justify-center shadow-[0_0_15px_-5px_rgba(16,185,129,0.5)]">
                        <i className="fa-solid fa-user-tie text-2xl text-emerald-400"></i>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#0f1012] flex items-center justify-center text-[10px] font-bold">
                        {step + 1}
                    </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 relative z-10">
                    <div className="flex justify-between items-start mb-1">
                        <h4 className="font-black uppercase text-emerald-500 tracking-wider text-sm">
                            {current.title}
                        </h4>
                        <Button
                            onClick={onSkip}
                            className="text-[10px] font-bold uppercase"
                            variant="ghost"
                        >
                            Skip Tutorial
                        </Button>
                    </div>

                    <p className="text-sm text-zinc-300 leading-relaxed mb-3 font-light">
                        "{current.msg}"
                    </p>

                    <div className={`p-3 rounded-lg border flex items-center gap-3 transition-all duration-300 
                        ${isComplete ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-black/40 border-white/5'}`}>

                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border transition-all
                            ${isComplete ? 'bg-emerald-500 text-black border-emerald-400 scale-110' : 'bg-transparent border-zinc-600 text-zinc-600'}`}>
                            <i className={`fa-solid ${isComplete ? 'fa-check' : 'fa-circle-dot'}`}></i>
                        </div>

                        <div className="flex-1">
                            <div className="text-[10px] uppercase font-bold text-zinc-500 mb-0.5">Opgave</div>
                            <div className={`text-xs font-medium ${isComplete ? 'text-emerald-400' : 'text-white'}`}>
                                {current.task}
                            </div>
                        </div>

                        {isComplete && (
                            <Button
                                onClick={onNext}
                                className="px-3 py-1.5 animate-pulse"
                                variant="primary"
                                size="sm"
                            >
                                NÆSTE
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorialOverlay;
