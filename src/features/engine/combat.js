import { getPerkValue, getMasteryEffect, formatNumber } from '../../utils/gameMath.js';
import { CONFIG } from '../../config/gameConfig.js';

export const calculateCombatResult = (state) => {
    const C = CONFIG.boss.combat;

    // 1. Calculate Player Damage
    const baseDmg = state.boss.damagePerClick || CONFIG.boss.damagePerClick;
    const perkDmg = getPerkValue(state, 'boss_dmg'); // e.g., +10

    // Defense Synergy: Your army helps you!
    const defenseBonus = Math.floor(
        ((state.defense.guards * CONFIG.defense.guards.defenseVal) +
            (state.defense.cameras * CONFIG.defense.cameras.defenseVal) +
            (state.defense.bunker * CONFIG.defense.bunker.defenseVal)) * C.defenseSynergy
    );

    // Critical Hit RNG
    const isCrit = Math.random() < C.critChance;
    const critMult = isCrit ? C.critMult : 1.0;

    // CORRECT FORMULA: (Base + Perk) * Crit + Defense - Boss Defense
    const bossDef = Math.floor(state.level * C.bossDefScale);
    const totalDmg = Math.max(1, Math.floor(((baseDmg + perkDmg) * critMult) + defenseBonus) - bossDef);

    const newBossHp = state.boss.hp - totalDmg;

    // 2. Boss Attacks Player (Time-based Counter Attack)
    const now = Date.now();
    const timeSinceLastAttack = now - (state.boss.lastAttackTime || now);
    const BOSS_ATTACK_INTERVAL = state.boss.enraged ? C.enragedInterval : C.attackInterval;

    let newPlayerHp = state.boss.playerHp;
    let bossAttacked = false;
    let sound = isCrit ? 'punch' : 'click'; // Default sound

    if (timeSinceLastAttack >= BOSS_ATTACK_INTERVAL) {
        const bossAttackDmg = state.boss.enraged
            ? Math.floor(state.boss.attackDamage * 1.5)
            : state.boss.attackDamage;

        newPlayerHp = Math.max(0, state.boss.playerHp - bossAttackDmg);
        bossAttacked = true;
        sound = 'error'; // Getting hit overrides click sound (visual feedback handles the rest)
    }

    // 3. Check Enrage
    const hpPercent = newBossHp / state.boss.maxHp;
    const shouldEnrage = hpPercent < C.enrageThreshold && !state.boss.enraged;

    // --- OUTCOME ANALYSIS ---

    // A. Player Defeated
    if (newPlayerHp <= 0) {
        const cashLoss = Math.floor(state.dirtyCash * C.cashLossRatio);
        return {
            newState: {
                ...state,
                boss: {
                    ...state.boss,
                    active: false,
                    playerHp: state.boss.playerMaxHp
                },
                heat: state.heat + 15,
                dirtyCash: state.dirtyCash - cashLoss,
                logs: [
                    { msg: `💀 BOSS BESEJREDE DIG! Mistede ${formatNumber(cashLoss)} kr og fik +15 Heat.`, type: 'error', time: new Date().toLocaleTimeString() },
                    ...state.logs
                ].slice(0, 50),
                pendingEvent: {
                    type: 'story',
                    data: {
                        title: 'NEDERLAG',
                        msg: `Bossen var for stærk. Du flygtede med skader og mistede ${formatNumber(cashLoss)} kr.`,
                        type: 'error'
                    }
                }
            },
            ui: { damage: totalDmg, isCrit },
            sound: 'error'
        };
    }

    // B. Boss Defeated
    if (newBossHp <= 0) {
        // Speed Bonus
        const timeElapsed = now - state.boss.startTime;
        const speedBonus = timeElapsed < C.speedBonusTime ? C.speedBonusMult : 1.0;

        // Check for First Kill (Boss Key)
        const isFirstKill = (state.boss.lastDefeatedLevel || 0) < state.level;

        const masteryXP = 1 + getMasteryEffect(state, 'xp_boost');
        const rewardMoney = Math.floor(CONFIG.boss.reward.money * (1 + (state.level * 0.5)) * speedBonus);
        const rewardXP = Math.floor(CONFIG.boss.reward.xp * (1 + (state.level * 0.2)) * speedBonus * masteryXP);
        let logMsg = `⚔️ BOSS BESEJRET! Drop: ${formatNumber(rewardMoney)} kr & ${formatNumber(rewardXP)} XP`;

        if (speedBonus > 1) {
            logMsg += ` (⚡ Speed Bonus: +50%)`;
        }

        let newUnlocks = [...(state.unlockedAchievements || [])];

        // Grant Boss Key if first kill for this level tier
        if (isFirstKill) {
            logMsg += " & [RELIC] BOSS KEY (Tier 2 Unlocked)";
            newUnlocks.push('boss_key_tier2');
        }

        return {
            newState: {
                ...state,
                boss: {
                    ...state.boss,
                    active: false,
                    hp: 0,
                    lastDefeatedLevel: state.level,
                    playerHp: state.boss.playerMaxHp
                },
                completedMissions: [...state.completedMissions, 'boss_defeated'],
                unlockedAchievements: newUnlocks,
                xp: state.xp + rewardXP,
                dirtyCash: state.dirtyCash + rewardMoney,
                logs: [{ msg: logMsg, type: 'success', time: new Date().toLocaleTimeString() }, ...state.logs],
                pendingEvent: {
                    type: 'story',
                    data: {
                        title: 'BYENS NYE KONGE',
                        msg: `Du har knust Bossen! Dit ry vokser eksplosivt.\n\n"Ingen kan stoppe mig nu!"`,
                        type: 'success'
                    }
                }
            },
            ui: { damage: totalDmg, isCrit },
            sound: 'success'
        };
    }

    // C. Battle Continues
    let newLogs = state.logs;
    if (shouldEnrage) {
        newLogs = [
            { msg: '🔥 BOSS ER RASENDE! Angreb øget!', type: 'warning', time: new Date().toLocaleTimeString() },
            ...state.logs
        ].slice(0, 50);
    }

    return {
        newState: {
            ...state,
            boss: {
                ...state.boss,
                hp: newBossHp,
                playerHp: newPlayerHp,
                enraged: shouldEnrage || state.boss.enraged,
                lastAttackTime: bossAttacked ? now : state.boss.lastAttackTime
            },
            logs: newLogs
        },
        ui: { damage: totalDmg, isCrit },
        sound: sound
    };
};
