import { useCanvasLoop } from './canvas-loop'

// Short strokes that turn to face the pointer like filings around a magnet.
// When nobody is pointing, a slow magnet drifts on its own.
export default function IronFilings({ gap = 22, color = '#ff6a2b', className = '', children }) {
  const host = useCanvasLoop((ctx, s) => {
    const g = Math.max(12, Number(gap) || 22)
    let idle = 0, mx = s.w / 2, my = s.h / 2
    return {
      step(dt) {
        const p = s.pointer
        let tx = p.x, ty = p.y
        if (!p.inside) { idle += s.reduce ? 0 : dt; tx = s.w / 2 + Math.cos(idle * 0.5) * s.w * 0.28; ty = s.h / 2 + Math.sin(idle * 0.8) * s.h * 0.22 }
        mx += (tx - mx) * 0.12; my += (ty - my) * 0.12
        ctx.clearRect(0, 0, s.w, s.h)
        ctx.lineCap = 'round'
        const diag = Math.hypot(s.w, s.h)
        for (let y = g / 2; y < s.h; y += g) for (let x = g / 2; x < s.w; x += g) {
          const dx = mx - x, dy = my - y, d = Math.hypot(dx, dy) || 1
          const near = Math.max(0, 1 - d / (diag * 0.45))
          const len = 3 + near * g * 0.45
          const a = Math.atan2(dy, dx)
          const cx = Math.cos(a) * len / 2, cy = Math.sin(a) * len / 2
          ctx.strokeStyle = near > 0.6 ? color : `rgba(138,138,147,${0.25 + near * 0.6})`
          ctx.lineWidth = 1 + near * 1.2
          ctx.beginPath(); ctx.moveTo(x - cx, y - cy); ctx.lineTo(x + cx, y + cy); ctx.stroke()
        }
      },
    }
  }, [gap, color])
  return (
    <div ref={host} className={`relative h-full min-h-72 w-full overflow-hidden bg-bg ${className}`}>
      {children && <div className="pointer-events-none relative z-10 grid h-full min-h-72 place-items-center p-6">{children}</div>}
    </div>
  )
}
