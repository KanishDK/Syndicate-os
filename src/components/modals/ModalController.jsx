import React from 'react';
import { CONFIG } from '../../config/gameConfig';
import WelcomeModal from './WelcomeModal';
import RaidModal from './RaidModal';
import SettingsModal from './SettingsModal';
import BossModal from './BossModal';
import HelpModal from './HelpModal';
import TutorialOverlay from '../TutorialOverlay';

import { useUI } from '../../context/UIContext';

const ModalController = ({
    gameState,
    setGameState,
    hardReset,
    exportSave,
    importSave,
    attackBoss
}) => {
    const {
        welcomeModalData, setWelcomeModalData,
        raidModalData, setRaidModalData,
        settingsModal, setSettingsModal,
        helpModal, setHelpModal
    } = useUI();
    return (
        <>
            {gameState.level === 1 && !gameState.flags?.tutorialComplete && gameState.tutorialStep < 4 && (
                <TutorialOverlay
                    step={gameState.tutorialStep}
                    state={gameState}
                    onNext={() => setGameState(p => ({ ...p, tutorialStep: p.tutorialStep + 1 }))}
                    onSkip={() => setGameState(p => ({ ...p, tutorialStep: 99 }))}
                />
            )}

            <WelcomeModal
                data={welcomeModalData}
                onClose={() => {
                    if (welcomeModalData?.hardcoreWipe) {
                        hardReset(true);
                    } else {
                        setWelcomeModalData(null);
                    }
                }}
            />

            <RaidModal
                data={raidModalData}
                onClose={() => {
                    if (raidModalData?.hardcoreWipe) {
                        hardReset(true);
                    } else {
                        setRaidModalData(null);
                    }
                }}
            />

            {gameState.boss.active && <BossModal
                boss={gameState.boss}
                onAttack={attackBoss}
                onRetreat={() => {
                    const dirtyCash = gameState.dirtyCash || 0;
                    const tax = Math.floor(dirtyCash * 0.15);
                    const hasMoney = dirtyCash > 0;

                    let newDirtyCash = dirtyCash;
                    let msg = "";

                    // Punishment Logic
                    if (hasMoney) {
                        newDirtyCash = Math.max(0, dirtyCash - tax);
                        msg = `🏳️ Kujon-Tillæg: Du tabte ${tax.toLocaleString()} kr under flugten! (+25 Heat)`;
                    } else {
                        // Fallback: Shame (inventory hit could go here, but pure heat/shame is simple for now)
                        msg = `🏳️ Du stak af uden ære! Bossen håner dig. (+25 Heat)`;
                    }

                    setGameState(prev => ({
                        ...prev,
                        dirtyCash: newDirtyCash,
                        boss: { ...prev.boss, active: false, lastSpawn: Date.now() }, // Reset timer
                        heat: Math.min(100, prev.heat + 25), // Increased Punishment
                        logs: [{ msg: msg, type: 'error', time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
                    }));
                }}
            />}

            {settingsModal && (
                <SettingsModal
                    onClose={() => setSettingsModal(false)}
                    onExport={exportSave}
                    onImport={importSave}
                    onReset={hardReset}
                    version={CONFIG.includeVersion || gameState.version}
                    settings={gameState.settings}
                    setGameState={setGameState}
                />
            )}

            {helpModal && <HelpModal onClose={() => setHelpModal(false)} />}
        </>
    );
};

export default ModalController;
