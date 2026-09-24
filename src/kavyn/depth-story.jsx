import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

const RIDGES = [
  { d: 'M0 120 L60 70 L110 100 L170 40 L240 95 L300 60 L360 110 L400 80 L400 200 L0 200Z', c: '#26262d', speed: 0.15 },
  { d: 'M0 140 L50 110 L120 150 L190 90 L250 135 L320 100 L400 145 L400 200 L0 200Z', c: '#1b1b20', speed: 0.35 },
  { d: 'M0 165 L70 140 L140 170 L210 130 L290 168 L350 145 L400 170 L400 200 L0 200Z', c: '#111114', speed: 0.6 },
]

// A travel-style story. Ridges, sun and words move at different depths as you scroll.
export default function DepthStory({ title = 'Into the ridge', subtitle = 'Four days, one trail, no signal.', className = '' }) {
  const box = useRef(null), track = useRef(null)
  const { scrollYProgress: p } = useScroll({ container: box, target: track, offset: ['start start', 'end end'] })
  const sunY = useTransform(p, [0, 1], ['10%', '70%'])
  const sky = useTransform(p, [0, 1], ['#1a1210', '#07070a'])
  const titleY = useTransform(p, [0, 0.4], ['0%', '-60%'])
  const titleO = useTransform(p, [0, 0.35], [1, 0])
  const endO = useTransform(p, [0.6, 0.85], [0, 1])
  const endY = useTransform(p, [0.6, 0.85], [20, 0])
  const r0 = useTransform(p, [0, 1], ['0%', `${-RIDGES[0].speed * 60}%`])
  const r1 = useTransform(p, [0, 1], ['0%', `${-RIDGES[1].speed * 60}%`])
  const r2 = useTransform(p, [0, 1], ['0%', `${-RIDGES[2].speed * 60}%`])
  const ys = [r0, r1, r2]
  return (
    <div ref={box} className={`relative h-full min-h-80 w-full overflow-y-auto overscroll-contain [container-type:size] ${className}`}>
      <div ref={track} className="relative h-[300cqh]">
        <motion.div style={{ backgroundColor: sky }} className="sticky top-0 h-[100cqh] overflow-hidden">
          <motion.div style={{ top: sunY }} className="absolute left-[62%] size-20 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#ffb36b] to-[#ff6a2b] shadow-[0_0_80px_20px_rgba(255,106,43,.35)]" />
          <motion.div style={{ y: titleY, opacity: titleO }} className="absolute inset-x-0 top-[22%] z-10 text-center">
            <h3 className="text-3xl font-semibold tracking-tight text-tx @xl:text-5xl">{title}</h3>
            <p className="mt-2 text-sm text-mute">{subtitle}</p>
          </motion.div>
          {RIDGES.map((r, n) => (
            <motion.svg key={n} style={{ y: ys[n] }} viewBox="0 0 400 200" preserveAspectRatio="none" className="absolute inset-x-0 -bottom-[30%] h-[80%] w-full" aria-hidden>
              <path d={r.d} fill={r.c} />
            </motion.svg>
          ))}
          <div className="absolute inset-x-0 bottom-0 h-[22%] bg-[#0b0b0d]" />
          <motion.div style={{ opacity: endO, y: endY }} className="absolute inset-x-0 bottom-[8%] z-10 text-center">
            <div className="text-[11px] uppercase tracking-widest text-acc">Day one</div>
            <div className="mt-1 text-sm text-tx">Camp at 2,900 m, under the ridge line.</div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
