# 📁 SYNDICATE OS - FILE STRUCTURE GUIDE
**v1.1.2 [PLATINUM] | Navigation Reference**

> **Purpose:** Complete file structure documentation for easy navigation  
> **Last Updated:** 2026-01-07

---

## 🗂️ ROOT DIRECTORY

```
Syndicate OS Final/
├── 📄 Documentation (Essential)
│   ├── AI_RULES.md                    # AI coding guidelines
│   ├── FORMULAS.md                    # All game formulas
│   ├── HANDBOOK.md                    # Complete player guide
│   ├── PLAYSTYLES.md                  # Strategy guides
│   ├── README.md                      # GitHub README
│   ├── SALES_PITCH.md                 # Marketing document
│   └── GAME_DESIGN_DOCUMENT.md        # Complete GDD
│
├── ⚙️ Configuration
│   ├── package.json                   # Dependencies
│   ├── vite.config.js                 # Build config
│   ├── tailwind.config.js             # CSS config
│   ├── postcss.config.js              # PostCSS config
│   └── eslint.config.js               # Linting rules
│
├── 🌐 Entry Points
│   └── index.html                     # HTML entry
│
├── 📁 Directories
│   ├── src/                           # Source code (57 files)
│   ├── public/                        # Static assets
│   ├── dist/                          # Build output
│   └── node_modules/                  # Dependencies
│
└── 🔧 Meta
    ├── .gitignore                     # Git ignore rules
    └── .vscode/                       # VSCode settings
```

---

## 📂 SOURCE CODE STRUCTURE (src/)

### 🎨 Components (30 files)

**Main Components:**
```
components/
├── App.jsx                            # Root component
├── Header.jsx                         # Stats, heat, notifications
├── ProductionTab.jsx                  # Production interface
├── ManagementTab.jsx                  # Staff & upgrades (loyalty UI)
├── NetworkTab.jsx                     # Territories
├── RivalsTab.jsx                      # Rival system (gang wars)
├── FinanceTab.jsx                     # Laundering, bank, crypto
├── EmpireTab.jsx                      # Masteries, prestige
├── SultanTab.jsx                      # Missions, dailies
└── ... (21 more)
```

**UI Components:**
```
components/
├── BootSequence.jsx                   # Loading screen
├── BriefcaseController.jsx            # Briefcase animation
├── BulkControl.jsx                    # 1x/10x/Max buttons
├── Button.jsx                         # Reusable button
├── ConsoleView.jsx                    # Game log
├── FloatManager.jsx                   # Floating numbers
├── GhostMode.jsx                      # Ghost mode indicator
├── MusicPlayer.jsx                    # Audio player
├── NavButton.jsx                      # Tab navigation
├── NewsTicker.jsx                     # News scroll
├── ProductionCard.jsx                 # Product cards
├── SimpleLineChart.jsx                # Charts
└── TutorialOverlay.jsx                # Tutorial UI
```

**Modals:**
```
components/modals/
├── ModalController.jsx                # Modal manager
├── BossModal.jsx                      # Boss encounters
├── HelpModal.jsx                      # Help system
├── RaidModal.jsx                      # Raid notifications
├── SettingsModal.jsx                  # Settings
└── WelcomeModal.jsx                   # Welcome screen
```

**Effects & Layout:**
```
components/
├── effects/
│   └── ParticleSystem.jsx             # Particle effects
├── layout/
│   └── GameLayout.jsx                 # Main layout
└── overlays/
    └── GoldenDrone.jsx                # Special effects
```

---

### ⚙️ Game Engine (6 files)

```
features/engine/
├── gameTick.js                        # Main game loop (60 FPS)
├── production.js                      # Production & sales logic
├── economy.js                         # Payroll, bank, crypto
├── events.js                          # Raids, heat, warnings
├── missions.js                        # Missions & contracts
└── offline.js                         # Offline progress
```

**Responsibilities:**
- `gameTick.js`: Orchestrates all systems
- `production.js`: Handles production/sales with loyalty bonuses
- `economy.js`: Manages payroll, bank interest, crypto prices
- `events.js`: Police raids, heat warnings, random events
- `missions.js`: Mission completion, daily contracts
- `offline.js`: Calculates offline progress

---

### 🎣 Hooks (12 files)

