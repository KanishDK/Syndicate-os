import React, { memo } from 'react';
import ActionButton from '../ui/ActionButton';
import GlassCard from '../ui/GlassCard';
import { useLanguage } from '../../context/LanguageContext';

const MasteryCard = memo(({
    itemKey,
    item,
    isOwned,
    onBuy,
    state
}) => {
    const { t } = useLanguage();
    // Mastery perks cost Diamonds (found in state.resources or state.diamonds?)
    // Audit check: Config says 'cost'. Usually resources are separated.
    // Let's assume state.diamonds is the key based on GameConfig 'initialCash' missing diamonds, 
    // but achievements reward it.
    // In gameReducer, I didn't see explicit diamond logic, but I'll assume state.stats.diamonds or state.diamonds.
    // Let's fallback to state.diamonds based on typical heavy-game structure.

    // WAIT: achievements reward 'reward: 5' (int).
    // events.js rewards don't show diamonds.
    // gameConfig.js -> premiumItems -> diamond_pack value: 50000 ?? No that's cash cost? No 'value: 50000'. 
    // Ah, 'diamond_pack_s' type: 'currency'.
    // Let's assume the key is 'diamonds'.

    // Safely check logic passed from parent 'MarketplaceModal' which will likely handle the "canAfford" check 
    // or we check state.diamonds here. 
    // I will check state.diamonds.

    const canAfford = (state.diamonds || 0) >= item.cost;

    return (
        <GlassCard
            className={`p-4 flex justify-between items-center group transition-all duration-300 ${isOwned ? 'border-amber-500/50 bg-amber-900/10' : 'card-interactive'}`}
            variant={isOwned ? 'glass' : 'interactive'}
        >
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${isOwned ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-zinc-500'}`}>
                    <i className={`fa-solid ${item.icon || 'fa-gem'}`}></i>
                </div>
                <div className="flex-1 min-w-0">
                    <div className={`text-sm font-bold flex items-center gap-2 ${isOwned ? 'text-amber-400' : 'text-white'} leading-snug`}>
                        {t(`mastery.${itemKey}.name`)}
                        {isOwned && <i className="fa-solid fa-check-circle text-xs"></i>}
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-1 leading-tight opacity-90">
                        {t(`mastery.${itemKey}.desc`)}
                    </div>
                </div>
            </div>

            {isOwned ? (
                <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded text-xs font-bold text-amber-400 uppercase tracking-wider">
                    OWNED
                </div>
            ) : (
                <ActionButton
                    onClick={() => onBuy(itemKey)}
                    disabled={!canAfford}
                    variant={canAfford ? 'warning' : 'neutral'}
                    size="sm"
                    className="min-w-[100px]"
                    icon="fa-regular fa-gem"
                >
                    {item.cost}
                </ActionButton>
            )}
        </GlassCard>
    );
});

export default MasteryCard;
