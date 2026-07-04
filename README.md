# Finhashy AI Company Site

A clean light company website for Finhashy AI, positioned around two lending
products:

- Finhashy LOS: loan origination workflow from RM intake to OPS/disbursement.
- Finhashy AI BRE: AI-assisted business rule engine for eligibility, policy
  checks, scorecards, deviations, explainability, and decision APIs.

The public site is intentionally outcome-led. It describes the company,
platform, LOS, AI BRE, workflow, governance, and integrations without exposing
internal product screens or implementation details.

## Tech Stack

- Vite for local development and production builds
- Vanilla JavaScript
- Three.js for the subtle hero wireframe scene
- GSAP ScrollTrigger for scroll animation
- Lenis for smooth scrolling
- Inter via Google Fonts

## Local Development

Run from this `website/` folder:

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Build

```bash
npm run build
```

The Vite source lives under `src/` and builds into `dist/`.

For GitHub Pages branch/root hosting, the current production build is also
checked in at the repo root:

- `index.html`
- `assets/`
- `CNAME`
- `.nojekyll`

After future source edits, run `npm run build`, then copy `dist/index.html` and
`dist/assets/` back to the repo root before committing.

## Project Structure

```text
website/
|-- index.html          # Built static page for GitHub Pages
|-- assets/             # Built static assets for GitHub Pages
|-- CNAME               # www.finhashy.com
|-- vite.config.js
|-- package.json
|-- package-lock.json
|-- README.md
`-- src/
    |-- index.html      # Editable site content
    |-- main.js         # Lenis + GSAP + scene wiring
    |-- scene.js        # Three.js hero wireframe scene
    `-- style.css       # Light theme + responsive layout
```

## Content Focus

- Loan origination system for NBFCs, banks, fintechs, and lending teams
- RM, CO, BPO, BCM, OPS, admin, and auditor workflow ownership
- KYC, documents, bureau/data, underwriting, sanction, agreement, mandate,
  disbursement, and audit trail
- AI BRE for policy rules, FOIR, DTI, LTV, deviations, risk scoring,
  explainability, decision APIs, and fallback scorecards

## Contact

- Email: `info@finhashy.com`
- Phone: `+91 97903 41202`
- LinkedIn: `https://www.linkedin.com/company/fincore-tech`
