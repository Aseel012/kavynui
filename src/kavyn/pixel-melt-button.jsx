import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export default function PixelMeltButton({ label = 'Submit form', done = 'Received' }) {
  const [phase, setPhase] = useState('idle')
  const px = useMemo(() => Array.from({ length: 64 }, (_, i) => ({
    x: (i % 16) * 7 + 12, y: Math.floor(i / 16) * 5 + 14, d: Math.random() * 0.35, fall: 24 + Math.random() * 30,
  })), [])

  const go = () => {
    if (phase !== 'idle') return
    setPhase('melt')
    setTimeout(() => setPhase('done'), 700)
    setTimeout(() => setPhase('idle'), 2400)
  }

  return (
    <button onClick={go} className="relative h-12 w-[136px] overflow-visible rounded-xl bg-tx text-sm font-medium text-bg">
      <AnimatePresence>
        {phase === 'idle' && <motion.span key="l" exit={{ opacity: 0 }} transition={{ duration: 0.1 }} className="absolute inset-0 grid place-items-center">{label}</motion.span>}
        {phase === 'done' && (
          <motion.span key="d" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }} className="absolute inset-0 grid place-items-center">
            ✓ {done}
          </motion.span>
        )}
      </AnimatePresence>
      {phase === 'melt' && px.map((p, i) => (
        <motion.span
          key={i}
          className="absolute size-[5px] rounded-[1px] bg-bg"
          style={{ left: p.x, top: p.y }}
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: p.fall, opacity: 0, scale: 0.4 }}
          transition={{ delay: p.d, duration: 0.5, ease: [0.5, 0, 0.9, 0.4] }}
        />
      ))}
    </button>
  )
}
