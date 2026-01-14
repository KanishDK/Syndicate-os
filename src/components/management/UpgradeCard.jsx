import React, { memo } from 'react';
import Button from '../Button';
import { formatNumber, getBulkCost, getMaxAffordable } from '../../utils/gameMath';
import { useLanguage } from '../../context/LanguageContext';
import { useUI } from '../../context/UIContext';

const UpgradeCard = memo(({
    itemKey,
    item,
    currentLevel,
    onBuy,
    state
}) => {
    const { t } = useLanguage();
    const { buyAmount } = useUI();
    const locked = state.level < item.reqLevel;

    if (locked) return null;

    // Cost Calculation
    const costFactor = item.costFactor || 1.5;
    let upgradeAmount = buyAmount;

    if (buyAmount === 'max') {
        upgradeAmount = getMaxAffordable(item.baseCost, costFactor, currentLevel, state.cleanCash);
    }
    if (upgradeAmount <= 0) upgradeAmount = 1;

    const cost = getBulkCost(item.baseCost, costFactor, currentLevel, upgradeAmount);
    const canAfford = state.cleanCash >= cost;

    return (
        <div className="p-4 bg-zinc-900/30 border border-white/5 rounded-lg flex justify-between items-center group card-interactive">
            <div>
                <div className="text-sm font-bold text-white max-w-[140px] truncate group-hover:text-purple-400 transition-colors">
                    {t(`upgrades.${itemKey}.name`)}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                    Lvl {currentLevel}
                    {buyAmount !== 1 && upgradeAmount > 1 && (
                        <span className="text-emerald-500 font-bold ml-1">+{upgradeAmount}</span>
                    )}
                </div>
            </div>
            <Button
                onClick={() => onBuy(itemKey, buyAmount)}
                disabled={!canAfford}
                variant={canAfford ? 'primary' : 'neutral'}
                size="sm"
                className="min-w-[70px]"
                title={`${t('ui.buy')} ${buyAmount === 'max' ? upgradeAmount : buyAmount}x`}
            >
                {formatNumber(cost)} kr
            </Button>
        </div>
    );
});

export default UpgradeCard;
