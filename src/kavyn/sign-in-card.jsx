import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const valid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)

// Block: magic-link sign-in. Validates as you type, shakes on a bad address, confirms with a sent state.
export default function SignInCard({ product = 'Acme', onSubmit }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle')
  const [shake, setShake] = useState(0)
  const submit = async (e) => {
    e.preventDefault()
    if (!valid(email)) { setShake((n) => n + 1); return }
    setState('sending')
    try { await (onSubmit ? onSubmit(email) : new Promise((r) => setTimeout(r, 900))); setState('sent') } catch { setState('error') }
  }
  return (
    <section className="@container grid w-full place-items-center rounded-2xl border border-line bg-bg p-6 @2xl:p-12">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-panel p-6">
        <AnimatePresence mode="wait" initial={false}>
          {state === 'sent' ? (
            <motion.div key="sent" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="py-4 text-center">
              <motion.svg viewBox="0 0 24 24" className="mx-auto size-10 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="1.8"><motion.path d="M4 12.5 9.5 18 20 6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} /></motion.svg>
              <h3 className="mt-4 text-base font-medium text-tx">Check your inbox</h3>
              <p className="mt-1 text-sm text-mute">We sent a sign-in link to <span className="text-tx">{email}</span></p>
              <button type="button" onClick={() => setState('idle')} className="mt-5 text-xs text-mute underline underline-offset-4 hover:text-tx">Use a different email</button>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3 className="text-lg font-medium tracking-tight text-tx">Sign in to {product}</h3>
              <p className="mt-1 text-sm text-mute">No password. We will email you a link.</p>
              <button type="button" className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-line2 bg-bg text-sm text-tx hover:bg-panel2">
                <svg viewBox="0 0 24 24" className="size-4" fill="currentColor"><path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0C17.3 4.8 18.3 5.1 18.3 5.1c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5Z" /></svg>
                Continue with GitHub
              </button>
              <div className="my-4 flex items-center gap-3 text-[11px] text-faint"><span className="h-px flex-1 bg-line" />or<span className="h-px flex-1 bg-line" /></div>
              <motion.label key={shake} animate={shake ? { x: [0, -8, 8, -5, 5, 0] } : {}} transition={{ duration: 0.4 }}
                className={`flex h-10 items-center rounded-lg border bg-bg px-3 transition-colors focus-within:border-acc/70 ${shake && !valid(email) ? 'border-rose-500/60' : 'border-line2'}`}>
                <input type="email" inputMode="email" autoComplete="email" maxLength={254} value={email} onChange={(e) => setEmail(e.target.value.trim())} placeholder="you@company.com" aria-label="Email" className="min-w-0 flex-1 bg-transparent text-sm text-tx outline-none placeholder:text-faint" />
                {valid(email) && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-xs text-emerald-400">✓</motion.span>}
              </motion.label>
              {state === 'error' && <p className="mt-2 text-xs text-rose-400">Could not send the link. Check your connection and try again.</p>}
              <button type="submit" disabled={state === 'sending'} className="mt-3 flex h-10 w-full items-center justify-center rounded-lg bg-tx text-sm font-medium text-bg disabled:opacity-60">
                {state === 'sending' ? <motion.span className="size-4 rounded-full border-2 border-bg/30 border-t-bg" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }} /> : 'Email me a link'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
