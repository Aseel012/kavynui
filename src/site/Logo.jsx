import { Link } from 'react-router-dom'

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-tx">
      <span className="relative size-5 rounded-[5px] bg-tx"><span className="absolute bottom-[3px] right-[3px] size-1.5 rounded-[2px] bg-acc" /></span>
      kavyn<span className="-ml-2 text-faint">UI</span>
    </Link>
  )
}
