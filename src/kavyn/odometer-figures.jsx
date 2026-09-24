import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

function Digit({ d }) {
  return (
    <span className="relative inline-block h-[1em] w-[0.62em] overflow-hidden">
      <motion.span
        className="absolute inset-x-0 top-0 flex flex-col"
        animate={{ y: `${-d}em` }}
        transition={{ type: 'spring', stiffness: 140, damping: 15, mass: 0.9 }}
      >
        {Array.from({ length: 10 }, (_, n) => <span key={n} className="h-[1em] leading-none">{n}</span>)}
      </motion.span>
    </span>
  )
}

export default function OdometerFigures({ value, prefix = '$', auto = true }) {
  const [v, setV] = useState(value ?? 48210)
  useEffect(() => { if (value != null) setV(value) }, [value])
  useEffect(() => {
    if (!auto || value != null) return
    const t = setInterval(() => setV((x) => x + Math.floor(Math.random() * 900) + 80), 2200)
    return () => clearInterval(t)
  }, [auto, value])
  const s = v.toLocaleString('en-US')
  return (
    <div className="flex flex-col items-start gap-2">
      <span className="text-xs uppercase tracking-widest text-faint">Revenue today</span>
      <div className="flex items-end font-mono text-5xl font-medium leading-none tracking-tight text-tx tabular-nums">
        <span className="mr-1 inline-block h-[1em] leading-none text-mute">{prefix}</span>
        {s.split('').map((c, i) => (c === ',' ? <span key={i} className="inline-block h-[1em] w-[0.3em] leading-none text-faint">,</span> : <Digit key={s.length - i} d={+c} />))}
      </div>
    </div>
  )
}
