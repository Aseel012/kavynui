import { useState } from 'react'
import { motion } from 'motion/react'

const DAYS = [
  { d: 'Day 1', t: 'Land in Lisbon, tram 28, Alfama dinner' },
  { d: 'Day 2', t: 'Sintra palaces, back by sunset' },
  { d: 'Day 3', t: 'LX Factory, river walk, fly out' },
]

export default function PaperFoldReveal({ panels = DAYS }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex w-72 flex-col items-stretch [perspective:900px]">
      <button onClick={() => setOpen(!open)} className="z-10 flex items-center justify-between rounded-t-xl border border-line2 bg-panel2 px-4 py-3 text-sm text-tx">
        Lisbon, 3 days <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-mute">⌄</motion.span>
      </button>
      {panels.map((p, i) => (
        <motion.div
          key={i}
          initial={false}
          animate={{ rotateX: open ? 0 : -92, opacity: open ? 1 : 0, height: open ? 64 : 0 }}
          transition={{ type: 'spring', stiffness: 170, damping: 20, delay: open ? i * 0.14 : (panels.length - i) * 0.06 }}
          style={{ transformOrigin: 'top', background: i % 2 ? '#111114' : '#141417' }}
          className="overflow-hidden border-x border-b border-line2 px-4 last:rounded-b-xl"
        >
          <div className="flex h-16 items-center gap-3">
            <span className="font-mono text-[11px] text-acc">{p.d}</span>
            <span className="text-sm text-mute">{p.t}</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
