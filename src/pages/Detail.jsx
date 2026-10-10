import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { bySlug, familyById, components, neighbors } from '@/lib/catalog'
import { getSource, parseProps } from '@/lib/registry'
import { Demo, GROW } from '@/site/Preview'
import CodeBlock, { CopyButton } from '@/site/CodeBlock'
import NotFound from './NotFound'
import InstallCard from '@/site/InstallCard'
import { useSEO } from '@/lib/seo'
import { SITE } from '@/config'

const VIEWPORTS = [{ id: 'desktop', w: '100%', label: 'Desktop' }, { id: 'tablet', w: '768px', label: 'Tablet' }, { id: 'mobile', w: '390px', label: 'Mobile' }]
const fileOf = (slug) => `${slug}.jsx`

function Seg({ value, options, onChange, id }) {
  return (
    <div className="flex rounded-lg border border-line2 bg-panel p-0.5">
      {options.map((o) => (
        <button key={o.id} type="button" onClick={() => onChange(o.id)} className="relative px-3 py-1.5 text-[13px]">
          {value === o.id && <motion.span layoutId={id} className="absolute inset-0 rounded-md bg-line" transition={{ type: 'spring', stiffness: 480, damping: 34 }} />}
          <span className={`relative ${value === o.id ? 'text-tx' : 'text-mute'}`}>{o.label}</span>
        </button>
      ))}
    </div>
  )
}

