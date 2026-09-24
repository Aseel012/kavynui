import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'

function Product() {
  return (
    <div className="relative size-full bg-[radial-gradient(circle_at_50%_40%,#2a2a30,#0f0f11_70%)]">
      <div className="absolute left-1/2 top-1/2 h-[46%] w-[62%] -translate-x-1/2 -translate-y-1/2 -rotate-12 rounded-[40%_60%_30%_30%/50%_50%_20%_20%] bg-gradient-to-br from-[#ededef] to-[#8a8a93] shadow-2xl">
        <div className="absolute bottom-[12%] left-[8%] right-[6%] h-[16%] rounded-full bg-acc" />
        <div className="absolute left-[30%] top-[22%] h-[30%] w-[34%] rounded-[50%] border-[3px] border-dashed border-[#5c5c66]" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="absolute h-[3px] w-[10%] rounded bg-[#5c5c66]" style={{ left: `${32 + i * 7}%`, top: `${30 + i * 4}%` }} />
        ))}
      </div>
      <div className="absolute bottom-4 left-4 font-mono text-[10px] text-faint">RUNNER 02 / CLAY</div>
    </div>
  )
}

export default function LensLoupe({ zoom = 2.4, size = 130 }) {
  const ref = useRef(null)
  const [on, setOn] = useState(false)
  const [box, setBox] = useState({ w: 1, h: 1 })
  const x = useMotionValue(0), y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 500, damping: 40 }), sy = useSpring(y, { stiffness: 500, damping: 40 })
  const ix = useTransform(sx, (v) => -v * zoom + size / 2), iy = useTransform(sy, (v) => -v * zoom + size / 2)
  const lx = useTransform(sx, (v) => v - size / 2), ly = useTransform(sy, (v) => v - size / 2)
  return (
    <div
      ref={ref}
      onPointerEnter={() => { const r = ref.current.getBoundingClientRect(); setBox({ w: r.width, h: r.height }); setOn(true) }}
      onPointerLeave={() => setOn(false)}
      onPointerMove={(e) => { const r = ref.current.getBoundingClientRect(); x.set(e.clientX - r.left); y.set(e.clientY - r.top) }}
      className="relative aspect-[4/3] w-full max-w-sm cursor-none overflow-hidden rounded-2xl border border-line"
    >
      <Product />
      <motion.div
        style={{ x: lx, y: ly, width: size, height: size }}
        animate={{ scale: on ? 1 : 0, opacity: on ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        className="pointer-events-none absolute left-0 top-0 overflow-hidden rounded-full border-2 border-tx/80 shadow-[0_10px_40px_rgba(0,0,0,.6)]"
      >
        <motion.div style={{ x: ix, y: iy, width: box.w * zoom, height: box.h * zoom }} className="absolute left-0 top-0">
          <div style={{ width: box.w, height: box.h, transform: `scale(${zoom})`, transformOrigin: '0 0' }}><Product /></div>
        </motion.div>
      </motion.div>
    </div>
  )
}
