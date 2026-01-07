import React from 'react';
import { CONFIG } from '../config/gameConfig';
import { formatNumber } from '../utils/gameMath';
import { useLanguage } from '../context/LanguageContext';
import Button from './Button';
import BulkControl from './BulkControl';

const EmpireTab = ({ state, doPrestige, buyAmount, setBuyAmount, purchaseMastery }) => {
    const { t } = useLanguage();

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* HERO HEADER */}
            <div className="relative mb-12 p-8 rounded-3xl overflow-hidden bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.1)]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

                {/* BULK TOGGLE OVERLAY */}
                <BulkControl
                    buyAmount={buyAmount}
                    setBuyAmount={setBuyAmount}
                    className="absolute top-4 right-4 z-20"
                />

                <div className="relative z-10 text-center">
                    <div className="inline-block p-4 rounded-full bg-purple-500/10 mb-4 animate-pulse-slow">
                        <i className="fa-solid fa-crown text-5xl text-purple-400"></i>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter">
                        {t('empire.title').split(' ')[0]} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">{t('empire.title').split(' ').slice(1).join(' ')}</span>
                    </h1>
                    <p className="text-purple-200/60 text-lg max-w-xl mx-auto">
                        {t('empire.subtitle')}
                    </p>
                </div>
            </div>

            {/* MASTERY SHOP (NEW PLATINUM FEATURE) */}
            <div className="mb-12 bg-indigo-950/20 rounded-3xl p-8 border border-indigo-500/30 shadow-[0_0_30px_rgba(79,70,229,0.1)]">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                            <i className="fa-solid fa-gem text-indigo-400"></i> {t('empire.mastery.title')}
                        </h2>
                        <p className="text-zinc-500 text-xs uppercase font-bold">{t('empire.mastery.subtitle')}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-indigo-500/10 px-4 py-2 rounded-2xl border border-indigo-500/20 shadow-inner">
                        <i className="fa-solid fa-gem text-indigo-400 animate-bounce"></i>
                        <span className="text-2xl font-black text-indigo-400 font-mono">{state.diamonds || 0}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(CONFIG.masteryPerks).map(([id, perk]) => {
                        const isOwned = state.masteryPerks?.[id];
                        return (
                            <div key={id} className={`p-4 rounded-2xl border transition-all ${isOwned ? 'bg-indigo-500/10 border-indigo-500/40' : 'bg-black/40 border-white/5 hover:border-indigo-500/30'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <div className={`p-2 rounded-lg ${isOwned ? 'bg-indigo-500 text-black shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-white/5 text-indigo-400'}`}>
                                        <i className={`fa-solid ${perk.icon}`}></i>
                                    </div>
                                    {isOwned && <span className="text-[8px] font-black text-indigo-400 uppercase">{t('empire.mastery.active')}</span>}
                                </div>
                                <div className="text-xs font-black text-white uppercase mb-1">{perk.name}</div>
                                <p className="text-[10px] text-zinc-500 leading-tight mb-4 min-h-[30px]">{perk.desc}</p>
                                {!isOwned && (
                                    <Button
                                        onClick={() => purchaseMastery(id)}
                                        disabled={(state.diamonds || 0) < perk.cost}
                                        className="w-full py-1.5 text-[10px] font-black uppercase"
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
                <div className="bg-[#0a0a0c] p-6 rounded-2xl border border-white/5 flex flex-col items-center">
                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">{t('empire.prestige.level')}</span>
                    <span className="text-4xl font-black text-white">{state.prestige?.level || 0}</span>
                </div>
                <div className="bg-[#0a0a0c] p-6 rounded-2xl border border-purple-500/30 flex flex-col items-center relative overflow-hidden group hover:border-purple-500/60 transition-all shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                    {/* Animated Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>

                    <span className="text-purple-400 text-xs font-bold uppercase tracking-widest mb-1 relative z-10">{t('empire.prestige.income_bonus')}</span>
                    <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 relative z-10 animate-pulse-slow">x{state.prestige?.multiplier || 1}</span>
                    <span className="text-[10px] text-purple-300/50 mt-1 relative z-10">{t('empire.prestige.permanent_mult')}</span>
                </div>
                <div className="bg-[#0a0a0c] p-6 rounded-2xl border border-white/5 flex flex-col items-center">
                    <span className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-1">{t('empire.prestige.tokens')}</span>
                    <div className="flex items-center gap-2">
                        <i className="fa-solid fa-coins text-amber-500"></i>
                        <span className="text-4xl font-black text-white">{state.prestige?.currency || 0}</span>
                    </div>
                </div>
            </div>

            {/* LIFETIME STATS (NEW PHASE 4) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">{t('empire.lifetime.earnings')}</div>
                    <div className="text-xl font-mono text-emerald-400">{formatNumber(state.lifetime?.earnings || 0)} kr</div>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">{t('empire.lifetime.produced')}</div>
                    <div className="text-xl font-mono text-blue-400">
                        {formatNumber(Object.values(state.lifetime?.produced || {}).reduce((a, b) => a + b, 0))} <span className="text-sm text-zinc-600">{t('empire.lifetime.units')}</span>
                    </div>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">{t('empire.lifetime.resets')}</div>
                    <div className="text-xl font-mono text-purple-400">{state.prestige?.level || 0}</div>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">{t('empire.lifetime.value')}</div>
                    <div className="text-xl font-mono text-amber-400">{formatNumber((state.cleanCash + state.dirtyCash) * (state.prestige?.multiplier || 1))} kr</div>
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
                        <div className="bg-red-950/20 rounded-2xl p-6 border border-red-500/20">
                            <h3 className="text-xl font-black text-red-500 uppercase mb-4 flex items-center gap-2">
                                <i className="fa-solid fa-skull"></i> {t('empire.network.enforcer')}
                            </h3>
                            <div className="space-y-4">
                                {Object.entries(CONFIG.perks || {})
                                    .filter(([_, p]) => p.category === 'aggressive')
                                    .map(([id, perk]) => {
                                        const currentLvl = state.prestige?.perks?.[id] || 0;
                                        // Basic Cost for NEXT level:
                                        const cost = Math.floor(perk.baseCost * Math.pow(perk.costScale, currentLvl));
                                        const maxed = currentLvl >= perk.maxLevel;
                                        const canAfford = (state.prestige?.currency || 0) >= cost;

                                        return (
                                            <div key={id} className="bg-black/40 p-4 rounded-xl border border-red-500/10 active:border-red-500/30 transition-all">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-bold text-red-100">{perk.name}</h4>
                                                    <span className="text-[10px] font-mono text-red-400 bg-red-900/20 px-1.5 py-0.5 rounded">Lvl {currentLvl}/{perk.maxLevel}</span>
                                                </div>
                                                <p className="text-xs text-zinc-400 mb-3">{perk.desc}</p>

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
                                                    <div className="w-full py-2 bg-red-900/30 text-red-500 rounded-lg text-center font-bold text-xs uppercase border border-red-500/30">
                                                        <i className="fa-solid fa-check mr-1"></i> {t('empire.network.maxed')}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>

                        {/* GREEDY BRANCH */}
                        <div className="bg-emerald-950/20 rounded-2xl p-6 border border-emerald-500/20">
                            <h3 className="text-xl font-black text-emerald-500 uppercase mb-4 flex items-center gap-2">
                                <i className="fa-solid fa-money-bill-wave"></i> {t('empire.network.tycoon')}
                            </h3>
                            <div className="space-y-4">
                                {Object.entries(CONFIG.perks || {})
                                    .filter(([_, p]) => p.category === 'greedy')
                                    .map(([id, perk]) => {
                                        const currentLvl = state.prestige?.perks?.[id] || 0;
                                        const cost = Math.floor(perk.baseCost * Math.pow(perk.costScale, currentLvl));
                                        const maxed = currentLvl >= perk.maxLevel;
                                        const canAfford = (state.prestige?.currency || 0) >= cost;

                                        return (
                                            <div key={id} className="bg-black/40 p-4 rounded-xl border border-emerald-500/10 active:border-emerald-500/30 transition-all">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-bold text-emerald-100">{perk.name}</h4>
                                                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-900/20 px-1.5 py-0.5 rounded">Lvl {currentLvl}/{perk.maxLevel}</span>
                                                </div>
                                                <p className="text-xs text-zinc-400 mb-3">{perk.desc}</p>

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
                                                    <div className="w-full py-2 bg-emerald-900/30 text-emerald-500 rounded-lg text-center font-bold text-xs uppercase border border-emerald-500/30">
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
                    <div className="mt-8 bg-purple-950/20 rounded-2xl p-6 border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.1)]" >
                        <h3 className="text-xl font-black text-purple-500 uppercase mb-4 flex items-center gap-2">
                            <i className="fa-solid fa-user-secret"></i> {t('empire.network.forbidden')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(CONFIG.perks || {})
                                .filter(([_, p]) => p.category === 'forbidden')
                                .map(([id, perk]) => {
                                    const currentLvl = state.prestige?.perks?.[id] || 0;
                                    const cost = Math.floor(perk.baseCost * Math.pow(perk.costScale, currentLvl));
                                    const maxed = currentLvl >= perk.maxLevel;
                                    const canAfford = (state.prestige?.currency || 0) >= cost;

                                    return (
                                        <div key={id} className="bg-black/40 p-4 rounded-xl border border-purple-500/10 active:border-purple-500/30 transition-all">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-purple-100">{perk.name}</h4>
                                                <span className="text-[10px] font-mono text-purple-400 bg-purple-900/20 px-1.5 py-0.5 rounded">Lvl {currentLvl}/{perk.maxLevel}</span>
                                            </div>
                                            <p className="text-xs text-zinc-400 mb-3 min-h-[32px]">{perk.desc}</p>

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
                                                <div className="w-full py-2 bg-purple-900/30 text-purple-500 rounded-lg text-center font-bold text-xs uppercase border border-purple-500/30">
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
            <div className="p-8 rounded-2xl bg-gradient-to-r from-red-900/20 to-black border border-red-500/20 mt-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">{t('empire.reset.title')}</h3>
                        <p className="text-zinc-400 text-sm max-w-md">
                            {t('empire.reset.desc')}
                        </p>
                    </div>

                    {state.level >= 10 ? (
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
                        <div className="px-6 py-3 bg-zinc-800 text-zinc-500 font-bold rounded-xl border border-white/5 uppercase text-sm cursor-not-allowed">
                            {t('empire.reset.required')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmpireTab;
