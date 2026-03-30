# Feature: Invoice — Monthly Billing Model

## Status
- [x] Backlog — idea, not yet scoped
- [x] Ready — scoped and approved, ready to implement
- [ ] Done — implemented and merged into requirements.md

**Requested by:** Product / internal team
**Date added:** 2026-03-30
**Target:** Next implementation session

---

## 1. Problem / Why

The current invoice tool is **weekly**: the user selects a start date and end date (up to 14 days), then enters hours per individual calendar day. This does not match how monthly consulting engagements are actually billed — clients receive one invoice per month summarising 4 weeks of work, not a per-day timesheet.

Additional gaps in the current layout:
- The **Total Amount Due** is buried in a summary block below the line-item table — clients want to see the money first
- **Payment instructions** are styled as an afterthought footer; they should be a distinct, visible section
- There is no field for **what work was done each week** — the invoice only records hours, not deliverables

---

## 2. Goal / What Success Looks Like

The user selects a billing month (e.g., January 2025), enters hours and a primary focus description for each week (4 or 5 depending on the month), and generates a single-page professional invoice where:
- The **Payment Summary** (Total Amount Due) is the first thing the client sees
- **Payment Instructions** are clearly sectioned in the middle
- The **Weekly Service Summary table** appears at the bottom as supporting detail

---

## 3. Scope

### In scope
- Replace date-range + daily-hour inputs with a **month/year selector** + **dynamically rendered weekly rows** (4 or 5 weeks depending on the selected month) with hours + focus/deliverables per week
- New invoice number format: `NXION-{MONTH}-{YEAR}` (e.g., `NXION-JANUARY-2025`)
- New `InvoiceDocument` layout with three clearly labelled sections (see Section 6)
- Remove `clientSticker` field from form and invoice number (no longer needed in the new format)
- Update form validation for the new data model
- Update live preview bar to show new invoice number format and total from weekly hours

### Out of scope
- No changes to Consultant, Client, Billing Rate, or Payment Details form sections
- No changes to the print/PDF download mechanism (`window.print()` stays)
- No changes to `InvoicePreview.jsx` beyond what is forced by data model changes
- No backend, no persistence — session state via React Router stays
- No per-day hour breakdown (weekly granularity only)

---

## 4. Affected Features / Requirements

| FR Reference | Change Type | Description |
|---|---|---|
| FR-6.1 Section 3 | Update | Replace "Billing Period" (date range + daily hours) with "Billing Month" (month selector + 4 weekly rows) |
| FR-6.3 | Update | Invoice number format changes from `NX-{dates}-{STICKER}` to `NXION-{MONTH}-{YEAR}` |
| FR-6.1 Section 2 | Update | Remove `clientSticker` field (no longer part of invoice number) |
| FR-7.1 | Update | Invoice document layout restructured — 3 ordered sections replace current layout |
| FR-6.2 | Update | Live preview bar shows new invoice number format |

---

## 5. Affected Files

**Read first (understand before changing):**
- `src/pages/InvoicePage.jsx` — current form structure and state model
- `src/components/invoice/InvoiceDocument.jsx` — current document layout and inline styles
- `src/lib/invoiceUtils.js` — utility functions to update/remove/add
- `src/pages/InvoicePreview.jsx` — guard condition and data passthrough

**Modify:**
- `src/lib/invoiceUtils.js`
- `src/pages/InvoicePage.jsx`
- `src/components/invoice/InvoiceDocument.jsx`

**No changes expected:**
- `src/pages/InvoicePreview.jsx` — guard uses `state.invoiceNumber` which still exists; no other data dependency changes
- `src/App.jsx` — routes unchanged

---

## 6. Design & Behaviour Notes

### 6.1 New Form Data Model

```js
// Replace the current EMPTY state with:
const EMPTY = {
  consultantName:  '',
  position:        '',
  clientName:      '',
  clientAddress:   '',
  billingMonthYear: '',          // "YYYY-MM" — driven by <input type="month">
  invoiceDate:     TODAY,
  weeklyData: [
    { hours: '', focus: '' },    // Week 1
    { hours: '', focus: '' },    // Week 2
    { hours: '', focus: '' },    // Week 3
    { hours: '', focus: '' },    // Week 4
    // Week 5 added dynamically when selected month has > 28 days
  ],
  billingRate:     '',
  paymentCompany:  'Nxion Consulting LLC',
  bankName:        'Chase',
  accountNumber:   '',
  routingNumber:   '',
}
```

