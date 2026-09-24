import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, animate } from 'motion/react'

const W = 180, H = 70, D = 90

export default function TurntableViewer({ label = 'RUNNER 02' }) {
  const rot = useMotionValue(-30)
  const s = useSpring(rot, { stiffness: 120, damping: 20 })
  const deg = useTransform(s, (v) => `${Math.round((((v % 360) + 360) % 360))}°`)
  const last = useRef(null)
  const face = (t, w, h, bg, extra = '') => <div className={`absolute left-1/2 top-1/2 ${extra}`} style={{ width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2, transform: t, background: bg, backfaceVisibility: 'hidden' }} />
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); last.current = { x: e.clientX, t: performance.now(), v: 0 } }}
        onPointerMove={(e) => { if (!last.current) return; const dx = e.clientX - last.current.x; const now = performance.now(); last.current.v = dx / Math.max(now - last.current.t, 1); last.current.x = e.clientX; last.current.t = now; rot.set(rot.get() + dx * 0.8) }}
        onPointerUp={() => { const v = last.current?.v || 0; last.current = null; animate(rot, rot.get() + v * 260, { type: 'spring', stiffness: 40, damping: 18 }) }}
        className="grid h-56 w-72 cursor-grab touch-none place-items-center [perspective:700px] active:cursor-grabbing"
      >
        <motion.div style={{ rotateY: s, rotateX: -14, transformStyle: 'preserve-3d' }} className="relative size-0">
          {face(`translateZ(${D / 2}px)`, W, H, 'linear-gradient(180deg,#ededef,#b9b9c0)', 'rounded-t-[40px_60px] rounded-b-md')}
          {face(`rotateY(180deg) translateZ(${D / 2}px)`, W, H, 'linear-gradient(180deg,#d0d0d6,#8a8a93)', 'rounded-t-[60px_40px] rounded-b-md')}
          {face(`rotateY(90deg) translateZ(${W / 2}px)`, D, H, '#ff6a2b', 'rounded-t-3xl rounded-b-md')}
          {face(`rotateY(-90deg) translateZ(${W / 2}px)`, D, H * 0.7, '#9a9aa2', 'rounded-t-lg translate-y-[10px]')}
          {face(`rotateX(90deg) translateZ(${H / 2}px)`, W, D, '#1e1e22', 'rounded-full')}
          {face(`rotateX(-90deg) translateZ(${H / 2}px)`, W + 10, D + 6, '#ff6a2b', 'rounded-[40px]')}
        </motion.div>
      </div>
      <div className="flex items-center gap-3 font-mono text-xs text-mute"><span>{label}</span><motion.span className="text-tx">{deg}</motion.span><span className="text-faint">drag to spin</span></div>
    </div>
  )
}
