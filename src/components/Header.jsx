import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import StatusBar from './header/StatusBar';
import { LevelBadge, XPDisplay } from './header/MetaDisplay';
import ActionsMenu from './header/ActionsMenu';

import { useUI } from '../context/UIContext';

const Header = ({ state, incomeClean, incomeDirty, bribePolice, activateGhostMode }) => {
    const { t } = useLanguage();

    // OPTIMIZATION: Removed internal timer state.
    // Header re-renders every tick via gameState prop, so we can just use Date.now() directly.
    const now = Date.now();

    return (
        <div className="flex flex-col w-full h-full pointer-events-auto text-white">

            {/* --- MOBILE HEAT WARNING LINE (Visible only on mobile) --- */}
            <div className={`md:hidden w-full h-1.5 bg-theme-bg-secondary border-b border-theme-border-subtle relative overflow-hidden`}>
                <div
                    className={`h-full transition-all duration-500 ease-out ${state.heat > 100 ? 'bg-gradient-to-r from-theme-danger via-theme-danger to-theme-danger animate-pulse' : (state.heat > 80 ? 'bg-gradient-to-r from-theme-warning to-theme-danger' : 'bg-gradient-to-r from-theme-info to-theme-primary')}`}
                    style={{ width: `${Math.min(100, (state.heat / 500) * 100)}%` }}
                ></div>
            </div>

            {/* --- ROW 1: META BAR (Rank, Title, Tools) --- */}
            <div className="h-16 bg-theme-bg-primary/40 border-b border-theme-border-subtle backdrop-blur-md">
                <div className="w-full max-w-6xl mx-auto h-full flex justify-between items-center px-6 relative">
                    {/* LEFT: LEVEL BADGE */}
                    <div className="w-1/3 flex justify-start">
                        <LevelBadge state={state} />
                    </div>

                    {/* CENTER: XP PROGRESS (Rank + Bar) */}
                    <div className="absolute left-1/2 -translate-x-1/2">
                        <XPDisplay state={state} />
                    </div>

                    {/* RIGHT: ACTIONS MENU */}
                    <div className="w-1/3 flex justify-end">
                        <ActionsMenu />
                    </div>
                </div>
            </div>

            {/* --- ROW 2: STATUS BAR (Money & Heat) --- */}
            <StatusBar
                state={state}
                incomeClean={incomeClean}
                incomeDirty={incomeDirty}
                bribePolice={bribePolice}
                activateGhostMode={activateGhostMode}
            />

            {/* --- TERRITORY SIEGE ALERT (NEW) --- */}
            {state.territoryAttacks && Object.keys(state.territoryAttacks).length > 0 && (
                <div className="w-full bg-theme-danger/90 border-b border-theme-danger backdrop-blur-md animate-pulse">
                    <div className="w-full max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <i className="fa-solid fa-triangle-exclamation text-white text-lg animate-bounce"></i>
                            <div>
                                <div className="text-white font-black text-xs uppercase tracking-wider">
                                    ⚠️ {Object.keys(state.territoryAttacks).length} {t('header.siege_alert')}
                                </div>
                                <div className="text-theme-surface-base text-[9px] font-medium">
                                    {t('header.siege_desc')}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {Object.keys(state.territoryAttacks).map(tId => {
                                const attack = state.territoryAttacks[tId];
                                const timeLeft = Math.max(0, attack.expiresAt - now);
                                return (
                                    <div key={tId} className="bg-black/30 px-2 py-1 rounded text-[9px] font-mono text-white">
                                        {tId}: {Math.ceil(timeLeft / 1000)}s
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Header;