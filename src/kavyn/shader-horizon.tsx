'use client'

import ShaderBackground, { type ShaderBackgroundProps } from './shader-bg'

const FRAG = `
void main(){
  vec2 p=centered();float t=uTime*.1;
  float R=2.4/uScale;vec2 c=vec2((uMouse.x-.5)*.12*uMouse.w,-R-.24);
  float d=length(p-c)-R;float lat=p.x-c.x;
  float sun=exp(-lat*lat*2.);
  float out_=step(0.,d);
  float atmo=exp(-max(d,0.)*8.)*out_;
  float halo=exp(-max(d,0.)*2.)*.3*out_;
  float rim=exp(-abs(d)*110.);
  float land=(1.-out_)*(.04+.16*fbm(vec2(lat*3.+t,d*12.))*exp(d*8.));
  float s=hash(floor(gl_FragCoord.xy/(2.*uPx)));
  float stars=step(.997,s)*(.3+.3*sin(uTime*1.2+s*90.))*smoothstep(0.,.5,d);
  float v=(atmo*.7+halo+rim*.9+land)*(.2+.8*sun)+stars;
  paint(v,halo*2.5+land*4.);
}
`

// The lit edge of a planet rising from the bottom of the frame, with a thin atmosphere and stars above.
// Ink and paper come from your theme (--tx on --bg), so it works in light and dark. Pass `color` to tint it.
export default function ShaderHorizon({ color = '', color2 = '', speed = 1, intensity = 1, scale = 1, interactive = true, allowSoftware = false, className = '', style, children }: ShaderBackgroundProps) {
  return (
    <ShaderBackground frag={FRAG} color={color} color2={color2} speed={speed} intensity={intensity} scale={scale} interactive={interactive} allowSoftware={allowSoftware} className={className} style={style}>
      {children}
    </ShaderBackground>
  )
}
