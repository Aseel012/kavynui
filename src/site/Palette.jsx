import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { search, familyById } from '@/lib/catalog'

const PAGES = [{ name: 'Home', to: '/' }, { name: 'All components', to: '/components' }, { name: 'Blocks', to: '/blocks' }, { name: 'Backgrounds', to: '/backgrounds' }, { name: 'Docs', to: '/docs' }, { name: 'Blog', to: '/blog' }]

export default function Palette({ open, onClose }) {
  const [q, setQ] = useState('')
  const [i, setI] = useState(0)
  const nav = useNavigate()
  const input = useRef(null)
  const results = useMemo(() => search(q).slice(0, 8), [q])
  const pages = q ? PAGES.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())) : PAGES
  const all = [...results.map((c) => ({ key: c.slug, name: c.name, sub: familyById[c.family].name, to: `/components/${c.slug}` })), ...pages.map((p) => ({ key: p.to, name: p.name, sub: 'Page', to: p.to }))]

  useEffect(() => { if (open) { setQ(''); setI(0); setTimeout(() => input.current?.focus(), 30) } }, [open])
  useEffect(() => setI(0), [q])

  const go = (r) => { if (!r) return; nav(r.to); onClose() }
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setI((i + 1) % Math.max(all.length, 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setI((i - 1 + all.length) % Math.max(all.length, 1)) }
    if (e.key === 'Enter') go(all[i])
    if (e.key === 'Escape') onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-3 pt-[12vh] backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
          <motion.div role="dialog" aria-label="Search" onMouseDown={(e) => e.stopPropagation()}
            initial={{ y: -12, scale: 0.97, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: -8, scale: 0.98, opacity: 0 }} transition={{ type: 'spring', stiffness: 460, damping: 34 }}
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-line2 bg-panel shadow-[0_30px_80px_rgba(0,0,0,.6)]">
            <div className="flex items-center gap-3 border-b border-line px-4">
              <svg viewBox="0 0 24 24" className="size-4 text-faint" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
              <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} placeholder="Search components" className="h-12 flex-1 bg-transparent text-[15px] text-tx outline-none placeholder:text-faint" />
              <kbd className="rounded border border-line2 px-1.5 font-mono text-[10px] text-faint">esc</kbd>
            </div>
            <ul className="max-h-[50vh] overflow-y-auto p-2">
              {all.length === 0 && <li className="px-3 py-6 text-center text-sm text-faint">Nothing matches "{q}"</li>}
              {all.map((r, k) => (
                <li key={r.key}>
                  <button onMouseEnter={() => setI(k)} onClick={() => go(r)} className="relative flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm">
                    {i === k && <motion.span layoutId="pal-hl" className="absolute inset-0 rounded-lg bg-line" transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
                    <span className="relative text-tx">{r.name}</span><span className="relative text-xs text-faint">{r.sub}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
