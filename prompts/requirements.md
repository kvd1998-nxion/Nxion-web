# Nxion.org — Product Requirements
### Feature-by-Feature Specification

---

## Overview

**nxion.org** is the primary digital presence for Nxion Consulting, a professional technology consulting business specialising in AI, data engineering, and cloud-native architecture. The site is a static SPA (no server, no database) deployed to GitHub Pages and serves three audiences:

- **Prospective clients** — evaluating whether to engage Nxion
- **Partners** — technology vendors and other consulting firms seeking collaboration
- **Internal team** — generating invoices and publishing knowledge content

---

## Feature 1 — Home Page

### Purpose
First impression page. Must communicate authority and convert visitors into contact form submissions within the first 5 seconds.

### Requirements

#### FR-1.1 Hero Section
- Display a bold primary headline: "Data-Driven Decisions at Scale"
- Display a supporting sub-headline describing Nxion's consulting focus
- Include an animated technology visualization (SVG decision tree) reinforcing the data/AI brand
- Render a primary CTA button linking to `/contact`
- Animate on page load using Framer Motion entrance transitions

#### FR-1.2 Principles Section
- Display three core principles as cards: **Data-Driven**, **Ethical by Design**, **Outcome-Focused**
- Each principle has an icon, a title, and a 1–2 sentence description
- Cards animate in with scroll-reveal on first viewport entry

#### FR-1.3 Services Preview Section
- Display all four service cards sourced from `src/data/services.json`
- Each card shows: icon, service title, description, technology tags
- Cards animate in with staggered scroll-reveal (100ms delay between cards)
- Include a secondary CTA linking to the full services section or contact

#### FR-1.4 Thought Leadership Section
- Display up to 3 recent Knowledge Hub article preview cards
- Each card shows: article title, date, description, read time, tags, and a "Read more" link
- Articles sourced at build time from `src/content/*.md` via Vite glob import
- Cards animate in with scroll-reveal

#### FR-1.5 Call-to-Action Section
- Full-width banner at the bottom of the page
- Strong headline encouraging contact ("Ready to build something exceptional?")
- Button linking to `/contact`

#### FR-1.6 SEO
- Page title: `Nxion Consulting | Data-Driven Technology Consulting`
- Meta description covering core services
- Open Graph title, description, and image (1200×630 `og-image.png`)
- Twitter card type: `summary_large_image`
- Canonical URL: `https://nxion.org/`

---

## Feature 2 — Knowledge Hub (Article Listing)

### Purpose
Demonstrate thought leadership through in-depth technical articles. Supports SEO and builds client confidence before a paid engagement.

### Requirements

#### FR-2.1 Article Discovery
- All `.md` files in `src/content/` are automatically discovered at build time
- No code changes required to add a new article — only a new `.md` file
- Articles are sorted by date (newest first)

#### FR-2.2 Article Listing Grid
- Display all articles as a responsive card grid (3 columns desktop, 2 tablet, 1 mobile)
- Each card displays: title, date, description, read time, tags
- Clicking a card navigates to `/knowledge/:slug`
- Slug derived from filename: `my-article.md` → `/knowledge/my-article`

#### FR-2.3 Article Frontmatter Schema
Each `.md` file must include a frontmatter block at the top:

```
---
title: "Article Title"
date: "YYYY-MM-DD"
description: "One to two sentence summary shown in the listing card."
readTime: "7 min read"
tags: ["Tag One", "Tag Two"]
---
```

#### FR-2.4 SEO
- Page title: `Knowledge Hub | Nxion Consulting`
- Meta description describing the hub
- Canonical URL: `https://nxion.org/knowledge`

---

## Feature 3 — Knowledge Article (Article Detail)

### Purpose
Render a single knowledge article from its Markdown source with full formatting support.

### Requirements

#### FR-3.1 Markdown Rendering
- Render article body as HTML using `react-markdown`
- Support GitHub-Flavoured Markdown (tables, strikethrough, task lists) via `remark-gfm`
- Syntax-highlight code blocks via `rehype-highlight`
- Apply Tailwind typography styles to rendered output

#### FR-3.2 Article Header
- Display article title, date, read time, and tags above the body
- Tags rendered as styled pill badges

#### FR-3.3 Navigation
- "Back to Knowledge Hub" link at top of page
- On invalid slug, redirect to `/knowledge`

#### FR-3.4 SEO
- Page title: `{Article Title} | Nxion Consulting`
- Meta description from article frontmatter `description` field
- Canonical URL: `https://nxion.org/knowledge/{slug}`

---

## Feature 4 — About Page

### Purpose
Tell the Nxion company story, establish credibility, and communicate values to prospective clients evaluating the firm.

