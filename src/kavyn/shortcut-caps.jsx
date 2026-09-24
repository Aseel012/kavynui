import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

const SEQ = [{ keys: ['⌘', 'K'], label: 'Open command menu' }, { keys: ['⌘', '⇧', 'P'], label: 'Publish page' }, { keys: ['G', 'I'], label: 'Go to inbox' }]

function Cap({ k, down }) {
  return (
    <motion.kbd
      animate={{ y: down ? 4 : 0, boxShadow: down ? '0 0px 0 #1e1e22, 0 0 0 1px #ff6a2b55' : '0 4px 0 #1e1e22, 0 0 0 0px #ff6a2b00' }}
      transition={{ type: 'spring', stiffness: 700, damping: 24 }}
      className="grid h-14 min-w-14 place-items-center rounded-xl border border-line2 bg-panel2 px-3 font-sans text-xl text-tx"
    >
      {k}
    </motion.kbd>
  )
}

export default function ShortcutCaps({ shortcuts = SEQ }) {
  const [s, setS] = useState(0)
  const [n, setN] = useState(0)
  useEffect(() => {
    const cur = shortcuts[s].keys.length
    const t = setTimeout(() => {
      if (n < cur) setN(n + 1)
      else { setN(0); setS((s + 1) % shortcuts.length) }
    }, n < cur ? 260 : 1300)
    return () => clearTimeout(t)
  }, [n, s, shortcuts])
  const cur = shortcuts[s]
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">{cur.keys.map((k, i) => <Cap key={s + k + i} k={k} down={i < n} />)}</div>
      <motion.div key={s} initial={{ opacity: 0, y: 4 }} animate={{ opacity: n >= cur.keys.length ? 1 : 0.35, y: 0 }} className="text-sm text-mute">{cur.label}</motion.div>
    </div>
  )
}
