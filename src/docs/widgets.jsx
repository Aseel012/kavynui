import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import CodeBlock from '@/site/CodeBlock'

export const H2 = ({ id, children }) => <h2 id={id} className="scroll-mt-24 pt-12 text-xl font-semibold tracking-tight text-tx">{children}</h2>
export const P = ({ children }) => <p className="mt-3 leading-7 text-mute">{children}</p>
export const C = ({ children }) => <code className="rounded bg-panel2 px-1.5 py-0.5 font-mono text-[13px] text-tx">{children}</code>
export const Code = (p) => <div className="mt-4"><CodeBlock {...p} /></div>

export function Note({ tone = 'info', title, children }) {
  const t = { info: 'border-sky-400/25 bg-sky-400/[.05] text-sky-300', warn: 'border-amber-400/25 bg-amber-400/[.05] text-amber-300', tip: 'border-acc/25 bg-acc/[.05] text-acc' }[tone]
  return (
    <div className={`mt-5 rounded-xl border px-4 py-3 ${t}`}>
      {title && <div className="text-sm font-medium">{title}</div>}
      <div className="mt-0.5 text-sm leading-6 text-mute">{children}</div>
    </div>
  )
}

export function Steps({ items }) {
  return (
    <ol className="mt-5 space-y-5 border-l border-line pl-6">
      {items.map(([title, body], i) => (
        <li key={title} className="relative">
          <span className="absolute -left-[37px] grid size-6 place-items-center rounded-full border border-line2 bg-bg font-mono text-[11px] text-tx">{i + 1}</span>
          <div className="text-[15px] text-tx">{title}</div>
          <div className="text-sm leading-6 text-mute">{body}</div>
        </li>
      ))}
    </ol>
  )
}

export function Table({ head, rows }) {
  return (
    <div className="mt-5 overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[480px] text-left text-sm">
        <thead className="bg-panel text-xs text-faint"><tr>{head.map((h) => <th key={h} className="px-4 py-2.5 font-normal">{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i} className="border-t border-line">{r.map((c, j) => <td key={j} className={`px-4 py-2.5 align-top ${j === 0 ? 'font-mono text-[13px] text-tx' : 'text-mute'}`}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  )
}

export function Tabs({ tabs }) {
  const [on, setOn] = useState(0)
  return (
    <div className="mt-4">
      <div className="mb-2 flex gap-1">{tabs.map((t, i) => <button key={t.label} type="button" onClick={() => setOn(i)} className={`rounded-md px-2.5 py-1 text-xs ${on === i ? 'bg-line text-tx' : 'text-mute hover:text-tx'}`}>{t.label}</button>)}</div>
      <CodeBlock code={tabs[on].code} title={tabs[on].title} />
    </div>
  )
}

// Simulates a damped spring so the curve matches what Motion will do.
function simulate(k, c, m, n = 180, dt = 1 / 60) {
  let x = 0, v = 0
  const out = []
  for (let i = 0; i < n; i++) { const a = (-k * (x - 1) - c * v) / m; v += a * dt; x += v * dt; out.push(x) }
  return out
}

const PRESETS = [
  { name: 'Snappy', k: 500, c: 34, m: 1 }, { name: 'Smooth', k: 260, c: 28, m: 1 },
  { name: 'Bouncy', k: 320, c: 12, m: 1 }, { name: 'Heavy', k: 120, c: 20, m: 2.5 },
]

function Slider({ label, value, set, min, max, step = 1 }) {
  return (
    <label className="block">
      <div className="flex justify-between text-xs"><span className="text-mute">{label}</span><span className="font-mono text-tx">{value}</span></div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))} className="mt-2 w-full accent-[#ff6a2b]" aria-label={label} />
    </label>
  )
}

export function SpringPlayground() {
  const [k, setK] = useState(320), [c, setC] = useState(22), [m, setM] = useState(1)
  const [side, setSide] = useState(false)
  const trackRef = useRef(null)
  const [track, setTrack] = useState(240)
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const calc = () => setTrack(el.clientWidth)
    calc()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(calc); ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const pts = useMemo(() => simulate(k, c, m), [k, c, m])
  const settle = useMemo(() => { let i = pts.length - 1; while (i >= 0 && Math.abs(pts[i] - 1) <= 0.01) i--; return Math.round(((i + 1) / 60) * 1000) }, [pts])
  const peak = Math.max(...pts)
  const W = 300, H = 110
  const d = pts.map((x, i) => `${i ? 'L' : 'M'}${((i / (pts.length - 1)) * W).toFixed(1)},${(H - 12 - (x / Math.max(1.2, peak)) * (H - 24)).toFixed(1)}`).join('')
  const transition = { type: 'spring', stiffness: k, damping: c, mass: m }
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-panel">
      <div className="grid gap-px bg-line md:grid-cols-2">
        <div className="bg-panel p-5">
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button key={p.name} type="button" onClick={() => { setK(p.k); setC(p.c); setM(p.m); setSide((s) => !s) }}
                className={`rounded-full border px-2.5 py-1 text-xs ${p.k === k && p.c === c && p.m === m ? 'border-acc/50 bg-acc/10 text-acc' : 'border-line2 text-mute hover:text-tx'}`}>{p.name}</button>
            ))}
          </div>
          <div className="mt-5 space-y-4">
            <Slider label="stiffness" value={k} set={setK} min={40} max={800} step={10} />
            <Slider label="damping" value={c} set={setC} min={2} max={60} />
            <Slider label="mass" value={m} set={setM} min={0.2} max={4} step={0.1} />
          </div>
          <div className="mt-5 flex gap-4 text-xs text-mute">
            <span>settles in <span className="font-mono text-tx">{settle}ms</span></span>
            <span>overshoot <span className="font-mono text-tx">{Math.max(0, (peak - 1) * 100).toFixed(0)}%</span></span>
          </div>
        </div>
        <div className="flex flex-col bg-bg p-5">
          <button ref={trackRef} type="button" onClick={() => setSide(!side)} className="relative h-16 rounded-xl border border-dashed border-line2" aria-label="Replay spring">
            <motion.span className="absolute left-2 top-2 size-12 rounded-xl bg-acc" initial={false} animate={{ x: side ? Math.max(0, track - 64) : 0 }} transition={transition} />
          </button>
          <span className="mt-2 text-center text-[11px] text-faint">Tap the track to replay</span>
          <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full">
            <line x1="0" x2={W} y1={H - 12 - (1 / Math.max(1.2, peak)) * (H - 24)} y2={H - 12 - (1 / Math.max(1.2, peak)) * (H - 24)} stroke="#2a2a30" strokeDasharray="3 4" />
            <path d={d} fill="none" stroke="#ff6a2b" strokeWidth="1.6" />
          </svg>
        </div>
      </div>
      <div className="border-t border-line"><CodeBlock code={`<motion.div\n  animate={{ x: 200 }}\n  transition={{ type: 'spring', stiffness: ${k}, damping: ${c}, mass: ${m} }}\n/>`} title="Copy this transition" maxHeight={200} /></div>
    </div>
  )
}

