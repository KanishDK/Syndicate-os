# 📘 Syndicate OS: Mechanics Wiki
*Source of Truth: v1.1.3 Codebase*

## 1. The Heat System 🚨
Heat is the primary risk mechanic. Unlike other games, it is not linear.

* **Max Capacity:** 500 Units (Internally).
* **Visual Scale:** UI displays `Current / 500`.
* **Generation Formula:**
    `HeatGain = (Amount * UnitHeat * 0.4 * Multipliers)`
    *Note: The 0.4 dampener allows for higher volume sales.*

**Thresholds:**
* **Safe Zone:** 0 - 299
* **Caution (Low):** 300+ (60%)
* **Danger (High):** 350+ (70%) - *Production Efficiency drops to 50%*
* **Critical:** 450+ (90%) - *Production Efficiency drops to 20%*

**Decay:**
* Base Decay: **0.1 per sec**
* Lawyer Bonus: **0.15 per sec** (per Lawyer)
* *Strategy: 1 Lawyer neutralizes the heat from selling ~18 units of Hash per second.*

## 2. Police Raids 👮
Raids are probabilistic events triggered by high heat.

* **Formula:** `Chance/sec = (CurrentHeat / 500) * 0.1%`
* **At Max Heat (500):** 0.1% chance per second.
* **Average Trigger Time:** ~16.6 minutes at Max Heat.
* **Offline:** Raids are **DISABLED** while offline.

**Penalties:**
* **Low Heat:** Lose 10% Dirty Cash + 0% Inventory.
* **High Heat (Critical):** Lose 60% Dirty Cash + 80% Inventory.
* **Hardcore Mode:** Game Over (Save Wipe).

## 3. Economy & Laundering 💸
* **Territory Income:** Values in Config are **Per Hour**.
    * *Example:* Nørrebro (75.000 kr) pays **~20.8 kr/sec**.
* **Laundering Fee:** The "Sultan's Cut" is **30%**.
    * *Formula:* `CleanAmount = DirtyAmount * 0.70`.
* **The Accountant:**
    * Washes 5% of your Dirty Cash stack per second (capped by capacity).
    * Unlock Cost: **150.000 kr** (Reduced from 1M).

## 4. Staff Loyalty 🤝
Staff members become more efficient over time.
* **Bonus:** +1% Efficiency per Real-Time Day.
* **Cap:** +20% Max Bonus.
* **Reset:** Hiring new staff averages the date. Firing all resets to 0.

## 5. Crypto Market 📉
* **Update Rate:** 10% chance per second to update prices.
* **Crash Mechanic:** 5% chance during update to crash price by 50%.
* **Domino Effect:** If Bitcoin crashes, Ethereum drops 40% instantly.