Fields removed from current model: `startDate`, `endDate`, `dailyHours`, `clientSticker`, `billingMonth`

### 6.2 Week Count Logic

A month's week count is determined by its day count using fixed 7-day billing chunks:

| Days in month | Weeks | Applies to |
|---|---|---|
| 28 | 4 | February (non-leap year) |
| 29–31 | 5 | All other months + leap Feb |

```js
// Add to invoiceUtils.js
export function getWeekCountForMonth(billingMonthYear) {
  if (!billingMonthYear) return 4
  const [year, month] = billingMonthYear.split('-').map(Number)
  const daysInMonth = new Date(year, month, 0).getDate()  // month is 1-based here
  return daysInMonth > 28 ? 5 : 4
}
```

Week definitions (fixed chunks, not ISO calendar weeks):
- Week 1: days 1–7
- Week 2: days 8–14
- Week 3: days 15–21
- Week 4: days 22–28
- Week 5: days 29–end *(only if month has > 28 days)*

**Form behaviour when month changes:** `weeklyData` array is resized reactively — existing entries are preserved, a new Week 5 entry is appended or the 5th entry is removed depending on the selected month:

```js
useEffect(() => {
  if (!form.billingMonthYear) return
  const count = getWeekCountForMonth(form.billingMonthYear)
  setForm(f => ({
    ...f,
    weeklyData: Array.from({ length: count }, (_, i) =>
      f.weeklyData[i] ?? { hours: '', focus: '' }
    ),
  }))
}, [form.billingMonthYear])
```

### 6.3 New Invoice Number Algorithm

```
Format:  NXION-{MONTH_FULL_UPPERCASE}-{YEAR}
Example: NXION-JANUARY-2025

// In invoiceUtils.js — replace generateInvoiceNumber():
export function generateMonthlyInvoiceNumber(billingMonthYear) {
  if (!billingMonthYear) return 'NXION-PENDING'
  const d = new Date(billingMonthYear + '-01T00:00:00')
  const month = d.toLocaleDateString('en-US', { month: 'long' }).toUpperCase()
  const year  = d.getFullYear()
  return `NXION-${month}-${year}`
}
```

Remove from `invoiceUtils.js`: `getDaysInRange`, `generateInvoiceNumber`, `formatDayLabel`, `formatDayShort`, `formatDateCompact`

### 6.3 New Invoice Document Layout (top to bottom)

```
┌─────────────────────────────────────────────────────┐
│  HEADER                                             │
│  Left:  nxion logo + "Consulting"                   │
│          hello@nxion.org  ·  nxion.org              │
│  Right: Bill To: {clientName}                       │
│          {clientAddress}                            │
│          Invoice #: NXION-JANUARY-2025              │
│          Invoice Date: MM/DD/YYYY                   │
│          Billing Period: January 2025               │
├─────────────────────────────────────────────────────┤
│  INVOICE — JANUARY 2025  (centered title)           │
├─────────────────────────────────────────────────────┤
│  SECTION 1 — PAYMENT SUMMARY  (high-visibility box) │
│  Description:    Consulting Services                │
│  Consultant:     {name}  |  Role: {position}        │
│  Hourly Rate:    $XX.00/hr                          │
│  Total Hours:    XX hrs                             │
│  ─────────────────────────────────────────          │
│  TOTAL AMOUNT DUE:  $XX,XXX.XX  (bold, prominent)  │
│  ({amount in words})                               │
├─────────────────────────────────────────────────────┤
│  SECTION 2 — PAYMENT INSTRUCTIONS                  │
│  Company Name:   Nxion Consulting LLC               │
│  Bank Name:      Chase                              │
│  Account #:      XXXXXXXXX                          │
│  Routing #:      XXXXXXXXX                          │
├─────────────────────────────────────────────────────┤
│  SECTION 3 — SERVICE SUMMARY  (weekly table)        │
│  ┌─────────┬──────────────────────────────┬──────┐  │
│  │ Week    │ Primary Focus / Deliverables  │ Hrs  │  │
│  ├─────────┼──────────────────────────────┼──────┤  │
│  │ Week 1  │ {focus text}                 │  XX  │  │
│  │ Week 2  │ {focus text}                 │  XX  │  │
│  │ Week 3  │ {focus text}                 │  XX  │  │
│  │ Week 4  │ {focus text}                 │  XX  │  │
│  │ Week 5* │ {focus text}                 │  XX  │  │  ← rendered only if month > 28 days
│  ├─────────┼──────────────────────────────┼──────┤  │
│  │         │ TOTAL HOURS                  │  XX  │  │
│  └─────────┴──────────────────────────────┴──────┘  │
├─────────────────────────────────────────────────────┤
│  FOOTER: Nxion Consulting LLC · hello@nxion.org     │
└─────────────────────────────────────────────────────┘
```

