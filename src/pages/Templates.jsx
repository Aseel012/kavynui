import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useSEO } from '@/lib/seo'
import { SITE } from '@/config'
import templatesData from '@/data/templates.json'

const SPRING = { type: 'spring', stiffness: 260, damping: 28 }
const templates = templatesData.templates.filter((t) => t.listed !== false)

// Placeholder art for a template until its final screenshots land: a small
// product-window wireframe in the template's accent color. When the real PNG
// exists at /templates/<slug>/preview.png it loads and this never shows.
function PreviewArt({ t, failed, setFailed }) {
  if (!failed) {
    return (
      <img
        src={t.preview}
        alt={`${t.name} template preview`}
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    )
  }
  return (
    <div className="flex h-full w-full items-center justify-center" style={{ background: `radial-gradient(120% 140% at 50% 0%, ${t.accent}14 0%, transparent 60%)` }}>
      <div className="w-[72%] overflow-hidden rounded-lg border border-line bg-panel shadow-lg">
        <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
          <span className="size-1.5 rounded-full bg-faint/60" />
          <span className="size-1.5 rounded-full bg-faint/60" />
          <span className="size-1.5 rounded-full bg-faint/60" />
          <span className="ml-2 h-1.5 w-16 rounded-full bg-faint/40" />
        </div>
        <div className="flex">
          <div className="w-1/4 space-y-1.5 border-r border-line p-3">
            <div className="h-1.5 w-3/4 rounded-full" style={{ background: t.accent }} />
            {[0, 1, 2, 3].map((i) => <div key={i} className="h-1.5 rounded-full bg-faint/30" style={{ width: `${70 - i * 10}%` }} />)}
          </div>
          <div className="flex-1 space-y-2 p-3">
            <div className="h-2 w-2/5 rounded-full bg-tx/70" />
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="space-y-1 rounded-md border border-line p-2">
                  <div className="h-1.5 w-2/3 rounded-full bg-faint/40" />
                  <div className="h-2 w-1/2 rounded-full" style={{ background: `${t.accent}66` }} />
                </div>
              ))}
            </div>
            <div className="h-10 rounded-md border border-line" style={{ background: `linear-gradient(180deg, ${t.accent}0f, transparent)` }} />
          </div>
        </div>
      </div>
    </div>
  )
}

