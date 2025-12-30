import React from 'react';

const BossModal = ({ boss, onAttack }) => {
    const percent = (boss.hp / boss.maxHp) * 100;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-500">
            <div className="glass p-8 rounded-2xl max-w-md w-full border-4 border-red-600 shadow-[0_0_150px_rgba(220,38,38,0.6)] text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-red-600/10 animate-pulse"></div>
                <div className="relative z-10">
                    <h2 className="text-4xl font-black uppercase tracking-widest text-red-500 mb-2 drop-shadow-lg shake-animation">BOSS BATTLE</h2>
                    <div className="w-32 h-32 mx-auto bg-red-900/20 rounded-full border-4 border-red-500 flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(220,38,38,0.4)] relative">
                        <i className="fa-solid fa-skull-crossbones text-6xl text-red-500 animate-bounce"></i>
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between text-xs font-bold uppercase text-red-400 mb-1">
                            <span>Boss HP</span>
                            <span>{Math.floor(boss.hp)} / {boss.maxHp}</span>
                        </div>
                        <div className="h-4 bg-red-900/50 rounded-full overflow-hidden border border-red-500/30">
                            <div className="h-full bg-red-500 transition-all duration-100 ease-out" style={{ width: `${percent}%` }}></div>
                        </div>
                    </div>

                    <p className="text-red-200 font-bold mb-8 text-sm">
                        "Du tror du kan tage min plads? Kom an!"
                    </p>

                    <button
                        onClick={onAttack}
                        className="w-full py-6 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl uppercase tracking-[0.2em] text-2xl transition-all active:scale-95 shadow-xl border-b-8 border-red-800 active:border-b-0 active:translate-y-2"
                    >
                        ANGRIB!
                    </button>
                    <div className="mt-2 text-[10px] text-zinc-500">Klik hurtigt før han healer!</div>
                </div>
            </div>
        </div>
    );
};

export default BossModal;
