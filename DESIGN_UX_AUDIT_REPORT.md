ix# 🎨 Design & UX Audit: Syndicate OS Final
**Dato:** 31. December 2025
**Hold:** "The Pixel Syndicate" (Design & UX Team)
**Enheder Testet:** iPhone 15 Pro, Samsung S24, iPad Air, 27" 4K Monitor, 13" Laptop.

---

## 👥 Meet the Team (Simulated Personas)
*   **Paul (Lead Visuals):** Fokus på æstetik, farve, typography og atomsfære.
*   **Tina (Mobile UX):** Fokus på "Thumb Zone", touch targets og responsivitet.
*   **Marcus (Accessibility):** Fokus på kontrast, læsbarhed og kognitiv belastning.

---

## 📱 Mobile Responsiveness (Tina's Report)
*Staus: ⚠️ CRITICAL ISSUES FOUND*

### 1. Det Forsvundne Heat Meter (Critical)
På mobil (`md:` breakpoint og under) er Heat-baren skjult i `Header.jsx`.
*   **Problemet:** Heat er en *tab condition*. Hvis jeg ikke kan se min heat på mobilen, dør jeg blindt.
*   **Rettelse:** Heat-baren SKAL være synlig på mobil. Måske som en tynd rød linje helt i toppen eller bag "Likvid" tallene?

### 2. "Fat Finger" Problemet
Knapperne i `ProductionCard.jsx` ("1", "10", "ALT") er meget små.
*   **Data:** Touch target ser ud til at være ca. 20x20px. Apple anbefaler 44x44px.
*   **Konsekvens:** Jeg kommer ofte til at trykke "Sælg Alt" når jeg ville trykke "10". Det er frustrerende.
*   **Løsning:** Gør knapperne større på mobil, eller lav en "Sell Modal".

### 3. Konsolhøjde
`ConsoleView` tager 96px (`h-24`) på mobil. Det er okay, men tastaturet dækker ofte halvdelen af skærmen på små telefoner. Sørg for at input felter (hvis de kommer) løfter viewet op.

---

## 🎨 Visual Design & Aesthetics (Paul's Report)
*Status: ⭐ GILDED NOIR*

### 1. Atmosfære
"Dark Mode" implementationen er i verdensklasse. Brugen af `zinc-900` og `zinc-950` skaber dybde.
*   **Highlight:** `index.css` med scanlines og glow effekter giver en ægte "Hacker / Underverden" følelse.
*   **Note:** Din grønne "Toxic Green" (`#10b981`) står knivskarpt mod den mørke baggrund.

### 2. Typografi
Kombinationen af `Inter` (UI) og `JetBrains Mono` (Tal/Data) fungerer perfekt. Tallene er lette at scanne.
*   **Forslag:** Gør "Milliarder/Billioner" suffikserne (k, M, B) i `gameMath.js` farvekodede? F.eks. `M` er grøn, `B` er guld? Det vil øge læsbarheden.

---

## 👁️ Accessibility & Layout (Marcus' Report)
*Status: 🟠 NEEDS IMPROVEMENT*

### 1. Kontrast på "Låste" Kort
Når et kort er låst (`opacity-50 grayscale`), er teksten meget mørk grå på sort baggrund.
*   **Problem:** Ude i sollys (på mobil) er det umuligt at læse, hvad kravet for at låse op er.
*   **Løsning:** Øg lysstyrken på teksten "LÅS OP LVL X", selvom kortet er gråt.

### 2. Panic Button Placering
Den nye "Panic Button" er fed, men på mobil ligger den ved siden af "Lager". På små skærme kan teksten wrappe og ødelægge layoutet i `Header`.
*   **Observation:** Vi ser at knappen kan blive meget lille. Overvej kun at vise ikonet (Hånden) på mobil, uden tekst?

---

## 🛠️ Final Recommendations (The Punchlist)

1.  **[MOBILE FIX] Gør Heat-meter synligt på mobil.** (Højeste prioritet).
2.  **[UX FIX] Øg størrelsen på Sælg-knapperne.** Minimum 44px højde/bredde.
3.  **[VISUAL] Farvekodede Tal-suffikser.** (Nice to have).
4.  **[CSS] Juster "Locked" state opacity.** Fra 0.5 til 0.7 for bedre læsbarhed.

*Samlet Dom:*
Spillet ser hamrende godt ud på Desktop, men mobilopplevelsen har et par "showstoppers" (Heat meteret). Fiks dem, og du har et hit. 🚀
