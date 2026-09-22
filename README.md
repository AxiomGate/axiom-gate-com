# axiom-gate.com

Company website for Axiom Gate. It's plain HTML/CSS/JS with no build step, hosted on **Cloudflare Pages**.

```
site/            <- everything that gets published (Pages "build output directory")
  index.html  services.html  work.html  about.html  contact.html  404.html
  css/styles.css
  js/config.js   <- the ONLY file to edit for form / booking / email settings
  js/main.js
  _headers       <- security headers (CSP, HSTS, etc.) applied by Cloudflare Pages
  robots.txt  sitemap.xml  llms.txt  favicon.svg
```

## Preview locally

```bash
py -m http.server 8125 --directory site
```

Then open http://localhost:8125. It's also registered as `axiom-gate-website` in the workspace `.claude/launch.json`.

Internal links use `.html` filenames so they work locally. Cloudflare Pages serves them at clean URLs (`/services`) and redirects `.html` requests automatically.

## Placeholders to fill in before launch (`site/js/config.js`)

| Setting | Current | How to get the real value |
|---|---|---|
| `FORM_ENDPOINT` | `https://formspree.io/f/YOUR_FORM_ID` | Create a free Formspree account, add a form, and set its email to your @axiom-gate.com mailbox |
| `BOOKINGS_URL` | `PLACEHOLDER_BOOKINGS_URL` | Outlook → Bookings → your booking page → copy the public link |
| `CONTACT_EMAIL` | `hello@axiom-gate.com` | Change it if the mailbox has a different name. Also update the fallback text in the page footers and the JSON-LD block in `index.html`. |

While placeholders are set, the site still behaves sensibly. The form shows a "not connected yet, please email us" notice instead of failing, and "Book a call" links go to the contact page, which explains that booking is being set up.

## Deploy (Cloudflare Pages)

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → select this repo.
2. Build settings: Framework preset **None**, build command **(empty)**, build output directory **`site`**.
3. After the first deploy: project → **Custom domains** → add `axiom-gate.com`, then add `www.axiom-gate.com`.
4. Redirect www to the apex: **Rules** → **Redirect Rules** → create a rule so that when the hostname equals `www.axiom-gate.com`, it does a dynamic 301 redirect to `concat("https://axiom-gate.com", http.request.uri.path)`, preserving the query string.

**Do not touch the existing MX / TXT records.** Email for axiom-gate.com runs on Microsoft 365: MX `axiomgate-com01c.mail.protection.outlook.com`, SPF, and the `MS=` verification record.

## Content notes

- Client case studies are **anonymized** on purpose: no client names, logos, or screenshots. Get written permission before naming anyone.
- Update the "Where it stands" status badges on `work.html` as projects launch.
- When you add or rename pages, update `sitemap.xml` and `llms.txt`.
