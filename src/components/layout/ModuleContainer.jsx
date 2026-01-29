import React, { useEffect } from 'react';
import { useUI } from '../../context/UIContext';

/**
 * ModuleContainer
 * The "Pro" application shell for feature modules (Production, Rivals, etc.)
 * 
 * Behavior:
 * - Desktop: Opens as a full-size layer ON TOP of the dashboard, fitting available space.
 * - Mobile: Opens as a FULL SCREEN modal (fixed inset-0).
 */
const ModuleContainer = ({ children, title, onClose }) => {
    // Lock body scroll on mount prevents double scrolling on mobile
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'hidden'; // Keep game hidden default
        };
    }, []);

    return (
        <div className="absolute inset-0 z-20 flex flex-col animate-in fade-in duration-200">
            {/* 
              BACKDROP / CONTAINER 
              - Desktop: Relative to content area (absolute inset-0).
              - Mobile: We want it to cover the BOTTOM NAV too? 
                If we want to cover BottomNav on mobile, we need 'fixed inset-0 z-[100]'.
                If we stick to 'absolute inset-0', it leaves BottomNav visible. 
                User said: "on mobile i want a button menu bar... then... open up a full size modal".
                So keeping BottomNav visible is likely desired for quick switching?
                Actually, usually full screen modals cover everything. 
                Let's stick to 'absolute inset-0' of the GameLayout content area first.
            */}

            <div className="flex-1 bg-theme-surface-base flex flex-col relative overflow-hidden shadow-2xl">

                {/* HEADER (Mobile & Desktop) - HIDDEN: Redundant with tab headers */}
                <div className="hidden">
                    <h2 className="text-xl font-heading text-theme-primary font-bold tracking-wide uppercase">
                        {title || 'Module'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-theme-surface-base/50 flex items-center justify-center border border-theme-border-subtle hover:bg-theme-danger hover:border-theme-danger text-theme-text-secondary hover:text-white transition-all"
                    >
                        <i className="fa-solid fa-xmark text-lg"></i>
                    </button>
                </div>

                {/* DESKTOP CLOSE (Floating) */}
                <button
                    onClick={onClose}
                    className="hidden md:flex absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-black/40 border border-white/10 items-center justify-center text-white/60 hover:text-white hover:bg-theme-danger transition-all hover:scale-110"
                    title="Close Module"
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>

                {/* SCROLLABLE CONTENT AREA */}
                {/* Defines the 'safe zone' for content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide p-4 lg:p-8 pb-24 lg:pb-12">
                    <div className="w-full max-w-7xl mx-auto animate-in slide-in-from-bottom-4 duration-300">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModuleContainer;
