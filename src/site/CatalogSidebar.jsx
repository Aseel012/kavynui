import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { families, components, search } from '@/lib/catalog'

const TOP = [
  { to: '/components', label: 'All components', end: true, icon: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z' },
  { to: '/blocks', label: 'Blocks', icon: 'M3 5h18v6H3zM3 13h8v6H3zM13 13h8v6h-8z' },
  { to: '/backgrounds', label: 'Gradient backgrounds', icon: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 0v18M3 12h18' },
]

function Item({ to, children, end, onNav }) {
  return (
    <NavLink to={to} end={end} onClick={onNav} className="group relative block rounded-md px-2.5 py-1.5 text-[13px]">
      {({ isActive }) => (<>
        {isActive && <motion.span layoutId="side-on" className="absolute inset-0 rounded-md bg-line" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
        <span className={`relative flex items-center gap-2 ${isActive ? 'text-tx' : 'text-mute group-hover:text-tx'}`}>{children}</span>
      </>)}
    </NavLink>
  )
}

// Docs-style catalog navigation: search on top, then every category with its items.
export default function CatalogSidebar({ onNav, autoFocus = false }) {
  const [q, setQ] = useState('')
  const input = useRef(null)
  const nav = useNavigate()
  const loc = useLocation()
  const activeFam = useMemo(() => components.find((c) => loc.pathname === `/components/${c.slug}`)?.family, [loc.pathname])
  const [closed, setClosed] = useState({})
  useEffect(() => { if (autoFocus) setTimeout(() => input.current?.focus(), 60) }, [autoFocus])
  const hits = useMemo(() => (q.trim() ? search(q) : null), [q])
  const groups = families.map((f) => ({ ...f, items: (hits || components).filter((c) => c.family === f.id) })).filter((g) => g.items.length)

  const onKey = (e) => {
    if (e.key === 'Enter' && hits?.[0]) { nav(`/components/${hits[0].slug}`); setQ(''); onNav?.() }
    if (e.key === 'Escape') setQ('')
  }

  return (
    <div className="flex h-full flex-col">
      <div className="px-3 pb-3 pt-4">
        <label className="flex h-9 items-center gap-2 rounded-lg border border-line2 bg-panel px-2.5 focus-within:border-[#3a3a42]">
          <svg viewBox="0 0 24 24" className="size-3.5 shrink-0 text-faint" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value.slice(0, 80))} onKeyDown={onKey} placeholder="Filter" aria-label="Filter components"
            className="min-w-0 flex-1 bg-transparent text-[13px] text-tx outline-none placeholder:text-faint" />
          {q && <button type="button" onClick={() => setQ('')} className="text-[11px] text-faint hover:text-tx">Clear</button>}
        </label>
      </div>
      <nav className="no-scrollbar flex-1 overflow-y-auto px-3 pb-10" aria-label="Catalog">
        {!hits && (
          <div className="mb-5 space-y-0.5">
            {TOP.map((t) => (
              <Item key={t.to} to={t.to} end={t.end} onNav={onNav}>
                <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.7"><path d={t.icon} /></svg>{t.label}
              </Item>
            ))}
          </div>
        )}
        {hits && hits.length === 0 && <p className="px-2.5 py-6 text-[13px] text-faint">Nothing matches “{q}”.</p>}
        {groups.map((g) => {
          const shut = !hits && closed[g.id] && activeFam !== g.id
          return (
            <div key={g.id} className="mb-4">
              <button type="button" onClick={() => setClosed((c) => ({ ...c, [g.id]: !c[g.id] }))} aria-expanded={!shut}
                className="flex w-full items-center justify-between px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-faint hover:text-mute">
                {g.name}
                <motion.svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="2" animate={{ rotate: shut ? -90 : 0 }}><path d="m6 9 6 6 6-6" /></motion.svg>
              </button>
              <AnimatePresence initial={false}>
                {!shut && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 40 }} className="overflow-hidden">
                    <div className="mt-0.5 space-y-px">
                      {g.items.map((c) => (
                        <Item key={c.slug} to={`/components/${c.slug}`} onNav={() => { setQ(''); onNav?.() }}>
                          <span className="truncate">{c.name}</span>
                          {c.tags?.includes('new') && <span className="ml-auto size-1.5 shrink-0 rounded-full bg-acc" title="New" />}
                        </Item>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </nav>
    </div>
  )
}
