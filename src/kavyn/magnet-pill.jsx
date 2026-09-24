import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'

export default function MagnetPill({ children = 'Subscribe', pull = 0.35, className = 'p-10' }) {
  const ref = useRef(null)
  const x = useMotionValue(0), y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 16, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 260, damping: 16, mass: 0.6 })
  const stretch = useTransform(sx, (v) => 1 + Math.min(Math.abs(v) / 180, 0.12))
  const lx = useTransform(sx, (v) => v * 0.6), ly = useTransform(sy, (v) => v * 0.6)
  const [done, setDone] = useState(false)

  const move = (e) => {
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * pull)
    y.set((e.clientY - (r.top + r.height / 2)) * pull)
  }
  const leave = () => { x.set(0); y.set(0) }

  return (
    <div onPointerMove={move} onPointerLeave={leave} className={`grid place-items-center ${className}`}>
      <motion.button
        ref={ref}
        onClick={() => { setDone(true); setTimeout(() => setDone(false), 1600) }}
        style={{ x: sx, y: sy, scaleX: stretch }}
        whileTap={{ scale: 0.94 }}
        className="h-12 rounded-full bg-tx px-8 text-sm font-medium text-bg"
      >
        <motion.span style={{ x: lx, y: ly }} className="inline-block">
          {done ? 'You are in' : children}
        </motion.span>
      </motion.button>
    </div>
  )
}
