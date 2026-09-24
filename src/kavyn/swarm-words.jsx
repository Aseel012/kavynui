import { useCanvasLoop } from './canvas-loop'
import { sampleText } from './dust-letters'

const WORDS = ['Build', 'Ship', 'Repeat']

// A swarm of particles that re-forms into each word in turn. For hero taglines.
export default function SwarmWords({ words = WORDS, color = '#ff6a2b', hold = 2.4, className = '' }) {
  const list = (Array.isArray(words) && words.length ? words : WORDS).map(String)
  const host = useCanvasLoop((ctx, s) => {
    let sets = [], parts = [], idx = 0, timer = 0
    const count = 2400
    const build = () => {
      const step = Math.max(2, Math.round(Math.min(s.w, s.h * 2) / 190))
      sets = list.map((w) => sampleText(w, s.w, s.h, step)).map((pts) => (pts.length ? pts : [{ x: s.w / 2, y: s.h / 2 }]))
      if (!parts.length) parts = Array.from({ length: count }, () => ({ x: Math.random() * s.w, y: Math.random() * s.h, vx: 0, vy: 0, tx: 0, ty: 0, seed: Math.random() }))
      assign()
    }
    const assign = () => {
      const pts = sets[idx % sets.length] || []
      const L = Math.max(1, pts.length)
      parts.forEach((p, i) => { const t = pts[Math.floor((i * L) / parts.length) % L] || { x: s.w / 2, y: s.h / 2 }; p.tx = t.x + (p.seed - 0.5) * 1.5; p.ty = t.y + (p.seed - 0.5) * 1.5 })
    }
    build()
    document.fonts?.ready?.then(() => { try { build() } catch { /* ignore */ } }).catch(() => {})
    return {
      resize: build,
      step(dt, t) {
        timer += dt
        if (!s.reduce && timer > Math.max(0.8, Number(hold) || 2.4)) {
          timer = 0; idx = (idx + 1) % sets.length; assign()
          for (const p of parts) { const a = p.seed * Math.PI * 2; p.vx += Math.cos(a) * 220; p.vy += Math.sin(a) * 220 }
        }
        ctx.fillStyle = 'rgba(9,9,10,0.3)'; ctx.fillRect(0, 0, s.w, s.h)
        const pr = s.pointer
        for (const p of parts) {
          const dx = p.x - pr.x, dy = p.y - pr.y, d = Math.hypot(dx, dy)
          if (d < 60 && d > 0.1) { p.vx += dx / d * 900 * dt; p.vy += dy / d * 900 * dt }
          p.vx += (p.tx - p.x) * 14 * dt + Math.sin(t * 2 + p.seed * 20) * 6 * dt
          p.vy += (p.ty - p.y) * 14 * dt + Math.cos(t * 2 + p.seed * 20) * 6 * dt
          p.vx *= 0.9; p.vy *= 0.9; p.x += p.vx * dt * 3; p.y += p.vy * dt * 3
          const sp = Math.min(1, Math.hypot(p.vx, p.vy) / 60)
          ctx.fillStyle = sp > 0.35 ? color : '#ededef'
          ctx.fillRect(p.x, p.y, 1.8, 1.8)
        }
      },
    }
  }, [list.join('|'), color, hold])
  return <div ref={host} className={`relative h-full min-h-60 w-full overflow-hidden bg-bg ${className}`} role="img" aria-label={list.join(', ')} />
}
