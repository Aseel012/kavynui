'use client'

import ShaderBackground, { type ShaderBackgroundProps } from './shader-bg'

const FRAG = `
uniform float uCell;
void main(){
  float s=uCell*uPx/uScale;
  mat2 rot=mat2(.7071,-.7071,.7071,.7071);
  vec2 q=rot*(gl_FragCoord.xy-.5*uRes)/s;vec2 id=floor(q+.5);vec2 o=q-id;
  vec2 c=((id*s)*rot)/uRes.y;float t=uTime*.25;
  float tide=.5+.5*sin(c.x*2.6+c.y*1.7+t+2.2*fbm(c*1.2+vec2(t*.2,0.)));
  tide=tide*.75+.25*fbm(c*2.5-t*.1);
  tide=smoothstep(.12,.88,tide);
  tide+=uMouse.w*.5*exp(-7.*dot(c-pointer(),c-pointer()));
  float r=.46*sqrt(clamp(tide,0.,1.));
  float aa=1./s;
  float dotv=smoothstep(r+aa,r-aa,length(o))*step(.04,r);
  paint(dotv*.45*smoothstep(1.5,.2,length(c)),tide);
}
`

export interface HalftoneTideProps extends ShaderBackgroundProps {
  /** Distance between dots, in CSS pixels. */
  cell?: number
}

// Print-style halftone dots on a 45 degree screen, swelling and thinning like a tide. They gather under the pointer.
// Ink and paper come from your theme (--tx on --bg), so it works in light and dark. Pass `color` to tint it.
export default function HalftoneTide({ cell = 14, color = '', color2 = '', speed = 1, intensity = 1, scale = 1, interactive = true, allowSoftware = false, className = '', style, children }: HalftoneTideProps) {
  return (
    <ShaderBackground frag={FRAG} uniforms={{ uCell: cell }} color={color} color2={color2} speed={speed} intensity={intensity} scale={scale} interactive={interactive} allowSoftware={allowSoftware} className={className} style={style}>
      {children}
    </ShaderBackground>
  )
}
