import { Link } from 'react-router-dom'
import { Github, Linkedin, Mail } from 'lucide-react'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/knowledge', label: 'Knowledge Hub' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

const SERVICES = [
  'AI-Augmented Data Governance',
  'Scalable ML Engineering',
  'Ethical AI Frameworks',
  'Cloud-Native Architecture',
]

export function Footer() {
  return (
    <footer
      className="border-t mt-24"
      style={{ borderColor: 'rgba(136,146,176,0.15)', backgroundColor: '#020C1B' }}
    >
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="text-xl font-bold tracking-tight flex items-center gap-1 mb-4">
              <span style={{ color: '#64FFDA' }}>nx</span>
              <span className="text-white">ion</span>
              <span style={{ color: '#8892B0' }}>.</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#8892B0' }}>
              Enterprise technology consulting at the intersection of AI, data engineering,
              and cloud architecture.
            </p>
            <div className="flex gap-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors"
                style={{ color: '#8892B0' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#64FFDA')}
                onMouseLeave={e => (e.currentTarget.style.color = '#8892B0')}
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors"
                style={{ color: '#8892B0' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#64FFDA')}
                onMouseLeave={e => (e.currentTarget.style.color = '#8892B0')}
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="mailto:hello@nxion.org"
                className="transition-colors"
                style={{ color: '#8892B0' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#64FFDA')}
                onMouseLeave={e => (e.currentTarget.style.color = '#8892B0')}
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-widest">
              Navigation
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm transition-colors"
                    style={{ color: '#8892B0' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#E6F1FF')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#8892B0')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-widest">
              Services
            </h4>
            <ul className="space-y-3">
              {SERVICES.map(service => (
                <li key={service}>
                  <Link
                    to="/contact"
                    className="text-sm transition-colors"
                    style={{ color: '#8892B0' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#E6F1FF')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#8892B0')}
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs border-t"
          style={{ borderColor: 'rgba(136,146,176,0.1)', color: '#8892B0' }}
        >
          <span>© {new Date().getFullYear()} Nxion Consulting. All rights reserved.</span>
          <span>nxion.org</span>
        </div>
      </div>
    </footer>
  )
}
