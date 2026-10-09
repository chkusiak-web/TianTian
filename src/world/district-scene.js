// The district as a scene map (CONCEPT §3.2): a board with clickable places, and one still scene per place
// with the people in it. No walking. Phaser only draws; the clickable areas are HTML buttons (ui/hud.js),
// so they work with the keyboard and screen readers. Placeholder art comes from the visual thread's mockup.
import Phaser from 'phaser';
import { preloadManifest, preloadImages, buildTextures } from './assets.js';
import { OBJECT_SIZE } from './draw.js';
import { drawCast, CAST_H } from './people.js';
import { layers } from './art/baotu-district.js';

export const W = 480, H = 270;
const zoomOf = (p) => p.zoom || 3;   // a scene shows a (480/zoom)×(270/zoom) window of the mockup, scaled up

function crop(src, x, y, w, h, scale) {
  const c = document.createElement('canvas'); c.width = w * scale; c.height = h * scale;
  const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
  for (const l of src) g.drawImage(l, x, y, w, h, 0, 0, w * scale, h * scale);
  return c;
}

export class DistrictScene extends Phaser.Scene {
  constructor(hooks) { super('district'); this.hooks = hooks; }

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
    const d = this.d = this.hooks.district;
    const b = d.board, still = layers({ movers: false });
    this.textures.addCanvas('board', crop(layers(), b.x, b.y, b.w, b.h, 1));
    for (const p of d.places) { const z = zoomOf(p); this.textures.addCanvas('scene.' + p.id, crop(still, p.view.x, p.view.y, W / z, H / z, z)); }
    // one sprite per person per zoom (and an arms-out pose for tai chi), from the manifest looks
    const looks = this.cache.json.get('manifest').people;
    this.castKey = (id, z, pose = 0) => {
      const key = `cast.${id}.${z}.${pose}`;
      if (!this.textures.exists(key)) this.textures.addCanvas(key, drawCast((looks[id] || {}).look, z, pose));
      return key;
    };
    this.objs = []; this.timers = []; this.targets = [];
    this.beat = this.hooks.getBeat();
    this.showBoard();
    this.hooks.onReady && this.hooks.onReady(this);
  }

  clear() {
    this.objs.forEach((o) => o.destroy()); this.timers.forEach((t) => t.remove());
    this.objs = []; this.timers = []; this.targets = [];
  }
  onBoard(mx, my) { return { x: mx - this.d.board.x, y: my - this.d.board.y }; }
  onScene(p, mx, my) { const z = zoomOf(p); return { x: (mx - p.view.x) * z, y: (my - p.view.y) * z }; }

  showBoard() {
    this.clear(); this.view = 'board'; this.place = null;
    this.objs.push(this.add.image(0, 0, 'board').setOrigin(0));
    // the cast stands where you'll find them, as 1× figures
    for (const p of this.d.places) for (const n of p.people) {
      const a = this.onBoard(n.x, n.y);
      this.objs.push(this.add.image(a.x, a.y, this.castKey(n.id, 1)).setOrigin(0.5, 1).setDepth(n.behind ? 0.5 : a.y));
    }
    for (const p of this.d.places) {
      const a = this.onBoard(p.hot.x, p.hot.y);
      this.targets.push({ kind: 'place', id: p.id, tag: p.tag, en: p.en, box: { x: a.x, y: a.y, w: p.hot.w, h: p.hot.h }, pin: this.onBoard(p.pin.x, p.pin.y) });
    }
    this.hooks.onView(this);
  }

  openPlace(id) {
    const p = this.d.places.find((q) => q.id === id); if (!p) return;
    this.clear(); this.view = 'place'; this.place = p;
    this.objs.push(this.add.image(0, 0, 'scene.' + p.id).setOrigin(0));
    for (const o of p.objects) {
      const a = this.onScene(p, o.x, o.y), [w, h] = OBJECT_SIZE[o.type] || [16, 16];
      this.objs.push(this.add.image(a.x, a.y, 'obj.' + o.type).setOrigin(0.5, 1).setDepth(a.y));
      if (o.sign) this.targets.push({ kind: 'sign', id: o.sign, sign: this.d.signs[o.sign], box: { x: a.x - w / 2 - 4, y: a.y - h - 4, w: w + 8, h: h + 8 } });
    }
    for (const n of p.people) {
      const a = this.onScene(p, n.x, n.y), z = zoomOf(p);
      const s = this.add.image(a.x, a.y, this.castKey(n.id, z)).setOrigin(0.5, 1).setScale(z);
      s.setDepth(n.behind ? 0.5 : a.y);   // a clerk behind a counter is drawn under it
      this.objs.push(s);
      const h = (n.kid ? CAST_H[z] * 0.8 : CAST_H[z]) * z, w = Math.max(18, h * 0.5);
      const t = { kind: 'npc', ...n, x: a.x, y: a.y, top: a.y - h, sprite: s, box: { x: a.x - w / 2, y: a.y - h - 2, w, h: h + 4 } };
      if (n.taichi) this.timers.push(this.time.addEvent({ delay: 1300 + Math.random() * 400, loop: true, callback: () => { t.pose = t.pose ? 0 : 1; s.setTexture(this.castKey(n.id, z, t.pose)); } }));
      this.targets.push(t);
    }
    this.hooks.onView(this);
  }

  // today's beat: the HUD draws its pin gold (board) and its person's tag gold (place)
  setBeat(beat) { this.beat = beat; if (this.view) this.hooks.onView(this); }
  get now() { return this.d.beatPlaces[this.beat] || null; }

  // the person turns to face you when you talk to them
  faceYou() {}   // people are drawn facing you
  portraitKey(id) { return this.textures.exists('portrait.' + id) ? 'portrait.' + id : null; }
}
