import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export function useOnline() {
  const [on, setOn] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine !== false))
  useEffect(() => {
    const up = () => setOn(true), down = () => setOn(false)
    window.addEventListener('online', up); window.addEventListener('offline', down)
    return () => { window.removeEventListener('online', up); window.removeEventListener('offline', down) }
  }, [])
  return on
}

// Small pill at the bottom: shows when the connection drops, confirms when it is back.
export default function NetworkStatus() {
  const online = useOnline()
  const [back, setBack] = useState(false)
  const [was, setWas] = useState(online)
  useEffect(() => {
    if (!was && online) { setBack(true); const t = setTimeout(() => setBack(false), 2200); setWas(online); return () => clearTimeout(t) }
    setWas(online)
  }, [online]) // eslint-disable-line react-hooks/exhaustive-deps
  const show = !online || back
  return (
    <AnimatePresence>
      {show && (
        <motion.div role="status" aria-live="polite" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          className="fixed bottom-4 left-1/2 z-[60] -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-full border border-line2 bg-panel2/95 px-3.5 py-2 text-xs text-tx shadow-2xl backdrop-blur">
            <span className={`size-1.5 rounded-full ${online ? 'bg-emerald-400' : 'animate-pulse bg-amber-400'}`} />
            {online ? 'Back online' : 'Offline - showing what is already loaded'}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
