import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'
import { SEOHead } from '../components/seo/SEOHead'
import { parseFrontmatter } from '../lib/utils'

const mdModules = import.meta.glob('../content/*.md', { query: '?raw', eager: true })

function getArticle(slug) {
  const entry = Object.entries(mdModules).find(([path]) => {
    return path.split('/').pop().replace(/\.md$/, '') === slug
  })
  if (!entry) return null
  const { meta, content } = parseFrontmatter(entry[1].default || entry[1])
  return { meta, content }
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Custom markdown component renderers for dark theme
const mdComponents = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold text-white mt-10 mb-6 pb-4"
      style={{ borderBottom: '1px solid rgba(136,146,176,0.2)' }}>
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-semibold text-white mt-10 mb-4">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold text-white mt-8 mb-3">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-base leading-7 mb-5" style={{ color: '#8892B0' }}>{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-5 pl-6 space-y-2" style={{ color: '#8892B0' }}>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-5 pl-6 space-y-2 list-decimal" style={{ color: '#8892B0' }}>{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-base leading-7 list-disc">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote
      className="pl-5 py-1 my-6 italic text-base"
      style={{
        borderLeft: '3px solid #64FFDA',
        color: '#8892B0',
      }}
    >
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      style={{ color: '#64FFDA' }}
      className="underline underline-offset-2 transition-colors hover:opacity-80"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
  code: ({ inline, className, children }) => {
    if (inline) {
      return (
        <code
          className="px-1.5 py-0.5 rounded text-sm font-mono"
          style={{ backgroundColor: '#112240', color: '#64FFDA' }}
        >
          {children}
        </code>
      )
    }
    return (
      <code className={className}>{children}</code>
    )
  },
  pre: ({ children }) => (
    <pre
      className="rounded-lg p-5 overflow-x-auto my-6 text-sm"
      style={{ backgroundColor: '#020C1B', border: '1px solid rgba(136,146,176,0.15)' }}
    >
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th
      className="px-4 py-3 text-left text-white font-semibold text-xs uppercase tracking-wider"
      style={{ borderBottom: '1px solid rgba(100,255,218,0.2)', backgroundColor: '#112240' }}
    >
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td
      className="px-4 py-3 text-sm"
      style={{ borderBottom: '1px solid rgba(136,146,176,0.08)', color: '#8892B0' }}
    >
      {children}
    </td>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  hr: () => (
    <hr className="my-10" style={{ borderColor: 'rgba(136,146,176,0.15)' }} />
  ),
}

export default function KnowledgeArticle() {
  const { slug } = useParams()
  const article = getArticle(slug)

  if (!article) return <Navigate to="/knowledge" replace />

  const { meta, content } = article

  return (
    <>
      <SEOHead
        title={meta.title}
        description={meta.description}
        slug={`knowledge/${slug}`}
        type="article"
      />

      <main className="pt-16">
        {/* Article header */}
        <header
          className="py-16 border-b"
          style={{ backgroundColor: '#020C1B', borderColor: 'rgba(136,146,176,0.1)' }}
        >
          <div className="max-w-3xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                to="/knowledge"
                className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
                style={{ color: '#8892B0' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#64FFDA')}
                onMouseLeave={e => (e.currentTarget.style.color = '#8892B0')}
              >
                <ArrowLeft size={14} />
                Knowledge Hub
              </Link>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {meta.tags?.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded border"
                    style={{ color: '#64FFDA', borderColor: 'rgba(100,255,218,0.25)' }}
                  >
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                {meta.title}
              </h1>

              {meta.description && (
                <p className="text-xl leading-relaxed mb-8" style={{ color: '#8892B0' }}>
                  {meta.description}
                </p>
              )}

              {/* Meta row */}
              <div className="flex items-center gap-6 text-sm" style={{ color: '#8892B0' }}>
                {meta.date && (
                  <span className="flex items-center gap-2">
                    <Calendar size={14} />
                    {formatDate(meta.date)}
                  </span>
                )}
                {meta.readTime && (
                  <span className="flex items-center gap-2">
                    <Clock size={14} />
                    {meta.readTime}
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </header>

        {/* Article body */}
        <article className="py-16" style={{ backgroundColor: '#0A192F' }}>
          <div className="max-w-3xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={mdComponents}
              >
                {content}
              </ReactMarkdown>
            </motion.div>
          </div>
        </article>

        {/* Back link */}
        <div
          className="py-12 border-t"
          style={{ borderColor: 'rgba(136,146,176,0.1)', backgroundColor: '#0A192F' }}
        >
          <div className="max-w-3xl mx-auto px-6">
            <Link
              to="/knowledge"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
              style={{ color: '#64FFDA' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#4de8c4')}
              onMouseLeave={e => (e.currentTarget.style.color = '#64FFDA')}
            >
              <ArrowLeft size={14} />
              Back to Knowledge Hub
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
