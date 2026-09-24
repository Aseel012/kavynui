import { motion } from 'motion/react'

const BLOBS = [
  { s: 340, x: ['-10%', '30%', '0%', '-10%'], y: ['0%', '20%', '40%', '0%'], d: 22, o: 0.09 },
  { s: 260, x: ['60%', '20%', '50%', '60%'], y: ['50%', '10%', '30%', '50%'], d: 18, o: 0.07 },
  { s: 200, x: ['30%', '70%', '40%', '30%'], y: ['60%', '40%', '0%', '60%'], d: 26, o: 0.06 },
]

export default function InkSmoke({ children }) {
  return (
    <div className="relative size-full min-h-64 overflow-hidden bg-bg">
      <svg className="absolute size-0"><filter id="ink-smoke-f"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="3"><animate attributeName="baseFrequency" dur="30s" values="0.012;0.018;0.012" repeatCount="indefinite" /></feTurbulence><feDisplacementMap in="SourceGraphic" scale="90" /></filter></svg>
      <div className="absolute inset-0" style={{ filter: 'url(#ink-smoke-f) blur(28px)' }}>
        {BLOBS.map((b, i) => (
          <motion.div key={i} className="absolute rounded-full bg-tx" style={{ width: b.s, height: b.s, opacity: b.o }} animate={{ left: b.x, top: b.y, scale: [1, 1.3, 0.9, 1] }} transition={{ repeat: Infinity, duration: b.d, ease: 'easeInOut' }} />
        ))}
      </div>
      <div className="relative grid size-full min-h-64 place-items-center">{children}</div>
    </div>
  )
}
