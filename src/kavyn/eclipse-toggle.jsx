'use client'



import { useState } from 'react'
import { motion } from 'motion/react'

const RAYS = Array.from({ length: 8 }, (_, i) => i * 45)
const STARS = [
  { x: 18.5, y: 5.5, r: 0.9 },
  { x: 20, y: 11, r: 0.7 },
  { x: 16.5, y: 16.5, r: 0.8 },
]
const spring = { type: 'spring', stiffness: 380, damping: 24 }

/** @param {{ defaultMode?: any, size?: any, onToggle?: any }} props */
export default function EclipseToggle({ defaultMode = 'dark', size = 44, onToggle = undefined }) {
  const [mode, setMode] = useState(defaultMode)
  const dark = mode === 'dark'
  const flip = () => {
    const next = dark ? 'light' : 'dark'
    setMode(next)
    onToggle?.(next)
  }

  return (
    <button
      type="button"
      onClick={flip}
      aria-pressed={dark}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{ width: size, height: size }}
      className="grid place-items-center rounded-full border border-line2 bg-panel text-mute transition-colors hover:border-faint hover:text-tx"
    >
      <motion.svg
        viewBox="0 0 24 24"
        style={{ width: size * 0.55, height: size * 0.55 }}
        animate={{ rotate: dark ? 0 : 180 }}
        whileTap={{ scale: 0.85 }}
        transition={spring}
      >
        {/* moon core (theme text color: near-white on dark, near-black on light) */}
        <motion.circle
          cx={12} cy={12}
          fill="var(--tx)"
          animate={{ r: dark ? 5.6 : 5.2, opacity: dark ? 1 : 0 }}
          transition={spring}
        />
        {/* sun core (site accent, reads on both themes) */}
        <motion.circle
          cx={12} cy={12}
          fill="var(--acc)"
          animate={{ r: dark ? 5.6 : 5.2, opacity: dark ? 0 : 1 }}
          transition={spring}
        />
        {/* cover disc slides in from the top right and cuts the crescent */}
        <motion.circle
          r={4.7}
          className="fill-panel"
          animate={{ cx: dark ? 15.8 : 23, cy: dark ? 8.2 : 1 }}
          initial={false}
          transition={spring}
        />
        {/* rays grow out of the core in light, retract back into it in dark */}
        {RAYS.map((deg, i) => (
          <g key={deg} transform={`rotate(${deg} 12 12)`}>
            <motion.line
              x1={12} y1={3.4} x2={12} y2={1}
              stroke="var(--acc)" strokeWidth={1.6} strokeLinecap="round"
              animate={{ pathLength: dark ? 0 : 1, opacity: dark ? 0 : 1 }}
              transition={{ ...spring, delay: dark ? i * 0.018 : 0.04 + i * 0.018 }}
            />
          </g>
        ))}
        {/* stars pop in with the moon */}
        {STARS.map((s, i) => (
          <g key={i} transform={`translate(${s.x} ${s.y})`}>
            <motion.circle
              r={s.r}
              fill="var(--mute)"
              animate={{ opacity: dark ? 1 : 0, scale: dark ? 1 : 0 }}
              transition={{ ...spring, delay: dark ? 0.08 + i * 0.05 : 0 }}
            />
          </g>
        ))}
      </motion.svg>
    </button>
  )
}