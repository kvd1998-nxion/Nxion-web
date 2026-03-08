import { forwardRef } from 'react'
import {
  amountToWords,
  formatDisplayDate,
  formatMonthYear,
  formatCurrency,
  formatDayLabel,
  formatDayShort,
} from '../../lib/invoiceUtils'

/* ─────────────────────────────────────────────────────────────────────────────
   InvoiceDocument
   A white-background, print-optimised invoice that mirrors the PDF template.
   Wrapped in forwardRef so the parent can pass a ref for window.print().
───────────────────────────────────────────────────────────────────────────── */
export const InvoiceDocument = forwardRef(function InvoiceDocument({ data }, ref) {
  const {
    consultantName = '',
    position       = '',
    clientName     = '',
    clientAddress  = '',
    invoiceNumber  = '',
    invoiceDate    = '',
    billingMonth   = '',
    startDate      = '',
    endDate        = '',
    dailyHours     = {},
    billingRate    = 0,
    totalHours     = 0,
    totalAmount    = 0,
    paymentCompany = 'Nxion Consulting LLC',
    bankName       = 'Chase',
    accountNumber  = '',
    routingNumber  = '',
  } = data

  const amountWords = amountToWords(totalAmount)
  const days = Object.keys(dailyHours).sort()
  const displayMonth = billingMonth || formatMonthYear(startDate)

  /* ── Inline style tokens ── */
  const NAVY   = '#0A192F'
  const TEAL   = '#64FFDA'
  const GRAY   = '#4a5568'
  const LGRAY  = '#e2e8f0'
  const BLACK  = '#1a202c'

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
    /* header */
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
    logoAccent: { color: TEAL },
    logoSub: { fontSize: '10px', color: GRAY, letterSpacing: '2px', textTransform: 'uppercase' },
    companyMeta: { textAlign: 'right', color: GRAY, fontSize: '10px', lineHeight: '1.8' },
    /* to + meta row */
    toMetaRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '28px',
      gap: '32px',
    },
    toBlock: { flex: 1 },
    toLabel: { fontSize: '11px', color: GRAY, marginBottom: '4px' },
    toName: { fontWeight: '700', fontSize: '13px', color: BLACK },
    toAddress: { color: GRAY, fontSize: '10px', marginTop: '2px', whiteSpace: 'pre-line' },
    metaBlock: { textAlign: 'right', whiteSpace: 'nowrap' },
    metaRow: { display: 'flex', gap: '8px', justifyContent: 'flex-end', marginBottom: '3px' },
    metaLabel: { color: GRAY, fontWeight: '600', fontSize: '10px' },
    metaValue: { color: BLACK, fontWeight: '700', fontSize: '10px' },
    /* invoice title */
    titleBlock: {
      textAlign: 'center',
      marginBottom: '20px',
      paddingBottom: '16px',
      borderBottom: `1px solid ${LGRAY}`,
    },
    titleMain: { fontSize: '18px', fontWeight: '800', color: NAVY, letterSpacing: '2px', textTransform: 'uppercase', margin: 0 },
    titleSub: { fontSize: '11px', color: GRAY, marginTop: '4px', margin: '4px 0 0' },
    /* table */
    table: { width: '100%', borderCollapse: 'collapse', marginBottom: '16px' },
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
    },
    td: { padding: '10px 12px', borderBottom: `1px solid ${LGRAY}`, verticalAlign: 'top', color: BLACK },
    tdRight: { padding: '10px 12px', borderBottom: `1px solid ${LGRAY}`, verticalAlign: 'top', textAlign: 'right', color: BLACK },
    tdTotal: { padding: '10px 12px', fontWeight: '700', textAlign: 'right', backgroundColor: '#f7fafc', color: NAVY },
    tdTotalLabel: { padding: '10px 12px', fontWeight: '700', textAlign: 'right', backgroundColor: '#f7fafc', color: GRAY, fontSize: '10px', letterSpacing: '0.5px', textTransform: 'uppercase' },
    /* summary */
    summaryBlock: {
      backgroundColor: '#f7fafc', border: `1px solid ${LGRAY}`,
      borderRadius: '4px', padding: '14px 16px', marginBottom: '24px',
    },
    summaryLine: { marginBottom: '4px', fontSize: '11px', color: BLACK },
    summaryKey: { fontWeight: '600', color: GRAY },
    summaryTotal: { fontSize: '13px', fontWeight: '700', color: NAVY, marginTop: '8px', paddingTop: '8px', borderTop: `1px solid ${LGRAY}` },
    /* timesheet */
    tsTitle: { fontSize: '10px', fontWeight: '700', color: GRAY, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' },
    tsGrid: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' },
    tsDay: {
      border: `1px solid ${LGRAY}`, borderRadius: '4px',
      padding: '5px 10px', fontSize: '10px', color: BLACK,
      backgroundColor: '#fff',
    },
    tsDayName: { fontWeight: '600', color: GRAY, marginRight: '4px' },
    tsDayHours: { fontWeight: '700', color: NAVY },
    /* payment */
    payBlock: {
      borderTop: `2px solid ${NAVY}`, paddingTop: '16px', marginBottom: '24px',
    },
    payTitle: { fontWeight: '700', fontSize: '11px', color: BLACK, marginBottom: '8px' },
    payGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 24px', fontSize: '10px' },
    payRow: { display: 'flex', gap: '6px' },
    payLabel: { color: GRAY, fontWeight: '600', minWidth: '90px' },
    payValue: { color: BLACK, fontWeight: '500' },
    /* footer */
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
        <div style={s.logoWrap}>
          <div style={s.logoText}>
            <span>nx</span><span style={s.logoAccent}>ion</span>
          </div>
          <div style={s.logoSub}>Consulting</div>
        </div>
        <div style={s.companyMeta}>
          <div>Nxion Consulting LLC</div>
          <div>hello@nxion.org</div>
          <div>nxion.org</div>
        </div>
      </div>

      {/* ── To + Invoice Meta ── */}
      <div style={s.toMetaRow}>
        <div style={s.toBlock}>
          <div style={s.toLabel}>Bill To</div>
          <div style={s.toName}>{clientName || '—'},</div>
          <div style={s.toAddress}>{clientAddress || '—'}</div>
        </div>
        <div style={s.metaBlock}>
          <div style={s.metaRow}>
            <span style={s.metaLabel}>Date:</span>
            <span style={s.metaValue}>{formatDisplayDate(invoiceDate)}</span>
          </div>
          <div style={s.metaRow}>
            <span style={s.metaLabel}>Invoice #:</span>
            <span style={s.metaValue}>{invoiceNumber}</span>
          </div>
          <div style={s.metaRow}>
            <span style={s.metaLabel}>Period:</span>
            <span style={s.metaValue}>{formatDisplayDate(startDate)} – {formatDisplayDate(endDate)}</span>
          </div>
        </div>
      </div>

      {/* ── Title ── */}
      <div style={s.titleBlock}>
        <p style={s.titleMain}>Invoice</p>
        <p style={s.titleSub}>{displayMonth} &nbsp;({invoiceNumber})</p>
      </div>

      {/* ── Main Table ── */}
      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Consultant Name</th>
            <th style={s.th}>Position</th>
            <th style={{ ...s.thRight, width: '120px' }}>No. of Working Hours</th>
            <th style={{ ...s.thRight, width: '120px' }}>Billing Rate / Hr</th>
            <th style={{ ...s.thRight, width: '150px' }}>Total Billing Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={s.td}>{consultantName || '—'}</td>
            <td style={s.td}>{position || '—'}</td>
            <td style={s.tdRight}>{totalHours}</td>
            <td style={s.tdRight}>{formatCurrency(Number(billingRate))}</td>
            <td style={s.tdRight}>
              {formatCurrency(Number(billingRate))} × {totalHours}
              <br />
              <strong>{formatCurrency(totalAmount)}</strong>
            </td>
          </tr>
          <tr>
            <td style={{ ...s.td, borderBottom: 'none' }} colSpan={3}></td>
            <td style={s.tdTotalLabel}>Total</td>
            <td style={s.tdTotal}>{formatCurrency(totalAmount)}</td>
          </tr>
        </tbody>
      </table>

      {/* ── Summary ── */}
      <div style={s.summaryBlock}>
        <div style={s.summaryLine}>
          <span style={s.summaryKey}>Total working hours of {consultantName}:</span>{' '}
          {totalHours} hours
        </div>
        <div style={s.summaryLine}>
          <span style={s.summaryKey}>Hourly billing rate:</span>{' '}
          {formatCurrency(Number(billingRate))}/hr
        </div>
        <div style={s.summaryTotal}>
          Total billing amount: {formatCurrency(totalAmount)}<br />
          <span style={{ fontWeight: '400', fontSize: '10px', color: GRAY }}>
            ({amountWords})
          </span>
        </div>
      </div>

      {/* ── Daily Timesheet (if per-day data exists) ── */}
      {days.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div style={s.tsTitle}>Detailed Timesheet</div>
          <div style={s.tsGrid}>
            {days.map(day => {
              const hrs = Number(dailyHours[day]) || 0
              return (
                <div key={day} style={{ ...s.tsDay, opacity: hrs === 0 ? 0.45 : 1 }}>
                  <span style={s.tsDayName}>{formatDayShort(day)} {day.slice(5)}</span>
                  <span style={s.tsDayHours}>{hrs}h</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Payment Info ── */}
      <div style={s.payBlock}>
        <div style={s.payTitle}>
          THANK YOU FOR YOUR BUSINESS! &nbsp;For direct payments, please transfer to below Account:
        </div>
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
            <span style={s.payLabel}>Bank A/C #:</span>
            <span style={s.payValue}>{accountNumber || '—'}</span>
          </div>
          <div style={s.payRow}>
            <span style={s.payLabel}>Bank Routing #:</span>
            <span style={s.payValue}>{routingNumber || '—'}</span>
          </div>
        </div>
      </div>

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
