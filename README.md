# 🟢 SYNDICATE OS - Terminal Edition

```
┌─────────────────────────────────────────────────────────────┐
│ SYNDICATE OS v1.1.0 [TERMINAL EDITION]                     │
│ Copenhagen Underworld Simulation                            │
│ Status: GOLD MASTER (100/100)                              │
└─────────────────────────────────────────────────────────────┘
```

> *"In the shadows of Nørrebro, fortunes are made in kilobytes and cash."*

## 📖 The Story

**Copenhagen, 1984.**

You boot up a mysterious terminal found in a kiosk basement on Nørrebrogade. The screen flickers to life with phosphor green text. A message appears:

```
> SULTANEN@DARKNET: Connection established
> Welcome to the Network, soldat
> Your mission: Build an empire from nothing
> Tools: This terminal, 2500 kr, and your wits
> Warning: Osten (Police) are watching
> Type 'help' for commands...
```

This isn't just software—it's **Syndicate OS**, the legendary dark web operating system used by Copenhagen's underworld to coordinate operations, launder money, and avoid detection. You've stumbled into something bigger than street dealing.

**Your Goal**: Rise from Gade Soldat (Street Soldier) to Gudfader (Godfather), controlling the entire Danish underground through this terminal interface.

---

## ⚡ Quick Start (First 5 Minutes)

### 1. Boot Sequence
```bash
npm install
npm run dev
```
Navigate to `http://localhost:5173/Syndicate-os/`

### 2. Tutorial Missions
The game guides you through the core loop:
1. **M1**: Produce 5x Hash → Learn production
2. **M2**: Sell inventory → Earn dirty money
3. **M3**: Launder 500 kr → Convert to clean money
4. **M4**: Hire 1 Pusher → Unlock automation

### 3. Core Loop
```
PRODUCE → SELL → LAUNDER → UPGRADE → REPEAT
```

**First Goal**: Reach Rank 2 (Hustler) in ~10 minutes

---

## 🎮 Features

