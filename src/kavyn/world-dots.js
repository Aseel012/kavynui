// Land mask for the dotted world map, 2.5° grid (lat 80 to -58).
// Each row lists runs of land as "startCol.length" in base 36.
// Generated from Natural Earth 1:110m land (public domain) via the world-atlas package.
export const STEP = 2.5
export const LAT_TOP = 80
export const COLS = 144
const RLE = 'x.b,19.k,26.5,31.3|o.2,11.4,19.j,26.1,35.1|r.2,w.8,1d.f,2m.2,2z.a,3j.3,3n.1|m.2,p.3,t.1,v.2,y.1,10.4,1e.d,2l.1,2s.1,2w.k,3k.2|7.8,p.7,y.1,12.2,15.4,1e.d,28.4,2r.2,2u.y,3w.1|0.2,6.m,t.a,15.1,17.3,1f.8,26.a,2j.a,2u.16|2.1,5.w,12.1,15.4,1f.5,1r.3,24.4,2a.4,2g.1k|6.t,12.1,18.1,1g.3,22.5,28.1l,3u.6|5.8,f.j,15.3,22.5,29.1,2c.1e,3t.2|9.2,j.g,15.6,1y.1,25.2,2a.1a,3r.2|6.1,k.j,15.8,1y.1,23.1,28.1a,3q.3|l.i,15.9,1w.1,1y.3,22.1j,3q.1|l.o,1d.1,20.1k,3l.1|m.o,1e.1,1z.1l|m.n,1a.1,1z.6,26.6,2d.1,2f.4,2l.y|m.m,1w.5,23.3,27.4,2h.2,2l.v,3k.1|m.k,1w.4,23.1,26.1,28.2,2b.9,2l.r,3d.2,3k.1|n.i,1w.4,25.1,2b.9,2m.r,3f.1,3j.1|o.i,1x.7,2d.z,3h.3|p.f,1w.a,28.1,2e.y,3g.1|r.9,12.1,1w.n,2k.t|q.1,s.5,13.1,1v.i,2e.6,2l.r|r.1,t.4,1u.k,2f.6,2m.1,2r.m|u.3,12.2,1t.m,2g.8,2s.8,31.9|u.3,10.1,15.1,1t.m,2g.7,2t.5,31.5|v.6,1u.l,2h.5,2t.4,32.5,3c.1|z.4,1t.n,2h.3,2u.2,33.5,3c.1|11.2,1t.o,2u.2,33.1,35.3,3c.1|12.1,16.1,18.3,1u.q,2u.2,33.1,36.1,3b.1|15.8,1v.p,2w.1,3e.1|15.a,1w.2,1z.1,22.h,32.1,34.1,3a.2|15.b,24.e,33.1,35.1,39.2|14.c,24.d,34.2,38.3|14.f,24.c,34.2,38.3,3c.1,3h.3|13.i,25.b,3j.3|14.i,25.b,37.2,3j.4|15.h,25.b,3d.1,3n.1|15.g,25.b,3g.3|16.e,25.b,2j.1,3e.4,3l.1|17.d,25.a,2i.2,3d.9|18.c,25.9,2i.1,3c.b|18.b,26.8,2h.2,39.f|18.9,26.8,2i.1,39.g|18.9,26.7,3a.f|17.9,27.5,3a.f|17.8,27.4,3a.4,3i.7|17.6,3j.5|17.6,3k.4|17.4,3y.1|16.5,3m.1,3w.1|16.4,3v.1|16.4|16.3|16.2|18.2|'

let cache = null
// Returns [{ lat, lon, col, row }] for every land dot.
export function worldDots() {
  if (cache) return cache
  cache = []
  RLE.split('|').forEach((line, row) => {
    if (!line) return
    line.split(',').forEach((run) => {
      const [a, b] = run.split('.').map((v) => parseInt(v, 36))
      for (let col = a; col < a + b; col++) cache.push({ row, col, lat: LAT_TOP - row * STEP, lon: -180 + col * STEP + STEP / 2 })
    })
  })
  return cache
}

export const ROWS = RLE.split('|').length

// Equirectangular position inside a width x height box.
export const project = (lat, lon, w, h) => [((lon + 180) / 360) * w, ((LAT_TOP - lat) / (ROWS * STEP)) * h]
