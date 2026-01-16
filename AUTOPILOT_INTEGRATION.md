// ============================================
// INTEGRATION SNIPPET FOR GameContext.jsx
// ============================================
// Add this code to GameContext.jsx to expose state to AutoPilot

// Add this import at the top:
import { AutoPilot } from '../utils/AutoPilot';

// Add this useEffect AFTER the auto-save useEffect (around line 108):

// Expose state to AutoPilot (Development/QA only)
useEffect(() => {
    if (import.meta.env.DEV || window.location.hostname === 'localhost') {
        window.__GAME_STATE__ = state;
        window.__GAME_CONFIG__ = CONFIG;
        
        // Make AutoPilot globally available
        if (!window.AutoPilot) {
            window.AutoPilot = AutoPilot;
        }
    }
}, [state]);

// ============================================
// USAGE FROM BROWSER CONSOLE
// ============================================

/*
// Start AutoPilot with default settings (balanced strategy, 2s between actions)
const pilot = new AutoPilot();
pilot.start();

// Start with custom settings
const pilot = new AutoPilot({ 
    speed: 1000,        // 1 second between actions (faster)
    strategy: 'aggressive' 
});
pilot.start();

// Stop AutoPilot
pilot.stop();

// Get detailed report
const report = pilot.getReport();
console.table(report.bugs);
console.table(report.warnings);

// Export report as JSON
const json = JSON.stringify(pilot.getReport(), null, 2);
console.log(json);
*/
