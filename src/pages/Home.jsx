import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BarChart3, Shield, Lightbulb } from 'lucide-react'
import { SEOHead } from '../components/seo/SEOHead'
import { AlgorithmVisual } from '../components/ui/AlgorithmVisual'
import { ServiceCard } from '../components/ui/ServiceCard'
import services from '../data/services.json'
import { parseFrontmatter } from '../lib/utils'

// Load article previews at build time
const mdModules = import.meta.glob('../content/*.md', { query: '?raw', eager: true })

function getArticlePreviews() {
  return Object.entries(mdModules)
    .map(([path, raw]) => {
      const filename = path.split('/').pop()
      const slug = filename.replace(/\.md$/, '')
      const { meta } = parseFrontmatter(raw.default || raw)
      return { slug, ...meta }
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)
}

const PRINCIPLES = [
  {
    icon: BarChart3,
    title: 'Data-Driven',
    desc: 'Every recommendation is grounded in measurement, not intuition. We quantify outcomes before and after.',
  },
  {
    icon: Shield,
    title: 'Ethical by Design',
    desc: 'Responsible AI and privacy-first data architectures are non-negotiable — they are built in from day one.',
  },
  {
    icon: Lightbulb,
    title: 'Outcome-Focused',
    desc: 'We measure success in business outcomes, not deliverables. Strategy without execution is just theory.',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}

export default function Home() {
  const articles = getArticlePreviews()

  return (
    <>
      <SEOHead />

      <main className="pt-16">
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section
          className="min-h-screen flex items-center relative overflow-hidden"
          style={{
            background: 'radial-gradient(ellipse at 70% 50%, rgba(100,255,218,0.04) 0%, transparent 60%), #0A192F',
          }}
        >
          {/* Background grid */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(100,255,218,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(100,255,218,0.03) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />

          <div className="max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            {/* Left: Copy */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.p
                variants={itemVariants}
                className="text-xs font-semibold tracking-[0.25em] uppercase mb-5"
                style={{ color: '#64FFDA' }}
              >
                Enterprise Technology Consulting
              </motion.p>

              <motion.h1
                variants={itemVariants}
                className="text-5xl md:text-6xl font-bold leading-[1.08] mb-6 text-white"
              >
                Data-Driven
                <br />
                Decisions
                <br />
                <span style={{ color: '#64FFDA' }}>at Scale.</span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-lg leading-relaxed max-w-md mb-10"
                style={{ color: '#8892B0' }}
              >
                We help organizations transform complex data challenges into strategic
                advantages — through AI governance, ML engineering, and cloud-native architecture.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded font-semibold text-sm transition-colors"
                  style={{ backgroundColor: '#64FFDA', color: '#0A192F' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#4de8c4')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#64FFDA')}
                >
                  Start a Conversation
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/knowledge"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded font-semibold text-sm border transition-colors"
                  style={{ color: '#E6F1FF', borderColor: 'rgba(230,241,255,0.2)' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(230,241,255,0.5)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(230,241,255,0.2)')}
                >
                  Read Insights
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: Algorithm Visual */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:flex justify-center"
            >
              <AlgorithmVisual />
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-5 h-8 rounded-full border flex items-start justify-center pt-1.5"
              style={{ borderColor: 'rgba(100,255,218,0.3)' }}>
              <div className="w-1 h-2 rounded-full" style={{ backgroundColor: '#64FFDA' }} />
            </div>
          </motion.div>
        </section>

        {/* ── Leadership Principles ─────────────────────────────────── */}
        <section className="py-24" style={{ backgroundColor: '#020C1B' }}>
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-14 text-center"
            >
              <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: '#64FFDA' }}>
                How We Work
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Leadership Principles
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PRINCIPLES.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="p-6 rounded-lg"
                  style={{ backgroundColor: 'rgba(17,34,64,0.5)', border: '1px solid rgba(136,146,176,0.1)' }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: 'rgba(100,255,218,0.08)' }}>
                    <Icon size={20} style={{ color: '#64FFDA' }} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#8892B0' }}>{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Service Matrix ───────────────────────────────────────── */}
        <section className="py-24" style={{ backgroundColor: '#0A192F' }}>
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-14"
            >
              <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: '#64FFDA' }}>
                What We Do
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Service Matrix
              </h2>
              <p className="text-lg max-w-2xl" style={{ color: '#8892B0' }}>
                Four specialized practice areas, each backed by deep domain expertise
                and a track record of enterprise delivery.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service, i) => (
                <ServiceCard key={service.id} service={service} index={i} />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-10 text-center"
            >
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                style={{ color: '#64FFDA' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#4de8c4')}
                onMouseLeave={e => (e.currentTarget.style.color = '#64FFDA')}
              >
                Discuss your project <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── Thought Leadership ───────────────────────────────────── */}
        <section className="py-24" style={{ backgroundColor: '#020C1B' }}>
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
            >
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: '#64FFDA' }}>
                  Curiosity & Innovation
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Thought Leadership
                </h2>
              </div>
              <Link
                to="/knowledge"
                className="inline-flex items-center gap-2 text-sm font-medium shrink-0 transition-colors"
                style={{ color: '#64FFDA' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#4de8c4')}
                onMouseLeave={e => (e.currentTarget.style.color = '#64FFDA')}
              >
                View all insights <ArrowRight size={14} />
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles.map((article, i) => (
                <motion.article
                  key={article.slug}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group flex flex-col rounded-lg overflow-hidden border transition-colors duration-300"
                  style={{ backgroundColor: '#112240', borderColor: 'rgba(136,146,176,0.15)' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(100,255,218,0.3)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(136,146,176,0.15)')}
                >
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      {article.tags?.slice(0, 1).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs rounded border"
                          style={{ color: '#64FFDA', borderColor: 'rgba(100,255,218,0.25)' }}
                        >
                          {tag}
                        </span>
                      ))}
                      <span className="text-xs" style={{ color: '#8892B0' }}>
                        {article.readTime}
                      </span>
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-3 leading-snug group-hover:text-[#64FFDA] transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: '#8892B0' }}>
                      {article.description}
                    </p>
                    <Link
                      to={`/knowledge/${article.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                      style={{ color: '#64FFDA' }}
                    >
                      Read article <ArrowRight size={13} />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Section ──────────────────────────────────────────── */}
        <section
          className="py-28 relative overflow-hidden"
          style={{ backgroundColor: '#0A192F' }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(100,255,218,0.08) 0%, transparent 65%)',
            }}
          />
          <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: '#64FFDA' }}>
                Ready to transform?
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Let's build something
                <br />
                <span style={{ color: '#64FFDA' }}>remarkable together.</span>
              </h2>
              <p className="text-lg mb-10" style={{ color: '#8892B0' }}>
                Whether you're architecting your first ML platform or scaling an existing
                data estate, we're ready to help.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded font-semibold text-base transition-colors"
                style={{ backgroundColor: '#64FFDA', color: '#0A192F' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#4de8c4')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#64FFDA')}
              >
                Start a Conversation
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  )
}
