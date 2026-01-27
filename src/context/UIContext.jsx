import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
    const [activeTab, setActiveTab] = useState('production');
    const [settingsModal, setSettingsModal] = useState(false);
    const [helpModal, setHelpModal] = useState(false);
    const [welcomeModalData, setWelcomeModalData] = useState(null);
    const [raidModalData, setRaidModalData] = useState(null);
    const [buyAmount, setBuyAmount] = useState(1);
    const [showBoot, setShowBoot] = useState(true);
    const [showDrone, setShowDrone] = useState(false);
    const [ignoreHeatWarning, setIgnoreHeatWarning] = useState(false);
    const [showMarketplace, setShowMarketplace] = useState(false);
    const [showMultiplayer, setShowMultiplayer] = useState(false);

    const closeAllModals = useCallback(() => {
        setSettingsModal(false);
        setHelpModal(false);
        setWelcomeModalData(null);
        setRaidModalData(null);
        setShowMarketplace(false);
        setShowMultiplayer(false);
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
        ignoreHeatWarning, setIgnoreHeatWarning,
        showMarketplace, setShowMarketplace,
        showMultiplayer, setShowMultiplayer,
        closeAllModals
    };

    // Expose setActiveTab to AutoPilot (Development only)
    useEffect(() => {
        if (import.meta.env.DEV || window.location.hostname === 'localhost') {
            window.__SET_ACTIVE_TAB__ = setActiveTab;
        }
    }, [setActiveTab]);

    return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) throw new Error('useUI must be used within UIProvider');
    return context;
};
