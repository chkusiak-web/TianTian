import { describe, it, expect, beforeEach } from 'vitest';
import { learnWord, grade, dueIds, mastery, overdueDays } from '../../src/core/srs.js';
import { setOffsetDays, DAY } from '../../src/core/clock.js';
import { defaultSave } from '../../src/save/schema.js';

let S;
beforeEach(() => { setOffsetDays(0); S = defaultSave(); });

describe('SRS (天天 rules)', () => {
  it('learnWord creates a record once, due in about a day', () => {
    expect(learnWord(S, '5')).toBe(true);
    expect(learnWord(S, '5')).toBe(false);
    const w = S.words['5'];
    expect(w).toMatchObject({ reps: 1, ease: 2.5, ivl: 1, lapses: 0, ok: 0, bad: 0 });
    expect(w.due - Date.now()).toBeGreaterThan(DAY - 3700000);
    expect(w.due - Date.now()).toBeLessThanOrEqual(DAY);
  });
  it('a right answer: 3 days on the first review, then ease-scaled, and never shorter', () => {
    learnWord(S, '1');
    grade(S, '1', true); expect(S.words['1'].ivl).toBe(3);                       // reps 2 → 3 days
    grade(S, '1', true); expect(S.words['1'].ivl).toBe(Math.round(3 * 2.55));    // reps 3 → ivl × ease (2.5 + 0.05)
    const before = S.words['1'].ivl;
    grade(S, '1', true); expect(S.words['1'].ivl).toBeGreaterThanOrEqual(before);
    expect(S.words['1'].ease).toBeLessThanOrEqual(3);
  });
  it('a miss lapses the word: interval 0, ease down (floor 1.3), due in 10 minutes', () => {
    learnWord(S, '2');
    for (let i = 0; i < 12; i++) grade(S, '2', false);
    const w = S.words['2'];
    expect(w.ivl).toBe(0); expect(w.reps).toBe(0); expect(w.lapses).toBe(12); expect(w.ease).toBeCloseTo(1.3);
    expect(w.due - Date.now()).toBeLessThanOrEqual(10 * 60000);
  });
  it('mastery bands follow the interval', () => {
    learnWord(S, '3');
    for (const [ivl, m] of [[0, 0], [1, 1], [3, 2], [7, 3], [21, 4], [60, 5]]) { S.words['3'].ivl = ivl; expect(mastery(S, '3')).toBe(m); }
    expect(mastery(S, 'nope')).toBe(0);
  });
  it('words become due when the clock moves forward', () => {
    learnWord(S, '4'); learnWord(S, '9');
    expect(dueIds(S)).toEqual([]);
    setOffsetDays(2);
    expect(dueIds(S).sort()).toEqual(['4', '9']);
    expect(overdueDays(S, '4')).toBeGreaterThan(0.9);
  });
});
