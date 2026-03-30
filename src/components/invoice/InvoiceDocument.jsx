import { forwardRef } from 'react'
import {
  amountToWords,
  formatDisplayDate,
  formatCurrency,
  formatBillingMonthLabel,
} from '../../lib/invoiceUtils'

/* ─────────────────────────────────────────────────────────────────────────────
   InvoiceDocument — Monthly billing layout
   Sections (top → bottom):
     1. Header: Nxion contact LEFT | Bill To + invoice meta RIGHT
     2. Invoice title (centered)
     3. Payment Summary box — rate, hours, bold Total Amount Due
     4. Payment Instructions — bank details
     5. Service Summary table — weekly breakdown (4 or 5 rows)
     6. Footer
   All styles are inline (no Tailwind) for print/PDF portability.
───────────────────────────────────────────────────────────────────────────── */
export const InvoiceDocument = forwardRef(function InvoiceDocument({ data }, ref) {
  const {
    consultantName  = '',
    position        = '',
    clientName      = '',
    clientAddress   = '',
    invoiceNumber   = '',
    invoiceDate     = '',
    billingMonthYear = '',
    weeklyData      = [],
    billingRate     = 0,
    totalHours      = 0,
    totalAmount     = 0,
    paymentCompany  = 'Nxion Consulting LLC',
    bankName        = 'Chase',
    accountNumber   = '',
    routingNumber   = '',
  } = data

  const amountWords = amountToWords(totalAmount)

  const billingMonthLabel = formatBillingMonthLabel(billingMonthYear)

  /* ── Colour tokens ── */
  const NAVY  = '#0A192F'
  const GRAY  = '#4a5568'
  const LGRAY = '#e2e8f0'
  const BLACK = '#1a202c'
  const BGLIGHT = '#f7fafc'

  /* ── Inline style objects ── */
  const s = {
    page: {
      fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
      fontSize: '11px',
      color: BLACK,
      backgroundColor: '#ffffff',
      padding: '40px 48px',
      maxWidth: '780px',
      margin: '0 auto',
      lineHeight: 1.5,
    },

    /* ── Header ── */
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      borderBottom: `2px solid ${NAVY}`,
      paddingBottom: '16px',
      marginBottom: '24px',
    },
    logoWrap: { display: 'flex', flexDirection: 'column', gap: '2px' },
    logoText: { fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px', color: NAVY, lineHeight: 1 },
    logoAccent: { color: '#64FFDA' },
    logoSub: { fontSize: '10px', color: GRAY, letterSpacing: '2px', textTransform: 'uppercase' },
    logoContact: { fontSize: '10px', color: GRAY, lineHeight: 1.8, marginTop: '6px' },

    /* Bill To + meta (header right) */
    headerRight: { textAlign: 'right', maxWidth: '260px' },
    billToLabel: { fontSize: '10px', color: GRAY, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' },
    billToName: { fontWeight: '700', fontSize: '13px', color: BLACK },
    billToAddress: { color: GRAY, fontSize: '10px', marginTop: '2px', whiteSpace: 'pre-line' },
    metaRow: { display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '3px' },
    metaLabel: { color: GRAY, fontWeight: '600', fontSize: '10px' },
    metaValue: { color: BLACK, fontWeight: '700', fontSize: '10px' },

    /* ── Invoice title ── */
    titleBlock: {
      textAlign: 'center',
      marginBottom: '20px',
      paddingBottom: '16px',
      borderBottom: `1px solid ${LGRAY}`,
    },
    titleMain: { fontSize: '18px', fontWeight: '800', color: NAVY, letterSpacing: '2px', textTransform: 'uppercase', margin: 0 },
    titleSub: { fontSize: '11px', color: GRAY, marginTop: '4px' },

    /* ── Section headers ── */
    sectionLabel: {
      fontSize: '10px', fontWeight: '700', color: GRAY,
      textTransform: 'uppercase', letterSpacing: '1px',
      marginBottom: '8px',
    },

    /* ── Section 1: Payment Summary ── */
    summaryBox: {
      border: `2px solid ${NAVY}`,
      borderRadius: '4px',
      padding: '16px 20px',
      marginBottom: '20px',
    },
    summaryGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '4px 32px',
      marginBottom: '12px',
    },
    summaryRow: { display: 'flex', gap: '6px', fontSize: '11px' },
    summaryKey: { color: GRAY, fontWeight: '600', minWidth: '110px' },
    summaryVal: { color: BLACK, fontWeight: '500' },
    summaryDivider: { borderTop: `1px solid ${LGRAY}`, marginTop: '12px', paddingTop: '12px' },
    totalLabel: { fontSize: '11px', color: GRAY, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
    totalAmount: { fontSize: '22px', fontWeight: '800', color: NAVY, marginTop: '2px' },
    totalWords: { fontSize: '10px', color: GRAY, marginTop: '4px', fontStyle: 'italic' },

    /* ── Section 2: Payment Instructions ── */
    payBlock: {
      backgroundColor: BGLIGHT,
      border: `1px solid ${LGRAY}`,
      borderRadius: '4px',
      padding: '14px 20px',
      marginBottom: '20px',
    },
    payGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 24px', fontSize: '10px' },
    payRow: { display: 'flex', gap: '6px' },
    payLabel: { color: GRAY, fontWeight: '600', minWidth: '90px' },
    payValue: { color: BLACK, fontWeight: '500' },

    /* ── Section 3: Service Summary table ── */
    table: { width: '100%', borderCollapse: 'collapse', marginBottom: '20px' },
    th: {
      backgroundColor: NAVY, color: '#ffffff',
      padding: '10px 12px', textAlign: 'left',
      fontSize: '10px', fontWeight: '600',
      textTransform: 'uppercase', letterSpacing: '0.5px',
    },
    thRight: {
      backgroundColor: NAVY, color: '#ffffff',
      padding: '10px 12px', textAlign: 'right',
      fontSize: '10px', fontWeight: '600',
      textTransform: 'uppercase', letterSpacing: '0.5px',
      width: '80px',
    },
    td: { padding: '10px 12px', borderBottom: `1px solid ${LGRAY}`, verticalAlign: 'top', color: BLACK, fontSize: '11px' },
    tdRight: { padding: '10px 12px', borderBottom: `1px solid ${LGRAY}`, textAlign: 'right', color: BLACK, fontSize: '11px', width: '80px' },
    tdWeekLabel: { padding: '10px 12px', borderBottom: `1px solid ${LGRAY}`, fontWeight: '700', color: NAVY, fontSize: '11px', width: '72px' },
    tdTotalLabel: {
      padding: '10px 12px', fontWeight: '700', textAlign: 'right',
      backgroundColor: BGLIGHT, color: GRAY,
      fontSize: '10px', letterSpacing: '0.5px', textTransform: 'uppercase',
    },
    tdTotalVal: {
      padding: '10px 12px', fontWeight: '800', textAlign: 'right',
      backgroundColor: BGLIGHT, color: NAVY, fontSize: '13px', width: '80px',
    },

    /* ── Footer ── */
    footer: {
      borderTop: `1px solid ${LGRAY}`,
      paddingTop: '12px',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '9px',
      color: GRAY,
    },
    footerBrand: { fontWeight: '700', color: NAVY },
  }

  return (
    <div ref={ref} style={s.page} id="invoice-document">

      {/* ── Header ── */}
      <div style={s.header}>
        {/* Left: Nxion brand + contact */}
        <div style={s.logoWrap}>
          <div style={s.logoText}>
            <span>nx</span><span style={s.logoAccent}>ion</span>
          </div>
          <div style={s.logoSub}>Consulting</div>
          <div style={s.logoContact}>
            hello@nxion.org<br />nxion.org
          </div>
        </div>

        {/* Right: Bill To + invoice meta */}
        <div style={s.headerRight}>
          <div style={s.billToLabel}>Bill To</div>
          <div style={s.billToName}>{clientName || '—'}</div>
          <div style={s.billToAddress}>{clientAddress || '—'}</div>
          <div style={{ marginTop: '10px' }}>
            <div style={s.metaRow}>
              <span style={s.metaLabel}>Invoice #:</span>
              <span style={s.metaValue}>{invoiceNumber}</span>
            </div>
            <div style={s.metaRow}>
              <span style={s.metaLabel}>Date:</span>
              <span style={s.metaValue}>{formatDisplayDate(invoiceDate)}</span>
            </div>
            <div style={s.metaRow}>
              <span style={s.metaLabel}>Period:</span>
              <span style={s.metaValue}>{billingMonthLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Invoice Title ── */}
      <div style={s.titleBlock}>
        <p style={s.titleMain}>Invoice</p>
        <p style={s.titleSub}>{billingMonthLabel}</p>
      </div>

      {/* ── Section 1: Payment Summary ── */}
      <div style={s.sectionLabel}>Payment Summary</div>
      <div style={s.summaryBox}>
        <div style={s.summaryGrid}>
          <div style={s.summaryRow}>
            <span style={s.summaryKey}>Description:</span>
            <span style={s.summaryVal}>Consulting Services</span>
          </div>
          <div style={s.summaryRow}>
            <span style={s.summaryKey}>Hourly Rate:</span>
            <span style={s.summaryVal}>{formatCurrency(Number(billingRate))}/hr</span>
          </div>
          <div style={s.summaryRow}>
            <span style={s.summaryKey}>Consultant:</span>
            <span style={s.summaryVal}>{consultantName || '—'}</span>
          </div>
          <div style={s.summaryRow}>
            <span style={s.summaryKey}>Total Hours:</span>
            <span style={s.summaryVal}>{totalHours} hrs</span>
          </div>
          <div style={s.summaryRow}>
            <span style={s.summaryKey}>Role:</span>
            <span style={s.summaryVal}>{position || '—'}</span>
          </div>
        </div>

        <div style={s.summaryDivider}>
          <div style={s.totalLabel}>Total Amount Due</div>
          <div style={s.totalAmount}>{formatCurrency(totalAmount)}</div>
          <div style={s.totalWords}>{amountWords}</div>
        </div>
      </div>

      {/* ── Section 2: Payment Instructions ── */}
      <div style={s.sectionLabel}>Payment Instructions</div>
      <div style={s.payBlock}>
        <div style={s.payGrid}>
          <div style={s.payRow}>
            <span style={s.payLabel}>Company Name:</span>
            <span style={s.payValue}>{paymentCompany}</span>
          </div>
          <div style={s.payRow}>
            <span style={s.payLabel}>Bank:</span>
            <span style={s.payValue}>{bankName || '—'}</span>
          </div>
          <div style={s.payRow}>
            <span style={s.payLabel}>Account #:</span>
            <span style={s.payValue}>{accountNumber || '—'}</span>
          </div>
          <div style={s.payRow}>
            <span style={s.payLabel}>Routing #:</span>
            <span style={s.payValue}>{routingNumber || '—'}</span>
          </div>
        </div>
      </div>

      {/* ── Section 3: Service Summary (weekly table) ── */}
      <div style={s.sectionLabel}>Service Summary</div>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={{ ...s.th, width: '72px' }}>Week</th>
            <th style={s.th}>Primary Focus / Deliverables</th>
            <th style={s.thRight}>Hours</th>
          </tr>
        </thead>
        <tbody>
          {weeklyData.map((week, i) => (
            <tr key={i}>
              <td style={s.tdWeekLabel}>Week {i + 1}</td>
              <td style={s.td}>{week.focus || '—'}</td>
              <td style={s.tdRight}>{Number(week.hours) > 0 ? Number(week.hours) : '—'}</td>
            </tr>
          ))}
          <tr>
            <td style={{ ...s.tdTotalLabel, textAlign: 'left', color: GRAY }} colSpan={2}>
              Total Hours
            </td>
            <td style={s.tdTotalVal}>{totalHours}</td>
          </tr>
        </tbody>
      </table>

      {/* ── Footer ── */}
      <div style={s.footer}>
        <div>
          <span style={s.footerBrand}>Nxion Consulting LLC</span>
          &nbsp;· hello@nxion.org
        </div>
        <div>nxion.org</div>
      </div>

    </div>
  )
})
