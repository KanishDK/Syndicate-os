import React from 'react';

const ConsoleView = ({ logs }) => (
    <div className="h-24 md:h-48 bg-[#050505] border-t border-white/10 p-2 font-mono text-[10px] md:text-xs overflow-y-auto custom-scrollbar shadow-[0_-5px_30px_rgba(0,0,0,0.8)] z-30 shrink-0 relative">
        <div className="scanline opacity-10 pointer-events-none"></div>
        <div className="text-zinc-500 mb-2 sticky top-0 bg-[#050505]/90 backdrop-blur pb-1 border-b border-white/5 uppercase font-bold tracking-widest flex justify-between items-center">
            <span className="flex items-center gap-2"><i className="fa-solid fa-terminal text-xs"></i> System Log</span>
            <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-green-500 text-[9px]">NET.LIVE</span>
            </span>
        </div>
        <div className="space-y-0.5 font-medium">
            {logs.map((log, i) => (
                <div key={i} className={`flex gap-2 hover:bg-white/5 px-1 rounded ${log.type === 'error' || log.type === 'rival' ? 'text-red-400' :
                    log.type === 'success' ? 'text-emerald-400' :
                        log.type === 'warning' ? 'text-amber-400' : 'text-zinc-400'
                    }`}>
                    <span className="opacity-30 min-w-[50px]">[{log.time}]</span>
                    <span className="tracking-tight">{log.msg}</span>
                </div>
            ))}
            {logs.length === 0 && <div className="text-zinc-700 italic px-1">&gt; Awaiting input signals...</div>}
        </div>
    </div>
);

export default ConsoleView;
