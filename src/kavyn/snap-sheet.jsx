import { useRef, useState } from 'react'
import { motion, useAnimate } from 'motion/react'

export default function SnapSheet({ snaps = [0.15, 0.5, 0.88], height = 380 }) {
  const [scope, animate] = useAnimate()
  const [snap, setSnap] = useState(1)
  const y0 = useRef(0)
  const toY = (f) => height * (1 - f)
  const settle = (_, info) => {
    const cur = y0.current + info.offset.y + info.velocity.y * 0.15
    let best = 0
    snaps.forEach((f, i) => { if (Math.abs(toY(f) - cur) < Math.abs(toY(snaps[best]) - cur)) best = i })
    setSnap(best); y0.current = toY(snaps[best])
    animate(scope.current, { y: toY(snaps[best]) }, { type: 'spring', stiffness: 380, damping: 36 })
  }
  return (
    <div className="relative w-56 overflow-hidden rounded-[28px] border-[5px] border-[#26262b] bg-panel" style={{ height }}>
      <div className="p-4"><div className="text-xs text-faint">Cart</div><div className="text-lg text-tx">3 items</div><div className="mt-3 h-24 rounded-xl bg-line" /></div>
      <motion.div ref={scope} drag="y" dragConstraints={{ top: toY(snaps[snaps.length - 1]), bottom: toY(snaps[0]) }} dragElastic={0.12}
        onDragStart={() => { y0.current = toY(snaps[snap]) }} onDragEnd={settle}
        initial={{ y: toY(snaps[1]) }} className="absolute inset-x-0 top-0 h-full cursor-grab touch-none rounded-t-3xl border-t border-line2 bg-panel2 p-4 shadow-[0_-10px_30px_rgba(0,0,0,.5)] active:cursor-grabbing">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line2" />
        <div className="flex justify-between text-sm"><span className="text-mute">Total</span><span className="font-mono text-tx">₹1,480</span></div>
        <button className="mt-4 w-full rounded-xl bg-acc py-2.5 text-sm font-medium text-bg">Place order</button>
        <div className="mt-4 space-y-2 text-xs text-mute"><div>Deliver to: Home</div><div>Pay: UPI</div><div>Arrives in 25 min</div></div>
      </motion.div>
    </div>
  )
}
