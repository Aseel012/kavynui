import { Link } from 'react-router-dom'
import { useSEO } from '@/lib/seo'

export default function NotFound() {
  useSEO({ title: 'Page not found - kavynUI', noindex: true })
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-32 text-center">
      <div className="text-[96px] font-semibold leading-none tracking-[-0.06em] text-line2" aria-hidden>404</div>
      <h1 className="mt-6 text-[22px] font-semibold tracking-tight text-tx">This page does not exist</h1>
      <p className="mt-2 text-[15px] text-mute">The link may be old, or the component was retired.</p>
      <div className="mt-7 flex gap-2">
        <Link to="/components" className="flex h-10 items-center rounded-full bg-tx px-5 text-[15px] font-medium text-bg">Browse components</Link>
        <Link to="/" className="flex h-10 items-center rounded-full border border-line2 px-5 text-[15px] text-tx">Home</Link>
      </div>
    </div>
  )
}
