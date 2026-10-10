import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

// Reference accent (royal indigo sampled from the source video), not the site token.
const ACCENT = '#3962f9'
const RED = '#f43f5e'

const EXT_COLORS = {
  pdf: '#ef4444',
  png: '#a855f7',
  jpg: '#3b82f6',
  jpeg: '#3b82f6',
  gif: '#ec4899',
  svg: '#f59e0b',
  xlsx: '#22c55e',
  xls: '#22c55e',
  csv: '#22c55e',
  doc: '#3b82f6',
  docx: '#3b82f6',
  pptx: '#f97316',
  mp4: '#f59e0b',
  mov: '#f59e0b',
  mp3: '#8b5cf6',
  zip: '#8b8b96',
  txt: '#8b8b96',
  json: '#8b8b96',
}
const extOf = (name) => (name.includes('.') ? name.split('.').pop().toLowerCase() : 'file')
const extColor = (ext) => EXT_COLORS[ext] || '#8b8b96'

let uid = 0
const fmtMB = (b) => (b / 1e6).toFixed(1)
// Deterministic per-name upload rate so the demo tells the same story every load.
const rateOf = (name) => {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return 0.14 + (h % 100) / 1000 // 4.5-7s per file
}

const DEMO_FILES = [
  { name: 'Q3-Board-Report.pdf', size: 4.2e6 },
  { name: 'Hero-Shot.png', size: 2.6e6 },
  { name: 'Budget-2027.xlsx', size: 1.3e6, failOnce: true },
  { name: 'Product-Demo.mp4', size: 31.5e6 },
]

function DocIcon({ ext, w = 38, h = 44 }) {
  const c = extColor(ext)
  const label = ext === 'file' ? 'FILE' : ext.toUpperCase().slice(0, 4)
  return (
    <svg width={w} height={h} viewBox="0 0 38 44" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M6 1.5h16.5L33 12v26a4.5 4.5 0 0 1-4.5 4.5H6A4.5 4.5 0 0 1 1.5 38V6A4.5 4.5 0 0 1 6 1.5Z"
        className="fill-panel2 stroke-line2"
      />
      <path d="M22.5 1.5 33 12h-9a1.5 1.5 0 0 1-1.5-1.5V1.5Z" className="fill-line stroke-line2" />
      <rect x="5.5" y="29.5" width="27" height="11" rx="3" fill={c} fillOpacity="0.14" />
      <text x="19" y="38" textAnchor="middle" fontSize={label.length > 3 ? '6.4' : '7.6'} fontWeight="800" fill={c} style={{ letterSpacing: '0.02em' }}>
        {label}
      </text>
    </svg>
  )
}

function UploadGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  )
}

function FanIcon({ active }) {
  return (
    <div className={`relative mb-4 h-[62px] w-[92px] transition-transform duration-300 ${active ? '-translate-y-0.5' : ''}`} aria-hidden="true">
      <div className={`absolute left-0 top-[15px] transition-all duration-300 ${active ? '-translate-x-1 -rotate-[14deg]' : '-rotate-12'}`}>
        <DocIcon ext="pdf" w={30} h={35} />
      </div>
      <div className={`absolute right-0 top-[15px] transition-all duration-300 ${active ? 'translate-x-1 rotate-[14deg]' : 'rotate-12'}`}>
        <DocIcon ext="png" w={30} h={35} />
      </div>
      <div
        className={`absolute left-1/2 top-0 grid h-[46px] w-[46px] -translate-x-1/2 place-items-center rounded-[13px] border transition-all duration-300 ${
          active ? 'shadow-[0_10px_24px_rgba(57,98,249,0.30)]' : 'border-line2 bg-panel2 text-tx shadow-sm'
        }`}
        style={active ? { color: ACCENT, borderColor: `${ACCENT}55`, backgroundColor: 'var(--panel)' } : undefined}
      >
        <UploadGlyph />
      </div>
    </div>
  )
}

const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-faint" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
)
const RetryIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" />
  </svg>
)
const WarnIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" />
  </svg>
)

