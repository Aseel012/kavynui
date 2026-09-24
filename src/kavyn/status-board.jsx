import { useMemo } from 'react'
import { motion } from 'motion/react'

const SERVICES = [
  { name: 'API', inc: [61] }, { name: 'Dashboard', inc: [] }, { name: 'Edge network', inc: [12, 13] }, { name: 'DNS', inc: [] }, { name: 'Webhooks', inc: [80] },
]

// Block: public status page with overall state and 90-day history per service.
export default function StatusBoard({ services = SERVICES, days = 90 }) {
  const rows = useMemo(() => services.map((s) => ({ ...s, bars: Array.from({ length: days }, (_, i) => (s.inc.includes(i) ? 'bad' : 'ok')) })), [services, days])
  const allOk = rows.every((r) => r.bars[days - 1] === 'ok')
  return (
    <section className="@container w-full rounded-2xl border border-line bg-bg p-5 @2xl:p-8">
      <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${allOk ? 'border-emerald-400/20 bg-emerald-400/[.06]' : 'border-amber-400/30 bg-amber-400/[.06]'}`}>
        <span className="relative flex size-2.5"><span className={`absolute inset-0 animate-ping rounded-full ${allOk ? 'bg-emerald-400' : 'bg-amber-400'} opacity-60`} /><span className={`relative size-2.5 rounded-full ${allOk ? 'bg-emerald-400' : 'bg-amber-400'}`} /></span>
        <span className="text-sm text-tx">{allOk ? 'All systems operational' : 'Some systems degraded'}</span>
      </div>
      <ul className="mt-5 space-y-5">
        {rows.map((r, ri) => (
          <li key={r.name}>
            <div className="flex justify-between text-sm"><span className="text-tx">{r.name}</span><span className="font-mono text-xs text-mute">{(100 - (r.inc.length / days) * 2.1).toFixed(2)}%</span></div>
            <div className="mt-2 flex h-7 gap-px @2xl:gap-[2px]">
              {r.bars.map((b, i) => (
                <motion.span key={i} title={b === 'bad' ? 'Incident' : 'No issues'} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: ri * 0.08 + i * 0.004, type: 'spring', stiffness: 400, damping: 28 }}
                  className={`flex-1 origin-bottom rounded-[2px] ${b === 'bad' ? 'bg-amber-400' : 'bg-emerald-400/70'}`} />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
