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

// Renders a block at a narrow width (so it reflows tall), scaled to the thumbnail's width:
// the whole block stays visible edge to edge; tall blocks crop at the bottom, short ones center.
function Thumb({ children, width = 680 }) {
  const ref = useRef(null), inner = useRef(null)
  const [fit, setFit] = useState({ s: 0, y: 0 })
  useLayoutEffect(() => {
    if (!ref.current) return
    const calc = () => {
      if (!ref.current || !inner.current) return
      const kid = inner.current.firstElementChild
      const kh = kid ? kid.offsetHeight : 0
      if (!kh) return
      const w = ref.current.clientWidth, h = ref.current.clientHeight
      // Fit the card width exactly - never upscale, so no text is ever cropped off the sides.
      // Short blocks center vertically; tall blocks crop at the bottom edge only.
      const s = w / width
      const y = Math.max(0, (h - kh * s) / 2)
      setFit((o) => (Math.abs(o.s - s) < 0.005 && Math.abs(o.y - y) < 1 ? o : { s, y }))
    }
    calc()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(calc)
    ro.observe(ref.current)
    if (inner.current && inner.current.firstElementChild) ro.observe(inner.current.firstElementChild)
    return () => ro.disconnect()
  }, [width])
  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        ref={inner}
        style={{ width, marginTop: fit.y, transform: `scale(${fit.s})`, transformOrigin: '0 0', visibility: fit.s > 0 ? 'visible' : 'hidden' }}
        className="p-6"
      >
        {children}
      </div>
    </div>
  )
}

const WIDE = new Set(['review-rail', 'traffic-map'])
// Grows downward at natural size on the detail page instead of being Fit-scaled into the fixed pane.
export const GROW = new Set(['dropzone'])

// Per-component props used only by the site demo, never by the installed component.
// Local portrait assets (public/avatars/) keep the demo CSP-safe (img-src 'self').
const WAITLIST_PEOPLE = ['AK', 'MS', 'RJ', 'PN', 'DV', 'SL', 'TK', 'IB', 'AR', 'NK', 'SP', 'RM']
  .map((initials, i) => ({ id: `p${i + 1}`, src: `/avatars/p${i + 1}.jpg`, initials, hue: '#3a3a3d' }))
const DEMO_PROPS = {
  'waitlist-form': { autoJoin: true, autoJoinInterval: 4800, people: WAITLIST_PEOPLE },
  dropzone: { autoDemo: true },
  'avatar-upload': { demoSrc: '/avatars/p3.jpg' },
}

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
  } else if (page === 'detail' && mode === 'frame' && (GROW.has(item.slug) || item.layout === 'inline')) {
    // Detail page renders these in a natural-size, growing pane (GROW members) or an in-flow
    // container (layout: 'inline') - a Fit here would absolute-anchor to the viewport and spill.
    body = <div className="flex justify-center px-4 py-8"><C {...(DEMO_PROPS[item.slug] || {})} /></div>
  } else {
    body = <Fit wide={WIDE.has(item.slug)}><C {...(DEMO_PROPS[item.slug] || {})} /></Fit>
  }
  const inline = item.family === 'blocks' && mode !== 'thumb'
  return (
    <ErrorBoundary compact resetKey={item.slug}>
      <Suspense fallback={inline ? <div className="h-80 animate-pulse rounded-2xl bg-panel" /> : <Loading />}>{body}</Suspense>
    </ErrorBoundary>
  )
}

// Mounts the demo the first time it scrolls near the screen, then keeps it.
export function LazyDemo({ item, page, mode }) {
  const ref = useRef(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    if (typeof IntersectionObserver === 'undefined') { setOn(true); return }
    // Once a demo has mounted it stays mounted, so scrolled-past cards never blank out.
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setOn(true); io.disconnect() }
    }, { rootMargin: '200px 0px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return <div ref={ref} className="absolute inset-0">{on && <Demo item={item} page={page} mode={mode} />}</div>
}
