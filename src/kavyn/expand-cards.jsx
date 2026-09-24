import { useState } from 'react'
import { motion } from 'motion/react'

const PANELS = [
  { t: 'Observe', s: 'Every request, logged at the edge.', g: 'linear-gradient(160deg,#ff6a2b,#7a1f00)' },
  { t: 'Protect', s: 'Rules that update themselves.', g: 'linear-gradient(160deg,#3b82f6,#0b1e4a)' },
  { t: 'Cache', s: 'Static and dynamic, close to users.', g: 'linear-gradient(160deg,#10b981,#053d2c)' },
  { t: 'Route', s: 'Smart paths around congestion.', g: 'linear-gradient(160deg,#a855f7,#2e0a52)' },
]

// Panels share a row; the active one expands on hover or tap, the rest compress.
export default function ExpandCards({ panels = PANELS }) {
  const [on, setOn] = useState(0)
  return (
    <div className="flex h-64 w-[460px] max-w-full gap-2">
      {panels.map((p, i) => (
        <motion.button key={p.t} type="button" onMouseEnter={() => setOn(i)} onFocus={() => setOn(i)} onClick={() => setOn(i)}
          animate={{ flexGrow: on === i ? 5 : 1 }} transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          className="relative min-w-0 basis-0 overflow-hidden rounded-2xl border border-line text-left" style={{ background: p.g }}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.18),transparent_60%)]" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <motion.div animate={{ rotate: on === i ? 0 : -90, x: on === i ? 0 : -6, y: on === i ? 0 : -30 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="origin-bottom-left whitespace-nowrap text-sm font-medium text-white">{p.t}</motion.div>
            <motion.p animate={{ opacity: on === i ? 1 : 0, y: on === i ? 0 : 8 }} className="mt-1 text-xs leading-5 text-white/75">{p.s}</motion.p>
          </div>
        </motion.button>
      ))}
    </div>
  )
}
