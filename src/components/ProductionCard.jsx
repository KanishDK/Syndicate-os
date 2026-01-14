import React, { useState, useEffect, useRef } from 'react';
import { CONFIG } from '../config/gameConfig';
import { spawnParticles } from '../utils/particleEmitter';
import Button from './Button';
import { useLanguage } from '../context/LanguageContext';

const ProductionCard = ({ item, state, produce, onSell, toggleAutoSell, addFloat }) => {
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

    // Safety: Tailwind dynamic classes fix (100-Expert Audit)
    // Safety: Tailwind dynamic classes fix (100-Expert Audit)
    const colorMap = {
        emerald: {
            border: 'active:border-theme-success/30',
            text: 'text-theme-success',
            bg: 'bg-theme-success/10',
            ring: 'ring-theme-success/20',
            lightText: 'text-theme-text-primary',
            lightBg: 'bg-theme-success/30',
            glow: 'shadow-theme-success/40'
        },
        blue: {
            border: 'active:border-theme-accent/30',
            text: 'text-theme-accent',
            bg: 'bg-theme-accent/10',
            ring: 'ring-theme-accent/20',
            lightText: 'text-theme-text-primary',
            lightBg: 'bg-theme-accent/30',
            glow: 'shadow-theme-accent/40'
        },
        indigo: {
            border: 'active:border-theme-secondary/30',
            text: 'text-theme-secondary',
            bg: 'bg-theme-secondary/10',
            ring: 'ring-theme-secondary/20',
            lightText: 'text-theme-text-primary',
            lightBg: 'bg-theme-secondary/30',
            glow: 'shadow-theme-secondary/40'
        },
        purple: {
            border: 'active:border-theme-secondary/30',
            text: 'text-theme-secondary',
            bg: 'bg-theme-secondary/10',
            ring: 'ring-theme-secondary/20',
            lightText: 'text-theme-secondary',
            lightBg: 'bg-theme-secondary/30',
            glow: 'shadow-theme-secondary/40'
        },
        teal: {
            border: 'active:border-theme-accent/30',
            text: 'text-theme-accent',
            bg: 'bg-theme-accent/10',
            ring: 'ring-theme-accent/20',
            lightText: 'text-theme-accent',
            lightBg: 'bg-theme-accent/30',
            glow: 'shadow-theme-accent/40'
        },
        amber: {
            border: 'active:border-theme-warning/30',
            text: 'text-theme-warning',
            bg: 'bg-theme-warning/10',
            ring: 'ring-theme-warning/20',
            lightText: 'text-theme-text-primary',
            lightBg: 'bg-theme-warning/30',
            glow: 'shadow-theme-warning/40'
        },
        red: {
            border: 'active:border-theme-danger/30',
            text: 'text-theme-danger',
            bg: 'bg-theme-danger/10',
            ring: 'ring-theme-danger/20',
            lightText: 'text-theme-text-primary',
            lightBg: 'bg-theme-danger/30',
            glow: 'shadow-theme-danger/40'
        },
    };
    const colors = colorMap[item.color] || colorMap.emerald;

    // Rate Logic (existing)
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
    const hasHydro = !!(state.upgrades.hydro && ['hash_lys', 'hash_moerk'].includes(item.id));
    const hasLab = !!(state.upgrades.lab && item.id === 'speed');

    const itemName = t(`items.${item.id}.name`);

    useEffect(() => {
        if (producedCount > prevCountRef.current) {
            const diff = producedCount - prevCountRef.current;
            setTimeout(() => setAnimate(true), 0);
            const timer = setTimeout(() => setAnimate(false), 200);
            prevCountRef.current = producedCount;

            // Trigger Particle
            if (addFloat && cardRef.current) {
                // Get card position to spawn float near the icon/number
                const rect = cardRef.current.getBoundingClientRect();
                // Random drift
                const x = rect.left + rect.width / 2 + (Math.random() * 40 - 20);
                const y = rect.top + rect.height / 2 + (Math.random() * 20 - 10);

                // Only show +1 every few ticks if fast? 
                // Alternatively, just show "+Amount"
                addFloat(x, y, `+${diff} ${itemName}`, 'text-theme-text-muted font-bold text-xs');
            }
            return () => clearTimeout(timer);
        }
    }, [producedCount, itemName, addFloat]);

    const isAutomated = state.autoSell?.[item.id] !== false;

    const cardRef = useRef(null);

    if (locked) return (
        <div className="bg-theme-bg-primary/40 border border-theme-border-subtle p-4 rounded-xl flex items-center gap-4 opacity-50 grayscale select-none">
            <div className="w-12 h-12 bg-theme-surface-elevated rounded-lg flex items-center justify-center text-theme-text-muted text-xl font-bold"><i className={`fa-solid ${item.icon}`}></i></div>
            <div>
                <h3 className="font-bold text-theme-text-muted">{itemName}</h3>
                <div className="text-[10px] bg-theme-surface-elevated text-theme-text-muted px-2 py-0.5 rounded inline-block mt-1">LVL {item.unlockLevel}</div>
            </div>
        </div>
    );

    return (
        <div
            ref={cardRef}
            className={`
                relative flex flex-col justify-between overflow-hidden rounded-xl border card-interactive group select-none
                ${locked ? '' : `bg-theme-surface-base border-theme-border-subtle ${colors.border}`}
            `}
        >
            {/* PULSE EFFECT */}
            {animate && <div className={`absolute inset-0 ${colors.bg} z-0 animate-pulse duration-75`}></div>}

            {/* STORAGE FULL OVERLAY */}
            {Object.values(state.inv).reduce((a, b) => a + b, 0) >= (50 * (state.upgrades.warehouse || 1)) && (
                <div className="absolute top-0 left-0 right-0 h-[60%] z-30 bg-theme-bg-primary/80 flex flex-col items-center justify-center text-center p-4 backdrop-blur-[2px] border-b border-theme-danger/30 animate-in fade-in slide-in-from-top-4 duration-300">
                    <i className="fa-solid fa-triangle-exclamation text-theme-danger text-3xl mb-2 animate-bounce drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]"></i>
                    <div className="text-theme-text-primary font-black uppercase text-sm tracking-widest">{t('production.card_storage_full')}!</div>
                    <div className="text-theme-danger text-[9px] font-mono mt-1">{t('production.sell_now')}</div>
                </div>
            )}

            {/* HEADER */}
            <div className="p-4 relative z-10 pb-3">
                <div className="flex justify-between items-start mb-4 gap-6">
                    <div className="flex gap-4 items-center flex-1 min-w-0">
                        <div
                            onClick={(e) => { if (!processing) produce(item.id, e); }}
                            className={`
                            w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-lg cursor-pointer active:scale-95 transition-transform shrink-0
                            bg-theme-surface-elevated ${colors.text} border border-theme-border-subtle ${colors.glow}
                            ${animate ? 'scale-105 ring-2 ring-white/20' : ''}
                        `}>
                            <i className={`fa-solid ${item.icon}`}></i>
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-theme-text-primary text-sm tracking-wide flex items-center gap-2">
                                {itemName}
                                {hasHydro && <i className="fa-solid fa-water text-[10px] text-theme-accent" title="Hydroponics Boost"></i>}
                                {hasLab && <i className="fa-solid fa-flask text-[10px] text-theme-secondary" title="Lab Boost"></i>}
                            </h3>
                            {/* NEW DESCRIPTION */}
                            <div className="text-[10px] text-theme-text-muted mt-1 leading-tight font-terminal truncate max-w-[160px]">
                                {t(`items.${item.id}.desc`)}
                            </div>
                            {/* DURATION */}
                            <div className="text-[10px] text-theme-text-muted flex items-center gap-1 mt-1.5">
                                <i className="fa-solid fa-clock opacity-50"></i> {(item.duration / 1000).toFixed(1)}s
                            </div>
                        </div>
                    </div>

                    {/* BIG NUMBER */}
                    <div className="text-right shrink-0 ml-4">
                        <div className={`text-2xl font-black mono leading-none tracking-tighter transition-all duration-100 number-ticker ${animate ? `scale-125 ${colors.text}` : 'text-theme-text-primary'}`}>
                            {count}
                        </div>
                        <div className="text-[9px] font-bold text-theme-text-muted uppercase tracking-widest mt-1">{t('production.stock')}</div>
                    </div>
                </div>
            </div>

            {/* FLOW RATES & STAFF */}
            < div className="grid grid-cols-2 gap-3 mb-3 px-4 relative" >
                {/* PRODUCTION SIDE */}
                < div
                    onClick={(e) => { e.stopPropagation(); setActiveTooltip(activeTooltip === 'prod' ? null : 'prod'); }}
                    className={`bg-theme-bg-primary/40 rounded-lg p-3 border relative overflow-visible cursor-pointer active:scale-95 transition-all
                            ${activeTooltip === 'prod' ? 'border-theme-success/50 bg-theme-success/10' : 'border-theme-border-subtle active:border-theme-border-default'}
                        `}
                >
                    <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] text-theme-text-muted uppercase font-bold tracking-wide">{t('production.prod')}</span>
                        {staff.pCount > 0 && <span className="text-[10px] text-theme-success font-bold bg-theme-success/20 px-1.5 py-0.5 rounded">{staff.pCount}x</span>}
                    </div>
                    <div className="font-mono text-theme-text-secondary font-bold text-sm number-ticker">
                        {prodRate > 0 ? <span className="text-theme-success">+{prodRate.toFixed(1)}/s</span> : <span className="text-theme-text-muted">0/s</span>}
                    </div>
                    <div className="text-[9px] text-theme-text-secondary mt-1 truncate">{staff.prod}</div>

                    {/* TOOLTIP */}
                    {
                        activeTooltip === 'prod' && (
                            <div className="absolute bottom-full left-0 mb-2 w-48 bg-theme-surface-elevated border border-theme-success/30 rounded-lg p-3 shadow-xl z-50 animate-in fade-in slide-in-from-bottom-2">
                                <h4 className="text-xs font-bold text-theme-text-primary mb-2 pb-1 border-b border-theme-border-subtle font-terminal">{t('production.prod_details')}</h4>
                                <div className="space-y-1 text-[10px] font-mono font-terminal">
                                    <div className="flex justify-between">
                                        <span className="text-theme-text-muted">{t('production.staff')} ({staff.pCount})</span>
                                        <span className="text-theme-text-secondary">{t('production.base')}</span>
                                    </div>
                                    {hasHydro && (
                                        <div className="flex justify-between text-theme-success">
                                            <span>Hydroponics</span>
                                            <span>x1.5</span>
                                        </div>
                                    )}
                                    {hasLab && (
                                        <div className="flex justify-between text-theme-secondary">
                                            <span>Lab Udstyr</span>
                                            <span>x1.5</span>
                                        </div>
                                    )}
                                    <div className="border-t border-theme-border-subtle pt-1 mt-1 flex justify-between font-bold">
                                        <span className="text-theme-text-primary">{t('production.total')}</span>
                                        <span className="text-theme-success">{prodRate.toFixed(1)} /s</span>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div >

                {/* SALES SIDE */}
                < div
                    onClick={(e) => { e.stopPropagation(); setActiveTooltip(activeTooltip === 'sell' ? null : 'sell'); }}
                    className={`bg-theme-bg-primary/40 rounded-lg p-3 border relative overflow-visible cursor-pointer active:scale-95 transition-all
                            ${activeTooltip === 'sell' ? 'border-theme-warning/50 bg-theme-warning/10' : 'border-theme-border-subtle active:border-theme-border-default'}
                        `}
                >
                    <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] text-theme-text-muted uppercase font-bold tracking-wide">{t('production.sell')}</span>
                        {staff.sCount > 0 && <span className="text-[10px] text-theme-warning font-bold bg-theme-warning/20 px-1.5 py-0.5 rounded">{staff.sCount}x</span>}
                    </div>
                    <div className="font-mono text-theme-text-secondary font-bold text-sm number-ticker">
                        {sellRate > 0 ? <span className="text-theme-warning">-{sellRate.toFixed(1)}/s</span> : <span className="text-theme-text-muted">0/s</span>}
                    </div>
                    <div className="text-[9px] text-theme-text-secondary mt-1 truncate">{staff.sell}</div>

                    {/* TOOLTIP */}
                    {
                        activeTooltip === 'sell' && (
                            <div className="absolute bottom-full right-0 mb-2 w-48 bg-theme-surface-elevated border border-theme-warning/30 rounded-lg p-3 shadow-xl z-50 animate-in fade-in slide-in-from-bottom-2">
                                <h4 className="text-xs font-bold text-theme-text-primary mb-2 pb-1 border-b border-theme-border-subtle font-terminal">{t('production.sell_details')}</h4>
                                <div className="space-y-1 text-[10px] font-mono font-terminal">
                                    <div className="flex justify-between">
                                        <span className="text-theme-text-muted">Sælgere ({staff.sCount})</span>
                                        <span className="text-theme-text-secondary">{t('production.base')}</span>
                                    </div>
                                    {state.activeBuffs?.hype > now && (
                                        <div className="flex justify-between text-theme-warning">
                                            <span>HYPE!</span>
                                            <span>x2.0</span>
                                        </div>
                                    )}
                                    <div className="border-t border-theme-border-subtle pt-1 mt-1 flex justify-between font-bold">
                                        <span className="text-theme-text-primary">{t('production.total')}</span>
                                        <span className="text-theme-warning">{sellRate.toFixed(1)} /s</span>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div >
            </div >

            {/* MANUAL PRODUCE BUTTON */}
            < div className="px-4 mb-4 relative z-10" >
                <Button
                    onClick={(e) => {
                        // NEW: Cap Check in UI
                        if (Object.values(state.inv).reduce((a, b) => a + b, 0) >= (50 * (state.upgrades.warehouse || 1))) {
                            // Let the hook handle the error toast, but we prevent the click here too if we want, 
                            // OR we let it pass to produce() so the user sees the specific error toast we added.
                            // Decision: Let it pass to produce() so the logic is central, BUT visual feedback needs to be clear.
                            // Actually, if we disable the button, they can't click.
                            // Let's NOT disable it fully, but give it a 'disabled-like' style or just let the hook handle it?
                            // Standard UX: Disable button if action is impossible.
                        }

                        if (!processing) {
                            produce(item.id, e);
                            // Only spawn particles if successful? 
                            // This UI logic doesn't know if produce() returned early.
                            // We should probably rely on the hook's return or state change.
                            // For now, let's keep the particle effect but maybe move it?
                            // Actually, if we add checks here, we duplicate logic.
                            // Let's rely on the disabled prop.
                            if (Object.values(state.inv).reduce((a, b) => a + b, 0) < (50 * (state.upgrades.warehouse || 1))) {
                                addFloat && addFloat(e.clientX, e.clientY, `+${item.batchSize || 1} ${itemName}`, 'success');
                                spawnParticles(e.clientX, e.clientY, item.color === 'emerald' || item.color === 'amber' ? 'cash' : 'dirty', 8);
                            }
                        }
                    }}
                    disabled={processing || Object.values(state.inv).reduce((a, b) => a + b, 0) >= (50 * (state.upgrades.warehouse || 1))}
                    variant="ghost"
                    className={`w-full !py-3 rounded-lg font-black uppercase text-sm tracking-wider transition-all flex items-center justify-center gap-2 h-auto
                        ${processing
                            ? '!bg-theme-surface-elevated !text-theme-text-muted cursor-wait !border-theme-border-subtle'
                            : `!bg-theme-surface-base border ${colors.border} ${colors.text} active:!bg-theme-surface-elevated active:!text-theme-text-primary ${colors.glow} active:scale-95`}
                    `}
                >
                    {processing ? (
                        <><i className="fa-solid fa-circle-notch fa-spin"></i> {t('production.producing')}</>
                    ) : (Object.values(state.inv).reduce((a, b) => a + b, 0) >= (50 * (state.upgrades.warehouse || 1))) ? (
                        <><i className="fa-solid fa-ban"></i> {t('production.card_storage_full')}</>
                    ) : (
                        <><i className="fa-solid fa-hammer"></i> {t('production.produce_now')}</>
                    )}
                </Button>
            </div >

            {/* CONTROLS */}
            < div className="mt-auto bg-theme-bg-primary/20 p-4 pt-0 border-t border-theme-border-subtle relative z-10" >
                {processing && <div className="absolute top-0 left-0 h-[1px] bg-green-500 z-50 animate-pulse w-full"></div>}

                <div className="flex justify-between items-center h-12 mb-2">
                    {/* AUTO TOGGLE */}
                    <div
                        className={`flex items-center gap-3 cursor-pointer group/toggle p-2.5 rounded-lg border transition-all duration-300 relative overflow-hidden h-12 flex-1 mr-3
                            ${isAutomated
                                ? `bg-theme-surface-elevated ${colors.border} ${colors.glow}`
                                : 'bg-theme-surface-base border-theme-border-subtle hover:border-theme-border-default'}
                        `}
                        onClick={(e) => { e.stopPropagation(); toggleAutoSell(item.id); }}
                    >
                        {/* Status Light */}
                        <div className={`w-3 h-3 rounded-full shadow-[0_0_5px_currentColor] transition-colors duration-300 ${isAutomated ? `${colors.text} ${colors.bg}` : 'text-theme-text-disabled bg-theme-surface-elevated'}`}></div>

                        <div className="flex flex-col">
                            <span className={`text-xs font-black uppercase tracking-wider leading-none mb-0.5 transition-colors ${isAutomated ? 'text-theme-text-primary' : 'text-theme-text-muted'}`}>
                                {isAutomated ? t('production.auto_on') : t('production.auto_off')}
                            </span>
                        </div>
                    </div>

                    {/* MANUAL SELL */}
                    <Button
                        onClick={(e) => {
                            onSell(item.id, count, e);
                            spawnParticles(e.clientX, e.clientY, item.color === 'emerald' || item.color === 'amber' ? 'cash' : 'dirty', 12);
                        }}
                        disabled={count < 1}
                        className="px-4 !h-12 text-sm font-bold uppercase tracking-wider flex-1"
                        variant="neutral"
                    >
                        {t('production.sell_all')}
                    </Button>
                </div>
            </div >
        </div >
    );
};

export default React.memo(ProductionCard, (prev, next) => {
    // Custom comparison for high performance
    // Only re-render if:
    // 1. Item count changed
    // 2. Processing state changed
    // 3. Locked state changed
    // 4. Rate changed significantly? No, rates are derived from state.
    // Let's stick to shallow compare of props or specific ids.

    // Actually, state.inv is a big object. Passing 'state' as prop kills memoization.
    // We should only pass relevant slices of state in parent, OR
    // Just compare specific props provided they are primitives.

    // BUT ProductionCard receives `state` object.
    // So React.memo is useless unless we change how props are passed or do deep custom compare.
    // Custom compare:
    if (prev.item.id !== next.item.id) return false;
    if (prev.state.inv[prev.item.id] !== next.state.inv[next.item.id]) return false;
    if (prev.state.isProcessing[prev.item.id] !== next.state.isProcessing[next.item.id]) return false;
    if (prev.state.level < prev.item.unlockLevel !== next.state.level < next.item.unlockLevel) return false;
    if (prev.state.autoSell?.[prev.item.id] !== next.state.autoSell?.[next.item.id]) return false;

    // Simple deep check for relevant stats to avoid re-render on unrelated state changes (like logs or other items)
    // Rates check:
    const prevRates = prev.state.productionRates?.[prev.item.id] || { produced: 0, sold: 0 };
    const nextRates = next.state.productionRates?.[next.item.id] || { produced: 0, sold: 0 };
    if (prevRates.produced !== nextRates.produced || prevRates.sold !== nextRates.sold) return false;

    return true; // Props are "equal" for rendering purposes
});
