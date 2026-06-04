# Stripe — redirect po platbě (MUSÍŠ NASTAVIT)

Bez tohoto kroku zákaznice **zůstane na stránce Stripe** a na tvůj web se sama nevrátí.

## Krok za krokem (2 minuty)

1. Otevři **https://dashboard.stripe.com/test/payment-links**  
   (v ostrém prodeji bez `/test/`)

2. Klikni na **svůj Payment Link** (ten s odkazem `test_4gM28rcAB...`).

3. Klikni **Upravit** (Edit) vpravo nahoře.

4. Záložka **Po platbě** / **After payment**.

5. Vyber **Přesměrovat zákazníky na web**  
   (NE „Zobrazit potvrzovací stránku“).

6. Do pole URL vlož **přesně**:

```
https://jidelnicek-olive.vercel.app/dekujeme.html
```

7. **Ulož** (Save).

8. Znovu otestuj nákup test kartou `4242 4242 4242 4242`.

---

## Volitelně (lepší sledování)

URL může být:

```
https://jidelnicek-olive.vercel.app/dekujeme.html?session_id={CHECKOUT_SESSION_ID}
```

Stripe doplní ID platby do adresy.

---

## E-mail od Stripe

Settings → **Emails** → zapni potvrzení platby.

Do textu přidej odkaz (záloha když redirect nefunguje):

```
Váš jídelníček: https://jidelnicek-olive.vercel.app/dekujeme.html
```

---

## Test režim

Redirect nastavuj v **test** Payment Linku, pokud platíš test kartou.  
Pro live prodej stejné u **live** odkazu.