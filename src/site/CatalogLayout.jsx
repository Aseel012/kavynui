import { useEffect, useState } from 'react'
import { Outlet, useLocation, useOutletContext } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import CatalogSidebar from './CatalogSidebar'
import ErrorBoundary from './ErrorBoundary'
import { bySlug, familyById } from '@/lib/catalog'

const titleFor = (path) => {
  if (path.startsWith('/blocks')) return 'Sections'
  if (path.startsWith('/backgrounds')) return 'Backgrounds'
  const slug = path.split('/')[2]
  if (slug && bySlug[slug]) return `${familyById[bySlug[slug].family]?.name} / ${bySlug[slug].name}`
  return 'All components'
}

// Fixed left sidebar on desktop (like a docs site), a slide-in drawer on mobile.
export default function CatalogLayout() {
  const ctx = useOutletContext()
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  useEffect(() => setOpen(false), [loc.pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])
  useEffect(() => {
    if (!open) return
    const k = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open])
  return (
    <div>
      {/* Pinned to the left edge of the screen under the header, with its own scroll: it never moves with the page. */}
      <aside className="fixed bottom-0 left-0 top-14 z-30 hidden w-64 border-r border-line bg-bg lg:block">
        <CatalogSidebar />
      </aside>

      <div className="min-w-0 lg:pl-64">
        <div className="sticky top-14 z-20 flex h-11 items-center gap-3 border-b border-line bg-bg/85 px-4 backdrop-blur-md lg:hidden">
          <button type="button" onClick={() => setOpen(true)} aria-label="Open catalog" className="flex h-8 items-center gap-2 rounded-full bg-panel2 px-3 text-xs text-tx">
            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h10M4 18h16" /></svg>Browse
          </button>
          <span className="truncate text-xs text-mute">{titleFor(loc.pathname)}</span>
        </div>
        <ErrorBoundary resetKey={loc.pathname}>
          <Outlet context={ctx} />
        </ErrorBoundary>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside role="dialog" aria-label="Catalog" className="fixed inset-y-0 left-0 z-50 w-[82vw] max-w-xs border-r border-line2 bg-bg lg:hidden"
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', stiffness: 420, damping: 40 }}
              drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={{ left: 0.4, right: 0 }} onDragEnd={(_, i) => i.offset.x < -80 && setOpen(false)}>
              <div className="flex h-12 items-center justify-between border-b border-line px-4">
                <span className="text-sm font-medium text-tx">Browse</span>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="grid size-7 place-items-center rounded-md text-mute hover:text-tx">✕</button>
              </div>
              <div className="h-[calc(100%-3rem)]"><CatalogSidebar onNav={() => setOpen(false)} /></div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
