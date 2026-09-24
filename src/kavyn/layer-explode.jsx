import { useState } from 'react'
import { motion } from 'motion/react'

const LAYERS = ['Surface', 'Content', 'Controls', 'Focus']

// A card that splits into its design layers in 3D. Hover or tap to explode it.
// Good for design-system pages and "how it's built" sections.
export default function LayerExplode({ labels = LAYERS, className = '' }) {
  const [open, setOpen] = useState(false)
  const names = Array.isArray(labels) && labels.length >= 4 ? labels : LAYERS
  const z = (k) => (open ? k * 46 : k * 0.5)
  const layer = 'absolute inset-0 rounded-2xl [transform-style:preserve-3d]'
  const spring = { type: 'spring', stiffness: 170, damping: 20 }
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <button type="button" aria-pressed={open} onClick={() => setOpen((o) => !o)} onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(true)} onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen(false)}
        className="relative h-64 w-72 outline-none [perspective:1100px] focus-visible:ring-2 focus-visible:ring-acc/60" aria-label="Explode card layers">
        <motion.div animate={{ rotateX: open ? 58 : 0, rotateZ: open ? -32 : 0, scale: open ? 0.82 : 1 }} transition={spring} className="absolute inset-0 [transform-style:preserve-3d]">
          <motion.div animate={{ z: z(0) }} transition={spring} className={`${layer} border border-line bg-panel shadow-[0_30px_60px_-20px_rgba(0,0,0,.8)]`} />
          <motion.div animate={{ z: z(1) }} transition={spring} className={`${layer} p-5 text-left`}>
            <div className="h-24 rounded-lg bg-gradient-to-br from-acc/70 to-[#7a1f0a]" />
            <div className="mt-3 text-sm font-semibold text-tx">Weekly digest</div>
            <div className="mt-1 text-xs text-mute">Five links worth your time.</div>
          </motion.div>
          <motion.div animate={{ z: z(2) }} transition={spring} className={`${layer} flex items-end gap-2 p-5`}>
            <span className="flex-1 rounded-lg bg-tx py-2 text-center text-xs font-medium text-bg">Subscribe</span>
            <span className="rounded-lg border border-line2 px-3 py-2 text-xs text-mute">Later</span>
          </motion.div>
          <motion.div animate={{ z: z(3), opacity: open ? 1 : 0 }} transition={spring} className={`${layer} border-2 border-dashed border-acc/60`} />
          {names.slice(0, 4).map((l, k) => (
            <motion.span key={l} animate={{ z: z(k), opacity: open ? 1 : 0 }} transition={spring}
              className="absolute -right-24 top-0 whitespace-nowrap font-mono text-[10px] text-acc [transform-style:preserve-3d]">── {l}</motion.span>
          ))}
        </motion.div>
      </button>
      <span className="text-[11px] text-faint">{open ? 'Four layers, one card' : 'Hover or tap'}</span>
    </div>
  )
}