```
hooks/
├── useGameActions.js                  # All player actions (raids, bribes, etc.)
├── useManagement.js                   # Staff hiring/firing, upgrades
├── useProduction.js                   # Manual production logic
├── useFinance.js                      # Laundering, bank, crypto
├── useTutorial.js                     # Tutorial system
├── useAchievements.js                 # Achievement tracking
├── usePremium.js                      # Luxury items, masteries
├── useGameLogic.js                    # Core game logic
├── useKeyboard.js                     # Keyboard shortcuts
├── useOfflineSystem.js                # Offline calculation
└── ... (2 more utility hooks)
```

---

### 🛠️ Utilities (4 files)

```
utils/
├── gameMath.js                        # All formulas & calculations
├── initialState.js                    # Default game state
├── audio.js                           # Sound system
└── particleEmitter.js                 # Particle effects
```

**Key Functions:**
- `gameMath.js`: XP calc, bulk cost, loyalty bonus, etc.
- `initialState.js`: Complete state structure
- `audio.js`: Sound effects, music, mute toggle
- `particleEmitter.js`: Visual feedback

---

### 🎛️ Configuration (1 file)

```
config/
└── gameConfig.js                      # ALL game constants
```

**Contains:**
- Production items (12 tiers)
- Staff roles (10 types)
- Territories (12 districts)
- Luxury items (5 items)
- Masteries (4 perks)
- Missions (20+ missions)
- News events (50+ events)
- All balance constants

---

### 🌐 Context (2 files)

```
context/
├── GameContext.jsx                    # React Context provider
└── gameReducer.js                     # State reducer
```

---

## 📊 FILE SIZE REFERENCE

**Largest Files:**
1. RivalsTab.jsx (33.6 KB) - Complex rival UI
2. gameConfig.js (29.9 KB) - All constants
3. SultanTab.jsx (25.6 KB) - Mission system
4. useGameActions.js (25.2 KB) - All actions
5. HelpModal.jsx (21.5 KB) - Complete help

**Total Source Code:** ~350 KB

---

## 🔗 DEPENDENCY MAP

```
App.jsx
├── GameContext (state provider)
├── GameLayout
│   ├── Header
│   ├── NavButtons
│   ├── Tabs (7 tabs)
│   │   ├── ProductionTab
│   │   ├── ManagementTab
│   │   ├── NetworkTab
│   │   ├── RivalsTab
│   │   ├── FinanceTab
│   │   ├── EmpireTab
│   │   └── SultanTab
│   └── ConsoleView
├── ModalController
│   ├── BossModal
│   ├── RaidModal
│   ├── HelpModal
│   ├── SettingsModal
│   └── WelcomeModal
├── BootSequence
├── TutorialOverlay
├── NewsTicker
├── FloatManager
└── MusicPlayer
```

---

## 📝 QUICK REFERENCE

### Finding Features

**Production System:**
- UI: `components/ProductionTab.jsx`
- Logic: `features/engine/production.js`
- Hook: `hooks/useProduction.js`

**Staff & Loyalty:**
- UI: `components/ManagementTab.jsx`
- Logic: `hooks/useManagement.js`
- Formula: `utils/gameMath.js` (getLoyaltyBonus)

**Police & Heat:**
- UI: `components/Header.jsx`
- Logic: `features/engine/events.js`
- Config: `config/gameConfig.js` (heat section)

**Rivals:**
- UI: `components/RivalsTab.jsx`
- Logic: `hooks/useGameActions.js`
- Config: `config/gameConfig.js` (rival section)

**Laundering:**
- UI: `components/FinanceTab.jsx`
- Logic: `hooks/useFinance.js`
- Engine: `features/engine/economy.js`

---

## 🎯 COMMON TASKS

### Adding a New Product
1. `config/gameConfig.js` - Add to production object
2. `utils/initialState.js` - Add to inv/prices
3. `features/engine/production.js` - Add production logic
4. `components/ProductionTab.jsx` - UI will auto-generate

### Adding a New Staff Role
1. `config/gameConfig.js` - Add to staff object
2. `utils/initialState.js` - Add to staff object
3. `hooks/useManagement.js` - Verify hire/fire logic
4. `features/engine/production.js` - Add production/sales logic
5. `components/ManagementTab.jsx` - UI will auto-generate

### Adding a New Territory
1. `config/gameConfig.js` - Add to territories array
2. `components/NetworkTab.jsx` - UI will auto-generate

### Changing Formulas
1. `utils/gameMath.js` - Update function
2. `FORMULAS.md` - Document change
3. `GAME_DESIGN_DOCUMENT.md` - Update GDD

---

```
> FILE STRUCTURE: DOCUMENTED
> NAVIGATION: SIMPLIFIED
> MAINTENANCE: OPTIMIZED
> 
> "Know your codebase. Master your craft."
```
