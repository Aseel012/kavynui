'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

const WORK = [
  { t: 'Northwind Air', k: 'Booking app', g: 'from-[#a8644a] to-[#2e1810]' },
  { t: 'Ledgerly', k: 'Finance dashboard', g: 'from-[#8a8556] to-[#24220f]' },
  { t: 'Fieldnote', k: 'Writing tool', g: 'from-[#6b7f5a] to-[#1b2216]' },
  { t: 'Parcel', k: 'Delivery tracker', g: 'from-[#7a4a63] to-[#24131c]' },
  { t: 'Tidewater', k: 'Weather', g: 'from-[#b9b4ab] to-[#3a3833]' },
]

// Case studies on a sideways rail. Scrolling down moves the rail left.
export default function SidewaysGallery({ items = WORK, className = '' }) {
  const box = useRef(null), track = useRef(null), rail = useRef(null)
  const list = Array.isArray(items) && items.length ? items : WORK
  const [dist, setDist] = useState(0)
  useLayoutEffect(() => {
    const calc = () => { if (rail.current && box.current) setDist(Math.max(0, rail.current.scrollWidth - box.current.clientWidth)) }
    calc()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(calc)
    if (box.current) ro.observe(box.current)
    if (rail.current) ro.observe(rail.current)
    return () => ro.disconnect()
  }, [list.length])
  const { scrollYProgress } = useScroll({ container: box, target: track, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist])
  return (
    <div ref={box} className={`relative h-full min-h-80 w-full overflow-y-auto overflow-x-hidden overscroll-contain bg-bg [container-type:size] ${className}`}>
      <div ref={track} className="relative h-[300cqh]">
        <div className="sticky top-0 flex h-[100cqh] flex-col justify-center overflow-hidden">
          <div className="mb-4 flex items-baseline justify-between px-6">
            <h3 className="text-lg font-semibold tracking-tight text-tx">Selected work</h3>
            <span className="text-xs text-faint">{list.length} projects</span>
          </div>
          <motion.div ref={rail} style={{ x }} className="flex w-max gap-4 px-6">
            {list.map((w) => (
              <article key={w.t} className="w-[62cqw] max-w-72 shrink-0 @xl:w-64">
                <div className={`aspect-[4/3] rounded-2xl bg-gradient-to-br ${w.g || 'from-panel2 to-panel'} p-4`}>
                  <div className="h-full rounded-lg border border-white/15 bg-black/20 p-3"><div className="h-1.5 w-10 rounded-full bg-white/40" /><div className="mt-2 h-1.5 w-16 rounded-full bg-white/20" /></div>
                </div>
                <div className="mt-2 text-sm font-medium text-tx">{w.t}</div>
                <div className="text-xs text-mute">{w.k}</div>
              </article>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
