import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { bySlug, components, families } from '@/lib/catalog'
import { Demo, LazyDemo } from '@/site/Preview'
import { GRADIENTS, styleOf } from '@/data/gradients'
import CodeBlock, { CopyButton } from '@/site/CodeBlock'
import { useSEO, SITE_JSONLD } from '@/lib/seo'
import { SITE } from '@/config'

const MOSAIC = ['avatar-upload', 'flip-words', 'dock-magnify', 'cache-ring', 'liquid-button', 'notif-stack', 'hold-to-confirm', 'tab-lens']
// Page order, top to bottom. Every entry is a block in the registry.
const KIT = [
  { slug: 'product-hero', role: 'Hero' },
  { slug: 'feature-bento', role: 'Features' },
  { slug: 'proof-wall', role: 'Social proof' },
  { slug: 'pricing-morph', role: 'Pricing' },
  { slug: 'faq-accordion', role: 'FAQ' },
  { slug: 'globe-cta', role: 'Call to action' },
  { slug: 'wordmark-footer', role: 'Footer' },
]
const registryUrl = (slug) => `${SITE.url}/r/${slug}.json`
const chevron = <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-faint" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="m9 6 6 6-6 6" /></svg>

// Renders a block at desktop width and scales it to fit the column, keeping flow height correct.
function Scaled({ children, width = 1440 }) {
  const box = useRef(null), inner = useRef(null)
  const [fit, setFit] = useState({ s: 0, h: 0 })
  useLayoutEffect(() => {
    const calc = () => {
      if (!box.current || !inner.current) return
      const s = box.current.clientWidth / width, h = inner.current.offsetHeight * s
      setFit((o) => (Math.abs(o.s - s) < 0.002 && Math.abs(o.h - h) < 1 ? o : { s, h }))
    }
    calc()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(calc)
    ro.observe(box.current); ro.observe(inner.current)
    return () => ro.disconnect()
  }, [width])
  return (
    <div ref={box} className="relative overflow-hidden" style={{ height: fit.h || 240 }}>
      <div ref={inner} className="absolute left-0 top-0 p-6" style={{ width, transform: `scale(${fit.s})`, transformOrigin: '0 0', visibility: fit.s ? 'visible' : 'hidden' }}>{children}</div>
    </div>
  )
}

function Switch({ on, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={onChange}
      className={`relative h-[26px] w-[44px] shrink-0 rounded-full transition-colors duration-200 ${on ? 'bg-tx' : 'bg-line2'}`}>
      <motion.span className="absolute top-[3px] size-5 rounded-full bg-bg shadow-[0_2px_6px_rgba(0,0,0,.25)]" animate={{ left: on ? 21 : 3 }} transition={{ type: 'spring', stiffness: 600, damping: 36 }} />
    </button>
  )
}

