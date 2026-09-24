import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'

function Letter({ ch, mx, idx, total }) {
  const w = useTransform(mx, (x) => {
    if (x < 0) return 300
    const center = (idx + 0.5) / total
    const d = Math.abs(x - center)
    return 300 + 600 * Math.max(0, 1 - d * 5)
  })
  const s = useSpring(w, { stiffness: 220, damping: 20 })
  return <motion.span style={{ fontWeight: s }} className="inline-block whitespace-pre">{ch}</motion.span>
}

export default function WeightWave({ text = 'MERIDIAN' }) {
  const ref = useRef(null)
  const mx = useMotionValue(-1)
  return (
    <h3
      ref={ref}
      onPointerMove={(e) => { const r = ref.current.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width) }}
      onPointerLeave={() => mx.set(-1)}
      className="cursor-default select-none text-6xl tracking-tight text-tx"
    >
      {text.split('').map((c, i) => <Letter key={i} ch={c} mx={mx} idx={i} total={text.length} />)}
    </h3>
  )
}
