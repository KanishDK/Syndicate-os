import React from 'react';
import { formatNumber } from '../../utils/gameMath';
import { CONFIG } from '../../config/gameConfig';
import { useLanguage } from '../../context/LanguageContext';
import { useTooltip } from '../../hooks/useTooltip';
import Tooltip, { TooltipHeader, TooltipSection, TooltipRow } from '../Tooltip';

export const LevelBadge = ({ state }) => {
    const { t } = useLanguage();
    const { isOpen, close, getTriggerProps } = useTooltip();

    return (
        <div
            {...getTriggerProps('xp')}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-theme-surface-elevated border flex items-center justify-center font-black text-theme-text-primary text-sm shadow-inner relative cursor-pointer transition-all shrink-0 ${isOpen('xp') ? 'border-theme-info scale-110 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-theme-border-subtle'}`}
        >
            <span className="relative z-10">{state.level}</span>
            {/* Gloss effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

            <Tooltip isOpen={isOpen('xp')} onClose={close} accentColor="info" position="bottom-left">
                <TooltipHeader title={t('header.xp.title')} accentColor="info" />
                <TooltipSection>
                    <TooltipRow label={t('header.xp.current')} value={formatNumber(state.xp)} valueClass="text-theme-text-primary font-bold" />
                    <TooltipRow label={t('header.xp.next')} value={formatNumber(state.nextLevelXp)} valueClass="text-theme-text-muted" />
                    <div className="w-full h-2 bg-theme-surface-base rounded-full overflow-hidden border border-theme-border-subtle mt-2">
                        <div className="h-full bg-theme-info shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${Math.min(100, (state.xp / state.nextLevelXp) * 100)}%` }}></div>
                    </div>
                </TooltipSection>
            </Tooltip>
        </div>
    );
};

export const XPDisplay = ({ state }) => {
    const { t } = useLanguage();

    const percent = Math.min(100, (state.xp / state.nextLevelXp) * 100).toFixed(1);
    const nextRankTitle = t(`ranks.${state.level}`) || CONFIG.levelTitles[state.level] || 'MAX RANK';

    return (
        <div className="flex flex-col items-center justify-center gap-1 w-full max-w-[120px] md:max-w-[240px]">
            <div className="hidden md:block text-[10px] md:text-xs font-black text-theme-text-primary uppercase tracking-[0.2em] truncate leading-none text-shadow-sm">
                {t(`ranks.${state.level - 1}`) || CONFIG.levelTitles[state.level - 1]}
            </div>
            {/* Centered XP Bar */}
            <div className="w-full h-3.5 bg-theme-surface-base/50 rounded-full overflow-hidden border border-theme-border-subtle relative group">
                <div className="absolute inset-0 bg-theme-info/10 group-hover:bg-theme-info/20 transition-colors"></div>
                <div className="h-full bg-gradient-to-r from-theme-info via-theme-info to-theme-cyan shadow-[0_0_10px_rgba(6,182,212,0.5)]" style={{ width: `${percent}%` }}></div>

                {/* Percent Overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <span className="text-[9px] font-black text-white leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">{percent}%</span>
                </div>
            </div>

            {/* Next Rank Display */}
            <div className="hidden md:block text-[9px] text-theme-text-muted font-medium tracking-wider uppercase">
                {t('header.xp.next')}: <span className="text-theme-text-secondary">{nextRankTitle}</span>
            </div>
        </div>
    );
};

