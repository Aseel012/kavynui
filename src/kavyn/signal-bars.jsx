import { motion } from 'motion/react'

export default function SignalBars({ bars = 5, label = 'Connecting to printer' }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-10 items-end gap-1">
        {Array.from({ length: bars }).map((_, i) => (
          <motion.span key={i} className="block w-2 rounded-sm bg-tx" style={{ height: 8 + (i * 32) / Math.max(bars - 1, 1) }}
            animate={{ backgroundColor: ['#2a2a30', '#ededef', i === bars - 1 ? '#ff6a2b' : '#ededef', '#2a2a30'] }}
            transition={{ repeat: Infinity, duration: 2, delay: i * 0.18, times: [0, 0.2, 0.7, 1] }} />
        ))}
      </div>
      <span className="text-sm text-mute">{label}</span>
    </div>
  )
}
