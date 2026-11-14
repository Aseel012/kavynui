'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

// Shared runner for the shader backgrounds.
//
// It draws one full-screen triangle with your fragment shader and takes care of the parts
// that make a shader safe to ship behind real content:
//   - theme: reads --bg and --tx from your CSS, so every background is ink-on-paper in light
//     mode and light-on-black in dark mode, and redraws when the theme class flips
//   - quality: renders at device resolution (capped at 2x) and steps down if frames run slow
//   - banding: every shader ends in a tiny dither, so dark gradients stay smooth on 8-bit screens
//   - manners: pauses off screen and in hidden tabs, draws one still frame for reduced motion,
//     and leaves the CSS fallback visible when WebGL is missing, lost or software-only

export type RGB = [number, number, number]

export interface ShaderBackgroundProps {
  /** Ink colour as a hex string. Defaults to your theme's text colour (--tx). */
  color?: string
  /** Second ink colour, blended in where the shader has depth. Defaults to `color`. */
  color2?: string
  /** Time multiplier. 0 freezes the frame. */
  speed?: number
  /** How strongly the pattern shows, 0 to 2. */
  intensity?: number
  /** Zoom of the pattern. Above 1 is finer, below 1 is larger. */
  scale?: number
  /** React to the pointer. */
  interactive?: boolean
  /** Also run on software-only WebGL (no GPU). Off by default: it would slow a slow device. */
  allowSoftware?: boolean
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

interface FrameProps extends ShaderBackgroundProps {
  frag: string
  /** Extra float uniforms for this shader. */
  uniforms?: Record<string, number>
}

const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'

// Uniforms and helpers every shader gets.
//   uRes    canvas size in pixels          uTime   seconds, already scaled by `speed`
//   uMouse  xy = pointer (0..1, smoothed), z = 1 while pressed, w = 0..1 hover presence
//   uBg     page background                uA, uB  ink colours
//   uAmp    intensity                      uScale  pattern zoom
//   uPx     canvas pixels per CSS pixel, for line widths and dot sizes that stay the same on any screen
const HEAD = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;uniform float uTime;uniform vec4 uMouse;
uniform vec3 uBg;uniform vec3 uA;uniform vec3 uB;uniform float uAmp;uniform float uScale;uniform float uPx;
float hash(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
vec2 hash2(vec2 p){vec3 q=fract(vec3(p.xyx)*vec3(.1031,.1030,.0973));q+=dot(q,q.yzx+33.33);return fract((q.xx+q.yz)*q.zy);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);vec2 u=f*f*f*(f*(f*6.-15.)+10.);
  float a=dot(hash2(i)*2.-1.,f),b=dot(hash2(i+vec2(1.,0.))*2.-1.,f-vec2(1.,0.));
  float c=dot(hash2(i+vec2(0.,1.))*2.-1.,f-vec2(0.,1.)),d=dot(hash2(i+vec2(1.,1.))*2.-1.,f-vec2(1.,1.));
  return clamp(mix(mix(a,b,u.x),mix(c,d,u.x),u.y)*.75+.5,0.,1.);
}
float fbm(vec2 p){float v=0.,a=.5;mat2 r=mat2(.8,-.6,.6,.8);for(int i=0;i<5;i++){v+=a*noise(p);p=r*p*2.03+11.7;a*=.5;}return v;}
vec2 centered(){return (gl_FragCoord.xy-.5*uRes)/uRes.y;}
vec2 pointer(){return (uMouse.xy-.5)*vec2(uRes.x/uRes.y,1.);}
// v = how much ink (0..1), k = blend from the first ink colour to the second.
void paint(float v,float k){
  vec3 c=mix(uBg,mix(uA,uB,clamp(k,0.,1.)),clamp(v*uAmp,0.,1.));
  c+=(hash(gl_FragCoord.xy+fract(uTime)*61.)-.5)/160.;
  gl_FragColor=vec4(c,1.);
}
`

export function hexToRgb(hex: string | undefined, fallback: RGB): RGB {
  const s = typeof hex === 'string' ? hex.trim().replace(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i, '#$1$1$2$2$3$3') : ''
  const m = s.match(/^#?([0-9a-f]{6})$/i)
  if (!m) return fallback
  const n = parseInt(m[1], 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

const readToken = (el: Element, name: string, fallback: RGB): RGB => hexToRgb(getComputedStyle(el).getPropertyValue(name), fallback)

const num = (v: unknown, fallback: number) => (typeof v === 'number' && Number.isFinite(v) ? v : fallback)

/** Wraps your content in a box with a live shader behind it. Each background file is this plus one fragment shader. */
export default function ShaderBackground({ frag, uniforms, color, color2, speed = 1, intensity = 1, scale = 1, interactive = true, allowSoftware = false, className = '', style, children }: FrameProps) {
  const host = useRef<HTMLDivElement>(null)
  // Props are read every frame from this ref, so changing them never rebuilds the GL program.
  const live = useRef({ uniforms, color, color2, speed, intensity, scale, interactive })
  live.current = { uniforms, color, color2, speed, intensity, scale, interactive }

  useEffect(() => {
    const el = host.current
    if (!el || typeof window === 'undefined') return
    const canvas = document.createElement('canvas')
    canvas.setAttribute('aria-hidden', 'true')
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0;transition:opacity .7s ease'
    let gl: WebGLRenderingContext | null = null
    try { gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'low-power', failIfMajorPerformanceCaveat: !allowSoftware }) } catch { gl = null }
    if (!gl) return
    const g = gl
    const compile = (type: number, src: string) => {
      const s = g.createShader(type)
      if (!s) return null
      g.shaderSource(s, src); g.compileShader(s)
      if (!g.getShaderParameter(s, g.COMPILE_STATUS)) { g.deleteShader(s); return null }
      return s
    }
    const vs = compile(g.VERTEX_SHADER, VERT), fs = compile(g.FRAGMENT_SHADER, HEAD + frag)
    const prog = vs && fs ? g.createProgram() : null
    if (!prog || !vs || !fs) return
    g.attachShader(prog, vs); g.attachShader(prog, fs); g.linkProgram(prog)
    if (!g.getProgramParameter(prog, g.LINK_STATUS)) return
    g.useProgram(prog)
    const buf = g.createBuffer()
    g.bindBuffer(g.ARRAY_BUFFER, buf)
    g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), g.STATIC_DRAW)
    const at = g.getAttribLocation(prog, 'p')
    g.enableVertexAttribArray(at); g.vertexAttribPointer(at, 2, g.FLOAT, false, 0, 0)
    const locs: Record<string, WebGLUniformLocation | null> = {}
    const U = (name: string) => (name in locs ? locs[name] : (locs[name] = g.getUniformLocation(prog, name)))
    el.prepend(canvas)

    // Theme: ink and paper come from the page's own tokens, and follow a theme switch.
    let bg: RGB = [0, 0, 0], fg: RGB = [0.96, 0.96, 0.97]
    const readTheme = () => { bg = readToken(el, '--bg', [0, 0, 0]); fg = readToken(el, '--tx', bg[0] + bg[1] + bg[2] > 1.5 ? [0.11, 0.11, 0.12] : [0.96, 0.96, 0.97]) }
    readTheme()

    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, down: 0, in: 0, tin: 0 }
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      if (!r.width || !r.height) return
      mouse.tx = (e.clientX - r.left) / r.width; mouse.ty = 1 - (e.clientY - r.top) / r.height; mouse.tin = 1
    }
    const onLeave = () => { mouse.tin = 0 }
    const onDown = () => { mouse.down = 1 }
    const onUp = () => { mouse.down = 0 }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)

    const reduce = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    let raf = 0, visible = true, lost = false, shown = false, time = 0, prev = performance.now()
    // Adaptive quality: start at device resolution, step down while frames keep running slow.
    let q = 1, slow = 0, frames = 0
    const draw = (now: number) => {
      if (lost || g.isContextLost()) return
      const p = live.current
      const dpr = Math.min(2, window.devicePixelRatio || 1) * q
      const w = Math.max(1, Math.round(el.clientWidth * dpr)), h = Math.max(1, Math.round(el.clientHeight * dpr))
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h }
      g.viewport(0, 0, w, h)
      const dt = Math.max(0, (now - prev) / 1000)
      time += Math.min(0.1, dt) * num(p.speed, 1)
      prev = now
      if (shown && dt < 0.5) { frames++; if (dt > 1 / 45) slow++; if (frames >= 40) { if (slow > 16 && q > 0.4) q *= 0.8; frames = 0; slow = 0 } }
      const on = p.interactive !== false
      mouse.x += ((on ? mouse.tx : 0.5) - mouse.x) * 0.07; mouse.y += ((on ? mouse.ty : 0.5) - mouse.y) * 0.07
      mouse.in += ((on ? mouse.tin : 0) - mouse.in) * 0.06
      const a = hexToRgb(p.color, fg), b = hexToRgb(p.color2, a)
      g.uniform2f(U('uRes'), w, h); g.uniform1f(U('uPx'), dpr)
      g.uniform1f(U('uTime'), reduce ? 14 : time + 14)
      g.uniform4f(U('uMouse'), mouse.x, mouse.y, on ? mouse.down : 0, mouse.in)
      g.uniform3f(U('uBg'), bg[0], bg[1], bg[2]); g.uniform3f(U('uA'), a[0], a[1], a[2]); g.uniform3f(U('uB'), b[0], b[1], b[2])
      g.uniform1f(U('uAmp'), Math.min(2, Math.max(0, num(p.intensity, 1)))); g.uniform1f(U('uScale'), Math.max(0.05, num(p.scale, 1)))
      for (const [name, v] of Object.entries(p.uniforms || {})) { const l = U(name); if (l) g.uniform1f(l, num(v, 0)) }
      g.drawArrays(g.TRIANGLES, 0, 3)
      if (!shown) { shown = true; canvas.style.opacity = '1' }
    }
    const loop = (now: number) => {
      raf = 0
      draw(now)
      if (!reduce && visible && !document.hidden) raf = requestAnimationFrame(loop)
    }
    const start = () => { if (!raf && !lost) { prev = performance.now(); raf = requestAnimationFrame(loop) } }
    const io = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(([e]) => { visible = !!e?.isIntersecting; if (visible) start() }) : null
    io?.observe(el)
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => start()) : null
    ro?.observe(el)
    const mo = typeof MutationObserver !== 'undefined' ? new MutationObserver(() => { readTheme(); start() }) : null
    mo?.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] })
    const onVis = () => { if (!document.hidden) start() }
    document.addEventListener('visibilitychange', onVis)
    const onLost = (e: Event) => { e.preventDefault(); lost = true; cancelAnimationFrame(raf); canvas.style.opacity = '0' }
    canvas.addEventListener('webglcontextlost', onLost)
    start()

    return () => {
      cancelAnimationFrame(raf)
      io?.disconnect(); ro?.disconnect(); mo?.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('webglcontextlost', onLost)
      try {
        g.deleteBuffer(buf); g.deleteProgram(prog); g.deleteShader(vs); g.deleteShader(fs)
        g.getExtension('WEBGL_lose_context')?.loseContext()
      } catch { /* already gone */ }
      canvas.remove()
    }
  }, [frag, allowSoftware])

  // The CSS layer under the canvas: what visitors see before the GPU frame fades in, and all they see without WebGL.
  const ink = color || 'var(--tx)'
  const fallback = `radial-gradient(120% 90% at 50% 110%, color-mix(in srgb, ${ink} 16%, transparent), transparent 70%)`
  return (
    <div ref={host} className={`relative isolate h-full min-h-72 w-full overflow-hidden bg-bg ${className}`} style={{ backgroundImage: fallback, ...style }}>
      <div className="relative z-10 grid h-full min-h-72 place-items-center p-6">{children}</div>
    </div>
  )
}