const SWATCHES = ['#ff6a2b', '#3b82f6', '#10b981', '#a855f7', '#f43f5e', '#eab308']
const TOKENS = [['bg', '#09090a'], ['panel', '#0f0f11'], ['panel2', '#141417'], ['line', '#1e1e22'], ['line2', '#2a2a30'], ['tx', '#ededef'], ['mute', '#8a8a93'], ['faint', '#5c5c66']]

export function ThemeLab() {
  const [acc, setAcc] = useState(SWATCHES[0])
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-panel">
      <div className="grid grid-cols-4 gap-px bg-line sm:grid-cols-8">
        {TOKENS.map(([n, v]) => (
          <div key={n} className="bg-panel p-3">
            <div className="h-10 rounded-md border border-line2" style={{ background: v }} />
            <div className="mt-2 font-mono text-[11px] text-tx">{n}</div><div className="font-mono text-[10px] text-faint">{v}</div>
          </div>
        ))}
      </div>
      <div className="border-t border-line p-5" style={{ '--color-acc': acc }}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 text-xs text-mute">Try an accent</span>
          {SWATCHES.map((s) => <button key={s} type="button" onClick={() => setAcc(s)} aria-label={`Accent ${s}`} className={`size-6 rounded-full ring-offset-2 ring-offset-panel ${acc === s ? 'ring-2 ring-tx' : ''}`} style={{ background: s }} />)}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" className="h-9 rounded-lg bg-acc px-4 text-sm font-medium text-black">Primary</button>
          <span className="rounded-full bg-acc/15 px-2.5 py-1 text-xs text-acc">New</span>
          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-line"><motion.div className="h-full bg-acc" animate={{ width: ['20%', '85%', '20%'] }} transition={{ duration: 3, repeat: Infinity }} /></div>
          <span className="font-mono text-xs text-mute">--color-acc: <span className="text-tx">{acc}</span></span>
        </div>
      </div>
    </div>
  )
}
