# SYNDICATE OS - AI PROJECT GUIDELINES

## 1. PROJECT CONTEXT
- **Title:** Syndicate OS
- **Theme:** Danish Underworld / Cyberpunk Idle Tycoon.
- **Core Loop:** Generate Dirty Money -> Launder to Clean Money -> Buy Upgrades -> Avoid "Osten" (Police).
- **Tech Stack:** HTML5, CSS3, Vanilla JavaScript.
- **Stage:** Gold Master (Final Polish).

## 2. CRITICAL CODING RULES (NON-NEGOTIABLE)
- **NO FULL REWRITES:** Never rewrite entire files. Output ONLY the specific code blocks (DIFFS) that need changing.
- **CSS IS FROZEN:** `style.css` is final. The terminal/hacker UI style must be preserved. Do not suggest visual changes unless the UI is functionally broken.
- **VARIABLE CONTINUITY:** Strictly adhere to variable names in `config.js` and `main.js`. Do not invent new names (e.g., maintain distinction between `dirtyMoney` and `cleanMoney`).
- **HTML INTEGRITY:** Before suggesting a JS change that targets an ID (like `#terminal-output` or `#laundromat`), verify it actually exists in `index.html`.
- **PERMISSION REQUIRED:** Always ask for user permission before changing any code or files.
- **MANDATORY PLANNING:** For every task, create a detailed implementation plan broken down into at least 5 phases to minimize errors.

## 3. GAMEPLAY LOGIC & INTEGRITY
- **Economy Check:** Always verify if a purchase requires Dirty Money or Clean Money.
- **Risk System:** Ensure mechanics involving "Heat", "Risk" or "Osten" are logically consistent (e.g., higher output = higher risk).
- **Save/Load:** Ensure crucial player stats (Heat level, Laundering rates, Missions) are always included in the `saveGame` schema.

## 4. RESPONSE FORMAT
- **Be Direct:** Act as a Senior Systems Architect.
- **Format:**
  - **[ANALYSIS]:** Identify the logic flaw.
  - **[PATCH]:** Provide the code diff.
  - **[VERIFY]:** How to reproduce the fix in the game.

## 5. FORBIDDEN ACTIONS
- Do not add placeholder code (e.g., `// ... rest of code`).
- Do not remove existing features during optimization.
- Do not invent data or lore not present in the current files.
