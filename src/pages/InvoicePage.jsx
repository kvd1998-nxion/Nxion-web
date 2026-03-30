import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { SEOHead } from '../components/seo/SEOHead'
import {
  generateMonthlyInvoiceNumber,
  getWeekCountForMonth,
  formatCurrency,
  MONTH_NAMES,
} from '../lib/invoiceUtils'
import { cn } from '../lib/utils'

// ─── Shared style helpers ─────────────────────────────────────────────────────
const fieldBase = {
  backgroundColor: '#112240',
  borderColor: 'rgba(136,146,176,0.25)',
  color: '#E6F1FF',
}
const fieldFocus = { borderColor: '#64FFDA', outline: 'none' }
const fieldError = { borderColor: 'rgba(255,107,107,0.7)' }

function getFieldStyle(name, focused, errors) {
  return {
    ...fieldBase,
    ...(focused === name ? fieldFocus : {}),
    ...(errors[name] ? fieldError : {}),
  }
}

function Label({ children, required }) {
  return (
    <label className="block text-sm font-medium text-white mb-1.5">
      {children}{required && <span className="ml-0.5" style={{ color: '#64FFDA' }}>*</span>}
    </label>
  )
}

function FieldError({ msg }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-1 text-xs flex items-center gap-1"
          style={{ color: '#ff6b6b' }}
        >
          <AlertCircle size={11} /> {msg}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

function SectionTitle({ num, title, subtitle }) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div
        className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
        style={{ backgroundColor: 'rgba(100,255,218,0.12)', color: '#64FFDA' }}
      >
        {num}
      </div>
      <div>
        <h2 className="text-white font-semibold text-base">{title}</h2>
        {subtitle && <p className="text-xs mt-0.5" style={{ color: '#8892B0' }}>{subtitle}</p>}
      </div>
    </div>
  )
}

// ─── Validation ───────────────────────────────────────────────────────────────
function validate(form) {
  const e = {}
  if (!form.consultantName.trim()) e.consultantName = 'Required'
  if (!form.position.trim())       e.position       = 'Required'
  if (!form.clientName.trim())     e.clientName     = 'Required'
  if (!form.clientAddress.trim())  e.clientAddress  = 'Required'
  if (!form.invoiceDate)           e.invoiceDate    = 'Required'
  if (!form.billingMonthYear)      e.billingMonthYear = 'Required'
  if (!form.billingRate || Number(form.billingRate) <= 0)
    e.billingRate = 'Enter a valid billing rate'
  const totalHours = form.weeklyData.reduce((sum, w) => sum + (Number(w.hours) || 0), 0)
  if (totalHours === 0) e.weeklyData = 'Enter at least one hour across any week'
  return e
}

// ─── Component ────────────────────────────────────────────────────────────────
const TODAY = new Date().toISOString().split('T')[0]

function makeWeeks(count) {
  return Array.from({ length: count }, () => ({ hours: '', focus: '' }))
}

const EMPTY = {
  consultantName:   '',
  position:         '',
  clientName:       '',
  clientAddress:    '',
  billingMonthYear: '',
  invoiceDate:      TODAY,
  weeklyData:       makeWeeks(4),
  billingRate:      '',
  paymentCompany:   'Nxion Consulting LLC',
  bankName:         'Chase',
  accountNumber:    '',
  routingNumber:    '',
}

