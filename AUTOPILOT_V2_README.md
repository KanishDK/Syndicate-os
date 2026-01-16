# 🤖 AutoPilot v2.0 - QA Auto-Player

## Oversigt

AutoPilot v2.0 er et avanceret QA-system der kan spille dit spil automatisk for at finde bugs og teste balance. Det bruger **dispatch actions** i stedet for DOM-manipulation og har **CONFIG-baseret logik**.

## Hurtig Start

```javascript
// Start AutoPilot
autoPilot.toggle();

// Stop AutoPilot
autoPilot.toggle();

// Se rapport
autoPilot.getReport();
```

## Funktioner

### ✅ CONFIG-Baseret Beslutningslogik

AutoPilot prioriterer handlinger baseret på `gameConfig.js`:

**PRIORITET 1: OVERLEVELSE (Heat Management)**
- Hvis `heat >= CONFIG.heat.maxSafe` (80):
  - Køb Lawyer (hvis råd)
  - Bribe police (hvis råd)

**PRIORITET 2: HVIDVASK**
- Hvis `dirtyCash > 10k` OG `cleanCash < 5k`:
  - Køb Accountant (passiv hvidvask)
  - Manuel hvidvask (50% af dirty cash)

**PRIORITET 3: VÆKST (Tier-baseret)**
- Køb billigste staff fra laveste tier først:
  - Tier 1: reqLevel 1-3
  - Tier 2: reqLevel 4-6
  - Tier 3: reqLevel 7-9
  - Tier 4: reqLevel 10+

**PRIORITET 4: UPGRADES**
- Køb billigste tilgængelige upgrade

**PRIORITET 5: IDLE**
- Gem penge til næste køb

### ✅ Dispatch-Driven Actions

AutoPilot bruger IKKE DOM-manipulation. Den kalder dispatch actions direkte:

```javascript
dispatch({ type: 'HIRE_STAFF', payload: { role: 'lawyer', amount: 1 } })
dispatch({ type: 'BRIBE_POLICE' })
dispatch({ type: 'LAUNDER', payload: { amount: 5000 } })
dispatch({ type: 'BUY_UPGRADE', payload: { id: 'warehouse' } })
```

### ✅ Tab Switching

AutoPilot skifter automatisk til den rigtige tab før hver handling:

```javascript
setActiveTab('management'); // Før køb af staff
setActiveTab('finance');    // Før hvidvask
setActiveTab('rivals');     // Før bribe police
```

### ✅ Game Stall Detection

AutoPilot overvåger om spillet er gået i stå:

- Hvis ingen tick i > 5 sekunder → **CRITICAL BUG**
- Logger tid siden sidste tick

### ✅ Bug Detection

AutoPilot scanner automatisk for:

- **NaN værdier** i `cleanCash`, `dirtyCash`, `heat` (CRITICAL)
- **Negative cleanCash** uden `sultanMercy` (CRITICAL)
- **Overflow** (cleanCash > 1e15) (WARNING)

## Teknisk Implementation

### Eksponerede Variabler

AutoPilot får adgang til spillet via:

```javascript
window.__GAME_STATE__      // Game state (fra GameContext)
window.__GAME_CONFIG__     // CONFIG objekt
window.__GAME_DISPATCH__   // dispatch funktion
window.__SET_ACTIVE_TAB__  // setActiveTab funktion
```

### Arkitektur

```
main.jsx
  └─> Instantierer AutoPilot
  └─> Exposer som window.autoPilot

GameContext.jsx
  └─> Exposer state, CONFIG, dispatch

UIContext.jsx
  └─> Exposer setActiveTab

AutoPilot.js
  └─> Læser fra window.__GAME_STATE__
  └─> Kalder window.__GAME_DISPATCH__
  └─> Kalder window.__SET_ACTIVE_TAB__
```

## Avanceret Brug

### Custom Speed

```javascript
// Ændre hastighed (ms mellem beslutninger)
autoPilot.speed = 1000; // 1 sekund
autoPilot.speed = 5000; // 5 sekunder
```

### Manuel Instantiering

```javascript
// Lav din egen instance
const customPilot = new AutoPilot();
customPilot.speed = 500; // Meget hurtig
customPilot.start();
```

### Eksporter Rapport

```javascript
// Få rapport som JSON
const report = autoPilot.getReport();

// Eksporter til fil
const json = JSON.stringify(report, null, 2);
console.log(json);

// Eller copy til clipboard
copy(JSON.stringify(report, null, 2));
```

## Rapport Format

```javascript
{
  runtime: 120.5,           // Sekunder
  actionsPerformed: 45,     // Antal handlinger
  bugs: [                   // Liste af bugs
    {
      time: "12:34:56",
      level: "CRITICAL",
      message: "cleanCash is NaN",
      error: null,
      state: { ... }
    }
  ],
  warnings: [ ... ],        // Liste af advarsler
  actionLog: [ ... ]        // Komplet log
}
```

## Forskelle fra v1.0

| Feature | v1.0 | v2.0 |
|---------|------|------|
| Action Method | DOM clicks | Dispatch actions |
| Decision Logic | Hardcoded | CONFIG-based |
| Tab Switching | ❌ | ✅ |
| Game Stall Detection | ❌ | ✅ (5s watchdog) |
| Heat Management | Basic | Priority #1 |
| Tier-based Growth | ❌ | ✅ |
| Usage | `new AutoPilot().start()` | `autoPilot.toggle()` |

## Troubleshooting

### "Cannot access game context"
- Sørg for at spillet kører i development mode
- Check at `window.__GAME_STATE__` og `window.__GAME_DISPATCH__` er defineret

### AutoPilot gør ingenting
- Check console for fejlmeddelelser
- Verificer at `autoPilot.isRunning === true`
- Se `autoPilot.getReport()` for detaljer

### "Game stalled" fejl
- Spillet er gået i stå (ingen tick i 5+ sekunder)
- Check for infinite loops eller crashes i game loop
- Se browser console for errors

## Eksempel Session

```javascript
// 1. Start spillet normalt
// 2. Åbn browser console (F12)

// 3. Start AutoPilot
autoPilot.toggle();

// 4. Se logs i konsollen
// [AutoPilot 12:34:56] 🎯 Buy junkie (Tier 1)
// [AutoPilot 12:34:56] 📑 Switched to tab: management
// [AutoPilot 12:34:56] ✅ Action executed: HIRE_STAFF

// 5. Lad den køre i 5 minutter...

// 6. Stop og se rapport
autoPilot.toggle();

// 📊 ===== AUTOPILOT REPORT =====
// ⏱️  Runtime: 300.2s
// 🎯 Actions Performed: 67
// 🐛 Bugs Found: 0
// ⚠️  Warnings: 0
```

## Fremtidige Forbedringer

- [ ] Machine learning til optimal strategi
- [ ] Performance metrics (FPS, memory)
- [ ] Screenshot capture ved bugs
- [ ] Automated regression testing
- [ ] Support for flere strategier (speedrunner, tycoon)
