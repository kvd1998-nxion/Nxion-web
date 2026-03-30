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

/** "2024-11-02" → "November 2024" */
export function formatMonthYear(dateStr) {
  if (!dateStr) return ''
  return localDate(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

// ─── Month name lookup (locale-independent) ───────────────────────────────────

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/** "2025-01" → { year: 2025, month: 1 } — safe parse of YYYY-MM */
function parseMonthYear(billingMonthYear) {
  if (!billingMonthYear) return null
  const parts = billingMonthYear.split('-')
  const year  = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10)
  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) return null
  return { year, month }
}

// ─── Invoice Number ───────────────────────────────────────────────────────────

/**
 * "2025-01" → "NXION-JANUARY-2025"
 * billingMonthYear is a YYYY-MM string from <input type="month">
 */
export function generateMonthlyInvoiceNumber(billingMonthYear) {
  const parsed = parseMonthYear(billingMonthYear)
  if (!parsed) return 'NXION-PENDING'
  return `NXION-${MONTH_NAMES[parsed.month - 1].toUpperCase()}-${parsed.year}`
}

/** "2025-01" → "January 2025" */
export function formatBillingMonthLabel(billingMonthYear) {
  const parsed = parseMonthYear(billingMonthYear)
  if (!parsed) return ''
  return `${MONTH_NAMES[parsed.month - 1]} ${parsed.year}`
}

// ─── Week Count ───────────────────────────────────────────────────────────────

/**
 * Returns 4 or 5 depending on how many days the month has.
 * Billing week chunks: Week 1 = days 1–7, Week 2 = 8–14, Week 3 = 15–21,
 * Week 4 = 22–28, Week 5 = 29–end (only when month has > 28 days).
 *
 * "2025-01" → 5  (January has 31 days)
 * "2025-02" → 4  (February 2025 has 28 days)
 * "2024-02" → 5  (February 2024 is a leap year, 29 days)
 */
export function getWeekCountForMonth(billingMonthYear) {
  if (!billingMonthYear) return 4
  const [year, month] = billingMonthYear.split('-').map(Number)
  // new Date(year, month, 0) → last day of the month (month is 1-based here)
  const daysInMonth = new Date(year, month, 0).getDate()
  return daysInMonth > 28 ? 5 : 4
}

// ─── Currency ─────────────────────────────────────────────────────────────────

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 2,
  }).format(amount)
}
