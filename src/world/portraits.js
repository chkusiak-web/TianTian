// Code-drawn 64×64 pixel portraits for the dialogue box (Moondog, Oct 9), in a 32-bit style: shapes with hard edges,
// 4-tone ramps lit from the upper left, cast shadows from layers above, a warm outline on the silhouette, then hand-placed pixels for the face.
// drawPortrait(id, expression) returns { w, h, px } where px is a Uint32 array of 0xRRGGBBAA (0 = clear).

const W = 64, H = 64;
const hex = (h) => (parseInt(h.slice(1), 16) << 8 | 255) >>> 0;
const rgb = (v) => '#' + (v >>> 8).toString(16).padStart(6, '0').toUpperCase();

// ---- shape tests ------------------------------------------------------------------------------------------
const ellipse = (cx, cy, rx, ry) => (x, y) => ((x + .5 - cx) / rx) ** 2 + ((y + .5 - cy) / ry) ** 2 <= 1;
const rect = (x0, y0, x1, y1) => (x, y) => x >= x0 && x <= x1 && y >= y0 && y <= y1;
function poly(pts) {
  return (x, y) => {
    const px = x + .5, py = y + .5; let inside = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const [xi, yi] = pts[i], [xj, yj] = pts[j];
      if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  };
}
const and = (a, b) => (x, y) => a(x, y) && b(x, y);
const not = (a) => (x, y) => !a(x, y);

// ---- renderer -----------------------------------------------------------------------------------------------
// ramp = [deep, shade, base, light]; a shape: { test, ramp, hi (rim light width), sh (shadow width), casts, flat }
function render(shapes, outline = '#3A2A24') {
  const owner = new Int16Array(W * H).fill(-1);
  shapes.forEach((s, i) => { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (s.test(x, y)) owner[y * W + x] = i; });
  const own = (x, y) => (x < 0 || y < 0 || x >= W || y >= H) ? -1 : owner[y * W + x];
  const px = new Uint32Array(W * H), mat = new Array(W * H).fill(null);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = own(x, y); if (i < 0) continue;
    const s = shapes[i]; let lv = 2;
    if (s.sh && !s.test(x + s.sh, y + s.sh)) lv = 1;
    if (s.sh && !s.test(x + 1, y + 1)) lv = s.sh > 1 ? 0 : 1;
    if (s.hi && !s.test(x - s.hi, y - s.hi) && lv === 2) lv = 3;
    const o = own(x, y - 1); if (o > i && shapes[o].casts) lv = Math.max(0, Math.min(lv, 2) - 1);
    if (s.flat != null) lv = s.flat;
    px[y * W + x] = hex(s.ramp[lv]); mat[y * W + x] = s.ramp;
  }
  const solid = (x, y) => x >= 0 && y >= 0 && x < W && (y >= H || px[y * W + x] !== 0);
  const line = hex(outline), out = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (px[y * W + x] && (!solid(x - 1, y) || !solid(x + 1, y) || !solid(x, y - 1) || !solid(x, y + 1))) out.push(y * W + x);
  for (const k of out) px[k] = line;
  return { px, mat };
}

// ---- shared palettes ----------------------------------------------------------------------------------------
const INK = '#2A2622', WHITE = '#FFFFFF', BLUSH = '#EBA088', MOUTH = '#6B2A22', TEETH = '#FBF4E2', TONGUE = '#D9735E', SWEAT = ['#BFE3EE', '#8CCBE0'];
const SKIN = {
  fair: ['#B9775A', '#DDA17E', '#F2C6A2', '#FBE0C8'],
  warm: ['#A86A4C', '#CF9070', '#EBB78F', '#F8D6B6'],
  tan:  ['#8C5438', '#B4734F', '#D69A70', '#ECBC92']
};

// ---- the cast -----------------------------------------------------------------------------------------------
// Each person: palettes, the shapes behind the head (back), the body, the shapes in front of the face (front),
// face settings, and extras painted last. Coordinates are portrait pixels; the face is centred on x = 32.
const C = (x, y, rx, ry = rx) => ellipse(x, y, rx, ry);

