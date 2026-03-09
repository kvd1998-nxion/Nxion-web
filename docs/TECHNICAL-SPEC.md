# Nxion.org — Technical Specification
### Architecture, Technology Stack, Design Patterns & AI-Assisted Development

---

## 1. Project Overview

**nxion.org** is a static single-page application (SPA) built with React and deployed to GitHub Pages via automated CI/CD. It serves as a professional consulting website with five functional areas: marketing home page, knowledge base, about, contact, and an invoice generation tool.

**Repository:** `/Users/vamseekondapaneni/Projects/nxion-web`
**Primary domain:** nxion.org (DNS managed via Squarespace)
**Deployment target:** GitHub Pages (custom domain)
**Runtime:** Client-side only — no server, no database, no backend API

---

## 2. Core Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Build tool | **Vite** | 7.x | Dev server, HMR, production bundler (Rollup under the hood) |
| UI framework | **React** | 19.x | Component model, virtual DOM, hooks-based state |
| Styling | **Tailwind CSS v4** | 4.x | Utility-first CSS; CSS-first config via `@theme` |
| Animation | **Framer Motion** | 11.x | Declarative animations, scroll-reveal, spring physics |
| Routing | **React Router DOM** | 6.x | Client-side SPA routing, `useNavigate`, `useLocation` |
| SEO | **react-helmet-async** | — | Per-page `<head>` management (title, meta, OG tags) |
| Markdown | **react-markdown** | — | Renders `.md` content files to styled HTML |
| Markdown plugins | **remark-gfm** | — | GitHub-flavoured Markdown (tables, strikethrough, etc.) |
| Syntax highlight | **rehype-highlight** | — | Code block highlighting via highlight.js |
| Icons | **Lucide React** | — | Tree-shakeable SVG icon library |
| Class utilities | **clsx + tailwind-merge** | — | Conditional class name composition without conflicts |
| Fonts | **@fontsource/inter** | — | Self-hosted Inter font (no Google Fonts network request) |
| Node.js | Node | 25.x | Build toolchain runtime (not used at runtime in browser) |

---

## 3. Project Folder Structure

```
nxion-web/
│
├── .github/
│   └── workflows/
│       └── gh-pages.yml          # CI/CD: build → deploy on push to main
│
├── public/
│   ├── CNAME                     # "nxion.org" — persists custom domain across deploys
│   ├── favicon.svg               # SVG favicon (navy bg, teal "nx" monogram)
│   └── og-image.png              # 1200×630 Open Graph image (add manually)
│
├── src/
│   ├── api/                      # Reserved: future serverless function stubs
│   │   └── .gitkeep
│   │
│   ├── hooks/                    # Reusable React custom hooks
│   │   ├── useScrollReveal.js    # Wraps Framer Motion useInView for scroll animations
│   │   └── useScrollToTop.js     # Resets scroll position on route change
│   │
│   ├── lib/                      # Pure utility functions (no React, no side effects)
│   │   ├── utils.js              # cn() helper (clsx + twMerge), parseFrontmatter(), slugify()
│   │   └── invoiceUtils.js       # amountToWords(), date formatters, generateInvoiceNumber(), getDaysInRange()
│   │
│   ├── content/                  # Markdown source files — add new articles here
│   │   ├── the-future-of-ai-ethics.md
│   │   ├── scalable-data-pipelines.md
│   │   └── cloud-native-architecture.md
│   │
│   ├── data/
│   │   └── services.json         # Service card definitions (icon, title, desc, tags)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx        # Fixed glassmorphism header; scroll-progressive opacity/blur
│   │   │   ├── Footer.jsx        # 3-column footer: brand, nav links, services
│   │   │   └── ScrollToTop.jsx   # Mounts useScrollToTop; renders null
│   │   │
│   │   ├── ui/
│   │   │   ├── AlgorithmVisual.jsx  # Animated SVG decision tree (hero section)
│   │   │   ├── ServiceCard.jsx      # JSON-driven service card with scroll-reveal + hover
│   │   │   └── ContactForm.jsx      # Validated 4-field form with AnimatePresence errors
│   │   │
│   │   ├── invoice/
│   │   │   └── InvoiceDocument.jsx  # Print-ready invoice; forwardRef; all inline styles
│   │   │
│   │   └── seo/
│   │       └── SEOHead.jsx          # react-helmet-async wrapper for all meta/OG tags
│   │
│   ├── pages/                    # One file per route; all lazy-loaded
│   │   ├── Home.jsx              # 5 sections: Hero, Principles, Services, Thought Leadership, CTA
│   │   ├── KnowledgeHub.jsx      # /knowledge — article listing grid
│   │   ├── KnowledgeArticle.jsx  # /knowledge/:slug — markdown renderer
│   │   ├── About.jsx             # Company story, stats, values
│   │   ├── Contact.jsx           # Contact form + info
│   │   ├── InvoicePage.jsx       # /invoice — 5-section input form
│   │   └── InvoicePreview.jsx    # /invoice/preview — preview + print/download
│   │
│   ├── App.jsx                   # BrowserRouter + AppShell + lazy Routes + HelmetProvider
│   ├── main.jsx                  # React DOM root mount
│   ├── index.css                 # Tailwind v4 @theme tokens + print media query
│   └── App.css                   # Minimal: #root flex-column
│
├── docs/
│   ├── BUSINESS-SPEC.md          # Non-technical stakeholder overview (this file's companion)
│   └── TECHNICAL-SPEC.md         # This file
│
├── index.html                    # Vite entry point; theme-color meta
├── vite.config.js                # Vite + Tailwind plugin + manualChunks
├── postcss.config.js             # autoprefixer only (Tailwind handled by Vite plugin)
└── package.json
```

