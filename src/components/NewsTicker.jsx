import React, { memo } from 'react';

const NewsTicker = memo(({ logs, onNewsClick }) => (
    <div className="fixed top-[88px] left-0 w-full h-6 bg-black z-30 border-b border-white/5 overflow-hidden flex items-center group">
        <div className="whitespace-nowrap animate-marquee text-[10px] font-mono font-bold text-zinc-400 px-4">
            <span className="text-emerald-500 mr-2">SYNDICATE OS v26.3 READY</span>
            {logs.slice(0, 5).map((l, i) => (
                <span
                    key={i}
                    onClick={() => l.action && onNewsClick(l.action)}
                    className={`
                        mr-8 transition-colors duration-200
                        ${l.action ? 'cursor-pointer hover:text-white underline decoration-dotted' : 'text-zinc-500'}
                    `}
                >
                    <span className={l.type === 'error' ? 'text-red-500' : l.type === 'success' ? 'text-emerald-500' : 'text-blue-500'}>
                        [{l.time}]
                    </span> {l.msg} {l.action && <i className="fa-solid fa-arrow-pointer ml-1 text-[8px] opacity-70"></i>}
                </span>
            ))}
        </div>
    </div>
));

export default NewsTicker;
