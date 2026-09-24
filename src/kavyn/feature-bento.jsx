import { useEffect, useState } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'motion/react'

function Tile({ className = '', title, body, children }) {
  const x = useMotionValue(-300), y = useMotionValue(-300)
  const bg = useMotionTemplate`radial-gradient(220px circle at ${x}px ${y}px, rgba(255,106,43,.10), transparent 70%)`
  return (
    <div onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); x.set(e.clientX - r.left); y.set(e.clientY - r.top) }} onPointerLeave={() => { x.set(-300); y.set(-300) }}
      className={`relative overflow-hidden rounded-2xl border border-line bg-panel ${className}`}>
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: bg }} />
      <div className="relative flex h-full flex-col">
        <div className="relative min-h-36 flex-1">{children}</div>
        <div className="p-5 pt-0"><h3 className="text-[15px] font-medium text-tx">{title}</h3><p className="mt-1 text-sm text-mute">{body}</p></div>
      </div>
    </div>
  )
}

function Regions() {
  const [on, setOn] = useState(0)
  useEffect(() => { const id = setInterval(() => setOn((n) => (n + 1) % 12), 500); return () => clearInterval(id) }, [])
  return <div className="absolute inset-0 grid place-items-center p-6"><div className="grid grid-cols-6 gap-2">{Array.from({ length: 12 }, (_, i) => <motion.span key={i} animate={{ backgroundColor: i === on ? '#ff6a2b' : '#1e1e22', scale: i === on ? 1.1 : 1 }} className="size-7 rounded-md @3xl:size-8" />)}</div></div>
}
function Rollback() {
  const [v, setV] = useState(3)
  useEffect(() => { const id = setInterval(() => setV((n) => (n === 3 ? 2 : 3)), 1800); return () => clearInterval(id) }, [])
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-2 p-6">
      {[1, 2, 3].map((n) => (
        <motion.div key={n} animate={{ opacity: n === v ? 1 : 0.35, y: n === v ? -6 : 0, borderColor: n === v ? '#ff6a2b' : '#2a2a30' }} className="rounded-lg border bg-bg px-3 py-2 font-mono text-xs text-tx">v1.{n}</motion.div>
      ))}
    </div>
  )
}
function Logs() {
  const [lines, setLines] = useState([0, 1, 2, 3])
  useEffect(() => { const id = setInterval(() => setLines((l) => [...l.slice(1), l[l.length - 1] + 1]), 700); return () => clearInterval(id) }, [])
  const txt = ['GET /api/user 200 12ms', 'POST /checkout 201 48ms', 'GET / 304 3ms', 'GET /img/hero.webp 200 9ms', 'GET /api/search 200 21ms']
  return <div className="absolute inset-0 overflow-hidden p-5 font-mono text-[11px] text-mute">{lines.map((n) => <motion.div key={n} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-0.5"><span className="text-faint">{String(10 + (n % 50)).padStart(2, '0')}:04</span> {txt[n % txt.length]}</motion.div>)}</div>
}
function Shield() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <motion.svg viewBox="0 0 24 24" className="size-16 text-acc" fill="none" stroke="currentColor" strokeWidth="1.2"><motion.path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, repeat: Infinity, repeatType: 'reverse', repeatDelay: 0.6 }} /><path d="m9 12 2 2 4-4" /></motion.svg>
    </div>
  )
}

// Block: a four-tile feature section. Every tile has its own small live demo.
export default function FeatureBento() {
  return (
    <section className="@container w-full">
      <div className="grid gap-3 @3xl:grid-cols-3">
        <Tile className="@3xl:col-span-2" title="Runs in every region" body="Your code is copied to each edge location on deploy."><Regions /></Tile>
        <Tile title="Instant rollback" body="One click back to any previous build."><Rollback /></Tile>
        <Tile title="Built-in firewall" body="Bad traffic stops before it reaches you."><Shield /></Tile>
        <Tile className="@3xl:col-span-2" title="Real-time logs" body="Tail requests as they happen, no setup."><Logs /></Tile>
      </div>
    </section>
  )
}
