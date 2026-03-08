import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Target, Users, TrendingUp, Award } from 'lucide-react'
import { SEOHead } from '../components/seo/SEOHead'

const STATS = [
  { value: '50+', label: 'Enterprise Clients' },
  { value: '200+', label: 'Projects Delivered' },
  { value: '12+', label: 'Years Combined Experience' },
  { value: '4', label: 'Continents Served' },
]

const VALUES = [
  {
    icon: Target,
    title: 'Precision Over Speed',
    desc: 'We take the time to understand your constraints before proposing solutions. A well-scoped engagement is worth more than a fast one.',
  },
  {
    icon: Users,
    title: 'Embedded Collaboration',
    desc: 'We work alongside your teams, not apart from them. Knowledge transfer and capability building are deliverables in every engagement.',
  },
  {
    icon: TrendingUp,
    title: 'Measurable Outcomes',
    desc: 'Every engagement begins with a baseline measurement and ends with quantified impact. No vague success criteria.',
  },
  {
    icon: Award,
    title: 'Intellectual Honesty',
    desc: 'We will tell you when a technology is not right for your problem, even if it means a smaller engagement.',
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

export default function About() {
  return (
    <>
      <SEOHead
        title="About"
        description="Nxion Consulting is an enterprise technology consultancy at the intersection of AI, data engineering, and cloud architecture."
        slug="about"
      />

      <main className="pt-16">
        {/* Hero */}
        <section
          className="py-24 border-b"
          style={{ backgroundColor: '#020C1B', borderColor: 'rgba(136,146,176,0.1)' }}
        >
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.p variants={itemVariants} className="text-xs font-semibold tracking-[0.25em] uppercase mb-4" style={{ color: '#64FFDA' }}>
                Our Story
              </motion.p>
              <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Built for the complexity
                <br />
                <span style={{ color: '#64FFDA' }}>you actually face.</span>
              </motion.h1>
              <motion.p variants={itemVariants} className="text-lg leading-relaxed mb-5" style={{ color: '#8892B0' }}>
                Nxion Consulting was founded on the belief that enterprises deserve advisors who
                have shipped real systems — not just drawn architecture diagrams.
              </motion.p>
              <motion.p variants={itemVariants} className="text-base leading-relaxed mb-8" style={{ color: '#8892B0' }}>
                Our team has built ML platforms processing billions of events daily, designed
                data governance programs for Fortune 500s, and led cloud migrations of
                mission-critical infrastructure. We bring that operational depth to every
                engagement.
              </motion.p>
              <motion.div variants={itemVariants}>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded font-semibold text-sm transition-colors"
                  style={{ backgroundColor: '#64FFDA', color: '#0A192F' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#4de8c4')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#64FFDA')}
                >
                  Work with us
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="grid grid-cols-2 gap-6"
            >
              {STATS.map(({ value, label }) => (
                <div
                  key={label}
                  className="p-6 rounded-lg"
                  style={{ backgroundColor: 'rgba(17,34,64,0.7)', border: '1px solid rgba(136,146,176,0.12)' }}
                >
                  <div className="text-4xl font-bold mb-1" style={{ color: '#64FFDA' }}>
                    {value}
                  </div>
                  <div className="text-sm" style={{ color: '#8892B0' }}>{label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24" style={{ backgroundColor: '#0A192F' }}>
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-14 text-center"
            >
              <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: '#64FFDA' }}>
                What Guides Us
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Our Values
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {VALUES.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="flex gap-5 p-6 rounded-lg"
                  style={{ backgroundColor: '#112240', border: '1px solid rgba(136,146,176,0.12)' }}
                >
                  <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center mt-0.5"
                    style={{ backgroundColor: 'rgba(100,255,218,0.08)' }}>
                    <Icon size={20} style={{ color: '#64FFDA' }} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#8892B0' }}>{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          className="py-20 text-center"
          style={{ backgroundColor: '#020C1B' }}
        >
          <div className="max-w-2xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to get started?
              </h2>
              <p className="mb-8" style={{ color: '#8892B0' }}>
                Tell us about your challenge. We'll respond within one business day.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded font-semibold text-sm border transition-colors"
                style={{ color: '#64FFDA', borderColor: 'rgba(100,255,218,0.4)' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(100,255,218,0.05)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Contact Us <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  )
}
