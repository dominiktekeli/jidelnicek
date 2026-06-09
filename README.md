# Klid v kuchyni — prodejní web + aplikace

Prémiový landing (vlastní design), aplikace jídelníčku v `/app`, platby přes **Lemon Squeezy** (doporučeno pro EU/DPH).

## Struktura

| Cesta | Co to je |
|-------|----------|
| `/` | Prodejní stránka |
| `/app/` | Aplikace 4týdenní jídelníček (návrh č. 2) |
| `/dekujeme.html` | Po zaplacení (nastav redirect v Lemon Squeezy) |
| `/stahnout.html` | Vstup heslem z e-mailu |

## 1. Nastavení před deployem

Uprav `config.js`:

```js
checkoutUrl: "https://TVOJ-OBCHOD.lemonsqueezy.com/checkout/buy/XXXX",
priceDisplay: "149 Kč",
downloadPassword: "silne-heslo-pro-zakaznice",
supportEmail: "ahoj@tvoje-domena.cz",
```

## 2. Lemon Squeezy (doporučeno)

1. Účet na [lemonsqueezy.com](https://www.lemonsqueezy.com) — režim pro EU, DPH řeší platforma.
2. **Products** → nový produkt „4týdenní rodinný jídelníček“ (digitální).
3. **Price** — přesně 149 Kč (jednorázově, CZK). Důležité: musí sedět s cenou na webu (jinak disonance a ztráta důvěry).
4. **Files** (volitelné) — můžeš přiložit PDF; hlavní produkt je odkaz na web.
5. **Confirmation email** — do těla e-mailu vlož:
   - Odkaz na aplikaci: `https://klidvkuchyni.cz/app/`
   - Heslo: stejné jako `downloadPassword` v `config.js`
   - Odkaz: `https://klidvkuchyni.cz/stahnout.html`
6. **Product → Settings → Confirmation modal / Redirect URL**:
   - `https://klidvkuchyni.cz/dekujeme.html`
7. Zkopíruj **Checkout link** do `config.js` → `checkoutUrl`.

### Payhip (alternativa)

V `config.js` místo LS nastav `payhipUrl` a v `site.js` se použije automaticky.

## 3. Deploy na Vercel

### Varianta A — webové rozhraní (bez terminálu)

1. [vercel.com](https://vercel.com) → New Project
2. Nahraj složku `klid-v-kuchyni` (nebo propoj GitHub repo)
3. **Framework Preset:** Other (statický web)
4. **Root Directory:** `klid-v-kuchyni` (pokud je v monorepu)
5. Deploy

### Varianta B — CLI

```bash
cd klid-v-kuchyni
npx vercel
```

## 4. Vlastní doména (volitelné)

Vercel → Project → Domains → `klidvkuchyni.cz` (nebo jiná).

## 5. Bezpečnost přístupu

- `stahnout.html` používá **jednoduché heslo** v `config.js` + `sessionStorage` — vhodné pro běžný digitální produkt.
- Pro silnější ochranu: v Lemon Squeezy **unikátní license key** per zákazník nebo Vercel Password Protection (placené).

## Lokální náhled

```bash
cd klid-v-kuchyni
python3 -m http.server 8080
```

- Landing: http://localhost:8080  
- App: http://localhost:8080/app/