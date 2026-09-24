import { useRef, useState } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'motion/react'

const SECTIONS = ['Install', 'Usage', 'Props', 'Theming', 'FAQ']

export default function SectionBeads({ sections = SECTIONS }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ container: ref })
  const [p, setP] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', setP)
  const n = sections.length
  return (
    <div className="flex h-72 w-full max-w-md overflow-hidden rounded-2xl border border-line bg-bg">
      <div className="flex w-32 flex-col gap-3 border-r border-line p-4">
        {sections.map((s, i) => {
          const f = Math.min(1, Math.max(0, p * n - i))
          return (
            <button key={s} onClick={() => ref.current.scrollTo({ top: (ref.current.scrollHeight - ref.current.clientHeight) * (i / (n - 1)), behavior: 'smooth' })} className="flex items-center gap-2 text-left text-xs">
              <span className="relative size-3 overflow-hidden rounded-full border border-line2">
                <motion.span className="absolute inset-x-0 bottom-0 bg-acc" animate={{ height: `${f * 100}%` }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
              </span>
              <span className={f > 0.05 ? 'text-tx' : 'text-faint'}>{s}</span>
            </button>
          )
        })}
      </div>
      <div ref={ref} className="flex-1 overflow-y-auto p-4">
        {sections.map((s) => (
          <section key={s} className="mb-6">
            <h4 className="text-sm text-tx">{s}</h4>
            {[0, 1, 2, 3].map((k) => <div key={k} className="mt-2 h-2 rounded bg-line" style={{ width: `${90 - k * 15}%` }} />)}
          </section>
        ))}
      </div>
    </div>
  )
}
