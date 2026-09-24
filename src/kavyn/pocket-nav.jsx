import { useRef, useState } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'motion/react'

export default function PocketNav({ links = ['Features', 'Stories', 'Docs'] }) {
  const ref = useRef(null)
  const { scrollY } = useScroll({ container: ref })
  const [pocket, setPocket] = useState(false)
  useMotionValueEvent(scrollY, 'change', (v) => setPocket(v > 40))
  return (
    <div className="relative h-72 w-full max-w-md overflow-hidden rounded-2xl border border-line bg-bg">
      <motion.header
        layout
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        className={`absolute z-10 flex items-center gap-4 border-line2 ${pocket ? 'left-1/2 top-3 -translate-x-1/2 rounded-full border bg-panel2/90 px-4 py-2 shadow-lg backdrop-blur' : 'inset-x-0 top-0 border-b bg-bg px-5 py-3.5'}`}
      >
        <motion.span layout className="size-4 rounded bg-tx" />
        {links.map((l) => <motion.span layout key={l} className="text-xs text-mute">{l}</motion.span>)}
        <motion.span layout className={`${pocket ? '' : 'ml-auto'} rounded-full bg-acc px-2.5 py-1 text-[11px] font-medium text-bg`}>Join</motion.span>
      </motion.header>
      <div ref={ref} className="h-full overflow-y-auto px-5 pb-6 pt-16">
        <div className="text-xs text-faint">scroll inside this box</div>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="mt-4 rounded-xl border border-line bg-panel p-4">
            <div className="h-2.5 w-1/3 rounded bg-line2" /><div className="mt-2 h-2 w-4/5 rounded bg-line" /><div className="mt-1.5 h-2 w-3/5 rounded bg-line" />
          </div>
        ))}
      </div>
    </div>
  )
}
