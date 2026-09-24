import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useScroll, useVelocity } from 'motion/react'

export default function KerningBreath({ text = 'Slow news, well told' }) {
  const { scrollY } = useScroll()
  const vel = useVelocity(scrollY)
  const pointer = useMotionValue(0)
  const energy = useSpring(0, { stiffness: 90, damping: 18 })
  useEffect(() => {
    const u1 = vel.on('change', (v) => energy.set(Math.min(Math.abs(v) / 1800, 1)))
    const u2 = pointer.on('change', (v) => energy.set(Math.min(v, 1)))
    return () => { u1(); u2() }
  }, [vel, pointer, energy])
  const spacing = useTransform(energy, [0, 1], ['-0.04em', '0.22em'])
  const weight = useTransform(energy, [0, 1], [600, 300])
  const last = useRef(null)
  return (
    <div
      className="grid w-full place-items-center py-10"
      onPointerMove={(e) => {
        const now = performance.now()
        const l = last.current
        if (l) pointer.set(Math.hypot(e.clientX - l.x, e.clientY - l.y) / Math.max(now - l.t, 1) / 2.2)
        last.current = { x: e.clientX, y: e.clientY, t: now }
      }}
      onPointerLeave={() => pointer.set(0)}
    >
      <motion.h3 style={{ letterSpacing: spacing, fontWeight: weight }} className="text-center text-4xl leading-tight text-tx">
        {text}
      </motion.h3>
      <span className="mt-3 text-xs text-faint">scroll or move fast</span>
    </div>
  )
}
