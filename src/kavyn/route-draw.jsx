import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, animate } from 'motion/react'

const D = 'M40 200 C 90 200, 90 120, 150 120 S 220 60, 270 90 S 330 170, 380 60'
const STOPS = [{ t: 0, n: 'Kitchen' }, { t: 0.45, n: 'Hub' }, { t: 1, n: 'You' }]

export default function RouteDraw({ duration = 4 }) {
  const path = useRef(null)
  const p = useMotionValue(0)
  const [pt, setPt] = useState({ x: 40, y: 200 })
  const [pts, setPts] = useState([])
  const [prog, setProg] = useState(0)
  useEffect(() => {
    const el = path.current, L = el.getTotalLength()
    setPts(STOPS.map((s) => el.getPointAtLength(L * s.t)))
    const un = p.on('change', (v) => { const q = el.getPointAtLength(L * v); setPt({ x: q.x, y: q.y }); setProg(v) })
    const c = animate(p, [0, 1, 1], { duration: duration + 1.5, times: [0, duration / (duration + 1.5), 1], ease: 'easeInOut', repeat: Infinity })
    return () => { un(); c.stop() }
  }, [p, duration])
  return (
    <div className="w-full max-w-md rounded-2xl border border-line bg-panel p-3">
      <svg viewBox="0 0 420 240" className="w-full">
        <defs><pattern id="rd-g" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#1e1e22" /></pattern></defs>
        <rect width="420" height="240" fill="url(#rd-g)" rx="10" />
        <path ref={path} d={D} fill="none" stroke="#2a2a30" strokeWidth="3" strokeDasharray="2 6" strokeLinecap="round" />
        <motion.path d={D} fill="none" stroke="#ff6a2b" strokeWidth="3" strokeLinecap="round" style={{ pathLength: p }} />
        {pts.map((s, i) => (
          <g key={i}>
            <circle cx={s.x} cy={s.y} r="5" fill={prog >= STOPS[i].t - 0.001 ? '#ff6a2b' : '#2a2a30'} />
            <text x={s.x} y={s.y - 12} textAnchor="middle" fontSize="10" fill="#8a8a93" fontFamily="ui-monospace">{STOPS[i].n}</text>
          </g>
        ))}
        <g transform={`translate(${pt.x} ${pt.y})`}>
          <circle r="11" fill="#ff6a2b" opacity=".2" />
          <circle r="6" fill="#ededef" />
        </g>
      </svg>
      <div className="flex justify-between px-1 pt-1 text-xs"><span className="text-mute">Order #2381</span><span className="font-mono text-tx">{prog >= 1 ? 'Arrived' : `${Math.max(1, Math.round((1 - prog) * 14))} min away`}</span></div>
    </div>
  )
}
