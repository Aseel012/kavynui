import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

// A launch-page reveal. The headline steps back and the product window grows to fill the view.
export default function ZoomPortal({ title = 'Meet the new console', className = '' }) {
  const box = useRef(null), track = useRef(null)
  const { scrollYProgress: p } = useScroll({ container: box, target: track, offset: ['start start', 'end end'] })
  const scale = useTransform(p, [0, 0.7], [0.42, 1])
  const radius = useTransform(p, [0, 0.7], [28, 0])
  const titleS = useTransform(p, [0, 0.5], [1, 0.7])
  const titleO = useTransform(p, [0, 0.4], [1, 0])
  const inner = useTransform(p, [0.55, 0.85], [0, 1])
  return (
    <div ref={box} className={`relative h-full min-h-80 w-full overflow-y-auto overscroll-contain bg-bg [container-type:size] ${className}`}>
      <div ref={track} className="relative h-[280cqh]">
        <div className="sticky top-0 h-[100cqh] overflow-hidden">
          <motion.div style={{ scale: titleS, opacity: titleO }} className="absolute inset-x-0 top-[12%] z-10 text-center">
            <h3 className="text-2xl font-semibold tracking-tight text-tx @xl:text-4xl">{title}</h3>
            <p className="mt-1 text-xs text-faint">Scroll to open</p>
          </motion.div>
          <motion.div style={{ scale, borderRadius: radius }} className="absolute inset-0 origin-[50%_85%] overflow-hidden border border-line bg-panel">
            <div className="flex h-9 items-center gap-1.5 border-b border-line px-3"><span className="size-2 rounded-full bg-line2" /><span className="size-2 rounded-full bg-line2" /><span className="size-2 rounded-full bg-line2" /><span className="ml-3 h-4 w-40 rounded bg-panel2" /></div>
            <motion.div style={{ opacity: inner }} className="grid h-[calc(100%-2.25rem)] grid-cols-[120px_1fr] gap-3 p-3">
              <div className="space-y-2 rounded-lg bg-panel2 p-2">{[1, 2, 3, 4, 5].map((n) => <div key={n} className={`h-5 rounded ${n === 2 ? 'bg-acc/25' : 'bg-line'}`} />)}</div>
              <div className="grid grid-rows-[auto_1fr] gap-3">
                <div className="grid grid-cols-3 gap-3">{['Deploys', 'p95', 'Errors'].map((k, n) => <div key={k} className="rounded-lg border border-line p-2"><div className="text-[10px] text-faint">{k}</div><div className="font-mono text-sm text-tx">{['1,204', '84ms', '0.02%'][n]}</div></div>)}</div>
                <div className="flex items-end gap-1 rounded-lg border border-line p-3">{Array.from({ length: 24 }, (_, n) => <span key={n} style={{ height: `${25 + ((n * 37) % 70)}%` }} className="flex-1 rounded-sm bg-acc/70" />)}</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