function TemplateCard({ t }) {
  const [failed, setFailed] = useState(false)
  const price = `$${t.price} ${t.currency}`
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={SPRING}>
      <Link
        to={`#${t.slug}`}
        onClick={(e) => { e.preventDefault(); document.getElementById(t.slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
        className="group block overflow-hidden rounded-2xl border border-line bg-panel transition-colors hover:border-faint/60"
      >
        <div className="aspect-[16/10] overflow-hidden border-b border-line">
          <PreviewArt t={t} failed={failed} setFailed={setFailed} />
        </div>
        <div className="p-5">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-lg font-semibold tracking-tight text-tx">{t.name}</h3>
            <span className="font-mono text-sm text-tx">{price}</span>
          </div>
          <div className="mt-1 text-sm text-faint">{t.niche}</div>
          <p className="mt-3 text-sm leading-6 text-mute">{t.tagline}</p>
          <div className="mt-4 flex items-center justify-between text-xs text-faint">
            <span>{`${t.screens} screens`}</span>
            <span className="text-acc transition-transform group-hover:translate-x-0.5">{`Details →`}</span>
          </div>
        </div>
      </Link>
      {t.livePreviewUrl && (
        <div className="mt-3 flex flex-wrap items-center gap-3 px-1">
          <a href={t.livePreviewUrl} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center rounded-full border border-line px-4 text-sm text-tx transition-colors hover:border-faint/60">Live Preview <span aria-hidden="true" className="ml-2">↗</span></a>
          {t.buyUrl && <a href={t.buyUrl} className="inline-flex h-10 items-center rounded-full bg-tx px-4 text-sm font-medium text-bg">Get template</a>}
        </div>
      )}
    </motion.div>
  )
}

function TemplateDetail({ t }) {
  const price = `$${t.price} ${t.currency}`
  return (
    <section id={t.slug} className="scroll-mt-24 border-t border-line pt-12 first:border-t-0 first:pt-0">
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-2xl border border-line bg-panel">
            <div className="aspect-[16/10] border-b border-line"><DetailPreview t={t} /></div>
          </div>
          {t.gallery.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              {t.gallery.map((src, i) => (
                <img key={src} src={src} alt={`${t.name} screen ${i + 1}`} loading="lazy" className="rounded-xl border border-line" />
              ))}
            </div>
          )}
        </div>
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-tx">{t.name}</h2>
            <span className="rounded-full border border-line px-2.5 py-0.5 text-[11px] text-faint">{t.niche}</span>
          </div>
          <p className="mt-3 text-sm leading-7 text-mute">{t.description}</p>
          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-faint">Screens</dt><dd className="text-tx">{t.screens}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-faint">Stack</dt><dd className="text-tx">{t.stack.join(' · ')}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-faint">Responsive</dt><dd className="text-tx">{t.responsive ? 'Desktop and mobile' : 'Desktop'}</dd></div>
          </dl>
          <h3 className="mt-6 text-sm font-medium text-tx">What you get</h3>
          <ul className="mt-2 space-y-1.5">
            {t.includes.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-mute"><span className="mt-[10px] size-1 shrink-0 rounded-full" style={{ background: t.accent }} />{item}</li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            {t.livePreviewUrl && <a href={t.livePreviewUrl} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center rounded-full border border-line px-5 text-sm text-tx transition-colors hover:border-faint/60">Live Preview <span aria-hidden="true" className="ml-2">↗</span></a>}
            {t.buyUrl ? (
              <a href={t.buyUrl} target="_blank" rel="noreferrer" className="h-11 rounded-full bg-tx px-6 text-sm font-medium leading-[2.75rem] text-bg">{`Get ${t.name} - ${price}`}</a>
            ) : (
              <span className="inline-flex h-11 cursor-not-allowed items-center rounded-full border border-line px-6 text-sm text-mute">{`${t.name} - ${price} - store link lands here`}</span>
            )}
          </div>
          {(!t.buyUrl || t.livePreviewUrl) && <p className="mt-3 text-xs text-faint">{t.previewNote}</p>}
        </div>
      </div>
    </section>
  )
}

function DetailPreview({ t }) {
  const [failed, setFailed] = useState(false)
  return <PreviewArt t={t} failed={failed} setFailed={setFailed} />
}

export default function Templates() {
  useSEO({
    title: 'Templates - kavynUI',
    description: 'Complete products designed end to end - every screen, real-feeling data, source you own. Templates by Enzo, built on the kavynUI motion language.',
    path: '/templates',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'CollectionPage', name: 'kavynUI Templates', url: `${SITE.url}/templates`, description: 'Complete end-to-end product designs sold as templates.' },
        ...templates.map((t) => ({
          '@type': 'Product',
          name: `${t.name} - ${t.niche} template`,
          description: t.tagline,
          image: `${SITE.url}${t.preview}`,
          brand: { '@type': 'Brand', name: 'Enzo' },
          offers: { '@type': 'Offer', price: t.price, priceCurrency: t.currency, availability: 'https://schema.org/InStock' },
        })),
      ],
    },
  })
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={SPRING} className="max-w-2xl">
        <div className="text-xs uppercase tracking-[0.12em] text-faint">Templates</div>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-tx sm:text-4xl">Complete products, ready to ship</h1>
        <p className="mt-3 leading-7 text-mute">End-to-end product designs by Enzo: every screen designed, filled with real-feeling data, and delivered as source you own. Built on the same motion language as the kavynUI library.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.06 }} className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
        <div className="bg-bg p-5 sm:p-6">
          <div className="text-sm font-medium text-tx">Components - free forever</div>
          <p className="mt-2 text-sm leading-6 text-mute">The kavynUI library stays free and open source (MIT). Copy any component, block or background into your project, no account and no cost.</p>
          <Link to="/components" className="mt-4 inline-block text-sm text-acc">Open the free library</Link>
        </div>
        <div className="bg-bg p-5 sm:p-6">
          <div className="text-sm font-medium text-tx">Templates - one-time price</div>
          <p className="mt-2 text-sm leading-6 text-mute">Complete products designed end to end. Pay once, own the source, use it in client or commercial work. Every template includes all screens, both layouts and real content.</p>
        </div>
      </motion.div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {templates.map((t) => <TemplateCard key={t.slug} t={t} />)}
      </div>

      <div className="mt-20 space-y-16">
        {templates.map((t) => <TemplateDetail key={t.slug} t={t} />)}
      </div>

      <div className="mt-20 rounded-2xl border border-line bg-panel p-6 text-center sm:p-8">
        <div className="text-sm font-medium text-tx">More in the works</div>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-mute">New templates ship as each product design finishes. The library stays free; templates are how the work is funded.</p>
        <Link to="/components" className="mt-5 inline-flex h-10 items-center rounded-full border border-line px-5 text-sm text-tx transition-colors hover:border-faint/60">Browse the free components</Link>
      </div>
    </div>
  )
}
