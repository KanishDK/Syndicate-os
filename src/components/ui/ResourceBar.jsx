import React from 'react';

/**
 * ResourceBar - Visual indicator for stats (HP, Heat, XP)
 * @param {number} current - Current value
 * @param {number} max - Max value
 * @param {string} color - Tailwind color class (e.g. 'bg-theme-success')
 * @param {string} label - Optional text label inside/above
 * @param {string} size - 'sm' | 'md' | 'lg'
 */
const ResourceBar = ({
    current,
    max,
    color = "bg-theme-primary",
    trackColor = "bg-black/40",
    label,
    subLabel,
    size = "md",
    className = ""
}) => {
    // Clamp percentage between 0 and 100
    const percentage = Math.min(100, Math.max(0, (current / max) * 100));

    const heights = {
        sm: "h-1.5",
        md: "h-3",
        lg: "h-6"
    };

    return (
        <div className={`w-full ${className}`}>
            {/* Header / Labels */}
            {(label || subLabel) && (
                <div className="flex justify-between items-end mb-1 px-0.5">
                    {label && <span className="text-[10px] uppercase font-bold tracking-wider text-theme-text-secondary">{label}</span>}
                    {subLabel && <span className="text-[10px] font-mono text-theme-text-muted">{subLabel}</span>}
                </div>
            )}

            {/* Bar Track */}
            <div className={`w-full ${heights[size]} ${trackColor} rounded-full overflow-hidden border border-white/5 relative`}>
                {/* Fill Animation */}
                <div
                    className={`h-full ${color} transition-all duration-500 ease-out shadow-[0_0_10px_currentColor] relative`}
                    style={{ width: `${percentage}%` }}
                >
                    {/* Inner sheen */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-white/20" />
                </div>

                {/* Grid Lines (Cyberpunk touch) */}
                <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0,transparent_19%,rgba(0,0,0,0.5)_20%)] pointer-events-none opacity-30" />
            </div>
        </div>
    );
};

export default ResourceBar;
