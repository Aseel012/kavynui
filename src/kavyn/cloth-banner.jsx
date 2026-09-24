import { useCanvasLoop, clamp } from './canvas-loop'

// A launch banner made of cloth. It breathes in a light wind; drag any part to pull it.
export default function ClothBanner({ colors = ['#ff6a2b', '#ededef'], wind = 1, className = '' }) {
  const host = useCanvasLoop((ctx, s) => {
    const cols = 18, rows = 11
    let pts = [], links = [], held = null, gap = 10, ox = 0
    const build = () => {
      gap = Math.min((s.w * 0.72) / (cols - 1), (s.h * 0.62) / (rows - 1))
      ox = (s.w - gap * (cols - 1)) / 2
      pts = []; links = []
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        const px = ox + x * gap, py = 24 + y * gap
        pts.push({ x: px, y: py, px, py, pin: y === 0 && x % 3 === 0 })
      }
      const id = (x, y) => y * cols + x
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        if (x < cols - 1) links.push([id(x, y), id(x + 1, y)])
        if (y < rows - 1) links.push([id(x, y), id(x, y + 1)])
      }
    }
    build()
    const palette = Array.isArray(colors) && colors.length ? colors : ['#ff6a2b', '#ededef']
    return {
      resize: build,
      down(p) {
        let best = null, bd = 40 * 40
        for (const q of pts) { const d = (q.x - p.x) ** 2 + (q.y - p.y) ** 2; if (d < bd) { bd = d; best = q } }
        held = best
      },
      up() { held = null },
      step(dt, t) {
        const w = s.reduce ? 0 : (Number(wind) || 0)
        for (const q of pts) {
          if (q.pin) continue
          const vx = (q.x - q.px) * 0.98, vy = (q.y - q.py) * 0.98
          q.px = q.x; q.py = q.y
          const gust = w * (60 + 50 * Math.sin(t * 1.3 + q.y * 0.03)) * (0.5 + 0.5 * Math.sin(t * 0.7 + q.x * 0.02))
          q.x += vx + gust * dt * dt; q.y += vy + 700 * dt * dt
        }
        if (held && !held.pin) { held.x = clamp(s.pointer.x, 0, s.w); held.y = clamp(s.pointer.y, 0, s.h) }
        for (let k = 0; k < 5; k++) for (const [a, b] of links) {
          const A = pts[a], B = pts[b], dx = B.x - A.x, dy = B.y - A.y, d = Math.hypot(dx, dy) || 1, f = (d - gap) / d * 0.5
          if (!A.pin) { A.x += dx * f; A.y += dy * f }
          if (!B.pin) { B.x -= dx * f; B.y -= dy * f }
        }
        ctx.clearRect(0, 0, s.w, s.h)
        ctx.strokeStyle = '#2a2a30'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ox - 16, 24); ctx.lineTo(s.w - ox + 16, 24); ctx.stroke()
        for (let y = 0; y < rows - 1; y++) for (let x = 0; x < cols - 1; x++) {
          const a = pts[y * cols + x], b = pts[y * cols + x + 1], c = pts[(y + 1) * cols + x + 1], d = pts[(y + 1) * cols + x]
          const shade = clamp(0.55 + ((b.x - a.x) - gap) * 0.04 + (d.y - a.y - gap) * -0.02 + (a.x - d.x) * 0.02, 0.25, 1.1)
          const band = Math.floor(y / 2) % palette.length
          ctx.fillStyle = palette[band]; ctx.globalAlpha = 1
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.lineTo(d.x, d.y); ctx.closePath(); ctx.fill()
          ctx.fillStyle = shade < 1 ? `rgba(0,0,0,${(1 - shade) * 0.8})` : `rgba(255,255,255,${(shade - 1) * 0.6})`
          ctx.fill()
        }
        ctx.globalAlpha = 1
        for (const q of pts) if (q.pin) { ctx.fillStyle = '#8a8a93'; ctx.beginPath(); ctx.arc(q.x, q.y, 3, 0, Math.PI * 2); ctx.fill() }
      },
    }
  }, [JSON.stringify(colors), wind])
  return (
    <div ref={host} className={`relative h-full min-h-80 w-full cursor-grab select-none overflow-hidden bg-bg active:cursor-grabbing ${className}`} role="img" aria-label="Striped cloth banner">
      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] text-faint">Pull the cloth</div>
    </div>
  )
}
