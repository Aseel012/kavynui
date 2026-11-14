'use client'

import ShaderBackground, { type ShaderBackgroundProps } from './shader-bg'

const FRAG = `
void main(){
  vec2 p=centered()*uScale*2.1;vec2 m=pointer()*uScale*2.1;float t=uTime*.18;
  vec2 away=p-m;p+=uMouse.w*.4*away/(length(away)+.2)*exp(-1.6*length(away));
  for(int i=1;i<6;i++){float f=float(i);
    p.x+=.5/f*sin(f*1.6*p.y+t+f*.7);
    p.y+=.5/f*cos(f*1.6*p.x+t*1.2+f*1.9);}
  float w=.5+.5*sin(p.x*1.8+p.y*1.4);
  float band=smoothstep(.15,.85,w);
  float spec=pow(w,9.);
  float edge=pow(.5+.5*sin(p.x*3.1-p.y*2.3+1.3),7.);
  paint(.03+.2*band*band+.42*spec+.2*edge,spec);
}
`

// Liquid metal: slow reflections that fold over each other and part around the pointer.
// Ink and paper come from your theme (--tx on --bg), so it works in light and dark. Pass `color` to tint it.
export default function ShaderChrome({ color = '', color2 = '', speed = 1, intensity = 1, scale = 1, interactive = true, allowSoftware = false, className = '', style, children }: ShaderBackgroundProps) {
  return (
    <ShaderBackground frag={FRAG} color={color} color2={color2} speed={speed} intensity={intensity} scale={scale} interactive={interactive} allowSoftware={allowSoftware} className={className} style={style}>
      {children}
    </ShaderBackground>
  )
}
