import { useState } from 'react'
import { motion } from 'motion/react'

const NODES = [
  { n: 'Slack', x: 60, y: 60 }, { n: 'Stripe', x: 250, y: 40 }, { n: 'Linear', x: 330, y: 150 },
  { n: 'Notion', x: 270, y: 250 }, { n: 'GitHub', x: 70, y: 240 }, { n: 'Figma', x: 30, y: 150 },
]
const C = { x: 180, y: 150 }

export default function LogoConstellation({ nodes = NODES, hub = 'K' }) {
  const [h, setH] = useState(null)
  return (
    <svg viewBox="0 0 360 300" className="w-full max-w-md">
      {nodes.map((n, i) => (
        <g key={n.n}>
          <line x1={C.x} y1={C.y} x2={n.x} y2={n.y} stroke={h === i ? '#ff6a2b' : '#2a2a30'} strokeWidth="1" />
          <motion.line x1={C.x} y1={C.y} x2={n.x} y2={n.y} stroke="#ff6a2b" strokeWidth="2" strokeLinecap="round" pathLength="1" strokeDasharray="0.08 0.92"
            animate={{ strokeDashoffset: [1, 0] }} transition={{ repeat: Infinity, duration: 2.2, delay: i * 0.37, ease: 'easeInOut' }} />
        </g>
      ))}
      {nodes.map((n, i) => (
        <motion.g key={n.n} onPointerEnter={() => setH(i)} onPointerLeave={() => setH(null)} animate={{ scale: h === i ? 1.15 : 1 }} style={{ transformOrigin: `${n.x}px ${n.y}px` }} className="cursor-pointer">
          <rect x={n.x - 22} y={n.y - 22} width="44" height="44" rx="12" fill="#141417" stroke={h === i ? '#ff6a2b' : '#2a2a30'} />
          <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize="15" fontWeight="600" fill="#ededef">{n.n[0]}</text>
          <text x={n.x} y={n.y + 38} textAnchor="middle" fontSize="10" fill="#8a8a93" opacity={h === i ? 1 : 0.6}>{n.n}</text>
        </motion.g>
      ))}
      <rect x={C.x - 28} y={C.y - 28} width="56" height="56" rx="16" fill="#ededef" />
      <rect x={C.x + 8} y={C.y + 8} width="12" height="12" rx="4" fill="#ff6a2b" />
      <text x={C.x - 4} y={C.y + 6} textAnchor="middle" fontSize="18" fontWeight="700" fill="#09090a">{hub}</text>
    </svg>
  )
}
