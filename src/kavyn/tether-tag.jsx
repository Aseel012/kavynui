import { useCanvasLoop, clamp } from './canvas-loop'

// A promo tag hanging on a chain. Grab it, swing it, let it go.
export default function TetherTag({ label = '30% off', sub = 'Launch week', color = '#ff6a2b', links = 12, className = '' }) {
  const host = useCanvasLoop((ctx, s) => {
    const n = clamp(Math.round(Number(links) || 12), 4, 30)
    let pts = [], seg = 10, grab = false
    const build = () => {
      seg = Math.max(6, s.h * 0.42 / n)
      pts = Array.from({ length: n + 1 }, (_, i) => ({ x: s.w / 2 + i * 3, y: 14 + i * seg, px: s.w / 2 + i * 3 - 6, py: 14 + i * seg }))
    }
    build()
    const tagW = 120, tagH = 64
    const end = () => pts[pts.length - 1]
    const near = (p) => { const e = end(); return Math.abs(p.x - e.x) < tagW * 0.7 && p.y > e.y - 10 && p.y < e.y + tagH + 20 }
    return {
      resize: build,
      down(p) { grab = near(p) },
      up() { grab = false },
      step(dt) {
        const g = s.reduce ? 0 : 900
        for (let i = 1; i < pts.length; i++) {
          const q = pts[i], vx = (q.x - q.px) * 0.985, vy = (q.y - q.py) * 0.985
          q.px = q.x; q.py = q.y; q.x += vx; q.y += vy + g * dt * dt
        }
        if (grab) { const e = end(); e.x = clamp(s.pointer.x, 10, s.w - 10); e.y = clamp(s.pointer.y, 10, s.h - tagH - 4) }
        pts[0].x = s.w / 2; pts[0].y = 14
        for (let k = 0; k < 8; k++) {
          for (let i = 0; i < pts.length - 1; i++) {
            const a = pts[i], b = pts[i + 1], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, diff = (d - seg) / d
            const wa = i === 0 ? 0 : 0.5, wb = i === 0 ? 1 : 0.5
            a.x += dx * diff * wa; a.y += dy * diff * wa; b.x -= dx * diff * wb; b.y -= dy * diff * wb
          }
        }
        ctx.clearRect(0, 0, s.w, s.h)
        ctx.fillStyle = '#2a2a30'; ctx.beginPath(); ctx.arc(pts[0].x, pts[0].y, 5, 0, Math.PI * 2); ctx.fill()
        ctx.lineWidth = 3; ctx.lineCap = 'round'
        for (let i = 0; i < pts.length - 1; i++) {
          ctx.strokeStyle = i % 2 ? '#5c5c66' : '#8a8a93'
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[i + 1].x, pts[i + 1].y); ctx.stroke()
        }
        const e = end(), b = pts[pts.length - 2], ang = Math.atan2(e.y - b.y, e.x - b.x) - Math.PI / 2
        ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(ang)
        ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 6
        ctx.fillStyle = color; ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(-tagW / 2, 4, tagW, tagH, 12); else ctx.rect(-tagW / 2, 4, tagW, tagH); ctx.fill()
        ctx.shadowColor = 'transparent'
        ctx.fillStyle = '#09090a'; ctx.beginPath(); ctx.arc(0, 14, 4, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = '#fff'; ctx.textAlign = 'center'
        ctx.font = '600 20px "Geist Variable", system-ui, sans-serif'; ctx.fillText(String(label), 0, 44)
        ctx.font = '500 11px "Geist Variable", system-ui, sans-serif'; ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.fillText(String(sub), 0, 60)
        ctx.restore()
      },
    }
  }, [label, sub, color, links])
  return (
    <div ref={host} className={`relative h-full min-h-80 w-full cursor-grab select-none overflow-hidden bg-bg active:cursor-grabbing ${className}`} role="img" aria-label={`${label}, ${sub}`}>
      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] text-faint">Drag the tag</div>
    </div>
  )
}
