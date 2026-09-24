import { useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'motion/react'

const CARDS = [
  { t: 'Senior Frontend', co: 'Ledgerly', m: 'Remote · ₹38-48L', g: 'from-[#ff6a2b]/25' },
  { t: 'Design Engineer', co: 'Fieldnote', m: 'Bengaluru · Hybrid', g: 'from-[#3b82f6]/25' },
  { t: 'Motion Designer', co: 'Parcel', m: 'Remote · Contract', g: 'from-[#a855f7]/25' },
  { t: 'Platform Engineer', co: 'Tidewater', m: 'Pune · On-site', g: 'from-[#22c55e]/25' },
]

function Top({ card, onDone }) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-220, 220], [-14, 14])
  const keep = useTransform(x, [20, 110], [0, 1])
  const skip = useTransform(x, [-110, -20], [1, 0])
  const fly = (dir) => animate(x, dir * 480, { duration: 0.28, ease: 'easeIn', onComplete: () => onDone(dir) })
  return (
    <motion.div drag="x" dragSnapToOrigin style={{ x, rotate }} whileDrag={{ cursor: 'grabbing' }}
      onDragEnd={(_, i) => { const v = i?.offset?.x || 0; if (Math.abs(v) > 110 || Math.abs(i?.velocity?.x || 0) > 700) fly(Math.sign(v || i.velocity.x)) }}
      className={`absolute inset-0 cursor-grab rounded-2xl border border-line2 bg-gradient-to-b ${card.g} to-panel to-60% bg-panel p-5 shadow-[0_20px_40px_-12px_rgba(0,0,0,.7)]`}>
      <motion.span style={{ opacity: keep }} className="absolute right-4 top-4 rounded-md border border-emerald-400/70 px-2 py-0.5 text-xs font-semibold text-emerald-400">SAVE</motion.span>
      <motion.span style={{ opacity: skip }} className="absolute left-4 top-4 rounded-md border border-rose-400/70 px-2 py-0.5 text-xs font-semibold text-rose-400">PASS</motion.span>
      <Face card={card} />
      <div className="absolute inset-x-5 bottom-4 flex gap-2">
        <button type="button" onClick={() => fly(-1)} className="flex-1 rounded-lg border border-line2 py-2 text-xs text-mute hover:text-tx">Pass</button>
        <button type="button" onClick={() => fly(1)} className="flex-1 rounded-lg bg-tx py-2 text-xs font-medium text-bg">Save</button>
      </div>
    </motion.div>
  )
}

function Face({ card }) {
  return (
    <div className="mt-8">
      <div className="grid size-10 place-items-center rounded-xl bg-panel2 font-mono text-sm text-tx">{String(card.co || '?').slice(0, 1)}</div>
      <div className="mt-3 text-lg font-semibold tracking-tight text-tx">{card.t}</div>
      <div className="text-sm text-mute">{card.co}</div>
      <div className="mt-3 inline-block rounded-md bg-panel2 px-2 py-1 text-[11px] text-mute">{card.m}</div>
    </div>
  )
}

// A job-match stack in 3D. Swipe right to save, left to pass, or use the buttons.
export default function SwipeStack({ cards = CARDS, className = '' }) {
  const list = Array.isArray(cards) && cards.length ? cards : CARDS
  const [i, setI] = useState(0)
  const [saved, setSaved] = useState(0)
  const done = (dir) => { if (dir > 0) setSaved((s) => s + 1); setI((n) => n + 1) }
  const view = [0, 1, 2].map((k) => list[(i + k) % list.length])
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="relative h-72 w-64 [perspective:900px]">
        <AnimatePresence initial={false}>
          {view.slice(1).reverse().map((c, r) => {
            const depth = 2 - r
            return (
              <motion.div key={`${(i + depth)}-${c.t}`} initial={{ opacity: 0 }} animate={{ opacity: 1, y: depth * 12, scale: 1 - depth * 0.05, rotateX: depth * 4 }}
                className="absolute inset-0 rounded-2xl border border-line bg-panel p-5 [transform-origin:50%_100%]" aria-hidden>
                <Face card={c} />
              </motion.div>
            )
          })}
          <Top key={`top-${i}`} card={view[0]} onDone={done} />
        </AnimatePresence>
      </div>
      <div className="text-xs text-faint" aria-live="polite">{saved} saved</div>
    </div>
  )
}
