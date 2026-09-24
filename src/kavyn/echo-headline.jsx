import { motion } from 'motion/react'

export default function EchoHeadline({ text = 'Friday. Live.', copies = 4 }) {
  return (
    <div className="relative select-none py-6">
      {Array.from({ length: copies }).map((_, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute inset-0 grid place-items-center text-6xl font-bold tracking-tight text-transparent"
          style={{ WebkitTextStroke: `1px rgba(255,106,43,${0.55 - i * 0.12})` }}
          animate={{ y: [0, (i + 1) * 9, 0], x: [0, (i + 1) * 4, 0] }}
          transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut', delay: i * 0.12 }}
        >
          {text}
        </motion.span>
      ))}
      <span className="relative grid place-items-center text-6xl font-bold tracking-tight text-tx">{text}</span>
    </div>
  )
}
