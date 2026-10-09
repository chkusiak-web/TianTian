// Code-drawn placeholder art. Real art replaces any of these through public/assets/manifest.json.
import { PAL } from './palette.js';

export const TILE = 16, CW = 16, CH = 24;

const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.imageSmoothingEnabled = false; return [c, x]; };
const r = (x, col, a, b, w = 1, h = 1) => { x.fillStyle = col; x.fillRect(a, b, w, h); };
// small deterministic noise so tiles don't look flat but stay identical between runs
const rnd = (seed) => { let s = seed; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };

export const TILES = {
  grass_a(x) { r(x, PAL.grass2, 0, 0, 16, 16); const q = rnd(1); for (let i = 0; i < 10; i++) r(x, i % 2 ? PAL.grass1 : PAL.grass3, (q() * 15) | 0, (q() * 15) | 0, 1, 1); },
  grass_b(x) { r(x, PAL.grass2, 0, 0, 16, 16); const q = rnd(7); for (let i = 0; i < 8; i++) r(x, PAL.grass1, (q() * 14) | 0, (q() * 14) | 0, 2, 1); r(x, PAL.grass3, 5, 9, 1, 2); r(x, PAL.grass3, 11, 4, 1, 2); },
  path(x) { r(x, PAL.earth1, 0, 0, 16, 16); const q = rnd(3); for (let i = 0; i < 8; i++) r(x, PAL.earth2, (q() * 15) | 0, (q() * 15) | 0, 1, 1); r(x, PAL.stone2, 3, 6, 2, 1); },
  pave(x) { r(x, PAL.stone2, 0, 0, 16, 16); r(x, PAL.stone1, 0, 0, 16, 1); r(x, PAL.stone1, 0, 8, 16, 1); r(x, PAL.stone3, 0, 7, 16, 1); r(x, PAL.stone3, 0, 15, 16, 1); r(x, PAL.stone3, 8, 0, 1, 7); r(x, PAL.stone3, 3, 8, 1, 7); },
  water_a(x) { r(x, PAL.water2, 0, 0, 16, 16); r(x, PAL.water1, 2, 3, 4, 1); r(x, PAL.water1, 9, 9, 5, 1); r(x, PAL.water3, 5, 12, 4, 1); r(x, PAL.water3, 11, 2, 3, 1); },
  water_b(x) { r(x, PAL.water2, 0, 0, 16, 16); r(x, PAL.water1, 8, 4, 4, 1); r(x, PAL.water1, 1, 10, 5, 1); r(x, PAL.water3, 4, 3, 3, 1); r(x, PAL.water3, 10, 13, 4, 1); },
  wall(x) { r(x, PAL.stone2, 0, 0, 16, 16); r(x, PAL.stone1, 0, 0, 16, 3); r(x, PAL.stone3, 0, 13, 16, 3); for (let i = 0; i < 16; i += 5) r(x, PAL.stone3, i, 3, 1, 10); },
  roof(x) { r(x, PAL.roofGrey, 0, 0, 16, 16); for (let i = 0; i < 16; i += 4) { r(x, '#4A566A', 0, i + 3, 16, 1); r(x, '#7A889C', 0, i, 16, 1); } },
  tree(x) { r(x, PAL.grass2, 0, 0, 16, 16); r(x, PAL.earth3, 7, 10, 3, 6); r(x, PAL.grass4, 2, 1, 12, 10); r(x, PAL.grass3, 3, 1, 10, 8); r(x, PAL.grass2, 4, 2, 6, 4); r(x, PAL.grass1, 5, 3, 3, 2); r(x, PAL.grass4, 11, 7, 3, 4); },
  willow(x) { r(x, PAL.grass2, 0, 0, 16, 16); r(x, PAL.earth3, 7, 6, 2, 10); r(x, PAL.grass3, 1, 1, 14, 4); for (let i = 1; i < 15; i += 2) r(x, i % 4 === 1 ? PAL.grass3 : PAL.grass1, i, 5, 1, 6 + (i % 3)); },
  lotus(x) { TILES.water_a(x); r(x, PAL.grass3, 4, 5, 6, 4); r(x, PAL.grass2, 5, 5, 4, 2); r(x, PAL.lotus, 6, 3, 3, 3); r(x, PAL.stone1, 7, 3, 1, 1); },
  flowers(x) { TILES.grass_a(x); for (const [a, b, c] of [[3, 4, PAL.lotus], [10, 3, PAL.gold1], [6, 10, PAL.stone1], [12, 11, PAL.lotus], [2, 12, PAL.gold1]]) { r(x, PAL.grass3, a, b + 1, 1, 2); r(x, c, a - 1, b, 3, 1); r(x, c, a, b - 1, 1, 3); } },
  stone_step(x) { r(x, PAL.stone2, 0, 0, 16, 16); r(x, PAL.stone1, 1, 1, 14, 6); r(x, PAL.stone3, 1, 8, 14, 1); }
};

