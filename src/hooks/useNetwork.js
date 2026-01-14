import { useState, useEffect, useCallback } from 'react';
import { CONFIG } from '../config/gameConfig';
import { getBulkCost, formatNumber } from '../utils/gameMath';
import { useLanguage } from '../context/LanguageContext';

export const useNetwork = (state, setState, addLog, addFloat) => {
    const { t } = useLanguage();
    const [activeShakedown, setActiveShakedown] = useState(null);
    const [now, setNow] = useState(0);

    // Game Loop for Network Tab (Shakedowns, Respect)
    useEffect(() => {
        const interval = setInterval(() => {
            const currentNow = Date.now();
            setNow(currentNow);

            // FEATURE 4: Random Street Events ("Shakedown")
            // 5% chance every second to trigger if no event active AND has territories
            if (!activeShakedown && state.territories.length > 0 && Math.random() < 0.05) {
                const randomTerritory = state.territories[Math.floor(Math.random() * state.territories.length)];
                setActiveShakedown({ id: randomTerritory, expires: currentNow + 10000 }); // 10s window
            }

            // Auto-expire shakedown
            if (activeShakedown && currentNow > activeShakedown.expires) {
                setActiveShakedown(null);
            }

            // FEATURE 5: Respect Ticker (Phase 3)
            // Logic: Gain respect based on total territory levels
            if (state.territories.length > 0) {
                setState(prev => {
                    const totalLevels = Object.values(prev.territoryLevels || {}).reduce((a, b) => a + b, 0);
                    // Base gain + small % of levels. Scaled to fill bar in ~2-5 mins depending on empire size
                    const respectGain = 0.5 + (totalLevels * 0.05);

                    let newRespect = (prev.respect || 0) + respectGain;
                    let newTokens = prev.kingpinTokens || 0;

                    if (newRespect >= 100) {
                        newRespect = 0;
                        newTokens += 1;
                    }

                    return {
                        ...prev,
                        respect: newRespect,
                        kingpinTokens: newTokens
                    };
                });
            }

        }, 1000);
        return () => clearInterval(interval);
    }, [activeShakedown, state.territories, setState]); // eslint-disable-line react-hooks/exhaustive-deps

    // ACTIONS

    const conquer = useCallback((territory) => {
        if (state.dirtyCash < territory.baseCost) return;
        if (state.territories.includes(territory.id)) return;

        setState(prev => ({
            ...prev,
            dirtyCash: prev.dirtyCash - territory.baseCost,
            territories: [...prev.territories, territory.id],
            territoryLevels: { ...prev.territoryLevels, [territory.id]: 1 },
            xp: prev.xp + 250
        }));
        addLog(t('network_interactive.logs.conquer', { area: territory.name }), 'success');
    }, [state.dirtyCash, state.territories, setState, addLog, t]);

    const upgradeTerritory = useCallback((territory, amount) => {
        const currentLevel = state.territoryLevels?.[territory.id] || 1;
        const totalCost = getBulkCost(territory.baseCost, 1.8, currentLevel, amount);

        if (state.dirtyCash < totalCost) return;

        setState(prev => ({
            ...prev,
            dirtyCash: prev.dirtyCash - totalCost,
            territoryLevels: { ...prev.territoryLevels, [territory.id]: currentLevel + amount }
        }));
        // Note: Using generic success/upgrade message logic if key missing, or maintain simple non-localized log if preferred, but existing code used addLog with t().
        // Since original code had a comment about missing key, we'll try to use a generic one or constructing one.
        // Original: addLog(t('network_interactive.logs.upgrade', ...), 'success');
        // We'll stick to the pattern.
        addLog(`Opgraderet ${territory.name} x${amount}`, 'success');
    }, [state.territoryLevels, state.dirtyCash, setState, addLog]);

    const defendTerritory = useCallback((territoryId) => {
        const attack = state.territoryAttacks?.[territoryId];
        if (!attack) return;

        const defenseVal = (state.defense.guards || 0) * CONFIG.defense.guards.defenseVal;
        const canDefendWithGuards = defenseVal >= attack.strength;
        const mercCost = 10000;

        if (canDefendWithGuards) {
            // Success
            setState(prev => {
                const newAttacks = { ...prev.territoryAttacks };
                delete newAttacks[territoryId];
                return {
                    ...prev,
                    territoryAttacks: newAttacks,
                    xp: prev.xp + 100 // Reward
                };
            });
            addLog(t('network_interactive.logs.defend', { area: territoryId }), 'success');
        } else {
            // Mercenaries
            if (state.dirtyCash >= mercCost) {
                setState(prev => {
                    const newAttacks = { ...prev.territoryAttacks };
                    delete newAttacks[territoryId];
                    return {
                        ...prev,
                        dirtyCash: prev.dirtyCash - mercCost,
                        territoryAttacks: newAttacks
                    };
                });
                addLog(t('network_interactive.logs.defend', { area: territoryId }), 'success');
            } else {
                addLog("Du har ikke råd til lejesoldater, og dine vagter er for svage!", 'error');
            }
        }
    }, [state.territoryAttacks, state.defense, state.dirtyCash, setState, addLog, t]);

    const performStreetOp = useCallback((type) => {
        if (type === 'drive_by') {
            const cost = 5000;
            if (state.dirtyCash < cost) return addLog("Mangler 5.000 kr (Sort)!", "error");

            setState(prev => ({
                ...prev,
                dirtyCash: prev.dirtyCash - cost,
                heat: prev.heat + 10,
                // Simplify: Just reduce global rival strength for now
                rival: { ...prev.rival, strength: Math.max(0, (prev.rival?.strength || 0) - 50) }
            }));
            addLog(t('network_interactive.logs.drive_by', { cash: 5000, district: 'Rival' }), "rival");
        }
        else if (type === 'bribe') {
            const cost = 30000;
            if (state.dirtyCash < cost) return addLog("Mangler 30.000 kr (Sort) til borgmesteren!", "error");

            setState(prev => ({
                ...prev,
                dirtyCash: prev.dirtyCash - cost,
                heat: Math.max(0, prev.heat - 20)
            }));
            addLog(t('network_interactive.logs.bribe', { district: 'City' }), "success");
        }
        else if (type === 'stash_raid') {
            // Risk based
            const success = Math.random() > 0.5;
            if (success) {
                const loot = 15000;
                setState(prev => ({ ...prev, dirtyCash: prev.dirtyCash + loot }));
                addLog(`RAID SUCCES: Du stjal ${formatNumber(loot)} kr!`, "success");
                if (addFloat) addFloat(loot, 'cheap'); // Visualize gain
            } else {
                setState(prev => ({ ...prev, heat: prev.heat + 15 }));
                addLog("RAID FEJLEDE: Politiet dukkede op! (+15 Heat)", "error");
            }
        }
        else if (type === 'heat_wipe') {
            if ((state.kingpinTokens || 0) < 1) return addLog("Kræver 1 Kingpin Token!", "error");

            setState(prev => ({
                ...prev,
                heat: 0,
                kingpinTokens: (prev.kingpinTokens || 0) - 1
            }));
            addLog("TOTAL HEAT WIPE: Gaden er tavs. Ingen har set noget.", "success");
        }
    }, [state.dirtyCash, state.kingpinTokens, setState, addLog, addFloat, t]);

    const handleShakedown = useCallback((territoryId, income) => {
        if (!activeShakedown || activeShakedown.id !== territoryId) return;

        // Reward: 10x Current Income
        const reward = income * 10;

        setState(prev => ({
            ...prev,
            dirtyCash: prev.dirtyCash + reward,
            xp: prev.xp + 50
        }));

        addLog(`BESKYTTELSESPENGE: Inddrev ${formatNumber(reward)} kr!`, "success");
        if (addFloat) addFloat(reward, 'dirty'); // Floating text
        setActiveShakedown(null); // Clear event
    }, [activeShakedown, setState, addLog, addFloat]);

    // FEATURE 2: Territory Specialization
    const specializeTerritory = useCallback((territoryId, spec) => {
        // Reducer handles validation, but we can do a quick check here or just dispatch
        // Since we are using setState with a reducer pattern in GameContext, 
        // wait, GameContext uses `dispatch` but passes it as `state, dispatch`? 
        // No, `GameLayout` passes `state, setState`. `GameContext` provides `state, dispatch`.
        // The `useGame` hook returns `{ state, dispatch }`.
        // `App.jsx`: `<GameLayout state={state} setState={dispatch} ... />`
        // So `setState` IS `dispatch`.

        setState({
            type: 'SPECIALIZE_TERRITORY',
            payload: { territoryId, spec }
        });

        // Log is handled by UI or we can add it here
        const specNames = { safe: 'Safe', front: 'Front', storage: 'Lager' };
        addLog(t('network.spec_chosen', { spec: specNames[spec] || spec }), 'success');

    }, [setState, addLog, t]);

    return {
        activeShakedown,
        now,
        conquer,
        upgradeTerritory,
        defendTerritory,
        performStreetOp,
        handleShakedown,
        specializeTerritory
    };
};
