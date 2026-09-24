// Gradient backgrounds. Each entry renders live on /backgrounds and generates its own CSS, Tailwind and React code.
// Keep values plain CSS so the copied code works anywhere.

const NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")"

export const GRADIENTS = [
  { id: 'ember-mesh', name: 'Ember Mesh', kind: 'Mesh', base: '#0b0706',
    layers: ['radial-gradient(40% 50% at 20% 30%, rgba(255,106,43,.55), transparent 70%)', 'radial-gradient(35% 45% at 80% 70%, rgba(180,40,20,.5), transparent 70%)', 'radial-gradient(30% 30% at 60% 20%, rgba(255,190,120,.25), transparent 70%)'] },
  { id: 'aurora-drift', name: 'Aurora Drift', kind: 'Aurora', base: '#05070c',
    layers: ['linear-gradient(120deg, rgba(16,185,129,.35), rgba(59,130,246,.3), rgba(168,85,247,.35), rgba(16,185,129,.35))'],
    anim: { name: 'kv-g-pan', css: '@keyframes kv-g-pan { 0% { background-position: 0% 50% } 50% { background-position: 100% 50% } 100% { background-position: 0% 50% } }', value: 'kv-g-pan 14s ease-in-out infinite', size: '300% 300%' } },
  { id: 'horizon-glow', name: 'Horizon Glow', kind: 'Spotlight', base: '#09090a',
    layers: ['radial-gradient(80% 50% at 50% 100%, rgba(255,106,43,.45), transparent 70%)', 'radial-gradient(120% 60% at 50% 110%, rgba(120,40,200,.35), transparent 70%)'] },
  { id: 'cobalt-conic', name: 'Cobalt Conic', kind: 'Conic', base: '#04060d',
    layers: ['conic-gradient(from 200deg at 50% 60%, #04060d, rgba(59,130,246,.55), #04060d 40%, rgba(14,165,233,.35), #04060d 80%)'] },
  { id: 'dusk-linear', name: 'Dusk', kind: 'Linear', base: '#0d0a14',
    layers: ['linear-gradient(180deg, #0d0a14 0%, #2a1433 45%, #5a1f2b 75%, #b3471f 100%)'] },
  { id: 'mint-noise', name: 'Mint Grain', kind: 'Mesh', base: '#050b09',
    layers: [NOISE, 'radial-gradient(60% 60% at 30% 30%, rgba(16,185,129,.45), transparent 70%)', 'radial-gradient(50% 50% at 75% 75%, rgba(20,184,166,.35), transparent 70%)'], blend: 'overlay, normal, normal' },
  { id: 'spotlight-top', name: 'Stage Light', kind: 'Spotlight', base: '#09090a',
    layers: ['radial-gradient(50% 80% at 50% -10%, rgba(237,237,239,.22), transparent 70%)', 'radial-gradient(30% 40% at 50% 0%, rgba(255,255,255,.18), transparent 70%)'] },
  { id: 'grid-glow', name: 'Grid Glow', kind: 'Pattern', base: '#09090a',
    layers: ['radial-gradient(50% 50% at 50% 50%, rgba(255,106,43,.25), transparent 70%)', 'linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px)', 'linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)'],
    sizes: 'auto, 32px 32px, 32px 32px' },
  { id: 'lava-orbit', name: 'Lava Orbit', kind: 'Aurora', base: '#0a0505',
    layers: ['radial-gradient(35% 35% at 30% 40%, rgba(255,80,40,.6), transparent 70%)', 'radial-gradient(30% 30% at 70% 60%, rgba(255,160,60,.45), transparent 70%)'],
    anim: { name: 'kv-g-orbit', css: '@keyframes kv-g-orbit { 0%, 100% { background-position: 0% 0%, 100% 100% } 50% { background-position: 60% 40%, 30% 60% } }', value: 'kv-g-orbit 12s ease-in-out infinite', size: '200% 200%' } },
  { id: 'ocean-depth', name: 'Ocean Depth', kind: 'Linear', base: '#020611',
    layers: ['radial-gradient(70% 50% at 50% 0%, rgba(56,189,248,.28), transparent 70%)', 'linear-gradient(180deg, #06142b 0%, #020611 70%)'] },
  { id: 'violet-haze', name: 'Violet Haze', kind: 'Mesh', base: '#07050d',
    layers: ['radial-gradient(45% 55% at 15% 85%, rgba(168,85,247,.45), transparent 70%)', 'radial-gradient(40% 50% at 85% 15%, rgba(236,72,153,.35), transparent 70%)', 'radial-gradient(25% 25% at 50% 50%, rgba(99,102,241,.25), transparent 70%)'] },
  { id: 'sunrise-conic', name: 'Sunrise Burst', kind: 'Conic', base: '#0c0605',
    layers: ['conic-gradient(from 180deg at 50% 100%, transparent 0deg, rgba(255,106,43,.45) 60deg, rgba(255,200,120,.3) 90deg, rgba(255,106,43,.45) 120deg, transparent 180deg)'] },
  { id: 'dot-matrix', name: 'Dot Matrix', kind: 'Pattern', base: '#09090a',
    layers: ['radial-gradient(60% 60% at 50% 40%, rgba(59,130,246,.18), transparent 70%)', 'radial-gradient(rgba(255,255,255,.14) 1px, transparent 1.5px)'],
    sizes: 'auto, 18px 18px' },
  { id: 'rose-silk', name: 'Rose Silk', kind: 'Aurora', base: '#0c0508',
    layers: ['linear-gradient(115deg, transparent 20%, rgba(244,63,94,.35) 40%, rgba(251,146,60,.25) 55%, transparent 75%)'],
    anim: { name: 'kv-g-pan', css: '@keyframes kv-g-pan { 0% { background-position: 0% 50% } 50% { background-position: 100% 50% } 100% { background-position: 0% 50% } }', value: 'kv-g-pan 10s ease-in-out infinite', size: '250% 250%' } },
  { id: 'carbon-fade', name: 'Carbon Fade', kind: 'Linear', base: '#09090a',
    layers: ['linear-gradient(135deg, #1a1a1f 0%, #09090a 55%)', 'radial-gradient(40% 40% at 90% 10%, rgba(255,255,255,.07), transparent 70%)'] },
  { id: 'eclipse', name: 'Eclipse', kind: 'Spotlight', base: '#050505',
    layers: ['radial-gradient(circle at 50% 50%, #050505 22%, rgba(255,106,43,.5) 23%, rgba(255,106,43,.08) 32%, transparent 45%)'] },
  { id: 'glacier', name: 'Glacier', kind: 'Mesh', base: '#050a0e',
    layers: ['radial-gradient(50% 60% at 20% 20%, rgba(186,230,253,.25), transparent 70%)', 'radial-gradient(50% 50% at 80% 80%, rgba(56,189,248,.3), transparent 70%)', 'radial-gradient(30% 30% at 70% 30%, rgba(255,255,255,.12), transparent 70%)'] },
  { id: 'signal-sweep', name: 'Signal Sweep', kind: 'Conic', base: '#060806',
    layers: ['conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(34,197,94,.4) 40deg, transparent 80deg)', 'radial-gradient(circle at 50% 50%, transparent 30%, #060806 72%)'],
    anim: { name: 'kv-g-spin', css: '@property --kv-r { syntax: "<angle>"; initial-value: 0deg; inherits: false } @keyframes kv-g-spin { to { --kv-r: 360deg } }', value: 'kv-g-spin 6s linear infinite', conicVar: true } },
]

