import React from 'react';
import { playSound } from '../utils/audio';

const Button = ({ onClick, children, variant = 'primary', disabled = false, className = '', size = 'md' }) => {
    const baseStyle = "font-terminal font-bold transition-all active:scale-95 flex items-center justify-center uppercase tracking-wider relative overflow-hidden group border";

    const sizes = {
        sm: "px-3 py-1 text-sm",
        md: "px-4 py-2 text-md",
        lg: "px-6 py-3 text-lg",
        icon: "w-8 h-8 p-0 text-sm",
        icon_sm: "w-6 h-6 p-0 text-xs"
    };

    const variants = {
        primary: "bg-transparent border-terminal-green text-terminal-green hover:bg-terminal-green/10",
        danger: "bg-transparent border-terminal-red text-terminal-red hover:bg-terminal-red/10",
        warning: "bg-transparent border-terminal-amber text-terminal-amber hover:bg-terminal-amber/10",
        neutral: "bg-transparent border-terminal-green/50 text-terminal-green/70 hover:bg-terminal-green/5 hover:text-terminal-green",
        ghost: "bg-transparent border-transparent text-terminal-green/50 hover:text-terminal-green hover:bg-white/5"
    };

    const disabledStyle = "opacity-30 cursor-not-allowed border-terminal-green/20 text-terminal-green/20";

    const handleClick = (e) => {
        if (!disabled) {
            playSound('click');
            if (onClick) onClick(e);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={disabled}
            className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${disabled ? disabledStyle : ''} ${className}`}
            aria-label={typeof children === 'string' ? children : undefined}
            role="button"
        >
            <span className="relative z-10 flex items-center gap-2">{children}</span>
        </button>
    );
};

export default Button;
