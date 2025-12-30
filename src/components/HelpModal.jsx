import React from 'react';

const HelpModal = ({ onClose }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-white">
        <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black uppercase tracking-tighter">Syndikat Håndbog</h2>
                <button onClick={onClose}><i className="fa-solid fa-xmark text-xl text-zinc-500 hover:text-white"></i></button>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="text-emerald-400 font-bold uppercase text-sm mb-2">Core Loop</h3>
                    <p className="text-zinc-400 text-sm">Producer varer (Produktion) &rarr; Sælg for Sorte Penge (Gaden) &rarr; Vask til Ren Kapital (Finans) &rarr; Udvid Imperiet.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-indigo-400 font-bold uppercase text-sm mb-2">Genveje</h3>
                        <ul className="text-xs space-y-1 text-zinc-300 font-mono">
                            <li><span className="text-white">1-6</span> : Skift Fane</li>
                            <li><span className="text-white">ESC</span> : Luk Modaler</li>
                            <li><span className="text-white">SPACE</span> : Pause (Ikke implementeret)</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-amber-400 font-bold uppercase text-sm mb-2">Tips</h3>
                        <ul className="text-xs space-y-1 text-zinc-300">
                            <li>- Sorte penge tiltrækker Heat (Politi).</li>
                            <li>- Heat øger risikoen for Razzia.</li>
                            <li>- Køb upgrades for at sænke Heat.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center">
                <button onClick={onClose} className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-bold text-sm">FORSTÅET</button>
            </div>
        </div>
    </div>
);

export default HelpModal;
