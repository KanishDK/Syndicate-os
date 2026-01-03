import React, { memo } from 'react';
import Button from './Button';

const NavButton = memo(({ active, onClick, icon, color, label, alert }) => (
    <Button
        onClick={onClick} // Sound handled by Button
        variant="ghost"
        className={`flex-1 !min-w-[70px] md:!min-w-[100px] flex md:flex-row flex-col items-center justify-center gap-1 md:gap-2 !px-2 md:!px-4 !py-2 md:!py-3 rounded-lg transition-all duration-200 group relative overflow-hidden shrink-0 active:scale-95 h-auto border
        ${active ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] border-white/10' : 'text-zinc-500 border-transparent active:bg-white/5 active:text-zinc-300'}
        ${alert ? 'animate-pulse text-red-400 border-red-500/30 bg-red-900/10' : ''}`}
    >
        <div className={`active-indicator absolute bottom-0 left-0 w-full h-0.5 bg-current transition-all duration-300 ${active ? 'opacity-100' : 'opacity-0 scale-x-0'}`}></div>
        <i className={`fa-solid ${icon} text-sm md:text-base ${active ? color : 'text-zinc-600'} ${alert ? 'text-red-500' : ''} transition-transform duration-300`}></i>
        <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider leading-none">{label}</span>
    </Button>
));

export default NavButton;
