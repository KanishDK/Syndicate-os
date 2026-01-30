import React from 'react';
import { CONFIG } from '../config/gameConfig';
import { formatNumber } from '../utils/gameMath';
import { useLanguage } from '../context/LanguageContext';
import GlassCard from './ui/GlassCard';

const PrestigeCalculator = ({ state }) => {
    const { t } = useLanguage();

    // Prestige Logic matching EmpireTab.jsx
    const currentMult = state.prestige?.multiplier || 1;
    const { base, scale, divisor, logBase } = CONFIG.prestige.formula;
    const lifetimeEarnings = state.lifetime?.earnings || 0;

    // The actual formula used in EmpireTab
    const projectedMult = Math.max(base, Math.floor(Math.log10(Math.max(1, lifetimeEarnings / logBase)) * scale) / divisor);

    // Requirements
    const reqLevel = 10;
    const reqCash = CONFIG.prestige.threshold;
    const hasLevel = state.level >= reqLevel;
    const hasCash = state.cleanCash >= reqCash;
    const canPrestige = hasLevel && hasCash;

    return (
        <GlassCard className="p-6 bg-purple-500/5 border-purple-500/20 mb-8" variant="glass">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                    <i className="fa-solid fa-calculator text-xl"></i>
                </div>
                <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tighter">
                        {t('prestige.calculator.title') || 'Prestige Beregner'}
                    </h3>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                        {t('prestige.calculator.subtitle') || 'Se din næste multiplier'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-xs text-zinc-400 font-bold uppercase">{t('prestige.calculator.current_mult') || 'Nuværende Multiplier'}</span>
                        <span className="text-xl font-mono font-black text-white">x{currentMult.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                        <span className="text-xs text-purple-300 font-bold uppercase">{t('prestige.calculator.projected_mult') || 'Næste Multiplier'}</span>
                        <span className="text-2xl font-mono font-black text-purple-400 animate-pulse-slow">x{projectedMult.toFixed(2)}</span>
                    </div>
                </div>

                <div className="bg-black/40 rounded-xl p-4 border border-white/5 flex flex-col justify-center">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">{t('prestige.calculator.requirements') || 'Krav for Nulstilling'}</div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className={hasLevel ? 'text-green-400' : 'text-zinc-500'}>
                                <i className={`fa-solid fa-${hasLevel ? 'check-circle' : 'circle-xmark'} mr-2`}></i>
                                {t('empire.reset.req_level', { level: reqLevel })}
                            </span>
                            <span className="font-mono text-[10px]">{state.level} / {reqLevel}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className={hasCash ? 'text-green-400' : 'text-zinc-500'}>
                                <i className={`fa-solid fa-${hasCash ? 'check-circle' : 'circle-xmark'} mr-2`}></i>
                                {t('empire.reset.req_cash', { amount: formatNumber(reqCash) })}
                            </span>
                            <span className="font-mono text-[10px]">{formatNumber(state.cleanCash)} / {formatNumber(reqCash)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-[10px] text-zinc-500 italic leading-relaxed">
                    {t('prestige.calculator.desc') || 'Multiplier beregnes ud fra dine samlede livstidsindtjeninger. Jo mere du har tjent i alt, jo stærkere starter du forfra.'}
                </p>
            </div>
        </GlassCard>
    );
};

export default PrestigeCalculator;
