import React from 'react';
import { CONFIG } from '../config/gameConfig';
import { formatNumber, formatCurrency, formatTime, formatPercent } from '../utils/gameMath';
import { useLanguage } from '../context/LanguageContext';
import GlassCard from './ui/GlassCard';
import ActionButton from './ui/ActionButton';
import ResourceBar from './ui/ResourceBar';
import sultanImg from '../assets/characters/Sultanen.png'; // Static Import

const SultanTab = ({ state, handleChoice, buyHype, buyBribe, buyIntel, triggerMarketTrend }) => {
    const { t } = useLanguage();

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

    // Mission Display Component
    const MissionDisplay = ({ mission, progress, title, isDaily = false }) => {
        if (!mission) return null;

        // Helper to resolve translation keys for daily missions
        const getMissionTitle = () => {
            if (mission.titleKey) {
                // Daily mission with translation key
                return t(mission.titleKey, mission.titleData || {});
            }
            return mission.title; // Story mission with direct title
        };

        const getMissionText = () => {
            if (mission.textKey) {
                // Daily mission with translation key
                return t(mission.textKey, mission.textData || {});
            }
            return mission.text; // Story mission with direct text
        };

        return (
            <GlassCard variant="interactive" className="p-6 flex flex-col gap-4">
                {/* Header with Title Label */}
                <div className="flex items-center justify-between border-b border-theme-border-subtle pb-3">
                    <h4 className="text-xs font-black text-theme-warning uppercase tracking-widest flex items-center gap-2">
                        <i className="fa-solid fa-scroll"></i>
                        {title}
                    </h4>
                    {isDaily && <span className="text-[9px] text-theme-info uppercase font-bold bg-theme-info/10 px-2 py-1 rounded border border-theme-info/20">DAILY</span>}
                </div>

                {/* Mission Content */}
                <div>
                    <h3 className="text-xl font-black text-theme-text-primary uppercase tracking-tighter">{getMissionTitle()}</h3>
                    <p className="text-sm text-theme-text-secondary mt-1 leading-relaxed">{getMissionText()}</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-theme-text-primary">{formatNumber(progress.current)} / {formatNumber(progress.target)}</span>
                        <span className="text-theme-text-muted">{progress.percent}%</span>
                    </div>
                    <ResourceBar current={progress.current} max={progress.target} color="warning" />
                </div>

                {/* Mission Actions */}
                <div className="flex gap-2">
                    {mission.choices && mission.choices.map((choice, index) => (
                        <ActionButton
                            key={index}
                            onClick={() => handleChoice(mission.id, choice.id)}
                            disabled={!choice.canAfford(state)}
                            variant={choice.variant || 'primary'}
                            className="w-full"
                        >
                            {t(choice.textKey || choice.text)}
                        </ActionButton>
                    ))}
                    {mission.isDaily && progress.current >= progress.target && (
                        <ActionButton
                            onClick={() => handleChoice(mission.id, 'complete')}
                            variant="success"
                            className="w-full"
                        >
                            {t('sultan.complete_mission')}
                        </ActionButton>
                    )}
                </div>
            </GlassCard>
        );
    };


    return (
        <div className="max-w-6xl mx-auto h-full flex flex-col relative">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-1 pb-32 flex flex-col gap-6">

                {/* HERO SECTION (SULTAN) */}
                <div className="relative rounded-2xl overflow-hidden min-h-[350px] flex items-center p-6 md:p-12 border border-theme-border-subtle group isolate">

                    {/* 1. Background Image (Absolute Right/Cover) */}
                    <div className="absolute inset-y-0 right-0 w-full md:w-3/5 z-0">
                        <img
                            src={sultanImg}
                            alt="Sultanen"
                            className="w-full h-full object-cover object-top md:object-center opacity-40 md:opacity-100"
                        />
                        {/* Gradient Overlay for Text Readability */}
                        <div className="absolute inset-0 bg-gradient-to-r from-theme-surface-base via-theme-surface-base/90 to-transparent md:via-theme-surface-base/40"></div>
                    </div>

                    {/* 2. Decorative Elements */}
                    <div className="absolute right-0 top-0 w-2/3 h-full bg-theme-warning/5 transform skew-x-12 translate-x-12 z-0 pointer-events-none mix-blend-overlay"></div>

                    {/* 3. Content (Relative Z-30) */}
                    <div className="relative z-30 max-w-xl">
                        <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-4 drop-shadow-lg">
                            {CONFIG.pols.name}
                        </h1>

                        {/* Speech Bubble */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-r-2xl rounded-bl-2xl max-w-lg shadow-xl relative mt-2">
                            <div className="absolute -top-3 left-0 w-0 h-0 border-l-[12px] border-l-transparent border-b-[12px] border-b-white/10 border-r-[12px] border-r-transparent transform -rotate-12"></div>
                            <p className="text-lg text-theme-warning font-terminal leading-relaxed italic">
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

                    {/* Character Image (SULTANEN) */}
                    <div className="absolute right-[-50px] md:right-0 bottom-0 h-[110%] w-auto z-20 pointer-events-none filter drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-transform duration-700 group-hover:scale-105 origin-bottom">
                        <img
                            src={sultanImg}
                            alt="The Sultan"
                            className="h-full w-auto object-contain mask-image-b-fade"
                        />
                    </div>
                </div>

                {/* MISSION STATISTICS */}
                <GlassCard className="p-4 flex justify-between gap-4">
                    <div className="text-center w-1/3 border-r border-theme-border-subtle">
                        <div className="text-2xl font-mono font-bold text-theme-success">
                            {state.completedMissions?.length || 0}
                        </div>
                        <div className="text-[10px] text-theme-text-muted uppercase font-bold tracking-widest">
                            {t('sultan.completed')}
                        </div>
                    </div>
                    <div className="text-center w-1/3 border-r border-theme-border-subtle">
                        <div className="text-2xl font-mono font-bold text-theme-info">
                            {CONFIG.missions.length - (state.completedMissions?.length || 0)}
                        </div>
                        <div className="text-[10px] text-theme-text-muted uppercase font-bold tracking-widest">
                            {t('sultan.remaining')}
                        </div>
                    </div>
                    <div className="text-center w-1/3">
                        <div className="text-2xl font-mono font-bold text-theme-warning">
                            {Math.floor(((state.completedMissions?.length || 0) / CONFIG.missions.length) * 100)}%
                        </div>
                        <div className="text-[10px] text-theme-text-muted uppercase font-bold tracking-widest">
                            {t('sultan.progress')}
                        </div>
                    </div>
                </GlassCard>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* COL 1: SERVICES */}
                    <div className="lg:col-span-1 space-y-4">
                        <GlassCard className="p-4 h-full">
                            <h3 className="text-xs font-black text-theme-text-muted uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-theme-border-subtle pb-2">
                                <i className="fa-solid fa-handshake"></i> {t('sultan.services_title')}
                            </h3>

                            <div className="space-y-4">
                                {/* BRIBE */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-theme-text-primary uppercase">{t('sultan.bribe_title')}</span>
                                        <span className="text-[10px] text-theme-info">{state.heat > 0 ? formatCurrency(Math.floor(state.heat * CONFIG.police.sultanBribeFactor)) : 0}</span>
                                    </div>
                                    <ActionButton
                                        onClick={buyBribe}
                                        disabled={state.cleanCash < Math.floor(state.heat * CONFIG.police.sultanBribeFactor) || state.heat < 5}
                                        size="sm"
                                        variant="neutral"
                                        className="w-full justify-between"
                                        icon="fa-solid fa-scale-unbalanced"
                                    >
                                        <span>{t('sultan.reduce_heat')} (-10)</span>
                                    </ActionButton>
                                </div>

                                <hr className="border-t border-theme-border-subtle/50" />

                                {/* HYPE */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-theme-text-primary uppercase">{t('sultan.hype_title')}</span>
                                        {isActive('hype') && <span className="text-[9px] text-theme-warning animate-pulse">{t('management.active')}: {formatTime(timeLeft('hype'), 's')}</span>}
                                    </div>
                                    <ActionButton
                                        onClick={buyHype}
                                        disabled={state.cleanCash < CONFIG.marketing.hypeCost || isActive('hype')}
                                        size="sm"
                                        variant={isActive('hype') ? 'primary' : 'neutral'}
                                        className="w-full justify-between"
                                        icon="fa-solid fa-bullhorn"
                                    >
                                        <span>{t('sultan.start_campaign')}</span>
                                        <span>{formatNumber(CONFIG.marketing.hypeCost)}</span>
                                    </ActionButton>
                                </div>

                                <hr className="border-t border-theme-border-subtle/50" />

                                {/* MARKET INFLUENCE */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-theme-text-primary uppercase">{t('sultan.market_title') || 'Markedsmagt'}</span>
                                        {state.market?.trend === 'bull' && <span className="text-[9px] text-theme-success animate-pulse">{t('management.active')}: {formatTime(Math.floor(state.market.duration), 's')}</span>}
                                    </div>
                                    <ActionButton
                                        onClick={() => triggerMarketTrend && triggerMarketTrend()} // Assumption: this prop exists or function is available
                                        disabled={state.cleanCash < (CONFIG.crypto.marketInfluenceCost || 50000) || state.market?.trend === 'bull'}
                                        size="sm"
                                        variant={state.market?.trend === 'bull' ? 'success' : 'neutral'}
                                        className="w-full justify-between"
                                        icon="fa-solid fa-chart-line"
                                    >
                                        <span>{t('sultan.fix_market') || 'Fiks Markedet'}</span>
                                        <span>{formatCurrency(CONFIG.crypto.marketInfluenceCost || 50000)}</span>
                                    </ActionButton>
                                </div>

                                {/* SULTAN INTELLIGENCE */}
                                <GlassCard
                                    variant={isActive('sultan_bribe') ? 'interactive' : 'base'}
                                    className={`mt-4 p-4 transition-all ${isActive('sultan_bribe') ? 'bg-theme-primary/5 border-theme-primary/30' : 'opacity-80'}`}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`w-8 h-8 rounded flex items-center justify-center text-sm ${isActive('sultan_bribe') ? 'bg-theme-primary text-black' : 'bg-theme-surface-elevated text-theme-text-muted'}`}>
                                            <i className="fa-solid fa-satellite-dish"></i>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-black text-theme-text-primary uppercase tracking-tight">{t('sultan.intel_title')}</h4>
                                            <p className="text-[10px] text-theme-text-muted uppercase tracking-widest">{t('sultan.intel_desc')}</p>
                                        </div>
                                    </div>

                                    {isActive('sultan_bribe') ? (
                                        <div className="space-y-2">
                                            <div className="bg-black/40 rounded p-2 border border-theme-primary/20">
                                                <div className="text-[9px] font-bold text-theme-primary uppercase mb-1 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-theme-primary animate-pulse"></span>
                                                    {t('sultan.next_event')}
                                                </div>
                                                <p className="text-xs text-theme-text-primary italic">
                                                    "{state.nextNewsEvent?.msg || t('sultan.waiting_signal')}"
                                                </p>
                                            </div>
                                            <div className="text-[9px] text-theme-text-muted text-center">
                                                {timeLeft('sultan_bribe')}s {t('sultan.seconds_left')}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between items-center text-[10px] text-theme-text-muted">
                                                <span>{t('sultan.bribe_sultan')}</span>
                                                <span>15.000 kr</span>
                                            </div>
                                            <ActionButton
                                                onClick={buyIntel}
                                                disabled={state.cleanCash < 15000}
                                                size="xs"
                                                variant="neutral"
                                                className="w-full"
                                                icon="fa-regular fa-eye"
                                            >
                                                {t('sultan.unlock_intel')}
                                            </ActionButton>
                                        </div>
                                    )}
                                </GlassCard>
                            </div>
                        </GlassCard>
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
                            const nextMission = CONFIG.missions.find(m => !state.completedMissions.includes(m.id));
                            if (nextMission && nextMission.reqLevel && state.level < nextMission.reqLevel) {
                                return (
                                    <GlassCard variant="danger" className="p-6">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-12 h-12 bg-theme-danger/20 rounded-full flex items-center justify-center text-2xl text-theme-danger border border-theme-danger/30 shrink-0">
                                                <i className="fa-solid fa-lock"></i>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-theme-danger uppercase tracking-tight mb-1">
                                                    {nextMission.title}
                                                </h3>
                                                <p className="text-xs text-theme-text-muted uppercase tracking-wider">{t('sultan.next_mission')}</p>
                                            </div>
                                        </div>

                                        <div className="bg-black/40 border border-theme-danger/20 rounded-lg p-4 mb-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <i className="fa-solid fa-triangle-exclamation text-theme-danger"></i>
                                                <span className="text-sm font-bold text-theme-danger">{t('sultan.req_rank')} {nextMission.reqLevel}</span>
                                            </div>
                                            <p className="text-xs text-theme-text-secondary">
                                                {t('sultan.you_are_rank')} {state.level}: <span className="text-theme-text-primary font-bold">{t(`ranks.${state.level - 1}`) || 'Kingpin'}</span>
                                            </p>
                                        </div>
                                    </GlassCard>
                                );
                            }
                            return (
                                <div className="h-full flex flex-col items-center justify-center bg-transparent rounded-xl border border-dashed border-theme-border-subtle p-8 text-center opacity-50 min-h-[200px]">
                                    <i className="fa-solid fa-ban text-4xl text-theme-text-muted mb-4"></i>
                                    <h3 className="text-xl font-bold text-theme-text-secondary uppercase">{t('sultan.no_contracts')}</h3>
                                    <p className="text-theme-text-secondary text-sm max-w-xs mx-auto mt-2">{t('sultan.no_contracts_desc')}</p>
                                </div>
                            );
                        })()}
                    </div>
                </div>

                {/* ACHIEVEMENTS SECTION */}
                <GlassCard className="p-6">
                    <div className="flex justify-between items-center mb-6 border-b border-theme-border-subtle pb-4">
                        <h3 className="text-theme-warning font-black uppercase tracking-wider flex items-center gap-2 font-terminal">
                            <i className="fa-solid fa-trophy"></i> {t('sultan.achievements')}
                        </h3>
                        <div className="text-xs text-theme-text-muted font-bold">
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
                                        : 'bg-theme-surface-base border-theme-border-subtle opacity-50'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 ${unlocked
                                            ? 'bg-theme-warning text-black'
                                            : 'bg-theme-surface-elevated text-theme-text-muted'
                                            }`}>
                                            <i className={`fa-solid ${ach.icon || 'fa-star'}`}></i>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-bold text-theme-text-primary font-terminal">
                                                {unlocked || !ach.secret ? t(`achievements.${ach.id}.name`) : t('sultan.secret')}
                                            </div>
                                            <div className="text-[10px] text-theme-text-muted mt-1 leading-tight whitespace-normal break-words">
                                                {unlocked || !ach.secret ? t(`achievements.${ach.id}.desc`) : t('achievements.locked_desc')}
                                            </div>
                                            {unlocked && ach.reward && (
                                                <div className="text-[9px] text-theme-success mt-2 font-mono">
                                                    +{ach.reward} Diamonds
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

const MissionCard = ({ mission, progress, title, handleChoice, state }) => {
    const { t } = useLanguage();
    const isPicked = state.missionChoices?.[mission.id];

    // Helper to recursively translate data params
    const resolveData = (data) => {
        if (!data) return {};
        const newData = { ...data };
        Object.keys(newData).forEach(key => {
            const val = newData[key];
            if (typeof val === 'string' && (val.startsWith('items.') || val.startsWith('staff.') || val.startsWith('upgrades.'))) {
                newData[key] = t(val);
            }
        });
        return newData;
    };

    // Helper to get translated mission content
    const getMissionTitle = () => {
        if (mission.titleKey) return t(mission.titleKey, resolveData(mission.titleData));

        // Fallback for daily contracts without titleKey (Legacy/Save compatibility)
        if (mission.id.startsWith('contract_') && mission.req) {
            const data = { item: mission.req.item ? t(`items.${mission.req.item}.name`) : '' };
            return t(`sultan.daily_contracts.${mission.req.type}.title`, data);
        }

        return t(`missions.${mission.id}.title`) || mission.title;
    };

    const getMissionText = () => {
        if (mission.textKey) return t(mission.textKey, resolveData(mission.textData));

        // Fallback for daily contracts without textKey
        if (mission.id.startsWith('contract_') && mission.req) {
            const data = {
                amount: formatNumber(mission.req.amount),
                item: mission.req.item ? t(`items.${mission.req.item}.name`) : ''
            };
            return t(`sultan.daily_contracts.${mission.req.type}.text`, data);
        }

        return t(`missions.${mission.id}.text`) || mission.text;
    };

    return (
        <GlassCard className="p-0 overflow-hidden flex flex-col min-h-[200px]">
            {/* Paper Effect / Header Highlight */}
            <div className={`h-1 w-full bg-gradient-to-r ${mission.isDaily ? 'from-cyan-600 via-cyan-400 to-cyan-600' : 'from-amber-600 via-yellow-400 to-amber-600'}`}></div>

            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="text-[9px] font-mono text-theme-text-muted uppercase mb-1 tracking-widest">
                            {title}
                        </div>
                        <h3 className="text-xl font-black text-theme-text-primary uppercase tracking-tighter leading-tight">{getMissionTitle()}</h3>
                        <p className="text-xs text-theme-text-secondary leading-relaxed mt-2" dangerouslySetInnerHTML={{ __html: getMissionText() }} />
                    </div>
                    <div className={`w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center ${mission.isDaily ? 'text-theme-info' : 'text-theme-warning'} shrink-0 ml-4`}>
                        <i className={`fa-solid ${mission.isDaily ? 'fa-bolt' : 'fa-file-signature'}`}></i>
                    </div>
                </div>

                {/* PROGRESS */}
                <div className="bg-black/20 p-4 rounded-xl border border-white/5 mb-6">
                    <ResourceBar
                        current={progress.current}
                        max={progress.target}
                        color={progress.percent >= 100 ? 'bg-theme-success' : (mission.isDaily ? 'bg-theme-info' : 'bg-theme-warning')}
                        label={t('sultan.status')}
                        subLabel={`${formatNumber(progress.current)} / ${formatNumber(progress.target)}`}
                    />
                </div>

                {/* REWARDS & CHOICES */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-auto">
                    <div className="flex gap-3 text-xs bg-black/20 px-3 py-2 rounded-lg border border-white/5">
                        <span className="text-theme-success font-bold font-mono">+{formatNumber(mission.reward.money)} kr</span>
                        <span className="text-theme-info font-bold font-mono">+{mission.reward.xp} XP</span>
                    </div>

                    {mission.choices && (
                        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                            {mission.choices.map((c, i) => {
                                const cost = c.effect.money || 0;
                                const canAfford = cost >= 0 || state.cleanCash >= Math.abs(cost);
                                return (
                                    <ActionButton
                                        key={i}
                                        onClick={() => handleChoice(mission.id, c)}
                                        disabled={isPicked || !canAfford}
                                        size="sm"
                                        variant={isPicked ? "ghost" : "neutral"}
                                        className={`whitespace-nowrap ${isPicked ? 'opacity-50' : ''}`}
                                    >
                                        {t(`missions.${mission.id}.choices.${i}.text`) || c.text}
                                    </ActionButton>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </GlassCard>
    );
};

export default SultanTab;
