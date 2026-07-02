# Finhashy AI — Company Website

A self-contained, responsive marketing website for Finhashy AI. No build step, no
dependencies — plain HTML, CSS, and vanilla JavaScript. It can be hosted on any
static host (S3 + CloudFront, Netlify, Vercel, GitHub Pages, Nginx, etc.).

## Structure

```
website/
├── index.html    # All page content (single-page marketing site)
├── styles.css    # Design system + responsive layout
├── main.js       # Nav toggle, scroll reveal, contact form handling
└── README.md
```

## Sections

Header · Hero (decision-layer visual) · Why Finhashy AI · Platform (6 capabilities) ·
Architecture · Solutions · Outcomes · Security & trust · Pilot fit · Contact · Footer

## Run locally

It's static, so just open `index.html` in a browser. To serve it (recommended, so
in-page anchors and relative paths behave like production):

```powershell
cd website
python -m http.server 4321
# then open http://localhost:4321
```

## Wiring the contact form

`main.js` currently validates input and shows a confirmation message — it does **not**
send data anywhere yet. To connect it, replace the marked block in the `submit`
handler with a `fetch()` POST to your CRM or a demo-request endpoint. For example,
you could point it at the LOS backend or a dedicated marketing endpoint.

## Branding

- Primary: indigo `#4f46e5`
- Accents: cyan `#06b6d4`, teal `#14b8a6`
- Dark surfaces: navy `#0b1020` / `#111834`
- Typeface: Inter (loaded from Google Fonts)

## Deploy

Upload the four files as-is to any static host. No environment variables required.
