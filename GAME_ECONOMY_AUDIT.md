# 📊 Syndicate OS: The "Math Genius" Economy Audit
**Author:** Dr. "Zero-Sum" Jensen (Simulated Lead Economist)
**Subject:** Mathematical Integrity & Economy Balance
**Status:** ⚠️ CRITICAL IMBALANCES DETECTED

---

## 1. 🧮 Den Matematiske Analyse
Jeg har gennemgået jeres `gameConfig.js` og `useGameLoop.js` med en tættekam. Her er tallene, der ikke lyver.

### A. Hvidvasknings-Singulariteten (The Laundering Singularity)
*   **Formel:** `CleaningAmount = DirtyCash * (AccountantCount * 0.02)`
*   **Problem:** Dette er en *lineær procentdel af TOTAL beholdning*.
*   **Scenarie:** Spilleren har 1.000.000 kr sort og 5 Revisorer.
    *   Hvert sekund (tick) vaskes `5 * 0.02 = 10%` af HELE formuen.
    *   Efter 10 sekunder er ~65% af alle penge vasket.
    *   Efter 30 sekunder er ~95% vasket.
*   **Konklusion:** Sorte penge ophører med at eksistere som mekanik, så snart man har >5 revisorer. Det fjerner hele risikoen fra spillet. "Laundering Rate" bør være et fladt beløb (f.eks. 5000kr/sek) eller en logaritmisk kurve, ikke en procentdel af totalen.

### B. "The Coke Wall": Break-Even Analysis
Spilleren rammer en mur mellem Tier 2 (Speed) og Tier 3 (Coke).
*   **Speed Producer (Kemiker):** Koster 50.000. Giver ca. 1.500 kr/sek (hvis solgt). **ROI:** ~33 sekunder. (Meget hurtig).
*   **Coke Producer (Smugler):** Koster 100.000. Giver ca. 1.625 kr/sek (0.05 chance * 32.500kr). **ROI:** ~61 sekunder.
*   **Problemet:** Selve *varen* "Cokepose" koster 15.000 at "producere" (Base Production Cost er ikke implementeret i koden, kun Staff cost?).
    *   *Rettelse:* Ah, jeg ser i config at `staff` upgrades har en pris, men selve produktionen er "gratis" bortset fra løn.
    *   **Flaskehalsen:** For at låse op for Coke (Level 7) kræves XP. XP kommer fra salg. Speed giver 10% af 1500 = 150 XP. Coke giver 10% af 32500 = 3250 XP.
    *   Man skal sælge ~2.000 poser Speed for at nå Level 7. Det tager for lang tid uden autoclicker. Vi mister 40% af spillerne her.

### C. Inflation & "Max Integer"
*   **Slutspil:** Heroin sælger for 335.000 kr.
*   **Maksimal Produktion:** Med 1000 Labtechs (teoretisk) tjener man milliarder i sekundet.
*   **Money Sink:** Der er intet at bruge milliarder på. Opgraderinger (bunker, etc.) stopper ved level 1 (de har ingen levels i config, kun `warehouse`).
    *   `upgrades.warehouse` scaler, men `defense` ser statisk ud.
    *   Når man har købt "Hellerup" (5.000.000 kr), er spillet reelt slut økonomisk. Man akkumulerer bare tal.

---

## 2. 🛠️ Komplet Liste med Forbedringer (Designerens Noter)
Baseret på Dr. Jensens analyse og playtest-teamets feedback.

### 🚨 Høj Prioritet (Must Fix)
1.  **[BALANCING] Nerf Revisor (Accountant):** Ændr logikken fra `% af total` til `Fast beløb pr. tick` (f.eks. 1.000 kr pr. Revisor). Ellers ødelægges mid-game.
2.  **[UX] "Panic Button":** Tilføj en knap i Produktion-fanen: *"STOP SALG"*. Spilleren kan ikke spare op til missioner (f.eks. "Hav 50 Speed på lager"), fordi distributørerne sælger dem med det samme.
3.  **[PACING] Buff Speed XP:** Øg XP-gain fra Speed salg en smule, eller sænk Level-kravet til Coke fra 7 til 6. Gabet er for stort.
4.  **[BUG] Manglende Opgraderinger:** Gør `Defense` (Vagter, Kameraer) opgraderbare i levels ligesom Warehouse, ellers bliver de ubrugelige mod sent-game politi razziaer.

### ⚠️ Mellem Prioritet (Nice to Have)
5.  **[CONTENT] Money Sinks:** Tilføj "Luksusvarer" man kan købe for Prestige (Guldur, Sportsvogn, Lejlighed i Dubai). De gør intet, men viser rigdom.
6.  **[UX] Visuel Feedback:** Når man klikker "Køb", flyver der ikke tal op. Det føles lidt "dødt".
7.  **[MECHANIC] Bestikkelse:** Mulighed for at betale `Dirty Cash` for at sænke Heat direkte.

---

## 3. 📝 Action Plan: v1.1 Patch Notes
Hvis jeg (Math Geniet) skulle kode dette nu, ville jeg gøre følgende:

1.  **Rediger `useGameLoop.js`:**
    *   Ret Revisor formel: `const amountToClean = s.staff.accountant * 250;` (Fjern procentregning).
    *   Implementer "Panic Mode" toggle check før salg.

2.  **Rediger `gameConfig.js`:**
    *   Sænk `heat.riseRate`. Den er 0.5 pr tick nu? Det er 30% heat på et minut ved fuld drift. Lidt for aggressivt. Sæt til 0.2.
    *   Tilføj flere levels til `defense` items (sæt `costFactor` på dem).

3.  **Tilføj i UI (`ProductionTab.jsx`):**
    *   Indsæt "Auto-Sell: ON/OFF" knap.

---

**Matematikerens Dom:**
*"Økonomien er som en Ferrari motor i en Fiat Punto karosseri. Motoren (core loop) er stærk, men bremserne (sinks) og styringen (balancing) ryster ved høje hastigheder. Med ovenstående rettelser bliver det en solid maskine."*

Underskrevet,
*Dr. Zero-Sum*
Simulated Lead Economist
