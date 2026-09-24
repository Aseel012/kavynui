import { useRef, useState } from 'react'
import { motion } from 'motion/react'

const NOTES = [
  { t: 'Warm neutrals', c: 'bg-[#e8dccb] text-[#2b2118]', r: -6 },
  { t: 'Serif headings', c: 'bg-[#1d2a44] text-[#dfe6f5]', r: 4 },
  { t: 'Grain on photos', c: 'bg-[#2f2f35] text-[#ededef]', r: -2 },
  { t: 'Orange accent', c: 'bg-[#ff6a2b] text-[#140803]', r: 7 },
  { t: 'Round 12px', c: 'bg-[#dff5e6] text-[#0f2a18]', r: -9 },
]

// A moodboard you can throw around. Cards keep their momentum and bounce off the edges.
export default function TossDeck({ notes = NOTES, className = '' }) {
  const box = useRef(null)
  const list = Array.isArray(notes) && notes.length ? notes : NOTES
  const [order, setOrder] = useState(() => list.map((_, i) => i))
  const lift = (i) => setOrder((o) => [...o.filter((x) => x !== i), i])
  return (
    <div ref={box} className={`relative h-full min-h-80 w-full touch-none overflow-hidden bg-bg ${className}`}>
      <div className="pointer-events-none absolute left-4 top-3 text-[11px] uppercase tracking-widest text-faint">Moodboard</div>
      {list.map((n, i) => (
        <motion.div key={n.t} drag dragConstraints={box} dragElastic={0.15} dragTransition={{ bounceStiffness: 400, bounceDamping: 18, power: 0.35 }}
          onPointerDown={() => lift(i)} whileDrag={{ scale: 1.06, rotate: 0, cursor: 'grabbing' }}
          initial={{ opacity: 0, y: 30, rotate: 0 }} animate={{ opacity: 1, y: 0, rotate: n.r || 0 }} transition={{ delay: i * 0.06, type: 'spring', stiffness: 260, damping: 20 }}
          style={{ zIndex: order.indexOf(i) + 1, left: `${12 + ((i * 19) % 55)}%`, top: `${18 + ((i * 23) % 45)}%` }}
          tabIndex={0} aria-label={n.t}
          className={`absolute w-36 cursor-grab rounded-xl p-3 shadow-[0_12px_30px_-8px_rgba(0,0,0,.6)] outline-none focus-visible:ring-2 focus-visible:ring-acc ${n.c || 'bg-panel2 text-tx'}`}>
          <div className="mb-6 h-1 w-6 rounded-full bg-current opacity-40" />
          <div className="text-sm font-medium">{n.t}</div>
        </motion.div>
      ))}
    </div>
  )
}
