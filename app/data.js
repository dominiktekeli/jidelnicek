const DAYS = [
  { id: "po", label: "Pondělí", short: "Po" },
  { id: "ut", label: "Úterý", short: "Út" },
  { id: "st", label: "Středa", short: "St" },
  { id: "ct", label: "Čtvrtek", short: "Čt" },
  { id: "pa", label: "Pátek", short: "Pá" },
  { id: "so", label: "Sobota", short: "So" },
  { id: "ne", label: "Neděle", short: "Ne" },
];

const WEEKS = [
  {
    id: 1,
    emoji: "🍗",
    simple: "Oblíbené u dětí",
    title: "Týden 1 — Klasika, co děti jedí",
    theme: "České oblíbené + rychlé večery",
    meals: {
      po: {
        lunch: "Kuřecí řízek, bramborová kaše, okurka",
        dinner: "Zapečené těstoviny s mozzarellou a rajčaty",
        prep: "Večer nakrájet kuře, ráno obalit",
        recipe: {
          ingredients: ["4 kuřecí řízky (~600g)", "2 vejce", "strouhanka 100g", "mouka 50g", "brambory 1kg", "mléko 100ml", "máslo 30g", "1 okurka", "sůl, pepř, olej"],
          steps: ["Večer: kuře nakrájej, obal ve mouce-vejci-strouhance, dej do lednice.", "Ráno: brambory uvař, rozmačkej s mlékem a máslem.", "Okurku nakrájej.", "Řízky osmaž na oleji 4-5 min z každé strany."],
          time: "35 min",
          note: "Klasika, kterou děti jedí do posledního kousku."
        }
      },
      ut: {
        lunch: "Gulášová polévka, chléb, šunkový sendvič",
        dinner: "Pečený losos, rýže, brokolice na páře",
        prep: "Losos marinovat 15 min ráno",
        recipe: {
          ingredients: ["hovězí nebo vepřové maso 300 g (nebo uzená klobása)", "cibule 2 ks", "mrkev 2 ks", "brambory 3 ks", "česnek 2 stroužky", "rajčatový protlak 2 lžíce", "paprika sladká 1 lžička", "sůl, pepř, majoránka, olej", "chléb + šunka + máslo na sendviče"],
          steps: ["Mas o nakrájej na kostky, osol a opepři.", "Na oleji osmaž cibuli a česnek, přidej maso a orestuj.", "Přidej mrkev, brambory, protlak, papriku a zalij vodou (asi 1,5 l).", "Vař 25-30 min doměkka. Dochut' solí, pepřem a majoránkou.", "Mezitím namaž chléb máslem, přidej šunku — hotové sendviče k polévce."],
          time: "40 min",
          note: "Polévka ještě lepší druhý den. Děti milují s chlebem namočeným v ní."
        }
      },
      st: {
        lunch: "Špagety bolognese (dvojitá porce na pátek)",
        dinner: "Sýrové palačinky, ovoce",
        prep: "Omáčku uvařit odpoledne, zmrazit půlku",
        recipe: {
          ingredients: ["mleté hovězí 500 g", "cibule 1 ks", "mrkev 1 ks", "celer 1/2 ks (nebo petržel)", "česnek 2 stroužky", "rajčatová passata 500 ml", "těstoviny 400 g (na 2 dny)", "sůl, pepř, oregano, olej", "parmazán nebo eidam na strouhání"],
          steps: ["Na oleji osmaž najemno nakrájenou cibuli, mrkev a celer.", "Přidej mleté maso a rozmačkej ho, orestuj dozlatova.", "Přidej česnek, oregano, passata, sůl a pepř. Dus 20-25 min.", "Uvař dvojnásobek těstovin. Polovinu omáčky dej do mrazáku na pátek.", "Zbytek omáčky smíchej s těstovinami a posyp sýrem."],
          time: "35 min",
          note: "Omáčka se dá i na 2 dny dopředu. Zmrazená verze ušetří celý pátek."
        }
      },
      ct: {
        lunch: "Fazolová polévka, topinky s česnekem",
        dinner: "Kuřecí stir-fry, nudle",
        prep: "Zeleninu nakrájet do krabiček",
        recipe: {
          ingredients: ["fazole v konzervě 2 ks (nebo suché namočené)", "brambory 2 ks", "mrkev 2 ks", "cibule 1 ks", "česnek 2 stroužky", "sůl, pepř, majoránka, olej", "chléb 4 krajíce", "česnek 1 stroužek na potření"],
          steps: ["Na oleji osmaž cibuli a česnek.", "Přidej nakrájené brambory a mrkev, zalij vodou a vař 10 min.", "Přidej scezené fazole a vař dalších 10 min. Dochut' solí, pepřem a majoránkou.", "Chléb potři česnekem a osmaž na sucho nebo na pánvi do křupava.", "Polévku podávej s topinkami."],
          time: "30 min",
          note: "Fazole dodají sytost bez masa. Topinky jsou pro děti nejoblíbenější část."
        }
      },
      pa: {
        lunch: "Zbytek bolognese, salát z ledového salátu",
        dinner: "Domácí pizza (koupené těsto), zelenina",
        prep: "Těsto vyndat ráno z lednice",
        recipe: {
          ingredients: ["zbytek bolognese omáčky z úterý", "těstoviny 200 g", "ledový salát 1/2 hlávky", "okurka 1 ks", "olej, citron, sůl, pepř"],
          steps: ["Uvař těstoviny.", "Zahřej omáčku v hrnci nebo mikrovlnce.", "Salát natrh ej, okurku nakrájej, osol a pokapej olejem s citronem.", "Omáčku smíchej s těstovinami a podávej se salátem."],
          time: "15 min",
          note: "Žádná zbytečná práce — jen ohřát a sestavit. Salát osvěží těžší omáčku."
        }
      },
      so: {
        lunch: "Svíčková z tašky (omáčka) + knedlík z mikrovlnky",
        dinner: "Grilované klobásy, brambory, hořčice",
        prep: "Nákup v pátek odpoledne",
        recipe: {
          ingredients: ["omáčka na svíčkovou z pytlíku/tašky", "hovězí maso předvařené nebo z konzervy (nebo kup hotové)", "knedlíky v sáčku 1 balení", "brusinkový kompot nebo džem", "sůl, pepř"],
          steps: ["Omáčku připrav podle návodu na obalu (obvykle 5-10 min).", "Knedlíky ohřej v mikrovlnce podle návodu (2-3 min).", "Maso nakrájej nebo použij hotové, krátce prohřej v omáčce.", "Podávej s knedlíkem a lžící brusinek."],
          time: "15 min",
          note: "Klasika bez stresu. Děti milují sladkokyselou kombinaci s knedlíkem."
        }
      },
      ne: {
        lunch: "Smažený sýr, brambory, tatarka",
        dinner: "Lehká zeleninová polévka, toast",
        prep: "Odpočinek — minimum vaření",
        recipe: {
          ingredients: ["eidam na smažení 400 g", "2 vejce", "strouhanka 80 g", "mouka 30 g", "brambory 600 g", "tatarka nebo kečup", "olej na smažení", "sůl"],
          steps: ["Sýr nakrájej na silnější plátky (cca 1 cm).", "Obal ve mouce, vejci a strouhance.", "Brambory uvař v osolené vodě.", "Sýr osmaž na pánvi z obou stran dozlatova (3-4 min).", "Podávej s bramborami a tatarkou."],
          time: "25 min",
          note: "Nedělní klasika, která chutná všem. Sýr musí být pořádně horký a křupavý."
        }
      },
    },
    shopping: [
      {
        category: "Maso & ryby",
        items: [
          "kuřecí prsa 1,2 kg",
          "mleté hovězí 500 g",
          "losos filet 600 g",
          "klobásy 4 ks",
          "šunka 200 g",
        ],
      },
      {
        category: "Mléčné",
        items: [
          "mléko 3 l",
          "smetana na šlehání 250 ml",
          "mozzarella 2×",
          "eidam na smažení 400 g",
          "máslo 250 g",
          "sýr na pizzu 300 g",
        ],
      },
      {
        category: "Zelenina & ovoce",
        items: [
          "rajčata 1 kg",
          "brokolice 2 ks",
          "mrkev 1 svazek",
          "cibule 1 kg",
          "česnek",
          "okurky 3 ks",
          "banány, jablka",
          "salát ledový",
        ],
      },
      {
        category: "Trvanlivé & pečivo",
        items: [
          "těstoviny 2 balení",
          "rýže 1 balení",
          "brambory 3 kg",
          "chléb, rohlíky",
          "pizza těsto 2 ks",
          "strouhanka, hladká mouka",
          "fazole konzerva 2×",
          "rajčatová passata 2×",
        ],
      },
      {
        category: "Mražené & ostatní",
        items: [
          "knedlíky 1 balení",
          "omáčka na svíčkovou",
          "olej, koření, kečup",
          "vejce 10 ks",
        ],
      },
    ],
    tips: [
      {
        title: "Batch cooking v neděli",
        text: "Uvařte dvojitou dávku bolognese a jednu dejte do mrazáku. Ve středu máte polovinu práce hotové.",
      },
      {
        title: "Krabičky na stir-fry",
        text: "Čtvrtek večer nakrájejte papriku, cibuli a kuře — pátek večeře za 15 minut.",
      },
      {
        title: "Pizza pátek",
        text: "Nechte děti poskládat vlastní pizzu. Méně vaříte, víc jedí.",
      },
    ],
  },
  {
    id: 2,
    emoji: "🥗",
    simple: "Zdravě a rychle",
    title: "Týden 2 — Rychlé a zdravé",
    theme: "Méně smažení, více zeleniny",
    meals: {
      po: {
        lunch: "Krůtí plátky, bramborová kaše, kyselá okurka",
        dinner: "Polévka z červené čočky, celozrnný chléb",
        prep: "Čočku namočit ráno",
        recipe: {
          ingredients: [
            "krůtí prsa 400 g",
            "strouhanka nebo ovesné vločky 80 g",
            "vejce 1 ks",
            "brambory 600 g",
            "mléko 80 ml",
            "máslo 20 g",
            "kyselá okurka 2 ks",
            "červená čočka 150 g",
            "mrkev, cibule, česnek",
            "sůl, pepř, olej, majoránka"
          ],
          steps: [
            "Krůtí prsa nakrájej na plátky, osol, obal ve vejci a strouhance.",
            "Osmaž na pánvi dozlatova (4 min z každé strany).",
            "Brambory uvař, rozmačkej s mlékem a máslem na kaši.",
            "Kyselou okurku nakrájej na kolečka.",
            "Večer nebo ráno: čočku propláchni, namoč na 30+ min (ideálně ráno).",
            "Na pánvi osmaž cibuli a česnek, přidej mrkev, zalij vodou, přidej čočku a vař 20-25 min.",
            "Dochut' solí, pepřem, majoránkou. Podávej s celozrnným chlebem."
          ],
          time: "35 min",
          note: "Lehké, rychlé, zdravé. Čočka se dá připravit den předem."
        }
      },
      ut: {
        lunch: "Wrapy s kuřetem, zeleninou a jogurtovým dresinkem",
        dinner: "Pečená zelenina s halloumi",
        prep: "Zeleninu nakrájet, uložit do mísy",
        recipe: {
          ingredients: ["kuřecí prsa 300 g", "tortilly 4 ks", "salát do wrapů nebo ledový", "okurka 1 ks", "paprika 1 ks", "jogurt bílý 150 g", "česnek 1 stroužek", "citron, sůl, pepř, olej"],
          steps: ["Kuře nakrájej na proužky, osol a opepři, osmaž na pánvi 5-6 min.", "Zeleninu nakrájej na tenké proužky.", "Jogurt smíchej s prolisovaným česnekem, solí, pepřem a kapkou citronu.", "Na tortillu dej salát, zeleninu, kuře a přelij dresinkem. Zabal."],
          time: "20 min",
          note: "Dresink si děti můžou přidávat samy. Skvělé i studené do krabičky."
        }
      },
      st: {
        lunch: "Rybí prsty + hrášek + bramborová kaše",
        dinner: "Kuřecí curry s rýží (jemné pro děti)",
        prep: "Curry koření smíchat předem do skleničky",
        recipe: {
          ingredients: ["rybí prsty mražené 12-16 ks", "hrášek mražený 300 g", "brambory 600 g", "mléko 80 ml", "máslo 20 g", "sůl, pepř, olej"],
          steps: ["Brambory uvař a rozmačkej s mlékem a máslem na kaši.", "Rybí prsty osmaž nebo upeč v troubě podle návodu (obvykle 12-15 min).", "Hrášek krátce povař nebo ohřej v mikrovlnce s trochou vody.", "Na talíř dej kaši, hrášek a rybí prsty."],
          time: "20 min",
          note: "Děti to milují. Hrášek můžeš zamaskovat v kaši, když nechceš vidět."
        }
      },
      ct: {
        lunch: "Špenátové noky s máslem a parmazánem",
        dinner: "Těstovinový salát s tuňákem",
        prep: "Salát uvařit večer, ráno jen vyndat",
        recipe: {
          ingredients: ["noky nebo špenátové knedlíčky 500 g", "máslo 40 g", "parmazán nebo eidam 50 g", "sůl, pepř, muškátový oříšek (volitelně)"],
          steps: ["Noky uvař v osolené vodě podle návodu (3-5 min).", "Na pánvi rozpusť máslo, přidej scezené noky a krátce orestuj.", "Strouhej sýr přímo na talíř, přidej noky a zamíchej.", "Dochut' solí, pepřem a špetkou muškátu."],
          time: "15 min",
          note: "Rychlé a děti to berou jako těstoviny. Máslo dělá zázraky."
        }
      },
      pa: {
        lunch: "Zbytek curry",
        dinner: "Burgery z mletého krůtího, pečené hranolky",
        prep: "Hranolky nakrájet, namočit ve vodě",
        recipe: {
          ingredients: ["zbytek kuřecího curry z předchozího dne", "rýže 150 g (pokud není)", "čerstvá cibulka nebo petržel na dozdobení"],
          steps: ["Zahřej zbytek curry v hrnci nebo mikrovlnce.", "Uvař čerstvou rýži, pokud už není.", "Podávej curry přes rýži, posyp nasekanou cibulkou."],
          time: "10 min",
          note: "Druhý den chutná často ještě lépe. Žádná práce navíc."
        }
      },
      so: {
        lunch: "Pečené kuře (celé), brambory, mrkev",
        dinner: "Omeleta se zeleninou",
        prep: "Kuře marinovat v sobotu ráno",
        recipe: {
          ingredients: ["kuře celé 1,5 kg", "brambory 1 kg", "mrkev 4 ks", "olej, sůl, pepř, paprika, česnek", "voda nebo vývar na podlévání"],
          steps: ["Kuře potři olejem, solí, pepřem, paprikou a prolisovaným česnekem (ideálně ráno nebo večer předem).", "Dej do pekáče, přidej oloupané brambory a mrkev pokrájené na větší kusy.", "Přidej trochu vody a peč 75-90 min při 180 °C (podlévej).", "Kuře je hotové, když šťáva vytéká čirá."],
          time: "1 h 30 min (většinou bez práce)",
          note: "Nejlepší nedělní oběd. Z kostí si uvař vývar na další den."
        }
      },
      ne: {
        lunch: "Ovesná kaše s ovocem a ořechy (brunch)",
        dinner: "Zeleninový krém, toast s avokádem",
        prep: "Ořechy nasekat, ovoce připravit",
        recipe: {
          ingredients: ["ovesné vločky 200 g", "mléko nebo rostlinné 500 ml", "banány 2 ks", "jablko 1 ks", "ořechy nebo semínka 40 g", "med nebo skořice podle chuti"],
          steps: ["Vločky zalij mlékem a nechej 5-10 min nabobtnat (nebo přes noc v lednici).", "Nakrájej ovoce, nasekej ořechy.", "Kaši zahřej, zamíchej s ovocem a ořechy, dochut' medem nebo skořicí."],
          time: "10 min",
          note: "Skvělý brunch po aktivním víkendu. Děti si můžou posypat ořechy samy."
        }
      },
    },
    shopping: [
      {
        category: "Maso & ryby",
        items: [
          "krůtí prsa 800 g",
          "mleté krůtí 600 g",
          "kuře celé 1,5 kg",
          "rybí prsty 1 balení",
          "tuňák v konzervě 2×",
        ],
      },
      {
        category: "Mléčné",
        items: [
          "jogurt bílý 500 g",
          "halloumi 250 g",
          "parmazán 100 g",
          "máslo, mléko",
          "vejce 12 ks",
          "sýr na noky",
        ],
      },
      {
        category: "Zelenina & ovoce",
        items: [
          "špenát mražený",
          "paprika 3 ks",
          "cuketa 2 ks",
          "mrkev, celer",
          "avokádo 2 ks",
          "banány, bobule",
          "salát do wrapů",
        ],
      },
      {
        category: "Trvanlivé & pečivo",
        items: [
          "čočka červená 500 g",
          "rýže basmati",
          "noky 1 balení",
          "tortilly 2 balení",
          "brambory 2,5 kg",
          "ovesné vločky",
          "celozrnný chléb",
        ],
      },
      {
        category: "Koření & ostatní",
        items: [
          "curry pasta nebo prášek",
          "kokosové mléko 1×",
          "tahini nebo majonéza",
          "olej, citron",
        ],
      },
    ],
    tips: [
      {
        title: "Mrazák jako pomocník",
        text: "Mražený hrášek, špenát a rybí prsty šetří 20 minut týdně.",
      },
      {
        title: "Jedna miska zeleniny",
        text: "V úterý nakrájejte zeleninu na 3 dny — wrapy, curry i omeleta.",
      },
      {
        title: "Nedělní brunch",
        text: "Ovesná kaše na oběd = jednodušší večer. Ideální po aktivním víkendu.",
      },
    ],
  },
  {
    id: 3,
    emoji: "💰",
    simple: "Šetříme rozpočet",
    title: "Týden 3 — Úsporný týden",
    theme: "Rozpočet pod kontrolou, žádné plýtvání",
    meals: {
      po: {
        lunch: "Fazolová polévka z víkendu (pokud máte) nebo hrachová",
        dinner: "Špenátové těstoviny s vejcem",
        prep: "Vejce uvařit předem na 8 min",
        recipe: {
          ingredients: ["suchý hrách nebo čočka 200 g (nebo konzerva)", "brambory 2 ks", "mrkev 2 ks", "cibule 1 ks", "česnek 2 stroužky", "sůl, pepř, majoránka, olej", "chléb nebo topinky"],
          steps: ["Luštěniny propláchni a namoč na 30+ min (nebo použij konzervu).", "Na oleji osmaž cibuli a česnek, přidej mrkev a brambory.", "Zalij vodou, přidej luštěniny a vař 25-30 min doměkka.", "Rozmixuj část polévky tyčovým mixerem pro hustotu. Dochut'."],
          time: "35 min",
          note: "Levný a sytý oběd. Luštěniny můžeš namočit večer předem."
        }
      },
      ut: {
        lunch: "Bramboráky, kefír",
        dinner: "Kuřecí vývar + nudle s zeleninou",
        prep: "Vývar z kostí — vařit pasivně 2 h",
        recipe: {
          ingredients: ["brambory 1 kg", "cibule 1 ks", "vejce 1-2 ks", "strouhanka nebo hladká mouka 3-4 lžíce", "sůl, pepř, majoránka, olej na smažení", "kefír nebo bílý jogurt na podávání"],
          steps: ["Brambory a cibuli nastrouhej najemno, přebytečnou tekutinu vymačkej.", "Přidej vejce, strouhanku, sůl, pepř a majoránku. Těsto má být husté.", "Na pánvi s olejem smaž lžíce těsta z obou stran dozlatova.", "Podávej horké s kefírem nebo jogurtem."],
          time: "30 min",
          note: "Tradiční české jídlo. Děti je milují s kefírem místo tatarky."
        }
      },
      st: {
        lunch: "Zapečené brambory s cottage a šunkou",
        dinner: "Líné lasagne (bez vaření těstovin)",
        prep: "Lasagne složit večer, ráno jen zapéct",
        recipe: {
          ingredients: ["brambory 1 kg", "cottage sýr 250 g", "šunka 150 g", "mléko 100 ml", "sýr na zapékání 100 g", "sůl, pepř, olej, máslo"],
          steps: ["Brambory uvař ve slupce, oloupej a nakrájej na kolečka.", "Vymaž pekáček, vrstv i brambory, cottage, šunku a trochu mléka.", "Opakuj vrstvy a zakonči strouhaným sýrem.", "Zapékej 20-25 min při 180 °C do zlatova."],
          time: "40 min",
          note: "Levná verze bramborového gratinu. Cottage dělá krémovou chuť."
        }
      },
      ct: {
        lunch: "Kuskus s grilovanou zeleninou",
        dinner: "Mleté maso na paprice (po maďarsku), rýže",
        prep: "Kuskus připravit za 5 min",
        recipe: {
          ingredients: ["kuskus 200 g", "paprika 2 ks", "cuketa 1 ks", "cibule 1 ks", "česnek 2 stroužky", "olej, sůl, pepř, sušené bylinky", "voda nebo vývar 250 ml"],
          steps: ["Zeleninu nakrájej na větší kusy, osol a opepři.", "Na pánvi nebo grilu restuj 8-10 min dozlatova.", "Kuskus zalij horkým vývarem, přikryj a nech 5 min nabobtnat.", "Vidlíčkou zkypři a smíchej se zeleninou."],
          time: "15 min",
          note: "Nejrychlejší teplý oběd. Zeleninu můžeš připravit den předem."
        }
      },
      pa: {
        lunch: "Zbytek lasagní",
        dinner: "Smažený květák, bramborová kaše",
        prep: "Květák obalit ráno, večer jen osmažit",
        recipe: {
          ingredients: ["zbytek lasagní z předchozího dne", "trocha strouhaného sýra navrch (volitelně)"],
          steps: ["Kus lasagní přendej do ohnivzdorné misky.", "Přidej trochu vody nebo mléka na okraje, přikryj alobalem.", "Zahřívej v troubě 15 min při 180 °C nebo v mikrovlnce 3-4 min."],
          time: "15 min",
          note: "Lasagne jsou druhý den ještě lepší. Stačí jen prohřát."
        }
      },
      so: {
        lunch: "Sekaná pečeně, brambory, kyselá okurka",
        dinner: "Palačinky (sladké i slané)",
        prep: "Sekanou připravit v pátek večer",
        recipe: {
          ingredients: ["mleté vepřové nebo mix 700 g", "cibule 1 ks", "strouhanka 60 g", "vejce 1 ks", "česnek 2 stroužky", "sůl, pepř, majoránka", "brambory 800 g", "kyselá okurka 3 ks"],
          steps: ["Cibuli najemno nakrájej a smíchej s mletým masem, vejcem, strouhankou a kořením.", "Tvaruj do pekáče (nebo do formy na biskupský chleb).", "Peč 45-50 min při 180 °C.", "Brambory uvař, okurku nakrájej. Sekanou krájej na silnější plátky."],
          time: "1 h (většinou pasivně)",
          note: "Připrav večer předem, ráno jen vlož do trouby. Skvělá i studená na chlebě."
        }
      },
      ne: {
        lunch: "Chlebíčky — vajíčková pomazánka, šunka",
        dinner: "Zeleninový salát s cizrnou",
        prep: "Pomazánku uvařit v neděli dopoledne",
        recipe: {
          ingredients: ["vejce 6 ks", "majonéza 3 lžíce", "hořčice 1 lžička", "sůl, pepř, cibulka", "chléb nebo rohlíky 8 ks", "šunka 150 g", "okurka, paprika, rajče na ozdobu"],
          steps: ["Vejce natvrdo uvař (8 min), zchlaď a oloupej.", "Rozmačkej vidličkou, přidej majonézu, hořčici, sůl, pepř a najemno nakrájenou cibulku.", "Namaž na chléb, přidej plátek šunky a ozdob zeleninou."],
          time: "20 min",
          note: "Klasické nedělní chlebíčky. Děti si je můžou zdobit samy."
        }
      },
    },
    shopping: [
      {
        category: "Maso & alternativy",
        items: [
          "kuřecí kosti / polévkové maso",
          "mleté vepřové 700 g",
          "šunka 300 g",
          "vejce 15 ks",
        ],
      },
      {
        category: "Mléčné",
        items: [
          "cottage 2× 250 g",
          "kefír 1 l",
          "mléko, máslo",
          "sýr na lasagne 200 g",
          "smetana ke šlehání",
        ],
      },
      {
        category: "Zelenina & luštěniny",
        items: [
          "brambory 4 kg",
          "květák 1 ks",
          "paprika 2 ks",
          "cibule 1 kg",
          "cizrna konzerva 2×",
          "špenát mražený",
          "mrkev, petržel",
        ],
      },
      {
        category: "Trvanlivé",
        items: [
          "těstoviny na lasagne",
          "kuskus 1 balení",
          "rýže",
          "hrách 500 g",
          "chléb, rohlíky",
          "mouka, strouhanka",
          "rajčatová omáčka 2×",
        ],
      },
      {
        category: "Ostatní",
        items: [
          "okurky kyselé",
          "olej, majoránka, paprika",
          "cukr, čokoláda na palačinky",
        ],
      },
    ],
    tips: [
      {
        title: "Vařte z jednoho hrnce",
        text: "Vývar + nudle + zelenina = jedna nádoba, méně mytí.",
      },
      {
        title: "Lasagne bez práce",
        text: "Syrové těstoviny přímo do omáčky — zapéct 45 min, hotovo.",
      },
      {
        title: "Chlebíčková neděle",
        text: "Nechte děti skládat chlebíčky. Oběd za 10 minut, nula stresu.",
      },
    ],
  },
  {
    id: 4,
    emoji: "☀️",
    simple: "Pohodový víkend",
    title: "Týden 4 — Pohodové víkendy",
    theme: "Více společného vaření, méně spěchu",
    meals: {
      po: {
        lunch: "Kuřecí kokosové curry s rýží",
        dinner: "Zeleninová polévka, topinky",
        prep: "Curry uvařit dvojitou porci",
        recipe: {
          ingredients: ["kuřecí stehna nebo prsa 500 g", "cibule 1 ks", "česnek 3 stroužky", "paprika 1 ks", "kokosové mléko 400 ml", "curry pasta nebo prášek 2 lžíce", "rýže 300 g", "sůl, olej, limetka nebo citron"],
          steps: ["Kuře nakrájej na kostky, osol a orestuj na pánvi.", "Přidej cibuli a česnek, restuj 2 min.", "Přidej papriku a curry, promíchej, zalij kokosovým mlékem.", "Dus 15-18 min. Mezitím uvař rýži.", "Curry dochut' solí a kapkou citrusu."],
          time: "30 min",
          note: "Dvojitou porci uvař rovnou — zbytek na pátek. Děti milují s rýží."
        }
      },
      ut: {
        lunch: "Tacos / tortilla bowls (mleté maso, fazole)",
        dinner: "Pečené filety z tresky, bramborová kaše",
        prep: "Taco koření smíchat doma",
        recipe: {
          ingredients: ["mleté hovězí 400 g", "cibule 1 ks", "česnek 2 stroužky", "fazole černé nebo červené konzerva 1 ks", "taco koření nebo paprika + kmín + chilli", "tortilly nebo rýže", "sýr, salát, rajče, jogurt na servírování"],
          steps: ["Na pánvi osmaž cibuli a česnek, přidej mleté maso a rozmačkej.", "Přidej koření a scezené fazole, prohřívej 5-7 min.", "Tortilly ohřej nebo uvař rýži.", "Každý si sám poskládá misku/taco se salátem, sýrem a jogurtem."],
          time: "20 min",
          note: "Každý si sestaví podle sebe — nula stížností. Skvělé na party."
        }
      },
      st: {
        lunch: "Sushi bowl (rýže, losos uzený, okurka, avokádo)",
        dinner: "Krupicová kaše s ovocem (děti milují)",
        prep: "Rýži uvařit předem",
        recipe: {
          ingredients: ["rýže na sushi nebo basmati 300 g", "losos uzený 150 g", "okurka 1 ks", "avokádo 1-2 ks", "rýžový ocet nebo citron 1 lžíce", "sója, sezam, wasabi (volitelně)"],
          steps: ["Rýži uvař a horkou pokapej octem/citronem, zlehka promíchej.", "Okurku a avokádo nakrájej na plátky.", "Do misky dej rýži, pokládej lososa, okurku a avokádo.", "Pokapej sójovou omáčkou a posyp sezamem."],
          time: "15 min (když je rýže hotová)",
          note: "Rychlá verze sushi bez válení. Děti si to milují skládat samy."
        }
      },
      ct: {
        lunch: "Zapečené kuře s paprikou a cibulí",
        dinner: "Těstoviny aglio olio s cherry rajčaty",
        prep: "Kuře marinovat v jogurtu",
        recipe: {
          ingredients: ["kuřecí stehna 1 kg", "paprika 3 ks", "cibule 2 ks", "jogurt 3 lžíce (na marinádu)", "sůl, pepř, paprika, česnek, olej", "brambory nebo rýže jako příloha"],
          steps: ["Kuře potři jogurtem, solí, pepřem a paprikou (ideálně večer předem).", "Dej do pekáče s nakrájenou paprikou a cibulí.", "Přidej trochu oleje a vody, peč 50-60 min při 190 °C.", "Během pečení 1-2x podlej."],
          time: "1 h (pasivně)",
          note: "Šťavnaté díky jogurtu. Zelenina se připraví sama v pekáči."
        }
      },
      pa: {
        lunch: "Zbytek kuřete, tortilla wrap",
        dinner: "Fish & chips z trouby (bez fritézy)",
        prep: "Rybu obalit, nechat v lednici",
        recipe: {
          ingredients: ["zbytek pečeného kuřete z předchozího dne", "tortilly 4 ks", "salát, rajče, okurka, jogurt nebo tatarka"],
          steps: ["Kuře odkostni a natrh ej na kousky.", "Zahřej v mikrovlnce nebo na pánvi.", "Na tortillu dej salát a zeleninu, přidej kuře a omáčku.", "Zabal a krátce opeč na sucho pánvi pro křupavost."],
          time: "10 min",
          note: "Rychlý oběd z včerejška. Děti to berou jako kebab."
        }
      },
      so: {
        lunch: "Burger party — hovězí i vegetariánské placky",
        dinner: "Domácí popcorn, ovoce, board sýrů",
        prep: "Nakupte extra pečivo v pátek",
        recipe: {
          ingredients: ["mleté hovězí 300 g + vegetariánské placky 2-3 ks", "burger housky 5 ks", "sýr na plátky, rajče, salát, cibule", "kečup, hořčice, majonéza", "sůl, pepř, olej"],
          steps: ["Mleté maso osol, opepři a tvaruj placičky (nebo použij kupované).", "Na pánvi nebo grilu osmaž 3-4 min z každé strany.", "Housky přepůl a lehce opeč.", "Každý si burger poskládá podle sebe."],
          time: "25 min",
          note: "Sobotní zábava. Dva druhy plack — každý si vybere."
        }
      },
      ne: {
        lunch: "Knedlíčková polévka (kupní knedlíčky OK)",
        dinner: "Lehká večeře — salát, vajíčka na měkko",
        prep: "Polévku uvařit z mražené zeleniny",
        recipe: {
          ingredients: ["kuřecí nebo zeleninový vývar 1,5 l (nebo z kostí)", "mražená zeleninová směs 300 g", "knedlíčky polévkové 1 balení", "mrkev 1 ks", "petržel, sůl, pepř", "čerstvá petrželka na závěr"],
          steps: ["Vývar přiveď k varu, přidej nakrájenou mrkev a mraženou zeleninu.", "Vař 10 min, pak přidej knedlíčky (podle návodu obvykle 3-5 min).", "Dochut' solí a pepřem, posyp nasekanou petrželkou."],
          time: "20 min",
          note: "Lehký a rychlý oběd po těžším víkendu. Knedlíčky z obchodu ušetří čas."
        }
      },
    },
    shopping: [
      {
        category: "Maso & ryby",
        items: [
          "kuřecí stehna 1 kg",
          "mleté hovězí 500 g",
          "losos uzený 200 g",
          "treska 600 g",
          "burger placky 4+2 veg",
        ],
      },
      {
        category: "Mléčné",
        items: [
          "kokosové mléko 2×",
          "jogurt bílý",
          "sýry na board 3 druhy",
          "máslo, mléko",
          "vejce 10 ks",
          "krupice",
        ],
      },
      {
        category: "Zelenina & ovoce",
        items: [
          "avokádo 3 ks",
          "cherry rajčata 500 g",
          "paprika, cibule",
          "okurky, limetky",
          "mražená zeleninová směs",
          "ovoce mix",
          "salát",
        ],
      },
      {
        category: "Trvanlivé & pečivo",
        items: [
          "rýže 2 balení",
          "tortilly, burger housky",
          "těstoviny spaghetti",
          "brambory 2 kg",
          "fazole černé konzerva",
          "taco koření / salsa",
          "knedlíčky polévkové",
          "strouhanka",
        ],
      },
      {
        category: "Ostatní",
        items: [
          "olej, česnek",
          "kukuřičné lupínky na popcorn",
          "med, ořechy",
        ],
      },
    ],
    tips: [
      {
        title: "Taco úterý",
        text: "Dejte ingredience na stůl — každý si složí sám. Nulové stížnosti.",
      },
      {
        title: "Ryba z trouby",
        text: "Pátek fish & chips: pečte na plechu, 25 min, bez smell v kuchyni.",
      },
      {
        title: "Sobotní burger party",
        text: "Jedna pánev, dvě varianty. Připravte salát bar předem.",
      },
    ],
  },
];

