import React from 'react';


/**
 * Reusable Tooltip Component.
 * Ideally used in conjunction with the useTooltip hook.
 * 
 * @param {boolean} isOpen - Whether the tooltip is visible
 * @param {Function} onClose - Function to close the tooltip
 * @param {string} accentColor - 'primary', 'success', 'warning', 'danger', 'info'
 * @param {ReactNode} children - Tooltip content
 * @param {string} className - Additional classes
 */
const Tooltip = ({ isOpen, onClose, accentColor = 'primary', position = 'bottom', className = '', children }) => {
    if (!isOpen) return null;

    const colorMap = {
        primary: { border: 'border-theme-primary', text: 'text-theme-primary' },
        success: { border: 'border-theme-success', text: 'text-theme-success' },
        warning: { border: 'border-theme-warning', text: 'text-theme-warning' },
        danger: { border: 'border-theme-danger', text: 'text-theme-danger' },
        info: { border: 'border-theme-info', text: 'text-theme-info' },
    };

    const colors = colorMap[accentColor] || colorMap.primary;

    const positionClasses = {
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        'bottom-left': 'top-full left-0 mt-2',
        'bottom-right': 'top-full right-0 mt-2',
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    };

    return (
        <div
            role="tooltip"
            onClick={(e) => e.stopPropagation()}
            className={`absolute ${positionClasses[position] || positionClasses.bottom} w-56 bg-theme-surface-elevated rounded-lg border ${colors.border}/50 p-4 z-[100] shadow-2xl animate-in fade-in slide-in-from-top-2 ${className}`}
        >
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
                className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-theme-text-muted hover:text-theme-text-primary transition-colors rounded hover:bg-theme-bg-primary/10"
                aria-label="Close tooltip"
            >
                <i className="fa-solid fa-xmark text-xs"></i>
            </button>
            {children}
        </div>
    );
};

export const TooltipHeader = ({ title, accentColor = 'primary' }) => {
    const colorMap = {
        primary: 'text-theme-primary border-theme-primary/20',
        success: 'text-theme-success border-theme-success/20',
        warning: 'text-theme-warning border-theme-warning/20',
        danger: 'text-theme-danger border-theme-danger/20',
        info: 'text-theme-info border-theme-info/20',
    };
    const style = colorMap[accentColor] || colorMap.primary;

    return (
        <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 border-b pb-1 pr-6 ${style}`}>
            {title}
        </div>
    );
}

export const TooltipSection = ({ children, className = '' }) => (
    <div className={`space-y-1 text-xs ${className}`}>
        {children}
    </div>
);

export const TooltipRow = ({ label, value, valueClass = 'text-theme-text-primary' }) => (
    <div className="flex justify-between">
        <span className="text-theme-text-secondary">{label}:</span>
        <span className={`font-mono ${valueClass}`}>{value}</span>
    </div>
);

export const TooltipFooter = ({ children, className = '' }) => (
    <div className={`mt-3 text-[9px] text-theme-text-muted italic border-t border-theme-border-subtle pt-2 text-center ${className}`}>
        {children}
    </div>
);

export default Tooltip;
