import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CONFIG } from '../../config/gameConfig';
import { formatNumber, getBulkCost, getMaxAffordable } from '../../utils/gameMath';
import ActionButton from '../ui/ActionButton';
import GlassCard from '../ui/GlassCard';
import { useLanguage } from '../../context/LanguageContext';

// Static Assets Imports (Fixes Build/PWA Issues)
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

    // Purchasing Logic (copied/adapted from StaffCard)
    const canAfford = (cost) => state.cleanCash >= cost;

    // Calculate cost for 1 unit
    const baseCost = activeStaff ? activeStaff.baseCost : 0;
    const nextCost = activeStaff ? getBulkCost(baseCost, activeStaff.costFactor || 1.15, count, 1) : 0;
    const isLocked = activeStaff && state.level < activeStaff.reqLevel;

    // Image Path Helper
    const getImagePath = (img) => {
        return IMAGE_MAP[img] || null;
    };

    // Lock Body Scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    const content = (
        <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-md p-0 md:p-4 animate-in fade-in duration-200">
            <GlassCard className="w-full max-w-5xl h-[100dvh] md:h-[85vh] flex flex-col overflow-hidden relative border-none shadow-2xl shadow-indigo-500/20 rounded-none md:rounded-2xl" variant="interactive">

                {/* HEADER */}
                <div className="flex justify-between items-center p-6 border-b border-white/10 bg-black/40">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-2xl border border-indigo-500/30">
                            <i className={`fa-solid ${categoryConfig?.icon}`}></i>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-wider">{categoryConfig?.name}</h2>
                            <p className="text-zinc-400 text-sm">{categoryConfig?.desc}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors flex items-center justify-center">
                        <i className="fa-solid fa-xmark text-xl"></i>
                    </button>
                </div>

                <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
                    {/* LEFT: ROSTER LIST */}
                    <div className="w-full md:w-1/3 min-h-[30%] md:min-h-0 md:h-full bg-black/20 border-b md:border-b-0 md:border-r border-white/5 overflow-y-auto p-4 space-y-2 shrink-0">
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 pl-2">Personale</div>
                        {staffList.map(([key, item]) => {
                            const myCount = state.staff[key] || 0;
                            const locked = state.level < item.reqLevel;
                            const isSelected = selectedRole === key;

                            return (
                                <div
                                    key={key}
                                    onClick={() => setSelectedRole(key)}
                                    className={`p-3 rounded-lg cursor-pointer transition-all border flex items-center gap-3
                                        ${isSelected ? 'bg-indigo-600/20 border-indigo-500/50 shadow-lg' : 'bg-white/5 border-transparent hover:bg-white/10'}
                                        ${locked ? 'opacity-50 grayscale' : ''}
                                    `}
                                >
                                    <div className={`w-10 h-10 rounded bg-black/40 flex items-center justify-center text-lg ${isSelected ? 'text-white' : 'text-zinc-500'}`}>
                                        <i className={`fa-solid ${item.icon}`}></i>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <span className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-zinc-300'}`}>{t(item.name) || item.name}</span>
                                            {myCount > 0 && <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono px-1.5 py-0.5 rounded">{myCount}</span>}
                                        </div>
                                        <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Tier {item.tier}</div>
                                    </div>
                                    {locked && <i className="fa-solid fa-lock text-zinc-600"></i>}
                                </div>
                            );
                        })}
                    </div>

                    {/* RIGHT: DETAIL VIEW */}
                    {activeStaff ? (
                        <div className="flex-1 flex flex-col overflow-y-auto bg-gradient-to-br from-indigo-900/10 to-black p-4 md:p-8 relative">
                            {/* Background Character Art (Optional/Placeholder) */}
                            <div className="absolute right-0 bottom-0 opacity-10 md:opacity-20 pointer-events-none transform translate-x-1/4 translate-y-1/4">
                                <i className={`fa-solid ${activeStaff.icon} text-[200px] md:text-[400px]`}></i>
                            </div>

                            <div className="flex flex-col w-full relative z-10 flex-1">
                                {/* TOP: IMAGE & BIO */}
                                <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-4 md:mb-8">
                                    {/* Portrait */}
                                    <div className="w-full md:w-64 h-64 md:h-80 bg-black/40 rounded-lg border-2 border-white/10 relative overflow-hidden flex-shrink-0 shadow-2xl mx-auto md:mx-0">
                                        {/* Character Image or Fallback Icon */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                                            {activeStaff.image ? (
                                                <img
                                                    src={getImagePath(activeStaff.image)}
                                                    alt={activeStaff.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <i className={`fa-solid ${activeStaff.icon} text-9xl text-zinc-700`}></i>
                                            )}
                                        </div>
                                        {/* Overlay Stats */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <div className="text-zinc-400 text-xs uppercase">Daily Salary</div>
                                                    <div className="text-red-400 font-mono font-bold">{formatNumber(activeStaff.salary)} kr</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-zinc-400 text-xs uppercase">Hired</div>
                                                    <div className="text-white font-mono font-bold text-xl">{count}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            {isLocked && <div className="inline-block bg-red-500/20 text-red-500 border border-red-500/30 px-2 py-1 md:px-3 md:py-1 rounded text-[10px] md:text-xs font-black uppercase mb-2">
                                                <i className="fa-solid fa-lock mr-2"></i>
                                                Requires Level {activeStaff.reqLevel}
                                            </div>}
                                            <h1 className="text-2xl md:text-4xl font-black text-white uppercase italic tracking-tighter mb-2">{t(activeStaff.name) || activeStaff.name}</h1>
                                            <p className="text-zinc-300 text-sm md:text-lg leading-relaxed">{t(activeStaff.desc) || activeStaff.desc}</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mt-4">
                                            <div className="bg-white/5 rounded p-3 border border-white/5">
                                                <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Production Rate</div>
                                                {Object.entries(activeStaff.rates || {}).map(([res, rate]) => (
                                                    <div key={res} className="flex justify-between items-center text-sm">
                                                        <span className="text-zinc-300">{t(`items.${res}.name`)}</span>
                                                        <span className="text-emerald-400 font-mono font-bold">
                                                            {activeStaff.role === 'producer' ? '+' : '~'}
                                                            {(rate * 60).toFixed(1)} /min
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            {activeStaff.tags && (
                                                <div className="bg-white/5 rounded p-3 border border-white/5">
                                                    <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Specialties</div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {activeStaff.tags.map(tag => (
                                                            <span key={tag} className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded text-xs font-bold border border-indigo-500/30 uppercase">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* BOTTOM: ACTION BAR */}
                                <div className="mt-auto bg-black/40 p-4 md:p-6 rounded-xl border border-white/10 flex flex-col md:flex-row items-center justify-between backdrop-blur-sm gap-4">
                                    <div className="flex flex-col w-full md:w-auto text-center md:text-left">
                                        <div className="text-xs text-zinc-500 uppercase font-bold">Hiring Cost</div>
                                        <div className={`text-2xl md:text-3xl font-mono font-black ${canAfford(nextCost) ? 'text-emerald-400' : 'text-red-500'}`}>
                                            {formatNumber(nextCost)} kr
                                        </div>
                                    </div>

                                    <div className="flex gap-4 w-full md:w-auto">
                                        {count > 0 && (
                                            <ActionButton
                                                variant="danger"
                                                onClick={() => onSell(selectedRole, 1)}
                                                className="w-12 h-12 flex items-center justify-center text-xl shrink-0"
                                                title="Fire one"
                                            >
                                                <i className="fa-solid fa-user-minus"></i>
                                            </ActionButton>
                                        )}

                                        <ActionButton
                                            variant="primary"
                                            onClick={() => onBuy(selectedRole, 1)}
                                            disabled={!canAfford(nextCost) || isLocked}
                                            className="flex-1 md:flex-none px-8 h-12 text-lg font-bold"
                                        >
                                            HIRE STAFF <i className="fa-solid fa-user-plus ml-2"></i>
                                        </ActionButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-zinc-600 bg-zinc-900/50">
                            Select a staff member
                        </div>
                    )}
                </div>
            </GlassCard>
        </div>
    );

    return createPortal(content, document.body);
};

export default StaffCategoryModal;
