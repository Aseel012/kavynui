import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const MERCH = ['Swiggy', 'Figma', 'Uber', 'AWS', 'Blue Tokai', 'Zerodha', 'Notion']

function Cell({ className = '', children }) {
  return <div className={`rounded-2xl border border-line bg-panel p-4 ${className}`}>{children}</div>
}

export default function LedgerBento() {
  const [bal, setBal] = useState(284120)
  const [tx, setTx] = useState([{ id: 1, m: 'Figma', a: -1250 }, { id: 2, m: 'Salary', a: 180000 }, { id: 3, m: 'Uber', a: -412 }])
  const [fx, setFx] = useState(83.42)
  useEffect(() => {
    const t = setInterval(() => {
      const a = -Math.floor(Math.random() * 2400 + 90)
      setTx((l) => [{ id: Date.now(), m: MERCH[Math.floor(Math.random() * MERCH.length)], a }, ...l].slice(0, 3))
      setBal((b) => b + a)
      setFx((f) => +(f + (Math.random() - 0.5) * 0.08).toFixed(2))
    }, 2200)
    return () => clearInterval(t)
  }, [])
  const spent = Math.min(1, (284120 - bal + 40000) / 120000)
  return (
    <div className="grid w-full max-w-lg grid-cols-2 gap-2 sm:grid-cols-3">
      <Cell className="col-span-2">
        <div className="text-xs text-faint">Balance</div>
        <motion.div key={bal} initial={{ y: -6, opacity: 0.4 }} animate={{ y: 0, opacity: 1 }} className="mt-1 font-mono text-3xl tracking-tight text-tx tabular-nums">₹{bal.toLocaleString('en-IN')}</motion.div>
      </Cell>
      <Cell>
        <div className="text-xs text-faint">USD / INR</div>
        <motion.div key={fx} initial={{ color: '#ff6a2b' }} animate={{ color: '#ededef' }} transition={{ duration: 1 }} className="mt-1 font-mono text-xl tabular-nums">{fx}</motion.div>
      </Cell>
      <Cell className="col-span-2 sm:col-span-2">
        <div className="mb-2 text-xs text-faint">Latest</div>
        <ul className="space-y-1.5">
          <AnimatePresence initial={false}>
            {tx.map((t) => (
              <motion.li layout key={t.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 32 }} className="flex justify-between text-sm">
                <span className="text-mute">{t.m}</span><span className={`font-mono ${t.a > 0 ? 'text-emerald-400' : 'text-tx'}`}>{t.a > 0 ? '+' : ''}{t.a.toLocaleString('en-IN')}</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </Cell>
      <Cell className="col-span-2 sm:col-span-1">
        <div className="text-xs text-faint">Card budget</div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-line"><motion.div className="h-full rounded-full bg-acc" animate={{ width: `${spent * 100}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} /></div>
        <div className="mt-2 font-mono text-xs text-mute">{Math.round(spent * 100)}% used</div>
      </Cell>
    </div>
  )
}
