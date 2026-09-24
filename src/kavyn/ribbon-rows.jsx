import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const JOBS = [
  { r: 'Senior Frontend Engineer', l: 'Remote · India', t: 'Full-time' },
  { r: 'Product Designer', l: 'Bengaluru', t: 'Full-time' },
  { r: 'Developer Advocate', l: 'Remote', t: 'Contract' },
  { r: 'Platform Engineer', l: 'Pune', t: 'Full-time' },
]

export default function RibbonRows({ rows = JOBS }) {
  const [h, setH] = useState(null)
  return (
    <ul className="w-full max-w-md overflow-hidden rounded-2xl border border-line" onPointerLeave={() => setH(null)}>
      {rows.map((j, i) => (
        <li key={j.r} onPointerEnter={() => setH(i)} className="relative flex cursor-pointer items-center justify-between border-b border-line px-4 py-3.5 last:border-0">
          <AnimatePresence>
            {h === i && (
              <motion.span
                initial={{ clipPath: 'polygon(0 0, 0 0, -8% 100%, -8% 100%)' }}
                animate={{ clipPath: 'polygon(0 0, 108% 0, 100% 100%, -8% 100%)' }}
                exit={{ clipPath: 'polygon(108% 0, 108% 0, 100% 100%, 100% 100%)' }}
                transition={{ duration: 0.38, ease: [0.7, 0, 0.2, 1] }}
                className="absolute inset-0 bg-acc"
              />
            )}
          </AnimatePresence>
          <div className="relative">
            <div className={`text-sm transition-colors duration-300 ${h === i ? 'text-bg' : 'text-tx'}`}>{j.r}</div>
            <div className={`text-xs transition-colors duration-300 ${h === i ? 'text-bg/70' : 'text-faint'}`}>{j.l} · {j.t}</div>
          </div>
          <motion.span animate={{ x: h === i ? 0 : -8, opacity: h === i ? 1 : 0 }} transition={{ type: 'spring', stiffness: 400, damping: 26 }} className="relative text-sm font-medium text-bg">Apply →</motion.span>
        </li>
      ))}
    </ul>
  )
}
