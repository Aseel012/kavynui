import { useEffect, useRef } from 'react'

// Shared WebGL runner for the shader backgrounds.
// Draws one full-screen triangle with your fragment shader. It creates its own canvas,
// pauses when off screen or in a hidden tab, renders one still frame for reduced motion,
// and quietly gives up (leaving your CSS fallback visible) when WebGL is missing or lost.
// By default it also refuses software-only WebGL (no GPU), because that would make a slow
// device slower; those visitors see the CSS fallback. Pass allowSoftware: true to override.

const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'
const HEAD = 'precision mediump float;uniform vec2 uRes;uniform float uTime;uniform vec3 uMouse;\n'

// Value noise + fbm, shared by several shaders.
export const NOISE = `
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.02+vec2(1.7,9.2);a*=.5;}return v;}
`

export function hexToRgb(hex, fallback = [1, 0.42, 0.17]) {
  const m = typeof hex === 'string' ? hex.trim().match(/^#?([0-9a-f]{6})$/i) : null
  if (!m) return fallback
  const n = parseInt(m[1], 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

export function useShader(frag, { uniforms = {}, speed = 1, allowSoftware = false, resolution = 0.6 } = {}) {
  const host = useRef(null)
  const live = useRef({ uniforms, speed })
  live.current = { uniforms, speed }

  useEffect(() => {
    const el = host.current
    if (!el || typeof window === 'undefined') return
    const canvas = document.createElement('canvas')
    canvas.setAttribute('aria-hidden', 'true')
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0;transition:opacity .6s'
    let gl = null
    try { gl = canvas.getContext('webgl', { antialias: false, alpha: true, depth: false, stencil: false, powerPreference: 'low-power', failIfMajorPerformanceCaveat: !allowSoftware }) } catch { gl = null }
    if (!gl) return
    const compile = (type, src) => {
      const s = gl.createShader(type)
      if (!s) return null
      gl.shaderSource(s, src); gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null }
      return s
    }
    const vs = compile(gl.VERTEX_SHADER, VERT), fs = compile(gl.FRAGMENT_SHADER, HEAD + frag)
    const prog = vs && fs ? gl.createProgram() : null
    if (!prog) return
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const uRes = gl.getUniformLocation(prog, 'uRes'), uTime = gl.getUniformLocation(prog, 'uTime'), uMouse = gl.getUniformLocation(prog, 'uMouse')
    const locs = {}
    const setUniforms = () => {
      for (const [name, v] of Object.entries(live.current.uniforms || {})) {
        if (!(name in locs)) locs[name] = gl.getUniformLocation(prog, name)
        const l = locs[name]
        if (!l) continue
        if (typeof v === 'number' && Number.isFinite(v)) gl.uniform1f(l, v)
        else if (Array.isArray(v) && v.length === 3) gl.uniform3f(l, v[0], v[1], v[2])
        else if (Array.isArray(v) && v.length === 2) gl.uniform2f(l, v[0], v[1])
      }
    }
    el.appendChild(canvas)

    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, down: 0 }
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      if (!r.width || !r.height) return
      mouse.tx = (e.clientX - r.left) / r.width
      mouse.ty = 1 - (e.clientY - r.top) / r.height
    }
    const onDown = () => { mouse.down = 1 }
    const onUp = () => { mouse.down = 0 }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)

    const reduce = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    let raf = 0, visible = true, lost = false, shown = false, time = 0, prev = performance.now()
    // Adaptive quality: render below CSS resolution and step down further if frames run slow.
    let scale = Math.min(1, Math.max(0.25, Number(resolution) || 0.6)), slow = 0, frames = 0
    const draw = (now) => {
      if (lost || gl.isContextLost()) return
      const dpr = Math.min(1.5, window.devicePixelRatio || 1) * scale
      const w = Math.max(1, Math.round(el.clientWidth * dpr)), h = Math.max(1, Math.round(el.clientHeight * dpr))
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h }
      gl.viewport(0, 0, w, h)
      const dt = Math.max(0, (now - prev) / 1000)
      time += Math.min(0.1, dt) * (Number(live.current.speed) || 1)
      prev = now
      if (shown && dt < 0.5) { frames++; if (dt > 1 / 40) slow++; if (frames >= 30) { if (slow > 12 && scale > 0.35) scale *= 0.75; frames = 0; slow = 0 } }
      mouse.x += (mouse.tx - mouse.x) * 0.08; mouse.y += (mouse.ty - mouse.y) * 0.08
      gl.uniform2f(uRes, w, h); gl.uniform1f(uTime, reduce ? 12 : time); gl.uniform3f(uMouse, mouse.x, mouse.y, mouse.down)
      setUniforms()
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      if (!shown) { shown = true; canvas.style.opacity = '1' }
    }
    const loop = (now) => {
      raf = 0
      draw(now)
      if (!reduce && visible && !document.hidden) raf = requestAnimationFrame(loop)
    }
    const start = () => { if (!raf && !lost) { prev = performance.now(); raf = requestAnimationFrame(loop) } }
    const io = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(([e]) => { visible = !!e?.isIntersecting; if (visible) start() }) : null
    io?.observe(el)
    const onVis = () => { if (!document.hidden) start() }
    document.addEventListener('visibilitychange', onVis)
    const onLost = (e) => { e.preventDefault(); lost = true; cancelAnimationFrame(raf); canvas.style.opacity = '0' }
    canvas.addEventListener('webglcontextlost', onLost)
    start()

    return () => {
      cancelAnimationFrame(raf)
      io?.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('webglcontextlost', onLost)
      try {
        gl.deleteBuffer(buf); gl.deleteProgram(prog); gl.deleteShader(vs); gl.deleteShader(fs)
        gl.getExtension('WEBGL_lose_context')?.loseContext()
      } catch { /* already gone */ }
      canvas.remove()
    }
  }, [frag, allowSoftware, resolution])

  return host
}
