import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { ScrollToTop } from './components/layout/ScrollToTop'

const Home             = lazy(() => import('./pages/Home'))
const KnowledgeHub     = lazy(() => import('./pages/KnowledgeHub'))
const KnowledgeArticle = lazy(() => import('./pages/KnowledgeArticle'))
const About            = lazy(() => import('./pages/About'))
const Contact          = lazy(() => import('./pages/Contact'))

function PageLoader() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#0A192F' }}
    >
      <div
        className="w-8 h-8 border-2 rounded-full animate-spin"
        style={{ borderColor: 'rgba(100,255,218,0.2)', borderTopColor: '#64FFDA' }}
      />
    </div>
  )
}

function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ backgroundColor: '#0A192F' }}
    >
      <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-4" style={{ color: '#64FFDA' }}>
        404
      </p>
      <h1 className="text-4xl font-bold text-white mb-4">Page Not Found</h1>
      <p className="mb-8" style={{ color: '#8892B0' }}>
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        to="/"
        className="px-6 py-3 rounded font-semibold text-sm transition-colors"
        style={{ backgroundColor: '#64FFDA', color: '#0A192F' }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#4de8c4')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#64FFDA')}
      >
        Back to Home
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0A192F' }}>
          <Navbar />
          <div className="flex-1">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/"                element={<Home />} />
                <Route path="/knowledge"       element={<KnowledgeHub />} />
                <Route path="/knowledge/:slug" element={<KnowledgeArticle />} />
                <Route path="/about"           element={<About />} />
                <Route path="/contact"         element={<Contact />} />
                <Route path="*"               element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </HelmetProvider>
  )
}
