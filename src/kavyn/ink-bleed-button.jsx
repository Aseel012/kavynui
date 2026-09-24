import { useRef, useState } from 'react'
import { motion } from 'motion/react'

export default function InkBleedButton({ children = 'Start building', color = '#ff6a2b' }) {
  const ref = useRef(null)
  const [s, setS] = useState({ x: 0, y: 0, on: false, r: 0 })

  const at = (e, on) => {
    const b = ref.current.getBoundingClientRect()
    const x = e.clientX - b.left, y = e.clientY - b.top
    const r = Math.hypot(Math.max(x, b.width - x), Math.max(y, b.height - y))
    setS({ x, y, on, r })
  }

  return (
    <button
      ref={ref}
      onPointerEnter={(e) => at(e, true)}
      onPointerLeave={(e) => at(e, false)}
      className="relative h-12 overflow-hidden rounded-xl border border-line2 bg-panel px-7 text-sm font-medium text-tx"
    >
      <motion.span
        aria-hidden
        className="absolute rounded-full"
        style={{ left: s.x, top: s.y, width: s.r * 2, height: s.r * 2, marginLeft: -s.r, marginTop: -s.r, background: color }}
        initial={false}
        animate={{ scale: s.on ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 170, damping: 24 }}
      />
      <motion.span className="relative" animate={{ color: s.on ? '#09090a' : '#ededef' }} transition={{ duration: 0.25 }}>
        {children}
      </motion.span>
    </button>
  )
}
