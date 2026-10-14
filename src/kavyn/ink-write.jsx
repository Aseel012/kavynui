'use client'

import { useState } from 'react'
import { motion } from 'motion/react'

export default function InkWrite({ text = 'Welcome, Maya', loop = true }) {
  const [k, setK] = useState(0)
  return (
    <svg viewBox="0 0 520 120" className="w-full max-w-md" onClick={() => setK(k + 1)}>
      <motion.text
        key={k}
        x="50%" y="78" textAnchor="middle"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic', fontSize: 64 }}
        fill="var(--tx)" stroke="var(--tx)" strokeWidth="1.2" strokeDasharray="900"
        initial={{ strokeDashoffset: 900, fillOpacity: 0 }}
        animate={{ strokeDashoffset: 0, fillOpacity: 1 }}
        transition={{ strokeDashoffset: { duration: 2.4, ease: [0.6, 0, 0.3, 1] }, fillOpacity: { delay: 1.9, duration: 0.8 } }}
        onAnimationComplete={() => loop && setTimeout(() => setK((x) => x + 1), 2200)}
      >
        {text}
      </motion.text>
      <motion.path
        key={'u' + k} d="M140 100 Q 260 86 380 98" fill="none" stroke="#ff6a2b" strokeWidth="2.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 2.1, duration: 0.6, ease: 'easeOut' }}
      />
    </svg>
  )
}
