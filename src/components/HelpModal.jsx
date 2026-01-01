import React, { useState } from 'react';
import { CONFIG, GAME_VERSION } from '../config/gameConfig';

const HelpModal = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState('basics');

    const tabs = [
        { id: 'basics', icon: 'fa-book', label: 'Start Guide' },
        { id: 'missions', icon: 'fa-envelope', label: 'Sultanen (Missions)' },
        { id: 'management', icon: 'fa-briefcase', label: 'Drift & HR' },
        { id: 'network', icon: 'fa-skull-crossbones', label: 'Underverdenen' },
        { id: 'finance', icon: 'fa-vault', label: 'Finans & Krypto' },
        { id: 'empire', icon: 'fa-crown', label: 'Imperiet' },
        { id: 'keys', icon: 'fa-keyboard', label: 'Genveje' },
        { id: 'master', icon: 'fa-shield-halved', label: 'Grand Master Info' },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 md:p-4 text-white animate-in fade-in duration-200">
            <div className="bg-[#0f1012] border border-white/10 w-full max-w-4xl max-h-[95vh] md:h-[700px] rounded-xl md:rounded-2xl flex flex-col md:flex-row overflow-hidden shadow-2xl">

                {/* SIDEBAR */}
                <div className="w-full md:w-56 bg-black/40 border-b md:border-b-0 md:border-r border-white/5 p-3 md:p-4 flex flex-col gap-2 shrink-0">
                    <h2 className="text-lg md:text-xl font-black uppercase tracking-tighter text-zinc-500 mb-2 md:mb-4 pl-2 flex items-center gap-2">
                        <i className="fa-solid fa-circle-info"></i> Håndbog
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-1 gap-1 md:space-y-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 md:py-2.5 rounded-lg text-[10px] md:text-xs font-bold transition-all text-left ${activeTab === tab.id
                                    ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_-5px_rgba(52,211,153,0.2)]'
                                    : 'text-zinc-500 active:text-zinc-300 active:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <i className={`fa-solid ${tab.icon} w-4 md:w-5 text-center`}></i>
                                <span className="hidden md:inline">{tab.label}</span>
                                <span className="md:hidden text-[9px]">{tab.label.split(' ')[0]}</span>
                            </button>
                        ))}
                    </div>
                    <div className="hidden md:block mt-auto pt-4 border-t border-white/5 text-[10px] text-zinc-600 text-center uppercase tracking-widest font-bold">
                        Syndicate OS {GAME_VERSION}
                    </div>
                    <div className="mt-2 md:mt-4 pt-2 md:pt-4 border-t border-white/5">
                        <button onClick={onClose} className="w-full py-2 md:py-3 bg-zinc-800 active:bg-zinc-700 text-zinc-300 font-bold rounded-lg text-[10px] md:text-xs uppercase transition-colors">Luk Håndbog</button>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar bg-gradient-to-br from-[#0f1012] to-[#0a0a0c]">

                    {/* --- BASICS --- */}
                    {activeTab === 'basics' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-3xl font-black text-white mb-2 italic">VELKOMMEN TIL SYNDIKATET, EMPIRE-BUILDER.</h2>
                                <p className="text-zinc-400 leading-relaxed max-w-2xl">
                                    Du har fået adgang til byens mest avancerede operativsystem for kriminelle. Dit mål er enkelt:
                                    Byg et imperium, overlev politiet, og dominer Københavns gader.
                                    <b> Alt starter i dit laboratorium.</b>
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-zinc-900/40 p-5 rounded-xl border border-white/5 hover:border-emerald-500/20 transition-colors">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-900/20 text-emerald-400 flex items-center justify-center mb-3">
                                        <i className="fa-solid fa-flask text-lg"></i>
                                    </div>
                                    <h3 className="text-emerald-400 font-bold uppercase text-sm mb-2">1. Produktion & Kvalitet</h3>
                                    <p className="text-zinc-500 text-xs leading-relaxed">
                                        Ansæt <strong>Gartnere</strong> eller <strong>Kemikere</strong> for at skabe varer.
                                        Hver enhed har en produktionsomkostning. Hvis du løber tør for kontanter, stopper maskinerne.
                                        Husk at opgradere dit <b>Lager</b> (Boxit-rum) for at undgå flaskehalse.
                                    </p>
                                </div>

                                <div className="bg-zinc-900/40 p-5 rounded-xl border border-white/5 hover:border-amber-500/20 transition-colors">
                                    <div className="w-10 h-10 rounded-lg bg-amber-900/20 text-amber-400 flex items-center justify-center mb-3">
                                        <i className="fa-solid fa-sack-dollar text-lg"></i>
                                    </div>
                                    <h3 className="text-amber-400 font-bold uppercase text-sm mb-2">2. Gadesalg & Heat</h3>
                                    <p className="text-zinc-500 text-xs leading-relaxed">
                                        Varer på lageret er værdiløse. Ansæt <strong>Pushere</strong> til at tømme lageret.
                                        Salg giver <strong className="text-amber-500">Sorte Penge</strong>.
                                        Hvert salg øger dit <strong className="text-red-500">Heat</strong>. Høj varme betyder hyppigere politikontrol og Razziaer.
                                    </p>
                                </div>

                                <div className="bg-zinc-900/40 p-5 rounded-xl border border-white/5 hover:border-blue-500/20 transition-colors">
                                    <div className="w-10 h-10 rounded-lg bg-blue-900/20 text-blue-400 flex items-center justify-center mb-3">
                                        <i className="fa-solid fa-soap text-lg"></i>
                                    </div>
                                    <h3 className="text-blue-400 font-bold uppercase text-sm mb-2">3. Det Finansielle Loop</h3>
                                    <p className="text-zinc-500 text-xs leading-relaxed">
                                        Sorte penge kan ikke bruges til legale opgraderinger. Gå til <strong>Finans</strong> for at hvidvaske dem.
                                        Standard-raten er {CONFIG.launderingRate * 100}% (30% tab).
                                        Invester i <b>Front-butikker</b> for at forbedre denne rate markant.
                                    </p>
                                </div>

                                <div className="bg-zinc-900/40 p-5 rounded-xl border border-white/5 hover:border-purple-500/20 transition-colors">
                                    <div className="w-10 h-10 rounded-lg bg-purple-900/20 text-purple-400 flex items-center justify-center mb-3">
                                        <i className="fa-solid fa-crown text-lg"></i>
                                    </div>
                                    <h3 className="text-purple-400 font-bold uppercase text-sm mb-2">4. Ekspansion & Magt</h3>
                                    <p className="text-zinc-500 text-xs leading-relaxed">
                                        Når du har <b>Ren Kapital</b>, kan du købe <strong>Territorier</strong> i Underverdenen.
                                        Disse giver passiv indkomst hver time. City og Hellerup giver endda Rene Penge direkte!
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- MISSIONS --- */}
                    {activeTab === 'missions' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-3xl font-black text-white mb-2 italic">SULTANEN: DIN MENTOR</h2>
                                <p className="text-zinc-400 leading-relaxed max-w-2xl">
                                    Sultanen sidder i sin kiosk og ser alt. Han er din vej ind i varmen. Følg hans ordrer for at stige i graderne.
                                </p>
                            </div>

                            <div className="bg-black/20 p-6 rounded-xl border border-white/5">
                                <ul className="space-y-4">
                                    <li className="flex gap-4">
                                        <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center shrink-0 border border-white/10 text-xl">🚀</div>
                                        <div>
                                            <h4 className="text-white font-bold text-sm">Progression via Storyline</h4>
                                            <p className="text-zinc-500 text-[11px] mt-1">
                                                Gennemfør <b>20 unikke story-missions</b> for at nå slutspillet. Hver mission introducerer nye mekanikker som Smugling, Advokater og Kartel-drift.
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center shrink-0 border border-white/10 text-xl">🎯</div>
                                        <div>
                                            <h4 className="text-white font-bold text-sm">Daglige Kontrakter</h4>
                                            <p className="text-zinc-500 text-[11px] mt-1">
                                                Færdiggør daglige opgaver for massive pengebeløb og XP-boosts. Gå aldrig glip af en dag, hvis du vil være øverst i fødekæden.
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center shrink-0 border border-white/10 text-xl">⚠️</div>
                                        <div>
                                            <h4 className="text-white font-bold text-sm">Sultanens Tjenester</h4>
                                            <p className="text-zinc-500 text-[11px] mt-1">
                                                Brug Sultanen til at <b>Bestikke Politiet</b> (Nulstiller Heat) eller <b>Skab Hype</b> (Øger salgspriser). Det koster, men det redder dit liv når osten er for tæt på.
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* --- MANAGEMENT --- */}
                    {activeTab === 'management' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-3xl font-black text-white mb-2 italic">ORGANISATION & MANDSKAB</h2>
                                <p className="text-zinc-400 leading-relaxed">
                                    Et imperium er kun så stærkt som dets folk. Men husk: De er loyale så længe du betaler.
                                </p>
                            </div>

                            <div className="bg-zinc-900/60 p-5 rounded-2xl border border-emerald-500/10 space-y-4">
                                <h3 className="text-emerald-400 font-black uppercase text-xs tracking-widest">Mandskabs-typer</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                                        <span className="block text-white font-bold text-sm mb-1">Zombies</span>
                                        <p className="text-[10px] text-zinc-500">De billigste ansatte. Kräver ingen løn, men dør oftest ved politi-razziaer.</p>
                                    </div>
                                    <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                                        <span className="block text-white font-bold text-sm mb-1">Lønede Ansatte</span>
                                        <p className="text-[10px] text-zinc-500">Gartnere, Pushere, Bagmænd. Kræver løn hvert 5. minut.</p>
                                    </div>
                                    <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                                        <span className="block text-white font-bold text-sm mb-1">Revisorer</span>
                                        <p className="text-[10px] text-zinc-500">Vasker automatisk en procentdel af dine penge pr. sekund.</p>
                                    </div>
                                    <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                                        <span className="block text-white font-bold text-sm mb-1">Advokater</span>
                                        <p className="text-[10px] text-zinc-500">Reducerer passivt dit Heat-niveau. Essentielle i endgame.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-red-900/20 p-5 rounded-xl border border-red-500/20">
                                <h3 className="text-red-400 font-bold uppercase text-sm mb-2 flex items-center gap-2">
                                    <i className="fa-solid fa-triangle-exclamation"></i> LØN & STREJKE (VIGTIGT)
                                </h3>
                                <p className="text-zinc-400 text-xs leading-relaxed">
                                    Dine ansatte skal have løn hvert {CONFIG.payroll.salaryInterval / 60000}. minut.
                                    <br /><br />
                                    Hvis du ikke har <b>Rene Penge</b>, tager de fra din <b>Sorte Beholdning</b> (men med et risikogebyr på +50%!).
                                    Hvis kassen er helt tom, går de i <b>Strejke</b>. Al produktion stopper, og du kan kun genstarte dem ved at betale din gæld under Finans-fanen.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* --- UNDERVERDENEN (NETWORK) --- */}
                    {activeTab === 'network' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-3xl font-black text-white mb-2 italic">WAR ROOM: UNDERVERDENEN</h2>
                                <p className="text-zinc-400 leading-relaxed">
                                    Velkommen til den mørke side. Her kæmper vi ikke med budgetter, men med pistoler og territorier.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="bg-zinc-900/50 p-5 rounded-xl border border-white/5 group hover:border-amber-500/20 transition-all">
                                    <div className="flex gap-4">
                                        <i className="fa-solid fa-map-location-dot text-2xl text-amber-500"></i>
                                        <div>
                                            <h3 className="text-white font-bold">Dominer København</h3>
                                            <p className="text-zinc-500 text-xs mt-1">
                                                Køb territorier (Staden, Nørrebro, etc.) for at sikre din magt.
                                                Hvert territorie giver <b>passiv indkomst</b>.
                                                Jo højere level dit territorie er, jo mere tjener du pr. tick.
                                                City og Hellerup er kronjuvelerne - de genererer <b>Rene Penge</b> helt lovligt.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-zinc-900/50 p-5 rounded-xl border border-white/5 group hover:border-red-500/20 transition-all">
                                    <div className="flex gap-4">
                                        <i className="fa-solid fa-skull-crossbones text-2xl text-red-500"></i>
                                        <div>
                                            <h3 className="text-white font-bold">Rivalernes Vrede</h3>
                                            <p className="text-zinc-500 text-xs mt-1">
                                                Rivaler hader din succes. Deres <b>Hostility</b> stiger løbende.
                                                Høj fjendtlighed betyder:
                                                <ul className="list-disc list-inside mt-2 text-[10px] space-y-1">
                                                    <li>Drive-by attacks mod dine pushere.</li>
                                                    <li>Sabotage af dine territorier (fjerner indkomst).</li>
                                                    <li>Brug 'Sabotage' eller 'Angrib' for at holde deres vrede nede.</li>
                                                </ul>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-zinc-900/50 p-5 rounded-xl border border-white/5 group hover:border-blue-500/20 transition-all">
                                    <div className="flex gap-4">
                                        <i className="fa-solid fa-tower-observation text-2xl text-blue-500"></i>
                                        <div>
                                            <h3 className="text-white font-bold">Forsvarsværker</h3>
                                            <p className="text-zinc-500 text-xs mt-1">
                                                Byg <b>Vagtværn</b>, opsæt <b>Skygge-Øjne</b> (overvågning) eller konstruer et <b>Safehouse</b>.
                                                Dette giver dig <b>Defense Points</b>, som absorberer skade under angreb og minimerer tab ved Razziaer.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- FINANCE & CRYPTO --- */}
                    {activeTab === 'finance' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-3xl font-black text-white mb-2 italic">SORT BØRS & KRYPTO</h2>
                                <p className="text-zinc-400 leading-relaxed">
                                    Penge er bare tal på en skærm. Gør dem utilgængelige for staten.
                                </p>
                            </div>

                            <div className="bg-zinc-950 p-6 rounded-2xl border border-indigo-500/20">
                                <h3 className="text-indigo-400 font-black uppercase text-xs mb-4 flex items-center gap-2">
                                    <i className="fa-brands fa-bitcoin"></i> Markedsoversigt
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-white font-bold">Bitcoin (BTC)</span>
                                        <span className="text-zinc-500 italic">Lav volatilitet - Digitalt Guld</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-white font-bold">Ethereum (ETH)</span>
                                        <span className="text-zinc-500 italic">Mellem volatilitet - Smart Contracts</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-white font-bold">Monero (XMR)</span>
                                        <span className="text-zinc-500 italic">Høj volatilitet - 100% Anonym</span>
                                    </div>
                                </div>
                                <p className="mt-6 text-[11px] text-zinc-500 italic border-t border-white/5 pt-4">
                                    <b>Strategi:</b> Køb med Sorte Penge når kursen er rød. Sælg når den er grøn og modtag Rene Penge direkte.
                                    Det er den bedste måde at hvidvaske uden at bruge Sultanen!
                                </p>
                            </div>
                        </div>
                    )}

                    {/* --- EMPIRE (PRESTIGE) --- */}
                    {activeTab === 'empire' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-3xl font-black text-white mb-2 italic">ENDGAME: EXIT SCAM</h2>
                                <p className="text-zinc-400 leading-relaxed">
                                    Hver legende har en slutning. Spørgsmålet er, hvor mange penge du har lagt til side inden da.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-purple-900/20 p-6 rounded-2xl border border-purple-500/30">
                                    <h3 className="text-purple-400 font-black uppercase text-lg mb-2">Hvad er en Exit Scam?</h3>
                                    <p className="text-zinc-300 text-sm leading-relaxed">
                                        Når dit imperium bliver for stort til at håndtere, eller du har gennemført alle missioner, kan du lave en <b>Exit Scam</b>.
                                        Du forsvinder med alt hvad du ejer, nulstiller verden, men vender tilbage med en permanent <b>Multiplier</b>.
                                    </p>
                                    <div className="mt-4 p-3 bg-black/40 rounded border border-purple-500/10 font-mono text-xs text-purple-300/80">
                                        Indkomst Multiplier = Math.sqrt(LifetimeEarnings) * 1.5
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-zinc-900/60 rounded-xl border border-white/5">
                                        <span className="block text-amber-500 font-bold text-sm mb-1 italic">Du mister:</span>
                                        <p className="text-[10px] text-zinc-500 leading-tight">Nuværende pengebeholdning, alt mandskab, alle territorier, varelager og basale opgraderinger.</p>
                                    </div>
                                    <div className="p-4 bg-zinc-900/60 rounded-xl border border-white/5">
                                        <span className="block text-emerald-500 font-bold text-sm mb-1 italic">Du beholder:</span>
                                        <p className="text-[10px] text-zinc-500 leading-tight">Achievements, Karriere-statistikker, Din prestige multiplier og alle Perks købt via Prestige-systemet.</p>
                                    </div>
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

                    {/* --- GRAND MASTER --- */}
                    {activeTab === 'master' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-3xl font-black text-amber-500 mb-2 italic">GRAND MASTER CERTIFICATION</h2>
                                <p className="text-zinc-400">Denne version (v1.0.2) er auditeret af 100 eksperter for maksimal stabilitet.</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="bg-emerald-900/10 border border-emerald-500/20 p-5 rounded-xl">
                                    <h3 className="text-emerald-400 font-bold mb-2">🛡️ Data Sikkerhed</h3>
                                    <p className="text-xs text-zinc-500 leading-relaxed">
                                        Spillet force-saver nu automatisk hvis du opdaterer siden, lukker fanen eller crasher.
                                        Dine fremskridt er beskyttet af <b>Iron-Clad Persistence</b>.
                                    </p>
                                </div>
                                <div className="bg-blue-900/10 border border-blue-500/20 p-5 rounded-xl">
                                    <h3 className="text-blue-400 font-bold mb-2">⚙️ Deterministisk Engine</h3>
                                    <p className="text-xs text-zinc-500 leading-relaxed">
                                        Alle tilfældige hændelser (News, Raids, Heat) er nu uafhængige af din FPS.
                                        Spillet kører præcis lige hurtigt på en 144Hz gamer-skærm og en gammel mobil.
                                    </p>
                                </div>
                                <div className="bg-red-900/10 border border-red-500/20 p-5 rounded-xl">
                                    <h3 className="text-red-400 font-bold mb-2">🔥 Heat Stabilization</h3>
                                    <p className="text-xs text-zinc-500 leading-relaxed">
                                        Vi har implementeret en Heat-cap på 500. Det betyder du stadig lever livet farligt,
                                        men systemet crasher aldrig under massive bulk-salg i endgame.
                                    </p>
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
