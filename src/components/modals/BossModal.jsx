import React from 'react';
import Button from '../Button';
import { useLanguage } from '../../context/LanguageContext';
import { useFocusTrap } from '../../hooks/useFocusTrap';

const BossModal = ({ boss, onAttack, onRetreat }) => {
    const { t } = useLanguage();
    const [floats, setFloats] = React.useState([]);
    const counterRef = React.useRef(0);

    const handleAttack = () => {
        // Call onAttack with a callback to receive real damage dealt
        onAttack((damage, isCrit) => {
            counterRef.current += 1;
            const newFloat = {
                id: `${Date.now()}-${counterRef.current}`, // Unique key with counter
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

    // Apply focus trap for accessibility
    const modalRef = useFocusTrap(true);

    return (
        <div className={`absolute inset-0 z-50 flex items-center justify-center bg-theme-surface-overlay backdrop-blur-md p-4 animate-in fade-in duration-500 ${boss.enraged ? 'ring-inset ring-8 ring-theme-danger/50' : ''}`}>
            <div
                ref={modalRef}
                className={`glass p-8 rounded-2xl max-w-md w-full border-4 border-theme-danger shadow-[0_0_150px_rgba(220,38,38,0.6)] text-center relative overflow-hidden transition-all duration-75 ${boss.enraged ? 'scale-105 translate-y-1 shadow-[0_0_200px_rgba(220,38,38,0.8)]' : ''}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="boss-title"
            >
                {/* Floating Damage Text */}
                {floats.map(f => (
                    <div key={f.id} className={`absolute font-black pointer-events-none z-50 animate-bounce ${f.isCrit ? 'text-5xl text-theme-warning' : 'text-4xl text-theme-text-primary'}`} style={{ left: f.x, top: f.y, textShadow: f.isCrit ? '0 0 20px orange' : '0 0 10px red' }}>
                        {f.value}
                    </div>
                ))}

                <div className="absolute inset-0 bg-theme-danger/10 animate-pulse"></div>
                <div className="relative z-10">
                    <h2 id="boss-title" className="text-4xl font-black uppercase tracking-widest text-theme-danger mb-2 drop-shadow-lg">BOSS BATTLE</h2>
                    <div className="w-32 h-32 mx-auto bg-theme-danger/20 rounded-full border-4 border-theme-danger flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(220,38,38,0.4)] relative">
                        <i className={`fa-solid fa-skull-crossbones text-6xl text-theme-danger animate-bounce`}></i>
                    </div>

                    {/* Player HP Bar */}
                    <div className="mb-4">
                        <div className="flex justify-between text-xs font-bold uppercase text-theme-success mb-1 font-terminal">
                            <span>{t('boss_modal.your_hp')}</span>
                            <span>{Math.floor(boss.playerHp || 0)} / {boss.playerMaxHp || 100}</span>
                        </div>
                        <div className="h-4 bg-theme-surface-base border border-theme-success/30">
                            <div
                                className="h-full bg-theme-success transition-all duration-300"
                                style={{ width: `${((boss.playerHp || 0) / (boss.playerMaxHp || 100)) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Boss HP Bar */}
                    <div className="mb-6">
                        <div className="flex justify-between text-xs font-bold uppercase text-theme-danger mb-1 font-terminal">
                            <span>{t('boss_modal.boss_hp')} {boss.enraged ? `🔥 ${t('boss_modal.enraged')}` : ''}</span>
                            <span>{Math.floor(boss.hp)} / {boss.maxHp}</span>
                        </div>
                        <div className={`h-4 border transition-all ${boss.enraged ? 'bg-theme-danger/50 border-theme-danger animate-pulse' : 'bg-theme-danger/20 border-theme-danger/30'}`}>
                            <div className={`h-full transition-all duration-100 ${boss.enraged ? 'bg-theme-danger' : 'bg-theme-danger'}`} style={{ width: `${percent}%` }}></div>
                        </div>
                    </div>

                    <p className="text-theme-danger/80 font-bold mb-8 text-sm">
                        {t('boss_modal.taunt')}
                    </p>

                    <Button
                        onClick={handleAttack}
                        variant="ghost"
                        className="w-full !py-6 !bg-theme-danger active:!bg-theme-danger/80 !text-theme-text-primary font-black rounded-2xl uppercase tracking-[0.2em] text-2xl transition-all active:scale-95 shadow-xl border-b-8 border-theme-danger/50 active:border-b-0 active:translate-y-2 h-auto"
                    >
                        {t('boss_modal.attack_btn')}
                    </Button>

                    {/* Retreat Button */}
                    {onRetreat && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onRetreat();
                            }}
                            className="w-full mt-4 text-xs font-bold uppercase tracking-widest text-theme-danger/50 hover:text-theme-danger hover:bg-theme-danger/10 py-3 rounded-lg transition-all"
                        >
                            <i className="fa-solid fa-person-running"></i> {t('boss_modal.retreat') || 'RETREAT'}
                        </button>
                    )}
                    <div className="mt-2 text-[10px] text-theme-success/50 font-terminal">
                        {t('boss_modal.speed_bonus', { rate: boss.enraged ? '1' : '2' })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BossModal;
