import { useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'motion/react'

export default function ScanLineText({ text = 'ship --prod', sub = 'deploys in 41s' }) {
  const p = useMotionValue(0)
  useEffect(() => {
    const c = animate(p, [0, 100, 100], { duration: 3.4, times: [0, 0.6, 1], repeat: Infinity, ease: 'easeInOut' })
    return () => c.stop()
  }, [p])
  const clip = useTransform(p, (v) => `inset(0 0 ${100 - v}% 0)`)
  const top = useTransform(p, (v) => `${v}%`)
  return (
    <div className="relative px-2 font-mono">
      <div className="text-5xl font-medium tracking-tight text-mute/60 blur-[3px]">{text}</div>
      <motion.div style={{ clipPath: clip }} className="absolute inset-0 px-2 text-5xl font-medium tracking-tight text-tx">{text}</motion.div>
      <motion.div style={{ top }} className="pointer-events-none absolute inset-x-0 h-[2px] bg-acc shadow-[0_0_14px_2px_rgba(255,106,43,.6)]" />
      <div className="mt-3 text-xs text-faint">{sub}</div>
    </div>
  )
}
