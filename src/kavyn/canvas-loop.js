import { useEffect, useRef } from 'react'

// Shared 2D canvas runner for the physics and particle pieces.
// Sizes the canvas to its box (capped DPR), pauses off screen and in hidden tabs,
// tracks the pointer in CSS pixels, and hands your step() a ready context.
export function useCanvasLoop(setup, deps = []) {
  const host = useRef(null)
  useEffect(() => {
    const el = host.current
    if (!el || typeof window === 'undefined') return
    const canvas = document.createElement('canvas')
    canvas.setAttribute('aria-hidden', 'true')
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none'
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    el.prepend(canvas)
    const reduce = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const state = { w: 0, h: 0, dpr: 1, pointer: { x: -9999, y: -9999, down: false, inside: false, vx: 0, vy: 0 }, reduce }
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const w = Math.max(1, el.clientWidth), h = Math.max(1, el.clientHeight)
      if (w === state.w && h === state.h && dpr === state.dpr) return false
      state.w = w; state.h = h; state.dpr = dpr
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      return true
    }
    resize()
    let api = null
    try { api = setup(ctx, state) || {} } catch { api = {} }
    const pos = (e) => { const r = el.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top } }
    const onMove = (e) => { const p = pos(e); const q = state.pointer; q.vx = p.x - q.x; q.vy = p.y - q.y; q.x = p.x; q.y = p.y; q.inside = true; api.move?.(q) }
    const onDown = (e) => { const p = pos(e); Object.assign(state.pointer, p, { down: true, inside: true, vx: 0, vy: 0 }); try { canvas.setPointerCapture(e.pointerId) } catch { /* ignore */ } api.down?.(state.pointer) }
    const onUp = () => { state.pointer.down = false; api.up?.(state.pointer) }
    const onLeave = () => { if (!state.pointer.down) { state.pointer.inside = false; state.pointer.x = -9999; state.pointer.y = -9999 } }
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)
    canvas.addEventListener('pointerleave', onLeave)
    let raf = 0, visible = true, prev = performance.now()
    const loop = (now) => {
      raf = 0
      if (resize()) api.resize?.()
      const dt = Math.min(1 / 30, Math.max(0, (now - prev) / 1000)); prev = now
      try { api.step?.(dt, now / 1000) } catch { return }
      if (visible && !document.hidden) raf = requestAnimationFrame(loop)
    }
    const start = () => { if (!raf) { prev = performance.now(); raf = requestAnimationFrame(loop) } }
    const io = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(([e]) => { visible = !!e?.isIntersecting; if (visible) start() }) : null
    io?.observe(el)
    const onVis = () => { if (!document.hidden) start() }
    document.addEventListener('visibilitychange', onVis)
    start()
    return () => {
      cancelAnimationFrame(raf); io?.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      canvas.remove()
    }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
  return host
}

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
