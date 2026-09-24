import { motion } from 'motion/react'
import EdgeGlobe from './edge-globe'

// Block: closing call-to-action beside a live globe.
export default function GlobeCta({ title = 'Closer to every user', sub = 'Deploy once. Serve from the nearest city, automatically.', action = 'Deploy your first site' }) {
  return (
    <section className="@container relative w-full overflow-hidden rounded-2xl border border-line bg-panel">
      <div className="grid items-center @3xl:grid-cols-[1fr_auto]">
        <div className="p-8 @3xl:p-12">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-tx @2xl:text-4xl">{title}</h2>
          <p className="mt-3 max-w-sm text-mute">{sub}</p>
          <motion.button type="button" whileHover={{ x: 2 }} whileTap={{ scale: 0.97 }} className="mt-7 inline-flex h-10 items-center gap-2 rounded-full bg-acc px-5 text-sm font-medium text-black">{action} <span aria-hidden>→</span></motion.button>
        </div>
        <div className="-mb-24 flex justify-center @3xl:-mb-10 @3xl:-mr-8"><EdgeGlobe size={360} /></div>
      </div>
    </section>
  )
}
