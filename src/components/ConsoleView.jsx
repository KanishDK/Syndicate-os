import React, { useState, useEffect, useRef, memo } from 'react';
import Button from './Button';
import { useLanguage } from '../context/LanguageContext';

const ConsoleView = memo(({ logs }) => {
    const { t } = useLanguage();
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
        if (type === 'rival' || type === 'raid') return 'fa-skull text-theme-danger';
        if (type === 'sale' || type === 'laundering') return 'fa-sack-dollar text-theme-success';
        if (type === 'system') return 'fa-gears text-theme-text-muted';
        if (type === 'warning') return 'fa-triangle-exclamation text-theme-warning';
        return 'fa-terminal text-theme-text-secondary';
    };

    // Helper to get log message (translate if needed)
    const getLogMessage = (log) => {
        if (log.isTranslationKey && log.msgKey) {
            return t(log.msgKey, log.msgData || {});
        }
        return log.msg || '';
    };

    return (
        <div
            className={`
w - full z - [60] transition - all duration - 300 ease -in -out border - t border - theme - border - subtle
                ${isExpanded ? 'h-64 bg-theme-bg-primary/95 backdrop-blur-md shadow-[0_-5px_50px_rgba(0,0,0,0.8)]' : 'h-8 bg-theme-bg-primary'}
`}
        >
            {/* HEADER / TOGGLE BAR */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 flex items-center justify-between px-4 cursor-pointer active:bg-white/5 transition-colors group select-none relative"
            >
                <div className="flex items-center gap-3">
                    <i className={`fa - solid fa - chevron - up text - xs text - theme - text - muted transition - transform ${isExpanded ? 'rotate-180' : ''} `}></i>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-theme-text-secondary active:text-theme-text-primary transition-colors">
                        System Log
                    </span>
                    {/* PREVIEW (When Collapsed) */}
                    {!isExpanded && logs.length > 0 && (
                        <span className="ml-4 font-mono text-[10px] text-theme-text-muted truncate max-w-[200px] md:max-w-md opacity-60">
                            &gt; {getLogMessage(logs[0])}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-theme-success animate-pulse"></span>
                        <span className="text-theme-success text-[9px] font-mono">LIVE</span>
                    </div>
                </div>
            </div>

            {/* EXPANDED CONTENT */}
            {isExpanded && (
                <div className="h-[calc(100%-32px)] flex flex-col p-2">
                    {/* FILTERS */}
                    <div className="flex gap-2 mb-2 pb-2 border-b border-theme-border-subtle overflow-x-auto custom-scrollbar">
                        {['ALL', 'COMBAT', 'MONEY', 'SYSTEM'].map(f => (
                            <Button
                                key={f}
                                onClick={() => setFilter(f)}
                                size="xs"
                                variant="ghost"
                                className={`
!px - 3!py - 1 rounded text - [9px] font - bold uppercase tracking - wider border transition - all
                                    ${filter === f
                                        ? '!bg-theme-success/30 !text-theme-success !border-theme-success/30'
                                        : '!bg-theme-bg-primary !text-theme-text-muted !border-theme-border-subtle active:!bg-theme-surface-elevated active:!text-theme-text-secondary'
                                    }
`}
                            >
                                {f}
                            </Button>
                        ))}
                    </div>

                    {/* LOGS */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-[10px] md:text-xs">
                        {filteredLogs.map((log, i) => (
                            <div key={i} className="flex gap-3 active:bg-theme-surface-base py-0.5 px-2 rounded -mx-2 group/log">
                                <span className="opacity-30 min-w-[50px] text-theme-text-muted">{log.time}</span>
                                <i className={`fa - solid ${getIcon(log.type)} w - 4 text - center mt - 0.5`}></i>
                                <span className={`flex - 1 ${log.type === 'error' || log.type === 'rival' ? 'text-theme-danger' :
                                        log.type === 'success' ? 'text-theme-success' :
                                            log.type === 'warning' ? 'text-theme-warning' : 'text-theme-text-secondary'
                                    } `}>
                                    {getLogMessage(log)}
                                </span>
                            </div>
                        ))}
                        {filteredLogs.length === 0 && <div className="text-theme-text-muted italic px-2 mt-4 text-center">Ingen data i denne kanal.</div>}
                        <div ref={bottomRef}></div>
                    </div>
                </div>
            )}
        </div>
    );
});

export default ConsoleView;
