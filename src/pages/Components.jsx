import { useMemo } from 'react'
import { useSEO } from '@/lib/seo'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { families, search, familyById } from '@/lib/catalog'
import Card from '@/site/Card'

export default function Components() {
  const [params, setParams] = useSearchParams()
  const q = (params.get('q') || '').slice(0, 80)
  const raw = params.get('family') || 'all'
  const family = raw === 'all' || familyById[raw] ? raw : 'all'
  const results = useMemo(() => search(q, family), [q, family])
  const set = (k, v) => { const p = new URLSearchParams(params); v && v !== 'all' ? p.set(k, v) : p.delete(k); setParams(p, { replace: true }) }
  useSEO({ title: family === 'all' ? 'Components - kavynUI' : `${familyById[family].name} - kavynUI`, description: 'Browse all animated React components: shaders, scroll scenes, physics playgrounds, cursor systems, 3D stacks and more.', path: family === 'all' ? '/components' : `/components?family=${family}` })
  const tabs = [{ id: 'all', name: 'All' }, ...families]
  const fam = familyById[family]

  return (
    <div className="px-4 pb-24 sm:px-8">
      <div className="pb-5 pt-8 sm:pt-10">
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-tx sm:text-3xl">{fam ? fam.name : 'Library'}</h1>
        <p className="mt-1.5 text-sm text-mute">{fam ? fam.blurb : 'Every component and block, live. Open one to copy its code.'}</p>
      </div>

      <div className="sticky top-[6.25rem] z-10 -mx-4 border-b border-line bg-bg/85 px-4 py-2.5 backdrop-blur-md sm:-mx-8 sm:px-8 lg:top-14">
        <div className="flex flex-col gap-2.5 xl:flex-row xl:items-center">
          <label className="flex h-9 items-center gap-2 rounded-lg border border-line2 bg-panel px-3 focus-within:border-[#3a3a42] xl:w-64">
            <svg viewBox="0 0 24 24" className="size-3.5 shrink-0 text-faint" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <input value={q} onChange={(e) => set('q', e.target.value.slice(0, 80))} placeholder="Search name or use case" className="min-w-0 flex-1 bg-transparent text-sm text-tx outline-none placeholder:text-faint" aria-label="Search components" />
            {q && <button type="button" onClick={() => set('q', '')} className="text-xs text-faint hover:text-tx">Clear</button>}
          </label>
          <div className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 xl:mx-0 xl:px-0">
            {tabs.map((f) => (
              <button key={f.id} type="button" onClick={() => set('family', f.id)} className="relative shrink-0 rounded-lg px-3 py-1.5 text-[13px]">
                {family === f.id && <motion.span layoutId="fam-on" className="absolute inset-0 rounded-lg border border-line2 bg-panel2" transition={{ type: 'spring', stiffness: 460, damping: 34 }} />}
                <span className={`relative ${family === f.id ? 'text-tx' : 'text-mute hover:text-tx'}`}>{f.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {q && <div className="pt-4 text-xs text-faint">{results.length} {results.length === 1 ? 'match' : 'matches'}</div>}
      {results.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-line2 py-20 text-center">
          <div className="text-tx">Nothing matches “{q}”</div>
          <button type="button" onClick={() => setParams({}, { replace: true })} className="mt-3 text-sm text-acc">Reset filters</button>
        </div>
      ) : (
        <motion.div layout className="mt-4 grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
          <AnimatePresence>
            {results.map((c) => <Card key={c.slug} item={c} />)}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
