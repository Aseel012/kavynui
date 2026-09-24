import { useSEO } from '@/lib/seo'
import { useEffect, useState } from 'react'
import { Link, NavLink, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { DOCS, FLAT } from '@/docs/pages'
import ErrorBoundary from '@/site/ErrorBoundary'
import NotFound from './NotFound'

function Nav({ onNav }) {
  return (
    <nav aria-label="Docs" className="space-y-6">
      {DOCS.map((g) => (
        <div key={g.group}>
          <div className="px-2.5 text-[11px] font-medium uppercase tracking-[0.08em] text-faint">{g.group}</div>
          <ul className="mt-1.5 space-y-px">
            {g.pages.map((p) => (
              <li key={p.id}>
                <NavLink to={p.id === 'introduction' ? '/docs' : `/docs/${p.id}`} end onClick={onNav} className="group relative block rounded-md px-2.5 py-1.5 text-[13px]">
                  {({ isActive }) => (<>
                    {isActive && <motion.span layoutId="doc-on" className="absolute inset-0 rounded-md bg-line" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
                    <span className={`relative ${isActive ? 'text-tx' : 'text-mute group-hover:text-tx'}`}>{p.title}</span>
                  </>)}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function Toc({ items }) {
  const [on, setOn] = useState(items[0]?.[0])
  useEffect(() => {
    setOn(items[0]?.[0])
    if (typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setOn(e.target.id)), { rootMargin: '-20% 0px -70% 0px' })
    items.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [items])
  if (!items.length) return null
  return (
    <div>
      <div className="text-xs text-faint">On this page</div>
      <ul className="mt-3 space-y-2 border-l border-line">
        {items.map(([id, t]) => (
          <li key={id}>
            <button type="button" onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
              className={`-ml-px border-l pl-3 text-left text-[13px] transition-colors ${on === id ? 'border-acc text-tx' : 'border-transparent text-mute hover:text-tx'}`}>{t}</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Docs() {
  const { page = 'introduction' } = useParams()
  const i = FLAT.findIndex((p) => p.id === page)
  const doc = FLAT[i]
  const [menu, setMenu] = useState(false)
  useEffect(() => { setMenu(false) }, [doc])
  useSEO({ title: `${doc ? doc.title : 'Docs'} - kavynUI docs`, description: doc ? doc.lead : 'Install, theme and use kavynUI components in minutes.', path: doc ? (doc.id === 'introduction' ? '/docs' : `/docs/${doc.id}`) : '/docs' })
  if (!doc) return <NotFound />
  const prev = FLAT[i - 1], next = FLAT[i + 1]
  const Body = doc.body
  const href = (p) => (p.id === 'introduction' ? '/docs' : `/docs/${p.id}`)

  return (
    <div className="mx-auto flex max-w-[1400px]">
      <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-60 shrink-0 overflow-y-auto border-r border-line px-3 py-6 lg:block"><Nav /></aside>

      <div className="min-w-0 flex-1">
        <div className="sticky top-14 z-20 flex h-11 items-center gap-3 border-b border-line bg-bg/85 px-4 backdrop-blur-md lg:hidden">
          <button type="button" onClick={() => setMenu(!menu)} aria-expanded={menu} className="flex h-7 items-center gap-2 rounded-md border border-line2 bg-panel px-2.5 text-xs text-tx">
            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h10M4 18h16" /></svg>Docs
          </button>
          <span className="truncate text-xs text-mute">{doc.group} / {doc.title}</span>
        </div>
        <AnimatePresence>
          {menu && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-b border-line bg-bg px-3 lg:hidden">
              <div className="py-4"><Nav onNav={() => setMenu(false)} /></div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex">
          <motion.article key={doc.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="min-w-0 flex-1 px-4 pb-24 pt-8 sm:px-10 sm:pt-12">
            <div className="mx-auto max-w-3xl">
              <div className="text-xs text-faint">{doc.group}</div>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-tx">{doc.title}</h1>
              <p className="mt-2 text-lg text-mute">{doc.lead}</p>
              <ErrorBoundary resetKey={doc.id}><Body /></ErrorBoundary>
              <div className="mt-16 grid grid-cols-2 gap-3 border-t border-line pt-6">
                {prev ? <Link to={href(prev)} className="rounded-xl border border-line p-4 hover:border-line2"><div className="text-xs text-faint">← Previous</div><div className="mt-1 truncate text-sm text-tx">{prev.title}</div></Link> : <span />}
                {next ? <Link to={href(next)} className="rounded-xl border border-line p-4 text-right hover:border-line2"><div className="text-xs text-faint">Next →</div><div className="mt-1 truncate text-sm text-tx">{next.title}</div></Link> : <span />}
              </div>
            </div>
          </motion.article>
          <aside className="sticky top-14 hidden h-fit w-56 shrink-0 py-12 pr-6 xl:block"><Toc items={doc.toc} /></aside>
        </div>
      </div>
    </div>
  )
}