---

## 4. Architecture Patterns

### 4.1 Static SPA with Client-Side Routing

The application is a **100% client-rendered SPA**. There is no server. `React Router DOM v6` handles all navigation via the HTML5 History API.

**GitHub Pages SPA routing fix:** GitHub Pages returns a real 404 for unknown paths. The CI/CD pipeline copies `dist/index.html` → `dist/404.html` before deployment. GitHub Pages serves `404.html` for any unmatched path, which bootstraps the React app, and React Router resolves the correct route client-side.

```yaml
# .github/workflows/gh-pages.yml
- run: cp dist/index.html dist/404.html
```

### 4.2 Feature-Based Component Organisation

Components are grouped by **domain responsibility**, not by type:

```
components/
  layout/    ← site chrome (Navbar, Footer)
  ui/        ← reusable presentational components
  invoice/   ← invoice-specific components
  seo/       ← meta/head management
```

Pages are kept thin — they compose components and handle page-level SEO. Business logic lives in `src/lib/`.

### 4.3 Code Splitting (Lazy Loading)

All 7 pages are lazy-loaded using `React.lazy()` + `Suspense`. This means the initial JavaScript bundle does not include any page code — each page chunk is fetched only when the user navigates to it.

```js
// src/App.jsx
const Home           = lazy(() => import('./pages/Home'))
const InvoicePage    = lazy(() => import('./pages/InvoicePage'))
const InvoicePreview = lazy(() => import('./pages/InvoicePreview'))
// ...
```

**Manual chunk splitting** in `vite.config.js` further separates large dependencies:

```js
manualChunks: {
  'react-vendor': ['react', 'react-dom', 'react-router-dom'],
  'framer':       ['framer-motion'],
  'markdown':     ['react-markdown', 'remark-gfm', 'rehype-highlight'],
  'icons':        ['lucide-react'],
}
```

Result: `Home.jsx` chunk shrinks from ~611KB to ~15KB because Framer Motion is split into its own cacheable chunk.

### 4.4 Build-Time Markdown Discovery (Vite Glob Import)

Knowledge Hub articles are discovered at **build time** using Vite's `import.meta.glob`. This means no API call, no database — markdown files in `src/content/` become part of the build.

```js
// Eager: all .md files loaded synchronously at build time
const modules = import.meta.glob('../content/*.md', { query: '?raw', eager: true })
```

