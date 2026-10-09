import { describe, it, expect } from 'vitest';
import map from '../../content/baotu-map.js';

const SOLID = new Set(['water', 'lotus', 'wall', 'roof', 'tree', 'willow']);
const tileAt = (x, y) => map.legend[map.rows[Math.floor(y)][Math.floor(x)]];

describe('Baotu map data', () => {
  it('is one screen: 30×17 tiles, every char in the legend', () => {
    expect(map.rows).toHaveLength(17);
    for (const r of map.rows) { expect(r).toHaveLength(30); for (const ch of r) expect(map.legend[ch], `"${ch}"`).toBeTruthy(); }
  });
  it('has the five gates the signs talk about', () => {
    const open = (x, y) => tileAt(x, y) === 'path';
    expect(open(14, 0)).toBe(true);   // 北门
    expect(open(14, 16)).toBe(true);  // 南门
    expect(open(0, 8)).toBe(true);    // 西门
    expect(open(29, 8)).toBe(true);   // 东门
    expect(open(3, 0)).toBe(true);    // 四号门
  });
  it('puts the start and every person on walkable ground (clerks may stand behind their counter)', () => {
    expect(SOLID.has(tileAt(map.start.x, map.start.y - 0.1))).toBe(false);
    for (const n of map.npcs) if (!n.behind) expect(SOLID.has(tileAt(n.x, n.y - 0.1)), n.id).toBe(false);
  });
  it('has a cast member for every beat, and the §5.1 cast is all there', () => {
    const ids = new Set(map.npcs.map((n) => n.id));
    expect(map.beatPlaces).toHaveLength(6);
    for (const b of map.beatPlaces) expect(ids.has(b.npc), b.npc).toBe(true);
    for (const id of ['wang', 'zhang', 'chen', 'xie', 'lele']) expect(ids.has(id)).toBe(true);
  });
  it('has the park signs from §5.1', () => {
    const zh = map.labels.map((l) => l.zh);
    for (const s of ['东门', '西门', '南门', '北门', '四号门 → 左边']) expect(zh).toContain(s);
  });
});