const ADULT = { drop: 4, face: C(32, 32.5, 14.5, 15), cut: 46, neck: poly([[26, 44], [38, 44], [39.5, 55], [24.5, 55]]), ears: [[17.5, 34], [46.5, 34]], ey: 33, my: 42 };
const KID = { drop: 3, face: C(32, 36, 14, 13.5), cut: 49, neck: poly([[26.5, 47], [37.5, 47], [39, 57], [25, 57]]), ears: [[18, 37], [46, 37]], ey: 37, my: 45 };

// the standard pair of shoulders, with an optional V or round neckline
function shoulders(add, top, { v, round, kid, shirt, trim } = {}) {
  add(kid ? C(32, 72, 25, 17) : C(32, 70, 30, 19), top, { hi: 2, sh: 3 });
  if (v && shirt) add(poly([[25, 51], [39, 51], [32, 63]]), shirt, { sh: 1 });
  if (v && trim) {
    add(poly([[22, 52], [26, 50], [33, 64], [28, 64]]), trim, { hi: 1, sh: 1, casts: true });
    add(poly([[42, 52], [38, 50], [31, 64], [36, 64]]), trim, { hi: 1, sh: 1, casts: true });
  }
  if (round) add(and(C(32, kid ? 56 : 52, 6, 3.5), rect(0, 0, 64, 64)), shirt, { flat: 1 });
}

