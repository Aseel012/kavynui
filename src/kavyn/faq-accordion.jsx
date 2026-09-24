import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const QA = [
  ['Is there a free tier?', 'Yes. Hobby projects run free with generous limits. You only pay when you add a team.'],
  ['Can I use my own domain?', 'Point a CNAME at us and SSL is issued in about a minute.'],
  ['Where does my code run?', 'In every edge location we have. Requests go to the nearest one.'],
  ['How do rollbacks work?', 'Every deploy is kept. Pick one and it goes live instantly.'],
]

// Block: FAQ with one open item at a time and a plus that turns into a minus.
export default function FaqAccordion({ items = QA, title = 'Questions' }) {
  const [open, setOpen] = useState(0)
  return (
    <section className="@container w-full rounded-2xl border border-line bg-bg p-6 @3xl:grid @3xl:grid-cols-[220px_1fr] @3xl:gap-10 @3xl:p-10">
      <h2 className="text-2xl font-semibold tracking-tight text-tx">{title}</h2>
      <div className="mt-6 divide-y divide-line @3xl:mt-0">
        {items.map(([q, a], i) => (
          <div key={q}>
            <button type="button" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 py-4 text-left text-[15px] text-tx">
              {q}
              <span className="relative size-3.5 shrink-0">
                <span className="absolute inset-x-0 top-1/2 h-px bg-mute" />
                <motion.span className="absolute inset-y-0 left-1/2 w-px bg-mute" animate={{ scaleY: open === i ? 0 : 1 }} />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 320, damping: 34 }} className="overflow-hidden">
                  <p className="pb-4 text-sm leading-6 text-mute">{a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  )
}
