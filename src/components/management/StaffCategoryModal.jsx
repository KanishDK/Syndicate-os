import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CONFIG } from '../../config/gameConfig';
import { formatNumber, getBulkCost, getMaxAffordable } from '../../utils/gameMath';
import ActionButton from '../ui/ActionButton';
import GlassCard from '../ui/GlassCard';
import { useLanguage } from '../../context/LanguageContext';

// Static Assets Imports
import zombienImg from '../../assets/characters/Zombien.png';
import gartnerenImg from '../../assets/characters/Gartneren.png';
import kemikerenImg from '../../assets/characters/Kemikeren.png';
import distributorenImg from '../../assets/characters/Distributoren.png';
import pusherenImg from '../../assets/characters/Pusheren.png';
import bagmandenImg from '../../assets/characters/Bagmanden.png';
import revisorenImg from '../../assets/characters/Revisoren.png';
import advokatenImg from '../../assets/characters/Advokaten.png';

const IMAGE_MAP = {
    'Zombien.png': zombienImg,
    'Gartneren.png': gartnerenImg,
    'Kemikeren.png': kemikerenImg,
    'Distributoren.png': distributorenImg,
    'Pusheren.png': pusherenImg,
    'Bagmanden.png': bagmandenImg,
    'Revisoren.png': revisorenImg,
    'Advokaten.png': advokatenImg
};

