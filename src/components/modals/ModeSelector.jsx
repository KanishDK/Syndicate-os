import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../context/LanguageContext';
import GlassCard from '../ui/GlassCard';
import ActionButton from '../ui/ActionButton';

const ModeSelector = ({ onSelectMode }) => {
    const { t } = useLanguage();
    const [selected, setSelected] = useState('story');

    // Hardcoded for now, could move to config
    const modes = [
        {
            id: 'story',
            title: 'modes.story.title',
            subtitle: 'modes.story.subtitle',
            desc: 'modes.story.desc',
            icon: 'fa-book-skull',
            color: 'emerald',
            difficulty: 'modes.story.difficulty'
        },
        {
            id: 'debt',
            title: 'modes.debt.title',
            subtitle: 'modes.debt.subtitle',
            desc: 'modes.debt.desc',
            icon: 'fa-hourglass-half',
            color: 'red',
            difficulty: 'modes.debt.difficulty'
        }
    ];

    const content = (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-500">
            <div className="max-w-4xl w-full">
                <h1 className="text-3xl md:text-5xl font-black text-center text-white mb-2 tracking-widest uppercase">{t('modes.select_title')}</h1>
                <p className="text-center text-zinc-500 mb-8 font-mono text-sm">{t('modes.select_subtitle')}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {modes.map(mode => (
                        <div
                            key={mode.id}
                            onClick={() => setSelected(mode.id)}
                            className={`
                                relative p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 overflow-hidden group
                                ${selected === mode.id
                                    ? `bg-${mode.color}-500/10 border-${mode.color}-500 shadow-[0_0_30px_rgba(0,0,0,0.5)] scale-105`
                                    : 'bg-zinc-900/50 border-white/10 hover:border-white/30 hover:bg-zinc-800'
                                }
                            `}
                        >
                            {/* Background Glow */}
                            {selected === mode.id && (
                                <div className={`absolute inset-0 bg-${mode.color}-500/5 animate-pulse pointer-events-none`} />
                            )}

                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl bg-black/40 border border-white/10
                                    ${selected === mode.id ? `text-${mode.color}-400` : 'text-zinc-500 group-hover:text-white'}
                                `}>
                                    <i className={`fa-solid ${mode.icon}`}></i>
                                </div>
                                <div className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider border
                                    ${selected === mode.id
                                        ? `bg-${mode.color}-500/20 text-${mode.color}-400 border-${mode.color}-500/50`
                                        : 'bg-black/40 text-zinc-500 border-white/5'
                                    }
                                `}>
                                    {t(mode.difficulty)}
                                </div>
                            </div>

                            <h2 className={`text-2xl font-black uppercase tracking-wide mb-1 transition-colors
                                ${selected === mode.id ? 'text-white' : 'text-zinc-400 group-hover:text-white'}
                            `}>
                                {t(mode.title)}
                            </h2>
                            <h3 className={`text-xs font-bold uppercase tracking-wider mb-4
                                ${selected === mode.id ? `text-${mode.color}-400` : 'text-zinc-600'}
                            `}>
                                {t(mode.subtitle)}
                            </h3>

                            <p className="text-sm text-zinc-400 leading-relaxed font-mono">
                                {t(mode.desc)}
                            </p>

                            {/* Selection Indicator */}
                            <div className={`mt-6 flex items-center gap-2 font-bold text-xs uppercase tracking-widest transition-all
                                ${selected === mode.id ? `text-${mode.color}-400` : 'text-zinc-700 opacity-0 group-hover:opacity-100'}
                            `}>
                                {selected === mode.id ? <><i className="fa-solid fa-circle-check"></i> {t('modes.selected')}</> : t('modes.click_to_select')}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-center">
                    <ActionButton
                        onClick={() => onSelectMode(selected)}
                        variant={selected === 'debt' ? 'danger' : 'success'}
                        className="w-full md:w-auto md:min-w-[300px] py-4 text-xl"
                    >
                        {t('modes.start_game')} <i className="fa-solid fa-arrow-right ml-2"></i>
                    </ActionButton>
                </div>
            </div>
        </div>
    );

    return createPortal(content, document.body);
};

export default ModeSelector;