/** @param {{ maxSizeMB?: any, typesLabel?: any, autoDemo?: any, onUpload?: any, className?: any }} props */
export default function Dropzone({
  maxSizeMB = 25,
  typesLabel = undefined,
  autoDemo = false,
  onUpload = undefined,
  className = '',
}) {
  const label = typesLabel ?? 'PDF, PNG, JPG and more'
  const [files, setFiles] = useState([])
  const [drag, setDrag] = useState(false)
  const [dragCount, setDragCount] = useState(0)
  const inputRef = useRef(null)
  const depth = useRef(0)
  const demoRan = useRef(false)
  const realStarted = useRef(new Set())

  const patch = (id, p) => setFiles((fs) => fs.map((f) => (f.id === id ? { ...f, ...p } : f)))

  const addFiles = useCallback((list) => {
    const items = [...list].map((src) => {
      const name = src.name
      const size = src.size ?? 0
      const over = size > maxSizeMB * 1e6
      return {
        id: ++uid,
        name,
        size,
        ext: extOf(name),
        file: src.file || null,
        failOnce: !!src.failOnce,
        status: over ? 'toolarge' : 'uploading',
        loaded: 0,
        rate: rateOf(name),
      }
    })
    if (items.length) setFiles((fs) => [...fs, ...items])
  }, [maxSizeMB])

  // Simulated upload engine. Real backends plug in via onUpload instead.
  useEffect(() => {
    if (onUpload) return
    const t = setInterval(() => {
      setFiles((fs) => {
        if (!fs.some((f) => f.status === 'uploading')) return fs
        return fs.map((f) => {
          if (f.status !== 'uploading') return f
          const loaded = Math.min(f.size, f.loaded + f.size * f.rate * 0.12)
          // Scripted one-time failure so the retry state is reachable in demos.
          if (f.failOnce && loaded / f.size >= 0.45) return { ...f, loaded, status: 'error', errorMsg: 'Connection lost', failOnce: false }
          if (loaded >= f.size) return { ...f, loaded: f.size, status: 'done' }
          return { ...f, loaded }
        })
      })
    }, 120)
    return () => clearInterval(t)
  }, [onUpload])

  useEffect(() => {
    if (!onUpload) return
    files.forEach((f) => {
      if (f.status !== 'uploading' || realStarted.current.has(f.id)) return
      realStarted.current.add(f.id)
      Promise.resolve(onUpload(f, (loaded) => patch(f.id, { loaded: Math.min(loaded, f.size) })))
        .then(() => patch(f.id, { status: 'done', loaded: f.size }))
        .catch((err) => patch(f.id, { status: 'error', errorMsg: err?.message || 'Upload failed' }))
    })
  }, [files, onUpload])

  // Showcase script: drop the reference files, one fails once and auto-retries.
  useEffect(() => {
    if (!autoDemo || demoRan.current) return
    demoRan.current = true
    const timers = []
    DEMO_FILES.forEach((f, i) => timers.push(setTimeout(() => addFiles([f]), 700 + i * 350)))
    timers.push(setTimeout(() => setFiles((fs) => fs.map((f) => (f.status === 'error' ? { ...f, status: 'uploading', loaded: 0 } : f))), 700 + DEMO_FILES.length * 350 + 5200))
    return () => timers.forEach(clearTimeout)
  }, [autoDemo, addFiles])

  const retry = (id) => {
    realStarted.current.delete(id)
    patch(id, { status: 'uploading', loaded: 0, errorMsg: undefined })
  }
  const remove = (id) => setFiles((fs) => fs.filter((f) => f.id !== id))
  const clear = () => setFiles([])

  // Never let a missed drop fall through to the browser (it would open the file and leave the page).
  useEffect(() => {
    const stop = (e) => e.preventDefault()
    window.addEventListener('dragover', stop)
    window.addEventListener('drop', stop)
    return () => { window.removeEventListener('dragover', stop); window.removeEventListener('drop', stop) }
  }, [])

  const onDragEnter = (e) => { e.preventDefault(); depth.current++; setDragCount(e.dataTransfer?.items?.length || 0); setDrag(true) }
  const onDragOver = (e) => { e.preventDefault() }
  const onDragLeave = (e) => { e.preventDefault(); if (--depth.current <= 0) { depth.current = 0; setDrag(false) } }
  const onDrop = (e) => {
    e.preventDefault(); depth.current = 0; setDrag(false)
    addFiles([...e.dataTransfer.files].map((file) => ({ name: file.name, size: file.size, file })))
  }
  const pick = () => inputRef.current?.click()

  const active = files.filter((f) => f.status === 'uploading')
  const doneCount = files.filter((f) => f.status === 'done').length
  const failed = files.some((f) => f.status === 'error' || f.status === 'toolarge')
  const loadedSum = active.reduce((a, f) => a + f.loaded, 0)
  const sizeSum = active.reduce((a, f) => a + f.size, 0)

  return (
    <div
      className={`w-full max-w-xl overflow-hidden rounded-[28px] border border-line bg-panel shadow-sm ${className}`}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="p-3">
        <div
          role="button"
          tabIndex={0}
          onClick={pick}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && pick()}
          className={`grid cursor-pointer place-items-center rounded-[20px] border-2 px-6 py-10 text-center outline-none transition-all duration-300 ${
            drag ? 'border-solid' : 'border-dashed border-line2 hover:border-faint/60'
          }`}
          style={drag ? { borderColor: ACCENT, backgroundColor: `${ACCENT}0d`, boxShadow: `0 0 0 4px ${ACCENT}1f` } : undefined}
        >
          <input ref={inputRef} type="file" multiple className="hidden" onChange={(e) => { addFiles([...e.target.files].map((file) => ({ name: file.name, size: file.size, file }))); e.target.value = '' }} />
          <FanIcon active={drag} />
          <div className="text-[17px] font-semibold text-tx">
            {drag ? (
              <>Release to upload {dragCount > 0 ? `${dragCount} file${dragCount === 1 ? '' : 's'}` : 'files'}</>
            ) : (
              <>Drop files here or <span className="font-semibold" style={{ color: ACCENT }}>browse</span></>
            )}
          </div>
          <div className="mt-1.5 text-sm text-mute">{label} · up to {maxSizeMB} MB each</div>
        </div>

        {files.length > 0 && (
          <div className="divide-y divide-line">
            <AnimatePresence initial={false}>
              {files.map((f) => (
                <motion.div
                  key={f.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                  className="flex items-center gap-3.5 px-2 py-4"
                >
                  <DocIcon ext={f.ext} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-[15px] font-medium text-tx">{f.name}</span>
                      {f.status === 'done' && <CheckIcon />}
                    </div>
                    <div className={`mt-0.5 text-[13px] ${f.status === 'error' || f.status === 'toolarge' ? '' : 'text-mute'}`} style={f.status === 'error' || f.status === 'toolarge' ? { color: RED } : undefined}>
                      {f.status === 'uploading' && (
                        <>{fmtMB(f.loaded)} of {fmtMB(f.size)} MB · {f.size - f.loaded < f.size * f.rate * 1.5 ? 'almost done' : `${Math.ceil((f.size - f.loaded) / (f.size * f.rate))}s left`}</>
                      )}
                      {f.status === 'done' && <>{fmtMB(f.size)} MB</>}
                      {f.status === 'error' && (f.errorMsg || 'Upload failed')}
                      {f.status === 'toolarge' && `Too large – max ${maxSizeMB} MB`}
                    </div>
                    {(f.status === 'uploading' || f.status === 'error') && (
                      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-line2/70">
                        <div
                          className={`h-full rounded-full transition-[width] duration-150 ease-linear ${f.status === 'error' ? '' : 'bg-tx'}`}
                          style={f.status === 'error' ? { width: `${Math.round((f.loaded / f.size) * 100)}%`, backgroundColor: RED } : { width: `${Math.round((f.loaded / f.size) * 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                  {f.status === 'error' && (
                    <button type="button" onClick={() => retry(f.id)} aria-label="Retry upload" className="shrink-0 text-faint transition-colors hover:text-tx"><RetryIcon /></button>
                  )}
                  <button type="button" onClick={() => remove(f.id)} aria-label={`Remove ${f.name}`} className="shrink-0 text-faint transition-colors hover:text-tx"><XIcon /></button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between bg-panel2 px-5 py-3.5 text-[13px]">
        {files.length === 0 ? (
          <span className="text-faint">No files yet</span>
        ) : active.length > 0 ? (
          <span className="text-mute">Uploading {active.length} of {files.length} · {fmtMB(loadedSum)} of {fmtMB(sizeSum)} MB</span>
        ) : (
          <>
            <span className="flex items-center gap-1.5 text-mute">
              {failed && <WarnIcon />}
              {doneCount} of {files.length} uploaded
            </span>
            <button type="button" onClick={clear} className="font-medium text-mute transition-colors hover:text-tx">Clear</button>
          </>
        )}
      </div>
    </div>
  )
}
