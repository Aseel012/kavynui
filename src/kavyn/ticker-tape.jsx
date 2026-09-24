import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

const START = [['BTC', 64210], ['ETH', 3120], ['SOL', 148.2], ['ADA', 0.46], ['DOT', 6.12], ['AVAX', 27.8], ['LINK', 14.3], ['XRP', 0.58]]

const fmt = (p) => (p >= 100 ? p.toLocaleString('en-US', { maximumFractionDigits: 0 }) : p.toFixed(2))
function Item({ x }) {
  return (
    <span className="flex shrink-0 items-center gap-2 px-5 font-mono text-sm">
      <span className="text-mute">{x.s}</span>
      <span className="text-tx tabular-nums">{fmt(x.p)}</span>
      <motion.span key={x.p} initial={{ opacity: 0.2 }} animate={{ opacity: 1 }} className={x.d >= 0 ? 'text-emerald-400' : 'text-red-400'}>{x.d >= 0 ? '▲' : '▼'} {Math.abs(x.d).toFixed(2)}%</motion.span>
    </span>
  )
}

export default function TickerTape({ symbols = START, speed = 28 }) {
  const [rows, setRows] = useState(symbols.map(([s, p]) => ({ s, p, d: 0 })))
  useEffect(() => {
    const t = setInterval(() => setRows((r) => r.map((x) => { const d = (Math.random() - 0.48) * 1.4; return { ...x, p: x.p * (1 + d / 100), d } })), 1500)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="w-full overflow-hidden border-y border-line bg-panel py-3 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <motion.div className="flex w-max" animate={{ x: ['0%', '-50%'] }} transition={{ repeat: Infinity, ease: 'linear', duration: speed }}>
        {[...rows, ...rows].map((x, i) => <Item key={i} x={x} />)}
      </motion.div>
    </div>
  )
}
