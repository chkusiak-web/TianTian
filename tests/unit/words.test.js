import { describe, it, expect, beforeEach } from 'vitest';
import { stateOf, catchWord, markSeen, addCtx } from '../../src/core/words.js';
import { grade } from '../../src/core/srs.js';
import { setOffsetDays } from '../../src/core/clock.js';
import { defaultSave } from '../../src/save/schema.js';

let S;
beforeEach(() => { setOffsetDays(0); S = defaultSave(); });

describe('word states (§6.5)', () => {
  it('unseen → seen → caught', () => {
    expect(stateOf(S, '5')).toBe('unseen');
    markSeen(S, ['5']); expect(stateOf(S, '5')).toBe('seen');
    expect(catchWord(S, '5')).toBe(true); expect(stateOf(S, '5')).toBe('caught');
    expect(catchWord(S, '5')).toBe(false);
  });
  it('mastered at a 21+ day interval, but not when more than 7 days overdue', () => {
    catchWord(S, '7'); S.words['7'].ivl = 21; S.words['7'].due = Date.now() + 1000;
    expect(stateOf(S, '7')).toBe('mastered');
    setOffsetDays(8.1); expect(stateOf(S, '7')).toBe('caught');
  });
  it('a miss in review lapses the word until it is refreshed', () => {
    catchWord(S, '9'); grade(S, '9', false);
    expect(stateOf(S, '9')).toBe('lapsed');
    grade(S, '9', true); expect(stateOf(S, '9')).toBe('caught');
  });
  it('keeps up to 3 context sentences, newest first, no repeats', () => {
    for (const z of ['一', '二', '三', '二', '四']) addCtx(S, '1', z, 'x');
    expect(S.ctx['1'].map((c) => c.zh)).toEqual(['四', '三', '二']);
  });
});
