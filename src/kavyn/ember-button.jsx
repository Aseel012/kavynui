import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'motion/react'

export default function EmberButton({ children = 'Pay now', range = 220, onClick }) {
  const ref = useRef(null)
  const heat = useMotionValue(0)
  const angle = useMotionValue(0)
  const h = useSpring(heat, { stiffness: 180, damping: 22 })
  const a = useSpring(angle, { stiffness: 120, damping: 20 })
  const glow = useTransform(h, [0, 1], [0, 0.9])
  const blur = useTransform(h, [0, 1], [0, 18])
  const bg = useMotionTemplate`conic-gradient(from ${a}deg, transparent 0deg, #ff6a2b 40deg, #ffb46b 70deg, transparent 130deg, transparent 360deg)`
  const shadow = useMotionTemplate`0 0 ${blur}px rgba(255,106,43,${glow})`

  useEffect(() => {
    const move = (e) => {
      const r = ref.current?.getBoundingClientRect()
      if (!r) return
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2
      const d = Math.hypot(e.clientX - cx, e.clientY - cy)
      heat.set(Math.max(0, 1 - d / range))
      angle.set((Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI + 30)
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [range, heat, angle])

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      style={{ boxShadow: shadow }}
      className="relative isolate rounded-xl p-px text-sm font-medium text-tx"
    >
      <motion.span aria-hidden style={{ background: bg, opacity: glow }} className="absolute inset-0 -z-10 rounded-xl" />
      <span className="absolute inset-0 -z-10 rounded-xl bg-line2" />
      <span className="relative flex h-11 items-center gap-2 rounded-[11px] bg-panel px-6">
        <motion.span style={{ opacity: glow }} className="size-1.5 rounded-full bg-acc" />
        {children}
      </span>
    </motion.button>
  )
}
