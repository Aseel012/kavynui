import { useShader, hexToRgb } from './gl-canvas'

const FRAG = `
uniform vec3 uA;
void main(){
  vec2 uv=gl_FragCoord.xy/uRes.y;float t=uTime*.4;
  vec2 m=uMouse.xy*vec2(uRes.x/uRes.y,1.);
  vec2 p=uv*5.+(m-uv)*.6*exp(-2.*length(uv-m));
  float c=0.;
  for(int i=0;i<4;i++){
    float fi=float(i);
    p+=vec2(sin(p.y*1.13+t+fi*1.7),cos(p.x*1.27-t*.8+fi*2.3))*.55;
    c+=.12/(.08+abs(sin(p.x)*sin(p.y)));
  }
  c=pow(c*.18,2.2);
  vec3 deep=vec3(.02,.05,.07);
  vec3 col=deep+uA*.25*(1.-gl_FragCoord.y/uRes.y)+uA*c*.55+vec3(.9,1.,1.)*pow(c,3.)*.12;
  gl_FragColor=vec4(min(col,vec3(1.)),1.);
}`

// Light dancing on a pool floor. Pull the pattern toward the pointer.
export default function ShaderCaustics({ color = '#29c6d6', speed = 1, className = '', children }) {
  const host = useShader(FRAG, { uniforms: { uA: hexToRgb(color, [0.16, 0.78, 0.84]) }, speed })
  return (
    <div ref={host} className={`relative h-full min-h-72 w-full overflow-hidden bg-[#05090c] ${className}`}
      style={{ backgroundImage: `radial-gradient(80% 60% at 50% 100%, ${color}40, transparent 70%)` }}>
      <div className="pointer-events-none relative z-10 grid h-full min-h-72 place-items-center p-6">{children}</div>
    </div>
  )
}