**Adding a new article requires only:** placing a `.md` file in `src/content/` and redeploying. No code changes.

**Frontmatter** (metadata at the top of each file) is parsed with a zero-dependency custom regex function in `src/lib/utils.js`:

```js
export function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  // ... parse key: value pairs including JSON arrays
}
```

### 4.5 Scroll-Progressive Glassmorphism (Framer Motion MotionValues)

The Navbar background blur and opacity are driven by Framer Motion's `useScroll` + `useTransform` — not JavaScript event listeners. This runs on the browser's compositor thread, not the main thread, avoiding layout thrash.

```js
const { scrollY } = useScroll()
const bgOpacity = useTransform(scrollY, [0, 80], [0.2, 0.9])
const blur       = useTransform(scrollY, [0, 80], [4, 16])   // px
```

These `MotionValue` streams are bound directly to the element's `style` prop, bypassing React re-renders entirely.

### 4.6 Scroll-Reveal Animation Pattern

Two patterns are used, depending on context:

**Pattern A — `whileInView` prop (simple, inline):**
Used on `ServiceCard`, article preview cards, and section headings.

```jsx
<motion.div
  initial={{ opacity: 0, y: 28 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-5%' }}
  transition={{ delay: index * 0.1, duration: 0.5 }}
>
```

**Pattern B — `useScrollReveal` hook (reusable):**
Used when the same reveal logic is needed across multiple components.

```js
// src/hooks/useScrollReveal.js
export function useScrollReveal(options = {}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px', ...options })
  return { ref, isInView }
}
```

> **Deprecated pattern avoided:** `useAnimation()` hook was the old Framer Motion approach. The current v11 `useInView` + `animate` prop pattern is used throughout.

### 4.7 Route-Aware Layout Shell (`AppShell`)

The Invoice Preview page has its own fixed action bar (Print / Download PDF buttons) and must suppress the site Navbar and Footer. Rather than passing props through the tree, a `useLocation` check inside `AppShell` conditionally renders chrome:

```jsx
function AppShell() {
  const { pathname } = useLocation()
  const isPreview = pathname === '/invoice/preview'
  return (
    <>
      {!isPreview && <Navbar />}
      <Suspense>...</Suspense>
      {!isPreview && <Footer />}
    </>
  )
}
```

### 4.8 Print-to-PDF Architecture

PDF generation uses the **browser's native print engine** — no third-party library (no jsPDF, no Puppeteer). The `InvoiceDocument` component uses 100% inline styles (not Tailwind) to guarantee correct rendering in both browser view and print output.

**Flow:**
1. User clicks "Download PDF" → `window.print()` is called
2. CSS `@media print` in `index.css` hides `.no-print` elements (action bar, hint text, dark background)
3. `@page { size: letter; margin: 0.75in; }` sets paper dimensions
4. The white-background `InvoiceDocument` fills the print area
5. Browser print dialog opens → user selects "Save as PDF"

**Why inline styles on InvoiceDocument?** Tailwind's utility classes rely on the site's CSS cascade. When printing, browsers may strip or override CSS in unexpected ways. Inline styles are the most portable and reliable approach for a document meant to be saved and shared.

### 4.9 Router State for Invoice Data Flow

The invoice form (`InvoicePage`) passes all computed data to the preview page using React Router's `navigate` state — no URL params, no localStorage, no global store.

```js
// InvoicePage.jsx
navigate('/invoice/preview', {
  state: { ...form, invoiceNumber, totalHours, totalAmount, billingRate }
})

// InvoicePreview.jsx
const { state } = useLocation()
if (!state?.invoiceNumber) return <Navigate to="/invoice" replace />
```

This means:
- No sensitive billing data in the URL
- Refreshing `/invoice/preview` redirects back to the form (clean UX)
- Zero persistence — data lives only in the browser session

---

## 5. Tailwind CSS v4 — Key Differences from v3

This project uses **Tailwind CSS v4**, which has breaking changes from v3:

