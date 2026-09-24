import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const COUNTRIES = ['US', 'DE', 'IN', 'BR', 'SG', 'NL', 'FR', 'JP', 'GB', 'VN']
const RULES = [
  { rule: 'SQLi attempt', act: 'Block' }, { rule: 'Bot score < 10', act: 'Challenge' }, { rule: 'Rate limit /login', act: 'Block' },
  { rule: 'Path traversal', act: 'Block' }, { rule: 'Known bad ASN', act: 'Challenge' }, { rule: 'XSS payload', act: 'Block' },
]
let uid = 0
const make = () => {
  const r = RULES[(Math.random() * RULES.length) | 0]
  return { id: ++uid, cc: COUNTRIES[(Math.random() * COUNTRIES.length) | 0], ip: `${(Math.random() * 223 + 1) | 0}.${(Math.random() * 255) | 0}.x.x`, ...r }
}

// Security events sliding into a live list. New rows push old ones out.
export default function ThreatFeed({ rows = 5, interval = 1400 }) {
  const [items, setItems] = useState(() => Array.from({ length: rows }, make))
  const [total, setTotal] = useState(18244)
  const paused = useRef(false)
  useEffect(() => {
    const id = setInterval(() => {
      if (paused.current || document.hidden) return
      setItems((l) => [make(), ...l].slice(0, rows))
      setTotal((t) => t + 1 + ((Math.random() * 4) | 0))
    }, interval)
    return () => clearInterval(id)
  }, [rows, interval])
  return (
    <div className="w-[420px] max-w-full overflow-hidden rounded-2xl border border-line bg-panel"
      onMouseEnter={() => (paused.current = true)} onMouseLeave={() => (paused.current = false)}>
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <span className="text-sm text-tx">Security events</span>
        <span className="font-mono text-xs tabular-nums text-mute">{total.toLocaleString('en-US')} mitigated · 24h</span>
      </div>
      <ul className="relative">
        <AnimatePresence initial={false}>
          {items.map((it, i) => (
            <motion.li key={it.id} layout initial={{ opacity: 0, y: -18, backgroundColor: 'rgba(255,106,43,0.10)' }}
              animate={{ opacity: 1 - i * 0.12, y: 0, backgroundColor: 'rgba(255,106,43,0)' }} exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 32, backgroundColor: { duration: 1.2 } }}
              className="grid grid-cols-[34px_1fr_auto] items-center gap-3 border-b border-line px-4 py-2.5 text-xs last:border-0">
              <span className="rounded bg-panel2 px-1.5 py-0.5 text-center font-mono text-[10px] text-mute">{it.cc}</span>
              <span className="min-w-0 truncate"><span className="text-tx">{it.rule}</span> <span className="font-mono text-faint">{it.ip}</span></span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] ${it.act === 'Block' ? 'bg-rose-500/15 text-rose-300' : 'bg-amber-400/15 text-amber-300'}`}>{it.act}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}
