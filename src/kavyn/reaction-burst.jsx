import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const EMO = ['🔥', '👏', '😂', '❤️']

export default function ReactionBurst({ emojis = EMO }) {
  const [parts, setParts] = useState([])
  const [counts, setCounts] = useState(() => emojis.map(() => Math.floor(Math.random() * 40) + 5))
  const fire = (i) => {
    setCounts((c) => c.map((v, k) => (k === i ? v + 1 : v)))
    const burst = Array.from({ length: 5 }, (_, k) => ({ id: Math.random(), e: emojis[i], x: i * 64 + 20 + (Math.random() - 0.5) * 30, dx: (Math.random() - 0.5) * 60, r: (Math.random() - 0.5) * 50, d: k * 0.05 }))
    setParts((p) => [...p, ...burst])
    setTimeout(() => setParts((p) => p.filter((x) => !burst.includes(x))), 1600)
  }
  return (
    <div className="relative h-56 w-72">
      <AnimatePresence>
        {parts.map((p) => (
          <motion.span key={p.id} className="pointer-events-none absolute bottom-12 text-2xl" style={{ left: p.x }}
            initial={{ y: 0, opacity: 0, scale: 0.4 }} animate={{ y: -150, x: p.dx, opacity: [0, 1, 1, 0], scale: 1.1, rotate: p.r }} exit={{ opacity: 0 }}
            transition={{ duration: 1.4, delay: p.d, ease: 'easeOut' }}>{p.e}</motion.span>
        ))}
      </AnimatePresence>
      <div className="absolute bottom-0 flex gap-2">
        {emojis.map((e, i) => (
          <motion.button key={e} whileTap={{ scale: 1.35 }} transition={{ type: 'spring', stiffness: 600, damping: 12 }} onClick={() => fire(i)} className="flex h-10 w-14 items-center justify-center gap-1 rounded-full border border-line2 bg-panel text-base">
            {e}<span className="font-mono text-[11px] text-mute tabular-nums">{counts[i]}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