function PageKit() {
  const [on, setOn] = useState(() => new Set(['product-hero', 'feature-bento', 'pricing-morph', 'faq-accordion', 'wordmark-footer']))
  const picked = KIT.filter((k) => on.has(k.slug))
  const toggle = (slug) => setOn((s) => { const n = new Set(s); n.has(slug) ? n.delete(slug) : n.add(slug); return n })
  const command = picked.length ? `npx shadcn@latest add ${picked.map((k) => registryUrl(k.slug)).join(' ')}` : ''
  const page = useMemo(() => picked.length ? [
    ...picked.map((k) => `import ${bySlug[k.slug].export} from '@/components/kavyn/${k.slug}'`),
    '',
    'export default function Page() {',
    '  return (',
    '    <main>',
    ...picked.map((k) => `      <${bySlug[k.slug].export} />`),
    '    </main>',
    '  )',
    '}',
  ].join('\n') : '', [picked])

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_minmax(0,900px)] lg:justify-between lg:gap-10">
      <div className="min-w-0 lg:sticky lg:top-20 lg:self-start">
        <ul className="overflow-hidden rounded-[22px] bg-panel" aria-label="Page sections">
          {KIT.map((k, i) => (
            <li key={k.slug} className={`flex items-center gap-3 px-4 py-3 ${i ? 'border-t border-line' : ''}`}>
              <div className="min-w-0 flex-1">
                <div className="text-[15px] text-tx">{k.role}</div>
                <Link to={`/components/${k.slug}`} className="text-[13px] text-mute hover:text-tx">{bySlug[k.slug].name}</Link>
              </div>
              <Switch on={on.has(k.slug)} onChange={() => toggle(k.slug)} label={`Include ${k.role}`} />
            </li>
          ))}
        </ul>
        <div className="mt-4 rounded-[22px] bg-panel p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[13px] text-mute">{picked.length} {picked.length === 1 ? 'section' : 'sections'}, one command</span>
            <CopyButton text={command} label="Copy command" />
          </div>
          <code data-testid="kit-command" className="mt-3 block max-h-28 overflow-auto break-all font-mono text-[11.5px] leading-5 text-tx/80">{command || 'Turn on a section to get its install command.'}</code>
        </div>
      </div>

      <div className="min-w-0">
        <div className="overflow-hidden rounded-[22px] border border-line bg-bg">
          <div className="flex h-10 items-center gap-2 border-b border-line bg-panel px-4">
            <span className="size-2.5 rounded-full bg-line2" /><span className="size-2.5 rounded-full bg-line2" /><span className="size-2.5 rounded-full bg-line2" />
            <span className="mx-auto rounded-full bg-bg px-3 py-0.5 text-[11px] text-faint">your-site.com</span>
          </div>
          <div className="max-h-[720px] overflow-y-auto" data-testid="kit-preview">
            <AnimatePresence initial={false}>
              {picked.map((k) => (
                <motion.div key={k.slug} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 32 }} className="overflow-hidden border-b border-line last:border-b-0">
                  <Scaled><Demo item={bySlug[k.slug]} page="home" /></Scaled>
                </motion.div>
              ))}
            </AnimatePresence>
            {!picked.length && <div className="grid h-72 place-items-center text-sm text-faint">An empty page. Switch a section on.</div>}
          </div>
        </div>
        {page && <div className="mt-4"><CodeBlock title="app/page.jsx" code={page} maxHeight={300} /></div>}
      </div>
    </div>
  )
}

function Heading({ title, sub, to, link }) {
  return (
    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-[28px] font-semibold tracking-[-0.03em] text-tx sm:text-[34px]">{title}</h2>
        {sub && <p className="mt-1.5 max-w-xl text-[15px] leading-6 text-mute">{sub}</p>}
      </div>
      {to && <Link to={to} className="flex items-center gap-1 text-[15px] text-mute hover:text-tx">{link}{chevron}</Link>}
    </div>
  )
}

