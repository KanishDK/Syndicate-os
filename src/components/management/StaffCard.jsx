import React, { memo } from 'react';
import ActionButton from '../ui/ActionButton';
import GlassCard from '../ui/GlassCard';
import { formatNumber } from '../../utils/gameMath';
import { useLanguage } from '../../context/LanguageContext';
import { useUI } from '../../context/UIContext';

const StaffCard = memo(({
    item,
    count,
    role,
    onBuy,
    onSell,
    canAfford,
    locked,
    costToDisplay,
    actualAmount,
    isWorking,
    isExpanded,
    onToggle,
    hiredDate
}) => {
    const { t } = useLanguage();
    const { buyAmount } = useUI();

    // Helper for Loyalty (Safe check)
    const [loyaltyBonus, setLoyaltyBonus] = React.useState(0);

    React.useEffect(() => {
        if (locked || count <= 0 || !hiredDate) {
            setLoyaltyBonus(0);
            return;
        }
        const daysEmployed = (Date.now() - hiredDate) / (1000 * 60 * 60 * 24);
        setLoyaltyBonus(Math.min(20, Math.floor(daysEmployed)));
    }, [locked, count, role, hiredDate]);

    return (
        <GlassCard
            variant={locked ? 'glass' : 'interactive'}
            className={`flex flex-col gap-3 group relative overflow-hidden min-h-[180px] p-5
            ${locked ? 'opacity-60 grayscale' : ''}
            ${isExpanded ? 'ring-2 ring-indigo-500/50' : ''}`}
        >

            {/* LOCKED OVERLAY */}
            {locked && (
                <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center backdrop-blur-[1px]">
                    <div className="text-theme-danger font-black uppercase text-sm flex items-center gap-2 border border-theme-danger/30 px-3 py-2 rounded bg-black/90 shadow-xl">
                        <i className="fa-solid fa-lock"></i>
                        {t('ui.locked')} (Lvl {item.reqLevel || 1})
                    </div>
                </div>
            )}

            {/* WORKING INDICATOR */}
            {isWorking && !locked && (
                <div className="absolute top-2 right-12 z-20 animate-in fade-in zoom-in duration-300">
                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                        <i className="fa-solid fa-rotate-right animate-spin text-[8px]"></i>
                        {t('management.active').toUpperCase()}
                    </span>
                </div>
            )}

            {/* LOYALTY BADGE */}
            {loyaltyBonus > 0 && (
                <div className="absolute top-2 right-2 z-20 animate-in fade-in zoom-in duration-300">
                    <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.2)]">
                        <i className="fa-solid fa-star text-[8px]"></i>
                        +{loyaltyBonus}%
                    </span>
                </div>
            )}

            {/* HEADER - Toggle Logic Isolated The Click Handler to the Header Container to prevent button clicks triggering toggle */}
            <div
                onClick={() => !locked && onToggle()}
                className={`flex justify-between items-start cursor-pointer hover:bg-white/5 rounded-lg p-2 -m-2 transition-colors relative z-10 select-none ${locked ? 'cursor-default' : ''}`}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg border relative z-10 transition-transform group-hover:scale-110 duration-300
                        ${item.role === 'producer' ? 'bg-emerald-900/20 text-emerald-400 border-emerald-500/20' :
                            item.role === 'seller' ? 'bg-indigo-900/20 text-indigo-400 border-indigo-500/20' :
                                'bg-purple-900/20 text-purple-400 border-purple-500/20'}`}>
                        <i className={`fa-solid ${item.icon || 'fa-user'}`}></i>
                    </div>
                    <div>
                        <div className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2">
                            {t(`staff.${role}.name`)}
                            {!locked && <i className={`fa-solid fa-chevron-down text-[10px] text-zinc-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}></i>}
                        </div>
                        <div className="text-[11px] text-zinc-400 leading-tight max-w-[160px]">{t(`staff.${role}.desc`)}</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm font-bold text-white bg-white/5 px-2.5 py-1 rounded border border-white/5 inline-block min-w-[32px] text-center number-ticker">
                        {count}
                    </div>
                </div>
            </div>

            {/* STATS GRID */}
            <div className="flex flex-col gap-2 relative z-10 mt-auto">
                <div
                    onClick={() => !locked && onToggle()}
                    className="grid grid-cols-2 gap-2 text-[10px] bg-black/20 p-2 rounded-lg border border-white/5 cursor-pointer hover:border-white/10 transition-colors"
                >
                    <div className="flex flex-col">
                        <span className="text-zinc-600 uppercase font-bold tracking-wider text-[10px]">{t('management.salary')}</span>
                        <span className="text-red-400 font-mono text-xs number-ticker">-{formatNumber(item.salary)} kr</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-zinc-600 uppercase font-bold tracking-wider text-[10px]">Status</span>
                        <span className={`${count > 0 ? 'text-emerald-400' : 'text-zinc-500'} font-mono uppercase text-xs`}>
                            {count > 0 ? t('management.active') : t('management.inactive')}
                        </span>
                    </div>
                </div>

                {/* EXPANDED DETAILS */}
                {isExpanded && (
                    <div className="p-2 space-y-2 bg-indigo-500/5 border border-indigo-500/20 rounded animate-in fade-in slide-in-from-top-1">
                        <div className="flex justify-between items-center border-b border-indigo-500/10 pb-1">
                            <span className="text-[9px] text-indigo-300 font-bold uppercase">{t('management.details')}</span>
                            <span className="text-[8px] text-zinc-500 italic">{t('management.per_unit')}</span>
                        </div>
                        <div className="space-y-1">
                            {item.role === 'producer' && Object.entries(item.rates || {}).map(([prod, rate]) => (
                                <div key={prod} className="flex justify-between text-[10px]">
                                    <span className="text-zinc-400 font-mono">{t(`items.${prod}.name`)}:</span>
                                    <span className="text-emerald-400 font-bold number-ticker">+{(rate * 60).toFixed(1)}/min</span>
                                </div>
                            ))}
                            {item.role === 'seller' && Object.entries(item.rates || {}).map(([prod, rate]) => (
                                <div key={prod} className="flex justify-between text-[10px]">
                                    <span className="text-zinc-400 font-mono">{t(`items.${prod}.name`)}:</span>
                                    <span className="text-amber-400 font-bold number-ticker">~{(rate * 60).toFixed(1)}/min</span>
                                </div>
                            ))}
                            {item.role === 'reducer' && (
                                <div className="flex justify-between text-[10px]">
                                    <span className="text-zinc-400 font-mono">{item.target === 'heat' ? 'Heat Dekay:' : 'Vask Rate:'}</span>
                                    <span className="text-blue-400 font-bold number-ticker">{item.target === 'heat' ? `-${item.rate}/s` : `+${(item.rate * 100).toFixed(0)}%`}</span>
                                </div>
                            )}
                            {/* Loyalty Bonus Details */}
                            {loyaltyBonus > 0 && (
                                <div className="flex justify-between text-[10px] border-t border-amber-500/10 pt-1 mt-1">
                                    <span className="text-amber-400 font-mono flex items-center gap-1">
                                        <i className="fa-solid fa-star text-[8px]"></i>
                                        {t('management.loyalty')}:
                                    </span>
                                    <span className="text-amber-400 font-bold number-ticker">+{loyaltyBonus}%</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ACTION BAR */}
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5 relative z-10 min-h-[42px]">
                <div className="flex flex-col">
                    <div className={`text-sm font-mono font-bold number-ticker ${canAfford ? 'text-emerald-400' : 'text-red-500'}`}>
                        {formatNumber(costToDisplay)} kr.
                    </div>
                    {buyAmount !== 1 && (
                        <div className="text-[10px] text-zinc-500 font-mono number-ticker">
                            for {actualAmount} stk
                        </div>
                    )}
                </div>

                <div className="flex gap-2 items-center" onClick={(e) => e.stopPropagation()}>
                    {count > 0 && onSell && (
                        <ActionButton
                            onClick={() => onSell(role, buyAmount)}
                            className="w-8 h-8 !p-0 flex items-center justify-center opacity-80 hover:opacity-100"
                            variant="danger"
                            title={`${t('management.fire')} ${buyAmount === 'max' ? t('ui.max') : buyAmount}`}
                            disabled={locked}
                        >
                            <i className="fa-solid fa-user-minus"></i>
                        </ActionButton>
                    )}

                    {/* HIRE BUTTON */}
                    <ActionButton
                        onClick={() => onBuy(role, buyAmount)}
                        disabled={!canAfford || locked}
                        variant={canAfford && !locked ? 'primary' : 'neutral'}
                        className={`flex items-center gap-2 font-bold transition-all px-4 py-1.5 
                            ${count === 0 ? 'animate-pulse' : ''}`}
                    >
                        <span>{t('management.hire')}</span>
                        <i className="fa-solid fa-plus text-[10px]"></i>
                    </ActionButton>
                </div>
            </div>
        </GlassCard>
    );
});

export default StaffCard;
