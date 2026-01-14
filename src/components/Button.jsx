import React, { useState } from 'react';
import { playSound } from '../utils/audio';

const Button = ({ children, onClick, variant = 'primary', size = 'md', className = '', disabled = false, ...props }) => {
    const baseStyle = "font-terminal font-bold transition-colors duration-200 flex items-center justify-center uppercase tracking-wider relative overflow-hidden group border";

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2.5 text-sm",
        lg: "px-6 py-3 text-base",
        icon: "w-9 h-9 p-0 text-sm",
        icon_sm: "w-7 h-7 p-0 text-xs"
    };

    const variants = {
        primary: 'bg-[var(--colors-surface-elevated)] text-[var(--colors-text-primary)] border-[var(--colors-primary)] hover:bg-[var(--colors-primary)] hover:text-black shadow-[0_0_15px_rgba(0,255,65,0.2)]',
        secondary: 'bg-[var(--colors-surface-elevated)] text-[var(--colors-text-primary)] border-[var(--colors-secondary)] hover:bg-[var(--colors-secondary)] hover:text-black shadow-[0_0_15px_rgba(176,38,255,0.2)]',
        danger: 'bg-[var(--colors-surface-elevated)] text-[var(--colors-text-primary)] border-[var(--colors-danger)] hover:bg-[var(--colors-danger)] hover:text-white',
        warning: 'bg-[var(--colors-surface-elevated)] text-[var(--colors-text-primary)] border-[var(--colors-warning)] hover:bg-[var(--colors-warning)] hover:text-black',
        ghost: 'bg-transparent text-[var(--colors-text-secondary)] border-transparent hover:bg-[var(--colors-surface-elevated)] hover:text-[var(--colors-text-primary)]',
        neutral: 'bg-[var(--colors-surface-elevated)] text-[var(--colors-text-primary)] border-[var(--colors-border-default)] hover:border-[var(--colors-border-emphasis)]',
    };

    const disabledStyle = "opacity-30 cursor-not-allowed border-theme-text-muted/20 text-theme-text-muted/20";

    const [isPressed, setIsPressed] = useState(false);

    const handleClick = (e) => {
        if (!disabled) {
            playSound('click');
            if (onClick) onClick(e);
        }
    };

    return (
        <button
            onClick={handleClick}
            onMouseDown={() => !disabled && setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onMouseLeave={() => setIsPressed(false)}
            disabled={disabled}
            className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${disabled ? disabledStyle : ''} ${className}`}
            aria-label={typeof children === 'string' ? children : undefined}
            role="button"
            {...props}
        >
            <span className={`relative z-10 flex items-center gap-2 transition-transform duration-100 pointer-events-none ${isPressed ? 'scale-95' : 'scale-100'}`}>{children}</span>
        </button>
    );
};

export default Button;
