import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import Button from './Button';
import { useLanguage } from '../context/LanguageContext';

const TutorialOverlay = () => {
    const { state, dispatch } = useGame();
    const { t } = useLanguage();
    // mapped to state.tutorialStep
    // 0: Produce, 1: Sell, 2: Launder, 3: Hire, 4: Done

    const [isMinimized, setIsMinimized] = useState(false);

    if (!state.tutorialActive || (state.tutorialStep || 0) > 3) return null;

    const steps = [
        {
            title: t('tutorial.step1.title'),
            text: t('tutorial.step1.text'),
            sub: t('tutorial.step1.sub'),
            icon: "fa-cannabis",
            progress: `${state.stats?.produced?.hash_lys || 0} / 5`
        },
        {
            title: t('tutorial.step2.title'),
            text: t('tutorial.step2.text'),
            sub: t('tutorial.step2.sub'),
            icon: "fa-hand-holding-dollar",
            progress: `${state.stats?.sold || 0} / 5`
        },
        {
            title: t('tutorial.step3.title'),
            text: t('tutorial.step3.text'),
            sub: t('tutorial.step3.sub'),
            icon: "fa-soap",
            progress: `${state.stats?.laundered || 0} / 100`
        },
        {
            title: t('tutorial.step4.title'),
            text: t('tutorial.step4.text'),
            sub: t('tutorial.step4.sub'),
            icon: "fa-users",
            progress: `${state.staff?.pusher || 0} / 1`
        }
    ];

    const currentStepIndex = state.tutorialStep || 0;
    const currentStep = steps[currentStepIndex];

    if (!currentStep) return null;

    // --- MINIMIZED VIEW ---
    if (isMinimized) {
        return (
            <div className="fixed bottom-24 right-4 z-[90] pointer-events-auto animate-in slide-in-from-right duration-300">
                <button
                    onClick={() => setIsMinimized(false)}
                    className="group bg-black/80 backdrop-blur-md border border-indigo-500/50 rounded-full w-12 h-12 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:scale-110 hover:border-indigo-400 transition-all"
                >
                    <div className="relative">
                        <i className={`fa-solid ${currentStep.icon} text-indigo-400 text-lg group-hover:text-white transition-colors`}></i>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-black animate-pulse"></div>
                    </div>
                </button>
            </div>
        );
    }

    // --- EXPANDED VIEW ---
    return (
        <div className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-[90] w-[calc(100vw-2rem)] md:w-80 pointer-events-auto">
            {/* Glass Container */}
            <div className="bg-black/80 backdrop-blur-xl border border-indigo-500/30 rounded-lg p-4 shadow-[0_0_30px_rgba(99,102,241,0.15)] relative overflow-hidden animate-in slide-in-from-right duration-500">

                {/* Header Actions */}
                <div className="absolute top-2 right-2 z-20">
                    <button
                        onClick={() => setIsMinimized(true)}
                        className="text-indigo-400/50 hover:text-white p-1 transition-colors"
                    >
                        <i className="fa-solid fa-minus text-xs"></i>
                    </button>
                </div>

                {/* Scanline Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,255,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-20"></div>
                <div className="absolute top-0 left-0 w-full h-[1px] bg-indigo-500/50 animate-scan"></div>

                <div className="flex items-start gap-4 relative z-10">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/40 shrink-0 animate-pulse mt-1">
                        <i className={`fa-solid ${currentStep.icon}`}></i>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pr-4">
                        <div className="flex justify-between items-center mb-1">
                            <h4 className="text-[10px] font-black text-indigo-400 tracking-widest uppercase">
                                {t('tutorial.header')} // {t('tutorial.step_label')} {currentStepIndex + 1}
                            </h4>
                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></div>
                        </div>

                        <h3 className="text-sm font-bold text-white leading-tight mb-1">
                            {currentStep.title}
                        </h3>

                        <p className="text-[11px] text-zinc-300 mb-2">
                            {currentStep.text}
                        </p>

                        <p className="text-[10px] text-indigo-300/80 font-mono bg-indigo-500/10 p-1.5 rounded border border-indigo-500/20">
                            &gt; {currentStep.sub}
                        </p>

                        {/* Progress Bar */}
                        <div className="mt-3">
                            <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 mb-1">
                                <span>{t('tutorial.status')}</span>
                                <span className="text-white">{currentStep.progress}</span>
                            </div>
                            {/* Simple progress bar visual could go here if needed, but text is fine */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorialOverlay;
