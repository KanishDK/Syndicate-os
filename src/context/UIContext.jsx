import React, { createContext, useContext, useState, useCallback } from 'react';

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
    const [activeTab, setActiveTab] = useState('production');
    const [settingsModal, setSettingsModal] = useState(false);
    const [helpModal, setHelpModal] = useState(false);
    const [welcomeModalData, setWelcomeModalData] = useState(null);
    const [raidModalData, setRaidModalData] = useState(null);
    const [buyAmount, setBuyAmount] = useState(1);
    const [showBoot, setShowBoot] = useState(false);
    const [showDrone, setShowDrone] = useState(false);

    const closeAllModals = useCallback(() => {
        setSettingsModal(false);
        setHelpModal(false);
        setWelcomeModalData(null);
        setRaidModalData(null);
    }, []);

    const value = {
        activeTab, setActiveTab,
        settingsModal, setSettingsModal,
        helpModal, setHelpModal,
        welcomeModalData, setWelcomeModalData,
        raidModalData, setRaidModalData,
        buyAmount, setBuyAmount,
        showBoot, setShowBoot,
        showDrone, setShowDrone,
        closeAllModals
    };

    return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) throw new Error('useUI must be used within UIProvider');
    return context;
};
