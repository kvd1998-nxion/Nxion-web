import { motion } from 'framer-motion'
import { Mail, MapPin, Clock } from 'lucide-react'
import { SEOHead } from '../components/seo/SEOHead'
import { ContactForm } from '../components/ui/ContactForm'

const CONTACT_INFO = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@nxion.org',
    href: 'mailto:hello@nxion.org',
  },
  {
    icon: MapPin,
    label: 'Headquarters',
    value: 'Available globally',
    href: null,
  },
  {
    icon: Clock,
    label: 'Response Time',
    value: 'Within 1 business day',
    href: null,
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

export default function Contact() {
  return (
    <>
      <SEOHead
        title="Contact"
        description="Start a conversation with Nxion Consulting. Inquire about consulting engagements, partnerships, or training workshops."
        slug="contact"
      />

      <main className="pt-16">
        {/* Header */}
        <section
          className="py-20 border-b"
          style={{ backgroundColor: '#020C1B', borderColor: 'rgba(136,146,176,0.1)' }}
        >
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.p variants={itemVariants} className="text-xs font-semibold tracking-[0.25em] uppercase mb-4" style={{ color: '#64FFDA' }}>
                Let's Talk
              </motion.p>
              <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-white mb-4">
                Start a Conversation
              </motion.h1>
              <motion.p variants={itemVariants} className="text-lg max-w-2xl" style={{ color: '#8892B0' }}>
                Whether you're exploring a consulting engagement, partnership opportunity,
                or training program — we'd love to hear from you.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-20" style={{ backgroundColor: '#0A192F' }}>
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Left: Contact info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <h2 className="text-2xl font-semibold text-white mb-6">
                  Contact Information
                </h2>
                <p className="text-sm leading-relaxed mb-8" style={{ color: '#8892B0' }}>
                  We work with organizations across industries and geographies. Tell us
                  about your challenge and we'll respond with how we can help.
                </p>

                <div className="space-y-6">
                  {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                    <div key={label} className="flex items-start gap-4">
                      <div
                        className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(100,255,218,0.08)' }}
                      >
                        <Icon size={18} style={{ color: '#64FFDA' }} strokeWidth={1.5} />
                      </div>
                      <div>
                        <div className="text-xs font-medium uppercase tracking-wider mb-0.5" style={{ color: '#8892B0' }}>
                          {label}
                        </div>
                        {href ? (
                          <a
                            href={href}
                            className="text-white text-sm font-medium transition-colors hover:text-[#64FFDA]"
                          >
                            {value}
                          </a>
                        ) : (
                          <span className="text-white text-sm font-medium">{value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Inquiry types preview */}
                <div
                  className="mt-10 p-5 rounded-lg"
                  style={{ backgroundColor: '#112240', border: '1px solid rgba(136,146,176,0.12)' }}
                >
                  <h3 className="text-white text-sm font-semibold mb-3">
                    We can help with:
                  </h3>
                  <ul className="space-y-2">
                    {['Consulting Engagement', 'Partnership', 'Training & Workshops'].map(type => (
                      <li
                        key={type}
                        className="flex items-center gap-2 text-sm"
                        style={{ color: '#8892B0' }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: '#64FFDA' }} />
                        {type}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="p-8 rounded-xl"
                style={{ backgroundColor: '#112240', border: '1px solid rgba(136,146,176,0.15)' }}
              >
                <h2 className="text-2xl font-semibold text-white mb-6">
                  Send a Message
                </h2>
                <ContactForm />
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
