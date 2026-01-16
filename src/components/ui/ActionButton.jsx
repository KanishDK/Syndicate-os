import React from 'react';

/**
 * ActionButton - Interactive element with sound/haptics hook (in future)
 * @param {string} variant - 'primary' | 'danger' | 'neutral' | 'ghost'
 * @param {string} size - 'sm' | 'md' | 'lg'
 */
const ActionButton = ({
    children,
    onClick,
    disabled = false,
    isLoading = false,
    variant = "primary",
    size = "md",
    className = "",
    icon,
    ...props
}) => {

    // Size Classes
    const sizes = {
        sm: "text-xs px-3 py-1.5",
        md: "text-sm px-4 py-2",
        lg: "text-base px-6 py-3"
    };

    // Variant Colors
    const variants = {
        primary: "bg-theme-primary/10 text-theme-primary border border-theme-primary/50 hover:bg-theme-primary hover:text-black hover:shadow-[0_0_15px_var(--colors-primary)]",
        danger: "bg-theme-danger/10 text-theme-danger border border-theme-danger/50 hover:bg-theme-danger hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.6)]",
        neutral: "bg-theme-surface-elevated text-theme-text-secondary border border-theme-border-default hover:border-theme-text-primary hover:text-theme-text-primary",
        ghost: "bg-transparent text-theme-text-muted hover:text-theme-text-primary hover:bg-white/5 border-transparent",
        success: "bg-theme-success/10 text-theme-success border border-theme-success/50 hover:bg-theme-success hover:text-white hover:shadow-[0_0_15px_rgba(16,185,129,0.6)]"
    };

    const styles = `${sizes[size]} ${variants[variant]} rounded-lg font-bold uppercase tracking-wider transition-all duration-200 btn-press flex items-center justify-center gap-2 select-none`;
    const disabledStyles = "opacity-50 cursor-not-allowed grayscale pointer-events-none shadow-none border-dashed";

    return (
        <button
            onClick={!disabled && !isLoading ? onClick : undefined}
            disabled={disabled || isLoading}
            className={`${styles} ${disabled || isLoading ? disabledStyles : ''} ${className}`}
            {...props}
        >
            {isLoading && (
                <i className="fa-solid fa-circle-notch fa-spin text-xs" />
            )}

            {!isLoading && icon && (
                <i className={`${icon}`} />
            )}

            <span>{children}</span>
        </button>
    );
};

export default ActionButton;
