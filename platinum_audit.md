# 🐞 Zero-Tolerance Debugging Audit Report

## 🚨 CRITICAL ISSUES (Must Fix Now)

### 1. The "Ghost Variable" Crash (ReferenceError)
**Location**: `src/utils/gameMath.js` (Line 192, 193, 224)
**Diagnosis**: The variable `prodRates` is used to calculate income but is **never defined** in the scope.
**Consequence**: Accessing the Finance Tab or any component using `getIncomePerSec` will throw a `ReferenceError` and crash the application (White Screen of Death).
**Fix**: Define `prodRates` using `baseOutput * prodMult`.

### 2. The "Negative Number" Crash (NaN Logic)
**Location**: `src/utils/gameMath.js` (Line 105)
**Diagnosis**: `Math.log10(num)` is called on `num`. If `num` is negative (e.g. Debt of -5,000), `Math.log10` returns `NaN`. The suffix lookup then fails.
**Consequence**: Any UI trying to display large negative numbers (Debt, Profit Loss) will crash or display "undefined".
**Fix**: Use `Math.abs(num)` for the log calculation.

### 3. The "Free Mission" Exploit (Logic Gap)
**Location**: `src/hooks/useGameActions.js` (Line 353-362)
**Diagnosis**: When a mission choice has both a `chance` (probability) and a `money` cost (negative value), the cost is **ignored**.
- The code enters `if (ef.chance) { ... }`.
- The cost deduction is in the `else { ... }` block.
**Consequence**: Users can take risky "paid" choices without actually paying the money.
**Fix**: Deduct the guaranteed cost before entering the chance/result split.

## ⚠️ WARNINGS (Stability & Physics)

### 1. Integer Overflow Risk (Warehouse)
**Location**: `src/utils/gameMath.js` (`getMaxCapacity`)
**Diagnosis**: `Math.pow(2.0, warehouseLvl)`. If `warehouseLvl` exceeds 53 (safe integer limit) or becomes large, capacity becomes `Infinity` or `NaN`.
**Risk**: Infinite storage capacity glitch.
**Rec**: Hard cap level or capacity.

### 2. Module State Pollution
**Location**: `src/utils/gameMath.js` (`let CURRENT_FORMAT`)
**Diagnosis**: Using a module-level variable for `CURRENT_FORMAT` means it survives component unmounts but might reset unpredictably during Hot Module Reloading or tests.
**Risk**: Inconsistent number formatting.

## 🧹 NITPICKS (Cleanup)

### 1. Boss Regen Rate
**Location**: `src/features/engine/gameTick.js`
**Note**: Boss regen uses `dt` (delta time). Ensure `dt` is consistently Seconds vs Ticks. Currently assumes Seconds.

### 2. Unused Imports
**Location**: `src/features/engine/gameTick.js`
**Note**: `playSound` is commented out but import remains.
