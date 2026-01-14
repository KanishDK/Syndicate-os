import React from 'react';

const Card = ({
    children,
    className = '',
    variant = 'elevated', // elevated | outlined | ghost
    padding = 'p-6',
    rounded = 'rounded-3xl',
    hover = false,
    ...props
}) => {
    const baseClasses = "relative overflow-hidden transition-all";
    const variants = {
        elevated: "bg-theme-surface-elevated border border-theme-border-subtle shadow-lg",
        outlined: "bg-transparent border border-theme-border-subtle",
        ghost: "bg-white/5 border border-white/5" // Often used for "glass" look
    };

    const hoverClasses = hover ? "hover:border-theme-primary/40 hover:shadow-xl group" : "";

    return (
        <div
            className={`${baseClasses} ${variants[variant]} ${padding} ${rounded} ${hoverClasses} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
