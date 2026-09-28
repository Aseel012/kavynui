import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'

// Realistic compact Apple-style keyboard, drawn from scratch.
// Data-driven: ROWS describes every key; the renderer maps physical
// key events (or a demo phrase) onto the layout with a backlit press
// and a quiet synthesized tick. Fully fluid sizing (container-query
// units): it fills any width with no transforms of its own.

const pressSpring = { type: 'spring', stiffness: 900, damping: 40 }

// ---------------------------------------------------------------------------
// Synthesized Mac-like key tick. WebAudio only, no assets.
// Unlocks on the first user gesture; stays silent until then.
function createTickEngine() {
  let ctx = null
  let master = null
  let noiseBuf = null
  const ensure = () => {
    if (typeof window === 'undefined') return null
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    if (!ctx) {
      try {
        ctx = new AC()
        master = ctx.createGain()
        master.gain.value = 0.5
        master.connect(ctx.destination)
        const len = Math.floor(ctx.sampleRate * 0.05)
        noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate)
        const data = noiseBuf.getChannelData(0)
        for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
      } catch {
        ctx = null
        return null
      }
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {})
    return ctx
  }
  return {
    unlock() { ensure() },
    tick() {
      const c = ensure()
      if (!c || c.state !== 'running') return
      const t = c.currentTime
      const jitter = 0.9 + Math.random() * 0.2
      // click transient: short filtered noise burst
      const src = c.createBufferSource()
      src.buffer = noiseBuf
      const bp = c.createBiquadFilter()
      bp.type = 'bandpass'
      bp.frequency.value = 2100 * jitter
      bp.Q.value = 0.9
      const g = c.createGain()
      g.gain.setValueAtTime(0.22, t)
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.045)
      src.connect(bp).connect(g).connect(master)
      src.start(t)
      src.stop(t + 0.05)
      // body: low thock underneath
      const osc = c.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(340 * jitter, t)
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.03)
      const og = c.createGain()
      og.gain.setValueAtTime(0.1, t)
      og.gain.exponentialRampToValueAtTime(0.001, t + 0.035)
      osc.connect(og).connect(master)
      osc.start(t)
      osc.stop(t + 0.04)
    },
  }
}

const Svg = ({ children }) => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
)

const ICONS = {
  brightDown: <Svg><circle cx="12" cy="12" r="3" /><path d="M12 4v1.5M12 18.5V20M4 12h1.5M18.5 12H20M6.3 6.3l1 1M16.7 16.7l1 1M17.7 6.3l-1 1M7.3 16.7l-1 1" /></Svg>,
  brightUp: <Svg><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19" /></Svg>,
  mission: <Svg><rect x="3.5" y="5" width="7" height="6" rx="1" /><rect x="13.5" y="5" width="7" height="6" rx="1" /><rect x="3.5" y="14" width="7" height="6" rx="1" /><rect x="13.5" y="14" width="7" height="6" rx="1" /></Svg>,
  search: <Svg><circle cx="10.5" cy="10.5" r="5.5" /><path d="m15 15 4.5 4.5" /></Svg>,
  mic: <Svg><rect x="9" y="3.5" width="6" height="10" rx="3" /><path d="M6.5 11.5a5.5 5.5 0 0 0 11 0M12 17v3.5" /></Svg>,
  moon: <Svg><path d="M19 13.5A7.5 7.5 0 1 1 10.5 5a6 6 0 0 0 8.5 8.5Z" /></Svg>,
  prev: <Svg><path d="M6 5.5v13M18 6l-7.5 6 7.5 6V6Z" /></Svg>,
  playPause: <Svg><path d="M7 5.5 13 12l-6 6.5v-13Z" /><path d="M16.5 5.5v13M20 5.5v13" /></Svg>,
  next: <Svg><path d="M18 5.5v13M6 6l7.5 6L6 18V6Z" /></Svg>,
  mute: <Svg><path d="M4 9.5v5h3.5L13 19V5L7.5 9.5H4Z" /></Svg>,
  volDown: <Svg><path d="M4 9.5v5h3.5L13 19V5L7.5 9.5H4Z" /><path d="M16.5 9.5a4 4 0 0 1 0 5" /></Svg>,
  volUp: <Svg><path d="M4 9.5v5h3.5L13 19V5L7.5 9.5H4Z" /><path d="M16 9a4.5 4.5 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" /></Svg>,
  globe: <Svg><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.6 2.3 3.9 5.2 3.9 8.5s-1.3 6.2-3.9 8.5c-2.6-2.3-3.9-5.2-3.9-8.5S9.4 5.8 12 3.5Z" /></Svg>,
  control: <Svg><path d="m6 14 6-6 6 6" /></Svg>,
  option: <Svg><path d="M4 16h4l3-8h4M4 8h4" /></Svg>,
  command: <Svg><path d="M9 9H7a2.5 2.5 0 1 1 2.5-2.5V9Zm0 0v6m0-6h6m-6 6H7A2.5 2.5 0 1 0 9.5 17.5V15Zm6-6h2a2.5 2.5 0 1 0-2.5-2.5V9Zm0 6v2a2.5 2.5 0 1 0 2.5-2.5H15Zm0 0V9" /></Svg>,
}

