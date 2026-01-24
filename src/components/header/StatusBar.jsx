import React from 'react';
import { formatNumber } from '../../utils/gameMath';
import { useLanguage } from '../../context/LanguageContext';
import { useTooltip } from '../../hooks/useTooltip';
import Tooltip, { TooltipHeader, TooltipSection, TooltipFooter, TooltipRow } from '../Tooltip';
import Button from '../Button';


const StatusBar = ({ state, incomeClean, incomeDirty, bribePolice, activateGhostMode }) => {
    const { t } = useLanguage();
    // We use a single useTooltip hook to manage the state of 'clean', 'heat', 'dirty' tooltips
    const { isOpen, close, getTriggerProps } = useTooltip();

    return (
        <div className="h-12 bg-theme-bg-secondary/60 border-b border-theme-border-subtle backdrop-blur-md">
            <div className="w-full max-w-6xl mx-auto h-full flex justify-between items-center px-2 md:px-6">

                {/* --- LEFT: CLEAN CASH --- */}
                <div
                    {...getTriggerProps('clean')}
                    className={`flex items-center gap-3 w-1/3 relative cursor-pointer group transition-all ${isOpen('clean') ? 'scale-105' : ''}`}
                >
                    <Tooltip isOpen={isOpen('clean')} onClose={close} accentColor="success" position="bottom-left">
                        <TooltipHeader title={t('header.clean_tooltip.title')} accentColor="success" />
                        <TooltipSection>
                            <TooltipRow label={t('header.clean_tooltip.launder')} value={`+${formatNumber(incomeClean)}/s`} />
                            <TooltipRow label={t('header.clean_tooltip.legal')} value="0/s" />
                        </TooltipSection>
                        <TooltipFooter>{t('header.clean_tooltip.footer')}</TooltipFooter>
                    </Tooltip>

                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${isOpen('clean') ? 'bg-theme-success text-black' : 'bg-theme-success/20 text-theme-success'} ${state.activeBuffs?.showCleanWarning ? 'animate-bounce-short bg-theme-danger/20 text-theme-danger border border-theme-danger/50' : ''}`}>
                        <i className="fa-solid fa-sack-dollar text-sm"></i>
                    </div>
                    <div className="flex flex-col">
                        <span className={`text-[9px] font-bold uppercase tracking-wider leading-none transition-colors ${state.activeBuffs?.showCleanWarning ? 'text-theme-danger' : 'text-theme-success'}`}>
                            {state.activeBuffs?.showCleanWarning ? t('header.clean_cash_warning') : t('header.clean_cash')}
                        </span>
                        <div className="flex items-baseline gap-0.5 md:gap-1">
                            <span className={`text-xs md:text-sm font-black font-mono leading-none transition-all ${state.activeBuffs?.showCleanWarning ? 'text-theme-danger scale-110' : (isOpen('clean') ? 'text-theme-success' : 'text-theme-text-primary')}`}>
                                {formatNumber(state.cleanCash)}
                            </span>
                            {incomeClean > 0 && <span className="text-[8px] md:text-[9px] text-theme-success font-mono animate-pulse">+{formatNumber(incomeClean)}</span>}
                        </div>
                    </div>
                </div>

                {/* --- CENTER: HEAT BAR --- */}
                <div
                    {...getTriggerProps('heat')}
                    className={`flex flex-col items-center justify-center w-1/3 px-2 relative cursor-pointer group transition-transform ${state.heat > 80 && !isOpen('heat') ? 'animate-shake' : ''} ${isOpen('heat') ? 'scale-105' : ''}`}
                >
                    <Tooltip isOpen={isOpen('heat')} onClose={close} accentColor="danger" position="bottom">
                        <TooltipHeader title={t('header.heat_tooltip.title')} accentColor="danger" />
                        <TooltipSection>
                            <TooltipRow
                                label={t('header.heat_tooltip.level')}
                                value={`${((state.heat / 500) * 100).toFixed(1)}%`}
                                valueClass={state.heat > 80 ? 'text-theme-danger font-bold' : 'text-theme-text-primary'}
                            />
                            <div className="w-full h-px bg-theme-border-default my-1"></div>
                            <TooltipRow
                                label={t('header.heat_tooltip.risk')}
                                value={`${Math.min(100, Math.max(0, state.heat - 50) * 2).toFixed(0)}%`}
                                valueClass="text-theme-danger"
                            />
                            <TooltipRow
                                label={t('header.heat_tooltip.lawyers')}
                                value={`-${((state.staff.lawyer || 0) * 0.15 * 60).toFixed(1)}/min`}
                                valueClass="text-theme-success"
                            />
                            {state.prestige?.perks?.shadow_network > 0 && (
                                <TooltipRow
                                    label={t('header.heat_tooltip.shadow_network')}
                                    value={`-${((state.prestige.perks.shadow_network * 0.05) * 10).toFixed(2)}/s`}
                                    valueClass="text-theme-text-secondary"
                                />
                            )}
                        </TooltipSection>
                        <div className="mt-3 pt-2 border-t border-theme-border-subtle space-y-2">
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    bribePolice();
                                }}
                                disabled={state.dirtyCash < 50000 || state.heat <= 0}
                                className="w-full py-1.5 text-[10px] uppercase font-bold flex justify-between px-2"
                                size="xs"
                                variant="neutral"
                            >
                                <span>{t('header.heat_tooltip.bribe')}</span>
                                <span className={state.dirtyCash >= 50000 ? 'text-theme-warning' : 'text-theme-danger'}>50k</span>
                            </Button>

                            {/* Ghost Mode Activation Button */}
                            {state.luxuryItems?.includes('ghostmode') && (
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        activateGhostMode();
                                        close();
                                    }}
                                    disabled={state.activeBuffs?.ghostMode > Date.now()}
                                    className="w-full py-1.5 text-[10px] uppercase font-bold flex items-center justify-center gap-2"
                                    size="xs"
                                    variant="primary"
                                >
                                    <span>🕶️</span>
                                    <span>{state.activeBuffs?.ghostMode > Date.now() ? 'GHOST MODE ACTIVE' : 'ACTIVATE GHOST MODE'}</span>
                                </Button>
                            )}

                            <TooltipFooter className="border-none pt-1 mt-0">
                                {t('header.heat_tooltip.cost_warning')}
                            </TooltipFooter>
                        </div>
                    </Tooltip>

                    <div className="flex items-center gap-2 mb-1">
                        <i className={`fa-solid fa-taxi text-[10px] ${state.heat > 100 ? 'text-theme-danger animate-pulse' : (state.heat > 80 ? 'text-theme-warning' : 'text-theme-text-muted')}`}></i>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${state.heat > 100 ? 'text-theme-danger animate-pulse' : (state.heat > 80 ? 'text-theme-warning' : 'text-theme-text-muted')}`}>
                            {state.heat > 100 ? t('header.heat_overheat') : t('header.heat_status')}
                        </span>
                        <span className={`text-[10px] font-mono ${state.heat > 100 ? 'text-theme-danger font-black' : (state.heat > 80 ? 'text-theme-warning font-bold' : 'text-theme-text-secondary')}`}>
                            {Math.min(100, (state.heat / 500) * 100).toFixed(0)} %
                        </span>
                    </div>
                    <div className={`w-full max-w-[200px] h-1.5 bg-theme-surface-base rounded-full overflow-hidden border ${state.heat > 100 ? 'border-theme-danger/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'border-theme-border-subtle'}`}>
                        <div
                            className={`h-full transition-all duration-500 ease-out ${state.heat > 100 ? 'bg-gradient-to-r from-theme-danger via-theme-danger to-theme-danger animate-pulse' : (state.heat > 80 ? 'bg-gradient-to-r from-theme-warning to-theme-danger' : 'bg-gradient-to-r from-theme-info to-theme-primary')}`}
                            style={{ width: `${Math.min(100, (state.heat / 500) * 100)}%` }}
                        ></div>
                    </div>
                </div>

                {/* --- RIGHT: DIRTY CASH --- */}
                <div
                    {...getTriggerProps('dirty')}
                    className={`flex items-center gap-3 w-1/3 justify-end relative cursor-pointer group transition-all ${isOpen('dirty') ? 'scale-105' : ''}`}
                >
                    <Tooltip isOpen={isOpen('dirty')} onClose={close} accentColor="warning" position="bottom-right">
                        <TooltipHeader title={t('header.dirty_tooltip.title')} accentColor="warning" />
                        <TooltipSection className="mb-2">
                            <TooltipRow label={t('header.dirty_tooltip.sales')} value={`+${formatNumber(incomeDirty)}/s`} />
                            <p className="text-[10px] text-theme-text-muted mt-2 italic">{t('header.dirty_tooltip.desc')}</p>
                        </TooltipSection>
                        <TooltipFooter>{t('header.dirty_tooltip.footer')}</TooltipFooter>
                    </Tooltip>

                    <div className="flex flex-col items-end">
                        <span className="text-[9px] text-theme-warning font-bold uppercase tracking-wider leading-none">{t('header.dirty_cash')}</span>
                        <div className="flex items-baseline gap-0.5 md:gap-1">
                            {incomeDirty > 0 && <span className="text-[8px] md:text-[9px] text-theme-warning font-mono animate-pulse">+{formatNumber(incomeDirty)}</span>}
                            <span className={`text-xs md:text-sm font-black font-mono leading-none transition-all ${isOpen('dirty') ? 'text-theme-warning' : 'text-theme-text-secondary'}`} style={{ textShadow: isOpen('dirty') ? '0 0 10px rgba(245, 158, 11, 0.8)' : '0 0 10px rgba(245, 158, 11, 0.4)' }}>
                                {formatNumber(state.dirtyCash)}
                            </span>
                        </div>
                    </div>
                    <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen('dirty') ? 'bg-theme-warning text-black' : 'bg-theme-warning/20 text-theme-warning'}`}>
                        <i className="fa-solid fa-briefcase text-[10px] md:text-sm"></i>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StatusBar;
