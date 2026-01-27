import { CONFIG } from '../../config/gameConfig.js';
import { processEconomy } from './economy.js';
import { processProduction } from './production.js';
import { processEvents } from './events.js';
import { processMissions } from './missions.js';
import { getDefaultState } from '../../utils/initialState.js';
import { fixFloat } from '../../utils/gameMath.js';
// import { playSound } from '../../utils/audio';

export const runGameTick = (prevState, dt, t) => {
    // MATH STABILITY: Sanitize inputs
    dt = Number.isFinite(dt) ? Math.max(0, dt) : 1;

    // 1. Create Draft (Shallow Copy + Nested Objects)
    let s = {
        ...prevState,
        inv: { ...prevState.inv },
        staff: { ...prevState.staff },
        autoSell: { ...prevState.autoSell },
        isProcessing: { ...prevState.isProcessing },
        stats: { ...prevState.stats, produced: { ...prevState.stats.produced }, history: { ...prevState.stats?.history } },
        crypto: { ...prevState.crypto, prices: { ...prevState.crypto.prices }, history: { ...prevState.crypto.history }, wallet: { ...prevState.crypto.wallet } },
        boss: { ...prevState.boss },
        rival: { ...prevState.rival },
        prestige: { ...prevState.prestige, perks: { ...prevState.prestige?.perks } },
        lifetime: { ...prevState.lifetime, produced: { ...prevState.lifetime.produced } },
        upgrades: { ...prevState.upgrades },
        defense: { ...prevState.defense },
        territoryLevels: { ...prevState.territoryLevels },
        bank: { ...prevState.bank },
        lastTick: { ...prevState.lastTick },
        missionChoices: { ...prevState.missionChoices },
        activeBuffs: { ...prevState.activeBuffs },
        market: { ...prevState.market },
        completedMissions: [...prevState.completedMissions],
        unlockedAchievements: [...prevState.unlockedAchievements],
        logs: prevState.logs
    };

    // MATH STABILITY: Sanitize critical state variables
    s.cleanCash = Number.isFinite(s.cleanCash) ? fixFloat(s.cleanCash) : 0;
    s.dirtyCash = Number.isFinite(s.dirtyCash) ? fixFloat(s.dirtyCash) : 0;
    s.heat = Number.isFinite(s.heat) ? fixFloat(Math.max(0, Math.min(CONFIG.gameMechanics.maxHeat, s.heat))) : 0;
    s.level = Number.isFinite(s.level) && s.level > 0 ? Math.floor(s.level) : 1;
    s.xp = Number.isFinite(s.xp) ? Math.max(0, s.xp) : 0;

    // 2. Run Systems
    s = processEconomy(s, dt, t);
    s = processProduction(s, dt);
    s = processMissions(s);
    s = processEvents(s, dt, t);

    // BOSS REGEN (Phase 4 Audit Fix)
    if (s.boss && s.boss.active && s.boss.hp < s.boss.maxHp) {
        const regenAmount = CONFIG.boss.regenRate * dt;
        s.boss.hp = Math.min(s.boss.maxHp, s.boss.hp + regenAmount);
    }

    // --- FEATURE C: THE DEBT (TIME ATTACK) ---
    if (s.mode === 'debt') {
        const debtConfig = CONFIG.modes.debt;
        const now = Date.now();
        const timeLimit = debtConfig.timeLimit;
        const endTime = s.debtStartTime + timeLimit;

        // 1. GAME OVER CHECK
        if (now > endTime && s.debt > 0) {
            // GAME OVER - PERMADEATH
            return {
                ...getDefaultState(),
                logs: [{ msg: t('modes.debt.game_over'), type: 'error', time: new Date().toLocaleTimeString() }]
            };
        }

        // 2. COMPOUND INTEREST
        // Initialize lastInterest if missing (using start time)
        if (!s.lastInterestApplied) s.lastInterestApplied = s.debtStartTime;

        if (now > s.lastInterestApplied + debtConfig.interestInterval) {
            const interest = Math.floor(s.debt * debtConfig.interestRate);
            s.debt += interest;
            s.lastInterestApplied = now;

            // Notification
            s.logs = [{
                msg: t('modes.debt.interest_alert', { amount: interest.toLocaleString() }), // Requires "interest_alert": "Interest: Debt increased by {amount} kr! (10%)"
                type: 'warning',
                time: new Date().toLocaleTimeString()
            }, ...s.logs];
        }
    }

    // DYNAMIC MARKET (Phase 1)
    const now = Date.now();
    const cyclePos = (now % CONFIG.market.cycleDuration) / CONFIG.market.cycleDuration;
    const angle = cyclePos * Math.PI * 2;
    const volatility = CONFIG.market.volatility;
    const marketFactor = 1 + Math.sin(angle) * volatility;

    // Store in state (Initialize if missing)
    if (!s.market) s.market = {};
    const oldTrend = s.market.trend || 'stable';
    s.market.factor = fixFloat(marketFactor);

    // Determine Trend
    let newTrend = 'stable';
    if (marketFactor > 1.10) newTrend = 'bull';
    else if (marketFactor < 0.90) newTrend = 'bear';
    s.market.trend = newTrend;

    // Trigger News Alerts on Trend Change
    if (oldTrend !== newTrend) {
        if (newTrend === 'bull') {
            s.logs = [{ msg: t('news.market.bull'), type: 'success', time: new Date().toLocaleTimeString() }, ...s.logs];
        } else if (newTrend === 'bear') {
            s.logs = [{ msg: t('news.market.bear'), type: 'rival', time: new Date().toLocaleTimeString() }, ...s.logs];
        }
    }

    // CRITICAL: Hardcore Wipe Check
    if (s.pendingEvent?.data?.hardcoreWipe) {
        return {
            ...getDefaultState(),
            settings: s.settings,
            pendingEvent: s.pendingEvent, // Keep the game over modal visible
            hardcore: true // Keep mode active
        };
    }

    // 3. Post-System Processing (Computed & Levelling)
    // MATH STABILITY: Final sanitization
    s.cleanCash = Number.isFinite(s.cleanCash) ? fixFloat(s.cleanCash) : 0;
    s.dirtyCash = Number.isFinite(s.dirtyCash) ? fixFloat(s.dirtyCash) : 0;
    s.heat = Number.isFinite(s.heat) ? fixFloat(s.heat) : 0;
    s.xp = Number.isFinite(s.xp) ? s.xp : 0;

    // Safety Cap preventing Infinity & UI Breakage (Beta Feedback Fix)
    const MAX_CASH = CONFIG.gameMechanics.maxCash;
    s.cleanCash = Math.max(0, Math.min(MAX_CASH, s.cleanCash));
    s.dirtyCash = Math.max(-MAX_CASH, Math.min(MAX_CASH, s.dirtyCash)); // Can be negative

    // Heat Cap (0-100 for display, 0-500 internal)
    s.heat = Math.max(0, Math.min(CONFIG.gameMechanics.maxHeat, s.heat));

    s.nextLevelXp = Math.floor(CONFIG.leveling.baseXp * Math.pow(CONFIG.leveling.expFactor, s.level));

    // Auto Level Up Logic
    if (s.xp >= s.nextLevelXp) {
        s.level += 1;
        s.nextLevelXp = Math.floor(CONFIG.leveling.baseXp * Math.pow(CONFIG.leveling.expFactor, s.level));
        s.logs = [{
            msg: `${t('active_feed.level_up')} ${s.level}: ${t(`ranks.${s.level - 1}`) || 'Kingpin'}`,
            type: 'success',
            time: new Date().toLocaleTimeString()
        }, ...s.logs].slice(0, 50);
    }

    return s;
};
