import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const WS = [{ n: 'Acme Studio', c: '#ff6a2b', m: 12 }, { n: 'Personal', c: '#6b8f5e', m: 1 }, { n: 'Side project', c: '#3f7cac', m: 3 }]

export default function WorkspaceShuffle({ workspaces = WS }) {
  const [order, setOrder] = useState(workspaces.map((_, i) => i))
  const [open, setOpen] = useState(false)
  const pick = (i) => { setOrder([i, ...order.filter((x) => x !== i)]); setOpen(false) }
  return (
    <div className="relative h-64 w-64">
      {order.map((wi, depth) => {
        const w = workspaces[wi]
        return (
          <motion.button key={w.n} onClick={() => (open ? pick(wi) : setOpen(true))}
            animate={open ? { y: depth * 64, scale: 1, opacity: 1 } : { y: depth * 8, scale: 1 - depth * 0.05, opacity: depth > 2 ? 0 : 1 - depth * 0.25 }}
            transition={{ type: 'spring', stiffness: 360, damping: 30 }} style={{ zIndex: 10 - depth }}
            className="absolute inset-x-0 top-0 flex h-14 items-center gap-3 rounded-xl border border-line2 bg-panel2 px-3 text-left shadow-[0_10px_24px_rgba(0,0,0,.4)]">
            <span className="grid size-8 place-items-center rounded-lg text-xs font-semibold text-bg" style={{ background: w.c }}>{w.n[0]}</span>
            <span className="flex-1"><span className="block text-sm text-tx">{w.n}</span><span className="block text-[11px] text-faint">{w.m} members</span></span>
            {depth === 0 && !open && <span className="text-xs text-mute">⇅</span>}
          </motion.button>
        )
      })}
      <AnimatePresence>{open && <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="absolute inset-x-0 text-xs text-faint" style={{ top: workspaces.length * 64 + 4 }}>close</motion.button>}</AnimatePresence>
    </div>
  )
}
