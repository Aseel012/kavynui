import { useEffect } from 'react'
import { SITE } from '@/config'

const DEFAULTS = {
  title: 'kavynUI - animated React components and blocks',
  description: 'Copy-paste animated React components, blocks and backgrounds: WebGL shaders, scroll scenes, physics, 3D and particle text. Open source, MIT.',
}

function upsert(sel, make, attrs) {
  let el = document.head.querySelector(sel)
  if (!el) { el = make(); document.head.appendChild(el) }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
  return el
}
const metaName = (name, content) => upsert(`meta[name="${name}"]`, () => { const m = document.createElement('meta'); m.setAttribute('name', name); return m }, { content })
const metaProp = (prop, content) => upsert(`meta[property="${prop}"]`, () => { const m = document.createElement('meta'); m.setAttribute('property', prop); return m }, { content })

// Per-page SEO: title, description, canonical, Open Graph/Twitter cards and optional JSON-LD.
export function useSEO({ title, description, path = '/', type = 'website', noindex = false, jsonLd = null }) {
  useEffect(() => {
    const t = title || DEFAULTS.title
    const d = description || DEFAULTS.description
    const url = `${SITE.url}${path}`
    document.title = t
    metaName('description', d)
    metaName('robots', noindex ? 'noindex, nofollow' : 'index, follow')
    metaProp('og:title', t)
    metaProp('og:description', d)
    metaProp('og:type', type)
    metaProp('og:url', url)
    metaProp('og:site_name', 'kavynUI')
    metaProp('og:image', `${SITE.url}/og.png`)
    metaName('twitter:card', 'summary_large_image')
    metaName('twitter:title', t)
    metaName('twitter:description', d)
    metaName('twitter:image', `${SITE.url}/og.png`)
    upsert('link[rel="canonical"]', () => { const l = document.createElement('link'); l.setAttribute('rel', 'canonical'); return l }, { href: url })
    let ld
    if (jsonLd) {
      ld = document.createElement('script')
      ld.type = 'application/ld+json'
      ld.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(ld)
    }
    return () => { ld?.remove() }
  }, [title, description, path, type, noindex, jsonLd])
}

export const SITE_JSONLD = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', name: 'kavynUI', url: SITE.url, description: DEFAULTS.description },
    { '@type': 'Organization', name: 'kavynUI', url: SITE.url, logo: `${SITE.url}/favicon.svg` },
  ],
}
