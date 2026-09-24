import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { getComponent } from '@/lib/registry'
import ErrorBoundary from './ErrorBoundary'

// Scales a demo down to fit its frame, never up.
export function Fit({ children, pad = 16, wide = false }) {
  const outer = useRef(null), inner = useRef(null)
  const [f, setF] = useState({ s: 1, w: null })
  useLayoutEffect(() => {
    if (!outer.current || !inner.current) return
    const calc = () => {
      if (!outer.current || !inner.current) return
      const ow = outer.current.clientWidth - pad * 2, oh = outer.current.clientHeight - pad * 2
      if (ow <= 0 || oh <= 0) return
      const base = wide ? ow : Math.min(440, ow)
      const kid = inner.current.firstElementChild
      const kw = kid ? kid.offsetWidth : base, kh = kid ? kid.offsetHeight : 0
      const w = Math.max(base, kw)
      const s = Math.min(1, wide ? 1 : ow / Math.max(w, 1), oh / Math.max(kh, 1))
      setF((o) => (Math.abs(o.s - s) < 0.005 && o.w === w ? o : { s, w }))
    }
    calc()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(calc)
    ro.observe(outer.current)
    if (inner.current.firstElementChild) ro.observe(inner.current.firstElementChild)
    return () => ro.disconnect()
  }, [pad, wide])
  return (
    <div ref={outer} className="absolute inset-0 overflow-hidden">
      <div
        ref={inner}
        style={{ width: f.w ?? `min(440px, calc(100% - ${pad * 2}px))`, transform: `translate(-50%, -50%) scale(${f.s})` }}
        className="absolute left-1/2 top-1/2 flex items-center justify-center"
      >
        {children}
      </div>
    </div>
  )
}

// Renders a full-width block at a desktop width, scaled to the thumbnail.
export function Thumb({ children, width = 1120 }) {
  const ref = useRef(null)
  const [s, setS] = useState(0)
  useLayoutEffect(() => {
    if (!ref.current) return
    const calc = () => ref.current && setS(ref.current.clientWidth / width)
    calc()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(calc); ro.observe(ref.current)
    return () => ro.disconnect()
  }, [width])
  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {s > 0 && <div style={{ width, transform: `scale(${s})`, transformOrigin: '0 0' }} className="p-6">{children}</div>}
    </div>
  )
}

const WIDE = new Set(['ticker-tape', 'review-rail', 'traffic-map'])

export function Loading({ label }) {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="flex flex-col items-center gap-2">
        <span className="size-1.5 animate-pulse rounded-full bg-faint" />
        {label && <span className="text-[11px] text-faint">{label}</span>}
      </div>
    </div>
  )
}

export function Demo({ item, page, mode = 'frame' }) {
  const C = item ? getComponent(item.slug) : null
  if (!C) return <div className="absolute inset-0 grid place-items-center text-xs text-faint">Preview unavailable</div>
  let body
  if (item.family === 'bg' || item.family === 'shaders') {
    body = (
      <div className="absolute inset-0">
        <C><div className="text-center"><div className="text-lg font-medium tracking-tight text-tx">{item.useCase}</div><div className="mt-1 text-xs text-mute">{item.name}</div></div></C>
      </div>
    )
  } else if (item.layout === 'fill') {
    body = <div className="absolute inset-0"><C /></div>
  } else if (item.family === 'blocks') {
    body = mode === 'thumb' ? <Thumb><C /></Thumb> : <C />
  } else {
    body = <Fit wide={WIDE.has(item.slug)}><C /></Fit>
  }
  const inline = item.family === 'blocks' && mode !== 'thumb'
  return (
    <ErrorBoundary compact resetKey={item.slug}>
      <Suspense fallback={inline ? <div className="h-80 animate-pulse rounded-2xl bg-panel" /> : <Loading />}>{body}</Suspense>
    </ErrorBoundary>
  )
}

// Mounts the demo only while it is on screen, so 100+ live previews stay smooth.
export function LazyDemo({ item, page, mode }) {
  const ref = useRef(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    if (typeof IntersectionObserver === 'undefined') { setOn(true); return }
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: '200px 0px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return <div ref={ref} className="absolute inset-0">{on && <Demo item={item} page={page} mode={mode} />}</div>
}
