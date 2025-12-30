import React from 'react';

const NavButton = ({ active, onClick, icon, color, label }) => (
    <button onClick={onClick} className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden shrink-0
        ${active ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/10' : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300 border border-transparent'}`}>
        <div className={`active-indicator absolute bottom-0 left-0 w-full h-0.5 bg-current transition-all duration-300 ${active ? 'opacity-100' : 'opacity-0 scale-x-0'}`}></div>
        <i className={`fa-solid ${icon} text-sm ${active ? color : 'text-zinc-600 group-hover:text-zinc-400'} transition-transform group-hover:scale-110 duration-300`}></i>
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </button>
);

export default NavButton;
