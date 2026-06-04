# Stripe — nastavení (doporučená cesta)

**Web:** https://jidelnicek-olive.vercel.app

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