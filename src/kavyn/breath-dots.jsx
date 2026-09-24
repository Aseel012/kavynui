import { motion } from 'motion/react'

export default function BreathDots({ label = 'Thinking', color = '#ededef' }) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-line2 bg-panel px-4 py-2.5">
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span key={i} className="size-2 rounded-full" style={{ background: color }}
            animate={{ scale: [0.6, 1.15, 0.6], opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.6, delay: i * 0.22, ease: 'easeInOut' }} />
        ))}
      </div>
      <span className="text-sm text-mute">{label}</span>
    </div>
  )
}
