import React from 'react';
import { CONFIG } from '../config/gameConfig';
import { formatNumber } from '../utils/gameMath';
import { useLanguage } from '../context/LanguageContext';
import ActionButton from './ui/ActionButton';
import GlassCard from './ui/GlassCard';
import BulkControl from './BulkControl';
import { useUI } from '../context/UIContext';
import TabHeader from './TabHeader';

const EmpireTab = ({ state, doPrestige, purchaseMastery }) => {
    const { t } = useLanguage();
    const { buyAmount } = useUI();

    // Prestige Logic
    const currentMult = state.prestige?.multiplier || 1;
    const { base, scale, divisor, logBase } = CONFIG.prestige.formula;
    const lifetimeEarnings = state.lifetime?.earnings || 0;
    const projectedMult = Math.max(base, Math.floor(Math.log10(Math.max(1, lifetimeEarnings / logBase)) * scale) / divisor);

    // Requirements
    const reqLevel = 10;
    const reqCash = CONFIG.prestige.threshold;
    const hasLevel = state.level >= reqLevel;
    const hasCash = state.cleanCash >= reqCash;
    const canPrestige = hasLevel && hasCash;

    return (
        <div className="max-w-6xl mx-auto h-full flex flex-col pb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                {/* HERO HEADER */}
                <div className="relative mb-12 p-8 rounded-3xl overflow-hidden bg-theme-surface-highlight border border-theme-primary/30 shadow-[0_0_50px_rgba(168,85,247,0.1)]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-theme-primary/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    {/* BULK TOGGLE OVERLAY */}
                    <BulkControl
                        className="absolute top-4 right-4 z-20"
                    />

                    <div className="relative z-10 text-center">
                        <div className="inline-block p-4 rounded-full bg-theme-primary/10 mb-4 animate-pulse-slow">
                            <i className="fa-solid fa-crown text-5xl text-theme-primary"></i>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-theme-text-primary mb-2 tracking-tighter">
                            {t('empire.title').split(' ')[0]} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">{t('empire.title').split(' ').slice(1).join(' ')}</span>
                        </h1>
                        <p className="text-theme-text-secondary text-lg max-w-xl mx-auto">
                            {t('empire.subtitle')}
                        </p>
                    </div>
                </div>

                {/* MASTERY SHOP (NEW PLATINUM FEATURE) */}
                <GlassCard className="mb-12 p-8" variant="glass">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-black text-theme-text-primary uppercase tracking-tighter flex items-center gap-3">
                                <i className="fa-solid fa-gem text-theme-accent"></i> {t('empire.mastery.title')}
                            </h2>
                            <p className="text-theme-text-muted text-xs uppercase font-bold">{t('empire.mastery.subtitle')}</p>
                        </div>
                        <div className="flex items-center gap-3 bg-theme-accent/10 px-4 py-2 rounded-xl border border-theme-accent/20 shadow-inner">
                            <i className="fa-solid fa-gem text-theme-accent animate-bounce"></i>
                            <span className="text-2xl font-black text-theme-accent font-mono">{state.diamonds || 0}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(CONFIG.masteryPerks).map(([key, perk]) => {
                            const isOwned = state.masteryPerks?.[key];
                            return (
                                <GlassCard
                                    key={key}
                                    className={`p-4 transition-all hover:border-theme-accent/30 group flex flex-col`}
                                    variant={isOwned ? 'primary' : 'interactive'}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className={`p-2 rounded-lg ${isOwned ? 'bg-theme-accent text-theme-text-inverse shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-theme-surface-glass text-theme-accent'}`}>
                                            <i className={`fa-solid ${perk.icon}`}></i>
                                        </div>
                                        {isOwned && <span className="text-[10px] font-black text-theme-accent uppercase">{t('empire.mastery.active')}</span>}
                                    </div>
                                    <div className="text-sm font-black text-theme-text-primary uppercase mb-1">{t(perk.name)}</div>
                                    <p className="text-xs text-theme-text-muted leading-tight mb-4 min-h-[30px]">{t(perk.desc)}</p>
                                    {!isOwned && (
                                        <ActionButton
                                            onClick={() => purchaseMastery(key)}
                                            disabled={(state.diamonds || 0) < perk.cost}
                                            className="w-full mt-auto"
                                            variant="primary"
                                            size="sm"
                                        >
                                            {t('empire.mastery.unlock')} ({perk.cost})
                                        </ActionButton>
                                    )}
                                </GlassCard>
                            );
                        })}
                    </div>
                </GlassCard>

                {/* PRESTIGE STATS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                    <GlassCard className="p-6 flex flex-col items-center justify-center">
                        <span className="text-theme-text-muted text-xs font-bold uppercase tracking-widest mb-1">{t('empire.prestige.level')}</span>
                        <span className="text-4xl font-black text-theme-text-primary">{state.prestige?.level || 0}</span>
                    </GlassCard>

                    <GlassCard className="p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:border-theme-primary/60 transition-all shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                        {/* Animated Background Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-theme-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-theme-primary/20 rounded-full blur-3xl animate-pulse pointer-events-none"></div>

                        <span className="text-theme-primary text-xs font-bold uppercase tracking-widest mb-1 relative z-10">{t('empire.prestige.income_bonus')}</span>
                        <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-theme-primary to-pink-400 relative z-10 animate-pulse-slow">x{state.prestige?.multiplier || 1}</span>
                        <span className="text-[10px] text-theme-text-muted mt-1 relative z-10">{t('empire.prestige.permanent_mult')}</span>
                    </GlassCard>

                    <GlassCard className="p-6 flex flex-col items-center justify-center">
                        <span className="text-theme-warning text-xs font-bold uppercase tracking-widest mb-1">{t('empire.prestige.tokens')}</span>
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-coins text-theme-warning"></i>
                            <span className="text-4xl font-black text-theme-text-primary">{state.prestige?.currency || 0}</span>
                        </div>
                    </GlassCard>
                </div>

                {/* LIFETIME STATS (NEW PHASE 4) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    <GlassCard className="p-4" variant="glass">
                        <div className="text-xs text-theme-text-muted font-bold uppercase tracking-wider mb-1">{t('empire.lifetime.earnings')}</div>
                        <div className="text-xl font-mono text-theme-success">{formatNumber(state.lifetime?.earnings || 0)} kr</div>
                    </GlassCard>
                    <GlassCard className="p-4" variant="glass">
                        <div className="text-xs text-theme-text-muted font-bold uppercase tracking-wider mb-1">{t('empire.lifetime.produced')}</div>
                        <div className="text-xl font-mono text-theme-info">
                            {formatNumber(Object.values(state.lifetime?.produced || {}).reduce((a, b) => a + b, 0))} <span className="text-sm text-theme-text-secondary">{t('empire.lifetime.units')}</span>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-4" variant="glass">
                        <div className="text-xs text-theme-text-muted font-bold uppercase tracking-wider mb-1">{t('empire.lifetime.resets')}</div>
                        <div className="text-xl font-mono text-theme-primary">{state.prestige?.level || 0}</div>
                    </GlassCard>
                    <GlassCard className="p-4" variant="glass">
                        <div className="text-xs text-theme-text-muted font-bold uppercase tracking-wider mb-1">{t('empire.lifetime.value')}</div>
                        <div className="text-xl font-mono text-theme-warning">{formatNumber((state.cleanCash + state.dirtyCash) * (state.prestige?.multiplier || 1))} kr</div>
                    </GlassCard>
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
                            <GlassCard className="bg-theme-danger/5 border-theme-danger/20 p-6" variant="custom">
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
                                                <GlassCard key={id} className="p-4 border-theme-danger/10 group" variant="interactive">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className="font-bold text-theme-danger/90 group-hover:text-theme-danger transition-colors">{t(perk.name)}</h4>
                                                        <span className="text-[10px] font-mono text-theme-danger bg-theme-danger/20 px-1.5 py-0.5 rounded">Lvl {currentLvl}/{perk.maxLevel}</span>
                                                    </div>
                                                    <p className="text-sm text-theme-text-muted mb-3">{t(perk.desc)}</p>

                                                    {!maxed ? (
                                                        <ActionButton
                                                            onClick={() => window.dispatchEvent(new CustomEvent('BUY_PERK', { detail: { id, cost, amount: buyAmount === 1 ? 1 : (buyAmount === 10 ? 10 : 'max') } }))}
                                                            disabled={!canAfford}
                                                            className="w-full flex items-center justify-center gap-2"
                                                            size="sm"
                                                            variant={canAfford ? 'danger' : 'neutral'}
                                                        >
                                                            <span>{t('empire.network.upgrade')}</span>
                                                            <div className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded">
                                                                <i className="fa-solid fa-coins text-[10px]"></i>
                                                                <span>{cost}</span>
                                                            </div>
                                                        </ActionButton>
                                                    ) : (
                                                        <div className="w-full py-2 bg-theme-danger/30 text-theme-danger rounded-lg text-center font-bold text-xs uppercase border border-theme-danger/30">
                                                            <i className="fa-solid fa-check mr-1"></i> {t('empire.network.maxed')}
                                                        </div>
                                                    )}
                                                </GlassCard>
                                            );
                                        })}
                                </div>
                            </GlassCard>

                            {/* GREEDY BRANCH */}
                            <GlassCard className="bg-theme-success/5 border-theme-success/20 p-6" variant="custom">
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
                                                <GlassCard key={id} className="p-4 border-theme-success/10 group" variant="interactive">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className="font-bold text-theme-success/90 group-hover:text-theme-success transition-colors">{t(perk.name)}</h4>
                                                        <span className="text-[10px] font-mono text-theme-success bg-theme-success/20 px-1.5 py-0.5 rounded">Lvl {currentLvl}/{perk.maxLevel}</span>
                                                    </div>
                                                    <p className="text-sm text-theme-text-muted mb-3">{t(perk.desc)}</p>

                                                    {!maxed ? (
                                                        <ActionButton
                                                            onClick={() => window.dispatchEvent(new CustomEvent('BUY_PERK', { detail: { id, cost } }))}
                                                            disabled={!canAfford}
                                                            className="w-full flex items-center justify-center gap-2"
                                                            size="sm"
                                                            variant={canAfford ? 'primary' : 'neutral'}
                                                        // Primary is usually emerald/green in my system, which fits 'success' / Greedy branch
                                                        >
                                                            <span>{t('empire.network.upgrade')}</span>
                                                            <div className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded">
                                                                <i className="fa-solid fa-coins text-[10px]"></i>
                                                                <span>{cost}</span>
                                                            </div>
                                                        </ActionButton>
                                                    ) : (
                                                        <div className="w-full py-2 bg-theme-success/30 text-theme-success rounded-lg text-center font-bold text-xs uppercase border border-theme-success/30">
                                                            <i className="fa-solid fa-check mr-1"></i> {t('empire.network.maxed')}
                                                        </div>
                                                    )}
                                                </GlassCard>
                                            );
                                        })}
                                </div>
                            </GlassCard>
                        </div>

                        {/* FORBIDDEN BRANCH (PHASE 11) */}
                        <GlassCard className="mt-8 bg-theme-primary/5 border-theme-primary/20 p-6 shadow-[0_0_30px_rgba(168,85,247,0.1)]" variant="custom">
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
                                            <GlassCard key={id} className="p-4 border-theme-primary/10 group" variant="interactive">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-bold text-theme-primary/90 group-hover:text-theme-primary transition-colors">{t(perk.name)}</h4>
                                                    <span className="text-[10px] font-mono text-theme-primary bg-theme-primary/20 px-1.5 py-0.5 rounded">Lvl {currentLvl}/{perk.maxLevel}</span>
                                                </div>
                                                <p className="text-sm text-theme-text-muted mb-3 min-h-[32px]">{t(perk.desc)}</p>

                                                {!maxed ? (
                                                    <ActionButton
                                                        onClick={() => window.dispatchEvent(new CustomEvent('BUY_PERK', { detail: { id, cost } }))}
                                                        disabled={!canAfford}
                                                        className="w-full flex items-center justify-center gap-2"
                                                        size="sm"
                                                        variant={canAfford ? 'primary' : 'neutral'}
                                                    // Primary fits purple/forbidden too if styled right, or I should add a purple variant? 
                                                    // Standard ActionButton 'primary' is Green usually. I might need a 'purple' or just use custom class overrides?
                                                    // ActionButton supports generic props.
                                                    >
                                                        <span>{t('empire.network.unlock')}</span>
                                                        <div className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded">
                                                            <i className="fa-solid fa-coins text-[10px]"></i>
                                                            <span>{cost}</span>
                                                        </div>
                                                    </ActionButton>
                                                ) : (
                                                    <div className="w-full py-2 bg-theme-primary/30 text-theme-primary rounded-lg text-center font-bold text-xs uppercase border border-theme-primary/30">
                                                        <i className="fa-solid fa-check mr-1"></i> {t('empire.network.maxed')}
                                                    </div>
                                                )}
                                            </GlassCard>
                                        );
                                    })}
                            </div>
                        </GlassCard>
                    </div>
                )}

                {/* RESET BUTTON (EXIT SCAM) */}
                <GlassCard className="p-8 border-theme-danger/20 mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center" variant="danger">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xl font-bold text-theme-text-primary flex items-center gap-3">
                                {t('empire.reset.title')} <span className="bg-theme-danger text-theme-text-inverse px-2 py-1 rounded text-[10px] uppercase font-black tracking-widest">{t('empire.reset.label')}</span>
                            </h3>
                            <p className="text-theme-text-muted text-sm mt-2">
                                {t('empire.reset.desc')}
                            </p>
                        </div>

                        <div className="space-y-2 p-4 bg-theme-surface-elevated/50 rounded-xl border border-theme-border-subtle">
                            <div className="flex items-center justify-between text-xs font-bold uppercase">
                                <span className={hasLevel ? 'text-theme-success' : 'text-theme-text-muted'}>
                                    <i className={`fa-solid fa-${hasLevel ? 'check-circle' : 'circle-xmark'} mr-2`}></i>
                                    {t('empire.reset.req_level', { level: reqLevel })}
                                </span>
                                <span className="font-mono">{state.level} / {reqLevel}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-bold uppercase">
                                <span className={hasCash ? 'text-theme-success' : 'text-theme-text-muted'}>
                                    <i className={`fa-solid fa-${hasCash ? 'check-circle' : 'circle-xmark'} mr-2`}></i>
                                    {t('empire.reset.req_cash', { amount: formatNumber(reqCash) })}
                                </span>
                                <span className="font-mono">{formatNumber(state.cleanCash)} / {formatNumber(reqCash)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <ActionButton
                            onClick={doPrestige}
                            disabled={!canPrestige}
                            className="px-8 py-6 w-full relative overflow-hidden shadow-[0_0_30px_rgba(239,68,68,0.2)] hover:shadow-[0_0_50px_rgba(239,68,68,0.4)]"
                            variant="danger"
                            size="lg"
                        >
                            <div className="flex flex-col items-center relative z-10 gap-1">
                                <span className="text-xl font-black uppercase text-theme-text-inverse">{t('empire.reset.button')}</span>
                                <div className="flex items-center gap-3 text-xs font-bold bg-black/20 px-3 py-1 rounded-full border border-white/10">
                                    <span className="opacity-70">x{currentMult.toFixed(2)}</span>
                                    <i className="fa-solid fa-arrow-right text-theme-text-inverse/50"></i>
                                    <span className="text-theme-accent animate-pulse-slow">x{projectedMult.toFixed(2)}</span>
                                </div>
                            </div>
                        </ActionButton>
                        <div className="mt-4 text-center">
                            <p className="text-[10px] text-theme-text-secondary uppercase tracking-widest">
                                {t('empire.reset.warning') || 'ADVARSEL: NULSTILLER ALT PROGRESS DETTE ER IKKE EN FORTRYDELSESKNAP'}
                            </p>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default EmpireTab;
