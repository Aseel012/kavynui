import { useEffect, useState } from 'react'
import { motion, LayoutGroup } from 'motion/react'

const COLS = ['Todo', 'Doing', 'Done']
const START = [
  { id: 'a', t: 'Invoice PDF export', c: 0 }, { id: 'b', t: 'Fix login redirect', c: 0 },
  { id: 'c', t: 'Onboarding emails', c: 1 }, { id: 'd', t: 'Billing page', c: 2 },
]

export default function KanbanFlow({ cards = START, every = 1700 }) {
  const [list, setList] = useState(cards)
  useEffect(() => {
    const t = setInterval(() => setList((l) => {
      const movable = l.filter((x) => x.c < 2)
      if (!movable.length) return cards
      const pick = movable[Math.floor(Math.random() * movable.length)]
      return l.map((x) => (x.id === pick.id ? { ...x, c: x.c + 1 } : x))
    }), every)
    return () => clearInterval(t)
  }, [cards, every])
  return (
    <LayoutGroup>
      <div className="grid w-full min-w-[480px] grid-cols-3 gap-2">
        {COLS.map((col, ci) => (
          <div key={col} className="min-h-48 rounded-xl border border-line bg-panel p-2">
            <div className="mb-2 flex justify-between px-1 text-[11px] text-faint"><span>{col}</span><span>{list.filter((x) => x.c === ci).length}</span></div>
            <div className="space-y-1.5">
              {list.filter((x) => x.c === ci).map((x) => (
                <motion.div layout layoutId={x.id} key={x.id} transition={{ type: 'spring', stiffness: 260, damping: 26 }} className="rounded-lg border border-line2 bg-panel2 p-2 text-xs text-tx">
                  <span className={`mr-1.5 inline-block size-1.5 rounded-full ${ci === 2 ? 'bg-emerald-400' : ci === 1 ? 'bg-acc' : 'bg-faint'}`} />{x.t}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </LayoutGroup>
  )
}
