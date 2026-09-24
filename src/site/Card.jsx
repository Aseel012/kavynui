import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { LazyDemo } from './Preview'
import { familyById } from '@/lib/catalog'

export default function Card({ item, page = 'components' }) {
  return (
    <motion.article layout="position" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="group overflow-hidden rounded-2xl border border-line bg-panel transition-colors hover:border-line2">
      <div className="relative h-60 border-b border-line bg-bg sm:h-64">
        <LazyDemo item={item} page={page} mode="thumb" />
      </div>
      <Link to={`/components/${item.slug}`} className="flex items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-[15px] font-medium text-tx">{item.name}</h3>
            {item.tags.includes('new') && <span className="rounded-full bg-acc/15 px-1.5 py-px text-[10px] font-medium text-acc">New</span>}
          </div>
          <p className="mt-1 line-clamp-1 text-sm text-mute">{item.description}</p>
        </div>
        <span className="mt-0.5 shrink-0 text-xs text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-tx">{familyById[item.family]?.name} →</span>
      </Link>
    </motion.article>
  )
}
