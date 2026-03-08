import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'Nxion Consulting'
const DEFAULT_DESC =
  'Enterprise AI, Data Engineering & Cloud Architecture consulting. We help organizations transform complex data challenges into strategic advantages.'
const OG_IMAGE = 'https://nxion.org/og-image.png'
const SITE_URL = 'https://nxion.org'

export function SEOHead({ title, description = DEFAULT_DESC, slug, type = 'website' }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const canonical = slug ? `${SITE_URL}/${slug}` : SITE_URL

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={type} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />
    </Helmet>
  )
}
