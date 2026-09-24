import { Link } from 'react-router-dom'
import { useSEO } from '@/lib/seo'
import DialText from '@/kavyn/dial-text'

export default function NotFound() {
  useSEO({ title: 'Page not found - kavynUI', noindex: true })
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-28 text-center">
      <DialText words={['NOT HERE', '404']} />
      <h1 className="mt-8 text-xl text-tx">This page does not exist</h1>
      <div className="mt-5 flex gap-4 text-sm"><Link to="/" className="text-mute hover:text-tx">Home</Link><Link to="/components" className="text-acc">Open the library →</Link></div>
    </div>
  )
}