export const CAST = {
  // 王奶奶: curly grey hair in a bun, round glasses on a chain, floral red coat. Warm, fussy, everyone's grandma.
  wang: {
    bg: '#F6E4A6', // backdrop: butter, the field-gold family
    en: 'Grandma Wang', skin: SKIN.fair,
    hair: ['#77716B', '#A29C94', '#CAC4BA', '#ECE8E0'],
    pal: { coat: ['#6E2A20', '#9E3F2D', '#C9573D', '#E27A5C'], trim: ['#A8906A', '#D8C29C', '#F0E2C4', '#FBF4E2'], shirt: ['#B8AC98', '#D9D0BE', '#EEE7D8', '#FBF7EC'] },
    back(add, h) {
      add(C(32, 10.5, 6, 4.5), h, { hi: 2, sh: 2 });                                                     // bun, sitting low
      for (const [x, y, rx, ry] of [[17, 24, 5.5, 5.5], [16, 31, 5, 5], [17.5, 37, 4, 4], [47, 24, 5.5, 5.5], [48, 31, 5, 5], [46.5, 37, 4, 4],
        [22, 17, 6, 5.5], [29, 15, 6.5, 5], [35, 15, 6.5, 5], [42, 17, 6, 5.5]]) add(C(x, y, rx, ry), h, { hi: 1, sh: 2 });
      add(rect(29, 11, 35, 12), this.pal.coat, { flat: 2 });
    },
    body(add) { shoulders(add, this.pal.coat, { v: true, shirt: this.pal.shirt, trim: this.pal.trim }); },
    front(add, h) { for (const [x, y, rx, ry] of [[23, 19.5, 6, 3.5], [32, 17.5, 7, 3.5], [41, 19.5, 6, 3.5], [18.5, 25, 3, 4], [45.5, 25, 3, 4]]) add(C(x, y, rx, ry), h, { hi: 1, sh: 1, casts: true }); },
    face: { brow: '#8F887E', lip: '#B5523F', neutral: 'smile', glasses: '#8A5E3C', chain: '#D9B36A', wrinkles: 2, blush: true },
    extra(p, q) { prints(p, q, ['#C9573D', '#9E3F2D', '#E27A5C', '#6E2A20'], [[12, 56], [20, 61], [46, 57], [53, 61], [8, 62], [41, 62], [24, 55]], '#F3D9B0', '#E8B04A', '#8FA37A'); }
  },

  // 张老师: retired teacher and local historian. Balding, white hair at the sides, long white goatee and drooping
  // moustache, bushy white brows, indigo silk tai chi jacket with gold knotted buttons. Calm, a little mischievous.
  zhang: {
    bg: '#CDE8CF', // backdrop: mint
    en: 'Teacher Zhang', skin: SKIN.warm,
    hair: ['#8E8A84', '#BDB8B0', '#E2DED6', '#F8F6F0'],
    pal: { coat: ['#1E2840', '#2C3A58', '#3E5078', '#5A6E98'], knot: ['#8A6A2A', '#C08A2C', '#E8B04A', '#F6DA5C'] },
    back(add, h) {
      add(C(32, 28, 16, 13.5), h, { hi: 1, sh: 2 });                                                     // thin rim behind the crown
      add(C(17, 31, 3.5, 6), h, { hi: 1, sh: 2 }); add(C(47, 31, 3.5, 6), h, { hi: 1, sh: 2 });
    },
    body(add) {
      shoulders(add, this.pal.coat, {});
      add(poly([[26, 50], [38, 50], [37, 55], [27, 55]]), this.pal.coat, { hi: 1, sh: 1 });            // standing collar
      add(rect(31, 55, 32, 64), this.pal.coat, { flat: 1 });                                               // front seam
    },
    front(add, h) {
      add(and(C(32, 19.5, 12, 3), not(C(32, 22, 8, 3))), h, { hi: 1, sh: 1, casts: true });               // receding hairline
      add(poly([[25, 41], [28, 38.5], [32, 39.5], [36, 38.5], [39, 41], [37.5, 42.5], [32, 41], [26.5, 42.5]]), h, { hi: 1, sh: 1 }); // drooping moustache
      add(poly([[28.5, 44], [35.5, 44], [35, 50], [33.5, 57], [32, 60], [30.5, 57], [29, 50]]), h, { hi: 1, sh: 2, casts: true }); // long goatee
    },
    face: { brow: '#D6D1C8', browThick: true, browLong: true, lip: '#A65A45', neutral: 'smile', wrinkles: 2, forehead: true, eyeSmall: true },
    extra(p) { for (const y of [60, 63]) { p(30, y, '#E8B04A'); p(33, y, '#E8B04A'); p(29, y, '#C08A2C'); p(34, y, '#C08A2C'); } }
  },

  // 老潘: taxi driver who never stops talking. Flat cap, stubble, sun-tanned, grey work jacket over a white vest,
  // big gap-free grin.
  pan: {
    bg: '#CFE4F1', // backdrop: sky
    en: 'Old Pan', skin: SKIN.tan,
    hair: ['#1E1C1A', '#2E2B28', '#45403B', '#5E5751'],
    pal: { cap: ['#2B2B33', '#3E3F4A', '#555766', '#6E7182'], coat: ['#4A4E52', '#6A7075', '#8C9399', '#AAB1B6'], shirt: ['#B8AC98', '#D9D0BE', '#EEE7D8', '#FBF7EC'] },
    back(add, h) { add(C(18, 30, 3.5, 5), h, { sh: 1 }); add(C(46, 30, 3.5, 5), h, { sh: 1 }); },
    body(add) {
      shoulders(add, this.pal.coat, { v: true, shirt: this.pal.shirt });
      add(poly([[21, 53], [27, 50], [32, 60], [29, 64], [24, 64]]), this.pal.coat, { hi: 1, sh: 2, casts: true });   // collar flaps
      add(poly([[43, 53], [37, 50], [32, 60], [35, 64], [40, 64]]), this.pal.coat, { hi: 1, sh: 2, casts: true });
    },
    front(add) {
      add(and(C(32, 21, 16.5, 9), rect(0, 0, 64, 24)), this.pal.cap, { hi: 2, sh: 2, casts: true });    // flat cap crown
      add(poly([[17, 22], [47, 22], [45, 26], [19, 26]]), this.pal.cap, { sh: 1, flat: 0, casts: true }); // brim
      add(rect(31, 13, 33, 14), this.pal.cap, { flat: 3 });                                                 // button
    },
    face: { brow: '#2E2B28', browThick: true, lip: '#93503A', neutral: 'grin', wrinkles: 1, stubble: '#B88A68', noseBig: true },
  },

  // 林姐: retail pro, your courtyard neighbour. Straight black hair to the shoulders with a side part,
  // cobalt-blue blouse (no green on anyone: it gets lost on the grass), gold stud earrings, red lips. Quick and sure of herself.
  lin: {
    bg: '#F7D3BF', // backdrop: salmon
    en: 'Sister Lin', skin: SKIN.fair,
    hair: ['#141418', '#24242C', '#363642', '#55556A'],
    pal: { top: ['#1C3A78', '#2852A0', '#2F6FD6', '#6A9BEA'], shirt: ['#1C3A78', '#2852A0', '#2F6FD6', '#6A9BEA'] },
    back(add, h) { add(C(32, 25, 17, 15), h, { hi: 1, sh: 2 }); add(poly([[15, 26], [49, 26], [50, 53], [14, 53]]), h, { sh: 2 }); },
    body(add) { shoulders(add, this.pal.top, {}); add(poly([[27, 51], [37, 51], [32, 58]]), SKIN.fair, { flat: 1 }); },
    front(add, h) {
      add(and(C(25, 19, 11, 5.5), not(rect(32, 0, 64, 64))), h, { hi: 1, sh: 1, casts: true });            // swept fringe, left of the part
      add(poly([[32, 14], [47, 18], [47, 30], [44, 24], [36, 21]]), h, { hi: 1, sh: 2, casts: true });     // right side falls straight
      add(poly([[16, 22], [20, 20], [19, 42], [16, 46]]), h, { sh: 2, casts: true });                     // strands by the face
      add(poly([[44, 24], [48, 22], [48, 46], [45, 42]]), h, { sh: 2, casts: true });
    },
    face: { brow: '#24242C', lip: '#C2433A', lips: true, neutral: 'smirk', lashes: true, blush: true, earrings: '#E8B04A' },
    extra(p, q, ph) { for (const [x, y] of [[22, 16], [23, 16], [24, 15], [26, 15], [27, 15], [42, 20], [43, 21]]) ph(x, y, '#6E6E88'); }    // hair shine
  },

  // 陈女士: works every ticket window in Jinan. Neat black hair in a low bun, slate uniform jacket, white collar,
  // red ribbon tie, name badge. Brisk and polite.
  chen: {
    bg: '#F5CDD8', // backdrop: pink
    en: 'Ms. Chen', skin: SKIN.warm,
    hair: ['#1A1614', '#2B2420', '#3E3530', '#5A4E46'],
    pal: { coat: ['#2C3640', '#3E4C5A', '#566878', '#728898'], shirt: ['#B8AC98', '#D9D0BE', '#F4EFE4', '#FFFFFF'], tie: ['#7A2222', '#A83030', '#D9573A', '#E8806A'] },
    back(add, h) { add(C(32, 10.5, 5, 4), h, { hi: 2, sh: 2 }); add(C(32, 25, 15.5, 13), h, { hi: 1, sh: 2 }); add(rect(30, 13, 34, 13), ['#7A2222', '#A83030', '#D9573A', '#E8806A'], { flat: 2 }); },
    body(add) {
      shoulders(add, this.pal.coat, { v: true, shirt: this.pal.shirt });
      add(poly([[25, 50], [30, 51], [32, 56], [26, 54]]), this.pal.shirt, { sh: 1, casts: true });           // shirt collar points
      add(poly([[39, 50], [34, 51], [32, 56], [38, 54]]), this.pal.shirt, { sh: 1, casts: true });
      add(poly([[30, 55], [34, 55], [33, 58], [34, 62], [32, 64], [30, 62], [31, 58]]), this.pal.tie, { hi: 1, sh: 1 });
      add(rect(41, 56, 47, 59), ['#8A6A2A', '#C08A2C', '#E8B04A', '#F6DA5C'], { hi: 1, sh: 1 });             // name badge
    },
    front(add, h) {
      add(and(C(24, 20, 9.5, 5), not(rect(31.5, 0, 64, 64))), h, { hi: 1, sh: 1, casts: true });           // centre part, combed to the sides
      add(and(C(40, 20, 9.5, 5), not(rect(0, 0, 32.5, 64))), h, { hi: 1, sh: 1, casts: true });
      add(C(17.5, 27, 2.5, 5), h, { sh: 1 }); add(C(46.5, 27, 2.5, 5), h, { sh: 1 });
    },
    face: { brow: '#2B2420', lip: '#B5523F', neutral: 'flat', lashes: true },
    extra(p) { p(42, 57, '#FBF4E2'); p(43, 57, '#FBF4E2'); p(44, 57, '#FBF4E2'); p(42, 58, '#FBF4E2'); p(43, 58, '#FBF4E2'); }
  },

  // 小谢: the friend who drags you everywhere and knows everyone. Brown hair in a high ponytail with blunt bangs,
  // pink hoodie, a yellow hair clip, big bright eyes.
  xie: {
    bg: '#C4EBEC', // backdrop: spring water
    en: 'Xiao Xie', skin: SKIN.fair,
    hair: ['#4A2E1E', '#6B4530', '#8E6040', '#B07E58'],
    pal: { top: ['#A84C66', '#D06A86', '#F08FA8', '#F9B8C8'], cord: ['#D9D0BE', '#EEE7D8', '#FBF7EC', '#FFFFFF'] },
    back(add, h) {
      add(poly([[44, 12], [52, 14], [55, 28], [53, 42], [48, 46], [50, 30]]), h, { hi: 1, sh: 2 });           // ponytail swinging right
      add(C(32, 24, 15.5, 13.5), h, { hi: 1, sh: 2 });
      add(C(46, 13, 3, 3), ['#C08A2C', '#E8B04A', '#F6DA5C', '#FFF0A0'], { hi: 1, sh: 1 });                   // tie
    },
    body(add) {
      shoulders(add, this.pal.top, {});
      add(and(C(32, 50, 11, 5), not(C(32, 49, 6, 3))), this.pal.top, { hi: 1, sh: 2, casts: true });        // hood ring
      add(rect(28, 54, 28, 61), this.pal.cord, { flat: 2 }); add(rect(36, 54, 36, 61), this.pal.cord, { flat: 2 });
    },
    front(add, h) {
      add(and(C(32, 19, 15, 6.5), not(rect(0, 23, 64, 64))), h, { hi: 1, sh: 1, casts: true });           // blunt bangs
      add(C(18, 28, 2.5, 7), h, { sh: 1 }); add(C(46, 28, 2.5, 7), h, { sh: 1 });
      add(rect(20, 18, 24, 19), ['#C08A2C', '#E8B04A', '#F6DA5C', '#FFF0A0'], { hi: 1, sh: 1 });             // hair clip
    },
    face: { brow: '#6B4530', lip: '#D06A6A', neutral: 'grin', lashes: true, bigEyes: true, blush: true },
    extra(p, q, ph) { for (const [x, y] of [[27, 15], [28, 15], [29, 15], [36, 15], [37, 15]]) ph(x, y, '#C89A70'); }
  },

  // 乐乐: Ms. Chen's 8-year-old, riddle-mad. Red cap, black tufts sticking out, yellow T-shirt, freckles,
  // gap-toothed grin.
  lele: {
    bg: '#DCEDB2', // backdrop: grass
    en: 'Lele', skin: SKIN.warm, kid: true,
    hair: ['#141210', '#24201C', '#36302A', '#4E463E'],
    pal: { cap: ['#7A2A1E', '#A83E2C', '#D9573A', '#EE8466'], top: ['#B07A1E', '#D8A030', '#F0C048', '#F8DC80'], shirt: ['#B07A1E', '#D8A030', '#F0C048', '#F8DC80'] },
    back(add, h) { for (const [x, y] of [[17, 30], [47, 30], [15.5, 34], [48.5, 34], [19, 27], [45, 27]]) add(C(x, y, 3, 3), h, { hi: 1, sh: 1 }); },
    body(add) { shoulders(add, this.pal.top, { kid: true }); add(and(C(32, 55, 6, 3), not(C(32, 54, 5, 2))), this.pal.top, { flat: 0 }); },
    front(add) {
      add(and(C(32, 26, 15.5, 11), rect(0, 0, 64, 27)), this.pal.cap, { hi: 2, sh: 2, casts: true });
      add(poly([[17, 25], [47, 25], [51, 29], [13, 29]]), this.pal.cap, { flat: 0, casts: true });           // brim
      add(rect(31, 15, 33, 16), this.pal.cap, { flat: 3 });
    },
    face: { brow: '#24201C', lip: '#B5604A', neutral: 'smirk', freckles: '#C98B68', gap: true, blush: true, bigEyes: true },
  }
};

