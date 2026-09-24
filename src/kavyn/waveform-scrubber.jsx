import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'

export default function WaveformScrubber({ bars = 56, seconds = 34 }) {
  const heights = useMemo(() => Array.from({ length: bars }, (_, i) => 0.2 + Math.abs(Math.sin(i * 0.55) * 0.5 + Math.sin(i * 1.7) * 0.3)), [bars])
  const [pos, setPos] = useState(0)
  const [hover, setHover] = useState(null)
  const [play, setPlay] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!play) return
    const t = setInterval(() => setPos((p) => (p >= 1 ? (setPlay(false), 0) : p + 0.1 / seconds)), 100)
    return () => clearInterval(t)
  }, [play, seconds])
  const at = (e) => { const r = ref.current.getBoundingClientRect(); return Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) }
  return (
    <div className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-line2 bg-panel p-3">
      <motion.button whileTap={{ scale: 0.9 }} onClick={() => setPlay(!play)} className="grid size-10 shrink-0 place-items-center rounded-full bg-acc text-bg">
        {play ? <span className="flex gap-1"><i className="h-3.5 w-1 bg-bg" /><i className="h-3.5 w-1 bg-bg" /></span> : <span className="ml-0.5 border-y-[7px] border-l-[11px] border-y-transparent border-l-bg" />}
      </motion.button>
      <div ref={ref} onPointerMove={(e) => setHover(at(e))} onPointerLeave={() => setHover(null)} onClick={(e) => setPos(at(e))} className="flex h-10 flex-1 cursor-pointer items-center gap-[2px]">
        {heights.map((h, i) => {
          const f = i / bars
          const played = f <= pos, hov = hover != null && f <= hover
          return (
            <motion.span key={i} className="flex-1 rounded-full" animate={{ height: `${h * (hov ? 105 : 90)}%`, backgroundColor: played ? '#ff6a2b' : hov ? '#8a8a93' : '#2a2a30' }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} />
          )
        })}
      </div>
      <span className="w-9 text-right font-mono text-xs text-mute tabular-nums">0:{String(Math.floor(pos * seconds)).padStart(2, '0')}</span>
    </div>
  )
}
