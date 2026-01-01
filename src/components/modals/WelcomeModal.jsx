import React from 'react';

const WelcomeModal = ({ data, onClose }) => {
    if (!data) return null;

    const hasProduction = Object.keys(data.produced || {}).length > 0;
    const hasRaids = (data.raids?.attempted || 0) > 0;
    const totalNet = (data.earnings + data.cleanEarnings) - data.salaryPaid - (data.raids?.moneyLost || 0);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="bg-zinc-900 border border-zinc-700 p-0 rounded-sm max-w-md w-full shadow-2xl overflow-hidden relative">

                {/* RECEIPT TOP EDGE (Visual) */}
                <div className="h-2 bg-zinc-800 bg-[linear-gradient(45deg,transparent_75%,#000_75%),linear-gradient(-45deg,transparent_75%,#000_75%)] bg-[length:10px_10px]"></div>

                <div className="p-6 font-mono text-sm text-zinc-300">
                    <div className="text-center mb-6 border-b border-zinc-700 pb-4 border-dashed">
                        <h2 className="text-xl font-black text-white uppercase tracking-widest mb-1">DRIFTSRAPPORT</h2>
                        <p className="text-xs text-zinc-500">{new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}</p>
                        <p className="text-xs text-zinc-500 mt-1">Gade Tid: {data.time} minutter</p>
                    </div>

                    {/* SECTION: PRODUCTION */}
                    {hasProduction && (
                        <div className="mb-4 text-xs">
                            <div className="uppercase font-bold text-zinc-500 mb-1 border-b border-zinc-700 border-dashed">Produktion & Lager</div>
                            {Object.entries(data.produced).map(([item, count]) => (
                                <div key={item} className="flex justify-between py-0.5">
                                    <span>{item.toUpperCase()}</span>
                                    <span>x{count.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* SECTION: SECURITY */}
                    {hasRaids && (
                        <div className="mb-4 text-xs">
                            <div className="uppercase font-bold text-zinc-500 mb-1 border-b border-zinc-700 border-dashed">Sikkerhed</div>
                            <div className="flex justify-between py-0.5 text-zinc-400">
                                <span>Razziaer</span>
                                <span>{data.raids.attempted}</span>
                            </div>
                            <div className="flex justify-between py-0.5 text-emerald-400">
                                <span>Afværget</span>
                                <span>{data.raids.defended}</span>
                            </div>
                            {data.raids.lost > 0 && (
                                <div className="flex justify-between py-0.5 text-red-500 font-bold">
                                    <span>MISLYKKEDES</span>
                                    <span>{data.raids.lost} (-{data.raids.moneyLost.toLocaleString()} kr)</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* SECTION: FINANCIALS */}
                    <div className="mb-6">
                        <div className="uppercase font-bold text-zinc-500 mb-1 border-b border-zinc-700 border-dashed">Regnskab</div>

                        <div className="flex justify-between py-0.5 mt-1 text-zinc-400">
                            <span>Sorte Penge (Gade)</span>
                            <span>+{Math.floor(data.earnings).toLocaleString()} kr</span>
                        </div>
                        <div className="flex justify-between py-0.5 text-zinc-400">
                            <span>Hvide Penge (Legalt)</span>
                            <span>+{Math.floor(data.cleanEarnings).toLocaleString()} kr</span>
                        </div>

                        {data.laundered > 0 && (
                            <div className="flex justify-between py-0.5 text-blue-400 text-[10px] italic">
                                <span>↳ Heraf Hvidvasket</span>
                                <span>{Math.floor(data.laundered).toLocaleString()} kr</span>
                            </div>
                        )}

                        {data.salaryPaid > 0 && (
                            <div className="flex justify-between py-0.5 text-red-400">
                                <span>Lønninger</span>
                                <span>-{Math.floor(data.salaryPaid).toLocaleString()} kr</span>
                            </div>
                        )}

                        {data.interest > 0 && (
                            <div className="flex justify-between py-0.5 text-red-400">
                                <span>Renter (Gæld)</span>
                                <span>-{Math.floor(data.interest).toLocaleString()} kr</span>
                            </div>
                        )}

                        <div className="border-t border-zinc-500 border-dashed my-2"></div>

                        <div className="flex justify-between py-1 text-lg font-bold text-white">
                            <span>NETTO</span>
                            <span className={totalNet >= 0 ? 'text-emerald-400' : 'text-red-500'}>
                                {totalNet > 0 ? '+' : ''}{Math.floor(totalNet).toLocaleString()} kr
                            </span>
                        </div>
                    </div>

                    <button onClick={onClose} className="w-full py-3 bg-zinc-200 active:bg-white text-black font-black uppercase tracking-widest text-xs rounded transition-colors active:scale-95">
                        GODKEND RAPPORT
                    </button>

                    <div className="text-center mt-4 text-[10px] text-zinc-600 font-serif italic">
                        "Forretning er forretning." — Sultanen
                    </div>
                </div>

                {/* RECEIPT BOTTOM EDGE */}
                <div className="h-2 bg-zinc-900 bg-[linear-gradient(135deg,transparent_75%,#000_75%),linear-gradient(-135deg,transparent_75%,#000_75%)] bg-[length:10px_10px] rotate-180"></div>
            </div>
        </div>
    );
};

export default WelcomeModal;
