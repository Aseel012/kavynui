import { useRef, useState } from 'react'
import { useCanvasLoop, clamp } from './canvas-loop'

const TOPICS = ['Design', 'React', 'Motion', 'Rust', 'AI', 'Go', 'Type', 'CSS', 'Data', '3D', 'Audio', 'Infra']

// An interest picker for onboarding. Topics drop in with real weight.
// Tap to pick, drag to throw. A hidden list of buttons keeps it usable by keyboard.
export default function TopicBubbles({ topics = TOPICS, color = '#ff6a2b', onChange, className = '' }) {
  const list = (Array.isArray(topics) && topics.length ? topics : TOPICS).slice(0, 24).map(String)
  const [picked, setPicked] = useState([])
  const pickedRef = useRef(new Set())
  const toggle = (name) => {
    const set = pickedRef.current
    set.has(name) ? set.delete(name) : set.add(name)
    const arr = list.filter((t) => set.has(t))
    setPicked(arr)
    try { onChange?.(arr) } catch { /* caller error should not break the picker */ }
  }
  const toggleRef = useRef(toggle)
  toggleRef.current = toggle

  const host = useCanvasLoop((ctx, s) => {
    ctx.font = '500 13px "Geist Variable", system-ui, sans-serif'
    const balls = list.map((name, i) => {
      const r = clamp(ctx.measureText(name).width / 2 + 16, 26, 48)
      return { name, r, x: ((i * 97) % Math.max(1, s.w - 2 * r)) + r, y: -60 - i * 45, vx: (i % 2 ? 1 : -1) * 20, vy: 0, s: 1 }
    })
    let held = null, downAt = null
    return {
      down(p) {
        held = balls.find((b) => (b.x - p.x) ** 2 + (b.y - p.y) ** 2 < b.r * b.r) || null
        downAt = held ? { x: p.x, y: p.y, t: performance.now() } : null
      },
      up(p) {
        if (held && downAt && Math.hypot(p.x - downAt.x, p.y - downAt.y) < 6 && performance.now() - downAt.t < 350) { toggleRef.current(held.name); held.s = 1.25 }
        if (held) { held.vx = clamp(p.vx * 40, -1400, 1400); held.vy = clamp(p.vy * 40, -1400, 1400) }
        held = null; downAt = null
      },
      step(dt) {
        const g = 1100
        for (const b of balls) {
          if (b === held) { b.x = s.pointer.x; b.y = s.pointer.y; b.vx = 0; b.vy = 0 } else { b.vy += g * dt; b.x += b.vx * dt; b.y += b.vy * dt }
          if (b.x < b.r) { b.x = b.r; b.vx *= -0.5 } if (b.x > s.w - b.r) { b.x = s.w - b.r; b.vx *= -0.5 }
          if (b.y > s.h - b.r) { b.y = s.h - b.r; b.vy *= -0.35; b.vx *= 0.96 }
          b.s += (1 - b.s) * 0.15
        }
        for (let k = 0; k < 3; k++) for (let i = 0; i < balls.length; i++) for (let j = i + 1; j < balls.length; j++) {
          const a = balls[i], c = balls[j], dx = c.x - a.x, dy = c.y - a.y, d = Math.hypot(dx, dy) || 0.01, o = a.r + c.r - d
          if (o > 0) {
            const nx = dx / d, ny = dy / d, wa = a === held ? 0 : c === held ? 1 : 0.5, wc = 1 - wa
            a.x -= nx * o * wa; a.y -= ny * o * wa; c.x += nx * o * wc; c.y += ny * o * wc
            const rv = (c.vx - a.vx) * nx + (c.vy - a.vy) * ny
            if (rv < 0) { const imp = -rv * 0.6; a.vx -= nx * imp * wa; a.vy -= ny * imp * wa; c.vx += nx * imp * wc; c.vy += ny * imp * wc }
          }
        }
        ctx.clearRect(0, 0, s.w, s.h)
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '500 13px "Geist Variable", system-ui, sans-serif'
        for (const b of balls) {
          const on = pickedRef.current.has(b.name)
          ctx.beginPath(); ctx.arc(b.x, b.y, b.r * b.s, 0, Math.PI * 2)
          ctx.fillStyle = on ? color : '#141417'; ctx.fill()
          ctx.lineWidth = 1; ctx.strokeStyle = on ? color : '#2a2a30'; ctx.stroke()
          ctx.fillStyle = on ? '#09090a' : '#ededef'; ctx.fillText(b.name, b.x, b.y + 1)
        }
      },
    }
  }, [list.join('|'), color])

  return (
    <div className={`relative h-full min-h-80 w-full select-none overflow-hidden bg-bg ${className}`}>
      <div ref={host} className="absolute inset-0 cursor-pointer" />
      <div className="pointer-events-none absolute inset-x-0 top-3 text-center text-xs text-mute" aria-live="polite">
        {picked.length ? `${picked.length} picked: ${picked.slice(0, 4).join(', ')}${picked.length > 4 ? '…' : ''}` : 'Pick what you are into'}
      </div>
      <div className="sr-only">{list.map((t) => <button key={t} type="button" aria-pressed={picked.includes(t)} onClick={() => toggle(t)}>{t}</button>)}</div>
    </div>
  )
}