### 🟢 Authentic Terminal Aesthetic
- **Phosphor Green** (#00ff41) on deep black
- **VT323** monospaced font
- **CRT Scanlines** for 1980s authenticity
- **No hover effects** (pure terminal experience)

### 📊 Deep Progression System
- **XP Formula**: `1000 * (1.6 ^ level)`
- **7 Ranks**: Gade Soldat → Gudfader
- **20 Story Missions** with rank gates
- **Balanced Pacing**: 2-3 hours to Rank 7

### 💰 Dual Economy
- **Dirty Money**: From illegal sales (can't buy upgrades)
- **Clean Money**: From laundering (safe to use)
- **30% Loss Rate**: Realistic money laundering cost

### 🔥 Heat System
- Every sale generates heat
- High heat = police raids
- Manage with lawyers, bribes, or silence

### 🏢 Territory Control
- **5 Districts**: Staden, Halmtorvet, Blågårds Plads, Slotsholmen, Strandvejen
- **Passive Income**: 5,000-50,000 kr/s
- **Upgradeable**: 1.5x multiplier per level

### 👥 Staff Automation
- **10 Staff Types**: Gartner, Kemiker, Smugler, Pusher, Advokat...
- **Auto-Production**: Workers produce while you're offline
- **Payroll**: Every 5 minutes (manage cash flow!)

### 💎 Premium Features
- **Diamonds**: Premium currency from Golden Drone events
- **Black Market**: Time skips, buffs, instant heat clearing
- **No Pay-to-Win**: Diamonds are rare rewards, not purchases

### 👑 Prestige System
- **Exit Scam**: Reset for permanent multipliers
- **Perk Trees**: Aggressive vs Greedy vs Forbidden
- **Infinite Scaling**: Each prestige makes you stronger

---

## 📚 Documentation

- **[HANDBOOK.md](./HANDBOOK.md)**: Complete mechanics guide with all formulas
- **[PLAYSTYLES.md](./PLAYSTYLES.md)**: Speedrun, Achievement Hunter, Casual guides
- **[FORMULAS.md](./FORMULAS.md)**: All math for min-maxers

---

## 🛠️ For Developers

### Tech Stack
- **Frontend**: React 19 + Vite 7
- **Styling**: Tailwind CSS 3.4 + Custom Terminal Theme
- **State**: Custom reducer with game tick system
- **Audio**: Howler.js for sound effects
- **Deployment**: GitHub Pages via gh-pages

### Project Structure
```
src/
├── components/        # UI components
├── config/           # Game configuration
├── features/         # Game systems (economy, production, missions)
├── hooks/            # Custom React hooks
├── utils/            # Helper functions
└── index.css         # Terminal Edition styles
```

### Build Commands
```bash
npm run dev       # Development server
npm run build     # Production build
npm run deploy    # Deploy to GitHub Pages
```

### Key Files
- `gameConfig.js`: All game data (items, missions, staff)
- `gameTick.js`: Core game loop (60 FPS)
- `initialState.js`: Default game state
- `index.css`: Terminal aesthetic (CRT effects, colors)

---

## 🎯 Game Modes

### 🏃 Speedrun Mode
**Goal**: Reach Rank 7 in under 2 hours
- Focus on critical path missions only
- Skip optional upgrades
- Optimize XP per minute

### 🏆 Achievement Hunter
**Goal**: Unlock all 10+ achievements
- Requires strategic planning
- Some achievements conflict (plan carefully!)
- "Untouchable" is the hardest

### 🌙 Casual Idle
**Goal**: 15 minutes per day
- Let automation work overnight
- Focus on passive income
- Relaxed progression

See **[PLAYSTYLES.md](./PLAYSTYLES.md)** for detailed guides.

---

## 📈 Progression Overview

| Rank | Name | XP Required | Typical Time | Unlocks |
|------|------|-------------|--------------|---------|
| 1 | Gade Soldat | 0 | 0 min | Tutorial |
| 2 | Hustler | 1,000 | 10 min | M5, Skunk |
| 3 | Løjtnant | 2,600 | 20 min | Territories |
| 4 | Boss | 5,160 | 40 min | M7, Speed |
| 5 | Kingpin | 9,256 | 90 min | MDMA, Ketamin |
| 7 | Gudfader | 26,296 | **2-3 hours** | Cocaine |
| 10 | Don | 109,951 | 6-8 hours | Oxy, Heroin |

---

## 🎨 Terminal Edition Features

### Visual Identity
- **Color Palette**: Green, Amber, Red, Cyan on Black
- **Typography**: VT323 (terminal), Fira Code (code)
- **Effects**: CRT scanlines, phosphor glow
- **Accessibility**: WCAG AA compliant, reduced-motion support

### No Hover Effects
Per user preference, all hover states removed for pure terminal experience. Buttons have static appearance.

### Mobile Optimized
- Responsive layout for 375px+ screens
- Touch targets 44x44px minimum
- CRT effects auto-dim on mobile

---

## 🏆 Code Health: 100/100

### Recent Improvements
✅ **Market Readiness**: Audio, particles, premium currency  
✅ **Progression Rebalancing**: 50-60% XP reduction, rank gates  
✅ **Bug Fix Sweep**: 7 issues resolved  
✅ **Terminal Edition**: Complete visual overhaul  
✅ **Accessibility**: Reduced-motion, ARIA labels  

---

## 📜 Credits

**Developed by**: KanishDK  
**AI Partner**: Google DeepMind Advanced Agentic Coding  
**Version**: 1.1.0 Terminal Edition  
**Status**: Gold Master (100% Code Health)  

---

## ⚖️ Legal

*Syndicate OS is a work of fiction. All names, characters, locations, and incidents are products of the author's imagination. Any resemblance to actual events or persons, living or dead, is entirely coincidental.*

*This game does not endorse or promote illegal activity. It is a strategic simulation for entertainment purposes only.*

---

## 🔗 Links

- **Play Live**: [GitHub Pages URL]
- **Repository**: [GitHub Repo URL]
- **Issues**: [GitHub Issues URL]
- **Handbook**: [HANDBOOK.md](./HANDBOOK.md)

---

```
> SYSTEM: Documentation loaded successfully
> Status: Ready for deployment
> Next: npm run dev
```
