import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const seed = (n) => { let s = n; return () => ((s = (s * 16807) % 2147483647) / 2147483647) }

// 90-day status history. Bars rise in, hover (or tap) a day for details.
export default function UptimeBars({ service = 'API · Global', days = 90, incidents = [18, 57, 58] }) {
  const [hover, setHover] = useState(null)
  const data = useMemo(() => {
    const r = seed(7)
    return Array.from({ length: days }, (_, i) => {
      const bad = incidents.includes(i)
      const up = bad ? 96 + r() * 2.5 : 99.9 + r() * 0.1
      return { i, up, state: bad ? (up < 97.5 ? 'down' : 'degraded') : 'ok' }
    })
  }, [days, incidents])
  const avg = data.reduce((s, d) => s + d.up, 0) / Math.max(1, data.length)
  const tone = { ok: 'bg-emerald-400/80', degraded: 'bg-amber-400', down: 'bg-rose-500' }
  const d = hover !== null ? data[hover] : null
  return (
    <div className="w-[420px] max-w-full rounded-2xl border border-line bg-panel p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-tx"><span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px] shadow-emerald-400" />{service}</span>
        <span className="font-mono text-xs text-mute">{avg.toFixed(3)}% uptime</span>
      </div>
      <div className="relative mt-4 flex h-9 items-end gap-[2px]" onMouseLeave={() => setHover(null)}>
        {data.map((x) => (
          <motion.button
            key={x.i} type="button" aria-label={`Day ${x.i + 1}: ${x.up.toFixed(2)}%`}
            onMouseEnter={() => setHover(x.i)} onFocus={() => setHover(x.i)} onClick={() => setHover(x.i)}
            initial={{ scaleY: 0 }} animate={{ scaleY: hover === x.i ? 1.15 : 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30, delay: hover === null ? x.i * 0.006 : 0 }}
            className={`h-full flex-1 origin-bottom rounded-[2px] ${tone[x.state]} ${hover !== null && hover !== x.i ? 'opacity-40' : ''}`}
          />
        ))}
        <AnimatePresence>
          {d && (
            <motion.div key="tip" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="pointer-events-none absolute -top-11 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-line2 bg-panel2 px-2 py-1 text-[11px] text-tx"
              style={{ left: `${((d.i + 0.5) / data.length) * 100}%` }}>
              {days - d.i} days ago · <span className={d.state === 'ok' ? 'text-emerald-400' : d.state === 'degraded' ? 'text-amber-400' : 'text-rose-400'}>{d.up.toFixed(2)}%</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10px] text-faint"><span>{days} days ago</span><span>Today</span></div>
    </div>
  )
}