// tiles that read as water or obstacles; maps use these names
export const SOLID = new Set(['water', 'lotus', 'wall', 'roof', 'tree', 'willow']);

export function drawTile(name) {
  const [c, x] = mk(TILE, TILE); (TILES[name] || TILES.grass_a)(x); return c;
}

// Objects are bigger than a tile; each returns [w, h] and draws itself on the canvas it is given.
export const OBJECTS = {
  sign(x) { r(x, PAL.earth3, 7, 8, 2, 8); r(x, PAL.earth2, 1, 1, 14, 8); r(x, PAL.earth1, 2, 2, 12, 5); r(x, PAL.earth3, 1, 1, 14, 1); r(x, PAL.earth3, 1, 8, 14, 1); },
  railing(x) { r(x, PAL.stone3, 0, 6, 16, 2); r(x, PAL.stone2, 0, 5, 16, 1); for (let i = 1; i < 16; i += 5) r(x, PAL.stone3, i, 5, 2, 8); },
  // ticket booth: roof, two posts and an open window (transparent) so the clerk shows behind the counter
  window(x) { r(x, PAL.roofRed, 0, 0, 32, 4); r(x, '#9A4432', 0, 3, 32, 1); r(x, PAL.earth3, 0, 4, 3, 20); r(x, PAL.earth3, 29, 4, 3, 20); r(x, PAL.earth3, 0, 13, 32, 11); r(x, PAL.earth2, 0, 13, 32, 2); r(x, PAL.earth1, 4, 17, 24, 4); },
  lantern(x) { r(x, PAL.earth3, 7, 6, 2, 10); r(x, PAL.roofRed, 4, 1, 8, 7); r(x, PAL.gold1, 6, 3, 4, 3); },
  stele(x) { r(x, PAL.stone3, 3, 2, 10, 13); r(x, PAL.stone2, 4, 2, 8, 12); r(x, PAL.stone1, 4, 2, 8, 1); r(x, PAL.stone3, 2, 14, 12, 2); for (let i = 5; i < 12; i += 2) r(x, PAL.stone3, 6, i, 4, 1); },
  signpost(x) { r(x, PAL.earth3, 7, 7, 2, 9); r(x, PAL.earth3, 1, 1, 14, 7); r(x, PAL.earth1, 2, 2, 12, 5); r(x, PAL.earth2, 11, 3, 2, 3); },
  spring_a(x) { for (const cx of [3, 8, 13]) { r(x, PAL.water1, cx - 2, 10, 5, 2); r(x, PAL.stone1, cx - 1, 6, 3, 4); r(x, PAL.stone1, cx, 4, 1, 2); } },
  spring_b(x) { for (const cx of [3, 8, 13]) { r(x, PAL.water1, cx - 2, 10, 5, 2); r(x, PAL.stone1, cx - 1, 7, 3, 3); r(x, PAL.stone1, cx - 1, 5, 1, 1); r(x, PAL.stone1, cx + 1, 4, 1, 1); } },
  marker(x) { r(x, PAL.line, 3, 0, 10, 8); r(x, PAL.gold1, 4, 1, 8, 6); r(x, PAL.line, 7, 2, 2, 3); r(x, PAL.line, 7, 6, 2, 1); r(x, PAL.line, 5, 8, 6, 1); r(x, PAL.gold2, 6, 8, 4, 1); r(x, PAL.line, 6, 9, 4, 1); r(x, PAL.gold2, 7, 9, 2, 1); r(x, PAL.line, 7, 10, 2, 1); },
  bench(x) { r(x, PAL.earth3, 1, 8, 14, 3); r(x, PAL.earth2, 1, 7, 14, 2); r(x, PAL.earth3, 2, 11, 2, 4); r(x, PAL.earth3, 12, 11, 2, 4); }
};
export const OBJECT_SIZE = { sign: [16, 16], railing: [16, 16], window: [32, 24], lantern: [16, 16], bench: [16, 16], stele: [16, 16], signpost: [16, 16], spring_a: [16, 12], spring_b: [16, 12], marker: [16, 11] };
export function drawObject(name) {
  const [w, h] = OBJECT_SIZE[name] || [16, 16]; const [c, x] = mk(w, h); (OBJECTS[name] || OBJECTS.sign)(x); return c;
}

