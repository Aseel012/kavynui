import { useRef, useState } from 'react'
import { motion, useMotionValue, animate, AnimatePresence } from 'motion/react'

export default function HoldToConfirm({ label = 'Hold to delete', duration = 1.4, onConfirm }) {
  const p = useMotionValue(0)
  const ctl = useRef(null)
  const [done, setDone] = useState(false)

  const start = () => {
    if (done) return
    ctl.current = animate(p, 1, {
      duration: duration * (1 - p.get()), ease: 'linear',
      onComplete: () => { setDone(true); onConfirm?.(); setTimeout(() => { setDone(false); p.set(0) }, 1800) },
    })
  }
  const stop = () => {
    if (done) return
    ctl.current?.stop()
    animate(p, 0, { type: 'spring', stiffness: 300, damping: 26 })
  }

  return (
    <motion.button
      onPointerDown={start} onPointerUp={stop} onPointerLeave={stop}
      whileTap={{ scale: 0.97 }}
      className="relative flex h-12 select-none items-center gap-3 overflow-hidden rounded-xl border border-line2 bg-panel pl-3 pr-5 text-sm text-tx"
    >
      <motion.span style={{ scaleX: p }} className="absolute inset-0 origin-left bg-red-500/10" />
      <span className="relative grid size-7 place-items-center">
        <svg viewBox="0 0 28 28" className="absolute inset-0 -rotate-90">
          <circle cx="14" cy="14" r="12" fill="none" stroke="#2a2a30" strokeWidth="2" />
          <motion.circle cx="14" cy="14" r="12" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" style={{ pathLength: p }} />
        </svg>
        <AnimatePresence mode="wait">
          {done ? (
            <motion.svg key="c" viewBox="0 0 24 24" className="size-4 text-red-400" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }}>
              <motion.path d="M5 12l5 5 9-10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            </motion.svg>
          ) : (
            <motion.span key="d" exit={{ scale: 0 }} className="size-1.5 rounded-full bg-red-400" />
          )}
        </AnimatePresence>
      </span>
      <span className="relative">{done ? 'Account deleted' : label}</span>
    </motion.button>
  )
}
