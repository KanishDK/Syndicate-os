
import React from 'react';

const NavButton = ({ active, onClick, icon, label, alert }) => {
    // Determine status color class based on theme variables if possible, 
    // but for now mapping the prop 'color' is tricky if it comes as 'text-amber-500'.
    // However, the new GameLayout passes specific color classes.
    // We can map standard Tailwind colors to our theme semantic vars if we want strict theming,
    // OR we can rely on the fact that text-theme-* classes might be passed in.
    // But GameLayout is currently passing 'text-amber-500', 'text-emerald-400' etc.
    // To fully migrate, we should update GameLayout to pass semantic roles (e.g. 'warning', 'success')
    // OR update NavButton to ignore hardcoded colors and use theme active states.

    // For this migration, we will use the theme primary color for the active state
    // and theme muted/secondary for inactive, largely ignoring the specific 'color' prop for the icon
    // UNLESS it's required for distinctiveness (like Rivals = Red).
    // Let's stick to the active theme color for consistency in the new design system.

    return (
        <button
            onClick={onClick}
            className={`
                relative flex flex - col items - center justify - center gap - 1 min - w - [64px] h - [56px] px - 2 rounded - xl transition - all duration - 300
                ${active
                    ? 'bg-theme-primary/10 -translate-y-2shadow-[0_0_15px_rgba(var(--colors-primary-rgb),0.3)]'
                    : 'hover:bg-theme-surface-elevated hover:-translate-y-1'
                }
`}
        >
            {/* Icon Circle */}
            <div className={`
w - 8 h - 8 rounded - lg flex items - center justify - center text - sm transition - all duration - 300
                ${active
                    ? 'bg-theme-primary text-black transform scale-110 shadow-glow'
                    : 'bg-theme-surface-elevated text-theme-text-muted group-hover:text-theme-text-primary border border-theme-border-default'
                }
`}>
                <i className={`fa - solid ${icon} `}></i>
            </div>

            {/* Label */}
            <span className={`
text - [9px] uppercase font - bold tracking - wider transition - colors duration - 300
                ${active ? 'text-theme-primary' : 'text-theme-text-muted'}
`}>
                {label}
            </span>

            {/* Active Indicator Dot */}
            <div className={`
                absolute bottom - 1 w - 1 h - 1 rounded - full transition - all duration - 300
                ${active ? 'bg-theme-primary scale-100' : 'bg-transparent scale-0'}
`}></div>

            {/* Alert Badge */}
            {alert && (
                <div className="absolute top-1 right-2 w-2.5 h-2.5 bg-theme-danger rounded-full animate-pulse shadow-[0_0_8px_var(--colors-danger)] border border-black"></div>
            )}
        </button>
    );
};
export default NavButton;
