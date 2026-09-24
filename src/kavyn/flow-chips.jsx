import { useState } from 'react'
import { motion } from 'motion/react'

const CHIPS = ['Under ₹999', 'In stock', 'Cotton', 'Free delivery', 'Linen', 'New', 'Black', 'Oversized']

export default function FlowChips({ chips = CHIPS }) {
  const [on, setOn] = useState(['In stock'])
  const sorted = [...chips].sort((a, b) => (on.includes(b) ? 1 : 0) - (on.includes(a) ? 1 : 0))
  return (
    <div className="flex max-w-md flex-wrap gap-2">
      {sorted.map((c) => {
        const a = on.includes(c)
        return (
          <motion.button layout key={c} onClick={() => setOn(a ? on.filter((x) => x !== c) : [...on, c])} transition={{ type: 'spring', stiffness: 420, damping: 30 }} whileTap={{ scale: 0.94 }}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm ${a ? 'border-tx bg-tx text-bg' : 'border-line2 bg-panel text-mute'}`}>
            {a && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-xs">✓</motion.span>}{c}
          </motion.button>
        )
      })}
    </div>
  )
}