// floral print etc.: small motifs on a material, only where that material shows
function prints(p, q, ramp, spots, petal, center, leaf) {
  const on = (x, y) => ramp.includes(q(x, y));
  for (const [x, y] of spots) {
    if (!on(x, y)) continue;
    const dim = q(x, y) === ramp[1] || q(x, y) === ramp[3] ? q(x, y) === ramp[1] : false;
    for (const [dx, dy] of [[0, -1], [-1, 0], [1, 0], [0, 1]]) if (on(x + dx, y + dy)) p(x + dx, y + dy, dim ? '#D8B892' : petal);
    p(x, y, center); if (on(x + 2, y + 1)) p(x + 2, y + 1, leaf);
  }
}

// ---- the face ----------------------------------------------------------------------------------------------
function face(p, ex, f, g, skin) {
  const ey = g.ey, my = g.my, line = skin[1], dark = skin[0];
  const L = 25, Rx = 37;                                                  // left edge of each eye
  if (f.blush) for (const cx of [L - 2, Rx + 2]) for (let dx = 0; dx < 3; dx++) for (let dy = 0; dy < 2; dy++) p(cx + dx, ey + 5 + dy, BLUSH);
  if (f.freckles) for (const [x, y] of [[22, ey + 4], [24, ey + 5], [23, ey + 6], [40, ey + 4], [42, ey + 5], [41, ey + 6]]) p(x, y, f.freckles);
  if (f.stubble) for (let x = 24; x <= 40; x++) for (let y = my - 3; y <= my + 5; y++) if ((x + y) % 3 === 0 && Math.abs(x - 32) + (y - my) * 1.6 < 11) p(x, y, f.stubble);
  // nose
  if (f.noseBig) { p(32, ey + 3, line); p(33, ey + 4, line); p(30, ey + 6, dark); p(34, ey + 6, dark); p(31, ey + 6, line); p(33, ey + 6, line); }
  else { p(32, ey + 3, line); p(33, ey + 4, line); p(31, ey + 5, line); p(33, ey + 5, line); }
  // age
  if (f.wrinkles) { p(27, my - 1, line); p(26, my - 2, line); p(37, my - 1, line); p(38, my - 2, line); }
  if (f.wrinkles > 1) { p(20, ey - 2, line); p(20, ey + 1, line); p(44, ey - 2, line); p(44, ey + 1, line); }
  if (f.forehead) for (let x = 28; x <= 36; x++) if (x % 4 !== 0) p(x, ey - 10, line);
  if (f.earrings) { p(17, ey + 5, f.earrings); p(47, ey + 5, f.earrings); }

  const brow = (x0, y0, y1, n = 4) => {
    for (let i = 0; i < n; i++) { const y = Math.round(y0 + (y1 - y0) * i / (n - 1)); p(x0 + i, y, f.brow); if (f.browThick) p(x0 + i, y - 1, f.brow); }
    if (f.browLong) { const outer = x0 < 32 ? x0 - 1 : x0 + n; p(outer, y0 + (x0 < 32 ? 1 : 0) + (x0 < 32 ? 0 : y1 - y0 + 1), f.brow); p(outer, (x0 < 32 ? y0 : y1) + 1, f.brow); }
  };
  const eye = (cx, h = 3) => {
    const hh = f.eyeSmall ? 2 : f.bigEyes ? 4 : h, top = ey + 3 - hh;
    for (let dy = 0; dy < hh; dy++) { p(cx, top + dy, INK); p(cx + 1, top + dy, INK); if (f.bigEyes) p(cx + 2, top + dy, INK); }
    p(cx, top, WHITE); if (f.bigEyes) p(cx + 2, top + hh - 1, '#6B5A50');
    for (let dx = -1; dx <= (f.bigEyes ? 3 : 2); dx++) p(cx + dx, top - 1, f.lashes ? INK : '#5A463C');
    if (f.lashes) p(cx + (cx < 32 ? -2 : (f.bigEyes ? 4 : 3)), top - 1, INK);
  };
  const closed = (cx) => { p(cx - 1, ey + 2, INK); p(cx, ey + 1, INK); p(cx + 1, ey + 1, INK); p(cx + 2, ey + 2, INK); if (f.bigEyes) { p(cx + 2, ey + 1, INK); p(cx + 3, ey + 2, INK); } };
  const squint = (cx) => { for (let dx = -1; dx <= 2; dx++) p(cx + dx, ey + 2, INK); };
  const lip = f.lip;
  const smile = (w = 3, up = 1) => { for (let x = 32 - w; x <= 32 + w; x++) p(x, my, lip); for (let i = 1; i <= up; i++) { p(32 - w - i, my - i, lip); p(32 + w + i, my - i, lip); } };
  const open = (w = 4, gap) => {
    for (let x = 32 - w; x <= 32 + w; x++) p(x, my - 1, MOUTH);
    for (let x = 32 - w + 1; x <= 32 + w - 1; x++) { p(x, my, MOUTH); p(x, my - 1, TEETH); }
    for (let x = 32 - w + 2; x <= 32 + w - 2; x++) p(x, my + 1, MOUTH);
    for (let x = 31; x <= 33; x++) p(x, my, TONGUE);
    if (gap) p(32, my - 1, MOUTH);
    p(32 - w - 1, my - 2, lip); p(32 + w + 1, my - 2, lip);
  };

  if (ex === 'neutral') {
    eye(L); eye(Rx); brow(L - 2, ey - 6, ey - 6); brow(Rx, ey - 6, ey - 6);
    if (f.neutral === 'smile') smile(3, 2);
    if (f.neutral === 'flat') { smile(3, 1); }
    if (f.neutral === 'grin') { for (let x = 28; x <= 36; x++) { p(x, my - 1, lip); p(x, my, TEETH); } p(29, my + 1, lip); p(30, my + 1, lip); p(31, my + 1, lip); p(32, my + 1, lip); p(33, my + 1, lip); p(34, my + 1, lip); p(35, my + 1, lip); p(27, my - 2, lip); p(37, my - 2, lip); }
    if (f.neutral === 'smirk') { for (let x = 29; x <= 35; x++) p(x, my, lip); p(36, my - 1, lip); p(37, my - 2, lip); }
    if (f.lips) { for (let x = 30; x <= 34; x++) p(x, my + 1, '#D9706A'); }
  }
  if (ex === 'happy') {
    closed(L); closed(Rx); brow(L - 2, ey - 7, ey - 7); brow(Rx, ey - 7, ey - 7);
    open(4, f.gap);
  }
  if (ex === 'worried') {
    eye(L); eye(Rx); brow(L - 2, ey - 5, ey - 7); brow(Rx, ey - 7, ey - 5);
    p(31, my, lip); p(32, my, lip); p(33, my, lip); p(30, my + 1, lip); p(34, my + 1, lip);
    p(46, ey - 9, SWEAT[0]); p(46, ey - 8, SWEAT[1]); p(45, ey - 8, SWEAT[0]); p(46, ey - 7, SWEAT[1]);
  }
  if (ex === 'confused') {
    eye(L); squint(Rx); brow(L - 2, ey - 8, ey - 7); brow(Rx, ey - 5, ey - 5);
    p(29, my, lip); p(30, my - 1, lip); p(31, my, lip); p(32, my, lip); p(33, my - 1, lip); p(34, my - 1, lip);
  }

  // glasses go over the eyes
  if (f.glasses) {
    const ring = (cx, cy) => { for (let a = 0; a < 64; a++) { const t = a / 64 * Math.PI * 2; p(Math.round(cx + Math.cos(t) * 5), Math.round(cy + Math.sin(t) * 4.4), f.glasses); } };
    ring(26, ey); ring(38, ey); p(31, ey - 1, f.glasses); p(32, ey - 1, f.glasses); p(33, ey - 1, f.glasses);
    for (let x = 18; x <= 21; x++) p(x, ey - 1, f.glasses); for (let x = 43; x <= 46; x++) p(x, ey - 1, f.glasses);
    p(23, ey - 3, WHITE); p(24, ey - 3, WHITE); p(35, ey - 3, WHITE); p(36, ey - 3, WHITE);
  }
  if (f.chain) for (let i = 0; i < 9; i++) { p(19 - (i > 5 ? 1 : 0), ey + 1 + i * 2, f.chain); p(45 + (i > 5 ? 1 : 0), ey + 1 + i * 2, f.chain); }
}

