import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { bySlug } from '@/lib/catalog'
import { Demo, LazyDemo } from '@/site/Preview'
import { GRADIENTS, styleOf } from '@/data/gradients'
import CodeBlock from '@/site/CodeBlock'
import { GitHubLink } from '@/site/Layout'
import { useSEO, SITE_JSONLD } from '@/lib/seo'
import { posts } from '@/data/posts'

const STAGE = [
  { slug: 'edge-dashboard', label: 'Dashboard', url: 'app.example.com/analytics' },
  { slug: 'product-hero', label: 'Landing', url: 'example.com' },
  { slug: 'sign-in-card', label: 'Sign in', url: 'example.com/login' },
  { slug: 'status-board', label: 'Status', url: 'status.example.com' },
]
const PIECES = ['liquid-button', 'text-scramble', 'dock-magnify', 'uptime-bars', 'hold-to-confirm', 'notif-stack']
const spring = { type: 'spring', stiffness: 260, damping: 28 }

function Stage() {
  const [on, setOn] = useState(0)
  const [auto, setAuto] = useState(true)
  useEffect(() => {
    if (!auto) return
    const id = setInterval(() => !document.hidden && setOn((n) => (n + 1) % STAGE.length), 9000)
    return () => clearInterval(id)
  }, [auto])
  const s = STAGE[on]
  return (
    <div className="overflow-hidden rounded-2xl border border-line2 bg-panel shadow-[0_40px_120px_-30px_rgba(255,106,43,.18)]">
      <div className="flex items-center gap-3 border-b border-line px-3 py-2.5">
        <div className="hidden gap-1.5 sm:flex"><span className="size-2.5 rounded-full bg-line2" /><span className="size-2.5 rounded-full bg-line2" /><span className="size-2.5 rounded-full bg-line2" /></div>
        <div className="no-scrollbar flex flex-1 gap-1 overflow-x-auto" role="tablist">
          {STAGE.map((t, i) => (
            <button key={t.slug} type="button" role="tab" aria-selected={on === i} onClick={() => { setOn(i); setAuto(false) }} className="relative shrink-0 rounded-md px-3 py-1 text-xs">
              {on === i && <motion.span layoutId="stage-on" className="absolute inset-0 rounded-md bg-line2" transition={{ type: 'spring', stiffness: 480, damping: 36 }} />}
              <span className={`relative ${on === i ? 'text-tx' : 'text-mute hover:text-tx'}`}>{t.label}</span>
            </button>
          ))}
        </div>
        <span className="hidden truncate rounded-md bg-bg px-3 py-1 font-mono text-[11px] text-faint md:block">{s.url}</span>
      </div>
      <div className="relative min-h-[420px] bg-bg p-2 sm:p-4">
        <AnimatePresence mode="wait">
          <motion.div key={s.slug} initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }} transition={{ duration: 0.3 }}>
            <Demo item={bySlug[s.slug]} page="home" />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-between border-t border-line px-4 py-2.5 text-xs">
        <span className="text-mute">{bySlug[s.slug]?.name} <span className="text-faint">· block</span></span>
        <Link to={`/components/${s.slug}`} className="text-tx hover:text-acc">Get the code →</Link>
      </div>
    </div>
  )
}

