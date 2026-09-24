import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const EV = [
  { v: '2.4', d: 'Sep 18', t: 'Offline mode', b: 'Edits sync when you reconnect.' },
  { v: '2.3', d: 'Aug 30', t: 'Shared inboxes', b: 'Route mail to a team, not a person.' },
  { v: '2.2', d: 'Aug 02', t: 'Faster search', b: 'Results in under 80 ms on big workspaces.' },
  { v: '2.1', d: 'Jul 11', t: 'Dark theme', b: 'Follows your system setting.' },
]

export default function TimelineRail({ events = EV }) {
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const go = (n) => { setDir(n > i ? 1 : -1); setI(n) }
  return (
    <div className="w-full max-w-md"
      onWheel={(e) => { if (Math.abs(e.deltaY) > 20) go(Math.min(events.length - 1, Math.max(0, i + Math.sign(e.deltaY)))) }}>
      <div className="relative mb-6 flex justify-between px-2">
        <div className="absolute inset-x-2 top-1/2 h-px bg-line2" />
        <motion.div className="absolute left-2 top-1/2 h-px bg-acc" animate={{ width: `calc(${(i / (events.length - 1)) * 100}% - ${(i / (events.length - 1)) * 16}px)` }} transition={{ type: 'spring', stiffness: 200, damping: 26 }} />
        {events.map((e, k) => (
          <button key={e.v} onClick={() => go(k)} className="relative grid size-4 place-items-center">
            <span className={`size-2 rounded-full ${k <= i ? 'bg-acc' : 'bg-line2'}`} />
            {k === i && <motion.span layoutId="tl-ring" className="absolute inset-0 rounded-full border border-acc" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
            <span className="absolute top-6 font-mono text-[10px] text-faint">{e.v}</span>
          </button>
        ))}
      </div>
      <div className="relative mt-10 h-28 overflow-hidden">
        <AnimatePresence custom={dir} initial={false}>
          <motion.div key={i} custom={dir}
            initial={{ x: dir * 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -dir * 60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute inset-0 rounded-xl border border-line bg-panel p-4">
            <div className="font-mono text-[11px] text-acc">v{events[i].v} · {events[i].d}</div>
            <div className="mt-1 text-base text-tx">{events[i].t}</div>
            <div className="mt-1 text-sm text-mute">{events[i].b}</div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