### 6.4 Weekly Input in Form (Section 3 replacement)

- `<input type="month">` for selecting billing month (replaces start/end date pickers)
- Week rows rendered **dynamically**: 4 rows for months with 28 days (Feb non-leap), 5 rows for all others
- Rows re-render reactively when the month input changes — existing entered data is preserved
- Each row has:
  - Week label: `Week 1` … `Week 4` or `Week 5`
  - Hours input (number, 0–999, step 0.5)
  - Focus/Deliverables input (text, placeholder: `e.g. Architecture design, sprint planning`)
- Total hours derived: `weeklyData.reduce((sum, w) => sum + (Number(w.hours) || 0), 0)`

### 6.5 Validation Changes

| Field | Rule |
|---|---|
| `billingMonthYear` | Required, non-empty |
| `weeklyData` | At least one week must have hours > 0 |
| `weeklyData[n].hours` | If provided, must be ≥ 0 |
| Remove | `startDate`, `endDate`, `clientSticker` validation |

### 6.6 InvoiceDocument — Inline Styles Constraint

All styles in `InvoiceDocument.jsx` must remain **100% inline** (no Tailwind classes). The existing inline `s` object pattern should be extended, not replaced.

---

## 7. Acceptance Criteria

- [ ] Billing month input (`type="month"`) renders in Section 3 and drives invoice number and billing period label
- [ ] 4 weekly rows appear for months with 28 days (February non-leap year)
- [ ] 5 weekly rows appear for all other months (29–31 days)
- [ ] Switching from a 5-week month to a 4-week month removes Week 5 row; switching back restores a blank Week 5
- [ ] Hours entered in Weeks 1–4 are preserved when switching between months of different week counts
- [ ] Total hours in live preview bar sums correctly from weekly hours
- [ ] Invoice number format is `NXION-{MONTH}-{YEAR}` (e.g., `NXION-JANUARY-2025`)
- [ ] `clientSticker` field is removed from the form
- [ ] Invoice document header: business details left, client + invoice meta right
- [ ] Section 1 (Payment Summary) is the first content section — shows rate, hours, and bold total amount
- [ ] Section 2 (Payment Instructions) shows bank details in the middle of the document
- [ ] Section 3 (Service Summary) table appears at the bottom with 4 week rows + total hours footer
- [ ] Weeks with 0 hours still render in the document (show `—` or `0`)
- [ ] `npm run build` passes with zero errors
- [ ] Invoice prints/saves to PDF correctly (white background, no action bar)
- [ ] Form renders correctly on mobile (320px), tablet (768px), desktop (1024px)

---

## 8. Prompt for Claude Code