// ---- build one portrait -------------------------------------------------------------------------------------
export const EXPRESSIONS = ['neutral', 'happy', 'worried', 'confused'];
export function drawPortrait(id, ex = 'neutral') {
  const c = CAST[id], g = c.kid ? KID : ADULT, S = [];
  const D = g.drop;                                                       // the head sits D px lower than it is drawn
  const add = (test, ramp, o = {}) => S.push({ test, ramp, hi: 0, sh: 0, ...o });
  const addH = (test, ramp, o) => add((x, y) => test(x, y - D), ramp, o);
  c.back(addH, c.hair);
  add(g.neck, c.skin, { flat: 1 });
  c.body(add);
  for (const [x, y] of g.ears) addH(C(x, y, 2.5, 4), c.skin, { sh: 1 });
  addH(and(g.face, not(rect(0, g.cut, 64, 64))), c.skin, { sh: 3, casts: true });
  c.front(addH, c.hair);
  const { px } = render(S);
  const p = (x, y, col) => { if (x >= 0 && y >= 0 && x < W && y < H && px[y * W + x]) px[y * W + x] = hex(col); };
  const ph = (x, y, col) => p(x, y + D, col);
  const q = (x, y) => (x >= 0 && y >= 0 && x < W && y < H && px[y * W + x]) ? rgb(px[y * W + x]) : null;
  if (c.extra) c.extra(p, q, ph);
  face(ph, ex, c.face, g, c.skin);
  return { w: W, h: H, px };
}

