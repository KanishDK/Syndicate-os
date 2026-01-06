# IMPLEMENTATION PLAN: TUTORIAL OVERHAUL
**Objective:** Unify the fragmented tutorial systems (Overlay, Hook, Missions) into a single, cohesive "Live Assistant" that guides players dynamically.

## 1. Goal Description
Currently, we have a static slideshow (`TutorialOverlay`) and disjointed modals (`useTutorial`). The overhaul will merge these. The `TutorialOverlay` will become a persistent, glass-morphic "Comms Link" HUD element that reacts to the player's real-time progress, tracked by `useTutorial.js`.

## 2. User Review Required
> [!NOTE]
> This changes the tutorial from a "Click Next" slideshow to an "Action-Based" system. The overlay will remain visible until the specific in-game action (e.g., "Produce Hash") is completed.

## 3. Proposed Changes

### COMPONENT: Visualization (`src/components/TutorialOverlay.jsx`)
*   **Change:** Convert from full-screen modal to a **"Mini-HUD" (Bottom Right/Left)**.
*   **Logic:** Render content based on `state.tutorialStep`.
    *   **Step 0 (Production):** "Køb 5x Hash i Produktion."
    *   **Step 1 (Sales):** "Vent på salg eller brug 'Sælg Alt' knappen."
    *   **Step 2 (Launder):** "Vask dine sorte penge i Finans."
    *   **Step 3 (Hire):** "Ansæt en Pusher i Organisation."
*   **Style:** Cyberpunk "Incoming Transmission" aesthetic. Draggable or fixed non-intrusive position.

### COMPONENT: Game Logic (`src/hooks/useTutorial.js`)
*   **Change:** Remove `setRaidModal` calls for Steps 0-3. We don't want to pause the game with popups.
*   **Logic:**
    *   Keep the "Auto-Advance" checking logic (e.g., `hashProduced >= 5`).
    *   When condition is met -> `setGameState(tutorialStep++)`.
    *   Trigger a subtle sound/notification instead of a modal.

### COMPONENT: Narrative (`src/config/gameConfig.js`)
*   **Change:** Ensure the Mission Text aligns with the new HUD text.
*   **Missions:** No structural changes needed, just verify text consistency.

## 4. Verification Plan

### Manual Verification
1.  **Reset Game:** Start a fresh save.
2.  **Verify HUD:** Confirm the "Comms Link" appears in the corner with instructions.
3.  **Action Test:** Buy 5 Hash.
    *   Observe HUD update automatically to Step 1.
    *   Verify NO modal popup blocks the screen.
4.  **Completion:** Follow steps until the HUD dismisses itself or says "Tutorial Complete".
