'use client'

import { useEffect, useRef } from 'react'

// Light or dark, read from the --bg token itself: works with a .dark class, a .light class, or neither.
const isLightTheme = () => {
  const h = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim().replace(/^#(.)(.)(.)$/, '#$1$1$2$2$3$3')
  return /^#[0-9a-f]{6}/i.test(h) ? [1, 3, 5].reduce((s, i, k) => s + parseInt(h.slice(i, i + 2), 16) * [0.299, 0.587, 0.114][k], 0) > 128 : !document.documentElement.classList.contains('dark')
}

/** @param {{ children?: any, gap?: any }} props */
export default function HalftoneTide({ children = undefined, gap = 14 }) {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current, ctx = c.getContext('2d')
    let raf, w, h
    const size = () => { const d = devicePixelRatio || 1; w = c.clientWidth; h = c.clientHeight; c.width = w * d; c.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0) }
    size(); const ro = new ResizeObserver(size); ro.observe(c)
    const draw = (t) => {
      t /= 1000; ctx.clearRect(0, 0, w, h)
      const ink = isLightTheme() ? '29,29,31' : '245,245,247'
      for (let y = gap / 2; y < h; y += gap) for (let x = gap / 2; x < w; x += gap) {
        const v = Math.sin(x * 0.012 + t * 1.1) + Math.sin(y * 0.02 - t * 0.8) + Math.sin((x + y) * 0.008 + t * 0.5)
        const r = Math.max(0.3, ((v + 3) / 6) * (gap * 0.42))
        ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283)
        ctx.fillStyle = `rgba(${ink},${v > 1.6 ? 0.55 : 0.05 + ((v + 3) / 6) * 0.18})`; ctx.fill()
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
