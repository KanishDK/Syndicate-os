export const GAME_VERSION = '1.1.1 [PLATINUM]';
export const STORAGE_KEY = 'syndicate_os_danish_tycoon_v1';

export const CONFIG = {
    fps: 60,
    autoSaveInterval: 30000,
    levelTitles: ["Gade Soldat", "Hustler", "Løjtnant", "Boss", "Kingpin", "Don", "Gudfader"],
    initialCash: 2500, // Harder start (Realism: Small dealer buy-in)
    initialDirtyCash: 0,
    heat: {
        riseRate: 0.5,
        coolRate: 0.1,
        decay: 0.1,
        maxSafe: 80
    },
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

        // --- ACTIONABLE EVENTS ---
        { msg: "POLITI AUKTION: Lagerudstyr sælges billigt (5.000kr). Klik her!", type: 'success', action: { type: 'buy_cheap_equip' } },
        { msg: "KORRUPT BETJENT: 'Jeg sletter dine sager for 10.000kr'. Klik her.", type: 'warning', action: { type: 'bribe_police' } },

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
        { id: 'm1', title: 'Første Levering', req: { type: 'produce', item: 'hash_lys', amount: 5 }, reward: { xp: 100, money: 500 }, giver: 'Sultanen', text: "Velkommen til Gaden, bror. En junkie ved Den Røde Plads mangler skiver. Gå til <b>Produktion</b> og lav 5x Hash. Tjep." },
        { id: 'm2', title: 'Gadeplan', req: { type: 'sell', amount: 5 }, reward: { xp: 150, money: 1000 }, giver: 'Sultanen', text: "Godt. Men varer på lageret betaler ikke huslejen. Sælg lortet for at få Sorte Penge. Pas på varmen (Heat)!" },
        { id: 'm3', title: 'Vaskemaskinen', req: { type: 'launder', amount: 500 }, reward: { xp: 200, money: 0 }, giver: 'Sultanen', text: "Du har Sorte Penge, men du kan ikke købe habitter i Netto for dem. Gå til <b>Finans</b> og vask dem til Ren Kapital." },
        { id: 'm4', title: 'Organisation', req: { type: 'hire', role: 'pusher', amount: 1 }, reward: { xp: 300, money: 2500 }, giver: 'Sultanen', text: "Du ligner en der har travlt. Find en 'Pusher' under <b>Operationer</b> til at sælge for dig, så vi kan fokusere på de store numre." },

        // PHASE 2: SCALING UP
        { id: 'm5', reqLevel: 2, title: 'Kvalitetskontrol', req: { type: 'produce', item: 'hash_moerk', amount: 20 }, reward: { xp: 500, money: 3000 }, giver: 'Sultanen', text: "Kunderne vil have det gode grej. Dyrk noget Skunk. Det er tungere, dyrere og varmere." },
        { id: 'm5b', title: 'Logistik', req: { type: 'upgrade', id: 'warehouse' }, reward: { xp: 600, money: 5000 }, giver: 'Sultanen', text: "Kælderen flyder med papkasser. Køb et <b>Boxit-rum</b> (Opgraderinger), før varerne rådner op." },
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
        { id: 'm16', title: 'Front-Butikken', req: { type: 'upgrade', id: 'studio' }, reward: { xp: 50000, money: 300000 }, giver: 'Sultanen', text: "Vi har brug for en ægte front. Køb <b>Front-Butik</b> opgraderingen for at gøre din hvidvask mere effektiv." },
        { id: 'm17', title: 'Kartel Status', req: { type: 'produce', item: 'coke', amount: 1000 }, reward: { xp: 75000, money: 1500000 }, giver: 'Sultanen', text: "Vi er ikke længere en bande. Vi er et kartel. Fyld lageret med coke." },

        // PHASE 6: ENDGAME
        { id: 'm18', title: 'Hellerup Kuppet', req: { type: 'conquer', amount: 5 }, reward: { xp: 150000, money: 5000000 }, giver: 'Sultanen', text: "Hellerup. Hvor pengene og magten bor. Køb den endelige investering og vis dem hvem der bestemmer." },
        {
            id: 'm19', title: 'Safehouse', req: { type: 'defense', id: 'bunker' }, reward: { xp: 600000, money: 0 }, giver: 'Sultanen', text: "Rivalerne planlægger noget stort. Byg et <b>Safehouse</b> for at sikre din overlevelse.", choices: [
                { text: "Angrib først (+50 Heat)", effect: { heat: 50 } },
                { text: "Defensiv (Gør intet)", effect: {} }
            ]
        },
        { id: 'm20', title: 'Legenden', req: { type: 'sell', amount: 10000 }, reward: { xp: 2000000, money: 50000000 }, giver: 'Sultanen', text: "Du ejer denne by, bror. Der er ikke mere at vinde... medmindre du vil starte forfra med endnu mere magt?" }
    ],

    // Balancering
    production: {
        hash_lys: { name: "Hash (1g)", baseCost: 15, baseOutput: 1, baseRevenue: 35, costFactor: 1.1, unlockLevel: 1, duration: 1000, icon: "fa-cannabis", color: "yellow", tier: 1, heatGain: 0.02, aliases: ["En pind", "Tjald", "Juletræ", "1-grams pose", "Sjov Tobak"] },
        piller_mild: { name: "Studie-Speed", baseCost: 35, baseOutput: 1, baseRevenue: 75, costFactor: 1.15, unlockLevel: 1, duration: 1500, icon: "fa-pills", color: "blue", tier: 1, heatGain: 0.04, aliases: ["Ritalin", "Eksamens-hjælp", "Kvik-pille", "Fokus"] },
        hash_moerk: { name: "Skunk (1g)", baseCost: 25, baseOutput: 1, baseRevenue: 50, costFactor: 1.2, unlockLevel: 2, duration: 2500, icon: "fa-cubes", color: "amber", tier: 1, heatGain: 0.1, aliases: ["Kvali-røg", "Marok", "Sort Guld", "Sovs", "Krydderi"] },
        speed: { name: "Amfetamin (10g)", baseCost: 750, baseOutput: 1, baseRevenue: 1500, costFactor: 1.25, unlockLevel: 4, duration: 4000, icon: "fa-bolt", color: "white", tier: 2, heatGain: 0.12, aliases: ["Gade-Speed", "Krudt", "Nattelys", "Polsk Champagne"] },
        mdma: { name: "MDMA (10g)", baseCost: 1500, baseOutput: 1, baseRevenue: 3000, costFactor: 1.3, unlockLevel: 5, duration: 6000, icon: "fa-heart", color: "pink", tier: 2, heatGain: 0.15, aliases: ["Emma", "Dannebrog", "Kærlighed", "Krystaller"] },
        keta: { name: "Ketamin (10g)", baseCost: 1500, baseOutput: 1, baseRevenue: 3000, costFactor: 1.35, unlockLevel: 5, duration: 8000, icon: "fa-horse-head", color: "zinc", tier: 2, heatGain: 0.15, aliases: ["Hest", "Special K", "Bedøvelse", "K-Hole Billet"] },
        coke: { name: "Kokain (50g)", baseCost: 15000, baseOutput: 1, baseRevenue: 32500, costFactor: 1.4, unlockLevel: 7, duration: 10000, icon: "fa-snowflake", color: "white", tier: 3, heatGain: 0.5, aliases: ["Coke", "Sne", "Det Hvide", "Casper C-blanding", "VIP Pulver"] },
        benzos: { name: "Benzos (1000p)", baseCost: 15000, baseOutput: 1, baseRevenue: 35000, costFactor: 1.45, unlockLevel: 8, duration: 12000, icon: "fa-prescription-bottle", color: "blue", tier: 3, heatGain: 0.5, aliases: ["Krydser", "Blå", "Sovemedicin", "Grosserer-pakke"] },
        svampe: { name: "Svampe (200g)", baseCost: 15000, baseOutput: 1, baseRevenue: 30000, costFactor: 1.5, unlockLevel: 8, duration: 15000, icon: "fa-frog", color: "purple", tier: 3, heatGain: 0.5, aliases: ["Hatte", "Psykose-snack", "Visuelt", "Naturoplevelse"] },
        oxy: { name: "Oxy (500p)", baseCost: 50000, baseOutput: 1, baseRevenue: 100000, costFactor: 1.6, unlockLevel: 10, duration: 20000, icon: "fa-syringe", color: "teal", tier: 4, heatGain: 0.8, aliases: ["Hillbilly Heroin", "Apoteker-Guld", "Smertestillende", "USA-Import"] },
        heroin: { name: "Heroin (500g)", baseCost: 100000, baseOutput: 1, baseRevenue: 335000, costFactor: 1.8, unlockLevel: 11, duration: 30000, icon: "fa-biohazard", color: "amber", tier: 4, heatGain: 1.0, aliases: ["Brun", "Hest", "Dragen", "Det Brune Punktum"] },
        fentanyl: { name: "Fentanyl (500g)", baseCost: 180000, baseOutput: 1, baseRevenue: 375000, costFactor: 2.0, unlockLevel: 12, duration: 45000, icon: "fa-skull", color: "red", tier: 4, heatGain: 1.5, aliases: ["Døden", "China White", "The End", "Sidste Stop"] }
    },
    staff: {
        grower: { name: 'Gartner', reqLevel: 1, baseCost: 15000, costFactor: 1.3, role: 'producer', target: 'hash_moerk', rate: 5000, salary: 800, icon: 'fa-seedling', desc: 'Dyrker både Hash og Skunk', rates: { hash_lys: 0.5, hash_moerk: 0.3 } },
        chemist: { name: 'Kemiker', reqLevel: 4, baseCost: 50000, costFactor: 1.4, role: 'producer', target: 'speed', rate: 10000, salary: 2500, icon: 'fa-flask', desc: 'Koger Speed og andet godt', rates: { speed: 0.2, mdma: 0.15, keta: 0.1 } },
        importer: { name: 'Smugler', reqLevel: 7, baseCost: 100000, costFactor: 1.5, role: 'producer', target: 'coke', rate: 20000, salary: 8000, icon: 'fa-ship', desc: 'Henter varer hjem fra udlandet', rates: { coke: 0.05, benzos: 0.04, svampe: 0.03 } },
        labtech: { name: 'Laborant', reqLevel: 10, baseCost: 200000, costFactor: 1.6, role: 'producer', target: 'fentanyl', rate: 30000, salary: 12000, icon: 'fa-syringe', desc: 'Syntetiserer det helt tunge stads', rates: { fentanyl: 0.02, oxy: 0.03, heroin: 0.025 } },
        junkie: { name: 'Zombie', reqLevel: 1, baseCost: 1000, costFactor: 1.5, role: 'producer', target: ['hash_lys', 'piller_mild'], rate: 1500, salary: 150, icon: 'fa-person-rays', desc: 'Arbejder for fixet. Har ingen fremtid.', rates: { hash_lys: 0.3, piller_mild: 0.15 } },
        accountant: { name: 'Revisor', reqLevel: 8, baseCost: 250000, costFactor: 1.6, role: 'reducer', target: 'clean', rate: 0.05, salary: 2000, icon: 'fa-calculator', desc: 'Vasker automatisk sorte penge (5%/sek)' },
        pusher: { name: 'Pusher', reqLevel: 1, baseCost: 5000, costFactor: 1.2, role: 'seller', target: ['hash_lys', 'piller_mild'], salary: 300, icon: 'fa-person-walking', desc: 'Sælger småting på gadehjørnet', rates: { hash_lys: 0.5, piller_mild: 0.5 } },
        distributor: { name: 'Distributør', reqLevel: 4, baseCost: 20000, costFactor: 1.3, role: 'seller', target: ['hash_moerk', 'speed', 'mdma', 'keta'], salary: 1200, icon: 'fa-truck-fast', desc: 'Leverer til klubber og fester', rates: { hash_moerk: 0.5, speed: 0.4, mdma: 0.3, keta: 0.25 } },
        trafficker: { name: 'Bagmand', reqLevel: 7, baseCost: 150000, costFactor: 1.4, role: 'seller', target: ['coke', 'benzos', 'oxy', 'heroin', 'fentanyl'], salary: 6000, icon: 'fa-briefcase', desc: 'Styrer salget af de tunge varer', rates: { coke: 0.4, heroin: 0.25, fentanyl: 0.2, default: 0.3 } },
        lawyer: { name: 'Advokat', reqLevel: 5, baseCost: 200000, costFactor: 1.4, role: 'reducer', target: 'heat', rate: 0.15, salary: 10000, icon: 'fa-scale-balanced', desc: 'Effektiv. Holder Osten væk.' }
    },
    upgrades: {
        warehouse: { name: 'Boxit-Rum', baseCost: 20000, effect: 'cap', target: 'all', value: 2.0, costFactor: 2.0, icon: 'fa-box', desc: 'Dobbelt lagerkapacitet.' },
        hydro: { name: 'Gro-Lamper', baseCost: 50000, costFactor: 1.5, effect: 'speed', target: 'weed', value: 0.8, icon: 'fa-lightbulb', desc: '+50% fart på Hash produktion.' },
        lab: { name: 'Uni-Lab Setup', baseCost: 100000, costFactor: 1.5, effect: 'speed', target: 'amf', value: 0.8, icon: 'fa-flask-vial', desc: '+50% fart på Kemisk produktion.' },
        studio: { name: 'Front-Butik', baseCost: 150000, costFactor: 1.5, effect: 'passive', target: 'clean', value: 1.5, icon: 'fa-shop', desc: '+50% Hastighed & +20% Effektivitet.' },
        network: { name: 'EncroChat', baseCost: 10000, costFactor: 1.5, effect: 'passive', target: 'all', value: 1.25, icon: 'fa-mobile-screen', desc: '-25% Heat fra salg via kryptering.' }
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
            monero: { name: 'Monero', symbol: 'XMR', basePrice: 150, volatility: 0.12 }
        }
    },
    boss: {
        triggerLevel: 5,
        maxHp: 500,
        damagePerClick: 10,
        regenRate: 5, // HP per tick
        reward: { xp: 5000, money: 50000 }
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
    achievements: [
        { id: 'first_blood', name: 'Gade Sælger', desc: 'Tjen din første million (1.000.000 kr) i Sorte Penge', req: { type: 'dirty', val: 1000000 }, icon: 'fa-sack-dollar', reward: 'Trophy' },
        { id: 'clean_house', name: 'Hvidvasker', desc: 'Vask 10.000.000 kr totalt gennem dine systemer', req: { type: 'clean', val: 10000000 }, icon: 'fa-soap', reward: 'Trophy' },
        { id: 'king_of_streets', name: 'Kongen af Gaden', desc: 'Ejer alle 5 territorier i København samtidigt', req: { type: 'territory', val: 5 }, icon: 'fa-map-location-dot', reward: 'Title' },
        { id: 'escobar', name: 'Escobar', desc: 'Producér 1.000 enheder Kokain i din karríere', req: { type: 'prod', item: 'coke', val: 1000 }, icon: 'fa-snowflake', reward: 'Trophy' },
        { id: 'untouchable', name: 'Urørlig', desc: 'Nå 0% Heat mens du har 1.000.000 kr i Sorte Penge', req: { type: 'stealth' }, icon: 'fa-user-secret', reward: 'Trophy' },
        { id: 'prestige_one', name: 'Exit Scam', desc: 'Genstart dit imperium for første gang', req: { type: 'prestige', val: 1 }, icon: 'fa-crown', reward: 'Trophy' },
        { id: 'diamond_hands', name: 'Diamond Hands', desc: 'Ejer mindst 10 Bitcoin i din krypto-wallet', req: { type: 'crypto', coin: 'bitcoin', val: 10 }, icon: 'fa-gem', reward: 'Trophy' },
        // SECRETS
        { id: 'clean_hands', name: 'Rene Hænder', desc: 'Hav 1.000.000 kr i Rene Penge og 0 kr i Sorte Penge samtidigt', req: { type: 'clean_streak', val: 1000000 }, icon: 'fa-hands-bubbles', reward: 'Trophy', secret: true },
        { id: 'hoarder', name: 'Lagerforvalter', desc: 'Fyld dit lager med mindst 500 enheder varer', req: { type: 'inventory', val: 500 }, icon: 'fa-boxes-stacked', reward: 'Trophy', secret: true },
        { id: 'veteran', name: 'Gade-Veteran', desc: 'Hav været aktiv i gamet i mindst 10 timer totalt', req: { type: 'time', val: 600 }, icon: 'fa-clock', reward: 'Trophy', secret: true }
    ]
};

// Helper to get random slang
export const getProductSlang = (id) => {
    const p = CONFIG.production[id];
    if (!p || !p.aliases || p.aliases.length === 0) return p ? p.name : 'Varen';
    return p.aliases[Math.floor(Math.random() * p.aliases.length)];
};