import { useShader, hexToRgb, NOISE } from './gl-canvas'

const FRAG = NOISE + `
uniform vec3 uA;uniform vec3 uB;
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;float x=uv.x*(uRes.x/uRes.y)*1.6;float t=uTime*.18;
  vec3 col=mix(vec3(.02,.025,.04),vec3(.05,.04,.08),uv.y);
  for(int i=0;i<3;i++){
    float fi=float(i);
    float base=.45+fi*.08+.1*sin(x*.9+t*(1.+fi*.4)+fi*2.1)+.06*fbm(vec2(x*1.5+t,fi*3.));
    float d=uv.y-base;
    float rays=.55+.45*noise(vec2(x*14.+fi*7.,t*3.));
    float curtain=smoothstep(-.015,.01,d)*exp(-max(d,0.)*(5.+fi*2.))*rays;
    vec3 c=mix(uA,uB,clamp(d*3.+fi*.3,0.,1.));
    col+=c*curtain*(.5-fi*.1);
  }
  float s=hash(floor(gl_FragCoord.xy/2.));
  col+=vec3(step(.9975,s))*(.4+.6*sin(uTime*2.+s*50.))*smoothstep(.3,.9,uv.y);
  gl_FragColor=vec4(col,1.);
}`

// Aurora curtains with fine vertical rays over a starfield.
export default function ShaderVeil({ from = '#2fe39a', to = '#8b5cf6', speed = 1, className = '', children }) {
  const host = useShader(FRAG, { uniforms: { uA: hexToRgb(from, [0.18, 0.89, 0.6]), uB: hexToRgb(to, [0.55, 0.36, 0.96]) }, speed })
  return (
    <div ref={host} className={`relative h-full min-h-72 w-full overflow-hidden bg-[#06070b] ${className}`}
      style={{ backgroundImage: `linear-gradient(to top, transparent 35%, ${from}30 55%, ${to}25 75%, transparent)` }}>
      <div className="pointer-events-none relative z-10 grid h-full min-h-72 place-items-center p-6">{children}</div>
    </div>
  )
}