export default function Home() {
  useSEO({ title: 'kavynUI - animated React components and page sections', description: `${components.length} animated React components and page sections. Install any of them with the shadcn CLI or copy the file. Open source, MIT.`, path: '/', jsonLd: SITE_JSONLD })
  const blocks = components.filter((c) => c.family === 'blocks').length
  const starter = `npx shadcn@latest add ${registryUrl('avatar-upload')}`
  const half = Math.ceil(families.length / 2)

  return (
    <div className="mx-auto max-w-[1600px] px-4 sm:px-8">
      <section className="pb-14 pt-14 sm:pt-24">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 26 }}
          className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[1.3fr_1fr]">
          <h1 className="text-[44px] font-semibold leading-[0.98] tracking-[-0.045em] text-tx sm:text-[76px]">Copy a section.<br />Ship a page.</h1>
          <div className="min-w-0 lg:pb-2">
            <p className="max-w-md text-[17px] leading-7 text-mute">{components.length} animated React components and {blocks} page sections. Each one is a single file you own: add it with the shadcn CLI or paste it in.</p>
            <div className="mt-6 flex max-w-md items-center gap-2 rounded-full bg-panel py-1.5 pl-4 pr-1.5">
              <code className="min-w-0 flex-1 truncate font-mono text-[12px] text-tx/85">{starter}</code>
              <CopyButton text={starter} />
            </div>
            <div className="mt-4 flex gap-2">
              <Link to="/components" className="flex h-11 items-center rounded-full bg-tx px-5 text-[15px] font-medium text-bg transition-transform active:scale-95">Browse components</Link>
              <a href="#page-kit" className="flex h-11 items-center rounded-full border border-line2 px-5 text-[15px] text-tx hover:bg-panel">Build a page</a>
            </div>
          </div>
        </motion.div>
      </section>

      <section aria-label="Live components" className="grid grid-cols-1 gap-px overflow-hidden rounded-[28px] border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
        {MOSAIC.map((slug) => bySlug[slug] && (
          <div key={slug} className="flex flex-col bg-bg">
            <div className="relative h-72"><LazyDemo item={bySlug[slug]} page="home" /></div>
            <Link to={`/components/${slug}`} className="flex items-center justify-between gap-3 px-5 pb-4 text-[13px] transition-colors">
              <span className="text-tx">{bySlug[slug].name}</span>
              <span className="flex items-center gap-1 truncate text-faint hover:text-mute">{bySlug[slug].useCase}{chevron}</span>
            </Link>
          </div>
        ))}
      </section>

      <section id="page-kit" className="scroll-mt-20 pt-24 sm:pt-32">
        <Heading title="Assemble a page" sub="Switch sections on and off. The preview stacks the real blocks, and you get one install command and the page file that wires them together." />
        <PageKit />
      </section>

      <section className="pt-24 sm:pt-32">
        <Heading title="Everything, by job" sub="Grouped by what you are building, not by how it animates." to="/components" link="All components" />
        <div className="grid gap-4 lg:grid-cols-2">
          {[families.slice(0, half), families.slice(half)].map((col, c) => (
            <ul key={c} className="overflow-hidden rounded-[22px] bg-panel">
              {col.map((f, i) => (
                <li key={f.id} className={i ? 'border-t border-line' : ''}>
                  <Link to={f.id === 'blocks' ? '/blocks' : `/components?family=${f.id}`} className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-panel2">
                    <div className="min-w-0 flex-1">
                      <div className="text-[17px] text-tx">{f.name}</div>
                      <div className="truncate text-[13px] text-mute">{f.blurb}</div>
                    </div>
                    <span className="text-[15px] tabular-nums text-faint">{f.count}</span>{chevron}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      <section className="pt-24 sm:pt-32">
        <Heading title="Backgrounds" sub="Plain CSS, named for the product they suit." to="/backgrounds" link="All backgrounds" />
        <style>{[...new Set(GRADIENTS.filter((g) => g.anim).map((g) => g.anim.css))].join('\n')}</style>
        <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:-mx-8 sm:scroll-px-8 sm:px-8">
          {GRADIENTS.slice(0, 8).map((g) => (
            <Link key={g.id} to={`/backgrounds?bg=${g.id}`} className="group w-64 shrink-0 snap-start">
              <div className="h-44 rounded-[22px] ring-1 ring-inset ring-line transition-transform duration-300 group-hover:scale-[0.98]" style={styleOf(g)} />
              <div className="mt-3 text-[15px] text-tx">{g.name}</div>
              <div className="text-[13px] text-mute">{g.use}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="pb-28 pt-24 sm:pb-36 sm:pt-32">
        <Heading title="Readable by agents" sub="Coding agents can find, read and install every component without scraping the site." />
        <ul className="overflow-hidden rounded-[22px] bg-panel">
          {[
            ['llms.txt', 'A plain-text map of the library, with every component, use case and install URL.', `${SITE.url}/llms.txt`],
            ['Registry index', 'The shadcn registry with full source for every item, schema-valid.', `${SITE.url}/r/index.json`],
            ['Namespace', 'Add once to components.json, then install by name.', '"registries": { "@kavynui": "' + SITE.url + '/r/{name}.json" }'],
          ].map(([t, d, v], i) => (
            <li key={t} className={`flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center ${i ? 'border-t border-line' : ''}`}>
              <div className="md:w-72"><div className="text-[17px] text-tx">{t}</div><div className="text-[13px] leading-5 text-mute">{d}</div></div>
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[14px] bg-bg py-1.5 pl-3 pr-1.5">
                <code className="min-w-0 flex-1 truncate font-mono text-[12px] text-tx/85">{v}</code>
                <CopyButton text={v} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
