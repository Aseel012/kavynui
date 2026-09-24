import { useCanvasLoop } from './canvas-loop'

// A grid of dots on springs. Move through it and it gives way, then settles.
// Quiet enough for a hero or an empty state.
export default function JellyGrid({ gap = 26, color = '#ff6a2b', radius = 110, className = '', children }) {
  const host = useCanvasLoop((ctx, s) => {
    let dots = [], cols = 0, rows = 0
    const g = Math.max(12, Number(gap) || 26)
    const build = () => {
      cols = Math.ceil(s.w / g) + 1; rows = Math.ceil(s.h / g) + 1; dots = []
      const ox = (s.w - (cols - 1) * g) / 2, oy = (s.h - (rows - 1) * g) / 2
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) dots.push({ hx: ox + x * g, hy: oy + y * g, x: ox + x * g, y: oy + y * g, vx: 0, vy: 0 })
    }
    build()
    const R = Math.max(40, Number(radius) || 110)
    let idle = 0
    return {
      resize: build,
      step(dt, t) {
        const p = s.pointer
        let px = p.x, py = p.y
        if (!p.inside && !s.reduce) { idle += dt; px = s.w / 2 + Math.cos(idle * 0.6) * s.w * 0.3; py = s.h / 2 + Math.sin(idle * 0.9) * s.h * 0.25 }
        ctx.clearRect(0, 0, s.w, s.h)
        for (const d of dots) {
          const dx = d.x - px, dy = d.y - py, dist = Math.hypot(dx, dy)
          if (dist < R && dist > 0.1) { const f = (1 - dist / R) ** 2 * 2600; d.vx += (dx / dist) * f * dt; d.vy += (dy / dist) * f * dt }
          d.vx += (d.hx - d.x) * 90 * dt; d.vy += (d.hy - d.y) * 90 * dt
          d.vx *= 0.86; d.vy *= 0.86
          d.x += d.vx * dt; d.y += d.vy * dt
        }
        ctx.lineWidth = 1
        for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
          const d = dots[y * cols + x]
          const off = Math.min(1, Math.hypot(d.x - d.hx, d.y - d.hy) / 18)
          if (x < cols - 1) { const e = dots[y * cols + x + 1]; ctx.strokeStyle = `rgba(42,42,48,${0.5 + off * 0.5})`; ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(e.x, e.y); ctx.stroke() }
          if (y < rows - 1) { const e = dots[(y + 1) * cols + x]; ctx.strokeStyle = `rgba(42,42,48,${0.5 + off * 0.5})`; ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(e.x, e.y); ctx.stroke() }
          ctx.fillStyle = off > 0.15 ? color : '#5c5c66'
          ctx.globalAlpha = 0.5 + off * 0.5
          ctx.beginPath(); ctx.arc(d.x, d.y, 1.4 + off * 1.6, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1
        }
      },
    }
  }, [gap, color, radius])
  return (
    <div ref={host} className={`relative h-full min-h-72 w-full overflow-hidden bg-bg ${className}`}>
      {children && <div className="pointer-events-none relative z-10 grid h-full min-h-72 place-items-center p-6">{children}</div>}
    </div>
  )
}
