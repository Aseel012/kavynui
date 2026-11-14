'use client'

import ShaderBackground, { type ShaderBackgroundProps } from './shader-bg'

const FRAG = `
void main(){
  vec2 c=centered();vec2 p=c*uScale;vec2 m=pointer()*uScale;float t=uTime*.1;
  p+=uMouse.w*(p-m)*.35*exp(-3.*length(p-m));
  vec2 q=vec2(fbm(p*1.3+t),fbm(p*1.3+vec2(5.2,1.3)-t));
  vec2 r=vec2(fbm(p*1.3+3.2*q+vec2(1.7,9.2)+t*.7),fbm(p*1.3+3.2*q+vec2(8.3,2.8)-t*.5));
  float f=fbm(p*1.3+3.2*r);
  float v=smoothstep(.38,.8,f);v=v*v*.32;
  v+=.34*pow(clamp(1.-abs(f-.5)*6.,0.,1.),3.);
  paint(v*smoothstep(1.4,.25,length(c)),length(q-.5)*2.5);
}
`

// Ink folding through water, with bright seams where the currents meet. It bends away from the pointer.
// Ink and paper come from your theme (--tx on --bg), so it works in light and dark. Pass `color` to tint it.
export default function ShaderInk({ color = '', color2 = '', speed = 1, intensity = 1, scale = 1, interactive = true, allowSoftware = false, className = '', style, children }: ShaderBackgroundProps) {
  return (
    <ShaderBackground frag={FRAG} color={color} color2={color2} speed={speed} intensity={intensity} scale={scale} interactive={interactive} allowSoftware={allowSoftware} className={className} style={style}>
      {children}
    </ShaderBackground>
  )
}
