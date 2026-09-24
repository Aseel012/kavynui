import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

const KPIS = [
  { k: 'Active users', v: '12,480', d: '+8.2%' }, { k: 'MRR', v: '₹9.4L', d: '+3.1%' },
  { k: 'Churn', v: '1.8%', d: '-0.4%' }, { k: 'NPS', v: '62', d: '+5' },
]
const S = 176

export default function CubeMetrics({ kpis = KPIS, every = 2400 }) {
  const [i, setI] = useState(0)
  useEffect(() => { const t = setInterval(() => setI((x) => x + 1), every); return () => clearInterval(t) }, [every])
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="[perspective:800px]" style={{ width: S, height: S }}>
        <motion.div className="relative size-full" style={{ transformStyle: 'preserve-3d' }} animate={{ rotateX: i * -90 }} transition={{ type: 'spring', stiffness: 90, damping: 14 }}>
          {kpis.map((m, f) => (
            <div key={f} className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-line2 bg-panel2 p-5" style={{ transform: `rotateX(${f * 90}deg) translateZ(${S / 2}px)`, backfaceVisibility: 'hidden' }}>
              <span className="text-xs uppercase tracking-widest text-faint">{m.k}</span>
              <span className="text-4xl font-medium tracking-tight text-tx">{m.v}</span>
              <span className={`font-mono text-xs ${m.d.startsWith('-') && m.k !== 'Churn' ? 'text-red-400' : 'text-emerald-400'}`}>{m.d} this week</span>
            </div>
          ))}
        </motion.div>
      </div>
      <div className="flex gap-1.5">{kpis.map((_, f) => <motion.button key={f} onClick={() => setI(f + Math.floor(i / kpis.length) * kpis.length)} animate={{ width: i % kpis.length === f ? 18 : 6, backgroundColor: i % kpis.length === f ? '#ff6a2b' : '#2a2a30' }} className="h-1.5 rounded-full" />)}</div>
    </div>
  )
}