| Feature | v3 | v4 (this project) |
|---|---|---|
| Config file | `tailwind.config.js` | Removed — config is in `index.css` |
| Theme customisation | `theme.extend` in JS | `@theme {}` block in CSS |
| Vite integration | `tailwindcss` PostCSS plugin | `@tailwindcss/vite` Vite plugin |
| Content scanning | `content: ['./src/**/*.{js,jsx}']` | Automatic via Vite plugin |
| Custom colours | `colors.navy: '#0A192F'` | `--color-navy: #0A192F` in `@theme` |

**`@theme` block in `src/index.css`:**

```css
@theme {
  --color-navy:       #0A192F;
  --color-navy-light: #112240;
  --color-navy-dark:  #020C1B;
  --color-electric:   #64FFDA;
  --color-slate:      #8892B0;
  --font-sans: 'Inter', system-ui, sans-serif;
}
```

These CSS custom properties automatically generate Tailwind utilities: `bg-navy`, `text-electric`, `border-slate`, etc.

---

## 6. SEO Implementation

Every route renders a `<SEOHead>` component that uses `react-helmet-async` to inject `<head>` tags:

```jsx
// src/components/seo/SEOHead.jsx
<Helmet>
  <title>{fullTitle}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  <meta property="og:title" content={fullTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content="https://nxion.org/og-image.png" />
  <meta name="twitter:card" content="summary_large_image" />
</Helmet>
```

`react-helmet-async` is used instead of `react-helmet` because the async version is React 18/19 compatible and safe with concurrent rendering.

**Limitation:** This is client-side SEO only. Search engine crawlers that do not execute JavaScript will see the default `index.html` title. For full server-side rendering (SSR) SEO, a migration to a framework like Remix or Next.js would be required.

---

## 7. CI/CD Pipeline

### `.github/workflows/gh-pages.yml`

**Trigger:** Push to `main` branch, or manual `workflow_dispatch`.

**Permissions:** The `id-token: write` permission enables GitHub's OIDC-based deployment to GitHub Pages without storing secrets.

**Concurrency:** `cancel-in-progress: true` means a new push cancels any in-progress deployment, avoiding stale builds.

**Pipeline steps:**
```
checkout → setup-node (v20, npm cache) → npm ci → vite build
  → cp dist/index.html dist/404.html       ← SPA routing fix
  → configure-pages → upload-pages-artifact → deploy-pages
```

**Why `npm ci` not `npm install`?** `npm ci` uses the lock file exactly, ensuring reproducible builds. `npm install` may update the lock file.

---

## 8. Invoice Feature — Technical Design

### Data Flow Diagram

```
InvoicePage (form state)
  ├── getDaysInRange(startDate, endDate)  → dynamic day inputs
  ├── generateInvoiceNumber(...)          → live preview bar
  └── on submit → navigate('/invoice/preview', { state })

InvoicePreview
  ├── useLocation().state                 → invoice data
  ├── <InvoiceDocument ref={printRef} data={state} />
  └── handlePrint() → window.print()

InvoiceDocument (forwardRef)
  ├── amountToWords(totalAmount)          → e.g. "Eight Thousand Seven Hundred..."
  ├── formatDisplayDate(dateStr)          → "11/02/2024"
  └── All styles: inline (print-safe)
```

### Invoice Number Algorithm

```
Format: NX-{MMDDYYYY}-{MMDDYYYY}-{STICKER}
Example: NX-11022024-11082024-ASCII

function generateInvoiceNumber(startDate, endDate, clientSticker) {
  return `NX-${formatDateCompact(startDate)}-${formatDateCompact(endDate)}-${clientSticker.toUpperCase()}`
}
```

### Number-to-Words Algorithm (`amountToWords`)

Converts dollar amounts to written English for the invoice summary line (e.g., `$8,736.00` → `"Eight Thousand Seven Hundred Thirty Six Dollars Only"`). Handles values up to $999,999.

The function works in three layers:
1. `convertHundreds(n)` — handles 0–999
2. Thousands prefix: `convertHundreds(Math.floor(n/1000)) + ' Thousand '`
3. Millions prefix: `convertHundreds(Math.floor(n/1000000)) + ' Million '`

