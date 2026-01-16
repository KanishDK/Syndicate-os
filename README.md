# 🏙️ SYNDICATE OS [PLATINUM EDITION]
**Copenhagen's Most Advanced Criminal Empire Simulator**

> *"The difference between a syndicate and a corporation is that we don't pay taxes... we pay with blood."*

[![Version](https://img.shields.io/badge/version-1.1.2-platinum)](https://github.com/KanishDK/Syndicate-os)
[![Status](https://img.shields.io/badge/status-stable-success)]()

**[🎮 PLAY NOW](https://kanishdk.github.io/Syndicate-os/)** | **[📘 WIKI](MECHANICS_WIKI.md)**

---

## 📲 How to Install (App)
Syndicate OS is a **Progressive Web App (PWA)**. You can install it directly on your device for a full-screen, immersive experience.

*   **iOS (iPhone/iPad):** Tap `Share` -> `Add to Home Screen` ➕
*   **Android:** Tap `Menu` (⋮) -> `Install App` or `Add to Home Screen` 📱
*   **PC/Mac:** Click the install icon (⊕) in the Chrome/Edge address bar.

---

## 💎 Platinum Edition (v1.1.2) Features
This update stabilizes the economy and introduces high-precision simulation logic.

* **🛡️ Offline Protection System:** No more logging in to a destroyed empire. Raids and negative events are disabled while you are offline.
* **🧠 Intelligent Heat Scale:** The police threat now scales dynamically from 0 to 500. Warnings trigger at 60%, 70%, and 90%.
* **💼 The Accountant Buff:** Early-game automation is now accessible (Cost reduced from 1M to 150k).
* **👥 Loyalty System:** Staff gains **+1% efficiency per day** employed. Don't fire your veterans!
* **📉 Real-Time Crypto:** Bitcoin, Ethereum, and Monero fluctuate every second based on simulated market events.

---

## 🎮 The Core Loop

1.  **PRODUCE (The Lab):** From Hash to Fentanyl. Balance your inventory limits.
2.  **SELL (The Street):** Move product to earn **Dirty Cash**. Be careful: Sales generate Heat.
3.  **LAUNDER (The Wash):** Dirty money is useless. Wash it into **Clean Cash** (minus a 30% fee).
4.  **INVEST (The Empire):** Buy Territories, Luxury Items, and Upgrades to scale exponentially.

---

## ⚙️ Technical Architecture

* **Engine:** Custom `useGameLoop` with delta-time (dt) correction for smooth performance on any device.
* **Simulation:** `offline.js` simulates up to 30 days of inactivity in 60-second chunks to calculate accurate earnings.
* **State:** React Context with deep-merge migration for save file compatibility.

## 🚀 Quick Start
1.  **Manual Labor:** Click "Lav Hash" and "Sælg Alt" to get your first 2.500 kr.
2.  **Staff Up:** Hire a "Junkie" (Cheap) or "Grower" (Reliable).
3.  **Watch the Heat:** If Heat > 300, stop selling or hire a **Lawyer**.
4.  **First Goal:** Save 150.000 kr to hire an **Accountant** (Auto-Laundering).

---

**© 2026 Syndicate OS.** *Don't hate the player, hate the game.*