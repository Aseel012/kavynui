import { motion } from 'motion/react'

export default function RingWeave({ size = 56, label = 'Syncing' }) {
  const t = { repeat: Infinity, duration: 1.8, ease: 'easeInOut' }
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size * 1.7, height: size }}>
        <motion.span className="absolute top-0 rounded-full border-[3px] border-tx" style={{ width: size, height: size }}
          animate={{ left: [0, size * 0.7, 0], zIndex: [2, 2, 1, 1, 2], scale: [1, 0.9, 1] }} transition={t} />
        <motion.span className="absolute top-0 rounded-full border-[3px] border-acc" style={{ width: size, height: size }}
          animate={{ left: [size * 0.7, 0, size * 0.7], zIndex: [1, 1, 2, 2, 1], scale: [0.9, 1, 0.9] }} transition={t} />
      </div>
      <span className="text-xs text-mute">{label}</span>
    </div>
  )
}
