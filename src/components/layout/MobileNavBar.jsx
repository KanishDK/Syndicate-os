import React, { useState } from 'react';
import NavButton from '../NavButton';
import { useUI } from '../../context/UIContext';

const MobileNavBar = ({ tabs, activeTab, setActiveTab, t, gameState }) => {
    const { setShowMultiplayer } = useUI();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Priority Tabs (Show first 4)
    // Network (Map), Production (Business), Rivals (Combat), Sultan (Missions)
    const priorityIds = ['network', 'production', 'rivals', 'sultan'];

    const visibleTabs = tabs.filter(t => priorityIds.includes(t.id));
    const hiddenTabs = tabs.filter(t => !priorityIds.includes(t.id));

    // Check if active tab is in hidden list
    const isMenuContentActive = hiddenTabs.some(t => t.id === activeTab);

    // Check alerts for menu
    const hasMenuAlert = hiddenTabs.some(tab =>
        tab.alertCheck ? tab.alertCheck(gameState) && activeTab !== tab.id : false
    );

    const handleTabClick = (id) => {
        setActiveTab(id);
        setIsMenuOpen(false);
    };

    return (
        <>
            {/* MENU DRAWER/OVERLAY */}
            {isMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
                    onClick={() => setIsMenuOpen(false)}
                >
                    <div
                        className="absolute bottom-[calc(env(safe-area-inset-bottom)+70px)] left-2 right-2 bg-theme-surface-elevated border border-theme-border-default rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4 border-b border-theme-border-subtle pb-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-theme-text-secondary">More Apps</span>
                            <button onClick={() => setIsMenuOpen(false)} className="w-6 h-6 rounded-full bg-theme-bg-primary flex items-center justify-center text-theme-text-muted">
                                <i className="fa-solid fa-xmark text-xs"></i>
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {hiddenTabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabClick(tab.id)}
                                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${activeTab === tab.id
                                        ? 'bg-theme-primary/10 border-theme-primary text-theme-primary'
                                        : 'bg-theme-bg-primary border-transparent text-theme-text-muted hover:bg-theme-surface-base'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${activeTab === tab.id ? 'bg-theme-primary text-black' : 'bg-theme-surface-elevated'
                                        }`}>
                                        <i className={`fa-solid ${tab.icon}`}></i>
                                    </div>
                                    <span className="text-[10px] uppercase font-bold tracking-wider">{t(tab.labelKey)}</span>
                                    {/* Alert dot for grid items */}
                                    {tab.alertCheck && tab.alertCheck(gameState) && activeTab !== tab.id && (
                                        <div className="absolute top-2 right-2 w-2 h-2 bg-theme-danger rounded-full animate-pulse"></div>
                                    )}
                                </button>
                            ))}

                            <button
                                onClick={() => {
                                    setShowMultiplayer(true);
                                    setIsMenuOpen(false);
                                }}
                                className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border bg-theme-bg-primary border-transparent text-purple-400 hover:bg-theme-surface-base"
                            >
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-purple-500/20">
                                    <i className="fa-solid fa-users"></i>
                                </div>
                                <span className="text-[10px] uppercase font-bold tracking-wider">{t('tabs.multiplayer')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* BOTTOM NAV BAR */}
            <nav className="lg:hidden bg-theme-bg-primary/95 backdrop-blur-xl border-t border-theme-border-subtle pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.8)] relative z-[90]">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-theme-border-subtle to-transparent"></div>
                <div className="grid grid-cols-5 items-center px-1 py-1">
                    {/* VISIBLE TABS */}
                    {visibleTabs.map(tab => (
                        <div key={tab.id} className="flex justify-center">
                            <NavButton
                                active={activeTab === tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setIsMenuOpen(false);
                                }}
                                icon={tab.icon}
                                label={t(tab.labelKey)}
                                alert={tab.alertCheck ? tab.alertCheck(gameState) && activeTab !== tab.id : false}
                            />
                        </div>
                    ))}

                    {/* MENU BUTTON */}
                    <div className="flex justify-center">
                        <NavButton
                            active={isMenuOpen || isMenuContentActive}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            icon="fa-bars"
                            label="Menu"
                            alert={hasMenuAlert}
                        />
                    </div>
                </div>
            </nav>
        </>
    );
};

export default MobileNavBar;
