import { useShader, hexToRgb, NOISE } from './gl-canvas'

const FRAG = NOISE + `
uniform vec3 uTint;uniform float uGrain;
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;
  vec2 p=uv*vec2(asp,1.);float t=uTime*.25;
  vec2 c1=vec2(asp*(.25+.08*sin(t)),.85+.05*cos(t*1.3));
  vec2 c2=vec2(asp*(.8+.06*cos(t*.8)),.15+.06*sin(t*1.1));
  vec2 m=vec2(uMouse.x*asp,uMouse.y);
  float g1=exp(-2.4*length(p-c1)),g2=exp(-3.2*length(p-c2)),g3=exp(-7.*length(p-m));
  vec3 col=vec3(.035,.035,.04);
  col+=uTint*g1*.75+vec3(.35,.4,.9)*g2*.35+uTint*g3*.25;
  col*=.85+.3*fbm(p*2.+t);
  float n=hash(gl_FragCoord.xy+fract(uTime*9.)*vec2(91.,37.));
  col+=(n-.5)*uGrain;
  col*=1.-.35*length(uv-.5);
  gl_FragColor=vec4(col,1.);
}`

// Warm light through film grain. The grain re-rolls every frame, like real stock.
export default function ShaderGrain({ tint = '#ff6a2b', grain = 0.09, speed = 1, className = '', children }) {
  const host = useShader(FRAG, { uniforms: { uTint: hexToRgb(tint), uGrain: Number(grain) || 0 }, speed, resolution: 0.75 })
  return (
    <div ref={host} className={`relative h-full min-h-72 w-full overflow-hidden bg-[#09090a] ${className}`}
      style={{ backgroundImage: `radial-gradient(60% 60% at 22% 12%, ${tint}55, transparent 70%), radial-gradient(50% 50% at 82% 88%, #5a66e633, transparent 70%)` }}>
      <div className="pointer-events-none relative z-10 grid h-full min-h-72 place-items-center p-6">{children}</div>
    </div>
  )
}
