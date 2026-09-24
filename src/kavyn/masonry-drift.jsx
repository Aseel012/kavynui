import { motion } from 'motion/react'

const T = [
  ['from-[#ff6a2b] to-[#6b1f0a]', 140], ['from-[#2a2a30] to-[#0f0f11]', 90], ['from-[#d8b27a] to-[#5a3d1a]', 120],
  ['from-[#3f7cac] to-[#0f2233]', 160], ['from-[#6b8f5e] to-[#1a2615]', 100], ['from-[#7d4e8a] to-[#1f1025]', 130],
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
