import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { formatNumber } from '../utils/gameMath';

const BriefcaseController = () => {
    const { dispatch, addFloat } = useGame();
    const [briefcase, setBriefcase] = useState(null); // { id, x, y, type }

    // Spawn Logic
    useEffect(() => {
        const spawnTimer = setInterval(() => {
            if (briefcase) return; // Already active

            // 10% Chance per check (Check every 5s = Avg spawn 50s)
            if (Math.random() < 0.1) {
                const types = ['money', 'money', 'money', 'heat', 'buff'];
                const type = types[Math.floor(Math.random() * types.length)];

                // Random Pos (Avoid edges)
                const x = 10 + Math.random() * 80; // 10-90%
                const y = 20 + Math.random() * 60; // 20-80%

                setBriefcase({
                    id: Date.now(),
                    x, y, type,
                    expires: Date.now() + 15000 // 15s lifetime
                });
            }
        }, 5000);

        return () => clearInterval(spawnTimer);
    }, [briefcase]);

    // Expiry Check
    useEffect(() => {
        if (!briefcase) return;
        const timer = setTimeout(() => {
            setBriefcase(null);
        }, 15000);
        return () => clearTimeout(timer);
    }, [briefcase]);

    const handleCollect = useCallback((e) => {
        e.stopPropagation(); // Prevent map click if any
        if (!briefcase) return;

        // Rewards
        dispatch({
            type: 'SET_STATE',
            payload: (prev) => {
                let logs = [...prev.logs];
                let updates = {};

                if (briefcase.type === 'money') {
                    // Reward scales with production or current cash
                    // Grant 5% of Net Worth or Flat amount based on level
                    const amount = Math.floor(Math.max(1000, (prev.dirtyCash + prev.cleanCash) * 0.05));

                    updates = {
                        dirtyCash: prev.dirtyCash + amount,
                        lastTick: { ...prev.lastTick, dirty: (prev.lastTick.dirty || 0) + amount }
                    };
                    logs.unshift({ msg: `GRATIS PENGE: Du fandt en mappe med ${formatNumber(amount)} kr!`, type: 'success', time: new Date().toLocaleTimeString() });
                    addFloat(`+${formatNumber(amount)} kr`, briefcase.x + '%', briefcase.y + '%', 'success');
                } else if (briefcase.type === 'heat') {
                    updates = { heat: Math.max(0, prev.heat - 20) };
                    logs.unshift({ msg: "BEVISER FJERNET: Du fandt en mappe med kompromitterende billeder. Heat -20.", type: 'success', time: new Date().toLocaleTimeString() });
                    addFloat(`-20 Heat`, briefcase.x + '%', briefcase.y + '%', 'blue');
                } else if (briefcase.type === 'buff') {
                    updates = { activeBuffs: { ...prev.activeBuffs, hype: Date.now() + 30000 } }; // 30s
                    logs.unshift({ msg: "HYPE MODE: Salg fordoblet i 30 sekunder!", type: 'success', time: new Date().toLocaleTimeString() });
                    addFloat(`HYPE MODE!`, briefcase.x + '%', briefcase.y + '%', 'amber');
                }

                return {
                    ...prev,
                    ...updates,
                    logs: logs.slice(0, 50)
                };
            }
        });

        setBriefcase(null);
    }, [briefcase, dispatch, addFloat]);

    if (!briefcase) return null;

    return (
        <div
            onClick={handleCollect}
            className="absolute z-40 cursor-pointer animate-bounce hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]"
            style={{ left: `${briefcase.x}%`, top: `${briefcase.y}%` }}
        >
            <div className="relative">
                <i className={`fa-solid ${briefcase.type === 'heat' ? 'fa-fire-extinguisher text-blue-400' : (briefcase.type === 'buff' ? 'fa-bolt text-amber-400' : 'fa-briefcase text-emerald-400')} text-4xl`}></i>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
            </div>
        </div>
    );
};

export default BriefcaseController;
