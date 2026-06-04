# Kde uvidíš web a aplikaci na internetu

## Adresy (po zapnutí GitHub Pages)

| Co | Odkaz |
|----|--------|
| **Prodejní stránka** | https://dominiktekeli.github.io/jidelnicek/ |
| **Aplikace (náhled)** | https://dominiktekeli.github.io/jidelnicek/app/ |
| **Po zaplacení** | https://dominiktekeli.github.io/jidelnicek/dekujeme.html |

## Jednorázově zapni Pages (2 kliky)

1. Otevři: https://github.com/dominiktekeli/jidelnicek/settings/pages  
2. U **Build and deployment** → **Source** zvol **GitHub Actions**  
3. Ulož / nech být — po dalším `git push` se web sám nahraje (1–2 min)

## Nebo Vercel (hezčí adresa bez `/jidelnicek/` v cestě)

Jedno kliknutí importu z GitHubu:

https://vercel.com/new/clone?repository-url=https://github.com/dominiktekeli/jidelnicek

→ Deploy → dostaneš např. `https://jidelnicek.vercel.app` a aplikace bude na `/app/`

## Push změn z Macu

```bash
cd /Users/dominiktekeli/klid-v-kuchyni
git add .
git commit -m "GitHub Pages + opravené odkazy"
git push
```

Po pushi: GitHub → záložka **Actions** → zelený check = web je online.