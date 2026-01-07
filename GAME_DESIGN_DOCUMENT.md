# 📘 SYNDICATE OS - COMPLETE GAME DESIGN DOCUMENT
**Technical Reference & Development Guide**

> **Version:** 1.1.2 [PLATINUM]  
> **Last Updated:** 2026-01-07  
> **Purpose:** Complete technical reference for patches, balance changes, and future development  
> **Audience:** Developers, designers, balance team

```
> SYSTEM: Loading complete game specification...
> STATUS: Comprehensive technical documentation
> ACCESS LEVEL: Developer
```

---

## 📑 TABLE OF CONTENTS

1. [Game Overview](#1-game-overview)
2. [Core Mechanics](#2-core-mechanics)
3. [Systems Documentation](#3-systems-documentation)
4. [Formulas & Balance](#4-formulas--balance)
5. [Technical Architecture](#5-technical-architecture)
6. [AI Rules & Guidelines](#6-ai-rules--guidelines)
7. [Patch History](#7-patch-history)
8. [Future Roadmap](#8-future-roadmap)

---

## 1. GAME OVERVIEW

### 1.1 Vision Statement

**Syndicate OS** is a deep economic simulation disguised as an idle tycoon game. Players manage a criminal empire in Copenhagen, balancing production, sales, laundering, and heat management while expanding territory and competing with rivals.

**Core Pillars:**
1. **Economic Depth** - Dual currency, complex laundering, realistic market simulation
2. **Strategic Choice** - Multiple viable playstyles, meaningful decisions
3. **Risk Management** - Heat system creates tension and consequences
4. **Progression** - Clear milestones from street level to global dominance

### 1.2 Target Audience

**Primary:** Idle/incremental game enthusiasts (18-35)  
**Secondary:** Strategy game players, economic simulation fans  
**Tertiary:** Casual mobile gamers

**Player Motivations:**
- Optimization and efficiency
- Long-term progression
- Strategic planning
- Number-go-up satisfaction

### 1.3 Unique Selling Points

1. **Dual Currency System** - Dirty vs Clean money creates strategic bottleneck
2. **Heat Mechanics** - Logarithmic scaling creates escalating tension
3. **Staff Loyalty** - Time-based bonuses reward long-term planning
4. **Realistic Economics** - Geometric Brownian Motion for crypto, compound interest
5. **Copenhagen Setting** - Authentic Danish underworld flavor

### 1.4 Version History

| Version | Date | Key Changes |
|---------|------|-------------|
| 1.0.0 | 2025-12 | Initial release |
| 1.0.4 | 2026-01-01 | Post-Expo fixes, level title bug, Junkie exploit |
| 1.1.0 | 2026-01-05 | PWA support, Multiplayer Lite (Gang Wars) |
| 1.1.1 | 2026-01-06 | Rival QoL, Police balance, Operations audit |
| 1.1.2 | 2026-01-07 | Staff Loyalty System, Heat warnings, Documentation |

---

## 2. CORE MECHANICS

### 2.1 Dual Currency System

**Design Philosophy:** Create strategic bottleneck that forces player engagement

**Dirty Money (Sorte Penge):**
- Source: Product sales, rival raids
- Uses: Laundering only
- Properties: Generates heat when accumulated
- Cannot be used for upgrades/staff

**Clean Money (Rene Penge):**
- Source: Territories, laundered profits, missions
- Uses: All purchases (staff, upgrades, territories, luxury items)
- Properties: No heat generation
- Safe to accumulate

**Balance Considerations:**
- Laundering loss: 30% (realistic professional fees)
- Forces player to engage with laundering mechanics
- Creates meaningful choice: fast dirty money vs slow clean money

### 2.2 Production Pipeline

**12 Product Tiers:**

| Tier | Products | Base Revenue | Heat/Unit | Unlock Level |
|------|----------|--------------|-----------|--------------|
| 1 | Hash Lys, Piller Mild | 50-100 kr | 0.02-0.05 | 1 |
| 2 | Hash Mørk, Speed, MDMA, Keta | 200-500 kr | 0.1-0.3 | 2-5 |
| 3 | Coke, Benzos, Svampe | 1k-3k kr | 0.5-1.0 | 7-8 |
| 4 | Oxy, Heroin, Fentanyl | 5k-10k kr | 2.0-5.0 | 10-12 |

**Production Methods:**

**Manual:**
- Click "Producer Nu" button
- Progress bar (1-5 seconds based on tier)
- Instant completion
- Active engagement

**Automated:**
- Hire producer staff
- Passive generation per second
- Scales with staff count
- Loyalty bonuses apply

**Capacity Management:**
- Base: 100 units
- Warehouse upgrade: 2^level multiplier
- Overflow: Production stops when full
- Strategic: Balance production vs sales

### 2.3 Sales Automation

**Manual Sales:**
- Click "Sælg Alt" button
- Instant revenue
- Generates heat
- Visual feedback (floating numbers)

**Automated Sales:**
- Hire seller staff
- Passive sales per second
- Auto-sell toggle per product
- Heat malus at high levels

**Heat Malus:**
```javascript
heatMalus = heat >= 95 ? 0.2 : (heat >= 80 ? 0.5 : (heat >= 50 ? 0.8 : 1.0))
```

**Sales Rate:**
```javascript
effectiveRate = staffCount × baseRate × heatMalus × dt × (1 + loyaltyBonus)
```

### 2.4 Heat System

**Design Philosophy:** Logarithmic tension that escalates exponentially

**Heat Generation:**
- Product sales (tier-based)
- Territory ownership (passive +0.5-2% per territory)
- Rival attacks (+20 heat)

**Heat Decay:**
```javascript
decay = (0.1 + lawyers × 0.15 + ghostOpsMastery) × dt
```

**Heat Warnings (v1.1.2):**
- 70% Heat: ⚠️ Yellow warning
- 90% Heat: 🚨 Red alert + alarm sound
- Hysteresis: 5% buffer to prevent spam

**Raid System:**
```javascript
raidChance = (heat / 1000) × dt per second
```

**At 100% heat:** ~17 minutes average (10x more frequent than v1.0)

**Raid Tiers:**
| Heat Level | Tier | Success Chance | Penalty |
|------------|------|----------------|---------|
| 40-60% | 1 | Low | 10% cash + 20% product |
| 60-80% | 2 | Medium | 15% cash + 30% product |
| 80-100% | 3 | High | 25% cash + 50% product |

**Defense:**
- Guards: +10 defense each
- Cameras: +15 defense each
- Bunker: +50 defense
- Success = Raid prevented

---

## 3. SYSTEMS DOCUMENTATION

### 3.1 Staff System

**10 Staff Roles:**

**Producers:**
```javascript
{
  junkie: { cost: 1k, salary: 50, rates: { hash_lys: 0.35, piller_mild: 0.2 }, deathRate: 0.001 },
  grower: { cost: 15k, salary: 800, rates: { hash_lys: 0.5, hash_moerk: 0.3 } },
  chemist: { cost: 50k, salary: 2.5k, rates: { speed: 0.2, mdma: 0.15, keta: 0.1 } },
  importer: { cost: 100k, salary: 8k, rates: { coke: 0.05, benzos: 0.04, svampe: 0.03 } },
  labtech: { cost: 200k, salary: 12k, rates: { fentanyl: 0.02, oxy: 0.03, heroin: 0.025 } }
}
```

**Sellers:**
```javascript
{
  pusher: { cost: 5k, salary: 300, rates: { hash_lys: 0.5, piller_mild: 0.5 } },
  distributor: { cost: 20k, salary: 1.2k, rates: { hash_moerk: 0.5, speed: 0.4, mdma: 0.3, keta: 0.25 } },
  trafficker: { cost: 150k, salary: 6k, rates: { coke: 0.4, heroin: 0.25, fentanyl: 0.2, default: 0.3 } }
}
```

**Support:**
```javascript
{
  lawyer: { cost: 200k, salary: 10k, heatDecay: 0.15/s = 9/min },
  accountant: { cost: 1M, salary: 25k, launderingRate: +5% }
}
```

### 3.2 Staff Loyalty System (v1.1.2)

**Mechanics:**
```javascript
// State tracking
staffHiredDates: { [role]: timestamp }

// Bonus calculation
getLoyaltyBonus(hiredDate) {
  if (!hiredDate) return 0;
  const daysEmployed = (Date.now() - hiredDate) / (1000 * 60 * 60 * 24);
  return Math.min(20, Math.floor(daysEmployed)); // Max 20%
}
```

**Application:**
- Production: `rate × (1 + loyaltyBonus / 100)`
- Sales: `rate × (1 + loyaltyBonus / 100)`

**Reset Conditions:**
- Fire ALL staff of a role: Hire date cleared
- Fire SOME staff: Hire date preserved

**UI Indicators:**
- ⭐ Amber badge (top-right)
- Shows bonus percentage
- Expanded details show days employed

**Balance:**
- Max 20% (meaningful but not OP)
- 20 days to max (long-term investment)
- Encourages staff retention

### 3.3 Payroll System

**Interval:** Every 5 minutes (300,000 ms)

**Payment Priority:**
1. Clean cash (preferred, no penalty)
2. Dirty cash (emergency, +50% markup)
3. Strike (production halts)

**Strike Mechanics:**
```javascript
if (totalSalary > cleanCash + dirtyCash) {
  state.payroll.isStriking = true;
  // All production/sales stop
}
```

**Manual Payroll:**
- "UDBETAL LØN" button
- Pay immediately
- Resume operations

### 3.4 Territory System

**12 Copenhagen Districts:**

```javascript
territories: [
  { id: 'norrebro', name: 'Nørrebro', cost: 10k, income: 100, heat: 0.5, level: 1 },
  { id: 'vesterbro', name: 'Vesterbro', cost: 25k, income: 250, heat: 0.8, level: 3 },
  { id: 'christiania', name: 'Christiania', cost: 50k, income: 500, heat: 1.0, level: 5 },
  { id: 'osterbro', name: 'Østerbro', cost: 100k, income: 1k, heat: 1.2, level: 7 },
  { id: 'amager', name: 'Amager', cost: 200k, income: 2k, heat: 1.5, level: 9 },
  // ... 7 more
]
```

**Territory Levels:**
- Upgrade cost: `baseCost × 2^level`
- Income multiplier: `baseIncome × 1.5^(level-1)`
- Max level: Unlimited (exponential scaling)

**Territory Sieges (v1.1.1):**
```javascript
territoryAttacks: {
  [territoryId]: {
    startTime: timestamp,
    strength: rivalStrength
  }
}
```

- Duration: 60 seconds
- Defense required: Player defense > rival strength
- Failure: Lose territory income (not ownership)

### 3.5 Rival System

**Rival State:**
```javascript
rival: {
  name: 'Alpha Syndikatet',
  hostility: 0-100, // Aggression level
  strength: 0-200, // Power level
  territories: [], // Occupied territories
  eliminated: false,
  lastRaidTime: 0 // For cooldown (v1.1.1)
}
```

**Actions:**

**Sabotage (25k kr):**
- Effect: -10% strength, -25% hostility
- Use: Safe reduction

**Raid Rival (FREE, 30s cooldown):**
- Success: Steal 15-50k dirty money (60% chance)
- Failure: +10 hostility
- Requires: Heat <80%
- Cooldown: 30 seconds (v1.1.1)

**Gade-Krig (50k kr):**
- Effect: -15% strength, -30% hostility, +20 heat
- Use: Aggressive reduction

**Rival Strength Meter (v1.1.1):**
- Visual amber progress bar
- Shows exact percentage
- Helps plan actions

**Gang Wars (Multiplayer Lite):**
```javascript
// Export
const code = btoa(JSON.stringify({
  name: rival.name,
  strength: rival.strength,
  hostility: rival.hostility,
  level: state.level
}));

// Import with validation (v1.1.1)
try {
  const data = JSON.parse(atob(code));
  // Sanity checks
  if (data.level < 1 || data.level > 100) throw new Error();
  if (data.strength < 0 || data.strength > 200) throw new Error();
  // ... more validation
} catch (e) {
  // Error handling
}
```

### 3.6 Laundering System

**Methods:**

**1. Vaskeriet (Manual):**
```javascript
rate = 0.1 per second (10%/s)
loss = 30% (realistic professional fees)
```

**2. Accountant (Passive):**
```javascript
rate = +5% per accountant
automatic = true
```

**3. Crypto Trading:**
```javascript
// Buy
wallet[currency] += amount / prices[currency]

// Sell
cleanCash += wallet[currency] × prices[currency]
```

**4. Bank System:**
```javascript
interest = savings × 0.005 per 5min
// 0.5% per 5min = 6% per hour = 144% per day
```

### 3.7 Crypto Market

**Simulation Model:** Geometric Brownian Motion

```javascript
// Price update
const drift = (Math.random() - 0.5) × 0.02; // ±2% random walk
const volatility = 0.05; // 5% volatility
const shock = (Math.random() - 0.5) × volatility;
newPrice = oldPrice × (1 + drift + shock);
```

**Market Trends:**
- Bull Market: +30% multiplier
- Bear Market: -30% multiplier
- Duration: Random (5-15 minutes)

**News Events:**
- "BLOCKCHAIN CRASH": Prices drop, laundering cheaper
- "ETHEREUM SURGE": Prices spike, laundering expensive
- "DARK WEB PANIC": Monero surges

### 3.8 Missions & Dailies

**Mission Types:**

**Story Missions:**
```javascript
missions: [
  {
    id: 'first_sale',
    title: 'Første Salg',
    req: { type: 'sell', amount: 1 },
    reward: { money: 500, xp: 100 }
  },
  // ... 20+ missions
]
```

**Daily Contracts:**
```javascript
generateContract(state) {
  const types = ['produce', 'sell', 'launder'];
  const type = random(types);
  
  // Generate based on level
  if (type === 'produce') {
    return {
      title: `Levering: ${product}`,
      req: { type: 'produce', item, amount },
      reward: { money: level × 1000, xp: amount × 50 }
    };
  }
  // ... other types
}
```

**Contract Refresh:** 24 hours or on completion

### 3.9 End-Game Content

**Luxury Items:**
```javascript
luxuryItems: [
  { id: 'penthouse', cost: 5M, effect: '+50% XP' },
  { id: 'yacht', cost: 25M, effect: '+5% laundering' },
  { id: 'jet', cost: 100M, effect: '-50% heat from sales' },
  { id: 'ghostmode', cost: 250M, effect: '10min heat immunity, 1h cooldown' },
  { id: 'island', cost: 500M, effect: 'Heat capped at 20%' }
]
```

**Mastery System:**
```javascript
masteryPerks: {
  titan_prod: { cost: 10, effect: '+15% production' },
  market_monopol: { cost: 15, effect: '+10% revenue' },
  ghost_ops: { cost: 20, effect: '+25% heat decay' },
  diamond_network: { cost: 25, effect: '2x boss XP' }
}
```

**Prestige:**
```javascript
prestige: {
  level: 0,
  multiplier: 1 + (level × 0.1),
  currency: 0, // Perk points
  perks: {} // Permanent bonuses
}
```

---

## 4. FORMULAS & BALANCE

### 4.1 Progression

**XP to Next Level:**
```javascript
nextLevelXP = 1000 × (1.8 ^ level)
```

**Level Titles:**
```javascript
levelTitles = [
  "Løber",           // 1
  "Hustler",         // 2
  "Soldat",          // 3
  "Område-Chef",     // 4
  "Vesterbro-Boss",  // 5
  "Nørrebro-Konge",  // 6
  "Gudfader"         // 7+
]
```

### 4.2 Economy

**Staff Cost (Bulk):**
```javascript
getBulkCost(baseCost, costFactor, currentCount, amount) {
  const firstTerm = baseCost × (costFactor ^ currentCount);
  const total = firstTerm × ((costFactor ^ amount) - 1) / (costFactor - 1);
  return Math.floor(total);
}
```

**Max Affordable:**
```javascript
getMaxAffordable(baseCost, costFactor, currentCount, budget) {
  const firstTerm = baseCost × (costFactor ^ currentCount);
  const n = Math.log(budget × (costFactor - 1) / firstTerm + 1) / Math.log(costFactor);
  return Math.max(0, Math.floor(n));
}
```

### 4.3 Heat Dynamics

**Heat Generation:**
```javascript
heatGain = (amountSold × heatPerUnit × heatMult × perkReduc × shadowReduc × jetReduc) × 0.4
```

**Heat Decay:**
```javascript
decay = (0.1 + lawyers × 0.15 + ghostOpsMastery) × dt
```

**Raid Probability:**
```javascript
raidChance = (heat / 1000) × dt per second
```

**At 100% heat:**
- 0.1% per second
- ~1000 seconds = ~17 minutes average

### 4.4 Production & Sales

**Production Rate:**
```javascript
rate = baseRate × (1 + perkBonus) × (1 + masteryBonus) × (1 + loyaltyBonus)
```

**Sales Revenue:**
```javascript
revenue = basePrice × marketMult × prestigeMult × salesPerk × globalMult
```

**Net Income:**
```javascript
IPS = territoryIncome + productionRevenue - salaries
```

### 4.5 Laundering

**Laundering Efficiency:**
```javascript
rate = baseRate × studioBonus × (1 + perkBonus) + yachtBonus
maxRate = Math.min(1.0, rate) // Capped at 100%
```

**Bank Interest:**
```javascript
interest = savings × 0.005 per 5min
// Compounds automatically
```

### 4.6 Loyalty Bonus

**Calculation:**
```javascript
daysEmployed = (Date.now() - hiredDate) / (1000 × 60 × 60 × 24)
loyaltyBonus = Math.min(20, Math.floor(daysEmployed))
```

**Impact:**
```javascript
// Example: 5 Growers, Day 20
baseRate = 0.5/s × 5 = 2.5/s
withLoyalty = 0.5/s × 1.2 × 5 = 3.0/s
increase = +20%
```

---

## 5. TECHNICAL ARCHITECTURE

### 5.1 State Management

**State Structure:**
```javascript
state = {
  // Currency
  cleanCash: number,
  dirtyCash: number,
  diamonds: number,
  
  // Progression
  xp: number,
  level: number,
  
  // Heat
  heat: number,
  heatWarning70: boolean,
  heatWarning90: boolean,
  
  // Inventory
  inv: { [productId]: count },
  prices: { [productId]: price },
  
  // Staff
  staff: { [role]: count },
  staffHiredDates: { [role]: timestamp },
  
  // Upgrades
  upgrades: { [id]: level },
  defense: { [id]: count },
  
  // Territories
  territories: string[],
  territoryLevels: { [id]: level },
  territoryAttacks: { [id]: { startTime, strength } },
  
  // Luxury & Mastery
  luxuryItems: string[],
  masteryPerks: { [id]: boolean },
  
  // Systems
  payroll: { lastPaid, isStriking },
  crypto: { wallet, prices, history },
  bank: { savings, lastInterest },
  boss: { active, hp, ... },
  rival: { name, hostility, strength, ... },
  
  // Automation
  autoSell: { [productId]: boolean },
  isSalesPaused: boolean,
  
  // Tracking
  stats: { produced, sold, laundered },
  lifetime: { earnings, laundered, ... },
  productionRates: { [id]: { produced, sold } },
  
  // Progression
  prestige: { level, multiplier, currency, perks },
  contracts: { active, lastCompleted },
  completedMissions: string[],
  
  // UI State
  logs: array,
  activeBuffs: { hype, intel },
  market: { trend, duration, multiplier },
  
  // Meta
  lastSaveTime: number,
  bootShown: boolean,
  tutorialActive: boolean
}
```

### 5.2 Component Structure

```
src/
├── components/
│   ├── Header.jsx (stats, heat, notifications)
│   ├── ProductionTab.jsx (product cards, manual production)
│   ├── ManagementTab.jsx (staff, upgrades, loyalty UI)
│   ├── NetworkTab.jsx (territories, income)
│   ├── RivalsTab.jsx (rival actions, gang wars)
│   ├── FinanceTab.jsx (laundering, bank, crypto, luxury)
│   ├── EmpireTab.jsx (masteries, prestige, achievements)
│   └── SultanenTab.jsx (missions, dailies)
├── features/
│   └── engine/
│       ├── gameTick.js (main loop, 60 FPS)
│       ├── production.js (production & sales logic)
│       ├── economy.js (payroll, bank, crypto)
│       ├── events.js (raids, heat, warnings)
│       └── missions.js (mission & contract logic)
├── hooks/
│   ├── useGameActions.js (player actions)
│   ├── useManagement.js (staff, upgrades)
│   ├── useProduction.js (manual production)
│   └── useRivals.js (rival actions)
├── utils/
│   ├── gameMath.js (formulas, calculations)
│   ├── initialState.js (default state)
│   └── audio.js (sound effects)
└── config/
    └── gameConfig.js (all constants)
```

### 5.3 Data Flow

```
User Action → Hook → State Update → Game Tick → UI Render
     ↓                                   ↓
  Validation                        Auto-save
     ↓                                   ↓
  Sound FX                         localStorage
```

### 5.4 Game Loop

```javascript
// 60 FPS update loop
useEffect(() => {
  const interval = setInterval(() => {
    const now = Date.now();
    const dt = (now - lastUpdate) / 1000; // Delta time
    
    setState(prev => {
      let newState = { ...prev };
      
      // Process systems
      newState = processProduction(newState, dt);
      newState = processEconomy(newState, dt);
      newState = processEvents(newState, dt);
      newState = processMissions(newState, dt);
      
      // Level up check
      if (newState.xp >= getNextLevelXP(newState.level)) {
        newState.level++;
        newState.xp = 0;
      }
      
      return newState;
    });
  }, 1000 / 60); // 60 FPS
  
  return () => clearInterval(interval);
}, []);
```

### 5.5 Save System

```javascript
// Auto-save every 30 seconds
useEffect(() => {
  const interval = setInterval(() => {
    const encoded = btoa(JSON.stringify(state));
    localStorage.setItem(STORAGE_KEY, encoded);
  }, 30000);
  
  return () => clearInterval(interval);
}, [state]);

// Load on mount
useEffect(() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const decoded = JSON.parse(atob(saved));
    setState(decoded);
  }
}, []);
```

---

## 6. AI RULES & GUIDELINES

### 6.1 Project Context

- **Title:** Syndicate OS
- **Theme:** Danish Underworld / Cyberpunk Idle Tycoon
- **Core Loop:** Produce → Sell → Launder → Invest → Expand
- **Tech Stack:** React 19, Vite 7, TailwindCSS
- **Stage:** Production (v1.1.2 [PLATINUM])

### 6.2 Critical Coding Rules

**NON-NEGOTIABLE:**

1. **NO FULL REWRITES** - Only specific code blocks (diffs)
2. **CSS IS FROZEN** - Terminal/hacker UI style preserved
3. **VARIABLE CONTINUITY** - Strict adherence to existing names
4. **HTML INTEGRITY** - Verify IDs exist before targeting
5. **PERMISSION REQUIRED** - Always ask before changes
6. **MANDATORY PLANNING** - Detailed implementation plans (5+ phases)

### 6.3 Gameplay Logic & Integrity

**Economy:**
- Always verify dirty vs clean money requirements
- Maintain balance between income and expenses
- Preserve dual currency bottleneck

**Risk System:**
- Heat mechanics must be consistent
- Higher output = higher risk
- Logarithmic scaling preserved

**Save/Load:**
- All crucial stats in save schema
- Backward compatibility required
- Migration logic for new fields

### 6.4 Balance Principles

**Production:**
- Tier 1: Safe, low profit (beginner)
- Tier 2: Medium risk/reward (mid-game)
- Tier 3: High risk/reward (late-game)
- Tier 4: Extreme risk/reward (end-game)

**Staff:**
- Cost scaling: Exponential (1.15-1.6x)
- Salary: Proportional to power
- Loyalty: Max 20% (meaningful but not OP)

**Heat:**
- Decay: Base 0.1/s, scales with lawyers
- Raids: ~17 min at 100% heat
- Warnings: 70% and 90% thresholds

**Laundering:**
- Loss: 30% (realistic)
- Rate: 10%/s base
- Crypto: Volatile but fast

### 6.5 Response Format

**Analysis → Patch → Verify**

```markdown
[ANALYSIS]
Identify the logic flaw or requirement.

[PATCH]
Provide the code diff with exact line numbers.

[VERIFY]
How to reproduce the fix in the game.
```

### 6.6 Forbidden Actions

- ❌ Placeholder code (`// ... rest of code`)
- ❌ Removing existing features during optimization
- ❌ Inventing data/lore not in files
- ❌ Breaking backward compatibility
- ❌ Unbalanced changes without justification

---

## 7. PATCH HISTORY

### v1.1.2 [PLATINUM] - 2026-01-07

**Staff Loyalty System:**
- Added `staffHiredDates` state tracking
- Implemented `getLoyaltyBonus()` function
- Applied bonuses to production and sales
- UI badges and expanded details
- Max 20% bonus after 20 days

**Police System Fixes:**
- Raid frequency 10x increase (heat/1000 vs heat/10000)
- Heat warnings at 70% and 90%
- Lawyer UI fix (9/min display)
- Ghost Protocol luxury item (250M, 10min immunity)

**Rival System Improvements:**
- Raid cooldown (30 seconds)
- Rival strength meter (visual amber bar)
- Gang Wars input validation (robust error handling)
- Territory siege notifications (animated banner)

**Compatibility:**
- Added `heatWarning70` and `heatWarning90` to initialState
- Backward compatible with old saves
- No breaking changes

**Documentation:**
- Complete rewrite of HANDBOOK.md (600+ lines)
- Complete rewrite of README.md (400+ lines)
- Created SALES_PITCH.md (500+ lines)
- Created GAME_DESIGN_DOCUMENT.md (this file)

### v1.1.1 - 2026-01-06

**Rival QoL:**
- Raid cooldown implementation
- Strength meter display
- Input validation for Gang Wars
- Territory siege UI

**Police Balance:**
- Raid frequency adjustment
- Heat warning system
- Lawyer decay fix

**Operations Audit:**
- Complete system verification
- No bugs found
- Balance confirmed

### v1.1.0 - 2026-01-05

**PWA Support:**
- Service worker
- Installable on mobile/desktop
- Offline capability (partial)

**Multiplayer Lite:**
- Gang Wars (rival code sharing)
- Base64 encoding/decoding
- Validation and error handling

### v1.0.4 - 2026-01-01

**Bug Fixes:**
- Level title bug fixed
- Junkie exploit patched
- Hard reset functionality verified

### v1.0.0 - 2025-12

**Initial Release:**
- Core gameplay loop
- 12 product tiers
- 10 staff roles
- 12 territories
- Heat & police system
- Laundering mechanics
- Crypto trading
- Missions & dailies
- End-game content

---

## 8. FUTURE ROADMAP

### Short-Term (v1.2.0)

**Planned Features:**
- Offline progress calculation
- More luxury items
- Additional masteries
- Boss encounter improvements

**Balance Tweaks:**
- Monitor staff loyalty impact
- Adjust raid frequency if needed
- Fine-tune crypto volatility

### Mid-Term (v1.3.0)

**New Systems:**
- Rival AI improvements
- More territory mechanics
- Expanded prestige tree
- Achievement system expansion

**QoL:**
- Bulk actions for territories
- Preset staff configurations
- Advanced statistics

### Long-Term (v2.0.0)

**Major Features:**
- Full multiplayer (real-time)
- Clan/gang system
- PvP territory wars
- Seasonal events

**Technical:**
- Backend server
- Cloud saves
- Leaderboards
- Analytics

---

## 📊 QUICK REFERENCE

### Key Constants

```javascript
GAME_VERSION = '1.1.2 [PLATINUM]'
FPS = 60
AUTO_SAVE_INTERVAL = 30000 // 30 seconds
PAYROLL_INTERVAL = 300000 // 5 minutes
LAUNDERING_LOSS = 0.30 // 30%
BANK_INTEREST_RATE = 0.005 // 0.5% per 5min
MAX_LOYALTY_BONUS = 20 // 20%
RAID_COOLDOWN = 30000 // 30 seconds
HEAT_WARNING_70 = 70
HEAT_WARNING_90 = 90
```

### File Locations

- **Config:** `src/config/gameConfig.js`
- **State:** `src/utils/initialState.js`
- **Formulas:** `src/utils/gameMath.js`
- **Game Loop:** `src/features/engine/gameTick.js`
- **Production:** `src/features/engine/production.js`
- **Economy:** `src/features/engine/economy.js`
- **Events:** `src/features/engine/events.js`

---

```
> GAME DESIGN DOCUMENT: COMPLETE
> VERSION: 1.1.2 [PLATINUM]
> LAST UPDATED: 2026-01-07
> STATUS: Production Ready
> 
> "All systems documented. Ready for patches, balance changes, and future development."
> 
> END OF DOCUMENT
```
