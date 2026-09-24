import { useRef, useState } from 'react'
import { motion } from 'motion/react'

const PH = [
  { cap: 'Hampi, dawn', g: 'from-[#f6b36b] to-[#7a3b2e]' },
  { cap: 'Kochi harbor', g: 'from-[#6fb1c9] to-[#1d3a4f]' },
  { cap: 'Spiti road', g: 'from-[#c9c3b5] to-[#4a4f5c]' },
  { cap: 'Goa, 6pm', g: 'from-[#ff7a59] to-[#3b1f4a]' },
]

export default function PolaroidDrop({ photos = PH }) {
  const box = useRef(null)
  const [z, setZ] = useState(photos.map((_, i) => i))
  const [k, setK] = useState(0)
  const front = (i) => setZ((o) => { const m = Math.max(...o); return o.map((v, j) => (j === i ? m + 1 : v)) })
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      <div ref={box} className="relative h-64 w-full max-w-sm overflow-hidden rounded-2xl border border-line bg-panel">
        {photos.map((p, i) => (
          <motion.div
            key={i + '-' + k}
            drag dragConstraints={box} dragElastic={0.15} dragMomentum
            onPointerDown={() => front(i)}
            initial={{ y: -260, rotate: (i - 1.5) * 25, opacity: 0 }}
            animate={{ y: 0, rotate: [-9, 6, -4, 8][i % 4], opacity: 1 }}
            transition={{ type: 'spring', stiffness: 140, damping: 13, delay: i * 0.18 }}
            whileDrag={{ scale: 1.06, rotate: 0 }}
            style={{ zIndex: z[i], left: 24 + i * 62, top: 30 + (i % 2) * 28 }}
            className="absolute w-32 cursor-grab rounded-sm bg-[#f4f1ea] p-2 pb-7 shadow-[0_14px_30px_rgba(0,0,0,.5)] active:cursor-grabbing"
          >
            <div className={`aspect-square bg-gradient-to-br ${p.g}`} />
            <div className="absolute bottom-1.5 left-2 font-serif text-[11px] italic text-[#333]">{p.cap}</div>
          </motion.div>
        ))}
      </div>
      <button onClick={() => setK(k + 1)} className="text-xs text-mute hover:text-tx">Drop again</button>
    </div>
  )
}
