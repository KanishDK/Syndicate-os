import React from 'react';
import Button from './Button';

const BulkControl = ({ buyAmount, setBuyAmount, className = '' }) => {
    return (
        <div className={`flex bg-black/40 rounded-lg p-0.5 border border-white/10 ${className}`}>
            <Button
                onClick={() => setBuyAmount(1)}
                size="icon"
                className={`!w-8 !h-8 ${buyAmount === 1 ? '!bg-zinc-700 !text-white' : '!bg-transparent !text-zinc-500 !border-transparent'}`}
                variant="ghost"
            >
                1x
            </Button>
            <Button
                onClick={() => setBuyAmount(10)}
                size="icon"
                className={`!w-8 !h-8 ${buyAmount === 10 ? '!bg-zinc-700 !text-white' : '!bg-transparent !text-zinc-500 !border-transparent'}`}
                variant="ghost"
            >
                10x
            </Button>
            <Button
                onClick={() => setBuyAmount('max')}
                size="icon"
                className={`!w-10 !h-8 uppercase font-black text-[10px] ${buyAmount === 'max' ? '!bg-zinc-700 !text-white' : '!bg-transparent !text-zinc-500 !border-transparent'}`}
                variant="ghost"
            >
                Max
            </Button>
        </div>
    );
};

export default BulkControl;
