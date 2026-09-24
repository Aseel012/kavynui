import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'

const Scene = ({ graded }) => (
  <div className="absolute inset-0" style={{ filter: graded ? 'none' : 'grayscale(.85) contrast(.8) brightness(.8)' }}>
    <div className="absolute inset-0 bg-gradient-to-b from-[#ff9a5a] via-[#e2566b] to-[#2b1a3d]" />
    <div className="absolute bottom-[34%] left-1/2 size-24 -translate-x-1/2 rounded-full bg-[#ffd29a] blur-[1px]" />
    <svg viewBox="0 0 400 300" preserveAspectRatio="none" className="absolute inset-0 size-full">
      <path d="M0 210 L70 150 L130 190 L210 120 L290 185 L350 150 L400 175 L400 300 L0 300Z" fill="#1a1024" />
      <path d="M0 250 L90 205 L170 240 L260 200 L400 245 L400 300 L0 300Z" fill="#0d0814" />
    </svg>
  </div>
)

export default function BeforeAfterBlade({ angle = 12 }) {
  const ref = useRef(null)
  const pos = useMotionValue(50)
  const s = useSpring(pos, { stiffness: 300, damping: 30 })
  const clip = useTransform(s, (p) => `polygon(${p + angle}% 0, 100% 0, 100% 100%, ${p - angle}% 100%)`)
  const left = useTransform(s, (p) => `${p}%`)
  const set = (e) => { const r = ref.current.getBoundingClientRect(); pos.set(Math.min(95, Math.max(5, ((e.clientX - r.left) / r.width) * 100))) }
  return (
    <div ref={ref} onPointerMove={set} onPointerDown={set} className="relative aspect-[4/3] w-full max-w-sm touch-none select-none overflow-hidden rounded-2xl border border-line">
      <Scene />
      <motion.div style={{ clipPath: clip }} className="absolute inset-0"><Scene graded /></motion.div>
      <motion.div style={{ left, rotate: angle * 0.6 }} className="absolute -top-4 -bottom-4 w-px bg-tx/90">
        <div className="absolute left-1/2 top-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-tx bg-bg/80 text-[10px] text-tx backdrop-blur">⇆</div>
      </motion.div>
      <span className="absolute left-3 top-3 rounded bg-bg/70 px-2 py-0.5 font-mono text-[10px] text-mute">RAW</span>
      <span className="absolute right-3 top-3 rounded bg-bg/70 px-2 py-0.5 font-mono text-[10px] text-tx">GRADED</span>
    </div>
  )
}
