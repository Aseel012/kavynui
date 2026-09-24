import { useMemo } from 'react'
import { motion } from 'motion/react'

export default function CircuitPulse({ children, traces = 12, seed = 7 }) {
  const paths = useMemo(() => {
    let s = seed; const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
    return Array.from({ length: traces }, () => {
      let x = Math.round(rnd() * 20) * 20, y = Math.round(rnd() * 12) * 20, d = `M${x} ${y}`
      for (let k = 0; k < 4; k++) { if (k % 2) y += (rnd() > 0.5 ? 1 : -1) * Math.round(1 + rnd() * 3) * 20; else x += Math.round(2 + rnd() * 5) * 20; d += ` L${x} ${y}` }
      return { d, end: [x, y] }
    })
  }, [traces, seed])
  return (
    <div className="relative size-full min-h-64 overflow-hidden bg-bg">
      <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
        {paths.map((p, i) => (
          <g key={i}>
            <path d={p.d} fill="none" stroke="#1e1e22" strokeWidth="1.5" />
            <motion.path d={p.d} fill="none" stroke="#ff6a2b" strokeWidth="1.5" strokeLinecap="round" pathLength="1" strokeDasharray="0.12 0.88"
              initial={{ strokeDashoffset: 1 }} animate={{ strokeDashoffset: -0.12 }} transition={{ repeat: Infinity, duration: 2.4 + (i % 4) * 0.5, delay: i * 0.3, ease: 'easeIn', repeatDelay: 1 }} style={{ filter: 'drop-shadow(0 0 3px #ff6a2b)' }} />
            <circle cx={p.end[0]} cy={p.end[1]} r="2.5" fill="#141417" stroke="#2a2a30" />
          </g>
        ))}
      </svg>
      <div className="relative grid size-full min-h-64 place-items-center">{children}</div>
    </div>
  )
}
