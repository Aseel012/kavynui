import { useEffect, useRef } from 'react'

export default function HalftoneTide({ children, gap = 14 }) {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current, ctx = c.getContext('2d')
    let raf, w, h
    const size = () => { const d = devicePixelRatio || 1; w = c.clientWidth; h = c.clientHeight; c.width = w * d; c.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0) }
    size(); const ro = new ResizeObserver(size); ro.observe(c)
    const draw = (t) => {
      t /= 1000; ctx.clearRect(0, 0, w, h)
      for (let y = gap / 2; y < h; y += gap) for (let x = gap / 2; x < w; x += gap) {
        const v = Math.sin(x * 0.012 + t * 1.1) + Math.sin(y * 0.02 - t * 0.8) + Math.sin((x + y) * 0.008 + t * 0.5)
        const r = Math.max(0.3, ((v + 3) / 6) * (gap * 0.42))
        ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283)
        ctx.fillStyle = v > 1.6 ? 'rgba(255,106,43,.7)' : `rgba(237,237,239,${0.05 + ((v + 3) / 6) * 0.18})`; ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [gap])
  return (
    <div className="relative size-full min-h-64 overflow-hidden bg-bg">
      <canvas ref={ref} className="absolute inset-0 size-full" />
      <div className="relative grid size-full min-h-64 place-items-center">{children}</div>
    </div>
  )
}
