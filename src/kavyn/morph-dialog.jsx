import { useEffect, useId, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

// A card morphs into a dialog with a shared layout. Esc or the backdrop closes it.
export default function MorphDialog({ title = 'Edge Functions', meta = 'v2.4 · 12 regions', body = 'Run code within 50 ms of every user. Deploys roll out in seconds and roll back just as fast.' }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  useEffect(() => {
    if (!open) return
    const k = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open])
  return (
    <div className="relative grid h-[300px] w-[360px] max-w-full place-items-center">
      <motion.button layoutId={`card-${id}`} type="button" onClick={() => setOpen(true)} style={{ borderRadius: 16 }}
        className="w-60 border border-line2 bg-panel p-4 text-left">
        <motion.div layoutId={`art-${id}`} className="h-20 rounded-lg bg-[linear-gradient(135deg,#ff6a2b,#3a1206)]" />
        <motion.div layoutId={`t-${id}`} className="mt-3 text-sm font-medium text-tx">{title}</motion.div>
        <motion.div layoutId={`m-${id}`} className="text-xs text-mute">{meta}</motion.div>
      </motion.button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="absolute inset-0 z-10 rounded-2xl bg-bg/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.div layoutId={`card-${id}`} role="dialog" aria-modal="true" aria-label={title} style={{ borderRadius: 20 }}
              className="absolute inset-3 z-20 overflow-hidden border border-line2 bg-panel p-5">
              <motion.div layoutId={`art-${id}`} className="h-24 rounded-xl bg-[linear-gradient(135deg,#ff6a2b,#3a1206)]" />
              <div className="mt-4 flex items-start justify-between">
                <div>
                  <motion.div layoutId={`t-${id}`} className="text-base font-medium text-tx">{title}</motion.div>
                  <motion.div layoutId={`m-${id}`} className="text-xs text-mute">{meta}</motion.div>
                </div>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="grid size-7 place-items-center rounded-full border border-line2 text-mute hover:text-tx">×</button>
              </div>
              <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }} exit={{ opacity: 0 }} className="mt-3 text-sm leading-6 text-mute">{body}</motion.p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
