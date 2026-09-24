import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const TIPS = [
  { t: 'Press / to search', d: 'Jump to anything from anywhere.' },
  { t: 'Drag to reorder', d: 'Your sidebar follows your habits.' },
  { t: 'Share with a link', d: 'Anyone with the link can view.' },
  { t: 'Undo is always on', d: 'Cmd+Z works across the whole app.' },
]

export default function DeckShuffle({ cards = TIPS }) {
  const [order, setOrder] = useState(cards.map((_, i) => i))
  const next = () => setOrder((o) => [...o.slice(1), o[0]])
  return (
    <div className="relative h-56 w-72">
      <AnimatePresence initial={false}>
        {order.slice(0, 3).reverse().map((ci, rev, arr) => {
          const depth = arr.length - 1 - rev
          const top = depth === 0
          return (
            <motion.div
              key={ci}
              drag={top ? 'x' : false}
              dragSnapToOrigin
              onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 500) next() }}
              initial={{ scale: 0.85, y: 40, opacity: 0 }}
              animate={{ scale: 1 - depth * 0.06, y: depth * -14, opacity: 1, rotate: depth * 1.5 }}
              exit={{ x: 320, rotate: 18, opacity: 0, transition: { duration: 0.3 } }}
              whileDrag={{ scale: 1.03, rotate: 4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              className="absolute inset-0 flex cursor-grab flex-col justify-end rounded-2xl border border-line2 bg-panel2 p-5 shadow-[0_20px_50px_rgba(0,0,0,.5)] active:cursor-grabbing"
              style={{ zIndex: 10 - depth }}
            >
              <span className="mb-auto font-mono text-[11px] text-faint">TIP {ci + 1}/{cards.length}</span>
              <div className="text-lg font-medium text-tx">{cards[ci].t}</div>
              <div className="mt-1 text-sm text-mute">{cards[ci].d}</div>
              {top && <button onClick={next} className="mt-4 self-start text-xs text-acc">Next tip →</button>}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
