import { useMemo, useState } from 'react'
import { motion } from 'motion/react'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Requests by hour and weekday. Cells fill in on a diagonal wave; hover reads the value.
export default function RequestHeatmap({ title = 'Requests by hour' }) {
  const [on, setOn] = useState(null)
  const grid = useMemo(() => DAYS.map((_, d) => Array.from({ length: 24 }, (_, h) => {
    const work = h >= 9 && h <= 20 ? 1 : 0.25
    const wk = d >= 5 ? 0.55 : 1
    return Math.min(1, work * wk * (0.55 + 0.45 * Math.sin((h / 24) * Math.PI)) + ((h * 7 + d * 13) % 10) / 40)
  })), [])
  const cell = on ? grid[on[0]][on[1]] : null
  return (
    <div className="w-[440px] max-w-full rounded-2xl border border-line bg-panel p-4">
      <div className="mb-3 flex items-center justify-between text-xs">
        <span className="text-tx">{title}</span>
        <span className="font-mono text-mute">{cell !== null ? `${DAYS[on[0]]} ${String(on[1]).padStart(2, '0')}:00 · ${(cell * 48).toFixed(1)}k` : 'last 7 days'}</span>
      </div>
      <div className="grid gap-[3px]" onMouseLeave={() => setOn(null)}>
        {grid.map((row, d) => (
          <div key={d} className="grid grid-cols-[28px_repeat(24,1fr)] items-center gap-[3px]">
            <span className="text-[10px] text-faint">{DAYS[d]}</span>
            {row.map((v, h) => (
              <motion.span key={h} onMouseEnter={() => setOn([d, h])}
                initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: on && on[0] === d && on[1] === h ? 1.35 : 1 }}
                transition={{ delay: on ? 0 : (d + h) * 0.012, type: 'spring', stiffness: 400, damping: 26 }}
                className="aspect-square rounded-[3px]" style={{ backgroundColor: `rgba(255,106,43,${0.06 + v * 0.85})` }} />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-[28px_1fr] font-mono text-[9px] text-faint"><span /><div className="flex justify-between"><span>00</span><span>06</span><span>12</span><span>18</span><span>23</span></div></div>
    </div>
  )
}
