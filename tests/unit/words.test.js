import { describe, it, expect, beforeEach } from 'vitest';
import { defaultSave } from '../../src/save/schema.js';
import { stateOf, answeredRight, answeredWrong, refreshMark, pendingIds, addCtx, markSeen } from '../../src/core/words.js';
import { setOffsetDays } from '../../src/core/clock.js';
import { dueIds } from '../../src/core/srs.js';

let S;
beforeEach(() => { S = defaultSave(); setOffsetDays(0); });

describe('word states (§6.5)', () => {
  it('unseen → seen → caught', () => {
    expect(stateOf(S, '7')).toBe('unseen');
    markSeen(S, '7'); expect(stateOf(S, '7')).toBe('seen');
    expect(answeredRight(S, '7')).toBe('caught'); expect(stateOf(S, '7')).toBe('caught');
    expect(answeredRight(S, '7')).toBe(null);   // already caught: nothing changes
  });
  it('a miss before catching waits in Refresh, and a right answer there catches it', () => {
    answeredWrong(S, '9');
    expect(stateOf(S, '9')).toBe('seen'); expect(pendingIds(S)).toEqual(['9']);
    expect(refreshMark(S, '9', false)).toBe('pending'); expect(pendingIds(S)).toEqual(['9']);
    expect(refreshMark(S, '9', true)).toBe('caught'); expect(pendingIds(S)).toEqual([]); expect(stateOf(S, '9')).toBe('caught');
  });
  it('a caught word missed in Refresh is lapsed; mastered needs a 21-day interval', () => {
    answeredRight(S, '3');
    refreshMark(S, '3', false); expect(stateOf(S, '3')).toBe('lapsed');
    S.words['3'].reps = 5; S.words['3'].ivl = 30; S.words['3'].due = Date.now() + 1e9; expect(stateOf(S, '3')).toBe('mastered');
  });
  it('a caught word is due the next day', () => {
    answeredRight(S, '4'); expect(dueIds(S)).toEqual([]);
    setOffsetDays(1); expect(dueIds(S)).toEqual(['4']);
  });
  it('keeps three context sentences, newest first, no repeats', () => {
    ['a1', 'a2', 'a2', 'a3', 'a4'].forEach((z) => addCtx(S, '5', z, ''));
    expect(S.ctx['5'].map((c) => c.zh)).toEqual(['a4', 'a3', 'a2']);
  });
});
