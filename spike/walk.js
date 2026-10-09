// SPIKE (throwaway): walk around the visual thread's Baotu district mockup, to feel the scale before locking the design.
// The mockup is ~1 px per metre with 4×8 px people. Zoom ×6 puts a person at 24×48 on a 960×540 screen,
// the same character-to-screen ratio VISUAL-LANGUAGE.md asks for (32×48 people at 960×540).
import Phaser from 'phaser';
import { W, H, T, BR, L, K, drawn, solid, POOL, PONDS, make, CROP } from './mockup.js';

const ZOOMS = { Digit1: 3, Digit2: 4, Digit3: 6, Digit4: 8 };
const BLOCK = new Set([4, 5, 9]); // water, stone rim, balustrade
const walkable = (x, y) => {
  x = Math.floor(x); y = Math.floor(y);
  if (x < CROP.x || y < CROP.y || x >= CROP.x + CROP.w || y >= CROP.y + CROP.h) return false;
  const i = y * W + x;
  if (BR[i]) return true;            // bridges
  return !BLOCK.has(T[i]) && !solid[i];
};
const PLACES = [{ n: '趵突泉', x: (POOL.x0 + POOL.x1) / 2, y: (POOL.y0 + POOL.y1) / 2 },
  ...PONDS.map((p) => ({ n: p.n, x: p.P.reduce((a, q) => a + q[0], 0) / p.P.length, y: p.P.reduce((a, q) => a + q[1], 0) / p.P.length })),
  { n: '泉标', x: 546, y: 320 }];

// the player: same 4×8 person as the mockup, gold shirt so you can find yourself
const me = make(4, 8, ({ R }) => { R(1, 0, 2, 2, K.skin); R(0, 2, 4, 3, K.gold); R(1, 5, 1, 3, K.win); R(2, 5, 1, 3, K.win); });

class Walk extends Phaser.Scene {
  create() {
    const bg = document.createElement('canvas'); bg.width = W; bg.height = H;
    const g = bg.getContext('2d');
    for (const k of ['ground', 'water', 'ripples', 'boats', 'bridges', 'movers']) g.drawImage(L[k], 0, 0);
    this.textures.addCanvas('bg', bg);
    this.add.image(0, 0, 'bg').setOrigin(0).setDepth(-1);
    // every placed sprite is its own image, depth-sorted by its bottom edge, so you can walk behind things
    const keys = new Map();
    for (const d of drawn) {
      if (!keys.has(d.sp)) { const k = 's' + keys.size; keys.set(d.sp, k); this.textures.addCanvas(k, d.sp); }
      this.add.image(d.x, d.y, keys.get(d.sp)).setOrigin(0).setDepth(d.b);
    }
    this.textures.addCanvas('me', me);
    let sx = 362, sy = 466; // inside the south gate, on the main path
    for (let r = 0; r < 30 && !walkable(sx, sy); r++) sy--;
    this.me = this.add.image(sx, sy, 'me').setOrigin(0.5, 1);
    this.pos = { x: sx, y: sy };
    const cam = this.cameras.main;
    cam.setBounds(CROP.x, CROP.y, CROP.w, CROP.h).setRoundPixels(true);
    cam.startFollow(this.me, true, 0.2, 0.2);
    this.setZoom(6);
    this.keys = this.input.keyboard.addKeys('UP,DOWN,LEFT,RIGHT,W,A,S,D,SHIFT');
    this.input.keyboard.on('keydown', (e) => { if (ZOOMS[e.code]) this.setZoom(ZOOMS[e.code]); });
    window.__spike = this; // for the screenshot test
  }
  setZoom(z) { this.cameras.main.setZoom(z); document.getElementById('z').textContent = `zoom ×${z} (person ${4 * z}×${8 * z} px)`; }
  update(_, dt) {
    const k = this.keys;
    let dx = (k.RIGHT.isDown || k.D.isDown) - (k.LEFT.isDown || k.A.isDown);
    let dy = (k.DOWN.isDown || k.S.isDown) - (k.UP.isDown || k.W.isDown);
    if (dx && dy) { dx *= Math.SQRT1_2; dy *= Math.SQRT1_2; }
    const v = (k.SHIFT.isDown ? 60 : 24) * dt / 1000; // map px (≈ m) per second
    const p = this.pos, ok = (x, y) => walkable(x - 1.5, y - 1) && walkable(x + 1.5, y - 1);
    if (dx && ok(p.x + dx * v, p.y)) p.x += dx * v;
    if (dy && ok(p.x, p.y + dy * v)) p.y += dy * v;
    this.me.setPosition(Math.round(p.x), Math.round(p.y)).setDepth(p.y);
    if (dx < 0) this.me.setFlipX(true); else if (dx > 0) this.me.setFlipX(false);
    const near = PLACES.find((q) => Math.hypot(q.x - p.x, q.y - p.y) < 28);
    const el = document.getElementById('place');
    el.style.display = near ? 'block' : 'none'; if (near) el.textContent = near.n;
  }
}

new Phaser.Game({
  type: Phaser.CANVAS, parent: 'game', width: 960, height: 540,
  pixelArt: true, roundPixels: true, antialias: false, backgroundColor: '#F4EACA',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [Walk]
});
