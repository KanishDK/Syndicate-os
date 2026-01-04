# Syndicate OS

> **Version:** 1.1.1 [PLATINUM]
> **Status:** Gold Master / Production Ready

## 🕵️‍♂️ Om Spillet
Syndicate OS er en dansk-tematiseret **Idle Tycoon / Strategi Simulation**, der foregår i Københavns underverden. Spillet kører i en "Terminal"-inspireret UI, hvor du spiller rollen som en nybagt bagmand, der skal opbygge et kriminelt imperium fra gadeniveau til kartel-leder.

### Key Features
*   **Produktion & Salg:** Fra hash på Nørrebro til kokain i City.
*   **Økonomi:** Dobbelt valuta-system (Sorte Penge vs. Rene Penge) med hvidvask-mekanik.
*   **Risiko:** Hold øje med "Osten" (Heat). For meget varme fører til Razzia og tab.
*   **Territorier:** Erob 5 distrikter i København (Staden, Halmtorvet, etc.).
*   **Historie:** 20 missioner guidet af din mentor "Sultanen".
*   **Lyd:** Autentisk atmosfære med syntetiske lydeffekter (Howler.js).

## 🛠️ Installation & Setup

### Forudsætninger
*   Node.js (v18+)
*   NPM (v9+)

### Kør Lokalt (Dev)
```bash
# 1. Installer afhængigheder
npm install

# 2. Start udviklingsserver
npm run dev
```

### Build til Produktion
```bash
# Byg optimeret version til /dist
npm run build

# Preview det byggede site
npm run preview
```

## 🚀 Deployment (GitHub Pages)

Dette projekt er konfigureret til auto-deployment på GitHub Pages.

1.  Sørg for at du er på en git repo.
2.  Kør deploy scriptet:
    ```bash
    npm run deploy
    ```
    *(Dette bygger projektet og pusher `/dist` mappen til `gh-pages` branch)*

## 📂 Projekt Struktur
*   `src/components`: React komponenter (UI widgets).
*   `src/features/engine`: Spillets kerne-logik (Economy, Production, Missions).
*   `src/config`: Balancering og tekst-konfiguration (`gameConfig.js`).
*   `src/utils`: Hjælpe-funktioner (Audio, Formatting).

## 📜 Credits
*   **Udvikling:** Antigravity AI
*   **Design:** Terminal CSS (fiktiv OS stil)
*   **Lyd:** Procedural Synth & Howler.js

> *"Penge lugter ikke... men det gør din kælder."* - Sultanen