export const KINDS = ['All', ...new Set(GRADIENTS.map((g) => g.kind))]

const layersOf = (g) => (g.anim?.conicVar ? g.layers.map((l, i) => (i === 0 ? l.replace('from 0deg', 'from var(--kv-r)') : l)) : g.layers)

// Inline style for the live preview.
export function styleOf(g) {
  const s = { backgroundColor: g.base, backgroundImage: layersOf(g).join(', ') }
  if (g.sizes) s.backgroundSize = g.sizes
  if (g.blend) s.backgroundBlendMode = g.blend
  if (g.anim) { s.animation = g.anim.value; if (g.anim.size) s.backgroundSize = g.anim.size }
  return s
}

const cssLines = (g) => {
  const L = [`  background-color: ${g.base};`, `  background-image:\n    ${layersOf(g).join(',\n    ')};`]
  if (g.sizes) L.push(`  background-size: ${g.sizes};`)
  if (g.blend) L.push(`  background-blend-mode: ${g.blend};`)
  if (g.anim?.size) L.push(`  background-size: ${g.anim.size};`)
  if (g.anim) L.push(`  animation: ${g.anim.value};`)
  return L
}

export function cssOf(g) {
  const out = [`.bg-${g.id} {`, ...cssLines(g), '}']
  if (g.anim) out.push('', g.anim.css)
  out.push('', '@media (prefers-reduced-motion: reduce) {', `  .bg-${g.id} { animation: none; }`, '}')
  return out.join('\n')
}

export function reactOf(g) {
  const name = g.id.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join('') + 'Background'
  const style = JSON.stringify(styleOf(g), null, 2).replace(/"(\w+)":/g, '$1:')
  const kf = g.anim ? `\n      <style>{\`${g.anim.css}\`}</style>` : ''
  return `const style = ${style}

export default function ${name}({ children, className = '' }) {
  return (
    <div className={\`relative overflow-hidden \${className}\`} style={style}>${kf}
      <div className="relative">{children}</div>
    </div>
  )
}`
}

export function tailwindOf(g) {
  if (g.anim) return `/* Animated backgrounds need keyframes. Use the CSS or React tab. */`
  const esc = (v) => v.replace(/\s+/g, '_')
  const cls = [`bg-[${g.base}]`, `[background-image:${esc(layersOf(g).join(','))}]`]
  if (g.sizes) cls.push(`[background-size:${esc(g.sizes)}]`)
  if (g.blend) cls.push(`[background-blend-mode:${esc(g.blend)}]`)
  return `<div className="${cls.join(' ')}">\n  …\n</div>`
}
