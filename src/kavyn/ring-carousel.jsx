import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionValueEvent } from 'motion/react'

const TEMPLATES = [
  { t: 'Portfolio', c: '#ff6a2b' }, { t: 'SaaS', c: '#3b82f6' }, { t: 'Docs', c: '#22c55e' }, { t: 'Store', c: '#a855f7' },
  { t: 'Blog', c: '#eab308' }, { t: 'Event', c: '#06b6d4' }, { t: 'Agency', c: '#f43f5e' }, { t: 'Waitlist', c: '#ededef' },
]

// A template gallery on a 3D ring. Drag or use arrow keys to turn it.
export default function RingCarousel({ items = TEMPLATES, onSelect, className = '' }) {
  const list = (Array.isArray(items) && items.length ? items : TEMPLATES).slice(0, 12)
  const n = list.length, step = 360 / n, radius = Math.round(90 / Math.tan(Math.PI / n)) + 20
  const rot = useMotionValue(0)
  const spring = useSpring(rot, { stiffness: 120, damping: 20 })
  const transform = useTransform(spring, (r) => `translateZ(${-radius}px) rotateY(${r}deg)`)
  const [active, setActive] = useState(0)
  const start = useRef(0)
  useMotionValueEvent(spring, 'change', (r) => setActive((((Math.round(-r / step)) % n) + n) % n))
  const snap = (r) => rot.set(Math.round(r / step) * step)
  const go = (d) => snap(rot.get() - d * step)
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <motion.div tabIndex={0} role="listbox" aria-label="Templates" aria-activedescendant={`ring-${active}`}
        onKeyDown={(e) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); if (e.key === 'Enter') onSelect?.(list[active]) }}
        onPanStart={() => { start.current = rot.get() }} onPan={(_, i) => rot.set(start.current + (i?.offset?.x || 0) * 0.4)} onPanEnd={(_, i) => snap(rot.get() + (i?.velocity?.x || 0) * 0.05)}
        className="relative h-52 w-[340px] cursor-grab touch-pan-y select-none outline-none [perspective:1000px] focus-visible:ring-2 focus-visible:ring-acc/60 active:cursor-grabbing">
        <motion.div style={{ transform }} className="absolute inset-0 [transform-style:preserve-3d]">
          {list.map((it, k) => (
            <div key={it.t} id={`ring-${k}`} role="option" aria-selected={k === active}
              style={{ transform: `rotateY(${k * step}deg) translateZ(${radius}px)` }}
              className={`absolute left-1/2 top-1/2 -ml-[70px] -mt-[90px] h-[180px] w-[140px] rounded-xl border bg-panel p-2.5 transition-opacity [backface-visibility:hidden] ${k === active ? 'border-line2 opacity-100' : 'border-line opacity-60'}`}>
              <div className="h-24 rounded-md" style={{ background: `linear-gradient(135deg, ${it.c}, #141417)` }} />
              <div className="mt-2 h-1.5 w-12 rounded-full bg-line2" /><div className="mt-1.5 h-1.5 w-20 rounded-full bg-line" />
              <div className="mt-3 text-xs font-medium text-tx">{it.t}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => go(-1)} aria-label="Previous" className="grid size-8 place-items-center rounded-full border border-line2 text-mute hover:text-tx">‹</button>
        <button type="button" onClick={() => onSelect?.(list[active])} className="min-w-28 rounded-full bg-tx px-4 py-1.5 text-xs font-medium text-bg">Use {list[active]?.t}</button>
        <button type="button" onClick={() => go(1)} aria-label="Next" className="grid size-8 place-items-center rounded-full border border-line2 text-mute hover:text-tx">›</button>
      </div>
    </div>
  )
}
