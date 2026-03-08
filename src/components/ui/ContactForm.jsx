import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '../../lib/utils'

const INQUIRY_TYPES = [
  'Consulting Engagement',
  'Partnership',
  'Training & Workshops',
  'General Inquiry',
]

const EMPTY_FORM = { name: '', email: '', type: '', message: '' }

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Name is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Valid email required'
  if (!form.type) errors.type = 'Please select an inquiry type'
  if (form.message.trim().length < 20) errors.message = 'Message must be at least 20 characters'
  return errors
}

function InputField({ label, id, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-white">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs flex items-center gap-1"
            style={{ color: '#ff6b6b' }}
          >
            <AlertCircle size={12} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

const inputStyle = {
  backgroundColor: '#112240',
  borderColor: 'rgba(136,146,176,0.25)',
  color: '#E6F1FF',
}

const inputFocusStyle = {
  borderColor: '#64FFDA',
  outline: 'none',
}

export function ContactForm() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [focusedField, setFocusedField] = useState(null)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(e => ({ ...e, [name]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setStatus('submitting')
    try {
      // Placeholder — in production POST to Formspree or a serverless function
      await new Promise(r => setTimeout(r, 1500))
      setStatus('success')
      setForm(EMPTY_FORM)
    } catch {
      setStatus('error')
    }
  }

  function getFieldStyle(name) {
    return {
      ...inputStyle,
      ...(focusedField === name ? inputFocusStyle : {}),
      ...(errors[name] ? { borderColor: 'rgba(255,107,107,0.6)' } : {}),
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 py-16 text-center"
      >
        <CheckCircle size={48} style={{ color: '#64FFDA' }} />
        <h3 className="text-2xl font-semibold text-white">Message Received</h3>
        <p style={{ color: '#8892B0' }}>
          Thank you for reaching out. We'll respond within 1–2 business days.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 px-6 py-2 text-sm rounded border transition-colors"
          style={{ color: '#64FFDA', borderColor: 'rgba(100,255,218,0.4)' }}
        >
          Send Another
        </button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <InputField label="Full Name" id="name" error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
            placeholder="Jane Smith"
            className="px-4 py-3 rounded border text-sm transition-colors"
            style={getFieldStyle('name')}
            autoComplete="name"
          />
        </InputField>

        <InputField label="Email Address" id="email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            placeholder="jane@company.com"
            className="px-4 py-3 rounded border text-sm transition-colors"
            style={getFieldStyle('email')}
            autoComplete="email"
          />
        </InputField>
      </div>

      <InputField label="Inquiry Type" id="type" error={errors.type}>
        <select
          id="type"
          name="type"
          value={form.type}
          onChange={handleChange}
          onFocus={() => setFocusedField('type')}
          onBlur={() => setFocusedField(null)}
          className="px-4 py-3 rounded border text-sm transition-colors appearance-none cursor-pointer"
          style={getFieldStyle('type')}
        >
          <option value="" disabled style={{ backgroundColor: '#112240' }}>
            Select an inquiry type...
          </option>
          {INQUIRY_TYPES.map(t => (
            <option key={t} value={t} style={{ backgroundColor: '#112240' }}>
              {t}
            </option>
          ))}
        </select>
      </InputField>

      <InputField label="Message" id="message" error={errors.message}>
        <textarea
          id="message"
          name="message"
          value={form.message}
          onChange={handleChange}
          onFocus={() => setFocusedField('message')}
          onBlur={() => setFocusedField(null)}
          placeholder="Describe your challenge or project..."
          rows={5}
          className="px-4 py-3 rounded border text-sm transition-colors resize-none"
          style={getFieldStyle('message')}
        />
      </InputField>

      {status === 'error' && (
        <p className="text-sm flex items-center gap-2" style={{ color: '#ff6b6b' }}>
          <AlertCircle size={16} />
          Something went wrong. Please try again or email us directly.
        </p>
      )}

      <motion.button
        type="submit"
        disabled={status === 'submitting'}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'flex items-center justify-center gap-2 px-8 py-4 rounded font-semibold text-sm transition-colors',
          status === 'submitting' ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
        )}
        style={{ backgroundColor: '#64FFDA', color: '#0A192F' }}
      >
        {status === 'submitting' ? (
          <>
            <span className="w-4 h-4 border-2 border-navy/40 border-t-navy rounded-full animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send size={16} />
            Send Message
          </>
        )}
      </motion.button>
    </form>
  )
}