// 16×24 person, 4 directions × 4 walk frames, warm outline. opts: hair, skin, top, bottom, trait ('cap'|'bun'|'thermos'|'glasses'|'none'), long
export const DIRS = ['down', 'left', 'right', 'up'];
export function drawPerson(opts, dir, frame) {
  const o = { hair: PAL.line, skin: PAL.skin1, top: PAL.cloth, bottom: PAL.roofGrey, trait: 'none', ...opts };
  const [c, x] = mk(CW, CH);
  const k = o.kid ? 4 : 0;                                      // kids are 4px shorter: same head, shorter body and legs
  const step = [0, 1, 0, -1][frame % 4];                        // leg swing
  const bob = frame % 2 ? 1 : 0;
  const side = dir === 'left' || dir === 'right';
  // legs
  const legL = side ? 6 + step : 5, legR = side ? 8 - step : 9, legTop = 17 + (o.kid ? 2 : 0), legH = 22 - legTop;
  r(x, o.bottom, legL, legTop, 3, legH - (step > 0 ? 1 : 0)); r(x, o.bottom, legR, legTop, 3, legH - (step < 0 ? 1 : 0));
  r(x, PAL.line, legL, 22, 3, 1); r(x, PAL.line, legR, 22, 3, 1);
  // torso + arms
  const ty = 10 + bob + k, th = o.kid ? 6 : 8;
  r(x, o.top, 4, ty, 8, th); r(x, o.skin, 3, ty + 2, 1, th - 4); r(x, o.skin, 12, ty + 2, 1, th - 4);
  // head
  const hy = 2 + bob + k;
  r(x, o.skin, 4, hy, 8, 8);
  r(x, o.hair, 4, hy - 1, 8, 3);
  if (dir === 'down') { r(x, PAL.line, 6, hy + 4, 1, 2); r(x, PAL.line, 9, hy + 4, 1, 2); }
  else if (dir === 'up') { r(x, o.hair, 4, hy - 1, 8, 7); }
  else { r(x, o.hair, dir === 'left' ? 9 : 4, hy - 1, 3, 6); r(x, PAL.line, dir === 'left' ? 5 : 10, hy + 4, 1, 2); }
  if (o.long) { r(x, o.hair, 3, hy + 1, 1, 7); r(x, o.hair, 12, hy + 1, 1, 7); }
  // trait: one clear silhouette detail each
  if (o.trait === 'cap') { r(x, o.cap || PAL.roofRed, 3, hy - 2, 10, 3); r(x, o.cap || PAL.roofRed, dir === 'left' ? 1 : dir === 'right' ? 12 : 3, hy + 1, 3, 1); }
  if (o.trait === 'bun') r(x, o.hair, 6, Math.max(0, hy - 3), 4, 2);
  if (o.trait === 'thermos') { r(x, PAL.stone1, 12, ty + 3, 3, 6); r(x, PAL.stone3, 12, ty + 3, 3, 1); }
  if (o.trait === 'glasses' && dir !== 'up') r(x, PAL.line, 5, hy + 3, 6, 1);
  if (o.trait === 'beard' && dir !== 'up') r(x, PAL.stone2, 5, hy + 6, 6, 2);
  return outline(c);
}

// 64×64 dialogue portrait: the person's head and shoulders, scaled ×4 (placeholder until real portraits exist)
export function drawPortrait(opts) {
  const src = drawPerson(opts, 'down', 0);
  const [c, x] = mk(64, 64);
  x.fillStyle = PAL.sky; x.fillRect(0, 0, 64, 64);
  x.drawImage(src, 0, 0, 16, 16, 0, 4, 64, 64);
  return c;
}

// 1px warm outline around every opaque pixel (characters only), plus a soft shadow on the ground
function outline(src) {
  const [c, x] = mk(CW, CH), sx = src.getContext('2d');
  const d = sx.getImageData(0, 0, CW, CH).data; const on = (px, py) => px >= 0 && py >= 0 && px < CW && py < CH && d[(py * CW + px) * 4 + 3] > 0;
  x.fillStyle = 'rgba(42,38,34,0.25)'; x.fillRect(3, 22, 11, 2);
  x.fillStyle = PAL.line;
  for (let py = 0; py < CH; py++) for (let px = 0; px < CW; px++) if (!on(px, py) && (on(px - 1, py) || on(px + 1, py) || on(px, py - 1) || on(px, py + 1))) x.fillRect(px, py, 1, 1);
  x.drawImage(src, 0, 0);
  return c;
}

export function personSheet(opts) {
  const [c, x] = mk(CW * 4, CH * 4);
  DIRS.forEach((dir, row) => { for (let f = 0; f < 4; f++) x.drawImage(drawPerson(opts, dir, f), f * CW, row * CH); });
  return c;
}
