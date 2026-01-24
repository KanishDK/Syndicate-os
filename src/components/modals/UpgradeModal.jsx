import React from 'react';
import { CONFIG } from '../../config/gameConfig';
import UpgradeCard from '../management/UpgradeCard';
import { useLanguage } from '../../context/LanguageContext';

const UpgradeModal = ({ state, buyUpgrade, onClose }) => {
    const { t } = useLanguage();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-theme-surface-base border border-theme-border-default rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-theme-border-subtle bg-black/20">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-widest text-purple-400 flex items-center gap-3">
                            <i className="fa-solid fa-cart-shopping"></i> {t('management.upgrades')}
                        </h2>
                        <p className="text-xs text-zinc-500 font-mono mt-1">
                            Black Market Equipment & Expansions
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                    >
                        <i className="fa-solid fa-times"></i>
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-black/20">
                    <div className="grid grid-cols-1 gap-3">
                        {Object.entries(CONFIG.upgrades).map(([key, item]) => (
                            <UpgradeCard
                                key={key}
                                itemKey={key}
                                item={item}
                                currentLevel={state.upgrades[key] || 0}
                                onBuy={buyUpgrade}
                                state={state}
                            />
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-theme-border-subtle bg-theme-surface-elevated flex justify-end">
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

export default UpgradeModal;
