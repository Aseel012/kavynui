import { useShader, hexToRgb } from './gl-canvas'

const FRAG = `
uniform vec3 uA;uniform float uCell;
void main(){
  vec2 px=gl_FragCoord.xy;float cell=max(4.,uCell*uRes.y/420.);
  vec2 id=floor(px/cell),f=fract(px/cell)-.5;
  vec2 uv=id*cell/uRes;float asp=uRes.x/uRes.y;
  vec2 p=uv*vec2(asp,1.),m=uMouse.xy*vec2(asp,1.);
  float t=uTime;
  float w=.5+.5*sin(p.x*7.+t*1.2)*cos(p.y*5.-t*.9);
  float dm=length(p-m);
  float ripple=.5+.5*sin(dm*28.-t*5.);
  float h=mix(w,ripple,exp(-dm*4.));
  float r=mix(.06,.34,h);
  float dot=smoothstep(r,r-.08,length(f));
  vec3 col=vec3(.035,.035,.04)+mix(vec3(.18,.18,.2),uA,smoothstep(.55,1.,h))*dot*(.35+.65*h);
  col*=smoothstep(1.2,.3,length(uv-.5)*1.4);
  gl_FragColor=vec4(col,1.);
}`

// A dot grid carrying slow waves. Dots near the pointer ripple outward.
export default function ShaderLattice({ color = '#ff6a2b', cell = 18, speed = 1, className = '', children }) {
  const host = useShader(FRAG, { uniforms: { uA: hexToRgb(color), uCell: Math.max(8, Number(cell) || 18) }, speed })
  return (
    <div ref={host} className={`relative h-full min-h-72 w-full overflow-hidden bg-[#09090a] ${className}`}
      style={{ backgroundImage: 'radial-gradient(circle, #2a2a30 1.5px, transparent 1.6px)', backgroundSize: `${cell}px ${cell}px` }}>
      <div className="pointer-events-none relative z-10 grid h-full min-h-72 place-items-center p-6">{children}</div>
    </div>
  )
}
