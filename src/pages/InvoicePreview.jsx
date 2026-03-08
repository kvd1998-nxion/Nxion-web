import { useRef } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Printer, ArrowLeft, Edit3, Download } from 'lucide-react'
import { SEOHead } from '../components/seo/SEOHead'
import { InvoiceDocument } from '../components/invoice/InvoiceDocument'

export default function InvoicePreview() {
  const { state } = useLocation()
  const navigate  = useNavigate()
  const printRef  = useRef(null)

  // Guard: if arrived without form data, send back to form
  if (!state || !state.invoiceNumber) return <Navigate to="/invoice" replace />

  function handlePrint() {
    window.print()
  }

  return (
    <>
      <SEOHead title="Invoice Preview" slug="invoice/preview" />

      {/* ── Action bar (hidden in print) ── */}
      <div
        className="no-print fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14 border-b"
        style={{ backgroundColor: 'rgba(10,25,47,0.97)', borderColor: 'rgba(136,146,176,0.15)', backdropFilter: 'blur(12px)' }}
      >
        {/* Left: back + edit */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/invoice')}
            className="flex items-center gap-2 text-sm transition-colors px-3 py-1.5 rounded"
            style={{ color: '#8892B0' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#E6F1FF')}
            onMouseLeave={e => (e.currentTarget.style.color = '#8892B0')}
          >
            <ArrowLeft size={15} /> Back
          </button>
          <button
            onClick={() => navigate('/invoice', { state })}
            className="flex items-center gap-2 text-sm transition-colors px-3 py-1.5 rounded border"
            style={{ color: '#8892B0', borderColor: 'rgba(136,146,176,0.2)' }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#E6F1FF'
              e.currentTarget.style.borderColor = 'rgba(230,241,255,0.3)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#8892B0'
              e.currentTarget.style.borderColor = 'rgba(136,146,176,0.2)'
            }}
          >
            <Edit3 size={14} /> Edit
          </button>
        </div>

        {/* Centre: invoice number */}
        <span className="hidden sm:block text-xs font-mono" style={{ color: '#64FFDA' }}>
          {state.invoiceNumber}
        </span>

        {/* Right: print / download */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-1.5 rounded border text-sm transition-colors"
            style={{ color: '#8892B0', borderColor: 'rgba(136,146,176,0.2)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#E6F1FF')}
            onMouseLeave={e => (e.currentTarget.style.color = '#8892B0')}
          >
            <Printer size={14} /> Print
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-1.5 rounded text-sm font-semibold transition-colors"
            style={{ backgroundColor: '#64FFDA', color: '#0A192F' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#4de8c4')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#64FFDA')}
          >
            <Download size={14} /> Download PDF
          </button>
        </div>
      </div>

      {/* ── Preview wrapper ── */}
      <div
        className="invoice-preview-wrapper min-h-screen pt-14"
        style={{ backgroundColor: '#1a1a2e' }}
      >
        {/* Hint text */}
        <div className="no-print text-center pt-6 pb-4">
          <p className="text-xs" style={{ color: '#8892B0' }}>
            Click <strong style={{ color: '#64FFDA' }}>Download PDF</strong> → in the print dialog, choose <strong style={{ color: '#E6F1FF' }}>Save as PDF</strong>
          </p>
        </div>

        {/* Invoice sheet — centred, white, shadow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="invoice-sheet mx-auto mb-16"
          style={{
            maxWidth: '820px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <InvoiceDocument ref={printRef} data={state} />
        </motion.div>
      </div>
    </>
  )
}
