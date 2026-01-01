import React from 'react';

const RaidModal = ({ data, onClose }) => {
    if (!data) return null;

    // Determine styles based on type (raid vs story/success)
    const isRaid = data.type === 'raid' || !data.result || data.result === 'fail';
    const isSuccess = data.result === 'win' || data.type === 'success';

    const borderColor = isSuccess ? 'border-emerald-500' : isRaid ? 'border-red-500' : 'border-blue-500';
    const shadowColor = isSuccess ? 'shadow-emerald-900/50' : isRaid ? 'shadow-red-900/50' : 'shadow-blue-900/50';
    const icon = isSuccess ? 'fa-trophy' : isRaid ? 'fa-siren-on animate-pulse' : 'fa-info-circle';
    const iconColor = isSuccess ? 'text-emerald-500' : isRaid ? 'text-red-500' : 'text-blue-500';
    const btnColor = isSuccess ? 'bg-emerald-600 active:bg-emerald-500' : isRaid ? 'bg-red-600 active:bg-red-500' : 'bg-blue-600 active:bg-blue-500';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-300">
            <div className={`bg-black border-2 ${borderColor} p-8 rounded-2xl max-w-md w-full shadow-[0_0_100px_rgba(0,0,0,0.5)] ${shadowColor} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.03)_10px,rgba(255,255,255,0.03)_20px)] opacity-50"></div>
                <div className="relative z-10 text-center">
                    <i className={`fa-solid ${icon} text-6xl mb-6`}></i>
                    <div className={iconColor}> {/* Just to wrap icon/color logic if needed later */} </div>

                    <h2 className="text-3xl font-black text-white italic uppercase mb-2 tracking-tighter">{data.title || (isRaid ? 'RAZZIA!' : 'INFO')}</h2>
                    <p className="text-zinc-200 mb-8 font-medium whitespace-pre-wrap">{data.msg}</p>

                    <button onClick={() => {
                        onClose();
                        if (data.onClose) data.onClose();
                    }} className={`px-8 py-3 text-white font-black rounded-lg uppercase shadow-lg transition-transform active:scale-95 ${btnColor}`}>
                        Forstået
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RaidModal;
