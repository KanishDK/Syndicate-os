import React from 'react';
import { CONFIG } from '../config/gameConfig';
import { formatNumber } from '../utils/gameMath';
import Button from './Button';

const SultanTab = ({ state, addLog, handleChoice, buyHype, buyBribe }) => {
    // Phase 1: Services (The Back Room)
    // Phase 2: Mission Dossier

    const activeStory = state.activeStory;
    const dailyMission = state.dailyMission;

    const [now, setNow] = React.useState(Date.now());

    React.useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    const isActive = (type) => state.activeBuffs?.[type] > now;
    const timeLeft = (type) => Math.floor((state.activeBuffs?.[type] - now) / 1000);

    const getProgress = (m) => {
        if (!m) return { current: 0, target: 1, percent: 0 };
        let current = 0;
        const { type, item, role, id } = m.req;
        const amount = Math.max(1, m.req.amount || 0);

        if (m.isDaily) {
            const start = m.startStats || {};
            if (type === 'produce') current = (state.stats.produced[item] || 0) - (start.produced?.[item] || 0);
            if (type === 'sell') current = (state.stats.sold || 0) - (start.sold || 0);
            if (type === 'launder') current = (state.stats.laundered || 0) - (start.laundered || 0);
        } else {
            // Logic for absolute (Story) tasks
            if (type === 'produce') current = state.stats.produced[item] || 0;
            if (type === 'sell') current = state.stats.sold || 0;
            if (type === 'launder') current = state.stats.laundered || 0;
            if (type === 'hire') current = state.staff[role] || 0;
            if (type === 'conquer') current = state.territories.length;
            if (type === 'upgrade') current = state.upgrades[id] || 0;
            if (type === 'defense') current = state.defense?.[id] || 0;
        }
        const percent = Math.min(100, Math.floor((current / amount) * 100));
        return { current: Math.max(0, current), target: amount, percent: isNaN(percent) ? 0 : percent };
    };


    return (
        <div className="max-w-6xl mx-auto h-full flex flex-col gap-6">
            <div className="border-b border-white/10 pb-4">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-terminal-amber flex items-center gap-3 font-terminal">
                    <i className="fa-solid fa-crown"></i> Sultanens Baglokale
                </h2>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-terminal">
                    <strong className="text-terminal-amber">Sultanens Tjenester</strong> giver dig adgang til eksklusive fordele og kontrakter.
                    Fuldfør missioner for at stige i graderne og låse op for nye muligheder.
                </p>
            </div>

            {/* MISSION STATISTICS */}
            <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-4">
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-white/5 pb-2 font-terminal">
                    <i className="fa-solid fa-chart-line"></i> Mission Statistik
                </h3>

                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-mono font-bold text-terminal-green">
                            {state.completedMissions?.length || 0}
                        </div>
                        <div className="text-[10px] text-zinc-500 uppercase font-terminal">
                            Fuldført
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-mono font-bold text-terminal-cyan">
                            {CONFIG.missions.length - (state.completedMissions?.length || 0)}
                        </div>
                        <div className="text-[10px] text-zinc-500 uppercase font-terminal">
                            Tilbage
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-mono font-bold text-terminal-amber">
                            {Math.floor(((state.completedMissions?.length || 0) / CONFIG.missions.length) * 100)}%
                        </div>
                        <div className="text-[10px] text-zinc-500 uppercase font-terminal">
                            Fremskridt
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* COL 1: SERVICES */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-4 shadow-xl">
                        <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-white/5 pb-2 font-terminal">
                            <i className="fa-solid fa-handshake"></i> Tjenester
                        </h3>

                        <p className="text-xs text-zinc-400 mb-4 leading-relaxed font-terminal">
                            Brug Sultanens tjenester strategisk for at håndtere heat og øge salg.
                        </p>

                        <div className="space-y-3">
                            {/* BRIBE */}
                            <div className="p-3 bg-zinc-900/30 rounded-xl border border-white/5 flex flex-col gap-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-xs font-bold text-white uppercase font-terminal">Smør Osten</div>
                                        <div className="text-[10px] text-zinc-500 font-terminal">
                                            Bestik politiet for at reducere heat.
                                            Pris: <span className="text-terminal-cyan">{state.heat > 0 ? formatNumber(Math.floor(state.heat * 500)) : 0} kr</span> (skalerer med heat).
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded bg-terminal-cyan/20 text-terminal-cyan flex items-center justify-center">
                                        <i className="fa-solid fa-scale-unbalanced"></i>
                                    </div>
                                </div>
                                <Button
                                    onClick={buyBribe}
                                    disabled={state.cleanCash < Math.floor(state.heat * 500) || state.heat < 5}
                                    className="w-full py-2 text-[10px] flex justify-between px-3 font-terminal"
                                    size="sm"
                                    variant="neutral"
                                >
                                    <span>Reducer Heat (-10)</span>
                                    <span>{state.heat > 0 ? formatNumber(Math.floor(state.heat * 500)) : 0} kr</span>
                                </Button>
                            </div>

                            {/* HYPE */}
                            <div className={`p-3 rounded-xl border flex flex-col gap-2 transition-all ${isActive('hype') ? 'bg-terminal-amber/10 border-terminal-amber/30' : 'bg-zinc-900/30 border-white/5'}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-xs font-bold text-white uppercase flex items-center gap-2 font-terminal">
                                            Gade-Hype
                                            {isActive('hype') && <span className="text-[9px] bg-terminal-amber text-terminal-black px-1.5 rounded animate-pulse">AKTIV: {timeLeft('hype')}s</span>}
                                        </div>
                                        <div className="text-[10px] text-zinc-500 font-terminal">
                                            Rygterne spreder sig hurtigt. Fordobler salgshastighed i 2 minutter.
                                        </div>
                                    </div>
                                    <div className={`w-8 h-8 rounded flex items-center justify-center ${isActive('hype') ? 'bg-terminal-amber text-terminal-black animate-spin-slow' : 'bg-terminal-amber/20 text-terminal-amber'}`}>
                                        <i className="fa-solid fa-bullhorn"></i>
                                    </div>
                                </div>
                                <Button
                                    onClick={buyHype}
                                    disabled={state.cleanCash < 25000 || isActive('hype')}
                                    className="w-full py-2 text-[10px] flex justify-between px-3 font-terminal"
                                    size="sm"
                                    variant={isActive('hype') ? 'warning' : 'neutral'}
                                >
                                    <span>Start Kampagne</span>
                                    <span>25k kr</span>
                                </Button>
                            </div>

                            {/* SULTAN INTELLIGENCE (NEW PLATINUM FEATURE) */}
                            <div className={`p-4 rounded-2xl border transition-all duration-500 overflow-hidden relative ${isActive('sultan_bribe') ? 'bg-indigo-950/20 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.1)]' : 'bg-black/40 border-white/5 opacity-60'}`}>
                                <div className="absolute top-0 right-0 p-3 opacity-20">
                                    <i className={`fa-solid fa-eye-low-vision text-4xl ${isActive('sultan_bribe') ? 'text-indigo-400' : 'text-zinc-600'}`}></i>
                                </div>

                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${isActive('sultan_bribe') ? 'bg-indigo-500 text-black' : 'bg-zinc-800 text-zinc-600'}`}>
                                        <i className="fa-solid fa-satellite-dish"></i>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-white uppercase tracking-tight">Efterretning</h4>
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Markedsprognose</p>
                                    </div>
                                </div>

                                {isActive('sultan_bribe') ? (
                                    <div className="space-y-3">
                                        <div className="bg-black/60 rounded-xl p-4 border border-indigo-500/20 animate-in fade-in zoom-in-95 duration-500">
                                            <div className="text-[9px] font-bold text-indigo-400 uppercase mb-2 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                                                Næste Hændelse
                                            </div>
                                            <p className="text-xs text-white font-medium leading-relaxed italic">
                                                "{state.nextNewsEvent?.msg || "Venter på signal..."}"
                                            </p>
                                        </div>
                                        <div className="text-[10px] text-zinc-500 bg-indigo-500/5 p-2 rounded-lg border border-indigo-500/10 text-center">
                                            Forbindelse stabil. {timeLeft('sultan_bribe')}s tilbage.
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <i className="fa-solid fa-lock text-zinc-700 text-xl mb-2"></i>
                                        <p className="text-[10px] text-zinc-600 font-bold uppercase">Bestik Sultanen for prognose.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* COL 2 & 3: MISSION DOSSIER */}
                <div className="lg:col-span-2 space-y-6">
                    {activeStory && (
                        <MissionCard
                            mission={activeStory}
                            progress={getProgress(activeStory)}
                            title="Hovedopgave"
                            handleChoice={handleChoice}
                            state={state}
                        />
                    )}

                    {dailyMission && (
                        <MissionCard
                            mission={dailyMission}
                            progress={getProgress(dailyMission)}
                            title="Daglig Kontrakt"
                            handleChoice={handleChoice}
                            state={state}
                        />
                    )}

                    {/* Show locked mission indicator */}
                    {!activeStory && !dailyMission && (() => {
                        // Find next mission that's locked by rank
                        const nextMission = CONFIG.missions.find(m => !state.completedMissions.includes(m.id));
                        if (nextMission && nextMission.reqLevel && state.level < nextMission.reqLevel) {
                            return (
                                <div className="bg-[#0a0a0c] border border-amber-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(251,191,36,0.1)]">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-12 h-12 bg-amber-900/20 rounded-full flex items-center justify-center text-2xl text-amber-500 border border-amber-500/30 shrink-0">
                                            <i className="fa-solid fa-lock"></i>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-black text-amber-400 uppercase tracking-tight mb-1">
                                                {nextMission.title}
                                            </h3>
                                            <p className="text-xs text-zinc-500 uppercase tracking-wider">Næste Hovedopgave</p>
                                        </div>
                                    </div>

                                    <div className="bg-black/40 border border-amber-500/20 rounded-lg p-4 mb-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <i className="fa-solid fa-triangle-exclamation text-amber-500"></i>
                                            <span className="text-sm font-bold text-amber-400">Kræver Rank {nextMission.reqLevel}</span>
                                        </div>
                                        <p className="text-xs text-zinc-400">
                                            Du er Rank {state.level}: <span className="text-white font-bold">{CONFIG.levelTitles[state.level - 1] || 'Kingpin'}</span>
                                        </p>
                                        <p className="text-xs text-zinc-500 mt-2">
                                            Optjen mere XP for at låse denne mission op.
                                        </p>
                                    </div>

                                    <div className="bg-zinc-900/50 rounded-lg p-3 border border-white/5">
                                        <p className="text-xs text-zinc-400 italic">"{nextMission.text}"</p>
                                        <p className="text-[10px] text-zinc-600 mt-2">- {nextMission.giver}</p>
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })()}

                    {!activeStory && !dailyMission && (() => {
                        // Check if there's a locked mission
                        const nextMission = CONFIG.missions.find(m => !state.completedMissions.includes(m.id));
                        const isLocked = nextMission && nextMission.reqLevel && state.level < nextMission.reqLevel;

                        if (!isLocked) {
                            return (
                                <div className="h-full flex flex-col items-center justify-center bg-[#111] rounded-xl border border-white/5 p-8 text-center opacity-50 min-h-[300px]">
                                    <i className="fa-solid fa-ban text-4xl text-zinc-600 mb-4"></i>
                                    <h3 className="text-xl font-bold text-zinc-400 uppercase">Ingen Aktive Kontrakter</h3>
                                    <p className="text-zinc-600 text-sm max-w-xs mx-auto mt-2">Sultanen har intet til dig lige nu. Tjek tilbage om lidt.</p>
                                </div>
                            );
                        }
                        return null;
                    })()}
                </div>
            </div>

            {/* ACHIEVEMENTS SECTION */}
            <div className="bg-[#0a0a0c] border border-terminal-amber/20 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                    <h3 className="text-terminal-amber font-black uppercase tracking-wider flex items-center gap-2 font-terminal">
                        <i className="fa-solid fa-trophy"></i> Achievements
                    </h3>
                    <div className="text-xs text-zinc-500 font-terminal">
                        {state.unlockedAchievements?.length || 0} / {CONFIG.achievements.length} Unlocked
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {CONFIG.achievements.map(ach => {
                        const unlocked = (state.unlockedAchievements || []).includes(ach.id);
                        return (
                            <div
                                key={ach.id}
                                className={`p-4 rounded-xl border transition-all ${unlocked
                                    ? 'bg-terminal-amber/10 border-terminal-amber/30'
                                    : 'bg-zinc-900/30 border-white/5 opacity-50'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 ${unlocked
                                        ? 'bg-terminal-amber text-terminal-black'
                                        : 'bg-zinc-800 text-zinc-600'
                                        }`}>
                                        <i className={`fa-solid ${ach.icon || 'fa-star'}`}></i>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-bold text-white font-terminal truncate">
                                            {unlocked || !ach.secret ? ach.name : 'Hemmelig'}
                                        </div>
                                        <div className="text-[10px] text-zinc-400 mt-1 font-terminal leading-tight">
                                            {unlocked || !ach.secret ? ach.desc : 'Lås op for at se denne bedrift.'}
                                        </div>
                                        {unlocked && ach.reward && (
                                            <div className="text-[9px] text-terminal-green mt-2 font-terminal">
                                                +{ach.reward} Diamonds
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const MissionCard = ({ mission, progress, title, handleChoice, state }) => {
    const isPicked = state.missionChoices?.[mission.id];

    return (
        <div className="bg-[#111] rounded-xl border border-white/10 relative overflow-hidden flex flex-col min-h-[200px]">
            {/* Paper Effect */}
            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600"></div>

            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="text-[9px] font-mono text-amber-500/70 uppercase mb-1">
                            {title} • {mission.isDaily ? 'FLASH_OPS' : `STORY_CONTRACT`}
                        </div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter">{mission.title}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-amber-500/30 bg-amber-500/5 flex items-center justify-center text-amber-500">
                        <i className={`fa-solid ${mission.isDaily ? 'fa-bolt' : 'fa-file-signature'}`}></i>
                    </div>
                </div>

                <p className="text-zinc-400 text-xs italic mb-4 leading-relaxed line-clamp-2">
                    "{mission.text}"
                </p>

                {/* PROGRESS */}
                <div className="bg-black/40 p-3 rounded-lg border border-white/5 mb-4">
                    <div className="flex justify-between text-[10px] font-mono mb-1">
                        <span className="text-zinc-500">Status:</span>
                        <span className={progress.percent >= 100 ? 'text-emerald-500' : 'text-amber-500'}>
                            {formatNumber(progress.current)} / {formatNumber(progress.target)}
                        </span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-amber-500 bg-gradient-to-r from-amber-600 to-yellow-500 transition-all duration-1000"
                            style={{ width: `${progress.percent}%` }}
                        ></div>
                    </div>
                </div>

                {/* REWARDS & CHOICES */}
                <div className="flex justify-between items-center gap-4">
                    <div className="flex gap-2 text-[9px]">
                        <span className="text-emerald-400 font-bold">+{formatNumber(mission.reward.money)} kr</span>
                        <span className="text-blue-400 font-bold">+{mission.reward.xp} XP</span>
                    </div>

                    {mission.choices && (
                        <div className="flex gap-2">
                            {mission.choices.map((c, i) => {
                                const cost = c.effect.money || 0;
                                const canAfford = cost >= 0 || state.cleanCash >= Math.abs(cost);
                                return (
                                    <Button
                                        key={i}
                                        onClick={() => handleChoice(mission.id, c)}
                                        disabled={isPicked || !canAfford}
                                        className={`px-2 py-1 text-[8px] font-bold uppercase truncate max-w-[120px] ${isPicked ? 'opacity-30' : ''}`}
                                        size="xs"
                                        variant={isPicked ? "ghost" : "neutral"}
                                    >
                                        {c.text}
                                    </Button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SultanTab;
