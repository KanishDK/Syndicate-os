import React from 'react';
import Button from '../Button';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useLanguage } from '../../context/LanguageContext';

const RaidModal = ({ data, onClose }) => {
    // Apply focus trap for accessibility
    const modalRef = useFocusTrap(true);
    const { t } = useLanguage();

    // ESC key support
    React.useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        // Only add listener if data exists (logical check) or just always add it if mounted?
        // Since component is unmounted when closed, this is fine.
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    if (!data) return null;

    // Determine styles based on type (raid vs story/success)
    // Fix: Ensure 'story' type is never treated as a raid (fail)
    const isRaid = data.type === 'raid' || (!data.result && data.type !== 'story' && data.type !== 'success') || data.result === 'fail';
    const isSuccess = data.result === 'win' || data.type === 'success';

    const borderColor = isSuccess ? 'border-theme-success' : isRaid ? 'border-theme-danger' : 'border-theme-accent';
    const shadowColor = isSuccess ? 'shadow-theme-success/50' : isRaid ? 'shadow-theme-danger/50' : 'shadow-theme-accent/50';
    const icon = isSuccess ? 'fa-trophy' : isRaid ? 'fa-siren-on animate-pulse' : 'fa-info-circle';
    const iconColor = isSuccess ? 'text-theme-success' : isRaid ? 'text-theme-danger' : 'text-theme-accent';
    const btnColor = isSuccess ? 'bg-theme-success active:bg-theme-success/90' : isRaid ? 'bg-theme-danger active:bg-theme-danger/90' : 'bg-theme-accent active:bg-theme-accent/90';



    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-theme-surface-overlay backdrop-blur-md p-4 animate-in fade-in zoom-in duration-300"
            onClick={onClose}
        >
            <div
                ref={modalRef}
                onClick={(e) => e.stopPropagation()}
                className={`bg-theme-surface-base border-2 ${borderColor} p-8 rounded-2xl max-w-md w-full shadow-[0_0_100px_rgba(0,0,0,0.5)] ${shadowColor} relative overflow-hidden`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="raid-title"
            >
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.03)_10px,rgba(255,255,255,0.03)_20px)] opacity-50"></div>
                <div className="relative z-10 text-center">
                    <i className={`fa-solid ${icon} text-6xl mb-6 ${iconColor}`}></i>

                    <h2 id="raid-title" className="text-3xl font-black text-theme-text-primary italic uppercase mb-2 tracking-tighter">
                        {data.titleKey ? t(data.titleKey, data.titleData) : (data.title || (isRaid ? 'RAZZIA!' : 'INFO'))}
                    </h2>
                    <p className="text-theme-text-secondary mb-8 font-medium whitespace-pre-wrap">
                        {data.msgKey ? t(data.msgKey, data.msgData) : data.msg}
                    </p>

                    {/* Visual Feedback for Losses */}
                    {(data.lost?.cash > 0 || data.lost?.product > 0) && (
                        <div className="bg-theme-danger/10 border border-theme-danger/30 rounded p-4 mb-6">
                            <h4 className="text-theme-danger font-bold uppercase text-xs tracking-wider mb-2">Rapport over tab</h4>
                            <div className="flex flex-col gap-1 text-sm font-mono text-theme-danger/80">
                                {data.lost.cash > 0 && <span>- {data.lost.cash.toLocaleString()} kr.</span>}
                                {data.lost.product > 0 && <span>- {data.lost.product} enheder</span>}
                            </div>
                        </div>
                    )}

                    <Button onClick={() => {
                        onClose();
                        if (data.onClose) data.onClose();
                    }} className={`px-8 py-3 shadow-lg ${btnColor.includes('accent') ? '!bg-theme-accent active:!bg-theme-accent/90 !border-theme-accent' : ''}`}
                        variant={isSuccess ? 'primary' : isRaid ? 'danger' : 'neutral'}
                    >
                        {t('ui.understood')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RaidModal;
