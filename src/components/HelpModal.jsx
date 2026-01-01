import React, { useState } from 'react';

const HelpModal = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState('basics');

    const tabs = [
        { id: 'basics', icon: 'fa-book', label: 'Grundbog' },
        { id: 'network', icon: 'fa-globe', label: 'Territorier' },
        { id: 'crypto', icon: 'fa-bitcoin', label: 'Krypto' },
        { id: 'keys', icon: 'fa-keyboard', label: 'Genveje' },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-white animate-in fade-in duration-200">
            <div className="bg-[#0f1012] border border-white/10 w-full max-w-3xl h-[600px] rounded-2xl flex overflow-hidden shadow-2xl">

                {/* SIDEBAR */}
                <div className="w-48 bg-black/40 border-r border-white/5 p-4 flex flex-col gap-2">
                    <h2 className="text-xl font-black uppercase tracking-tighter text-zinc-500 mb-4 pl-2">Håndbog</h2>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-emerald-600/20 text-emerald-400' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
                        >
                            <i className={`fa-brands ${tab.icon} w-5 text-center`}></i>
                            {tab.label}
                        </button>
                    ))}
                    <div className="mt-auto pt-4 border-t border-white/5">
                        <button onClick={onClose} className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-lg text-xs uppercase">Luk</button>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                    {activeTab === 'basics' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <h2 className="text-2xl font-black text-white mb-4">Core Loop</h2>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                                    <h3 className="text-emerald-400 font-bold uppercase text-sm mb-2">1. Produktion</h3>
                                    <p className="text-zinc-400 text-sm">Alt starter i <strong className="text-white">Laboratoriet</strong>. Ansæt junkies og kemikere til at producere varer. Varer sælges automatisk af Pushere og Dealers.</p>
                                </div>
                                <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                                    <h3 className="text-amber-400 font-bold uppercase text-sm mb-2">2. Sorte Penge & Heat</h3>
                                    <p className="text-zinc-400 text-sm">Salg giver <strong className="text-amber-500">Sorte Penge</strong>. Men pas på! Mere salg giver mere <strong className="text-red-500">Heat</strong> (Politi risk).</p>
                                    <p className="text-zinc-500 text-xs mt-2 italic">Højt Heat øger risikoen for Razzia, hvor du mister alt på lageret.</p>
                                </div>
                                <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                                    <h3 className="text-blue-400 font-bold uppercase text-sm mb-2">3. Hvidvask</h3>
                                    <p className="text-zinc-400 text-sm">Brug <strong className="text-white">Finans</strong> fanen til at hvidvaske pengene gennem Revisorer. Kun Ren Kapital kan bruges til at købe ejendomme og betale mandskab.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'network' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <h2 className="text-2xl font-black text-white mb-4">Gaden & Territorier</h2>
                            <p className="text-zinc-400 text-sm mb-6">Syndikatet lever af territorier. Køb dem for at få passiv indkomst og respekt.</p>

                            <div className="space-y-4">
                                <div className="flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded bg-amber-900/20 text-amber-500 flex items-center justify-center shrink-0"><i className="fa-solid fa-map"></i></div>
                                    <div>
                                        <h4 className="font-bold text-white">Investment Levels</h4>
                                        <p className="text-sm text-zinc-400">Territorier kan opgraderes. Hvert level giver <strong className="text-emerald-400">+50% indkomst</strong>. Det betaler sig at fokusere på få, stærke områder.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded bg-red-900/20 text-red-500 flex items-center justify-center shrink-0"><i className="fa-solid fa-skull"></i></div>
                                    <div>
                                        <h4 className="font-bold text-white">Rivaler</h4>
                                        <p className="text-sm text-zinc-400">Dine rivaler sover aldrig. Hold øje med <strong className="text-red-400">Hostility</strong>. Hvis den når 100%, angriber de. Brug Sabotage til at holde dem nede.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'crypto' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <h2 className="text-2xl font-black text-white mb-4">Crypto Trading</h2>
                            <div className="p-4 bg-indigo-900/20 rounded-xl border border-indigo-500/20 mb-6">
                                <h3 className="text-indigo-400 font-bold mb-2">Buy Low, Sell High</h3>
                                <p className="text-sm text-indigo-200">Krypto markedet svinger hvert 10. sekund. Brug <strong className="text-white">Sparklines</strong> (graferne) til at spotte trends.</p>
                            </div>

                            <ul className="space-y-2 text-sm text-zinc-400">
                                <li><strong>Bitcoin (BTC):</strong> Sikker havn. Langsomme svingninger.</li>
                                <li><strong>Ethereum (ETH):</strong> Høj volatilitet. Smart contracts.</li>
                                <li><strong>Monero (XMR):</strong> Sortbørshandlernes favorit. Stabil men risikabel.</li>
                            </ul>
                        </div>
                    )}

                    {activeTab === 'keys' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <h2 className="text-2xl font-black text-white mb-4">Tastatur Genveje</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-zinc-900 p-4 rounded-lg flex justify-between items-center">
                                    <span className="text-zinc-400 text-sm">Produktion</span>
                                    <kbd className="px-2 py-1 bg-zinc-800 rounded text-xs font-mono text-white">1</kbd>
                                </div>
                                <div className="bg-zinc-900 p-4 rounded-lg flex justify-between items-center">
                                    <span className="text-zinc-400 text-sm">Gaden (Network)</span>
                                    <kbd className="px-2 py-1 bg-zinc-800 rounded text-xs font-mono text-white">2</kbd>
                                </div>
                                <div className="bg-zinc-900 p-4 rounded-lg flex justify-between items-center">
                                    <span className="text-zinc-400 text-sm">Finans</span>
                                    <kbd className="px-2 py-1 bg-zinc-800 rounded text-xs font-mono text-white">3</kbd>
                                </div>
                                <div className="bg-zinc-900 p-4 rounded-lg flex justify-between items-center">
                                    <span className="text-zinc-400 text-sm">Operationer</span>
                                    <kbd className="px-2 py-1 bg-zinc-800 rounded text-xs font-mono text-white">4</kbd>
                                </div>
                                <div className="bg-zinc-900 p-4 rounded-lg flex justify-between items-center">
                                    <span className="text-zinc-400 text-sm">Imperiet</span>
                                    <kbd className="px-2 py-1 bg-zinc-800 rounded text-xs font-mono text-white">5</kbd>
                                </div>
                                <div className="bg-zinc-900 p-4 rounded-lg flex justify-between items-center">
                                    <span className="text-zinc-400 text-sm">Sultan (Missions)</span>
                                    <kbd className="px-2 py-1 bg-zinc-800 rounded text-xs font-mono text-white">6</kbd>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default HelpModal;
