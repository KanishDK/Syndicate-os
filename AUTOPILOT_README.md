# 🤖 AutoPilot - QA Auto-Player Documentation

## Hvad er AutoPilot?

AutoPilot er et automatisk test-system der kan spille dit spil selv for at finde bugs og teste balance. Det fungerer som en "kunstig spiller" der:

1. **Observer** spil-state (penge, ressourcer, level, heat)
2. **Beslutter** hvilke handlinger der skal tages (køb billigste staff/upgrades, hvidvask ved høj heat)
3. **Udfører** handlinger ved at simulere klik på knapper
4. **Rapporterer** bugs (NaN værdier, negative penge, fejlede køb)

## Installation

AutoPilot er allerede integreret i dit spil! Når du kører i development mode (`npm run dev`), bliver AutoPilot automatisk loadet.

## Brug fra Browser Console

### Start AutoPilot med standard indstillinger:
```javascript
const pilot = new AutoPilot();
pilot.start();
```

### Start med custom indstillinger:
```javascript
const pilot = new AutoPilot({ 
    speed: 1000,           // 1 sekund mellem handlinger (hurtigere)
    strategy: 'aggressive' // 'aggressive', 'balanced', eller 'safe'
});
pilot.start();
```

### Stop AutoPilot:
```javascript
pilot.stop();
```

### Se rapport:
```javascript
// Print rapport i konsollen
pilot.printReport();

// Få rapport som objekt
const report = pilot.getReport();
console.table(report.bugs);
console.table(report.warnings);

// Eksporter som JSON
const json = JSON.stringify(pilot.getReport(), null, 2);
console.log(json);
```

## Hvad gør AutoPilot?

### Beslutningslogik (prioriteret):

1. **Emergency Laundering**: Hvis dirty cash > 50k OG heat > 50 → Hvidvask
2. **Køb Staff**: Find billigste affordable staff member og køb den
3. **Køb Upgrade**: Find billigste affordable upgrade og køb den
4. **Launder**: Hvis dirty cash > 5k → Hvidvask
5. **Idle**: Gem penge til næste køb

### Bug Detection:

AutoPilot scanner automatisk for:

- **NaN værdier** i state (CRITICAL)
- **Negative cleanCash** (CRITICAL)
- **Overflow** (cleanCash > 1e15) (WARNING)
- **Fejlede køb** (penge ikke trukket, count ikke øget) (WARNING)

### Rapport Indhold:

- **Runtime**: Hvor længe AutoPilot har kørt
- **Actions Performed**: Antal handlinger udført
- **Bugs Found**: Liste af fundne bugs med severity level
- **Warnings**: Liste af advarsler
- **State History**: Snapshot af state over tid (cash, level, heat)
- **Action Log**: Komplet log af alle handlinger

## Eksempel Session

```javascript
// Start spillet normalt
// Åbn browser console (F12)

// Start AutoPilot
const pilot = new AutoPilot({ speed: 2000 });
pilot.start();

// Lad den køre i 5 minutter...
// Se logs i konsollen

// Stop og se rapport
pilot.stop();

// Hvis der er bugs:
pilot.getReport().bugs.forEach(bug => {
    console.log(`[${bug.level}] ${bug.message}`);
    console.log('State:', bug.state);
});
```

## Tekniske Detaljer

### State Access:
AutoPilot får adgang til game state via `window.__GAME_STATE__` som bliver exposed af GameContext.jsx i development mode.

### Action Execution:
AutoPilot finder knapper ved at scanne DOM'en for:
- Text content (f.eks. "Ansæt", "Køb", "Hvidvask")
- Data attributes (f.eks. `data-upgrade="warehouse"`)
- CSS classes (f.eks. `.buy-button`)

### Verification:
Efter hver handling sammenligner AutoPilot state før og efter for at verificere at handlingen lykkedes.

## Begrænsninger

- **Kun Development Mode**: AutoPilot er kun tilgængelig når `import.meta.env.DEV === true`
- **DOM Afhængig**: AutoPilot finder knapper via text content, så hvis button text ændres kan det påvirke funktionaliteten
- **Simpel Strategi**: Nuværende strategi er "køb billigste" - kan udvides med mere avanceret logik

## Fremtidige Forbedringer

- [ ] Support for flere strategier (speedrunner, tycoon, etc.)
- [ ] Machine learning til at lære optimal strategi
- [ ] Screenshot capture ved bugs
- [ ] Performance metrics (FPS, memory usage)
- [ ] Automated regression testing

## Troubleshooting

### "Cannot access game state"
- Sørg for at spillet kører i development mode
- Check at `window.__GAME_STATE__` er defineret i console

### "Could not find button"
- AutoPilot kan ikke finde knappen i DOM'en
- Check at button text matcher forventet format
- Tilføj data attributes til buttons for bedre targeting

### AutoPilot crasher
- Check console for error messages
- Se `pilot.getReport().bugs` for detaljer
- Report bug til udvikler med state snapshot
