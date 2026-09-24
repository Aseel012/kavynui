import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

export default function ServerRack({ units = 6, rps = 9 }) {
  const [hits, setHits] = useState(() => Array(units).fill(0))
  const [total, setTotal] = useState(18342)
  useEffect(() => {
    const t = setInterval(() => {
      const u = Math.floor(Math.random() * units)
      setHits((h) => h.map((v, i) => (i === u ? v + 1 : v)))
      setTotal((x) => x + 1)
    }, 1000 / rps)
    return () => clearInterval(t)
  }, [units, rps])
  return (
    <div className="w-64 rounded-xl border border-line2 bg-[#0b0b0d] p-2">
      {hits.map((h, i) => (
        <div key={i} className="mb-1.5 flex h-8 items-center gap-2 rounded-md border border-line bg-panel px-2 last:mb-0">
          <span className="font-mono text-[9px] text-faint">U{String(i + 1).padStart(2, '0')}</span>
          <div className="flex flex-1 gap-[3px]">{Array.from({ length: 10 }).map((_, k) => <span key={k} className="h-3 flex-1 rounded-[1px] bg-line" />)}</div>
          <motion.span key={h} initial={{ backgroundColor: '#ff6a2b', boxShadow: '0 0 8px #ff6a2b' }} animate={{ backgroundColor: '#3a2016', boxShadow: '0 0 0px #ff6a2b' }} transition={{ duration: 0.5 }} className="size-1.5 rounded-full" />
          <span className="size-1.5 rounded-full bg-emerald-500/80" />
        </div>
      ))}
      <div className="flex justify-between px-1 pt-2 font-mono text-[10px]"><span className="text-faint">all systems normal</span><span className="text-mute tabular-nums">{total.toLocaleString()} req</span></div>
    </div>
  )
}