const GRID = 'repeat(60, minmax(0, 1fr))'
// one key unit = 4 grid columns; every row spans 60 columns
function k(id, opts = {}) { return { id, span: 4, ...opts } }

const ROWS = [
  { h: 4.6, keys: [
    k('Escape', { word: 'esc', span: 7, align: 'left' }),
    k('F1', { icon: 'brightDown', sub: 'F1' }),
    k('F2', { icon: 'brightUp', sub: 'F2' }),
    k('F3', { icon: 'mission', sub: 'F3' }),
    k('F4', { icon: 'search', sub: 'F4' }),
    k('F5', { icon: 'mic', sub: 'F5' }),
    k('F6', { icon: 'moon', sub: 'F6' }),
    k('F7', { icon: 'prev', sub: 'F7' }),
    k('F8', { icon: 'playPause', sub: 'F8' }),
    k('F9', { icon: 'next', sub: 'F9' }),
    k('F10', { icon: 'mute', sub: 'F10' }),
    k('F11', { icon: 'volDown', sub: 'F11' }),
    k('F12', { icon: 'volUp', sub: 'F12' }),
    k('Power', { power: true, span: 5 }),
  ]},
  { h: 6.2, keys: [
    k('Backquote', { main: '`', sub: '~' }),
    k('Digit1', { main: '1', sub: '!' }), k('Digit2', { main: '2', sub: '@' }),
    k('Digit3', { main: '3', sub: '#' }), k('Digit4', { main: '4', sub: '$' }),
    k('Digit5', { main: '5', sub: '%' }), k('Digit6', { main: '6', sub: '^' }),
    k('Digit7', { main: '7', sub: '&' }), k('Digit8', { main: '8', sub: '*' }),
    k('Digit9', { main: '9', sub: '(' }), k('Digit0', { main: '0', sub: ')' }),
    k('Minus', { main: '-', sub: '_' }), k('Equal', { main: '=', sub: '+' }),
    k('Backspace', { word: 'delete', span: 8, align: 'right' }),
  ]},
  { h: 6.2, keys: [
    k('Tab', { word: 'tab', span: 6, align: 'left' }),
    k('KeyQ', { main: 'Q' }), k('KeyW', { main: 'W' }), k('KeyE', { main: 'E' }),
    k('KeyR', { main: 'R' }), k('KeyT', { main: 'T' }), k('KeyY', { main: 'Y' }),
    k('KeyU', { main: 'U' }), k('KeyI', { main: 'I' }), k('KeyO', { main: 'O' }),
    k('KeyP', { main: 'P' }),
    k('BracketLeft', { main: '[', sub: '{' }), k('BracketRight', { main: ']', sub: '}' }),
    k('Backslash', { main: '\\', sub: '|', span: 6 }),
  ]},
  { h: 6.2, keys: [
    k('CapsLock', { word: 'caps lock', span: 7, align: 'left', led: true }),
    k('KeyA', { main: 'A' }), k('KeyS', { main: 'S' }), k('KeyD', { main: 'D' }),
    k('KeyF', { main: 'F' }), k('KeyG', { main: 'G' }), k('KeyH', { main: 'H' }),
    k('KeyJ', { main: 'J' }), k('KeyK', { main: 'K' }), k('KeyL', { main: 'L' }),
    k('Semicolon', { main: ';', sub: ':' }), k('Quote', { main: "'", sub: '"' }),
    k('Enter', { word: 'return', span: 9, align: 'right' }),
  ]},
  { h: 6.2, keys: [
    k('ShiftLeft', { word: 'shift', span: 9, align: 'left' }),
    k('KeyZ', { main: 'Z' }), k('KeyX', { main: 'X' }), k('KeyC', { main: 'C' }),
    k('KeyV', { main: 'V' }), k('KeyB', { main: 'B' }), k('KeyN', { main: 'N' }),
    k('KeyM', { main: 'M' }),
    k('Comma', { main: ',', sub: '<' }), k('Period', { main: '.', sub: '>' }),
    k('Slash', { main: '/', sub: '?' }),
    k('ShiftRight', { word: 'shift', span: 11, align: 'right' }),
  ]},
  { h: 6.2, keys: [
    k('Fn', { icon: 'globe', center: true }),
    k('ControlLeft', { mod: 'control', icon: 'control' }),
    k('AltLeft', { mod: 'option', icon: 'option' }),
    k('MetaLeft', { mod: 'command', icon: 'command', span: 5 }),
    k('Space', { blank: true, span: 22 }),
    k('MetaRight', { mod: 'command', icon: 'command', span: 5 }),
    k('AltRight', { mod: 'option', icon: 'option' }),
    k('ArrowLeft', { main: '←', arrow: true }),
    k('Arrows', { arrows: true }),
    k('ArrowRight', { main: '→', arrow: true }),
  ]},
]

