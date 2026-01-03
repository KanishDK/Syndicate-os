# 🔢 SYNDICATE OS - FORMULAS & MATH
**Complete Mathematical Reference | Terminal Edition v1.1.0**

```
> LOADING: Mathematical models
> Target: Min-maxers & Theorycrafters
> Precision: Maximum
```

---

## Table of Contents

1. [Progression Formulas](#progression-formulas)
2. [Production Economics](#production-economics)
3. [Staff & Automation](#staff--automation)
4. [Territory Scaling](#territory-scaling)
5. [Prestige Mathematics](#prestige-mathematics)
6. [Heat Dynamics](#heat-dynamics)
7. [Optimization Calculations](#optimization-calculations)

---

## Progression Formulas

### XP Required per Level
```javascript
nextLevelXp = 1000 * Math.pow(1.6, level)
```

**Table** (Levels 1-20):
```
Level  | XP Required | Cumulative XP | Growth Rate
-------|-------------|---------------|-------------
1      | 1,000       | 1,000         | -
2      | 1,600       | 2,600         | 1.6x
3      | 2,560       | 5,160         | 1.6x
4      | 4,096       | 9,256         | 1.6x
5      | 6,554       | 15,810        | 1.6x
6      | 10,486      | 26,296        | 1.6x
7      | 16,777      | 43,073        | 1.6x
8      | 26,844      | 69,917        | 1.6x
9      | 42,950      | 112,867       | 1.6x
10     | 68,719      | 181,586       | 1.6x
15     | 1,099,512   | 2,748,779     | 1.6x
20     | 17,592,186  | 43,980,465    | 1.6x
```

**Growth Analysis**:
- Exponential base: **1.6** (balanced for 2-3 hour Rank 7)
- Each level requires 60% more XP than previous
- Cumulative XP grows exponentially

---

## Production Economics

### Item Cost Scaling
```javascript
cost(n) = baseCost * Math.pow(costFactor, n)
```

**Example: Hash (Light)**
- baseCost = 15 kr
- costFactor = 1.1

```
Unit   | Cost (kr) | Total Spent
-------|-----------|-------------
1      | 15.00     | 15
10     | 38.91     | 236
50     | 1,763.96  | 58,364
100    | 2,067.19  | 1,556,313
```

**All Products Cost Factors**:
```
Hash (Light):    1.1  (slow growth)
Skunk:           1.2  (moderate)
Speed:           1.25 (moderate-high)
MDMA:            1.3  (high)
Cocaine:         1.4  (very high)
Fentanyl:        2.0  (extreme)
```

### Revenue Calculation
```javascript
revenue = baseRevenue * marketMultiplier * prestigeMultiplier * buffMultiplier
```

**Example: Hash at Prestige 5 with Hype Buff**
```
baseRevenue = 35 kr
marketMultiplier = 1.0 (neutral market)
prestigeMultiplier = 1.5 (prestige level 5)
buffMultiplier = 2.0 (Hype buff active)

revenue = 35 * 1.0 * 1.5 * 2.0 = 105 kr
```

### Profit Margin
```javascript
profit = revenue - cost
margin = (profit / cost) * 100
```

**Profit Analysis** (First Unit):
```
Product    | Cost    | Revenue  | Profit  | Margin
-----------|---------|----------|---------|--------
Hash       | 15 kr   | 35 kr    | 20 kr   | 133%
Skunk      | 25 kr   | 50 kr    | 25 kr   | 100%
Speed      | 750 kr  | 1,500 kr | 750 kr  | 100%
Cocaine    | 15k kr  | 32.5k kr | 17.5k kr| 117%
Fentanyl   | 180k kr | 375k kr  | 195k kr | 108%
```

**Observation**: All products have ~100% profit margin (balanced design)

---

## Staff & Automation

### Production Rate
```javascript
unitsPerSecond = baseRate * (1 + perkBonus) * prestigeMultiplier
```

**Example: Gartner producing Hash**
```
baseRate = 0.5 units/s
perkBonus = 0.1 (10% from Optimeret Lab perk)
prestigeMultiplier = 1.5 (prestige level 5)

rate = 0.5 * (1 + 0.1) * 1.5 = 0.825 units/s
```

### Salary Cost
```javascript
totalSalary = Σ(staffCount[role] * CONFIG.staff[role].salary)
```

**Payroll Interval**: 300,000ms (5 minutes)

**Example Payroll**:
```
Staff          | Count | Salary | Total
---------------|-------|--------|-------
Gartner        | 2     | 800    | 1,600
Kemiker        | 1     | 2,500  | 2,500
Pusher         | 3     | 300    | 900
Accountant     | 1     | 2,000  | 2,000
Lawyer         | 1     | 10,000 | 10,000
--------------------------------
TOTAL:                          17,000 kr/5min
```

**Hourly Cost**: 17,000 * 12 = **204,000 kr/hour**

### ROI Calculation
```javascript
ROI = (revenue - cost - salary) / (cost + hirePrice)
```

**Example: Hiring First Gartner**
```
Hire Price: 15,000 kr
Salary: 800 kr/5min = 9,600 kr/hour
Production: 0.5 Hash/s = 1,800 Hash/hour
Revenue: 1,800 * 35 kr = 63,000 kr/hour
Cost: 1,800 * 15 kr = 27,000 kr/hour

Profit/hour = 63,000 - 27,000 - 9,600 = 26,400 kr
ROI = 26,400 / 15,000 = 176% per hour

Payback Time: 15,000 / 26,400 = 0.57 hours (34 minutes)
```

---

## Territory Scaling

### Income Formula
```javascript
income(level) = baseIncome * Math.pow(1.5, level - 1) * prestigeMultiplier
```

**Example: Staden (Base 5,000 kr/s)**
```
Level | Income/s  | Income/hour | Upgrade Cost
------|-----------|-------------|-------------
1     | 5,000     | 18,000,000  | 50,000
2     | 7,500     | 27,000,000  | 90,000
3     | 11,250    | 40,500,000  | 162,000
4     | 16,875    | 60,750,000  | 291,600
5     | 25,313    | 91,125,000  | 524,880
10    | 192,476   | 692,914,000 | 8,957,952
```

### Upgrade Cost Formula
```javascript
upgradeCost(level) = baseCost * Math.pow(1.8, level)
```

### ROI per Level
```javascript
additionalIncome = income(level) - income(level - 1)
ROI_hours = upgradeCost(level) / (additionalIncome * 3600)
```

**Example: Staden Level 2**
```
Additional Income: 7,500 - 5,000 = 2,500 kr/s
Upgrade Cost: 90,000 kr
ROI: 90,000 / (2,500 * 3600) = 0.01 hours (36 seconds!)
```

**Conclusion**: Territory upgrades have INSANE ROI (best investment in game)

---

## Prestige Mathematics

### Multiplier Formula
```javascript
multiplier = 1 + (prestigeLevel * 0.1)
```

**Table**:
```
Prestige | Multiplier | Bonus
---------|------------|-------
0        | 1.0x       | 0%
1        | 1.1x       | 10%
5        | 1.5x       | 50%
10       | 2.0x       | 100%
20       | 3.0x       | 200%
50       | 6.0x       | 500%
```

### Token Gain
```javascript
tokens = Math.floor(totalXP / 10000)
```

**Examples**:
```
XP Earned  | Tokens Gained
-----------|---------------
26,296     | 2
109,951    | 10
1,000,000  | 100
```

### Perk Cost Scaling
```javascript
perkCost(level) = baseCost * Math.pow(costScale, level - 1)
```

**Example: Heat Reduce Perk**
```
baseCost = 10 tokens
costScale = 1.5

Level 1: 10 tokens
Level 2: 15 tokens
Level 3: 23 tokens
Level 5: 51 tokens
Level 10: 384 tokens
```

---

## Heat Dynamics

### Heat Generation
```javascript
heatGain = productHeat * (1 - heatReduction)

heatReduction = perkBonus + networkUpgrade
```

**Example: Selling Cocaine**
```
productHeat = 0.5 per unit
perkBonus = 0.05 (5% from heat_reduce perk)
networkUpgrade = 0.25 (EncroChat upgrade)

heatGain = 0.5 * (1 - 0.05 - 0.25) = 0.35 per unit
```

### Heat Decay
```javascript
heatDecay = -0.1 - (lawyerCount * 0.05)
```

**Examples**:
```
No Lawyer:   -0.1/s  = -6/min   = -360/hour
1 Lawyer:    -0.15/s = -9/min   = -540/hour
2 Lawyers:   -0.2/s  = -12/min  = -720/hour
```

### Heat Equilibrium
```javascript
equilibrium = heatGeneration / heatDecay
```

**Example: Selling 1 Cocaine/s with 1 Lawyer**
```
Generation: +0.5/s
Decay: -0.15/s
Equilibrium: 0.5 / 0.15 = 3.33 units/s max sustainable
```

---

## Optimization Calculations

### XP per Kroner (Mission Efficiency)
```javascript
efficiency = missionXP / missionCost
```

**Mission Efficiency Table**:
```
Mission | XP    | Cost   | XP/kr  | Rank
--------|-------|--------|--------|------
M1      | 100   | 75     | 1.33   | Best
M5      | 500   | 500    | 1.00   | Good
M7      | 2,000 | 37,500 | 0.053  | Poor
M13     | 15,000| 1.5M   | 0.010  | Worst
```

**Conclusion**: Early missions have best XP/kr ratio

### Income per Second (IPS)
```javascript
IPS = Σ(territoryIncome) + Σ(staffProduction * profit) - Σ(staffSalary / 300)
```

**Example Endgame Setup**:
```
Territories:
- All 5 owned, level 3 average
- Total: ~100,000 kr/s

Staff Production:
- 2 Gartners: 1 Hash/s * 20 kr profit = 20 kr/s
- 2 Kemikers: 0.4 Speed/s * 750 kr profit = 300 kr/s
- 1 Smugler: 0.05 Cocaine/s * 17,500 kr profit = 875 kr/s
- Subtotal: 1,195 kr/s

Staff Salaries:
- Total: 30,000 kr/5min = 100 kr/s

Net IPS: 100,000 + 1,195 - 100 = 101,095 kr/s
```

**Per Hour**: 101,095 * 3,600 = **363,942,000 kr/hour**

### Optimal Laundering Rate
```javascript
optimalRate = dirtyIncome * launderingRate * efficiency
```

**Example with Accountant + Studio**:
```
dirtyIncome = 50,000 kr/s
launderingRate = 0.70 (30% loss)
efficiency = 1.2 (Studio +20%)

cleanIncome = 50,000 * 0.70 * 1.2 = 42,000 kr/s
```

---

## Advanced Calculations

### Time to Rank X
```javascript
timeToRank(X) = Σ(levelXP[i] / avgXPperMinute) for i = currentLevel to X
```

**Assumptions**:
- Speedrun: 219 XP/min
- Casual: 50 XP/min

**Time to Rank 7**:
```
Speedrun: 26,296 / 219 = 120 minutes (2 hours)
Casual: 26,296 / 50 = 526 minutes (8.8 hours)
```

### Break-Even Analysis (Staff)
```javascript
breakEven = hirePrice / (profitPerHour - salaryPerHour)
```

**Example: Kemiker**
```
Hire: 50,000 kr
Profit: 750 kr/unit * 0.2 units/s * 3600 = 540,000 kr/hour
Salary: 2,500 kr/5min * 12 = 30,000 kr/hour
Net: 510,000 kr/hour

Break-Even: 50,000 / 510,000 = 0.098 hours (6 minutes!)
```

---

```
> FORMULAS: Complete
> All mathematics documented
> Ready for optimization
```
