import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const KW = /\b(import|from|export|default|function|return|const|let|if|else|for|of|new|true|false|null|undefined|while|async|await)\b/

function highlight(line) {
  const parts = []
  const re = /(\/\/.*$)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)|(<\/?[A-Za-z][\w.]*)|(\b\d+(?:\.\d+)?\b)|(\b\w+\b)/g
  let last = 0, m
  while ((m = re.exec(line))) {
    if (m.index > last) parts.push([line.slice(last, m.index), ''])
    if (m[1]) parts.push([m[1], 'text-faint'])
    else if (m[2]) parts.push([m[2], 'text-[#d8b27a]'])
    else if (m[3]) parts.push([m[3], 'text-acc'])
    else if (m[4]) parts.push([m[4], 'text-[#9ec3e6]'])
    else parts.push([m[5], KW.test(m[5]) ? 'text-[#c79bf0]' : ''])
    last = re.lastIndex
  }
  if (last < line.length) parts.push([line.slice(last), ''])
  return parts
}

// Clipboard API first; falls back to a hidden textarea on older or non-secure contexts.
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true } catch { /* fall through */ }
  try {
    const t = document.createElement('textarea')
    t.value = text; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0'
    document.body.appendChild(t); t.select()
    const ok = document.execCommand('copy')
    t.remove()
    return ok
  } catch { return false }
}

export function CopyButton({ text, onCopy, className = '', label = 'Copy' }) {
  const [state, setState] = useState('idle')
  return (
    <button
      type="button"
      disabled={!text}
      onClick={async () => {
        const ok = await copyText(String(text ?? ''))
        setState(ok ? 'ok' : 'fail'); if (ok) onCopy?.()
        setTimeout(() => setState('idle'), 1400)
      }}
      className={`relative h-7 shrink-0 overflow-hidden rounded-md border border-line2 bg-panel px-2.5 text-xs text-mute hover:text-tx disabled:opacity-40 ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={state} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="block">
          {state === 'ok' ? 'Copied' : state === 'fail' ? 'Select & copy' : label}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

export default function CodeBlock({ code, title, onCopy, maxHeight = 520 }) {
  const lines = code.replace(/\n$/, '').split('\n')
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-[#0b0b0d]">
      <div className="flex h-10 items-center justify-between border-b border-line px-3">
        <span className="font-mono text-xs text-faint">{title}</span>
        <CopyButton text={code} onCopy={onCopy} />
      </div>
      <pre className="overflow-auto p-4 font-mono text-[12.5px] leading-6" style={{ maxHeight }}>
        {lines.map((l, i) => (
          <div key={i} className="flex">
            <span className="mr-4 w-6 shrink-0 select-none text-right text-[#3a3a42]">{i + 1}</span>
            <code className="whitespace-pre text-[#cfcfd4]">{highlight(l).map(([t, c], k) => <span key={k} className={c}>{t}</span>)}</code>
          </div>
        ))}
      </pre>
    </div>
  )
}
