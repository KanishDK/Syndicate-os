import React from 'react';
import Card from './Card';

const StatsCard = ({
    label,
    value,
    unit = '',
    trend, // optional number for percent change
    trendLabel, // optional string "↑ 5%"
    variant = 'neutral', // neutral | success | warning | danger | info
    className = ''
}) => {
    // Determine colors
    const colorMap = {
        neutral: 'text-white',
        success: 'text-theme-success',
        warning: 'text-theme-warning',
        danger: 'text-theme-danger',
        info: 'text-theme-info',
    };
    const valueColor = colorMap[variant] || 'text-white';

    return (
        <Card variant="elevated" padding="p-5" rounded="rounded-2xl" className={`flex flex-col justify-center min-w-[200px] ${className}`}>
            <span className="text-[10px] font-black text-theme-text-muted uppercase tracking-widest mb-1">{label}</span>
            <div className={`text-3xl font-mono font-black ${valueColor}`}>
                {value} <span className="text-sm">{unit}</span>
            </div>
            {trend && (
                <div className="text-[10px] mt-1">
                    {/* Placeholder for trend logic if needed later */}
                    {trendLabel || `${trend}%`}
                </div>
            )}
        </Card>
    );
};

export default StatsCard;
