import React from 'react';
import { formatNumber } from '../../utils/gameMath';
import { CONFIG } from '../../config/gameConfig';
import { useLanguage } from '../../context/LanguageContext';
import { useTooltip } from '../../hooks/useTooltip';
import Tooltip, { TooltipHeader, TooltipSection, TooltipRow } from '../Tooltip';

const MetaDisplay = ({ state }) => {
    const { t } = useLanguage();
    const { isOpen, close, getTriggerProps } = useTooltip();

    return (
        <div className="flex items-center gap-3 w-1/3">
            {/* Rank Badge */}
            <div
                {...getTriggerProps('xp')}
                className={`w-9 h-9 md:w-10 md:h-10 rounded-lg bg-theme-surface-elevated border flex items-center justify-center font-black text-theme-text-primary text-xs shadow-inner relative cursor-pointer transition-all shrink-0 ${isOpen('xp') ? 'border-theme-info scale-105 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-theme-border-subtle'}`}
            >
                {state.level}

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

            {/* Title Text & XP Bar */}
            <div className="flex flex-col justify-center gap-0.5 w-full max-w-[140px]">
                <div className="text-[10px] font-black text-theme-text-primary uppercase tracking-tighter truncate leading-none">
                    {t(`ranks.${state.level - 1}`) || CONFIG.levelTitles[state.level - 1]}
                </div>
                {/* Always Visible XP Bar */}
                <div className="w-full h-1.5 bg-theme-surface-base/50 rounded-full overflow-hidden border border-theme-border-subtle">
                    <div className="h-full bg-gradient-to-r from-theme-info to-theme-primary" style={{ width: `${Math.min(100, (state.xp / state.nextLevelXp) * 100)}%` }}></div>
                </div>
            </div>
        </div>
    );
};

export default MetaDisplay;
