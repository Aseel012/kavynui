import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const LOG = [
  ['›', 'Cloning repository', 'text-mute'], ['›', 'Installing dependencies', 'text-mute'], ['›', 'Building 41 routes', 'text-mute'],
  ['✓', 'Build complete in 18.2s', 'text-emerald-400'], ['›', 'Uploading to 300 edge locations', 'text-mute'], ['✓', 'Live at example.com', 'text-acc'],
]

// Block: product hero. Headline, two actions, and an app window that runs a real-looking deploy.
export default function ProductHero({ title = 'Ship the site. Skip the servers.', sub = 'Push to main and it is live everywhere in under a minute.', primary = 'Start deploying', secondary = 'Read the docs' }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    const id = setInterval(() => !document.hidden && setN((x) => (x >= LOG.length + 3 ? 0 : x + 1)), 700)
    return () => clearInterval(id)
  }, [])
  const done = n >= LOG.length
  return (
    <section className="@container relative w-full overflow-hidden rounded-2xl border border-line bg-bg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(255,106,43,.14),transparent)]" />
      <div className="relative grid items-center gap-10 p-6 @4xl:grid-cols-2 @4xl:p-12">
        <div>
          <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-semibold tracking-[-0.035em] text-tx @2xl:text-5xl">{title}</motion.h2>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mt-4 max-w-md text-mute">{sub}</motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="mt-7 flex flex-wrap gap-3">
            <button type="button" className="h-10 rounded-full bg-tx px-5 text-sm font-medium text-bg transition-transform active:scale-95">{primary}</button>
            <button type="button" className="h-10 rounded-full border border-line2 px-5 text-sm text-mute hover:text-tx">{secondary}</button>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 24, rotateX: 12 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          className="overflow-hidden rounded-xl border border-line2 bg-panel shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)]" style={{ transformPerspective: 900 }}>
          <div className="flex items-center gap-1.5 border-b border-line px-3 py-2.5">
            <span className="size-2.5 rounded-full bg-line2" /><span className="size-2.5 rounded-full bg-line2" /><span className="size-2.5 rounded-full bg-line2" />
            <span className="ml-3 truncate font-mono text-[11px] text-faint">deploy · main@8f3c21a</span>
          </div>
          <div className="h-52 space-y-1.5 p-4 font-mono text-xs">
            <AnimatePresence>
              {LOG.slice(0, n).map(([ic, t, c]) => (
                <motion.div key={t} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className={`flex gap-2 ${c}`}><span>{ic}</span><span>{t}</span></motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="h-1 bg-line"><motion.div className="h-full bg-acc" animate={{ width: `${Math.min(1, n / LOG.length) * 100}%` }} transition={{ type: 'spring', stiffness: 80, damping: 20 }} /></div>
          <div className="flex items-center justify-between px-4 py-2.5 text-[11px]">
            <span className={done ? 'text-emerald-400' : 'text-mute'}>{done ? 'Ready' : 'Building…'}</span>
            <span className="font-mono text-faint">{Math.min(n, LOG.length)}/{LOG.length}</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
