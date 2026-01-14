import React from 'react';
import Button from './Button';

import { useUI } from '../context/UIContext';

const BulkControl = ({ className = '' }) => {
    const { buyAmount, setBuyAmount } = useUI();
    return (
        <div className={`flex bg-theme-bg-primary/40 rounded-lg p-0.5 border border-theme-border-subtle ${className}`}>
            <Button
                onClick={() => setBuyAmount(1)}
                size="icon"
                className={`!w-8 !h-8 ${buyAmount === 1 ? '!bg-theme-surface-elevated !text-theme-text-primary' : '!bg-transparent !text-theme-text-muted !border-transparent'}`}
                variant="ghost"
            >
                1x
            </Button>
            <Button
                onClick={() => setBuyAmount(10)}
                size="icon"
                className={`!w-8 !h-8 ${buyAmount === 10 ? '!bg-theme-surface-elevated !text-theme-text-primary' : '!bg-transparent !text-theme-text-muted !border-transparent'}`}
                variant="ghost"
            >
                10x
            </Button>
            <Button
                onClick={() => setBuyAmount('max')}
                size="icon"
                className={`!w-10 !h-8 uppercase font-black text-[10px] ${buyAmount === 'max' ? '!bg-theme-surface-elevated !text-theme-text-primary' : '!bg-transparent !text-theme-text-muted !border-transparent'}`}
                variant="ghost"
            >
                Max
            </Button>
        </div>
    );
};

export default BulkControl;
