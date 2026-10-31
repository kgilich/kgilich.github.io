# gilich.cz

Osobní web postavený na [Eleventy](https://www.11ty.dev/), nasazovaný přes GitHub Actions na GitHub Pages.

## Lokálně

```sh
npm install
npm start          # náhled na http://localhost:8080, obnovuje se sám
npm test           # validace HTML + kontrola interních odkazů (po `npm run build`)
npm run lighthouse # Lighthouse pro /, /en/ a /web/ (po `npm run build`)
```

## Kde co upravit

| Co | Soubor |
| --- | --- |
| Texty úvodní stránky (CZ / EN) | `src/index.njk`, `src/en/index.njk` |
| Zkušenosti | `src/_data/experience.json` |
| Technologie | `src/_data/tech.json` |
| Služby v menu | `src/_data/services.json` (+ nová stránka, např. `src/<sluzba>/index.njk`) |
| Reference | `src/_data/references.json` – první 3 jsou vidět, zbytek pod „Zobrazit další“ |
| Stránka Jednoduché weby | `src/web/index.njk` (FAQ a cena ve front matter) |
| CV ke stažení | nahraj `src/files/cv.pdf` (volitelně `cv-en.pdf`) – tlačítko se objeví samo |
| Analytika | `goatcounter` v `src/_data/site.json` (kód z goatcounter.com) |
| Společné šablony | `src/_includes/` (layout, navigace, ikony) |

## Nasazení

Push do `main` spustí `.github/workflows/deploy.yml`: build → validace HTML → kontrola odkazů → Lighthouse → nasazení.
Pull requesty se jen otestují. V nastavení repa musí být **Settings → Pages → Source: GitHub Actions**.
