# Co je lepší pro tebe (rozhodnutí)

## Teď: Stripe Payment Link ✓

**Proč jsme nechali Stripe:**
- Už máš hotový odkaz a funguje
- Maminky platí kartou / Apple Pay — známé
- Rychlý start bez další platformy

**Co jsme vylepšili:**
- Po platbě → `dekujeme.html` → **jedno velké tlačítko**, bez hledání hesla
- Přístup se zapamatuje v telefonu (`localStorage`)
- Aplikace jde **přidat na plochu** (PWA manifest)
- Sdílení na Facebooku (Open Graph meta)
- Mobilní lišta **Koupit** dole na landing page
- Platba ve **stejném okně** (lepší návrat z Stripe na mobilu)

## Později (při vyšších tržbách): Lemon Squeezy

Zvaž přechod, až prodáš víc, pokud nechceš řešit DPH sám:
- Lemon Squeezy = **merchant of record** (DPH/faktury EU)
- V `config.js` vyměníš `checkoutUrl` za LS odkaz

## Checklist před ostrým prodejem

- [ ] Stripe **live** Payment Link v `config.js`
- [ ] Redirect na `dekujeme.html`
- [ ] Změnit `downloadPassword` v `config.js`
- [ ] Změnit `supportEmail`
- [ ] Projít test nákupu: koupit → dekujeme → app → nákupní seznam