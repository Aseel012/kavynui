import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const ENTRIES = [
  { v: '2.4.0', d: 'Sep 22', tag: 'Feature', t: 'Traffic map in the dashboard', b: ['Live arcs between edge locations', 'Filter by country and status code'] },
  { v: '2.3.2', d: 'Sep 15', tag: 'Fix', t: 'Faster cold starts', b: ['Median cold start down to 12 ms', 'Smaller runtime bundle'] },
  { v: '2.3.0', d: 'Sep 02', tag: 'Feature', t: 'Instant rollback', b: ['Roll back to any build in one click', 'Keeps environment variables in sync'] },
]
const TONE = { Feature: 'bg-acc/15 text-acc', Fix: 'bg-emerald-400/10 text-emerald-300' }

// Block: product changelog on a timeline. Entries expand in place.
export default function ChangelogFeed({ entries = ENTRIES }) {
  const [open, setOpen] = useState(0)
  return (
    <section className="@container w-full rounded-2xl border border-line bg-bg p-6">
      <h2 className="text-xl font-semibold tracking-tight text-tx">Changelog</h2>
      <ol className="relative mt-6 border-l border-line pl-6">
        {entries.map((e, i) => (
          <li key={e.v} className="relative pb-6 last:pb-0">
            <motion.span animate={{ scale: open === i ? 1.3 : 1, backgroundColor: open === i ? '#ff6a2b' : '#2a2a30' }} className="absolute -left-[29px] top-1.5 size-2.5 rounded-full ring-4 ring-bg" />
            <button type="button" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="w-full text-left">
              <div className="flex flex-wrap items-center gap-2 text-xs"><span className="font-mono text-tx">v{e.v}</span><span className="text-faint">{e.d}</span><span className={`rounded-full px-2 py-0.5 text-[10px] ${TONE[e.tag] || 'bg-line text-mute'}`}>{e.tag}</span></div>
              <div className="mt-1 text-[15px] text-tx">{e.t}</div>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 32 }} className="overflow-hidden">
                  {e.b.map((b) => <li key={b} className="mt-2 flex gap-2 text-sm text-mute"><span className="text-faint">-</span>{b}</li>)}
                </motion.ul>
              )}
            </AnimatePresence>
          </li>
        ))}
      </ol>
    </section>
  )
}
