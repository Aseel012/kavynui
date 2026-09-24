import { useState } from 'react'
import { motion } from 'motion/react'

export default function RedactReveal({ text = 'Your keys never leave your device. Not even we can read them.' }) {
  const [k, setK] = useState(0)
  const words = text.split(' ')
  return (
    <p onClick={() => setK(k + 1)} className="max-w-md cursor-pointer text-2xl font-medium leading-snug tracking-tight text-tx">
      {words.map((w, i) => (
        <span key={i} className="relative mr-[0.28em] inline-block">
          {w}
          <motion.span
            key={k}
            aria-hidden
            className="absolute -inset-x-0.5 inset-y-[0.12em] origin-right rounded-[2px] bg-tx"
            initial={{ scaleX: 1 }}
            whileInView={{ scaleX: 0 }}
            viewport={{ once: false, amount: 0.6 }}
            transition={{ delay: 0.3 + i * 0.12, type: 'spring', stiffness: 220, damping: 26 }}
          />
        </span>
      ))}
    </p>
  )
}
