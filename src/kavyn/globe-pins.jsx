import { useEffect, useRef } from 'react'

const PINS = [
  { lat: 12.97, lon: 77.59, label: 'Bengaluru' },
  { lat: 51.5, lon: -0.12, label: 'London' },
  { lat: 37.77, lon: -122.42, label: 'San Francisco' },
  { lat: 1.35, lon: 103.82, label: 'Singapore' },
]

export default function GlobePins({ pins = PINS, size = 280, speed = 0.12 }) {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current, ctx = c.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    c.width = size * dpr; c.height = size * dpr; ctx.scale(dpr, dpr)
    const N = 900, pts = []
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.39996
      pts.push([Math.cos(th) * r, y, Math.sin(th) * r])
    }
    const pp = pins.map((p) => { const la = (p.lat * Math.PI) / 180, lo = (p.lon * Math.PI) / 180; return [Math.cos(la) * Math.cos(lo), Math.sin(la), Math.cos(la) * Math.sin(lo)] })
    let rot = 0, raf, last = performance.now(), dragging = false, px = 0
    const R = size * 0.42, cx = size / 2, cy = size / 2, tilt = 0.35
    const proj = ([x, y, z]) => {
      const X = x * Math.cos(rot) - z * Math.sin(rot), Z = x * Math.sin(rot) + z * Math.cos(rot)
      const Y = y * Math.cos(tilt) - Z * Math.sin(tilt), Z2 = y * Math.sin(tilt) + Z * Math.cos(tilt)
      return [cx + X * R, cy - Y * R, Z2]
    }
    const draw = (now) => {
      const dt = now - last; last = now
      if (!dragging) rot += (speed * dt) / 1000
      ctx.clearRect(0, 0, size, size)
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = '#0f0f11'; ctx.fill()
      const lite = document.documentElement.classList.contains('light')
      for (const p of pts) { const [x, y, z] = proj(p); if (z < 0) continue; ctx.fillStyle = lite ? `rgba(20,20,23,${0.1 + z * 0.4})` : `rgba(237,237,239,${0.08 + z * 0.35})`; ctx.fillRect(x, y, 1.4, 1.4) }
      const pulse = (now / 1400) % 1
      pp.forEach((p, i) => {
        const [x, y, z] = proj(p); if (z < 0) return
        ctx.beginPath(); ctx.arc(x, y, 3 + pulse * 12, 0, Math.PI * 2); ctx.strokeStyle = `rgba(255,106,43,${(1 - pulse) * 0.8})`; ctx.stroke()
        ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fillStyle = '#ff6a2b'; ctx.fill()
        ctx.fillStyle = lite ? `rgba(20,20,23,${0.4 + z * 0.6})` : `rgba(237,237,239,${z})`; ctx.font = '10px ui-monospace, monospace'; ctx.fillText(pins[i].label, x + 7, y + 3)
      })
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    const down = (e) => { dragging = true; px = e.clientX; c.setPointerCapture(e.pointerId) }
    const move = (e) => { if (dragging) { rot += (e.clientX - px) * 0.01; px = e.clientX } }
    const up = () => (dragging = false)
    c.addEventListener('pointerdown', down); c.addEventListener('pointermove', move); c.addEventListener('pointerup', up)
    return () => { cancelAnimationFrame(raf); c.removeEventListener('pointerdown', down); c.removeEventListener('pointermove', move); c.removeEventListener('pointerup', up) }
  }, [pins, size, speed])
  return <canvas ref={ref} style={{ width: size, height: size }} className="cursor-grab touch-none active:cursor-grabbing" />
}
