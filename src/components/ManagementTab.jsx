import React from 'react';
import { CONFIG } from '../config/gameConfig';
import { formatNumber, getBulkCost, getMaxAffordable } from '../utils/gameMath';
import { useManagement } from '../hooks/useManagement';

const ManagementTab = ({ state, setState, addLog }) => {
    // Phase 1: Data Visibility - Expanded Card Design
    // Phase 2: Bulk Buy Logic
    const [buyAmount, setBuyAmount] = React.useState(1); // 1, 10, or 'max'

    // Hooks (Logic remains same for now)
    const { buyStaff, fireStaff, buyUpgrade, buyDefense } = useManagement(state, setState, addLog);

    // Helper: Calculate Total Salary
    const totalSalary = Object.keys(state.staff || {}).reduce((acc, role) => {
        const count = state.staff[role] || 0;
        const salary = CONFIG.staff[role]?.salary || 0;
        return acc + (count * salary);
    }, 0);

    const StaffCard = ({ item, count, role, onBuy, onSell, canAfford, locked, costToDisplay, actualAmount }) => (
        <div className={`p-4 rounded-xl border transition-all flex flex-col gap-3 group relative overflow-hidden
            ${locked ? 'bg-zinc-900/50 border-zinc-800 opacity-60 grayscale' : 'bg-[#0a0a0c] border-white/5 hover:border-white/10 hover:shadow-lg'}`}>

            {/* LOCKED OVERLAY */}
            {locked && (
                <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center backdrop-blur-[1px]">
                    <div className="text-red-500 font-black uppercase text-xs flex items-center gap-2 border border-red-500/30 px-3 py-1.5 rounded bg-black/90 shadow-xl">
                        <i className="fa-solid fa-lock"></i>
                        Kræver Level {item.reqLevel || 1}
                    </div>
                </div>
            )}

            {/* HEADER */}
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg border relative z-10
                        ${item.role === 'producer' ? 'bg-emerald-900/20 text-emerald-400 border-emerald-500/20' :
                            item.role === 'seller' ? 'bg-indigo-900/20 text-indigo-400 border-indigo-500/20' :
                                'bg-purple-900/20 text-purple-400 border-purple-500/20'}`}>
                        <i className={`fa-solid ${item.icon || 'fa-user'}`}></i>
                    </div>
                    <div>
                        <div className="text-sm font-black text-white uppercase tracking-tight">{item.name}</div>
                        <div className="text-[10px] text-zinc-400 leading-tight max-w-[150px]">{item.desc}</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs font-bold text-white bg-white/5 px-2 py-0.5 rounded border border-white/5 inline-block min-w-[30px] text-center">
                        {count}
                    </div>
                </div>
            </div>

            {/* STATS GRID (Phase 1 Goal: Show Prices & Salary) */}
            <div className="grid grid-cols-2 gap-2 text-[10px] bg-black/20 p-2 rounded-lg border border-white/5 relative z-10">
                <div className="flex flex-col">
                    <span className="text-zinc-600 uppercase font-bold tracking-wider text-[9px]">Lønning</span>
                    <span className="text-red-400 font-mono">-{formatNumber(item.salary)} kr/min</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-zinc-600 uppercase font-bold tracking-wider text-[9px]">Effekt</span>
                    <span className="text-emerald-400 font-mono">
                        {item.role === 'producer' ? `+${item.rate}g/t` :
                            item.role === 'seller' ? `Sælger ${item.rate / 1000}x` :
                                item.role === 'reducer' ? `-${item.rate * 100}%/s` : 'Speciel'}
                    </span>
                </div>
            </div>

            {/* ACTION BAR */}
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5 relative z-10">
                <div className="flex flex-col">
                    <div className={`text-xs font-mono font-bold ${canAfford ? 'text-emerald-400' : 'text-red-500'}`}>
                        {formatNumber(costToDisplay)} kr.
                    </div>
                    {buyAmount !== 1 && (
                        <div className="text-[9px] text-zinc-500 font-mono">
                            for {actualAmount} stk
                        </div>
                    )}
                </div>

                <div className="flex gap-2">
                    {count > 0 && onSell && (
                        <button
                            onClick={() => onSell(role)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20 active:scale-95"
                            title="Fyr en ansat"
                            disabled={locked}
                        >
                            <i className="fa-solid fa-user-minus"></i>
                        </button>
                    )}
                    <button
                        onClick={() => onBuy(role, buyAmount)}
                        disabled={!canAfford || locked}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border active:scale-95
                            ${canAfford && !locked
                                ? 'bg-white text-black hover:bg-emerald-400 hover:border-emerald-500 hover:shadow-[0_0_15px_rgba(52,211,153,0.4)] border-transparent'
                                : 'bg-zinc-800 text-zinc-600 border-white/5 cursor-not-allowed'}`}
                    >
                        <span>Ansæt</span>
                        <i className="fa-solid fa-plus text-[10px]"></i>
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto h-full flex flex-col pb-24">
            {/* HEADER SUMMARY */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 pb-6 border-b border-white/10">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-1">
                        <span className="text-blue-500">HR</span> & Drift
                    </h2>
                    <p className="text-zinc-500 text-sm">Administrer dit syndikats personale og faciliteter.</p>
                </div>

                <div className="flex gap-4 mt-4 md:mt-0">
                    {/* BULK TOGGLE */}
                    <div className="flex bg-black/40 rounded-lg p-0.5 border border-white/10">
                        <button onClick={() => setBuyAmount(1)} className={`w-8 h-8 flex items-center justify-center rounded font-black text-xs transition-all ${buyAmount === 1 ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>1x</button>
                        <button onClick={() => setBuyAmount(10)} className={`w-8 h-8 flex items-center justify-center rounded font-black text-xs transition-all ${buyAmount === 10 ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>10x</button>
                        <button onClick={() => setBuyAmount('max')} className={`w-10 h-8 flex items-center justify-center rounded font-black text-[10px] uppercase transition-all ${buyAmount === 'max' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Max</button>
                    </div>

                    <div className="bg-red-900/20 border border-red-500/20 px-4 py-2 rounded-xl flex flex-col items-end">
                        <span className="text-[10px] text-red-400 uppercase font-bold tracking-wider">Samlet Lønning</span>
                        <span className="text-lg font-mono text-red-300 font-bold">-{formatNumber(totalSalary)} <span className="text-xs">kr/min</span></span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">

                {/* LEFT COLUMN: STAFF (3 cols wide on large screens) */}
                <div className="xl:col-span-3 space-y-8">

                    {/* SECTION: PRODUCERS */}
                    <div>
                        <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <i className="fa-solid fa-flask"></i> Produktion
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(CONFIG.staff).filter(([k, v]) => v.role === 'producer').map(([role, item]) => {
                                const count = state.staff[role] || 0;
                                let actualAmount = buyAmount === 'max' ? getMaxAffordable(item.baseCost, item.costFactor, count, state.cleanCash) : buyAmount;
                                if (actualAmount <= 0) actualAmount = 1; // Default to showing cost of next 1 if max is 0
                                const cost = getBulkCost(item.baseCost, item.costFactor, count, actualAmount);

                                return (
                                    <StaffCard
                                        key={role}
                                        role={role}
                                        item={item}
                                        count={count}
                                        onBuy={buyStaff}
                                        onSell={fireStaff}
                                        locked={state.level < (item.reqLevel || 1)}
                                        // New Props for Bulk
                                        costToDisplay={cost}
                                        actualAmount={actualAmount}
                                        canAfford={state.cleanCash >= cost && (buyAmount !== 'max' || actualAmount > 0)}
                                    />
                                )
                            })}
                        </div>
                    </div>

                    {/* SECTION: SELLERS */}
                    <div>
                        <h3 className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <i className="fa-solid fa-truck-fast"></i> Distribution
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(CONFIG.staff).filter(([k, v]) => v.role === 'seller').map(([role, item]) => {
                                const count = state.staff[role] || 0;
                                let actualAmount = buyAmount === 'max' ? getMaxAffordable(item.baseCost, item.costFactor, count, state.cleanCash) : buyAmount;
                                if (actualAmount <= 0) actualAmount = 1;
                                const cost = getBulkCost(item.baseCost, item.costFactor, count, actualAmount);

                                return (
                                    <StaffCard
                                        key={role}
                                        role={role}
                                        item={item}
                                        count={state.staff[role] || 0}
                                        onBuy={buyStaff}
                                        onSell={fireStaff}
                                        locked={state.level < (item.reqLevel || 1)}
                                        costToDisplay={cost}
                                        actualAmount={actualAmount}
                                        canAfford={state.cleanCash >= cost}
                                    />
                                )
                            })}
                        </div>
                    </div>

                    {/* SECTION: SUPPORT & SPECIAL */}
                    <div>
                        <h3 className="text-xs font-black text-purple-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <i className="fa-solid fa-user-shield"></i> Administration & Support
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(CONFIG.staff).filter(([k, v]) => v.role === 'reducer' || v.role === 'special').map(([role, item]) => {
                                const count = state.staff[role] || 0;
                                let actualAmount = buyAmount === 'max' ? getMaxAffordable(item.baseCost, item.costFactor, count, state.cleanCash) : buyAmount;
                                if (actualAmount <= 0) actualAmount = 1;
                                const cost = getBulkCost(item.baseCost, item.costFactor, count, actualAmount);

                                return (
                                    <StaffCard
                                        key={role}
                                        role={role}
                                        item={item}
                                        count={state.staff[role] || 0}
                                        onBuy={buyStaff}
                                        onSell={fireStaff}
                                        locked={state.level < (item.reqLevel || 1)}
                                        costToDisplay={cost}
                                        actualAmount={actualAmount}
                                        canAfford={state.cleanCash >= cost}
                                    />
                                )
                            })}
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN: INFRASTRUCTURE (1 col wide) */}
                <div className="xl:col-span-1 space-y-6">
                    {/* UPGRADES */}
                    <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-4 shadow-xl">
                        <h3 className="text-xs font-black text-orange-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <i className="fa-solid fa-industry"></i> Anlæg
                        </h3>
                        <div className="space-y-4">
                            {Object.entries(CONFIG.upgrades).map(([id, item]) => {
                                const count = state.upgrades[id] || 0;
                                let actualAmount = buyAmount === 'max' ? getMaxAffordable(item.baseCost, item.costFactor || 1.5, count, state.cleanCash) : buyAmount;
                                if (actualAmount <= 0) actualAmount = 1;
                                const cost = getBulkCost(item.baseCost, item.costFactor || 1.5, count, actualAmount);
                                const canAfford = state.cleanCash >= cost && (buyAmount !== 'max' || actualAmount > 0);

                                return (
                                    <div key={id} className="p-3 bg-zinc-900/30 rounded-xl border border-white/5 hover:border-orange-500/30 transition-all group relative overflow-hidden">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-8 h-8 rounded bg-orange-900/20 text-orange-400 border border-orange-500/20 flex items-center justify-center shrink-0">
                                                <i className={`fa-solid ${item.icon}`}></i>
                                            </div>
                                            <div>
                                                <div className="text-xs font-black text-white uppercase">{item.name}</div>
                                                <div className="text-[10px] text-zinc-500 leading-tight">{item.desc}</div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center bg-black/40 rounded p-2 mb-2 border border-white/5">
                                            <span className="text-[9px] text-zinc-400 font-bold uppercase">Level {count}</span>
                                            <span className="text-[9px] text-emerald-400 font-mono">
                                                {item.effect === 'cap' ? `x${Math.pow(2, count)} Plads` : `+${item.value * 100}% Hastighed`}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => buyUpgrade(id, buyAmount)}
                                            disabled={!canAfford}
                                            className={`w-full py-2 rounded-lg text-[10px] uppercase font-bold flex justify-between px-3 ${canAfford ? 'bg-orange-600/10 text-orange-400 hover:bg-orange-600 hover:text-white border border-orange-500/20' : 'bg-zinc-800 text-zinc-600 border border-white/5'}`}
                                        >
                                            <span className="flex items-center gap-1">
                                                Opgrader
                                                {buyAmount !== 1 && <span className="text-[9px] opacity-70">({actualAmount}x)</span>}
                                            </span>
                                            <span>{formatNumber(cost)} kr</span>
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* DEFENSE */}
                    <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-4 shadow-xl">
                        <h3 className="text-xs font-black text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <i className="fa-solid fa-shield-dog"></i> Sikkerhed
                        </h3>

                        <div className="p-3 bg-red-950/10 rounded-xl border border-red-500/10 mb-4 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[9px] text-red-400 font-bold uppercase tracking-wider">Trusselsniveau</span>
                                <span className="text-xs text-red-200">
                                    {state.heat < 30 ? 'Lav' : state.heat < 70 ? 'Middel' : 'RAZZIA FARE'}
                                </span>
                            </div>
                            <div className="text-2xl text-red-500/50">
                                <i className="fa-solid fa-land-mine-on"></i>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {Object.entries(CONFIG.defense).map(([id, item]) => {
                                const count = state.defense[id] || 0;
                                let actualAmount = buyAmount === 'max' ? getMaxAffordable(item.baseCost, item.costFactor, count, state.cleanCash) : buyAmount;
                                if (actualAmount <= 0) actualAmount = 1;
                                const cost = getBulkCost(item.baseCost, item.costFactor, count, actualAmount);
                                const canAfford = state.cleanCash >= cost && (buyAmount !== 'max' || actualAmount > 0);

                                return (
                                    <div key={id} className="p-3 bg-zinc-900/30 rounded-xl border border-white/5 hover:border-red-500/30 transition-all group">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-8 h-8 rounded bg-red-900/20 text-red-400 border border-red-500/20 flex items-center justify-center shrink-0">
                                                <i className="fa-solid fa-person-military-rifle"></i>
                                            </div>
                                            <div>
                                                <div className="text-xs font-black text-white uppercase">{item.name}</div>
                                                <div className="text-[10px] text-zinc-500 leading-tight">{item.desc}</div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center bg-black/40 rounded p-2 mb-2 border border-white/5">
                                            <span className="text-[9px] text-zinc-400 font-bold uppercase">{count} Enheder</span>
                                            <span className="text-[9px] text-red-400 font-mono">
                                                +{item.defenseVal} Forsvar
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => buyDefense(id, buyAmount)}
                                            disabled={!canAfford}
                                            className={`w-full py-2 rounded-lg text-[10px] uppercase font-bold flex justify-between px-3 ${canAfford ? 'bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/20' : 'bg-zinc-800 text-zinc-600 border border-white/5'}`}
                                        >
                                            <span className="flex items-center gap-1">
                                                Køb
                                                {buyAmount !== 1 && <span className="text-[9px] opacity-70">({actualAmount}x)</span>}
                                            </span>
                                            <span>{formatNumber(cost)} kr</span>
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ManagementTab;
