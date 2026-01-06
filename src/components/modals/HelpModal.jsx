import React, { useState } from 'react';
import { CONFIG, GAME_VERSION } from '../../config/gameConfig';
import Button from '../Button';

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

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-2 md:p-4 text-white animate-in fade-in duration-200">
            <div className="bg-[#0f1012] border border-white/10 w-full max-w-4xl max-h-[95vh] md:h-[700px] rounded-xl md:rounded-2xl flex flex-col md:flex-row overflow-hidden shadow-2xl relative">

                {/* Background Glitch Effect */}
                <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat opacity-[0.03]"></div>

                {/* SIDEBAR */}
                <div className="w-full md:w-60 bg-black/40 border-b md:border-b-0 md:border-r border-white/5 p-3 md:p-4 flex flex-col gap-2 shrink-0 z-10">
                    <h2 className="text-xl font-black uppercase tracking-tighter text-zinc-500 mb-4 pl-2 flex items-center gap-2">
                        <i className="fa-solid fa-book-journal-whills"></i> Handbook
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-1 gap-1 md:space-y-1">
                        {tabs.map(tab => (
                            <Button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                variant="ghost"
                                className={`w-full !justify-start gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all text-left ${activeTab === tab.id
                                    ? '!bg-white/10 !text-white border-l-2 !border-emerald-500 shadow-lg'
                                    : '!text-zinc-500 hover:!text-zinc-300'
                                    }`}
                            >
                                <i className={`fa-solid ${tab.icon} w-5 text-center`}></i>
                                <span>{tab.label}</span>
                            </Button>
                        ))}
                    </div>
                    <div className="hidden md:block mt-auto pt-4 border-t border-white/5 px-2">
                        <div className="text-[10px] text-zinc-600 font-mono">
                            SYSTEM: <span className="text-emerald-500">ONLINE</span><br />
                            VER: <span className="text-zinc-400">{GAME_VERSION}</span> [Year 1 Edition]
                        </div>
                    </div>
                    <div className="mt-2 md:mt-4 pt-2 md:pt-4 border-t border-white/5">
                        <Button onClick={onClose} className="w-full py-3 text-xs" variant="neutral">Close Handbook</Button>
                    </div>
                </div>

                {/* CONTENT CONTAINER */}
                <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar bg-gradient-to-br from-[#0f1012] to-[#050505] relative z-10 font-mono">

                    {/* 1. THE WELCOME */}
                    {activeTab === 'welcome' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300 max-w-2xl">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">Velkommen til <span className="text-emerald-500">Underverdenen</span>.</h1>
                                <p className="text-lg text-zinc-400 leading-relaxed font-sans">
                                    Du troede det skulle være nemt? At lave skejs på gaden? <br />
                                    Glem det. Dette er ikke et spil. Det er en <b>økonomisk simulation</b> af organiseret kriminalitet.
                                </p>
                            </div>
                            <div className="p-6 bg-emerald-900/10 border-l-4 border-emerald-500 rounded-r-lg">
                                <h3 className="text-emerald-400 font-bold uppercase text-sm mb-2">Dit Mål</h3>
                                <p className="text-sm text-zinc-300">
                                    Start med ingenting på Nørrebrogade. Byg et imperium der styrer hele København.
                                    <br />
                                    Du skal balancere tre valutaer: <span className="text-white font-bold">Penge</span>, <span className="text-red-500 font-bold">Heat</span> og <span className="text-purple-500 font-bold">Respekt</span>.
                                </p>
                            </div>
                            <p className="text-sm text-zinc-500 italic">
                                "Rigtige gangstere bruger ikke våben. De bruger regneark." — Sultanen
                            </p>
                        </div>
                    )}

                    {/* 2. THE MECHANICS */}
                    {activeTab === 'mechanics' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">System Core</h2>
                                <p className="text-zinc-400 text-sm">Sådan overlever du hverdagen.</p>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <h3 className="text-emerald-400 font-bold text-sm uppercase border-b border-emerald-500/20 pb-1">1. Sultan (The Hub)</h3>
                                    <p className="text-xs text-zinc-400">
                                        Din mentor og mission-giver. Tjek <b>News Feed</b> for markedstendenser (f.eks. "Roskilde Festival" = højere priser).
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-amber-400 font-bold text-sm uppercase border-b border-amber-500/20 pb-1">2. Produktion & Salg</h3>
                                    <p className="text-xs text-zinc-400">
                                        Gå til <b>Produktion</b> for at lave varer. Hash er sikkert, Coke er profitabelt.
                                        Ansæt <b>Pushere</b> i <b>Organisation</b> for at sælge automatisk.
                                        <br />
                                        Følg din <b>Live Assistant</b> (HUD nederst til højre) for næste trin.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-blue-400 font-bold text-sm uppercase border-b border-blue-500/20 pb-1">3. Finans & Hvidvask</h3>
                                    <p className="text-xs text-zinc-400">
                                        <b>Sorte Penge</b> kan bruges til løn og bestikkelse.
                                        <b>Rene Penge</b> (hvidvaskede) bruges til investeringer og fast ejendom.
                                        Brug <b>Revisorer</b> eller <b>Krypto</b> (BTC/XMR) til at vaske pengene.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. THE MATH */}
                    {activeTab === 'math' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">The Algorithm</h2>
                                <p className="text-zinc-400 text-sm">For the brains. Her er matematikken bag systemet.</p>
                            </div>

                            <div className="bg-black/40 p-6 rounded-xl border border-white/5 font-mono text-xs space-y-6">
                                <div>
                                    <span className="text-purple-400 block mb-2 font-bold">// EKPONENTIALT OMKOSTNINGS-SKALERING</span>
                                    <div className="bg-zinc-900 p-3 rounded text-zinc-300">
                                        Cost(n) = BaseCost * (GrowthFactor ^ CurrentCount)
                                    </div>
                                    <p className="mt-2 text-zinc-500">
                                        GrowthFactor varierer fra 1.15 (Junkies) til 2.5 (Cyber-Security).
                                        Det betyder, at du aldrig kan "købe alt". Du skal vælge din strategi.
                                    </p>
                                </div>

                                <div>
                                    <span className="text-red-400 block mb-2 font-bold">// HEAT ALGORITMEN</span>
                                    <div className="bg-zinc-900 p-3 rounded text-zinc-300">
                                        HeatGen = (BaseGain * Activity) * (1 - DefenseBuffs)
                                    </div>
                                    <p className="mt-2 text-zinc-500">
                                        Heat falder passivt baseret på: <code className="text-white">1.0 + (Lawyers * 0.15)</code>.
                                        Hvis Heat rammer 100, mister du 25% af din cash. I <b>Hardcore Mode</b> slettes dit save permanent.
                                    </p>
                                </div>

                                <div>
                                    <span className="text-blue-400 block mb-2 font-bold">// MIDDLEMAN FEE (MELLEMMAND)</span>
                                    <div className="bg-zinc-900 p-3 rounded text-zinc-300">
                                        BribeCost = DirtyCash(50k) + CleanCash(Cost * 0.10)
                                    </div>
                                    <p className="mt-2 text-zinc-500">
                                        Du kan ikke bestikke strømere kun med narkopenge. Du skal bruge "rene" forbindelser.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 4. STREET SMARTS (STRATEGY) */}
                    {activeTab === 'strategy' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Street Smarts</h2>
                                <p className="text-zinc-400 text-sm">Tre veje til toppen. Vælg din stil.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-zinc-900/40 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-all group">
                                    <div className="text-emerald-500 text-2xl mb-3"><i className="fa-solid fa-bolt"></i></div>
                                    <h3 className="font-bold text-white mb-2">The Hustler</h3>
                                    <p className="text-[10px] text-zinc-400 leading-relaxed">
                                        <b>Stil:</b> Aktiv & Aggressiv.
                                        <br />
                                        Klik hurtigt. Køb mange små enheder (Hash/Piller). Hold Heat lavt ved konstant at sælge små mængder.
                                        Ignorer langsigtede investeringer.
                                    </p>
                                </div>

                                <div className="p-4 bg-zinc-900/40 rounded-xl border border-white/5 hover:border-purple-500/30 transition-all group">
                                    <div className="text-purple-500 text-2xl mb-3"><i className="fa-solid fa-chess-king"></i></div>
                                    <h3 className="font-bold text-white mb-2">The Kingpin</h3>
                                    <p className="text-[10px] text-zinc-400 leading-relaxed">
                                        <b>Stil:</b> Passiv & Skalerende.
                                        <br />
                                        Rush til Level 10. Brug <b>Revisorer</b> til at automatisere alt.
                                        Køb <b>Hellerup</b> territoriet for ren indkomst og lad spillet køre i baggrunden mens du tjener millioner.
                                    </p>
                                </div>

                                <div className="p-4 bg-zinc-900/40 rounded-xl border border-white/5 hover:border-zinc-500/30 transition-all group">
                                    <div className="text-zinc-500 text-2xl mb-3"><i className="fa-solid fa-ghost"></i></div>
                                    <h3 className="font-bold text-white mb-2">The Ghost</h3>
                                    <p className="text-[10px] text-zinc-400 leading-relaxed">
                                        <b>Stil:</b> Stealth & Krypto.
                                        <br />
                                        Brug markedet. Køb Bitcoin når det crasher. Hold 0 Heat.
                                        Brug <b>Private Jet</b> og <b>Skygge Netværk</b> for aldrig at blive opdaget.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 5. APP & COMMUNITY (UPDATED) */}
                    {activeTab === 'social' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Community & App</h2>
                                <p className="text-zinc-400 text-sm">Tag gaden med dig i lommen.</p>
                            </div>

                            {/* NEW FEATURES GRID */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-5 bg-blue-900/10 border border-blue-500/30 rounded-xl">
                                    <h3 className="text-blue-400 font-bold uppercase text-sm mb-2"><i className="fa-solid fa-mobile-screen"></i> Installer Appen</h3>
                                    <p className="text-xs text-zinc-300 mb-2">
                                        Syndicate OS er nu en <b>PWA (Progressive Web App)</b>.
                                    </p>
                                    <ol className="list-decimal pl-4 text-xs text-zinc-400 space-y-1">
                                        <li>Åbn spillet i Chrome (Android) eller Safari (iOS).</li>
                                        <li>Tryk på "Menu" (tre prikker) eller "Del".</li>
                                        <li>Vælg <b>"Føj til Hjemmeskærm"</b>.</li>
                                    </ol>
                                    <div className="mt-3 text-[10px] text-blue-500 italic">Nu kan du spille offline i bussen uden browser-bar!</div>
                                </div>

                                <div className="p-5 bg-purple-900/10 border border-purple-500/30 rounded-xl">
                                    <h3 className="text-purple-400 font-bold uppercase text-sm mb-2"><i className="fa-solid fa-users"></i> Gang Wars (BETA)</h3>
                                    <p className="text-xs text-zinc-300 mb-2">
                                        Du kan nu kæmpe mod dine venner asynkront.
                                    </p>
                                    <ul className="list-disc pl-4 text-xs text-zinc-400 space-y-1">
                                        <li>Gå til <b>Underverdenen (Rivals)</b> fanen.</li>
                                        <li>Længere nede finder du <b>Gang Wars</b> panelet.</li>
                                        <li>Kopier din kode eller indtast en ven's kode.</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="border-t border-white/5 pt-6">
                                <h3 className="font-bold text-white mb-4">Anmeldelser</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <blockquote className="p-4 bg-zinc-900/30 border-l-2 border-emerald-500">
                                        <p className="text-sm text-zinc-300 italic mb-2">"Det føles ægte. For ægte. Slangen, varmen, måden priserne stiger på når Roskilde starter. Det er som at være tilbage på pladsen."</p>
                                        <footer className="text-[10px] text-emerald-500 font-bold uppercase">— "The Ex-Kingpin", Blågårds Plads</footer>
                                    </blockquote>

                                    <blockquote className="p-4 bg-zinc-900/30 border-l-2 border-blue-500">
                                        <p className="text-sm text-zinc-300 italic mb-2">"Endelig et tycoon spil hvor matematikken holder. Økonomien balancerer perfekt på kanten af sammenbrud."</p>
                                        <footer className="text-[10px] text-blue-500 font-bold uppercase">— "System Architect", Silicon Valley</footer>
                                    </blockquote>

                                    <blockquote className="p-4 bg-zinc-900/30 border-l-2 border-amber-500">
                                        <p className="text-sm text-zinc-300 italic mb-2">"Jeg missede mit stop med metroen fordi jeg prøvede at crashe Bitcoin markedet. 10/10."</p>
                                        <footer className="text-[10px] text-amber-500 font-bold uppercase">— "The Commuter", Gamescom Demo</footer>
                                    </blockquote>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- KEYS --- */}
                    {activeTab === 'keys' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-3xl font-black text-white mb-2 italic">SYSTEM HOTKEYS</h2>
                                <p className="text-zinc-400">Naviger som en professionel hacker.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { k: '1', l: 'Gå til Laboratoriet (Produktion)' },
                                    { k: '2', l: 'Gå til Underverdenen (War Room)' },
                                    { k: '3', l: 'Gå til Finans (Krypto & Bank)' },
                                    { k: '4', l: 'Gå til Organisation (Personal)' },
                                    { k: '5', l: 'Gå til Imperiet (Prestige)' },
                                    { k: '6', l: 'Gå til Sultanen (Missioner)' },
                                    { k: 'ESC', l: 'Luk alle vinduer / Pause menu' },
                                ].map(item => (
                                    <div key={item.k} className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 flex justify-between items-center group hover:bg-zinc-800 transition-colors">
                                        <span className="text-zinc-400 font-bold text-[11px] uppercase tracking-wider">{item.l}</span>
                                        <kbd className="px-3 py-1.5 bg-zinc-950 rounded-lg text-sm font-black font-mono text-white shadow-lg border border-white/10 group-hover:border-emerald-500/50 transition-colors">
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
