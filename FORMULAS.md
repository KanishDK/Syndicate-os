# 🔢 SYNDICATE OS - FORMULAS & MATH
**Complete Mathematical Reference | Platinum Edition v1.1.2**

```
> LOADING: Platinum Mathematical Models
> Target: Syndicate Optimization Experts
> Version: 1.1.2 [PLATINUM]
```

---

## 📈 Progression & Multipliers

### 1. Prestige Multiplier
`TotalMultiplier = (1 + PrestigeLevel * 0.1) * (1 + MasteryBonuses)`

### 2. Experience Points (XP)
`NextLevelXP = 1000 * (1.8 ^ Level)`
- **XP Bonus (Penthouse)**: `XP = Revenue * 0.1 * (1 + PerkBonus) * 1.5`
- **Boss XP (Diamant Netværk)**: `XP = BaseBossXP * (1 + LevelBonus) * 2.0`

---

## 🧪 Production & Sales

### 1. Global Production Speed
`Rate = BaseRate * (1 + PerkBonus) * (1 + TitanProduktionMastery)`
- **Titan Produktion**: +15% Flat Bonus.

### 2. Sales Margin (Revenue)
`Revenue = BaseRevenue * MarketMult * PrestigeMult * (1 + MarkedMonopolMastery)`
- **Marked Monopol**: +10% Flat Revenue Bonus.

---

## 🚨 Heat Dynamics

### 1. Heat Generation (Sales)
`HeatGain = (UnitHeat * heatMult * perkReduc * jetReduc)`
- **Gulfstream G650 (Jet)**: `jetReduc = 0.5` (50% reduction).

### 2. Heat Decay
`Decay = (Base 0.1) + (Lawyers * 0.15) + (GhostOpsMastery) * DT`
- **Lawyer Rate**: 0.15 per second = 9 per minute
- **Ghost Operations**: +25% Flat Decay Bonus.

### 3. Raid Probability (Balanced)
`RaidChance = (Heat / 1000) * DT` per second
- **At 100% Heat**: 0.1% per second = ~17 minutes average
- **At 80% Heat**: 0.08% per second = ~21 minutes average
- **Previous**: Heat / 10000 (10x less frequent, rebalanced)

### 4. Heat Warnings
- **70% Heat**: ⚠️ Warning message (resets at <65%)
- **90% Heat**: 🚨 Critical alert + alarm sound (resets at <85%)

### 5. Untouchable Floor
- **Privat Ø (Island)**: `State.Heat = Math.min(20, State.Heat)`
- **Ghost Protocol**: `State.Heat = 0` (10 min duration, 1h cooldown)
- Policy: Hard cap at 20% internal heat.

---

## 🧼 Laundering Efficiency

### 1. Laundering Rate
`Rate = BaseRate * StudioBonus * (1 + PerkBonus) + YachtBonus`
- **Super Yacht**: +5% Flat Rate Bonus.
- **Max Rate**: Capped at 1.0 (100% efficiency).

### 2. Bank Interest (Balanced)
`Interest = Savings * 0.005` per 5 minutes
- **Rate**: 0.5% per 5min = 6% per hour = 144% per day
- **Previous**: 2% per 5min = 576% per day (nerfed for balance)

---

## 🌆 Territory Control

### 1. Global Dominance
`Dominance % = (OwnedTerritories / TotalTerritories) * 100`

---

```
> FORMULAS: Recalibrated for Platinum Economy
> All end-game constants verified
> Mathematical superiority established.
```
