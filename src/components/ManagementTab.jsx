import React from 'react';
import { CONFIG } from '../config/gameConfig';
import { formatNumber, getBulkCost, getMaxAffordable } from '../utils/gameMath';
import { useManagement } from '../hooks/useManagement';
import SimpleLineChart from './SimpleLineChart';

const ManagementTab = ({ state, setState, addLog }) => {
    // Phase 1: Data Visibility - Expanded Card Design
    // Phase 2: Bulk Buy Logic
    const [buyAmount, setBuyAmount] = React.useState(1); // 1, 10, or 'max'

    // Hooks
    const { buyStaff, fireStaff, buyUpgrade, buyDefense } = useManagement(state, setState, addLog);

    // Helper: Calculate Total Salary
    const totalSalary = Object.keys(state.staff || {}).reduce((acc, role) => {
        const count = state.staff[role] || 0;
        const salary = CONFIG.staff[role]?.salary || 0;
        return acc + (count * salary);
    }, 0);

    // Component: Staff Card
    const StaffCard = ({ item, count, role, onBuy, onSell, canAfford, locked, costToDisplay, actualAmount }) => (
        <div className={`p-4 rounded-xl border transition-all flex flex-col gap-3 group relative overflow-hidden
            ${locked ? 'bg-zinc-900/50 border-zinc-800 opacity-60 grayscale' : 'bg-[#0a0a0c] border-white/5 active:border-white/10 active:shadow-lg'}`}>

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

            {/* STATS GRID */}
            <div className="grid grid-cols-2 gap-2 text-[10px] bg-black/20 p-2 rounded-lg border border-white/5 relative z-10">
                <div className="flex flex-col">
                    <span className="text-zinc-600 uppercase font-bold tracking-wider text-[9px]">Lønning</span>
                    <span className="text-red-400 font-mono">-{formatNumber(item.salary)} kr <span className="text-[8px] opacity-70">/ 5 min</span></span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-zinc-600 uppercase font-bold tracking-wider text-[9px]">Effekt</span>
                    <span className="text-emerald-400 font-mono">
                        {item.role === 'producer' ? `+${(Object.values(item.rates || {})[0] * 60).toFixed(1)} enheder/min` :
                            item.role === 'seller' ? `~${(Object.values(item.rates || {})[0] * 60).toFixed(1)} salg/min` :
                                item.role === 'reducer' ? (item.target === 'heat' ? `-${item.rate} Heat/s` : `+${item.rate * 100}% Vask`) : 'Speciel'}
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
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 text-red-500 active:bg-red-500 active:text-white transition-all border border-red-500/20 active:scale-95"
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
                                ? 'bg-white text-black active:bg-emerald-400 active:border-emerald-500 active:shadow-[0_0_15px_rgba(52,211,153,0.4)] border-transparent'
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

            {/* HEADER & TOGGLE */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
                        <i className="fa-solid fa-users text-purple-500"></i> Organisation
                    </h2>
                    <p className="text-zinc-400 text-sm mt-1">Ansæt specialister og administrer din operation.</p>
                </div>

                {/* BULK TOGGLE */}
                <div className="flex bg-black/40 rounded-lg p-0.5 border border-white/10">
                    <button onClick={() => setBuyAmount(1)} className={`w-8 h-8 flex items-center justify-center rounded font-black text-xs transition-all ${buyAmount === 1 ? 'bg-zinc-700 text-white' : 'text-zinc-500 active:text-zinc-300'}`}>1x</button>
                    <button onClick={() => setBuyAmount(10)} className={`w-8 h-8 flex items-center justify-center rounded font-black text-xs transition-all ${buyAmount === 10 ? 'bg-zinc-700 text-white' : 'text-zinc-500 active:text-zinc-300'}`}>10x</button>
                    <button onClick={() => setBuyAmount('max')} className={`w-10 h-8 flex items-center justify-center rounded font-black text-[10px] uppercase transition-all ${buyAmount === 'max' ? 'bg-zinc-700 text-white' : 'text-zinc-500 active:text-zinc-300'}`}>Max</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT COL: STAFF */}
                <div className="lg:col-span-2 space-y-6">
                    {/* STAFF LIST */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(CONFIG.staff).map(([role, item]) => {
                            const count = state.staff[role] || 0;
                            const locked = state.level < item.reqLevel;

                            // Cost Calc
                            let actualAmount = buyAmount;
                            if (buyAmount === 'max') {
                                actualAmount = getMaxAffordable(item.baseCost, 1.15, count, state.cleanCash);
                            }
                            if (actualAmount <= 0) actualAmount = 1;

                            const cost = getBulkCost(item.baseCost, 1.15, count, actualAmount);
                            const canAfford = state.cleanCash >= cost;

                            return (
                                <StaffCard
                                    key={role}
                                    role={role}
                                    item={item}
                                    count={count}
                                    onBuy={buyStaff}
                                    onSell={fireStaff}
                                    locked={locked}
                                    canAfford={canAfford}
                                    costToDisplay={cost}
                                    actualAmount={actualAmount}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT COL: STATS & UPGRADES */}
                <div className="space-y-6">
                    {/* STATS CHECK */}
                    <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-4 shadow-xl">
                        <h3 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <i className="fa-solid fa-chart-line"></i> Økonomi
                        </h3>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                                <span className="text-zinc-500 font-bold uppercase text-[9px]">Lønninger (Interval)</span>
                                <span className="text-red-400 font-mono">-{formatNumber(totalSalary)} kr / 5 min</span>
                            </div>
                            <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                                <span className="text-zinc-500 font-bold uppercase text-[9px]">Total Omsætning</span>
                                <span className="text-emerald-400 font-mono">{formatNumber(state.lifetime?.earnings || 0)} kr.</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-zinc-500 font-bold uppercase text-[9px]">Hvidvasket</span>
                                <span className="text-blue-400 font-mono">{formatNumber(state.lifetime?.laundered || 0)} kr.</span>
                            </div>
                        </div>
                    </div>

                    {/* UPGRADES (Simplified List) */}
                    <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-4 shadow-xl">
                        <h3 className="text-xs font-black text-purple-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <i className="fa-solid fa-arrow-up-right-dots"></i> Opgraderinger
                        </h3>
                        <div className="space-y-3">
                            {Object.entries(CONFIG.upgrades).map(([key, item]) => {
                                const currentLevel = state.upgrades[key] || 0;
                                const locked = state.level < item.reqLevel;

                                // Upgrade Cost is usually fixed or scalar?
                                // Config doesn't strictly define curve, assuming fixed for now or custom logic.
                                // Let's assume Config has baseCost and we scale it.
                                // Use baseCost instead of price
                                const cost = Math.floor(item.baseCost * Math.pow(item.costFactor || 1.5, currentLevel));
                                const canAfford = state.cleanCash >= cost;

                                if (locked) return null;

                                return (
                                    <div key={key} className="p-3 bg-zinc-900/30 border border-white/5 rounded-lg flex justify-between items-center">
                                        <div>
                                            <div className="text-xs font-bold text-white">{item.name}</div>
                                            <div className="text-[9px] text-zinc-500">Lvl {currentLevel}</div>
                                        </div>
                                        <button
                                            onClick={() => buyUpgrade(key)}
                                            disabled={!canAfford}
                                            className={`px-3 py-1 rounded text-[10px] font-bold uppercase active:scale-95 ${canAfford ? 'bg-purple-900/40 text-purple-400 border border-purple-500/30 active:bg-purple-900/60' : 'bg-zinc-800 text-zinc-600'}`
                                            }>
                                            {formatNumber(cost)} kr
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* ACHIEVEMENTS */}
                    <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-4 shadow-xl">
                        <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <i className="fa-solid fa-trophy"></i> Trofæer
                        </h3>
                        <div className="space-y-3">
                            {CONFIG.achievements.map((ach) => {
                                const unlocked = state.unlockedAchievements && state.unlockedAchievements.includes(ach.id);

                                return (
                                    <div key={ach.id} className={`p-3 border rounded-lg flex items-center gap-3 transition-all ${unlocked ? 'bg-amber-900/20 border-amber-500/30' : 'bg-zinc-900/30 border-white/5 opacity-50'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs border ${unlocked ? 'bg-amber-500 text-black border-amber-400' : 'bg-black text-zinc-600 border-zinc-700'}`}>
                                            <i className={`fa-solid ${ach.icon}`}></i>
                                        </div>
                                        <div>
                                            <div className={`text-xs font-bold uppercase ${unlocked ? 'text-white' : 'text-zinc-500'}`}>
                                                {unlocked || !ach.secret ? ach.name : 'Hemmelig'}
                                            </div>
                                            <div className="text-[9px] text-zinc-500 leading-tight">
                                                {unlocked || !ach.secret ? ach.desc : 'Lås op for at se denne bedrift.'}
                                            </div>
                                        </div>
                                        {unlocked && <i className="fa-solid fa-check text-emerald-500 ml-auto text-xs"></i>}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ManagementTab;
