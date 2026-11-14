import { useEffect } from 'react'
import { SITE } from '@/config'

const DEFAULTS = {
  title: 'kavynUI - animated React components and blocks',
  description: 'Animated React components and page sections. Monochrome, theme-aware, installed as source you own with the shadcn CLI. Open source, MIT.',
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
// `image` is a site-relative path; component pages pass their own share card (dist/og/<slug>.png, made by scripts/prerender.mjs).
export function useSEO({ title, description, path = '/', type = 'website', noindex = false, jsonLd = null, image = '/og.png' }) {
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
    metaProp('og:image', `${SITE.url}${image}`)
    metaName('twitter:card', 'summary_large_image')
    metaName('twitter:title', t)
    metaName('twitter:description', d)
    metaName('twitter:image', `${SITE.url}${image}`)
    upsert('link[rel="canonical"]', () => { const l = document.createElement('link'); l.setAttribute('rel', 'canonical'); return l }, { href: url })
    let ld
    if (jsonLd) {
      ld = document.createElement('script')
      ld.type = 'application/ld+json'
      ld.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(ld)
    }
    return () => { ld?.remove() }
  }, [title, description, path, type, noindex, jsonLd, image])
}

export const SITE_JSONLD = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', name: 'kavynUI', url: SITE.url, description: DEFAULTS.description },
    { '@type': 'Organization', name: 'kavynUI', url: SITE.url, logo: `${SITE.url}/favicon.svg` },
  ],
}
