'use client'

import ShaderBackground, { type ShaderBackgroundProps } from './shader-bg'

const FRAG = `
void main(){
  vec2 c=centered();vec2 p=c*uScale;vec2 m=pointer()*uScale;float t=uTime*.22;
  p+=uMouse.w*.14*(p-m)*exp(-2.5*length(p-m));
  p.y+=.22*sin(p.x*1.4+t)+.1*sin(p.x*3.1-t*1.4);
  float n=fbm(vec2(p.x*.7+t*.25,p.y*2.4-t*.1));
  float fold=sin(p.y*11.+n*8.+p.x*1.6+t);
  float sheen=pow(.5+.5*fold,2.2);
  float thread=pow(.5+.5*sin(p.y*27.+n*17.+t*1.3),6.);
  float shade=.5+.5*sin(p.y*3.6+n*3.2-t*.5);
  float lit=.35+.65*shade;
  float v=.03+.12*shade+.62*sheen*lit+.18*thread*lit;
  paint(v*smoothstep(1.5,.15,length(c)),sheen);
}
`

// Satin folds that drift and catch the light. The cloth gives a little where the pointer rests.
// Ink and paper come from your theme (--tx on --bg), so it works in light and dark. Pass `color` to tint it.
export default function ShaderSilk({ color = '', color2 = '', speed = 1, intensity = 1, scale = 1, interactive = true, allowSoftware = false, className = '', style, children }: ShaderBackgroundProps) {
  return (
    <ShaderBackground frag={FRAG} color={color} color2={color2} speed={speed} intensity={intensity} scale={scale} interactive={interactive} allowSoftware={allowSoftware} className={className} style={style}>
      {children}
    </ShaderBackground>
  )
}
