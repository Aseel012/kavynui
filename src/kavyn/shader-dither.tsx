'use client'

import ShaderBackground, { type ShaderBackgroundProps } from './shader-bg'

const FRAG = `
uniform float uPixel;
float bayer2(vec2 a){a=floor(a);return fract(a.x/2.+a.y*a.y*.75);}
float bayer4(vec2 a){return bayer2(.5*a)*.25+bayer2(a);}
float bayer8(vec2 a){return bayer4(.5*a)*.25+bayer2(a);}
void main(){
  float px=max(1.,floor(uPixel*uPx+.5));
  vec2 cell=floor(gl_FragCoord.xy/px);
  vec2 c=((cell+.5)*px-.5*uRes)/uRes.y;vec2 p=c*uScale;float t=uTime*.12;
  float f=fbm(p*1.6+vec2(t,t*.4)+2.*fbm(p*1.1-t*.5));
  f=smoothstep(.3,.8,f)*.75;
  f+=uMouse.w*.5*exp(-6.*length(c-pointer()));
  f*=smoothstep(1.4,.25,length(c));
  float on=step(bayer8(cell)+.03,f);
  paint(on*.5,f);
}
`

export interface ShaderDitherProps extends ShaderBackgroundProps {
  /** Size of one dither pixel, in CSS pixels. */
  pixel?: number
}

// Slow clouds drawn in one-bit pixels with an ordered dither, like an old display. The pointer leaves a bright patch.
// Ink and paper come from your theme (--tx on --bg), so it works in light and dark. Pass `color` to tint it.
export default function ShaderDither({ pixel = 3, color = '', color2 = '', speed = 1, intensity = 1, scale = 1, interactive = true, allowSoftware = false, className = '', style, children }: ShaderDitherProps) {
  return (
    <ShaderBackground frag={FRAG} uniforms={{ uPixel: pixel }} color={color} color2={color2} speed={speed} intensity={intensity} scale={scale} interactive={interactive} allowSoftware={allowSoftware} className={className} style={style}>
      {children}
    </ShaderBackground>
  )
}
