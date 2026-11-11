import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { LazyDemo } from './Preview'

// Catalog tile: a live preview with the name and use case underneath, no boxed footer.
export default function Card({ item, page = 'components' }) {
  return (
    <motion.article layout="position" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="group min-w-0">
      <div className="relative h-64 overflow-hidden rounded-[22px] border border-line bg-bg transition-colors group-hover:border-line2 sm:h-72">
        <LazyDemo item={item} page={page} mode="thumb" />
      </div>
      <Link to={`/components/${item.slug}`} className="mt-3 flex items-baseline justify-between gap-3 px-1">
        <span className="flex shrink-0 items-center gap-2">
          <h3 className="text-[15px] font-medium text-tx">{item.name}</h3>
          {item.tags.includes('new') && <span className="rounded-full bg-panel2 px-1.5 py-px text-[11px] text-mute">New</span>}
        </span>
        <span className="min-w-0 truncate text-[13px] text-faint group-hover:text-mute">{item.useCase}</span>
      </Link>
    </motion.article>
  )
}
