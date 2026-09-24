import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

const LAYERS = [
  { n: 'Edge', c: '#ff6a2b' }, { n: 'API', c: '#ededef' }, { n: 'Queue', c: '#8a8a93' }, { n: 'Postgres', c: '#5c5c66' },
]

export default function IsometricStack({ layers = LAYERS }) {
  const [hover, setHover] = useState(false)
  const [auto, setAuto] = useState(false)
  useEffect(() => { const t = setInterval(() => setAuto((a) => !a), 2600); return () => clearInterval(t) }, [])
  const spread = hover || auto
  return (
    <div onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)} className="relative grid h-72 w-72 place-items-center">
      {layers.map((l, i) => (
        <motion.div
          key={l.n}
          className="absolute size-36"
          style={{ zIndex: layers.length - i }}
          animate={{ y: (i - (layers.length - 1) / 2) * (spread ? 52 : 14) }}
          transition={{ type: 'spring', stiffness: 160, damping: 18, delay: i * 0.04 }}
        >
          <div className="size-full rounded-xl border bg-panel2/90 backdrop-blur-sm" style={{ transform: 'rotateX(58deg) rotateZ(-45deg)', borderColor: l.c + '99', boxShadow: `0 0 30px ${l.c}22 inset` }}>
            <div className="grid size-full grid-cols-4 gap-1.5 p-3 opacity-60">{Array.from({ length: 8 }).map((_, k) => <span key={k} className="rounded-sm" style={{ background: l.c + '33' }} />)}</div>
          </div>
          <motion.span animate={{ opacity: spread ? 1 : 0, x: spread ? 0 : -8 }} className="absolute -right-16 top-1/2 font-mono text-[11px]" style={{ color: l.c }}>{l.n}</motion.span>
        </motion.div>
      ))}
    </div>
  )
}
