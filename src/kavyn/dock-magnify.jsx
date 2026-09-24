import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'

const ICONS = [
  { label: 'Home', d: 'M3 11 12 4l9 7v9h-6v-6H9v6H3z' },
  { label: 'Analytics', d: 'M4 20V10M10 20V4M16 20v-7M22 20H2' },
  { label: 'Globe', d: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-9 9h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18' },
  { label: 'Shield', d: 'M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z' },
  { label: 'Terminal', d: 'm5 8 4 4-4 4M12 16h7M3 4h18v16H3z' },
  { label: 'Settings', d: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM4 12h2M18 12h2M12 4v2M12 18v2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4' },
]

function Item({ mouse, icon, onPick }) {
  const ref = useRef(null)
  const dist = useTransform(mouse, (x) => {
    const b = ref.current?.getBoundingClientRect()
    return b ? x - (b.left + b.width / 2) : 999
  })
  const size = useSpring(useTransform(dist, [-120, 0, 120], [40, 64, 40]), { stiffness: 400, damping: 28 })
  return (
    <motion.button ref={ref} type="button" onClick={() => onPick?.(icon.label)} aria-label={icon.label} style={{ width: size, height: size }}
      className="group relative grid shrink-0 place-items-center rounded-2xl border border-line2 bg-panel2 text-mute hover:text-tx">
      <svg viewBox="0 0 24 24" className="size-[45%]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={icon.d} /></svg>
      <span className="pointer-events-none absolute -top-8 rounded-md border border-line2 bg-panel px-2 py-0.5 text-[11px] text-tx opacity-0 transition-opacity group-hover:opacity-100">{icon.label}</span>
    </motion.button>
  )
}

// macOS-style dock: icons grow with cursor distance on a spring.
export default function DockMagnify({ items = ICONS, onPick }) {
  const mouse = useMotionValue(Infinity)
  return (
    <div onMouseMove={(e) => mouse.set(e.clientX)} onMouseLeave={() => mouse.set(Infinity)}
      className="flex h-[76px] items-end gap-2.5 rounded-3xl border border-line bg-panel/80 px-3 pb-3 backdrop-blur">
      {items.map((it) => <Item key={it.label} mouse={mouse} icon={it} onPick={onPick} />)}
    </div>
  )
}
