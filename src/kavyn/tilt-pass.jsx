import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'motion/react'

export default function TiltPass({ name = 'Aseel K.', tier = 'Founding member', id = 'KV-0042' }) {
  const ref = useRef(null)
  const px = useMotionValue(0.5), py = useMotionValue(0.5)
  const rx = useSpring(useTransform(py, [0, 1], [14, -14]), { stiffness: 200, damping: 18 })
  const ry = useSpring(useTransform(px, [0, 1], [-18, 18]), { stiffness: 200, damping: 18 })
  const gx = useTransform(px, (v) => `${v * 100}%`), gy = useTransform(py, (v) => `${v * 100}%`)
  const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,.22), transparent 45%)`
  return (
    <div className="[perspective:900px]">
      <motion.div
        ref={ref}
        onPointerMove={(e) => { const r = ref.current.getBoundingClientRect(); px.set((e.clientX - r.left) / r.width); py.set((e.clientY - r.top) / r.height) }}
        onPointerLeave={() => { px.set(0.5); py.set(0.5) }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className="relative h-48 w-80 overflow-hidden rounded-2xl border border-line2 bg-[linear-gradient(135deg,#1b1b20,#0c0c0e_60%,#1f140e)] p-5 shadow-[0_30px_60px_rgba(0,0,0,.6)]"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold tracking-tight text-tx">kavyn<span className="text-faint">UI</span></span>
          <span className="font-mono text-[10px] text-faint">{id}</span>
        </div>
        <div className="mt-8 h-7 w-10 rounded-md bg-gradient-to-br from-[#d8b27a] to-[#8a6a3a]" style={{ transform: 'translateZ(30px)' }} />
        <div className="absolute bottom-5 left-5" style={{ transform: 'translateZ(40px)' }}>
          <div className="text-lg font-medium text-tx">{name}</div>
          <div className="text-xs text-acc">{tier}</div>
        </div>
        <motion.div style={{ background: glare }} className="pointer-events-none absolute inset-0 mix-blend-screen" />
      </motion.div>
    </div>
  )
}
