import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for managing tooltip state and accessibility.
 * @returns {Object} { activeId, open, close, toggle, isOpen, getTriggerProps }
 */
export const useTooltip = () => {
    const [activeId, setActiveId] = useState(null);

    const open = useCallback((id) => setActiveId(id), []);
    const close = useCallback(() => setActiveId(null), []);
    const toggle = useCallback((id) => setActiveId(prev => prev === id ? null : id), []);

    // Close on ESC key (global)
    useEffect(() => {
        const handleGlobalKeyDown = (e) => {
            if (e.key === 'Escape') close();
        };
        document.addEventListener('keydown', handleGlobalKeyDown);
        return () => document.removeEventListener('keydown', handleGlobalKeyDown);
    }, [close]);

    // Accessibility Props Helper for Triggers
    const getTriggerProps = useCallback((id) => ({
        role: 'button',
        tabIndex: 0,
        'aria-expanded': activeId === id,
        'aria-controls': `${id}-tooltip`,
        onClick: (e) => {
            e.stopPropagation();
            toggle(id);
        },
        onKeyDown: (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle(id);
            }
        }
    }), [activeId, toggle]);

    return {
        activeId,
        open,
        close,
        toggle,
        isOpen: (id) => activeId === id,
        getTriggerProps
    };
};
