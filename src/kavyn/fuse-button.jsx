import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export default function FuseButton({ seconds = 5, label = 'Undo send' }) {
  const [run, setRun] = useState(0)
  const [left, setLeft] = useState(seconds)
  const [state, setState] = useState('armed')

  useEffect(() => {
    setLeft(seconds); setState('armed')
    const t = setInterval(() => setLeft((v) => {
      if (v <= 1) { clearInterval(t); setState('sent'); return 0 }
      return v - 1
    }), 1000)
    return () => clearInterval(t)
  }, [run, seconds])

  const undo = () => { if (state === 'armed') setState('undone') }
  useEffect(() => { if (state !== 'armed') { const t = setTimeout(() => setRun((r) => r + 1), 1800); return () => clearTimeout(t) } }, [state])

  return (
    <button onClick={undo} className="relative h-12 min-w-44 rounded-xl bg-panel px-5 text-sm text-tx">
      <svg className="pointer-events-none absolute inset-0 size-full overflow-visible">
        <rect x="0" y="0" width="100%" height="100%" rx="11.5" fill="none" stroke="#1e1e22" />
        {state === 'armed' && (
          <motion.rect
            key={run} x="0" y="0" width="100%" height="100%" rx="11.5" fill="none"
            stroke="#ff6a2b" strokeWidth="1.5" initial={{ pathLength: 1 }} animate={{ pathLength: 0 }}
            transition={{ duration: seconds, ease: 'linear' }} style={{ filter: 'drop-shadow(0 0 3px #ff8a4b)' }}
          />
        )}
      </svg>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={state} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="relative flex items-center justify-center gap-2">
          {state === 'armed' && <>{label}<span className="font-mono text-xs text-acc tabular-nums">{left}s</span></>}
          {state === 'undone' && <span className="text-mute">Send cancelled</span>}
          {state === 'sent' && <span className="text-mute">Message sent</span>}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
