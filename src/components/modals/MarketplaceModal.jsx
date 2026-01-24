import React, { useState } from 'react';
import { CONFIG } from '../../config/gameConfig';
import UpgradeCard from '../management/UpgradeCard';
import MasteryCard from '../management/MasteryCard';
import PrestigeCard from '../management/PrestigeCard';
import { useLanguage } from '../../context/LanguageContext';
import { formatNumber } from '../../utils/gameMath';
import GlassCard from '../ui/GlassCard';

const MarketplaceModal = ({ state, buyUpgrade, buyMastery, buyPerk, onClose }) => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('operations');

    const tabs = [
        { id: 'operations', label: t('management.upgrades'), icon: 'fa-box-open', color: 'text-emerald-400' },
        { id: 'syndicate', label: t('management.mastery'), icon: 'fa-gem', color: 'text-amber-400' },
        { id: 'prestige', label: t('management.prestige'), icon: 'fa-crown', color: 'text-purple-400' }
    ];

    // Currency Display Logic
    const getCurrencyDisplay = () => {
        switch (activeTab) {
            case 'operations':
                return {
                    val: state.cleanCash,
                    icon: 'fa-sack-dollar',
                    color: 'text-emerald-400',
                    label: 'Clean Cash'
                };
            case 'syndicate':
                return {
                    val: state.diamonds || 0,
                    icon: 'fa-gem',
                    color: 'text-amber-400',
                    label: 'Diamonds'
                };
            case 'prestige':
                return {
                    val: state.prestige?.currency || 0,
                    icon: 'fa-crown',
                    color: 'text-purple-400',
                    label: t('prestige.points')
                };
            default:
                return null;
        }
    };

    const currency = getCurrencyDisplay();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-theme-surface-base border border-theme-border-default rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex flex-col border-b border-theme-border-subtle bg-black/40">
                    <div className="flex justify-between items-center p-6 pb-2">
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-widest text-zinc-100 flex items-center gap-3 font-terminal">
                                <i className="fa-solid fa-cart-shopping text-zinc-500"></i> BLACK MARKET
                            </h2>
                            <p className="text-xs text-zinc-500 font-mono mt-1 w-full">
                                Underground Supply & Logistics Network
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                        >
                            <i className="fa-solid fa-times"></i>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex px-6 pt-2 pb-0 gap-2 mt-4 overflow-x-auto custom-scrollbar-thin">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all rounded-t-lg border-t border-x relative top-[1px]
                                    ${activeTab === tab.id
                                        ? 'bg-theme-surface-base border-theme-border-subtle text-white border-b-theme-surface-base z-10'
                                        : 'bg-black/20 border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}
                                `}
                            >
                                <i className={`fa-solid ${tab.icon} mr-2 ${activeTab === tab.id ? tab.color : ''}`}></i>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Currency Bar */}
                <div className="px-6 py-2 bg-theme-surface-elevated border-b border-theme-border-subtle flex justify-end items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Available Funds:</span>
                    <div className={`font-mono font-bold text-lg flex items-center gap-2 ${currency.color}`}>
                        {formatNumber(currency.val)}
                        <i className={`fa-solid ${currency.icon} text-sm`}></i>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-black/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        {/* Operations (Standard Upgrades) */}
                        {activeTab === 'operations' && Object.entries(CONFIG.upgrades).map(([key, item]) => (
                            <UpgradeCard
                                key={key}
                                itemKey={key}
                                item={item}
                                currentLevel={state.upgrades[key] || 0}
                                onBuy={buyUpgrade}
                                state={state}
                            />
                        ))}

                        {/* Syndicate (Mastery Perks) */}
                        {activeTab === 'syndicate' && Object.entries(CONFIG.masteryPerks).map(([key, item]) => (
                            <MasteryCard
                                key={key}
                                itemKey={key}
                                item={item}
                                isOwned={state.masteryPerks?.[key]}
                                onBuy={buyMastery}
                                state={state}
                            />
                        ))}

                        {/* Prestige (Prestige Perks) */}
                        {activeTab === 'prestige' && Object.entries(CONFIG.perks).map(([key, item]) => (
                            <PrestigeCard
                                key={key}
                                itemKey={key}
                                item={item}
                                currentLevel={state.prestige?.perks?.[key] || 0}
                                onBuy={buyPerk}
                                state={state}
                                currencyAmount={state.prestige?.currency || 0}
                            />
                        ))}
                    </div>

                    {/* LARGE BOTTOM SPACER TO PREVENT CLIPPING */}
                    <div className="h-32 w-full pointer-events-none"></div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-theme-border-subtle bg-theme-surface-elevated flex justify-between items-center">
                    <div className="text-[10px] text-zinc-600 font-mono">
                        MARKET_ID: 0x{Date.now().toString(16).toUpperCase().slice(-8)}
                    </div>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
                    >
                        {t('ui.close')} (ESC)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MarketplaceModal;