export default function Detail() {
  const { slug } = useParams()
  const item = bySlug[slug]
  const [tab, setTab] = useState('preview')
  const [files, setFiles] = useState(null)
  const [file, setFile] = useState(0)
  const [run, setRun] = useState(0)
  const [vp, setVp] = useState('desktop')

  useSEO(item ? {
    title: `${item.name} - kavynUI`,
    description: `${item.description}. Use case: ${item.useCase}. Copy the file and ship it.`,
    path: `/components/${item.slug}`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'SoftwareSourceCode', name: item.name, description: item.description, programmingLanguage: 'JavaScript', runtimePlatform: 'React', license: 'MIT', isPartOf: { '@type': 'WebSite', name: 'kavynUI', url: SITE.url } },
  } : { title: 'kavynUI', noindex: true })
  useEffect(() => {
    if (!item) return
    setTab('preview'); setFiles(null); setFile(0); setRun(0); setVp('desktop')
    let live = true
    const names = [fileOf(item.slug), ...(item.deps || [])]
    Promise.all(names.map((n) => getSource(n))).then((srcs) => {
      if (live) setFiles(names.map((name, i) => ({ name, code: typeof srcs[i] === 'string' ? srcs[i] : null })))
    }).catch(() => live && setFiles(names.map((name) => ({ name, code: null }))))
    return () => { live = false }
  }, [item])

  if (!item) return <NotFound />
  const fam = familyById[item.family]
  const isBlock = item.family === 'blocks'
  const { prev, next } = neighbors(item.slug)
  const related = components.filter((c) => c.family === item.family && c.slug !== item.slug).slice(0, 4)
  const main = files?.[0]?.code
  const props = main ? parseProps(main) : []
  const usage = `import ${item.export} from '@/components/kavyn/${item.slug}'\n\nexport default function Page() {\n  return <${item.export} />\n}`

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-8 sm:px-8 sm:pt-10">
      <nav className="flex items-center gap-2 text-[13px] text-faint" aria-label="Breadcrumb">
        <Link to="/components" className="hover:text-tx">Library</Link><span>/</span>
        <Link to={`/components?family=${fam?.id}`} className="hover:text-tx">{fam?.name}</Link>
      </nav>

      <header className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-tx">{item.name}</h1>
          <p className="mt-2 max-w-lg text-mute">{item.description}.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full border border-line2 px-2.5 py-1 text-mute">Use case: <span className="text-tx">{item.useCase}</span></span>
          {item.tags?.includes('new') && <span className="rounded-full bg-acc/15 px-2.5 py-1 text-acc">New</span>}
        </div>
      </header>

      <InstallCard name={item.slug} />

      <div className="mt-7 flex flex-wrap items-center justify-between gap-2">
        <Seg id="dt-tab" value={tab} onChange={setTab} options={[{ id: 'preview', label: 'Preview' }, { id: 'code', label: 'Code' }]} />
        {tab === 'preview' && (
          <div className="flex items-center gap-2">
            {isBlock && <div className="hidden md:block"><Seg id="dt-vp" value={vp} onChange={setVp} options={VIEWPORTS} /></div>}
            <button type="button" onClick={() => setRun(run + 1)} className="h-8 rounded-lg border border-line2 bg-panel px-3 text-xs text-mute hover:text-tx">↻ Replay</button>
          </div>
        )}
      </div>

      <div className="mt-3">
        <AnimatePresence mode="wait" initial={false}>
          {tab === 'preview' ? (
            <motion.div key="p" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
              {isBlock || item.layout === 'inline' ? (
                <div className="rounded-2xl border border-line bg-panel/40 p-2 sm:p-4">
                  <motion.div layout className="mx-auto" style={{ width: VIEWPORTS.find((v) => v.id === vp)?.w, maxWidth: '100%' }} transition={{ type: 'spring', stiffness: 260, damping: 32 }}>
                    <Demo key={run} item={item} page="detail" />
                  </motion.div>
                </div>
              ) : (
                <div className={`relative overflow-hidden rounded-2xl border border-line bg-bg ${GROW.has(item.slug) ? 'min-h-[380px] sm:min-h-[460px]' : 'h-[380px] sm:h-[460px]'}`}>
                  <div className="grid-fade pointer-events-none absolute inset-0 opacity-50" />
                  <Demo key={run} item={item} page="detail" />
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="c" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
              {!files ? <div className="h-64 animate-pulse rounded-xl bg-panel" /> : (
                <>
                  {files.length > 1 && (
                    <div className="no-scrollbar mb-2 flex gap-1 overflow-x-auto">
                      {files.map((f, i) => (
                        <button key={f.name} type="button" onClick={() => setFile(i)} className={`shrink-0 rounded-md px-2.5 py-1 font-mono text-xs ${file === i ? 'bg-line text-tx' : 'text-mute hover:text-tx'}`}>{f.name}</button>
                      ))}
                    </div>
                  )}
                  {files[file]?.code ? <CodeBlock code={files[file].code} title={`components/kavyn/${files[file].name}`} />
                    : <div className="rounded-xl border border-line bg-panel p-6 text-sm text-mute">Could not load the source. Check your connection. <button type="button" onClick={() => window.location.reload()} className="ml-1 text-tx underline underline-offset-4">Reload</button></div>}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_260px]">
        <div className="min-w-0 space-y-10">
          <div>
            <h2 className="mb-3 text-lg font-medium text-tx">Usage</h2>
            <CodeBlock code={usage} title="Page.jsx" maxHeight={260} />
          </div>
          {item.slug === 'commit-grove' && <div>
            <h2 className="mb-3 text-lg font-medium text-tx">Connect your activity</h2>
            <p className="mb-4 text-sm leading-6 text-mute">The default preview uses labeled sample activity and fictional workspaces. Pass daily records to replace it. Dates use YYYY-MM-DD in UTC; duplicate dates are summed, missing days are empty, and invalid or negative counts are ignored. The heading totals only the selected date range. Pass an empty array for a real empty calendar.</p>
            <CodeBlock title="Profile.jsx" maxHeight={340} code={`<CommitGrove
  year={2026}
  startMonth={6}
  endMonth={12}
  data={[
    { date: '2026-06-01', count: 4 },
    { date: '2026-06-02', count: 7 },
  ]}
  workspaces={[
    { name: 'Your workspace', count: 11, mark: 'YW', color: '#9fcab0' },
  ]}
  theme="auto"
  onExpandedChange={(expanded) => console.log(expanded)}
/>`} />
            <p className="mt-4 text-sm leading-6 text-mute">Workspace totals and optional avatar URLs come from your own data source. The component makes no activity API requests. Use theme="auto", "dark" or "light". Optional colors accepts dark and light arrays of five CSS colors, ordered from empty to peak intensity. Arrow keys move through days; Home and End move to the date-range edges. Enter or Space expands the workspace list.</p>
          </div>}
          <div>
            <h2 className="mb-3 text-lg font-medium text-tx">Props</h2>
            {props.length === 0 ? <p className="text-sm text-faint">{files ? 'No props. Works out of the box.' : 'Loading…'}</p> : (
              <div className="overflow-x-auto rounded-xl border border-line">
                <table className="w-full min-w-[420px] text-left text-sm">
                  <thead className="bg-panel text-xs text-faint"><tr><th className="px-4 py-2.5 font-normal">Prop</th><th className="px-4 py-2.5 font-normal">Type</th><th className="px-4 py-2.5 font-normal">Default</th></tr></thead>
                  <tbody>{props.map((p) => (
                    <tr key={p.name} className="border-t border-line"><td className="px-4 py-2.5 font-mono text-tx">{p.name}</td><td className="px-4 py-2.5 font-mono text-xs text-mute">{p.type}</td><td className="max-w-[220px] truncate px-4 py-2.5 font-mono text-xs text-mute">{p.default}</td></tr>
                  ))}</tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <aside className="space-y-2">
          <h2 className="mb-1 text-sm text-faint">More in {fam?.name}</h2>
          {related.map((r) => (
            <Link key={r.slug} to={`/components/${r.slug}`} className="block rounded-xl border border-line bg-panel px-4 py-3 transition-colors hover:border-line2">
              <div className="text-sm text-tx">{r.name}</div><div className="mt-0.5 line-clamp-1 text-xs text-mute">{r.description}</div>
            </Link>
          ))}
        </aside>
      </section>

      <div className="mt-14 grid grid-cols-2 gap-3 border-t border-line pt-6">
        <Link to={`/components/${prev.slug}`} className="rounded-xl border border-line p-4 hover:border-line2"><div className="text-xs text-faint">← Previous</div><div className="mt-1 truncate text-sm text-tx">{prev.name}</div></Link>
        <Link to={`/components/${next.slug}`} className="rounded-xl border border-line p-4 text-right hover:border-line2"><div className="text-xs text-faint">Next →</div><div className="mt-1 truncate text-sm text-tx">{next.name}</div></Link>
      </div>
    </div>
  )
}
