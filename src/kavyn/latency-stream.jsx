import { useEffect, useRef, useState } from 'react'

const N = 48
const next = (v) => Math.max(8, Math.min(120, v + (Math.random() - 0.5) * 18 + (38 - v) * 0.08 + (Math.random() < 0.04 ? 45 : 0)))

// Live p50 latency line that streams in from the right, with a moving average.
export default function LatencyStream({ label = 'p50 latency', unit = 'ms', interval = 700 }) {
  const [pts, setPts] = useState(() => { let v = 38; return Array.from({ length: N }, () => (v = next(v))) })
  const hidden = useRef(false)
  useEffect(() => {
    const vis = () => { hidden.current = document.hidden }
    document.addEventListener('visibilitychange', vis)
    const id = setInterval(() => { if (!hidden.current) setPts((p) => [...p.slice(1), next(p[p.length - 1])]) }, interval)
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', vis) }
  }, [interval])
  const W = 380, H = 120, max = 130
  const xy = pts.map((v, i) => [(i / (N - 1)) * W, H - (v / max) * H])
  const line = xy.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join('')
  const now = pts[pts.length - 1]
  const avg = pts.slice(-12).reduce((a, b) => a + b, 0) / 12
  return (
    <div className="w-[420px] max-w-full rounded-2xl border border-line bg-panel p-4">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs text-mute">{label}</div>
          <div className="mt-1 font-mono text-2xl tabular-nums tracking-tight text-tx">{now.toFixed(0)}<span className="ml-1 text-sm text-faint">{unit}</span></div>
        </div>
        <span className={`rounded-full px-2 py-0.5 font-mono text-[11px] ${now > avg * 1.3 ? 'bg-amber-400/15 text-amber-300' : 'bg-emerald-400/10 text-emerald-300'}`}>
          avg {avg.toFixed(0)}{unit}
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 h-28 w-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id="ls-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#ff6a2b" stopOpacity=".28" /><stop offset="1" stopColor="#ff6a2b" stopOpacity="0" /></linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="#1e1e22" strokeDasharray="3 4" />)}
        <path d={`${line}L${W},${H}L0,${H}Z`} fill="url(#ls-fill)" />
        <path d={line} fill="none" stroke="#ff6a2b" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
        <circle cx={W} cy={xy[xy.length - 1][1]} r="3.5" fill="#ff6a2b" />
        <circle cx={W} cy={xy[xy.length - 1][1]} r="3.5" fill="none" stroke="#ff6a2b" className="animate-ping" style={{ transformOrigin: `${W}px ${xy[xy.length - 1][1]}px` }} />
      </svg>
    </div>
  )
}
