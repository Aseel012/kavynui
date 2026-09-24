import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

const SESSION = [
  { cmd: 'npm i motion' },
  { out: 'added 3 packages in 1.8s', d: 700 },
  { out: '✓ copied HoldToConfirm.jsx into src/components', d: 300 },
  { cmd: 'npm run dev' },
  { out: 'ready in 412 ms  →  http://localhost:5173', d: 600, acc: true },
]

export default function TerminalReplay({ session = SESSION, title = 'zsh - my-app' }) {
  const [lines, setLines] = useState([])
  const [typing, setTyping] = useState('')
  useEffect(() => {
    let alive = true
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
    ;(async () => {
      while (alive) {
        setLines([])
        for (const step of session) {
          if (!alive) return
          if (step.cmd) {
            for (let i = 1; i <= step.cmd.length && alive; i++) { setTyping(step.cmd.slice(0, i)); await sleep(38 + Math.random() * 50) }
            await sleep(250); setTyping(''); setLines((l) => [...l, step])
          } else { await sleep(step.d || 300); setLines((l) => [...l, step]) }
        }
        await sleep(2600)
      }
    })()
    return () => { alive = false }
  }, [session])
  return (
    <div className="w-full max-w-md overflow-hidden rounded-xl border border-line2 bg-[#0b0b0d] font-mono text-[12.5px]">
      <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
        {[0, 1, 2].map((i) => <span key={i} className="size-2.5 rounded-full bg-line2" />)}
        <span className="ml-2 text-[11px] text-faint">{title}</span>
      </div>
      <div className="min-h-40 space-y-1 p-4">
        {lines.map((l, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className={l.cmd ? 'text-tx' : l.acc ? 'text-acc' : 'text-mute'}>
            {l.cmd ? <><span className="text-faint">$ </span>{l.cmd}</> : l.out}
          </motion.div>
        ))}
        <div className="text-tx"><span className="text-faint">$ </span>{typing}<motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.7, repeatType: 'reverse' }} className="ml-px inline-block h-3.5 w-[7px] translate-y-0.5 bg-tx" /></div>
      </div>
    </div>
  )
}
