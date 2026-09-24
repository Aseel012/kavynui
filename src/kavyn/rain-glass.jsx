import { useEffect, useRef } from 'react'

export default function RainGlass({ children, drops = 70 }) {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current, ctx = c.getContext('2d')
    let raf, w, h, last = performance.now()
    const size = () => { const d = devicePixelRatio || 1; w = c.clientWidth; h = c.clientHeight; c.width = w * d; c.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0) }
    size(); const ro = new ResizeObserver(size); ro.observe(c)
    const mk = (y) => ({ x: Math.random() * w, y: y ?? Math.random() * h, r: 1 + Math.random() * 3, vy: 0, run: false, trail: [] })
    const D = Array.from({ length: drops }, () => mk())
    const draw = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05); last = now
      ctx.clearRect(0, 0, w, h)
      for (const d of D) {
        if (!d.run) { d.r += dt * 0.35; if (d.r > 3.4 && Math.random() < 0.02) d.run = true }
        else { d.vy = Math.min(d.vy + 300 * dt, 160 + d.r * 20); d.y += d.vy * dt; d.x += Math.sin(d.y * 0.05) * 0.3; d.trail.push([d.x, d.y]); if (d.trail.length > 26) d.trail.shift() }
        if (d.y > h + 10) Object.assign(d, mk(-10))
        if (d.trail.length > 1) { ctx.beginPath(); d.trail.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.strokeStyle = 'rgba(200,215,230,.12)'; ctx.lineWidth = d.r * 0.7; ctx.stroke() }
        const g = ctx.createRadialGradient(d.x - d.r * 0.3, d.y - d.r * 0.3, 0, d.x, d.y, d.r)
        g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(160,180,200,.12)')
        ctx.beginPath(); ctx.ellipse(d.x, d.y, d.r * 0.85, d.r, 0, 0, 6.283); ctx.fillStyle = g; ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [drops])
  return (
    <div className="relative size-full min-h-64 overflow-hidden bg-[radial-gradient(ellipse_at_30%_70%,#1d2733,#0b0d10_70%)]">
      <div className="absolute left-[20%] top-[55%] size-24 rounded-full bg-acc/30 blur-3xl" /><div className="absolute right-[15%] top-[30%] size-20 rounded-full bg-sky-300/10 blur-3xl" />
      <canvas ref={ref} className="absolute inset-0 size-full" />
      <div className="relative grid size-full min-h-64 place-items-center">{children}</div>
    </div>
  )
}