// The frame shows a 48×48 window of the 64×64 drawing, so it fills a 192 px frame at exactly ×4.
// The window is centred on the face, and moved up only as far as needed to keep the top of the hair in view.
export const VIEW = 48;
export function frameOf(id) {
  const c = CAST[id], g = c.kid ? KID : ADULT, { px } = drawPortrait(id);
  let top = 0; while (top < H && !px.subarray(top * W, top * W + W).some(Boolean)) top++;
  const faceY = (c.kid ? 36 : 32.5) + g.drop;
  const y0 = Math.max(0, Math.min(H - VIEW, Math.round(faceY - VIEW / 2), top - 2));
  return { x0: (W - VIEW) / 2, y0, size: VIEW };
}

// the portrait frame's backdrop: the person's pastel at the top, fading into the UI cream at the bottom
export const CREAM = '#FFFBF0';
export function backdrop(ctx, id, size) {
  const g = ctx.createLinearGradient(0, 0, 0, size); g.addColorStop(0, CAST[id].bg); g.addColorStop(1, CREAM);
  ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);
}

export function paint(ctx, { w, h, px }, scale = 1, ox = 0, oy = 0) {
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const v = px[y * w + x]; if (!v) continue;
    ctx.fillStyle = rgb(v); ctx.fillRect(ox + x * scale, oy + y * scale, scale, scale);
  }
}

// A data URL for the dialogue frame: the backdrop plus the 48×48 window at ×4 (192 px). Cached per person and face.
const cache = new Map();
export function portraitURL(id, ex = 'neutral') {
  if (!CAST[id]) return null;
  if (!EXPRESSIONS.includes(ex)) ex = 'neutral';
  const key = id + ':' + ex;
  if (!cache.has(key)) {
    const size = VIEW * 4, c = document.createElement('canvas'); c.width = c.height = size;
    const x = c.getContext('2d'), f = frameOf(id);
    backdrop(x, id, size);
    paint(x, drawPortrait(id, ex), 4, -f.x0 * 4, -f.y0 * 4);
    cache.set(key, c.toDataURL());
  }
  return cache.get(key);
}
