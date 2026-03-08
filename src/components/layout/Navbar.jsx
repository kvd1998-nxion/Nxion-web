import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Menu, X, FileText } from 'lucide-react'
import { cn } from '../../lib/utils'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/knowledge', label: 'Knowledge Hub' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { scrollY } = useScroll()
  const bgOpacity = useTransform(scrollY, [0, 80], [0.2, 0.9])
  const blur = useTransform(scrollY, [0, 80], [4, 16])

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 border-b border-[rgba(100,255,218,0.08)]"
        style={{
          backgroundColor: bgOpacity.get
            ? `rgba(10,25,47,${bgOpacity})`
            : 'rgba(10,25,47,0.2)',
        }}
      >
        <motion.div
          className="absolute inset-0 -z-10"
          style={{
            backdropFilter: blur ? `blur(${blur}px)` : 'blur(4px)',
            WebkitBackdropFilter: blur ? `blur(${blur}px)` : 'blur(4px)',
            backgroundColor: bgOpacity
              ? `rgba(10,25,47,${bgOpacity})`
              : 'rgba(10,25,47,0.2)',
          }}
        />

        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-bold tracking-tight flex items-center gap-1"
            onClick={() => setMobileOpen(false)}
          >
            <span style={{ color: '#64FFDA' }}>nx</span>
            <span className="text-white">ion</span>
            <span style={{ color: '#8892B0' }}>.</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cn(
                    'text-sm font-medium transition-colors duration-200',
                    isActive
                      ? 'text-[#64FFDA]'
                      : 'text-[#8892B0] hover:text-white'
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Invoice quick-access pill */}
          <Link
            to="/invoice"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors duration-200"
            style={{ color: '#64FFDA', borderColor: 'rgba(100,255,218,0.3)' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(100,255,218,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
            title="Create Invoice"
          >
            <FileText size={12} />
            Invoice
          </Link>

          {/* CTA */}
          <Link
            to="/contact"
            className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium rounded border transition-colors duration-200"
            style={{
              color: '#64FFDA',
              borderColor: 'rgba(100,255,218,0.4)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'rgba(100,255,218,0.08)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            Get in Touch
          </Link>

          {/* Hamburger */}
          <button
            className="md:hidden p-2 rounded text-[#8892B0] hover:text-white transition-colors"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 border-b border-[rgba(100,255,218,0.1)]"
            style={{ backgroundColor: 'rgba(10,25,47,0.97)', backdropFilter: 'blur(16px)' }}
          >
            <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-4">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'text-sm font-medium py-2 transition-colors',
                      isActive ? 'text-[#64FFDA]' : 'text-[#8892B0]'
                    )
                  }
                >
                  {label}
                </NavLink>
              ))}
              <Link
                to="/invoice"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-sm font-medium py-2 transition-colors"
                style={{ color: '#8892B0' }}
              >
                <FileText size={14} /> Invoice
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="mt-2 px-4 py-2 text-sm font-medium text-center rounded border text-[#64FFDA] border-[rgba(100,255,218,0.4)]"
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
