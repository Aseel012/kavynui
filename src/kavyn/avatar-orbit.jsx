import { motion } from 'motion/react'

const PEOPLE = ['AK', 'MS', 'RJ', 'PN', 'DV', 'SL', 'TK', 'IB']
const HUES = ['#ff6a2b', '#ededef', '#8a8a93', '#d8b27a', '#6b8f5e', '#3f7cac', '#7d4e8a', '#5c5c66']

function Ring({ people, r, dur, dir, off }) {
  return (
    <motion.div className="absolute left-1/2 top-1/2" animate={{ rotate: dir * 360 }} transition={{ repeat: Infinity, ease: 'linear', duration: dur }}>
      <div className="absolute rounded-full border border-dashed border-line2" style={{ width: r * 2, height: r * 2, left: -r, top: -r }} />
      {people.map((p, i) => {
        const a = (i / people.length) * Math.PI * 2
        return (
          <motion.div key={p} className="absolute grid size-9 place-items-center rounded-full border-2 border-bg text-[11px] font-semibold text-bg"
            style={{ left: Math.cos(a) * r - 18, top: Math.sin(a) * r - 18, background: HUES[(i + off) % HUES.length] }}
            animate={{ rotate: -dir * 360 }} transition={{ repeat: Infinity, ease: 'linear', duration: dur }} whileHover={{ scale: 1.2 }}>
            {p}
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export default function AvatarOrbit({ people = PEOPLE, count = '2,400' }) {
  return (
    <div className="relative size-72">
      <Ring people={people.slice(0, 3)} r={62} dur={18} dir={1} off={0} />
      <Ring people={people.slice(3)} r={122} dur={32} dir={-1} off={3} />
      <div className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border border-line2 bg-panel2 text-center">
        <div><div className="text-sm font-semibold text-tx">{count}</div><div className="text-[9px] text-faint">members</div></div>
      </div>
    </div>
  )
}
