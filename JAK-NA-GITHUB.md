# Jak nahrát projekt na GitHub (bez přihlášení heslem v terminálu)

Máš 3 možnosti — od nejjednodušší.

---

## Možnost 1: GitHub Desktop (doporučeno)

1. Stáhni **GitHub Desktop**: https://desktop.github.com  
2. Přihlas se přes **prohlížeč** (ne terminál).  
3. Menu **File → Add Local Repository**  
4. Vyber složku: `/Users/dominiktekeli/klid-v-kuchyni`  
5. Klikni **Publish repository** (nebo Push origin).  
6. Název: `jidelnicek`, účet `dominiktekeli`.

Hotovo.

---

## Možnost 2: SSH klíč (jednou nastavíš, pak push bez hesla)

### Krok A — klíč je už vytvořený

Ve schránce máš veřejný klíč (nebo ho zkopíruj z terminálu):

```bash
cat ~/.ssh/id_ed25519_github.pub
```

### Krok B — přidej na GitHub

1. Otevři: https://github.com/settings/ssh/new  
2. **Title:** MacBook jidelnicek  
3. **Key:** vlož celý řádek začínající `ssh-ed25519 AAAA...`  
4. **Add SSH key**

### Krok C — push

```bash
cd /Users/dominiktekeli/klid-v-kuchyni
git push -u origin main
```

Remote je už nastavený na: `git@github.com:dominiktekeli/jidelnicek.git`

---

## Možnost 3: Vercel bez GitHubu

1. Jdi na https://vercel.com  
2. **Add New → Project**  
3. **Import Third-Party Git** přeskoč — použij **Deploy** a nahraj složku `klid-v-kuchyni` jako ZIP  
   (nebo později propoj GitHub až bude fungovat).

---

## Proč terminál nefungoval

- GitHub **nepřijímá heslo** k účtu — jen token nebo SSH.  
- Token v chatu byl neplatný / bez oprávnění → 403.  
- Přihlašovací okno v Cursor terminálu často nejde otevřít.

**Nikdy neposílej token do chatu** — vždy ho smaž na GitHubu po použití.