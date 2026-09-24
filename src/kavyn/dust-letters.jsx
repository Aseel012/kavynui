import { useCanvasLoop } from './canvas-loop'

// Turns text into target points by drawing it off screen and reading the pixels.
export function sampleText(text, w, h, step) {
  const c = document.createElement('canvas')
  c.width = Math.max(1, Math.floor(w)); c.height = Math.max(1, Math.floor(h))
  const x = c.getContext('2d', { willReadFrequently: true })
  if (!x) return []
  let size = Math.min(h * 0.5, 200)
  x.font = `700 ${size}px "Geist Variable", system-ui, sans-serif`
  const tw = x.measureText(text).width || 1
  size = Math.max(12, Math.min(size, (size * w * 0.86) / tw))
  x.font = `700 ${size}px "Geist Variable", system-ui, sans-serif`
  x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#fff'
  x.fillText(text, c.width / 2, c.height / 2)
  let data
  try { data = x.getImageData(0, 0, c.width, c.height).data } catch { return [] }
  const out = []
  for (let y = 0; y < c.height; y += step) for (let xx = 0; xx < c.width; xx += step) if (data[(y * c.width + xx) * 4 + 3] > 128) out.push({ x: xx, y })
  return out
}

// A headline made of dust. Sweep through it and the grains scatter, then drift home.
export default function DustLetters({ text = 'kavyn', color = '#ff6a2b', density = 4, className = '' }) {
  const host = useCanvasLoop((ctx, s) => {
    let parts = []
    const step = Math.max(2, Math.round(Number(density) || 4))
    const build = () => {
      const targets = sampleText(String(text || ' '), s.w, s.h, step).slice(0, 6000)
      parts = targets.map((t) => ({ hx: t.x, hy: t.y, x: Math.random() * s.w, y: Math.random() * s.h, vx: 0, vy: 0, hot: 0 }))
    }
    build()
    document.fonts?.ready?.then(() => { try { build() } catch { /* ignore */ } }).catch(() => {})
    return {
      resize: build,
      step(dt) {
        const p = s.pointer, R = Math.max(50, s.w * 0.08)
        ctx.clearRect(0, 0, s.w, s.h)
        for (const q of parts) {
          const dx = q.x - p.x, dy = q.y - p.y, d = Math.hypot(dx, dy)
          if (d < R && d > 0.1) { const f = (1 - d / R) * 1800; q.vx += (dx / d) * f * dt; q.vy += (dy / d) * f * dt; q.hot = 1 }
          q.vx += (q.hx - q.x) * 30 * dt; q.vy += (q.hy - q.y) * 30 * dt
          q.vx *= 0.9; q.vy *= 0.9
          q.x += q.vx * dt * (s.reduce ? 4 : 1); q.y += q.vy * dt * (s.reduce ? 4 : 1)
          q.hot *= 0.96
        }
        ctx.fillStyle = '#ededef'
        for (const q of parts) if (q.hot < 0.2) ctx.fillRect(q.x, q.y, step * 0.55, step * 0.55)
        ctx.fillStyle = color
        for (const q of parts) if (q.hot >= 0.2) ctx.fillRect(q.x, q.y, step * 0.6, step * 0.6)
      },
    }
  }, [text, color, density])
  return <div ref={host} className={`relative h-full min-h-60 w-full overflow-hidden bg-bg ${className}`} role="img" aria-label={String(text)} />
}
