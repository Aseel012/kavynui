import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export default function BlockBuilder({ blocks = 6, label = 'Building' }) {
  const [n, setN] = useState(0)
  useEffect(() => { const t = setTimeout(() => setN(n >= blocks + 2 ? 0 : n + 1), n >= blocks ? 700 : 320); return () => clearTimeout(t) }, [n, blocks])
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex h-16 items-end gap-1 border-b border-line2 px-1 pb-px">
        <AnimatePresence>
          {Array.from({ length: Math.min(n, blocks) }).map((_, i) => (
            <motion.span key={i} className={`size-6 rounded-[4px] ${i === blocks - 1 ? 'bg-acc' : 'bg-tx'}`}
              initial={{ y: -60, opacity: 0, rotate: -20 }} animate={{ y: 0, opacity: 1, rotate: 0 }} exit={{ scale: 0, opacity: 0, transition: { delay: i * 0.03 } }}
              transition={{ type: 'spring', stiffness: 500, damping: 18 }} />
          ))}
        </AnimatePresence>
        {Array.from({ length: blocks - Math.min(n, blocks) }).map((_, i) => <span key={'g' + i} className="size-6 rounded-[4px] border border-dashed border-line2" />)}
      </div>
      <span className="font-mono text-xs text-mute">{n >= blocks ? '✓ build complete' : `${label} ${Math.min(n, blocks)}/${blocks}`}</span>
    </div>
  )
}
