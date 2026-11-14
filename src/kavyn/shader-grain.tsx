'use client'

import ShaderBackground, { type ShaderBackgroundProps } from './shader-bg'

const FRAG = `
void main(){
  vec2 c=centered();vec2 p=c*uScale;float t=uTime*.07;
  float leak=smoothstep(.42,.78,fbm(p*.6+vec2(t,-t*.6))*1.25);leak*=leak;
  float glow=exp(-2.2*length(p-vec2(.75*sin(t*1.7),.45*cos(t*1.3))))+uMouse.w*.7*exp(-3.*length(c-pointer()));
  float v=.55*leak+.3*glow;
  float tick=floor(uTime*24.);
  float g=hash(gl_FragCoord.xy+tick*17.13)+hash(gl_FragCoord.yx*1.37+tick*5.71)-1.;
  v+=g*.13*(.35+v);
  paint(v*.8,glow);
}
`

// A slow light leak under live film grain. The light follows the pointer.
// Ink and paper come from your theme (--tx on --bg), so it works in light and dark. Pass `color` to tint it.
export default function ShaderGrain({ color = '', color2 = '', speed = 1, intensity = 1, scale = 1, interactive = true, allowSoftware = false, className = '', style, children }: ShaderBackgroundProps) {
  return (
    <ShaderBackground frag={FRAG} color={color} color2={color2} speed={speed} intensity={intensity} scale={scale} interactive={interactive} allowSoftware={allowSoftware} className={className} style={style}>
      {children}
    </ShaderBackground>
  )
}
