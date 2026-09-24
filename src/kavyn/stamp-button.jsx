import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export default function StampButton({ children = 'Approve invoice', seal = 'APPROVED' }) {
  const [stamped, setStamped] = useState(false)
  return (
    <div className="relative grid place-items-center p-8">
      <motion.button
        onClick={() => { setStamped(true); setTimeout(() => setStamped(false), 2200) }}
        whileTap={{ scaleY: 0.82, scaleX: 1.08, y: 3 }}
        transition={{ type: 'spring', stiffness: 600, damping: 14 }}
        className="h-12 rounded-xl bg-tx px-7 text-sm font-semibold text-bg shadow-[0_4px_0_#8a8a93]"
      >
        {children}
      </motion.button>
      <AnimatePresence>
        {stamped && (
          <motion.div
            initial={{ scale: 2.2, opacity: 0, rotate: -24 }}
            animate={{ scale: 1, opacity: 1, rotate: -12 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 520, damping: 20 }}
            className="pointer-events-none absolute right-0 top-1 grid size-20 place-items-center rounded-full border-2 border-dashed border-acc text-[10px] font-bold tracking-[0.2em] text-acc"
          >
            <span className="grid size-16 place-items-center rounded-full border border-acc/60">{seal}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
