import React from 'react';

const TabHeader = ({
    title,
    subtitle,
    icon,
    accentColor = 'primary', // 'primary', 'success', 'warning', 'danger', 'info', 'accent'
    variant = 'underlined', // 'underlined' | 'contained'
    className = '',
    children
}) => {
    const colorMap = {
        primary: { text: 'text-theme-primary', border: 'border-theme-primary', bg: 'bg-theme-primary', shadow: 'shadow-[0_0_15px_var(--colors-primary)]' },
        success: { text: 'text-theme-success', border: 'border-theme-success', bg: 'bg-theme-success', shadow: 'shadow-[0_0_15px_var(--colors-success)]' },
        warning: { text: 'text-theme-warning', border: 'border-theme-warning', bg: 'bg-theme-warning', shadow: 'shadow-[0_0_15px_var(--colors-warning)]' },
        danger: { text: 'text-theme-danger', border: 'border-theme-danger', bg: 'bg-theme-danger', shadow: 'shadow-[0_0_15px_var(--colors-danger)]' },
        info: { text: 'text-theme-info', border: 'border-theme-info', bg: 'bg-theme-info', shadow: 'shadow-[0_0_15px_var(--colors-info)]' },
        accent: { text: 'text-theme-accent', border: 'border-theme-accent', bg: 'bg-theme-accent', shadow: 'shadow-[0_0_15px_var(--colors-accent)]' },
    };

    const colors = colorMap[accentColor] || colorMap.primary;

    if (variant === 'contained') {
        return (
            <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-theme-surface-elevated p-6 rounded-2xl border border-theme-border-default shadow-xl relative overflow-hidden group ${className}`}>
                <div className={`absolute inset-0 ${colors.bg}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                {/* Visual Accent Line */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${colors.bg} ${colors.shadow}`}></div>

                <div className="relative z-10">
                    <h2 className={`text-3xl font-black text-theme-text-primary uppercase tracking-tighter mb-1 flex items-center gap-3`}>
                        {icon && <i className={`${icon} ${colors.text} text-2xl animate-pulse-slow`}></i>}
                        {title}
                    </h2>
                    <p className="text-theme-text-secondary text-sm font-mono flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${colors.bg} animate-pulse`}></span>
                        {subtitle}
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-4">
                    {children}
                </div>
            </div>
        );
    }

    // Default: 'underlined'
    return (
        <div className={`flex flex-col md:flex-row justify-between items-end gap-6 border-b border-theme-border-default pb-8 relative ${className}`}>
            <div className={`absolute -bottom-px left-0 w-32 h-[2px] ${colors.bg} ${colors.shadow}`}></div>
            <div>
                <h2 className={`text-3xl font-black text-theme-text-primary uppercase tracking-tighter flex items-center gap-3`}>
                    {icon && <i className={`${icon} ${colors.text}`}></i>}
                    {title}
                </h2>
                <p className="text-theme-text-secondary text-sm mt-1">{subtitle}</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-end">
                {children}
            </div>
        </div>
    );
};

export default TabHeader;
