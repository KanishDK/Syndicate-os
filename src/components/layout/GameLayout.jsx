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
    children
}) => {
    const xpNeeded = Math.floor(1000 * Math.pow(1.5, gameState.level));
    const effects = gameState.settings?.particles !== false;
    const shakeClass = (isRaid && effects) ? 'animate-shake-hard' : '';

    return (
        <div className={`p-2 md:p-4 h-full flex flex-col relative w-full ${shakeClass}`}>
            {effects && <div className="scanline"></div>}

            <FloatManager gameState={gameState} addFloat={addFloat} />

            {/* FLOATING TEXT */}
            {effects && gameState.floats && gameState.floats.map(f => (
                <div key={f.id} className={`fixed pointer-events-none z-[60] font-black text-xl ${f.color} float-anim`} style={{ left: f.x, top: f.y }}>
                    {f.text}
                </div>
            ))}

            <div className="fixed top-0 left-0 w-full h-[88px] bg-black/90 backdrop-blur-md z-40 border-b border-white/10 shadow-2xl">
                <Header
                    state={gameState}
                    incomeClean={getIncomePerSec(gameState).clean}
                    incomeDirty={getIncomePerSec(gameState).dirty}
                    setHelpModal={setHelpModal}
                    setSettingsModal={setSettingsModal}
                />
            </div>

            {/* NEWS */}
            <NewsTicker logs={gameState.logs} />

            {/* MAIN AREA */}
            <div className="fixed inset-0 top-[100px] flex flex-col overflow-hidden bg-gradient-to-br from-[#050505] to-[#0a0a0c]">
                {effects && <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>}

                <BriefcaseController />

                <ConsoleView logs={gameState.logs} />

                <div className="flex items-center gap-1 p-2 border-b border-white/5 bg-[#050505]/50 backdrop-blur shrink-0 overflow-x-auto custom-scrollbar">
                    <NavButton active={activeTab === 'sultan'} onClick={() => setActiveTab('sultan')} icon="fa-comment-dots" label="Sultanen" color="text-amber-500" />
                    <NavButton active={activeTab === 'production'} onClick={() => setActiveTab('production')} icon="fa-flask" label="Produktion" color="text-emerald-400" />
                    <NavButton active={activeTab === 'network'} onClick={() => setActiveTab('network')} icon="fa-globe" label="Gaden" color="text-indigo-400" />
                    <NavButton active={activeTab === 'rivals'} onClick={() => setActiveTab('rivals')} icon="fa-skull-crossbones" label="Underverdenen" color="text-red-500" />
                    <NavButton active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} icon="fa-sack-dollar" label="Finans" color="text-amber-400" alert={gameState.dirtyCash > 5000 && activeTab !== 'finance'} />
                    <NavButton active={activeTab === 'management'} onClick={() => setActiveTab('management')} icon="fa-briefcase" label="Operationer" color="text-blue-400" />
                    <NavButton active={activeTab === 'empire'} onClick={() => setActiveTab('empire')} icon="fa-crown" label="Imperiet" color="text-purple-400" />
                </div>

                <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar relative z-10 p-4 md:p-8 lg:p-10 pb-32 overscroll-contain">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default GameLayout;
