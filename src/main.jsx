import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { GameProvider } from './context/GameContext'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { LanguageProvider } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'

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
