import { useShader, hexToRgb, NOISE } from './gl-canvas'

const FRAG = NOISE + `
uniform vec3 uA;uniform vec3 uB;
void main(){
  vec2 p=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  vec2 m=(uMouse.xy-.5)*vec2(uRes.x/uRes.y,1.);
  p+=(p-m)*.25*exp(-3.*length(p-m));
  float t=uTime*.12;
  vec2 q=vec2(fbm(p*1.4+t),fbm(p*1.4+vec2(5.2,1.3)-t));
  vec2 r=vec2(fbm(p*1.4+3.5*q+vec2(1.7,9.2)+t*.6),fbm(p*1.4+3.5*q+vec2(8.3,2.8)-t*.4));
  float f=fbm(p*1.4+3.5*r);
  vec3 col=vec3(.03,.03,.04);
  col=mix(col,uA,clamp(f*f*1.8,0.,1.));
  col=mix(col,uB,clamp(length(q)*.55,0.,1.)*.55);
  col+=vec3(.9)*pow(clamp(r.x,0.,1.),6.)*.35;
  col*=smoothstep(1.3,.2,length(p));
  gl_FragColor=vec4(col,1.);
}`

// Slow ink currents that bend away from the pointer.
export default function ShaderInk({ from = '#ff6a2b', to = '#3b3bd6', speed = 1, className = '', children }) {
  const host = useShader(FRAG, { uniforms: { uA: hexToRgb(from), uB: hexToRgb(to, [0.23, 0.23, 0.84]) }, speed })
  return (
    <div ref={host} className={`relative h-full min-h-72 w-full overflow-hidden bg-[#09090a] ${className}`}
      style={{ backgroundImage: `radial-gradient(70% 60% at 30% 40%, ${from}40, transparent 70%), radial-gradient(60% 60% at 75% 60%, ${to}40, transparent 70%)` }}>
      <div className="pointer-events-none relative z-10 grid h-full min-h-72 place-items-center p-6">{children}</div>
    </div>
  )
}