---

## 9. Custom Hooks Reference

### `useScrollReveal(options)`
```js
// src/hooks/useScrollReveal.js
// Returns: { ref, isInView }
// Wraps framer-motion useInView with project defaults:
// once: true (animates only on first entry)
// margin: '-10% 0px' (triggers 10% before element enters viewport)
```

### `useScrollToTop()`
```js
// src/hooks/useScrollToTop.js
// Effect: window.scrollTo({ top: 0, behavior: 'instant' }) on pathname change
// 'instant' (not 'smooth') prevents conflict with page transition animations
// Mounted as: <ScrollToTop /> (renders null) inside BrowserRouter
```

---

## 10. Key Utility Functions Reference

| Function | File | Description |
|---|---|---|
| `cn(...inputs)` | `lib/utils.js` | `clsx` + `twMerge` — safe conditional Tailwind class composition |
| `parseFrontmatter(raw)` | `lib/utils.js` | Parses YAML-like frontmatter from raw markdown strings |
| `slugify(filename)` | `lib/utils.js` | `"My Article.md"` → `"my-article"` |
| `amountToWords(amount)` | `lib/invoiceUtils.js` | `8736` → `"Eight Thousand Seven Hundred Thirty Six Dollars Only"` |
| `generateInvoiceNumber(...)` | `lib/invoiceUtils.js` | Returns `NX-MMDDYYYY-MMDDYYYY-STICKER` |
| `getDaysInRange(start, end)` | `lib/invoiceUtils.js` | Returns array of `YYYY-MM-DD` strings; capped at 14 days |
| `formatCurrency(amount)` | `lib/invoiceUtils.js` | `8736` → `"$8,736.00"` via `Intl.NumberFormat` |
| `formatDisplayDate(dateStr)` | `lib/invoiceUtils.js` | `"2024-11-02"` → `"11/02/2024"` |
| `formatMonthYear(dateStr)` | `lib/invoiceUtils.js` | `"2024-11-02"` → `"November 2024"` |

---

## 11. How AI Code Generation Was Used

