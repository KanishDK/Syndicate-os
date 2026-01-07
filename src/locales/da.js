export const da = {
    empire: {
        title: "DIT IMPERIUM",
        subtitle: "\"En dag vil alt dette være støv. Men legenden? Legenden lever evigt.\"",
        mastery: {
            title: "Mastery Shop",
            subtitle: "Permanente opgraderinger for diamanter",
            active: "Aktiv",
            unlock: "Lås op"
        },
        prestige: {
            level: "Prestige Level",
            income_bonus: "Indkomst Bonus",
            permanent_mult: "Permanent Multiplier",
            tokens: "Prestige Tokens",
            currency: "Prestige Tokens"
        },
        lifetime: {
            earnings: "Livstids Indtjening",
            produced: "Produceret (Total)",
            resets: "Prestige Resets",
            value: "Imperie Værdi",
            units: "enheder"
        },
        network: {
            title: "Underverdenens Netværk",
            enforcer: "Enforcer",
            tycoon: "Tycoon",
            forbidden: "Det Forbudte (Unik)",
            upgrade: "Opgrader",
            unlock: "Lås op",
            maxed: "MAXED"
        },
        reset: {
            title: "EXIT SCAM (Prestige Reset)",
            desc: "Nulstil alt fremskridt (Cash, Lager, Bygninger). Behold dine Trophies. Få en permanent indkomst bonus og Prestige Tokens.",
            button: "RESET NU",
            current: "Nuværende",
            required: "Kræver Level 10"
        }
    },
    network_interactive: {
        logs: {
            drive_by: "Drive-by udført! {cash} kr stjålet fra {district}.",
            bribe: "Politiet bestukket. Heat reduceret i {district}.",
            conquer: "Territorium {area} er nu under din kontrol!",
            defend: "Angreb på {area} afværget!"
        },
        actions: {
            buy_area: "Køb Område",
            upgrade: "OPGRADER",
            select_special: "Vælg Speciale",
            locked: "LÅST"
        },
        stats: {
            income: "INDTÆGT / SEK",
            base: "Base",
            mult: "Multiplier",
            next: "Næste Upgrade"
        },
        overlay: {
            attack: "ANGREB",
            strength: "STYRKE",
            defend_safe: "AFVÆRG (GRATIS)",
            defend_merc: "HYR LEJESOLDATER",
            rival_occ: "RIVAL BESÆTTELSE",
            liberate: "BEFRI",
            shakedown: "INDRIV GÆLD"
        }
    },
    rivals_interactive: {
        defense: {
            guards: { name: "Vagtværn", desc: "Lokale rødder med veste" },
            cameras: { name: "Skygge-Øjne", desc: "Droner og kameraer i lygtepæle" },
            bunker: { name: "Safehouse", desc: "Hemmelig kælder under en kiosk" }
        },
        logs: {
            sabotage: "Sabotage udført! Rival svækket.",
            raid: "Raid udført! {loot} kr stjålet.",
            strike: "Angreb iværksat! Rivalens styrke reduceret."
        },
        wars: {
            copy_success: "Syndikat-ID kopieret til udklipsholder",
            search_success: "Rival fundet: {name} (Lvl {level})",
            search_fail: "Ingen rival fundet med det ID",
            challenge_sent: "Udfordring sendt!",
            error_input_not_found: "Input felt ikke fundet",
            error_empty: "Indtast venligst et ID",
            error_invalid: "Ugyldig Kode"
        }
    },
    finance_interactive: {
        logs: {
            crypto_buy: "Købte {amount}x {coin} for {cost} kr",
            crypto_sell: "Solgte {amount}x {coin} for {value} kr",
            deposit: "Indsatte {amount} kr i Sparkassen",
            withdraw: "Hævede {amount} kr fra Sparkassen",
            borrow: "Lånte {amount} kr fra Hajen",
            repay: "Afbetalte {amount} kr på gælden"
        }
    },
    boot: {
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
    active_feed: {
        level_up: "LEVEL OP! Du er nu Rank"
    },
    events: {
        critical_heat: "🚨 KRITISK HEAT! Razzia overhængende! Reducer heat NU!",
        high_heat: "⚠️ HØJ HEAT! Politiet holder øje. Vær forsigtig!",
        raid_won_title_high: "SWAT RAID AFVIST",
        raid_won_title_low: "POLITI KONTROL AFVIST",
        raid_won_msg_auto: "Din Sikkerhedschef fik stoppet razziaen før den startede.",
        raid_won_msg_def: "Dine sikkerhedsforanstaltninger holdt dem ude!",
        hardcore_game_over: "HARDCORE GAME OVER",
        raid_lost_hardcore_msg: "Du blev fanget under en Razzia! Dit imperium falder her.\nBeslaglagt: {cash} kr og {product}x {type}.",
        raid_lost_title_high: "SWAT RAID!",
        raid_lost_title_low: "RAZZIA",
        raid_lost_msg: "Beslaglagt: {cash} kr og {product}x {type}.",
        territory_attack_msg: "⚠️ ALARM: {id} er under angreb!",
        rival_scared: "Rivaler skræmt væk af dine vagter.",
        drive_by_title: "DRIVE-BY!",
        drive_by_msg: "Rivaler skød løs. Du mistede {cash} kr.",
        territory_lost_level: "TERRITORIUM MISTET: {id} mistede et level!",
        territory_looted: "TERRITORIUM PLYNDRET: {id} plyndret for 25.000 kr!",
        boss_spawn_title: "BOSS FIGHT!",
        boss_spawn_msg: "En rivaliserende Boss har indtaget gaden! (Level {level} Boss)",
        achievement_unlocked: "ACHIEVEMENT UNLOCKED",
        offline_hardcore: "HARDCORE: ANGREBET MENS DU SOV!"
    },
    news: {
        weather_gray: "Vejret: Gråt og trist. Perfekt til at lave skejs.",
        rumor_viagra: "Rygte: En ny sending 'Blå Viagra' hitter på plejehjemmene.",
        metro_down: "Metroen er ude af drift. Kunderne kan ikke komme frem.",
        sultan_shawarma: "Sultanen giver en omgang shawarma til drengene.",
        mom_call: "Din mor ringer: 'Hvornår får du et rigtigt arbejde?'",
        influencer_heat: "En influencer flasher dine varer på TikTok. Heat stiger!",
        rival_tag: "Alpha Syndikatet har malet over dit tag. Respektløst.",
        junkie_buy: "En junkie fandt 1000kr og købte hele lageret.",
        power_outage: "Strømafbrydelse i laboratoriet. Produktionen holdt stille i 5 min.",
        dog_patrol: "Hundepatrulje set ved din hoveddør. Falsk alarm... denne gang.",
        season_summer: "Sommer: Alle vil have Coke til terrassen.",
        season_winter: "Vinter: Mørketid. Folk vil bare ryge og se Netflix.",
        season_payday: "Lønningsdag: Folk har penge. Priserne får et lille nyk op.",
        season_blue_monday: "Blå Mandag: Konfirmander i byen. Pas på med at sælge til børn (Heat++).",
        tech_silkroad: "Darkweb markedet 'SilkRoad 4.0' er hacket. Alle er paranoide.",
        tech_phones: "Nye krypterede telefoner ankommet. Sikkerheden er i top.",
        tech_atm: "Bitcoin ATM på Nørrebrogade er ude af drift.",
        tech_hacker: "En hacker tilbyder at slette din straffeattest for 50k.",
        event_auction: "POLITI AUKTION: Lagerudstyr sælges billigt (5.000kr). Klik her!",
        event_corrupt_cop: "KORRUPT BETJENT: 'Jeg sletter dine sager for 10.000kr'. Klik her.",
        flavor_accountant: "Din revisor spørger om kvitteringer for 'gødning'.",
        flavor_quality: "En kunde klager over kvaliteten. 'Det er bare oregano!'.",
        flavor_rival_guards: "Rivalerne har hyret nye vagter. Pas på.",
        flavor_sultan_vodka: "Sultanen er tilfreds. Han sender en flaske vodka.",
        flavor_taxi_cash: "Du fandt en pose penge i en taxa. Held i uheld.",
        flavor_mailbox: "Nabokrig: Nogen har stjålet din postkasse.",
        flavor_gov_legal: "Breaking: Regeringen overvejer legalisering (igen).",
        flavor_netflix: "En Netflix serie om dit liv? Nej, bare paranoia."
    },
    missions: {
        m1: { title: "Første Levering", text: "Velkommen til Gaden, bror. En junkie ved Den Røde Plads mangler skiver. Gå til <b>Produktion</b> og lav 5x Hash. Tjep." },
        m2: { title: "Gadeplan", text: "Godt. Men varer på lageret betaler ikke huslejen. Sælg lortet for at få Sorte Penge. Pas på varmen (Heat)!" },
        m3: { title: "Vaskemaskinen", text: "Du har Sorte Penge, men du kan ikke købe habitter i Netto for dem. Gå til <b>Finans</b> og vask dem til Ren Kapital." },
        m4: { title: "Organisation", text: "Du ligner en der har travlt. Find en 'Pusher' under <b>Operationer</b> til at sælge for dig, så vi kan fokusere på de store numre." },
        m5: { title: "Kvalitetskontrol", text: "Kunderne vil have det gode grej. Dyrk noget Skunk. Det er tungere, dyrere og varmere." },
        m5b: { title: "Logistik", text: "Kælderen flyder med papkasser. Køb et <b>Boxit-rum</b> (Opgraderinger), før varerne rådner op." },
        m6: { title: "Indtag Kødbyen", text: "Hipsterne i Kødbyen betaler overpris. Hvis du Investerer i et Territorie (Netværk fanen), ejer vi blokken.", choices: { 0: { text: "Send drengene (+25 Heat)" }, 1: { text: "Bestik vagterne (-5000 kr)" } } },
        m7: { title: "Det Blå Lyn", text: "Lastbilchaufførerne på Vestegnen mangler energi. Ansæt en Kemiker og kog noget Speed." },
        m8: { title: "Gadekriger", text: "Få skidtet ud på gaden. Jeg vil se lapper i hånden, habibi! Sælg 500 enheder totalt." },
        m9: { title: "Nordvest Netværk", text: "Nordvest er en guldgrube. Invester i flere territorier for at sikre passiv indkomst." },
        m10: { title: "Vagt-Værnet", text: "Rivalerne kigger med. Ansæt 5 vagter til at beskytte dit hovedkvarter." },
        m11: { title: "Hvidvask Kongen", text: "Vi har for mange beskidte penge. Vask 100.000 kr. for at bevise du kan styre flowet." },
        m12: { title: "Frihavnen", text: "Glem lokal produktion. Import er fremtiden. Skaf en <b>Smugler</b> til at hente containerne hjem.", choices: { 0: { text: "Tag chancen (50% for +50k kr / +20 Heat)" }, 1: { text: "Spil sikkert" } } },
        m13: { title: "Det Hvide Guld", text: "Sne. Det hvide guld. Overklassen i City skriger på det. Producér 100 enheder." },
        m14: { title: "Advokaten", text: "Osten er varm. Få fat i en slesk Advokat. En der kan holde Heat nede mens vi vokser." },
        m15: { title: "Nattelivets Konge", text: "Tag kontrollen over byens natteliv. Vi skal eje 4 store territorier nu." },
        m16: { title: "Front-Butikken", text: "Vi har brug for en ægte front. Køb <b>Front-Butik</b> opgraderingen for at gøre din hvidvask mere effektiv." },
        m17: { title: "Kartel Status", text: "Vi er ikke længere en bande. Vi er et kartel. Fyld lageret med coke." },
        m18: { title: "Hellerup Kuppet", text: "Hellerup. Hvor pengene og magten bor. Køb den endelige investering og vis dem hvem der bestemmer." },
        m19: { title: "Safehouse", text: "Rivalerne planlægger noget stort. Byg et <b>Safehouse</b> for at sikre din overlevelse.", choices: { 0: { text: "Angrib først (+50 Heat)" }, 1: { text: "Defensiv (Gør intet)" } } },
        m20: { title: "Legenden", text: "Du ejer denne by, bror. Der er ikke mere at vinde... medmindre du vil starte forfra med endnu mere magt?" }
    },
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
        loading: "Indlæser Syndicate OS..."
    },
    header: {
        xp: {
            title: "Erfaringspoint",
            current: "Nuværende",
            next: "Næste Lvl"
        },
        clean_tooltip: {
            title: "Finans Indsigt",
            launder: "Hvidvask",
            legal: "Lovlig",
            footer: "Tjek Finans fanen for detaljer"
        },
        clean_cash: "Ren Kapital",
        clean_cash_warning: "RENE PENGE KRÆVET",
        heat_tooltip: {
            title: "Heat Status",
            level: "Niveau",
            risk: "Risiko for Razzia",
            lawyers: "Advokater",
            shadow_network: "Skygge Netværk",
            bribe: "Bestik (-25%)",
            cost_warning: "Koster Sorte Penge"
        },
        heat_status: "Heat",
        heat_overheat: "OVERHEAT!!",
        dirty_tooltip: {
            title: "Gade Indsigt",
            sales: "Varelager Salg",
            desc: "Dette er dit forventede flow baseret på nuværende produktion og salg.",
            footer: "Tjek Produktion for detaljer"
        },
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
    settings: {
        title: "System Indstillinger",
        hard_reset: "Nulstil Alt",
        hard_reset_desc: "Sletter alt data permanent",
        export_save: "Eksportér Save",
        import_save: "Importér Save",
        language: "Sprog / Language",
        format: "Talformat",
        format_desc_sci: "Videnskabelig (1.2e6)",
        format_desc_std: "Standard (1.2M)",
        particles: "Effekter",
        particles_desc_on: "Til (Bedre oplevelse)",
        particles_desc_off: "Fra (Bedre ydelse)",
        sound: "Lyd",
        sound_desc_muted: "Lydløs",
        sound_desc_active: "Aktiv",
        on: "TIL",
        off: "FRA",
        mute: "MUTE",
        unmute: "UNMUTE"
    },
    language_selector: {
        title: "Vælg Sprog / Select Language",
        choose: "Vælg foretrukket sprog / Choose preferred language",
        danish: "Dansk",
        english: "English",
        danish_desc: "Original experience",
        english_desc: "International version"
    },
    sultan: {
        title: "Sultanens Baglokale",
        subtitle: "Sultanens Tjenester giver dig adgang til eksklusive fordele og kontrakter. Fuldfør missioner for at stige i graderne og låse op for nye muligheder.",
        services_title: "Tjenester",
        services_desc: "Brug Sultanens tjenester strategisk for at håndtere heat og øge salg.",
        stats_title: "Mission Statistik",
        completed: "Fuldført",
        remaining: "Tilbage",
        progress: "Fremskridt",
        bribe_title: "Smør Osten",
        bribe_desc: "Bestik politiet for at reducere heat. Pris:",
        reduce_heat: "Reducer Heat",
        hype_title: "Gade-Hype",
        hype_desc: "Rygterne spreder sig hurtigt. Fordobler salgshastighed i 2 minutter.",
        start_campaign: "Start Kampagne",
        intel_title: "Efterretning",
        intel_desc: "Markedsprognose",
        next_event: "Næste Hændelse",
        waiting_signal: "Venter på signal...",
        connection_stable: "Forbindelse stabil.",
        seconds_left: "s tilbage.",
        bribe_sultan: "Bestik Sultanen for prognose.",
        main_mission: "Hovedopgave",
        daily_mission: "Daglig Kontrakt",
        next_mission: "Næste Hovedopgave",
        req_rank: "Kræver Rank",
        you_are_rank: "Du er Rank",
        earn_xp: "Optjen mere XP for at låse denne mission op.",
        no_contracts: "Ingen Aktive Kontrakter",
        no_contracts_desc: "Sultanen har intet til dig lige nu. Tjek tilbage om lidt.",
        achievements: "Achievements",
        unlocked: "Unlocked",
        secret: "Hemmelig"
    },
    production: {
        title: "Laboratoriet",
        subtitle: "Laboratoriet er hjertet af din operation. Producer varer manuelt eller automatisk med staff.",
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
        staff: "Ansatte"
    },
    items: {
        hash_lys: { name: "Hash (1g)", desc: "En pind" },
        piller_mild: { name: "Studie-Speed", desc: "Ritalin" },
        hash_moerk: { name: "Skunk (1g)", desc: "Kvali-røg" },
        speed: { name: "Amfetamin (10g)", desc: "Gade-Speed" },
        mdma: { name: "MDMA (10g)", desc: "Emma" },
        keta: { name: "Ketamin (10g)", desc: "Hest" },
        coke: { name: "Kokain (50g)", desc: "Sne" },
        benzos: { name: "Benzos (1000p)", desc: "Krydser" },
        svampe: { name: "Svampe (200g)", desc: "Hatte" },
        oxy: { name: "Oxy (500p)", desc: "Hillbilly Heroin" },
        heroin: { name: "Heroin (500g)", desc: "Brun" },
        fentanyl: { name: "Fentanyl (500g)", desc: "Døden" }
    },
    staff: {
        grower: { name: "Grower", desc: "Dyrker både Hash og Skunk" },
        chemist: { name: "Kemiker", desc: "Koger Speed og andet godt" },
        importer: { name: "Smugler", desc: "Henter varer hjem fra udlandet" },
        labtech: { name: "Laborant", desc: "Syntetiserer det helt tunge stads" },
        junkie: { name: "Zombie", desc: "Arbejder for fixet. Har ingen fremtid." },
        accountant: { name: "Revisor", desc: "Vasker automatisk sorte penge (5%/sek)" },
        pusher: { name: "Pusher", desc: "Sælger småting på gadehjørnet" },
        distributor: { name: "Distributør", desc: "Leverer til klubber og fester" },
        trafficker: { name: "Bagmand", desc: "Styrer salget af de tunge varer" },
        lawyer: { name: "Advokat", desc: "Effektiv. Holder Osten væk." }
    },
    upgrades: {
        warehouse: { name: "Boxit-Rum", desc: "Dobbelt lagerkapacitet." },
        hydro: { name: "Gro-Lamper", desc: "+50% fart på Hash produktion." },
        lab: { name: "Uni-Lab Setup", desc: "+50% fart på Kemisk produktion." },
        studio: { name: "Front-Butik", desc: "+50% Hastighed & +20% Effektivitet." },
        network: { name: "EncroChat", desc: "-25% Heat fra salg via kryptering." },
        deep_wash: { name: "Deep-Wash Server", desc: "+20% Hvidvask-hastighed & passiv vask." }
    },
    luxury: {
        penthouse: { name: "Luksus Penthouse (Cph K)", desc: "Indbegrebet af succes. Giver massiv respekt på gaden." },
        yacht: { name: "Super Yacht (Frihavnen)", desc: "Din egen flydende fæstning. Perfekt til hvidvask-fester." },
        jet: { name: "Gulfstream G650 (Kastrup)", desc: "Flyv under radaren. Reducerer passiv heat generation." },
        ghostmode: { name: "Ghost Protocol System", desc: "Avanceret anti-overvågning. Aktivér for 10 min heat immunity (1t cooldown)." },
        island: { name: "Privat Ø (Caribien)", desc: "Det ultimative end-game. Du er nu untouchable." }
    },
    missions: {
        m1: { title: "Første Levering", text: "Velkommen til Gaden, bror. En junkie ved Den Røde Plads mangler skiver. Gå til <b>Produktion</b> og lav 5x Hash. Tjep." },
        m2: { title: "Gadeplan", text: "Godt. Men varer på lageret betaler ikke huslejen. Sælg lortet for at få Sorte Penge. Pas på varmen (Heat)!" },
        m3: { title: "Vaskemaskinen", text: "Du har Sorte Penge, men du kan ikke købe habitter i Netto for dem. Gå til <b>Finans</b> og vask dem til Ren Kapital." },
        m4: { title: "Organisation", text: "Du ligner en der har travlt. Find en 'Pusher' under <b>Operationer</b> til at sælge for dig, så vi kan fokusere på de store numre." },
        m5: { title: "Kvalitetskontrol", text: "Kunderne vil have det gode grej. Dyrk noget Skunk. Det er tungere, dyrere og varmere." },
        m5b: { title: "Logistik", text: "Kælderen flyder med papkasser. Køb et <b>Boxit-rum</b> (Opgraderinger), før varerne rådner op." },
        m6: {
            title: "Indtag Kødbyen",
            text: "Hipsterne i Kødbyen betaler overpris. Hvis du Investerer i et Territorie (Netværk fanen), ejer vi blokken.",
            choices: {
                0: { text: "Send drengene (+25 Heat)" },
                1: { text: "Bestik vagterne (-5000 kr)" }
            }
        },
        m7: { title: "Det Blå Lyn", text: "Lastbilchaufførerne på Vestegnen mangler energi. Ansæt en Kemiker og kog noget Speed." },
        m8: { title: "Gadekriger", text: "Få skidtet ud på gaden. Jeg vil se lapper i hånden, habibi! Sælg 500 enheder totalt." },
        m9: { title: "Nordvest Netværk", text: "Nordvest er en guldgrube. Invester i flere territorier for at sikre passiv indkomst." },
        m10: { title: "Vagt-Værnet", text: "Rivalerne kigger med. Ansæt 5 vagter til at beskytte dit hovedkvarter." },
        m11: { title: "Hvidvask Kongen", text: "Vi har for mange beskidte penge. Vask 100.000 kr. for at bevise du kan styre flowet." },
        m12: {
            title: "Frihavnen",
            text: "Glem lokal produktion. Import er fremtiden. Skaf en <b>Smugler</b> til at hente containerne hjem.",
            choices: {
                0: { text: "Tag chancen (50% for +50k kr / +20 Heat)" },
                1: { text: "Spil sikkert" }
            }
        },
        m13: { title: "Det Hvide Guld", text: "Sne. Det hvide guld. Overklassen i City skriger på det. Producér 100 enheder." },
        m14: { title: "Advokaten", text: "Osten er varm. Få fat i en slesk Advokat. En der kan holde Heat nede mens vi vokser." },
        m15: { title: "Nattelivets Konge", text: "Tag kontrollen over byens natteliv. Vi skal eje 4 store territorier nu." },
        m16: { title: "Front-Butikken", text: "Vi har brug for en ægte front. Køb <b>Front-Butik</b> opgraderingen for at gøre din hvidvask mere effektiv." },
        m17: { title: "Kartel Status", text: "Vi er ikke længere en bande. Vi er et kartel. Fyld lageret med coke." },
        m18: { title: "Hellerup Kuppet", text: "Hellerup. Hvor pengene og magten bor. Køb den endelige investering og vis dem hvem der bestemmer." },
        m19: {
            title: "Safehouse",
            text: "Rivalerne planlægger noget stort. Byg et <b>Safehouse</b> for at sikre din overlevelse.",
            choices: {
                0: { text: "Angrib først (+50 Heat)" },
                1: { text: "Defensiv (Gør intet)" }
            }
        },
        m20: { title: "Legenden", text: "Du ejer denne by, bror. Der er ikke mere at vinde... medmindre du vil starte forfra med endnu mere magt?" }
    },
    news: {
        n1: "DISTORTION FESTIVAL: Gaden fester! Efterspørgsel på MDMA og Speed eksploderer (+100%).",
        n2: "ROSKILDE FESTIVAL: Dyrskuepladsen åbner. Coke og Hash i høj kurs (+60%).",
        n3: "JULEFROKOST SÆSON: Firmaer fester igennem. Sne falder i stride strømme (+40% Coke).",
        n4: "RAZZIA PÅ STADEN: Osten rydder Pusher Street. Hash priser bunder (-40%).",
        n5: "GRÆNSEKONTROL: Skærpet kontrol i Rødby. Import varer sidder fast (-30% Supply).",
        n6: "POLITI-AKTION: 'Operation Hvid Jul'. Alle pushere holder lav profil.",
        n7: "VINTER TØRKE: Frostvejr og lukkede havne. Alt import er dyrt.",
        n8: "BLOCKCHAIN CRASH: Krypto styrtdykker. Hvidvask er billigere, men risikabelt.",
        n9: "ETHEREUM SURGE: Gas fees er tårnhøje. Hvidvask koster kassen.",
        n10: "Nørrebro: Skudveksling ved Den Røde Plads. Folk holder sig inde.",
        n11: "Vesterbro: Turister flokkes til Kødbyen. Pusherne har travlt.",
        n12: "Nordvest: Unge rødder kaster med kanonslag. Osten er distraheret.",
        n13: "Amager: Rockerne holder træf. Hold lav profil på øen.",
        n14: "Sydhavnen: Nybyggeriet tiltrækker rige kunder. Priserne stiger.",
        n15: "Christiania: Turistsæsonen starter. Salget af 'souvenirs' stiger.",
        n16: "Istedgade: Politiet opsætter overvågning. Heat stiger hurtigere.",
        n17: "Vestegnen: GTI-træf på tanken. Speed flyder frit.",
        n18: "Politiet har fået nye droner med varmesøgende kameraer. Hold lav profil.",
        n19: "Lokalbetjent 'Jens' tager imod bestikkelse igen.",
        n20: "Rigspolitiet advarer om 'stærk pille' i omløb.",
        n21: "Efterlyst: Din rival 'Lille A' er set ved lufthavnen.",
        n22: "Politiradio: 'Mistænkelig aktivitet i din sektor'.",
        n23: "Ny lovgivning: Hårdere straffe for hvidvask fra i dag.",
        n24: "Vejret: Gråt og trist. Perfekt til at lave skejs.",
        n25: "Rygte: En ny sending 'Blå Viagra' hitter på plejehjemmene.",
        n26: "Metroen er ude af drift. Kunderne kan ikke komme frem.",
        n27: "Sultanen giver en omgang shawarma til drengene.",
        n28: "Din mor ringer: 'Hvornår får du et rigtigt arbejde?'",
        n29: "En influencer flasher dine varer på TikTok. Heat stiger!",
        n30: "Alpha Syndikatet har malet over dit tag. Respektløst.",
        n31: "En junkie fandt 1000kr og købte hele lageret.",
        n32: "Strømafbrydelse i laboratoriet. Produktionen holdt stille i 5 min.",
        n33: "Hundepatrulje set ved din hoveddør. Falsk alarm... denne gang.",
        n34: "Sommer: Alle vil have Coke til terrassen.",
        n35: "Vinter: Mørketid. Folk vil bare ryge og se Netflix.",
        n36: "Lønningsdag: Folk har penge. Priserne får et lille nyk op.",
        n37: "Blå Mandag: Konfirmander i byen. Pas på med at sælge til børn (Heat++).",
        n38: "Darkweb markedet 'SilkRoad 4.0' er hacket. Alle er paranoide.",
        n39: "Nye krypterede telefoner ankommet. Sikkerheden er i top.",
        n40: "Bitcoin ATM på Nørrebrogade er ude af drift.",
        n41: "En hacker tilbyder at slette din straffeattest for 50k.",
        n42: "POLITI AUKTION: Lagerudstyr sælges billigt (5.000kr). Klik her!",
        n43: "KORRUPT BETJENT: 'Jeg sletter dine sager for 10.000kr'. Klik her.",
        n44: "Din revisor spørger om kvitteringer for 'gødning'.",
        n45: "En kunde klager over kvaliteten. 'Det er bare oregano!'.",
        n46: "Rivalerne har hyret nye vagter. Pas på.",
        n47: "Sultanen er tilfreds. Han sender en flaske vodka.",
        n48: "Du fandt en pose penge i en taxa. Held i uheld.",
        n49: "Nabokrig: Nogen har stjålet din postkasse.",
        n50: "Breaking: Regeringen overvejer legalisering (igen).",
        n51: "En Netflix serie om dit liv? Nej, bare paranoia."
    },
    achievements: {
        first_blood: { name: "Gade Sælger", desc: "Tjen din første million (1.000.000 kr) i Sorte Penge" },
        clean_house: { name: "Hvidvasker", desc: "Vask 10.000.000 kr totalt gennem dine systemer" },
        king_of_streets: { name: "Kongen af Gaden", desc: "Ejer alle 5 territorier i København samtidigt" },
        escobar: { name: "Escobar", desc: "Producér 1.000 enheder Kokain i din karríere" },
        untouchable: { name: "Urørlig", desc: "Nå 0% Heat mens du har 1.000.000 kr i Sorte Penge" },
        prestige_one: { name: "Exit Scam", desc: "Genstart dit imperium for første gang" },
        diamond_hands: { name: "Diamond Hands", desc: "Ejer mindst 10 Bitcoin i din krypto-wallet" },
        clean_hands: { name: "Rene Hænder", desc: "Hav 1.000.000 kr i Rene Penge og 0 kr i Sorte Penge samtidigt" },
        hoarder: { name: "Lagerforvalter", desc: "Fyld dit lager med mindst 500 enheder varer" },
        veteran: { name: "Gade-Veteran", desc: "Hav været aktiv i gamet i mindst 10 timer totalt" },
        locked_desc: "Lås op for at se denne bedrift."
    },
    tutorial: {
        header: "LIVE ASSISTANT",
        step_label: "TRIN",
        status: "STATUS",
        step1: {
            title: "MÅL: PRODUKTION",
            text: "Køb 5x Hash i 'Produktion' fanen.",
            sub: "Klik på Hash-ikonet for at producere."
        },
        step2: {
            title: "MÅL: GADESALG",
            text: "Sælg 5 enheder for at tjene Sorte Penge.",
            sub: "Brug 'Sælg Alt' knappen i toppen."
        },
        step3: {
            title: "MÅL: HVIDVASK",
            text: "Vask 100kr i 'Finans' fanen.",
            sub: "Sorte Penge kan ikke bruges til alt."
        },
        step4: {
            title: "MÅL: ORGANISATION",
            text: "Ansæt en Pusher i 'Organisation' fanen (Management).",
            sub: "Han sælger automatisk for dig."
        }
    },
    finance: {
        title: "Finansministeriet",
        subtitle: "Kapitalstyring, Hvidvask og Globale Investeringer.",
        net_worth: "Total Net Worth",
        cashflow_5m: "Netto Cashflow (5m)",
        liquid_clean: "Liquid Ren Kapital",
        dirty_cash: "Uvaskede Pengesedler",
        laundering: {
            title: "Hvidvask Terminal",
            op_name: "Operation Clean Sweep",
            rate: "RATE",
            desc: "Konverter Sorte Penge til legitim kapital. Risiko for razzia er 5% pr. vask.",
            warn_crash: "BLOCKCHAIN CRASH: Risiko forøget til 15%!",
            wash_all: "Vask Alt",
            manual_wash: "Manuel Vask",
            manual_desc: "Klik her for hurtigrens"
        },
        bank: {
            title: "Sparkasse Opsparing",
            bank_name: "Københavns Investeringsbank",
            balance: "Indestående",
            interest: "Rente (5m)",
            next_payout: "Næste Udbetaling",
            deposit_10k: "Indskud 10k",
            deposit_all: "Indskud Alt",
            withdraw_all: "Hæv Alt"
        },
        luxury: {
            title: "Luksus-aktiver & Prestige",
            owned: "Ejes",
            invest: "Invester",
            penthouse: "Luksus Penthouse (Cph K)",
            penthouse_desc: "Indbegrebet af succes. Giver massiv respekt på gaden.",
            yacht: "Super Yacht (Frihavnen)",
            yacht_desc: "Din egen flydende fæstning. Perfekt til hvidvask-fester.",
            jet: "Gulfstream G650 (Kastrup)",
            jet_desc: "Flyv under radaren. Reducerer passiv heat generation.",
            ghostmode: "Ghost Protocol System",
            ghostmode_desc: "Avanceret anti-overvågning. Aktivér for 10 min heat immunity (1t cooldown).",
            island: "Privat Ø (Caribien)",
            island_desc: "Det ultimative end-game. Du er nu untouchable."
        },
        cashflow: {
            title: "Cashflow Rapport",
            income: "Indtægter (Territorier)",
            expenses: "Udgifter (Lønninger)",
            net_profit: "Netto Profit / 5m"
        },
        portfolio: {
            title: "Portefølje",
            held: "Held",
            buy: "Køb",
            sell: "Sælg"
        },
        debt: {
            title: "Gæld & Lån",
            borrow_50k: "Optag 50k Lån",
            pay_all: "Betal Alt"
        },
        chart: {
            collecting: "Indsamler Data..."
        }
    },
    network: {
        title: "GADEN",
        live_feed: "LIVE FEED",
        controlled: "KONTROLLERET",
        zones: "zoner",
        power: "TOTAL MAGT",
        respect: "GADE RESPEKT",
        ops: {
            drive_by: "Drive-By (5k)",
            bribe: "Bestik (30k)",
            raid: "Raid (Risiko)",
            heat_wipe: "HEAT WIPE (1T)"
        },
        districts: {
            elite: "Elite Zoner",
            other: "Andre Områder"
        },
        bonus_active: "🌟 BONUS AKTIV",
        set_bonus: "Sæt-Bonus",
        income_sec: "INDTÆGT / SEK",
        income: "INDTÆGT",
        stats: {
            base: "Base",
            mult: "Multiplier",
            next: "Næste Upgrade"
        },
        actions: {
            buy: "Køb Område",
            upgrade: "OPGRADER"
        },
        levels: "Levels",
        attack: "⚠️ ANGREB ⚠️",
        strength: "Styrke",
        defend_safe: "FORSVAR (Sikker)",
        defend_merc: "LEJESOLDATER (10k)",
        rival_occupation: "RIVAL BESÆTTELSE",
        liberate: "BEFRI OMRÅDET",
        spec: {
            title: "Vælg Speciale",
            safe: "Safe",
            front: "Front",
            warehouse: "Lager"
        },
        shakedown: {
            collect: "INDDRIV!"
        }
    },
    rivals: {
        title: "Underverdenen",
        subtitle: "Konflikt, Politi og Sikkerhed. Hold dine fjender tæt og din ryg fri.",
        scanner: {
            title: "Politirapport & Overvågning",
            police: "Københavns Politi",
            status_raid: "⚠️ RAZZIA OVERHÆNGENDE",
            status_active: "📡 OVERVÅGNING AKTIV",
            threat_level: "Nuværende Trusselsniveau",
            status_label: "Status",
            level: {
                critical: "Kritisk",
                high: "Forhøjet",
                safe: "Sikkert"
            }
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
        gang_wars: {
            title: "Gang Wars (Multiplayer Lite)",
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
            title: "Syndicate Control Grid",
            dominance: "Global Dominans"
        },
        defense: {
            title: "Forsvar",
            subtitle: "Sikring af Headquarters",
            def_unit: "DEFENSE",
            per_unit: "PR. ENHED",
            total: "Samlet Forsvarsværdi",
            points: "PUNKTER",
            buy: "Køb",
            active: "Aktiv",
            hq: "Headquarters Protection"
        },
        buy: "Køb",
        max: "Max"
    },
    management: {
        title: "Organisation",
        subtitle: "Ansæt specialister og administrer din operation.",
        salary: "Lønning",
        status: "Status",
        active: "Aktiv",
        inactive: "Uaktiv", // Assuming 'Uaktiv' is desired
        details: "Detaljer",
        per_unit: "Pr. enhed",
        loyalty: "Loyalitet",
        total_prod: "Total Produktion",
        total_ops: "Total Drift",
        hire: "Ansæt",
        fire: "Fyr",
        pay_salary: "UDBETAL LØN",
        stop_strike: "STOP STREJKE",
        economy: "Økonomi",
        upgrades: "Opgraderinger",
        salary_interval: "Lønninger (Interval)",
        total_revenue: "Total Omsætning",
        laundered: "Hvidvasket"
    },
    buy: "Køb",
    buy: "Køb",
    max: "Max",
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
        9: "SULTAN"
    },
    boss_modal: {
        your_hp: "Dit HP",
        boss_hp: "Boss HP",
        enraged: "RASENDE",
        taunt: "\"Du tror du kan tage min plads? Kom an!\"",
        attack_btn: "ANGRIB!",
        speed_bonus: "⚠️ Boss angriber hver {rate}s! | Fart bonus: Vind på <30s for +50% loot"
    },
    briefcase: {
        money_log: "GRATIS PENGE: Du fandt en mappe med {amount} kr!",
        heat_log: "BEVISER FJERNET: Du fandt en mappe med kompromitterende billeder. Heat -20.",
        buff_log: "HYPE MODE: Salg fordoblet i 30 sekunder!",
        money_float: "+{amount} kr",
        heat_float: "-20 Heat",
        buff_float: "HYPE MODE!"
    },
    offline_report: {
        title: "DRIFTSRAPPORT",
        time: "Gade Tid: {minutes} minutter",
        production_title: "Produktion & Lager",
        security_title: "Sikkerhed",
        raids: "Razziaer",
        defended: "Afværget",
        failed: "MISLYKKEDES",
        finance_title: "Regnskab",
        dirty_income: "Sorte Penge (Gade)",
        clean_income: "Hvide Penge (Legalt)",
        laundered_sub: "↳ Heraf Hvidvasket",
        salaries: "Lønninger",
        interest: "Renter (Gæld)",
        net: "NETTO",
        close_btn: "GODKEND RAPPORT",
        quote: "\"Forretning er forretning.\" — Sultanen"
    }
};
