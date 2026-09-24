import { useState } from 'react'
import { motion } from 'motion/react'

const LINES = ['M40 200 H360', 'M40 200 V80 H200 V200', 'M200 120 H360 V200', 'M110 200 V150 H150 V200', 'M250 150 H310 V120', 'M40 80 L120 40 L200 80']

export default function Blueprint({ children }) {
  const [k, setK] = useState(0)
  return (
    <div onClick={() => setK(k + 1)} className="relative size-full min-h-64 overflow-hidden bg-[#0a0e14]">
      <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(#16202c_1px,transparent_1px),linear-gradient(90deg,#16202c_1px,transparent_1px)] [background-size:20px_20px]" />
      <div className="absolute inset-0 [background-image:linear-gradient(#1c2a3a_1px,transparent_1px),linear-gradient(90deg,#1c2a3a_1px,transparent_1px)] [background-size:100px_100px]" />
      <svg key={k} viewBox="0 0 400 240" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid meet">
        {LINES.map((d, i) => (
          <motion.path key={i} d={d} fill="none" stroke="#7fb2e6" strokeWidth="1.2" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.85 }} transition={{ delay: 0.3 + i * 0.35, duration: 1.1, ease: 'easeInOut' }} />
        ))}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6 }} fill="#7fb2e6" fontSize="8" fontFamily="ui-monospace">
          <path d="M40 215 H360 M40 211 V219 M360 211 V219" stroke="#ff6a2b" strokeWidth=".8" /><text x="190" y="228" fill="#ff6a2b">12.40 m</text>
        </motion.g>
      </svg>
      <div className="relative grid size-full min-h-64 place-items-center">{children}</div>
    </div>
  )
}
