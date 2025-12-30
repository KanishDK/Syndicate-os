import { useCallback } from 'react';
import { CONFIG } from '../config/gameConfig';

export const useManagement = (state, setState, addLog) => {

    const buyStaff = useCallback((role) => {
        const item = CONFIG.staff[role];
        if (state.level < (item.reqLevel || 1)) {
            addLog(`Du skal være Level ${item.reqLevel} for at ansætte en ${item.name}!`, 'error');
            return;
        }

        const count = state.staff[role] || 0;
        const cost = Math.floor(item.baseCost * Math.pow(item.costFactor, count));

        if (state.cleanCash >= cost) {
            setState(prev => ({
                ...prev,
                cleanCash: prev.cleanCash - cost,
                staff: { ...prev.staff, [role]: (prev.staff[role] || 0) + 1 },
                dirtyCash: prev.dirtyCash
            }));
            addLog(`Ansatte ${item.name} for ${cost.toLocaleString()} kr.`, 'success');
        }
    }, [state.level, state.staff, state.cleanCash, setState, addLog]);

    const fireStaff = useCallback((role) => {
        if (state.staff[role] > 0) {
            setState(prev => ({
                ...prev,
                staff: { ...prev.staff, [role]: prev.staff[role] - 1 }
            }));
            addLog(`Fyrede ${CONFIG.staff[role].name}. (Ingen refusion)`, 'warning');
        }
    }, [state.staff, setState, addLog]);

    const buyUpgrade = useCallback((id) => {
        const item = CONFIG.upgrades[id];
        const count = state.upgrades[id] || 0;
        const cost = Math.floor(item.baseCost * Math.pow(item.costFactor || 1.5, count));

        if (state.cleanCash >= cost) {
            setState(prev => ({
                ...prev,
                cleanCash: prev.cleanCash - cost,
                upgrades: { ...prev.upgrades, [id]: count + 1 }
            }));
            addLog(`Opgraderede faciliteter: ${item.name}`, 'success');
        }
    }, [state.upgrades, state.cleanCash, setState, addLog]);

    const buyDefense = useCallback((id) => {
        const item = CONFIG.defense[id];
        const count = state.defense[id];
        const cost = Math.floor(item.baseCost * Math.pow(item.costFactor, count));

        if (state.cleanCash >= cost) {
            setState(prev => ({
                ...prev,
                cleanCash: prev.cleanCash - cost,
                defense: { ...prev.defense, [id]: prev.defense[id] + 1 }
            }));
            addLog(`Installerede sikkerhed: ${item.name}`, 'success');
        }
    }, [state.defense, state.cleanCash, setState, addLog]);

    return { buyStaff, fireStaff, buyUpgrade, buyDefense };
};
