# Newood Millwork Inc. — Official Website

Official source code repository for the **Newood Millwork Inc.** corporate website ([newoodmillwork.com](https://newoodmillwork.com/)). Built around three core service divisions — Custom Cabinets & Storage, Custom Kitchen & Bath, and Custom Commercial Millwork — manufactured out of our shop in Concord, Ontario, serving the Greater Toronto Area (GTA).

---

## 🛠️ Tech Stack & Infrastructure

- **Front-End:** HTML5, CSS3 (Flexbox/Grid), Modern Vanilla JavaScript (ES6+) — no build step, no framework
- **Hosting:** GitHub Pages (connected to custom domain via CNAME)
- **Domain & DNS:** Squarespace DNS (pointed to GitHub Pages)
- **Forms & Lead Tracking:** Pre-filled `mailto:` links to `info@newoodmillwork.com` (no backend — see `script.js`)

---

## 📂 Project Directory Structure

```text
├── index.html               # Homepage (hero, 3 divisions, about, testimonials, lead form)
├── closets.html             # Custom Cabinets & Storage service page
├── kitchens.html             # Custom Kitchen & Bath service page (kitchens + bathroom vanities)
├── commercial.html          # Custom Commercial Millwork service page
├── warranty.html            # Lifetime workmanship warranty & terms
├── privacy.html             # Privacy policy
├── styles.css                # Site-wide stylesheet (single source file, loaded directly — no minify step)
├── script.js                  # Site-wide JS: nav, lightbox, quote form, scroll reveal (single source file)
├── assets/
│   ├── brand/                # logo.png, favicon-192.png, favicon-32.png
│   ├── hero/                  # Full-bleed hero background photos, one per division
│   └── gallery/               # Pillar cards, service-page feature photos, and project galleries
├── sitemap.xml                # XML sitemap for search engines
├── robots.txt                 # Crawler rules
├── CNAME                      # Custom domain configuration (newoodmillwork.com)
├── LICENSE                    # Proprietary license & copyright notice
└── README.md                  # This file
```

**Note:** the site is English-only, three pages deep on services (Cabinets & Storage / Kitchen & Bath / Commercial Millwork). Bathroom vanities live on the Kitchen & Bath page rather than as their own page. There is no `vanities.html`, `office.html`, `why-us.html`, `door-order.html`, or `/fr/` / `/zh/` section — earlier versions of this repo had some of these; all references have been removed from every page's `<head>`, nav, and `sitemap.xml`.

## ✏️ Making Changes

`styles.css` and `script.js` are loaded directly by every page — edit them and refresh, no build or minify step required. If you want to reintroduce minification for production, that's a `clean-css-cli` / `terser` step you can add back into a small script, but it isn't part of the current workflow.

## 🖼️ Image Notes

- `assets/hero/` and `assets/gallery/` are populated with real photos as of this update. The Commercial division only has two usable project photos on file (`commercial-01.webp`, `commercial-02.webp`) — its "Recent Projects" gallery is thin until more commercial photos are supplied.
- `assets/brand/logo.png` and the two favicon files were derived directly from the supplied logo artwork (the favicons are a cropped version of the icon mark). If a cleaner, pre-exported icon-only file becomes available, swap it in at the same path/sizes.
- Photos are served as `.webp` only (no `.jpg` duplicates) to keep page weight down — GitHub Pages doesn't need a fallback format for any currently-supported browser.
