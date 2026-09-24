import { useState } from 'react'
import { motion } from 'motion/react'

export default function HighlighterSweep({ before = 'Most teams lose ', mark = 'three hours a week', after = ' to status meetings.' }) {
  const [k, setK] = useState(0)
  return (
    <p onClick={() => setK(k + 1)} className="max-w-md text-2xl leading-snug tracking-tight text-mute">
      {before}
      <span className="relative inline-block whitespace-nowrap text-tx">
        <motion.span
          key={k}
          aria-hidden
          className="absolute -inset-x-1 bottom-[0.08em] top-[0.45em] -z-0 origin-left -skew-x-6 rounded-[3px] bg-acc/35"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ amount: 0.8 }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
        />
        <span className="relative">{mark}</span>
      </span>
      {after}
    </p>
  )
}
