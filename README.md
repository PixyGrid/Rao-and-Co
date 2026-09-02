# Rao & Co HVAC — Premium Website

A complete, production-ready static rebuild of raoandco.in — pure HTML, CSS and vanilla JavaScript with GSAP. No build tools, no database, no dependencies to install. Just upload and go.

## What's inside

- **34 pages** — Home, About, Services (+7 service pages), Industries (+8 industry pages), Projects (+6 project pages), Clients, Blog (+3 articles), Contact, FAQ, 404
- **Brand-accurate** — Rao & Co red (#EA1B29) + navy (#17293E), Saira typography, real logo
- **Real photography** — your own India-based HVAC/AC project images, optimized
- **Premium interactivity** — GSAP preloader, custom cursor, scroll-reveal animations, sticky colour-swap header, animated counters, marquee tickers, auto-rotating testimonials, accordion FAQs, back-to-top and WhatsApp float
- **Fully responsive** — desktop, tablet and mobile with a slide-in mobile menu
- **SEO / AEO / GPT-SEO ready** — unique titles & meta descriptions, Open Graph + Twitter cards, JSON-LD schema (HVACBusiness/LocalBusiness, Service, FAQPage, BreadcrumbList, BlogPosting), `sitemap.xml`, `robots.txt` (with AI crawler rules), and `llms.txt` for answer engines

## Folder structure

```
/                 HTML pages (index, about, services, contact ...)
/services/*.html  Individual service pages
/industries/*.html
/projects/*.html
/blog/*.html
/css/rao.css      Full design system
/js/rao.js        All interactions
/js/plugins/      GSAP (local)
/img/             All optimized images
.htaccess         Clean URLs, HTTPS, caching (Apache/Hostinger)
sitemap.xml, robots.txt, llms.txt
```

## Deploying to Hostinger

1. Upload the **entire contents** of this folder into your `public_html` directory (replacing the old site — keep a backup first).
2. Clean URLs work automatically via the included `.htaccess` (e.g. `/services/air-conditioning-solutions`).
3. Done. The site is fully static and loads fast.

## Before you go live — quick edits

- **Contact form**: it's front-end only. Point it at an email service (e.g. Formspree) — replace the `<form id="contactForm">` action in `contact.html`, or wire it to a small PHP mailer.
- **Social links**: footer/topbar social icons use `#` placeholders — add your real Facebook / Instagram / LinkedIn URLs.
- **Leadership names**: `about.html` shows role titles with placeholder note — add real names when ready.
- **Analytics**: drop your Google Analytics / Search Console snippet into `css`/head as needed.

## Regenerating (optional)

The site is produced by the Python generators (`build.py`, `components.py`, `schema.py`, `pages.py`, `render.py`). Editing content data in `build.py` and running `python3 render.py` rebuilds every page consistently. These files are not part of the deployed site and can be deleted from `public_html`.
