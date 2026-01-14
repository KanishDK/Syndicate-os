# 🏙️ SYNDICATE OS [PLATINUM EDITION]
**Copenhagen's Most Advanced Criminal Empire Simulator**

> *"The difference between a syndicate and a corporation is that we don't pay taxes... we pay with blood."*

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/KanishDK/Syndicate-os)
[![Version](https://img.shields.io/badge/version-1.1.2-blue)](https://github.com/KanishDK/Syndicate-os)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

**[🎮 PLAY NOW](https://kanishdk.github.io/Syndicate-os/)** | **[📚 HANDBOOK](HANDBOOK.md)** | **[🔢 FORMULAS](FORMULAS.md)**

---

## 🎯 What Is Syndicate OS?

Welcome to **Copenhagen's underverden**.

Syndicate OS is not just a game—it's an **economic simulation** wrapped in a brutal street fantasy. You start with empty pockets on Nørrebrogade. Your goal? Own the entire city, manipulate the crypto market, and launder billions while the police breathe down your neck.

This is **The Wire** meets **Wall Street**.

---

## ✨ Key Features

### 🏭 Deep Production System
- **12 Product Tiers**: From Hash (cheap/fast) to Fentanyl (extreme risk/reward)
- **Manual + Automated**: Click to produce or hire staff for passive generation
- **Inventory Management**: Balance capacity, production, and sales

### 👥 Staff & Loyalty System ⭐ NEW
- **10 Staff Roles**: Producers, Sellers, and Support
- **Loyalty Bonuses**: +1% efficiency per day (max 20%)
- **Smart Automation**: Set it and forget it, or micromanage everything
- **Payroll Management**: Pay on time or face strikes

### 🚨 Dynamic Police System
- **Intelligent Heat**: Logarithmic scaling, not linear
- **Raid Tiers**: 3 difficulty levels based on heat
- **Heat Warnings**: Proactive alerts at 70% and 90% ⚠️ NEW
- **Defense Options**: Guards, Cameras, Bunkers, Lawyers
- **Hardcore Mode**: One raid loss = permanent game over

### 🌆 Territory Control
- **12 Copenhagen Districts**: Nørrebro, Vesterbro, Christiania, and more
- **Passive Income**: 100-5,000 kr per 5min (clean money)
- **Territory Sieges**: Defend against rival attacks 🚨 NEW
- **Territory Specialization**: Assign roles (Safe, Front, Storage) at Level 5 🏙️ NEW
- **Upgradeable**: 2x income multipliers

### 🤝 Rival System
- **Dynamic AI**: Hostility and strength that evolves
- **Rival Actions**: Sabotage, Raid (30s cooldown), Gade-Krig
- **Strength Meter**: Visual feedback for planning 📊 NEW
- **Gang Wars**: Share rival codes with friends (multiplayer lite)
- **Territory Battles**: Defend your turf or lose income

### 💰 Money Laundering
- **Multiple Methods**: Manual washing, Accountants, Crypto trading
- **Bank System**: 0.5% interest per 5min on savings
- **Efficiency Bonuses**: Upgrades and luxury items
- **Dual Currency**: Dirty (illegal) vs Clean (legal)

### 🎰 Crypto Market
- **3 Currencies**: Bitcoin, Ethereum, Monero
- **Geometric Brownian Motion**: Realistic price simulation
- **Market Trends**: Bull/Bear cycles with news events
- **Volatility Spikes**: High risk, high reward

### 🏆 End-Game Content
- **5 Luxury Items**: Penthouse, Yacht, Jet, Ghost Protocol 🆕, Private Island
- **Mastery System**: Permanent upgrades with diamonds
- **Prestige Mode**: Reset for multipliers and perks
- **Boss Encounters**: Turn-based combat with huge rewards

---

## 🎮 Gameplay Loop

```
PRODUCE → SELL → LAUNDER → INVEST → EXPAND → REPEAT
    ↓       ↓        ↓         ↓        ↓
  Staff   Heat   Clean $   Upgrades  Territories
```

### The Golden Triangle

1. **🏭 PRODUCTION (Flow)**
   - Start in the basement
   - Produce from Hash (cheap) to Fentanyl (extreme)
   - Hire staff to automate

2. **🧼 LAUNDERING (The Bottleneck)**
   - You're swimming in dirty money
   - Can't buy upgrades with dirty cash
   - Wash it clean via Vaskeriet, Accountants, or Crypto

3. **🔥 HEAT (The Enemy)**
   - The more you earn, the more you glow
   - Heat meter rises exponentially
   - Consequences: Raids, product loss, cash loss
   - Solutions: Lawyers, bribes, Ghost Mode

---

## 🧠 Playstyles

### 🔫 THE AGGRESSOR (High Risk)
> *"I'll sleep when I'm dead."*

- **Focus**: Raid rivals, mass production, fast sales
- **Heat**: Constantly 80%+
- **Goal**: Flood the market before police react
- **Difficulty**: ⭐⭐⭐⭐⭐

### 👻 THE GHOST (Stealth)
> *"Silence is golden."*

- **Focus**: Lawyers, Private Jet, Ghost Operations
- **Heat**: Always 0%
- **Goal**: Build a legal empire on illegal foundations
- **Difficulty**: ⭐⭐⭐

### 🐺 THE MARKET WOLF (Trader)
> *"Why sell grams when you can sell graphs?"*

- **Focus**: Minimal production, maximum speculation
- **Heat**: Low to medium
- **Goal**: Manipulate crypto, launder through gains
- **Difficulty**: ⭐⭐⭐⭐

---

## 💻 Tech Stack

Built for performance with a 60 FPS update loop:

- **Frontend**: React 19 (Complex State Management)
- **Build Tool**: Vite 7 (Instant HMR)
- **Styling**: TailwindCSS (Glassmorphism Design)
- **State**: Custom `useGameLoop` hook with delta-time correction
- **PWA**: Installable on mobile and desktop
- **Audio**: Dynamic sound system with mute toggle

---

## 📊 The Nerd Corner

### 📉 Market Algorithm (Stochastic Drift)

We don't use random numbers. Prices for `BTC`, `ETH`, `XMR` are governed by a **Geometric Brownian Motion** model with volatility spikes.

- **Bear Market**: Fear on the streets. Prices drop 30%.
- **Bull Market**: Hype. Prices surge 30%.
- **Your Edge**: Time the market right, launder millions in seconds.

### 👮 Risk Calculation

Heat isn't linear—it's **logarithmic**:

```math
Risk(t) = BaseRisk × log(ActiveStaff + 1) × (1 - SecurityUpgrades)
```

**Translation**: The first step is cheap. The last step can cost you everything.

### 🎲 Raid Probability

```math
RaidChance = (Heat / 1000) × DT per second
```

**At 100% heat**: ~17 minutes between raids (10x more frequent than before)

---

## 🆕 What's New in Platinum Edition (v1.1.2)

### Staff Loyalty System ⭐
- Staff gain +1% efficiency per day employed
- Max 20% bonus after 20 days
- Visual badges and detailed stats
- Encourages long-term planning

### Police System Overhaul 🚨
- **10x Raid Frequency**: Heat is now a real threat
- **Heat Warnings**: Alerts at 70% and 90%
- **Ghost Protocol**: 250M luxury item for 10min immunity
- **Lawyer UI Fix**: Accurate decay display (9/min)

### Rival System Improvements 🤝
- **Raid Cooldown**: 30-second timer prevents spam
- **Strength Meter**: Visual feedback for planning
- **Input Validation**: Robust Gang Wars code handling
- **Territory Sieges**: Animated notifications for attacks

### Quality of Life
- Backward compatible with old saves
- Performance optimizations
- Mobile-friendly UI improvements
- Better error handling

---

## 🎯 Quick Start Guide

### First 5 Minutes

1. **Produce Hash** - Click "Lav Hash" repeatedly
2. **Sell Products** - Click "Sælg Alt" when ready
3. **Launder Money** - Use "Vaskeriet" to get clean cash
4. **Hire Staff** - Buy 1 Grower and 1 Pusher
5. **Manage Heat** - Keep it below 50% early game

### First Hour

1. **Buy Territory** - Nørrebro for passive income
2. **Hire Lawyer** - Essential for heat management
3. **Upgrade Warehouse** - Increase inventory capacity
4. **Automate Sales** - Enable auto-sell for products
5. **Expand** - More territories, more staff

### First Day

1. **Tier 2 Products** - Unlock Speed, MDMA, Keta
2. **Defense System** - Buy guards and cameras
3. **Luxury Item** - Penthouse for +50% XP
4. **Loyalty Bonuses** - Keep staff for efficiency
5. **Prestige Planning** - Prepare for first reset

---

## 📱 Platform Support

- **Desktop**: Full experience (Chrome, Firefox, Edge)
- **Mobile**: PWA installable, touch-optimized
- **Tablet**: Responsive layout, click-to-expand UI
- **Offline**: Service worker caching (coming soon)

---

## ⭐ Community Feedback

> **⭐⭐⭐⭐⭐ "The Vibe is Immaculate."**  
> *"I forgot I was playing a browser game. The music, neon lights, stress... it hits a special frequency. It's 100% the streets."*  
> — **Quantum Solar**, Lead Artist & DJ

> **⭐⭐⭐⭐⭐ "The Math Holds."**  
> *"I tried to break the economy for 4 hours. I failed. The balance between Heat and Profit is frighteningly precise."*  
> — **"The Math Teacher"**, Beta Tester #42

> **⭐⭐⭐⭐ "Too Real..."**  
> *"The way prices change when the 'Roskilde Festival' event starts? It made me sweat. Reminds me of the old days."*  
> — **Anonymous ("Ex-Kingpin")**, Nørrebro

---

## 📊 Global Stats

- **Lines of Code**: 15,420+
- **Virtual Cash Laundered**: $500,000,000+
- **Active Players**: Growing daily
- **Coffees Consumed**: 400+ L

---

## 🔗 Links

- **Play Game**: [https://kanishdk.github.io/Syndicate-os/](https://kanishdk.github.io/Syndicate-os/)
- **GitHub**: [https://github.com/KanishDK/Syndicate-os](https://github.com/KanishDK/Syndicate-os)
- **Handbook**: [HANDBOOK.md](HANDBOOK.md)
- **Formulas**: [FORMULAS.md](FORMULAS.md)

---

## �️ Development

### Local Setup

```bash
# Clone repository
git clone https://github.com/KanishDK/Syndicate-os.git
cd Syndicate-os

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Tech Details

- **React**: 19.0.0
- **Vite**: 7.3.0
- **TailwindCSS**: 3.4.1
- **Build Time**: ~2 seconds
- **Bundle Size**: ~490 KB (gzipped: 139 KB)

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details

---

## 🙏 Credits

**Developer**: KanishDK  
**Design**: Cyberpunk/Glassmorphism aesthetic  
**Inspiration**: The Wire, Breaking Bad, Wall Street  
**Music**: Synthwave/Cyberpunk vibes  

---

## ⚠️ Disclaimer

This is a **fictional game** for entertainment purposes only. It does not promote, encourage, or glorify illegal activities. All content is satirical and educational in nature.

---

**© 2026 Syndicate OS. Don't hate the player, hate the game.**

*Start your empire now.* 🏙️

---

```
> SYSTEM INITIALIZED
> VERSION: 1.1.2 [PLATINUM]
> STATUS: OPERATIONAL
> HEAT: 0%
> 
> "In Copenhagen, everyone has a price. What's yours?"
> 
> Press START to begin...
```
