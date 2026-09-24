import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const STEPS = ['Account', 'Workspace', 'Invite', 'Done']

export default function StepperMorph({ steps = STEPS }) {
  const [s, setS] = useState(1)
  return (
    <div className="w-full max-w-md">
      <div className="flex items-center">
        {steps.map((st, i) => (
          <div key={st} className="flex flex-1 items-center last:flex-none">
            <motion.div animate={{ backgroundColor: i < s ? '#ff6a2b' : '#0f0f11', borderColor: i <= s ? '#ff6a2b' : '#2a2a30', scale: i === s ? 1.12 : 1 }} transition={{ type: 'spring', stiffness: 400, damping: 24 }} className="grid size-8 shrink-0 place-items-center rounded-full border text-xs">
              <AnimatePresence mode="wait" initial={false}>
                {i < s ? (
                  <motion.svg key="c" viewBox="0 0 24 24" className="size-4" initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}><motion.path d="M5 12l5 5 9-10" fill="none" stroke="#09090a" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /></motion.svg>
                ) : (
                  <motion.span key="n" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className={i === s ? 'text-acc' : 'text-faint'}>{i + 1}</motion.span>
                )}
              </AnimatePresence>
            </motion.div>
            {i < steps.length - 1 && <div className="mx-1.5 h-0.5 flex-1 overflow-hidden rounded bg-line2"><motion.div className="h-full bg-acc" animate={{ width: i < s ? '100%' : '0%' }} transition={{ type: 'spring', stiffness: 160, damping: 24 }} /></div>}
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-between text-[11px] text-faint">{steps.map((st, i) => <span key={st} className={i === s ? 'text-tx' : ''}>{st}</span>)}</div>
      <div className="mt-5 flex gap-2">
        <button onClick={() => setS(Math.max(0, s - 1))} className="rounded-lg border border-line2 px-3 py-1.5 text-xs text-mute">Back</button>
        <button onClick={() => setS(s >= steps.length - 1 ? 0 : s + 1)} className="rounded-lg bg-tx px-3 py-1.5 text-xs font-medium text-bg">{s >= steps.length - 1 ? 'Restart' : 'Continue'}</button>
      </div>
    </div>
  )
}
