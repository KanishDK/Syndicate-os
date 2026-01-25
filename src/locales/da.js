export const da = {
    // --- UI & SYSTEM ---
    ui: {
        cash: "Kontanter",
        dirty_cash: "Sorte Penge",
        heat: "Heat",
        level: "Niveau",
        day: "Dag",
        save: "Gem Spil",
        settings: "Indstillinger",
        help: "Hjælp",
        back: "Tilbage",
        close: "Luk",
        buy: "Køb",
        sell: "Sælg",
        locked: "Låst",
        max: "Maks",
        loading: "Indlæser Syndicate OS...",
        ok: "OK",
        understood: "Forstået",
        kroner: "Kroner"
    },
    boot: {
        skip: "SPRING INTRO OVER",
        init: "INITIALISERER SYNDICATE OS KERNE v1.1.2...",
        mounting: "MOUNTER KRYPTEREDE DREV (AES-256)...",
        proxy: "ETABLERER PROXY KÆDER...",
        bypassing: "OMGÅR PET CYBER DEFENSE...",
        spoofing: "SPOOFER MAC ADRESSE: 00:1A:2B:3C:4D:5E",
        connecting: "FORBINDER TIL KØBENHAVN UNDERGROUND HUB...",
        handshake: "HÅNDTRYKS PROTOKOL: SUCCES",
        decrypting: "DEKRYPTERER BRUGER DATA...",
        syncing: "SYNKRONISERER TERRITORIE DATABASE...",
        intel: "INDLÆSER RIVAL INTEL...",
        access: "ADGANG TILLADT: VELKOMMEN SULTAN.",
        logo_subtitle: "KØBENHAVN NODE #084",
        initialize_btn: "Initialiser Adgang",
        bio_check: "Biometrisk Håndtryk Påkrævet",
        connection_stable: "KRYPTERET FORBINDELSE STABIL",
        decrypting_nodes: "Dekrypterer Noder"
    },
    header: {
        xp: { title: "Erfaringspoint", current: "Nuværende", next: "Næste Lvl" },
        clean_tooltip: { title: "Finans Indsigt", launder: "Hvidvask", legal: "Lovlig", footer: "Tjek Finans fanen for detaljer" },
        clean_cash: "Ren Kapital",
        clean_cash_warning: "RENE PENGE KRÆVET",
        heat_tooltip: { title: "Heat Status", level: "Niveau", risk: "Risiko for Razzia", lawyers: "Advokater", shadow_network: "Skygge Netværk", bribe: "Bestik (-25%)", cost_warning: "Koster Sorte Penge" },
        heat_status: "Heat",
        heat_overheat: "OVERHEAT!!",
        dirty_tooltip: { title: "Gade Indsigt", sales: "Varelager Salg", desc: "Dette er dit forventede flow baseret på nuværende produktion og salg.", footer: "Tjek Produktion for detaljer" },
        dirty_cash: "Sort Kapital",
        siege_alert: "Territorier Under Angreb!",
        siege_desc: "Gå til Underverdenen for at forsvare dine områder"
    },
    tabs: {
        sultan: "Sultanen",
        production: "Produktion",
        network: "Gaden",
        rivals: "Underverdenen",
        finance: "Finans",
        management: "Operationer",
        empire: "Imperiet"
    },

    // --- MAIN TABS ---
    EmpireTab: { title: "PLATINUM IMPERIUM", subtitle: "Din arv i Københavns underverden" },
    empire: {
        title: "DIT IMPERIUM",
        subtitle: "\"En dag vil alt dette være støv. Men legenden? Legenden lever evigt.\"",
        mastery: {
            title: "Gade Beherskelse",
            subtitle: "Køb Permanente Fordele for Diamanter",
            active: "AKTIV",
            unlock: "LÅS OP"
        },
        prestige: {
            level: "PRESTIGE LEVEL",
            income_bonus: "INDKOMST BONUS",
            permanent_mult: "Permanent Multiplikator",
            tokens: "PRESTIGE TOKENS"
        },
        lifetime: {
            earnings: "Livstids Indtjening",
            produced: "Total Produceret",
            units: "enheder",
            resets: "Antal Genstarter",
            value: "Imperie Værdi"
        },
        reset: {
            title: "EXIT SCAM",
            desc: "Wipe alt progress for at opnå permanent prestige bonus.",
            button: "IVÆRKSÆT EXIT SCAM",
            warning: "ADVARSEL: Dette nulstiller dit imperium! Er du sikker?",
            label: "PERMANENT",
            req_level: "Opnå Level {level}",
            req_cash: "Saml {amount} kr (Ren)"
        },
        network: {
            title: "Syndikat Netværk",
            enforcer: "Enforcer (Aggressiv)",
            tycoon: "Tycoon (Grådig)",
            forbidden: "Forbidden (Prestige)",
            upgrade: "OPGRADER",
            unlock: "LÅS OP",
            maxed: "MAXIMALT"
        }
    },
    prestige: {
        points: "Prestige Point"
    },
    sultan: {
        title: "SULTANENS BAGLOKALE",
        title: "Sultanens Beskeder",
        subtitle: "Aktuelle opgaver og missioner fra toppen.",
        services_title: "Tjenester",
        bribe_title: "Bestikkelse",
        reduce_heat: "Reducer Heat",
        hype_title: "Hype Kampagne",
        start_campaign: "Start Kampagne",
        market_title: "Markedsmagt",
        fix_market: "Fiks Markedet",
        intel_title: "Efterretninger",
        intel_desc: "Køb info om næste event",
        next_event: "Næste Event",
        waiting_signal: "Afventer signal...",
        seconds_left: "sek tilbage",
        bribe_sultan: "Bestik Sultanen for Info",
        main_mission: "Hovedmission",
        daily_mission: "Dagens Opgave",
        next_mission: "Næste Mission",
        req_rank: "Kræver Rank",
        you_are_rank: "Du er Rank",
        no_contracts: "Ingen Kontrakter",
        no_contracts_desc: "Du er clear for nu. Vent på nye ordrer.",
        achievements: "Bedrifter",
        unlocked: "Låst op",
        secret: "Hemmelig",
        complete_mission: "AFSLUT MISSION",
        status: "Status",
        completed: "Fuldført",
        remaining: "Tilbage",
        progress: "Fremskridt",
        mastery: {
            titan_prod: { name: "Titan Produktion", desc: "+15% Global Hastighed" },
            market_monopoly: { name: "Markedsmonopol", desc: "+15% Salgsmargin" },
            ghost_ops: { name: "Spøgelsesoperationer", desc: "+35% Heat Nedgang" },
            diamond_network: { name: "Diamant Netværk", desc: "Dobbelt Sultan XP" }
        },
        daily_contracts: {
            produce: { title: "Levering: {item}", text: "En kunde mangler {amount}x {item}." },
            sell: { title: "Gade Salg", text: "Vi skal af med varerne. Sælg {amount} enheder totalt." },
            launder: { title: "Hvidvask", text: "Sorte penge lugter. Vask {amount} kr." },
            new_available: "Ny Kontrakt Tilgængelig!",
            completed: "OPGAVE UDFØRT",
            contract_completed: "KONTRAKT UDFØRT",
            sultan_pleased: "Godt arbejde. Sultanen er tilfreds.\n\nBelønning: {reward}",
            sultan_pays: "Sultanen betaler: {amount} kr.",
            you_received: "Du modtog: {reward}",
            endgame_title: "LEGENDEN",
            endgame_msg: "Du er Kongen af København. Du har vundet spillet."
        }
    },
    production: {
        title: "Laboratoriet",
        subtitle: "Laboratoriet er hjertet af din operation. Producer varer manuelt eller automatisk.",
        shortcuts_hint: "Brug taster 1-6 for hurtig produktion.",
        storage_cap: "Lagerkapacitet",
        storage_full: "LAGER FULDT!",
        stats_title: "Produktions Statistik",
        total_produced: "Total Produceret",
        total_sold: "Total Solgt",
        in_stock: "På Lager",
        unlocked: "Produkter Unlocked",
        shortcuts: "Genveje:",
        distribution: "DISTRIBUTION",
        panic_stop: "PANIC STOP",
        stock: "Lager",
        prod: "Prod",
        sell: "Salg",
        card_storage_full: "LAGER FULDT",
        sell_now: "SÆLG VARER NU",
        producing: "PRODUCERER...",
        produce_now: "PRODUCER NU",
        sell_all: "SÆLG ALT",
        auto_on: "Auto: ON",
        auto_off: "Auto: OFF",
        default_desc: "Producér og sælg.",
        prod_details: "Produktion Detaljer",
        sell_details: "Salg Detaljer",
        base: "Base",
        total: "Total",
        staff: "Ansatte",
        heat_critical_title: "KRITISK VARME!",
        heat_critical_desc: "RAZZIA NÆRT FORESTÅENDE! Salgseffektivitet nedsat!",
        heat_high_title: "HØJ VARME",
        heat_high_desc: "Politiet snuser rundt. Salgseffektivitet reduceret."
    },
    finance: {
        title: "Finansministeriet",
        subtitle: "Kapitalstyring, Hvidvask og Globale Investeringer.",
        net_worth: "Samlet Formue",
        cashflow_5m: "Pengestrøm (5m)",
        clean_capital: "Ren Kapital",
        dirty_capital: "Sort Kapital",
        liquid_clean: "Liquid Ren Kapital",
        dirty_cash: "Uvaskede Pengesedler",
        dirty_alert: {
            title: "HØJ RISIKO FOR RAZZIA!",
            desc: "Du har for mange sorte penge. Politiet efterforsker dig. Vask dem NU!"
        },
        laundering: {
            title: "Hvidvask Terminal",
            subtitle: "Vask dine uvaskede pengesedler",
            op_name: "Operation Clean Sweep",
            fee: "GEBYR",
            rate: "RATE",
            desc: "Konverter Sorte Penge til legitim kapital. Risiko for razzia er 5% pr. vask.",
            warn_crash: "BLOCKCHAIN CRASH: Risiko forøget til 15%!",
            wash_all: "Vask Alt",
            manual_wash: "Manuel Vask",
            manual_desc: "Klik her for hurtigrens"
        },
        chart: { collecting: "Indsamler Data..." },
        crypto: {
            title: "Kryptohandel",
            subtitle: "Hvidvask via Blockchain-teknologi",
            holdings: "Beholdning",
            rate: "Kurs"
        },
        bank: {
            title: "Sparkasse Opsparing",
            bank_name: "Københavns Investeringsbank",
            bank_desc: "Sikker opbevaring med renter",
            info_text: "Få 2% i rente hvert 5. minut. Penge her er immune overfor Razzia.",
            balance: "Saldo",
            interest: "Rente (5m)",
            interest_rate: "Rentesats",
            next_payout: "Næste Udbetaling",
            deposit_10k: "Indskud 10k",
            deposit_all: "Indskud Alt",
            withdraw_max: "Hæv Alt"
        },
        loans: {
            title: "Hurtig-Lån",
            subtitle: "Når du mangler likviditet",
            current_debt: "Nuværende Gæld",
            info_text: "Lån penge hurtigt til 0% rente (Lige nu). Kan betales tilbage med både hvide og sorte penge.",
            repay_max: "Afbetal Alt"
        },
        luxury: {
            title: "Luksusaktiver",
            subtitle: "Vis din magt og prestige"
        }
    },
    network: {
        title: "GADEN",
        subtitle: "Kontrollér gaden, udvid dit imperium",
        total_income: "Total Indkomst",
        owned: "Ejet",
        live_feed: "LIVE FEED",
        controlled: "KONTROLLERET",
        zones: "zoner",
        respect: "GADE RESPEKT",
        power: "TOTAL MAGT",
        districts: {
            elite: "Elite Zoner",
            other: "Andre Områder"
        },
        ops: {
            drive_by: "Drive-By (5k)",
            bribe: "Bestik (30k)",
            raid: "Raid (Risiko)",
            heat_wipe: "HEAT WIPE (1T)"
        },
        bonus_active: "🌟 BONUS AKTIV",
        set_bonus: "Sæt-Bonus",
        income_sec: "INDTÆGT / SEK",
        income: "INDTÆGT",
        stats: { base: "Base", mult: "Multiplier", next: "Næste Upgrade" },
        actions: { buy: "Køb Område", upgrade: "OPGRADER" },
        levels: "Levels",
        attack: "⚠️ ANGREB ⚠️",
        strength: "Styrke",
        defend_safe: "FORSVAR (Sikker)",
        defend_merc: "LEJESOLDATER (10k)",
        rival_occupation: "RIVAL BESÆTTELSE",
        liberate: "BEFRI OMRÅDET",
        shakedown: { collect: "INDDRIV!" },
        spec: { title: "Vælg Speciale", safe: "SafeHouse", front: "Salg-Front", warehouse: "Stort Lager" },
        specialization: "Speciale",
        spec_chosen: "Du valgte {spec} specialisering!"
    },
    rivals: {
        title: "Underverdenen",
        subtitle: "Konflikt, Politi og Sikkerhed. Hold dine fjender tæt og din ryg fri.",
        defense_title: "Forsvar",
        defense_desc: "Beskyt dit territorium",
        war_title: "Bandekrig",
        war_active: "KRIG ER AKTIV",
        wars: {
            title: "Bandekrig (Multiplayer Lite)",
            beta: "BETA",
            challenge: "Udfordr en Ven",
            challenge_desc: "Send din kode til en ven. Hvis de indtaster den, bliver DU deres rival.",
            copy_code: "Kopier Min Kode",
            find: "Find Rival",
            find_desc: "Indtast en vens kode for at kæmpe mod dem.",
            search: "Søg",
            copy: "Kopier",
            copy_success: "Kode kopieret til udklipsholder!",
            key_generated: "Rival Nøgle Genereret",
            error_input_not_found: "Input felt ikke fundet!",
            error_empty: "Indtast venligst en rival kode.",
            error_invalid: "Ugyldig rival kode.",
            rival_found: "Rival Fundet"
        },
        grid: {
            title: "Syndikat Kontrolnet",
            dominance: "Global Dominans"
        },
        active_rivals: "Aktive Rivaler",
        scanner: {
            title: "Politirapport & Overvågning",
            police: "Københavns Politi",
            status_raid: "⚠️ RAZZIA OVERHÆNGENDE",
            status_active: "📡 OVERVÅGNING AKTIV",
            threat_level: "Nuværende Trusselsniveau",
            status_label: "Status",
            level: { critical: "Kritisk", high: "Forhøjet", safe: "Sikkert" }
        },
        actions: {
            bribe: "Bestik Betjent",
            bribe_desc: "-25% HEAT ØJEBLIKKELIGT",
            sabotage: "Sabotage",
            sabotage_desc: "Forsink Rival",
            raid: "Plyndring",
            raid_desc: "Angreb",
            war: "Offensiv",
            war_desc: "Gade-Krig"
        },
        cost: "Omkostning",
        rival_syndicate: "Rivaliserende Syndikat",
        hostility: "Fjendtlighed",
        strength: "Rival Styrke",
        risk: "Risiko",
        production: {
            title: "Produktion",
            heat_critical_title: "HEAT CRITICAL!",
            heat_critical_desc: "POLITI-RAZZIA NÆRT FORESTÅENDE! Salgseffektivitet nedsat!",
            heat_high_title: "HØJ HEAT ADVARSEL",
            heat_high_desc: "Politiet snuser rundt. Salgseffektivitet nedsat.",
            storage_full: "LAGER FULDT!"
        },
        defense: {
            title: "Forsvar",
            subtitle: "Sikring af Hovedkvarteret",
            def_unit: "FORSVAR",
            per_unit: "PR. ENHED",
            total: "Samlet Forsvarsværdi",
            total_value: "Total Værdi",
            points: "PUNKTER",
            buy: "Køb",
            active: "Aktiv",
            hq: "Hovedkvarter Beskyttelse"
        },
        buy: "Køb",
        max: "Max"
    },
    management: {
        title: "Organisation",
        subtitle: "Ansæt specialister og administrer din operation.",
        staff_overview: "Personale Oversigt",
        salary: "Lønning",
        status: "Status",
        active: "Aktiv",
        inactive: "Uaktiv",
        details: "Detaljer",
        per_unit: "Pr. enhed",
        loyalty: "Loyalitet",
        total_prod: "Total Produktion",
        total_ops: "Total Drift",
        hire: "Ansæt",
        fire: "Fyr",
        pay_salary: "UDBETAL LØN",
        stop_strike: "STOP STREJKE",
        next_payroll: "Næste Lønning",
        economy: "Økonomi",
        upgrades: "Opgraderinger",
        salary_interval: "Lønninger (Interval)",
        total_revenue: "Total Omsætning",
        laundered: "Hvidvasket",
        stats: {
            estimated_cashflow: "Estimeret Cashflow",
            bankrupt_warning: "KONKURS FARE!",
            income_5m: "Indkomst (5m)",
            salary_5m: "Lønudgifter (5m)"
        }
    },

    // --- STRUCTURAL ITEMS (Config Localization) ---
    items: {
        hash: { name: "Hash (1g)", desc: "En pind", aliases: ["Ryger", "Brun"] },
        studie_speed: { name: "Studie-Speed", desc: "Ritalin", aliases: ["Krydderier", "Vitaminer"] },
        skunk: { name: "Skunk (1g)", desc: "Kvali-røg", aliases: ["Klump", "Afghaner"] },
        amfetamin: { name: "Amfetamin (10g)", desc: "Gade-Speed", aliases: ["Kridt", "Tempo"] },
        mdma: { name: "MDMA (10g)", desc: "Emma", aliases: ["Emma", "Kærlighed"] },
        ketamin: { name: "Ketamin (10g)", desc: "Hest", aliases: ["Hest", "Special K"] },
        kokain: { name: "Kokain (50g)", desc: "Sne", aliases: ["Sne", "Drys"] },
        benzos: { name: "Benzos (1000p)", desc: "Krydser", aliases: ["Sovepiller", "Hjul"] },
        svampe: { name: "Svampe (200g)", desc: "Hatte", aliases: ["Champier", "Trip"] },
        oxy: { name: "Oxy (500p)", desc: "Hillbilly Heroin", aliases: ["Blå"] },
        heroin: { name: "Heroin (500g)", desc: "Brun", aliases: ["Hest"] },
        fentanyl: { name: "Fentanyl (500g)", desc: "Døden", aliases: ["Dræberen"] }
    },
    staff: {
        grower: { name: "Gartner", desc: "Dyrker både Hash og Skunk" },
        chemist: { name: "Kemiker", desc: "Koger Speed og andet godt" },
        importer: { name: "Smugler", desc: "Henter varer hjem fra udlandet" },
        labtech: { name: "Laborant", desc: "Syntetiserer det helt tunge stads" },
        junkie: { name: "Zombie", desc: "Arbejder for fixet. Har ingen fremtid." },
        accountant: { name: "Revisor", desc: "Vasker automatisk sorte penge (5%/sek)" },
        pusher: { name: "Pusher", desc: "Sælger småting på gadehjørnet" },
        distributor: { name: "Distributør", desc: "Leverer til klubber og fester" },
        trafficker: { name: "Bagmand", desc: "Styrer salget af de tunge varer" },
        lawyer: { name: "Advokat", desc: "Effektiv. Holder Osten væk." },
        // New staff UI translations
        roster_title: "Personale",
        tier: "Niveau",
        requires_level: "Kræver Niveau",
        daily_salary: "Daglig Løn",
        hired: "Ansat",
        production_rate: "Produktionshastighed",
        specialties: "Specialer",
        hiring_cost: "Ansættelsesomkostning",
        fire_one: "Fyr én",
        hire_staff: "ANSÆT PERSONALE",
        select_staff: "Vælg et personalemedlem",
        total_staff: "Samlet Personale",
        click_to_manage: "Klik for at Administere",
        select_department: "Vælg en afdeling ovenfor for at ansætte/fyre personale",
        categories: {
            production: { name: "Produktion", desc: "Dyrkning og fremstilling af varer." },
            sales: { name: "Salg & Distribution", icon: "fa-truck-fast", desc: "Få varerne ud på gaden." },
            security: { name: "Sikkerhed", icon: "fa-shield-halved", desc: "Beskyt dine værdier mod politi og rivaler." },
            admin: { name: "Administration", icon: "fa-building-user", desc: "Hvidvask og juridisk bistand." }
        }
    },
    upgrades: {
        warehouse: { name: "Boxit-Rum", desc: "Dobbelt lagerkapacitet." },
        hydro: { name: "Gro-Lamper", desc: "+50% fart på Hash produktion." },
        lab: { name: "Uni-Lab Setup", desc: "+50% fart på Kemisk produktion." },
        studio: { name: "Front-Butik", desc: "+50% Hastighed & +20% Effektivitet." },
        network: { name: "EncroChat", desc: "-25% Heat fra salg via kryptering." },
        deep_wash: { name: "Deep-Wash Server", desc: "+20% Hvidvask-hastighed & passiv vask." }
    },
    defense: {
        guards: { name: "Vagtværn", desc: "Lokale rødder med veste" },
        cameras: { name: "Skygge-Øjne", desc: "Droner og kameraer i lygtepæle" },
        bunker: { name: "Safehouse", desc: "Hemmelig kælder under en kiosk" }
    },
    districts: {
        nurrebro: { name: "Nørrebro Master", bonus: "-20% Speed Cost" },
        city: { name: "City Shark", bonus: "-15% Bribe Cost" },
        vestegnen: { name: "Vestegnen King", bonus: "+15% Production Speed" }
    },
    territories: {
        christiania: { name: "Staden" },
        nurrebro: { name: "Blågårds Plads" },
        nordvest: { name: "Møntmestervej" },
        vesterbro: { name: "Halmtorvet" },
        city: { name: "Slotsholmen" },
        frederiksberg: { name: "Gammel Kongevej" },
        vestegnen: { name: "Brøndby Strand" },
        glostrup: { name: "Glostrup Center" },
        ishoj: { name: "Ishøj Station" },
        hellerup: { name: "Strandvejen" }
    },
    luxury: {
        penthouse: { name: "Luksus Penthouse (Cph K)", desc: "Indbegrebet af succes." },
        yacht: { name: "Super Yacht (Frihavnen)", desc: "Din egen flydende fæstning." },
        jet: { name: "Gulfstream G650 (Kastrup)", desc: "Flyv under radaren." },
        ghostmode: { name: "Ghost Protocol System", desc: "Avanceret anti-overvågning." },
        island: { name: "Privat Ø (Caribien)", desc: "Det ultimative end-game." }
    },
    premium: {
        time_skip_1: { name: "Tidsmaskine (4t)", desc: "Spol 4 timer frem i tiden." },
        hype_boost_1: { name: "Influencer Pack", desc: "+100% Salgspriser (Hype)." },
        heat_clear: { name: "Bestikkelse", desc: "Fjern alt Heat øjeblikkeligt." },
        diamond_pack_s: { name: "Starter Pack", desc: "Få 50.000 kr i Rene Penge." },
        logs: {
            no_diamonds: "Ikke nok Diamanter! Du mangler {cost}.",
            time_warp: "Tidsmaskine aktiveret! Spol {hours}t frem...",
            activated: "{name} aktiveret!",
            heat_cleared: "Alt Heat fjernet! Du er ren igen.",
            currency_received: "Du modtog {amount} kr!"
        }
    },
    perks: {
        heat_reduce: { name: "Gade-Diplomati", desc: "-5% Heat Generering" },
        raid_defense: { name: "Sikkerheds-Døre", desc: "+10% Forsvar mod Razzia" },
        boss_dmg: { name: "Skarpskytter", desc: "+10 Boss Skade" },
        rival_smash: { name: "Gade-Krigere", desc: "-20% Rival Omkostninger" },
        launder_speed: { name: "Hvidvask Eksperter", desc: "+10% Hvidvask Hastighed" },
        sales_boost: { name: "Markedsføring", desc: "+10% Salg" },
        prod_speed: { name: "Optimering", desc: "+10% Produktion" },
        xp_boost: { name: "Mentor", desc: "+20% XP" },
        shadow_network: { name: "Skygge Netværk", desc: "-10% Heat Generering" },
        laundering_mastery: { name: "Hvidvask Mester", desc: "+5% Effektivitet" },
        politician: { name: "Lobbyist", desc: "5.000 kr / 5m Passiv Indkomst" },
        rival_insider: { name: "Insider Viden", desc: "Se Rival Styrke" },
        offshore_accounts: { name: "Offshore Konto", desc: "Behold 5% af Kontanter ved Reset" }
    },
    mastery: {
        title: "Mastery Shop",
        subtitle: "Permanente opgraderinger",
        active: "Aktiv",
        unlock: "Lås op",
        titan_prod: { name: "Titan Produktion", desc: "+15% Global Hastighed" },
        market_monopoly: { name: "Markedsmonopol", desc: "+15% Salgsmargin" },
        ghost_ops: { name: "Spøgelsesoperationer", desc: "+35% Heat Nedgang" },
        diamond_network: { name: "Diamant Netværk", desc: "Dobbelt Sultan XP" }
    },
    achievements: {
        first_blood: { name: "Gade Sælger", desc: "Tjen din første million (1.000.000 kr) i Sorte Penge" },
        clean_house: { name: "Hvidvasker", desc: "Vask 10.000.000 kr totalt" },
        king_of_streets: { name: "Kongen af Gaden", desc: "Ejer alle 5 territorier" },
        escobar: { name: "Escobar", desc: "Producér 1.000 enheder Kokain" },
        untouchable: { name: "Urørlig", desc: "Nå 0% Heat mens du har 1.000.000 kr" },
        prestige_one: { name: "Exit Scam", desc: "Genstart dit imperium" },
        diamond_hands: { name: "Diamond Hands", desc: "Ejer mindst 10 Bitcoin" },
        clean_hands: { name: "Rene Hænder", desc: "Hav 1 mio kr i Rene Penge og 0 kr Sorte Penge" },
        hoarder: { name: "Lagerforvalter", desc: "Fyld dit lager" },
        veteran: { name: "Gade-Veteran", desc: "Spil i 10 timer" },
        locked_desc: "Lås op for at se denne bedrift."
    },

    // --- INTERACTIVE & MISC ---
    network_interactive: {
        actions: { drive_by: "Drive-By", bribe: "Bestik Politi", raid: "Plyndr Lager", heat_wipe: "Fjern Heat", buy_area: "Køb Territorie", upgrade: "Opgrader", select_special: "Vælg Speciale" },
        overlay: { shakedown: "Afpresning", attack: "Under Angreb!", strength: "Styrke", defend_safe: "Forsvar", defend_merc: "Lej Lejesvende", rival_occ: "Besat af Rival", liberate: "Befri Territorie" },
        stats: { income: "Indkomst", base: "Basis", mult: "Multiplikator", next: "Næste Level" },
        logs: {
            drive_by: "Drive-by udført! {cash} kr stjålet fra {district}.",
            bribe: "Politiet bestukket i {district}. Heat reduceret.",
            stash_raid: "Lager plyndret i {district}! Fandt {cash} kr.",
            heat_wipe: "Kingpin forbindelser brugt. Heat fjernet.",
            shakedown: "Afpresning i {district}: Indsamlet {amount} kr.",
            conquer: "Territorium Erobret: {district}",
            liberate: "Territorium Befriet: {district}",
            defend_win: "Forsvar Succesfuldt i {district}!",
            defend_loss: "Forsvar Fejlet i {district}. Territorium tabt."
        },
        ops_desc: {
            drive_by: "Spred kaos hos rivalerne. Reducerer deres styrke.",
            bribe: "Brug forbindelser til at fjerne politiets opmærksomhed.",
            raid: "Hurtigt angreb for at stjæle kontanter. Risiko for Heat.",
            heat_wipe: "Brug din ultimative magt til at slette alle spor."
        }
    },
    rivals_interactive: {
        defense: {
            guards: { name: "Vagtværn", desc: "Lokale rødder med veste" },
            cameras: { name: "Skygge-Øjne", desc: "Droner" },
            bunker: { name: "Safehouse", desc: "Hemmelig kælder" }
        },
        logs: {
            sabotage: "Sabotage udført! Rival svækket.",
            raid: "Raid udført! {loot} kr stjålet.",
            strike: "Angreb iværksat! Rivalens styrke reduceret."
        },
        wars: {
            copy_success: "ID kopieret",
            search_success: "Rival fundet: {name}",
            search_fail: "Ingen rival fundet",
            challenge_sent: "Udfordring sendt!",
            error_input_not_found: "Input fejl",
            error_empty: "Indtast ID",
            error_invalid: "Ugyldig Kode"
        }
    },
    finance_interactive: {
        logs: {
            crypto_buy: "Købte {amount}x {coin} for {cost} kr",
            crypto_sell: "Solgte {amount}x {coin} for {value} kr",
            deposit: "Indsatte {amount} kr",
            withdraw: "Hævede {amount} kr",
            borrow: "Lånte {amount} kr",
            repay: "Afbetalte {amount} kr"
        }
    },

    // --- GENERIC ---
    sultan_greetings: {
        level_1: "Bror, velkommen til Nørrebro.",
        level_2: "Du klarer det ikke dårligt.",
        level_5: "Vores venner kender dit navn.",
        level_10: "Sultanen har altid en plads til dig.",
        default: "Hvad har du til mig?"
    },
    rival_profiles: {
        lille_a: "Lille A: Aggressiv. Skyder først.",
        baronen: "Baronen: Ejer City. Angriber hvidvask.",
        onkel_j: "Onkel J: Gammel skole. Tager territorier."
    },


    settings: {
        title: "System Indstillinger",
        hard_reset: "Nulstil Alt",
        hard_reset_desc: "Sletter alt data permanent",
        export_save: "Eksportér Save",
        import_save: "Importér Save",
        language: "Sprog",
        format: "Talformat",
        format_desc_sci: "Videnskabelig (1.2e6)",
        format_desc_std: "Standard (1.2M)",
        particles: "Effekter",
        particles_desc_on: "Til (Bedre oplevelse)",
        particles_desc_off: "Fra (Bedre ydelse)",
        sound: "Lyd",
        mute: "Lydløs",
        unmute: "Slå Lyd Til",
        sound_desc_muted: "Lydløs",
        sound_desc_active: "Aktiv",
        on: "TIL",
        off: "FRA"
    },
    language_selector: {
        title: "Vælg Sprog",
        choose: "Vælg sprog",
        danish: "Dansk",
        english: "English",
        danish_desc: "Original experience",
        english_desc: "International version"
    },
    territories: {
        christiania: { name: "Christiania" },
        nurrebro: { name: "Nørrebro" },
        nordvest: { name: "Nordvest" },
        vesterbro: { name: "Vesterbro" },
        city: { name: "Indre By" },
        frederiksberg: { name: "Frederiksberg" },
        vestegnen: { name: "Vestegnen" },
        glostrup: { name: "Glostrup" },
        ishoj: { name: "Ishøj" },
        hellerup: { name: "Hellerup" }
    },
    logs: {
        story: { mercy: "SULTANEN VISER NÅDE: 'Du er ny. Her er lidt startkapital.'" },
        payroll: {
            paid: "Betalte løn til {count} ansatte ({cost} kr.)",
            paid_dirty: "Betalte løn med Sorte Penge (+50% straf)",
            strike_title: "LØNNINGS DAG FEJLEDE",
            strike_msg: "Strejke! De mangler {cost} kr i løn."
        },
        bank: { interest: "Renter: +{amount} kr." },
        market: {
            bull: "MAAAAARKEDET GÅR AMOK! (BULL MARKET)",
            bear: "Markedet krakker! (BEAR MARKET)"
        },
        crypto: {
            crash_btc: "📉 BLOCKCHAIN CRASH: {name} falder!",
            dump: "KRYPTO DUMP: {name} taber værdi!"
        },
        finance: {
            launder_amount_error: "Ugyldigt beløb",
            launder_funds_error: "Ikke nok Sorte Penge",
            launder_success: "Hvidvasket {dirty} kr -> {clean} kr",
            funds_error: "Ikke nok penge!",
            asset_error: "Ikke nok aktiver!",
            crypto_buy: "Købt {amount} {symbol}",
            crypto_sell: "Solgt {amount} {symbol} for {value} kr",
            borrow: "Lånte {amount} kr",
            repay: "Afbetalte {amount} kr",
            deposit: "Indsat {amount} kr",
            withdraw: "Hævet {amount} kr",
            bank_cap: "Bank loft nået"
        },
        staff: {
            hire_level: "Kræver Level {level} for {name}!",
            hired: "Ansatte {amount}x {name}",
            fired: "Fyrede {amount}x {name}",
            mole: "⚠️ MULVARPE!",
            funds_error: "Ikke nok penge!"
        },
        upgrades: {
            bought: "Købte {amount}x {name}",
            funds_error: "Ikke nok penge!"
        },
    },
    ranks: {
        0: "Gade-Pusher",
        1: "Lokal Boss",
        2: "Bydels-Konge",
        3: "Grossist",
        4: "Kartel-Medlem",
        5: "Baron",
        6: "Kingpin",
        7: "Syndikat-Leder",
        8: "Gudfar",
        9: "SULTAN",
        10: "Legende",
        11: "Myte",
        12: "Imperator",
        13: "Titan",
        14: "Gud",
        15: "Skygge-Herre",
        16: "Usynlig Magt",
        17: "Evig Regent",
        18: "Absolut Hersker",
        19: "UDØDELIG"
    },
    boss_modal: {
        your_hp: "Dit HP",
        boss_hp: "Boss HP",
        enraged: "RASENDE",
        taunt: "\"Kom an!\"",
        attack_btn: "ANGRIB!",
        speed_bonus: "⚠️ Boss angriber hvert {rate}s! | Fart bonus: Vind på <30s for +50% loot"
    },
    briefcase: {
        money_log: "GRATIS PENGE: {amount} kr!",
        heat_log: "BEVISER FJERNET. Heat -20.",
        buff_log: "HYPE MODE: Salg fordoblet!",
        money_float: "+{amount} kr",
        heat_float: "-20 Heat",
        buff_float: "HYPE MODE!"
    },
    offline_report: {
        title: "DRIFTSRAPPORT",
        time: "Tid: {minutes} min",
        production_title: "Produktion",
        security_title: "Sikkerhed",
        raids: "Razziaer",
        defended: "Afværget",
        failed: "MISLYKKEDES",
        finance_title: "Regnskab",
        dirty_income: "Sorte Penge",
        clean_income: "Hvide Penge",
        laundered_sub: "Hvidvasket",
        salaries: "Lønninger",
        interest: "Renter",
        net: "NETTO",
        close_btn: "GODKEND",
        quote: "\"Forretning er forretning.\" — Sultanen"
    },
    news: {
        system_ready: "System initialiseret.",
        impact_distortion: "DISTORTION: MDMA/Speed salg ++",
        impact_roskilde: "ROSKILDE: Coke/Hash salg ++",
        impact_christmas: "JULEFROKOST: Coke salg ++",
        impact_christiania_raid: "RAZZIA: Hash priser --",
        impact_border: "GRÆNSEKONTROL: Supply --",
        impact_police: "POLITI-AKTION: Pushere i skjul",
        impact_drought: "VINTER TØRKE: Import dyrt",
        impact_crypto_crash: "KRYPTO KRAK: Hvidvask billigt",
        impact_eth_surge: "ETH STIGER: Hvidvask dyrt",
        local_nurrebro: "Nørrebro: Gadefest lukker gaderne.",
        local_vesterbro: "Vesterbro: Kødbyen fester hele natten.",
        local_northwest: "Nordvest: Politiet er massivt til stede.",
        local_amager: "Amager: Rolig dag på øen.",
        local_sydhavnen: "Sydhavnen: Nye byggerier tiltrækker rige købere.",
        local_christiania: "Staden: Turister flokkes til Pusher Street.",
        local_istedgade: "Istedgade: Vesterbro-stemning, men pas på.",
        local_outskirts: "Forstaden: Intet nyt er godt nyt.",
        weather_gray: "Gråvejr.",
        rumor_viagra: "Sælger panodiler som viagra.",
        metro_down: "Metro nede.",
        sultan_shawarma: "Sultanen giver shawarma.",
        mom_call: "Din mor ringer...",
        influencer_heat: "Influencer booster dit heat.",
        rival_tag: "Graffiti på dit tag.",
        junkie_buy: "Kæmpe køb fra junkie.",
        power_outage: "Strømsvigt.",
        dog_patrol: "Hundepatrulje.",
        season_summer: "Sommer salg.",
        season_winter: "Vinter hygge.",
        season_payday: "Lønningsdag.",
        season_blue_monday: "Blå Mandag.",
        tech_silkroad: "Rygtet om SilkRoad.",
        tech_phones: "Nye telefoner.",
        tech_atm: "ATM ude af drift.",
        tech_hacker: "Hacker tjenester.",
        event_auction: "Politiauktion.",
        event_corrupt_cop: "Korrupt betjent.",
        flavor_accountant: "Revisoren er glad.",
        flavor_quality: "God kvalitet.",
        flavor_rival_guards: "Nye vagter hos rival.",
        flavor_sultan_vodka: "Vodka fra Sultanen.",
        flavor_taxi_cash: "Penge i taxa.",
        flavor_mailbox: "Postkasse stjålet.",
        flavor_gov_legal: "Legalisering snak.",
        flavor_netflix: "Ingen Netflix, kun profit.",
        absurd_market: "MARKEDET AMOK!",
        absurd_wanted: "EFTERLYST: Rival.",
        absurd_radar: "RADAR ALERT.",
        absurd_suspicious: "Mistænkelig varevogn.",
        absurd_lawyer: "Advokat reklame.",
        absurd_eth_dump: "ETH DUMP.",
        absurd_xmr_dump: "XMR DUMP.",
        absurd_btc_surge: "BTC MOON.",
        absurd_btc_stable: "BTC STABIL.",
        absurd_system: "SYSTEM OK.",
        absurd_maintenance: "SERVER VEDLIGEHOLD.",
        absurd_mayor: "NY BORGMESTER.",
        absurd_weather: "VEJR ALERT."
    },
    events: {
        territory_lost_level: "Territorium {id} tabt! Du mistede kontrollen.",
        territory_looted: "Territorium {id} plyndret! Du mistede penge.",
        boss_spawn_title: "BOSS KAMP!",
        boss_spawn_msg: "En rival Boss har taget gaden! (Level {level} Boss)",
        drive_by_msg: "Rivaler åbnede ild. Du mistede {cash} kr.",
        raid_won_title_high: "RAZZIA AFVÆRGET!",
        raid_won_title_low: "POLITIET SENDT HJEM",
        raid_won_msg_auto: "Dine folk klarede dem. Ingen mistet.",
        raid_won_msg_def: "Forsvaret holdt stand. Vi er sikre.",
        raid_lost_title_high: "STOR RAZZIA!",
        raid_lost_title_low: "RAZZIA!",
        raid_lost_msg: "Politiet tog {cash} kr og {product} enheder {type}.",
        critical_heat: "KRITISK HEAT! Politiet er på vej!",
        high_heat: "Højt Heat. Pas på.",
        raid_lost_hardcore_msg: "GAME OVER. Politiet tog alt. {cash} kr beslaglagt."
    },

    active_feed: {
        level_up: "Level {level} nået! Du er nu {rank}."
    },

    tutorial: {
        header: "LIVE ASSISTANT",
        step_label: "TRIN",
        status: "STATUS",
        step1: {
            title: "MÅL: PRODUKTION",
            text: "Køb 25x Hash i 'Produktion' fanen.",
            sub: "Klik på Hash-ikonet for at producere."
        },
        step2: {
            title: "MÅL: GADESALG",
            text: "Sælg 25 enheder for at tjene Sorte Penge.",
            sub: "Brug 'Sælg Alt' knappen i toppen."
        },
        step3: {
            title: "MÅL: HVIDVASK",
            text: "Vask 500kr i 'Finans' fanen.",
            sub: "Sorte Penge kan ikke bruges til alt."
        },
        step4: {
            title: "MÅL: ORGANISATION",
            text: "Ansæt en Pusher i 'Organisation' fanen.",
            sub: "Han sælger automatisk for dig."
        }
    },

    // Fallback for missions if nested badly previously
    missions: {
        m1: { title: "Første Levering", text: "Velkommen til gaden, bror. En junkie har brug for et fix. Gå til <b>Laboratoriet</b> og lav 25x Hash. Tjep tjep." },
        m2: { title: "Gadeplan", text: "Godt. Men lager betaler ikke husleje. Sælg lortet for at få Sorte Penge. Pas på varmen!" },
        m3: { title: "Vaskeriet", text: "Du har Sorte Penge, men kan ikke købe jakkesæt for dem. Gå til <b>Finans</b> og vask dem til Ren Kapital." },
        m4: { title: "Organisation", text: "Du ser travl ud. Ansæt en 'Pusher' under <b>Operationer</b> til at sælge for dig, så vi kan fokusere på de store træk." },
        m5: { title: "Kvalitetskontrol", text: "Kunderne vil have det gode stads. Dyrk noget Skunk. Det er tungere, dyrere og varmere." },
        m5b: { title: "Logistik", text: "Kælderen er fuld af kasser. Køb et <b>Boxit-Rum</b> (Opgraderinger) før lortet rådner." },
        m6: {
            title: "Indtag Byen",
            text: "Hipstere i Kødbyen betaler ekstra. Hvis du Investerer i et Territorie (Gaden fanen), ejer vi blokken.",
            choices: {
                0: { text: "Send drengene (+25 Heat)" },
                1: { text: "Bestik vagter (-5.000 kr)" }
            }
        },
        m7: { title: "Det Blå Lyn", text: "Lastbilchauffører mangler energi. Ansæt en Kemiker og kog noget Speed." },
        m8: { title: "Gadekriger", text: "Få det ud på gaden. Jeg vil se kontanter, habibi! Sælg 500 enheder totalt." },
        m9: { title: "Nordvest Netværk", text: "Nordvest er en guldmine. Invester i flere territorier for at sikre passiv indkomst." },
        m10: { title: "Vagtværnet", text: "Rivalerne kigger med. Ansæt 5 vagter til at beskytte dit hovedkvarter." },
        m11: { title: "Hvidvask Kongen", text: "Vi har for mange sorte penge. Vask 100.000 kr for at bevise at du kan håndtere flowet." },
        m12: {
            title: "Frihavnen",
            text: "Glem lokal produktion. Import er fremtiden. Få en <b>Smugler</b> til at hente containere hjem.",
            choices: {
                0: { text: "Tag chancen (50% for +50k kr / +20 Heat)" },
                1: { text: "Spil sikkert" }
            }
        },
        m13: { title: "Det Hvide Guld", text: "Sne. Det Hvide Guld. Overklassen har brug for det. Producer 100 enheder." },
        m14: { title: "Advokaten", text: "Osten er varm. Få fat i en slesk Advokat. En der kan holde varmen nede mens vi vokser." },
        m15: { title: "Nattelivets Konge", text: "Tag kontrol over byens natteliv. Vi skal eje 4 store territorier nu." },
        m16: { title: "Fronten", text: "Vi har brug for en ægte facade. Køb <b>Front-Butik</b> opgraderingen for at gøre hvidvask mere effektiv." },
        m17: { title: "Kartel Status", text: "Vi er ikke længere en bande. Vi er et kartel. Fyld lageret med coke." },
        m18: { title: "Det Store Kup", text: "Hellerup. Hvor penge og magt bor. Køb den sidste investering og vis dem hvem der bestemmer." },
        m19: {
            title: "Safehouse",
            text: "Rivalerne planlægger noget stort. Byg et <b>Safehouse</b> for at sikre din overlevelse.",
            choices: {
                0: { text: "Slå først (+50 Heat)" },
                1: { text: "Defensiv (Gør intet)" }
            }
        },
        m20: { title: "Legenden", text: "Du ejer denne by, bror. Der er ikke mere tilbage at vinde... medmindre du vil starte forfra med endnu mere magt?" }
    },
    help: {
        sidebar: {
            title: "Håndbog",
            welcome: "Kom Igang",
            mechanics: "Systemer",
            quickref: "Hurtig Info",
            faq: "FAQ",
            strategy: "Strategier",
            math: "Formler",
            tools: "Værktøjer",
            troubleshooting: "Support",
            social: "Community",
            updates: "v1.1.3 Noter",
            keys: "Genveje",
            system_status: "SYSTEM",
            close_btn: "Luk Håndbog"
        },
        welcome: {
            title: "Velkommen til <span class=\"text-theme-primary\">Underverdenen</span>.",
            intro: "Troede du det ville være nemt? At tjene penge på gaden? <br /> Glem det. Dette er ikke et spil. Det er en <b>økonomisk simulation</b> af organiseret kriminalitet.",
            goal_title: "DIT MÅL",
            goal_text: "Start med intet på Nørrebrogade. Byg et imperium der styrer hele København.<br />Du skal balancere tre valutaer: <span class=\"text-theme-text-primary font-bold\">Penge</span>, <span class=\"text-theme-danger font-bold\">Heat</span>, og <span class=\"text-theme-warning font-bold\">Respekt</span>.",
            quote: "\"Rigtige gangstere bruger ikke våben. De bruger regneark.\" — Sultanen"
        },
        mechanics: {
            title: "SYSTEM KERNE",
            subtitle: "Sådan overlever du det daglige grind.",
            sultan_title: "1. Sultanen (Hub)",
            sultan_text: "Din mentor og opgavegiver. Tjek <b>Nyhedsstrømmen</b> for markedstrends (f.eks. \"Roskilde Festival\" = højere priser).",
            prod_title: "2. Produktion & Salg",
            prod_text: "Gå til <b>Produktion</b> for at lave varer. Hash er sikkert, Coke er profitabelt. Ansæt <b>Pushere</b> i <b>Operationer</b> for at sælge automatisk.<br />Følg din <b>Live Assistant</b> (nederst til højre) for næste skridt.",
            fins_title: "3. Finans & Hvidvask",
            fins_text: "<b>Sorte Penge</b> kan bruges til lønninger og bestikkelse. <b>Rene Penge</b> (hvidvasket) bruges til investeringer og ejendom. Brug <b>Revisorer</b> eller <b>Krypto</b> (BTC/XMR) til at vaske penge.",
            spec_title: "4. Territorie Specialisering",
            spec_text: "Når et territorie når <b>Level 5</b>, kan du vælge en specialisering:<br /><span class=\"text-theme-success font-bold\">SafeHouse:</span> +25% Forsvar.<br /><span class=\"text-theme-primary font-bold\">Front:</span> Reducerer Global Heat Generering (-10%).<br /><span class=\"text-theme-warning font-bold\">Lager:</span> +100 ekstra lagerplads pr. level."
        },
        math: {
            title: "ALGORITMEN",
            subtitle: "Til nørderne. Her er matematikken bag systemet.",
            cost_title: "// EKSPONENTIEL OMKOSTNING",
            cost_formula: "Pris(n) = BasePris * (VækstFaktor ^ NuværendeAntal)",
            cost_desc: "VækstFaktor varierer fra 1.15 (Junkies) til 2.5 (Cyber-Security). Det betyder at du aldrig kan \"købe alt\". Du skal vælge din strategi.",
            heat_title: "// HEAT ALGORITME",
            heat_formula: "HeatGen = (BaseGain * Aktivitet) * (1 - ForsvarsBuffs)",
            heat_desc: "Heat falder passivt baseret på: <code class=\"text-theme-text-primary\">1.0 + (Advokater * 0.15)</code>. Hvis Heat når 100, mister du 25% af dine penge. I <b>Hardcore Mode</b> slettes dit save permanent.",
            fee_title: "// MELLEMMANDS GEBYR",
            fee_formula: "Bestikkelse = SortePenge(50k) + RenePenge(Pris * 0.10)",
            fee_desc: "Du kan ikke bestikke strissere med narkopenge alene. Du har brug for \"rene\" forbindelser."
        },
        strategy: {
            title: "Gade Visdom",
            subtitle: "Tre veje til toppen. Vælg din stil.",
            hustler_title: "Hustleren",
            hustler_desc: "<b>Stil:</b> Aktiv & Aggressiv.<br />Klik hurtigt. Køb mange små enheder (Hash/Piller). Hold Heat lavt ved konstant at sælge små mængder. Ignorer langsigtede investeringer.",
            kingpin_title: "Kongen",
            kingpin_desc: "<b>Stil:</b> Passiv & Skalering.<br />Rush til Level 10. Brug <b>Revisorer</b> til at automatisere alt. Køb <b>Hellerup</b> territoriet for ren indkomst og lad spillet køre i baggrunden mens du tjener millioner.",
            ghost_title: "Spøgelset",
            ghost_desc: "<b>Stil:</b> Stealth & Krypto.<br />Spil markedet. Køb Bitcoin når det crasher. Hold 0 Heat. Brug <b>Privatfly</b> og <b>Skygge Netværk</b> til aldrig at blive fanget."
        },
        quickref: {
            title: "Hurtig Info",
            subtitle: "Cheat sheet til kritiske mekanikker",
            heat_title: "🚨 Heat Grænser",
            heat_safe: "✓ SIKKER",
            heat_caution: "⚠ FORSIGTIG (60%)",
            heat_danger: "⚡ FARE (70%, -50% prod)",
            heat_critical: "💀 KRITISK (90%, -80% prod)",
            wash_title: "💰 Hvidvask Rater",
            wash_manual: "10% rate, 30% gebyr",
            wash_accountant: "5%/sek auto-vask",
            wash_crypto: "Markedsafhængig",
            wash_sultan: "Altid -30%",
            time_title: "⏰ Tidsbaserede Events",
            time_payroll: "Hvert <span class=\"text-theme-text-primary\">5. minut</span>",
            time_territory: "Hvert <span class=\"text-theme-text-primary\">sekund</span>",
            time_loyalty: "+1% pr. <span class=\"text-theme-success\">dag</span>",
            time_interest: "0.5% hver <span class=\"text-theme-text-primary\">5. min</span>",
            milestone_title: "📊 Progression Milepæle",
            ms_lvl2: "Lås op for <span class=\"text-theme-text-primary\">Skunk</span>",
            ms_lvl5: "Lås op for <span class=\"text-theme-text-primary\">Territorier</span>",
            ms_lvl7: "Lås op for <span class=\"text-theme-text-primary\">Cokain</span>",
            ms_lvl10: "Lås op for <span class=\"text-theme-success\">Prestige</span>",
            tips_title: "💡 Pro Tips",
            tip1: "Hav altid nok rene penge til næste løn.",
            tip2: "Ansæt 1 Advokat for hver 10 Pushere for at styre heat.",
            tip3: "Opgrader lager FØR du ansætter flere producenter.",
            tip4: "Brug 'Sælg Alt' knappen forsigtigt - det giver massivt heat.",
            tip5: "Tjek nyhedsticker for markedsevents (festivaler = pris boost)."
        },
        faq: {
            title: "Ofte Stillede Spørgsmål",
            subtitle: "Svar på det meste",
            q1: "❓ Hvorfor har jeg ikke råd til noget?",
            a1: "Du skal bruge <b>Rene Penge</b> til de fleste køb. Sorte penge fra salg skal vaskes først. Gå til <b>Finans</b> fanen og brug Vaskeriet eller ansæt Revisorer.",
            q2: "❓ Hvorfor stoppede min produktion?",
            a2: "To almindelige årsager:<br />1. <b>Lager Fyldt:</b> Opgrader dit lager i Operationer.<br />2. <b>Løn Ikke Betalt:</b> Dine ansatte strejker. Betal dem manuelt via 'BETAL LØN' knappen.",
            q3: "❓ Mister jeg fremskridt offline?",
            a3: "Nej! Spillet kører videre offline. Når du kommer tilbage, ser du en <b>Offline Rapport</b>. Produktion, salg og territorie-indkomst fortsætter. Raids er DEAKTIVERET offline.",
            q4: "❓ Hvordan bekæmper jeg rivaler?",
            a4: "Gå til <b>Underverdenen</b> fanen. Du kan:<br />• <b>Sabotere:</b> Reducer deres styrke sikkert.<br />• <b>Raide:</b> Stjæl sorte penge (30s cooldown).<br />• <b>Bandekrig:</b> Totalt angreb (høj risiko).",
            q5: "❓ Hvad er forskellen på Rank og Level?",
            a5: "Det er det samme! Dit <b>Level</b> giver dig også en <b>Rank Titel</b> (Gadepusher → Kingpin). Hvert level åbner nye produkter og missioner.",
            q6: "❓ Hvordan virker Prestige?",
            a6: "Ved Level 10+ kan du lave <b>Exit Scam</b> (nulstil) for at få:<br />• Permanent indkomst multiplier.<br />• Prestige Tokens til stærke perks.<br />• Hurtigere progression næste gang."
        },
        tools: {
            title: "Værktøjer & Debug",
            subtitle: "Avancerede funktioner til power users",
            save_title: "💾 Save Management",
            save_desc: "Spillet gemmer automatisk hvert 30. sekund. Brug Indstillinger (⚙️) til at:",
            save_li1: "<b>Eksporter Save:</b> Kopier din save-kode (backup!).",
            save_li2: "<b>Importer Save:</b> Gendan fra en kode.",
            save_li3: "<b>Hard Reset:</b> Slet alt og start forfra.",
            trouble_title: "🐛 Fejlfinding",
            trouble_li1: "<b>Spillet loader ikke?</b> Ryd browser cache (Ctrl+Shift+R)",
            trouble_li2: "<b>Mærkelige tal?</b> Tjek om browser extensions driller",
            trouble_li3: "<b>Laggy?</b> Luk andre faner, slå animationer fra",
            trouble_li4: "<b>Mistet progress?</b> Incognito mode gemmer ikke!",
            mobile_title: "📱 Mobil Tips",
            mobile_li1: "Installer som App (PWA) for bedste performance",
            mobile_li2: "Brug liggende tilstand på tablets",
            mobile_li3: "Game loop kører i baggrunden som app",
            warn_title: "⚠️ Kendte Fejl",
            warn_desc: "Nogle mobilbrowsere pauser spillet når fanen er inaktiv."
        },
        support: {
            title: "Hjælp & Support",
            subtitle: "Få hjælp når du sidder fast",
            docs_title: "📖 Dokumentation",
            docs_li1: "<b>Spilmanual:</b> Tjek wiki'en for detaljer",
            docs_li2: "<b>Strategi Guides:</b> Se 'Strategier' fanen her",
            game_title: "🎮 Gameplay Hjælp",
            game_intro: "Sidder du fast i en mission?",
            game_li1: "Tjek <b>Live Assistant</b> for hints",
            game_li2: "Læs missionsteksten grundigt",
            game_li3: "Tjek om du har den rette valuta (Ren vs Sort)",
            tech_title: "🔧 Teknisk Support",
            tech_desc: "Krav: Chrome 90+, Firefox 88+. <br />Lagring: ~5MB nødvendigt.",
            comm_title: "💬 Community",
            comm_desc: "Wiki: Fuld dokumentation i /wiki folderen.<br />Version: {version} - Platinum+"
        },
        community: {
            title: "Community & App",
            subtitle: "Tag gaden med i lommen.",
            app_title: "Installer Appen",
            app_desc: "Syndicate OS er nu en <b>PWA (Progressive Web App)</b>.",
            app_step1: "Åbn spillet i Chrome (Android) eller Safari (iOS).",
            app_step2: "Tryk på \"Menu\" (tre prikker) eller \"Del\".",
            app_step3: "Vælg <b>\"Føj til Hjemmeskærm\"</b>.",
            app_note: "Nu kan du spille offline uden browserbjælken!",
            wars_title: "Bandekrig (BETA)",
            wars_desc: "Kæmp mod dine venner asynkront via Underverdenen fanen.",
            reviews_title: "Anmeldelser",
            review1: "\"Det føles ægte. For ægte. Slangen, varmen, måden priserne stiger når Roskilde starter.\"",
            review1_author: "\"Eks-Kingpin\", Blågårds Plads",
            review2: "\"Endelig et tycoon spil hvor matematikken holder. Økonomien balancerer perfekt.\"",
            review2_author: "\"System Arkitekt\", Silicon Valley"
        },
        updates: {
            title: "Release Noter",
            subtitle: "Version 1.1.3 - Platinum+ (Dansk Lokalisering)",
            v_title: "🌍 v1.1.3: Fuld Dansk Oversættelse",
            v_desc: "Komplet oversættelse af alt indhold: 20 missioner, 30+ nyheder, alt UI nu på dansk. Nye oversættelses-nøgler tilføjet til alle faner.",
            plat_title: "🏆 Platinum Edition",
            plat_desc: "Komplet visuelt redesign (\"Glass OS\"), konsistent UI, og standardiseret matematik på tværs af spillet.",
            ui_title: "🎨 UI/UX",
            ui_li1: "<b>Glass OS Design:</b> Nyt glassmorphism look.",
            ui_li2: "<b>Responsivt Layout:</b> Bedre mobil oplevelse.",
            bal_title: "⚖️ Balance",
            bal_li1: "<b>Revisor:</b> Billigere (250k → 150k).",
            bal_li2: "<b>Tutorial:</b> Højere krav for bedre pacing.",
            fix_title: "✅ Bug Fixes",
            fix_li1: "Fixede kritisk Heat Bar fejl.",
            fix_li2: "Fixede \"Soft Lock\" i mid-game automation."
        },
        keys: {
            title: "SYSTEM GENVEJE",
            subtitle: "Naviger som en professionel hacker.",
            k1: "Gå til Laboratoriet (Produktion)",
            k2: "Gå til Underverdenen (War Room)",
            k3: "Gå til Finans (Krypto & Bank)",
            k4: "Gå til Operationer (Personale)",
            k5: "Gå til Imperiet (Prestige)",
            k6: "Gå til Sultanen (Missioner)",
            esc: "Luk alle vinduer / Pause menu"
        }
    },
    boss_modal: {
        title: "BOSS KAMP",
        subtitle: "En rival har udfordret dig!",
        hp: "BOSS HP",
        attack: "ANGRIB!",
        retreat: "ABORTÉR (FLUGT)",
        rewards: "Belønning",
        defeat_title: "DU BLEV BESEJRET!",
        defeat_desc: "Bossen var for stærk. Du mistede penge og respekt.",
        win_title: "SEJR!",
        win_desc: "Du besejrede bossen og overtog området!"
    }
};