### Requirements

#### FR-4.1 Company Story Section
- Narrative description of Nxion's founding, mission, and market focus
- Scroll-reveal entrance animation on first viewport entry

#### FR-4.2 Stats Section
- Display 3–4 key metrics (e.g., years of experience, projects delivered, client satisfaction)
- Stats render as large-number highlights with labels
- Animated entrance on scroll

#### FR-4.3 Values Section
- List core company values (e.g., Integrity, Innovation, Impact)
- Each value has an icon, a title, and a short description

#### FR-4.4 SEO
- Page title: `About Nxion | Technology Consulting`
- Meta description focused on company background
- Canonical URL: `https://nxion.org/about`

---

## Feature 5 — Contact Page

### Purpose
Capture qualified leads with enough context to respond meaningfully. Primary conversion mechanism for the site.

### Requirements

#### FR-5.1 Contact Form Fields
| Field | Type | Validation |
|---|---|---|
| Name | Text input | Required, non-empty |
| Email | Email input | Required, valid email format |
| Inquiry Type | Select dropdown | Required, one of: Consulting Engagement, Partnership, Training & Workshops, General Inquiry |
| Message | Textarea | Required, non-empty |

#### FR-5.2 Validation Behaviour
- Validate on submit (not on blur)
- Display inline error messages below each invalid field
- Error messages animate in using Framer Motion `AnimatePresence`
- On valid submission: show a success state (simulated — no real backend submission)
- On error state: form remains populated so user does not lose input

#### FR-5.3 Contact Information Display
- Display alongside the form: email address, location (city/region), and LinkedIn or social link
- Each item with an icon from Lucide React

#### FR-5.4 SEO
- Page title: `Contact Nxion | Start a Consulting Engagement`
- Meta description encouraging contact
- Canonical URL: `https://nxion.org/contact`

---

## Feature 6 — Invoice Generator (Form)

### Purpose
Allow the Nxion team to generate professional monthly consulting invoices directly from the website, eliminating manual invoice creation in Word or Excel.

### Requirements

#### FR-6.1 Invoice Form Sections
The form is organised into five input sections:

**Section 1 — Consultant Details**
| Field | Type | Notes |
|---|---|---|
| Consultant Name | Text | Required |
| Role / Title | Text | Required |

**Section 2 — Client Details**
| Field | Type | Notes |
|---|---|---|
| Client Company Name | Text | Required |
| Client Address | Textarea | Required; multi-line street + city/state/ZIP |

**Section 3 — Billing Period**
| Field | Type | Notes |
|---|---|---|
| Invoice Date | Date picker | Required; defaults to today |
| Billing Month | Select dropdown | Required; January–December |
| Year | Select dropdown | Required; current year ± range |

- Billing Month and Year selects are used instead of `<input type="month">` for full cross-browser compatibility (Safari does not support `type="month"`)
- Selected month + year are stored internally as `YYYY-MM` string (`billingMonthYear`)
- Selecting a month/year dynamically renders **4 or 5 weekly rows** depending on the number of days in the selected month:
  - 4 weeks: February in non-leap years (28 days)
  - 5 weeks: all other months (29–31 days)
- Week rows resize reactively when month changes; existing entries are preserved

**Section 3 — Weekly Hours & Deliverables** *(rendered after month is selected)*
- One row per week (Week 1 through Week 4 or 5), each row contains:
  - Week label badge (`Week 1` … `Week 5`)
  - Focus / Deliverables text input (optional; describes work done that week)
  - Hours numeric input (0–999, step 0.5)

**Section 4 — Billing Rate**
| Field | Type | Notes |
|---|---|---|
| Hourly Rate (USD) | Number | Required; used for total calculation |

**Section 5 — Payment Details** *(collapsible)*
| Field | Type | Notes |
|---|---|---|
| Company Name | Text | Defaults to `Nxion Consulting LLC` |
| Bank Name | Text | Defaults to `Chase` |
| Account # | Text | Optional |
| Routing # | Text | Optional |

#### FR-6.2 Live Preview Bar
- Display a live-updating summary bar above the form showing:
  - Generated invoice number: `NXION-{MONTH}-{YEAR}`
  - Total hours (sum of all weekly hours)
  - Total amount formatted as currency (e.g., `$8,736.00`)
- Updates reactively as the user fills in the form

#### FR-6.3 Invoice Number Algorithm
```
Format:  NXION-{FULL_MONTH_UPPERCASE}-{YEAR}
Example: NXION-MARCH-2026
```
- Derived from `billingMonthYear` (`YYYY-MM`) using a static month name lookup
- No client code or date range in the invoice number

