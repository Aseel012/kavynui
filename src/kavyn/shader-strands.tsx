'use client'

import ShaderBackground, { type ShaderBackgroundProps } from './shader-bg'

const FRAG = `
uniform float uCount;
void main(){
  vec2 p=centered();float x=p.x*uScale;float t=uTime*.35;vec2 m=pointer();
  float v=0.,k=0.;
  for(int i=0;i<48;i++){
    float f=float(i);if(f>=uCount)break;
    float u=f/uCount;
    float env=.5+.5*sin(x*1.1+u*4.+t*.4);
    float y=(u-.5)*.55*env+.3*sin(x*2.1+u*6.283+t)*(noise(vec2(x*.6+f*.37,t*.25))-.2)+.04*sin(x*5.3-t*1.3+f);
    y+=uMouse.w*(m.y-y)*.6*exp(-7.*abs(p.x-m.x));
    float d=abs(p.y-y)*uRes.y/uPx;
    float line=smoothstep(1.3,0.,d)*.5+.5/(d+5.);
    v+=line*(.3+.7*u);k+=line*u;
  }
  paint(v*.6,k/(v+.001));
}
`

export interface ShaderStrandsProps extends ShaderBackgroundProps {
  /** Number of lines, up to 48. */
  count?: number
}

// A bundle of fine lines that twists like fibre in a current and leans toward the pointer.
// Ink and paper come from your theme (--tx on --bg), so it works in light and dark. Pass `color` to tint it.
export default function ShaderStrands({ count = 22, color = '', color2 = '', speed = 1, intensity = 1, scale = 1, interactive = true, allowSoftware = false, className = '', style, children }: ShaderStrandsProps) {
  return (
    <ShaderBackground frag={FRAG} uniforms={{ uCount: count }} color={color} color2={color2} speed={speed} intensity={intensity} scale={scale} interactive={interactive} allowSoftware={allowSoftware} className={className} style={style}>
      {children}
    </ShaderBackground>
  )
}
