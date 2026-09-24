import { useSEO } from '@/lib/seo'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { GRADIENTS, KINDS, styleOf, cssOf, reactOf, tailwindOf } from '@/data/gradients'
import CodeBlock from '@/site/CodeBlock'

const KEYFRAMES = [...new Set(GRADIENTS.filter((g) => g.anim).map((g) => g.anim.css))].join('\n')
const TABS = [{ id: 'css', label: 'CSS' }, { id: 'tw', label: 'Tailwind' }, { id: 'react', label: 'React' }]

function Sheet({ g, onClose }) {
  const [tab, setTab] = useState('css')
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [onClose])
  const code = tab === 'css' ? cssOf(g) : tab === 'tw' ? tailwindOf(g) : reactOf(g)
  const title = tab === 'css' ? `${g.id}.css` : tab === 'tw' ? 'Tailwind' : `${g.id}.jsx`
  return (
    <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-black/65 backdrop-blur-sm sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
      <motion.div role="dialog" aria-modal="true" aria-label={g.name} onMouseDown={(e) => e.stopPropagation()}
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        className="max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-t-2xl border border-line2 bg-panel sm:rounded-2xl">
        <motion.div layoutId={`bg-${g.id}`} className="relative h-56 sm:h-72" style={styleOf(g)}>
          <div className="absolute inset-0 grid place-items-center"><span className="text-2xl font-semibold tracking-tight text-white/90 drop-shadow">{g.name}</span></div>
          <button type="button" onClick={onClose} aria-label="Close" className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-black/40 text-white/80 backdrop-blur hover:text-white">✕</button>
        </motion.div>
        <div className="p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex rounded-lg border border-line2 bg-bg p-0.5">
              {TABS.map((t) => (
                <button key={t.id} type="button" onClick={() => setTab(t.id)} className="relative px-3 py-1.5 text-[13px]">
                  {tab === t.id && <motion.span layoutId="bg-tab" className="absolute inset-0 rounded-md bg-line" />}
                  <span className={`relative ${tab === t.id ? 'text-tx' : 'text-mute'}`}>{t.label}</span>
                </button>
              ))}
            </div>
            <span className="text-xs text-faint">{g.kind}{g.anim ? ' · animated' : ''}</span>
          </div>
          <CodeBlock code={code} title={title} maxHeight={320} />
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Backgrounds() {
  const [params, setParams] = useSearchParams()
  const [kind, setKind] = useState('All')
  const open = GRADIENTS.find((g) => g.id === params.get('bg')) || null
  const list = useMemo(() => GRADIENTS.filter((g) => kind === 'All' || g.kind === kind), [kind])
  useSEO({ title: 'Backgrounds - kavynUI', description: 'Animated backgrounds: WebGL shaders with CSS fallback, gradient fields and animated CSS scenes.', path: '/backgrounds' })
  const setOpen = (g) => { const p = new URLSearchParams(params); g ? p.set('bg', g.id) : p.delete('bg'); setParams(p, { replace: true }) }
  return (
    <div className="px-4 pb-24 sm:px-8">
      <style>{KEYFRAMES}</style>
      <div className="pb-5 pt-8 sm:pt-10">
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-tx sm:text-3xl">Gradient backgrounds</h1>
        <p className="mt-1.5 max-w-lg text-sm text-mute">Plain CSS, no images, no libraries. Open one for CSS, Tailwind and React code.</p>
      </div>
      <div className="no-scrollbar -mx-4 mb-5 flex gap-1 overflow-x-auto px-4">
        {KINDS.map((k) => (
          <button key={k} type="button" onClick={() => setKind(k)} className="relative shrink-0 rounded-lg px-3 py-1.5 text-[13px]">
            {kind === k && <motion.span layoutId="kind-on" className="absolute inset-0 rounded-lg border border-line2 bg-panel2" transition={{ type: 'spring', stiffness: 460, damping: 34 }} />}
            <span className={`relative ${kind === k ? 'text-tx' : 'text-mute hover:text-tx'}`}>{k}</span>
          </button>
        ))}
      </div>
      <motion.div layout className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
        <AnimatePresence>
          {list.map((g) => (
            <motion.button key={g.id} type="button" layout onClick={() => setOpen(g)} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="group overflow-hidden rounded-2xl border border-line bg-panel text-left transition-colors hover:border-line2">
              <motion.div layoutId={`bg-${g.id}`} className="relative h-44" style={styleOf(g)}>
                <span className="absolute bottom-3 right-3 rounded-md bg-black/40 px-2 py-1 text-[11px] text-white/80 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">Get code</span>
              </motion.div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-tx">{g.name}</span>
                <span className="text-xs text-faint">{g.kind}{g.anim ? ' · animated' : ''}</span>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence>{open && <Sheet key={open.id} g={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </div>
  )
}
