import React, { useState, useEffect, useRef, memo } from 'react';

const ConsoleView = memo(({ logs }) => {
    const [isExpanded, setIsExpanded] = useState(false); // Default collapsed
    const [filter, setFilter] = useState('ALL');
    const bottomRef = useRef(null);

    // Scroll to bottom on new log if expanded
    useEffect(() => {
        if (isExpanded && bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs, isExpanded]);

    // Filtering Logic
    const filteredLogs = logs.filter(log => {
        if (filter === 'ALL') return true;
        if (filter === 'COMBAT') return log.type === 'rival' || log.type === 'raid' || log.type === 'boss';
        if (filter === 'MONEY') return log.type === 'sale' || log.type === 'laundering';
        if (filter === 'SYSTEM') return log.type === 'system' || log.type === 'save';
        return true;
    });

    const getIcon = (type) => {
        if (type === 'rival' || type === 'raid') return 'fa-skull text-red-500';
        if (type === 'sale' || type === 'laundering') return 'fa-sack-dollar text-emerald-500';
        if (type === 'system') return 'fa-gears text-zinc-500';
        if (type === 'warning') return 'fa-triangle-exclamation text-amber-500';
        return 'fa-terminal text-zinc-600';
    };

    return (
        <div
            className={`
                fixed bottom-0 left-0 right-0 z-[60] transition-all duration-300 ease-in-out border-t border-white/10
                ${isExpanded ? 'h-64 bg-[#050505]/95 backdrop-blur-md shadow-[0_-5px_50px_rgba(0,0,0,0.8)]' : 'h-8 bg-[#050505]'}
            `}
        >
            {/* HEADER / TOGGLE BAR */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 flex items-center justify-between px-4 cursor-pointer active:bg-white/5 transition-colors group select-none relative"
            >
                <div className="flex items-center gap-3">
                    <i className={`fa-solid fa-chevron-up text-xs text-zinc-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}></i>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 active:text-white transition-colors">
                        System Log
                    </span>
                    {/* PREVIEW (When Collapsed) */}
                    {!isExpanded && logs.length > 0 && (
                        <span className="ml-4 font-mono text-[10px] text-zinc-500 truncate max-w-[200px] md:max-w-md opacity-60">
                            &gt; {logs[0].msg}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-green-500 text-[9px] font-mono">LIVE</span>
                    </div>
                </div>
            </div>

            {/* EXPANDED CONTENT */}
            {isExpanded && (
                <div className="h-[calc(100%-32px)] flex flex-col p-2">
                    {/* FILTERS */}
                    <div className="flex gap-2 mb-2 pb-2 border-b border-white/5 overflow-x-auto custom-scrollbar">
                        {['ALL', 'COMBAT', 'MONEY', 'SYSTEM'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`
                                    px-3 py-1 rounded text-[9px] font-bold uppercase tracking-wider border transition-all
                                    ${filter === f
                                        ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30'
                                        : 'bg-zinc-900 text-zinc-500 border-white/5 active:bg-zinc-800 active:text-zinc-300'}
                                `}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* LOGS */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-[10px] md:text-xs">
                        {filteredLogs.map((log, i) => (
                            <div key={i} className="flex gap-3 active:bg-white/5 py-0.5 px-2 rounded -mx-2 group/log">
                                <span className="opacity-30 min-w-[50px] text-zinc-500">{log.time}</span>
                                <i className={`fa-solid ${getIcon(log.type)} w-4 text-center mt-0.5`}></i>
                                <span className={`flex-1 ${log.type === 'error' || log.type === 'rival' ? 'text-red-400' :
                                    log.type === 'success' ? 'text-emerald-400' :
                                        log.type === 'warning' ? 'text-amber-400' : 'text-zinc-300'
                                    }`}>
                                    {log.msg}
                                </span>
                            </div>
                        ))}
                        {filteredLogs.length === 0 && <div className="text-zinc-700 italic px-2 mt-4 text-center">Ingen data i denne kanal.</div>}
                        <div ref={bottomRef}></div>
                    </div>
                </div>
            )}
        </div>
    );
});

export default ConsoleView;
