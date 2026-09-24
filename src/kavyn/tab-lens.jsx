import { useId, useState } from 'react'
import { motion } from 'motion/react'

export default function TabLens({ items = ['Product', 'Customers', 'Changelog', 'Docs'], defaultIndex = 0, onChange }) {
  const id = useId()
  const [active, setActive] = useState(defaultIndex)
  const [hover, setHover] = useState(null)
  const lens = hover ?? active
  return (
    <nav className="flex rounded-full border border-line2 bg-panel p-1" onPointerLeave={() => setHover(null)}>
      {items.map((it, i) => (
        <button key={it} onPointerEnter={() => setHover(i)} onClick={() => { setActive(i); onChange?.(i) }} className="relative px-4 py-2 text-sm">
          {lens === i && (
            <motion.span layoutId={id + 'lens'} className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_4px_14px_rgba(0,0,0,.4)]" transition={{ type: 'spring', stiffness: 420, damping: 32 }} />
          )}
          <motion.span className="relative inline-block" animate={{ scale: lens === i ? 1.1 : 1, color: active === i ? '#ededef' : lens === i ? '#d0d0d6' : '#8a8a93' }} transition={{ type: 'spring', stiffness: 420, damping: 26 }}>
            {it}
          </motion.span>
          {active === i && <motion.span layoutId={id + 'dot'} className="absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-acc" />}
        </button>
      ))}
    </nav>
  )
}
