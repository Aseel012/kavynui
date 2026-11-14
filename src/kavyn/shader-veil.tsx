'use client'

import ShaderBackground, { type ShaderBackgroundProps } from './shader-bg'

const FRAG = `
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;float x=(uv.x-.5)*(uRes.x/uRes.y)*1.5*uScale;float t=uTime*.16;
  float v=0.,k=0.;
  for(int i=0;i<4;i++){float f=float(i);
    float base=.3+f*.1+.09*sin(x*1.1+t*(1.+f*.35)+f*2.1)+.14*(fbm(vec2(x*.9+t*.6+f*5.,f*3.))-.5)+(uMouse.y-.5)*.1*uMouse.w;
    float d=uv.y-base;
    float rays=.3+.7*noise(vec2(x*9.+f*7.+.6*sin(t+f),t*1.6+f));
    float curtain=smoothstep(-.045,.02,d)*exp(-max(d,0.)*(4.2+f*1.6))*rays;
    v+=curtain*(.5-f*.09);k+=curtain*f*.33;}
  float s=hash(floor(gl_FragCoord.xy/(2.*uPx)));
  v+=step(.9982,s)*(.35+.3*sin(uTime*1.5+s*80.))*smoothstep(.45,1.,uv.y);
  paint(v*.9,k);
}
`

// Aurora curtains with fine vertical rays over a few slow stars.
// Ink and paper come from your theme (--tx on --bg), so it works in light and dark. Pass `color` to tint it.
export default function ShaderVeil({ color = '', color2 = '', speed = 1, intensity = 1, scale = 1, interactive = true, allowSoftware = false, className = '', style, children }: ShaderBackgroundProps) {
  return (
    <ShaderBackground frag={FRAG} color={color} color2={color2} speed={speed} intensity={intensity} scale={scale} interactive={interactive} allowSoftware={allowSoftware} className={className} style={style}>
      {children}
    </ShaderBackground>
  )
}
