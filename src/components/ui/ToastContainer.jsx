import React from 'react';
import { useToast } from '../../context/ToastContext';

const ToastItem = ({ id, message, type, onClose }) => {
    // Determine styles based on type
    const getStyles = () => {
        switch (type) {
            case 'success':
                return 'border-theme-success text-theme-success bg-theme-surface-elevated/95 shadow-[0_0_15px_rgba(var(--colors-success-rgb),0.3)]';
            case 'error':
                return 'border-theme-danger text-theme-danger bg-theme-surface-elevated/95 shadow-[0_0_15px_rgba(var(--colors-danger-rgb),0.3)]';
            case 'warning':
                return 'border-theme-warning text-theme-warning bg-theme-surface-elevated/95 shadow-[0_0_15px_rgba(var(--colors-warning-rgb),0.3)]';
            case 'achievement':
                return 'border-theme-primary text-theme-primary bg-theme-surface-elevated/95 shadow-[0_0_20px_rgba(var(--colors-primary-rgb),0.5)]';
            case 'info':
            default:
                return 'border-theme-info text-theme-info bg-theme-surface-elevated/95 shadow-[0_0_15px_rgba(var(--colors-info-rgb),0.3)]';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-triangle';
            case 'warning': return 'fa-exclamation-circle';
            case 'achievement': return 'fa-trophy';
            default: return 'fa-info-circle';
        }
    };

    return (
        <div className={`
            mb-3 px-4 py-3 rounded border flex items-center gap-3 min-w-[300px] max-w-sm ml-auto
            animate-in slide-in-from-right-full fade-in duration-300
            ${getStyles()}
        `}>
            <i className={`fa-solid ${getIcon()} text-lg`}></i>
            <div className="flex-1 text-sm font-bold font-mono tracking-wide">
                {message}
            </div>
            <button
                onClick={() => onClose(id)}
                className="opacity-70 hover:opacity-100 transition-opacity p-1"
                aria-label="Close notification"
            >
                <i className="fa-solid fa-times"></i>
            </button>
        </div>
    );
};

const ToastContainer = () => {
    const { toasts, removeToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-20 right-4 z-[9999] flex flex-col items-end pointer-events-none">
            {/* Enable pointer events for the toasts themselves */}
            <div className="pointer-events-auto">
                {toasts.map(toast => (
                    <ToastItem
                        key={toast.id}
                        {...toast}
                        onClose={removeToast}
                    />
                ))}
            </div>
        </div>
    );
};

export default ToastContainer;
