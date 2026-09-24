import { useSEO } from '@/lib/seo'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { components } from '@/lib/catalog'
import { Demo } from '@/site/Preview'

// Mounts a block when it scrolls near the viewport and keeps its height once measured.
function LazyBlock({ item }) {
  const ref = useRef(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    if (typeof IntersectionObserver === 'undefined') { setOn(true); return }
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { rootMargin: '400px 0px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return <div ref={ref} className="relative min-h-72">{on ? <Demo item={item} page="blocks" /> : <div className="h-72 rounded-2xl bg-panel/60" />}</div>
}

export default function Blocks() {
  const blocks = components.filter((c) => c.family === 'blocks')
  useSEO({ title: 'Blocks - kavynUI', description: 'Whole sections ready to drop into a page: heroes, dashboards, pricing, footers. Animated, accessible, dark and light.', path: '/blocks' })
  return (
    <div className="px-4 pb-24 sm:px-8">
      <div className="pb-6 pt-8 sm:pt-10">
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-tx sm:text-3xl">Blocks</h1>
        <p className="mt-1.5 max-w-lg text-sm text-mute">Whole sections built from the components. They adapt to the width of their container, so they fit a sidebar or a full page.</p>
      </div>
      <div className="space-y-14">
        {blocks.map((b) => (
          <section key={b.slug} id={b.slug} className="scroll-mt-28">
            <div className="mb-3 flex items-end justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-[15px] font-medium text-tx">{b.name}</h2>
                <p className="truncate text-sm text-mute">{b.description}</p>
              </div>
              <Link to={`/components/${b.slug}`} className="shrink-0 rounded-lg border border-line2 bg-panel px-3 py-1.5 text-xs text-mute hover:text-tx">Code →</Link>
            </div>
            <LazyBlock item={b} />
          </section>
        ))}
      </div>
    </div>
  )
}
