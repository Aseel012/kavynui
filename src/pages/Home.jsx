import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { justAdded, showcase, stats } from '@/lib/home'
import { LazyDemo } from '@/site/Preview'
import Card from '@/site/Card'
import PageKit from '@/site/PageKit'
import { CopyButton } from '@/site/CodeBlock'
import { GRADIENTS, styleOf } from '@/data/gradients'
import { useSEO, SITE_JSONLD } from '@/lib/seo'
import { SITE } from '@/config'

const chevron = <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="m9 6 6 6-6 6" /></svg>
const rise = { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-80px' }, transition: { type: 'spring', stiffness: 160, damping: 24 } }

function Title({ title, sub }) {
  return (
    <motion.div {...rise} className="mx-auto mb-10 max-w-2xl text-center">
      <h2 className="text-[32px] font-semibold leading-[1.05] tracking-[-0.035em] text-tx sm:text-[44px]">{title}</h2>
      {sub && <p className="mt-3 text-[17px] leading-7 text-mute">{sub}</p>}
    </motion.div>
  )
}

function Command({ slug }) {
  const cmd = `npx shadcn@latest add ${SITE.url}/r/${slug}.json`
  return (
    <div className="flex w-full max-w-md items-center gap-2 rounded-full bg-panel py-1.5 pl-4 pr-1.5">
      <span className="text-faint" aria-hidden>$</span>
      <code className="min-w-0 flex-1 truncate text-left font-mono text-[12px] text-tx/85">{cmd}</code>
      <CopyButton text={cmd} />
    </div>
  )
}

function Showcase() {
  const groups = showcase()
  const [active, setActive] = useState(groups[0]?.id)
  const group = groups.find((g) => g.id === active) || groups[0]
  if (!group) return null
  return (
    <div>
      <div className="no-scrollbar mx-auto mb-6 flex w-fit max-w-full gap-1 overflow-x-auto rounded-full bg-panel p-1" role="tablist" aria-label="Component kinds">
        {groups.map((g) => (
          <button key={g.id} type="button" role="tab" aria-selected={g.id === group.id} onClick={() => setActive(g.id)} className="relative shrink-0 rounded-full px-4 py-2 text-[14px]">
            {g.id === group.id && <motion.span layoutId="home-tab" className="absolute inset-0 rounded-full bg-line2" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
            <span className={`relative ${g.id === group.id ? 'text-tx' : 'text-mute hover:text-tx'}`}>{g.name}</span>
          </button>
        ))}
      </div>
      <div className="rounded-[32px] bg-panel p-2">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={group.id} role="tabpanel" initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.985 }} transition={{ duration: 0.22 }}
            className="grid gap-2 md:grid-cols-3">
            {group.items.map((c) => (
              <div key={c.slug} className="flex flex-col overflow-hidden rounded-[26px] bg-bg">
                <div className="relative h-64 sm:h-80"><LazyDemo item={c} page="home" /></div>
                <Link to={`/components/${c.slug}`} className="group flex items-center justify-between gap-3 px-5 pb-4 text-[14px]">
                  <span className="text-tx">{c.name}</span>
                  <span className="flex items-center gap-1 truncate text-faint group-hover:text-mute">{c.useCase}{chevron}</span>
                </Link>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function Home() {
  const { components: total, sections } = stats()
  const fresh = justAdded()
  const newest = fresh[0]
  useSEO({ title: 'kavynUI - animated React components and page sections', description: `${total} animated React components and ${sections} page sections. Install any of them with the shadcn CLI or copy the file. Open source, MIT.`, path: '/', jsonLd: SITE_JSONLD })

  return (
    <div>
      <section className="mx-auto max-w-[1600px] px-4 pt-16 text-center sm:px-8 sm:pt-24">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 170, damping: 24 }} className="flex flex-col items-center">
          {newest && (
            <Link to={`/components/${newest.slug}`} className="mb-7 flex items-center gap-2 rounded-full bg-panel py-1 pl-1 pr-3 text-[13px] text-mute transition-colors hover:text-tx">
              <span className="rounded-full bg-tx px-2 py-0.5 text-[12px] font-medium text-bg">New</span>{newest.name}{chevron}
            </Link>
          )}
          <h1 className="max-w-4xl text-[46px] font-semibold leading-[0.98] tracking-[-0.05em] text-tx sm:text-[84px]">Build interfaces<br />people remember.</h1>
          <p className="mt-6 max-w-xl text-[17px] leading-7 text-mute sm:text-[19px] sm:leading-8">{total} animated React components and {sections} full page sections, each one a single file you own. Add it with one command and change anything.</p>
          <div className="mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
            <Link to="/components" className="flex h-12 w-full items-center justify-center rounded-full bg-tx px-6 text-[15px] font-medium text-bg transition-transform active:scale-95 sm:w-auto">Browse components</Link>
            {newest && <Command slug={newest.slug} />}
          </div>
        </motion.div>
      </section>


      <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
        <section aria-label="Live components" className="pt-14 sm:pt-20">
          <Showcase />
          <p className="mt-4 text-center text-[13px] text-faint">Live, not screenshots. Hover, drag, type and click.</p>
        </section>

        <section id="page-kit" className="scroll-mt-20 pt-28 sm:pt-40">
          <Title title="Assemble a page." sub="Switch sections on and off. The preview stacks the real blocks, and you get one install command and the page file." />
          <PageKit />
        </section>

        {fresh.length > 0 && (
          <section className="pt-28 sm:pt-40">
            <Title title="Just added." sub="New pieces land here first." />
            <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {fresh.map((c) => <Card key={c.slug} item={c} page="home" />)}
            </div>
          </section>
        )}
      </div>

      <section className="pt-28 sm:pt-40">
        <div className="px-4"><Title title="Backgrounds with a job." sub="Plain CSS, each named for the product it suits." /></div>
        <style>{[...new Set(GRADIENTS.filter((g) => g.anim).map((g) => g.anim.css))].join('\n')}</style>
        <div className="no-scrollbar mx-auto flex max-w-[1280px] snap-x gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:scroll-px-8 sm:px-8 xl:justify-center">
          {GRADIENTS.slice(0, 5).map((g) => (
            <Link key={g.id} to={`/backgrounds?bg=${g.id}`} className="group w-60 shrink-0 snap-start text-left">
              <div className="h-40 rounded-[24px] ring-1 ring-inset ring-line transition-transform duration-300 group-hover:scale-[0.97]" style={styleOf(g)} />
              <div className="mt-3 px-1 text-[15px] text-tx">{g.name}</div>
              <div className="px-1 text-[13px] text-mute">{g.use}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto flex max-w-2xl flex-col items-center px-4 pb-32 pt-32 text-center sm:pb-44 sm:pt-44">
        <motion.h2 {...rise} className="text-[40px] font-semibold leading-[1] tracking-[-0.045em] text-tx sm:text-[64px]">Start with one.</motion.h2>
        <p className="mt-4 max-w-md text-[17px] leading-7 text-mute">Pick a component, copy one line, and it is in your project. Your coding agent can find everything too.</p>
        <div className="mt-8 flex w-full justify-center">{newest && <Command slug={newest.slug} />}</div>
        <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[14px] text-mute">
          <Link to="/components" className="hover:text-tx">All components</Link>
          <Link to="/docs/installation" className="hover:text-tx">Installation</Link>
          <a href="/llms.txt" className="hover:text-tx">llms.txt</a>
          <a href="/r/index.json" className="hover:text-tx">Registry index</a>
        </div>
      </section>
    </div>
  )
}
