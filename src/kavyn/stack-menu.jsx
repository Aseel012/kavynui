import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const ITEMS = ['Home', 'Menu', 'Reservations', 'Gift cards', 'Contact']

export default function StackMenu({ items = ITEMS, autoOpen = true }) {
  const [open, setOpen] = useState(false)
  useEffect(() => { if (!autoOpen) return; const t = setTimeout(() => setOpen(true), 500); return () => clearTimeout(t) }, [autoOpen])
  return (
    <div className="relative flex h-80 w-60 flex-col items-end">
      <button onClick={() => setOpen(!open)} className="relative z-20 grid size-11 place-items-center rounded-xl border border-line2 bg-panel2" aria-label="Menu">
        <motion.span className="absolute h-0.5 w-5 rounded bg-tx" animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }} />
        <motion.span className="absolute h-0.5 w-5 rounded bg-tx" animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul className="mt-2 w-full space-y-1.5" initial="c" animate="o" exit="c" variants={{ o: { transition: { staggerChildren: 0.05 } }, c: { transition: { staggerChildren: 0.03, staggerDirection: -1 } } }}>
            {items.map((it, i) => (
              <motion.li key={it} style={{ originX: 1, originY: 0 }}
                variants={{ c: { opacity: 0, y: -24 - i * 6, rotate: -8, scale: 0.9 }, o: { opacity: 1, y: 0, rotate: 0, scale: 1 } }}
                transition={{ type: 'spring', stiffness: 380, damping: 24 }}
                className="rounded-xl border border-line2 bg-panel px-4 py-3 text-sm text-tx shadow-[0_8px_20px_rgba(0,0,0,.35)]">
                {it}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
