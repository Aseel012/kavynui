import { useEffect, useRef } from 'react'

const APPS = ['GitHub', 'Slack', 'Linear', 'Figma', 'Stripe', 'Notion', 'Vercel', 'Sentry', 'Postgres', 'Resend', 'Discord', 'Jira']

// An integrations wall where every tile leans toward the pointer, like it is paying attention.
export default function LeanGrid({ items = APPS, strength = 18, className = '' }) {
  const box = useRef(null)
  const list = Array.isArray(items) && items.length ? items : APPS
  useEffect(() => {
    const el = box.current
    if (!el) return
    const tiles = [...el.querySelectorAll('[data-tile]')]
    let raf = 0, px = null, py = null
    const k = Math.min(40, Math.max(0, Number(strength) || 18))
    const paint = () => {
      raf = 0
      for (const t of tiles) {
        if (px === null) { t.style.transform = ''; t.style.setProperty('--glow', '0'); continue }
        const r = t.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2
        const dx = px - cx, dy = py - cy, d = Math.hypot(dx, dy) || 1, near = Math.max(0, 1 - d / 420)
        t.style.transform = `perspective(500px) rotateY(${(dx / d) * k * near}deg) rotateX(${(-dy / d) * k * near}deg) translateZ(${near * 14}px)`
        t.style.setProperty('--glow', near.toFixed(2))
      }
    }
    const move = (e) => { px = e.clientX; py = e.clientY; if (!raf) raf = requestAnimationFrame(paint) }
    const leave = () => { px = null; if (!raf) raf = requestAnimationFrame(paint) }
    el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave)
    return () => { cancelAnimationFrame(raf); el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave) }
  }, [strength, list.length])
  return (
    <div ref={box} className={`grid h-full min-h-72 w-full place-items-center bg-bg p-6 ${className}`}>
      <div className="grid w-full max-w-md grid-cols-3 gap-3 sm:grid-cols-4">
        {list.map((a) => (
          <div key={a} data-tile style={{ '--glow': 0 }}
            className="grid aspect-square place-items-center rounded-2xl border border-line bg-panel text-center text-[11px] text-mute transition-transform duration-200 ease-out will-change-transform [box-shadow:0_0_0_1px_rgba(255,106,43,calc(var(--glow)*.5)),0_10px_30px_-10px_rgba(255,106,43,calc(var(--glow)*.45))]">
            <div><div className="mx-auto mb-1.5 grid size-7 place-items-center rounded-lg bg-panel2 font-mono text-xs text-tx">{a.slice(0, 1)}</div>{a}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
