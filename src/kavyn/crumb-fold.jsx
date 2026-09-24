import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const PATH = ['Drive', 'Clients', 'Acme', 'Brand', '2026', 'Exports', 'logo-final.svg']

export default function CrumbFold({ path = PATH, keep = 1 }) {
  const [open, setOpen] = useState(false)
  const head = path.slice(0, keep), mid = path.slice(keep, -2), tail = path.slice(-2)
  const Sep = () => <span className="text-faint">/</span>
  return (
    <nav className="flex max-w-full flex-wrap items-center gap-1.5 rounded-xl border border-line2 bg-panel px-3 py-2 text-sm">
      {head.map((p) => <span key={p} className="text-mute">{p}</span>)}
      <Sep />
      <AnimatePresence mode="popLayout" initial={false}>
        {open ? (
          mid.map((p, i) => (
            <motion.span key={p} layout initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 32, delay: i * 0.04 }} className="flex items-center gap-1.5 overflow-hidden whitespace-nowrap">
              <button onClick={() => setOpen(false)} className="text-mute hover:text-tx">{p}</button><Sep />
            </motion.span>
          ))
        ) : (
          <motion.button key="dots" layout initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} onClick={() => setOpen(true)} className="flex gap-0.5 rounded-md bg-line px-1.5 py-1.5" aria-label={`Show ${mid.length} folders`}>
            {mid.slice(0, 3).map((p) => <span key={p} className="size-1 rounded-full bg-mute" />)}
          </motion.button>
        )}
      </AnimatePresence>
      {!open && <Sep />}
      <motion.span layout className="text-mute">{tail[0]}</motion.span><Sep />
      <motion.span layout className="text-tx">{tail[1]}</motion.span>
    </nav>
  )
}