const StaffCategoryModal = ({ categoryId, state, onBuy, onSell, onClose }) => {
    const { t } = useLanguage();
    const categoryConfig = CONFIG.staffCategories[categoryId];

    // Filter staff belonging to this category and sort by tier
    const staffList = Object.entries(CONFIG.staff)
        .filter(([key, item]) => item.category === categoryId)
        .sort((a, b) => (a[1].tier || 1) - (b[1].tier || 1));

    const [selectedRole, setSelectedRole] = useState(staffList[0]?.[0] || null);

    const activeStaff = selectedRole ? CONFIG.staff[selectedRole] : null;
    const count = state.staff[selectedRole] || 0;

    const canAfford = (cost) => state.cleanCash >= cost;
    const baseCost = activeStaff ? activeStaff.baseCost : 0;
    const nextCost = activeStaff ? getBulkCost(baseCost, activeStaff.costFactor || 1.15, count, 1) : 0;
    const isLocked = activeStaff && state.level < activeStaff.reqLevel;

    const getImagePath = (img) => IMAGE_MAP[img] || null;

    // Lock Body Scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    const content = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-2 md:p-4 animate-in fade-in duration-200">
            <GlassCard className="w-full max-w-6xl h-full md:h-[90vh] flex flex-col overflow-hidden relative border-2 border-indigo-500/30 shadow-2xl shadow-indigo-500/20 rounded-2xl" variant="interactive">

                {/* HEADER - Fixed */}
                <div className="flex-none flex justify-between items-center p-6 border-b border-indigo-500/20 bg-gradient-to-r from-indigo-950/50 to-black/50 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-3xl border-2 border-indigo-500/40 shadow-lg shadow-indigo-500/20">
                            <i className={`fa-solid ${categoryConfig?.icon}`}></i>
                        </div>
                        <div>
                            <h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-wider">{t(categoryConfig?.name)}</h2>
                            <p className="text-zinc-400 text-[10px] md:text-sm mt-1">{t(categoryConfig?.desc)}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-all flex items-center justify-center border border-white/10 hover:border-red-500/50">
                        <i className="fa-solid fa-xmark text-xl md:text-2xl"></i>
                    </button>
                </div>

                {/* CONTENT - Fixed height, no scroll */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    {/* LEFT: ROSTER LIST - Fixed width, scrollable */}
                    <div className="w-full md:w-80 bg-black/20 border-b md:border-b-0 md:border-r border-indigo-500/10 p-4 overflow-y-auto custom-scrollbar">
                        <div className="flex md:block items-center justify-between mb-3 px-2">
                            <div className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-widest">{t('staff.roster_title')}</div>
                            <div className="md:hidden text-[10px] text-zinc-600 uppercase font-mono">{activeStaff ? t(activeStaff.name) : ''}</div>
                        </div>
                        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 scrollbar-hide">
                            {staffList.map(([key, item]) => {
                                const myCount = state.staff[key] || 0;
                                const locked = state.level < item.reqLevel;
                                const isSelected = selectedRole === key;

                                return (
                                    <div
                                        key={key}
                                        onClick={() => setSelectedRole(key)}
                                        className={`flex-shrink-0 md:flex-shrink-1 p-2 md:p-3 rounded-xl cursor-pointer transition-all border-2 flex items-center gap-2 md:gap-3
                                            ${isSelected ? 'bg-indigo-600/30 border-indigo-500/60 shadow-lg shadow-indigo-500/20' : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-indigo-500/20'}
                                            ${locked ? 'opacity-50 grayscale' : ''}
                                        `}
                                    >
                                        <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg bg-black/40 flex items-center justify-center text-sm md:text-xl border ${isSelected ? 'text-white border-indigo-500/50' : 'text-zinc-500 border-white/10'}`}>
                                            <i className={`fa-solid ${item.icon}`}></i>
                                        </div>
                                        <div className="flex-1 min-w-[80px] md:min-w-0">
                                            <div className="flex justify-between items-center gap-2">
                                                <span className={`font-bold text-[10px] md:text-sm truncate ${isSelected ? 'text-white' : 'text-zinc-300'}`}>{t(item.name) || item.name}</span>
                                                {myCount > 0 && <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono px-1 md:px-2 py-0.5 rounded-full border border-emerald-500/30">{myCount}</span>}
                                            </div>
                                            <div className="text-[9px] text-zinc-500 uppercase tracking-wider">{t('staff.tier')} {item.tier}</div>
                                        </div>
                                        {locked && <i className="fa-solid fa-lock text-zinc-600 text-[10px] md:text-base"></i>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT: DETAIL VIEW - Scrollable on mobile */}
                    {activeStaff ? (
                        <div className="flex-1 flex flex-col bg-gradient-to-br from-indigo-900/10 to-black p-4 md:p-8 relative overflow-y-auto custom-scrollbar">
                            {/* Background Decoration */}
                            <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
                                <i className={`fa-solid ${activeStaff.icon} text-[500px] text-indigo-500`}></i>
                            </div>

                            <div className="relative z-10 flex flex-col h-full">
                                {/* TOP: Character Image & Info */}
                                <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-4 md:mb-6">
                                    {/* Portrait */}
                                    {/* Portrait */}
                                    <div className="w-24 h-24 md:w-48 md:h-48 bg-black/40 rounded-xl border-2 border-indigo-500/30 relative overflow-hidden flex-shrink-0 shadow-2xl mx-auto md:mx-0">
                                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                                            {activeStaff.image ? (
                                                <img
                                                    src={getImagePath(activeStaff.image)}
                                                    alt={activeStaff.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <i className={`fa-solid ${activeStaff.icon} text-8xl text-zinc-700`}></i>
                                            )}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            {isLocked && <div className="inline-block bg-red-500/20 text-red-500 border border-red-500/30 px-3 py-1 rounded-lg text-xs font-black uppercase mb-2">
                                                <i className="fa-solid fa-lock mr-2"></i>
                                                {t('staff.requires_level')} {activeStaff.reqLevel}
                                            </div>}
                                            <h1 className="text-xl md:text-3xl font-black text-white uppercase italic tracking-tighter mb-1 md:mb-2">{t(activeStaff.name) || activeStaff.name}</h1>
                                            <p className="text-zinc-300 text-[10px] md:text-sm leading-relaxed">{t(activeStaff.desc) || activeStaff.desc}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 mt-4">
                                            <div className="bg-white/5 rounded-lg p-2 md:p-3 border border-white/5">
                                                <div className="text-[9px] md:text-xs text-zinc-500 uppercase tracking-wider mb-1">{t('staff.daily_salary')}</div>
                                                <div className="text-red-400 font-mono font-bold text-sm md:text-lg">{formatNumber(activeStaff.salary)} kr</div>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-2 md:p-3 border border-white/5">
                                                <div className="text-[9px] md:text-xs text-zinc-500 uppercase tracking-wider mb-1">{t('staff.hired')}</div>
                                                <div className="text-white font-mono font-bold text-sm md:text-lg">{count}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* MIDDLE: Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                                    <div className="bg-white/5 rounded-xl p-3 md:p-4 border border-white/5">
                                        <div className="text-[9px] md:text-xs text-zinc-500 uppercase tracking-wider mb-2">{t('staff.production_rate')}</div>
                                        {Object.entries(activeStaff.rates || {}).map(([res, rate]) => (
                                            <div key={res} className="flex justify-between items-center text-[10px] md:text-sm mb-1">
                                                <span className="text-zinc-300">{t(`items.${res}.name`)}</span>
                                                <span className="text-emerald-400 font-mono font-bold">
                                                    {activeStaff.role === 'producer' ? '+' : '~'}
                                                    {(rate * 60).toFixed(1)} /min
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    {activeStaff.tags && (
                                        <div className="bg-white/5 rounded-xl p-3 md:p-4 border border-white/5">
                                            <div className="text-[9px] md:text-xs text-zinc-500 uppercase tracking-wider mb-2">{t('staff.specialties')}</div>
                                            <div className="flex flex-wrap gap-2">
                                                {activeStaff.tags.map(tag => (
                                                    <span key={tag} className="px-2 py-0.5 md:px-3 md:py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-[9px] md:text-xs font-bold border border-indigo-500/30 uppercase">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* BOTTOM: ACTION BAR - Fixed at bottom */}
                                <div className="mt-auto bg-black/60 backdrop-blur-sm p-3 md:p-5 rounded-xl border-2 border-indigo-500/30 flex items-center justify-between gap-2">
                                    <div>
                                        <div className="text-[9px] md:text-xs text-zinc-500 uppercase font-bold mb-0.5 md:mb-1">{t('staff.hiring_cost')}</div>
                                        <div className={`text-xl md:text-3xl font-mono font-black ${canAfford(nextCost) ? 'text-emerald-400' : 'text-red-500'}`}>
                                            {formatNumber(nextCost)} <span className="text-[10px] md:text-sm">kr</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 md:gap-3">
                                        {count > 0 && (
                                            <ActionButton
                                                variant="danger"
                                                onClick={() => onSell(selectedRole, 1)}
                                                className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center text-lg md:text-2xl"
                                                title={t('staff.fire_one')}
                                            >
                                                <i className="fa-solid fa-user-minus"></i>
                                            </ActionButton>
                                        )}

                                        <ActionButton
                                            variant="primary"
                                            onClick={() => onBuy(selectedRole, 1)}
                                            disabled={!canAfford(nextCost) || isLocked}
                                            className="px-4 md:px-8 h-10 md:h-14 text-sm md:text-lg font-bold flex items-center gap-2 md:gap-3"
                                        >
                                            <span className="whitespace-nowrap">{t('staff.hire_staff')}</span>
                                            <i className="fa-solid fa-user-plus"></i>
                                        </ActionButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-zinc-600 bg-zinc-900/50">
                            {t('staff.select_staff')}
                        </div>
                    )}
                </div>
            </GlassCard>
        </div>
    );

    return createPortal(content, document.body);
};

export default StaffCategoryModal;
