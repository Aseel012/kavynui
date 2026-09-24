import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'motion/react'

// Cache hit ratio donut. The arc springs to each new value and the number follows it.
export default function CacheRing({ label = 'Cache hit ratio', values = [0.82, 0.91, 0.87, 0.94], interval = 2400, size = 180 }) {
  const [i, setI] = useState(0)
  const v = useSpring(0, { stiffness: 70, damping: 18 })
  const pct = useTransform(v, (x) => `${(x * 100).toFixed(1)}%`)
  useEffect(() => { v.set(values[i % values.length] ?? 0) }, [i, values, v])
  useEffect(() => { const id = setInterval(() => !document.hidden && setI((n) => n + 1), interval); return () => clearInterval(id) }, [interval])
  const r = size / 2 - 12, C = 2 * Math.PI * r
  const dash = useTransform(v, (x) => `${x * C} ${C}`)
  return (
    <div className="flex w-[360px] max-w-full items-center gap-5 rounded-2xl border border-line bg-panel p-4">
      <svg width={size * 0.62} height={size * 0.62} viewBox={`0 0 ${size} ${size}`} className="-rotate-90 shrink-0">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e1e22" strokeWidth="12" />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ff6a2b" strokeWidth="12" strokeLinecap="round" style={{ strokeDasharray: dash }} />
      </svg>
      <div>
        <div className="text-xs text-mute">{label}</div>
        <motion.div className="mt-1 font-mono text-3xl tabular-nums tracking-tight text-tx">{pct}</motion.div>
        <div className="mt-2 flex gap-3 text-[11px]"><span className="flex items-center gap-1.5 text-mute"><i className="size-2 rounded-sm bg-acc" />Served from edge</span><span className="flex items-center gap-1.5 text-faint"><i className="size-2 rounded-sm bg-line2" />Origin</span></div>
      </div>
    </div>
  )
}
