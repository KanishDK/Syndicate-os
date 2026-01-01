import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { GameProvider } from './context/GameContext'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

console.log("OS: Boot Sequence Initiated...");

try {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    console.log("OS: Root Created");

    root.render(
        <React.StrictMode>
            <ErrorBoundary>
                <GameProvider>
                    <App />
                </GameProvider>
            </ErrorBoundary>
        </React.StrictMode>,
    );
    console.log("OS: App Rendered");
} catch (e) {
    console.error("OS: CRITICAL BOOT FAILURE", e);
    document.getElementById('root').innerHTML = `<div style="color:red; padding:20px;"><h1>BOOT FAILURE</h1><pre>${e.message}</pre></div>`;
}
