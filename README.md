# Newood Millwork Inc. — Official Website

Official source code repository for the **Newood Millwork Inc.** corporate website ([newoodmillwork.com](https://newoodmillwork.com/)). Designed and developed to showcase custom cabinetry, closets, kitchen millwork, office cabinetry, and commercial fit-outs manufactured out of our shop in Concord, Ontario, serving the Greater Toronto Area (GTA).

---

## 🛠️ Tech Stack & Infrastructure

- **Front-End:** HTML5, CSS3 (Flexbox/Grid), Modern Vanilla JavaScript (ES6+)
- **Hosting:** GitHub Pages (Connected to custom domain via CNAME)
- **Domain & DNS:** Squarespace DNS (pointed to GitHub Pages)
- **Forms & Lead Tracking:** Pre-filled `mailto:` links to `info@newoodmillwork.com` (no backend — see `script.js`)

---

## 📂 Project Directory Structure

```text
├── index.html              # Homepage (overview, 4-step process, testimonials, lead form)
├── kitchens.html           # Custom Kitchen Cabinetry service page
├── closets.html            # Custom Closets & Storage Systems service page
├── vanities.html           # Custom Bathroom Vanities service page
├── office.html             # Custom Office Cabinetry service page
├── commercial.html         # Commercial Millwork & Retail Fixtures service page
├── warranty.html           # Lifetime workmanship warranty & terms
├── privacy.html            # Privacy policy
├── door-order.html         # Standalone "Create an Order" door/drawer form (opened in an iframe overlay from the main nav)
├── door-order.css          # Styles scoped to door-order.html
├── styles.css / styles.min.css   # Site-wide stylesheet (source / minified — pages load the minified file)
├── script.js / script.min.js     # Site-wide JS: nav, lightbox, quote form, scroll reveals, order popup (source / minified — pages load the minified file)
├── assets/                 # WebP images, logos, and iconography
├── sitemap.xml             # XML sitemap for search engines
├── robots.txt              # Crawler rules
├── CNAME                   # Custom domain configuration (newoodmillwork.com)
├── LICENSE                 # Proprietary license & copyright notice
└── README.md               # Repository documentation
```

**Note:** the site is English-only. There is no `why-us.html` page and no `/fr/` or `/zh/` translated sections — earlier versions of this repo referenced both; those references have been removed from every page's `<head>`, nav, and `sitemap.xml`.

## ✏️ Making Changes

`styles.css` and `script.js` are the sources of truth — edit those, then regenerate the minified files every page actually loads:

```bash
npx clean-css-cli -o styles.min.css styles.css
npx terser script.js -o script.min.js --compress --mangle
```

The `<style>`/`<script>` block for the "Create an Order" popup used to be duplicated inline on every page; it now lives once in `styles.css` and `script.js`, shared by every page that includes the popup markup (`#orderPopup`, `#orderPopupFrame`, `#createOrderNavLink`).
