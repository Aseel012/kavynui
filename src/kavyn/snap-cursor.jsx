import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

const LINKS = ['Work', 'Studio', 'Journal', 'Contact']

// An agency header with its own cursor. The dot follows you and wraps any link you hover.
// Touch screens keep their normal behavior.
export default function SnapCursor({ links = LINKS, brand = 'Northside', className = '' }) {
  const box = useRef(null)
  const list = Array.isArray(links) && links.length ? links : LINKS
  const x = useMotionValue(-100), y = useMotionValue(-100), w = useMotionValue(10), h = useMotionValue(10)
  const cfg = { stiffness: 420, damping: 32, mass: 0.6 }
  const sx = useSpring(x, cfg), sy = useSpring(y, cfg), sw = useSpring(w, cfg), sh = useSpring(h, cfg)
  const [on, setOn] = useState(false)
  const [snapped, setSnapped] = useState(false)
  const move = (e) => {
    if (e.pointerType && e.pointerType !== 'mouse') return
    const r = box.current?.getBoundingClientRect()
    if (!r) return
    setOn(true)
    const t = e.target instanceof Element ? e.target.closest('[data-snap]') : null
    if (t && box.current.contains(t)) {
      const b = t.getBoundingClientRect()
      x.set(b.left - r.left - 6); y.set(b.top - r.top - 4); w.set(b.width + 12); h.set(b.height + 8); setSnapped(true)
    } else {
      x.set(e.clientX - r.left - 5); y.set(e.clientY - r.top - 5); w.set(10); h.set(10); setSnapped(false)
    }
  }
  return (
    <div ref={box} onPointerMove={move} onPointerLeave={() => setOn(false)}
      className={`relative grid h-full min-h-72 w-full place-items-center overflow-hidden bg-bg ${on ? '[&_*]:cursor-none cursor-none' : ''} ${className}`}>
      <div className="flex w-[min(560px,92%)] items-center justify-between rounded-2xl border border-line bg-panel px-4 py-3">
        <a href="#" onClick={(e) => e.preventDefault()} data-snap className="text-sm font-semibold tracking-tight text-tx">{brand}</a>
        <nav className="flex gap-1">
          {list.map((l) => <a key={l} href="#" onClick={(e) => e.preventDefault()} data-snap className="hidden rounded-md px-2.5 py-1 text-sm text-mute transition-colors hover:text-tx sm:block">{l}</a>)}
          <a href="#" onClick={(e) => e.preventDefault()} data-snap className="rounded-md px-2.5 py-1 text-sm text-mute hover:text-tx sm:hidden">Menu</a>
        </nav>
      </div>
      <motion.div aria-hidden style={{ x: sx, y: sy, width: sw, height: sh, opacity: on ? 1 : 0 }}
        className={`pointer-events-none absolute left-0 top-0 rounded-full ${snapped ? 'rounded-lg border border-acc/70 bg-acc/10' : 'bg-acc'}`} />
    </div>
  )
}
