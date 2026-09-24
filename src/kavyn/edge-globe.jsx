import { useEffect, useRef } from 'react'
import { worldDots } from './world-dots'

const HUBS = [[19.07, 72.87], [50.11, 8.68], [38.95, -77.45], [1.35, 103.99], [-23.43, -46.47], [35.77, 140.39], [-33.94, 151.18], [25.25, 55.36]]
const rad = Math.PI / 180
const vec = (lat, lon) => [Math.cos(lat * rad) * Math.sin(lon * rad), Math.sin(lat * rad), Math.cos(lat * rad) * Math.cos(lon * rad)]
const slerp = (a, b, t) => {
  const d = Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])))
  if (d < 1e-4) return a
  const s = Math.sin(d), k0 = Math.sin((1 - t) * d) / s, k1 = Math.sin(t * d) / s
  return [a[0] * k0 + b[0] * k1, a[1] * k0 + b[1] * k1, a[2] * k0 + b[2] * k1]
}

// Rotating dotted globe of real land masses with arcs between edge locations. Drag to spin.
export default function EdgeGlobe({ size = 320, hubs = HUBS, speed = 0.18, color = '255,106,43' }) {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current
    const ctx = c?.getContext('2d')
    if (!ctx) return
    const d = Math.min(window.devicePixelRatio || 1, 2)
    c.width = size * d; c.height = size * d; ctx.setTransform(d, 0, 0, d, 0, 0)
    const pts = worldDots().map((p) => vec(p.lat, p.lon))
    const H = hubs.map(([la, lo]) => vec(la, lo))
    const arcs = Array.from({ length: Math.min(5, H.length) }, (_, i) => ({ a: i % H.length, b: (i * 3 + 2) % H.length, t: -i * 0.3 }))
    let rot = -1.3, raf, last = performance.now(), drag = null
    const R = size * 0.44, cx = size / 2, cy = size / 2, tilt = -0.3
    const proj = ([x, y, z], lift = 1) => {
      const X = x * Math.cos(rot) + z * Math.sin(rot), Z = -x * Math.sin(rot) + z * Math.cos(rot)
      const Y = y * Math.cos(tilt) - Z * Math.sin(tilt), Z2 = y * Math.sin(tilt) + Z * Math.cos(tilt)
      return [cx + X * R * lift, cy - Y * R * lift, Z2]
    }
    const draw = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now
      if (!drag) rot += speed * dt
      ctx.clearRect(0, 0, size, size)
      const lite = document.documentElement.classList.contains('light')
      const g = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R)
      if (lite) { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#e8e8ec') } else { g.addColorStop(0, '#16161a'); g.addColorStop(1, '#0b0b0d') }
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.fill()
      ctx.strokeStyle = lite ? 'rgba(20,20,23,0.16)' : 'rgba(237,237,239,0.08)'; ctx.stroke()
      for (const p of pts) {
        const [x, y, z] = proj(p)
        if (z < 0) continue
        ctx.fillStyle = lite ? `rgba(20,20,23,${0.14 + z * 0.5})` : `rgba(237,237,239,${0.1 + z * 0.45})`
        ctx.fillRect(x - 0.8, y - 0.8, 1.6, 1.6)
      }
      for (const arc of arcs) {
        arc.t += dt * 0.4
        if (arc.t > 1.4) { arc.t = 0; arc.a = arc.b; arc.b = (arc.b + 1 + ((Math.random() * (H.length - 1)) | 0)) % H.length }
        if (arc.t <= 0) continue
        const head = Math.min(1, arc.t), tail = Math.max(0, arc.t - 0.4)
        for (let i = 0; i < 20; i++) {
          const t0 = tail + ((head - tail) * i) / 20, t1 = tail + ((head - tail) * (i + 1)) / 20
          const l0 = 1 + Math.sin(t0 * Math.PI) * 0.18, l1 = 1 + Math.sin(t1 * Math.PI) * 0.18
          const p0 = proj(slerp(H[arc.a], H[arc.b], t0), l0), p1 = proj(slerp(H[arc.a], H[arc.b], t1), l1)
          if (p0[2] < -0.1 || p1[2] < -0.1) continue
          ctx.strokeStyle = `rgba(${color},${(i / 20) * 0.95})`; ctx.lineWidth = 1.3
          ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.stroke()
        }
      }
      const pulse = (now / 1600) % 1
      for (const h of H) {
        const [x, y, z] = proj(h)
        if (z < 0) continue
        ctx.strokeStyle = `rgba(${color},${(1 - pulse) * 0.7 * z})`
        ctx.beginPath(); ctx.arc(x, y, 2 + pulse * 9, 0, 6.283); ctx.stroke()
        ctx.fillStyle = `rgb(${color})`; ctx.beginPath(); ctx.arc(x, y, 2, 0, 6.283); ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    const down = (e) => { drag = e.clientX; c.setPointerCapture?.(e.pointerId) }
    const move = (e) => { if (drag !== null) { rot += (e.clientX - drag) * 0.008; drag = e.clientX } }
    const up = () => { drag = null }
    c.addEventListener('pointerdown', down); c.addEventListener('pointermove', move)
    c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up)
    return () => {
      cancelAnimationFrame(raf)
      c.removeEventListener('pointerdown', down); c.removeEventListener('pointermove', move)
      c.removeEventListener('pointerup', up); c.removeEventListener('pointercancel', up)
    }
  }, [size, hubs, speed, color])
  return <canvas ref={ref} style={{ width: size, height: size }} className="cursor-grab touch-none active:cursor-grabbing" role="img" aria-label="Rotating globe" />
}
