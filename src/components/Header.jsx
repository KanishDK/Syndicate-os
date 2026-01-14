import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import StatusBar from './header/StatusBar';
import MetaDisplay from './header/MetaDisplay';
import ActionsMenu from './header/ActionsMenu';

import { useUI } from '../context/UIContext';

const Header = ({ state, incomeClean, incomeDirty, bribePolice }) => {
    const { t } = useLanguage();

    const [now, setNow] = React.useState(0);

    React.useEffect(() => {
        setNow(Date.now());
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col w-full h-full pointer-events-auto text-white">

            {/* --- MOBILE HEAT WARNING LINE (Visible only on mobile) --- */}
            <div className={`md:hidden w-full h-1.5 bg-theme-bg-secondary border-b border-theme-border-subtle relative overflow-hidden`}>
                <div
                    className={`h-full transition-all duration-500 ease-out ${state.heat > 100 ? 'bg-gradient-to-r from-theme-danger via-theme-danger to-theme-danger animate-pulse' : (state.heat > 80 ? 'bg-gradient-to-r from-theme-warning to-theme-danger' : 'bg-gradient-to-r from-theme-info to-theme-primary')}`}
                    style={{ width: `${Math.min(100, state.heat)}%` }}
                ></div>
            </div>

            {/* --- ROW 1: META BAR (Rank, Title, Tools) --- */}
            <div className="h-[44px] bg-theme-bg-primary/40 border-b border-theme-border-subtle backdrop-blur-md">
                <div className="w-full max-w-6xl mx-auto h-full flex justify-between items-center px-4">
                    <MetaDisplay state={state} />

                    {/* CENTER: LOGO (Hidden on very small screens, optional) */}
                    <div className="hidden md:block absolute left-1/2 -translate-x-1/2 opacity-30 pointer-events-none">
                        <h1 className="text-lg font-black tracking-widest italic text-theme-text-primary">SYNDICATE<span className="text-theme-success">OS</span></h1>
                    </div>

                    <ActionsMenu />
                </div>
            </div>

            {/* --- ROW 2: STATUS BAR (Money & Heat) --- */}
            <StatusBar
                state={state}
                incomeClean={incomeClean}
                incomeDirty={incomeDirty}
                bribePolice={bribePolice}
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