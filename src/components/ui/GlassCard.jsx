import React from 'react';

/**
 * GlassCard - The fundamental container unit of Syndicate OS
 * @param {React.ReactNode} children - Content
 * @param {string} className - Additional classes
 * @param {string} variant - 'base' | 'interactive' | 'danger' | 'success'
 * @param {Function} onClick - Optional click handler
 */
const GlassCard = ({
    children,
    className = "",
    variant = "base",
    onClick,
    ...props
}) => {
    const baseStyles = "bg-theme-surface-glass backdrop-blur-md border rounded-xl relative overflow-hidden transition-all duration-300";

    const variants = {
        base: "border-theme-border-subtle",
        interactive: "border-theme-border-subtle hover:border-theme-border-emphasis hover:shadow-[0_0_20px_var(--colors-shadow)] cursor-pointer card-interactive",
        danger: "border-theme-danger/30 bg-theme-danger/5 hover:bg-theme-danger/10",
        success: "border-theme-success/30 bg-theme-success/5 hover:bg-theme-success/10",
        gold: "border-yellow-500/30 bg-yellow-500/5 shine-gold"
    };

    return (
        <div
            className={`${baseStyles} ${variants[variant] || variants.base} ${className}`}
            onClick={onClick}
            {...props}
        >
            {/* Glossy top highlight for that glass feel */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

            {children}
        </div>
    );
};

export default GlassCard;