const BREAKFAST_BONUS = {
  id: "snidane",
  emoji: "🥣",
  title: "Rychlé snídaně pro chaotická rána",
  subtitle: "5 receptů zdarma s nákupem — připrava max 10 min",
  recipes: [
    {
      id: 1,
      name: "Overnight oats s banánem a ořechy",
      time: "5 min večer",
      servings: "4 porce",
      ingredients: [
        "ovesné vločky 200 g",
        "mléko nebo rostlinné 400 ml",
        "banány 2 ks",
        "ořechy nebo semínka 50 g",
        "med nebo javorový sirup 2 lžíce",
        "skořice špetka"
      ],
      steps: [
        "Večer: vločky, mléko, med a skořici smíchej v míse nebo sklenicích.",
        "Přidej nakrájený banán a polovinu ořechů, promíchej.",
        "Zakryj a dej do lednice přes noc.",
        "Ráno: přidej zbylý banán a ořechy, zamíchej. Hotovo za 30 vteřin."
      ],
      note: "Připrav večer, ráno jen vyndej. Děti milují sladkou verzi."
    },
    {
      id: 2,
      name: "Rychlý zelený smoothie",
      time: "3 min",
      servings: "4 sklenice",
      ingredients: [
        "mražený špenát nebo baby špenát 100 g",
        "banány 2 ks",
        "jablko 1 ks",
        "jogurt bílý nebo rostlinný 300 g",
        "voda nebo mléko 200 ml",
        "med podle chuti"
      ],
      steps: [
        "Všechny ingredience dej do mixéru.",
        "Mixuj 1–2 minuty dohladka.",
        "Rozděl do sklenic nebo lahví.",
        "Pij hned nebo dej do lednice na dopoledne."
      ],
      note: "Zelenina schovaná, sladké od ovoce. Skvělé na cestu."
    },
    {
      id: 3,
      name: "Míchaná vajíčka se špenátem a sýrem",
      time: "7 min",
      servings: "4 porce",
      ingredients: [
        "vejce 8 ks",
        "mléko 50 ml",
        "čerstvý nebo mražený špenát 150 g",
        "sýr (eidam nebo gouda) 100 g",
        "sůl, pepř, máslo nebo olej"
      ],
      steps: [
        "Vejce rozšlehej s mlékem, solí a pepřem.",
        "Na pánvi rozehřej máslo, přidej špenát a restuj 1 min.",
        "Přilij vajíčka a míchej na středním plameni 4–5 min.",
        "Na závěr přidej nastrouhaný sýr a nech rozpustit.",
        "Podávej s chlebem nebo rohlíkem."
      ],
      note: "Bílkoviny na start dne. Děti často jedí i se špenátem."
    },
    {
      id: 4,
      name: "Jogurtový parfait s ovocem a granolou",
      time: "5 min",
      servings: "4 sklenice",
      ingredients: [
        "bílý jogurt 500 g",
        "mražené nebo čerstvé bobule 300 g",
        "granola nebo ovesné vločky s medem 100 g",
        "med nebo džem 2 lžíce"
      ],
      steps: [
        "Do sklenic nebo misek vrstvěte: jogurt, ovoce, granola.",
        "Opakujte 2–3 vrstvy.",
        "Zakápněte medem.",
        "Můžete připravit večer do uzavíratelných sklenic."
      ],
      note: "Žádný vaření. Krásně vypadá, děti si to sestaví samy."
    },
    {
      id: 5,
      name: "Rychlé banánové palačinky (mikrovlnka nebo pánev)",
      time: "8 min",
      servings: "8–10 malých",
      ingredients: [
        "banány 2 zralé ks",
        "vejce 2 ks",
        "ovesné vločky 100 g nebo mouka",
        "mléko 50 ml",
        "prášek do pečiva špetka",
        "máslo nebo olej na smažení"
      ],
      steps: [
        "Banány rozmačkej vidličkou.",
        "Přidej vejce, vločky, mléko a prášek, promíchej na husté těsto.",
        "Na pánvi nebo v mikrovlnce (v silikonové formě) peč 2–3 min z každé strany nebo 1,5 min v mikru.",
        "Podávej s ovocem nebo jogurtem."
      ],
      note: "Bez cukru, sladké od banánu. Děti je milují jako dezert i snídani."
    }
  ]
};