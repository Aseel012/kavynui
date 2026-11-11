'use client'

import { motion } from 'motion/react'

const T = [
  ['from-[#a8644a] to-[#2e1810]', 140], ['from-[#3a3a3d] to-[#111112]', 90], ['from-[#c8a27a] to-[#3d2b1c]', 120],
  ['from-[#8a8556] to-[#24220f]', 160], ['from-[#6b7f5a] to-[#1b2216]', 100], ['from-[#7a4a63] to-[#24131c]', 130],
]

function Col({ speed, offset }) {
  const tiles = [...T.slice(offset), ...T.slice(0, offset)]
  return (
    <div className="h-full overflow-hidden">
      <motion.div animate={{ y: ['0%', '-50%'] }} transition={{ repeat: Infinity, ease: 'linear', duration: speed }} className="flex flex-col gap-2">
        {[...tiles, ...tiles].map(([g, h], i) => <div key={i} className={`rounded-lg bg-gradient-to-br ${g}`} style={{ height: h }} />)}
      </motion.div>
    </div>
  )
}

export default function MasonryDrift({ speeds = [22, 30, 18] }) {
  return (
    <div className="grid h-72 w-full max-w-md grid-cols-3 gap-2 overflow-hidden rounded-2xl border border-line p-2 [mask-image:linear-gradient(transparent,#000_15%,#000_85%,transparent)]">
      {speeds.map((s, i) => <Col key={i} speed={s} offset={i * 2} />)}
    </div>
  )
}
