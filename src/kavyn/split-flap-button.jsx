import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const STATES = ['SELECT SEAT', 'HOLDING 14C', 'BOOKED  14C']

export default function SplitFlapButton({ states = STATES }) {
  const [i, setI] = useState(0)
  const width = Math.max(...states.map((s) => s.length))
  const label = states[i].padEnd(width, ' ')

  return (
    <button
      onClick={() => setI((i + 1) % states.length)}
      className="flex gap-[3px] rounded-xl border border-line2 bg-panel p-2"
      aria-label={states[i]}
    >
      {label.split('').map((ch, k) => (
        <span key={k} className="relative h-9 w-6 overflow-hidden rounded-[4px] bg-bg font-mono text-sm text-tx [perspective:200px]">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={ch + i}
              initial={{ rotateX: -90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              exit={{ rotateX: 90, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 22, delay: k * 0.035 }}
              className="absolute inset-0 grid origin-center place-items-center"
            >
              {ch === ' ' ? '\u00a0' : ch}
            </motion.span>
          </AnimatePresence>
          <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-black/60" />
        </span>
      ))}
    </button>
  )
}
