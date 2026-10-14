'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const Icon = ({ children, filled = false }) => (
  <svg viewBox="0 0 24 24" className="size-[18px] shrink-0" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
)
const LockIcon = () => <Icon filled><path d="M7 10V8a5 5 0 0 1 10 0v2" fill="none" /><rect x="5" y="10" width="14" height="11" rx="2.5" stroke="none" /></Icon>
const GlobeIcon = () => <Icon><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.6 2.6 3.9 5.6 3.9 9S14.6 18.4 12 21M12 3C9.4 5.6 8.1 8.6 8.1 12s1.3 6.4 3.9 9" /></Icon>

const DEFAULT_OPTIONS = [
  { value: 'private', label: 'Private', icon: <LockIcon /> },
  { value: 'public', label: 'Public', icon: <GlobeIcon /> },
]

const SPRING = { type: 'spring', stiffness: 520, damping: 34, mass: 0.7 }
const BLUR_IN = { opacity: 0, scale: 0.84, y: 10, filter: 'blur(8px)' }

/** @param {{ options?: any, value?: any, defaultValue?: any, onChange?: any, closeOnSelect?: any, className?: any }} props */
export default function QuickMenu({ options = DEFAULT_OPTIONS, value = undefined, defaultValue = undefined, onChange = undefined, closeOnSelect = true, className = '' }) {
  const [inner, setInner] = useState(defaultValue ?? options[0]?.value)
  const current = value !== undefined ? value : inner
  const [open, setOpen] = useState(false)
  const root = useRef(null)
  const id = useId()
  const active = options.find((o) => o.value === current) ?? options[0]

  useEffect(() => {
    if (!open) return
    const away = (e) => { if (root.current && !root.current.contains(e.target)) setOpen(false) }
    const esc = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', away)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('pointerdown', away); document.removeEventListener('keydown', esc) }
  }, [open])

  const pick = (o) => {
    if (value === undefined) setInner(o.value)
    onChange?.(o.value, o)
    if (closeOnSelect) setOpen(false)
  }

  return (
    <div ref={root} className={`relative inline-flex ${className}`}>
      <AnimatePresence>
        {open && (
          <motion.div
            id={id} role="menu"
            initial={BLUR_IN} animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }} exit={{ ...BLUR_IN, transition: { duration: 0.16 } }}
            transition={SPRING}
            style={{ transformOrigin: '50% 100%' }}
            className="absolute bottom-[calc(100%+12px)] left-1/2 z-10 -translate-x-1/2"
          >
            <div className="relative flex gap-1.5 rounded-[20px] bg-line p-1.5 shadow-[0_12px_30px_-12px_rgba(0,0,0,.25)]">
              {options.map((o) => {
                const on = o.value === current
                return (
                  <button
                    key={o.value} type="button" role="menuitemradio" aria-checked={on} onClick={() => pick(o)}
                    className={`flex h-11 items-center gap-2 whitespace-nowrap rounded-[14px] bg-panel px-4 text-[15px] font-medium outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-acc/60 ${on ? 'text-tx' : 'text-faint hover:text-mute'}`}
                  >
                    {o.icon}{o.label}
                  </button>
                )
              })}
              <span aria-hidden="true" className="absolute left-1/2 top-full size-4 -translate-x-1/2 -translate-y-[8px] rotate-45 rounded-[4px] bg-line" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        layout type="button" aria-haspopup="menu" aria-expanded={open} aria-controls={open ? id : undefined}
        onClick={() => setOpen((v) => !v)}
        transition={SPRING}
        style={{ borderRadius: 999 }}
        className="flex h-11 items-center gap-2 bg-line px-4 text-[15px] font-medium text-mute outline-none focus-visible:ring-2 focus-visible:ring-acc/60"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={active?.value} layout="position"
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(6px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, scale: 0.8, filter: 'blur(6px)' }}
            transition={{ duration: 0.26, ease: [0.3, 0.7, 0.2, 1] }}
            className="flex items-center gap-2"
          >
            {active?.icon}{active?.label}
          </motion.span>
        </AnimatePresence>
        <motion.svg layout="position" viewBox="0 0 24 24" className="size-4 shrink-0 text-faint" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" animate={{ rotate: open ? 180 : 0 }} transition={SPRING} aria-hidden="true"><path d="m6 9 6 6 6-6" /></motion.svg>
      </motion.button>
    </div>
  )
}
