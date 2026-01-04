import React from 'react';
import Header from '../Header';
import NewsTicker from '../NewsTicker';
import ConsoleView from '../ConsoleView';
import FloatManager from '../FloatManager';
import NavButton from '../NavButton';
import BriefcaseController from '../BriefcaseController';
import { getIncomePerSec } from '../../utils/gameMath';

const GameLayout = ({
    gameState,
    addFloat,
    activeTab,
    setActiveTab,
    setHelpModal,
    setSettingsModal,
    isRaid,
    onNewsClick,
    bribePolice,
    children
}) => {
    const effects = gameState.settings?.particles !== false;
    const shakeClass = (isRaid && effects) ? 'animate-shake-hard' : '';

    return (
        <div className={`h-[100dvh] flex flex-col relative w-full overflow-hidden bg-[#050505] text-white select-none ${shakeClass}`}>
            {effects && <div className="scanline pointer-events-none z-50"></div>}
            {effects && <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none z-0"></div>}

            <FloatManager gameState={gameState} addFloat={addFloat} />

            {/* FLOATING TEXT OVERLAY */}
            {effects && gameState.floats && gameState.floats.map(f => (
                <div key={f.id} className={`fixed pointer-events-none z-[70] font-black text-xl ${f.color} float-anim`} style={{ left: f.x, top: f.y }}>
                    {f.text}
                </div>
            ))}

            {/* --- HEADER (FIXED TOP) --- */}
            <div className="flex-none z-40 bg-black/90 backdrop-blur-md border-b border-white/10 shadow-xl relative">
                <Header
                    state={gameState}
                    incomeClean={getIncomePerSec(gameState).clean}
                    incomeDirty={getIncomePerSec(gameState).dirty}
                    setHelpModal={setHelpModal}
                    setSettingsModal={setSettingsModal}
                    bribePolice={bribePolice}
                />
            </div>

            {/* --- NEWS TICKER --- */}
            <div className="flex-none z-30">
                <NewsTicker logs={gameState.logs} onNewsClick={onNewsClick} />
            </div>

            {/* --- MAIN CONTENT (SCROLLABLE) --- */}
            <div className="flex-1 relative overflow-hidden flex flex-col">
                <BriefcaseController />

                <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 pb-32 overscroll-contain relative z-10 w-full max-w-7xl mx-auto">
                    {children}
                </main>

                {/* --- CONSOLE VIEW (Fixed above nav) --- */}
                <div className="flex-none relative z-40 h-auto md:h-auto overflow-hidden">
                    <ConsoleView logs={gameState.logs} />
                </div>
            </div>

            {/* --- BOTTOM NAVIGATION (FIXED BOTTOM) --- */}
            <div className="flex-none z-50 bg-[#0a0a0c]/95 backdrop-blur-xl border-t border-white/10 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.8)]">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                {/* Scroll Mask Hint for Mobile */}
                <div className="max-w-7xl mx-auto px-2 py-2 flex justify-between items-center gap-1 md:gap-4 overflow-x-auto custom-scrollbar-hide relative mask-linear-fade">
                    <NavButton active={activeTab === 'sultan'} onClick={() => setActiveTab('sultan')} icon="fa-comment-dots" label="Sultanen" color="text-amber-500" />
                    <NavButton active={activeTab === 'production'} onClick={() => setActiveTab('production')} icon="fa-flask" label="Produktion" color="text-emerald-400" />
                    <NavButton active={activeTab === 'network'} onClick={() => setActiveTab('network')} icon="fa-globe" label="Gaden" color="text-indigo-400" />
                    <NavButton active={activeTab === 'rivals'} onClick={() => setActiveTab('rivals')} icon="fa-skull-crossbones" label="Underverdenen" color="text-red-500" />
                    <NavButton active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} icon="fa-sack-dollar" label="Finans" color="text-amber-400" alert={gameState.dirtyCash > 5000 && activeTab !== 'finance'} />
                    <NavButton active={activeTab === 'management'} onClick={() => setActiveTab('management')} icon="fa-briefcase" label="Operationer" color="text-blue-400" />
                    <NavButton active={activeTab === 'empire'} onClick={() => setActiveTab('empire')} icon="fa-crown" label="Imperiet" color="text-purple-400" />
                </div>
            </div>
        </div>
    );
};

export default GameLayout;
