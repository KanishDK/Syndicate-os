import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { GameProvider } from './context/GameContext'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { LanguageProvider } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'

// Import AutoPilot for QA/Development (will be available as window.autoPilot)
if (import.meta.env.DEV) {
    Promise.all([
        import('./utils/AutoPilot'),
        import('./utils/BrowserSimActions'),
        import('./config/gameConfig'),
        import('./utils/gameMath')
    ]).then(([autoPilotModule, simActionsModule, configModule, mathModule]) => {
        // Create SimActions with dependencies
        const SimActions = simActionsModule.createSimActions(configModule.CONFIG, mathModule.getBulkCost);
        window.__SIM_ACTIONS__ = SimActions;

        // Create AutoPilot instance
        const pilot = new autoPilotModule.AutoPilot();
        window.autoPilot = pilot;
        window.AutoPilot = autoPilotModule.AutoPilot;

        console.log('🤖 AutoPilot v6.0 loaded. Run window.autoPilot.start() to activate.');
    });
}

try {
    const root = ReactDOM.createRoot(document.getElementById('root'));

    root.render(
        <React.StrictMode>
            <ErrorBoundary>
                <ThemeProvider>
                    <LanguageProvider>
                        <GameProvider>
                            <App />
                        </GameProvider>
                    </LanguageProvider>
                </ThemeProvider>
            </ErrorBoundary>
        </React.StrictMode>,
    );

} catch (e) {
    console.error("OS: CRITICAL BOOT FAILURE", e);
    document.getElementById('root').innerHTML = `<div style="color:red; padding:20px;"><h1>BOOT FAILURE</h1><pre>${e.message}</pre></div>`;
}
