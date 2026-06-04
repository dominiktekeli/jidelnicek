# Stripe — tvůj checkout

**Odkaz (test):** `https://buy.stripe.com/test_4gM28rcAB6Zl1Zy92n3Je00`

Je už v `config.js` → tlačítka **Koupit** na webu vedou na Stripe.

## Po úspěšné platbě (důležité)

V [Stripe Dashboard](https://dashboard.stripe.com) → **Payment Links** → tvůj link → **After payment**:

**Redirect customers to a webpage**

```
https://jidelnicek-olive.vercel.app/dekujeme.html
```

## E-mail zákaznici

Stripe umí poslat potvrzení. Do vlastního textu (nebo do Stripe e-mailu) přidej:

```
Aplikace: https://jidelnicek-olive.vercel.app/app/
Heslo (záloha): [downloadPassword z config.js]
Vstup: https://jidelnicek-olive.vercel.app/stahnout.html
```

## Test vs. ostrý prodej

| Režim | Odkaz začíná |
|--------|----------------|
| Test | `buy.stripe.com/test_...` |
| Live | `buy.stripe.com/...` (bez `test_`) |

Až budeš prodávat naživo, vytvoř **live** Payment Link a vyměň `checkoutUrl` v `config.js` → `git push`.

## Testovací karta

`4242 4242 4242 4242` · libovolné datum · libovolné CVC