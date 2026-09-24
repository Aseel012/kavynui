import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

const TEXT = 'We build tools for people who ship. Small teams, real deadlines, no ceremony. Every screen should earn its place, every animation should explain something, and nothing should wait on us.'

function Word({ children, range, progress }) {
  const opacity = useTransform(progress, range, [0.15, 1])
  const y = useTransform(progress, range, [4, 0])
  return <motion.span style={{ opacity, y }} className="mr-[0.28em] inline-block">{children}</motion.span>
}

// A manifesto that lights up word by word as you read down.
export default function WordLight({ text = TEXT, className = '' }) {
  const box = useRef(null), track = useRef(null)
  const words = String(text || TEXT).split(/\s+/).filter(Boolean)
  const { scrollYProgress } = useScroll({ container: box, target: track, offset: ['start start', 'end end'] })
  return (
    <div ref={box} className={`relative h-full min-h-80 w-full overflow-y-auto overscroll-contain bg-bg [container-type:size] ${className}`}>
      <div ref={track} className="relative h-[260cqh]">
        <div className="sticky top-0 grid h-[100cqh] content-center px-6 @xl:px-14">
          <div className="mb-3 text-[11px] uppercase tracking-widest text-acc">About us</div>
          <p className="max-w-xl text-xl font-medium leading-snug tracking-tight text-tx @xl:text-3xl" aria-label={words.join(' ')}>
            <span aria-hidden>{words.map((w, n) => <Word key={n} progress={scrollYProgress} range={[n / words.length * 0.9, (n + 1) / words.length * 0.9 + 0.02]}>{w}</Word>)}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
