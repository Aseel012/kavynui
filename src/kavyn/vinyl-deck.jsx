import { useRef, useState } from 'react'
import { motion, useMotionValue, useAnimationFrame, useTransform } from 'motion/react'

const LEN = 1860

export default function VinylDeck({ title = 'Episode 42 - Shipping slower', rpm = 33 }) {
  const rot = useMotionValue(0)
  const [playing, setPlaying] = useState(true)
  const drag = useRef(null)
  const ref = useRef(null)
  const [t, setT] = useState(0)
  useAnimationFrame((_, dt) => {
    if (playing && !drag.current) rot.set(rot.get() + (rpm * 6 * dt) / 1000)
    const s = Math.floor(((rot.get() / 360) * 1.8) % LEN)
    if (s !== t) setT(s < 0 ? s + LEN : s)
  })
  const ang = (e) => { const r = ref.current.getBoundingClientRect(); return Math.atan2(e.clientY - r.top - r.height / 2, e.clientX - r.left - r.width / 2) * 57.3 }
  const tone = useTransform(rot, (r) => `conic-gradient(from ${r}deg, #141417, #1e1e22 20%, #141417 40%, #1e1e22 60%, #141417 80%)`)
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  return (
    <div className="flex items-center gap-6">
      <motion.div
        ref={ref}
        style={{ rotate: rot, background: tone }}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); drag.current = ang(e) }}
        onPointerMove={(e) => { if (drag.current == null) return; const a = ang(e); let d = a - drag.current; if (d > 180) d -= 360; if (d < -180) d += 360; rot.set(rot.get() + d); drag.current = a }}
        onPointerUp={() => (drag.current = null)}
        className="relative size-40 cursor-grab touch-none rounded-full border border-line2 shadow-[0_0_0_6px_#0f0f11,0_20px_40px_rgba(0,0,0,.6)] active:cursor-grabbing"
      >
        {[0.82, 0.68, 0.54].map((s) => <div key={s} className="absolute rounded-full border border-white/[0.04]" style={{ inset: `${(1 - s) * 50}%` }} />)}
        <div className="absolute inset-[36%] grid place-items-center rounded-full bg-acc"><div className="size-2 rounded-full bg-bg" /></div>
      </motion.div>
      <div className="w-40">
        <div className="text-sm text-tx">{title}</div>
        <div className="mt-1 font-mono text-xs text-mute tabular-nums">{fmt(t)} / {fmt(LEN)}</div>
        <button onClick={() => setPlaying(!playing)} className="mt-3 rounded-lg border border-line2 px-3 py-1 text-xs text-tx">{playing ? 'Pause' : 'Play'}</button>
        <div className="mt-2 text-[11px] text-faint">drag the record to scrub</div>
      </div>
    </div>
  )
}
