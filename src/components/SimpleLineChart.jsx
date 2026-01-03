import React from 'react';
import { formatNumber } from '../utils/gameMath';

const SimpleLineChart = ({ data, color = '#10b981', height = 100 }) => {
    // Enhanced "No History" / Scanning State
    if (!data || data.length < 2) return (
        <div className="w-full relative bg-zinc-900/50 rounded overflow-hidden" style={{ height }}>
            {/* Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:10px_10px]"></div>

            {/* Flat Line */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-emerald-500/30"></div>

            {/* Scanning Head */}
            <div className="absolute top-0 bottom-0 w-[2px] bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] left-1/2 opacity-50"></div>

            {/* Label */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/80 px-3 py-1 rounded text-[10px] uppercase font-mono tracking-widest text-emerald-500 animate-pulse border border-emerald-500/20">
                    <i className="fa-solid fa-satellite-dish mr-2 animate-spin"></i>
                    Indsamler Data...
                </div>
            </div>
        </div>
    );

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1; // avoid /0

    // Points
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((val - min) / range) * 100;
        return `${x},${y}`;
    });

    const path = `M ${points.join(' L ')}`;
    const areaPath = `${path} L 100,100 L 0,100 Z`;

    const lastPoint = points[points.length - 1].split(',');

    return (
        <div className="w-full relative select-none" style={{ height }}>
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                {/* Grid Lines */}
                <line x1="0" y1="0" x2="100" y2="0" stroke="white" strokeOpacity="0.1" strokeWidth="0.5" strokeDasharray="2" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeOpacity="0.05" strokeWidth="0.5" strokeDasharray="2" />
                <line x1="0" y1="100" x2="100" y2="100" stroke="white" strokeOpacity="0.1" strokeWidth="0.5" />

                {/* Fill Area with Gradient logic? Simple fill for now */}
                <path d={areaPath} fill={color} fillOpacity="0.1" vectorEffect="non-scaling-stroke" />

                {/* Main Line */}
                <path d={path} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />

                {/* Last Point Dot */}
                <circle cx={lastPoint[0]} cy={lastPoint[1]} r="2" fill="white" stroke={color} strokeWidth="0.5" vectorEffect="non-scaling-stroke" className="animate-pulse" />
            </svg>

            {/* Labels */}
            <div className="absolute top-0 right-0 text-[9px] text-zinc-400 font-mono bg-black/60 px-1 rounded backdrop-blur-sm border border-white/10 translate-y-[-50%]">
                {formatNumber(max)}
            </div>
            <div className="absolute bottom-0 right-0 text-[9px] text-zinc-600 font-mono bg-black/60 px-1 rounded backdrop-blur-sm border border-white/10 translate-y-[50%]">
                {formatNumber(min)}
            </div>
        </div>
    );
};

export default SimpleLineChart;
