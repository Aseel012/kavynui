import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const NOTES = {
  1: { src: 'State of Remote Work, 2025', body: 'Survey of 3,100 teams across 22 countries.' },
  2: { src: 'Internal benchmark', body: 'Median of 40 runs on a mid-range Android phone.' },
}

export default function FootnotePop({ notes = NOTES }) {
  const [open, setOpen] = useState(null)
  const Ref = ({ n }) => (
    <motion.button whileHover={{ y: -1 }} onClick={() => setOpen(open === n ? null : n)} className={`mx-0.5 -translate-y-1.5 rounded px-1 font-mono text-[10px] ${open === n ? 'bg-acc text-bg' : 'bg-line2 text-mute'}`}>{n}</motion.button>
  )
  return (
    <div className="max-w-md text-[15px] leading-relaxed text-mute">
      Async teams ship 23% more often<Ref n={1} /> and the new renderer paints the first screen in 180 ms<Ref n={2} />.
      <AnimatePresence mode="wait">
        {open && (
          <motion.aside key={open} initial={{ opacity: 0, height: 0, y: -6 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 30 }} className="overflow-hidden">
            <div className="mt-3 rounded-xl border border-line2 bg-panel p-3 text-sm">
              <div className="font-mono text-[11px] text-acc">[{open}] {notes[open].src}</div>
              <div className="mt-1 text-tx">{notes[open].body}</div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}
