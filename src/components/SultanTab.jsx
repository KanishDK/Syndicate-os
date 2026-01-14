import React from 'react';
import { CONFIG } from '../config/gameConfig';
import { formatNumber } from '../utils/gameMath';
import Button from './Button';
import { useLanguage } from '../context/LanguageContext';

const SultanTab = ({ state, handleChoice, buyHype, buyBribe }) => {
    const { t } = useLanguage();
    // Phase 1: Services (The Back Room)
    // Phase 2: Mission Dossier

    const activeStory = state.activeStory;
    const dailyMission = state.dailyMission;

    const [now, setNow] = React.useState(0);

    React.useEffect(() => {
        setNow(Date.now());
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
            <div className="border-b border-theme-border-subtle pb-4">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-theme-warning flex items-center gap-3 font-terminal">
                    <i className="fa-solid fa-crown"></i> {t('sultan.title')}
                </h2>

                {/* DYNAMIC GREETING */}
                <div className="mt-4 p-4 bg-theme-surface-elevated border-l-4 border-theme-warning rounded-r-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <i className="fa-solid fa-mosque text-6xl"></i>
                    </div>
                    <div className="relative z-10 flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-full bg-theme-warning/20 border border-theme-warning/30 flex items-center justify-center shrink-0">
                            <i className="fa-solid fa-store text-xl text-theme-warning"></i>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-theme-warning uppercase tracking-widest mb-1">{CONFIG.pols.name}</p>
                            <p className="text-xs text-theme-text-primary italic leading-relaxed">
                                "{(() => {
                                    if (state.level >= 10) return t('sultan_greetings.level_10');
                                    if (state.level >= 5) return t('sultan_greetings.level_5');
                                    if (state.level >= 2) return t('sultan_greetings.level_2');
                                    if (state.level >= 1) return t('sultan_greetings.level_1');
                                    return t('sultan_greetings.default');
                                })()}"
                            </p>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-theme-text-secondary mt-3 leading-relaxed font-terminal uppercase tracking-widest opacity-60">
                    {t('sultan.subtitle')}
                </p>
            </div>

            {/* MISSION STATISTICS */}
            <div className="bg-theme-surface-elevated border border-theme-border-subtle rounded-2xl p-4">
                <h3 className="text-xs font-black text-theme-text-muted uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-theme-border-subtle pb-2 font-terminal">
                    <i className="fa-solid fa-chart-line"></i> {t('sultan.stats_title')}
                </h3>

                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-mono font-bold text-theme-success">
                            {state.completedMissions?.length || 0}
                        </div>
                        <div className="text-[10px] text-theme-text-muted uppercase font-terminal">
                            {t('sultan.completed')}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-mono font-bold text-theme-info">
                            {CONFIG.missions.length - (state.completedMissions?.length || 0)}
                        </div>
                        <div className="text-[10px] text-theme-text-muted uppercase font-terminal">
                            {t('sultan.remaining')}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-mono font-bold text-theme-warning">
                            {Math.floor(((state.completedMissions?.length || 0) / CONFIG.missions.length) * 100)}%
                        </div>
                        <div className="text-[10px] text-theme-text-muted uppercase font-terminal">
                            {t('sultan.progress')}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* COL 1: SERVICES */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-theme-surface-elevated border border-theme-border-subtle rounded-2xl p-4 shadow-xl">
                        <h3 className="text-xs font-black text-theme-text-muted uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-theme-border-subtle pb-2 font-terminal">
                            <i className="fa-solid fa-handshake"></i> {t('sultan.services_title')}
                        </h3>

                        <p className="text-xs text-theme-text-secondary mb-4 leading-relaxed font-terminal">
                            {t('sultan.services_desc')}
                        </p>

                        <div className="space-y-3">
                            {/* BRIBE */}
                            <div className="p-3 bg-theme-surface-base rounded-xl border border-theme-border-subtle flex flex-col gap-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-xs font-bold text-theme-text-primary uppercase font-terminal">{t('sultan.bribe_title')}</div>
                                        <div className="text-[10px] text-theme-text-muted font-terminal">
                                            {t('sultan.bribe_desc')} <span className="text-theme-info">{state.heat > 0 ? formatNumber(Math.floor(state.heat * 500)) : 0} kr</span> (skalerer med heat).
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded bg-theme-info/20 text-theme-info flex items-center justify-center">
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
                                    <span>{t('sultan.reduce_heat')} (-10)</span>
                                    <span>{state.heat > 0 ? formatNumber(Math.floor(state.heat * 500)) : 0} kr</span>
                                </Button>
                            </div>

                            {/* HYPE */}
                            <div className={`p-3 rounded-xl border flex flex-col gap-2 transition-all ${isActive('hype') ? 'bg-theme-warning/10 border-theme-warning/30' : 'bg-theme-surface-base border-theme-border-subtle'}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-xs font-bold text-theme-text-primary uppercase flex items-center gap-2 font-terminal">
                                            {t('sultan.hype_title')}
                                            {isActive('hype') && <span className="text-[9px] bg-theme-warning text-theme-bg-primary px-1.5 rounded animate-pulse">{t('management.active').toUpperCase()}: {timeLeft('hype')}s</span>}
                                        </div>
                                        <div className="text-[10px] text-theme-text-muted font-terminal">
                                            {t('sultan.hype_desc')}
                                        </div>
                                    </div>
                                    <div className={`w-8 h-8 rounded flex items-center justify-center ${isActive('hype') ? 'bg-theme-warning text-theme-bg-primary animate-spin-slow' : 'bg-theme-warning/20 text-theme-warning'}`}>
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
                                    <span>{t('sultan.start_campaign')}</span>
                                    <span>25k kr</span>
                                </Button>
                            </div>

                            {/* MARKET INFLUENCE */}
                            <div className={`p-3 rounded-xl border flex flex-col gap-2 transition-all ${state.market?.trend === 'bull' ? 'bg-theme-success/10 border-theme-success/30' : 'bg-theme-surface-base border-theme-border-subtle'}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-xs font-bold text-theme-text-primary uppercase flex items-center gap-2 font-terminal">
                                            {t('sultan.market_title') || 'Markedsmagt'}
                                            {state.market?.trend === 'bull' && <span className="text-[9px] bg-theme-success text-theme-bg-primary px-1.5 rounded animate-pulse">{t('management.active').toUpperCase()}: {Math.floor(state.market.duration)}s</span>}
                                        </div>
                                        <div className="text-[10px] text-theme-text-muted font-terminal">
                                            {t('sultan.market_desc') || 'Betal Sultanen for at sprede rygter og skubbe markedet i vejret.'}
                                        </div>
                                    </div>
                                    <div className={`w-8 h-8 rounded flex items-center justify-center ${state.market?.trend === 'bull' ? 'bg-theme-success text-theme-bg-primary' : 'bg-theme-success/20 text-theme-success'}`}>
                                        <i className="fa-solid fa-chart-line"></i>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => triggerMarketTrend && triggerMarketTrend()}
                                    disabled={state.cleanCash < (CONFIG.crypto.marketInfluenceCost || 50000) || state.market?.trend === 'bull'}
                                    className="w-full py-2 text-[10px] flex justify-between px-3 font-terminal"
                                    size="sm"
                                    variant={state.market?.trend === 'bull' ? 'success' : 'neutral'}
                                >
                                    <span>{t('sultan.fix_market') || 'Fiks Markedet'}</span>
                                    <span>{formatNumber(CONFIG.crypto.marketInfluenceCost || 50000)} kr</span>
                                </Button>
                            </div>

                            {/* SULTAN INTELLIGENCE (NEW PLATINUM FEATURE) */}
                            <div className={`p-4 rounded-2xl border transition-all duration-500 overflow-hidden relative ${isActive('sultan_bribe') ? 'bg-theme-surface-elevated border-theme-primary/50 shadow-[0_0_30px_rgba(99,102,241,0.1)]' : 'bg-black/40 border-theme-border-subtle opacity-60'}`}>
                                <div className="absolute top-0 right-0 p-3 opacity-20">
                                    <i className={`fa-solid fa-eye-low-vision text-4xl ${isActive('sultan_bribe') ? 'text-theme-primary' : 'text-theme-text-muted'}`}></i>
                                </div>

                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${isActive('sultan_bribe') ? 'bg-theme-primary text-theme-bg-primary' : 'bg-theme-surface-base text-theme-text-muted'}`}>
                                        <i className="fa-solid fa-satellite-dish"></i>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-theme-text-primary uppercase tracking-tight">{t('sultan.intel_title')}</h4>
                                        <p className="text-[10px] text-theme-text-muted uppercase tracking-widest">{t('sultan.intel_desc')}</p>
                                    </div>
                                </div>

                                {isActive('sultan_bribe') ? (
                                    <div className="space-y-3">
                                        <div className="bg-black/60 rounded-xl p-4 border border-indigo-500/20 animate-in fade-in zoom-in-95 duration-500">
                                            <div className="text-[9px] font-bold text-indigo-400 uppercase mb-2 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                                                {t('sultan.next_event')}
                                            </div>
                                            <p className="text-xs text-white font-medium leading-relaxed italic">
                                                "{state.nextNewsEvent?.msg || t('sultan.waiting_signal')}"
                                            </p>
                                        </div>
                                        <div className="text-[10px] text-zinc-500 bg-indigo-500/5 p-2 rounded-lg border border-indigo-500/10 text-center">
                                            {t('sultan.connection_stable')} {timeLeft('sultan_bribe')}{t('sultan.seconds_left')}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <i className="fa-solid fa-lock text-zinc-700 text-xl mb-2"></i>
                                        <p className="text-[10px] text-zinc-600 font-bold uppercase">{t('sultan.bribe_sultan')}</p>
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
                            title={t('sultan.main_mission')}
                            handleChoice={handleChoice}
                            state={state}
                        />
                    )}

                    {dailyMission && (
                        <MissionCard
                            mission={dailyMission}
                            progress={getProgress(dailyMission)}
                            title={t('sultan.daily_mission')}
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
                                <div className="bg-theme-surface-elevated border border-theme-warning/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(251,191,36,0.1)]">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-12 h-12 bg-theme-warning/20 rounded-full flex items-center justify-center text-2xl text-theme-warning border border-theme-warning/30 shrink-0">
                                            <i className="fa-solid fa-lock"></i>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-black text-theme-warning uppercase tracking-tight mb-1">
                                                {t(`missions.${nextMission.id}.title`)}
                                            </h3>
                                            <p className="text-xs text-theme-text-muted uppercase tracking-wider">{t('sultan.next_mission')}</p>
                                        </div>
                                    </div>

                                    <div className="bg-black/40 border border-theme-warning/20 rounded-lg p-4 mb-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <i className="fa-solid fa-triangle-exclamation text-theme-warning"></i>
                                            <span className="text-sm font-bold text-theme-warning">{t('sultan.req_rank')} {nextMission.reqLevel}</span>
                                        </div>
                                        <p className="text-xs text-theme-text-secondary">
                                            {t('sultan.you_are_rank')} {state.level}: <span className="text-theme-text-primary font-bold">{t(`ranks.${state.level - 1}`) || 'Kingpin'}</span>
                                        </p>
                                        <p className="text-xs text-theme-text-muted mt-2">
                                            {t('sultan.earn_xp')}
                                        </p>
                                    </div>

                                    <div className="bg-theme-surface-base rounded-lg p-3 border border-theme-border-subtle">
                                        <p className="text-xs text-theme-text-secondary italic" dangerouslySetInnerHTML={{ __html: `"${t(`missions.${nextMission.id}.text`)}"` }} />
                                        <p className="text-[10px] text-theme-text-muted mt-2">- {nextMission.giver}</p>
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
                                <div className="h-full flex flex-col items-center justify-center bg-black/40 rounded-xl border border-theme-border-subtle p-8 text-center opacity-50 min-h-[300px]">
                                    <i className="fa-solid fa-ban text-4xl text-theme-text-muted mb-4"></i>
                                    <h3 className="text-xl font-bold text-theme-text-secondary uppercase">{t('sultan.no_contracts')}</h3>
                                    <p className="text-theme-text-secondary text-sm max-w-xs mx-auto mt-2">{t('sultan.no_contracts_desc')}</p>
                                </div>
                            );
                        }
                        return null;
                    })()}
                </div>
            </div>

            {/* ACHIEVEMENTS SECTION */}
            <div className="bg-theme-surface-elevated border border-theme-warning/20 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6 border-b border-theme-border-subtle pb-4">
                    <h3 className="text-theme-warning font-black uppercase tracking-wider flex items-center gap-2 font-terminal">
                        <i className="fa-solid fa-trophy"></i> {t('sultan.achievements')}
                    </h3>
                    <div className="text-xs text-theme-text-muted font-terminal">
                        {state.unlockedAchievements?.length || 0} / {CONFIG.achievements.length} {t('sultan.unlocked')}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {CONFIG.achievements.map(ach => {
                        const unlocked = (state.unlockedAchievements || []).includes(ach.id);
                        return (
                            <div
                                key={ach.id}
                                className={`p-4 rounded-xl border transition-all ${unlocked
                                    ? 'bg-theme-warning/10 border-theme-warning/30'
                                    : 'bg-zinc-900/30 border-theme-border-subtle opacity-50'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 ${unlocked
                                        ? 'bg-theme-warning text-theme-bg-primary'
                                        : 'bg-theme-surface-base text-theme-text-muted'
                                        }`}>
                                        <i className={`fa-solid ${ach.icon || 'fa-star'}`}></i>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-bold text-theme-text-primary font-terminal truncate">
                                            {unlocked || !ach.secret ? t(`achievements.${ach.id}.name`) : t('sultan.secret')}
                                        </div>
                                        <div className="text-[10px] text-theme-text-muted mt-1 font-terminal leading-tight">
                                            {unlocked || !ach.secret ? t(`achievements.${ach.id}.desc`) : t('achievements.locked_desc')}
                                        </div>
                                        {unlocked && ach.reward && (
                                            <div className="text-[9px] text-theme-success mt-2 font-terminal">
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
    const { t } = useLanguage();
    const isPicked = state.missionChoices?.[mission.id];

    return (
        <div className="bg-theme-surface-elevated rounded-xl border border-theme-border-subtle relative overflow-hidden flex flex-col min-h-[200px]">
            {/* Paper Effect */}
            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600"></div>

            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="text-[9px] font-mono text-theme-warning/70 uppercase mb-1">
                            {title} • {mission.isDaily ? 'FLASH_OPS' : `STORY_CONTRACT`}
                        </div>
                        <h3 className="text-xl font-black text-theme-text-primary uppercase tracking-tighter">{t(`missions.${mission.id}.title`)}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-theme-warning/30 bg-theme-warning/5 flex items-center justify-center text-theme-warning">
                        <i className={`fa-solid ${mission.isDaily ? 'fa-bolt' : 'fa-file-signature'}`}></i>
                    </div>
                </div>

                <p className="text-theme-text-secondary text-xs italic mb-4 leading-relaxed line-clamp-2" dangerouslySetInnerHTML={{ __html: `"${t(`missions.${mission.id}.text`)}"` }} />

                {/* PROGRESS */}
                <div className="bg-black/40 p-3 rounded-lg border border-theme-border-subtle mb-4">
                    <div className="flex justify-between text-[10px] font-mono mb-1">
                        <span className="text-theme-text-muted">Status:</span>
                        <span className={progress.percent >= 100 ? 'text-theme-success' : 'text-theme-warning'}>
                            {formatNumber(progress.current)} / {formatNumber(progress.target)}
                        </span>
                    </div>
                    <div className="w-full h-1.5 bg-theme-surface-base rounded-full overflow-hidden">
                        <div
                            className="h-full bg-theme-warning bg-gradient-to-r from-amber-600 to-yellow-500 transition-all duration-1000"
                            style={{ width: `${progress.percent}%` }}
                        ></div>
                    </div>
                </div>

                {/* REWARDS & CHOICES */}
                <div className="flex justify-between items-center gap-4">
                    <div className="flex gap-2 text-[9px]">
                        <span className="text-theme-success font-bold">+{formatNumber(mission.reward.money)} kr</span>
                        <span className="text-theme-info font-bold">+{mission.reward.xp} XP</span>
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
                                        {t(`missions.${mission.id}.choices.${i}.text`)}
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
