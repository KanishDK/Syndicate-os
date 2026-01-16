# 🔢 Game Mechanics & Formulas

**Technical Reference for Syndicate OS v1.1.3**

---

## Economy Formulas

### Production Rate
How fast your empire produces drugs.
```javascript
Rate = BaseRate × (1 + PerkBonus) × (1 + MasteryBonus) × (1 + LoyaltyBonus)
```

### Sales Revenue
How much you make per gram.
```javascript
Revenue = BasePrice × MarketMult × PrestigeMult × (1 + Perks)
```
- **MarketMult**: Changes with random events (e.g., Roskilde Festival = high demand).
- **PrestigeMult**: Earned by resetting the game.

### Staff Costs (Bulk Hiring)
Cost increases exponentially as you hire more of the same role.
```javascript
Cost = BaseCost × (Factor ^ CurrentCount)
```
This prevents infinite scaling and forces you to use higher-tier staff.

### Loyalty Bonus
Staff gain efficiency over time.
```javascript
Bonus = min(20%, floor(DaysEmployed))
```
- Max bonus: +20% after 20 days.
- Resets if you fire *all* staff of a specific role.

---

## Heat & Police

### Heat Decay
How fast your heat drops naturally.
```javascript
Decay = (BaseDecay + (Lawyers × 0.15) + GhostMastery) × DT
```
- **Base Decay**: 0.1 per second (6/min).
- **Lawyer**: +0.15 per second (9/min).

### Raid Probability
The chance of a raid happening every second.
```javascript
Chance = (Heat / 1000) × DT
```
- At **100% Heat**, a raid happens roughly every **17 minutes** on average.
- This creates a risk/reward curve where high heat is exponentially more dangerous.

---

## Exp & Progression

### Level Up Requirements
```javascript
XP_Needed = 1000 × (1.8 ^ Level)
```
- Level 1: 1,000 XP
- Level 5: ~18,000 XP
- Level 10: ~350,000 XP

### Level Titles (Ranks)
1. **Street Pusher**
2. **Local Boss**
3. **District King**
4. **Wholesaler**
5. **Cartel Member**
6. **Baron**
7. **Kingpin** (and beyond)

---

## Technical Systems

### The Game Loop
The game runs on a custom 60 FPS loop that uses `requestAnimationFrame` and delta-time (`dt`) correction. This ensures the game runs at the same speed on high-refresh monitors and slow laptops.

### Save System
- **Auto-Save**: Every 30 seconds.
- **Locally Stored**: Saves are kept in your browser's `localStorage`.
- **Base64 Encoded**: Save strings can be exported/imported but are encoded to prevent casual editing.

### Randomness (Stochastic)
Market prices (Bitcoin, Ethereum) use a **Geometric Brownian Motion** model, meaning they follow a random walk with drift and volatility, similar to real-world stock simulation.
