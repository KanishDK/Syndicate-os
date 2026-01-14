import React from 'react';
import Header from '../Header';
import NewsTicker from '../NewsTicker';
import ConsoleView from '../ConsoleView';
import FloatManager from '../FloatManager';
import NavButton from '../NavButton';
import BriefcaseController from '../BriefcaseController';
import { getIncomePerSec, formatNumber } from '../../utils/gameMath';
import { useLanguage } from '../../context/LanguageContext';
import { useUI } from '../../context/UIContext';

import { NAVIGATION_TABS } from '../../config/navigation';

const GameLayout = ({
    gameState,
    addFloat,
    onNewsClick,
    bribePolice,
    children
}) => {
    const {
        activeTab, setActiveTab,
        setHelpModal, setSettingsModal
    } = useUI();
    const effects = gameState.settings?.particles !== false;
    const { t } = useLanguage();

    // Derived values for the Header
    const income = getIncomePerSec(gameState);

    const themeClass = gameState.level >= 10 ? 'theme-gold' :
        gameState.level >= 7 ? 'theme-purple' :
            gameState.level >= 4 ? 'theme-cyan' : '';

    return (
        <div id="game-layout" className={`h-screen max-h-screen bg-theme-surface-base text-theme-text-primary font-sans select-none flex flex-col transition-colors duration-500 overflow-hidden ${themeClass}`}>
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:p-4 focus:bg-theme-surface-elevated focus:text-theme-primary focus:font-bold focus:border-2 focus:border-theme-primary focus:rounded-lg focus:outline-none focus:shadow-glow-green">
                Skip to main content
            </a>
            <a href="#navigation" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-48 focus:p-4 focus:bg-theme-surface-elevated focus:text-theme-primary focus:font-bold focus:border-2 focus:border-theme-primary focus:rounded-lg focus:outline-none focus:shadow-glow-green">
                Skip to navigation
            </a>

            {/* Matrix rain effect for specific themes could go here */}
            {effects && <div className="scanline pointer-events-none z-50"></div>}
            {effects && <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none z-0"></div>}

            <FloatManager gameState={gameState} addFloat={addFloat} />

            {/* FLOATING TEXT OVERLAY */}
            {effects && gameState.floats && gameState.floats.map(f => (
                <div key={f.id} className={`fixed pointer-events-none z-[70] font-black text-xl ${f.color} float-anim`} style={{ left: f.x, top: f.y }}>
                    {f.text}
                </div>
            ))}

            <Header
                state={gameState}
                incomeClean={income.clean}
                incomeDirty={income.dirty}
                bribePolice={bribePolice}
            />

            <main id="main-content" className="relative min-h-0 flex flex-col" style={{ height: 'calc(100vh - 60px - 40px - 60px - 60px)' }} role="main" aria-label="Game Screen">
                <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col md:flex-row relative min-h-0 overflow-hidden">

                    {/* LEFT COLUMN - NAVIGATION */}
                    <nav id="navigation" className="md:w-64 shrink-0 flex flex-col border-r border-theme-border-default bg-theme-surface-glass backdrop-blur-sm z-20 md:z-0 absolute md:relative h-full -translate-x-full md:translate-x-0 transition-transform duration-300" aria-label="Main Navigation">
                        <div className="p-2 space-y-1 flex-1 overflow-y-auto">
                            {NAVIGATION_TABS.map(tab => {
                                const isActive = activeTab === tab.id;
                                const label = t(tab.labelKey);
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden ${isActive
                                            ? 'bg-theme-primary/10 text-theme-primary border border-theme-primary/30 shadow-[0_0_10px_rgba(var(--colors-primary-rgb),0.1)]'
                                            : 'text-theme-text-muted hover:bg-theme-surface-elevated hover:text-theme-text-primary border border-transparent'
                                            }`}
                                        aria-current={isActive ? 'page' : undefined}
                                    >
                                        <div className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${isActive ? 'bg-theme-primary text-black' : 'bg-theme-surface-elevated group-hover:bg-theme-surface-elevated'}`}>
                                            <i className={`fa-solid ${tab.icon} ${isActive ? '' : 'text-theme-text-secondary'}`}></i>
                                        </div>
                                        <div className="flex flex-col items-start">
                                            <span className={`text-sm font-bold uppercase tracking-wider ${isActive ? 'text-theme-primary' : 'text-theme-text-secondary group-hover:text-theme-text-primary'}`}>{label}</span>
                                            {tab.showCount && tab.id === 'network' && (
                                                <span className="text-[9px] text-theme-text-muted">
                                                    {Object.keys(gameState.territories).filter(k => gameState.territories[k].owned).length} / {Object.keys(gameState.territories).length}
                                                </span>
                                            )}
                                        </div>

                                        {/* Active Indicator */}
                                        {isActive && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-theme-primary shadow-[0_0_10px_var(--colors-primary)]"></div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </nav>

                    {/* MAIN CONTENT AREA */}
                    <div className="flex-1 relative overflow-hidden bg-theme-surface-base min-h-0">
                        {/* Mobile Overlay for Nav (if we implemented mobile drawer) */}

                        <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-theme-border-emphasis scrollbar-track-theme-surface-base p-4 md:p-6 pb-32 md:pb-8">
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                                {children}
                            </div>
                        </div>

                        {/* Bottom gradient fade for scrolling */}
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-theme-surface-base to-transparent pointer-events-none z-10"></div>
                    </div>
                </div>
            </main>

            {/* --- NEWS TICKER --- */}
            <div className="flex-none shrink-0 z-30">
                <NewsTicker logs={gameState.logs} onNewsClick={onNewsClick} />
            </div>

            {/* --- CONSOLE VIEW (Fixed above nav) --- */}
            <div className="flex-none shrink-0 relative z-40 h-auto md:h-auto overflow-hidden">
                <ConsoleView logs={gameState.logs} />
            </div>

            {/* --- BOTTOM NAVIGATION (FIXED BOTTOM) --- */}
            <nav role="navigation" aria-label="Game tabs" id="navigation" className="flex-none z-50 bg-theme-bg-primary/95 backdrop-blur-xl border-t border-theme-border-subtle pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.8)]">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-theme-border-subtle to-transparent"></div>
                {/* Scroll Mask Hint for Mobile */}
                <div className="max-w-7xl mx-auto px-2 py-2 flex justify-between items-center gap-1 md:gap-4 overflow-x-auto custom-scrollbar-hide relative mask-linear-fade">
                    {NAVIGATION_TABS.map(tab => (
                        <NavButton
                            key={tab.id}
                            active={activeTab === tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            icon={tab.icon}
                            label={t(tab.labelKey)}
                            color={tab.color}
                            alert={tab.alertCheck ? tab.alertCheck(gameState) && activeTab !== tab.id : false}
                        />
                    ))}
                </div>
            </nav>

            {/* Screen reader live region for game state updates */}
            <div aria-live="polite" aria-atomic="true" className="sr-only">
                Clean cash: {formatNumber(gameState.cleanCash)} kr. Dirty cash: {formatNumber(gameState.dirtyCash)} kr.
            </div>
        </div>
    );
};

export default GameLayout;
