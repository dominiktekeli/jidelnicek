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
      },
      ut: {
        lunch: "Gulášová polévka, chléb, šunkový sendvič",
        dinner: "Pečený losos, rýže, brokolice na páře",
        prep: "Losos marinovat 15 min ráno",
      },
      st: {
        lunch: "Špagety bolognese (dvojitá porce na pátek)",
        dinner: "Sýrové palačinky, ovoce",
        prep: "Omáčku uvařit odpoledne, zmrazit půlku",
      },
      ct: {
        lunch: "Fazolová polévka, topinky s česnekem",
        dinner: "Kuřecí stir-fry, nudle",
        prep: "Zeleninu nakrájet do krabiček",
      },
      pa: {
        lunch: "Zbytek bolognese, salát z ledového salátu",
        dinner: "Domácí pizza (koupené těsto), zelenina",
        prep: "Těsto vyndat ráno z lednice",
      },
      so: {
        lunch: "Svíčková z tašky (omáčka) + knedlík z mikrovlnky",
        dinner: "Grilované klobásy, brambory, hořčice",
        prep: "Nákup v pátek odpoledne",
      },
      ne: {
        lunch: "Smažený sýr, brambory, tatarka",
        dinner: "Lehká zeleninová polévka, toast",
        prep: "Odpočinek — minimum vaření",
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
      },
      ut: {
        lunch: "Wrapy s kuřetem, zeleninou a jogurtovým dresinkem",
        dinner: "Pečená zelenina s halloumi",
        prep: "Zeleninu nakrájet, uložit do mísy",
      },
      st: {
        lunch: "Rybí prsty + hrášek + bramborová kaše",
        dinner: "Kuřecí curry s rýží (jemné pro děti)",
        prep: "Curry koření smíchat předem do skleničky",
      },
      ct: {
        lunch: "Špenátové noky s máslem a parmazánem",
        dinner: "Těstovinový salát s tuňákem",
        prep: "Salát uvařit večer, ráno jen vyndat",
      },
      pa: {
        lunch: "Zbytek curry",
        dinner: "Burgery z mletého krůtího, pečené hranolky",
        prep: "Hranolky nakrájet, namočit ve vodě",
      },
      so: {
        lunch: "Pečené kuře (celé), brambory, mrkev",
        dinner: "Omeleta se zeleninou",
        prep: "Kuře marinovat v sobotu ráno",
      },
      ne: {
        lunch: "Ovesná kaše s ovocem a ořechy (brunch)",
        dinner: "Zeleninový krém, toast s avokádem",
        prep: "Ořechy nasekat, ovoce připravit",
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
      },
      ut: {
        lunch: "Bramboráky, kefír",
        dinner: "Kuřecí vývar + nudle s zeleninou",
        prep: "Vývar z kostí — vařit pasivně 2 h",
      },
      st: {
        lunch: "Zapečené brambory s cottage a šunkou",
        dinner: "Líné lasagne (bez vaření těstovin)",
        prep: "Lasagne složit večer, ráno jen zapéct",
      },
      ct: {
        lunch: "Kuskus s grilovanou zeleninou",
        dinner: "Mleté maso na paprice (po maďarsku), rýže",
        prep: "Kuskus připravit za 5 min",
      },
      pa: {
        lunch: "Zbytek lasagní",
        dinner: "Smažený květák, bramborová kaše",
        prep: "Květák obalit ráno, večer jen osmažit",
      },
      so: {
        lunch: "Sekaná pečeně, brambory, kyselá okurka",
        dinner: "Palačinky (sladké i slané)",
        prep: "Sekanou připravit v pátek večer",
      },
      ne: {
        lunch: "Chlebíčky — vajíčková pomazánka, šunka",
        dinner: "Zeleninový salát s cizrnou",
        prep: "Pomazánku uvařit v neděli dopoledne",
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
      },
      ut: {
        lunch: "Tacos / tortilla bowls (mleté maso, fazole)",
        dinner: "Pečené filety z tresky, bramborová kaše",
        prep: "Taco koření smíchat doma",
      },
      st: {
        lunch: "Sushi bowl (rýže, losos uzený, okurka, avokádo)",
        dinner: "Krupicová kaše s ovocem (děti milují)",
        prep: "Rýži uvařit předem",
      },
      ct: {
        lunch: "Zapečené kuře s paprikou a cibulí",
        dinner: "Těstoviny aglio olio s cherry rajčaty",
        prep: "Kuře marinovat v jogurtu",
      },
      pa: {
        lunch: "Zbytek kuřete, tortilla wrap",
        dinner: "Fish & chips z trouby (bez fritézy)",
        prep: "Rybu obalit, nechat v lednici",
      },
      so: {
        lunch: "Burger party — hovězí i vegetariánské placky",
        dinner: "Domácí popcorn, ovoce, board sýrů",
        prep: "Nakupte extra pečivo v pátek",
      },
      ne: {
        lunch: "Knedlíčková polévka (kupní knedlíčky OK)",
        dinner: "Lehká večeře — salát, vajíčka na měkko",
        prep: "Polévku uvařit z mražené zeleniny",
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