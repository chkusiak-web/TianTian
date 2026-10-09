import { describe, it, expect } from 'vitest';
import d from '../../content/baotu-places.js';

const inside = (r, x, y) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;

describe('Baotu scene map data', () => {
  it('has five places, each clickable on the board and with a view inside the mockup at its zoom', () => {
    expect(d.places).toHaveLength(5);
    for (const p of d.places) {
      const h = p.hot;
      expect(inside(d.board, h.x, h.y) && inside(d.board, h.x + h.w, h.y + h.h), p.id).toBe(true);
      const z = p.zoom || 3;
      expect([2, 3]).toContain(z);
      expect(p.view.x >= 0 && p.view.y >= 0 && p.view.x + 480 / z <= 640 && p.view.y + 270 / z <= 580, p.id).toBe(true);
    }
  });
  it('puts every person and object inside their scene', () => {
    for (const p of d.places) for (const n of [...p.people, ...p.objects]) {
      expect(inside({ x: p.view.x, y: p.view.y, w: 480 / (p.zoom || 3), h: 270 / (p.zoom || 3) }, n.x, n.y), `${p.id}:${n.id || n.type}`).toBe(true);
    }
  });
  it('has a place and a person for every beat, and the §5.1 cast is all there', () => {
    expect(d.beatPlaces).toHaveLength(6);
    for (const b of d.beatPlaces) {
      const p = d.places.find((q) => q.id === b.place);
      expect(p, b.place).toBeTruthy();
      expect(p.people.some((n) => n.id === b.npc), b.npc).toBe(true);
    }
    const ids = new Set(d.places.flatMap((p) => p.people.map((n) => n.id)));
    for (const id of ['wang', 'zhang', 'chen', 'xie', 'lele']) expect(ids.has(id)).toBe(true);
  });
  it('every sign an object points at exists', () => {
    for (const p of d.places) for (const o of p.objects) if (o.sign) expect(d.signs[o.sign], o.sign).toBeTruthy();
  });
});