```
Context:
- Project: nxion-web — static React SPA (Vite + React 19 + Tailwind v4 + Framer Motion 11)
- Styling: Tailwind v4 with @theme tokens in src/index.css. Key colours: navy #0A192F, electric #64FFDA, slate #8892B0
- InvoiceDocument.jsx must use 100% inline styles (no Tailwind) — extend the existing `s` object pattern
- All pages are lazy-loaded in src/App.jsx
- Invoice data flows via React Router navigate state from InvoicePage → InvoicePreview → InvoiceDocument

Goal:
Replace the weekly billing model (date range + daily hours) with a monthly billing model
(month selector + 4 weekly rows with hours + focus/deliverables). Redesign the invoice document
layout so Payment Summary appears first, Payment Instructions in the middle, and the weekly
Service Summary table at the bottom.

Read these files first (in order):
1. src/lib/invoiceUtils.js
2. src/pages/InvoicePage.jsx
3. src/components/invoice/InvoiceDocument.jsx
4. src/pages/InvoicePreview.jsx

Changes to src/lib/invoiceUtils.js:
- Add: generateMonthlyInvoiceNumber(billingMonthYear) → "NXION-JANUARY-2025"
  Format: `NXION-${monthFullUppercase}-${year}` derived from "YYYY-MM" input
- Remove: generateInvoiceNumber, getDaysInRange, formatDayLabel, formatDayShort, formatDateCompact
- Keep all other functions unchanged (amountToWords, formatDisplayDate, formatCurrency, formatMonthYear)

Changes to src/pages/InvoicePage.jsx:
- Replace form state fields startDate, endDate, dailyHours, clientSticker with:
    billingMonthYear: ''  (YYYY-MM string, driven by <input type="month">)
    weeklyData: [
      { hours: '', focus: '' },  // Week 1
      { hours: '', focus: '' },  // Week 2
      { hours: '', focus: '' },  // Week 3
      { hours: '', focus: '' },  // Week 4
      // Week 5 appended dynamically when selected month has > 28 days
    ]
- Add getWeekCountForMonth(billingMonthYear) to invoiceUtils.js:
    daysInMonth = new Date(year, month, 0).getDate()  // month is 1-based
    return daysInMonth > 28 ? 5 : 4
- Section 3 of the form: replace date pickers + dynamic day grid with:
    - A single <input type="month"> labelled "Billing Month"
    - Weekly rows rendered dynamically (4 or 5) based on getWeekCountForMonth()
    - useEffect: when billingMonthYear changes, resize weeklyData array preserving existing entries
    - Each row: week label (Week 1…5), hours input, focus/deliverables text input
- Update totalHours calculation: sum weeklyData[n].hours
- Update invoiceNumber: use generateMonthlyInvoiceNumber(form.billingMonthYear)
- Remove clientSticker field from Section 2 (Client Information)
- Update validation: require billingMonthYear; require at least one week with hours > 0; remove startDate/endDate/clientSticker validation
- Pass weeklyData and billingMonthYear in navigate state

Changes to src/components/invoice/InvoiceDocument.jsx:
- Update data destructuring: receive weeklyData, billingMonthYear instead of startDate/endDate/dailyHours
- New layout (top to bottom):
  1. HEADER: logo + contact info LEFT; Bill To (clientName, clientAddress) + invoice meta (number, date, billing period) RIGHT
  2. Centered title: "INVOICE" + billing month/year subtitle
  3. SECTION 1 — PAYMENT SUMMARY box (navy border or shaded background):
       - Row: Description = "Consulting Services"
       - Row: Consultant name + Role
       - Row: Hourly Rate
       - Row: Total Hours
       - Divider line
       - TOTAL AMOUNT DUE (bold, large, prominent — this is the visual centrepiece)
       - Amount in words below total
  4. SECTION 2 — PAYMENT INSTRUCTIONS:
       - Company Name, Bank Name, Account #, Routing #
       - Styled as a clean labelled list (2-column grid)
  5. SECTION 3 — SERVICE SUMMARY table:
       - Columns: Week | Primary Focus / Deliverables | Hours
       - 4 or 5 data rows driven by weeklyData.length; show "—" if hours = 0
       - Footer row: blank | TOTAL HOURS | {sum}
  6. FOOTER: brand name, email, website

Do not:
- Change InvoicePreview.jsx (guard still uses state.invoiceNumber — works unchanged)
- Change App.jsx routes
- Add Tailwind classes to InvoiceDocument.jsx
- Change the print/PDF mechanism

After all changes, run npm run build and confirm zero errors before finishing.
```
