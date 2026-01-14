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
            {gameState.level === 1 && gameState.tutorialStep < 4 && (
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

            {gameState.boss.active && <BossModal boss={gameState.boss} onAttack={attackBoss} />}

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
