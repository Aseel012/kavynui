import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

export default function StitchProgress({ file = 'brand-guide.pdf', size = '8.4 MB' }) {
  const [p, setP] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setP((v) => (v >= 1 ? 0 : Math.min(1, v + Math.random() * 0.06))), 180)
    return () => clearInterval(t)
  }, [])
  const W = 300
  return (
    <div className="w-80 rounded-xl border border-line2 bg-panel p-4">
      <div className="mb-3 flex justify-between text-sm"><span className="text-tx">{file}</span><span className="font-mono text-xs text-mute tabular-nums">{Math.round(p * 100)}%</span></div>
      <svg viewBox={`0 0 ${W} 16`} className="w-full overflow-visible">
        <line x1="0" y1="8" x2={W} y2="8" stroke="#1e1e22" strokeWidth="6" strokeLinecap="round" />
        <motion.path d={Array.from({ length: 30 }, (_, i) => `M${i * 10 + 2} ${i % 2 ? 4 : 12} L${i * 10 + 8} ${i % 2 ? 12 : 4}`).join(' ')} stroke="#ff6a2b" strokeWidth="2" strokeLinecap="round" fill="none"
          animate={{ pathLength: p }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
        <motion.g animate={{ x: p * W }} transition={{ type: 'spring', stiffness: 120, damping: 20 }}>
          <line x1="0" y1="-4" x2="0" y2="20" stroke="#ededef" strokeWidth="1.5" />
          <circle cx="0" cy="-5" r="2" fill="none" stroke="#ededef" />
        </motion.g>
      </svg>
      <div className="mt-2 text-xs text-faint">{size} · {p >= 1 ? 'Uploaded' : 'Uploading'}</div>
    </div>
  )
}