This entire codebase was built using **Claude Code** (Anthropic's AI coding agent) operating within the **Claude Agent SDK** framework. Understanding how AI was used helps new team members work effectively with the codebase and continue using AI assistance.

### 11.1 The AI Tools Used

| Tool | Role |
|---|---|
| **Claude Code CLI** | Primary coding agent — read files, wrote code, ran builds, committed git |
| **Claude Agent SDK** | Orchestration layer running specialised sub-agents (Plan, Explore) |
| **Plan Mode** | Architectural design phase before any code was written |
| **Explore Agent** | Codebase/environment discovery (found Node not installed, identified project structure) |
| **Plan Agent** | Designed the full architecture — component hierarchy, patterns, gotchas |

### 11.2 The Development Workflow Used

```
1. PLAN MODE (no code written)
   ├── Explore Agent: scanned environment, found no Node.js installed
   ├── Plan Agent: designed full architecture (tech stack, folder structure,
   │              component designs, data flows, CI/CD)
   └── Human: approved the plan

2. EXECUTE (sequential, with todo list tracking)
   ├── brew install node
   ├── npm create vite@latest nxion-web
   ├── npm install [all dependencies]
   ├── Write configuration files (vite.config.js, index.css, postcss.config.js)
   ├── Write utility files (utils.js, hooks)
   ├── Write components (Navbar → Footer → SEOHead → AlgorithmVisual → ServiceCard → ContactForm)
   ├── Write data + content (services.json, 3 markdown articles)
   ├── Write pages (Home → KnowledgeHub → KnowledgeArticle → About → Contact)
   ├── Wire App.jsx (lazy routes, HelmetProvider)
   ├── Create CI/CD + CNAME
   ├── npm run build (verified, fixed chunk size warnings with manualChunks)
   └── git init && git add -A && git commit

3. ITERATE (feature additions)
   ├── User requested Invoice feature
   ├── AI analysed existing patterns (read App.jsx, Navbar.jsx, index.css)
   ├── AI created invoiceUtils.js, InvoiceDocument, InvoicePage, InvoicePreview
   └── AI updated existing files (App.jsx routes, Navbar link, index.css print CSS)
```

### 11.3 What AI Did Well in This Project

- **Architecture consistency** — The AI enforced consistent patterns throughout (e.g., all pages use `SEOHead`, all scroll animations use `whileInView`, all routing uses `react-router-dom`).
- **Dependency selection** — The AI identified that Tailwind v4 uses `@tailwindcss/vite` not the PostCSS plugin, that `prismjs` and `rehype-highlight` would conflict, and that `react-helmet` is incompatible with React 19.
- **Build verification** — After writing all files, the AI ran `npm run build` to confirm zero errors before committing, then identified chunk size warnings and fixed them with `manualChunks`.
- **No over-engineering** — The markdown system uses a custom 10-line regex parser instead of adding `gray-matter` as a dependency. The PDF system uses `window.print()` instead of jsPDF.

### 11.4 AI Patterns to Follow When Adding Features

When using Claude Code to extend this project, the most effective prompting approach is:

**Be specific about what already exists:**
> "The project uses Tailwind v4 with `@theme` tokens in index.css. Colors are `#64FFDA` for electric, `#0A192F` for navy. All pages are lazy-loaded in App.jsx. New components go in `src/components/`. Read the existing ServiceCard.jsx before writing a new card-style component."

**Ask AI to read before writing:**
> "Read src/components/ui/ServiceCard.jsx first, then create a TestimonialCard.jsx in the same directory that follows the same animation and styling patterns."

**Use Plan Mode for large features:**
For any feature touching more than 3 files, use Claude Code's `/plan` mode first. It prevents the AI from making unguided assumptions about architecture.

**Verify with build:**
After AI-generated changes, always run `npm run build`. The AI should do this automatically, but confirming zero build errors before committing is the standard.

---

## 12. Environment Setup for New Developers

### Prerequisites

```bash
# macOS (Homebrew)
brew install node git

# Verify
node -v   # should be 20+
npm -v    # should be 10+
git -v    # should be 2.x
```

### Local Development

```bash
# Clone
git clone <repo-url>
cd nxion-web

# Install
npm install

# Dev server with HMR at localhost:5173
npm run dev

# Production build
npm run build

# Preview production build (handles SPA routing correctly)
npm run preview    # → localhost:4173
```

### Adding a Knowledge Hub Article

1. Create a new file in `src/content/` with a `.md` extension.
2. Add the frontmatter block at the top:

```markdown
---
title: "Your Article Title"
date: "2025-12-01"
description: "One or two sentence summary shown in the listing card."
readTime: "7 min read"
tags: ["Tag One", "Tag Two"]
---

# Your Article Title

Article body starts here...
```

3. Run `npm run dev` — the article appears automatically in `/knowledge`.
4. The slug (URL) is the filename without `.md`, e.g., `my-new-article.md` → `/knowledge/my-new-article`.

### Deployment

Push to `main`. GitHub Actions handles the rest:

```
git add -A
git commit -m "feat: add new article"
git push origin main
# → GitHub Actions builds and deploys to nxion.org within ~2 minutes
```

---

## 13. Known Limitations & Future Considerations

| Area | Current State | Future Option |
|---|---|---|
| SEO for crawlers | Client-side only (JS must execute) | Migrate to Remix or Next.js for SSR |
| Contact form backend | No real submission (simulated delay) | Connect to Formspree, Web3Forms, or a Cloudflare Worker |
| Invoice persistence | Browser session only (no save/history) | Add localStorage or a lightweight backend |
| Authentication | None | Add if invoice history or client portal is needed |
| CMS for content | Manual `.md` files + git push | Integrate Contentlayer or a headless CMS (e.g. Sanity) |
| Analytics | None | Add Plausible (privacy-first) or GA4 |
| Testing | None | Add Vitest + React Testing Library for component tests |

---

*For non-technical stakeholder context, see [BUSINESS-SPEC.md](./BUSINESS-SPEC.md).*
