import { useEffect, useState } from 'react'
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import Logo from './Logo'
import Palette from './Palette'
import ThemeToggle from './ThemeToggle'
import { SITE } from '@/config'
import ExternalLink from './ExternalLink'
import NetworkStatus from './NetworkStatus'
import ErrorBoundary from './ErrorBoundary'

const LINKS = [{ to: '/components', label: 'Components' }, { to: '/blocks', label: 'Blocks' }, { to: '/backgrounds', label: 'Backgrounds' }, { to: '/docs', label: 'Docs' }]
const MOBILE = [{ to: '/', label: 'Home' }, ...LINKS, { to: '/blog', label: 'Blog' }, { to: '/about', label: 'About' }]

const GH = 'M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0C17.3 4.8 18.3 5.1 18.3 5.1c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5Z'

// GitHub link. Until VITE_GITHUB_URL is set it renders as a disabled "coming soon" icon.
export function GitHubLink({ className = '' }) {
  const icon = <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden><path d={GH} /></svg>
  if (!SITE.github) return <span title="GitHub repo coming soon" aria-label="GitHub (coming soon)" className={`grid size-9 cursor-default place-items-center rounded-lg border border-line2 bg-panel text-faint ${className}`}>{icon}</span>
  return <ExternalLink href={SITE.github} aria-label="GitHub" className={`grid size-9 place-items-center rounded-lg border border-line2 bg-panel text-mute hover:text-tx ${className}`}>{icon}</ExternalLink>
}

function SearchButton({ onClick, compact }) {
  if (compact) return (
    <button onClick={onClick} aria-label="Search" className="grid size-9 place-items-center rounded-lg border border-line2 bg-panel text-mute">
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
    </button>
  )
  return (
    <button onClick={onClick} className="flex h-8 w-56 items-center gap-2 rounded-lg border border-line2 bg-panel pl-3 pr-1.5 text-sm text-faint hover:border-[#3a3a42]">
      <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
      <span className="flex-1 text-left">Search</span>
      <kbd className="rounded border border-line2 px-1.5 font-mono text-[10px]">⌘K</kbd>
    </button>
  )
}

export default function Layout() {
  const [pal, setPal] = useState(false)
  const [menu, setMenu] = useState(false)
  const loc = useLocation()

  useEffect(() => { setMenu(false); window.scrollTo(0, 0) }, [loc.pathname])
  useEffect(() => {
    const k = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPal((p) => !p) }
      if (e.key === '/' && !/INPUT|TEXTAREA/.test(document.activeElement?.tagName)) { e.preventDefault(); setPal(true) }
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])
  useEffect(() => { document.body.style.overflow = menu ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [menu])

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className="relative px-3 py-1.5 text-sm">
                {({ isActive }) => (<>
                  {isActive && <motion.span layoutId="nav-on" className="absolute inset-0 rounded-md bg-line" transition={{ type: 'spring', stiffness: 460, damping: 34 }} />}
                  <span className={`relative ${isActive ? 'text-tx' : 'text-mute hover:text-tx'}`}>{l.label}</span>
                </>)}
              </NavLink>
            ))}
          </nav>
          <div className="flex-1" />
          <div className="hidden items-center gap-2 md:flex"><SearchButton onClick={() => setPal(true)} /><ThemeToggle /><GitHubLink /></div>
          <div className="flex items-center gap-2 md:hidden">
            <SearchButton compact onClick={() => setPal(true)} /><ThemeToggle />
            <button onClick={() => setMenu(!menu)} aria-label="Menu" aria-expanded={menu} className="relative grid size-9 place-items-center rounded-lg border border-line2 bg-panel">
              <motion.span className="absolute h-[1.5px] w-4 rounded bg-tx" animate={menu ? { rotate: 45, y: 0 } : { rotate: 0, y: -3 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
              <motion.span className="absolute h-[1.5px] w-4 rounded bg-tx" animate={menu ? { rotate: -45, y: 0 } : { rotate: 0, y: 3 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div className="fixed inset-x-0 bottom-0 top-14 z-30 bg-bg/95 backdrop-blur md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.nav className="flex flex-col px-4 pt-4" initial="c" animate="o" exit="c" variants={{ o: { transition: { staggerChildren: 0.05 } } }}>
              {MOBILE.map((l) => (
                <motion.div key={l.to} variants={{ c: { opacity: 0, y: -10 }, o: { opacity: 1, y: 0 } }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}>
                  <NavLink to={l.to} end className={({ isActive }) => `flex items-center justify-between border-b border-line py-4 text-2xl tracking-tight ${isActive ? 'text-tx' : 'text-mute'}`}>
                    {l.label}<span className="text-base text-faint">→</span>
                  </NavLink>
                </motion.div>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1"><ErrorBoundary resetKey={loc.pathname}><Outlet context={{ openSearch: () => setPal(true) }} /></ErrorBoundary></main>

      <footer className="border-t border-line">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-mute">Open-source motion components and blocks for React.</p>
            <div className="mt-5 flex gap-2"><GitHubLink /><ThemeToggle /></div>
          </div>
          {[
            ['Library', [['/components', 'All components'], ['/blocks', 'Blocks'], ['/backgrounds', 'Backgrounds'], ['/components?family=data', 'Maps & Data']]],
            ['Docs', [['/docs', 'Introduction'], ['/docs/installation', 'Installation'], ['/docs/theming', 'Theming'], ['/docs/motion', 'Motion']]],
            ['Project', [['/about', 'About'], ['/blog', 'Blog'], ['/privacy', 'Privacy'], ['/terms', 'Terms']]],
          ].map(([h, links]) => (
            <div key={h}>
              <div className="text-sm text-tx">{h}</div>
              <ul className="mt-3 space-y-2 text-sm">{links.map(([to, label]) => <li key={to}><Link to={to} className="text-mute hover:text-tx">{label}</Link></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="border-t border-line">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-faint sm:flex-row sm:justify-between sm:px-6">
            <span>© {new Date().getFullYear()} kavynUI · {SITE.license} license</span>
          </div>
        </div>
      </footer>
      <NetworkStatus />

      <Palette open={pal} onClose={() => setPal(false)} />
    </div>
  )
}
