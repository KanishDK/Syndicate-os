export const GAME_VERSION = typeof __APP_VERSION__ !== 'undefined' ? `${__APP_VERSION__} [STABLE]` : '1.1.17 [LOCAL]';
export const STORAGE_KEY = 'syndicate_os_danish_tycoon_v1';

export const CONFIG = {
    fps: 60,
    autoSaveInterval: 30000,
    levelTitles: ["Løber", "Hustler", "Soldat", "Område-Chef", "Vesterbro-Boss", "Nørrebro-Konge", "Gudfader"],
    initialCash: 5000, // Turbo Mode: Buffer for OpEx (Prevent Deadlock)
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
        { msg: "news.impact_distortion", type: 'success' },
        { msg: "news.impact_roskilde", type: 'success' },
        { msg: "news.impact_christmas", type: 'success' },
        { msg: "news.impact_christiania_raid", type: 'warning' },
        { msg: "news.impact_border", type: 'warning' },
        { msg: "news.impact_police", type: 'warning' },
        { msg: "news.impact_drought", type: 'warning' },
        { msg: "news.impact_crypto_crash", type: 'rival' },
        { msg: "news.impact_eth_surge", type: 'rival' },

        // --- LOCAL FLAVOR (NØRREBRO/WESTEND) ---
        { msg: "news.local_nurrebro", type: 'rival' },
        { msg: "news.local_vesterbro", type: 'success' },
        { msg: "news.local_northwest", type: 'info' },
        { msg: "news.local_amager", type: 'rival' },
        { msg: "news.local_sydhavnen", type: 'success' },
        { msg: "news.local_christiania", type: 'success' },
        { msg: "news.local_istedgade", type: 'warning' },
        { msg: "news.local_outskirts", type: 'info' },

        // --- ABSURD/SATIRICAL ---
        { msg: "news.absurd_market", type: 'success' },
        { msg: "news.absurd_wanted", type: 'rival' },
        { msg: "news.absurd_radar", type: 'warning' },
        { msg: "news.absurd_suspicious", type: 'info' },
        { msg: "news.absurd_lawyer", type: 'info' },
        { msg: "news.absurd_eth_dump", type: 'rival' },
        { msg: "news.absurd_xmr_dump", type: 'rival' },
        { msg: "news.absurd_btc_surge", type: 'info' },
        { msg: "news.absurd_btc_stable", type: 'info' },
        { msg: "news.absurd_system", type: 'success' },
        { msg: "news.absurd_maintenance", type: 'warning' },
        { msg: "news.absurd_mayor", type: 'warning' },
        { msg: "news.absurd_weather", type: 'success' },

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
        { id: 'm1', title: 'First Delivery', titleKey: 'missions.m1.title', textKey: 'missions.m1.text', req: { type: 'produce', item: 'hash', amount: 25 }, reward: { xp: 100, money: 500 }, giver: 'The Sultan', text: "Welcome to the streets, brother. A junkie at Den Røde Plads needs hash. Go to <b>Production</b> and make 25x Hash. Easy money." },
        { id: 'm2', title: 'Street Plan', titleKey: 'missions.m2.title', textKey: 'missions.m2.text', req: { type: 'sell', amount: 25 }, reward: { xp: 150, money: 1000 }, giver: 'The Sultan', text: "Good. But goods in storage don't pay rent. Sell that shit to get Dirty Money. Watch the heat!" },
        { id: 'm3', title: 'The Washing Machine', titleKey: 'missions.m3.title', textKey: 'missions.m3.text', req: { type: 'launder', amount: 500 }, reward: { xp: 200, money: 0 }, giver: 'The Sultan', text: "You have Dirty Money, but you can't buy groceries with it. Go to <b>Finance</b> and launder it into Clean Capital." },
        { id: 'm4', title: 'Organization', titleKey: 'missions.m4.title', textKey: 'missions.m4.text', req: { type: 'hire', role: 'pusher', amount: 1 }, reward: { xp: 300, money: 2500 }, giver: 'The Sultan', text: "You look busy. Get a 'Pusher' from <b>Operations</b> to sell for you, so we can focus on the big numbers." },

        // PHASE 2: SCALING UP
        { id: 'm5', reqLevel: 2, title: 'Quality Control', titleKey: 'missions.m5.title', textKey: 'missions.m5.text', req: { type: 'produce', item: 'skunk', amount: 20 }, reward: { xp: 500, money: 3000 }, giver: 'The Sultan', text: "Customers want the good stuff. Grow some Skunk. It's heavier, pricier, and hotter." },
        { id: 'm5b', title: 'Logistics', titleKey: 'missions.m5b.title', textKey: 'missions.m5b.text', req: { type: 'upgrade', id: 'warehouse', amount: 1 }, reward: { xp: 600, money: 5000 }, giver: 'The Sultan', text: "The basement is overflowing with cardboard boxes. Buy a <b>Storage Unit</b> (Upgrades) before the goods rot." },
        {
            id: 'm6', title: 'Take Kødbyen', titleKey: 'missions.m6.title', textKey: 'missions.m6.text', req: { type: 'conquer', amount: 1 }, reward: { xp: 1200, money: 10000 }, giver: 'The Sultan', text: "Hipsters in Kødbyen pay premium prices. If you invest in a Territory (Network tab), we own the block.", choices: [
                { text: "Send the boys (+25 Heat)", textKey: 'missions.m6.c1', effect: { heat: 25 } },
                { text: "Bribe the guards (-5000 kr)", textKey: 'missions.m6.c2', effect: { money: -5000 } }
            ]
        },

        // PHASE 3: HARD DRUGS
        { id: 'm7', reqLevel: 4, title: 'Blue Lightning', titleKey: 'missions.m7.title', textKey: 'missions.m7.text', req: { type: 'produce', item: 'amfetamin', amount: 50 }, reward: { xp: 5000, money: 25000 }, giver: 'The Sultan', text: "Truck drivers need energy. Hire a Chemist and cook some Speed." },
        { id: 'm8', title: 'Street Soldier', titleKey: 'missions.m8.title', textKey: 'missions.m8.text', req: { type: 'sell', amount: 500 }, reward: { xp: 7500, money: 40000 }, giver: 'The Sultan', text: "Get that shit on the street. I want to see cash in hand, habibi! Sell 500 units total." },
        { id: 'm9', title: 'Northwest Network', titleKey: 'missions.m9.title', textKey: 'missions.m9.text', req: { type: 'conquer', amount: 2 }, reward: { xp: 10000, money: 60000 }, giver: 'The Sultan', text: "Northwest is a gold mine. Invest in more territories to secure passive income." },

        // PHASE 4: THE SYNDICATE
        { id: 'm10', reqLevel: 6, title: 'Security Detail', titleKey: 'missions.m10.title', textKey: 'missions.m10.text', req: { type: 'defense', id: 'guards', amount: 5 }, reward: { xp: 3500, money: 30000 }, giver: 'The Sultan', text: "Rivals are watching. Hire 5 guards to protect your headquarters." },
        { id: 'm11', title: 'Laundry King', titleKey: 'missions.m11.title', textKey: 'missions.m11.text', req: { type: 'launder', amount: 100000 }, reward: { xp: 5000, money: 20000 }, giver: 'The Sultan', text: "We have too much dirty money. Launder 100,000 kr to prove you can handle the flow." },
        {
            id: 'm12', reqLevel: 7, title: 'The Harbor', titleKey: 'missions.m12.title', textKey: 'missions.m12.text', req: { type: 'hire', role: 'importer', amount: 1 }, reward: { xp: 6000, money: 0 }, giver: 'The Sultan', text: "Forget local production. Import is the future. Get a <b>Smuggler</b> to bring the containers home.", choices: [
                { text: "Take the risk (50% chance: +50k kr / +20 Heat)", textKey: 'missions.m12.c1', effect: { chance: 0.5, success: { money: 50000 }, fail: { heat: 20 } } },
                { text: "Play it safe", textKey: 'missions.m12.c2', effect: {} }
            ]
        },
        { id: 'm13', title: 'White Gold', titleKey: 'missions.m13.title', textKey: 'missions.m13.text', req: { type: 'produce', item: 'kokain', amount: 100 }, reward: { xp: 25000, money: 150000 }, giver: 'The Sultan', text: "Snow. White gold. The elite in the City are screaming for it. Produce 100 units." },
        { id: 'm14', title: 'The Lawyer', titleKey: 'missions.m14.title', textKey: 'missions.m14.text', req: { type: 'hire', role: 'lawyer', amount: 1 }, reward: { xp: 50000, money: 0 }, giver: 'The Sultan', text: "The cops are hot. Get a slick Lawyer. One who can keep Heat down while we grow." },

        // PHASE 5: KINGPIN
        { id: 'm15', reqLevel: 10, title: 'King of the Night', titleKey: 'missions.m15.title', textKey: 'missions.m15.text', req: { type: 'conquer', amount: 4 }, reward: { xp: 35000, money: 600000 }, giver: 'The Sultan', text: "Take control of the city's nightlife. We need to own 4 major territories now." },
        { id: 'm16', title: 'The Front', titleKey: 'missions.m16.title', textKey: 'missions.m16.text', req: { type: 'upgrade', id: 'studio', amount: 1 }, reward: { xp: 50000, money: 300000 }, giver: 'The Sultan', text: "We need a legit front. Buy the <b>Front Store</b> upgrade to make your laundering more efficient." },
        { id: 'm17', title: 'Cartel Status', titleKey: 'missions.m17.title', textKey: 'missions.m17.text', req: { type: 'produce', item: 'kokain', amount: 1000 }, reward: { xp: 75000, money: 1500000 }, giver: 'The Sultan', text: "We're not a gang anymore. We're a cartel. Fill the warehouse with coke." },

        // PHASE 6: ENDGAME
        { id: 'm18', title: 'Hellerup Heist', titleKey: 'missions.m18.title', textKey: 'missions.m18.text', req: { type: 'conquer', amount: 5 }, reward: { xp: 150000, money: 5000000 }, giver: 'The Sultan', text: "Hellerup. Where money and power live. Buy the final investment and show them who's in charge." },
        {
            id: 'm19', title: 'Safehouse', titleKey: 'missions.m19.title', textKey: 'missions.m19.text', req: { type: 'defense', id: 'bunker', amount: 1 }, reward: { xp: 600000, money: 0 }, giver: 'The Sultan', text: "Rivals are planning something big. Build a <b>Safehouse</b> to ensure your survival.", choices: [
                { text: "Strike first (+50 Heat)", textKey: 'missions.m19.c1', effect: { heat: 50 } },
                { text: "Defensive (Do nothing)", textKey: 'missions.m19.c2', effect: {} }
            ]
        },
        { id: 'm20', title: 'The Legend', titleKey: 'missions.m20.title', textKey: 'missions.m20.text', req: { type: 'sell', amount: 10000 }, reward: { xp: 2000000, money: 50000000 }, giver: 'The Sultan', text: "You own this city, brother. There's nothing left to win... unless you want to start fresh with even more power?" }
    ],

    // Production efficiency penalties based on heat
    productionHeatPenalties: {
        // Threshold : Penalty Multiplier (e.g. 95: 0.2 means 20% efficiency aka -80%)
        critical: { threshold: 95, val: 0.2 },
        high: { threshold: 80, val: 0.5 },
        med: { threshold: 50, val: 0.8 },
        none: { threshold: 0, val: 1.0 }
    },

    // Balancering
    production: {
        hash: { name: "items.hash.name", baseCost: 15, baseOutput: 1, baseRevenue: 68, costFactor: 1.1, unlockLevel: 1, duration: 1000, icon: "fa-cannabis", color: "yellow", tier: 1, heatGain: 0.02, aliases: "items.hash.aliases" },
        studie_speed: { name: "items.studie_speed.name", baseCost: 35, baseOutput: 1, baseRevenue: 113, costFactor: 1.15, unlockLevel: 1, duration: 1500, icon: "fa-pills", color: "blue", tier: 1, heatGain: 0.04, aliases: "items.studie_speed.aliases" },
        skunk: { name: "items.skunk.name", baseCost: 25, baseOutput: 1, baseRevenue: 75, costFactor: 1.2, unlockLevel: 2, duration: 2500, icon: "fa-cubes", color: "amber", tier: 1, heatGain: 0.1, aliases: "items.skunk.aliases" },
        amfetamin: { name: "items.amfetamin.name", baseCost: 750, baseOutput: 1, baseRevenue: 2850, costFactor: 1.25, unlockLevel: 4, duration: 4000, icon: "fa-bolt", color: "white", tier: 2, heatGain: 0.12, aliases: "items.amfetamin.aliases" },
        mdma: { name: "items.mdma.name", baseCost: 1500, baseOutput: 1, baseRevenue: 5500, costFactor: 1.3, unlockLevel: 5, duration: 6000, icon: "fa-heart", color: "pink", tier: 2, heatGain: 0.15, aliases: "items.mdma.aliases" },
        ketamin: { name: "items.ketamin.name", baseCost: 1500, baseOutput: 1, baseRevenue: 5500, costFactor: 1.35, unlockLevel: 5, duration: 8000, icon: "fa-horse-head", color: "zinc", tier: 2, heatGain: 0.15, aliases: "items.ketamin.aliases" },
        kokain: { name: "items.kokain.name", baseCost: 20000, baseOutput: 1, baseRevenue: 85000, costFactor: 1.4, unlockLevel: 7, duration: 10000, icon: "fa-snowflake", color: "white", tier: 3, heatGain: 0.5, aliases: "items.kokain.aliases" },
        benzos: { name: "items.benzos.name", baseCost: 15000, baseOutput: 1, baseRevenue: 53000, costFactor: 1.45, unlockLevel: 8, duration: 12000, icon: "fa-prescription-bottle", color: "blue", tier: 3, heatGain: 0.5, aliases: "items.benzos.aliases" },
        svampe: { name: "items.svampe.name", baseCost: 15000, baseOutput: 1, baseRevenue: 45000, costFactor: 1.5, unlockLevel: 8, duration: 15000, icon: "fa-frog", color: "purple", tier: 3, heatGain: 0.5, aliases: "items.svampe.aliases" },
        oxy: { name: "items.oxy.name", baseCost: 50000, baseOutput: 1, baseRevenue: 150000, costFactor: 1.6, unlockLevel: 10, duration: 20000, icon: "fa-syringe", color: "teal", tier: 4, heatGain: 0.8, aliases: "items.oxy.aliases" },
        heroin: { name: "items.heroin.name", baseCost: 100000, baseOutput: 1, baseRevenue: 503000, costFactor: 1.8, unlockLevel: 11, duration: 30000, icon: "fa-biohazard", color: "amber", tier: 4, heatGain: 1.0, aliases: "items.heroin.aliases" },
        fentanyl: { name: "items.fentanyl.name", baseCost: 180000, baseOutput: 1, baseRevenue: 563000, costFactor: 2.0, unlockLevel: 12, duration: 45000, icon: "fa-skull", color: "red", tier: 4, heatGain: 1.5, aliases: "items.fentanyl.aliases" }
    },
    staffCategories: {
        production: { id: 'production', name: 'staff.categories.production.name', icon: 'fa-flask', desc: 'staff.categories.production.desc' },
        sales: { id: 'sales', name: 'staff.categories.sales.name', icon: 'fa-truck-fast', desc: 'staff.categories.sales.desc' },
        security: { id: 'security', name: 'staff.categories.security.name', icon: 'fa-shield-halved', desc: 'staff.categories.security.desc' },
        admin: { id: 'admin', name: 'staff.categories.admin.name', icon: 'fa-building-user', desc: 'staff.categories.admin.desc' }
    },
    staff: {
        // --- PRODUCTION ---
        // 1. Junkies (Basis)
        junkie: {
            id: 'junkie',
            name: 'staff.junkie.name',
            reqLevel: 1,
            baseCost: 1000,
            costFactor: 1.15,
            role: 'producer',
            category: 'production',
            tier: 1,
            target: ['hash', 'studie_speed'],
            rate: 1.5, // AUDIT: /100
            salary: 10, // SUPER BUFF: Reduced to 10
            icon: 'fa-person-rays',
            desc: 'staff.junkie.desc',
            image: 'Zombien.png',
            survivalRate: 0.999,
            rates: { hash: 0.01, studie_speed: 0.006 }
        },

        // 2. Growers (Hash/Skunk)
        grower: {
            id: 'grower',
            name: 'staff.grower.name',
            reqLevel: 1,
            baseCost: 15000,
            costFactor: 1.10,
            role: 'producer',
            category: 'production',
            tier: 1,
            target: 'skunk',
            rate: 5.0, // AUDIT: /100
            salary: 300, // REBALANCED: Fixed from 4000
            icon: 'fa-seedling',
            desc: 'staff.grower.desc',
            image: 'Gartneren.png',
            rates: { hash: 0.015, skunk: 0.009 },
            tags: ['weed']
        },
        grower_pro: {
            id: 'grower_pro',
            name: 'Mester-Gartner',
            reqLevel: 5,
            baseCost: 75000,
            costFactor: 1.15,
            role: 'producer',
            category: 'production',
            tier: 2,
            target: 'skunk',
            rate: 15.0,
            salary: 12000,
            icon: 'fa-cannabis',
            desc: 'Ekspert i hydro-systemer. Dyrker 3x hurtigere.',
            image: 'Gartneren.png',
            rates: { hash: 0.045, skunk: 0.027 },
            tags: ['weed']
        },

        // 3. Chemists (Speed/MDMA)
        chemist: {
            id: 'chemist',
            name: 'staff.chemist.name',
            reqLevel: 4,
            baseCost: 50000,
            costFactor: 1.12,
            role: 'producer',
            category: 'production',
            tier: 1,
            target: 'amfetamin',
            rate: 10.0,
            salary: 8000,
            icon: 'fa-flask',
            desc: 'staff.chemist.desc',
            image: 'Kemikeren.png',
            rates: { amfetamin: 0.006, mdma: 0.0045, ketamin: 0.003 },
            tags: ['chem']
        },
        chemist_cook: {
            id: 'chemist_cook',
            name: 'Heisenberg',
            reqLevel: 8,
            baseCost: 250000,
            costFactor: 1.20,
            role: 'producer',
            category: 'production',
            tier: 2,
            target: 'amfetamin',
            rate: 30.0,
            salary: 40000,
            icon: 'fa-flask-vial',
            desc: 'Producerer krystaller af 99.1% renhed.',
            image: 'Kemikeren.png',
            rates: { amfetamin: 0.02, mdma: 0.015, ketamin: 0.01 },
            tags: ['chem']
        },

        // 4. Importers (Coke)
        importer: {
            id: 'importer',
            name: 'staff.importer.name',
            reqLevel: 7,
            baseCost: 100000,
            costFactor: 1.15,
            role: 'producer',
            category: 'production',
            tier: 1,
            target: 'kokain',
            rate: 20.0,
            salary: 40000,
            icon: 'fa-ship',
            desc: 'staff.importer.desc',
            image: 'Distributoren.png',
            rates: { kokain: 0.0015, benzos: 0.0012, svampe: 0.0009 },
            tags: ['import']
        },

        // 5. Lab Techs (Opioids)
        labtech: {
            id: 'labtech',
            name: 'staff.labtech.name',
            reqLevel: 10,
            baseCost: 200000,
            costFactor: 1.15,
            role: 'producer',
            category: 'production',
            tier: 1,
            target: 'fentanyl',
            rate: 30.0,
            salary: 60000,
            icon: 'fa-syringe',
            desc: 'staff.labtech.desc',
            image: 'Kemikeren.png',
            rates: { fentanyl: 0.0006, oxy: 0.0009, heroin: 0.00075 },
            tags: ['opioid']
        },

        // --- SALG ---
        pusher: {
            id: 'pusher',
            name: 'staff.pusher.name',
            reqLevel: 1,
            baseCost: 1500,
            costFactor: 1.08,
            role: 'seller',
            category: 'sales',
            tier: 1,
            target: ['hash', 'studie_speed', 'skunk', 'amfetamin', 'mdma', 'ketamin', 'kokain', 'benzos', 'svampe', 'oxy', 'heroin', 'fentanyl'],
            salary: 10, // SUPER BUFF: Reduced to 10 to ensure rapid growth
            icon: 'fa-person-walking',
            desc: 'staff.pusher.desc',
            image: 'Pusheren.png',
            rates: { hash: 0.03, studie_speed: 0.03, default: 0.005 } // BUFF: Default rate handles all other drugs to prevent deadlock
        },
        pusher_bike: {
            id: 'pusher_bike',
            name: 'Cykel-Bud',
            reqLevel: 3,
            baseCost: 5000,
            costFactor: 1.10,
            role: 'seller',
            category: 'sales',
            tier: 2,
            target: ['hash', 'skunk'],
            salary: 3500,
            icon: 'fa-bicycle',
            desc: 'Hurtig levering. Sælger dobbelt så hurtigt.',
            image: 'Pusheren.png',
            rates: { hash: 0.01, skunk: 0.008, studie_speed: 0.01 }
        },

        distributor: {
            id: 'distributor',
            name: 'staff.distributor.name',
            reqLevel: 4,
            baseCost: 20000,
            costFactor: 1.10,
            role: 'seller',
            category: 'sales',
            tier: 1,
            target: ['skunk', 'amfetamin', 'mdma', 'ketamin'],
            salary: 6000,
            icon: 'fa-truck-fast',
            desc: 'staff.distributor.desc',
            image: 'Distributoren.png',
            rates: { skunk: 0.005, amfetamin: 0.004, mdma: 0.003, ketamin: 0.0025 }
        },

        trafficker: {
            id: 'trafficker',
            name: 'staff.trafficker.name',
            reqLevel: 7,
            baseCost: 150000,
            costFactor: 1.12,
            role: 'seller',
            category: 'sales',
            tier: 1,
            target: ['kokain', 'benzos', 'oxy', 'heroin', 'fentanyl'],
            salary: 30000,
            icon: 'fa-briefcase',
            desc: 'staff.trafficker.desc',
            image: 'Bagmanden.png',
            rates: { kokain: 0.004, heroin: 0.0025, fentanyl: 0.002, default: 0.003 }
        },

        // --- ADMIN ---
        accountant: {
            id: 'accountant',
            name: 'staff.accountant.name',
            reqLevel: 8,
            baseCost: 150000,
            costFactor: 1.12,
            role: 'reducer',
            category: 'admin',
            tier: 1,
            target: 'clean',
            rate: 0.05,
            salary: 10000,
            icon: 'fa-calculator',
            desc: 'staff.accountant.desc',
            image: 'Revisoren.png'
        },
        lawyer: {
            id: 'lawyer',
            name: 'staff.lawyer.name',
            reqLevel: 5,
            baseCost: 200000,
            costFactor: 1.12,
            role: 'reducer',
            category: 'admin',
            tier: 1,
            target: 'heat',
            rate: 0.15,
            salary: 50000,
            icon: 'fa-scale-balanced',
            desc: 'staff.lawyer.desc',
            image: 'Advokaten.png'
        }
    },
    upgrades: {
        warehouse: { name: 'upgrades.warehouse.name', baseCost: 20000, effect: 'cap', target: 'all', value: 2.0, costFactor: 2.0, icon: 'fa-box', desc: 'upgrades.warehouse.desc' },
        hydro: { name: 'upgrades.hydro.name', baseCost: 50000, costFactor: 1.5, effect: 'speed', target: 'weed', value: 0.8, icon: 'fa-lightbulb', desc: 'upgrades.hydro.desc' },
        lab: { name: 'upgrades.lab.name', baseCost: 100000, costFactor: 1.5, effect: 'speed', target: 'amf', value: 0.8, icon: 'fa-flask-vial', desc: 'upgrades.lab.desc' },
        studio: { name: 'upgrades.studio.name', baseCost: 150000, costFactor: 1.5, effect: 'passive', target: 'clean', value: 1.5, icon: 'fa-shop', desc: 'upgrades.studio.desc' },
        network: { name: 'upgrades.network.name', baseCost: 10000, costFactor: 1.5, effect: 'passive', target: 'all', value: 1.25, icon: 'fa-mobile-screen', desc: 'upgrades.network.desc' },
        deep_wash: { name: 'upgrades.deep_wash.name', baseCost: 1000000, costFactor: 2.5, effect: 'passive_launder', target: 'clean', value: 1.2, icon: 'fa-server', desc: 'upgrades.deep_wash.desc' }
    },
    premiumItems: [
        { id: 'time_skip_1', name: 'premium.time_skip_1.name', type: 'time', duration: 14400, cost: 5, icon: 'fa-forward', desc: 'premium.time_skip_1.desc' },
        { id: 'hype_boost_1', name: 'premium.hype_boost_1.name', type: 'buff', buff: 'hype', duration: 300000, cost: 10, icon: 'fa-bullhorn', desc: 'premium.hype_boost_1.desc' },
        { id: 'heat_clear', name: 'premium.heat_clear.name', type: 'instant', effect: 'heat_0', cost: 15, icon: 'fa-snowflake', desc: 'premium.heat_clear.desc' },
        { id: 'diamond_pack_s', name: 'premium.diamond_pack_s.name', type: 'currency', value: 50000, cost: 20, icon: 'fa-sack-dollar', desc: 'premium.diamond_pack_s.desc' }
    ],
    defense: {
        guards: { name: 'defense.guards.name', baseCost: 10000, costFactor: 1.4, defenseVal: 20, desc: 'defense.guards.desc' },
        cameras: { name: 'defense.cameras.name', baseCost: 15000, costFactor: 1.5, defenseVal: 30, desc: 'defense.cameras.desc' },
        bunker: { name: 'defense.bunker.name', baseCost: 500000, costFactor: 1.8, defenseVal: 120, desc: 'defense.bunker.desc' }
    },
    districts: {
        nørrebro: {
            id: 'nørrebro',
            name: 'districts.nurrebro.name',
            bonus: 'districts.nurrebro.bonus',
            req: ['christiania', 'nørrebro', 'nordvest'],
            effect: { type: 'cost', target: 'speed', value: 0.8 }
        },
        city: {
            id: 'city',
            name: 'districts.city.name',
            bonus: 'districts.city.bonus',
            req: ['vesterbro', 'city', 'frederiksberg'],
            effect: { type: 'bribe_cost', value: 0.85 }
        },
        vestegnen: {
            id: 'vestegnen',
            name: 'districts.vestegnen.name',
            bonus: 'districts.vestegnen.bonus',
            req: ['vestegnen', 'glostrup', 'ishøj'],
            effect: { type: 'global_speed', value: 0.85 }
        }
    },
    territories: [
        // NØRREBRO DISTRICT (Nerfed by ~30%)
        { id: 'christiania', name: 'territories.christiania.name', district: 'nørrebro', baseCost: 20000, income: 17500, type: 'dirty', reqLevel: 2 },
        { id: 'nørrebro', name: 'territories.nurrebro.name', district: 'nørrebro', baseCost: 60000, income: 52500, type: 'dirty', reqLevel: 6 },
        { id: 'nordvest', name: 'territories.nordvest.name', district: 'nørrebro', baseCost: 30000, income: 26250, type: 'dirty', reqLevel: 3 },

        // CITY DISTRICT (Nerfed by ~30%)
        { id: 'vesterbro', name: 'territories.vesterbro.name', district: 'city', baseCost: 40000, income: 35000, type: 'dirty', reqLevel: 4 },
        { id: 'city', name: 'territories.city.name', district: 'city', baseCost: 120000, income: 105000, type: 'clean', reqLevel: 8 },
        { id: 'frederiksberg', name: 'territories.frederiksberg.name', district: 'city', baseCost: 80000, income: 70000, type: 'clean', reqLevel: 7 },

        // VESTEGNEN DISTRICT (Nerfed by ~30%)
        { id: 'vestegnen', name: 'territories.vestegnen.name', district: 'vestegnen', baseCost: 160000, income: 157500, type: 'dirty', reqLevel: 9 },
        { id: 'glostrup', name: 'territories.glostrup.name', district: 'vestegnen', baseCost: 180000, income: 175000, type: 'clean', reqLevel: 10 },
        { id: 'ishøj', name: 'territories.ishoj.name', district: 'vestegnen', baseCost: 240000, income: 227500, type: 'dirty', reqLevel: 11 },

        // ELITE (Nerfed by ~30%)
        { id: 'hellerup', name: 'territories.hellerup.name', district: 'elite', baseCost: 400000, income: 350000, type: 'clean', reqLevel: 12 }
    ],
    luxuryItems: [
        { id: 'penthouse', name: 'luxury.penthouse.name', cost: 5000000, icon: 'fa-building-columns', desc: 'luxury.penthouse.desc', buff: 'rep_boost' },
        { id: 'yacht', name: 'luxury.yacht.name', cost: 25000000, icon: 'fa-ship', desc: 'luxury.yacht.desc', buff: 'launder_eff' },
        { id: 'jet', name: 'luxury.jet.name', cost: 100000000, icon: 'fa-plane-departure', desc: 'luxury.jet.desc', buff: 'heat_floor' },
        { id: 'ghostmode', name: 'luxury.ghostmode.name', cost: 250000000, icon: 'fa-user-secret', desc: 'luxury.ghostmode.desc', buff: 'ghost_mode' },
        { id: 'island', name: 'luxury.island.name', cost: 500000000, icon: 'fa-island-tropical', desc: 'luxury.island.desc', buff: 'win_condition' }
    ],

    gameMechanics: {
        maxCash: 1e15,
        maxHeat: 500
    },
    leveling: {
        baseXp: 500,
        expFactor: 1.85 // PROF-TIER: Increased from 1.60 to extend Level 10-20 duration
    },
    payroll: {
        // OPTIMIZATION (Math Professor Edit):
        // Previously: 300,000ms (5 mins). Result: "Salary Death Spiral" (Costs > Early Rev).
        // New: Daily Salary (24h). 
        // Logic: Real-time 24h is too long for a session? 
        // No, game uses real Date.now().
        // If we want "Game Days", we simulated 1 month in 43200 steps (1min/step).
        // Let's set it to 14,400,000 ms (4 Hours). This is "Weekly" in a typical session context.
        // Wait, User asked for "Monthly or Weekly".
        // Let's go with 86,400,000 (24 Hours).
        // Adjusted to 10 Minutes from 1 Hour for better reactivity
        salaryInterval: 600000, // 10 Minutes
        emergencyMarkup: 1.5
    },
    market: {
        multipliers: { bull: 1.3, bear: 0.7 },
        duration: { min: 30, range: 60 }
    },
    prestige: {
        threshold: 250000000, // Raised from 10M to prevent accidental prestige at Tier 3
        formula: {
            base: 2.5,
            scale: 15,
            divisor: 10,
            logBase: 5000
        }
    },
    rivals: {
        sabotageCost: 20000,
        strikeCost: 50000,
        raidChance: 0.6,
        ops: {
            drive_by: { cost: 5000, heat: 10, strengthLoss: 50 },
            bribe: { cost: 15000, heatLoss: 20 }, // Political Bribe (Different from Police Bribe)
            stash_raid: { loot: 15000, heat: 15 }
        }
    },
    police: {
        bribeCost: 15000, // Lowered from 50k to fix Tier 1 Skunk/Hash balance
        sultanBribeFactor: 500,
        newsAuctionCost: 5000
    },
    finance: {
        debtInterest: 0.01 // Reduced from 0.05 to prevent inescapable spirals
    },
    marketing: {
        hypeCost: 25000
    },
    events: {
        heatWarnings: { critical: 425, high: 300, low: 250 } // Adjusted: Start warning at 50% (250), High at 60% (300), Crit at 85% (425)
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
            interestRate: 0.0002, // PROF-TIER: 0.02% per 5min (approx 6% daily - sustainable faucet)
            interestInterval: 300000,
            maxSavingsFactor: 250000 // PROF-TIER: Tighter cap (Level 12 = 3M cap)
        },
        manualWashPower: 100, // Amount cleaned per click
        marketInfluenceCost: 50000 // Cost to fix the market
    },
    boss: {
        triggerLevel: 10,
        maxHp: 800, // BUFF: Increased base from 500
        damagePerClick: 10,
        regenRate: 5, // BUFF: Increased from 2 for late-game challenge
        reward: { xp: 10000, money: 100000 },
        combat: {
            critChance: 0.1,
            critMult: 2.0,
            defenseSynergy: 0.1, // 10% of defense scaling
            bossDefScale: 0.5, // Boss defense per level
            enrageThreshold: 0.25,
            attackInterval: 3000, // Increased from 2000ms - less aggressive
            enragedInterval: 1500, // Increased from 1000ms
            cashLossRatio: 0.1,
            speedBonusTime: 30000,
            speedBonusMult: 1.5
        }
    },
    perks: {
        heat_reduce: { name: "perks.heat_reduce.name", desc: "perks.heat_reduce.desc", baseCost: 10, costScale: 1.5, maxLevel: 10, effect: 'heat', val: 0.05, category: 'aggressive' },
        raid_defense: { name: "perks.raid_defense.name", desc: "perks.raid_defense.desc", baseCost: 15, costScale: 1.5, maxLevel: 5, effect: 'defense', val: 0.1, category: 'aggressive' },
        boss_dmg: { name: "perks.boss_dmg.name", desc: "perks.boss_dmg.desc", baseCost: 20, costScale: 1.5, maxLevel: 10, effect: 'boss_dmg', val: 10, category: 'aggressive' },
        rival_smash: { name: "perks.rival_smash.name", desc: "perks.rival_smash.desc", baseCost: 25, costScale: 1.5, maxLevel: 5, effect: 'rival_cost', val: 0.2, category: 'aggressive' },

        launder_speed: { name: "perks.launder_speed.name", desc: "perks.launder_speed.desc", baseCost: 10, costScale: 1.5, maxLevel: 10, effect: 'launder', val: 0.1, category: 'greedy' },
        sales_boost: { name: "perks.sales_boost.name", desc: "perks.sales_boost.desc", baseCost: 15, costScale: 1.5, maxLevel: 10, effect: 'sales', val: 0.1, category: 'greedy' },
        prod_speed: { name: "perks.prod_speed.name", desc: "perks.prod_speed.desc", baseCost: 20, costScale: 1.5, maxLevel: 10, effect: 'prod_speed', val: 0.1, category: 'greedy' },
        xp_boost: { name: "perks.xp_boost.name", desc: "perks.xp_boost.desc", baseCost: 25, costScale: 1.5, maxLevel: 5, effect: 'xp', val: 0.2, category: 'greedy' },

        // FORBIDDEN BRANCH (Phase 11)
        shadow_network: { name: "perks.shadow_network.name", desc: "perks.shadow_network.desc", baseCost: 50, costScale: 1.6, maxLevel: 5, effect: 'heat_gen', val: 0.1, category: 'forbidden' },
        laundering_mastery: { name: "perks.laundering_mastery.name", desc: "perks.laundering_mastery.desc", baseCost: 60, costScale: 1.6, maxLevel: 5, effect: 'launder_eff', val: 0.05, category: 'forbidden' },
        politician: { name: "perks.politician.name", desc: "perks.politician.desc", baseCost: 75, costScale: 1.7, maxLevel: 5, effect: 'passive_income', val: 5000, category: 'forbidden' },
        rival_insider: { name: "perks.rival_insider.name", desc: "perks.rival_insider.desc", baseCost: 100, costScale: 2.0, maxLevel: 1, effect: 'intel', val: 1, category: 'forbidden' },
        offshore_accounts: { name: "perks.offshore_accounts.name", desc: "perks.offshore_accounts.desc", baseCost: 150, costScale: 2.0, maxLevel: 5, effect: 'retention', val: 0.05, category: 'forbidden' }
    },
    masteryPerks: {
        titan_prod: { name: "mastery.titan_prod.name", desc: "mastery.titan_prod.desc", cost: 50, icon: "fa-industry", effect: "prod_speed", val: 0.15 },
        market_monopoly: { name: "mastery.market_monopoly.name", desc: "mastery.market_monopoly.desc", cost: 100, icon: "fa-store-slash", effect: "sales_boost", val: 0.15 },
        ghost_ops: { name: "mastery.ghost_ops.name", desc: "mastery.ghost_ops.desc", cost: 75, icon: "fa-user-ghost", effect: "heat_decay", val: 0.35 },
        diamond_network: { name: "mastery.diamond_network.name", desc: "mastery.diamond_network.desc", cost: 150, icon: "fa-network-wired", effect: "xp_boost", val: 1.0 }
    },
    achievements: [
        { id: 'first_blood', name: 'achievements.first_blood.name', desc: 'achievements.first_blood.desc', req: { type: 'dirty', val: 1000000 }, icon: 'fa-sack-dollar', reward: 5 },
        { id: 'clean_house', name: 'achievements.clean_house.name', desc: 'achievements.clean_house.desc', req: { type: 'clean', val: 10000000 }, icon: 'fa-soap', reward: 25 },
        { id: 'king_of_streets', name: 'achievements.king_of_streets.name', desc: 'achievements.king_of_streets.desc', req: { type: 'territory', val: 5 }, icon: 'fa-map-location-dot', reward: 50 },
        { id: 'escobar', name: 'achievements.escobar.name', desc: 'achievements.escobar.desc', req: { type: 'prod', item: 'kokain', val: 1000 }, icon: 'fa-snowflake', reward: 100 },
        { id: 'untouchable', name: 'achievements.untouchable.name', desc: 'achievements.untouchable.desc', req: { type: 'stealth' }, icon: 'fa-user-secret', reward: 50 },
        { id: 'prestige_one', name: 'achievements.prestige_one.name', desc: 'achievements.prestige_one.desc', req: { type: 'prestige', val: 1 }, icon: 'fa-crown', reward: 150 },
        { id: 'diamond_hands', name: 'achievements.diamond_hands.name', desc: 'achievements.diamond_hands.desc', req: { type: 'crypto', coin: 'bitcoin', val: 10 }, icon: 'fa-gem', reward: 200 },
        // SECRETS
        { id: 'clean_hands', name: 'achievements.clean_hands.name', desc: 'achievements.clean_hands.desc', req: { type: 'clean_streak', val: 1000000 }, icon: 'fa-hands-bubbles', reward: 300, secret: true },
        { id: 'hoarder', name: 'achievements.hoarder.name', desc: 'achievements.hoarder.desc', req: { type: 'inventory', val: 500 }, icon: 'fa-boxes-stacked', reward: 100, secret: true },
        { id: 'veteran', name: 'achievements.veteran.name', desc: 'achievements.veteran.desc', req: { type: 'time', val: 600 }, icon: 'fa-clock', reward: 500, secret: true }
    ]
};

// Helper to get random slang
export const getProductSlang = (id) => {
    const p = CONFIG.production[id];
    if (!p || !p.aliases || p.aliases.length === 0) return p ? p.name : 'Varen';
    return p.aliases[Math.floor(Math.random() * p.aliases.length)];
};