import { useState } from 'react'
import { motion } from 'motion/react'

const BLADES = 6

export default function ShutterButton({ label = 'Upload photo', onClick }) {
  const [open, setOpen] = useState(false)
  return (
    <button
      onPointerEnter={() => setOpen(true)} onPointerLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} onClick={onClick}
      className="flex h-14 items-center gap-3 rounded-2xl border border-line2 bg-panel pl-2 pr-5 text-sm text-tx"
    >
      <span className="relative grid size-10 place-items-center overflow-hidden rounded-full bg-bg">
        <svg viewBox="0 0 24 24" className="size-4 text-acc" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 16V6M7 11l5-5 5 5M5 19h14" />
        </svg>
        {Array.from({ length: BLADES }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 h-10 w-6 origin-[0%_0%] bg-line2"
            style={{ rotate: (360 / BLADES) * i, borderRight: '1px solid #3a3a42' }}
            animate={{ rotate: (360 / BLADES) * i + (open ? 48 : 0), x: open ? 6 : -1, y: open ? 6 : -1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          />
        ))}
      </span>
      {label}
    </button>
  )
}
