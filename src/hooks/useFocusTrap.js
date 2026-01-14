import { useEffect, useRef } from 'react';

/**
 * Custom hook for trapping focus within a modal or dialog
 * Ensures keyboard-only users can navigate properly
 * 
 * @param {boolean} isActive - Whether the focus trap is active
 * @returns {React.RefObject} containerRef - Ref to attach to the container element
 */
export const useFocusTrap = (isActive) => {
    const containerRef = useRef(null);
    const previousFocusRef = useRef(null);

    useEffect(() => {
        if (!isActive) return;

        // Store the element that had focus before the modal opened
        previousFocusRef.current = document.activeElement;
        const container = containerRef.current;
        if (!container) return;

        // Get all focusable elements
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Focus the first element
        firstElement?.focus();

        const handleTab = (e) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                // Shift + Tab: If on first element, go to last
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement?.focus();
                }
            } else {
                // Tab: If on last element, go to first
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement?.focus();
                }
            }
        };

        container.addEventListener('keydown', handleTab);

        return () => {
            container.removeEventListener('keydown', handleTab);
            // Restore focus to the element that had it before
            previousFocusRef.current?.focus();
        };
    }, [isActive]);

    return containerRef;
};
