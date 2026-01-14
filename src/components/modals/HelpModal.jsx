import React, { useState } from 'react';
import { CONFIG, GAME_VERSION } from '../../config/gameConfig';
import Button from '../Button';
import { useFocusTrap } from '../../hooks/useFocusTrap';

const HelpModal = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState('welcome');

    const tabs = [
        { id: 'welcome', icon: 'fa-hand-fist', label: 'Listen up, Rookie' },
        { id: 'mechanics', icon: 'fa-book-skull', label: 'How to Survive' },
        { id: 'math', icon: 'fa-calculator', label: 'The Math' },
        { id: 'strategy', icon: 'fa-chess', label: 'Street Smarts' },
        { id: 'social', icon: 'fa-comments', label: 'App & Community' },
        { id: 'keys', icon: 'fa-keyboard', label: 'System Keys' },
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
                className="bg-theme-surface-base border border-theme-border-subtle w-full max-w-4xl max-h-[95vh] md:h-[700px] rounded-xl md:rounded-2xl flex flex-col md:flex-row overflow-hidden shadow-2xl relative"
                role="dialog"
                aria-modal="true"
                aria-labelledby="help-title"
            >

                {/* Background Glitch Effect */}
                <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat opacity-[0.03]"></div>

                {/* SIDEBAR */}
                <div className="w-full md:w-60 bg-theme-surface-elevated border-b md:border-b-0 md:border-r border-theme-border-subtle p-3 md:p-4 flex flex-col gap-2 shrink-0 z-10">
                    <h2 id="help-title" className="text-xl font-black uppercase tracking-tighter text-theme-text-muted mb-4 pl-2 flex items-center gap-2">
                        <i className="fa-solid fa-book-journal-whills"></i> Handbook
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-1 gap-1 md:space-y-1">
                        {tabs.map(tab => (
                            <Button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                variant="ghost"
                                className={`w-full !justify-start gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all text-left ${activeTab === tab.id
                                    ? '!bg-theme-surface-highlight !text-theme-text-primary border-l-2 !border-theme-primary shadow-lg'
                                    : '!text-theme-text-muted hover:!text-theme-text-secondary'
                                    }`}
                            >
                                <i className={`fa-solid ${tab.icon} w-5 text-center`}></i>
                                <span>{tab.label}</span>
                            </Button>
                        ))}
                    </div>
                    <div className="hidden md:block mt-auto pt-4 border-t border-theme-border-subtle px-2">
                        <div className="text-[10px] text-theme-text-muted font-mono">
                            SYSTEM: <span className="text-theme-success">ONLINE</span><br />
                            VER: <span className="text-theme-text-muted">{GAME_VERSION}</span> [Year 1 Edition]
                        </div>
                    </div>
                    <div className="mt-2 md:mt-4 pt-2 md:pt-4 border-t border-theme-border-subtle">
                        <Button onClick={onClose} className="w-full py-3 text-xs" variant="neutral">Close Handbook</Button>
                    </div>
                </div>

                {/* CONTENT CONTAINER */}
                <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar bg-theme-surface-base relative z-10 font-mono">

                    {/* 1. THE WELCOME */}
                    {activeTab === 'welcome' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300 max-w-2xl">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black text-theme-text-primary mb-4 tracking-tighter">Welcome to the <span className="text-theme-primary">Underworld</span>.</h1>
                                <p className="text-lg text-theme-text-secondary leading-relaxed font-sans">
                                    You thought it would be easy? Making money on the streets? <br />
                                    Forget it. This isn't a game. It's an <b>economic simulation</b> of organized crime.
                                </p>
                            </div>
                            <div className="p-6 bg-theme-primary/10 border-l-4 border-theme-primary rounded-r-lg">
                                <h3 className="text-theme-primary font-bold uppercase text-sm mb-2">Your Goal</h3>
                                <p className="text-sm text-theme-text-secondary">
                                    Start with nothing on Nørrebrogade. Build an empire that controls all of Copenhagen.
                                    <br />
                                    You must balance three currencies: <span className="text-theme-text-primary font-bold">Money</span>, <span className="text-theme-danger font-bold">Heat</span>, and <span className="text-theme-warning font-bold">Respect</span>.
                                </p>
                            </div>
                            <p className="text-sm text-theme-text-muted italic">
                                "Real gangsters don't use weapons. They use spreadsheets." — The Sultan
                            </p>
                        </div>
                    )}

                    {/* 2. THE MECHANICS */}
                    {activeTab === 'mechanics' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-3xl font-black text-theme-text-primary mb-2 uppercase tracking-tight">System Core</h2>
                                <p className="text-theme-text-muted text-sm">How to survive the daily grind.</p>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <h3 className="text-theme-success font-bold text-sm uppercase border-b border-theme-success/20 pb-1">1. Sultan (The Hub)</h3>
                                    <p className="text-xs text-theme-text-muted">
                                        Your mentor and mission provider. Check <b>News Feed</b> for market trends (e.g., "Roskilde Festival" = higher prices).
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-theme-warning font-bold text-sm uppercase border-b border-theme-warning/20 pb-1">2. Production & Sales</h3>
                                    <p className="text-xs text-theme-text-muted">
                                        Go to <b>Production</b> to make goods. Hash is safe, Coke is profitable.
                                        Hire <b>Pushers</b> in <b>Operations</b> to sell automatically.
                                        <br />
                                        Follow your <b>Live Assistant</b> (HUD bottom right) for next steps.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-theme-accent font-bold text-sm uppercase border-b border-theme-accent/20 pb-1">3. Finance & Laundering</h3>
                                    <p className="text-xs text-theme-text-muted">
                                        <b>Dirty Money</b> can be used for salaries and bribes.
                                        <b>Clean Money</b> (laundered) is used for investments and real estate.
                                        Use <b>Accountants</b> or <b>Crypto</b> (BTC/XMR) to launder money.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-blue-400 font-bold text-sm uppercase border-b border-blue-400/20 pb-1">4. Territory Specialization</h3>
                                    <p className="text-xs text-theme-text-muted">
                                        When a territory reaches <b>Level 5</b>, you can choose a specialization:
                                        <br />
                                        <span className="text-theme-success font-bold">SafeHouse:</span> +25% Defense.
                                        <br />
                                        <span className="text-theme-primary font-bold">Front:</span> Reduces Global Heat Generation (-10%).
                                        <br />
                                        <span className="text-theme-warning font-bold">Warehouse:</span> +100 extra storage capacity per level.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. THE MATH */}
                    {activeTab === 'math' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-3xl font-black text-theme-text-primary mb-2 uppercase tracking-tight">The Algorithm</h2>
                                <p className="text-theme-text-secondary text-sm">For the brains. Here's the math behind the system.</p>
                            </div>

                            <div className="bg-theme-surface-elevated p-6 rounded-xl border border-theme-border-subtle font-mono text-xs space-y-6">
                                <div>
                                    <span className="text-theme-warning block mb-2 font-bold">// EXPONENTIAL COST SCALING</span>
                                    <div className="bg-theme-surface-elevated p-3 rounded text-theme-text-secondary">
                                        Cost(n) = BaseCost * (GrowthFactor ^ CurrentCount)
                                    </div>
                                    <p className="mt-2 text-theme-text-muted">
                                        GrowthFactor varies from 1.15 (Junkies) to 2.5 (Cyber-Security).
                                        This means you can never "buy everything". You must choose your strategy.
                                    </p>
                                </div>

                                <div>
                                    <span className="text-theme-danger block mb-2 font-bold">// HEAT ALGORITHM</span>
                                    <div className="bg-theme-surface-elevated p-3 rounded text-theme-text-secondary">
                                        HeatGen = (BaseGain * Activity) * (1 - DefenseBuffs)
                                    </div>
                                    <p className="mt-2 text-theme-text-muted">
                                        Heat decays passively based on: <code className="text-theme-text-primary">1.0 + (Lawyers * 0.15)</code>.
                                        If Heat reaches 100, you lose 25% of your cash. In <b>Hardcore Mode</b>, your save is permanently deleted.
                                    </p>
                                </div>

                                <div>
                                    <span className="text-theme-text-secondary block mb-2 font-bold">// MIDDLEMAN FEE</span>
                                    <div className="bg-theme-surface-elevated p-3 rounded text-theme-text-secondary">
                                        BribeCost = DirtyCash(50k) + CleanCash(Cost * 0.10)
                                    </div>
                                    <p className="mt-2 text-theme-text-muted">
                                        You can't bribe cops with drug money alone. You need "clean" connections.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 4. STREET SMARTS (STRATEGY) */}
                    {activeTab === 'strategy' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-3xl font-black text-theme-text-primary mb-2 uppercase tracking-tight">Street Smarts</h2>
                                <p className="text-theme-text-muted text-sm">Three paths to the top. Choose your style.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-theme-surface-elevated rounded-xl border border-theme-border-subtle hover:border-theme-primary/30 transition-all group">
                                    <div className="text-theme-primary text-2xl mb-3"><i className="fa-solid fa-bolt"></i></div>
                                    <h3 className="font-bold text-theme-text-primary mb-2">The Hustler</h3>
                                    <p className="text-[10px] text-theme-text-secondary leading-relaxed">
                                        <b>Style:</b> Active & Aggressive.
                                        <br />
                                        Click fast. Buy many small units (Hash/Pills). Keep Heat low by constantly selling small amounts.
                                        Ignore long-term investments.
                                    </p>
                                </div>

                                <div className="p-4 bg-theme-surface-elevated rounded-xl border border-theme-border-subtle hover:border-theme-warning/30 transition-all group">
                                    <div className="text-theme-warning text-2xl mb-3"><i className="fa-solid fa-chess-king"></i></div>
                                    <h3 className="font-bold text-theme-text-primary mb-2">The Kingpin</h3>
                                    <p className="text-[10px] text-theme-text-secondary leading-relaxed">
                                        <b>Style:</b> Passive & Scaling.
                                        <br />
                                        Rush to Level 10. Use <b>Accountants</b> to automate everything.
                                        Buy <b>Hellerup</b> territory for clean income and let the game run in the background while you earn millions.
                                    </p>
                                </div>

                                <div className="p-4 bg-theme-surface-elevated rounded-xl border border-theme-border-subtle hover:border-theme-text-muted/30 transition-all group">
                                    <div className="text-theme-text-muted text-2xl mb-3"><i className="fa-solid fa-ghost"></i></div>
                                    <h3 className="font-bold text-theme-text-primary mb-2">The Ghost</h3>
                                    <p className="text-[10px] text-theme-text-secondary leading-relaxed">
                                        <b>Style:</b> Stealth & Crypto.
                                        <br />
                                        Play the market. Buy Bitcoin when it crashes. Keep 0 Heat.
                                        Use <b>Private Jet</b> and <b>Shadow Network</b> to never get caught.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 5. APP & COMMUNITY (UPDATED) */}
                    {activeTab === 'social' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-3xl font-black text-theme-text-primary mb-2 uppercase tracking-tight">Community & App</h2>
                                <p className="text-theme-text-muted text-sm">Take the streets with you in your pocket.</p>
                            </div>

                            {/* NEW FEATURES GRID */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-5 bg-theme-accent/10 border border-theme-accent/30 rounded-xl">
                                    <h3 className="text-theme-accent font-bold uppercase text-sm mb-2"><i className="fa-solid fa-mobile-screen"></i> Install the App</h3>
                                    <p className="text-xs text-theme-text-secondary mb-2">
                                        Syndicate OS is now a <b>PWA (Progressive Web App)</b>.
                                    </p>
                                    <ol className="list-decimal pl-4 text-xs text-theme-text-secondary space-y-1">
                                        <li>Open the game in Chrome (Android) or Safari (iOS).</li>
                                        <li>Tap "Menu" (three dots) or "Share".</li>
                                        <li>Select <b>"Add to Home Screen"</b>.</li>
                                    </ol>
                                    <div className="mt-3 text-[10px] text-theme-accent italic">Now you can play offline on the bus without the browser bar!</div>
                                </div>

                                <div className="p-5 bg-theme-secondary/10 border border-theme-secondary/30 rounded-xl">
                                    <h3 className="text-theme-secondary font-bold uppercase text-sm mb-2"><i className="fa-solid fa-users"></i> Gang Wars (BETA)</h3>
                                    <p className="text-xs text-theme-text-secondary mb-2">
                                        You can now fight your friends asynchronously.
                                    </p>
                                    <ul className="list-disc pl-4 text-xs text-theme-text-secondary space-y-1">
                                        <li>Go to <b>Underworld (Rivals)</b> tab.</li>
                                        <li>Scroll down to find the <b>Gang Wars</b> panel.</li>
                                        <li>Copy your code or enter a friend's code.</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="border-t border-theme-border-subtle pt-6">
                                <h3 className="font-bold text-theme-text-primary mb-4">Reviews</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <blockquote className="p-4 bg-theme-surface-elevated border-l-2 border-theme-success">
                                        <p className="text-sm text-theme-text-secondary italic mb-2">"Det føles ægte. For ægte. Slangen, varmen, måden priserne stiger på når Roskilde starter. Det er som at være tilbage på pladsen."</p>
                                        <footer className="text-[10px] text-theme-success font-bold uppercase">— "The Ex-Kingpin", Blågårds Plads</footer>
                                    </blockquote>

                                    <blockquote className="p-4 bg-theme-surface-elevated border-l-2 border-theme-accent">
                                        <p className="text-sm text-theme-text-secondary italic mb-2">"Endelig et tycoon spil hvor matematikken holder. Økonomien balancerer perfekt på kanten af sammenbrud."</p>
                                        <footer className="text-[10px] text-theme-accent font-bold uppercase">— "System Architect", Silicon Valley</footer>
                                    </blockquote>

                                    <blockquote className="p-4 bg-theme-surface-elevated border-l-2 border-theme-warning">
                                        <p className="text-sm text-theme-text-secondary italic mb-2">"Jeg missede mit stop med metroen fordi jeg prøvede at crashe Bitcoin markedet. 10/10."</p>
                                        <footer className="text-[10px] text-theme-warning font-bold uppercase">— "The Commuter", Gamescom Demo</footer>
                                    </blockquote>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- KEYS --- */}
                    {activeTab === 'keys' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-3xl font-black text-theme-text-primary mb-2 italic">SYSTEM HOTKEYS</h2>
                                <p className="text-theme-text-muted">Navigate like a professional hacker.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { k: '1', l: 'Go to The Lab (Production)' },
                                    { k: '2', l: 'Go to Underworld (War Room)' },
                                    { k: '3', l: 'Go to Finance (Crypto & Bank)' },
                                    { k: '4', l: 'Go to Operations (Personnel)' },
                                    { k: '5', l: 'Go to Empire (Prestige)' },
                                    { k: '6', l: 'Go to The Sultan (Missions)' },
                                    { k: 'ESC', l: 'Close all windows / Pause menu' },
                                ].map(item => (
                                    <div key={item.k} className="bg-theme-surface-elevated p-4 rounded-xl border border-theme-border-subtle flex justify-between items-center group hover:bg-theme-surface-highlight transition-colors">
                                        <span className="text-theme-text-secondary font-bold text-[11px] uppercase tracking-wider">{item.l}</span>
                                        <kbd className="px-3 py-1.5 bg-theme-bg-secondary rounded-lg text-sm font-black font-mono text-white shadow-lg border border-white/10 group-hover:border-theme-primary/50 transition-colors">
                                            {item.k}
                                        </kbd>
                                    </div>
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
