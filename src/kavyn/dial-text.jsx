import { useState } from 'react'
import { motion } from 'motion/react'

const AB = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 '

function Wheel({ ch, spin, i }) {
  const idx = Math.max(0, AB.indexOf(ch.toUpperCase()))
  return (
    <span className="relative h-12 w-8 overflow-hidden rounded-md border border-line bg-panel2 font-mono text-2xl text-tx [mask-image:linear-gradient(transparent,#000_30%,#000_70%,transparent)]">
      <motion.span
        className="absolute inset-x-0 top-0 flex flex-col items-center"
        initial={false}
        animate={{ y: -(idx + AB.length * spin) * 48 }}
        transition={{ type: 'spring', stiffness: 60, damping: 14, mass: 1 + i * 0.15 }}
      >
        {Array.from({ length: AB.length * (spin + 1) }, (_, k) => (
          <span key={k} className="grid h-12 place-items-center">{AB[k % AB.length] === ' ' ? '\u00a0' : AB[k % AB.length]}</span>
        ))}
      </motion.span>
    </span>
  )
}

export default function DialText({ words = ['UNLOCKED', 'NEW CODE', 'VERIFIED'] }) {
  const [n, setN] = useState(0)
  const w = words[n % words.length].padEnd(8, ' ')
  return (
    <button onClick={() => setN(n + 1)} className="flex flex-col items-center gap-3">
      <span className="flex gap-1">{w.split('').map((c, i) => <Wheel key={i} ch={c} spin={n % 2} i={i} />)}</span>
      <span className="text-xs text-faint">click to turn</span>
    </button>
  )
}
