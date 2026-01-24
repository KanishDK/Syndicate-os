import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CONFIG } from '../../config/gameConfig';
import { formatNumber, getBulkCost, getMaxAffordable } from '../../utils/gameMath';
import { useLanguage } from '../../context/LanguageContext';
import GlassCard from '../ui/GlassCard';
import ActionButton from '../ui/ActionButton';
import BulkControl from '../BulkControl';
import { useUI } from '../../context/UIContext';

const SecurityModal = ({ state, buyDefense, onClose }) => {
    const { t } = useLanguage();
    const { buyAmount } = useUI();

    // Lock Body Scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    const totalDefense = Object.entries(state.defense).reduce((acc, [key, count]) => acc + (count * CONFIG.defense[key].defenseVal), 0);

    const content = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <GlassCard className="w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden relative border-2 border-emerald-500/30 shadow-2xl shadow-emerald-500/20 rounded-2xl" variant="interactive">

                {/* HEADER - Fixed */}
                <div className="flex-none flex justify-between items-center p-6 border-b border-emerald-500/20 bg-gradient-to-r from-emerald-950/50 to-black/50 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-3xl border-2 border-emerald-500/40 shadow-lg shadow-emerald-500/20">
                            <i className="fa-solid fa-shield-halved"></i>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white uppercase tracking-wider flex items-center gap-3">
                                Sikkerhed
                                <span className="text-sm font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                                    {totalDefense} pts
                                </span>
                            </h2>
                            <p className="text-zinc-400 text-sm mt-1">Beskyt dine værdier mod politi og rivaler</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <BulkControl />
                        <button onClick={onClose} className="w-12 h-12 rounded-xl bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-all flex items-center justify-center border border-white/10 hover:border-red-500/50">
                            <i className="fa-solid fa-xmark text-2xl"></i>
                        </button>
                    </div>
                </div>

                {/* CONTENT - Fixed height, no scroll */}
                <div className="flex-1 p-8 relative overflow-hidden">

                    {/* Background Decoration */}
                    <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
                        <i className="fa-solid fa-shield-halved text-[500px] text-emerald-500"></i>
                    </div>

                    {/* Defense Items Grid - Centered */}
                    <div className="relative z-10 h-full flex items-center justify-center">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                            {Object.entries(CONFIG.defense).map(([id, item]) => {
                                const count = state.defense[id] || 0;
                                let actualAmount = buyAmount;

                                if (buyAmount === 'max') {
                                    actualAmount = getMaxAffordable(item.baseCost, item.costFactor, count, state.cleanCash);
                                }
                                if (actualAmount <= 0) actualAmount = 1;

                                const finalCost = getBulkCost(item.baseCost, item.costFactor, count, actualAmount);
                                const canAfford = state.cleanCash >= finalCost;

                                return (
                                    <GlassCard key={id} className="relative overflow-hidden p-6 group hover:border-emerald-500/50 transition-all h-full flex flex-col" variant="interactive">
                                        {/* Icon & Count */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 text-emerald-400 flex items-center justify-center border-2 border-emerald-500/30 text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg shadow-emerald-500/20">
                                                <i className={`fa-solid ${item.icon}`}></i>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-3xl font-black text-white font-mono">{count}</div>
                                                <div className="text-[9px] text-emerald-400 uppercase tracking-wider font-bold">{t('rivals.defense.active')}</div>
                                            </div>
                                        </div>

                                        {/* Name & Defense Value */}
                                        <div className="mb-3">
                                            <h4 className="font-black text-white uppercase text-lg mb-1">{t(item.name)}</h4>
                                            <div className="text-xs text-emerald-400 font-mono font-bold">+{item.defenseVal} {t('rivals.defense.points')}</div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-xs text-zinc-400 mb-4 flex-1 leading-relaxed">{t(item.desc)}</p>

                                        {/* Purchase Button */}
                                        <ActionButton
                                            onClick={() => buyDefense(id, buyAmount)}
                                            disabled={!canAfford}
                                            className="w-full flex justify-between px-4 py-3 items-center mt-auto"
                                            variant={canAfford ? "success" : "neutral"}
                                            size="md"
                                        >
                                            <span className="font-bold uppercase tracking-wider text-sm">
                                                {t('rivals.defense.buy')} ({actualAmount}x)
                                            </span>
                                            <span className={`font-mono font-black px-3 py-1 rounded-lg border text-sm ${canAfford ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-white/5 border-white/10 text-zinc-500'}`}>
                                                {formatNumber(finalCost)} kr
                                            </span>
                                        </ActionButton>
                                    </GlassCard>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </GlassCard>
        </div>
    );

    return createPortal(content, document.body);
};

export default SecurityModal;
