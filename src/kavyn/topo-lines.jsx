'use client'

import { useEffect, useRef } from 'react'

// Light or dark, read from the --bg token itself: works with a .dark class, a .light class, or neither.
const isLightTheme = () => {
  const h = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim().replace(/^#(.)(.)(.)$/, '#$1$1$2$2$3$3')
  return /^#[0-9a-f]{6}/i.test(h) ? [1, 3, 5].reduce((s, i, k) => s + parseInt(h.slice(i, i + 2), 16) * [0.299, 0.587, 0.114][k], 0) > 128 : !document.documentElement.classList.contains('dark')
}

/** @param {{ children?: any, lines?: any, color?: any }} props */
export default function TopoLines({ children = undefined, lines = 14, color = undefined }) {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current, ctx = c.getContext('2d')
    let raf, w, h
    const size = () => { const d = devicePixelRatio || 1; w = c.clientWidth; h = c.clientHeight; c.width = w * d; c.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0) }
    size(); const ro = new ResizeObserver(size); ro.observe(c)
    const draw = (t) => {
      t /= 1000; ctx.clearRect(0, 0, w, h)
      const ink = color || (isLightTheme() ? '29,29,31' : '245,245,247')
      for (let k = 0; k < lines; k++) {
        ctx.beginPath()
        for (let a = 0; a <= 64; a++) {
          const th = (a / 64) * Math.PI * 2
          const r = (k + 1) * (Math.max(w, h) / lines / 1.6) * (1 + 0.18 * Math.sin(th * 3 + t * 0.4 + k * 0.3) + 0.08 * Math.sin(th * 5 - t * 0.3))
          const x = w * 0.62 + Math.cos(th) * r, y = h * 0.55 + Math.sin(th) * r * 0.75
          a ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
        }
        ctx.strokeStyle = `rgba(${ink},${k % 5 === 4 ? 0.32 : 0.06 + (k % 3) * 0.03})`
        ctx.lineWidth = k % 5 === 4 ? 1.2 : 1; ctx.stroke()
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [lines, color])
  return (
    <div className="relative size-full min-h-64 overflow-hidden bg-bg">
      <canvas ref={ref} className="absolute inset-0 size-full" />
      <div className="relative grid size-full min-h-64 place-items-center">{children}</div>
    </div>
  )
}
