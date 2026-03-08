// ─── Number → Words ──────────────────────────────────────────────────────────

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen',
]
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

function convertHundreds(n) {
  let result = ''
  if (n >= 100) {
    result += ONES[Math.floor(n / 100)] + ' Hundred '
    n %= 100
  }
  if (n >= 20) {
    result += TENS[Math.floor(n / 10)] + ' '
    n %= 10
  }
  if (n > 0) result += ONES[n] + ' '
  return result.trim()
}

function numberToWords(n) {
  if (n === 0) return 'Zero'
  let result = ''
  if (n >= 1000000) {
    result += convertHundreds(Math.floor(n / 1000000)) + ' Million '
    n %= 1000000
  }
  if (n >= 1000) {
    result += convertHundreds(Math.floor(n / 1000)) + ' Thousand '
    n %= 1000
  }
  if (n > 0) result += convertHundreds(n)
  return result.trim()
}

export function amountToWords(amount) {
  const dollars = Math.floor(amount)
  const cents = Math.round((amount - dollars) * 100)
  let result = numberToWords(dollars) + ' Dollar' + (dollars !== 1 ? 's' : '')
  if (cents > 0) result += ' and ' + numberToWords(cents) + ' Cent' + (cents !== 1 ? 's' : '')
  return result + ' Only'
}

// ─── Date Helpers ─────────────────────────────────────────────────────────────

/** "2024-11-02" → Date object at local midnight */
function localDate(dateStr) {
  return new Date(dateStr + 'T00:00:00')
}

/** "2024-11-02" → "11/02/2024" */
export function formatDisplayDate(dateStr) {
  if (!dateStr) return ''
  const d = localDate(dateStr)
  return d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
}

/** "2024-11-02" → "11022024"  (used inside invoice number) */
export function formatDateCompact(dateStr) {
  if (!dateStr) return ''
  const d = localDate(dateStr)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${mm}${dd}${d.getFullYear()}`
}

/** "2024-11-02" → "November 2024" */
export function formatMonthYear(dateStr) {
  if (!dateStr) return ''
  return localDate(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

/** "2024-11-02" → "Monday, Nov 2, 2024" */
export function formatDayLabel(dateStr) {
  return localDate(dateStr).toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric', year: 'numeric',
  })
}

/** "2024-11-02" → "Mon" */
export function formatDayShort(dateStr) {
  return localDate(dateStr).toLocaleDateString('en-US', { weekday: 'short' })
}

// ─── Invoice Number ───────────────────────────────────────────────────────────

export function generateInvoiceNumber(startDate, endDate, clientSticker) {
  if (!startDate || !endDate || !clientSticker) return 'NX-PENDING'
  return `NX-${formatDateCompact(startDate)}-${formatDateCompact(endDate)}-${clientSticker.toUpperCase().replace(/\s+/g, '')}`
}

// ─── Date Range ───────────────────────────────────────────────────────────────

/** Returns array of "YYYY-MM-DD" strings between start and end (inclusive, max 14 days) */
export function getDaysInRange(startDate, endDate) {
  if (!startDate || !endDate) return []
  const start = localDate(startDate)
  const end = localDate(endDate)
  if (start > end) return []
  const days = []
  const cur = new Date(start)
  let safety = 0
  while (cur <= end && safety < 14) {
    days.push(cur.toISOString().split('T')[0])
    cur.setDate(cur.getDate() + 1)
    safety++
  }
  return days
}

// ─── Currency ─────────────────────────────────────────────────────────────────

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 2,
  }).format(amount)
}
