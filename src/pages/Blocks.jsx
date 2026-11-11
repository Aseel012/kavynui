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
  return <div ref={ref} className="relative min-h-72">{on ? <Demo item={item} page="blocks" /> : <div className="h-72 rounded-[22px] bg-panel/60" />}</div>
}

export default function Blocks() {
  const blocks = components.filter((c) => c.family === 'blocks')
  useSEO({ title: 'Page sections - kavynUI', description: 'Whole page sections ready to drop in: hero, features, social proof, pricing, FAQ, call to action, footer, sign-in, status and dashboard.', path: '/blocks' })
  return (
    <div className="px-4 pb-24 sm:px-8">
      <div className="pb-6 pt-8 sm:pt-10">
        <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-tx sm:text-[34px]">Sections</h1>
        <p className="mt-1.5 max-w-lg text-[15px] text-mute">Whole page sections in reading order. They size to their container, so they fit a sidebar or a full page.</p>
      </div>
      <div className="space-y-14">
        {blocks.map((b) => (
          <section key={b.slug} id={b.slug} className="scroll-mt-28">
            <div className="mb-3 flex items-end justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-[17px] font-medium text-tx">{b.name} <span className="font-normal text-faint">{b.useCase}</span></h2>
                <p className="truncate text-sm text-mute">{b.description}</p>
              </div>
              <Link to={`/components/${b.slug}`} className="shrink-0 rounded-full bg-panel2 px-3.5 py-1.5 text-xs text-mute hover:text-tx">Install</Link>
            </div>
            <LazyBlock item={b} />
          </section>
        ))}
      </div>
    </div>
  )
}
