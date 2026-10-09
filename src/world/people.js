// People in the visual thread's kit style (front view, flat, two tones per shape, no outline), drawn at the
// same pixel size as the art around them. One sprite per zoom level (Moondog, Oct 9):
//   1× board   a 4×8 figure, like the mockup's townsfolk
//   2× scene   an 8×12 figure (option B)
//   3× scene   a 14×22 close-up with a face and one clear trait (option C)
// Each sprite is drawn at art-pixel size; the scene scales it by its zoom with the background.
const K = { skin: '#E9B98F', skinD: '#D29D74', eye: '#2F4250', shoe: '#2F4250', silver: '#DCE1E7', silverD: '#9AA3AD', glass: '#2F4250' };

// the manifest looks predate the kit palette; map their colours onto it
const REMAP = { '#2A2622': '#2B3138', '#C2573F': '#D9573A', '#F3EFE6': '#FBF7EC', '#C9C3B6': '#C9CCD1', '#8E8A82': '#8C949B', '#7D5A3C': '#785845', '#5C6A7E': '#4E5762', '#3E5C8A': '#2F6FD6', '#E58FA8': '#F2A6B8', '#E8B93A': '#E8B04A', '#3A95BE': '#1F8E89', '#A8DC5A': '#B1C65B' };
const kit = (c) => REMAP[(c || '').toUpperCase()] || c;
function shade(hex, f = 0.82) {
  const n = parseInt(hex.slice(1), 16), ch = (s) => Math.round(((n >> s) & 255) * f);
  return '#' + [16, 8, 0].map((s) => ch(s).toString(16).padStart(2, '0')).join('');
}
export function kitLook(look = {}) {
  const hair = kit(look.hair || '#2A2622'), top = kit(look.top || '#3E5C8A'), bottom = kit(look.bottom || '#5C6A7E');
  return { ...look, hair, hairD: shade(hair), top, topD: shade(top), bottom, bottomD: shade(bottom), cap: kit(look.cap || look.hair || '#2A2622') };
}

function mk(w, h, fn) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d');
  fn((a, b, ww, hh, col) => { x.fillStyle = col; x.fillRect(a, b, ww, hh); });
  return c;
}

// 1×: 4×8 (kids 4×6). Hair, face, top, legs; the trait as a single pixel.
function tiny(o) {
  const k = o.kid ? 2 : 0;
  return mk(5, 8, (R) => {
    R(1, k, 2, 1, o.trait === 'cap' ? o.cap : o.hair); R(1, k + 1, 2, 1, K.skin);
    R(0, k + 2, 4, 3 - (o.kid ? 1 : 0), o.top); R(2, k + 2, 2, 3 - (o.kid ? 1 : 0), o.topD);
    R(1, 5, 1, 3, o.bottom); R(2, 5, 1, 3, o.bottomD);
    if (o.trait === 'thermos') R(4, 3, 1, 2, K.silver);
    if (o.trait === 'beard') R(1, 2, 2, 1, o.hair);
  });
}

// 2×: 8×12 (kids 8×10)
function small(o, pose) {
  const k = o.kid ? 2 : 0;
  return mk(10, 12, (R) => {
    const r = (a, b, w, h, c) => R(a + 1, b, w, h, c);
    r(2, k, 4, 1, o.trait === 'cap' ? o.cap : o.hair); if (o.trait === 'cap') r(1, k, 1, 1, o.cap);
    if (o.trait === 'bun') r(3, k - 1 < 0 ? 0 : k - 1, 2, 1, o.hairD);
    r(2, k + 1, 4, 2, K.skin); r(4, k + 1, 2, 2, K.skinD); r(3, k + 1, 1, 1, K.eye); r(5, k + 1, 1, 1, K.eye);
    if (o.long) { r(1, k + 1, 1, 3, o.hair); r(6, k + 1, 1, 3, o.hairD); }
    if (o.trait === 'beard') r(3, k + 3, 2, 1, o.hair);
    const ty = k + 3, th = o.kid ? 4 : 5;
    r(1, ty, 6, th, o.top); r(4, ty, 3, th, o.topD);
    if (pose) { r(-1, ty, 2, 1, o.top); r(7, ty, 2, 1, o.topD); }
    r(2, 8, 2, 4, o.bottom); r(4, 8, 2, 4, o.bottomD);
    if (o.trait === 'thermos') { r(7, ty + 1, 1, 3, K.silver); r(7, ty + 1, 1, 1, K.silverD); }
  });
}

// 3×: 14×22 close-up (kids are 4 px shorter)
function big(o, pose) {
  const k = o.kid ? 4 : 0;
  return mk(16, 22, (R) => {
    const r = (a, b, w, h, c) => R(a + 3, b + 2, w, h, c);
    if (o.trait === 'bun') r(4, k - 2, 2, 2, o.hairD);
    r(2, k + 1, 6, 5, K.skin); r(5, k + 1, 3, 5, K.skinD);
    if (o.trait === 'cap') { r(1, k - 1, 8, 2, o.cap); r(5, k - 1, 4, 2, shade(o.cap)); r(-1, k, 2, 1, o.cap); }
    else { r(2, k, 6, 2, o.hair); r(5, k, 3, 2, o.hairD); }
    r(2, k + 2, 1, 2, o.hair); r(7, k + 2, 1, 2, o.hairD);
    if (o.long) { r(1, k + 1, 1, 6, o.hair); r(8, k + 1, 1, 6, o.hairD); }
    r(3, k + 3, 1, 1, K.eye); r(6, k + 3, 1, 1, K.eye);
    if (o.trait === 'glasses') { r(2, k + 3, 6, 1, K.glass); r(3, k + 3, 1, 1, '#BFD9D6'); r(6, k + 3, 1, 1, '#BFD9D6'); }
    if (o.trait === 'beard') { r(3, k + 5, 4, 2, o.hair); r(5, k + 5, 2, 2, o.hairD); }
    const ty = k + 6, th = o.kid ? 5 : 7;
    r(1, ty, 8, th, o.top); r(5, ty, 4, th, o.topD); r(4, ty, 2, 1, K.skin);
    if (pose) { r(-2, ty + 1, 3, 1, o.top); r(9, ty + 1, 3, 1, o.topD); r(-3, ty + 1, 1, 1, K.skin); r(12, ty + 1, 1, 1, K.skinD); }
    else { r(0, ty + 1, 1, th - 2, o.top); r(9, ty + 1, 1, th - 2, o.topD); r(0, ty + th - 1, 1, 1, K.skin); r(9, ty + th - 1, 1, 1, K.skinD); }
    r(2, 13, 3, 6, o.bottom); r(5, 13, 3, 6, o.bottomD); r(2, 19, 3, 1, K.shoe); r(5, 19, 3, 1, K.shoe);
    if (o.trait === 'thermos') { r(10, ty + 2, 2, 5, K.silver); r(10, ty + 2, 2, 1, K.silverD); }
  });
}

// the sprite for a zoom level; `pose` 1 is arms out (tai chi). Feet are at the bottom centre.
export function drawCast(look, zoom, pose = 0) {
  const o = kitLook(look);
  return zoom >= 3 ? big(o, pose) : zoom === 2 ? small(o, pose) : tiny(o);
}
// how tall a person stands at each zoom, in art pixels (for click areas and name tags)
export const CAST_H = { 1: 8, 2: 12, 3: 22 };
