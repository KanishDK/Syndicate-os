import React, { useState } from 'react';
import { CONFIG, GAME_VERSION } from '../../config/gameConfig';
import { useLanguage } from '../../context/LanguageContext';
import ActionButton from '../ui/ActionButton';
import GlassCard from '../ui/GlassCard';
import { useFocusTrap } from '../../hooks/useFocusTrap';

const HelpModal = ({ onClose }) => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('welcome');

    const tabs = [
        { id: 'welcome', icon: 'fa-hand-fist', label: t('help.sidebar.welcome') },
        { id: 'mechanics', icon: 'fa-book-skull', label: t('help.sidebar.mechanics') },
        { id: 'quickref', icon: 'fa-list-check', label: t('help.sidebar.quickref') },
        { id: 'faq', icon: 'fa-question-circle', label: t('help.sidebar.faq') },
        { id: 'strategy', icon: 'fa-chess', label: t('help.sidebar.strategy') },
        { id: 'math', icon: 'fa-calculator', label: t('help.sidebar.math') },
        { id: 'tools', icon: 'fa-wrench', label: t('help.sidebar.tools') },
        { id: 'troubleshooting', icon: 'fa-life-ring', label: t('help.sidebar.troubleshooting') },
        { id: 'social', icon: 'fa-comments', label: t('help.sidebar.social') },
        { id: 'updates', icon: 'fa-scroll', label: t('help.sidebar.updates') },
        { id: 'keys', icon: 'fa-keyboard', label: t('help.sidebar.keys') },
    ];

    // Apply focus trap for accessibility
    const modalRef = useFocusTrap(true);

    // ESC key support
    React.useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-theme-surface-overlay backdrop-blur-md p-2 md:p-4 text-theme-text-primary animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                ref={modalRef}
                onClick={(e) => e.stopPropagation()}
                className="bg-theme-surface-base border border-theme-border-subtle w-full max-w-4xl max-h-[95vh] md:h-[700px] rounded-xl md:rounded-2xl flex flex-col md:flex-row overflow-hidden shadow-2xl relative m-2"
                role="dialog"
                aria-modal="true"
                aria-labelledby="help-title"
            >

                {/* Background Glitch Effect */}
                <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat opacity-[0.03]"></div>

                {/* SIDEBAR */}
                <div className="w-full md:w-64 bg-theme-surface-elevated border-b md:border-b-0 md:border-r border-theme-border-subtle p-3 md:p-4 flex flex-col shrink-0 z-10 overflow-x-auto md:overflow-y-auto">
                    <h2 id="help-title" className="text-lg md:text-xl font-black uppercase tracking-tighter text-theme-text-muted mb-2 md:mb-4 pl-2 flex items-center gap-2">
                        <i className="fa-solid fa-book-journal-whills"></i> {t('help.sidebar.title')}
                    </h2>
                    <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 gap-1 md:space-y-1 scrollbar-hide">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`whitespace-nowrap md:whitespace-normal flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all text-left ${activeTab === tab.id
                                    ? 'bg-theme-surface-highlight text-theme-text-primary border-b-2 md:border-b-0 md:border-l-2 border-theme-primary shadow-lg'
                                    : 'text-theme-text-muted hover:text-theme-text-secondary hover:bg-white/5'
                                    }`}
                            >
                                <i className={`fa-solid ${tab.icon} w-5 text-center`}></i>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                    <div className="hidden md:block mt-auto pt-4 border-t border-theme-border-subtle px-2">
                        <div className="text-[10px] text-theme-text-muted font-mono">
                            {t('help.sidebar.system_status')}: <span className="text-theme-success">ONLINE</span><br />
                            VER: <span className="text-theme-text-muted">{GAME_VERSION}</span> [Platinum]
                        </div>
                    </div>
                    <div className="mt-2 md:mt-4 pt-2 md:pt-4 border-t border-theme-border-subtle">
                        <ActionButton onClick={onClose} className="w-full py-3 text-xs" variant="neutral">{t('help.sidebar.close_btn')}</ActionButton>
                    </div>
                </div>

                {/* CONTENT CONTAINER */}
                <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar bg-theme-surface-base relative z-10 font-mono">

                    {/* 1. THE WELCOME */}
                    {activeTab === 'welcome' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300 max-w-2xl">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black text-theme-text-primary mb-4 tracking-tighter" dangerouslySetInnerHTML={{ __html: t('help.welcome.title') }} />
                                <p className="text-lg text-theme-text-secondary leading-relaxed font-sans" dangerouslySetInnerHTML={{ __html: t('help.welcome.intro') }} />
                            </div>
                            <GlassCard className="p-6 border-l-4 border-l-theme-primary" variant="interactive">
                                <h3 className="text-theme-primary font-bold uppercase text-sm mb-2">{t('help.welcome.goal_title')}</h3>
                                <p className="text-sm text-theme-text-secondary" dangerouslySetInnerHTML={{ __html: t('help.welcome.goal_text') }} />
                            </GlassCard>
                            <p className="text-sm text-theme-text-muted italic">
                                {t('help.welcome.quote')}
                            </p>
                        </div>
                    )}

                    {/* 2. THE MECHANICS */}
                    {activeTab === 'mechanics' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-3xl font-black text-theme-text-primary mb-2 uppercase tracking-tight">{t('help.mechanics.title')}</h2>
                                <p className="text-theme-text-muted text-sm">{t('help.mechanics.subtitle')}</p>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <GlassCard className="p-4" variant="glass">
                                    <h3 className="text-theme-success font-bold text-sm uppercase border-b border-theme-success/20 pb-1 mb-2">{t('help.mechanics.sultan_title')}</h3>
                                    <p className="text-xs text-theme-text-muted" dangerouslySetInnerHTML={{ __html: t('help.mechanics.sultan_text') }} />
                                </GlassCard>
                                <GlassCard className="p-4" variant="glass">
                                    <h3 className="text-theme-warning font-bold text-sm uppercase border-b border-theme-warning/20 pb-1 mb-2">{t('help.mechanics.prod_title')}</h3>
                                    <p className="text-xs text-theme-text-muted" dangerouslySetInnerHTML={{ __html: t('help.mechanics.prod_text') }} />
                                </GlassCard>
                                <GlassCard className="p-4" variant="glass">
                                    <h3 className="text-theme-accent font-bold text-sm uppercase border-b border-theme-accent/20 pb-1 mb-2">{t('help.mechanics.fins_title')}</h3>
                                    <p className="text-xs text-theme-text-muted" dangerouslySetInnerHTML={{ __html: t('help.mechanics.fins_text') }} />
                                </GlassCard>
                                <GlassCard className="p-4" variant="glass">
                                    <h3 className="text-blue-400 font-bold text-sm uppercase border-b border-blue-400/20 pb-1 mb-2">{t('help.mechanics.spec_title')}</h3>
                                    <p className="text-xs text-theme-text-muted" dangerouslySetInnerHTML={{ __html: t('help.mechanics.spec_text') }} />
                                </GlassCard>
                            </div>
                        </div>
                    )}

                    {/* 3. THE MATH */}
                    {activeTab === 'math' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-3xl font-black text-theme-text-primary mb-2 uppercase tracking-tight">{t('help.math.title')}</h2>
                                <p className="text-theme-text-secondary text-sm">{t('help.math.subtitle')}</p>
                            </div>

                            <div className="font-mono text-xs space-y-6">
                                <GlassCard className="p-6" variant="glass">
                                    <span className="text-theme-warning block mb-2 font-bold">{t('help.math.cost_title')}</span>
                                    <div className="bg-black/30 p-3 rounded text-theme-text-secondary mb-2">
                                        {t('help.math.cost_formula')}
                                    </div>
                                    <p className="text-theme-text-muted">{t('help.math.cost_desc')}</p>
                                </GlassCard>

                                <GlassCard className="p-6" variant="glass">
                                    <span className="text-theme-danger block mb-2 font-bold">{t('help.math.heat_title')}</span>
                                    <div className="bg-black/30 p-3 rounded text-theme-text-secondary mb-2">
                                        {t('help.math.heat_formula')}
                                    </div>
                                    <p className="text-theme-text-muted" dangerouslySetInnerHTML={{ __html: t('help.math.heat_desc') }} />
                                </GlassCard>

                                <GlassCard className="p-6" variant="glass">
                                    <span className="text-theme-text-secondary block mb-2 font-bold">{t('help.math.fee_title')}</span>
                                    <div className="bg-black/30 p-3 rounded text-theme-text-secondary mb-2">
                                        {t('help.math.fee_formula')}
                                    </div>
                                    <p className="text-theme-text-muted">{t('help.math.fee_desc')}</p>
                                </GlassCard>
                            </div>
                        </div>
                    )}

                    {/* 4. STREET SMARTS (STRATEGY) */}
                    {activeTab === 'strategy' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-3xl font-black text-theme-text-primary mb-2 uppercase tracking-tight">{t('help.strategy.title')}</h2>
                                <p className="text-theme-text-muted text-sm">{t('help.strategy.subtitle')}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <GlassCard className="p-4 group h-full" variant="interactive">
                                    <div className="text-theme-primary text-2xl mb-3"><i className="fa-solid fa-bolt"></i></div>
                                    <h3 className="font-bold text-theme-text-primary mb-2">{t('help.strategy.hustler_title')}</h3>
                                    <p className="text-[10px] text-theme-text-secondary leading-relaxed" dangerouslySetInnerHTML={{ __html: t('help.strategy.hustler_desc') }} />
                                </GlassCard>

                                <GlassCard className="p-4 group h-full" variant="interactive">
                                    <div className="text-theme-warning text-2xl mb-3"><i className="fa-solid fa-chess-king"></i></div>
                                    <h3 className="font-bold text-theme-text-primary mb-2">{t('help.strategy.kingpin_title')}</h3>
                                    <p className="text-[10px] text-theme-text-secondary leading-relaxed" dangerouslySetInnerHTML={{ __html: t('help.strategy.kingpin_desc') }} />
                                </GlassCard>

                                <GlassCard className="p-4 group h-full" variant="interactive">
                                    <div className="text-theme-text-muted text-2xl mb-3"><i className="fa-solid fa-ghost"></i></div>
                                    <h3 className="font-bold text-theme-text-primary mb-2">{t('help.strategy.ghost_title')}</h3>
                                    <p className="text-[10px] text-theme-text-secondary leading-relaxed" dangerouslySetInnerHTML={{ __html: t('help.strategy.ghost_desc') }} />
                                </GlassCard>
                            </div>
                        </div>
                    )}

                    {/* QUICK REFERENCE */}
                    {activeTab === 'quickref' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-3xl font-black text-theme-text-primary mb-2 uppercase tracking-tight">{t('help.quickref.title')}</h2>
                                <p className="text-theme-text-muted text-sm">{t('help.quickref.subtitle')}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <GlassCard className="p-4" variant="glass">
                                    <h3 className="text-theme-danger font-bold text-sm uppercase mb-2">{t('help.quickref.heat_title')}</h3>
                                    <div className="font-mono text-xs space-y-1 text-theme-text-secondary">
                                        <div>0-299: <span className="text-theme-success">{t('help.quickref.heat_safe')}</span></div>
                                        <div>300-349: <span className="text-theme-warning">{t('help.quickref.heat_caution')}</span></div>
                                        <div>350-449: <span className="text-theme-danger">{t('help.quickref.heat_danger')}</span></div>
                                        <div>450+: <span className="text-red-500 font-bold">{t('help.quickref.heat_critical')}</span></div>
                                    </div>
                                </GlassCard>

                                <GlassCard className="p-4" variant="glass">
                                    <h3 className="text-theme-success font-bold text-sm uppercase mb-2">{t('help.quickref.wash_title')}</h3>
                                    <div className="font-mono text-xs space-y-1 text-theme-text-secondary">
                                        <div>Manual: <span className="text-theme-text-primary">{t('help.quickref.wash_manual')}</span></div>
                                        <div>Accountant: <span className="text-theme-success">{t('help.quickref.wash_accountant')}</span></div>
                                        <div>Crypto: <span className="text-theme-accent">{t('help.quickref.wash_crypto')}</span></div>
                                        <div>Sultan: <span className="text-theme-warning">{t('help.quickref.wash_sultan')}</span></div>
                                    </div>
                                </GlassCard>

                                <GlassCard className="p-4" variant="glass">
                                    <h3 className="text-theme-primary font-bold text-sm uppercase mb-2">{t('help.quickref.time_title')}</h3>
                                    <div className="font-mono text-xs space-y-1 text-theme-text-secondary">
                                        <div dangerouslySetInnerHTML={{ __html: `Payroll: ${t('help.quickref.time_payroll')}` }} />
                                        <div dangerouslySetInnerHTML={{ __html: `Territory Income: ${t('help.quickref.time_territory')}` }} />
                                        <div dangerouslySetInnerHTML={{ __html: `Staff Loyalty: ${t('help.quickref.time_loyalty')}` }} />
                                        <div dangerouslySetInnerHTML={{ __html: `Bank Interest: ${t('help.quickref.time_interest')}` }} />
                                    </div>
                                </GlassCard>

                                <GlassCard className="p-4" variant="glass">
                                    <h3 className="text-theme-warning font-bold text-sm uppercase mb-2">{t('help.quickref.milestone_title')}</h3>
                                    <div className="font-mono text-xs space-y-1 text-theme-text-secondary">
                                        <div dangerouslySetInnerHTML={{ __html: `Level 2: ${t('help.quickref.ms_lvl2')}` }} />
                                        <div dangerouslySetInnerHTML={{ __html: `Level 5: ${t('help.quickref.ms_lvl5')}` }} />
                                        <div dangerouslySetInnerHTML={{ __html: `Level 7: ${t('help.quickref.ms_lvl7')}` }} />
                                        <div dangerouslySetInnerHTML={{ __html: `Level 10: ${t('help.quickref.ms_lvl10')}` }} />
                                    </div>
                                </GlassCard>
                            </div>

                            <GlassCard className="p-4 border-l-4 border-theme-accent" variant="glass">
                                <h3 className="text-theme-accent font-bold text-sm uppercase mb-2">{t('help.quickref.tips_title')}</h3>
                                <ul className="list-disc pl-4 text-xs text-theme-text-secondary space-y-1">
                                    <li>{t('help.quickref.tip1')}</li>
                                    <li>{t('help.quickref.tip2')}</li>
                                    <li>{t('help.quickref.tip3')}</li>
                                    <li>{t('help.quickref.tip4')}</li>
                                    <li>{t('help.quickref.tip5')}</li>
                                </ul>
                            </GlassCard>
                        </div>
                    )}

                    {/* FAQ */}
                    {activeTab === 'faq' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-3xl font-black text-theme-text-primary mb-2 uppercase tracking-tight">{t('help.faq.title')}</h2>
                                <p className="text-theme-text-muted text-sm">{t('help.faq.subtitle')}</p>
                            </div>

                            <div className="space-y-4">
                                <GlassCard className="p-4" variant="glass">
                                    <h3 className="font-bold text-theme-text-primary text-sm mb-2">{t('help.faq.q1')}</h3>
                                    <p className="text-xs text-theme-text-secondary" dangerouslySetInnerHTML={{ __html: t('help.faq.a1') }} />
                                </GlassCard>

                                <GlassCard className="p-4" variant="glass">
                                    <h3 className="font-bold text-theme-text-primary text-sm mb-2">{t('help.faq.q2')}</h3>
                                    <p className="text-xs text-theme-text-secondary" dangerouslySetInnerHTML={{ __html: t('help.faq.a2') }} />
                                </GlassCard>

                                <GlassCard className="p-4" variant="glass">
                                    <h3 className="font-bold text-theme-text-primary text-sm mb-2">{t('help.faq.q3')}</h3>
                                    <p className="text-xs text-theme-text-secondary" dangerouslySetInnerHTML={{ __html: t('help.faq.a3') }} />
                                </GlassCard>

                                <GlassCard className="p-4" variant="glass">
                                    <h3 className="font-bold text-theme-text-primary text-sm mb-2">{t('help.faq.q4')}</h3>
                                    <p className="text-xs text-theme-text-secondary" dangerouslySetInnerHTML={{ __html: t('help.faq.a4') }} />
                                </GlassCard>

                                <GlassCard className="p-4" variant="glass">
                                    <h3 className="font-bold text-theme-text-primary text-sm mb-2">{t('help.faq.q5')}</h3>
                                    <p className="text-xs text-theme-text-secondary" dangerouslySetInnerHTML={{ __html: t('help.faq.a5') }} />
                                </GlassCard>

                                <GlassCard className="p-4" variant="glass">
                                    <h3 className="font-bold text-theme-text-primary text-sm mb-2">{t('help.faq.q6')}</h3>
                                    <p className="text-xs text-theme-text-secondary" dangerouslySetInnerHTML={{ __html: t('help.faq.a6') }} />
                                </GlassCard>
                            </div>
                        </div>
                    )}

                    {/* TOOLS & DEBUG */}\
                    {/* TOOLS & DEBUG */}
                    {activeTab === 'tools' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-3xl font-black text-theme-text-primary mb-2 uppercase tracking-tight">{t('help.tools.title')}</h2>
                                <p className="text-theme-text-muted text-sm">{t('help.tools.subtitle')}</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <GlassCard className="p-4" variant="glass">
                                    <h3 className="text-theme-primary font-bold text-sm uppercase mb-2">{t('help.tools.save_title')}</h3>
                                    <p className="text-xs text-theme-text-secondary mb-3">
                                        {t('help.tools.save_desc')}
                                    </p>
                                    <ul className="list-disc pl-4 text-xs text-theme-text-secondary space-y-1">
                                        <li dangerouslySetInnerHTML={{ __html: t('help.tools.save_li1') }} />
                                        <li dangerouslySetInnerHTML={{ __html: t('help.tools.save_li2') }} />
                                        <li dangerouslySetInnerHTML={{ __html: t('help.tools.save_li3') }} />
                                    </ul>
                                </GlassCard>

                                <GlassCard className="p-4" variant="glass">
                                    <h3 className="text-theme-warning font-bold text-sm uppercase mb-2">{t('help.tools.trouble_title')}</h3>
                                    <div className="text-xs text-theme-text-secondary space-y-2">
                                        <div dangerouslySetInnerHTML={{ __html: t('help.tools.trouble_li1') }} />
                                        <div dangerouslySetInnerHTML={{ __html: t('help.tools.trouble_li2') }} />
                                        <div dangerouslySetInnerHTML={{ __html: t('help.tools.trouble_li3') }} />
                                        <div dangerouslySetInnerHTML={{ __html: t('help.tools.trouble_li4') }} />
                                    </div>
                                </GlassCard>

                                <GlassCard className="p-4 border-l-4 border-theme-accent" variant="glass">
                                    <h3 className="text-theme-accent font-bold text-sm uppercase mb-2">{t('help.tools.mobile_title')}</h3>
                                    <ul className="list-disc pl-4 text-xs text-theme-text-secondary space-y-1">
                                        <li>{t('help.tools.mobile_li1')}</li>
                                        <li>{t('help.tools.mobile_li2')}</li>
                                        <li>{t('help.tools.mobile_li3')}</li>
                                        <li>{t('help.tools.mobile_li3')}</li>
                                    </ul>
                                </GlassCard>

                                <GlassCard className="p-4 border-l-4 border-theme-danger" variant="glass">
                                    <h3 className="text-theme-danger font-bold text-sm uppercase mb-2">{t('help.tools.warn_title')}</h3>
                                    <ul className="list-disc pl-4 text-xs text-theme-text-secondary space-y-1">
                                        <li>{t('help.tools.warn_desc')}</li>
                                    </ul>
                                </GlassCard>
                            </div>
                        </div>
                    )}

                    {/* TROUBLESHOOTING */}
                    {activeTab === 'troubleshooting' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-3xl font-black text-theme-text-primary mb-2 uppercase tracking-tight">{t('help.support.title')}</h2>
                                <p className="text-theme-text-muted text-sm">{t('help.support.subtitle')}</p>
                            </div>

                            <div className="space-y-4">
                                <GlassCard className="p-4 border-l-4 border-theme-primary" variant="glass">
                                    <h3 className="text-theme-primary font-bold text-sm uppercase mb-2">{t('help.support.docs_title')}</h3>
                                    <ul className="list-disc pl-4 text-xs text-theme-text-secondary space-y-1">
                                        <li dangerouslySetInnerHTML={{ __html: t('help.support.docs_li1') }} />
                                        <li dangerouslySetInnerHTML={{ __html: t('help.support.docs_li2') }} />
                                    </ul>
                                </GlassCard>

                                <GlassCard className="p-4" variant="glass">
                                    <h3 className="text-theme-success font-bold text-sm uppercase mb-2">{t('help.support.game_title')}</h3>
                                    <p className="text-xs text-theme-text-secondary mb-2">{t('help.support.game_intro')}</p>
                                    <ol className="list-decimal pl-4 text-xs text-theme-text-secondary space-y-1">
                                        <li dangerouslySetInnerHTML={{ __html: t('help.support.game_li1') }} />
                                        <li>{t('help.support.game_li2')}</li>
                                        <li>{t('help.support.game_li3')}</li>
                                    </ol>
                                </GlassCard>

                                <GlassCard className="p-4" variant="glass">
                                    <h3 className="text-theme-warning font-bold text-sm uppercase mb-2">{t('help.support.tech_title')}</h3>
                                    <div className="text-xs text-theme-text-secondary space-y-2">
                                        <div dangerouslySetInnerHTML={{ __html: t('help.support.tech_desc') }} />
                                    </div>
                                </GlassCard>

                                <GlassCard className="p-4 bg-theme-surface-highlight border border-theme-accent/30" variant="custom">
                                    <h3 className="text-theme-accent font-bold text-sm uppercase mb-2">{t('help.support.comm_title')}</h3>
                                    <p className="text-xs text-theme-text-secondary mb-2" dangerouslySetInnerHTML={{ __html: t('help.support.comm_desc', { version: GAME_VERSION }) }} />
                                </GlassCard>
                            </div>
                        </div>
                    )}

                    {/* 5. APP & COMMUNITY */}
                    {activeTab === 'social' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-3xl font-black text-theme-text-primary mb-2 uppercase tracking-tight">{t('help.community.title')}</h2>
                                <p className="text-theme-text-muted text-sm">{t('help.community.subtitle')}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <GlassCard className="p-5 border-theme-accent/30" variant="custom">
                                    <h3 className="text-theme-accent font-bold uppercase text-sm mb-2"><i className="fa-solid fa-mobile-screen"></i> {t('help.community.app_title')}</h3>
                                    <p className="text-xs text-theme-text-secondary mb-2" dangerouslySetInnerHTML={{ __html: t('help.community.app_desc') }} />
                                    <ol className="list-decimal pl-4 text-xs text-theme-text-secondary space-y-1">
                                        <li>{t('help.community.app_step1')}</li>
                                        <li>{t('help.community.app_step2')}</li>
                                        <li dangerouslySetInnerHTML={{ __html: t('help.community.app_step3') }} />
                                    </ol>
                                    <div className="mt-3 text-[10px] text-theme-accent italic">{t('help.community.app_note')}</div>
                                </GlassCard>

                                <GlassCard className="p-5 border-theme-secondary/30" variant="custom">
                                    <h3 className="text-theme-secondary font-bold uppercase text-sm mb-2"><i className="fa-solid fa-users"></i> {t('help.community.wars_title')}</h3>
                                    <p className="text-xs text-theme-text-secondary mb-2">
                                        {t('help.community.wars_desc')}
                                    </p>
                                </GlassCard>
                            </div>

                            <div className="border-t border-theme-border-subtle pt-6">
                                <h3 className="font-bold text-theme-text-primary mb-4">{t('help.community.reviews_title')}</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <blockquote className="p-4 bg-theme-surface-elevated border-l-2 border-theme-success">
                                        <p className="text-sm text-theme-text-secondary italic mb-2">{t('help.community.review1')}</p>
                                        <footer className="text-[10px] text-theme-success font-bold uppercase">— {t('help.community.review1_author')}</footer>
                                    </blockquote>

                                    <blockquote className="p-4 bg-theme-surface-elevated border-l-2 border-theme-accent">
                                        <p className="text-sm text-theme-text-secondary italic mb-2">{t('help.community.review2')}</p>
                                        <footer className="text-[10px] text-theme-accent font-bold uppercase">— {t('help.community.review2_author')}</footer>
                                    </blockquote>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 6. PLATINUM NOTES (NEW) */}
                    {activeTab === 'updates' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-3xl font-black text-theme-text-primary mb-2 uppercase tracking-tight">{t('help.updates.title')}</h2>
                                <p className="text-theme-text-muted text-sm">{t('help.updates.subtitle')}</p>
                            </div>

                            <div className="space-y-4">
                                <GlassCard className="p-5" variant="glass">
                                    <h3 className="text-lg font-black text-theme-text-primary mb-2">{t('help.updates.v_title')}</h3>
                                    <p className="text-sm text-theme-text-secondary">
                                        {t('help.updates.v_desc')}
                                    </p>
                                </GlassCard>

                                <GlassCard className="p-5" variant="glass">
                                    <h3 className="text-lg font-black text-theme-text-primary mb-2">{t('help.updates.plat_title')}</h3>
                                    <p className="text-sm text-theme-text-secondary">
                                        {t('help.updates.plat_desc')}
                                    </p>
                                </GlassCard>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <GlassCard className="p-4" variant="glass">
                                        <h4 className="font-bold text-theme-primary mb-2 uppercase text-xs">{t('help.updates.ui_title')}</h4>
                                        <ul className="space-y-1 text-xs text-theme-text-secondary list-disc pl-4">
                                            <li dangerouslySetInnerHTML={{ __html: t('help.updates.ui_li1') }} />
                                            <li dangerouslySetInnerHTML={{ __html: t('help.updates.ui_li2') }} />
                                        </ul>
                                    </GlassCard>

                                    <GlassCard className="p-4" variant="glass">
                                        <h4 className="font-bold text-theme-warning mb-2 uppercase text-xs">{t('help.updates.bal_title')}</h4>
                                        <ul className="space-y-1 text-xs text-theme-text-secondary list-disc pl-4">
                                            <li dangerouslySetInnerHTML={{ __html: t('help.updates.bal_li1') }} />
                                            <li dangerouslySetInnerHTML={{ __html: t('help.updates.bal_li2') }} />
                                        </ul>
                                    </GlassCard>
                                </div>

                                <GlassCard className="p-4 border-l-4 border-theme-success" variant="glass">
                                    <h4 className="font-bold text-theme-success mb-2 uppercase text-xs">{t('help.updates.fix_title')}</h4>
                                    <ul className="space-y-1 text-xs text-theme-text-secondary list-disc pl-4">
                                        <li>{t('help.updates.fix_li1')}</li>
                                        <li>{t('help.updates.fix_li2')}</li>
                                    </ul>
                                </GlassCard>
                            </div>
                        </div>
                    )}


                    {/* 7. KEYS */}
                    {activeTab === 'keys' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-3xl font-black text-theme-text-primary mb-2 italic">{t('help.keys.title')}</h2>
                                <p className="text-theme-text-muted">{t('help.keys.subtitle')}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { k: '1', l: t('help.keys.k1') },
                                    { k: '2', l: t('help.keys.k2') },
                                    { k: '3', l: t('help.keys.k3') },
                                    { k: '4', l: t('help.keys.k4') },
                                    { k: '5', l: t('help.keys.k5') },
                                    { k: '6', l: t('help.keys.k6') },
                                    { k: 'ESC', l: t('help.keys.esc') },
                                ].map(item => (
                                    <GlassCard key={item.k} className="p-4 flex justify-between items-center group transition-colors" variant="interactive">
                                        <span className="text-theme-text-secondary font-bold text-[11px] uppercase tracking-wider">{item.l}</span>
                                        <kbd className="px-3 py-1.5 bg-theme-bg-secondary rounded-lg text-sm font-black font-mono text-white shadow-lg border border-white/10 group-hover:border-theme-primary/50 transition-colors">
                                            {item.k}
                                        </kbd>
                                    </GlassCard>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default HelpModal;
