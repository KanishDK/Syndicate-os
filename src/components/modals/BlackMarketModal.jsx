import React from 'react';
import { CONFIG } from '../../config/gameConfig';
import Button from '../Button';

const BlackMarketModal = ({ isOpen, onClose, gameState, buyPremiumItem }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border-2 border-yellow-500/50 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                {/* Header */}
                <div className="sticky top-0 bg-zinc-900 border-b border-yellow-500/30 p-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-yellow-400 uppercase tracking-wider flex items-center gap-2">
                            <i className="fa-solid fa-gem"></i>
                            Sort Marked
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">Eksklusivt for Diamant-Ejere</p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-zinc-400">Dit Balance</div>
                        <div className="text-2xl font-black text-yellow-400 flex items-center gap-2">
                            <i className="fa-solid fa-gem text-lg"></i>
                            {gameState.diamonds}
                        </div>
                    </div>
                </div>

                {/* Items Grid */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {CONFIG.premiumItems.map(item => {
                        const canAfford = gameState.diamonds >= item.cost;

                        return (
                            <div
                                key={item.id}
                                className={`bg-black/40 border rounded-lg p-4 transition-all ${canAfford
                                        ? 'border-yellow-500/30 hover:border-yellow-500/60 hover:shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                                        : 'border-zinc-800 opacity-50'
                                    }`}
                            >
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-12 h-12 bg-yellow-900/30 rounded-lg flex items-center justify-center text-2xl text-yellow-400 border border-yellow-500/30">
                                        <i className={`fa-solid ${item.icon}`}></i>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-white text-sm">{item.name}</h3>
                                        <p className="text-xs text-zinc-400 mt-1">{item.desc}</p>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => buyPremiumItem(item.id)}
                                    disabled={!canAfford}
                                    variant={canAfford ? 'warning' : 'neutral'}
                                    className="w-full !py-2 text-xs"
                                    size="sm"
                                >
                                    <i className="fa-solid fa-gem"></i>
                                    {item.cost} Diamanter
                                </Button>
                            </div>
                        );
                    })}
                </div>

                {/* Info Footer */}
                <div className="border-t border-zinc-800 p-4 bg-zinc-950/50">
                    <p className="text-xs text-zinc-500 text-center">
                        <i className="fa-solid fa-info-circle"></i> Diamanter optjenes ved at fange Droner eller fuldføre Achievements
                    </p>
                </div>

                {/* Close Button */}
                <div className="p-4 pt-0">
                    <Button onClick={onClose} variant="ghost" className="w-full">
                        Luk
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BlackMarketModal;
