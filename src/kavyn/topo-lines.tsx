'use client'

import ShaderBackground, { type ShaderBackgroundProps } from './shader-bg'

const FRAG = `
uniform float uLines;
float field(vec2 p,float t){vec2 m=pointer()*uScale;return fbm(p*.9+vec2(t,-t*.7))+.16*uMouse.w*exp(-3.*dot(p-m,p-m));}
void main(){
  vec2 c=centered();vec2 p=c*uScale;float t=uTime*.03;
  float e=1.5*uScale/uRes.y;
  float h=field(p,t);
  vec2 g=vec2(field(p+vec2(e,0.),t)-h,field(p+vec2(0.,e),t)-h)/e;
  float n=uLines*2.;float x=h*n;
  float d=abs(fract(x-.5)-.5)/(n*length(g)+1e-4);
  float px=d*uRes.y/(uScale*uPx);
  float major=step(mod(floor(x+.5),5.),.5);
  float w=mix(.5,1.,major);
  float line=smoothstep(w+.9,w-.1,px);
  paint(line*mix(.17,.5,major)*smoothstep(1.5,.15,length(c)),major);
}
`

export interface TopoLinesProps extends ShaderBackgroundProps {
  /** How many contour lines the terrain is cut into. */
  lines?: number
}

// Contour lines of a slowly shifting terrain, every fifth one drawn heavier. The ground rises under the pointer.
// Ink and paper come from your theme (--tx on --bg), so it works in light and dark. Pass `color` to tint it.
export default function TopoLines({ lines = 14, color = '', color2 = '', speed = 1, intensity = 1, scale = 1, interactive = true, allowSoftware = false, className = '', style, children }: TopoLinesProps) {
  return (
    <ShaderBackground frag={FRAG} uniforms={{ uLines: lines }} color={color} color2={color2} speed={speed} intensity={intensity} scale={scale} interactive={interactive} allowSoftware={allowSoftware} className={className} style={style}>
      {children}
    </ShaderBackground>
  )
}
