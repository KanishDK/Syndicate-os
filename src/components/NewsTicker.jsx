import React, { memo } from 'react';

const NewsTicker = memo(({ logs }) => (
    <div className="fixed top-[88px] left-0 w-full h-6 bg-black z-30 border-b border-white/5 overflow-hidden flex items-center">
        <div className="whitespace-nowrap animate-marquee text-[10px] font-mono font-bold text-zinc-400 px-4">
            <span className="text-emerald-500 mr-2">SYNDICATE OS v26.3 READY</span>
            {logs.slice(0, 3).map((l, i) => (
                <span key={i} className="mr-8 text-zinc-500">
                    <span className={l.type === 'error' ? 'text-red-500' : l.type === 'success' ? 'text-emerald-500' : 'text-blue-500'}>
                        [{l.time}]
                    </span> {l.msg}
                </span>
            ))}
        </div>
    </div>
));

export default NewsTicker;
