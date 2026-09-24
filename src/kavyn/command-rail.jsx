import { useState } from 'react'
import { motion } from 'motion/react'

const ITEMS = [
  { i: '◧', l: 'Overview', k: 'G O' }, { i: '◎', l: 'Customers', k: 'G C' }, { i: '▤', l: 'Invoices', k: 'G I' },
  { i: '◇', l: 'Reports', k: 'G R' }, { i: '⚙', l: 'Settings', k: '⌘ ,' },
]

export default function CommandRail({ items = ITEMS }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  return (
    <motion.aside onPointerEnter={() => setOpen(true)} onPointerLeave={() => setOpen(false)}
      animate={{ width: open ? 208 : 56 }} transition={{ type: 'spring', stiffness: 380, damping: 34 }}
      className="flex h-72 flex-col gap-1 overflow-hidden rounded-2xl border border-line2 bg-panel p-2">
      {items.map((it, i) => (
        <button key={it.l} onClick={() => setActive(i)} className="relative flex h-10 shrink-0 items-center gap-3 rounded-lg px-3 text-left">
          {active === i && <motion.span layoutId="cr-act" className="absolute inset-0 rounded-lg bg-line" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
          <span className={`relative w-4 text-center ${active === i ? 'text-acc' : 'text-mute'}`}>{it.i}</span>
          <motion.span animate={{ opacity: open ? 1 : 0, x: open ? 0 : -6 }} className="relative flex flex-1 items-center justify-between whitespace-nowrap text-sm text-tx">
            {it.l}<kbd className="rounded border border-line2 px-1 font-mono text-[10px] text-faint">{it.k}</kbd>
          </motion.span>
        </button>
      ))}
    </motion.aside>
  )
}
