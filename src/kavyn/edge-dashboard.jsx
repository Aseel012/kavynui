import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import TrafficMap from './traffic-map'

const RANGES = ['1h', '24h', '7d', '30d']
const fmt = (n) => (n >= 1e9 ? `${(n / 1e9).toFixed(2)}B` : n >= 1e6 ? `${(n / 1e6).toFixed(2)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}k` : `${Math.round(n)}`)
const spark = (seed) => Array.from({ length: 20 }, (_, i) => 0.45 + Math.sin(i * 0.7 + seed) * 0.22 + ((i * seed * 7) % 10) / 45)

function Stat({ label, value, unit = '', delta, seed, live }) {
  const [v, setV] = useState(value)
  useEffect(() => {
    setV(value)
    if (!live) return
    const id = setInterval(() => !document.hidden && setV((x) => x * (1 + Math.random() * 0.002)), 1000)
    return () => clearInterval(id)
  }, [value, live])
  const pts = spark(seed)
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${(i / 19) * 100},${30 - p * 28}`).join('')
  return (
    <div className="rounded-xl border border-line bg-panel p-4">
      <div className="flex items-center justify-between text-xs"><span className="text-mute">{label}</span><span className={delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{delta >= 0 ? '▲' : '▼'} {Math.abs(delta)}%</span></div>
      <div className="mt-2 font-mono text-2xl tabular-nums tracking-tight text-tx">{fmt(v)}<span className="ml-1 text-sm text-faint">{unit}</span></div>
      <svg viewBox="0 0 100 30" className="mt-2 h-8 w-full" preserveAspectRatio="none">
        <motion.path d={d} fill="none" stroke="#ff6a2b" strokeWidth="1.5" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: 'easeOut' }} />
      </svg>
    </div>
  )
}

const TOP = [['IN', 'India', 34.1], ['US', 'United States', 26.8], ['DE', 'Germany', 11.9], ['BR', 'Brazil', 9.2], ['SG', 'Singapore', 6.7]]

// Block: an edge analytics dashboard with live stats, a request map and top countries.
export default function EdgeDashboard({ title = 'Traffic overview' }) {
  const [range, setRange] = useState('24h')
  const k = RANGES.indexOf(range) + 1
  return (
    <section className="@container w-full rounded-2xl border border-line bg-bg p-3 @2xl:p-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-lg bg-acc/15 text-acc"><svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h4l3-8 4 16 3-8h4" /></svg></span>
          <div><div className="text-sm font-medium leading-5 text-tx">{title}</div><div className="flex items-center gap-1.5 text-[11px] leading-4 text-mute"><span className="size-1.5 rounded-full bg-emerald-400" />Live</div></div>
        </div>
        <div className="flex rounded-lg border border-line2 bg-panel p-0.5">
          {RANGES.map((r) => (
            <button key={r} type="button" onClick={() => setRange(r)} className="relative px-3 py-1 text-xs">
              {range === r && <motion.span layoutId="ed-range" className="absolute inset-0 rounded-md bg-line2" transition={{ type: 'spring', stiffness: 480, damping: 34 }} />}
              <span className={`relative ${range === r ? 'text-tx' : 'text-mute'}`}>{r}</span>
            </button>
          ))}
        </div>
      </header>
      <div className="mt-4 grid grid-cols-2 gap-2 @4xl:grid-cols-4">
        <Stat label="Requests" value={4.82e6 * k * k} delta={12.4} seed={1} live />
        <Stat label="Bandwidth" value={318e3 * k * k} unit="MB" delta={8.1} seed={2} />
        <Stat label="Threats blocked" value={18244 * k} delta={-3.2} seed={3} live />
        <Stat label="Cache hit" value={91} unit="%" delta={1.6} seed={4} />
      </div>
      <div className="mt-2 grid gap-2 @4xl:grid-cols-[1fr_260px]">
        <div className="rounded-xl border border-line bg-panel p-4">
          <div className="mb-3 flex items-center justify-between text-xs"><span className="text-tx">Traffic by edge location</span><span className="flex items-center gap-1.5 text-mute"><span className="size-1.5 animate-pulse rounded-full bg-acc" />Live</span></div>
          <TrafficMap />
        </div>
        <div className="rounded-xl border border-line bg-panel p-4">
          <div className="mb-3 text-xs text-tx">Top countries</div>
          <ul className="space-y-3">
            {TOP.map(([cc, name, v], i) => (
              <li key={cc} className="text-xs">
                <div className="flex justify-between"><span className="text-tx"><span className="mr-2 font-mono text-[10px] text-faint">{cc}</span>{name}</span><span className="font-mono text-mute">{v}%</span></div>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-line"><motion.div className="h-full rounded-full bg-acc" initial={{ width: 0 }} animate={{ width: `${(v / 34.1) * 100}%` }} transition={{ delay: 0.2 + i * 0.08, type: 'spring', stiffness: 90, damping: 18 }} /></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
