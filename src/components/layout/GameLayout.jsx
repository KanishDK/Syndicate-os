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
    activateGhostMode,
    children
}) => {
    const {
        activeTab, setActiveTab,
        setHelpModal, setSettingsModal
    } = useUI();
    const effects = gameState.settings?.particles !== false;
    const { t } = useLanguage();

    const income = getIncomePerSec(gameState);

    const themeClass = gameState.level >= 10 ? 'theme-gold' :
        gameState.level >= 7 ? 'theme-purple' :
            gameState.level >= 4 ? 'theme-cyan' : '';

    return (
        <div id="game-layout" className={`h-full w-full bg-theme-surface-base text-theme-text-primary font-sans select-none flex flex-col transition-colors duration-500 overflow-hidden ${themeClass}`}>

            {/* ACCESSIBILITY SKIP LINKS */}
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:p-4 focus:bg-theme-surface-elevated focus:text-theme-primary focus:font-bold focus:border-2 focus:border-theme-primary focus:rounded-lg focus:outline-none focus:shadow-glow-green">
                Skip to main content
            </a>

            {/* BACKGROUND EFFECTS */}
            {effects && <div className="scanline pointer-events-none z-50"></div>}
            {effects && <div className="crt-flicker pointer-events-none z-[49]"></div>}
            {effects && <div className="vignette pointer-events-none z-[48]"></div>}
            {effects && <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none z-0"></div>}

            <FloatManager gameState={gameState} addFloat={addFloat} />

            {/* FLOATING TEXT OVERLAY */}
            {effects && gameState.floats && gameState.floats.map(f => (
                <div key={f.id} className={`fixed pointer-events-none z-[70] font-black text-xl ${f.color} float-anim`} style={{ left: f.x, top: f.y }}>
                    {f.text}
                </div>
            ))}

            {/* --- TOP: HEADER --- */}
            <div className="flex-none z-40 relative">
                <Header
                    state={gameState}
                    incomeClean={income.clean}
                    incomeDirty={income.dirty}
                    bribePolice={bribePolice}
                    activateGhostMode={activateGhostMode}
                />
            </div>

            {/* --- MIDDLE: MAIN CONTENT (Expand to fill space) --- */}
            <main id="main-content" className="flex-1 relative min-h-0 flex flex-col overflow-hidden" role="main" aria-label="Game Screen">
                <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col md:flex-row relative min-h-0">

                    {/* DESKTOP SIDEBAR (Visible md+) */}
                    <nav className="max-md:hidden md:flex flex-col w-64 shrink-0 border-r border-theme-border-default bg-theme-surface-glass backdrop-blur-sm z-20 h-full">
                        <div className="p-2 space-y-1 overflow-y-auto custom-scrollbar flex-1">
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
                                        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-theme-primary shadow-[0_0_10px_var(--colors-primary)]"></div>}
                                    </button>
                                );
                            })}
                        </div>
                    </nav>

                    {/* CONTENT AREA (Scrollable on Mobile, Fixed on Desktop) */}
                    <div className="flex-1 relative bg-theme-surface-base h-full overflow-hidden">
                        <div className="absolute inset-0 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 min-h-full w-full">
                                {children}
                            </div>
                        </div>
                        {/* Gradient Fade for Scrolling */}
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-theme-surface-base to-transparent pointer-events-none z-10 md:hidden"></div>
                    </div>
                </div>
            </main>

            {/* --- BOTTOM: UI CLUTTER --- */}
            <div className="flex-none flex flex-col z-50">
                {/* News Ticker */}
                <div className="shrink-0 relative z-30 border-t border-theme-border-subtle bg-black">
                    <NewsTicker logs={gameState.logs} onNewsClick={onNewsClick} />
                </div>

                {/* Console Log (Desktop Only often) */}
                <div className="shrink-0 relative z-40 bg-black/80 max-h-[100px] overflow-hidden hidden md:block border-t border-theme-border-subtle">
                    <ConsoleView logs={gameState.logs} />
                </div>

                {/* Mobile Bottom Nav */}
                <nav className="md:hidden bg-theme-bg-primary/95 backdrop-blur-xl border-t border-theme-border-subtle pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.8)]">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-theme-border-subtle to-transparent"></div>
                    <div className="flex justify-between items-center gap-1 overflow-x-auto custom-scrollbar-hide px-2 py-2">
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
            </div>

            {/* Screen Reader Update */}
            <div aria-live="polite" aria-atomic="true" className="sr-only">
                Clean cash: {formatNumber(gameState.cleanCash)} kr. Dirty cash: {formatNumber(gameState.dirtyCash)} kr.
            </div>
        </div>
    );
};

export default GameLayout;