const CHAR_TO_CODE = { ' ': 'Space', '.': 'Period', ',': 'Comma', '-': 'Minus', '=': 'Equal', '[': 'BracketLeft', ']': 'BracketRight', ';': 'Semicolon', "'": 'Quote', '/': 'Slash', '\\': 'Backslash', '`': 'Backquote' }
for (let i = 0; i < 26; i++) CHAR_TO_CODE[String.fromCharCode(97 + i)] = 'Key' + String.fromCharCode(65 + i)
for (let i = 0; i < 10; i++) CHAR_TO_CODE[String(i)] = 'Digit' + i

const capBase = {
  WebkitTapHighlightColor: 'transparent',
  touchAction: 'manipulation',
}

function Led({ on }) {
  return <span style={{ position: 'absolute', top: '-0.35cqw', left: 0, width: '0.65cqw', height: '0.65cqw', borderRadius: '50%', background: on ? '#4cd964' : '#b9b9bd', boxShadow: on ? '0 0 0.5cqw 0.1cqw rgba(76,217,100,0.6)' : 'none' }} />
}

function Glow() {
  return <span style={{ pointerEvents: 'none', position: 'absolute', inset: 0, borderRadius: '0.75cqw', background: 'radial-gradient(80% 120% at 50% 100%, rgba(255,244,214,0.95), rgba(255,244,214,0) 75%)', boxShadow: '0 0 2.2cqw 0.5cqw rgba(255,238,190,0.55)' }} />
}

