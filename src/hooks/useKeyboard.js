import { useEffect } from 'react';

export const useKeyboard = (setActiveTab, modalsOpen) => {
    useEffect(() => {
        const handleGlobalKeys = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            // Numbers for Tabs
            if (e.key === '1') setActiveTab('sultan');
            if (e.key === '2') setActiveTab('production');
            if (e.key === '3') setActiveTab('network');
            if (e.key === '4') setActiveTab('finance');
            if (e.key === '5') setActiveTab('management');
            if (e.key === '6') setActiveTab('empire');

            // Escape to close modals
            if (e.key === 'Escape') {
                modalsOpen.forEach(modal => {
                    if (modal.isOpen && modal.onClose) modal.onClose();
                });
            }
        };
        window.addEventListener('keydown', handleGlobalKeys);
        return () => window.removeEventListener('keydown', handleGlobalKeys);
    }, [modalsOpen]);
};
