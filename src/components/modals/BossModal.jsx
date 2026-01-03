import React from 'react';
import Button from '../Button';

const BossModal = ({ boss, onAttack }) => {
    const [shake, setShake] = React.useState(false);
    const [floats, setFloats] = React.useState([]);

    const handleAttack = () => {
        setShake(true);
        setTimeout(() => setShake(false), 200);

        // Call onAttack with a callback to receive real damage dealt
        onAttack((damage, isCrit) => {
            const newFloat = {
                id: Date.now(),
                value: isCrit ? `CRIT! ${damage}` : `${damage}`,
                x: Math.random() * 40 + 30 + '%',
                y: Math.random() * 40 + 30 + '%',
                isCrit: isCrit
            };
            setFloats(prev => [...prev, newFloat]);
            setTimeout(() => setFloats(prev => prev.filter(f => f.id !== newFloat.id)), 800);
        });
    };

    const percent = (boss.hp / boss.maxHp) * 100;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-500">
            <div className={`glass p-8 rounded-2xl max-w-md w-full border-4 border-red-600 shadow-[0_0_150px_rgba(220,38,38,0.6)] text-center relative overflow-hidden transition-transform ${shake ? 'translate-x-[5px]' : ''}`}>
                {/* Floating Damage Text */}
                {floats.map(f => (
                    <div key={f.id} className={`absolute font-black pointer-events-none z-50 animate-bounce ${f.isCrit ? 'text-5xl text-yellow-400' : 'text-4xl text-white'}`} style={{ left: f.x, top: f.y, textShadow: f.isCrit ? '0 0 20px orange' : '0 0 10px red' }}>
                        {f.value}
                    </div>
                ))}

                <div className="absolute inset-0 bg-red-600/10 animate-pulse"></div>
                <div className="relative z-10">
                    <h2 className="text-4xl font-black uppercase tracking-widest text-red-500 mb-2 drop-shadow-lg">BOSS BATTLE</h2>
                    <div className="w-32 h-32 mx-auto bg-red-900/20 rounded-full border-4 border-red-500 flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(220,38,38,0.4)] relative">
                        <i className={`fa-solid fa-skull-crossbones text-6xl text-red-500 ${shake ? 'scale-110 text-white' : 'animate-bounce'}`}></i>
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

                    <Button
                        onClick={handleAttack}
                        variant="ghost"
                        className="w-full !py-6 !bg-red-600 active:!bg-red-500 !text-white font-black rounded-2xl uppercase tracking-[0.2em] text-2xl transition-all active:scale-95 shadow-xl border-b-8 border-red-800 active:border-b-0 active:translate-y-2 h-auto"
                    >
                        ANGRIB!
                    </Button>
                    <div className="mt-2 text-[10px] text-zinc-500">Klik hurtigt før han healer!</div>
                </div>
            </div>
        </div>
    );
};

export default BossModal;