export default function InvoicePage() {
  const navigate = useNavigate()
  const [form, setForm]       = useState(EMPTY)
  const [errors, setErrors]   = useState({})
  const [focused, setFocused] = useState(null)
  const [payOpen, setPayOpen] = useState(false)

  // Resize weeklyData when billing month changes — preserve existing entries
  useEffect(() => {
    if (!form.billingMonthYear) return
    const count = getWeekCountForMonth(form.billingMonthYear)
    setForm(f => ({
      ...f,
      weeklyData: Array.from({ length: count }, (_, i) =>
        f.weeklyData[i] ?? { hours: '', focus: '' }
      ),
    }))
  }, [form.billingMonthYear]) // eslint-disable-line react-hooks/exhaustive-deps

  const totalHours  = form.weeklyData.reduce((s, w) => s + (Number(w.hours) || 0), 0)
  const billingRate = Number(form.billingRate) || 0
  const totalAmount = totalHours * billingRate
  const invoiceNumber = generateMonthlyInvoiceNumber(form.billingMonthYear)

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }))
  }

  function setWeek(index, key, value) {
    setForm(f => {
      const updated = f.weeklyData.map((w, i) => i === index ? { ...w, [key]: value } : w)
      return { ...f, weeklyData: updated }
    })
    if (errors.weeklyData) setErrors(e => ({ ...e, weeklyData: undefined }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    navigate('/invoice/preview', {
      state: {
        ...form,
        invoiceNumber,
        totalHours,
        totalAmount,
        billingRate,
      },
    })
  }

  const inputCls = 'w-full px-3 py-2.5 rounded border text-sm transition-colors'
  const sectionCls = 'p-6 rounded-xl mb-4'
  const sectionStyle = { backgroundColor: '#112240', border: '1px solid rgba(136,146,176,0.12)' }

  return (
    <>
      <SEOHead title="Create Invoice" description="Generate a professional consulting invoice." slug="invoice" />

      <main className="pt-16 pb-20" style={{ backgroundColor: '#0A192F' }}>
        {/* Page header */}
        <section className="py-14 border-b" style={{ backgroundColor: '#020C1B', borderColor: 'rgba(136,146,176,0.1)' }}>
          <div className="max-w-3xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              <div className="flex items-center gap-3 mb-3">
                <FileText size={20} style={{ color: '#64FFDA' }} />
                <p className="text-xs font-semibold tracking-[0.25em] uppercase" style={{ color: '#64FFDA' }}>
                  Services · Invoice
                </p>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">Create Invoice</h1>
              <p style={{ color: '#8892B0' }}>
                Fill in the details below to generate a printable, PDF-ready invoice.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-6 mt-10">
          {/* Live preview bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 rounded-lg mb-8 text-sm"
            style={{ backgroundColor: 'rgba(100,255,218,0.06)', border: '1px solid rgba(100,255,218,0.18)' }}
          >
            <div style={{ color: '#8892B0' }}>
              Invoice #: <strong style={{ color: '#64FFDA' }}>{invoiceNumber}</strong>
            </div>
            <div style={{ color: '#8892B0' }}>
              Hours: <strong style={{ color: '#E6F1FF' }}>{totalHours}</strong>
            </div>
            <div style={{ color: '#8892B0' }}>
              Total: <strong style={{ color: '#64FFDA' }}>
                {totalAmount > 0 ? formatCurrency(totalAmount) : '—'}
              </strong>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit} noValidate>

            {/* ── Section 1: Consultant ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className={sectionCls} style={sectionStyle}
            >
              <SectionTitle num="1" title="Consultant Information" subtitle="Details that appear in the invoice body" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Label required>Full Name</Label>
                  <input
                    value={form.consultantName}
                    onChange={e => set('consultantName', e.target.value)}
                    onFocus={() => setFocused('consultantName')}
                    onBlur={() => setFocused(null)}
                    placeholder="e.g. John Doe"
                    className={inputCls}
                    style={getFieldStyle('consultantName', focused, errors)}
                  />
                  <FieldError msg={errors.consultantName} />
                </div>
                <div>
                  <Label required>Position / Role</Label>
                  <input
                    value={form.position}
                    onChange={e => set('position', e.target.value)}
                    onFocus={() => setFocused('position')}
                    onBlur={() => setFocused(null)}
                    placeholder="e.g. Architect"
                    className={inputCls}
                    style={getFieldStyle('position', focused, errors)}
                  />
                  <FieldError msg={errors.position} />
                </div>
              </div>
            </motion.div>

            {/* ── Section 2: Client ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className={sectionCls} style={sectionStyle}
            >
              <SectionTitle num="2" title="Client Information" subtitle="Appears in the 'Bill To' section of the invoice" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div className="sm:col-span-2">
                  <Label required>Client / Company Name</Label>
                  <input
                    value={form.clientName}
                    onChange={e => set('clientName', e.target.value)}
                    onFocus={() => setFocused('clientName')}
                    onBlur={() => setFocused(null)}
                    placeholder="e.g. ASCII Group LLC"
                    className={inputCls}
                    style={getFieldStyle('clientName', focused, errors)}
                  />
                  <FieldError msg={errors.clientName} />
                </div>
              </div>
              <div>
                <Label required>Client Address</Label>
                <textarea
                  value={form.clientAddress}
                  onChange={e => set('clientAddress', e.target.value)}
                  onFocus={() => setFocused('clientAddress')}
                  onBlur={() => setFocused(null)}
                  placeholder={'38345 W 10 Mile Rd, Suite 365,\nFarmington, MI 48335'}
                  rows={3}
                  className={cn(inputCls, 'resize-none')}
                  style={getFieldStyle('clientAddress', focused, errors)}
                />
                <FieldError msg={errors.clientAddress} />
              </div>
            </motion.div>

            {/* ── Section 3: Billing Month + Weekly Hours ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className={sectionCls} style={sectionStyle}
            >
              <SectionTitle
                num="3"
                title="Billing Period"
                subtitle="Select a month — weekly rows appear automatically (4 weeks for Feb non-leap, 5 for all others)"
              />

              {/* Invoice date + billing month/year selects (cross-browser safe) */}
              {(() => {
                const currentYear  = new Date().getFullYear()
                const yearOptions  = Array.from({ length: 6 }, (_, i) => currentYear - 1 + i)
                const selMonth     = form.billingMonthYear.split('-')[1] || ''
                const selYear      = form.billingMonthYear.split('-')[0] || ''

                function handleMonthSelect(month) {
                  const year = selYear || String(currentYear)
                  set('billingMonthYear', `${year}-${month}`)
                }
                function handleYearSelect(year) {
                  const month = selMonth || '01'
                  set('billingMonthYear', `${year}-${month}`)
                }

                const selectStyle = (name) => ({
                  ...getFieldStyle(name, focused, errors),
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  cursor: 'pointer',
                })

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
                    <div>
                      <Label required>Invoice Date</Label>
                      <input
                        type="date"
                        value={form.invoiceDate}
                        onChange={e => set('invoiceDate', e.target.value)}
                        onFocus={() => setFocused('invoiceDate')}
                        onBlur={() => setFocused(null)}
                        className={inputCls}
                        style={{ ...getFieldStyle('invoiceDate', focused, errors), colorScheme: 'dark' }}
                      />
                      <FieldError msg={errors.invoiceDate} />
                    </div>

                    <div>
                      <Label required>Billing Month</Label>
                      <select
                        value={selMonth}
                        onChange={e => handleMonthSelect(e.target.value)}
                        onFocus={() => setFocused('billingMonthYear')}
                        onBlur={() => setFocused(null)}
                        className={inputCls}
                        style={selectStyle('billingMonthYear')}
                      >
                        <option value="">Month</option>
                        {MONTH_NAMES.map((name, i) => (
                          <option key={i} value={String(i + 1).padStart(2, '0')}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label required>Year</Label>
                      <select
                        value={selYear}
                        onChange={e => handleYearSelect(e.target.value)}
                        onFocus={() => setFocused('billingYear')}
                        onBlur={() => setFocused(null)}
                        className={inputCls}
                        style={selectStyle('billingYear')}
                      >
                        <option value="">Year</option>
                        {yearOptions.map(y => (
                          <option key={y} value={String(y)}>{y}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )
              })()}
              <FieldError msg={errors.billingMonthYear} />

              {/* Weekly rows */}
              <AnimatePresence>
                {form.billingMonthYear && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <Label required>Hours &amp; Focus by Week</Label>
                      <span className="text-xs font-semibold" style={{ color: '#64FFDA' }}>
                        Total: {totalHours} hrs
                      </span>
                    </div>

                    <div className="flex flex-col gap-3">
                      {form.weeklyData.map((week, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-1 sm:grid-cols-[90px_1fr_100px] gap-3 items-start p-3 rounded-lg"
                          style={{ backgroundColor: 'rgba(100,255,218,0.03)', border: '1px solid rgba(136,146,176,0.12)' }}
                        >
                          {/* Week label */}
                          <div
                            className="flex items-center justify-center h-10 rounded text-xs font-bold tracking-wide"
                            style={{ backgroundColor: 'rgba(100,255,218,0.08)', color: '#64FFDA' }}
                          >
                            Week {i + 1}
                          </div>

                          {/* Focus / deliverables */}
                          <div>
                            <input
                              value={week.focus}
                              onChange={e => setWeek(i, 'focus', e.target.value)}
                              onFocus={() => setFocused(`focus-${i}`)}
                              onBlur={() => setFocused(null)}
                              placeholder="Primary focus / deliverables (optional)"
                              className={inputCls}
                              style={getFieldStyle(`focus-${i}`, focused, {})}
                            />
                          </div>

                          {/* Hours */}
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min="0"
                              max="999"
                              step="0.5"
                              value={week.hours}
                              onChange={e => setWeek(i, 'hours', e.target.value)}
                              onFocus={() => setFocused(`hours-${i}`)}
                              onBlur={() => setFocused(null)}
                              placeholder="0"
                              className="w-full px-3 py-2.5 rounded border text-sm text-center"
                              style={getFieldStyle(`hours-${i}`, focused, {})}
                            />
                            <span className="text-xs shrink-0" style={{ color: '#8892B0' }}>hrs</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <FieldError msg={errors.weeklyData} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ── Section 4: Billing Rate ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className={sectionCls} style={sectionStyle}
            >
              <SectionTitle num="4" title="Billing Rate" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-start">
                <div>
                  <Label required>Rate ($/hr)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: '#8892B0' }}>$</span>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={form.billingRate}
                      onChange={e => set('billingRate', e.target.value)}
                      onFocus={() => setFocused('billingRate')}
                      onBlur={() => setFocused(null)}
                      placeholder="52.00"
                      className="w-full pl-7 pr-3 py-2.5 rounded border text-sm transition-colors"
                      style={getFieldStyle('billingRate', focused, errors)}
                    />
                  </div>
                  <FieldError msg={errors.billingRate} />
                </div>
                {totalHours > 0 && billingRate > 0 && (
                  <div className="sm:col-span-2 px-5 py-4 rounded-lg" style={{ backgroundColor: 'rgba(100,255,218,0.06)', border: '1px solid rgba(100,255,218,0.15)' }}>
                    <div className="text-xs mb-1" style={{ color: '#8892B0' }}>
                      {formatCurrency(billingRate)} × {totalHours} hrs
                    </div>
                    <div className="text-2xl font-bold" style={{ color: '#64FFDA' }}>
                      {formatCurrency(totalAmount)}
                    </div>
                    <div className="text-xs mt-1" style={{ color: '#8892B0' }}>Total Billing Amount</div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* ── Section 5: Payment Details (collapsible) ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className={sectionCls} style={sectionStyle}
            >
              <button
                type="button"
                onClick={() => setPayOpen(o => !o)}
                className="w-full flex items-center justify-between text-left"
              >
                <SectionTitle
                  num="5"
                  title="Payment Details"
                  subtitle="Bank info that appears on the invoice (your payout account)"
                />
                <div style={{ color: '#8892B0', flexShrink: 0 }}>
                  {payOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              <AnimatePresence>
                {payOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
                      {[
                        { field: 'paymentCompany', label: 'Company Name', placeholder: 'Nxion Consulting LLC' },
                        { field: 'bankName',        label: 'Bank Name',    placeholder: 'JPM Chase' },
                        { field: 'accountNumber',   label: 'Account #',   placeholder: '8198989898' },
                        { field: 'routingNumber',   label: 'Routing #',   placeholder: '044000037' },
                      ].map(({ field, label, placeholder }) => (
                        <div key={field}>
                          <Label>{label}</Label>
                          <input
                            value={form[field]}
                            onChange={e => set(field, e.target.value)}
                            onFocus={() => setFocused(field)}
                            onBlur={() => setFocused(null)}
                            placeholder={placeholder}
                            className={inputCls}
                            style={getFieldStyle(field, focused, errors)}
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ── Submit ── */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-4 rounded font-semibold text-sm"
                style={{ backgroundColor: '#64FFDA', color: '#0A192F' }}
              >
                <FileText size={16} />
                Preview &amp; Generate Invoice
              </motion.button>
            </motion.div>

          </form>
        </div>
      </main>
    </>
  )
}
