import { useCanvasLoop } from './canvas-loop'

// A comet follows the pointer: a chain of springs, so the tail swings when you turn.
export default function CometTrail({ color = '#ff6a2b', length = 26, className = '', children }) {
  const host = useCanvasLoop((ctx, s) => {
    const n = Math.min(60, Math.max(6, Math.round(Number(length) || 26)))
    const pts = Array.from({ length: n }, () => ({ x: s.w / 2, y: s.h / 2 }))
    let idle = 0
    return {
      step(dt) {
        const p = s.pointer
        let tx = p.x, ty = p.y
        if (!p.inside) { idle += s.reduce ? 0 : dt; tx = s.w / 2 + Math.sin(idle * 1.1) * s.w * 0.32; ty = s.h / 2 + Math.sin(idle * 2.2) * s.h * 0.2 }
        pts[0].x += (tx - pts[0].x) * 0.35; pts[0].y += (ty - pts[0].y) * 0.35
        for (let i = 1; i < n; i++) { pts[i].x += (pts[i - 1].x - pts[i].x) * 0.42; pts[i].y += (pts[i - 1].y - pts[i].y) * 0.42 }
        ctx.fillStyle = 'rgba(9,9,10,0.35)'; ctx.fillRect(0, 0, s.w, s.h)
        ctx.lineCap = 'round'
        for (let i = n - 1; i > 0; i--) {
          const k = 1 - i / n
          ctx.strokeStyle = color; ctx.globalAlpha = k * 0.9; ctx.lineWidth = 1 + k * 9
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[i - 1].x, pts[i - 1].y); ctx.stroke()
        }
        ctx.globalAlpha = 1; ctx.fillStyle = '#fff'
        ctx.beginPath(); ctx.arc(pts[0].x, pts[0].y, 4, 0, Math.PI * 2); ctx.fill()
      },
    }
  }, [color, length])
  return (
    <div ref={host} className={`relative h-full min-h-72 w-full overflow-hidden bg-bg ${className}`}>
      <div className="pointer-events-none relative z-10 grid h-full min-h-72 place-items-center p-6">{children ?? <span className="text-sm text-faint">Move around in here</span>}</div>
    </div>
  )
}
