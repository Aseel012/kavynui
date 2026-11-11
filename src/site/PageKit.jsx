import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { kitSections } from '@/lib/home'
import { Demo } from './Preview'
import CodeBlock, { CopyButton } from './CodeBlock'
import { SITE } from '@/config'

const registryUrl = (slug) => `${SITE.url}/r/${slug}.json`

// Renders a block at desktop width and scales it to fit the column, keeping flow height correct.
function Scaled({ children, width = 1440 }) {
  const box = useRef(null), inner = useRef(null)
  const [fit, setFit] = useState({ s: 0, h: 0 })
  useLayoutEffect(() => {
    const calc = () => {
      if (!box.current || !inner.current) return
      const s = box.current.clientWidth / width, h = inner.current.offsetHeight * s
      setFit((o) => (Math.abs(o.s - s) < 0.002 && Math.abs(o.h - h) < 1 ? o : { s, h }))
    }
    calc()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(calc)
    ro.observe(box.current); ro.observe(inner.current)
    return () => ro.disconnect()
  }, [width])
  return (
    <div ref={box} className="relative overflow-hidden" style={{ height: fit.h || 240 }}>
      <div ref={inner} className="absolute left-0 top-0 p-6" style={{ width, transform: `scale(${fit.s})`, transformOrigin: '0 0', visibility: fit.s ? 'visible' : 'hidden' }}>{children}</div>
    </div>
  )
}

function Switch({ on, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={onChange}
      className={`relative h-[26px] w-[44px] shrink-0 rounded-full transition-colors duration-200 ${on ? 'bg-tx' : 'bg-line2'}`}>
      <motion.span className="absolute top-[3px] size-5 rounded-full bg-bg shadow-[0_2px_6px_rgba(0,0,0,.25)]" animate={{ left: on ? 21 : 3 }} transition={{ type: 'spring', stiffness: 600, damping: 36 }} />
    </button>
  )
}

export default function PageKit() {
  const kit = kitSections()
  const [on, setOn] = useState(() => new Set(kit.filter((k) => k.on).map((k) => k.slug)))
  const picked = kit.filter((k) => on.has(k.slug))
  const toggle = (slug) => setOn((s) => { const n = new Set(s); n.has(slug) ? n.delete(slug) : n.add(slug); return n })
  const command = picked.length ? `npx shadcn@latest add ${picked.map((k) => registryUrl(k.slug)).join(' ')}` : ''
  const page = useMemo(() => picked.length ? [
    ...picked.map((k) => `import ${k.item.export} from '@/components/kavyn/${k.slug}'`),
    '',
    'export default function Page() {',
    '  return (',
    '    <main>',
    ...picked.map((k) => `      <${k.item.export} />`),
    '    </main>',
    '  )',
    '}',
  ].join('\n') : '', [picked])

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_minmax(0,900px)] lg:justify-between lg:gap-10">
      <div className="min-w-0 lg:sticky lg:top-20 lg:self-start">
        <ul className="overflow-hidden rounded-[22px] bg-panel" aria-label="Page sections">
          {kit.map((k, i) => (
            <li key={k.slug} className={`flex items-center gap-3 px-4 py-3 ${i ? 'border-t border-line' : ''}`}>
              <div className="min-w-0 flex-1">
                <div className="text-[15px] text-tx">{k.role}</div>
                <Link to={`/components/${k.slug}`} className="text-[13px] text-mute hover:text-tx">{k.item.name}</Link>
              </div>
              <Switch on={on.has(k.slug)} onChange={() => toggle(k.slug)} label={`Include ${k.role}`} />
            </li>
          ))}
        </ul>
        <div className="mt-4 rounded-[22px] bg-panel p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[13px] text-mute">{picked.length} {picked.length === 1 ? 'section' : 'sections'}, one command</span>
            <CopyButton text={command} label="Copy command" />
          </div>
          <code data-testid="kit-command" className="mt-3 block max-h-28 overflow-auto break-all font-mono text-[11.5px] leading-5 text-tx/80">{command || 'Turn on a section to get its install command.'}</code>
        </div>
      </div>

      <div className="min-w-0">
        <div className="overflow-hidden rounded-[22px] border border-line bg-bg">
          <div className="flex h-10 items-center gap-2 border-b border-line bg-panel px-4">
            <span className="size-2.5 rounded-full bg-line2" /><span className="size-2.5 rounded-full bg-line2" /><span className="size-2.5 rounded-full bg-line2" />
            <span className="mx-auto rounded-full bg-bg px-3 py-0.5 text-[11px] text-faint">your-site.com</span>
          </div>
          <div className="max-h-[720px] overflow-y-auto" data-testid="kit-preview">
            <AnimatePresence initial={false}>
              {picked.map((k) => (
                <motion.div key={k.slug} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 32 }} className="overflow-hidden border-b border-line last:border-b-0">
                  <Scaled><Demo item={k.item} page="home" /></Scaled>
                </motion.div>
              ))}
            </AnimatePresence>
            {!picked.length && <div className="grid h-72 place-items-center text-sm text-faint">An empty page. Switch a section on.</div>}
          </div>
        </div>
        {page && <div className="mt-4"><CodeBlock title="app/page.jsx" code={page} maxHeight={300} /></div>}
      </div>
    </div>
  )
}
