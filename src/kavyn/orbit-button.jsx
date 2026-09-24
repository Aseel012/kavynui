import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export default function OrbitButton({ label = 'Generate', busyLabel = 'Generating', ms = 2600 }) {
  const [busy, setBusy] = useState(false)
  return (
    <motion.button
      layout
      onClick={() => { if (!busy) { setBusy(true); setTimeout(() => setBusy(false), ms) } }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="relative h-12 rounded-xl bg-panel px-6 text-sm text-tx"
    >
      <svg className="pointer-events-none absolute inset-0 size-full overflow-visible">
        <rect x="0" y="0" width="100%" height="100%" rx="11.5" fill="none" stroke="#2a2a30" />
        {busy && (
          <motion.rect
            x="0" y="0" width="100%" height="100%" rx="11.5" fill="none"
            stroke="#ff6a2b" strokeWidth="1.5" strokeLinecap="round" pathLength="100" strokeDasharray="14 86"
            initial={{ strokeDashoffset: 0 }} animate={{ strokeDashoffset: -100 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            style={{ filter: 'drop-shadow(0 0 4px #ff6a2b)' }}
          />
        )}
      </svg>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={busy ? 'b' : 'i'}
          initial={{ y: 12, opacity: 0, filter: 'blur(4px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -12, opacity: 0, filter: 'blur(4px)' }}
          className="relative flex items-center gap-2"
        >
          <span className={busy ? 'text-acc' : 'text-mute'}>✦</span>{busy ? busyLabel : label}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}
