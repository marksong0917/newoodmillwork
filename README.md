# Newood Millwork Inc. — Official Website

Official source code repository for the **Newood Millwork Inc.** corporate website ([newoodmillwork.com](https://newoodmillwork.com/)). Built around three core service divisions — Custom Closets & Storage, Custom Kitchens, and Custom Commercial Millwork — manufactured out of our shop in Concord, Ontario, serving the Greater Toronto Area (GTA).

Site by [Yorkregionwebstudio.com](https://yorkregionwebstudio.com).

---

## 🛠️ Tech Stack & Infrastructure

- **Front-End:** HTML5, CSS3 (Flexbox/Grid), Modern Vanilla JavaScript (ES6+) — no framework, no CMS
- **Hosting:** GitHub Pages (connected to custom domain via CNAME)
- **Domain & DNS:** Squarespace DNS (pointed to GitHub Pages)
- **Forms:** The homepage contact form posts to [FormSubmit](https://formsubmit.co) (`info@newoodmillwork.com`) — no server of our own required. A `mailto:` link is also shown as a fallback.
- **Free Kitchen Estimator:** hosted separately at [estimator.newoodmillwork.com](https://estimator.newoodmillwork.com), on its own subdomain/hosting with a small backend (`/api/calculate`, `/api/submit-lead`). Not part of this repo — cross-linked from the homepage and Kitchens page.

---

## 📂 Project Directory Structure

```text
├── index.html          # Homepage (hero, 3 divisions, testimonials, contact)
├── closets.html        # Custom Closets & Storage service page
├── kitchens.html        # Custom Kitchens service page (kitchens + bathroom vanities)
├── commercial.html      # Custom Commercial Millwork service page
├── warranty.html        # Lifetime workmanship warranty
├── terms.html            # Website Terms of Use (separate from the product warranty above)
├── privacy.html          # Privacy policy
├── styles.css             # Stylesheet source — edit this one
├── styles.min.css         # Minified production build — pages actually load this
├── script.js               # JS source — edit this one
├── script.min.js           # Minified production build — pages actually load this
├── assets/
│   ├── brand/             # logo.png, favicon-192.png, favicon-32.png
│   ├── hero/               # Full-bleed hero background photos, one per division
│   └── gallery/            # Pillar cards, service-page feature photos, project galleries
├── sitemap.xml              # XML sitemap (includes lastmod dates)
├── robots.txt                # Crawler rules
├── .gitignore                 # OS/editor/build-artifact excludes
├── CNAME                      # Custom domain configuration (newoodmillwork.com)
├── LICENSE                    # Proprietary license & copyright notice
└── README.md                  # This file
```

**Note:** the site is English-only, three pages deep on services (Closets & Storage / Kitchens / Commercial Millwork — the nav bar uses the short forms "Closets" and "Kitchen"). Bathroom vanities live on the Kitchens page rather than as their own page.

`vanities.html`, `office.html`, and `door-order.html` do **not** exist in this repo. They were once real pages, then briefly kept as tiny `noindex` redirect stubs (to gracefully handle any old bookmarked/indexed links after the site was restructured), and have now been removed entirely by request. If Google still shows a stale cached snippet for one of these URLs, that's expected to clear on its own the next time it recrawls and finds nothing there — no action needed.

## ✏️ Making Changes

`styles.css` and `script.js` are the source files — edit those. Every page loads the **minified** versions (`styles.min.css`, `script.min.js`), so after editing a source file, regenerate its minified build before pushing:

```bash
npx clean-css-cli -o styles.min.css styles.css
npx terser script.js -o script.min.js --compress --mangle
```

If you forget this step, your edits to the source files simply won't show up on the live site, since the pages don't load them directly.

## 🖼️ Image Notes

- `assets/hero/` and `assets/gallery/` are populated with real photos. The Commercial division only has two usable project photos on file (`commercial-01.webp`, `commercial-02.webp`) — its "Recent Projects" gallery is thin until more commercial photos are supplied.
- `assets/brand/logo.png` and the two favicon files were derived from the supplied logo artwork (the favicons are a cropped version of the icon mark).
- Photos are served as `.webp` only to keep page weight down.

## 📄 Legal Pages

Three separate legal pages, each with a distinct scope — don't merge them:
- **`warranty.html`** — the physical product warranty on cabinetry/millwork we build and install.
- **`terms.html`** — website Terms of Use: acceptable use of the site, the estimator tool's non-binding-estimate disclaimer, IP, liability, third-party links, governing law.
- **`privacy.html`** — what data we collect through the site and what we do with it.
