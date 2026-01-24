import React, { memo } from 'react';
import ActionButton from '../ui/ActionButton';
import GlassCard from '../ui/GlassCard';
import { useLanguage } from '../../context/LanguageContext';
import { getBulkCost, getMaxAffordable, formatNumber } from '../../utils/gameMath';

const PrestigeCard = memo(({
    itemKey,
    item,
    currentLevel,
    onBuy,
    state,
    currencyAmount // Passed from parent (state.prestige.currency)
}) => {
    const { t } = useLanguage();

    // Logic similar to UpgradeCard but for Prestige
    // Prestige perks have maxLevel usually
    const maxLevel = item.maxLevel || 10;
    const isMaxed = currentLevel >= maxLevel;

    // Cost Calculation
    const costFactor = item.costScale || 1.5;

    // For now, Prestige upgrades are 1 at a time (simplify logic vs bulk buy)
    // But if we want bulk, we can reuse getBulkCost.
    // Let's stick to 1 at a time for "Rare" feel, or follow UpgradeCard pattern?
    // UpgradeCard uses 'buyAmount'. I'll assume 1 for now to keep UI clean, 
    // unless user requests bulk prestige buying.
    const buyAmount = 1;

    // Calc cost for next level
    const cost = getBulkCost(item.baseCost, costFactor, currentLevel, buyAmount);
    const canAfford = currencyAmount >= cost;

    return (
        <GlassCard className="p-4 flex justify-between items-center group card-interactive" variant="interactive">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xl border border-purple-500/30">
                    <i className="fa-solid fa-crown"></i>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors flex items-center gap-2 leading-snug">
                        {t(`perks.${itemKey}.name`)}
                        {isMaxed && <span className="text-[10px] bg-purple-500 text-black px-1 rounded font-black">MAX</span>}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                        Lvl {currentLevel} / {maxLevel}
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-1 italic opacity-80 leading-tight">
                        {t(`perks.${itemKey}.desc`)}
                    </div>
                </div>
            </div>

            {!isMaxed && (
                <ActionButton
                    onClick={() => onBuy(itemKey)}
                    disabled={!canAfford}
                    variant={canAfford ? 'primary' : 'neutral'}
                    size="sm"
                    className="min-w-[80px]"
                    title={`${t('ui.buy')} 1x`}
                >
                    {formatNumber(cost)} <i className="fa-solid fa-crown text-[10px] ml-1"></i>
                </ActionButton>
            )}

            {isMaxed && (
                <div className="min-w-[80px] text-center text-xs font-bold text-purple-500/50">
                    COMPLETED
                </div>
            )}
        </GlassCard>
    );
});

export default PrestigeCard;
