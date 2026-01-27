import React from 'react';
import NetCode from '../NetCode';

const MultiplayerModal = ({ gameState, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={onClose}></div>

            <div className="relative w-full max-w-2xl bg-theme-surface-base border border-theme-primary shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-lg overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-theme-primary/10 border-b border-theme-primary/30 p-4 flex justify-between items-center">
                    <h2 className="text-xl font-black text-theme-primary uppercase tracking-widest flex items-center gap-3">
                        <i className="fa-solid fa-globe"></i>
                        Syndicate Network (Beta)
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-theme-primary hover:text-black transition-colors"
                    >
                        <i className="fa-solid fa-times text-lg"></i>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-theme-text-secondary mb-6 text-sm">
                        Connect directly to another Syndicate boss via encrypted P2P link.
                        No servers. No traces. Just business.
                    </p>

                    <NetCode gameState={gameState} />
                </div>
            </div>
        </div>
    );
};

export default MultiplayerModal;
