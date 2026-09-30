'use client'

import { useId, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

const DAY = 86400000
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DEMO_WORKSPACES = [
  { name: 'Cedar Forge', count: 286, mark: 'CF', color: '#6bbf8a' },
  { name: 'Lumen Dock', count: 173, mark: 'LD', color: '#b8a0e3' },
  { name: 'Drift Works', count: 94, mark: 'DW', color: '#e9b17d' },
]
function calendar(year, startMonth, endMonth, data) {
  const start = Date.UTC(year, startMonth - 1, 1)
  const end = Date.UTC(year, endMonth, 0)
  const counts = new Map()
  const records = data ?? Array.from({ length: Math.round((end - start) / DAY) + 1 }, (_, i) => ({
    date: new Date(start + i * DAY).toISOString().slice(0, 10),
    count: (i * 17 + Math.floor(i / 9) * 3) % 13 < 3 ? 0 : (i * 7 + 5) % 11 + 1,
  }))
  for (const entry of records) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.date ?? '')) continue
    const time = Date.parse(`${entry.date}T00:00:00Z`)
    if (!Number.isFinite(time) || new Date(time).toISOString().slice(0, 10) !== entry.date || time < start || time > end) continue
    const count = Number(entry.count)
    if (!Number.isFinite(count) || count < 0) continue
    counts.set(entry.date, (counts.get(entry.date) ?? 0) + Math.floor(count))
  }
  const origin = start - new Date(start).getUTCDay() * DAY
  const length = Math.ceil(((end - origin) / DAY + 1) / 7) * 7
  const days = Array.from({ length }, (_, i) => {
    const time = origin + i * DAY, date = new Date(time).toISOString().slice(0, 10)
    return { date, count: counts.get(date) ?? 0, active: time >= start && time <= end }
  })
  const valid = days.filter((day) => day.active)
  const max = Math.max(1, ...valid.map((day) => day.count))
  const total = valid.reduce((sum, day) => sum + day.count, 0)
  const months = Array.from({ length: endMonth - startMonth + 1 }, (_, i) => {
    const month = startMonth + i
    return { label: MONTHS[month - 1], column: Math.floor((Date.UTC(year, month - 1, 1) - origin) / DAY / 7) }
  })
  return { days, total, max, months, columns: length / 7 }
}

