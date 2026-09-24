import { useEffect, useRef } from 'react'

// Seeded random so the skyline is the same on every mount.
const rng = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647)

// Draws one tileable skyline strip with lit windows.
function skyline(w, h, { seed, minH, maxH, tone, lit, win }) {
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  const x = c.getContext('2d'), r = rng(seed)
  if (!x) return c
  let px = 0
  while (px < w) {
    const bw = 18 + r() * 46, bh = h * (minH + r() * (maxH - minH))
    const top = h - bh
    x.fillStyle = tone; x.fillRect(px, top, bw, bh)
    if (r() < 0.25) x.fillRect(px + bw * 0.4, top - 8 - r() * 14, 1.5, 22)
    for (let wy = top + 6; wy < h - 6; wy += win + 3) {
      for (let wx = px + 4; wx < px + bw - 4; wx += win + 3) {
        if (r() < lit) { x.fillStyle = r() < 0.8 ? 'rgba(255,196,120,.85)' : 'rgba(170,200,255,.7)'; x.fillRect(wx, wy, win, win - 1) }
      }
    }
    px += bw + r() * 4
  }
  return c
}

// A night city seen from a moving train: three skyline depths, passing lamps, road light trails.
export default function NightTransit({ children, speed = 1 }) {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current
    const ctx = c?.getContext('2d')
    if (!ctx) return
    let raf, w = 0, h = 0, last = performance.now(), t = 0, layers = []
    const build = () => {
      const d = Math.min(window.devicePixelRatio || 1, 2)
      w = c.clientWidth; h = c.clientHeight
      c.width = Math.max(1, w * d); c.height = Math.max(1, h * d); ctx.setTransform(d, 0, 0, d, 0, 0)
      const tw = Math.max(600, Math.ceil(w * 1.2))
      layers = [
        { img: skyline(tw, h * 0.62, { seed: 11, minH: 0.25, maxH: 0.8, tone: '#12131b', lit: 0.1, win: 2 }), v: 14, y: h * 0.2 },
        { img: skyline(tw, h * 0.6, { seed: 29, minH: 0.2, maxH: 0.7, tone: '#0c0d12', lit: 0.18, win: 3 }), v: 42, y: h * 0.28 },
        { img: skyline(tw, h * 0.45, { seed: 47, minH: 0.15, maxH: 0.55, tone: '#07070a', lit: 0.12, win: 4 }), v: 110, y: h * 0.46 },
      ].map((l) => ({ ...l, x: 0 }))
    }
    build()
    const ro = new ResizeObserver(build); ro.observe(c)
    const trails = Array.from({ length: 26 }, () => ({ x: Math.random(), lane: Math.random(), len: 20 + Math.random() * 60, red: Math.random() < 0.5 }))
    const draw = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000) * speed; last = now; t += dt
      const sky = ctx.createLinearGradient(0, 0, 0, h)
      sky.addColorStop(0, '#0a0c16'); sky.addColorStop(0.55, '#141222'); sky.addColorStop(0.78, '#2a1a1a'); sky.addColorStop(1, '#09090a')
      ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h)
      const glow = ctx.createRadialGradient(w * 0.7, h * 0.78, 0, w * 0.7, h * 0.78, w * 0.6)
      glow.addColorStop(0, 'rgba(255,106,43,.16)'); glow.addColorStop(1, 'rgba(255,106,43,0)')
      ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h)
      for (const l of layers) {
        l.x = (l.x + l.v * dt) % l.img.width
        const x0 = -l.x
        ctx.drawImage(l.img, x0, l.y); ctx.drawImage(l.img, x0 + l.img.width, l.y)
        if (x0 + l.img.width * 2 < w) ctx.drawImage(l.img, x0 + l.img.width * 2, l.y)
      }
      const road = h * 0.9
      ctx.fillStyle = '#060607'; ctx.fillRect(0, road - 4, w, h - road + 4)
      ctx.globalCompositeOperation = 'lighter'
      for (const tr of trails) {
        tr.x -= dt * (tr.red ? 0.25 : -0.35)
        if (tr.x < -0.2) tr.x = 1.2
        if (tr.x > 1.2) tr.x = -0.2
        const y = road + tr.lane * (h - road - 4)
        const g = ctx.createLinearGradient(tr.x * w, 0, tr.x * w + (tr.red ? tr.len : -tr.len), 0)
        const col = tr.red ? '255,60,50' : '255,230,190'
        g.addColorStop(0, `rgba(${col},.9)`); g.addColorStop(1, `rgba(${col},0)`)
        ctx.strokeStyle = g; ctx.lineWidth = 1.4
        ctx.beginPath(); ctx.moveTo(tr.x * w, y); ctx.lineTo(tr.x * w + (tr.red ? tr.len : -tr.len), y); ctx.stroke()
      }
      const gap = Math.max(260, w * 0.55), off = (t * 520) % gap
      for (let x = w - off; x > -40; x -= gap) {
        ctx.fillStyle = 'rgba(8,8,10,.95)'; ctx.fillRect(x, 0, 7, h)
        const f = ctx.createRadialGradient(x + 3, h * 0.12, 0, x + 3, h * 0.12, 90)
        f.addColorStop(0, 'rgba(255,190,120,.5)'); f.addColorStop(1, 'rgba(255,190,120,0)')
        ctx.fillStyle = f; ctx.fillRect(x - 90, h * 0.12 - 90, 180, 180)
      }
      ctx.globalCompositeOperation = 'source-over'
      const sheen = ctx.createLinearGradient(0, 0, w, h)
      sheen.addColorStop(0, 'rgba(255,255,255,0)'); sheen.addColorStop(0.45, 'rgba(255,255,255,.035)'); sheen.addColorStop(0.5, 'rgba(255,255,255,0)')
      ctx.fillStyle = sheen; ctx.fillRect(0, 0, w, h)
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [speed])
  return (
    <div className="relative size-full min-h-64 overflow-hidden bg-bg">
      <canvas ref={ref} className="absolute inset-0 size-full" aria-hidden />
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_120px_40px_rgba(0,0,0,.75)]" />
      <div className="pointer-events-none absolute inset-3 rounded-[26px] border border-white/[.06]" />
      <div className="relative grid size-full min-h-64 place-items-center">{children}</div>
    </div>
  )
}
