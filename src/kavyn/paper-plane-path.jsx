import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, animate } from 'motion/react'

const D = 'M20 170 C 90 40, 170 200, 230 110 S 330 30, 400 60'

export default function PaperPlanePath({ message = 'Invoice sent to Priya' }) {
  const path = useRef(null)
  const p = useMotionValue(0)
  const [s, setS] = useState({ x: 20, y: 170, a: 0, v: 0 })
  useEffect(() => {
    const el = path.current, L = el.getTotalLength()
    const un = p.on('change', (v) => {
      const a = el.getPointAtLength(L * v), b = el.getPointAtLength(Math.min(L, L * v + 1))
      setS({ x: a.x, y: a.y, a: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI, v })
    })
    const c = animate(p, [0, 1, 1], { duration: 4.2, times: [0, 0.75, 1], ease: [0.45, 0, 0.2, 1], repeat: Infinity })
    return () => { un(); c.stop() }
  }, [p])
  return (
    <div className="w-full max-w-md">
      <svg viewBox="0 0 420 220" className="w-full overflow-visible">
        <path ref={path} d={D} fill="none" stroke="none" />
        <motion.path d={D} fill="none" stroke="#5c5c66" strokeWidth="1.5" strokeDasharray="4 6" style={{ pathLength: p }} />
        <g transform={`translate(${s.x} ${s.y}) rotate(${s.a})`}>
          <path d="M14 0 L-10 -9 L-5 0 L-10 9 Z" fill="#ededef" />
          <path d="M14 0 L-5 0 L-10 9 Z" fill="#8a8a93" />
        </g>
      </svg>
      <motion.div animate={{ opacity: s.v > 0.97 ? 1 : 0, y: s.v > 0.97 ? 0 : 6 }} className="text-center text-sm text-tx">✓ {message}</motion.div>
    </div>
  )
}
