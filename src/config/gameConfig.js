export const GAME_VERSION = '1.0.2 (Post-Launch Fix)';
export const STORAGE_KEY = 'syndicate_os_danish_tycoon_v1';

export const CONFIG = {
    fps: 60,
    autoSaveInterval: 30000,
    levelTitles: ["Gade Soldat", "Hustler", "Løjtnant", "Boss", "Kingpin", "Don", "Gudfader"],
    initialCash: 2500, // Harder start (Realism: Small dealer buy-in)
    initialDirtyCash: 0,
    heat: { decay: 0.5, coolRate: 0.2 },
    launderingRate: 0.70, // 30% loss (Realism: Professional fees)

    // --- NARRATIVE & PERSONAS ---
    pols: {
        name: 'Sultanen',
        title: 'Information Broker',
        desc: 'Din kontakt fra kiosken på Nørrebrogade. Han styrer Western Union overførslerne, ser alt på overvågningen, og kender alle chauførrene.',
        icon: 'fa-store'
    },

    // --- DYNAMIC WORLD EVENTS ---
    news: [
        // --- HIGH IMPACT (MARKET SHIFTS) ---
        { msg: "DISTORTION FESTIVAL: Gaden fester! Efterspørgsel på MDMA og Speed eksploderer (+100%).", type: 'success' },
        { msg: "ROSKILDE FESTIVAL: Dyrskuepladsen åbner. Coke og Hash i høj kurs (+60%).", type: 'success' },
        { msg: "JULEFROKOST SÆSON: Firmaer fester igennem. Sne falder i stride strømme (+40% Coke).", type: 'success' },
        { msg: "RAZZIA PÅ STADEN: Osten rydder Pusher Street. Hash priser bunder (-40%).", type: 'warning' },
        { msg: "GRÆNSEKONTROL: Skærpet kontrol i Rødby. Import varer sidder fast (-30% Supply).", type: 'warning' },
        { msg: "POLITI-AKTION: 'Operation Hvid Jul'. Alle pushere holder lav profil.", type: 'warning' },
        { msg: "VINTER TØRKE: Frostvejr og lukkede havne. Alt import er dyrt.", type: 'warning' },
        { msg: "BLOCKCHAIN CRASH: Krypto styrtdykker. Hvidvask er billigere, men risikabelt.", type: 'rival' },
        { msg: "ETHEREUM SURGE: Gas fees er tårnhøje. Hvidvask koster kassen.", type: 'rival' },

        // --- LOCAL FLAVOR (NØRREBRO/WESTEND) ---
        { msg: "Nørrebro: Skudveksling ved Den Røde Plads. Folk holder sig inde.", type: 'rival' },
        { msg: "Vesterbro: Turister flokkes til Kødbyen. Pusherne har travlt.", type: 'success' },
        { msg: "Nordvest: Unge rødder kaster med kanonslag. Osten er distraheret.", type: 'info' },
        { msg: "Amager: Rockerne holder træf. Hold lav profil på øen.", type: 'rival' },
        { msg: "Sydhavnen: Nybyggeriet tiltrækker rige kunder. Priserne stiger.", type: 'success' },
        { msg: "Christiania: Turistsæsonen starter. Salget af 'souvenirs' stiger.", type: 'success' },
        { msg: "Istedgade: Politiet opsætter overvågning. Heat stiger hurtigere.", type: 'warning' },
        { msg: "Vestegnen: GTI-træf på tanken. Speed flyder frit.", type: 'info' },

        // --- POLICE & HEAT ---
        { msg: "Politiet har fået nye droner med varmesøgende kameraer. Hold lav profil.", type: 'warning' },
        { msg: "Lokalbetjent 'Jens' tager imod bestikkelse igen.", type: 'info' },
        { msg: "Rigspolitiet advarer om 'stærk pille' i omløb.", type: 'warning' },
        { msg: "Efterlyst: Din rival 'Lille A' er set ved lufthavnen.", type: 'info' },
        { msg: "Politiradio: 'Mistænkelig aktivitet i din sektor'.", type: 'warning' },
        { msg: "Ny lovgivning: Hårdere straffe for hvidvask fra i dag.", type: 'warning' },

        // --- RANDOM / FLAVOR ---
        { msg: "Vejret: Gråt og trist. Perfekt til at lave skejs.", type: 'info' },
        { msg: "Rygte: En ny sending 'Blå Viagra' hitter på plejehjemmene.", type: 'info' },
        { msg: "Metroen er ude af drift. Kunderne kan ikke komme frem.", type: 'warning' },
        { msg: "Sultanen giver en omgang shawarma til drengene.", type: 'success' },
        { msg: "Din mor ringer: 'Hvornår får du et rigtigt arbejde?'", type: 'info' },
        { msg: "En influencer flasher dine varer på TikTok. Heat stiger!", type: 'warning' },
        { msg: "Alpha Syndikatet har malet over dit tag. Respektløst.", type: 'rival' },
        { msg: "En junkie fandt 1000kr og købte hele lageret.", type: 'success' },
        { msg: "Strømafbrydelse i laboratoriet. Produktionen holdt stille i 5 min.", type: 'warning' },
        { msg: "Hundepatrulje set ved din hoveddør. Falsk alarm... denne gang.", type: 'warning' },

        // --- SEASONAL ---
        { msg: "Sommer: Alle vil have Coke til terrassen.", type: 'success' },
        { msg: "Vinter: Mørketid. Folk vil bare ryge og se Netflix.", type: 'success' },
        { msg: "Lønningsdag: Folk har penge. Priserne får et lille nyk op.", type: 'success' },
        { msg: "Blå Mandag: Konfirmander i byen. Pas på med at sælge til børn (Heat++).", type: 'warning' },

        // --- TECH & CRYPTO ---
        { msg: "Darkweb markedet 'SilkRoad 4.0' er hacket. Alle er paranoide.", type: 'rival' },
        { msg: "Nye krypterede telefoner ankommet. Sikkerheden er i top.", type: 'success' },
        { msg: "Bitcoin ATM på Nørrebrogade er ude af drift.", type: 'warning' },
        { msg: "En hacker tilbyder at slette din straffeattest for 50k.", type: 'info' },

        // --- MORE FLAVOR ---
        { msg: "Din revisor spørger om kvitteringer for 'gødning'.", type: 'info' },
        { msg: "En kunde klager over kvaliteten. 'Det er bare oregano!'.", type: 'warning' },
        { msg: "Rivalerne har hyret nye vagter. Pas på.", type: 'rival' },
        { msg: "Sultanen er tilfreds. Han sender en flaske vodka.", type: 'success' },
        { msg: "Du fandt en pose penge i en taxa. Held i uheld.", type: 'success' },
        { msg: "Nabokrig: Nogen har stjålet din postkasse.", type: 'info' },
        { msg: "Breaking: Regeringen overvejer legalisering (igen).", type: 'info' },
        { msg: "En Netflix serie om dit liv? Nej, bare paranoia.", type: 'info' }
    ],

    // --- MISSION CHAIN: RISE TO POWER ---
    missions: [
        // PHASE 1: THE HUSTLE (Tutorial)
        { id: 'm1', title: 'Første Levering', req: { type: 'produce', item: 'hash_lys', amount: 5 }, reward: { xp: 50, money: 200 }, giver: 'Sultanen', text: "Velkommen til Gaden, bror. En junkie ved Den Røde Plads mangler skiver. Gå til <b>Produktion</b> og lav 5x Hash. Tjep." },
        { id: 'm2', title: 'Start Salget', req: { type: 'sell', amount: 5 }, reward: { xp: 100, money: 500 }, giver: 'Sultanen', text: "Godt. Men varer på lageret betaler ikke huslejen. Sælg lortet for at få Sorte Penge. Pas på varmen!" },
        { id: 'm3', title: 'Vask Pengene', req: { type: 'launder', amount: 300 }, reward: { xp: 150, money: 0 }, giver: 'Sultanen', text: "Du har Sorte Penge, men du kan ikke bruge dem i Netto. Gå til <b>Finans</b> og vask dem til Ren Kapital." },
        { id: 'm4', title: 'Automatiser', req: { type: 'hire', role: 'pusher', amount: 1 }, reward: { xp: 200, money: 1000 }, giver: 'Sultanen', text: "Du ligner en der har travlt. Find en 'Pusher' under <b>Operationer</b> til at sælge for dig, så vi kan fokusere på de store numre." },

        // PHASE 2: SCALING UP
        { id: 'm5', title: 'Kvalitetskontrol', req: { type: 'produce', item: 'hash_moerk', amount: 10 }, reward: { xp: 800, money: 3000 }, giver: 'Sultanen', text: "Kunderne klager. De vil have det grønne. Hash er yt, de vil have Skunk. Få en gartner i gang." },
        { id: 'm5b', title: 'Udvid Lageret', req: { type: 'upgrade', id: 'warehouse' }, reward: { xp: 1000, money: 5000 }, giver: 'Sultanen', text: "Kælderen flyder med papkasser. Køb et Boxit-rum (Lager Opgradering), før varerne rådner op." },
        {
            id: 'm6', title: 'Indtag Kødbyen', req: { type: 'conquer', amount: 1 }, reward: { xp: 2000, money: 10000 }, giver: 'Sultanen', text: "Hipsterne i Kødbyen betaler overpris. Hvis du Investerer i et Territorie (Netværk fanen), ejer vi blokken.", choices: [
                { text: "Send drengene (+Heat, -Rival)", effect: { heat: 20, rival: -10 } },
                { text: "Bestik vagterne (-5000kr)", effect: { money: -5000, heat: -10 } }
            ]
        },

        // PHASE 3: HARD DRUGS
        { id: 'm7', title: 'Det Blå Lyn', req: { type: 'produce', item: 'speed', amount: 50 }, reward: { xp: 5000, money: 25000 }, giver: 'Sultanen', text: "Lastbilchaufførerne på Vestegnen spørger efter Speed. Ansæt en Kemiker og kom i gang." },
        { id: 'm8', title: 'Push Det Hele', req: { type: 'sell', amount: 500 }, reward: { xp: 7000, money: 50000 }, giver: 'Sultanen', text: "Få skidtet ud på gaden. Jeg vil se lapper i hånden, habibi! Sælg 500 enheder." },
        { id: 'm9', title: 'Nordvest Netværk', req: { type: 'conquer', amount: 2 }, reward: { xp: 10000, money: 75000 }, giver: 'Sultanen', text: "Nordvest er en krudttønde. Hvis vi investerer der, styrer vi hele det mørke marked." },

        // PHASE 4: THE SYNDICATE
        {
            id: 'm12', title: 'Import Forretning', req: { type: 'hire', role: 'importer', amount: 1 }, reward: { xp: 15000, money: 0 }, giver: 'Sultanen', text: "Glem lokal produktion. Import er fremtiden. Jeg kender en mand med en container i Frihavnen. Vi skal bruge en Importør.", choices: [
                { text: "Tag chancen (50% for +50k kr / +20 Heat)", effect: { chance: 0.5, success: { money: 50000 }, fail: { heat: 20 } } },
                { text: "Spil sikkert (Ingen risiko)", effect: {} }
            ]
        },
        { id: 'm13', title: 'Det Hvide Guld', req: { type: 'produce', item: 'coke', amount: 100 }, reward: { xp: 25000, money: 150000 }, giver: 'Sultanen', text: "Sten. Det hvide guld. Overklassen elsker det. Skaf det til weekenden." },
        { id: 'm14', title: 'Sikkerhed Fremfor Alt', req: { type: 'hire', role: 'lawyer', amount: 1 }, reward: { xp: 30000, money: 0 }, giver: 'Sultanen', text: "Osten er varm. Få fat i en slesk advokat. En der kender smuthullerne og kan holde Heat nede." },

        // PHASE 5: KINGPIN
        { id: 'm15', title: 'Indre By Monopol', req: { type: 'conquer', amount: 4 }, reward: { xp: 50000, money: 500000 }, giver: 'Sultanen', text: "De rige i Indre By skal også have deres fix. Tag kontrollen over nattelivet." },
        { id: 'm16', title: 'Vaskemaskinen', req: { type: 'upgrade', id: 'studio' }, reward: { xp: 75000, money: 250000 }, giver: 'Sultanen', text: "Vi har brug for en lovlig front. Et musikstudie? Et pizzeria? Bare det ser ægte ud. (Køb 'Front-Butik' opgradering)." },
        { id: 'm17', title: 'Kartel Status', req: { type: 'produce', item: 'coke', amount: 1000 }, reward: { xp: 100000, money: 1000000 }, giver: 'Sultanen', text: "Vi er ikke længere en bande. Vi er et kartel. Fyld lageret til bristepunktet." },

        // PHASE 6: ENDGAME
        { id: 'm18', title: 'Hellerup Kuppet', req: { type: 'conquer', amount: 5 }, reward: { xp: 200000, money: 5000000 }, giver: 'Sultanen', text: "Det endelige mål. Hellerup. Hvor pengene og magten bor. Køb investeringen." },
        {
            id: 'm19', title: 'Rivalens Fald', req: { type: 'upgrade', id: 'bunker' }, reward: { xp: 500000, money: 0 }, giver: 'Sultanen', text: "Alpha Syndikatet planlægger et angreb. Gå til Underverdenen og byg en Bunkers. Gør klar til krig.", choices: [
                { text: "Angrib først (Ryd rival)", effect: { rival: -100, heat: 50 } },
                { text: "Defensiv (Spar penge)", effect: { money: 100000 } }
            ]
        },
        { id: 'm20', title: 'Legenden', req: { type: 'sell', amount: 10000 }, reward: { xp: 1000000, money: 10000000 }, giver: 'Sultanen', text: "Du har gjort det, knægt. Du ejer denne by. Tid til at trække sig tilbage? Eller starte forfra?" }
    ],

    // Balancering
    production: {
        // TIER 1: GADEPLAN (Single Units - 1g / 1 Pill)
        hash_lys: { name: "Hash (1g)", baseCost: 15, baseOutput: 1, baseRevenue: 35, costFactor: 1.1, unlockLevel: 1, duration: 1000, icon: "fa-cannabis", color: "yellow", tier: 1, aliases: ["En pind", "Tjald", "Juletræ", "1-grams pose", "Sjov Tobak"] },
        piller_mild: { name: "Studie-Speed (1 Pille)", baseCost: 35, baseOutput: 1, baseRevenue: 75, costFactor: 1.15, unlockLevel: 1, duration: 1500, icon: "fa-pills", color: "blue", tier: 1, aliases: ["Ritalin", "Eksamens-hjælp", "Kvik-pille", "Fokus"] },
        hash_moerk: { name: "Skunk (1g)", baseCost: 25, baseOutput: 1, baseRevenue: 50, costFactor: 1.2, unlockLevel: 2, duration: 2500, icon: "fa-cubes", color: "amber", tier: 1, aliases: ["Kvali-røg", "Marok", "Sort Guld", "Sovs", "Krydderi"] },

        // TIER 2: KLUBBEN (Bulk Pouches - 10g) - Requires Lvl 4
        speed: { name: "Amfetamin (10g Pose)", baseCost: 750, baseOutput: 1, baseRevenue: 1500, costFactor: 1.25, unlockLevel: 4, duration: 4000, icon: "fa-bolt", color: "white", tier: 2, aliases: ["Gade-Speed", "Krudt", "Nattelys", "Polsk Champagne"] },
        mdma: { name: "MDMA (10g Pose)", baseCost: 1500, baseOutput: 1, baseRevenue: 3000, costFactor: 1.3, unlockLevel: 5, duration: 6000, icon: "fa-heart", color: "pink", tier: 2, aliases: ["Emma", "Dannebrog", "Kærlighed", "Krystaller"] },
        keta: { name: "Ketamin (10g Pose)", baseCost: 1500, baseOutput: 1, baseRevenue: 3000, costFactor: 1.35, unlockLevel: 5, duration: 8000, icon: "fa-horse-head", color: "zinc", tier: 2, aliases: ["Hest", "Special K", "Bedøvelse", "K-Hole Billet"] },

        // TIER 3: HIGH ROLLERS (Bulk Boxes/Plades - 50g-1000p) - Requires Lvl 7
        coke: { name: "Kokain (50g Pose)", baseCost: 15000, baseOutput: 1, baseRevenue: 32500, costFactor: 1.4, unlockLevel: 7, duration: 10000, icon: "fa-snowflake", color: "white", tier: 3, aliases: ["Coke", "Sne", "Det Hvide", "Casper C-blanding", "VIP Pulver"] },
        benzos: { name: "Benzos (1000 Gl. Piller)", baseCost: 15000, baseOutput: 1, baseRevenue: 35000, costFactor: 1.45, unlockLevel: 8, duration: 12000, icon: "fa-prescription-bottle", color: "blue", tier: 3, aliases: ["Krydser", "Blå", "Sovemedicin", "Grosserer-pakke"] },
        svampe: { name: "Svampe (200g Sæk)", baseCost: 15000, baseOutput: 1, baseRevenue: 30000, costFactor: 1.5, unlockLevel: 8, duration: 15000, icon: "fa-frog", color: "purple", tier: 3, aliases: ["Hatte", "Psykose-snack", "Visuelt", "Naturoplevelse"] },

        // TIER 4: KARTEL (Wholesale Bricks - 500g/500p) - Requires Lvl 10
        oxy: { name: "Oxy (500 Piller)", baseCost: 50000, baseOutput: 1, baseRevenue: 100000, costFactor: 1.6, unlockLevel: 10, duration: 20000, icon: "fa-syringe", color: "teal", tier: 4, aliases: ["Hillbilly Heroin", "Apoteker-Guld", "Smertestillende", "USA-Import"] },
        heroin: { name: "Heroin (500g Mursten)", baseCost: 100000, baseOutput: 1, baseRevenue: 335000, costFactor: 1.8, unlockLevel: 11, duration: 30000, icon: "fa-biohazard", color: "amber", tier: 4, aliases: ["Brun", "Hest", "Dragen", "Det Brune Punktum"] },
        fentanyl: { name: "Fentanyl (500g Pure)", baseCost: 180000, baseOutput: 1, baseRevenue: 375000, costFactor: 2.0, unlockLevel: 12, duration: 45000, icon: "fa-skull", color: "red", tier: 4, aliases: ["Døden", "China White", "The End", "Sidste Stop"] }
    },
    staff: {
        // PRODUCERS (Realism: Monthly Salaries + Level Req)
        grower: { name: 'Gartner', reqLevel: 1, baseCost: 15000, costFactor: 1.3, role: 'producer', target: 'hash_moerk', rate: 5000, salary: 800, icon: 'fa-seedling', desc: 'Dyrker både Hash og Skunk' },
        chemist: { name: 'Kemiker', reqLevel: 4, baseCost: 50000, costFactor: 1.4, role: 'producer', target: 'speed', rate: 10000, salary: 2500, icon: 'fa-flask', desc: 'Koger Speed og andet godt' },
        importer: { name: 'Smugler', reqLevel: 7, baseCost: 100000, costFactor: 1.5, role: 'producer', target: 'coke', rate: 20000, salary: 8000, icon: 'fa-ship', desc: 'Henter varer hjem fra udlandet' },
        labtech: { name: 'Laborant', reqLevel: 10, baseCost: 200000, costFactor: 1.6, role: 'producer', target: 'fentanyl', rate: 30000, salary: 12000, icon: 'fa-syringe', desc: 'Syntetiserer det helt tunge stads' },

        // SPECIAL
        junkie: { name: 'Zombie', reqLevel: 1, baseCost: 1000, costFactor: 1.5, role: 'producer', target: ['hash_lys', 'piller_mild'], rate: 1500, salary: 0, icon: 'fa-pills', desc: 'Arbejder for fixet. Har ingen fremtid.' },
        accountant: { name: 'Revisor', reqLevel: 8, baseCost: 250000, costFactor: 1.6, role: 'reducer', target: 'clean', rate: 0.05, salary: 2000, icon: 'fa-calculator', desc: 'Vasker automatisk sorte penge (5%/sek)' },

        // SELLERS
        pusher: { name: 'Pusher', reqLevel: 1, baseCost: 5000, costFactor: 1.2, role: 'seller', target: ['hash_lys', 'piller_mild'], rate: 2000, salary: 300, icon: 'fa-person-walking', desc: 'Sælger småting på gadehjørnet' },
        distributor: { name: 'Distributør', reqLevel: 4, baseCost: 20000, costFactor: 1.3, role: 'seller', target: ['hash_moerk', 'speed', 'mdma'], rate: 4000, salary: 1200, icon: 'fa-truck-fast', desc: 'Leverer til klubber og fester' },
        trafficker: { name: 'Bagmand', reqLevel: 7, baseCost: 150000, costFactor: 1.4, role: 'seller', target: ['coke', 'benzos', 'oxy', 'heroin', 'fentanyl'], rate: 8000, salary: 6000, icon: 'fa-briefcase', desc: 'Styrer salget af de tunge varer' },

        // SUPPORT
        lawyer: { name: 'Advokat', reqLevel: 5, baseCost: 200000, costFactor: 1.4, role: 'reducer', target: 'heat', rate: 0.15, salary: 10000, icon: 'fa-scale-balanced', desc: 'Effektiv. Holder Osten væk.' }
    },
    upgrades: {
        warehouse: { name: 'Boxit-Rum', baseCost: 20000, effect: 'cap', target: 'all', value: 2.0, costFactor: 2.0, icon: 'fa-box', desc: 'Anonym opbevaring på Vestegnen' },
        hydro: { name: 'Gro-Lamper', baseCost: 50000, effect: 'speed', target: 'weed', value: 0.8, icon: 'fa-lightbulb', desc: 'Professionelt lys fra Holland' },
        lab: { name: 'Uni-Lab Setup', baseCost: 100000, effect: 'speed', target: 'amf', value: 0.8, icon: 'fa-flask-vial', desc: 'Stjålet udstyr fra DTU' },
        studio: { name: 'Front-Butik', baseCost: 150000, effect: 'passive', target: 'clean', value: 1.2, icon: 'fa-shop', desc: 'Pizzaria eller Frisør. Kun kontanter.' },
        network: { name: 'EncroChat Mobil', baseCost: 10000, effect: 'passive', target: 'all', value: 1.25, icon: 'fa-mobile-screen', desc: 'Krypteret. Kan ikke spores af Osten.' }
    },
    defense: {
        guards: { name: 'Vagtværn', baseCost: 10000, costFactor: 1.4, defenseVal: 20, desc: 'Lokale rødder med veste' },
        cameras: { name: 'Skygge-Øjne', baseCost: 15000, costFactor: 1.5, defenseVal: 30, desc: 'Droner og kameraer i lygtepæle' },
        bunker: { name: 'Safehouse', baseCost: 500000, costFactor: 1.8, defenseVal: 120, desc: 'Hemmelig kælder under en kiosk' }
    },
    territories: [
        { id: 'christiania', name: 'Staden', baseCost: 50000, income: 5000, type: 'dirty', reqLevel: 2 },
        { id: 'vesterbro', name: 'Halmtorvet', baseCost: 100000, income: 10000, type: 'dirty', reqLevel: 4 },
        { id: 'nørrebro', name: 'Blågårds Plads', baseCost: 150000, income: 15000, type: 'dirty', reqLevel: 6 },
        { id: 'city', name: 'Slotsholmen', baseCost: 300000, income: 30000, type: 'clean', reqLevel: 8 },
        { id: 'hellerup', name: 'Strandvejen', baseCost: 500000, income: 50000, type: 'clean', reqLevel: 10 }
    ],
    payroll: {
        salaryInterval: 300000, // 5 minutes
    },
    crypto: {
        updateInterval: 5000,
        coins: {
            bitcoin: { name: 'Bitcoin', symbol: 'BTC', basePrice: 45000, volatility: 0.05 },
            ethereum: { name: 'Ethereum', symbol: 'ETH', basePrice: 3000, volatility: 0.08 },
            monero: { name: 'Monero', symbol: 'XMR', basePrice: 150, volatility: 0.12 } // Sporløs betaling
        }
    },
    heat: {
        riseRate: 0.5,
        coolRate: 0.1,
        maxSafe: 80,
    },
    boss: {
        triggerLevel: 5,
        maxHp: 500,
        damagePerClick: 10,
        regenRate: 5, // HP per tick
        reward: { xp: 5000, money: 50000 }
    },
    // New Phase 2 Config
    perks: {
        launder_speed: { name: "Offshore Accounts", desc: "+10% Hvidvask Hastighed", baseCost: 1, costScale: 1.5, maxLevel: 10, effect: 'launder', val: 0.1 },
        heat_reduce: { name: "Korrupt Politikreds", desc: "-5% Heat Generering", baseCost: 2, costScale: 2.0, maxLevel: 5, effect: 'heat', val: 0.05 },
        sales_boost: { name: "Markeds Monopol", desc: "+10% Salgs Priser", baseCost: 3, costScale: 1.5, maxLevel: 10, effect: 'sales', val: 0.1 }
    },
    // New Phase 5: Achievements
    achievements: [
        { id: 'first_blood', name: 'Gade Sælger', desc: 'Tjen din første million (1.000.000 kr) i Sorte Penge', req: { type: 'dirty', val: 1000000 }, icon: 'fa-sack-dollar', reward: 'Trophy' },
        { id: 'clean_house', name: 'Hvidvasker', desc: 'Vask 10.000.000 kr totalt', req: { type: 'clean', val: 10000000 }, icon: 'fa-soap', reward: 'Trophy' },
        { id: 'king_of_streets', name: 'Kongen af Gaden', desc: 'Ejer alle 5 territorier', req: { type: 'territory', val: 5 }, icon: 'fa-map-location-dot', reward: 'Title' },
        { id: 'escobar', name: 'Escobar', desc: 'Producér 1.000 kg Kokain', req: { type: 'prod', item: 'coke', val: 1000 }, icon: 'fa-snowflake', reward: 'Trophy' },
        { id: 'untouchable', name: 'Urørlig', desc: 'Nå 0% Heat mens du har 1.000.000 kr i Sorte Penge', req: { type: 'stealth' }, icon: 'fa-user-secret', reward: 'Trophy' },
        { id: 'prestige_one', name: 'New Game+', desc: 'Genstart dit imperium for første gang', req: { type: 'prestige', val: 1 }, icon: 'fa-crown', reward: 'Trophy' },
        { id: 'diamond_hands', name: 'Diamond Hands', desc: 'Ejer 10 Bitcoin', req: { type: 'crypto', coin: 'bitcoin', val: 10 }, icon: 'fa-gem', reward: 'Trophy' }
    ]
};

// Helper to get random slang
export const getProductSlang = (id) => {
    const p = CONFIG.production[id];
    if (!p || !p.aliases || p.aliases.length === 0) return p ? p.name : 'Varen';
    return p.aliases[Math.floor(Math.random() * p.aliases.length)];
};