export default function Home() {
  useSEO({ title: 'kavynUI - animated React components and blocks', description: 'Copy-paste animated React components, blocks and backgrounds: WebGL shaders, scroll scenes, physics, 3D and particle text. Open source, MIT.', path: '/', jsonLd: SITE_JSONLD })
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_50%_0%,rgba(255,106,43,.12),transparent)]" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="mb-8 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
            <h1 className="max-w-md text-3xl font-semibold tracking-[-0.04em] text-tx sm:text-[44px] sm:leading-[1.05]">Copy the section.<br /><span className="text-mute">Ship the product.</span></h1>
            <div className="flex items-center gap-2">
              <Link to="/components" className="flex h-10 items-center rounded-full bg-tx px-5 text-sm font-medium text-bg transition-transform active:scale-95">Open library</Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.08 }}><Stage /></motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-xl font-medium tracking-tight text-tx">Pieces</h2>
          <Link to="/components" className="text-sm text-mute hover:text-tx">Library →</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PIECES.map((slug) => bySlug[slug] && (
            <div key={slug} className="overflow-hidden rounded-2xl border border-line bg-panel">
              <div className="relative h-56 bg-bg"><LazyDemo item={bySlug[slug]} page="home" /></div>
              <Link to={`/components/${slug}`} className="flex items-center justify-between border-t border-line px-4 py-3 text-sm">
                <span className="text-tx">{bySlug[slug].name}</span><span className="truncate pl-3 text-faint">{bySlug[slug].useCase}</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-panel/40">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-16 sm:px-6 md:grid-cols-[1fr_1.2fr]">
          <div>
            <div className="text-xs uppercase tracking-[0.12em] text-acc">Maps & data</div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-tx sm:text-3xl">See where your traffic lives</h2>
            <p className="mt-3 max-w-sm text-mute">Dotted world maps, a draggable globe, uptime, latency and threat feeds. Canvas-drawn, light, and fed by your own data.</p>
            <div className="mt-6 flex flex-wrap gap-2 text-sm">
              {['traffic-map', 'edge-globe', 'latency-stream', 'threat-feed', 'region-bars'].map((s) => <Link key={s} to={`/components/${s}`} className="rounded-full border border-line2 px-3 py-1 text-mute hover:text-tx">{bySlug[s]?.name}</Link>)}
            </div>
          </div>
          <div className="relative h-[340px] sm:h-[400px]"><LazyDemo item={bySlug['edge-globe']} page="home" /></div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-xl font-medium tracking-tight text-tx">Backgrounds</h2>
          <Link to="/backgrounds" className="text-sm text-mute hover:text-tx">All backgrounds →</Link>
        </div>
        <style>{[...new Set(GRADIENTS.filter((g) => g.anim).map((g) => g.anim.css))].join('\n')}</style>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {GRADIENTS.slice(0, 6).map((g) => (
            <Link key={g.id} to={`/backgrounds?bg=${g.id}`} className="group relative h-32 overflow-hidden rounded-2xl border border-line sm:h-40" style={styleOf(g)}>
              <span className="absolute bottom-3 left-3 text-sm text-white/85">{g.name}</span>
              <span className="absolute bottom-3 right-3 text-xs text-white/60 opacity-0 transition-opacity group-hover:opacity-100">Code →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid gap-8 rounded-2xl border border-line bg-panel p-6 sm:p-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-tx">No package. Just the file.</h2>
            <ol className="mt-5 space-y-3 text-sm text-mute">
              {['Install motion', 'Copy a component into src/components/kavyn', 'Import it and ship'].map((t, i) => (
                <li key={t} className="flex items-center gap-3"><span className="grid size-6 place-items-center rounded-full border border-line2 font-mono text-[11px] text-tx">{i + 1}</span>{t}</li>
              ))}
            </ol>
            <Link to="/docs/installation" className="mt-6 inline-block text-sm text-acc">Installation guide →</Link>
          </div>
          <CodeBlock title="Analytics.jsx" code={`import EdgeDashboard from '@/components/kavyn/edge-dashboard'\n\nexport default function Analytics() {\n  return <EdgeDashboard />\n}`} maxHeight={240} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-xl font-medium tracking-tight text-tx">From the blog</h2>
          <Link to="/blog" className="text-sm text-mute hover:text-tx">All posts →</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((p) => (
            <Link key={p.slug} to={`/blog/${p.slug}`} className="group rounded-2xl border border-line bg-panel p-5 hover:border-line2">
              <div className="text-xs text-faint">{new Date(`${p.date}T00:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · {p.minutes} min</div>
              <div className="mt-2 font-medium tracking-tight text-tx group-hover:text-acc">{p.title}</div>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-mute">{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-line p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-tx">Open source</h2>
            <p className="mt-1 text-sm text-mute">Free to use under the MIT license. Built in the open.</p>
          </div>
          <div className="flex items-center gap-2">
            <GitHubLink />
          </div>
        </div>
      </section>
    </>
  )
}
