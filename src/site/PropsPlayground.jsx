// Live controls for a component's props, read from its own source (parseProps).
// Numbers, booleans, text and colours get a control; functions, arrays, children and style are left alone.
// The preview re-renders with the values, and usageCode() prints the same props so what you copy is what you saw.

const SKIP = new Set(['className', 'style', 'children', 'id', 'allowSoftware'])
const MAX_TEXT = 80

const unquote = (s) => {
  const t = String(s).trim()
  if (!/^(['"`]).*\1$/s.test(t)) return t
  const body = t.slice(1, -1)
  // Defaults are written by hand in the source; anything with interpolation or escapes is not a plain value.
  return /\$\{|\\/.test(body) ? null : body
}
const isColour = (p, value) => /colou?r|^from$|^to$|tint|ink/i.test(p.name) || /^#[0-9a-f]{3,8}$/i.test(value || '')

/** Turns parseProps() output into editable controls with a parsed default. */
export function controlsFor(props) {
  return props.flatMap((p) => {
    if (SKIP.has(p.name) || /^on[A-Z]/.test(p.name)) return []
    if (p.type === 'boolean') return [{ ...p, kind: 'boolean', initial: p.default === 'true' }]
    if (p.type === 'number') {
      const d = Number(p.default)
      if (!Number.isFinite(d)) return []
      // A range that suits the default: fractions get 0..2, counts get 0..4x (at least 10).
      const frac = !Number.isInteger(d) || (d > 0 && d <= 2)
      const max = frac ? Math.max(2, d * 2) : Math.max(10, Math.ceil(Math.abs(d) * 4))
      const min = d < 0 ? -max : 0
      return [{ ...p, kind: 'number', initial: d, min, max, step: frac ? 0.05 : 1 }]
    }
    if (p.type === 'string') {
      const d = unquote(p.default)
      if (d === null || d.length > MAX_TEXT) return []
      // Room to try real values without breaking the layout: a 1-character default like '$' gets 8, a label gets ~4x its length.
      const max = Math.min(MAX_TEXT, Math.max(8, d.length * 4))
      return [{ ...p, kind: isColour(p, d) ? 'colour' : 'text', initial: d, max }]
    }
    return []
  })
}

/** Only the values that differ from the defaults, ready to spread onto the component. */
export function changed(controls, values) {
  const out = {}
  for (const c of controls) if (c.name in values && values[c.name] !== c.initial) out[c.name] = values[c.name]
  return out
}

const attr = (name, v) => (typeof v === 'string' ? `${name}=${JSON.stringify(v)}` : typeof v === 'boolean' && v ? name : `${name}={${String(v)}}`)

/** <Export prop={value} /> for the usage block, with only changed props. */
export function usageCode(item, props) {
  const parts = Object.entries(props).map(([k, v]) => attr(k, v))
  const tag = parts.length === 0 ? `<${item.export} />`
    : parts.join(' ').length < 50 ? `<${item.export} ${parts.join(' ')} />`
      : `<${item.export}\n      ${parts.join('\n      ')}\n    />`
  return `import ${item.export} from '@/components/kavyn/${item.slug}'\n\nexport default function Page() {\n  return (\n    ${tag}\n  )\n}`
}

const label = (name) => name.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())
const round = (n) => Math.round(n * 1000) / 1000

export default function PropsPlayground({ controls, values, onChange, onReset }) {
  if (!controls.length) return null
  const set = (name, v) => onChange({ ...values, [name]: v })
  const dirty = controls.some((c) => c.name in values && values[c.name] !== c.initial)
  return (
    <div className="mt-3 rounded-[22px] border border-line bg-panel/40 p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-[13px] font-medium text-tx">Customize</h2>
        <button type="button" onClick={onReset} disabled={!dirty} className="h-7 rounded-full px-3 text-xs text-mute hover:text-tx disabled:opacity-40">Reset</button>
      </div>
      <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        {controls.map((c) => {
          const v = c.name in values ? values[c.name] : c.initial
          const id = `pp-${c.name}`
          if (c.kind === 'boolean') return (
            <label key={c.name} htmlFor={id} className="flex cursor-pointer items-center justify-between gap-3 text-[13px] text-mute">
              <span>{label(c.name)}</span>
              <input id={id} type="checkbox" role="switch" checked={!!v} onChange={(e) => set(c.name, e.target.checked)} className="peer sr-only" />
              <span aria-hidden="true" className={`relative h-5 w-9 shrink-0 rounded-full transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-tx ${v ? 'bg-tx' : 'bg-line2'}`}>
                <span className={`absolute top-0.5 size-4 rounded-full bg-bg transition-transform ${v ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </span>
            </label>
          )
          if (c.kind === 'number') return (
            <div key={c.name} className="text-[13px] text-mute">
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <label htmlFor={id}>{label(c.name)}</label>
                <input type="number" aria-label={`${label(c.name)} value`} value={v} step={c.step} min={c.min} max={c.max}
                  onChange={(e) => { const n = Number(e.target.value); if (Number.isFinite(n)) set(c.name, round(Math.min(c.max, Math.max(c.min, n)))) }}
                  className="h-7 w-20 rounded-md bg-panel2 px-2 text-right font-mono text-xs text-tx outline-none focus-visible:ring-2 focus-visible:ring-tx" />
              </div>
              <input id={id} type="range" min={c.min} max={c.max} step={c.step} value={v} onChange={(e) => set(c.name, round(Number(e.target.value)))} className="w-full accent-[var(--tx)]" />
            </div>
          )
          if (c.kind === 'colour') return (
            <div key={c.name} className="flex items-center justify-between gap-3 text-[13px] text-mute">
              <label htmlFor={id}>{label(c.name)}</label>
              <span className="flex items-center gap-2">
                {!v && <span className="text-xs text-faint">theme</span>}
                <input id={id} type="color" value={/^#[0-9a-f]{6}$/i.test(v) ? v : '#888888'} onChange={(e) => set(c.name, e.target.value)} className="h-7 w-10 cursor-pointer rounded-md border border-line bg-transparent" />
                {v && v !== c.initial && <button type="button" onClick={() => set(c.name, c.initial)} className="text-xs text-faint hover:text-tx" aria-label={`Reset ${label(c.name)}`}>×</button>}
              </span>
            </div>
          )
          return (
            <div key={c.name} className="text-[13px] text-mute">
              <label htmlFor={id} className="mb-1.5 block">{label(c.name)}</label>
              <input id={id} type="text" value={v} maxLength={c.max} onChange={(e) => set(c.name, e.target.value.slice(0, c.max))}
                className="h-8 w-full rounded-lg bg-panel2 px-2.5 text-[13px] text-tx outline-none focus-visible:ring-2 focus-visible:ring-tx" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
