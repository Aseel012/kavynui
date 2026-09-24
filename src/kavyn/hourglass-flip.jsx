import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

export default function HourglassFlip({ seconds = 2.4, position = 12 }) {
  const [flip, setFlip] = useState(0)
  useEffect(() => { const t = setInterval(() => setFlip((f) => f + 1), seconds * 1000 + 700); return () => clearInterval(t) }, [seconds])
  return (
    <div className="flex items-center gap-5">
      <motion.svg viewBox="0 0 40 60" className="h-20 w-14" animate={{ rotate: flip * 180 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }}>
        <path d="M6 4 H34 M6 56 H34" stroke="#ededef" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M9 6 C9 20, 31 22, 31 6 Z M9 54 C9 40, 31 38, 31 54 Z" fill="none" stroke="#5c5c66" strokeWidth="1.5" />
        <path d="M9 6 C9 20, 20 28, 20 30 C20 28, 31 20, 31 6 M9 54 C9 40, 20 32, 20 30 C20 32, 31 40, 31 54" fill="none" stroke="#5c5c66" strokeWidth="1.5" />
        <clipPath id="hg-top"><path d="M9 6 C9 20, 20 28, 20 30 C20 28, 31 20, 31 6 Z" /></clipPath>
        <clipPath id="hg-bot"><path d="M9 54 C9 40, 20 32, 20 30 C20 32, 31 40, 31 54 Z" /></clipPath>
        <g clipPath={flip % 2 ? 'url(#hg-bot)' : 'url(#hg-top)'}>
          <motion.rect key={'t' + flip} x="0" width="40" height="30" fill="#ff6a2b" initial={{ y: flip % 2 ? 30 : 0 }} animate={{ y: flip % 2 ? 60 : 30 }} transition={{ duration: seconds, ease: 'linear' }} />
        </g>
        <g clipPath={flip % 2 ? 'url(#hg-top)' : 'url(#hg-bot)'}>
          <motion.rect key={'b' + flip} x="0" width="40" height="30" fill="#ff6a2b" initial={{ y: flip % 2 ? -30 : 60 }} animate={{ y: flip % 2 ? 0 : 30 }} transition={{ duration: seconds, ease: 'linear' }} />
        </g>
        <motion.line key={'s' + flip} x1="20" x2="20" y1="28" y2="50" stroke="#ff6a2b" strokeWidth="1" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: seconds - 0.2, duration: 0.2 }} style={{ transformOrigin: '20px 30px', rotate: flip % 2 ? 180 : 0 }} />
      </motion.svg>
      <div>
        <div className="text-xs text-faint">Your place in line</div>
        <div className="font-mono text-3xl text-tx">#{Math.max(1, position - flip)}</div>
      </div>
    </div>
  )
}
