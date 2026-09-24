import { useEffect, useRef, useState } from 'react'

const TAGS = ['React', 'Tailwind', 'Motion', 'Vite', 'Postgres', 'Redis', 'Go', 'Rust', 'Figma', 'Stripe', 'Docker', 'Kafka', 'Bun', 'tRPC']

export default function BadgeRain({ tags = TAGS, height = 260 }) {
  const box = useRef(null)
  const refs = useRef([])
  const [run, setRun] = useState(0)
  useEffect(() => {
    const W = box.current.clientWidth, H = height
    const bodies = tags.map((_, i) => {
      const el = refs.current[i]; const w = el.offsetWidth, h = el.offsetHeight
      return { el, w, h, x: Math.random() * (W - w), y: -40 - i * 55 - Math.random() * 40, vy: 0, vx: (Math.random() - 0.5) * 30, r: (Math.random() - 0.5) * 30, vr: 0, rest: false }
    })
    let raf, last = performance.now()
    const step = (now) => {
      const dt = Math.min((now - last) / 1000, 0.033); last = now
      for (const b of bodies) {
        if (b.rest) continue
        b.vy += 1400 * dt; b.x += b.vx * dt; b.y += b.vy * dt; b.r += b.vr * dt
        if (b.x < 0) { b.x = 0; b.vx *= -0.5 } if (b.x + b.w > W) { b.x = W - b.w; b.vx *= -0.5 }
        let floor = H - b.h
        for (const o of bodies) if (o !== b && o.rest && b.x + b.w > o.x + 4 && b.x < o.x + o.w - 4) floor = Math.min(floor, o.y - b.h)
        if (b.y >= floor) {
          b.y = floor
          if (b.vy > 160) { b.vy *= -0.32; b.vr = (Math.random() - 0.5) * 120; b.vx *= 0.7 } else { b.vy = 0; b.vx = 0; b.rest = true; b.r *= 0.4 }
        }
        b.el.style.transform = `translate(${b.x}px, ${b.y}px) rotate(${b.r}deg)`
      }
      if (bodies.some((b) => !b.rest)) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [run, tags, height])
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-2">
      <div ref={box} style={{ height }} className="relative w-full overflow-hidden rounded-2xl border border-line bg-panel">
        {tags.map((t, i) => (
          <span key={t} ref={(el) => (refs.current[i] = el)} style={{ transform: 'translate(-200px,-200px)' }} className={`absolute left-0 top-0 whitespace-nowrap rounded-full border px-3 py-1 text-xs will-change-transform ${i % 4 === 0 ? 'border-acc/60 bg-acc/10 text-acc' : 'border-line2 bg-panel2 text-tx'}`}>{t}</span>
        ))}
      </div>
      <button onClick={() => setRun(run + 1)} className="text-xs text-mute hover:text-tx">Rain again</button>
    </div>
  )
}
