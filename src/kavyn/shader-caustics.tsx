'use client'

import ShaderBackground, { type ShaderBackgroundProps } from './shader-bg'

const FRAG = `
float web(vec2 p,float t){
  vec2 w=vec2(fbm(p*.7+vec2(t,-t*.6)),fbm(p*.7+vec2(4.1-t*.8,2.3+t)));
  float n=noise(p*1.6+w*2.4);
  return pow(clamp(1.-abs(n-.5)*4.2,0.,1.),5.);
}
void main(){
  vec2 p=centered()*3.*uScale;vec2 m=pointer()*3.*uScale;float t=uTime*.22;
  p+=uMouse.w*(m-p)*.3*exp(-.9*length(p-m));
  float a=web(p,t),b=web(p*1.35+7.3,t*1.25+3.);
  float v=min(a+b*.6,1.)*.42+.4*a*b+.02;
  paint(v,a*b*2.);
}
`

// Sunlight on a pool floor: two nets of light sliding over each other, gathering under the pointer.
// Ink and paper come from your theme (--tx on --bg), so it works in light and dark. Pass `color` to tint it.
export default function ShaderCaustics({ color = '', color2 = '', speed = 1, intensity = 1, scale = 1, interactive = true, allowSoftware = false, className = '', style, children }: ShaderBackgroundProps) {
  return (
    <ShaderBackground frag={FRAG} color={color} color2={color2} speed={speed} intensity={intensity} scale={scale} interactive={interactive} allowSoftware={allowSoftware} className={className} style={style}>
      {children}
    </ShaderBackground>
  )
}