#### FR-6.4 Week Count Rule
| Days in month | Weeks rendered |
|---|---|
| 28 (Feb, non-leap) | 4 |
| 29–31 (all others) | 5 |

Week definitions (fixed 7-day chunks):
- Week 1: days 1–7 · Week 2: days 8–14 · Week 3: days 15–21 · Week 4: days 22–28
- Week 5: days 29–end *(only when month > 28 days)*

#### FR-6.5 Validation
| Field | Rule |
|---|---|
| Consultant Name | Required |
| Position | Required |
| Client Name | Required |
| Client Address | Required |
| Invoice Date | Required |
| Billing Month + Year | Both required (billingMonthYear must be set) |
| Weekly Hours | At least one week must have hours > 0 |
| Billing Rate | Required, must be > 0 |

#### FR-6.6 Form Submission
- On submit, validate all required fields; show inline animated errors for failures
- Navigate to `/invoice/preview` passing all computed data via React Router state
- No data written to localStorage, URL params, or any backend

#### FR-6.7 SEO
- Page title: `Invoice Generator | Nxion`
- Canonical URL: `https://nxion.org/invoice`
- Meta robots: `noindex` (internal tool, should not appear in search results)

---

## Feature 7 — Invoice Preview & PDF Download

### Purpose
Display a print-ready, professional invoice and allow the user to download it as a PDF in one click.

### Requirements

#### FR-7.1 Invoice Document Layout
The `InvoiceDocument` renders three clearly labelled sections (top to bottom):

**Header**
| Side | Content |
|---|---|
| Left | Nxion logo, "Consulting" subtext, email, website |
| Right | Bill To (client name + address), Invoice #, Invoice Date, Billing Period (month + year) |

**Centered title:** "INVOICE" + billing month/year subtitle

**Section 1 — Payment Summary** *(high-visibility, navy-bordered box)*
| Row | Content |
|---|---|
| Description | "Consulting Services" |
| Consultant | Name and Role |
| Hourly Rate | Formatted as `$XX.00/hr` |
| Total Hours | Sum of all weekly hours |
| — divider — | |
| Total Amount Due | Bold, large — the visual centrepiece |
| Amount in words | e.g. "Eight Thousand Seven Hundred Thirty Six Dollars Only" |

**Section 2 — Payment Instructions** *(light grey box)*
- Company Name, Bank Name, Account #, Routing # in a 2-column labelled grid

**Section 3 — Service Summary** *(weekly table at bottom)*
| Column | Content |
|---|---|
| Week | Week 1 … Week 4 or 5 |
| Primary Focus / Deliverables | Free-text entered per week |
| Hours | Numeric hours; `—` if zero |
| Footer row | TOTAL HOURS = sum |

#### FR-7.2 Styling Constraints
- `InvoiceDocument` must use **100% inline styles** (no Tailwind utility classes)
- Reason: Tailwind classes may be stripped or overridden by browser print engines
- Background must be white; text must be dark (print-safe)
- All month name resolution uses a static `MONTH_NAMES` array — never `toLocaleDateString()` — to prevent locale-dependent rendering failures

#### FR-7.3 PDF Download
- "Download PDF" button calls `window.print()`
- CSS `@media print` hides all non-invoice elements (action bar, dark page background)
- `@page { size: letter; margin: 0.75in; }` sets paper dimensions
- No third-party PDF library (no jsPDF, no Puppeteer)

#### FR-7.4 Action Bar
- Fixed bar at top of screen with: "Back", "Edit", and "Download PDF" buttons
- Action bar suppresses site Navbar and Footer (AppShell route-aware check)
- Action bar marked with `.no-print` CSS class so it disappears in print output

#### FR-7.5 Guard Clause
- If user navigates directly to `/invoice/preview` without form state, redirect to `/invoice`
- Prevents the preview rendering with undefined data

#### FR-7.6 Amount-to-Words Algorithm
- Converts numeric dollar amounts to written English
- Format: `"{amount in words} Dollars Only"`
- Handles values up to $999,999
- Examples:
  - `8736` → `"Eight Thousand Seven Hundred Thirty Six Dollars Only"`
  - `500` → `"Five Hundred Dollars Only"`

---

## Feature 8 — Site Navigation (Navbar)

### Requirements

#### FR-8.1 Layout
- Fixed-position header at the top of every page (except `/invoice/preview`)
- Left: Nxion logo / wordmark linking to `/`
- Right: Navigation links — Home, Knowledge Hub, About, Contact, Invoice (icon-labelled)

#### FR-8.2 Scroll-Progressive Glassmorphism
- At top of page: near-transparent background, minimal blur
- On scroll (0–80px): background opacity transitions `0.2 → 0.9`, blur transitions `4px → 16px`
- Driven by Framer Motion `useScroll` + `useTransform` — runs on compositor thread, no layout thrash

