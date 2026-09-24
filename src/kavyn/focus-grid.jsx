import { useState } from 'react'
import { motion } from 'motion/react'

const CELLS = [
  { t: 'Instant sync', d: 'Changes land everywhere in under a second.' }, { t: 'Audit log', d: 'Every edit, who and when.' },
  { t: 'SSO', d: 'Google, Okta and SAML.' }, { t: 'Offline', d: 'Keep working on a plane.' },
  { t: 'API', d: 'Everything in the UI, over REST.' }, { t: 'Exports', d: 'CSV, PDF and JSON, any time.' },
]

export default function FocusGrid({ cells = CELLS }) {
  const [h, setH] = useState(null)
  return (
    <div className="grid w-full max-w-md grid-cols-2 gap-2 sm:grid-cols-3" onPointerLeave={() => setH(null)}>
      {cells.map((c, i) => (
        <motion.div
          key={c.t}
          onPointerEnter={() => setH(i)}
          animate={{ filter: h == null || h === i ? 'blur(0px)' : 'blur(2.5px)', opacity: h == null || h === i ? 1 : 0.45, scale: h === i ? 1.04 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          className={`rounded-xl border p-4 ${h === i ? 'border-line2 bg-panel2' : 'border-line bg-panel'}`}
        >
          <div className="text-sm text-tx">{c.t}</div>
          <div className="mt-1 text-xs leading-relaxed text-mute">{c.d}</div>
        </motion.div>
      ))}
    </div>
  )
}
