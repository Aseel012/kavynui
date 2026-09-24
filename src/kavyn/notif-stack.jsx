import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const FEED = [
  { t: 'Deploy succeeded', s: 'main · 41s', c: 'bg-emerald-400' },
  { t: 'New sign-up', s: 'priya@studio.dev', c: 'bg-sky-400' },
  { t: 'Payment received', s: '₹2,400 · Pro plan', c: 'bg-acc' },
  { t: 'Spike detected', s: '/api/search · 3.2k rpm', c: 'bg-amber-400' },
  { t: 'Comment on PR #212', s: 'Looks good, ship it', c: 'bg-violet-400' },
]

// Notifications stack like cards. Collapsed it shows a pile; click to fan them out.
export default function NotifStack({ items = FEED, interval = 2600 }) {
  const [list, setList] = useState(() => items.slice(0, 3).map((x, i) => ({ ...x, id: i })))
  const [open, setOpen] = useState(false)
  useEffect(() => {
    let n = 3
    const id = setInterval(() => {
      if (document.hidden || !items.length) return
      const x = items[n % items.length]; n++
      setList((l) => [{ ...x, id: n }, ...l].slice(0, 4))
    }, interval)
    return () => clearInterval(id)
  }, [items, interval])
  return (
    <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="relative block h-[260px] w-[320px] max-w-full text-left">
      <AnimatePresence initial={false}>
        {list.map((n, i) => (
          <motion.div key={n.id} layout
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: i > 2 ? 0 : 1 - (open ? 0 : i * 0.2), y: open ? i * 64 : i * 10, scale: open ? 1 : 1 - i * 0.05, zIndex: 10 - i }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="absolute inset-x-0 top-0 flex items-center gap-3 rounded-2xl border border-line2 bg-panel2 px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,.45)]">
            <span className={`size-2 shrink-0 rounded-full ${n.c}`} />
            <div className="min-w-0 flex-1"><div className="truncate text-sm text-tx">{n.t}</div><div className="truncate text-xs text-mute">{n.s}</div></div>
            <span className="text-[10px] text-faint">now</span>
          </motion.div>
        ))}
      </AnimatePresence>
      <span className="absolute bottom-0 left-0 text-[11px] text-faint">{open ? 'Tap to stack' : 'Tap to expand'}</span>
    </button>
  )
}
