// The walkable Baotu park: one screen, 30×17 tiles. Builds the map from content/baotu-map.js,
// moves the player with WASD/arrows, blocks water/walls/people, and reports who is in reach.
import Phaser from 'phaser';
import { preloadManifest, preloadImages, buildTextures } from './assets.js';
import { SOLID, OBJECT_SIZE, TILE, DIRS } from './draw.js';
import { isHeld, takePressed } from './input.js';

const SPEED = 72;            // px per second at native resolution
const REACH = 26;            // px from your feet to someone's feet (or a sign) to talk
const FEET = { w: 10, h: 5 };

export class BaotuScene extends Phaser.Scene {
  constructor(hooks) { super('baotu'); this.hooks = hooks; }

  preload() {
    preloadManifest(this);
    this.load.on('filecomplete-json-manifest', () => {
      preloadImages(this);
      const m = this.cache.json.get('manifest');
      for (const [id, p] of Object.entries(m.people)) if (p.portrait) this.load.image('portrait.' + id, import.meta.env.BASE_URL + 'assets/' + p.portrait);
    });
  }

  create() {
    buildTextures(this);
    const map = this.hooks.map;
    this.map = map;
    this.cols = map.rows[0].length; this.rowsN = map.rows.length;
    this.solid = map.rows.map((row) => [...row].map((ch) => SOLID.has(map.legend[ch])));
    this.boxes = [];   // extra solid rectangles: objects and people

    // tiles
    const water = [];
    map.rows.forEach((row, y) => [...row].forEach((ch, x) => {
      let t = map.legend[ch] || 'grass';
      if (t === 'grass') t = (x * 7 + y * 13) % 5 === 0 ? 'grass_b' : 'grass_a';
      if (t === 'water') { t = 'water_a'; water.push([x, y]); }
      if (t === 'tree' || t === 'willow' || t === 'flowers') this.add.image(x * TILE, y * TILE, 'tile.grass_a').setOrigin(0);
      this.add.image(x * TILE, y * TILE, 'tile.' + t).setOrigin(0).setDepth(t === 'tree' || t === 'willow' ? (y + 1) * TILE : 0);
    }));
    const ripples = water.map(([x, y]) => this.add.image(x * TILE, y * TILE, 'tile.water_b').setOrigin(0).setVisible(false));
    this.time.addEvent({ delay: 700, loop: true, callback: () => { this.flip = !this.flip; ripples.forEach((w) => w.setVisible(this.flip)); } });

    // objects
    this.signs = [];
    for (const o of map.objects) {
      const key = o.type === 'spring' ? 'spring_a' : o.type;
      const [w, h] = OBJECT_SIZE[key] || [16, 16];
      const n = o.repeat || 1;
      for (let i = 0; i < n; i++) {
        const img = this.add.image(o.x * TILE + i * w, o.y * TILE, 'obj.' + key).setOrigin(o.type === 'spring' ? 0.5 : 0, o.type === 'spring' ? 0.5 : 0);
        img.setDepth(o.type === 'spring' || o.type === 'railing' ? 1 : o.y * TILE + h);
        if (o.type === 'spring') this.time.addEvent({ delay: 380, loop: true, callback: () => img.setTexture(img.texture.key === 'obj.spring_a' ? 'obj.spring_b' : 'obj.spring_a') });
      }
      if (o.solid) this.boxes.push({ x: o.x * TILE + 1, y: o.y * TILE + (o.h ? 6 : h - 6), w: (o.w || 1) * TILE - 2, h: o.h ? o.h * TILE - 6 : 6 });
      if (o.sign) this.signs.push({ kind: 'sign', id: o.sign, sign: map.signs[o.sign], x: o.x * TILE + 8, y: o.y * TILE + 14 });
    }

    // people
    this.npcs = map.npcs.map((n) => {
      const s = this.add.sprite(n.x * TILE, n.y * TILE, 'person.' + n.id, DIRS.indexOf(n.face || 'down') * 4).setOrigin(0.5, 1);
      s.setDepth(n.behind ? 0.5 : n.y * TILE);   // a clerk behind a counter is drawn under it
      const npc = { kind: 'npc', ...n, sprite: s, x: n.x * TILE, y: n.y * TILE };
      if (!n.behind) this.boxes.push({ x: npc.x - 6, y: npc.y - 6, w: 12, h: 6 });
      if (n.taichi) this.time.addEvent({ delay: 1300 + Math.random() * 400, loop: true, callback: () => { npc.pose = (npc.pose + 1 || 1) % 4; s.setFrame([0, 4, 0, 8][npc.pose] + (npc.pose % 2)); } });
      return npc;
    });

    // player
    const st = map.start;
    this.player = this.add.sprite(st.x * TILE, st.y * TILE, 'person.player', DIRS.indexOf(st.face || 'down') * 4).setOrigin(0.5, 1);
    this.face = st.face || 'down'; this.walk = 0;

    // marker over whoever the current beat is about
    this.marker = this.add.image(0, 0, 'obj.marker').setOrigin(0.5, 1).setDepth(10000);
    this.tweens.add({ targets: this.marker, y: '-=3', duration: 450, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    this.setBeat(this.hooks.getBeat());

    this.near = null;
    this.hooks.onReady && this.hooks.onReady(this);
  }

  setBeat(beat) {
    const place = this.map.beatPlaces[beat];
    const npc = place && this.npcs && this.npcs.find((n) => n.id === place.npc);
    if (!npc) { this.marker.setVisible(false); return; }
    this.tweens.killTweensOf(this.marker);
    this.marker.setVisible(true).setPosition(npc.x, npc.y - (npc.behind ? 32 : 26));
    this.tweens.add({ targets: this.marker, y: '-=3', duration: 450, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  }

  hits(px, py) {
    const l = px - FEET.w / 2, r = px + FEET.w / 2, t = py - FEET.h, b = py;
    if (l < 0 || t < 0 || r > this.cols * TILE || b > this.rowsN * TILE) return true;
    for (const [cx, cy] of [[l, t], [r - 0.01, t], [l, b - 0.01], [r - 0.01, b - 0.01]]) {
      const row = this.solid[Math.floor(cy / TILE)]; if (row && row[Math.floor(cx / TILE)]) return true;
    }
    return this.boxes.some((o) => l < o.x + o.w && r > o.x && t < o.y + o.h && b > o.y);
  }

  update(_, dtMs) {
    const dt = Math.min(dtMs, 50) / 1000;
    let vx = (isHeld('right') ? 1 : 0) - (isHeld('left') ? 1 : 0);
    let vy = (isHeld('down') ? 1 : 0) - (isHeld('up') ? 1 : 0);
    const p = this.player;
    if (vx || vy) {
      const len = Math.hypot(vx, vy); vx = (vx / len) * SPEED * dt; vy = (vy / len) * SPEED * dt;
      this.face = Math.abs(vx) > Math.abs(vy) ? (vx > 0 ? 'right' : 'left') : (vy > 0 ? 'down' : 'up');
      if (!this.hits(p.x + vx, p.y)) p.x += vx;
      if (!this.hits(p.x, p.y + vy)) p.y += vy;
      this.walk += SPEED * dt;
      p.setFrame(DIRS.indexOf(this.face) * 4 + (Math.floor(this.walk / 6) % 4));
    } else {
      p.setFrame(DIRS.indexOf(this.face) * 4);
    }
    p.setDepth(p.y);

    // who's in reach? the closest person or sign, preferring what you're facing
    let best = null, bestD = REACH;
    for (const t of [...this.npcs, ...this.signs]) {
      const d = Math.hypot(t.x - p.x, t.y - p.y);
      const facing = (this.face === 'up' && t.y < p.y) || (this.face === 'down' && t.y > p.y) || (this.face === 'left' && t.x < p.x) || (this.face === 'right' && t.x > p.x);
      const score = d - (facing ? 6 : 0);
      if (score < bestD) { best = t; bestD = score; }
    }
    if (best !== this.near) { this.near = best; this.hooks.onNear(best); }

    for (const k of takePressed()) if (k === 'act' && this.near) {
      if (this.near.kind === 'npc' && !this.near.taichi) this.near.sprite.setFrame(DIRS.indexOf(faceToward(this.near, p)) * 4);
      this.hooks.onInteract(this.near);
    }
  }

  portraitKey(id) { return this.textures.exists('portrait.' + id) ? 'portrait.' + id : null; }
}

const faceToward = (from, to) => (Math.abs(to.x - from.x) > Math.abs(to.y - from.y) ? (to.x > from.x ? 'right' : 'left') : (to.y > from.y ? 'down' : 'up'));
