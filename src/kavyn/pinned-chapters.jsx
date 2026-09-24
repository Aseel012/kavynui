import { useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useSpring } from 'motion/react'

const STEPS = [
  { k: 'Connect', t: 'Link a repo', d: 'Pick a project. We read the framework and set the build for you.' },
  { k: 'Preview', t: 'Every branch gets a URL', d: 'Push a branch and share a live link before anything merges.' },
  { k: 'Ship', t: 'Merge to go live', d: 'Production updates in seconds, with the old build kept for rollback.' },
  { k: 'Watch', t: 'See it run', d: 'Errors, speed and traffic in one place, per release.' },
]

function Visual({ i }) {
  if (i === 0) return (
    <div className="space-y-2">
      {['app/web', 'app/docs', 'app/api'].map((r, n) => (
        <motion.div key={r} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: n * 0.08 }}
          className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs ${n === 0 ? 'border-acc/60 bg-acc/10 text-tx' : 'border-line2 text-mute'}`}>
          <span className="font-mono">{r}</span><span>{n === 0 ? 'Selected' : 'Import'}</span>
        </motion.div>
      ))}
    </div>
  )
  if (i === 1) return (
    <div className="space-y-2 font-mono text-[11px]">
      {['feat/pricing', 'fix/nav-focus'].map((b, n) => (
        <motion.div key={b} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: n * 0.1 }} className="rounded-lg border border-line2 p-2.5">
          <div className="text-tx">{b}</div><div className="mt-1 truncate text-acc">{b.replace('/', '-')}.preview.example.com</div>
        </motion.div>
      ))}
    </div>
  )
  if (i === 2) return (
    <div className="grid place-items-center gap-3 py-2">
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        className="grid size-14 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
        <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2.5"><motion.path d="M5 12l5 5 9-10" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.15, duration: 0.4 }} /></svg>
      </motion.div>
      <div className="text-xs text-mute">Live in 14s · v214</div>
    </div>
  )
  return (
    <div className="flex h-20 items-end gap-1">
      {[30, 45, 38, 60, 52, 75, 68, 88, 70, 92].map((h, n) => (
        <motion.span key={n} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: n * 0.03, type: 'spring', stiffness: 200, damping: 20 }} className="flex-1 rounded-sm bg-acc/80" />
      ))}
    </div>
  )
}

// A product tour: the story scrolls, the picture stays pinned and changes per chapter.
// Runs inside its own scroll box, so it works in any layout.
export default function PinnedChapters({ steps = STEPS, className = '' }) {
  const box = useRef(null), track = useRef(null)
  const list = Array.isArray(steps) && steps.length ? steps : STEPS
  const [i, setI] = useState(0)
  const { scrollYProgress } = useScroll({ container: box, target: track, offset: ['start start', 'end end'] })
  const bar = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })
  useMotionValueEvent(scrollYProgress, 'change', (v) => setI(Math.min(list.length - 1, Math.max(0, Math.floor((Number(v) || 0) * list.length)))))
  return (
    <div ref={box} className={`relative h-full min-h-80 w-full overflow-y-auto overscroll-contain bg-bg [container-type:size] ${className}`}>
      <div ref={track} className="relative" style={{ height: `${list.length * 100}cqh` }}>
        <div className="sticky top-0 grid h-[100cqh] content-center gap-6 p-6 @xl:grid-cols-2 @xl:items-center @xl:gap-10 @xl:p-10">
          <div>
            <div className="mb-4 flex gap-1.5">{list.map((s, n) => <span key={s.k} className={`h-1 flex-1 rounded-full ${n <= i ? 'bg-acc' : 'bg-line2'}`} />)}</div>
            <AnimatePresence mode="wait">
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
                <div className="text-[11px] font-medium uppercase tracking-widest text-acc">{String(i + 1).padStart(2, '0')} · {list[i]?.k}</div>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-tx @xl:text-2xl">{list[i]?.t}</h3>
                <p className="mt-2 max-w-sm text-sm text-mute">{list[i]?.d}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="relative rounded-2xl border border-line bg-panel p-4">
            <div className="mb-3 flex gap-1"><span className="size-2 rounded-full bg-line2" /><span className="size-2 rounded-full bg-line2" /><span className="size-2 rounded-full bg-line2" /></div>
            <AnimatePresence mode="wait"><motion.div key={i} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}><Visual i={i % 4} /></motion.div></AnimatePresence>
          </div>
          <motion.div style={{ scaleX: bar }} className="absolute inset-x-0 bottom-0 h-px origin-left bg-acc/60" />
          {i === 0 && <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] text-faint">Scroll inside</div>}
        </div>
      </div>
    </div>
  )
}
