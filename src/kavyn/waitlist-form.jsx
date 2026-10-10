'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const POOL = [
  { id: 'p1', src: 'https://randomuser.me/api/portraits/women/44.jpg', initials: 'AK', hue: '#d8b27a' },
  { id: 'p2', src: 'https://randomuser.me/api/portraits/men/32.jpg', initials: 'MS', hue: '#8fb996' },
  { id: 'p3', src: 'https://randomuser.me/api/portraits/women/68.jpg', initials: 'RJ', hue: '#e8a2b4' },
  { id: 'p4', src: 'https://randomuser.me/api/portraits/men/75.jpg', initials: 'PN', hue: '#9db4d4' },
  { id: 'p5', src: 'https://randomuser.me/api/portraits/women/12.jpg', initials: 'DV', hue: '#c9a2e0' },
  { id: 'p6', src: 'https://randomuser.me/api/portraits/men/41.jpg', initials: 'SL', hue: '#e0a184' },
  { id: 'p7', src: 'https://randomuser.me/api/portraits/women/29.jpg', initials: 'TK', hue: '#7fb3c8' },
  { id: 'p8', src: 'https://randomuser.me/api/portraits/men/56.jpg', initials: 'IB', hue: '#b5c48a' },
  { id: 'p9', src: 'https://randomuser.me/api/portraits/women/33.jpg', initials: 'AR', hue: '#d69bb8' },
  { id: 'p10', src: 'https://randomuser.me/api/portraits/men/18.jpg', initials: 'NK', hue: '#93b8a4' },
  { id: 'p11', src: 'https://randomuser.me/api/portraits/women/51.jpg', initials: 'SP', hue: '#c8a883' },
  { id: 'p12', src: 'https://randomuser.me/api/portraits/men/85.jpg', initials: 'RM', hue: '#a3a3d6' },
]

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Avatar({ person, first }) {
  const [ok, setOk] = useState(true)
  const [loaded, setLoaded] = useState(false)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.4, x: -16 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 160, damping: 22 }}
      whileHover={{ scale: 1.12, transition: { type: 'spring', stiffness: 400, damping: 22 } }}
      className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-bg text-[11px] font-semibold text-white"
      style={{ background: person.hue || '#8a8a93', marginLeft: first ? 0 : -8 }}
    >
      {person.initials}
      {person.src && ok && (
        <img
          src={person.src}
          alt=""
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setOk(false)}
          className="absolute inset-0 size-full rounded-full object-cover transition-opacity duration-300"
          style={{ opacity: loaded ? 1 : 0 }}
        />
      )}
    </motion.div>
  )
}

/** @param {{ placeholder?: any, buttonLabel?: any, successLabel?: any, retryLabel?: any, errorLabel?: any, count?: any, countLabel?: any, people?: any, visible?: any, autoJoin?: any, autoJoinInterval?: any, onSubmit?: any }} props */
export default function WaitlistForm({
  placeholder = 'Enter your email',
  buttonLabel = 'Join Waitlist',
  successLabel = "You're in!",
  retryLabel = 'Try again',
  errorLabel = 'Could not join right now. Please try again.',
  count = 32,
  countLabel = 'People joined today',
  people = POOL,
  visible = 5,
  autoJoin = false,
  autoJoinInterval = 4800,
  onSubmit = undefined,
}) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle') // idle | sending | done | failed
  const [shake, setShake] = useState(false)
  const [joined, setJoined] = useState(0)
  // Window start index into people; the visible stack is derived, so a face can never repeat.
  const [start, setStart] = useState(0)
  const done = state === 'done'
  const n = people.length
  const heads = n ? Array.from({ length: Math.min(visible, n) }, (_, i) => people[(start + i) % n]) : []

  const pushOne = () => {
    setJoined((j) => j + 1)
    if (n) setStart((s) => (s - 1 + n) % n)
  }

  // Demo-only conveyor: off by default so production counts stay real. Enable with autoJoin.
  useEffect(() => {
    if (!autoJoin || !n) return
    const t = setInterval(pushOne, autoJoinInterval)
    return () => clearInterval(t)
  }, [autoJoin, autoJoinInterval, n])

  const submit = async (e) => {
    e.preventDefault()
    if (state === 'sending' || done) return
    if (!EMAIL.test(email.trim())) {
      setShake(true)
      setTimeout(() => setShake(false), 450)
      return
    }
    setState('sending')
    try {
      await onSubmit?.(email.trim())
      setState('done')
      pushOne()
    } catch {
      setState('failed')
    }
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
        <motion.input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          animate={shake || state === 'failed' ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
          className={`h-14 w-full flex-1 rounded-2xl border bg-panel2 px-5 text-sm text-tx outline-none transition-colors placeholder:text-faint ${shake || state === 'failed' ? 'border-red-400' : 'border-line focus:border-line2'}`}
        />
        <motion.button
          type="submit"
          whileTap={{ scale: 0.97 }}
          className="relative h-14 shrink-0 rounded-2xl bg-tx px-7 text-sm font-medium text-bg"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={state}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex items-center justify-center gap-2"
            >
              {done ? (
                <>
                  <svg viewBox="0 0 24 24" className="size-4">
                    <motion.path d="M5 12l5 5 9-10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, delay: 0.05 }} />
                  </svg>
                  {successLabel}
                </>
              ) : state === 'sending' ? (
                <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: 'linear', duration: 0.8 }} className="size-4 rounded-full border-2 border-bg/30 border-t-bg" />
              ) : state === 'failed' ? (
                retryLabel
              ) : (
                buttonLabel
              )}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </form>
      <AnimatePresence initial={false}>
        {state === 'failed' && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="-mt-1 text-xs text-red-400">
            {errorLabel}
          </motion.p>
        )}
      </AnimatePresence>
      <div className="flex items-center gap-4">
        {heads.length > 0 && (
          <div className="flex">
            {heads.map((p, i) => <Avatar key={p.id ?? p.initials} person={p} first={i === 0} />)}
          </div>
        )}
        <div className="flex items-center text-xs">
          <span className="relative z-10 rounded-full bg-tx px-2.5 py-1 font-semibold text-bg">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={count + joined} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 30 }} className="inline-block tabular-nums">
                {count + joined}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="-ml-2 rounded-full border border-line bg-panel2 py-1 pl-4 pr-3 text-mute">{countLabel}</span>
        </div>
      </div>
    </div>
  )
}
