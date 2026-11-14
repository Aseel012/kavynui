'use client'

import ShaderBackground, { type ShaderBackgroundProps } from './shader-bg'

const FRAG = `
uniform float uDensity;
void main(){
  vec2 p=centered();vec2 m=pointer();float t=uTime;
  float cells=uDensity*uScale;
  vec2 g=p*cells;vec2 id=floor(g+.5);vec2 c=id/cells;
  float d=length(c-m);
  float wave=sin(c.x*5.+t*.9)*cos(c.y*4.-t*.7)*.5+.5;
  float ripple=uMouse.w*sin(d*26.-t*5.)*exp(-d*3.5);
  float lift=clamp(wave*.6+ripple*.9+(fbm(c*2.+t*.08)-.3)*.9,0.,1.4);
  vec2 o=g-id;o.y-=lift*.12;
  float r=.06+.17*lift;
  float px=cells/uRes.y;
  float dotv=smoothstep(r+px,r-px,length(o));
  paint(dotv*(.1+.5*lift)*smoothstep(1.3,.2,length(p)),lift);
}
`

export interface ShaderLatticeProps extends ShaderBackgroundProps {
  /** Dots across the height of the box. */
  density?: number
}

// A dot grid that carries waves. Move the pointer and rings spread out from it.
// Ink and paper come from your theme (--tx on --bg), so it works in light and dark. Pass `color` to tint it.
export default function ShaderLattice({ density = 28, color = '', color2 = '', speed = 1, intensity = 1, scale = 1, interactive = true, allowSoftware = false, className = '', style, children }: ShaderLatticeProps) {
  return (
    <ShaderBackground frag={FRAG} uniforms={{ uDensity: density }} color={color} color2={color2} speed={speed} intensity={intensity} scale={scale} interactive={interactive} allowSoftware={allowSoftware} className={className} style={style}>
      {children}
    </ShaderBackground>
  )
}
