import { describe, it, expect } from 'vitest';
import { buildLearnQueue, toneVariants, requeue, distractors } from '../../src/session/drills.js';

const W = [
  { id: '1', h: '杯子', p: 'bēi zi', n: 'bei1 zi5', m: 'cup' },
  { id: '2', h: '孩子', p: 'hái zi', n: 'hai2 zi5', m: 'child' },
  { id: '3', h: '白', p: 'bái', n: 'bai2', m: 'white' },
  { id: '4', h: '一', p: 'yī', n: 'yi1', m: 'one' },
  { id: '5', h: '没有', p: 'méi yǒu', n: 'mei2 you3', m: 'not have' }
];
let seed = 1; const rng = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

describe('Learn drills', () => {
  it('introduces every word before drilling it, in chunks of 4', () => {
    const q = buildLearnQueue(W, { rng });
    const firstDrill = (id) => q.findIndex((x) => x.t !== 'intro' && x.w.id === id);
    const intro = (id) => q.findIndex((x) => x.t === 'intro' && x.w.id === id);
    for (const w of W) { expect(intro(w.id)).toBeGreaterThanOrEqual(0); expect(intro(w.id)).toBeLessThan(firstDrill(w.id)); }
    expect(q.slice(0, 4).every((x) => x.t === 'intro')).toBe(true);
  });
  it('gives every word a meaning and a listening drill with the right answer among 3 options', () => {
    const q = buildLearnQueue(W, { rng });
    for (const w of W) for (const t of ['pick', 'hear']) {
      const d = q.find((x) => x.t === t && x.w.id === w.id);
      expect(d.options).toHaveLength(3);
      expect(d.options.map((o) => o.id)).toContain(w.id);
      expect(new Set(d.options.map((o) => (t === 'pick' ? o.m : o.h))).size).toBe(3);
    }
  });
  it('traces at most 2 single characters', () => {
    const q = buildLearnQueue(W, { rng });
    const tr = q.filter((x) => x.t === 'trace');
    expect(tr.length).toBeLessThanOrEqual(2);
    tr.forEach((x) => expect([...x.w.h]).toHaveLength(1));
  });
  it('tone options differ only in tones and include the right one', () => {
    const vs = toneVariants('bei1 zi5', 2, rng);
    expect(vs.length).toBe(2);
    vs.forEach((v) => { expect(v).not.toBe('bei1 zi5'); expect(v.replace(/\d/g, '')).toBe('bei zi'); expect(v.endsWith('zi5')).toBe(true); });
  });
  it('a missed item comes back two items later', () => {
    const q = ['a', 'b', 'c', 'd'].map((x) => ({ x }));
    requeue(q, 0, q[0]);
    expect(q.map((i) => i.x)).toEqual(['a', 'b', 'c', 'a', 'd']);
    expect(q[3].retry).toBe(true);
  });
  it('distractors never repeat the answer', () => {
    for (let i = 0; i < 20; i++) expect(distractors(W[0], W, 2, 'm', rng).map((w) => w.m)).not.toContain('cup');
  });
});
