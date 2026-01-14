import React from 'react';
import { CONFIG } from '../config/gameConfig';
import { formatNumber } from '../utils/gameMath';
import { useLanguage } from '../context/LanguageContext';
import Button from './Button';
import BulkControl from './BulkControl';

import { useUI } from '../context/UIContext';

const EmpireTab = ({ state, doPrestige, purchaseMastery }) => {
    const { t } = useLanguage();
    const { buyAmount } = useUI();

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* HERO HEADER */}
            <div className="relative mb-12 p-8 rounded-3xl overflow-hidden bg-theme-surface-highlight border border-theme-primary/30 shadow-[0_0_50px_rgba(168,85,247,0.1)]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-theme-primary/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

                {/* BULK TOGGLE OVERLAY */}
                <BulkControl
                    className="absolute top-4 right-4 z-20"
                />

                <div className="relative z-10 text-center">
                    <div className="inline-block p-4 rounded-full bg-theme-primary/10 mb-4 animate-pulse-slow">
                        <i className="fa-solid fa-crown text-5xl text-theme-primary"></i>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-theme-text-primary mb-2 tracking-tighter">
                        {t('empire.title').split(' ')[0]} <span className="text-transparent bg-clip-text bg-gradient-to-r from-theme-primary to-theme-accent">{t('empire.title').split(' ').slice(1).join(' ')}</span>
                    </h1>
                    <p className="text-theme-text-secondary text-lg max-w-xl mx-auto">
                        {t('empire.subtitle')}
                    </p>
                </div>
            </div>

            {/* MASTERY SHOP (NEW PLATINUM FEATURE) */}
            <div className="mb-12 bg-theme-surface-elevated rounded-3xl p-8 border border-theme-border-subtle shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-theme-text-primary uppercase tracking-tighter flex items-center gap-3">
                            <i className="fa-solid fa-gem text-theme-accent"></i> {t('empire.mastery.title')}
                        </h2>
                        <p className="text-theme-text-muted text-xs uppercase font-bold">{t('empire.mastery.subtitle')}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-theme-accent/10 px-4 py-2 rounded-2xl border border-theme-accent/20 shadow-inner">
                        <i className="fa-solid fa-gem text-theme-accent animate-bounce"></i>
                        <span className="text-2xl font-black text-theme-accent font-mono">{state.diamonds || 0}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(CONFIG.masteryPerks).map(([key, perk]) => {
                        const isOwned = state.masteryPerks?.[key];
                        return (
                            <div key={key} className={`p-4 rounded-2xl border transition-all ${isOwned ? 'bg-theme-accent/10 border-theme-accent/40' : 'bg-theme-surface-base/40 border-theme-border-subtle hover:border-theme-accent/30'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <div className={`p-2 rounded-lg ${isOwned ? 'bg-theme-accent text-theme-text-inverse shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-theme-surface-glass text-theme-accent'}`}>
                                        <i className={`fa-solid ${perk.icon}`}></i>
                                    </div>
                                    {isOwned && <span className="text-[10px] font-black text-theme-accent uppercase">{t('empire.mastery.active')}</span>}
                                </div>
                                <div className="text-sm font-black text-theme-text-primary uppercase mb-1">{perk.name}</div>
                                <p className="text-xs text-theme-text-muted leading-tight mb-4 min-h-[30px]">{perk.desc}</p>
                                {!isOwned && (
                                    <Button
                                        onClick={() => purchaseMastery(key)}
                                        disabled={(state.diamonds || 0) < perk.cost}
                                        className="w-full py-2 text-xs font-black uppercase"
                                        variant="primary"
                                    >
                                        {t('empire.mastery.unlock')} ({perk.cost})
                                    </Button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* PRESTIGE STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                <div className="bg-theme-surface-elevated p-6 rounded-2xl border border-theme-border-subtle flex flex-col items-center">
                    <span className="text-theme-text-muted text-xs font-bold uppercase tracking-widest mb-1">{t('empire.prestige.level')}</span>
                    <span className="text-4xl font-black text-theme-text-primary">{state.prestige?.level || 0}</span>
                </div>
                <div className="bg-theme-surface-elevated p-6 rounded-2xl border border-theme-primary/30 flex flex-col items-center relative overflow-hidden group hover:border-theme-primary/60 transition-all shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                    {/* Animated Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-theme-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-theme-primary/20 rounded-full blur-3xl animate-pulse"></div>

                    <span className="text-theme-primary text-xs font-bold uppercase tracking-widest mb-1 relative z-10">{t('empire.prestige.income_bonus')}</span>
                    <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-theme-primary to-pink-400 relative z-10 animate-pulse-slow">x{state.prestige?.multiplier || 1}</span>
                    <span className="text-[10px] text-theme-text-muted mt-1 relative z-10">{t('empire.prestige.permanent_mult')}</span>
                </div>
                <div className="bg-theme-surface-elevated p-6 rounded-2xl border border-theme-border-subtle flex flex-col items-center">
                    <span className="text-theme-warning text-xs font-bold uppercase tracking-widest mb-1">{t('empire.prestige.tokens')}</span>
                    <div className="flex items-center gap-2">
                        <i className="fa-solid fa-coins text-theme-warning"></i>
                        <span className="text-4xl font-black text-theme-text-primary">{state.prestige?.currency || 0}</span>
                    </div>
                </div>
            </div>

            {/* LIFETIME STATS (NEW PHASE 4) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <div className="bg-theme-surface-base p-4 rounded-xl border border-theme-border-subtle">
                    <div className="text-xs text-theme-text-muted font-bold uppercase tracking-wider mb-1">{t('empire.lifetime.earnings')}</div>
                    <div className="text-xl font-mono text-theme-success">{formatNumber(state.lifetime?.earnings || 0)} kr</div>
                </div>
                <div className="bg-theme-surface-base p-4 rounded-xl border border-theme-border-subtle">
                    <div className="text-xs text-theme-text-muted font-bold uppercase tracking-wider mb-1">{t('empire.lifetime.produced')}</div>
                    <div className="text-xl font-mono text-theme-info">
                        {formatNumber(Object.values(state.lifetime?.produced || {}).reduce((a, b) => a + b, 0))} <span className="text-sm text-theme-text-secondary">{t('empire.lifetime.units')}</span>
                    </div>
                </div>
                <div className="bg-theme-surface-base p-4 rounded-xl border border-theme-border-subtle">
                    <div className="text-xs text-theme-text-muted font-bold uppercase tracking-wider mb-1">{t('empire.lifetime.resets')}</div>
                    <div className="text-xl font-mono text-theme-primary">{state.prestige?.level || 0}</div>
                </div>
                <div className="bg-theme-surface-base p-4 rounded-xl border border-theme-border-subtle">
                    <div className="text-xs text-theme-text-muted font-bold uppercase tracking-wider mb-1">{t('empire.lifetime.value')}</div>
                    <div className="text-xl font-mono text-theme-warning">{formatNumber((state.cleanCash + state.dirtyCash) * (state.prestige?.multiplier || 1))} kr</div>
                </div>
            </div>

            {/* BLACK MARKET (PHASE 4: SKILL TREE) */}
            {state.prestige?.level > 0 && (
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <i className="fa-solid fa-network-wired text-purple-500 text-xl"></i>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{t('empire.network.title')}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* AGGRESSIVE BRANCH */}
                        <div className="bg-theme-danger/10 rounded-2xl p-6 border border-theme-danger/20">
                            <h3 className="text-xl font-black text-theme-danger uppercase mb-4 flex items-center gap-2">
                                <i className="fa-solid fa-skull"></i> {t('empire.network.enforcer')}
                            </h3>
                            <div className="space-y-4">
                                {Object.entries(CONFIG.perks || {})
                                    .filter(([, p]) => p.category === 'aggressive')
                                    .map(([id, perk]) => {
                                        const currentLvl = state.prestige?.perks?.[id] || 0;
                                        // Basic Cost for NEXT level:
                                        const cost = Math.floor(perk.baseCost * Math.pow(perk.costScale, currentLvl));
                                        const maxed = currentLvl >= perk.maxLevel;
                                        const canAfford = (state.prestige?.currency || 0) >= cost;

                                        return (
                                            <div key={id} className="bg-theme-surface-base/40 p-4 rounded-xl border border-theme-danger/10 active:border-theme-danger/30 transition-all">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-bold text-theme-danger/90">{perk.name}</h4>
                                                    <span className="text-[10px] font-mono text-theme-danger bg-theme-danger/20 px-1.5 py-0.5 rounded">Lvl {currentLvl}/{perk.maxLevel}</span>
                                                </div>
                                                <p className="text-sm text-theme-text-muted mb-3">{perk.desc}</p>

                                                {!maxed ? (
                                                    <Button
                                                        onClick={() => window.dispatchEvent(new CustomEvent('BUY_PERK', { detail: { id, cost, amount: buyAmount === 1 ? 1 : (buyAmount === 10 ? 10 : 'max') } }))}
                                                        disabled={!canAfford}
                                                        className="w-full py-2 flex items-center justify-center gap-2"
                                                        size="sm"
                                                        variant={canAfford ? 'danger' : 'neutral'}
                                                    >
                                                        <span>{t('empire.network.upgrade')}</span>
                                                        <div className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded">
                                                            <i className="fa-solid fa-coins text-[10px]"></i>
                                                            <span>{cost}</span>
                                                        </div>
                                                    </Button>
                                                ) : (
                                                    <div className="w-full py-2 bg-theme-danger/30 text-theme-danger rounded-lg text-center font-bold text-xs uppercase border border-theme-danger/30">
                                                        <i className="fa-solid fa-check mr-1"></i> {t('empire.network.maxed')}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>

                        {/* GREEDY BRANCH */}
                        <div className="bg-theme-success/10 rounded-2xl p-6 border border-theme-success/20">
                            <h3 className="text-xl font-black text-theme-success uppercase mb-4 flex items-center gap-2">
                                <i className="fa-solid fa-money-bill-wave"></i> {t('empire.network.tycoon')}
                            </h3>
                            <div className="space-y-4">
                                {Object.entries(CONFIG.perks || {})
                                    .filter(([, p]) => p.category === 'greedy')
                                    .map(([id, perk]) => {
                                        const currentLvl = state.prestige?.perks?.[id] || 0;
                                        const cost = Math.floor(perk.baseCost * Math.pow(perk.costScale, currentLvl));
                                        const maxed = currentLvl >= perk.maxLevel;
                                        const canAfford = (state.prestige?.currency || 0) >= cost;

                                        return (
                                            <div key={id} className="bg-theme-surface-base/40 p-4 rounded-xl border border-theme-success/10 active:border-theme-success/30 transition-all">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-bold text-theme-success/90">{perk.name}</h4>
                                                    <span className="text-[10px] font-mono text-theme-success bg-theme-success/20 px-1.5 py-0.5 rounded">Lvl {currentLvl}/{perk.maxLevel}</span>
                                                </div>
                                                <p className="text-sm text-theme-text-muted mb-3">{perk.desc}</p>

                                                {!maxed ? (
                                                    <Button
                                                        onClick={() => window.dispatchEvent(new CustomEvent('BUY_PERK', { detail: { id, cost } }))}
                                                        disabled={!canAfford}
                                                        className="w-full py-2 flex items-center justify-center gap-2"
                                                        size="sm"
                                                        variant={canAfford ? 'primary' : 'neutral'}
                                                    >
                                                        <span>{t('empire.network.upgrade')}</span>
                                                        <div className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded">
                                                            <i className="fa-solid fa-coins text-[10px]"></i>
                                                            <span>{cost}</span>
                                                        </div>
                                                    </Button>
                                                ) : (
                                                    <div className="w-full py-2 bg-theme-success/30 text-theme-success rounded-lg text-center font-bold text-xs uppercase border border-theme-success/30">
                                                        <i className="fa-solid fa-check mr-1"></i> {t('empire.network.maxed')}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>

                    {/* FORBIDDEN BRANCH (PHASE 11) */}
                    <div className="mt-8 bg-theme-primary/10 rounded-2xl p-6 border border-theme-primary/20 shadow-[0_0_30px_rgba(168,85,247,0.1)]" >
                        <h3 className="text-xl font-black text-theme-primary uppercase mb-4 flex items-center gap-2">
                            <i className="fa-solid fa-user-secret"></i> {t('empire.network.forbidden')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(CONFIG.perks || {})
                                .filter(([, p]) => p.category === 'forbidden')
                                .map(([id, perk]) => {
                                    const currentLvl = state.prestige?.perks?.[id] || 0;
                                    const cost = Math.floor(perk.baseCost * Math.pow(perk.costScale, currentLvl));
                                    const maxed = currentLvl >= perk.maxLevel;
                                    const canAfford = (state.prestige?.currency || 0) >= cost;

                                    return (
                                        <div key={id} className="bg-theme-surface-base/40 p-4 rounded-xl border border-theme-primary/10 active:border-theme-primary/30 transition-all">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-theme-primary/90">{perk.name}</h4>
                                                <span className="text-[10px] font-mono text-theme-primary bg-theme-primary/20 px-1.5 py-0.5 rounded">Lvl {currentLvl}/{perk.maxLevel}</span>
                                            </div>
                                            <p className="text-sm text-theme-text-muted mb-3 min-h-[32px]">{perk.desc}</p>

                                            {!maxed ? (
                                                <Button
                                                    onClick={() => window.dispatchEvent(new CustomEvent('BUY_PERK', { detail: { id, cost } }))}
                                                    disabled={!canAfford}
                                                    className="w-full py-2 flex items-center justify-center gap-2"
                                                    size="sm"
                                                    variant={canAfford ? 'primary' : 'neutral'}
                                                >
                                                    <span>{t('empire.network.unlock')}</span>
                                                    <div className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded">
                                                        <i className="fa-solid fa-coins text-[10px]"></i>
                                                        <span>{cost}</span>
                                                    </div>
                                                </Button>
                                            ) : (
                                                <div className="w-full py-2 bg-theme-primary/30 text-theme-primary rounded-lg text-center font-bold text-xs uppercase border border-theme-primary/30">
                                                    <i className="fa-solid fa-check mr-1"></i> {t('empire.network.maxed')}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            )}

            {/* RESET BUTTON */}
            <div className="p-8 rounded-2xl bg-gradient-to-r from-theme-danger/20 to-theme-surface-base border border-theme-danger/20 mt-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-bold text-theme-text-primary mb-2">{t('empire.reset.title')}</h3>
                        <p className="text-theme-text-muted text-sm max-w-md">
                            {t('empire.reset.desc')}
                        </p>
                    </div>

                    {state.level >= 10 && state.cleanCash >= 150000 ? (
                        <Button
                            onClick={doPrestige}
                            className="px-8 py-4 w-full md:w-auto relative overflow-hidden group shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:shadow-[0_0_50px_rgba(239,68,68,0.5)] transition-all"
                            variant="danger"
                            size="lg"
                        >
                            {/* Animated Background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>

                            <div className="flex flex-col items-center relative z-10">
                                <span className="block text-[10px] opacity-70 mb-0.5">{t('empire.reset.current')}: x{state.prestige?.multiplier || 1}</span>
                                <span className="text-lg font-black">{t('empire.reset.button')}</span>
                                <span className="block text-[10px] opacity-70 mt-0.5">→ x{(state.prestige?.multiplier || 1) + 0.5} Multiplier</span>
                            </div>
                        </Button>
                    ) : (
                        <div className="px-6 py-3 bg-theme-surface-elevated text-theme-text-muted font-bold rounded-xl border border-theme-border-subtle uppercase text-sm cursor-not-allowed">
                            {state.level < 10 ? t('empire.reset.required') : `Requires 150,000 kr (${formatNumber(state.cleanCash)} / 150,000)`}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmpireTab;
