import { useState } from 'react'
import { motion } from 'motion/react'

const SW = [
  { n: 'Ember', c: '#ff6a2b' }, { n: 'Moss', c: '#6b8f5e' }, { n: 'Tide', c: '#3f7cac' },
  { n: 'Plum', c: '#7d4e8a' }, { n: 'Sand', c: '#d8b27a' }, { n: 'Ash', c: '#8a8a93' },
]

export default function PaletteFan({ swatches = SW, onPick }) {
  const [open, setOpen] = useState(false)
  const [pick, setPick] = useState(0)
  const mid = (swatches.length - 1) / 2
  return (
    <div className="flex flex-col items-center gap-6">
      <div onPointerEnter={() => setOpen(true)} onPointerLeave={() => setOpen(false)} onClick={() => setOpen(true)} className="relative h-48 w-64">
        {swatches.map((s, i) => (
          <motion.button
            key={s.n}
            onClick={(e) => { e.stopPropagation(); setPick(i); onPick?.(s) }}
            className="absolute bottom-0 left-1/2 -ml-8 flex h-40 w-16 origin-[50%_92%] flex-col justify-end overflow-hidden rounded-lg border border-black/40 text-left shadow-lg"
            style={{ background: s.c, zIndex: i }}
            animate={{ rotate: open ? (i - mid) * 13 : (i - mid) * 1.5, y: pick === i && open ? -14 : 0 }}
            whileHover={{ y: -18 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: open ? i * 0.03 : 0 }}
          >
            <span className="bg-[#f4f1ea] px-1.5 py-1.5 font-mono text-[9px] leading-tight text-[#222]">{s.n}<br />{s.c}</span>
          </motion.button>
        ))}
      </div>
      <div className="flex items-center gap-2 text-sm text-mute">
        <motion.span layout className="size-3 rounded-full" animate={{ backgroundColor: swatches[pick].c }} /> Theme: <span className="text-tx">{swatches[pick].n}</span>
      </div>
    </div>
  )
}
