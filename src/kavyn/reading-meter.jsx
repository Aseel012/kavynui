import { useRef, useState } from 'react'
import { motion, useScroll, useSpring, useMotionValueEvent } from 'motion/react'

const PARAS = [
  'Motion is a promise about where things came from and where they are going. When a panel slides in from the right, people expect it to leave to the right.',
  'Good motion is short. Most interface moves land between 150 and 300 milliseconds, long enough to follow and short enough to never wait for.',
  'Springs feel more natural than curves because they keep their speed when interrupted. Grab a moving card and it does not jump.',
  'Respect reduced motion. Keep the change of state, drop the travel. A fade is still a signal; a flying card is not required.',
  'Test on a slow phone. Motion that stutters reads as broken, so animate transform and opacity, and let the rest be still.',
  'Finally, remove one animation. Then look again. If nobody misses it, it was decoration.',
]

// Article reading progress: a top bar and a ring with minutes left. For blogs and docs.
export default function ReadingMeter({ title = 'Six rules for interface motion', paragraphs = PARAS, wpm = 220, className = '' }) {
  const box = useRef(null)
  const paras = Array.isArray(paragraphs) && paragraphs.length ? paragraphs : PARAS
  const words = paras.join(' ').split(/\s+/).length
  const total = Math.max(1, Math.ceil(words / Math.max(60, Number(wpm) || 220) * 4))
  const { scrollYProgress } = useScroll({ container: box })
  const prog = useSpring(scrollYProgress, { stiffness: 180, damping: 28 })
  const [left, setLeft] = useState(total)
  useMotionValueEvent(scrollYProgress, 'change', (v) => setLeft(Math.max(0, Math.ceil(total * (1 - (Number(v) || 0))))))
  return (
    <div className={`relative h-full min-h-80 w-full overflow-hidden bg-bg ${className}`}>
      <motion.div style={{ scaleX: prog }} className="absolute inset-x-0 top-0 z-10 h-0.5 origin-left bg-acc" />
      <div ref={box} className="relative h-full overflow-y-auto overscroll-contain px-6 py-8 @xl:px-12">
        <article className="mx-auto max-w-md">
          <div className="text-[11px] uppercase tracking-widest text-faint">Essay · {total} min read</div>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-tx">{title}</h3>
          {paras.map((t, n) => <p key={n} className="mt-5 text-[15px] leading-7 text-mute">{t}</p>)}
          <p className="mt-8 border-t border-line pt-4 text-xs text-faint">The end. Thanks for reading.</p>
        </article>
      </div>
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 rounded-full border border-line bg-panel/90 py-1.5 pl-1.5 pr-3 backdrop-blur" role="status" aria-live="polite">
        <svg viewBox="0 0 36 36" className="size-7 -rotate-90" aria-hidden>
          <circle cx="18" cy="18" r="15" fill="none" stroke="#2a2a30" strokeWidth="3" />
          <motion.circle cx="18" cy="18" r="15" fill="none" stroke="#ff6a2b" strokeWidth="3" strokeLinecap="round" style={{ pathLength: prog }} />
        </svg>
        <span className="text-xs tabular-nums text-tx">{left ? `${left} min left` : 'Done'}</span>
      </div>
    </div>
  )
}
