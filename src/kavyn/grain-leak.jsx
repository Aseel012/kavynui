import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'

export default function GrainLeak({ children }) {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current, ctx = c.getContext('2d')
    c.width = 160; c.height = 160
    let raf, f = 0
    const draw = () => {
      if (f++ % 3 === 0) {
        const img = ctx.createImageData(160, 160)
        for (let i = 0; i < img.data.length; i += 4) { const v = Math.random() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 22 }
        ctx.putImageData(img, 0, 0)
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <div className="relative size-full min-h-64 overflow-hidden bg-[#0c0b0b]">
      <motion.div className="absolute -left-1/4 -top-1/3 h-[120%] w-[80%] rounded-full bg-[radial-gradient(closest-side,rgba(255,106,43,.45),rgba(255,60,90,.15),transparent)] blur-2xl"
        animate={{ x: ['0%', '40%', '10%', '0%'], y: ['0%', '15%', '30%', '0%'], opacity: [0.5, 0.9, 0.6, 0.5] }} transition={{ repeat: Infinity, duration: 16, ease: 'easeInOut' }} />
      <motion.div className="absolute -bottom-1/3 -right-1/4 h-[90%] w-[60%] rounded-full bg-[radial-gradient(closest-side,rgba(255,190,120,.25),transparent)] blur-2xl"
        animate={{ x: ['0%', '-30%', '0%'], opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }} />
      <canvas ref={ref} className="absolute inset-0 size-full [image-rendering:pixelated] mix-blend-overlay" style={{ opacity: 0.9 }} />
      <div className="relative grid size-full min-h-64 place-items-center">{children}</div>
    </div>
  )
}
