import React from 'react';

const Typography = ({ variant = 'body', className = '', children, ...props }) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'h1':
                return 'text-display-lg font-pixel text-theme-primary mb-6';
            case 'h2':
                return 'text-display-sm font-pixel text-theme-secondary mb-4';
            case 'h3':
                return 'text-2xl font-bold font-terminal text-theme-text-primary mb-3';
            case 'h4':
                return 'text-xl font-bold font-terminal text-theme-text-secondary mb-2';
            case 'body':
                return 'text-base font-terminal text-theme-text-primary leading-relaxed';
            case 'caption':
                return 'text-sm font-code text-theme-text-muted';
            case 'code':
                return 'font-code text-code-sm bg-theme-surface-elevated px-1 py-0.5 rounded text-theme-accent';
            default:
                return 'text-base font-terminal text-theme-text-primary';
        }
    };

    const Component = ['h1', 'h2', 'h3', 'h4'].includes(variant) ? variant : 'p';

    return (
        <Component className={`${getVariantStyles()} ${className}`} {...props}>
            {children}
        </Component>
    );
};

export default Typography;
