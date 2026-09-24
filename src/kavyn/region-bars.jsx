import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

const REGIONS = [
  { name: 'India', code: 'IN', v: 34 }, { name: 'United States', code: 'US', v: 27 }, { name: 'Germany', code: 'DE', v: 12 },
  { name: 'Brazil', code: 'BR', v: 9 }, { name: 'Singapore', code: 'SG', v: 7 }, { name: 'Japan', code: 'JP', v: 5 },
]

// Top regions by traffic. Bars re-rank themselves as live shares shift.
export default function RegionBars({ regions = REGIONS, interval = 2200, title = 'Top countries' }) {
  const [list, setList] = useState(regions)
  useEffect(() => {
    const id = setInterval(() => {
      if (document.hidden) return
      setList((l) => {
        const moved = l.map((r) => ({ ...r, v: Math.max(1, r.v + (Math.random() - 0.5) * 6) }))
        const sum = moved.reduce((s, r) => s + r.v, 0)
        return moved.map((r) => ({ ...r, v: (r.v / sum) * 94 })).sort((a, b) => b.v - a.v)
      })
    }, interval)
    return () => clearInterval(id)
  }, [interval])
  const max = Math.max(...list.map((r) => r.v), 1)
  return (
    <div className="w-[380px] max-w-full rounded-2xl border border-line bg-panel p-4">
      <div className="mb-3 flex justify-between text-xs"><span className="text-tx">{title}</span><span className="text-faint">share of requests</span></div>
      <ul className="space-y-1.5">
        {list.map((r, i) => (
          <motion.li key={r.code} layout transition={{ type: 'spring', stiffness: 360, damping: 32 }} className="relative h-8 overflow-hidden rounded-lg bg-panel2">
            <motion.div className={`absolute inset-y-0 left-0 rounded-lg ${i === 0 ? 'bg-acc/30' : 'bg-line2/70'}`} animate={{ width: `${(r.v / max) * 100}%` }} transition={{ type: 'spring', stiffness: 120, damping: 22 }} />
            <div className="relative flex h-full items-center justify-between px-3 text-xs">
              <span className="flex items-center gap-2 text-tx"><span className="font-mono text-[10px] text-faint">{r.code}</span>{r.name}</span>
              <span className="font-mono tabular-nums text-mute">{r.v.toFixed(1)}%</span>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
