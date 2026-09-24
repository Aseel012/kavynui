import { useEffect, useRef, useState } from 'react'
import { motion, useInView, animate } from 'motion/react'

const STATS = [
  ['1.2M', 1200000, 'meals served'], ['38', 38, 'cities'], ['4.9', 4.9, 'avg rating'],
  ['92%', 92, 'on time'], ['210', 210, 'partners'], ['14k', 14000, 'volunteers'],
  ['0', 0, 'food wasted, kg'], ['7', 7, 'years'], ['99.9%', 99.9, 'uptime'],
]

function Num({ to, fmt, go, delay }) {
  const [v, setV] = useState(0)
  useEffect(() => { if (!go) return; const c = animate(0, to, { duration: 1.4, delay, ease: [0.2, 0.7, 0.2, 1], onUpdate: setV }); return () => c.stop() }, [go, to, delay])
  const s = fmt.endsWith('M') ? (v / 1e6).toFixed(1) + 'M' : fmt.endsWith('k') ? Math.round(v / 1000) + 'k' : fmt.includes('.') ? v.toFixed(1) + (fmt.endsWith('%') ? '%' : '') : Math.round(v) + (fmt.endsWith('%') ? '%' : '')
  return <span>{s}</span>
}

export default function StatWall({ stats = STATS }) {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.4 })
  return (
    <div ref={ref} className="grid w-full max-w-md grid-cols-3 gap-1.5">
      {stats.map(([f, n, l], i) => {
        const delay = ((Math.floor(i / 3) + (i % 3)) % 2) * 0.25 + Math.floor(i / 3) * 0.08
        return (
          <motion.div key={l} initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay, type: 'spring', stiffness: 200, damping: 20 }} className={`rounded-xl border border-line p-3 ${(i + Math.floor(i / 3)) % 2 ? 'bg-panel' : 'bg-panel2'}`}>
            <div className="font-mono text-xl text-tx tabular-nums"><Num to={n} fmt={f} go={inView} delay={delay} /></div>
            <div className="mt-0.5 text-[11px] text-faint">{l}</div>
          </motion.div>
        )
      })}
    </div>
  )
}
