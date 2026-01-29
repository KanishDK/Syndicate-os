import React from 'react';
import { CONFIG } from '../../config/gameConfig';
import { useLanguage } from '../../context/LanguageContext';
import ActionButton from '../ui/ActionButton';
import GlassCard from '../ui/GlassCard';

const DebtIntroModal = ({ onClose, debtAmount }) => {
    const { t } = useLanguage();
    const [timeLeft, setTimeLeft] = React.useState(5);
    const [canClose, setCanClose] = React.useState(false);

    // Force user to read for a few seconds
    React.useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setCanClose(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const intro = CONFIG.modes.debt.intro;

    return (
        <div className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-500">
            <div className="max-w-xl w-full">
                <GlassCard variant="danger" className="p-0 overflow-hidden shadow-[0_0_100px_rgba(220,38,38,0.2)]">
                    {/* Header Image / Graphic Area */}
                    <div className="bg-gradient-to-b from-red-900/40 to-black/60 p-8 text-center border-b border-white/5 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                        <i className="fa-solid fa-handcuffs text-6xl text-red-500/50 mb-4 animate-pulse"></i>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter drop-shadow-md">
                            {t(intro.titleKey) || intro.title}
                        </h2>
                        <div className="w-16 h-1 bg-red-600 mx-auto mt-4 rounded-full"></div>
                    </div>

                    <div className="p-8 space-y-6">
                        <p className="text-lg text-zinc-300 leading-relaxed font-medium text-center">
                            {t(intro.textKey) || intro.text}
                        </p>

                        <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-6 text-center">
                            <div className="text-xs text-red-400 uppercase tracking-widest font-bold mb-2">Current Debt</div>
                            <div className="text-4xl font-black text-red-500 font-mono tracking-tight drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                                -{new Intl.NumberFormat('da-DK').format(debtAmount)} kr
                            </div>
                        </div>

                        <div className="space-y-3 bg-black/40 rounded-lg p-4 border border-white/5 text-sm md:text-base">
                            <div className="flex items-start gap-3">
                                <i className="fa-solid fa-clock text-theme-warning mt-1"></i>
                                <span className="text-zinc-400">
                                    <strong className="text-white">Time Limit:</strong> 30 Minutes
                                </span>
                            </div>
                            <div className="flex items-start gap-3">
                                <i className="fa-solid fa-chart-line text-theme-danger mt-1"></i>
                                <span className="text-zinc-400">
                                    <strong className="text-white">Interest:</strong> 10% every 5 minutes
                                </span>
                            </div>
                            <div className="flex items-start gap-3">
                                <i className="fa-solid fa-skull text-theme-text-muted mt-1"></i>
                                <span className="text-zinc-400">
                                    <strong className="text-white">Failure:</strong> Permanent Save Deletion
                                </span>
                            </div>
                        </div>

                        <div className="pt-4">
                            <ActionButton
                                onClick={onClose}
                                variant="danger"
                                size="xl"
                                className="w-full py-4 uppercase tracking-[0.2em] font-black text-sm"
                                disabled={!canClose}
                            >
                                {canClose ? (t('ui.accept_fate') || "I UNDERSTAND") : `WAIT ${timeLeft}s`}
                            </ActionButton>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default DebtIntroModal;