function KeyCap({ def, pressed, backlit, onPress }) {
  const base = {
    ...capBase,
    position: 'relative',
    userSelect: 'none',
    overflow: 'hidden',
    borderRadius: '0.75cqw',
    border: '1px solid #d3d3d1',
    background: '#fdfdfa',
    color: '#4a4a4e',
    boxShadow: '0 0.2cqw 0.25cqw rgba(20,20,25,0.16), inset 0 0.12cqw 0 rgba(255,255,255,0.75)',
    gridColumn: `span ${def.span} / span ${def.span}`,
  }
  let inner = null
  if (def.power) {
    inner = <span style={{ position: 'absolute', inset: '16%', borderRadius: '50%', border: '0.3cqw solid #8f8f93' }} />
  } else if (def.arrows) {
    inner = (
      <span style={{ display: 'flex', flexDirection: 'column', gap: '0.6cqw', height: '100%' }}>
        {[['ArrowUp', '↑'], ['ArrowDown', '↓']].map(([id, ch]) => (
          <ArrowCap key={id} id={id} ch={ch} pressed={pressed} backlit={backlit} onPress={onPress} />
        ))}
      </span>
    )
  } else if (def.blank) {
    inner = null
  } else if (def.word) {
    inner = (
      <span style={{ position: 'absolute', bottom: '0.7cqw', [def.align === 'right' ? 'right' : 'left']: '0.9cqw', fontSize: '1.25cqw', fontWeight: 500 }}>
        {def.led && <Led on={pressed.caps} />}
        {def.word}
      </span>
    )
  } else if (def.mod) {
    inner = (
      <>
        <span style={{ position: 'absolute', right: '0.7cqw', top: '0.6cqw', fontSize: '1.5cqw', color: '#8a8a8e' }}>{ICONS[def.icon]}</span>
        <span style={{ position: 'absolute', bottom: '0.7cqw', left: '0.8cqw', fontSize: '1.1cqw', color: '#6d6d71' }}>{def.mod}</span>
      </>
    )
  } else if (def.icon) {
    inner = (
      <span style={{ display: 'flex', height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.25cqw' }}>
        <span style={{ fontSize: '1.7cqw', color: '#6d6d71' }}>{ICONS[def.icon]}</span>
        {def.sub && <span style={{ fontSize: '0.95cqw', fontWeight: 500, color: '#9a9a9e' }}>{def.sub}</span>}
      </span>
    )
  } else if (def.sub) {
    inner = (
      <span style={{ display: 'flex', height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '1.05cqw', lineHeight: 1, color: '#9a9a9e' }}>{def.sub}</span>
        <span style={{ marginTop: '0.25cqw', fontSize: '1.8cqw', lineHeight: 1 }}>{def.main}</span>
      </span>
    )
  } else {
    inner = <span style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', fontSize: def.arrow ? '1.9cqw' : '1.8cqw' }}>{def.main}</span>
  }
  const down = !!pressed[def.id]
  return (
    <motion.button
      type="button"
      tabIndex={-1}
      aria-label={def.word || def.mod || def.main || def.id}
      onPointerDown={(e) => { e.currentTarget.setPointerCapture?.(e.pointerId); onPress(def.id, true) }}
      onPointerUp={() => onPress(def.id, false)}
      onPointerCancel={() => onPress(def.id, false)}
      onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
      animate={{ y: down ? '0.2cqw' : 0 }}
      transition={pressSpring}
      style={def.arrows ? { ...capBase, gridColumn: base.gridColumn, position: 'relative' } : base}
    >
      {backlit && down && !def.arrows && <Glow />}
      {inner}
    </motion.button>
  )
}

function ArrowCap({ id, ch, pressed, backlit, onPress }) {
  const down = !!pressed[id]
  return (
    <motion.span
      role="button"
      tabIndex={-1}
      aria-label={id}
      onPointerDown={(e) => { e.currentTarget.setPointerCapture?.(e.pointerId); onPress(id, true) }}
      onPointerUp={() => onPress(id, false)}
      onPointerCancel={() => onPress(id, false)}
      onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
      animate={{ y: down ? '0.15cqw' : 0 }}
      transition={pressSpring}
      style={{ ...capBase, position: 'relative', display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: '0.75cqw', border: '1px solid #d3d3d1', background: '#fdfdfa', fontSize: '1.5cqw', color: '#4a4a4e', boxShadow: '0 0.2cqw 0.25cqw rgba(20,20,25,0.16), inset 0 0.12cqw 0 rgba(255,255,255,0.75)' }}
    >
      {backlit && down && <Glow />}
      {ch}
    </motion.span>
  )
}

export default function AppleKeyboard({
  interactive = true,
  demo = true,
  sound = true,
  phrase = 'hello from kavynui. it types back.',
  backlit = true,
  onKey,
  className = '',
}) {
  const [pressed, setPressed] = useState({})
  const timers = useRef([])
  const engine = useRef(null)
  const lastUserAction = useRef(0)
  if (!engine.current && typeof window !== 'undefined') engine.current = createTickEngine()

  const playTick = useCallback(() => {
    if (sound) engine.current?.tick()
  }, [sound])

  const press = useCallback((id, isDown) => {
    if (isDown) {
      lastUserAction.current = Date.now()
      engine.current?.unlock()
      playTick()
      onKey?.(id)
    }
    setPressed((p) => (isDown === !!p[id] ? p : { ...p, [id]: isDown }))
  }, [onKey, playTick])

  // physical keyboard mirroring (capture phase so nothing can swallow it)
  useEffect(() => {
    if (!interactive) return
    const down = (e) => {
      lastUserAction.current = Date.now()
      engine.current?.unlock()
      playTick()
      setPressed((p) => ({
        ...p,
        [e.code]: true,
        caps: e.getModifierState ? e.getModifierState('CapsLock') : p.caps,
      }))
      if (!e.repeat) onKey?.(e.code)
    }
    const up = (e) => setPressed((p) => ({
      ...p,
      [e.code]: false,
      caps: e.getModifierState ? e.getModifierState('CapsLock') : p.caps,
    }))
    const clear = () => setPressed({})
    window.addEventListener('keydown', down, true)
    window.addEventListener('keyup', up, true)
    window.addEventListener('blur', clear)
    return () => {
      window.removeEventListener('keydown', down, true)
      window.removeEventListener('keyup', up, true)
      window.removeEventListener('blur', clear)
    }
  }, [interactive, onKey, playTick])

  // demo typing loop; pauses for a few seconds after any real interaction
  useEffect(() => {
    if (!demo) return
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const codes = phrase.toLowerCase().split('').map((c) => CHAR_TO_CODE[c]).filter(Boolean)
    if (!codes.length) return
    let i = 0
    const tick = () => {
      if (Date.now() - lastUserAction.current < 4000) {
        timers.current.push(setTimeout(tick, 600))
        return
      }
      const code = codes[i % codes.length]
      setPressed((p) => ({ ...p, [code]: true }))
      playTick()
      timers.current.push(setTimeout(() => setPressed((p) => (p[code] ? { ...p, [code]: false } : p)), 130))
      i += 1
      timers.current.push(setTimeout(tick, 210))
    }
    timers.current.push(setTimeout(tick, 900))
    return () => { timers.current.forEach(clearTimeout); timers.current = [] }
  }, [demo, phrase, playTick])

  return (
    <div className={`w-full ${className}`} style={{ containerType: 'inline-size' }}>
      <div
        role="group"
        aria-label="Apple-style keyboard"
        style={{
          width: '100%',
          maxWidth: '46rem',
          margin: '0 auto',
          borderRadius: '2.2cqw',
          border: '1px solid #b4b5b8',
          background: 'linear-gradient(to bottom, #dedfe1, #c6c7c9)',
          padding: '1.3cqw',
          boxShadow: '0 2.2cqw 5cqw -2.2cqw rgba(0,0,0,0.45), inset 0 0.12cqw 0 rgba(255,255,255,0.6)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8cqw' }}>
          {ROWS.map((row, ri) => (
            <div key={ri} style={{ display: 'grid', gap: '0.8cqw', gridTemplateColumns: GRID, height: `${row.h}cqw` }}>
              {row.keys.map((def) => (
                <KeyCap key={def.id} def={def} pressed={pressed} backlit={backlit} onPress={press} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
