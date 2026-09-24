import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useAnimationFrame, useTransform } from 'motion/react'

const R = [
  ['Ananya, PM at Loop', 'Our onboarding finally feels like the product.'], ['Dev, founder', 'Shipped the landing page in an afternoon.'],
  ['Meera, designer', 'The motion is calm. Nothing shouts.'], ['Kabir, eng lead', 'Drop-in components, no fighting CSS.'],
  ['Sara, indie hacker', 'Conversions went up after the redesign.'], ['Rohan, CTO', 'Fast on low-end phones too.'],
]

function Row({ items, dir, speed }) {
  const x = useMotionValue(0)
  const rate = useMotionValue(1)
  const s = useSpring(rate, { stiffness: 60, damping: 20 })
  const ref = useRef(null)
  useAnimationFrame((_, dt) => {
    const w = ref.current ? ref.current.scrollWidth / 2 : 1000
    let v = x.get() + dir * speed * s.get() * (dt / 1000)
    if (v <= -w) v += w
    if (v > 0) v -= w
    x.set(v)
  })
  const tx = useTransform(x, (v) => `${v}px`)
  return (
    <div onPointerEnter={() => rate.set(0)} onPointerLeave={() => rate.set(1)} className="overflow-hidden">
      <motion.div ref={ref} style={{ x: tx }} className="flex w-max gap-3 py-1.5">
        {[...items, ...items].map(([who, q], i) => (
          <figure key={i} className="w-64 shrink-0 rounded-xl border border-line bg-panel p-4">
            <blockquote className="text-sm text-tx">“{q}”</blockquote>
            <figcaption className="mt-2 text-xs text-faint">{who}</figcaption>
          </figure>
        ))}
      </motion.div>
    </div>
  )
}

export default function ReviewRail({ reviews = R, speed = 40 }) {
  return (
    <div className="w-full [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <Row items={reviews} dir={-1} speed={speed} />
      <Row items={[...reviews].reverse()} dir={1} speed={speed} />
    </div>
  )
}
