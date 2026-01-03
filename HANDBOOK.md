# 📚 SYNDICATE OS HANDBOOK
**Complete Mechanics Guide | Terminal Edition v1.1.0**

```
> SULTANEN@TERMINAL: Accessing knowledge base...
> Loading: All systems, formulas, and strategies
> Status: COMPREHENSIVE
```

---

## Table of Contents

1. [Core Systems](#1-core-systems)
2. [Progression](#2-progression)
3. [Advanced Systems](#3-advanced-systems)
4. [Premium Features](#4-premium-features)
5. [Formulas & Math](#5-formulas--math)
6. [Achievements Guide](#6-achievements-guide)

---

## 1. Core Systems

### 1.1 Economy (Clean vs Dirty Money)

**The Dual Currency System**:
- **Dirty Money** (Sorte Penge): Earned from illegal sales
  - Cannot buy upgrades or staff
  - Must be laundered to use
  - Generates heat when accumulated
  
- **Clean Money** (Rene Penge): Laundered or from territories
  - Safe to use for purchases
  - No heat generation
  - Required for all upgrades

**Laundering Process**:
```
Input: 1,000 kr (dirty)
Loss Rate: 30% (CONFIG.launderingRate = 0.70)
Output: 700 kr (clean)
```

**Efficiency Upgrades**:
- **Studio** (Front-Butik): +20% efficiency → 840 kr output
- **Perk** (Laundering Mastery): +5% per level → up to 945 kr

---

### 1.2 Production System

**12 Product Tiers**:

| Product | Tier | Cost | Revenue | Time | Heat | Unlock |
|---------|------|------|---------|------|------|--------|
| Hash (1g) | 1 | 15 kr | 35 kr | 1.0s | 0.02 | Rank 1 |
| Skunk (1g) | 1 | 25 kr | 50 kr | 2.5s | 0.1 | Rank 2 |
| Speed (10g) | 2 | 750 kr | 1,500 kr | 4.0s | 0.12 | Rank 4 |
| MDMA (10g) | 2 | 1,500 kr | 3,000 kr | 6.0s | 0.15 | Rank 5 |
| Cocaine (50g) | 3 | 15,000 kr | 32,500 kr | 10.0s | 0.5 | Rank 7 |
| Fentanyl (500g) | 4 | 180,000 kr | 375,000 kr | 45.0s | 1.5 | Rank 12 |

**Cost Scaling Formula**:
```javascript
cost(n) = baseCost * (costFactor ^ n)

Example: Hash (costFactor = 1.1)
Unit 1: 15 kr
Unit 10: 15 * (1.1 ^ 10) = 38.9 kr
Unit 100: 15 * (1.1 ^ 100) = 2,067 kr
```

**Production Time**:
- Base duration (e.g., Hash = 1000ms)
- Not affected by upgrades (staff handle automation instead)

---

### 1.3 Laundering Mechanics

**Manual Laundering**:
- Click "Vask Penge" in Finans tab
- Instant conversion at 70% rate
- No cooldown

**Automatic Laundering** (Revisor/Accountant):
- Unlocks at Rank 8
- Cost: 250,000 kr
- Salary: 2,000 kr/5min
- Rate: 5% of dirty money per second
- Formula: `cleanPerSec = dirtyCash * 0.05 * accountantCount`

**Optimization**:
1. Early game: Manual laundering (save money)
2. Mid game: 1 Accountant (passive income)
3. Late game: Multiple Accountants (max throughput)

---

### 1.4 Heat System

**Heat Generation**:
- **Sales**: +0.02 to +1.5 per unit (depends on product tier)
- **Territories**: +0.05 per second (dirty income territories)
- **Production**: No heat (only sales generate heat)

**Heat Decay**:
- **Passive**: -0.1 per second
- **With Lawyer**: -0.15 per second (50% faster)
- **Perk Bonus**: Up to -25% generation (heat_reduce perk)

**Heat Consequences**:
- **0-50%**: Safe (green)
- **50-80%**: Warm (amber) - increased raid chance
- **80-100%**: HOT (red) - raids imminent

**Heat Management**:
1. **Lawyer** (Advokat): Passive -0.15/s, costs 200k + 10k salary
2. **Bribe** (Bestikkelse): Instant -50% heat, costs diamonds
3. **Silence**: Stop selling, let it decay naturally

---

## 2. Progression

### 2.1 XP & Leveling Formula

**The Core Formula**:
```javascript
nextLevelXp = 1000 * Math.pow(1.6, level)
```

**XP Requirements Table**:

| Rank | Name | XP Required | Cumulative XP | Time Estimate |
|------|------|-------------|---------------|---------------|
| 1 | Gade Soldat | 0 | 0 | 0 min |
| 2 | Hustler | 1,000 | 1,000 | 10 min |
| 3 | Løjtnant | 1,600 | 2,600 | 20 min |
| 4 | Boss | 2,560 | 5,160 | 40 min |
| 5 | Kingpin | 4,096 | 9,256 | 90 min |
| 6 | Don | 6,554 | 15,810 | 120 min |
| 7 | Gudfader | 10,486 | 26,296 | **2-3 hours** |
| 10 | (Max) | 26,844 | 109,951 | 6-8 hours |

**XP Sources**:
- **Missions**: 100-2,000,000 XP (main source)
- **Sales**: Minimal (not worth grinding)
- **Territories**: 250 XP per conquest

---

### 2.2 Mission System

**20 Story Missions** across 6 phases:

**Phase 1: Tutorial** (M1-M4)
- No rank gates
- Total XP: 750
- Teaches core loop

**Phase 2: Scaling Up** (M5-M6)
- **M5 requires Rank 2** ← First gate
- XP: 500-1,200
- Unlocks Skunk, Warehouse

**Phase 3: Hard Drugs** (M7-M9)
- **M7 requires Rank 4** ← Second gate
- XP: 2,000-4,500
- Unlocks Speed, MDMA, Territories

**Phase 4: Syndicate** (M10-M14)
- **M10 requires Rank 6** ← Third gate
- XP: 6,000-35,000
- Unlocks Defense, Lawyer, Cocaine

**Phase 5: Kingpin** (M15-M17)
- **M15 requires Rank 10** ← Fourth gate
- XP: 60,000-120,000
- Endgame content

**Phase 6: Endgame** (M18-M20)
- XP: 250,000-2,000,000
- Victory condition

---

### 2.3 Rank Gates

**Purpose**: Force idle grinding between mission phases

**Gates**:
- M5 → Rank 2 (1,000 XP)
- M7 → Rank 4 (5,160 XP)
- M10 → Rank 6 (15,810 XP)
- M15 → Rank 10 (109,951 XP)

**Locked Mission UI**:
```
🔒 KVALITETSKONTROL
⚠️ Kræver Rank 2
📊 Du er Rank 1: Gade Soldat
💡 Tjen mere XP for at låse op
```

---

## 3. Advanced Systems

### 3.1 Staff & Automation

**10 Staff Types**:

**Producers**:
- **Gartner** (Grower): Hash, Skunk | 800 kr/5min
- **Kemiker** (Chemist): Speed, MDMA, Keta | 2,500 kr/5min
- **Smugler** (Importer): Cocaine, Benzos | 8,000 kr/5min
- **Laborant** (Lab Tech): Fentanyl, Oxy, Heroin | 12,000 kr/5min
- **Zombie** (Junkie): Hash, Pills | 150 kr/5min (cheap labor)

**Sellers**:
- **Pusher**: Hash, Pills | 300 kr/5min
- **Distributør**: Skunk, Speed, MDMA | 1,200 kr/5min
- **Bagmand** (Trafficker): Cocaine, Heroin | 6,000 kr/5min

**Support**:
- **Revisor** (Accountant): Auto-launders 5%/s | 2,000 kr/5min
- **Advokat** (Lawyer): -0.15 heat/s | 10,000 kr/5min

**Production Rates**:
```javascript
rate = baseRate * (1 + perkBonus) * prestigeMultiplier

Example: Gartner producing Hash
baseRate = 0.5 units/s
With 10% perk: 0.5 * 1.1 = 0.55 units/s
With 2x prestige: 0.55 * 2 = 1.1 units/s
```

---

### 3.2 Territories & Passive Income

**5 Copenhagen Districts**:

| Territory | Cost | Income/s | Type | Unlock |
|-----------|------|----------|------|--------|
| Staden | 50k | 5,000 | Dirty | Rank 2 |
| Halmtorvet | 100k | 10,000 | Dirty | Rank 4 |
| Blågårds Plads | 150k | 15,000 | Dirty | Rank 6 |
| Slotsholmen | 300k | 30,000 | Clean | Rank 8 |
| Strandvejen | 500k | 50,000 | Clean | Rank 10 |

**Upgrade System**:
```javascript
income(level) = baseIncome * Math.pow(1.5, level - 1)
upgradeCost(level) = baseCost * Math.pow(1.8, level)

Example: Staden Level 5
Income: 5,000 * (1.5 ^ 4) = 25,312 kr/s
Cost: 50,000 * (1.8 ^ 5) = 946,650 kr
```

**Strategy**:
- Early: Buy Staden (best ROI)
- Mid: Upgrade Staden to Level 3-5
- Late: Buy all territories, upgrade evenly

---

### 3.3 Defense & Raids

**Defense Types**:
- **Vagtværn** (Guards): 20 defense | 10k base
- **Skygge-Øjne** (Cameras): 30 defense | 15k base
- **Safehouse** (Bunker): 120 defense | 500k base

**Raid Mechanics**:
- Triggered by rival hostility
- Attack strength: 50-150
- Defense calculation: `totalDefense = Σ(defenseCount * defenseVal)`
- Win: Keep territory, +100 XP
- Lose: Lose territory, -50% cash

**Optimal Defense**:
- Rank 6: 5 Guards (100 defense)
- Rank 10: 1 Bunker (120 defense)
- Endgame: Multiple bunkers

---

### 3.4 Prestige System

**Exit Scam (Prestige Reset)**:
- Unlocks at Rank 7
- Resets: Level, money, inventory, staff, territories
- Keeps: Achievements, prestige perks, prestige currency

**Multiplier**:
```javascript
multiplier = 1 + (prestigeLevel * 0.1)

Prestige 1: 1.1x (10% bonus)
Prestige 5: 1.5x (50% bonus)
Prestige 10: 2.0x (100% bonus)
```

**Token Gain**:
```javascript
tokens = Math.floor(totalXP / 10000)

Example: 109,951 XP → 10 tokens
```

**Perk Trees**:
- **Aggressive**: Heat reduction, boss damage, raid defense
- **Greedy**: Sales boost, XP bonus, production speed
- **Forbidden**: Offshore accounts, shadow network, retention

---

## 4. Premium Features

### 4.1 Diamonds (Premium Currency)

**Sources**:
- **Golden Drone**: Random event (5-20 diamonds)
- **Achievements**: One-time rewards
- **NOT purchasable**: No pay-to-win

**Rarity**: ~1 drone per 30-60 minutes of active play

---

### 4.2 Black Market Items

| Item | Type | Effect | Cost |
|------|------|--------|------|
| Tidsmaskine (4t) | Time Skip | +4 hours income | 5 💎 |
| Influencer Pack | Buff | +100% sales (5 min) | 10 💎 |
| Bestikkelse | Instant | Clear all heat | 15 💎 |
| Starter Pack | Currency | +50,000 kr clean | 20 💎 |

**Strategy**:
- Save diamonds for heat clearing (most valuable)
- Time skips useful for offline players
- Buffs are luxury items

---

### 4.3 Golden Drone Event

**Trigger**: Random (1-2% chance per minute)

**Reward**: 5-20 diamonds

**Visual**: Gold particle explosion + sound effect

**Strategy**: Play actively to maximize drone encounters

---

## 5. Formulas & Math

### Production Cost Scaling
```javascript
cost(n) = baseCost * Math.pow(costFactor, n)
```

### Staff Salary
```javascript
totalSalary = Σ(staffCount[role] * CONFIG.staff[role].salary)
// Paid every 5 minutes (300,000ms)
```

### Territory Income
```javascript
income(level) = baseIncome * Math.pow(1.5, level - 1) * prestigeMultiplier
```

### Heat Decay
```javascript
heatDecay = -0.1 - (lawyerCount * 0.05)
// Base: -0.1/s
// With 1 Lawyer: -0.15/s
```

### Prestige Multiplier
```javascript
multiplier = 1 + (prestigeLevel * 0.1)
```

### XP to Next Level
```javascript
nextLevelXp = 1000 * Math.pow(1.6, currentLevel)
```

---

## 6. Achievements Guide

### Easy Tier
**First Blood**: Earn 1,000,000 kr dirty money
- Strategy: Sell 100+ units of any product
- Time: 30-60 minutes

**Clean House**: Launder 10,000,000 kr total
- Strategy: Hire Accountant, let it run overnight
- Time: 2-4 hours

### Medium Tier
**King of Streets**: Own all 5 territories simultaneously
- Strategy: Reach Rank 10, save 1,100,000 kr
- Time: 6-8 hours

**Escobar**: Produce 1,000 units of Cocaine
- Strategy: Unlock Rank 7, hire Smugler, automate
- Time: 8-12 hours

### Hard Tier
**Untouchable**: Have 0% heat with 1,000,000 kr dirty money
- Strategy: Hire Lawyer, stop selling, accumulate from territories
- Time: Requires patience + skill

**Diamond Hands**: Own 10 Bitcoin
- Strategy: Buy during market crashes, hold
- Time: Depends on market RNG

### Endgame Tier
**Prestige One**: Complete first prestige reset
- Strategy: Reach Rank 7+, click "Exit Scam"
- Time: 2-3 hours minimum

---

```
> HANDBOOK: Complete
> All systems documented
> Ready for mastery
```
