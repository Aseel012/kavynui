'use client'

import ShaderBackground, { type ShaderBackgroundProps } from './shader-bg'

const FRAG = `
void main(){
  vec2 p=centered()-pointer()*.3*uMouse.w;float r=length(p);float a=atan(p.y,p.x)/6.2832+.5;float t=uTime*.35;
  float v=0.,k=0.;
  for(int i=0;i<3;i++){float f=float(i);
    float n=floor((48.+f*37.)*uScale);
    float id=floor(a*n);
    float rnd=hash(vec2(id,f*17.+3.));
    float z=fract(rnd*7.+t*(.25+.55*hash(vec2(id,f+9.))));
    float head=z*z*1.2;float len=.02+.24*z*z;
    float across=smoothstep(.05+.13*rnd,0.,abs(fract(a*n)-.5));
    float along=smoothstep(head-len,head,r)*step(r,head);
    v+=along*across*z*(.45+.55*rnd);k+=along*across*f*.4;}
  v+=.16*exp(-r*5.);
  paint(v*.9,k);
}
`

// Stars streaking past as if the page were moving forward. The vanishing point follows the pointer.
// Ink and paper come from your theme (--tx on --bg), so it works in light and dark. Pass `color` to tint it.
export default function ShaderWarp({ color = '', color2 = '', speed = 1, intensity = 1, scale = 1, interactive = true, allowSoftware = false, className = '', style, children }: ShaderBackgroundProps) {
  return (
    <ShaderBackground frag={FRAG} color={color} color2={color2} speed={speed} intensity={intensity} scale={scale} interactive={interactive} allowSoftware={allowSoftware} className={className} style={style}>
      {children}
    </ShaderBackground>
  )
}
