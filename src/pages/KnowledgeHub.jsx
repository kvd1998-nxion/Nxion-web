import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, Calendar } from 'lucide-react'
import { SEOHead } from '../components/seo/SEOHead'
import { parseFrontmatter } from '../lib/utils'

const mdModules = import.meta.glob('../content/*.md', { query: '?raw', eager: true })

function getArticles() {
  return Object.entries(mdModules)
    .map(([path, raw]) => {
      const filename = path.split('/').pop()
      const slug = filename.replace(/\.md$/, '')
      const { meta } = parseFrontmatter(raw.default || raw)
      return { slug, ...meta }
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function KnowledgeHub() {
  const articles = getArticles()

  return (
    <>
      <SEOHead
        title="Knowledge Hub"
        description="In-depth whitepapers and technical guides on AI ethics, data engineering, and cloud-native architecture."
        slug="knowledge"
      />

      <main className="pt-16">
        {/* Header */}
        <section
          className="py-20 border-b"
          style={{
            backgroundColor: '#020C1B',
            borderColor: 'rgba(136,146,176,0.1)',
          }}
        >
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-4" style={{ color: '#64FFDA' }}>
                Curiosity & Innovation
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Knowledge Hub
              </h1>
              <p className="text-lg max-w-2xl" style={{ color: '#8892B0' }}>
                Technical whitepapers, architecture guides, and practitioner insights from
                the frontlines of enterprise data and AI engineering.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Article grid */}
        <section className="py-20" style={{ backgroundColor: '#0A192F' }}>
          <div className="max-w-6xl mx-auto px-6">
            {articles.length === 0 ? (
              <p style={{ color: '#8892B0' }}>No articles found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article, i) => (
                  <motion.article
                    key={article.slug}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className="group flex flex-col rounded-lg overflow-hidden border transition-colors duration-300"
                    style={{ backgroundColor: '#112240', borderColor: 'rgba(136,146,176,0.15)' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(100,255,218,0.3)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(136,146,176,0.15)')}
                  >
                    {/* Top accent */}
                    <div className="h-[2px] w-12 ml-6 mt-6" style={{ backgroundColor: '#64FFDA' }} />

                    <div className="p-6 flex flex-col flex-1">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags?.slice(0, 2).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs rounded border"
                            style={{ color: '#64FFDA', borderColor: 'rgba(100,255,218,0.25)' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <h2 className="text-white font-semibold text-xl mb-3 leading-snug group-hover:text-[#64FFDA] transition-colors">
                        {article.title}
                      </h2>
                      <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: '#8892B0' }}>
                        {article.description}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-4 mb-5 text-xs" style={{ color: '#8892B0' }}>
                        {article.date && (
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {formatDate(article.date)}
                          </span>
                        )}
                        {article.readTime && (
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {article.readTime}
                          </span>
                        )}
                      </div>

                      <Link
                        to={`/knowledge/${article.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                        style={{ color: '#64FFDA' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#4de8c4')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#64FFDA')}
                      >
                        Read article <ArrowRight size={13} />
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
