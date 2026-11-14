'use client'

import ShaderBackground, { type ShaderBackgroundProps } from './shader-bg'

const FRAG = `
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;
  vec2 o=vec2((.5+(uMouse.x-.5)*.4*uMouse.w)*asp,1.18);
  vec2 d=vec2(uv.x*asp,uv.y)-o;float r=length(d);float a=atan(d.x,-d.y);float t=uTime*.25;
  float rays=noise(vec2(a*7.*uScale+t*.35,t*.5))*.6+noise(vec2(a*19.*uScale-t*.25,t*.8+4.))*.4;
  rays=smoothstep(.3,.8,rays);
  float cone=smoothstep(1.05,.1,abs(a));
  float fall=exp(-r*1.15);
  float v=rays*cone*fall*1.5+cone*fall*.22+.45*exp(-r*3.2);
  float dust=step(.9965,hash(floor(gl_FragCoord.xy/(2.*uPx))+floor(t*3.)))*cone*fall;
  paint(v*.75+dust*.5,r*.7);
}
`

// Shafts of light falling from above the frame, with dust in the beams. The source leans toward the pointer.
// Ink and paper come from your theme (--tx on --bg), so it works in light and dark. Pass `color` to tint it.
export default function ShaderRays({ color = '', color2 = '', speed = 1, intensity = 1, scale = 1, interactive = true, allowSoftware = false, className = '', style, children }: ShaderBackgroundProps) {
  return (
    <ShaderBackground frag={FRAG} color={color} color2={color2} speed={speed} intensity={intensity} scale={scale} interactive={interactive} allowSoftware={allowSoftware} className={className} style={style}>
      {children}
    </ShaderBackground>
  )
}
