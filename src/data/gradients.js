// Gradient backgrounds. Each entry renders live on /backgrounds and generates its own CSS, Tailwind and React code.
// Keep values plain CSS so the copied code works anywhere.

const NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")"

const PAN = '@keyframes kv-g-pan { 0% { background-position: 0% 50% } 50% { background-position: 100% 50% } 100% { background-position: 0% 50% } }'
const ORBIT = '@keyframes kv-g-orbit { 0%, 100% { background-position: 0% 0%, 100% 100% } 50% { background-position: 60% 40%, 30% 60% } }'

// Named for the product they suit. No blue: warm metals, earth, wine and graphite.
export const GRADIENTS = [
  { id: 'studio-light', name: 'Studio Light', use: 'Product launch', kind: 'Spotlight', base: '#000000',
    layers: ['radial-gradient(45% 70% at 50% -12%, rgba(245,245,247,.24), transparent 70%)', 'radial-gradient(22% 30% at 50% 0%, rgba(255,255,255,.18), transparent 70%)'] },
  { id: 'copper-dusk', name: 'Copper Dusk', use: 'Fintech landing', kind: 'Mesh', base: '#0b0908',
    layers: ['radial-gradient(42% 55% at 18% 85%, rgba(200,130,80,.42), transparent 70%)', 'radial-gradient(38% 45% at 85% 20%, rgba(110,47,69,.45), transparent 70%)', 'radial-gradient(25% 25% at 55% 45%, rgba(232,200,160,.10), transparent 70%)'] },
  { id: 'graphite-grid', name: 'Graphite Grid', use: 'Developer tools', kind: 'Pattern', base: '#050505',
    layers: ['radial-gradient(55% 55% at 50% 45%, rgba(245,245,247,.08), transparent 70%)', 'linear-gradient(rgba(255,255,255,.055) 1px, transparent 1px)', 'linear-gradient(90deg, rgba(255,255,255,.055) 1px, transparent 1px)'],
    sizes: 'auto, 32px 32px, 32px 32px' },
  { id: 'saffron-sweep', name: 'Saffron Sweep', use: 'Food delivery app', kind: 'Conic', base: '#0d0804',
    layers: ['conic-gradient(from 180deg at 50% 105%, transparent 0deg, rgba(240,160,40,.45) 55deg, rgba(255,214,140,.32) 90deg, rgba(220,110,30,.42) 125deg, transparent 180deg)'] },
  { id: 'moss-field', name: 'Moss Field', use: 'Outdoor brand', kind: 'Mesh', base: '#060805',
    layers: [NOISE, 'radial-gradient(60% 60% at 25% 30%, rgba(107,127,90,.55), transparent 70%)', 'radial-gradient(50% 50% at 80% 75%, rgba(138,133,86,.38), transparent 70%)'], blend: 'overlay, normal, normal' },
  { id: 'wine-silk', name: 'Wine Silk', use: 'Fashion and luxury', kind: 'Aurora', base: '#0b0507',
    layers: ['linear-gradient(115deg, transparent 18%, rgba(122,40,62,.55) 40%, rgba(196,120,110,.28) 55%, transparent 76%)'],
    anim: { name: 'kv-g-pan', css: PAN, value: 'kv-g-pan 12s ease-in-out infinite', size: '250% 250%' } },
  { id: 'dot-field', name: 'Dot Field', use: 'AI product', kind: 'Pattern', base: '#000000',
    layers: ['radial-gradient(55% 55% at 50% 40%, rgba(245,245,247,.10), transparent 70%)', 'radial-gradient(rgba(255,255,255,.16) 1px, transparent 1.5px)'],
    sizes: 'auto, 18px 18px' },
  { id: 'sand-dune', name: 'Sand Dune', use: 'Travel and stays', kind: 'Linear', base: '#130d09',
    layers: ['linear-gradient(180deg, #130d09 0%, #3d2b1c 42%, #8a6243 74%, #d9b48a 100%)'] },
  { id: 'ember-horizon', name: 'Ember Horizon', use: 'Event ticketing', kind: 'Spotlight', base: '#060403',
    layers: ['radial-gradient(85% 50% at 50% 105%, rgba(229,93,48,.50), transparent 70%)', 'radial-gradient(120% 60% at 50% 115%, rgba(122,40,62,.40), transparent 70%)'] },
  { id: 'lilac-mist', name: 'Lilac Mist', use: 'Wellness app', kind: 'Mesh', base: '#0d0a0e',
    layers: ['radial-gradient(45% 55% at 15% 80%, rgba(176,127,214,.38), transparent 70%)', 'radial-gradient(40% 50% at 85% 20%, rgba(240,170,150,.30), transparent 70%)'] },
  { id: 'rose-orbit', name: 'Rose Orbit', use: 'Music and creators', kind: 'Aurora', base: '#0a0506',
    layers: ['radial-gradient(35% 35% at 30% 40%, rgba(214,64,110,.50), transparent 70%)', 'radial-gradient(30% 30% at 70% 60%, rgba(240,140,100,.40), transparent 70%)'],
    anim: { name: 'kv-g-orbit', css: ORBIT, value: 'kv-g-orbit 12s ease-in-out infinite', size: '200% 200%' } },
  { id: 'chrome-conic', name: 'Chrome', use: 'Hardware product', kind: 'Conic', base: '#0a0a0b',
    layers: ['conic-gradient(from 210deg at 50% 60%, #0a0a0b, rgba(200,200,206,.35), #0a0a0b 38%, rgba(245,245,247,.20), #0a0a0b 78%)'] },
  { id: 'olive-grain', name: 'Olive Grain', use: 'Coffee and craft', kind: 'Mesh', base: '#0a0905',
    layers: [NOISE, 'radial-gradient(55% 60% at 70% 30%, rgba(138,133,86,.45), transparent 70%)', 'radial-gradient(45% 45% at 20% 80%, rgba(110,70,40,.45), transparent 70%)'], blend: 'overlay, normal, normal' },
  { id: 'carbon-fade', name: 'Carbon', use: 'Dashboard chrome', kind: 'Linear', base: '#050505',
    layers: ['linear-gradient(135deg, #1c1c1e 0%, #050505 55%)', 'radial-gradient(40% 40% at 90% 10%, rgba(255,255,255,.07), transparent 70%)'] },
  { id: 'signal-sweep', name: 'Signal Sweep', use: 'Status and uptime', kind: 'Conic', base: '#040604',
    layers: ['conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(48,164,108,.45) 40deg, transparent 80deg)', 'radial-gradient(circle at 50% 50%, transparent 30%, #040604 72%)'],
    anim: { name: 'kv-g-spin', css: '@property --kv-r { syntax: "<angle>"; initial-value: 0deg; inherits: false } @keyframes kv-g-spin { to { --kv-r: 360deg } }', value: 'kv-g-spin 6s linear infinite', conicVar: true } },
  { id: 'paper-grain', name: 'Paper', use: 'Docs and editorial', kind: 'Grain', base: '#ececea',
    layers: [NOISE, 'radial-gradient(70% 60% at 50% 0%, rgba(255,255,255,.9), transparent 70%)'], blend: 'multiply, normal' },
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
  if (g.anim) out.push('', g.anim.css, '', '@media (prefers-reduced-motion: reduce) {', `  .bg-${g.id} { animation: none; }`, '}')
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
