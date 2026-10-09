import { describe, it, expect } from 'vitest';
import { numToMarks } from '../../src/lexicon.js';
import { toneVariants } from '../../src/session/drills.js';

describe('tone marks', () => {
  it('drops the neutral-tone number instead of showing it', () => {
    expect(numToMarks('xie4 xie5')).toBe('xiè xie');
    expect(numToMarks('bei1 zi5')).toBe('bēi zi');
    expect(numToMarks('ni3 hao3')).toBe('nǐ hǎo');
  });
  it('gives three other tone patterns for a two-syllable word with a neutral tone', () => {
    const vs = toneVariants('xie4 xie5', 3, Math.random);
    expect(vs).toHaveLength(3);
    for (const v of vs) { expect(v).not.toBe('xie4 xie5'); expect(v.endsWith('xie5')).toBe(true); }
  });
});
