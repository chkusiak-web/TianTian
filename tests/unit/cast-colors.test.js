import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { kitLook } from '../../src/world/people.js';

// people must stand out from the park: no green clothes or hair (Moondog, Oct 9)
const hue = (hex) => {
  const n = parseInt(hex.slice(1), 16), r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  if (!d) return { h: 0, s: 0 };
  const h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: (h * 60 + 360) % 360, s: d / (1 - Math.abs(mx + mn - 1)) };
};
const green = (hex) => { const { h, s } = hue(hex); return s > 0.2 && h >= 65 && h <= 165; };

describe('cast colors', () => {
  const people = JSON.parse(fs.readFileSync('public/assets/manifest.json', 'utf8')).people;
  for (const [id, p] of Object.entries(people)) it(`${id} wears no green`, () => {
    const k = kitLook(p.look || {});
    for (const c of [k.hair, k.top, k.bottom, k.cap]) expect(green(c), `${id}: ${c}`).toBe(false);
  });
});
