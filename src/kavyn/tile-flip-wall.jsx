import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

export default function TileFlipWall({ children, cols = 10, rows = 6 }) {
  const [side, setSide] = useState(false)
  const [origin, setOrigin] = useState([0, 0])
  useEffect(() => { const t = setInterval(() => { setOrigin([Math.floor(Math.random() * cols), Math.floor(Math.random() * rows)]); setSide((s) => !s) }, 3600); return () => clearInterval(t) }, [cols, rows])
  return (
    <div className="relative size-full min-h-64 overflow-hidden bg-bg">
      <div className="absolute inset-0 grid gap-px" style={{ gridTemplateColumns: `repeat(${cols},1fr)`, gridTemplateRows: `repeat(${rows},1fr)` }}>
        {Array.from({ length: cols * rows }).map((_, i) => {
          const x = i % cols, y = Math.floor(i / cols)
          const pos = `${(x / (cols - 1)) * 100}% ${(y / (rows - 1)) * 100}%`
          return (
            <div key={i} className="[perspective:400px]">
              <motion.div className="relative size-full" style={{ transformStyle: 'preserve-3d' }} animate={{ rotateY: side ? 180 : 0 }} transition={{ type: 'spring', stiffness: 120, damping: 16, delay: Math.hypot(x - origin[0], y - origin[1]) * 0.05 }}>
                <div className="absolute inset-0 bg-panel [backface-visibility:hidden]" />
                <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]" style={{ backgroundImage: 'linear-gradient(135deg,#ff6a2b,#7a2a10 50%,#141417)', backgroundSize: `${cols * 100}% ${rows * 100}%`, backgroundPosition: pos }} />
              </motion.div>
            </div>
          )
        })}
      </div>
      <div className="relative grid size-full min-h-64 place-items-center">{children}</div>
    </div>
  )
}
