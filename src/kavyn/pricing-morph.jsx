import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const PLANS = [
  { n: 'Solo', m: 12, y: 9, f: ['1 workspace', '5 GB'] },
  { n: 'Team', m: 29, y: 23, f: ['Unlimited workspaces', '100 GB', 'Roles'], hot: true },
]

export default function PricingMorph({ plans = PLANS, currency = '$' }) {
  const [yearly, setYearly] = useState(false)
  return (
    <div className="w-full max-w-md">
      <div className="mx-auto mb-5 flex w-fit rounded-full border border-line2 bg-panel p-1 text-xs">
        {['Monthly', 'Yearly'].map((l, i) => (
          <button key={l} onClick={() => setYearly(!!i)} className="relative px-4 py-1.5">
            {yearly === !!i && <motion.span layoutId="pm-pill" className="absolute inset-0 rounded-full bg-tx" transition={{ type: 'spring', stiffness: 420, damping: 32 }} />}
            <span className={`relative ${yearly === !!i ? 'text-bg' : 'text-mute'}`}>{l}</span>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {plans.map((p) => (
          <motion.div layout key={p.n} transition={{ type: 'spring', stiffness: 300, damping: 28 }} className={`rounded-2xl border p-4 ${p.hot ? 'border-acc/50 bg-panel2' : 'border-line bg-panel'}`}>
            <div className="text-sm text-mute">{p.n}</div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-mute">{currency}</span>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span key={yearly ? p.y : p.m} initial={{ y: 16, opacity: 0, filter: 'blur(4px)' }} animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }} exit={{ y: -16, opacity: 0, filter: 'blur(4px)' }} transition={{ type: 'spring', stiffness: 400, damping: 28 }} className="text-3xl font-medium text-tx">
                  {yearly ? p.y : p.m}
                </motion.span>
              </AnimatePresence>
              <span className="text-xs text-faint">/mo</span>
            </div>
            <AnimatePresence>
              {yearly && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden text-xs text-acc">billed {currency}{p.y * 12} yearly</motion.div>}
            </AnimatePresence>
            <ul className="mt-3 space-y-1 text-xs text-mute">{p.f.map((f) => <li key={f}>· {f}</li>)}</ul>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
