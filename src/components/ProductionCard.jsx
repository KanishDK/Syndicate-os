import React, { useState, useEffect, useRef } from 'react';
import { CONFIG, getProductSlang } from '../config/gameConfig';
import { spawnParticles } from '../utils/particleEmitter';
import { formatNumber } from '../utils/gameMath';
import { useLanguage } from '../context/LanguageContext';
import GlassCard from './ui/GlassCard';
import ActionButton from './ui/ActionButton';

const ProductionCard = ({ item, state, produce, onSell, toggleAutoSell, addFloat, isGlobalStorageFull }) => {
    const { t } = useLanguage();
    const locked = state.level < item.unlockLevel;
    const count = state.inv[item.id] || 0;
    const producedCount = state.stats.produced[item.id] || 0;
    const processing = state.isProcessing[item.id];
    const [animate, setAnimate] = useState(false);
    const [activeTooltip, setActiveTooltip] = useState(null); // 'prod' | 'sell' | null
    const prevCountRef = useRef(producedCount);
    const [now, setNow] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    const colorMap = {
        emerald: {
            text: 'text-theme-success',
            bg: 'bg-theme-success/10',
            border: 'border-theme-success/30',
            glow: 'shadow-theme-success/20',
            btnVariant: 'success'
        },
        blue: {
            text: 'text-blue-400',
            bg: 'bg-blue-400/10',
            border: 'border-blue-400/30',
            glow: 'shadow-blue-400/20',
            btnVariant: 'primary'
        },
        indigo: {
            text: 'text-indigo-400',
            bg: 'bg-indigo-400/10',
            border: 'border-indigo-400/30',
            glow: 'shadow-indigo-400/20',
            btnVariant: 'primary'
        },
        purple: {
            text: 'text-purple-400',
            bg: 'bg-purple-400/10',
            border: 'border-purple-400/30',
            glow: 'shadow-purple-400/20',
            btnVariant: 'primary'
        },
        teal: {
            text: 'text-teal-400',
            bg: 'bg-teal-400/10',
            border: 'border-teal-400/30',
            glow: 'shadow-teal-400/20',
            btnVariant: 'success'
        },
        amber: {
            text: 'text-amber-400',
            bg: 'bg-amber-400/10',
            border: 'border-amber-400/30',
            glow: 'shadow-amber-400/20',
            btnVariant: 'gold' // Assuming gold maps to warning/amber broadly
        },
        red: {
            text: 'text-red-400',
            bg: 'bg-red-400/10',
            border: 'border-red-400/30',
            glow: 'shadow-red-400/20',
            btnVariant: 'danger'
        },
        yellow: {
            text: 'text-yellow-400',
            bg: 'bg-yellow-400/10',
            border: 'border-yellow-400/30',
            glow: 'shadow-yellow-400/20',
            btnVariant: 'gold'
        },
        white: {
            text: 'text-theme-text-primary',
            bg: 'bg-theme-surface-elevated',
            border: 'border-theme-border-default',
            glow: 'shadow-theme-border-emphasis',
            btnVariant: 'neutral'
        },
        pink: {
            text: 'text-pink-400',
            bg: 'bg-pink-400/10',
            border: 'border-pink-400/30',
            glow: 'shadow-pink-400/20',
            btnVariant: 'primary'
        },
        zinc: {
            text: 'text-zinc-400',
            bg: 'bg-zinc-400/10',
            border: 'border-zinc-400/30',
            glow: 'shadow-zinc-400/20',
            btnVariant: 'ghost'
        },
    };
    const colors = colorMap[item.color] || colorMap.emerald;

    // Rate Logic
    const rates = state.productionRates?.[item.id] || { produced: 0, sold: 0 };
    const prodRate = rates.produced * 10;
    const sellRate = rates.sold * 10;

    // Dynamic Staff Logic
    const getStaffInfo = () => {
        let producers = [];
        let sellers = [];
        let pCount = 0;
        let sCount = 0;

        Object.entries(CONFIG.staff).forEach(([role, data]) => {
            if (data.rates && data.rates[item.id]) {
                if (data.role === 'producer') {
                    producers.push(t(`staff.${role}.name`));
                    pCount += (state.staff[role] || 0);
                } else if (data.role === 'seller') {
                    sellers.push(t(`staff.${role}.name`));
                    sCount += (state.staff[role] || 0);
                }
            }
        });

        const prodStr = producers.length > 0 ? producers.join('/') : '?';
        const sellStr = sellers.length > 0 ? sellers.join('/') : '?';

        return { prod: prodStr, sell: sellStr, pCount, sCount };
    };
    const staff = getStaffInfo();

    // Upgrades Logic
    const hasHydro = !!(state.upgrades.hydro && ['hash', 'skunk'].includes(item.id));
    const hasLab = !!(state.upgrades.lab && item.id === 'amfetamin');

    // Audit Fix: Use translated name instead of Danish slang aliases
    const itemName = t(`items.${item.id}.name`) || item.name;

    const cardRef = useRef(null);

    useEffect(() => {
        if (producedCount > prevCountRef.current) {
            const diff = producedCount - prevCountRef.current;
            setTimeout(() => setAnimate(true), 0);
            const timer = setTimeout(() => setAnimate(false), 200);
            prevCountRef.current = producedCount;

            // Trigger Particle
            if (addFloat && cardRef.current) {
                const rect = cardRef.current.getBoundingClientRect();
                const x = rect.left + rect.width / 2 + (Math.random() * 40 - 20);
                const y = rect.top + rect.height / 2 + (Math.random() * 20 - 10);
                addFloat(x, y, `+${diff} ${itemName}`, 'text-theme-text-muted font-bold text-xs');
            }
            return () => clearTimeout(timer);
        }
    }, [producedCount, itemName, addFloat]);

    const isAutomated = state.autoSell?.[item.id] !== false;
    const isStorageFull = isGlobalStorageFull;

    if (locked) return (
        <GlassCard className="opacity-50 grayscale select-none min-h-[180px] flex items-center justify-center">
            <div className="text-center p-6">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-zinc-500 border border-white/5">
                    <i className={`fa-solid ${item.icon}`}></i>
                </div>
                <h3 className="font-bold text-zinc-500 mb-2">{itemName}</h3>
                <div className="text-xs bg-black/40 text-zinc-600 px-3 py-1 rounded-full inline-block border border-white/5">
                    LVL {item.unlockLevel} REQUIRED
                </div>
            </div>
        </GlassCard>
    );

    return (
        <GlassCard
            ref={cardRef}
            className={`
                relative flex flex-col justify-between overflow-hidden group select-none min-h-[320px]
                ${animate ? 'ring-1 ring-white/20' : ''}
                hover:border-white/20 transition-colors
            `}
        >
            {/* PULSE EFFECT */}
            {animate && <div className={`absolute inset-0 ${colors.bg} z-0 animate-pulse duration-75`}></div>}

            {/* STORAGE FULL OVERLAY */}
            {isStorageFull && (
                <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-300">
                    <i className="fa-solid fa-triangle-exclamation text-red-500 text-4xl mb-4 animate-bounce"></i>
                    <div className="text-white font-black uppercase text-lg tracking-widest mb-1">{t('production.card_storage_full')}!</div>
                    <div className="text-red-400 text-xs font-mono mb-6">{t('production.sell_now')}</div>
                    <ActionButton
                        onClick={(e) => {
                            onSell(item.id, count, e);
                            spawnParticles(e.clientX, e.clientY, item.color === 'emerald' || item.color === 'amber' ? 'cash' : 'dirty', 12);
                        }}
                        disabled={count < 1}
                        variant="danger"
                        className="w-full"
                        icon="fa-solid fa-sack-dollar"
                    >
                        {t('production.sell_all')}
                    </ActionButton>
                </div>
            )}

            {/* HEADER */}
            <div className="p-4 relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-3 items-center">
                        <div
                            onClick={(e) => { if (!processing) produce(item.id, e); }}
                            className={`
                                w-12 h-12 rounded-lg flex items-center justify-center text-xl shadow-lg cursor-pointer active:scale-95 transition-transform shrink-0
                                bg-theme-surface-elevated/50 border border-theme-border-subtle ${colors.text} ${colors.glow}
                                ${animate ? 'scale-110' : ''}
                                hover:bg-theme-surface-elevated
                            `}
                        >
                            <i className={`fa-solid ${item.icon}`}></i>
                        </div>
                        <div>
                            <h3 className="font-bold text-theme-text-primary text-sm tracking-wide flex items-center gap-2">
                                {itemName}
                                {hasHydro && <i className="fa-solid fa-water text-[10px] text-cyan-400" title="Hydroponics Boost"></i>}
                                {hasLab && <i className="fa-solid fa-flask text-[10px] text-purple-400" title="Lab Boost"></i>}
                            </h3>
                            <div className="flex gap-3 text-[10px] mt-1 text-zinc-400">
                                <span className="flex items-center gap-1 bg-black/30 px-1.5 py-0.5 rounded border border-white/5">
                                    <i className="fa-solid fa-clock opacity-70"></i> {(item.duration / 1000).toFixed(1)}s
                                </span>
                                <span className="flex items-center gap-1 bg-black/30 px-1.5 py-0.5 rounded border border-white/5 text-red-400">
                                    <i className="fa-solid fa-fire opacity-70"></i> +{item.heatGain}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* STOCK COUNT */}
                    <div className="text-right">
                        <div className={`text-2xl font-black font-mono leading-none transition-all duration-100 ${animate ? `scale-110 ${colors.text}` : 'text-theme-text-primary'}`}>
                            {count}
                        </div>
                        <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{t('production.stock')}</div>
                    </div>
                </div>

                {/* DESCRIPTION */}
                <div className="text-xs text-zinc-400 mb-4 h-8 line-clamp-2 leading-relaxed opacity-70">
                    {t(`items.${item.id}.desc`)}
                </div>

                {/* RATES GRID */}
                <div className="grid grid-cols-2 gap-2 mb-4 relative">
                    {/* PRODUCTION RATE */}
                    <div
                        className={`bg-black/30 rounded border border-white/5 p-2 cursor-pointer hover:bg-white/5 transition-colors relative ${activeTooltip === 'prod' ? 'ring-1 ring-green-500/50' : ''}`}
                        onClick={(e) => { e.stopPropagation(); setActiveTooltip(activeTooltip === 'prod' ? null : 'prod'); }}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[9px] text-zinc-500 uppercase font-bold">{t('production.prod')}</span>
                            {staff.pCount > 0 && <span className="text-[9px] text-green-400 font-bold bg-green-500/10 px-1 rounded">{staff.pCount}x</span>}
                        </div>
                        <div className="font-mono text-xs font-bold">
                            {prodRate > 0 ? <span className="text-green-400">+{formatNumber(prodRate)}/s</span> : <span className="text-zinc-600">0/s</span>}
                        </div>

                        {/* TOOLTIP */}
                        {activeTooltip === 'prod' && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-zinc-900 border border-green-500/30 rounded-lg p-3 shadow-2xl z-[100]">
                                <h4 className="text-xs font-bold text-white mb-2 pb-1 border-b border-white/10">{t('production.prod_details')}</h4>
                                <div className="space-y-1 text-[10px] font-mono text-zinc-300">
                                    <div className="flex justify-between"><span>{t('production.base')}</span> <span>1.0</span></div>
                                    <div className="flex justify-between"><span>{t('production.staff')}</span> <span>{staff.pCount}</span></div>
                                    {hasHydro && <div className="flex justify-between text-green-400"><span>Hydro</span> <span>x1.5</span></div>}
                                    {hasLab && <div className="flex justify-between text-purple-400"><span>Lab</span> <span>x1.5</span></div>}
                                    <div className="border-t border-white/10 pt-1 mt-1 flex justify-between font-bold text-white">
                                        <span>{t('production.total')}</span> <span className="text-green-400">{prodRate.toFixed(1)}/s</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SALES RATE */}
                    <div
                        className={`bg-black/30 rounded border border-white/5 p-2 cursor-pointer hover:bg-white/5 transition-colors relative ${activeTooltip === 'sell' ? 'ring-1 ring-amber-500/50' : ''}`}
                        onClick={(e) => { e.stopPropagation(); setActiveTooltip(activeTooltip === 'sell' ? null : 'sell'); }}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[9px] text-zinc-500 uppercase font-bold">{t('production.sell')}</span>
                            {staff.sCount > 0 && <span className="text-[9px] text-amber-400 font-bold bg-amber-500/10 px-1 rounded">{staff.sCount}x</span>}
                        </div>
                        <div className="font-mono text-xs font-bold">
                            {sellRate > 0 ? <span className="text-amber-400">-{formatNumber(sellRate)}/s</span> : <span className="text-zinc-600">0/s</span>}
                        </div>

                        {/* TOOLTIP */}
                        {activeTooltip === 'sell' && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-zinc-900 border border-amber-500/30 rounded-lg p-3 shadow-2xl z-[100]">
                                <h4 className="text-xs font-bold text-white mb-2 pb-1 border-b border-white/10">{t('production.sell_details')}</h4>
                                <div className="space-y-1 text-[10px] font-mono text-zinc-300">
                                    <div className="flex justify-between"><span>{t('production.base')}</span> <span>1.0</span></div>
                                    <div className="flex justify-between"><span>{t('production.staff')}</span> <span>{staff.sCount}</span></div>
                                    {state.activeBuffs?.hype > now && <div className="flex justify-between text-amber-400"><span>HYPE</span> <span>x2.0</span></div>}
                                    <div className="border-t border-white/10 pt-1 mt-1 flex justify-between font-bold text-white">
                                        <span>{t('production.total')}</span> <span className="text-amber-400">{sellRate.toFixed(1)}/s</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="space-y-2">
                    <ActionButton
                        onClick={(e) => {
                            if (!processing && !isStorageFull) {
                                produce(item.id, e);
                                if (!isStorageFull) {
                                    addFloat && addFloat(e.clientX, e.clientY, `+${item.batchSize || 1} ${itemName}`, 'success');
                                    spawnParticles(e.clientX, e.clientY, item.color === 'emerald' || item.color === 'amber' ? 'cash' : 'dirty', 8);
                                }
                            }
                        }}
                        disabled={processing || isStorageFull}
                        isLoading={processing}
                        variant={activeTooltip ? 'disabled' : 'primary'} // Standardized to primary for consistency
                        className="w-full"
                        icon={processing ? "fa-solid fa-circle-notch fa-spin" : "fa-solid fa-hammer"}
                    >
                        {processing ? t('production.producing') : t('production.produce_now')}
                    </ActionButton>
                </div>
            </div>

            {/* FOOTER CONTROLS */}
            <div className="mt-auto bg-black/20 border-t border-white/5 p-3 flex items-center justify-between gap-2 relative z-10">
                {/* AUTO TOGGLE */}
                <button
                    onClick={(e) => { e.stopPropagation(); toggleAutoSell(item.id); }}
                    className={`
                        flex-1 flex items-center gap-2 px-3 py-2 rounded text-[10px] font-bold uppercase tracking-wider transition-all
                        ${isAutomated
                            ? 'bg-white/10 text-white border border-white/20'
                            : 'bg-transparent text-zinc-500 border border-transparent hover:bg-white/5 hover:text-zinc-300'}
                    `}
                >
                    <div className={`w-2 h-2 rounded-full ${isAutomated ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]' : 'bg-red-500/50'}`}></div>
                    {isAutomated ? t('production.auto_on') : t('production.auto_off')}
                </button>

                {/* SELL ALL */}
                <button
                    onClick={(e) => {
                        onSell(item.id, count, e);
                        spawnParticles(e.clientX, e.clientY, item.color === 'emerald' || item.color === 'amber' ? 'cash' : 'dirty', 12);
                    }}
                    disabled={count < 1}
                    className="
                        px-3 py-2 rounded text-[10px] font-bold uppercase tracking-wider transition-all border border-white/5
                        bg-black/20 text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20 disabled:opacity-30 disabled:pointer-events-none
                    "
                >
                    {t('production.sell_all')}
                </button>
            </div>

        </GlassCard>
    );
};

export default React.memo(ProductionCard, (prev, next) => {
    if (prev.item.id !== next.item.id) return false;
    if (prev.state.inv[prev.item.id] !== next.state.inv[next.item.id]) return false;
    if (prev.state.isProcessing[prev.item.id] !== next.state.isProcessing[next.item.id]) return false;
    if (prev.state.level < prev.item.unlockLevel !== next.state.level < next.item.unlockLevel) return false;
    if (prev.state.autoSell?.[prev.item.id] !== next.state.autoSell?.[next.item.id]) return false;
    if (prev.isGlobalStorageFull !== next.isGlobalStorageFull) return false;

    const prevRates = prev.state.productionRates?.[prev.item.id] || { produced: 0, sold: 0 };
    const nextRates = next.state.productionRates?.[next.item.id] || { produced: 0, sold: 0 };
    if (prevRates.produced !== nextRates.produced || prevRates.sold !== nextRates.sold) return false;

    return true;
});