// Undefined data generates a labeled demo. Pass [] for a real empty calendar.
// colors: { dark: [empty, low, medium, high, peak], light: [...] }.
// dates are YYYY-MM-DD calendar days, interpreted in UTC, never local timezone.
/** @param {{ year?: any, data?: any, workspaces?: any, startMonth?: any, endMonth?: any, theme?: any, colors?: any, defaultExpanded?: any, onExpandedChange?: any }} props */
export default function CommitGrove({ year = 2026, data = undefined, workspaces = undefined, startMonth = 6, endMonth = 12, theme = 'auto', colors = undefined, defaultExpanded = false, onExpandedChange = undefined }) {
  const reduced = useReducedMotion()
  const id = useId()
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [focused, setFocused] = useState(null)
  const [hovered, setHovered] = useState(null)
  const cells = useRef([])
  const y = Number.isInteger(year) && year >= 100 && year <= 9998 ? year : 2026
  const first = Math.min(12, Math.max(1, Number.isFinite(startMonth) ? Math.floor(startMonth) : 6))
  const last = Math.min(12, Math.max(first, Number.isFinite(endMonth) ? Math.floor(endMonth) : 12))
  const graph = useMemo(() => calendar(y, first, last, Array.isArray(data) ? data : undefined), [y, first, last, data])
  const orgs = (Array.isArray(workspaces) ? workspaces : data === undefined ? DEMO_WORKSPACES : []).map((org) => ({ ...org, count: Number.isFinite(Number(org.count)) ? Math.max(0, Math.floor(Number(org.count))) : 0 }))
  const demo = data === undefined
  const activeStart = graph.days.findIndex((d) => d.active)
  const cursor = focused ?? activeStart
  const pointed = hovered ?? focused
  const selected = pointed !== null ? graph.days[pointed] : null
  const summary = `${graph.total.toLocaleString('en-US')} contributions from ${MONTHS[first - 1]} to ${MONTHS[last - 1]} ${y}`
  const style = { width: '100%', maxWidth: 520 }
  for (const mode of ['dark', 'light']) {
    if (!Array.isArray(colors?.[mode])) continue
    colors[mode].slice(0, 5).forEach((color, i) => { if (typeof color === 'string') style[`--grove-${mode}-${i}`] = color })
  }
  const keys = (event, index) => {
    const offset = { ArrowRight: 7, ArrowLeft: -7, ArrowDown: 1, ArrowUp: -1 }[event.key]
    let next = offset !== undefined ? index + offset : event.key === 'Home' ? activeStart : event.key === 'End' ? graph.days.findLastIndex((d) => d.active) : null
    if (next === null) return
    event.preventDefault()
    if (graph.days[next]?.active) { setFocused(next); cells.current[next]?.focus() }
  }
  return <section data-commit-grove data-theme={theme} style={style} className="grove-card rounded-[24px] border border-line2 bg-bg p-4 text-tx sm:p-5">
    <style>{`
      .grove-card { --g0:var(--grove-dark-0,#17271e); --g1:var(--grove-dark-1,#244b34); --g2:var(--grove-dark-2,#377149); --g3:var(--grove-dark-3,#53a96a); --g4:var(--grove-dark-4,#8ae49d); }
      .light .grove-card:not([data-theme="dark"]), .grove-card[data-theme="light"] { --g0:var(--grove-light-0,#e5eee7); --g1:var(--grove-light-1,#c4ddca); --g2:var(--grove-light-2,#8fbf9d); --g3:var(--grove-light-3,#579b6b); --g4:var(--grove-light-4,#267844); }
      .grove-card[data-theme="light"] { color:#19191e; background:#fafafa; border-color:#dedee5; }
      .grove-card[data-theme="dark"] { color:#ededf0; background:#09090a; border-color:#303036; }
      .grove-muted { opacity:.62; }
      .grove-cell:focus { outline:none; stroke:currentColor; stroke-width:1.4; }
      .grove-toggle:focus-visible { outline:2px solid var(--g4); outline-offset:3px; }
      .grove-cell:hover { stroke:currentColor; stroke-width:1; }
    `}</style>
    <header className="flex flex-wrap items-center justify-between gap-2"><div><h3 className="text-sm font-medium"><span>{graph.total.toLocaleString('en-US')}</span><span className="grove-muted"> contributions · </span><span>{y}</span></h3><p className="grove-muted mt-1 text-[11px]">{MONTHS[first - 1]} to {MONTHS[last - 1]}</p></div>{demo && <span className="grove-muted rounded-full border border-current/15 px-2 py-1 text-[10px]">Sample activity</span>}</header>
    <div className="mt-4">
      <svg className="block w-full" viewBox={`0 0 ${graph.columns * 14} 116`} role="group" aria-label={`${summary}. Use arrow keys to explore days.`}>
        {graph.months.map((month) => <text key={month.label} x={month.column * 14 + 1} y={10} fontSize={8} fill="currentColor" opacity={.55}>{month.label}</text>)}
        {graph.days.map((day, i) => day.active && <motion.rect key={day.date} ref={(node) => { cells.current[i] = node }} role="img" aria-label={`${day.date}: ${day.count} contributions`} tabIndex={i === cursor ? 0 : -1} className="grove-cell" x={Math.floor(i / 7) * 14 + 1} y={18 + (i % 7) * 14} width={11} height={11} rx={2.5} fill={`var(--g${day.count === 0 ? 0 : Math.max(1, Math.ceil(day.count / graph.max * 4))})`} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .2, delay: reduced ? 0 : Math.floor(i / 7) * .008 }} onFocus={() => setFocused(i)} onBlur={() => setFocused(null)} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} onKeyDown={(e) => keys(e, i)}><title>{day.date}: {day.count} contributions</title></motion.rect>)}
      </svg>
      <div className="grove-muted mt-2 flex min-h-5 items-center justify-between gap-2 text-[10px]"><span aria-live="polite">{selected ? `${selected.date} · ${selected.count} contributions` : 'Each square is a day'}</span><div className="flex items-center gap-1" aria-label="Color intensity from less to more activity"><span className="mr-1">Less</span>{[0, 1, 2, 3, 4].map((n) => <span key={n} className="size-2 rounded-[2px]" style={{ background: `var(--g${n})` }} />)}<span className="ml-1">More</span></div></div>
    </div>
    <div className="mt-4 overflow-hidden rounded-2xl border border-current/10 bg-current/[.025]">
      <button type="button" style={{ outlineOffset: -3 }} className="grove-toggle flex min-h-14 w-full items-center justify-between gap-2 px-3.5 text-left" aria-expanded={expanded} aria-controls={`${id}-workspaces`} onClick={() => { setExpanded(!expanded); onExpandedChange?.(!expanded) }}>
        <span className="text-xs font-medium">Workspace highlights</span><span className="flex items-center gap-3">{!expanded && <span className="flex -space-x-1.5" aria-hidden="true">{orgs.slice(0, 3).map((org, index) => <span key={`${org.name}-${index}`} className="grid size-6 place-items-center rounded-full border-2 border-bg text-[8px] font-semibold text-black" style={{ background: org.color ?? '#9fcab0' }}>{org.mark ?? org.name?.slice(0, 2).toUpperCase()}</span>)}</span>}<motion.svg animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: reduced ? 0 : .22 }} width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="grove-muted rounded-full border border-current/20 p-1" aria-hidden="true"><path d="m6 9 6 6 6-6" /></motion.svg></span>
      </button>
      <div id={`${id}-workspaces`}><AnimatePresence initial={false}>{expanded && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduced ? 0 : .25, ease: [.22, 1, .36, 1] }}>
        <ul className="space-y-1 px-3.5 pb-3">{orgs.map((org, index) => <motion.li key={`${org.name}-${index}`} initial={reduced ? false : { opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .2, delay: reduced ? 0 : index * .045 }} className="flex min-h-11 items-center gap-3"><span className="grid size-7 shrink-0 place-items-center overflow-hidden rounded-full text-[9px] font-semibold text-black" style={{ background: org.color ?? '#9fcab0' }}>{org.avatar ? <><span className="col-start-1 row-start-1">{org.mark ?? org.name?.slice(0, 2).toUpperCase()}</span><img src={org.avatar} alt="" className="col-start-1 row-start-1 size-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} /></> : org.mark ?? org.name?.slice(0, 2).toUpperCase()}</span><span className="min-w-0 flex-1 truncate text-xs">{org.name}</span><span className="grove-muted text-xs tabular-nums">{org.count.toLocaleString('en-US')}</span></motion.li>)}</ul>{orgs.length === 0 && <p className="grove-muted px-3.5 pb-4 text-xs">No workspace activity supplied.</p>}
      </motion.div>}</AnimatePresence></div>
    </div>
  </section>
}
