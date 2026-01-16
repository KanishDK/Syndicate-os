import React from 'react';
import MusicPlayer from '../MusicPlayer';
import Button from '../Button';

import { useUI } from '../../context/UIContext';

const ActionsMenu = () => {
    const { setSettingsModal, setHelpModal } = useUI();
    return (
        <div className="flex items-center gap-2 justify-end w-full">
            <MusicPlayer />
            <Button
                onClick={() => setHelpModal(true)}
                className="w-8 h-8 !p-0 flex items-center justify-center bg-theme-bg-primary/5 border-transparent hover:bg-theme-bg-primary/10"
                variant="ghost"
                aria-label="Open Help"
            >
                <i className="fa-solid fa-book"></i>
            </Button>
            <Button
                onClick={() => setSettingsModal(true)}
                className="w-8 h-8 !p-0 flex items-center justify-center bg-theme-bg-primary/5 border-transparent hover:bg-theme-bg-primary/10"
                variant="ghost"
                aria-label="Open Settings"
            >
                <i className="fa-solid fa-gear"></i>
            </Button>
        </div>
    );
};

export default ActionsMenu;
