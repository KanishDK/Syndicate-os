export const GAME_VERSION = '1.1.2 [PLATINUM]';
export const STORAGE_KEY = 'syndicate_os_danish_tycoon_v1';

export const CONFIG = {
    fps: 60,
    autoSaveInterval: 30000,
    levelTitles: ["Løber", "Hustler", "Soldat", "Område-Chef", "Vesterbro-Boss", "Nørrebro-Konge", "Gudfader"],
    initialCash: 2500, // Balanced for Casuals (Balance Sim v1.0)
    initialDirtyCash: 0,
    heat: {
        riseRate: 0.7, // Higher tension (Blågårds Plads feedback)
        coolRate: 0.1,
        decay: 0.1,
        maxSafe: 80
    },
    launderingRate: 0.70, // 30% loss (Realism: Professional fees)
    hardcoreMode: false, // Gamescom Request
    tutorialActive: true, // Times Square Request

    // --- NARRATIVE & PERSONAS ---
    pols: {
        name: 'Sultanen',
        title: 'Information Broker',
        desc: 'Din kontakt fra kiosken på Nørrebrogade. Han styrer Western Union overførslerne, ser alt på overvågningen, og kender alle chaufførerne.',
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

        { msg: "news.weather_gray", type: 'info' },
        { msg: "news.rumor_viagra", type: 'info' },
        { msg: "news.metro_down", type: 'warning' },
        { msg: "news.sultan_shawarma", type: 'success' },
        { msg: "news.mom_call", type: 'info' },
        { msg: "news.influencer_heat", type: 'warning' },
        { msg: "news.rival_tag", type: 'rival' },
        { msg: "news.junkie_buy", type: 'success' },
        { msg: "news.power_outage", type: 'warning' },
        { msg: "news.dog_patrol", type: 'warning' },

        // --- SEASONAL ---
        { msg: "news.season_summer", type: 'success' },
        { msg: "news.season_winter", type: 'success' },
        { msg: "news.season_payday", type: 'success' },
        { msg: "news.season_blue_monday", type: 'warning' },

        // --- TECH & CRYPTO ---
        { msg: "news.tech_silkroad", type: 'rival' },
        { msg: "news.tech_phones", type: 'success' },
        { msg: "news.tech_atm", type: 'warning' },
        { msg: "news.tech_hacker", type: 'info' },

        // --- ACTIONABLE EVENTS ---
        { msg: "news.event_auction", type: 'success', action: { type: 'buy_cheap_equip' } },
        { msg: "news.event_corrupt_cop", type: 'warning', action: { type: 'bribe_police' } },

        // --- MORE FLAVOR ---
        { msg: "news.flavor_accountant", type: 'info' },
        { msg: "news.flavor_quality", type: 'warning' },
        { msg: "news.flavor_rival_guards", type: 'rival' },
        { msg: "news.flavor_sultan_vodka", type: 'success' },
        { msg: "news.flavor_taxi_cash", type: 'success' },
        { msg: "news.flavor_mailbox", type: 'info' },
        { msg: "news.flavor_gov_legal", type: 'info' },
        { msg: "news.flavor_netflix", type: 'info' }
    ],

    // --- POLICE SCANNER CHATTER (10/10 Polish) ---
    policeChatter: [
        "Enhed 4: Vi observerer øget aktivitet omkring Nørrebrogade.",
        "KOC: Alle patruljer, vær opmærksom på mistænkelige varevogne i NV.",
        "Politiradio: 'Operation Hvid Jul' er i gang. Hold øje med vaskehallerne.",
        "Enhed 12: Mistænkelig person set ved Blågårds Plads. Vi rykker ind.",
        "Kommando: Vi har brug for backup ved Istedgade. Massivt salg konstateret.",
        "Scanner: 'Signal 13' bekræftet. De store drenge er ude i dag.",
        "Enhed 7: Vi har mistet visuel kontakt med målet ved Søerne.",
        "Kommando: Husk at tjekke Western Union overførslerne i dag.",
        "Scanner: Der er rapporter om droner over Kødbyen. Er det vores?",
        "Politiradio: Vi har fundet endnu et 'Safehouse'. EOD er på vej."
    ],

    // --- MISSION CHAIN: RISE TO POWER ---
    missions: [
        // PHASE 1: THE HUSTLE (Tutorial)
        { id: 'm1', title: 'Første Levering', req: { type: 'produce', item: 'hash_lys', amount: 5 }, reward: { xp: 100, money: 500 }, giver: 'Sultanen', text: "Velkommen til Gaden, bror. En junkie ved Den Røde Plads mangler skiver. Gå til <b>Produktion</b> og lav 5x Hash. Tjep." },
        { id: 'm2', title: 'Gadeplan', req: { type: 'sell', amount: 5 }, reward: { xp: 150, money: 1000 }, giver: 'Sultanen', text: "Godt. Men varer på lageret betaler ikke huslejen. Sælg lortet for at få Sorte Penge. Pas på varmen (Heat)!" },
        { id: 'm3', title: 'Vaskemaskinen', req: { type: 'launder', amount: 500 }, reward: { xp: 200, money: 0 }, giver: 'Sultanen', text: "Du har Sorte Penge, men du kan ikke købe habitter i Netto for dem. Gå til <b>Finans</b> og vask dem til Ren Kapital." },
        { id: 'm4', title: 'Organisation', req: { type: 'hire', role: 'pusher', amount: 1 }, reward: { xp: 300, money: 2500 }, giver: 'Sultanen', text: "Du ligner en der har travlt. Find en 'Pusher' under <b>Operationer</b> til at sælge for dig, så vi kan fokusere på de store numre." },

        // PHASE 2: SCALING UP
        { id: 'm5', reqLevel: 2, title: 'Kvalitetskontrol', req: { type: 'produce', item: 'hash_moerk', amount: 20 }, reward: { xp: 500, money: 3000 }, giver: 'Sultanen', text: "Kunderne vil have det gode grej. Dyrk noget Skunk. Det er tungere, dyrere og varmere." },
        { id: 'm5b', title: 'Logistik', req: { type: 'upgrade', id: 'warehouse', amount: 1 }, reward: { xp: 600, money: 5000 }, giver: 'Sultanen', text: "Kælderen flyder med papkasser. Køb et <b>Boxit-rum</b> (Opgraderinger), før varerne rådner op." },
        {
            id: 'm6', title: 'Indtag Kødbyen', req: { type: 'conquer', amount: 1 }, reward: { xp: 1200, money: 10000 }, giver: 'Sultanen', text: "Hipsterne i Kødbyen betaler overpris. Hvis du Investerer i et Territorie (Netværk fanen), ejer vi blokken.", choices: [
                { text: "Send drengene (+25 Heat)", effect: { heat: 25 } },
                { text: "Bestik vagterne (-5000 kr)", effect: { money: -5000 } }
            ]
        },

        // PHASE 3: HARD DRUGS
        { id: 'm7', reqLevel: 4, title: 'Det Blå Lyn', req: { type: 'produce', item: 'speed', amount: 50 }, reward: { xp: 2000, money: 15000 }, giver: 'Sultanen', text: "Lastbilchaufførerne på Vestegnen mangler energi. Ansæt en Kemiker og kog noget Speed." },
        { id: 'm8', title: 'Gadekriger', req: { type: 'sell', amount: 500 }, reward: { xp: 3000, money: 25000 }, giver: 'Sultanen', text: "Få skidtet ud på gaden. Jeg vil se lapper i hånden, habibi! Sælg 500 enheder totalt." },
        { id: 'm9', title: 'Nordvest Netværk', req: { type: 'conquer', amount: 2 }, reward: { xp: 4500, money: 40000 }, giver: 'Sultanen', text: "Nordvest er en guldgrube. Invester i flere territorier for at sikre passiv indkomst." },

        // PHASE 4: THE SYNDICATE
        { id: 'm10', reqLevel: 6, title: 'Vagt-Værnet', req: { type: 'defense', id: 'guards', amount: 5 }, reward: { xp: 3500, money: 30000 }, giver: 'Sultanen', text: "Rivalerne kigger med. Ansæt 5 vagter til at beskytte dit hovedkvarter." },
        { id: 'm11', title: 'Hvidvask Kongen', req: { type: 'launder', amount: 100000 }, reward: { xp: 5000, money: 20000 }, giver: 'Sultanen', text: "Vi har for mange beskidte penge. Vask 100.000 kr. for at bevise du kan styre flowet." },
        {
            id: 'm12', reqLevel: 7, title: 'Frihavnen', req: { type: 'hire', role: 'importer', amount: 1 }, reward: { xp: 6000, money: 0 }, giver: 'Sultanen', text: "Glem lokal produktion. Import er fremtiden. Skaf en <b>Smugler</b> til at hente containerne hjem.", choices: [
                { text: "Tag chancen (50% for +50k kr / +20 Heat)", effect: { chance: 0.5, success: { money: 50000 }, fail: { heat: 20 } } },
                { text: "Spil sikkert", effect: {} }
            ]
        },
        { id: 'm13', title: 'Det Hvide Guld', req: { type: 'produce', item: 'coke', amount: 100 }, reward: { xp: 9000, money: 100000 }, giver: 'Sultanen', text: "Sne. Det hvide guld. Overklassen i City skriger på det. Producér 100 enheder." },
        { id: 'm14', title: 'Advokaten', req: { type: 'hire', role: 'lawyer', amount: 1 }, reward: { xp: 20000, money: 0 }, giver: 'Sultanen', text: "Osten er varm. Få fat i en slesk Advokat. En der kan holde Heat nede mens vi vokser." },

        // PHASE 5: KINGPIN
        { id: 'm15', reqLevel: 10, title: 'Nattelivets Konge', req: { type: 'conquer', amount: 4 }, reward: { xp: 35000, money: 600000 }, giver: 'Sultanen', text: "Tag kontrollen over byens natteliv. Vi skal eje 4 store territorier nu." },
        { id: 'm16', title: 'Front-Butikken', req: { type: 'upgrade', id: 'studio', amount: 1 }, reward: { xp: 50000, money: 300000 }, giver: 'Sultanen', text: "Vi har brug for en ægte front. Køb <b>Front-Butik</b> opgraderingen for at gøre din hvidvask mere effektiv." },
        { id: 'm17', title: 'Kartel Status', req: { type: 'produce', item: 'coke', amount: 1000 }, reward: { xp: 75000, money: 1500000 }, giver: 'Sultanen', text: "Vi er ikke længere en bande. Vi er et kartel. Fyld lageret med coke." },

        // PHASE 6: ENDGAME
        { id: 'm18', title: 'Hellerup Kuppet', req: { type: 'conquer', amount: 5 }, reward: { xp: 150000, money: 5000000 }, giver: 'Sultanen', text: "Hellerup. Hvor pengene og magten bor. Køb den endelige investering og vis dem hvem der bestemmer." },
        {
            id: 'm19', title: 'Safehouse', req: { type: 'defense', id: 'bunker', amount: 1 }, reward: { xp: 600000, money: 0 }, giver: 'Sultanen', text: "Rivalerne planlægger noget stort. Byg et <b>Safehouse</b> for at sikre din overlevelse.", choices: [
                { text: "Angrib først (+50 Heat)", effect: { heat: 50 } },
                { text: "Defensiv (Gør intet)", effect: {} }
            ]
        },
        { id: 'm20', title: 'Legenden', req: { type: 'sell', amount: 10000 }, reward: { xp: 2000000, money: 50000000 }, giver: 'Sultanen', text: "Du ejer denne by, bror. Der er ikke mere at vinde... medmindre du vil starte forfra med endnu mere magt?" }
    ],

    // Balancering
    production: {
        heatPenalties: {
            // Threshold : Penalty Multiplier (e.g. 95: 0.2 means 20% efficiency aka -80%)
            critical: { threshold: 95, val: 0.2 },
            high: { threshold: 80, val: 0.5 },
            med: { threshold: 50, val: 0.8 },
            none: { threshold: 0, val: 1.0 }
        },

        hash_lys: { name: "Hash (1g)", baseCost: 15, baseOutput: 1, baseRevenue: 68, costFactor: 1.1, unlockLevel: 1, duration: 1000, icon: "fa-cannabis", color: "yellow", tier: 1, heatGain: 0.02, aliases: ["En pind", "Tjald", "Juletræ", "1-grams pose", "Sjov Tobak"] },
        piller_mild: { name: "Studie-Speed", baseCost: 35, baseOutput: 1, baseRevenue: 113, costFactor: 1.15, unlockLevel: 1, duration: 1500, icon: "fa-pills", color: "blue", tier: 1, heatGain: 0.04, aliases: ["Ritalin", "Eksamens-hjælp", "Kvik-pille", "Fokus"] },
        hash_moerk: { name: "Skunk (1g)", baseCost: 25, baseOutput: 1, baseRevenue: 75, costFactor: 1.2, unlockLevel: 2, duration: 2500, icon: "fa-cubes", color: "amber", tier: 1, heatGain: 0.1, aliases: ["Kvali-røg", "Marok", "Sort Guld", "Sovs", "Krydderi"] },
        speed: { name: "Amfetamin (10g)", baseCost: 750, baseOutput: 1, baseRevenue: 2250, costFactor: 1.25, unlockLevel: 4, duration: 4000, icon: "fa-bolt", color: "white", tier: 2, heatGain: 0.12, aliases: ["Gade-Speed", "Krudt", "Nattelys", "Polsk Champagne"] },
        mdma: { name: "MDMA (10g)", baseCost: 1500, baseOutput: 1, baseRevenue: 4500, costFactor: 1.3, unlockLevel: 5, duration: 6000, icon: "fa-heart", color: "pink", tier: 2, heatGain: 0.15, aliases: ["Emma", "Dannebrog", "Kærlighed", "Krystaller"] },
        keta: { name: "Ketamin (10g)", baseCost: 1500, baseOutput: 1, baseRevenue: 4500, costFactor: 1.35, unlockLevel: 5, duration: 8000, icon: "fa-horse-head", color: "zinc", tier: 2, heatGain: 0.15, aliases: ["Hest", "Special K", "Bedøvelse", "K-Hole Billet"] },
        coke: { name: "Kokain (50g)", baseCost: 20000, baseOutput: 1, baseRevenue: 68000, costFactor: 1.4, unlockLevel: 7, duration: 10000, icon: "fa-snowflake", color: "white", tier: 3, heatGain: 0.5, aliases: ["Coke", "Sne", "Det Hvide", "Casper C-blanding", "VIP Pulver"] },
        benzos: { name: "Benzos (1000p)", baseCost: 15000, baseOutput: 1, baseRevenue: 53000, costFactor: 1.45, unlockLevel: 8, duration: 12000, icon: "fa-prescription-bottle", color: "blue", tier: 3, heatGain: 0.5, aliases: ["Krydser", "Blå", "Sovemedicin", "Grosserer-pakke"] },
        svampe: { name: "Svampe (200g)", baseCost: 15000, baseOutput: 1, baseRevenue: 45000, costFactor: 1.5, unlockLevel: 8, duration: 15000, icon: "fa-frog", color: "purple", tier: 3, heatGain: 0.5, aliases: ["Hatte", "Psykose-snack", "Visuelt", "Naturoplevelse"] },
        oxy: { name: "Oxy (500p)", baseCost: 50000, baseOutput: 1, baseRevenue: 150000, costFactor: 1.6, unlockLevel: 10, duration: 20000, icon: "fa-syringe", color: "teal", tier: 4, heatGain: 0.8, aliases: ["Hillbilly Heroin", "Apoteker-Guld", "Smertestillende", "USA-Import"] },
        heroin: { name: "Heroin (500g)", baseCost: 100000, baseOutput: 1, baseRevenue: 503000, costFactor: 1.8, unlockLevel: 11, duration: 30000, icon: "fa-biohazard", color: "amber", tier: 4, heatGain: 1.0, aliases: ["Brun", "Hest", "Dragen", "Det Brune Punktum"] },
        fentanyl: { name: "Fentanyl (500g)", baseCost: 180000, baseOutput: 1, baseRevenue: 563000, costFactor: 2.0, unlockLevel: 12, duration: 45000, icon: "fa-skull", color: "red", tier: 4, heatGain: 1.5, aliases: ["Døden", "China White", "The End", "Sidste Stop"] }
    },
    staff: {
        grower: { name: 'Grower', reqLevel: 1, baseCost: 15000, costFactor: 1.10, role: 'producer', target: 'hash_moerk', rate: 5000, salary: 400, icon: 'fa-seedling', desc: 'Dyrker både Hash og Skunk', rates: { hash_lys: 1.5, hash_moerk: 0.9 } },
        chemist: { name: 'Kemiker', reqLevel: 4, baseCost: 50000, costFactor: 1.12, role: 'producer', target: 'speed', rate: 10000, salary: 1250, icon: 'fa-flask', desc: 'Koger Speed og andet godt', rates: { speed: 0.6, mdma: 0.45, keta: 0.3 } },
        importer: { name: 'Smugler', reqLevel: 7, baseCost: 100000, costFactor: 1.15, role: 'producer', target: 'coke', rate: 20000, salary: 4000, icon: 'fa-ship', desc: 'Henter varer hjem fra udlandet', rates: { coke: 0.15, benzos: 0.12, svampe: 0.09 } },
        labtech: { name: 'Laborant', reqLevel: 10, baseCost: 200000, costFactor: 1.15, role: 'producer', target: 'fentanyl', rate: 30000, salary: 6000, icon: 'fa-syringe', desc: 'Syntetiserer det helt tunge stads', rates: { fentanyl: 0.06, oxy: 0.09, heroin: 0.075 } },
        junkie: { name: 'Zombie', reqLevel: 1, baseCost: 1000, costFactor: 1.15, role: 'producer', target: ['hash_lys', 'piller_mild'], rate: 1500, salary: 25, icon: 'fa-person-rays', desc: 'Arbejder for fixet. Har ingen fremtid.', survivalRate: 0.999, rates: { hash_lys: 1.0, piller_mild: 0.6 } },
        accountant: { name: 'Revisor', reqLevel: 8, baseCost: 250000, costFactor: 1.12, role: 'reducer', target: 'clean', rate: 0.05, salary: 1000, icon: 'fa-calculator', desc: 'Vasker automatisk sorte penge (5%/sek)' },
        pusher: { name: 'Pusher', reqLevel: 1, baseCost: 1500, costFactor: 1.08, role: 'seller', target: ['hash_lys', 'piller_mild'], salary: 150, icon: 'fa-person-walking', desc: 'Sælger småting på gadehjørnet', rates: { hash_lys: 0.5, piller_mild: 0.5 } },
        distributor: { name: 'Distributør', reqLevel: 4, baseCost: 20000, costFactor: 1.10, role: 'seller', target: ['hash_moerk', 'speed', 'mdma', 'keta'], salary: 600, icon: 'fa-truck-fast', desc: 'Leverer til klubber og fester', rates: { hash_moerk: 0.5, speed: 0.4, mdma: 0.3, keta: 0.25 } },
        trafficker: { name: 'Bagmand', reqLevel: 7, baseCost: 150000, costFactor: 1.12, role: 'seller', target: ['coke', 'benzos', 'oxy', 'heroin', 'fentanyl'], salary: 3000, icon: 'fa-briefcase', desc: 'Styrer salget af de tunge varer', rates: { coke: 0.4, heroin: 0.25, fentanyl: 0.2, default: 0.3 } },
        lawyer: { name: 'Advokat', reqLevel: 5, baseCost: 200000, costFactor: 1.12, role: 'reducer', target: 'heat', rate: 0.15, salary: 5000, icon: 'fa-scale-balanced', desc: 'Effektiv. Holder Osten væk.' }
    },
    upgrades: {
        warehouse: { name: 'Boxit-Rum', baseCost: 20000, effect: 'cap', target: 'all', value: 2.0, costFactor: 2.0, icon: 'fa-box', desc: 'Dobbelt lagerkapacitet.' },
        hydro: { name: 'Gro-Lamper', baseCost: 50000, costFactor: 1.5, effect: 'speed', target: 'weed', value: 0.8, icon: 'fa-lightbulb', desc: '+50% fart på Hash produktion.' },
        lab: { name: 'Uni-Lab Setup', baseCost: 100000, costFactor: 1.5, effect: 'speed', target: 'amf', value: 0.8, icon: 'fa-flask-vial', desc: '+50% fart på Kemisk produktion.' },
        studio: { name: 'Front-Butik', baseCost: 150000, costFactor: 1.5, effect: 'passive', target: 'clean', value: 1.5, icon: 'fa-shop', desc: '+50% Hastighed & +20% Effektivitet.' },
        network: { name: 'EncroChat', baseCost: 10000, costFactor: 1.5, effect: 'passive', target: 'all', value: 1.25, icon: 'fa-mobile-screen', desc: '-25% Heat fra salg via kryptering.' },
        deep_wash: { name: 'Deep-Wash Server', baseCost: 1000000, costFactor: 2.5, effect: 'passive_launder', target: 'clean', value: 1.2, icon: 'fa-server', desc: '+20% Hvidvask-hastighed & passiv vask.' }
    },
    premiumItems: [
        { id: 'time_skip_1', name: 'Tidsmaskine (4t)', type: 'time', duration: 14400, cost: 5, icon: 'fa-forward', desc: 'Spol 4 timer frem i tiden (Kun indtægt).' },
        { id: 'hype_boost_1', name: 'Influencer Pack', type: 'buff', buff: 'hype', duration: 300000, cost: 10, icon: 'fa-bullhorn', desc: '+100% Salgspriser (Hype) i 5 minutter.' },
        { id: 'heat_clear', name: 'Bestikkelse', type: 'instant', effect: 'heat_0', cost: 15, icon: 'fa-snowflake', desc: 'Fjern alt Heat øjeblikkeligt.' },
        { id: 'diamond_pack_s', name: 'Starter Pack', type: 'currency', value: 50000, cost: 20, icon: 'fa-sack-dollar', desc: 'Få 50.000 kr i Rene Penge.' }
    ],
    defense: {
        guards: { name: 'Vagtværn', baseCost: 10000, costFactor: 1.4, defenseVal: 20, desc: 'Lokale rødder med veste' },
        cameras: { name: 'Skygge-Øjne', baseCost: 15000, costFactor: 1.5, defenseVal: 30, desc: 'Droner og kameraer i lygtepæle' },
        bunker: { name: 'Safehouse', baseCost: 500000, costFactor: 1.8, defenseVal: 120, desc: 'Hemmelig kælder under en kiosk' }
    },
    districts: {
        nørrebro: {
            id: 'nørrebro',
            name: 'Nørrebro Master',
            bonus: '-20% Speed Cost',
            req: ['christiania', 'nørrebro', 'nordvest'],
            effect: { type: 'cost', target: 'speed', value: 0.8 }
        },
        city: {
            id: 'city',
            name: 'City Shark',
            bonus: '-15% Bribe Cost',
            req: ['vesterbro', 'city', 'frederiksberg'],
            effect: { type: 'bribe_cost', value: 0.85 }
        },
        vestegnen: {
            id: 'vestegnen',
            name: 'Vestegnen King',
            bonus: '+15% Production Speed',
            req: ['vestegnen', 'glostrup', 'ishøj'],
            effect: { type: 'global_speed', value: 0.85 }
        }
    },
    territories: [
        // NØRREBRO DISTRICT (REBALANCED: -60% cost, +400% income)
        { id: 'christiania', name: 'Staden', district: 'nørrebro', baseCost: 20000, income: 25000, type: 'dirty', reqLevel: 2 },
        { id: 'nørrebro', name: 'Blågårds Plads', district: 'nørrebro', baseCost: 60000, income: 75000, type: 'dirty', reqLevel: 6 },
        { id: 'nordvest', name: 'Møntmestervej', district: 'nørrebro', baseCost: 30000, income: 37500, type: 'dirty', reqLevel: 3 },

        // CITY DISTRICT (REBALANCED: -60% cost, +400% income)
        { id: 'vesterbro', name: 'Halmtorvet', district: 'city', baseCost: 40000, income: 50000, type: 'dirty', reqLevel: 4 },
        { id: 'city', name: 'Slotsholmen', district: 'city', baseCost: 120000, income: 150000, type: 'clean', reqLevel: 8 },
        { id: 'frederiksberg', name: 'Gammel Kongevej', district: 'city', baseCost: 80000, income: 100000, type: 'clean', reqLevel: 7 },

        // VESTEGNEN DISTRICT (REBALANCED: -60% cost, +400% income)
        { id: 'vestegnen', name: 'Brøndby Strand', district: 'vestegnen', baseCost: 160000, income: 225000, type: 'dirty', reqLevel: 9 },
        { id: 'glostrup', name: 'Glostrup Center', district: 'vestegnen', baseCost: 180000, income: 250000, type: 'clean', reqLevel: 10 },
        { id: 'ishøj', name: 'Ishøj Station', district: 'vestegnen', baseCost: 240000, income: 325000, type: 'dirty', reqLevel: 11 },

        // ELITE (REBALANCED: -60% cost, +400% income)
        { id: 'hellerup', name: 'Strandvejen', district: 'elite', baseCost: 400000, income: 500000, type: 'clean', reqLevel: 12 }
    ],
    luxuryItems: [
        { id: 'penthouse', name: 'Luksus Penthouse (Cph K)', cost: 5000000, icon: 'fa-building-columns', desc: 'Indbegrebet af succes. Giver massiv respekt på gaden.', buff: 'rep_boost' },
        { id: 'yacht', name: 'Super Yacht (Frihavnen)', cost: 25000000, icon: 'fa-ship', desc: 'Din egen flydende fæstning. Perfekt til hvidvask-fester.', buff: 'launder_eff' },
        { id: 'jet', name: 'Gulfstream G650 (Kastrup)', cost: 100000000, icon: 'fa-plane-departure', desc: 'Flyv under radaren. Reducerer passiv heat generation.', buff: 'heat_floor' },
        { id: 'ghostmode', name: 'Ghost Protocol System', cost: 250000000, icon: 'fa-user-secret', desc: 'Avanceret anti-overvågning. Aktivér for 10 min heat immunity (1t cooldown).', buff: 'ghost_mode' },
        { id: 'island', name: 'Privat Ø (Caribien)', cost: 500000000, icon: 'fa-island-tropical', desc: 'Det ultimative end-game. Du er nu untouchable.', buff: 'win_condition' }
    ],

    gameMechanics: {
        maxCash: 1e15,
        maxHeat: 500
    },
    leveling: {
        baseXp: 1000,
        expFactor: 1.8
    },
    payroll: {
        salaryInterval: 300000, // 5 minutes
        emergencyMarkup: 1.5
    },
    market: {
        multipliers: { bull: 1.3, bear: 0.7 },
        duration: { min: 30, range: 60 }
    },
    prestige: {
        threshold: 10000000,
        formula: {
            base: 2.5,
            scale: 15,
            divisor: 10,
            logBase: 5000
        }
    },
    rivals: {
        sabotageCost: 25000,
        raidChance: 0.6
    },
    police: {
        bribeCost: 50000
    },
    marketing: {
        hypeCost: 25000
    },
    events: {
        heatWarnings: { critical: 90, high: 70, low: 65 }
    },
    raid: {
        penalties: { high: 0.6, med: 0.25, low: 0.1 }
    },
    economy: {
        heatMultiplier: 0.001
    },
    crypto: {
        updateInterval: 5000,
        eventChance: 0.1, // 10% per second * dt
        coins: {
            bitcoin: { name: 'Bitcoin', symbol: 'BTC', basePrice: 45000, volatility: 0.05 },
            ethereum: { name: 'Ethereum', symbol: 'ETH', basePrice: 3000, volatility: 0.08 },
            monero: { name: 'Monero', symbol: 'XMR', basePrice: 150, volatility: 0.12 }
        },
        bank: {
            interestRate: 0.005, // 0.5% per 5min = 144%/day (balanced from 576%/day)
            interestInterval: 300000, // 5 minutes
            interestInterval: 300000, // 5 minutes
            maxSavingsFactor: 500000 // Max savings per level (e.g. Lev 10 = 5M cap)
        },
        manualWashPower: 100, // Amount cleaned per click
        marketInfluenceCost: 50000 // Cost to fix the market
    },
    boss: {
        triggerLevel: 5,
        maxHp: 500,
        damagePerClick: 10,
        regenRate: 5, // HP per tick
        reward: { xp: 5000, money: 50000 },
        combat: {
            critChance: 0.1,
            critMult: 2.0,
            defenseSynergy: 0.1, // 10% of defense scaling
            bossDefScale: 0.5, // Boss defense per level
            enrageThreshold: 0.25,
            attackInterval: 2000,
            enragedInterval: 1000,
            cashLossRatio: 0.1,
            speedBonusTime: 30000,
            speedBonusMult: 1.5
        }
    },
    perks: {
        heat_reduce: { name: "Politikreds", desc: "-5% Heat Generering", baseCost: 10, costScale: 1.5, maxLevel: 10, effect: 'heat', val: 0.05, category: 'aggressive' },
        raid_defense: { name: "Sikkerhedschat", desc: "+10% Raid Forsvar", baseCost: 15, costScale: 1.5, maxLevel: 5, effect: 'defense', val: 0.1, category: 'aggressive' },
        boss_dmg: { name: "Gadekriger", desc: "+10 Boss Damage", baseCost: 20, costScale: 1.5, maxLevel: 10, effect: 'boss_dmg', val: 10, category: 'aggressive' },
        rival_smash: { name: "Bandekrig", desc: "Lavere Rival Omkostninger", baseCost: 25, costScale: 1.5, maxLevel: 5, effect: 'rival_cost', val: 0.2, category: 'aggressive' },

        launder_speed: { name: "Offshore", desc: "+10% Vaskehastighed", baseCost: 10, costScale: 1.5, maxLevel: 10, effect: 'launder', val: 0.1, category: 'greedy' },
        sales_boost: { name: "Markedsmagt", desc: "+10% Salgspriser", baseCost: 15, costScale: 1.5, maxLevel: 10, effect: 'sales', val: 0.1, category: 'greedy' },
        prod_speed: { name: "Optimeret Lab", desc: "+10% Prod. Hastighed", baseCost: 20, costScale: 1.5, maxLevel: 10, effect: 'prod_speed', val: 0.1, category: 'greedy' },
        xp_boost: { name: "Gade-Respekt", desc: "+20% XP Bonus", baseCost: 25, costScale: 1.5, maxLevel: 5, effect: 'xp', val: 0.2, category: 'greedy' },

        // FORBIDDEN BRANCH (Phase 11)
        shadow_network: { name: "Skygge Netværk", desc: "-10% Heat Generering", baseCost: 50, costScale: 1.6, maxLevel: 5, effect: 'heat_gen', val: 0.1, category: 'forbidden' },
        laundering_mastery: { name: "Hvidvask Ekspert", desc: "+5% Effektivitet", baseCost: 60, costScale: 1.6, maxLevel: 5, effect: 'launder_eff', val: 0.05, category: 'forbidden' },
        politician: { name: "Lokalpolitiker", desc: "Passiv Ren Indkomst", baseCost: 75, costScale: 1.7, maxLevel: 5, effect: 'passive_income', val: 5000, category: 'forbidden' },
        rival_insider: { name: "Insider Viden", desc: "Se Angrebs Timer", baseCost: 100, costScale: 2.0, maxLevel: 1, effect: 'intel', val: 1, category: 'forbidden' },
        offshore_accounts: { name: "Offshore Konto", desc: "Behold % Cash ved Reset", baseCost: 150, costScale: 2.0, maxLevel: 5, effect: 'retention', val: 0.05, category: 'forbidden' }
    },
    masteryPerks: {
        titan_prod: { name: "Titan Production", desc: "+15% Global Speed", cost: 50, icon: "fa-industry", effect: "prod_speed", val: 0.15 },
        market_monopoly: { name: "Market Monopoly", desc: "+15% Sales Margin", cost: 100, icon: "fa-store-slash", effect: "sales_boost", val: 0.15 },
        ghost_ops: { name: "Ghost Operations", desc: "+35% Heat Decay", cost: 75, icon: "fa-user-ghost", effect: "heat_decay", val: 0.35 },
        diamond_network: { name: "Diamond Network", desc: "Double Sultan XP", cost: 150, icon: "fa-network-wired", effect: "xp_boost", val: 1.0 }
    },
    achievements: [
        { id: 'first_blood', name: 'Gade Sælger', desc: 'Tjen din første million (1.000.000 kr) i Sorte Penge', req: { type: 'dirty', val: 1000000 }, icon: 'fa-sack-dollar', reward: 5 },
        { id: 'clean_house', name: 'Hvidvasker', desc: 'Vask 10.000.000 kr totalt gennem dine systemer', req: { type: 'clean', val: 10000000 }, icon: 'fa-soap', reward: 25 },
        { id: 'king_of_streets', name: 'Kongen af Gaden', desc: 'Ejer alle 5 territorier i København samtidigt', req: { type: 'territory', val: 5 }, icon: 'fa-map-location-dot', reward: 50 },
        { id: 'escobar', name: 'Escobar', desc: 'Producér 1.000 enheder Kokain i din karríere', req: { type: 'prod', item: 'coke', val: 1000 }, icon: 'fa-snowflake', reward: 100 },
        { id: 'untouchable', name: 'Urørlig', desc: 'Nå 0% Heat mens du har 1.000.000 kr i Sorte Penge', req: { type: 'stealth' }, icon: 'fa-user-secret', reward: 50 },
        { id: 'prestige_one', name: 'Exit Scam', desc: 'Genstart dit imperium for første gang', req: { type: 'prestige', val: 1 }, icon: 'fa-crown', reward: 150 },
        { id: 'diamond_hands', name: 'Diamond Hands', desc: 'Ejer mindst 10 Bitcoin i din krypto-wallet', req: { type: 'crypto', coin: 'bitcoin', val: 10 }, icon: 'fa-gem', reward: 200 },
        // SECRETS
        { id: 'clean_hands', name: 'Rene Hænder', desc: 'Hav 1.000.000 kr i Rene Penge og 0 kr i Sorte Penge samtidigt', req: { type: 'clean_streak', val: 1000000 }, icon: 'fa-hands-bubbles', reward: 300, secret: true },
        { id: 'hoarder', name: 'Lagerforvalter', desc: 'Fyld dit lager med mindst 500 enheder varer', req: { type: 'inventory', val: 500 }, icon: 'fa-boxes-stacked', reward: 100, secret: true },
        { id: 'veteran', name: 'Gade-Veteran', desc: 'Hav været aktiv i gamet i mindst 10 timer totalt', req: { type: 'time', val: 600 }, icon: 'fa-clock', reward: 500, secret: true }
    ]
};

// Helper to get random slang
export const getProductSlang = (id) => {
    const p = CONFIG.production[id];
    if (!p || !p.aliases || p.aliases.length === 0) return p ? p.name : 'Varen';
    return p.aliases[Math.floor(Math.random() * p.aliases.length)];
};