#### FR-8.3 Active Link State
- Highlight the current route's nav link (different colour or underline)
- Derived from `useLocation().pathname`

#### FR-8.4 Mobile Responsiveness
- Collapse nav links into a hamburger menu on small screens
- Menu opens/closes with animated Framer Motion transition

---

## Feature 9 — Footer

### Requirements

#### FR-9.1 Layout
- Three-column layout (desktop): brand column, navigation links, services list
- Collapses to single column on mobile

#### FR-9.2 Brand Column
- Nxion wordmark and tagline
- Copyright notice with current year

#### FR-9.3 Navigation Column
- Links to all main pages: Home, Knowledge Hub, About, Contact

#### FR-9.4 Services Column
- List of the four service names (non-linked, informational)

---

## Feature 10 — SEO & Social Sharing

### Requirements

#### FR-10.1 Per-Page Head Management
- Every route renders a `<SEOHead>` component wrapping `react-helmet-async`
- Tags set per page: `<title>`, `<meta name="description">`, `<link rel="canonical">`

#### FR-10.2 Open Graph Tags (all pages)
- `og:title` — page-specific title
- `og:description` — page-specific description
- `og:image` — `https://nxion.org/og-image.png` (1200×630 static image)
- `og:url` — canonical URL of the page

#### FR-10.3 Twitter Card
- `twitter:card` = `summary_large_image` on all pages

#### FR-10.4 Limitations
- SEO is client-side only — search crawlers that do not execute JavaScript see the default `index.html` title
- Future: migrate to Remix or Next.js for SSR SEO if needed

---

## Feature 11 — CI/CD & Deployment

### Requirements

#### FR-11.1 Automated Deployment
- Every push to the `main` branch triggers an automated build and deploy to GitHub Pages
- Workflow: `checkout → setup-node → npm ci → vite build → copy 404.html → deploy`
- Manual trigger (`workflow_dispatch`) also supported

#### FR-11.2 SPA Routing Fix
- GitHub Pages returns a real 404 for unrecognised paths
- Fix: copy `dist/index.html` → `dist/404.html` before deployment
- GitHub Pages serves `404.html` for any unmatched path, which bootstraps the React app

#### FR-11.3 Concurrency
- `cancel-in-progress: true` — a new push cancels any in-progress deployment to avoid stale builds

#### FR-11.4 Custom Domain
- `public/CNAME` contains `nxion.org` — persists the custom domain configuration across deploys
- DNS managed via Squarespace

---

## Non-Functional Requirements

### NFR-1 Performance
- Initial JavaScript bundle must not include page code — all 7 pages are lazy-loaded via `React.lazy()`
- Large dependencies split into separate cacheable chunks: `react-vendor`, `framer`, `markdown`, `icons`
- Fonts self-hosted via `@fontsource/inter` — no Google Fonts network request at runtime

### NFR-2 Accessibility
- All interactive elements must be keyboard-navigable
- Form fields must have associated `<label>` elements
- Images must have meaningful `alt` attributes
- Colour contrast must meet WCAG AA minimum (4.5:1 for normal text)

### NFR-3 Responsiveness
- Site must be fully functional and visually correct on: mobile (320px+), tablet (768px+), desktop (1024px+)
- Tailwind responsive prefixes (`sm:`, `md:`, `lg:`) used throughout

### NFR-4 Security
- No sensitive data persisted to localStorage, cookies, or URL params
- Invoice data lives only in React Router navigation state (cleared on tab close)
- Contact form has no real backend — no data transmitted to external services in current state

### NFR-5 Maintainability
- New Knowledge Hub articles: add a `.md` file to `src/content/` — no code changes required
- New services: add an entry to `src/data/services.json` — no code changes required
- No CMS dependency; content is version-controlled alongside code

---

## Known Gaps & Future Considerations

| Area | Current State | Recommended Next Step |
|---|---|---|
| Contact form backend | Simulated success only (no real submission) | Integrate Formspree, Web3Forms, or Cloudflare Worker |
| Invoice persistence | Session only — refreshing preview redirects to form | Add localStorage save/load or lightweight backend |
| SEO for JS-disabled crawlers | Client-side rendering only | Migrate to Remix or Next.js for SSR |
| Analytics | None | Add Plausible (privacy-first) or GA4 |
| Testing | No automated tests | Add Vitest + React Testing Library |
| Authentication | None | Add if invoice history or client portal is needed |
| CMS | Manual `.md` files + git push | Integrate Contentlayer or a headless CMS (e.g. Sanity) |
