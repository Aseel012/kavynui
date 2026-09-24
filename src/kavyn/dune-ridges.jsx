import { motion } from 'motion/react'

const wave = (y, a, ph) => { let d = `M0 ${y}`; for (let x = 0; x <= 800; x += 40) d += ` Q ${x + 20} ${y + Math.sin((x + ph) / 90) * a - a} ${x + 40} ${y + Math.sin((x + 40 + ph) / 90) * a}`; return d + ' L800 300 L0 300 Z' }

export default function DuneRidges({ children, ridges = 5 }) {
  return (
    <div className="relative size-full min-h-64 overflow-hidden bg-[linear-gradient(#1a1410,#0b0908)]">
      <div className="absolute left-1/2 top-[18%] size-20 -translate-x-1/2 rounded-full bg-[#f3c58f]/80 blur-[2px]" />
      <svg viewBox="0 0 400 300" preserveAspectRatio="none" className="absolute inset-0 size-full">
        {Array.from({ length: ridges }).map((_, i) => (
          <motion.path key={i} d={wave(120 + i * 38, 10 + i * 3, i * 70)} fill={`rgb(${60 + i * 22},${38 + i * 14},${26 + i * 8})`}
            animate={{ x: [0, -200 + i * 20, 0] }} transition={{ repeat: Infinity, duration: 40 - i * 5, ease: 'easeInOut' }} />
        ))}
      </svg>
      <div className="relative grid size-full min-h-64 place-items-center">{children}</div>
    </div>
  )
}
