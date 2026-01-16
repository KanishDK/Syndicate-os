import React, { memo } from 'react';
import { useLanguage } from '../context/LanguageContext';

const NewsTicker = memo(({ logs, onNewsClick }) => {
    const { t } = useLanguage();
    return (
        <div className="w-full h-6 bg-theme-bg-primary z-30 border-b border-theme-border-subtle overflow-hidden flex items-center group relative">
            <div className="whitespace-nowrap animate-marquee text-[10px] font-mono font-bold text-theme-text-secondary px-4">
                <span className="text-theme-success mr-2">{t('news.system_ready')}</span>
                {logs.slice(0, 5).map((l, i) => (
                    <span
                        key={i}
                        onClick={() => l.action && onNewsClick(l.action)}
                        className={`
                        mr-8 transition-colors duration-200
                        ${l.action ? 'cursor-pointer hover:text-theme-text-primary underline decoration-dotted' : 'text-theme-text-muted'}
                    `}
                    >
                        <span className={l.type === 'error' ? 'text-theme-danger' : l.type === 'success' ? 'text-theme-success' : 'text-theme-info'}>
                            [{l.time}]
                        </span> {l.msg} {l.action && <i className="fa-solid fa-arrow-pointer ml-1 text-[8px] opacity-70"></i>}
                    </span>
                ))}
            </div>
        </div>
    );
});

export default NewsTicker;
