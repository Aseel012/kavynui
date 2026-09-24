import { useEffect, useRef } from 'react'
import { worldDots, project, COLS, ROWS } from './world-dots'

const HUBS = [
  { id: 'BOM', lat: 19.07, lon: 72.87 }, { id: 'FRA', lat: 50.11, lon: 8.68 }, { id: 'IAD', lat: 38.95, lon: -77.45 },
  { id: 'SFO', lat: 37.62, lon: -122.38 }, { id: 'SIN', lat: 1.35, lon: 103.99 }, { id: 'GRU', lat: -23.43, lon: -46.47 },
  { id: 'NRT', lat: 35.77, lon: 140.39 }, { id: 'SYD', lat: -33.94, lon: 151.18 }, { id: 'JNB', lat: -26.14, lon: 28.24 },
  { id: 'LHR', lat: 51.47, lon: -0.45 }, { id: 'DXB', lat: 25.25, lon: 55.36 },
]

// Cloudflare-style dotted world map with live request arcs between edge locations.
export default function TrafficMap({ hubs = HUBS, arcs = 7, color = '255,106,43', className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current
    const ctx = c?.getContext('2d')
    if (!ctx || !hubs?.length) return
    const dots = worldDots()
    let w = 0, h = 0, raf, last = performance.now()
    const size = () => {
      const d = Math.min(window.devicePixelRatio || 1, 2)
      w = c.clientWidth; h = c.clientHeight
      c.width = Math.max(1, w * d); c.height = Math.max(1, h * d); ctx.setTransform(d, 0, 0, d, 0, 0)
    }
    size()
    const ro = new ResizeObserver(size); ro.observe(c)
    const pick = () => {
      const a = hubs[(Math.random() * hubs.length) | 0]
      let b = a
      while (b === a && hubs.length > 1) b = hubs[(Math.random() * hubs.length) | 0]
      return { a, b, t: -Math.random() * 1.2, speed: 0.35 + Math.random() * 0.3 }
    }
    const live = Array.from({ length: arcs }, pick)
    const flashes = []
    const pos = (p) => project(p.lat, p.lon, w, h)
    const bez = (A, B, t) => {
      const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2 - Math.hypot(B[0] - A[0], B[1] - A[1]) * 0.35
      const u = 1 - t
      return [u * u * A[0] + 2 * u * t * mx + t * t * B[0], u * u * A[1] + 2 * u * t * my + t * t * B[1]]
    }
    const draw = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now
      ctx.clearRect(0, 0, w, h)
      const pitch = w / COLS, r = Math.max(0.6, pitch * 0.26)
      ctx.fillStyle = document.documentElement.classList.contains('light') ? 'rgba(20,20,23,0.22)' : 'rgba(237,237,239,0.16)'
      for (const d of dots) {
        const x = (d.col + 0.5) * pitch, y = (d.row + 0.5) * (h / ROWS)
        ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill()
      }
      for (const arc of live) {
        arc.t += dt * arc.speed
        if (arc.t > 1.35) { flashes.push({ p: arc.b, t: 0 }); Object.assign(arc, pick(), { t: 0 }) }
        if (arc.t <= 0) continue
        const A = pos(arc.a), B = pos(arc.b)
        const head = Math.min(1, arc.t), tail = Math.max(0, Math.min(1, arc.t - 0.35))
        ctx.lineWidth = 1.2; ctx.lineCap = 'round'
        const steps = 24
        for (let i = 0; i < steps; i++) {
          const t0 = tail + ((head - tail) * i) / steps, t1 = tail + ((head - tail) * (i + 1)) / steps
          const p0 = bez(A, B, t0), p1 = bez(A, B, t1)
          ctx.strokeStyle = `rgba(${color},${(i / steps) * 0.9})`
          ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.stroke()
        }
        if (arc.t < 1) { const p = bez(A, B, head); ctx.fillStyle = `rgb(${color})`; ctx.beginPath(); ctx.arc(p[0], p[1], 1.8, 0, 6.283); ctx.fill() }
      }
      for (let i = flashes.length - 1; i >= 0; i--) {
        const f = flashes[i]; f.t += dt * 1.4
        if (f.t > 1) { flashes.splice(i, 1); continue }
        const [x, y] = pos(f.p)
        ctx.strokeStyle = `rgba(${color},${1 - f.t})`; ctx.lineWidth = 1
        ctx.beginPath(); ctx.arc(x, y, 2 + f.t * 14, 0, 6.283); ctx.stroke()
      }
      for (const hub of hubs) {
        const [x, y] = pos(hub)
        ctx.fillStyle = `rgba(${color},0.25)`; ctx.beginPath(); ctx.arc(x, y, 4, 0, 6.283); ctx.fill()
        ctx.fillStyle = `rgb(${color})`; ctx.beginPath(); ctx.arc(x, y, 1.8, 0, 6.283); ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [hubs, arcs, color])
  return (
    <div className={`relative w-full ${className}`} style={{ aspectRatio: `${COLS} / ${ROWS}` }}>
      <canvas ref={ref} className="absolute inset-0 size-full" aria-label="Live traffic map" role="img" />
    </div>
  )
}
