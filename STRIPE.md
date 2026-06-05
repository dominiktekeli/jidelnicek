# Stripe — nastavení (doporučená cesta)

**Web:** https://jidelnicek-olive.vercel.app

## Texty do Stripe (co kam zkopírovat)

Payment Link **není** Shopify košík — nejde tam velký marketingový sloupec. Důležité texty ale nastavit jde:

| Kde v Dashboardu | Co tam dát |
|------------------|------------|
| **Product** → tvůj produkt | Název + popis (zobrazí se v souhrnu objednávky) |
| **Payment Link** → Upravit → stránka produktu | Stejný produkt, jednorázová platba |
| **Settings → Branding** | Logo, barva tlačítka (mint `#2d9a6a`) |
| **Settings → Checkout** | Kontakt, odkaz na obchodní podmínky / vrácení peněz |
| **Payment Link → Po platbě** | Redirect na `dekujeme.html` |
| **Settings → Emails** | Text v potvrzení platby (odkaz na jídelníček) |

**Nevyplňuj** u Payment Linku: dodací adresu, telefon (pokud nepotřebuješ), předplatné.

## Česká pokladna (jazyk + Kč)

### 1. Jazyk checkoutu (pro zákaznice)

V `config.js` je `stripeLocale: "cs"` — web k odkazu **Koupit** automaticky přidá `?locale=cs`.

Ručně v Dashboardu u Payment Linku: **Copy link** → **Add URL parameters** → `locale` = `cs`.

Nebo na konec odkazu:

```
https://buy.stripe.com/...?locale=cs
```

Checkout pak bude česky (e-mail, karta, souhrn). Tlačítko může zůstat „Zaplatit“ / „Pay“ podle verze Stripe.

### 2. Měna produktu

**Products** → cena musí být **CZK** (297 Kč), ne EUR/USD.

### 3. Jazyk Stripe Dashboardu (jen pro tebe)

[Dashboard](https://dashboard.stripe.com) → ikona účtu → **Settings** → **Personal details** / jazyk prohlížeče — admin rozhraní, ne pokladna zákaznice.

### 4. Účet Stripe

Při zakládání účtu zvol **Česko** jako zemi podnikání (ovlivní výpisy a některá nastavení). Už hotový účet: **Settings → Business** — země se mění jen přes podporu Stripe.

---

### Název produktu (Product name)

```
🍽 Klid v kuchyni — 4týdenní jídelníček
```

### Popis produktu (Product description) — zobrazí se u pokladny

```
🍽 4 týdny obědů a večeří pro rodinu — vše v mobilu
🛒 Nákupní seznamy · přehled celého týdne dopředu
💚 Jedna platba 297 Kč · žádné předplatné
♻️ Přístup navždy — recepty, které budeš chtít opakovat

📱 Po zaplacení hned: odkaz do aplikace v prohlížeči (bez instalace)
📧 Stejný odkaz ti přijde i e-mailem
📲 Na mobilu: Sdílet → Přidat na plochu
```

Kratší varianta (limit znaků):

```
🍽 4 týdny jídla v mobilu · 🛒 nákup · 💚 297 Kč jednorázově · 📱 přístup hned po platbě
```

### Potvrzovací e-mail od Stripe (Settings → Emails → Successful payments)

Do vlastního textu / footeru:

```
💚 Děkujeme za nákup!

📱 Otevři jídelníček hned tady:
https://jidelnicek-olive.vercel.app/dekujeme.html

📲 Na mobilu: po otevření Sdílet → Přidat na plochu.

🔑 Záložní vstup (heslo z e-mailu / po objednávce):
https://jidelnicek-olive.vercel.app/stahnout.html

✉️ Potřebuješ pomoc? napiš na ahoj@tvujemail.cz
```

(Vyměň e-mail za skutečný z `config.js`.)

### Checkout → zásady obchodu (Settings → Checkout)

- **Support email:** tvůj e-mail
- **Policy links:** až máš stránku obchodních podmínek / vrácení peněz (nebo odkaz na jednoduchou stránku na webu)

Krátká věta k vrácení (pokud nabízíš garanci):

```
Nespokojenost do 14 dní — napiš na support e-mail, vrátíme platbu.
```

---

## 1. Redirect po platbě (povinné — bez toho to nefunguje)

**Podrobný návod s obrázky kroků:** soubor `STRIPE-REDIRECT.md`

Ve zkratce: Payment Link → **Upravit** → **Po platbě** → **Přesměrovat na web**:

```
https://jidelnicek-olive.vercel.app/dekujeme.html
```

Nepoužívej jen „potvrzovací stránku Stripe“ — tam redirect není.

Zákaznice po zaplacení uvidí velké tlačítko **Otevřít jídelníček** — bez hesla.

## 2. E-mail od Stripe

Do potvrzení objednávky přidej:

```
Otevřete jídelníček: https://jidelnicek-olive.vercel.app/dekujeme.html

(Na mobilu: Sdílet → Přidat na plochu.)

Záložní vstup heslem: https://jidelnicek-olive.vercel.app/stahnout.html
```

Heslo = `downloadPassword` v `config.js`.

## 3. Test vs. live

| | URL |
|---|-----|
| **Test (teď)** | `buy.stripe.com/test_...` |
| **Ostrý prodej** | vytvoř live Payment Link, vyměň v `config.js` |

Test karta: `4242 4242 4242 4242`

## 4. DPH / faktury

Jako fyzická osoba v ČR sleduj limity pro DPH. Pro vyšší obrat zvaž **Lemon Squeezy** (řeší DPH jako prodejce) — viz `PLATBY.md`.