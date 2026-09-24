import { useShader, hexToRgb } from './gl-canvas'

const FRAG = `
uniform vec3 uA;
void main(){
  float asp=uRes.x/uRes.y;
  vec2 p=gl_FragCoord.xy/uRes*vec2(asp,1.);float t=uTime*.35;
  float f=0.;
  for(int i=0;i<6;i++){
    float fi=float(i);
    vec2 c=vec2(asp*(.5+.34*sin(t*(.7+fi*.13)+fi*1.9)),.5+.32*cos(t*(.9+fi*.11)+fi*2.7));
    f+=(.015+.002*fi)/dot(p-c,p-c);
  }
  vec2 m=vec2(uMouse.x*asp,uMouse.y);
  f+=(.008+.012*uMouse.z)/dot(p-m,p-m);
  float body=smoothstep(.95,1.05,f);
  float core=smoothstep(1.,4.,f);
  vec3 col=vec3(.035,.035,.04)+uA*.18*smoothstep(.3,1.,f);
  col=mix(col,uA*(.35+.5*core),body);
  col+=vec3(1.,.85,.7)*smoothstep(2.5,8.,f)*.35;
  col*=1.-.25*body*(1.-core);
  gl_FragColor=vec4(col,1.);
}`

// Molten blobs that merge and split. Press to make the pointer blob swell.
export default function ShaderMolten({ color = '#ff6a2b', speed = 1, className = '', children }) {
  const host = useShader(FRAG, { uniforms: { uA: hexToRgb(color) }, speed })
  return (
    <div ref={host} className={`relative h-full min-h-72 w-full overflow-hidden bg-[#09090a] ${className}`}
      style={{ backgroundImage: `radial-gradient(18% 22% at 35% 45%, ${color}88, transparent 70%), radial-gradient(15% 20% at 62% 58%, ${color}77, transparent 70%)` }}>
      <div className="pointer-events-none relative z-10 grid h-full min-h-72 place-items-center p-6">{children}</div>
    </div>
  )
}
