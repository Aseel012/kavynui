'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useSpring, useTransform } from 'motion/react'

const spring = { type: 'spring', stiffness: 420, damping: 32 }

// Simulated upload: eases to 100% over ~1.6s with requestAnimationFrame, so the ring never steps.
function fakeUpload(_file, onProgress) {
  return new Promise((resolve) => {
    const start = performance.now(), ms = 1600
    const tick = (now) => {
      const t = Math.min(1, (now - start) / ms)
      onProgress(1 - (1 - t) ** 3)
      if (t < 1) requestAnimationFrame(tick); else resolve()
    }
    requestAnimationFrame(tick)
  })
}

/** @param {{ initialSrc?: any, size?: any, maxSizeMB?: any, onUpload?: any, onChange?: any, demoSrc?: any, name?: any }} props */
export default function AvatarUpload({
  initialSrc = '',
  size = 112,
  maxSizeMB = 5,
  onUpload = undefined,
  onChange = undefined,
  demoSrc = '',
  name = 'Profile photo',
}) {
  const [src, setSrc] = useState(initialSrc)
  const [status, setStatus] = useState(initialSrc ? 'done' : 'empty') // empty | uploading | done | error
  const [error, setError] = useState('')
  const [drag, setDrag] = useState(false)
  const input = useRef(null)
  const urlRef = useRef('')
  const run = useRef(0)
  const id = useId()
  const reduce = useReducedMotion()
  const progress = useSpring(0, { stiffness: 140, damping: 26 })
  const dash = useTransform(progress, (p) => Math.max(0, Math.min(1, p)))

  const R = size / 2 + 6, C = size + 12

  const release = () => { if (urlRef.current) { URL.revokeObjectURL(urlRef.current); urlRef.current = '' } }
  useEffect(() => release, [])

  const start = async (file, preview) => {
    const token = ++run.current
    setError(''); setSrc(preview); setStatus('uploading'); progress.jump(0)
    try {
      await (onUpload || fakeUpload)(file, (p) => token === run.current && progress.set(p))
      if (token !== run.current) return
      progress.set(1); setStatus('done'); onChange?.(file)
    } catch (e) {
      if (token !== run.current) return
      setStatus('error'); setError(e?.message || 'Upload failed. Try again.')
    }
  }

  const take = (file) => {
    if (!file) return
    if (!file.type?.startsWith('image/')) { setError('Choose a JPG, PNG or WebP image.'); return }
    if (file.size > maxSizeMB * 1e6) { setError(`That photo is over ${maxSizeMB} MB.`); return }
    release()
    urlRef.current = URL.createObjectURL(file)
    start(file, urlRef.current)
  }

  const remove = () => {
    run.current++; release(); progress.jump(0)
    setSrc(''); setStatus('empty'); setError(''); onChange?.(null)
  }

  // Site demo only: walks through one upload with a local image so the preview is alive.
  useEffect(() => {
    if (!demoSrc) return
    const t = setTimeout(() => start(null, demoSrc), 900)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoSrc])

  const pick = () => input.current?.click()
  const busy = status === 'uploading'

  return (
    <div className="flex w-[300px] max-w-full flex-col items-center text-center">
      <motion.div
        className="relative"
        style={{ width: C, height: C }}
        animate={{ scale: drag ? 1.04 : 1 }}
        transition={spring}
        onDragEnter={(e) => { e.preventDefault(); setDrag(true) }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); take(e.dataTransfer.files?.[0]) }}
      >
        <svg className="absolute inset-0 -rotate-90" width={C} height={C} viewBox={`0 0 ${C} ${C}`} aria-hidden>
          <circle cx={C / 2} cy={C / 2} r={R - 2} fill="none" stroke="var(--line2)" strokeWidth="2" strokeDasharray={src ? '0' : '3 5'} />
          <motion.circle cx={C / 2} cy={C / 2} r={R - 2} fill="none" stroke="var(--tx)" strokeWidth="2.5" strokeLinecap="round"
            style={{ pathLength: dash }} animate={{ opacity: busy ? 1 : 0 }} transition={{ duration: 0.3 }} />
        </svg>

        <button
          type="button"
          onClick={pick}
          disabled={busy}
          aria-describedby={`${id}-hint`}
          aria-label={src ? 'Replace profile photo' : 'Upload profile photo'}
          className="group absolute left-1.5 top-1.5 overflow-hidden rounded-full bg-panel2 outline-none ring-offset-2 ring-offset-bg focus-visible:ring-2 focus-visible:ring-tx"
          style={{ width: size, height: size }}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {src ? (
              <motion.img key={src} src={src} alt={name} draggable={false} className="size-full object-cover"
                initial={reduce ? false : { opacity: 0, scale: 1.12, filter: 'blur(8px)' }}
                animate={{ opacity: busy ? 0.55 : 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} />
            ) : (
              <motion.span key="empty" className="grid size-full place-items-center text-faint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <svg viewBox="0 0 24 24" className="size-9" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><circle cx="12" cy="8.5" r="3.5" /><path d="M5 19.5c1.4-3 4-4.5 7-4.5s5.6 1.5 7 4.5" /></svg>
              </motion.span>
            )}
          </AnimatePresence>
          {!busy && (
            <span className="absolute inset-0 grid place-items-center bg-black/45 text-[12px] font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
              {src ? 'Replace' : 'Upload'}
            </span>
          )}
        </button>

        <AnimatePresence>
          {status === 'done' && src && (
            <motion.span key="ok" className="absolute bottom-2 right-2 grid size-7 place-items-center rounded-full border-2 border-bg bg-tx text-bg"
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 520, damping: 22 }} aria-hidden>
              <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.12, duration: 0.3 }} /></svg>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      <input ref={input} type="file" accept="image/*" className="sr-only" tabIndex={-1} aria-hidden onChange={(e) => { take(e.target.files?.[0]); e.target.value = '' }} />

      <div className="mt-4 text-[15px] font-medium text-tx">{name}</div>
      <div id={`${id}-hint`} className="mt-1 h-5 text-[13px]" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={error || status} className={error ? 'text-rose-500' : 'text-mute'} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }}>
            {error || (busy ? 'Uploading…' : status === 'done' ? 'Saved' : `Drop or click. JPG, PNG, up to ${maxSizeMB} MB.`)}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="mt-4 flex gap-2">
        <button type="button" onClick={pick} disabled={busy} className="h-9 rounded-full bg-tx px-4 text-[13px] font-medium text-bg transition-transform active:scale-95 disabled:opacity-40">
          {src ? 'Replace' : 'Choose photo'}
        </button>
        <AnimatePresence initial={false}>
          {src && !busy && (
            <motion.button key="rm" type="button" onClick={remove} initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} transition={spring}
              className="h-9 overflow-hidden whitespace-nowrap rounded-full border border-line2 px-4 text-[13px] text-mute hover:text-tx">
              Remove
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
