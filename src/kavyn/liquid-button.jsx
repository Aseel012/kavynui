import { useId, useState } from 'react'
import { motion } from 'motion/react'

// Gooey button: blobs merge and split through an SVG filter when you hover or press.
export default function LiquidButton({ children = 'Get started', onClick }) {
  const [hot, setHot] = useState(false)
  const id = useId().replace(/:/g, '')
  const blobs = [[-46, 0], [46, 0], [0, -18], [0, 18]]
  return (
    <button type="button" onClick={onClick} onMouseEnter={() => setHot(true)} onMouseLeave={() => setHot(false)} onFocus={() => setHot(true)} onBlur={() => setHot(false)}
      className="relative grid h-24 w-64 place-items-center outline-none">
      <svg className="absolute size-0" aria-hidden>
        <filter id={`goo-${id}`}><feGaussianBlur in="SourceGraphic" stdDeviation="8" result="b" /><feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" /></filter>
      </svg>
      <div className="absolute inset-0 grid place-items-center" style={{ filter: `url(#goo-${id})` }}>
        <motion.div className="absolute h-12 w-40 rounded-full bg-acc" animate={{ scaleX: hot ? 1.06 : 1 }} whileTap={{ scale: 0.94 }} />
        {blobs.map(([x, y], i) => (
          <motion.div key={i} className="absolute size-9 rounded-full bg-acc"
            animate={hot ? { x: x * 1.6, y: y * 1.5, scale: 0.8 } : { x: 0, y: 0, scale: 0.6 }}
            transition={{ type: 'spring', stiffness: 180, damping: 12, delay: i * 0.03 }} />
        ))}
      </div>
      <span className="relative text-sm font-medium text-black">{children}</span>
    </button>
  )
}
