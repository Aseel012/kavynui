import { useState } from 'react'
import { motion } from 'motion/react'

export default function DeviceUnveil({ app = 'Streak' }) {
  const [k, setK] = useState(0)
  return (
    <div onClick={() => setK(k + 1)} className="grid cursor-pointer place-items-center [perspective:1000px]">
      <motion.div
        key={k}
        initial={{ rotateX: 40, y: 60, opacity: 0, scale: 0.9 }}
        whileInView={{ rotateX: 0, y: 0, opacity: 1, scale: 1 }}
        viewport={{ amount: 0.5 }}
        transition={{ type: 'spring', stiffness: 80, damping: 16 }}
        className="relative h-80 w-40 rounded-[28px] border-[5px] border-[#26262b] bg-bg p-1 shadow-[0_40px_80px_rgba(0,0,0,.6)]"
      >
        <div className="absolute left-1/2 top-2 z-10 h-3.5 w-12 -translate-x-1/2 rounded-full bg-black" />
        <motion.div
          initial={{ clipPath: 'inset(100% 0 0 0 round 22px)' }}
          whileInView={{ clipPath: 'inset(0% 0 0 0 round 22px)' }}
          viewport={{ amount: 0.5 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.7, 0, 0.2, 1] }}
          className="flex size-full flex-col gap-2 rounded-[22px] bg-gradient-to-b from-[#1b1310] to-panel p-3 pt-8"
        >
          <div className="text-[11px] text-mute">Good morning</div>
          <div className="text-lg font-semibold text-tx">{app}</div>
          <div className="grid grid-cols-7 gap-1">{Array.from({ length: 21 }).map((_, i) => <motion.span key={i} initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 1 + i * 0.03, type: 'spring', stiffness: 500, damping: 20 }} className={`aspect-square rounded-[3px] ${i % 5 === 3 ? 'bg-line2' : 'bg-acc'}`} style={{ opacity: 0.35 + (i % 4) * 0.2 }} />)}</div>
          <div className="mt-auto rounded-xl bg-tx py-2 text-center text-[11px] font-medium text-bg">Log today</div>
        </motion.div>
      </motion.div>
      <span className="mt-3 text-[11px] text-faint">click to replay</span>
    </div>
  )
}
